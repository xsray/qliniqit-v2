import { getDb } from "../db";
import { payoutRequests, providerProfiles } from "../../drizzle/schema";
import { eq, desc } from "drizzle-orm";

export async function generatePayoutHistoryCsv(userId: number): Promise<string> {
  const db = getDb();
  const [profile] = await db
    .select({ id: providerProfiles.id })
    .from(providerProfiles)
    .where(eq(providerProfiles.userId, userId))
    .limit(1);

  if (!profile) throw new Error("Provider profile not found");

  const rows = await db
    .select()
    .from(payoutRequests)
    .where(eq(payoutRequests.providerId, profile.id))
    .orderBy(desc(payoutRequests.requestedAt));

  const headers = ["ID", "Amount", "Currency", "Status", "Requested At", "Processed At"];
  const csvRows = rows.map((r) => [
    r.id,
    r.amount,
    r.currency,
    r.status,
    r.requestedAt ? new Date(r.requestedAt).toISOString() : "",
    r.processedAt ? new Date(r.processedAt).toISOString() : "",
  ]);

  return [headers, ...csvRows]
    .map((row) => row.map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(","))
    .join("\n");
}
