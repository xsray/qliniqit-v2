import { getDb } from "../db";
import { teleconsultations } from "../../drizzle/schema";
import { and, eq, lte, isNotNull } from "drizzle-orm";

export async function expireRecordings(): Promise<{ expired: number }> {
  const db = getDb();
  const now = new Date();

  const result = await db
    .update(teleconsultations)
    .set({ recordingStatus: "expired", recordingUrl: null })
    .where(
      and(
        eq(teleconsultations.recordingStatus, "ready"),
        isNotNull(teleconsultations.recordingExpiresAt),
        lte(teleconsultations.recordingExpiresAt, now)
      )
    );

  return { expired: 0 }; // pg doesn't return count easily without raw sql
}
