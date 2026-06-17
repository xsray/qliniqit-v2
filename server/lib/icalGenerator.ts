import { getDb } from "../db";
import { appointments, providerProfiles, users } from "../../drizzle/schema";
import { eq, and, gte } from "drizzle-orm";

export async function generateProviderIcal(providerId: number): Promise<string> {
  const db = getDb();

  const [pp] = await db
    .select({ id: providerProfiles.id, userName: users.name })
    .from(providerProfiles)
    .innerJoin(users, eq(providerProfiles.userId, users.id))
    .where(eq(providerProfiles.id, providerId))
    .limit(1);

  if (!pp) throw new Error("NOT_FOUND");

  const upcoming = await db
    .select({
      id: appointments.id,
      slotStart: appointments.slotStart,
      slotEnd: appointments.slotEnd,
      type: appointments.type,
      notes: appointments.notes,
    })
    .from(appointments)
    .where(
      and(
        eq(appointments.providerId, providerId),
        eq(appointments.status, "confirmed"),
        gte(appointments.slotStart, new Date())
      )
    )
    .limit(200);

  const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Qliniqit//Provider Availability//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:Dr. ${pp.userName ?? "Provider"} — Qliniqit Schedule`,
    "X-WR-TIMEZONE:UTC",
  ];

  for (const appt of upcoming) {
    const start = new Date(appt.slotStart);
    const end = appt.slotEnd ? new Date(appt.slotEnd) : new Date(start.getTime() + 30 * 60 * 1000);
    lines.push(
      "BEGIN:VEVENT",
      `UID:qliniqit-appt-${appt.id}@qliniqit.com`,
      `DTSTAMP:${fmt(new Date())}Z`,
      `DTSTART:${fmt(start)}Z`,
      `DTEND:${fmt(end)}Z`,
      `SUMMARY:${appt.type === "teleconsultation" ? "Video Consultation" : "In-Clinic Appointment"} — Qliniqit`,
      appt.notes ? `DESCRIPTION:${appt.notes.replace(/\n/g, "\\n")}` : "DESCRIPTION:Appointment via Qliniqit",
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}
