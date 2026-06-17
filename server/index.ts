import "dotenv/config";
// ENV validation runs on import — exits process if required vars are missing
import { ENV } from "./_core/env";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { createServer } from "http";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./_core/context";
import { serveStatic, setupVite } from "./_core/vite";
import { handleStripeWebhook } from "./stripe/webhook";
import { handleDailyWebhook } from "./daily/webhook";
import { apiLimiter, authLimiter, uploadLimiter } from "./middleware/rateLimiter";
import { requireAuth, requireProviderAuth, requireCronSecret } from "./middleware/auth";
import { closeDb } from "./db";
import { startCronScheduler } from "./jobs/cronScheduler";
import multer from "multer";
import { storagePut } from "./storage";
import { generateSitemap } from "./sitemap";
import { getProviderOgData, renderProviderOgImage } from "./lib/ogImage";
import { verifyJwt } from "./_core/jwt";
import { runAllReminders } from "./jobs/reminders";
import { runEventReminders } from "./jobs/eventReminders";
import { expireRecordings } from "./jobs/expireRecordings";
import { generateVisitNotePdf } from "./lib/pdfGenerator";
import { generateHealthSummaryPdf } from "./lib/healthSummaryPdf";
import { generateHealthRecordsPdf } from "./lib/healthRecordsPdf";
import { generatePayoutHistoryCsv } from "./lib/payoutHistoryCsv";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // ─── Security headers ────────────────────────────────────────────────────────
  app.use(
    helmet({
      contentSecurityPolicy: ENV.NODE_ENV === "production",
      crossOriginEmbedderPolicy: false, // required for Daily.co video
    })
  );

  // ─── CORS ────────────────────────────────────────────────────────────────────
  const allowedOrigins = [
    ENV.VITE_APP_URL,
    "http://localhost:3000",
    "http://localhost:5173",
  ].filter(Boolean);

  app.use(
    cors({
      origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) {
          cb(null, true);
        } else {
          cb(new Error(`CORS: origin ${origin} not allowed`));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
  );

  // ─── Health check (no auth, no rate limit — for load balancers) ──────────────
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", ts: Date.now() });
  });

  // ─── Stripe webhook (must be before express.json()) ──────────────────────────
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    handleStripeWebhook
  );

  // ─── Daily.co webhook ────────────────────────────────────────────────────────
  app.post("/api/daily/webhook", express.json(), handleDailyWebhook);

  // ─── Body parsers ────────────────────────────────────────────────────────────
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // ─── Global API rate limiter ─────────────────────────────────────────────────
  app.use("/api", apiLimiter);

  // ─── robots.txt ──────────────────────────────────────────────────────────────
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(
      [
        "User-agent: *",
        "Allow: /",
        "Disallow: /dashboard/",
        "Disallow: /api/",
        "Disallow: /settings/",
        "",
        "Sitemap: https://www.qliniqit.com/sitemap.xml",
      ].join("\n")
    );
  });

  // ─── Sitemap ─────────────────────────────────────────────────────────────────
  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const xml = await generateSitemap();
      res
        .set("Content-Type", "application/xml; charset=utf-8")
        .set("Cache-Control", "public, max-age=3600")
        .send(xml);
    } catch (err) {
      console.error("[sitemap]", err);
      res.status(500).send("Sitemap generation failed");
    }
  });

  // ─── OG image (public, cached) ────────────────────────────────────────────────
  app.get("/api/og/provider/:slug", async (req, res) => {
    try {
      const data = await getProviderOgData(req.params.slug);
      if (!data) return res.status(404).send("Provider not found");
      const png = await renderProviderOgImage(data);
      res
        .set("Content-Type", "image/png")
        .set("Cache-Control", "public, max-age=3600, s-maxage=86400")
        .set("Content-Length", String(png.length))
        .send(png);
    } catch (err) {
      console.error("[og/provider]", err);
      res.status(500).send("OG image generation failed");
    }
  });

  // ─── One-click email unsubscribe (signed token, no login required) ───────────
  app.get("/api/unsubscribe", async (req, res) => {
    const token = req.query.token as string | undefined;
    if (!token) return res.status(400).send(unsubscribeHtml("invalid"));

    try {
      const payload = await verifyJwt(token);
      const userId = payload.userId as number | undefined;
      if (!userId) return res.status(400).send(unsubscribeHtml("invalid"));

      const { getDb } = await import("./db");
      const { notificationPreferences } = await import("../drizzle/schema");
      const { eq } = await import("drizzle-orm");
      const db = getDb();
      await db
        .update(notificationPreferences)
        .set({ remind24hOptOut: true, remind1hOptOut: true })
        .where(eq(notificationPreferences.userId, userId));

      console.log(`[unsubscribe] user ${userId} opted out`);
      return res.send(unsubscribeHtml("success"));
    } catch (err) {
      console.error("[unsubscribe]", err);
      return res.status(400).send(unsubscribeHtml("invalid"));
    }
  });

  // ─── File uploads (authenticated) ────────────────────────────────────────────
  const memStorage = multer({ storage: multer.memoryStorage(), limits: { fileSize: 16 * 1024 * 1024 } });
  const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
      const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      cb(null, allowed.includes(file.mimetype));
    },
  });

  app.post(
    "/api/upload/appointment-document",
    requireAuth,
    uploadLimiter,
    memStorage.single("file"),
    async (req: any, res) => {
      try {
        if (!req.file) return res.status(400).json({ error: "No file provided" });
        const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const ext = req.file.originalname.split(".").pop() ?? "bin";
        const fileKey = `appointment-docs/${suffix}.${ext}`;
        const { url } = await storagePut(fileKey, req.file.buffer, req.file.mimetype);
        return res.json({ fileUrl: url, fileKey });
      } catch (err) {
        console.error("[upload/appointment-document]", err);
        return res.status(500).json({ error: "Upload failed" });
      }
    }
  );

  app.post(
    "/api/upload/event-image",
    requireAuth, // was unauthenticated in original — fixed
    uploadLimiter,
    imageUpload.single("file"),
    async (req: any, res) => {
      try {
        if (!req.file) return res.status(400).json({ error: "No file provided" });
        const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const ext = req.file.originalname.split(".").pop() ?? "jpg";
        const fileKey = `event-images/${suffix}.${ext}`;
        const { url } = await storagePut(fileKey, req.file.buffer, req.file.mimetype);
        return res.json({ url, fileKey });
      } catch (err) {
        console.error("[upload/event-image]", err);
        return res.status(500).json({ error: "Upload failed" });
      }
    }
  );

  // ─── Visit note PDF (authenticated) ──────────────────────────────────────────
  app.get("/api/visit-notes/:id/pdf", requireAuth, async (req: any, res) => {
    try {
      const noteId = parseInt(req.params.id, 10);
      if (isNaN(noteId)) return res.status(400).json({ error: "Invalid note ID" });

      const pdf = await generateVisitNotePdf(noteId, req.authUser.id);
      res
        .set("Content-Type", "application/pdf")
        .set("Content-Disposition", `attachment; filename=visit-note-${noteId}.pdf`)
        .send(pdf);
    } catch (err: any) {
      if (err.message === "NOT_FOUND") return res.status(404).json({ error: "Note not found" });
      if (err.message === "FORBIDDEN") return res.status(403).json({ error: "Access denied" });
      console.error("[visit-notes/pdf]", err);
      res.status(500).json({ error: "PDF generation failed" });
    }
  });

  // ─── Health summary PDF (authenticated) ──────────────────────────────────────
  app.get("/api/patient/health-summary-pdf", requireAuth, async (req: any, res) => {
    try {
      const pdf = await generateHealthSummaryPdf(req.authUser.id);
      res
        .set("Content-Type", "application/pdf")
        .set("Content-Disposition", `attachment; filename=health-summary.pdf`)
        .send(pdf);
    } catch (err) {
      console.error("[health-summary-pdf]", err);
      res.status(500).json({ error: "PDF generation failed" });
    }
  });

  // ─── Health records PDF (authenticated) ──────────────────────────────────────
  app.get("/api/patient/health-records-pdf", requireAuth, async (req: any, res) => {
    try {
      const pdf = await generateHealthRecordsPdf(req.authUser.id);
      res
        .set("Content-Type", "application/pdf")
        .set(
          "Content-Disposition",
          `attachment; filename=health-records-${new Date().toISOString().slice(0, 10)}.pdf`
        )
        .send(pdf);
    } catch (err) {
      console.error("[health-records-pdf]", err);
      res.status(500).json({ error: "PDF generation failed" });
    }
  });

  // ─── Payout history CSV (provider only) ──────────────────────────────────────
  app.get("/api/provider/payout-history-csv", requireProviderAuth, async (req: any, res) => {
    try {
      const csv = await generatePayoutHistoryCsv(req.authUser.id);
      res
        .set("Content-Type", "text/csv")
        .set("Content-Disposition", `attachment; filename=payout-history.csv`)
        .send(csv);
    } catch (err) {
      console.error("[payout-history-csv]", err);
      res.status(500).json({ error: "CSV generation failed" });
    }
  });

  // ─── iCal feed (public — provider calendar) ───────────────────────────────────
  app.get("/api/ical/provider/:providerId", async (req, res) => {
    try {
      const providerId = parseInt(req.params.providerId, 10);
      if (isNaN(providerId)) return res.status(400).send("Invalid provider ID");
      const { generateProviderIcal } = await import("./lib/icalGenerator");
      const ical = await generateProviderIcal(providerId);
      res
        .set("Content-Type", "text/calendar; charset=utf-8")
        .set("Content-Disposition", `attachment; filename=qliniqit-provider-${providerId}.ics`)
        .send(ical);
    } catch (err) {
      console.error("[ical/provider]", err);
      res.status(500).send("iCal generation failed");
    }
  });

  // ─── Twilio inbound webhook (SMS opt-out) ─────────────────────────────────────
  app.post(
    "/api/twilio/inbound",
    express.urlencoded({ extended: false }),
    async (req, res) => {
      try {
        const { isStopMessage, isStartMessage } = await import("./lib/twilio");
        const body = req.body?.Body ?? "";
        const from = (req.body?.From ?? "").replace("whatsapp:", "");
        if (from && (isStopMessage(body) || isStartMessage(body))) {
          const { getDb } = await import("./db");
          const { users } = await import("../drizzle/schema");
          const { eq } = await import("drizzle-orm");
          const db = getDb();
          await db
            .update(users)
            .set({ smsOptedOut: isStopMessage(body) })
            .where(eq(users.phone, from));
        }
        res.set("Content-Type", "text/xml").send("<?xml version='1.0' encoding='UTF-8'?><Response></Response>");
      } catch (err) {
        console.error("[twilio/inbound]", err);
        res.set("Content-Type", "text/xml").send("<?xml version='1.0' encoding='UTF-8'?><Response></Response>");
      }
    }
  );

  // ─── Cron endpoints (secret-protected) ───────────────────────────────────────
  app.post("/api/cron/reminders", requireCronSecret, async (_req, res) => {
    try {
      const { sent24h, sent1h } = await runAllReminders();
      res.json({ ok: true, sent24h, sent1h });
    } catch (err: any) {
      console.error("[cron/reminders]", err);
      res.status(500).json({ error: err.message }); // NO stack trace
    }
  });

  app.post("/api/cron/expire-recordings", requireCronSecret, async (_req, res) => {
    try {
      const result = await expireRecordings();
      res.json({ ok: true, ...result });
    } catch (err: any) {
      console.error("[cron/expire-recordings]", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.post("/api/cron/event-reminders", requireCronSecret, async (_req, res) => {
    try {
      const result = await runEventReminders();
      res.json({ ok: true, ...result });
    } catch (err: any) {
      console.error("[cron/event-reminders]", err);
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/cron/status", requireCronSecret, async (_req, res) => {
    try {
      const { getDb } = await import("./db");
      const { cronLogs } = await import("../drizzle/schema");
      const { desc } = await import("drizzle-orm");
      const logs = await getDb()
        .select()
        .from(cronLogs)
        .orderBy(desc(cronLogs.ranAt))
        .limit(20);
      res.json({ ok: true, serverTime: new Date().toISOString(), recentLogs: logs });
    } catch (err: any) {
      console.error("[cron/status]", err);
      res.status(500).json({ error: err.message });
    }
  });

  // ─── tRPC ────────────────────────────────────────────────────────────────────
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
      onError: ({ error, path }) => {
        if (error.code === "INTERNAL_SERVER_ERROR") {
          console.error(`[tRPC] ${path}:`, error);
        }
      },
    })
  );

  // ─── Static / Vite ───────────────────────────────────────────────────────────
  if (ENV.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ─── Start ───────────────────────────────────────────────────────────────────
  const port = ENV.PORT;
  server.listen(port, () => {
    console.log(`✅ Server running on http://localhost:${port}/`);
    startCronScheduler();
  });

  // ─── Graceful shutdown ────────────────────────────────────────────────────────
  const shutdown = async (signal: string) => {
    console.log(`\n[shutdown] ${signal} received, closing server...`);
    server.close(async () => {
      await closeDb();
      console.log("[shutdown] Done.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
}

// ─── HTML helpers (keeps inline HTML out of handlers) ─────────────────────────

function unsubscribeHtml(state: "success" | "invalid"): string {
  const teal = "#0d9488";
  if (state === "invalid") {
    return `<!DOCTYPE html><html><body style="font-family:sans-serif;text-align:center;padding:60px"><h2>Invalid or expired unsubscribe link.</h2><p>Manage notification preferences from your <a href="/dashboard" style="color:${teal}">dashboard</a>.</p></body></html>`;
  }
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Unsubscribed — Qliniqit</title></head><body style="font-family:-apple-system,sans-serif;text-align:center;padding:80px 20px;background:#f8fafc"><div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;padding:48px 40px;box-shadow:0 2px 12px rgba(0,0,0,0.08)"><h1 style="color:${teal};font-size:28px;margin:0 0 16px">You've been unsubscribed</h1><p style="color:#475569;font-size:16px;line-height:1.6;margin:0 0 24px">You will no longer receive appointment reminder emails from Qliniqit.</p><a href="/" style="display:inline-block;background:${teal};color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:15px;font-weight:600">Back to Qliniqit</a></div></body></html>`;
}

startServer().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
