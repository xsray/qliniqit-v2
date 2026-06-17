import { z } from "zod";
import { router, publicProcedure, protectedProcedure, providerProcedure } from "../_core/trpc";
import { requireDb } from "../db";
import { providerProfiles, users, specialties, reviews, availabilitySlots, appointments, providerTrustScores, providerBlackoutDates } from "../../drizzle/schema";
import { eq, and, ilike, gte, lte, ne, desc, asc, sql, inArray } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const providersRouter = router({
  /**
   * Search providers with filters.
   */
  search: publicProcedure
    .input(
      z.object({
        query: z.string().max(200).optional(),
        specialtyId: z.number().int().positive().optional(),
        countryCode: z.string().length(2).optional(),
        city: z.string().max(100).optional(),
        providerType: z.string().optional(),
        offersVideo: z.boolean().optional(),
        minRating: z.number().min(0).max(5).optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(50).default(20),
      })
    )
    .query(async ({ input }) => {
      const db = requireDb();
      const offset = (input.page - 1) * input.limit;

      const conditions = [eq(providerProfiles.isActive, true)];

      if (input.specialtyId) conditions.push(eq(providerProfiles.specialtyId, input.specialtyId));
      if (input.countryCode) conditions.push(eq(providerProfiles.countryCode, input.countryCode));
      if (input.city) conditions.push(ilike(providerProfiles.city, `%${input.city}%`));
      if (input.providerType) conditions.push(eq(providerProfiles.providerType, input.providerType as any));
      if (input.offersVideo !== undefined) conditions.push(eq(providerProfiles.offersVideo, input.offersVideo));
      if (input.minRating) conditions.push(gte(providerProfiles.ratingAvg, String(input.minRating)));
      if (input.query) {
        conditions.push(ilike(users.name, `%${input.query}%`));
      }

      const rows = await db
        .select({
          id: providerProfiles.id,
          slug: providerProfiles.slug,
          userId: providerProfiles.userId,
          name: users.name,
          avatarUrl: users.avatarUrl,
          specialtyId: providerProfiles.specialtyId,
          specialtyName: specialties.nameEn,
          providerType: providerProfiles.providerType,
          consultationFee: providerProfiles.consultationFee,
          currencyCode: providerProfiles.currencyCode,
          ratingAvg: providerProfiles.ratingAvg,
          reviewCount: providerProfiles.reviewCount,
          city: providerProfiles.city,
          countryCode: providerProfiles.countryCode,
          offersVideo: providerProfiles.offersVideo,
          isFeatured: providerProfiles.isFeatured,
          verificationStatus: providerProfiles.verificationStatus,
        })
        .from(providerProfiles)
        .innerJoin(users, eq(users.id, providerProfiles.userId))
        .leftJoin(specialties, eq(specialties.id, providerProfiles.specialtyId))
        .where(and(...conditions))
        .orderBy(desc(providerProfiles.isFeatured), desc(providerProfiles.ratingAvg))
        .limit(input.limit)
        .offset(offset);

      return { providers: rows, page: input.page, limit: input.limit };
    }),

  /**
   * Get a provider's full public profile by slug.
   */
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const db = requireDb();
      const [row] = await db
        .select({
          profile: providerProfiles,
          name: users.name,
          email: users.email,
          avatarUrl: users.avatarUrl,
          specialtyName: specialties.nameEn,
        })
        .from(providerProfiles)
        .innerJoin(users, eq(users.id, providerProfiles.userId))
        .leftJoin(specialties, eq(specialties.id, providerProfiles.specialtyId))
        .where(and(eq(providerProfiles.slug, input.slug), eq(providerProfiles.isActive, true)))
        .limit(1);

      if (!row) throw new TRPCError({ code: "NOT_FOUND", message: "Provider not found" });

      const [trustScore] = await db
        .select()
        .from(providerTrustScores)
        .where(eq(providerTrustScores.providerId, row.profile.id))
        .limit(1);

      return { ...row, trustScore: trustScore ?? null };
    }),

  /**
   * Get available time slots for a provider on a given date.
   */
  getAvailability: publicProcedure
    .input(
      z.object({
        providerId: z.number().int().positive(),
        date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      })
    )
    .query(async ({ input }) => {
      const db = requireDb();
      const dateObj = new Date(input.date);
      const dayOfWeek = dateObj.getUTCDay();

      // Get recurring slots for this day of week
      const slots = await db
        .select()
        .from(availabilitySlots)
        .where(
          and(
            eq(availabilitySlots.providerId, input.providerId),
            eq(availabilitySlots.dayOfWeek, dayOfWeek),
            eq(availabilitySlots.isBlocked, false),
            eq(availabilitySlots.isRecurring, true)
          )
        );

      // Get blackout dates
      const blackouts = await db
        .select()
        .from(providerBlackoutDates)
        .where(
          and(
            eq(providerBlackoutDates.providerId, input.providerId),
            eq(providerBlackoutDates.date, input.date)
          )
        );

      if (blackouts.length > 0) return [];

      // Get already-booked slots
      const dateStart = new Date(`${input.date}T00:00:00Z`);
      const dateEnd = new Date(`${input.date}T23:59:59Z`);

      const booked = await db
        .select({ slotStart: appointments.slotStart })
        .from(appointments)
        .where(
          and(
            eq(appointments.providerId, input.providerId),
            gte(appointments.slotStart, dateStart),
            lte(appointments.slotStart, dateEnd),
            ne(appointments.status, "cancelled")
          )
        );

      const bookedMinutes = new Set(
        booked.map((b) => {
          const d = new Date(b.slotStart);
          return d.getUTCHours() * 60 + d.getUTCMinutes();
        })
      );

      // Generate time slots
      const timeSlots: { start: string; end: string; available: boolean }[] = [];

      for (const slot of slots) {
        const [startH, startM] = slot.startTime.split(":").map(Number) as [number, number];
        const [endH, endM] = slot.endTime.split(":").map(Number) as [number, number];
        const duration = slot.slotDurationMin ?? 30;

        let cur = startH * 60 + startM;
        const endTotal = endH * 60 + endM;

        while (cur + duration <= endTotal) {
          const h = Math.floor(cur / 60);
          const m = cur % 60;
          const nextCur = cur + duration;
          const nh = Math.floor(nextCur / 60);
          const nm = nextCur % 60;

          const startStr = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
          const endStr = `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;

          timeSlots.push({ start: startStr, end: endStr, available: !bookedMinutes.has(cur) });
          cur = nextCur;
        }
      }

      return timeSlots;
    }),

  /**
   * Update own provider profile.
   */
  updateProfile: providerProcedure
    .input(
      z.object({
        bio: z.string().max(2000).optional(),
        consultationFee: z.string().optional(),
        currencyCode: z.string().length(3).optional(),
        officeAddress: z.string().max(500).optional(),
        city: z.string().max(100).optional(),
        languages: z.array(z.string()).optional(),
        offersVideo: z.boolean().optional(),
        cancellationWindowHours: z.number().int().min(0).max(168).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = requireDb();
      const [profile] = await db
        .select({ id: providerProfiles.id })
        .from(providerProfiles)
        .where(eq(providerProfiles.userId, ctx.user.id))
        .limit(1);

      if (!profile) throw new TRPCError({ code: "NOT_FOUND", message: "Provider profile not found" });

      await db
        .update(providerProfiles)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(providerProfiles.id, profile.id));

      return { ok: true };
    }),
});
