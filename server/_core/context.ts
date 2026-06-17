import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { verifySupabaseJwt, extractBearerToken } from "./jwt";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import type { User } from "../../drizzle/schema";

export type AuthUser = {
  id: number;
  supabaseUid: string;
  email: string | null;
  role: "user" | "provider" | "admin";
};

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: AuthUser | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  const authHeader = opts.req.headers.authorization as string | undefined;
  const token = extractBearerToken(authHeader);

  if (!token) {
    return { req: opts.req, res: opts.res, user: null };
  }

  try {
    const payload = await verifySupabaseJwt(token);
    const supabaseUid = payload.sub;
    if (!supabaseUid) return { req: opts.req, res: opts.res, user: null };

    const db = getDb();
    const [dbUser] = await db
      .select({
        id: users.id,
        supabaseUid: users.supabaseUid,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
      })
      .from(users)
      .where(eq(users.supabaseUid, supabaseUid))
      .limit(1);

    if (!dbUser || !dbUser.isActive) {
      return { req: opts.req, res: opts.res, user: null };
    }

    return {
      req: opts.req,
      res: opts.res,
      user: {
        id: dbUser.id,
        supabaseUid: dbUser.supabaseUid,
        email: dbUser.email ?? null,
        role: (dbUser.role ?? "user") as AuthUser["role"],
      },
    };
  } catch {
    // Invalid / expired token — treat as unauthenticated
    return { req: opts.req, res: opts.res, user: null };
  }
}
