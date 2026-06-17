import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../_core/trpc";
import { requireDb } from "../db";
import { reviews, appointments, deals, dealClaims, notifications, users, providerProfiles } from "../../drizzle/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

export const reviewsRouter = router({
  forProvider: publicProcedure
    .input(z.object({ providerId: z.number().int().positive(), page: z.number().int().min(1).default(1), limit: z.number().int().min(1).max(50).default(10) }))
    .query(async ({ input }) => {
      const db = requireDb();
      const rows = await db
        .select({ id: reviews.id, rating: reviews.rating, comment: reviews.comment, aspects: reviews.aspects, providerResponse: reviews.providerResponse, createdAt: reviews.createdAt, patientName: users.name, patientAvatar: users.avatarUrl })
        .from(reviews)
        .innerJoin(users, eq(users.id, reviews.patientId))
        .where(and(eq(reviews.providerId, input.providerId), eq(reviews.isVisible, true), eq(reviews.moderationStatus, "approved")))
        .orderBy(desc(reviews.createdAt))
        .limit(input.limit)
        .offset((input.page - 1) * input.limit);
      return rows;
    }),

  create: protectedProcedure
    .input(z.object({ appointmentId: z.number().int().positive(), rating: z.number().int().min(1).max(5), comment: z.string().max(2000).optional(), aspects: z.object({ waitTime: z.number().min(1).max(5).optional(), communication: z.number().min(1).max(5).optional(), facility: z.number().min(1).max(5).optional() }).optional() }))
    .mutation(async ({ ctx, input }) => {
      const db = requireDb();
      const [appt] = await db.select().from(appointments).where(and(eq(appointments.id, input.appointmentId), eq(appointments.patientId, ctx.user.id), eq(appointments.status, "completed"))).limit(1);
      if (!appt) throw new TRPCError({ code: "FORBIDDEN", message: "Can only review completed appointments" });
      const [review] = await db.insert(reviews).values({ appointmentId: input.appointmentId, patientId: ctx.user.id, providerId: appt.providerId, rating: input.rating, comment: input.comment ?? null, aspects: input.aspects ?? null, moderationStatus: "pending", isVerifiedAppointment: true }).returning();
      return { reviewId: review!.id };
    }),
});

export const patientRouter = router({
  dashboard: protectedProcedure.query(async ({ ctx }) => {
    const db = requireDb();
    const upcomingAppts = await db
      .select({ id: appointments.id, slotStart: appointments.slotStart, type: appointments.type, status: appointments.status, providerName: users.name })
      .from(appointments)
      .innerJoin(providerProfiles, eq(providerProfiles.id, appointments.providerId))
      .innerJoin(users, eq(users.id, providerProfiles.userId))
      .where(and(eq(appointments.patientId, ctx.user.id), eq(appointments.status, "confirmed"), gte(appointments.slotStart, new Date())))
      .orderBy(appointments.slotStart)
      .limit(5);
    return { upcomingAppointments: upcomingAppts };
  }),
});

export const dealsRouter = router({
  list: publicProcedure
    .input(z.object({ countryCode: z.string().length(2).optional(), category: z.string().optional(), page: z.number().int().min(1).default(1), limit: z.number().int().min(1).max(50).default(20) }))
    .query(async ({ input }) => {
      const db = requireDb();
      const now = new Date();
      const conditions = [eq(deals.status, "active"), lte(deals.validFrom, now), gte(deals.validUntil, now)];
      if (input.countryCode) conditions.push(eq(deals.countryCode, input.countryCode));
      if (input.category) conditions.push(eq(deals.category, input.category as any));
      const rows = await db.select().from(deals).where(and(...conditions)).orderBy(desc(deals.isFeatured), desc(deals.createdAt)).limit(input.limit).offset((input.page - 1) * input.limit);
      return rows;
    }),

  claim: protectedProcedure
    .input(z.object({ dealId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = requireDb();
      const [deal] = await db.select().from(deals).where(and(eq(deals.id, input.dealId), eq(deals.status, "active"), gte(deals.validUntil, new Date()))).limit(1);
      if (!deal) throw new TRPCError({ code: "NOT_FOUND", message: "Deal not found or expired" });
      if (deal.maxClaims !== null && (deal.claimsCount ?? 0) >= deal.maxClaims) throw new TRPCError({ code: "CONFLICT", message: "Deal is sold out" });
      const claimCode = nanoid(10).toUpperCase();
      const [claim] = await db.insert(dealClaims).values({ dealId: input.dealId, patientId: ctx.user.id, claimCode, status: "claimed" }).returning();
      await db.update(deals).set({ claimsCount: (deal.claimsCount ?? 0) + 1 }).where(eq(deals.id, input.dealId));
      return { claimId: claim!.id, claimCode };
    }),
});

export const notificationsRouter = router({
  list: protectedProcedure
    .input(z.object({ unreadOnly: z.boolean().default(false), limit: z.number().int().min(1).max(50).default(20) }))
    .query(async ({ ctx, input }) => {
      const db = requireDb();
      const conditions = [eq(notifications.userId, ctx.user.id)];
      if (input.unreadOnly) conditions.push(eq(notifications.readAt, null as any));
      return db.select().from(notifications).where(and(...conditions)).orderBy(desc(notifications.createdAt)).limit(input.limit);
    }),

  markRead: protectedProcedure
    .input(z.object({ notificationId: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const db = requireDb();
      await db.update(notifications).set({ readAt: new Date() }).where(and(eq(notifications.id, input.notificationId), eq(notifications.userId, ctx.user.id)));
      return { ok: true };
    }),
});

export const adminRouter = router({
  stats: adminProcedure.query(async () => {
    const db = requireDb();
    const [userCount] = await db.select({ count: users.id }).from(users);
    const [providerCount] = await db.select({ count: providerProfiles.id }).from(providerProfiles);
    return { users: userCount, providers: providerCount };
  }),

  verifyProvider: adminProcedure
    .input(z.object({ providerId: z.number().int().positive(), status: z.enum(["verified", "rejected"]), note: z.string().max(500).optional() }))
    .mutation(async ({ input }) => {
      const db = requireDb();
      await db.update(providerProfiles).set({ verificationStatus: input.status, updatedAt: new Date() }).where(eq(providerProfiles.id, input.providerId));
      return { ok: true };
    }),
});
