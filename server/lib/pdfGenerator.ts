import { getDb } from "../db";
import { visitNotes, appointments, providerProfiles, users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import PDFDocument from "pdfkit";

const TEAL = "#0D9488";

async function buildPdf(buildFn: (doc: InstanceType<typeof PDFDocument>) => void): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    buildFn(doc);
    doc.end();
  });
}

export async function generateVisitNotePdf(noteId: number, requestingUserId: number): Promise<Buffer> {
  const db = getDb();
  const [row] = await db
    .select({
      note: visitNotes,
      providerName: users.name,
      slotStart: appointments.slotStart,
    })
    .from(visitNotes)
    .innerJoin(appointments, eq(appointments.id, visitNotes.appointmentId))
    .innerJoin(providerProfiles, eq(providerProfiles.id, visitNotes.providerId))
    .innerJoin(users, eq(users.id, providerProfiles.userId))
    .where(eq(visitNotes.id, noteId))
    .limit(1);

  if (!row) throw new Error("NOT_FOUND");

  const [providerProfile] = await db
    .select({ id: providerProfiles.id })
    .from(providerProfiles)
    .where(eq(providerProfiles.userId, requestingUserId))
    .limit(1);

  const isProvider = providerProfile && row.note.providerId === providerProfile.id;
  const isPatient = row.note.patientId === requestingUserId;

  if (!isProvider && !isPatient) throw new Error("FORBIDDEN");
  if (isPatient && !row.note.isSharedWithPatient) throw new Error("FORBIDDEN");

  return buildPdf((doc) => {
    doc.fontSize(20).font("Helvetica-Bold").fillColor(TEAL).text("Qliniqit", { align: "center" });
    doc.fontSize(12).font("Helvetica").fillColor("#64748b").text("Visit Summary", { align: "center" });
    doc.moveDown();

    const dateStr = row.slotStart
      ? new Date(row.slotStart).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
      : "N/A";

    doc.fontSize(10).font("Helvetica-Bold").fillColor("#1e293b").text("Visit Date: ", { continued: true });
    doc.font("Helvetica").text(dateStr);
    doc.font("Helvetica-Bold").text("Provider: ", { continued: true });
    doc.font("Helvetica").text(`Dr. ${row.providerName ?? "Unknown"}`);
    doc.moveDown();

    const fields: [string, string | null | undefined][] = [
      ["Chief Complaint", row.note.chiefComplaint],
      ["Diagnosis", row.note.diagnosis],
      ["Treatment Plan", row.note.treatmentPlan],
      ["Prescriptions", row.note.prescriptions],
      ["Follow-up Date", row.note.followUpDate],
      ["Follow-up Notes", row.note.followUpNotes],
    ];

    for (const [label, value] of fields) {
      if (!value) continue;
      doc.fontSize(10).font("Helvetica-Bold").fillColor(TEAL).text(label);
      doc.fontSize(9).font("Helvetica").fillColor("#1e293b").text(value, { indent: 10 });
      doc.moveDown(0.5);
    }
  });
}
