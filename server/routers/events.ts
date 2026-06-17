import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { requireDb } from "../db";
import { events, eventRegistrations } from "../../drizzle/schema";
import { eq, and, desc, gte, ilike, or } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";

export const eventsRouter = router({
  list: publicProcedure
    .input(z.object({
      query: z.string().optional(),
      type: z.string().optional(),
      country: z.string().optional(),
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(50).default(12),
    }))
    .query(async ({ input }) => {
      const db = requireDb();
      const conditions = [eq(events.status, "active")];
      if (input.query) {
        conditions.push(
          or(
            ilike(events.title, `%${input.query}%`),
            ilike(events.organizer, `%${input.query}%`),
            ilike(events.description, `%${input.query}%`)
          )!
        );
      }
      if (input.type) conditions.push(eq(events.type, input.type));
      if (input.country) conditions.push(eq(events.countryCode, input.country));

      const rows = await db
        .select()
        .from(events)
        .where(and(...conditions))
        .orderBy(desc(events.featured), events.startDate)
        .limit(input.limit)
        .offset((input.page - 1) * input.limit);
      return rows;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input }) => {
      const db = requireDb();
      const [event] = await db.select().from(events).where(eq(events.id, input.id)).limit(1);
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });
      return event;
    }),

  register: publicProcedure
    .input(z.object({
      eventId: z.number().int().positive(),
      name: z.string().min(2).max(200),
      email: z.string().email(),
      phone: z.string().optional(),
      organization: z.string().optional(),
      role: z.string().optional(),
      message: z.string().max(500).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = requireDb();
      const [event] = await db.select().from(events).where(eq(events.id, input.eventId)).limit(1);
      if (!event) throw new TRPCError({ code: "NOT_FOUND", message: "Event not found" });

      const token = nanoid(32);
      const [reg] = await db.insert(eventRegistrations).values({
        eventId: input.eventId,
        name: input.name,
        email: input.email,
        phone: input.phone ?? null,
        organization: input.organization ?? null,
        role: input.role ?? null,
        message: input.message ?? null,
        status: "pending",
        checkInToken: token,
      }).returning();

      // Bump attendee count
      await db
        .update(events)
        .set({ attendeeCount: (event.attendeeCount ?? 0) + 1 })
        .where(eq(events.id, input.eventId));

      return { registrationId: reg!.id, token };
    }),
});
