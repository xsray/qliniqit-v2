import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { ENV } from "./_core/env";
import * as schema from "../drizzle/schema";
import { TRPCError } from "@trpc/server";

let _pool: Pool | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({
      connectionString: ENV.DATABASE_URL,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
      ssl: ENV.NODE_ENV === "production" ? { rejectUnauthorized: true } : false,
    });

    _pool.on("error", (err) => {
      console.error("[DB] Unexpected pool error:", err.message);
      // Reset on fatal errors so the next request re-initialises
      _pool = null;
      _db = null;
    });

    _pool.on("connect", () => {
      if (ENV.NODE_ENV === "development") {
        console.log("[DB] New client connected");
      }
    });
  }
  return _pool;
}

export function getDb() {
  if (!_db) {
    _db = drizzle(getPool(), { schema });
  }
  return _db;
}

/**
 * Returns db or throws INTERNAL_SERVER_ERROR.
 * Use in tRPC procedures; never catches silently.
 */
export function requireDb() {
  try {
    return getDb();
  } catch (err) {
    console.error("[DB] requireDb failed:", err);
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database unavailable",
    });
  }
}

/**
 * Gracefully close the pool on shutdown.
 */
export async function closeDb(): Promise<void> {
  if (_pool) {
    await _pool.end();
    _pool = null;
    _db = null;
  }
}
