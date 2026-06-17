import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../_core/trpc";
import { requireDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  /**
   * Called by the client after Supabase sign-in to upsert the user
   * record in our database. Safe to call on every login.
   */
  upsertUser: publicProcedure
    .input(
      z.object({
        supabaseUid: z.string().min(1),
        email: z.string().email().optional(),
        name: z.string().max(200).optional(),
        avatarUrl: z.string().url().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = requireDb();

      const existing = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.supabaseUid, input.supabaseUid))
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(users)
          .set({ lastSignedIn: new Date(), updatedAt: new Date() })
          .where(eq(users.supabaseUid, input.supabaseUid));
        return { created: false, userId: existing[0]!.id };
      }

      const [created] = await db
        .insert(users)
        .values({
          supabaseUid: input.supabaseUid,
          email: input.email ?? null,
          name: input.name ?? null,
          avatarUrl: input.avatarUrl ?? null,
          role: "user",
        })
        .returning({ id: users.id });

      return { created: true, userId: created!.id };
    }),

  /**
   * Returns the currently authenticated user's profile.
   */
  me: protectedProcedure.query(async ({ ctx }) => {
    const db = requireDb();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, ctx.user.id))
      .limit(1);

    if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    return user;
  }),

  /**
   * Update the current user's profile.
   */
  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().max(200).optional(),
        phone: z.string().max(32).optional(),
        dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        city: z.string().max(100).optional(),
        countryCode: z.string().length(2).optional(),
        locale: z.string().max(10).optional(),
        timezone: z.string().max(64).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = requireDb();
      await db
        .update(users)
        .set({ ...input, updatedAt: new Date() })
        .where(eq(users.id, ctx.user.id));
      return { ok: true };
    }),
});
