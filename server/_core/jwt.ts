import * as jose from "jose";
import { ENV } from "./env";

const secret = new TextEncoder().encode(ENV.JWT_SECRET);
const supabaseSecret = new TextEncoder().encode(ENV.SUPABASE_JWT_SECRET);

/**
 * Verify a Supabase-issued JWT (HS256, signed with SUPABASE_JWT_SECRET).
 * Always performs full signature verification — never falls back to decode-only.
 * Throws if the token is invalid, expired, or tampered with.
 */
export async function verifySupabaseJwt(token: string): Promise<jose.JWTPayload> {
  const { payload } = await jose.jwtVerify(token, supabaseSecret, {
    algorithms: ["HS256"],
  });
  return payload;
}

/**
 * Sign an application JWT (for unsubscribe tokens, ical feeds, etc.).
 * Always signed — never empty secret.
 */
export async function signJwt(
  payload: Record<string, unknown>,
  expiresIn: string = "7d"
): Promise<string> {
  return new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);
}

/**
 * Verify an application JWT (unsubscribe links, etc.).
 * Full signature verification — never skipped.
 */
export async function verifyJwt(token: string): Promise<jose.JWTPayload> {
  const { payload } = await jose.jwtVerify(token, secret, {
    algorithms: ["HS256"],
  });
  return payload;
}

/**
 * Extract bearer token from Authorization header.
 */
export function extractBearerToken(authHeader: string | undefined): string | null {
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7).trim();
  return token.length > 0 ? token : null;
}
