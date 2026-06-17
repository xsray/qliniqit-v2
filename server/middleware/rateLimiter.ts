import rateLimit from "express-rate-limit";

/**
 * Strict limiter for auth endpoints (login, signup, password reset).
 * Prevents brute-force credential stuffing.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again in 15 minutes" },
  skipSuccessfulRequests: false,
});

/**
 * General API limiter — applied globally to all /api routes.
 */
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests" },
  skip: (req) => req.method === "OPTIONS",
});

/**
 * Upload limiter — prevents storage abuse on file upload endpoints.
 */
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Upload limit exceeded. Try again in an hour." },
});

/**
 * AI endpoint limiter — OpenAI calls are expensive.
 */
export const aiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "AI request limit reached. Please wait a moment." },
});
