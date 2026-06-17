import { z } from "zod";
import { router, protectedProcedure, providerProcedure } from "../_core/trpc";
import { requireDb } from "../db";
import { appointments, slotHolds, providerProfiles, users } from "../../drizzle/schema";
import { eq, and, gte, lte, ne, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

export const bookingRouter = router({
  /**
   * Hold a slot for 10 minutes while the patient completes booking.
   */
  holdSlot: protectedProcedure
    .input(
      z.object({
        providerId: z.number().int().positive(),
        slotStart: z.string().datetime(),
        slotEnd: z.string().datetime(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = requireDb();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      // Check no existing confirmed booking or active hold
      const conflict = await db
        .select({ id: appointments.id })
        .from(appointments)
        .where(
          and(
            eq(appointments.providerId, input.providerId),
            eq(appointments.slotStart, new Date(input.slotStart)),
            ne(appointments.status, "cancelled")
          )
        )
        .limit(1);

      if (conflict.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "Slot already booked" });
      }

      const [hold] = await db
        .insert(slotHolds)
        .values({
          patientId: ctx.user.id,
          providerId: input.providerId,
          slotStart: new Date(input.slotStart),
          slotEnd: new Date(input.slotEnd),
          expiresAt,
          status: "active",
        })
        .returning();

      return { holdId: hold!.id, expiresAt };
    }),

  /**
   * Confirm a booking (converts a hold to an appointment).
   */
  create: protectedProcedure
    .input(
      z.object({
        holdId: z.number().int().positive(),
        providerId: z.number().int().positive(),
        slotStart: z.string().datetime(),
        slotEnd: z.string().datetime(),
        type: z.enum(["in_clinic", "teleconsultation"]).default("in_clinic"),
        notes: z.string().max(1000).optional(),
        familyMemberId: z.number().int().positive().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = requireDb();

      // Validate hold is still active and belongs to this user
      const [hold] = await db
        .select()
        .from(slotHolds)
        .where(
          and(
            eq(slotHolds.id, input.holdId),
            eq(slotHolds.patientId, ctx.user.id),
            eq(slotHolds.status, "active"),
            gte(slotHolds.expiresAt, new Date())
          )
        )
        .limit(1);

      if (!hold) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "Slot hold expired or not found" });
      }

      const [appt] = await db
        .insert(appointments)
        .values({
          patientId: ctx.user.id,
          providerId: input.providerId,
          slotStart: new Date(input.slotStart),
          slotEnd: new Date(input.slotEnd),
          type: input.type,
          notes: input.notes ?? null,
          familyMemberId: input.familyMemberId ?? null,
          status: "pending",
          bookingSource: "web",
        })
        .returning();

      // Release the hold
      await db
        .update(slotHolds)
        .set({ status: "converted" })
        .where(eq(slotHolds.id, input.holdId));

      return { appointmentId: appt!.id };
    }),

  /**
   * Get appointments for the current user (patient view).
   */
  myAppointments: protectedProcedure
    .input(
      z.object({
        status: z.enum(["pending", "confirmed", "completed", "cancelled", "no_show"]).optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = requireDb();
      const offset = (input.page - 1) * input.limit;

      const conditions = [eq(appointments.patientId, ctx.user.id)];
      if (input.status) conditions.push(eq(appointments.status, input.status));

      const rows = await db
        .select({
          id: appointments.id,
          slotStart: appointments.slotStart,
          slotEnd: appointments.slotEnd,
          status: appointments.status,
          type: appointments.type,
          paymentStatus: appointments.paymentStatus,
          providerName: users.name,
          providerAvatar: users.avatarUrl,
        })
        .from(appointments)
        .innerJoin(providerProfiles, eq(providerProfiles.id, appointments.providerId))
        .innerJoin(users, eq(users.id, providerProfiles.userId))
        .where(and(...conditions))
        .orderBy(desc(appointments.slotStart))
        .limit(input.limit)
        .offset(offset);

      return rows;
    }),

  /**
   * Cancel an appointment.
   */
  cancel: protectedProcedure
    .input(
      z.object({
        appointmentId: z.number().int().positive(),
        reason: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = requireDb();

      const [appt] = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, input.appointmentId))
        .limit(1);

      if (!appt) throw new TRPCError({ code: "NOT_FOUND" });

      const isPatient = appt.patientId === ctx.user.id;
      const isProviderOrAdmin =
        ctx.user.role === "admin" ||
        (ctx.user.role === "provider" &&
          (await db
            .select({ id: providerProfiles.id })
            .from(providerProfiles)
            .where(
              and(
                eq(providerProfiles.userId, ctx.user.id),
                eq(providerProfiles.id, appt.providerId)
              )
            )
            .limit(1)
            .then((r) => r.length > 0)));

      if (!isPatient && !isProviderOrAdmin) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      if (!["pending", "confirmed"].includes(appt.status ?? "")) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Cannot cancel a completed appointment" });
      }

      await db
        .update(appointments)
        .set({
          status: "cancelled",
          cancellationReason: input.reason ?? null,
          cancelledBy: isPatient ? "patient" : "provider",
          updatedAt: new Date(),
        })
        .where(eq(appointments.id, input.appointmentId));

      return { ok: true };
    }),
});
