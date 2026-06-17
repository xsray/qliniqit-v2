import type { Request, Response } from "express";
import { getDb } from "../db";
import { teleconsultations } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export async function handleDailyWebhook(req: Request, res: Response) {
  const event = req.body;
  if (!event?.action) return res.json({ received: true });

  const db = getDb();

  try {
    switch (event.action) {
      case "recording.ready": {
        const roomName = event.payload?.room_name as string | undefined;
        if (!roomName) break;
        await db
          .update(teleconsultations)
          .set({
            recordingStatus: "ready",
            recordingUrl: event.payload?.download_url ?? null,
            recordingId: event.payload?.recording_id ?? null,
            recordingExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          })
          .where(eq(teleconsultations.roomName, roomName));
        break;
      }
      case "recording.error": {
        const roomName = event.payload?.room_name as string | undefined;
        if (!roomName) break;
        await db
          .update(teleconsultations)
          .set({ recordingStatus: "failed" })
          .where(eq(teleconsultations.roomName, roomName));
        break;
      }
    }

    res.json({ received: true });
  } catch (err) {
    console.error("[daily/webhook]", err);
    res.status(500).json({ error: "Webhook handler failed" });
  }
}
