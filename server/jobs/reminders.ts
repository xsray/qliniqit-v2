import { getDb } from "../db";
import { appointments, users, notificationPreferences } from "../../drizzle/schema";
import { eq, and, gte, lte, isNull, or } from "drizzle-orm";

export async function runAllReminders(): Promise<{ sent24h: number; sent1h: number }> {
  const db = getDb();
  const now = new Date();

  // 24h window: appointments starting between 23h and 25h from now
  const window24hStart = new Date(now.getTime() + 23 * 60 * 60 * 1000);
  const window24hEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);

  // 1h window: appointments starting between 55min and 65min from now
  const window1hStart = new Date(now.getTime() + 55 * 60 * 1000);
  const window1hEnd = new Date(now.getTime() + 65 * 60 * 1000);

  const pending24h = await db
    .select({ id: appointments.id, patientId: appointments.patientId })
    .from(appointments)
    .where(
      and(
        eq(appointments.status, "confirmed"),
        eq(appointments.reminder24hSent, false),
        gte(appointments.slotStart, window24hStart),
        lte(appointments.slotStart, window24hEnd)
      )
    );

  const pending1h = await db
    .select({ id: appointments.id, patientId: appointments.patientId })
    .from(appointments)
    .where(
      and(
        eq(appointments.status, "confirmed"),
        eq(appointments.reminder1hSent, false),
        gte(appointments.slotStart, window1hStart),
        lte(appointments.slotStart, window1hEnd)
      )
    );

  // Mark as sent (actual email/push sending wired separately)
  for (const appt of pending24h) {
    await db
      .update(appointments)
      .set({ reminder24hSent: true, reminder24hSentAt: now })
      .where(eq(appointments.id, appt.id));
  }

  for (const appt of pending1h) {
    await db
      .update(appointments)
      .set({ reminder1hSent: true, reminder1hSentAt: now })
      .where(eq(appointments.id, appt.id));
  }

  return { sent24h: pending24h.length, sent1h: pending1h.length };
}
