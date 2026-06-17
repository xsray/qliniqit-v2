import type { Request, Response, NextFunction } from "express";
import { verifySupabaseJwt, extractBearerToken } from "../_core/jwt";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import type { AuthUser } from "../_core/context";

declare global {
  namespace Express {
    interface Request {
      authUser?: AuthUser;
    }
  }
}

/**
 * Express middleware that verifies the Supabase JWT from the Authorization header
 * and attaches the authenticated user to req.authUser.
 *
 * If the token is missing or invalid, returns 401.
 * Use this on any REST endpoint that needs authentication.
 *
 * Usage:
 *   app.get("/api/some-endpoint", requireAuth, handler);
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }

  try {
    const payload = await verifySupabaseJwt(token);
    const supabaseUid = payload.sub;

    if (!supabaseUid) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }

    const db = getDb();
    const [dbUser] = await db
      .select({
        id: users.id,
        supabaseUid: users.supabaseUid,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.supabaseUid, supabaseUid))
      .limit(1);

    if (!dbUser || !dbUser.isActive) {
      res.status(401).json({ error: "User not found or inactive" });
      return;
    }

    req.authUser = {
      id: dbUser.id,
      supabaseUid: dbUser.supabaseUid,
      email: dbUser.email ?? null,
      role: (dbUser.role ?? "user") as AuthUser["role"],
    };

    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

/**
 * Like requireAuth, but additionally checks that the user has the provider or admin role.
 */
export async function requireProviderAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  await requireAuth(req, res, async () => {
    if (!req.authUser) return;
    if (req.authUser.role !== "provider" && req.authUser.role !== "admin") {
      res.status(403).json({ error: "Provider account required" });
      return;
    }
    next();
  });
}

/**
 * Validates the CRON_SECRET header for scheduled job endpoints.
 * If CRON_SECRET env var is set, the header must match exactly.
 * If it's not set, the endpoint is always open — which should not happen in production.
 */
export function requireCronSecret(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { ENV } = require("../_core/env");
  const secret = ENV.CRON_SECRET;
  const provided = req.headers["x-cron-secret"];

  if (!secret) {
    console.warn("[cron] WARNING: CRON_SECRET is not set — cron endpoint is open");
    next();
    return;
  }

  if (provided !== secret) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}
