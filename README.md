# QliniqiT v2 — Global Healthcare Marketplace

Rebuilt from scratch with PostgreSQL + Supabase, fixing all security issues identified in the original codebase.

## Tech Stack

- **Frontend**: React 19, TanStack Query, tRPC client, Tailwind CSS 4, Wouter
- **Backend**: Node.js, Express, tRPC, Drizzle ORM
- **Database**: PostgreSQL (via Supabase)
- **Auth**: Supabase Auth (JWT, always signature-verified)
- **Payments**: Stripe
- **Video**: Daily.co (telemedicine), Mux (reels)
- **Storage**: AWS S3 (or Supabase Storage)
- **Email**: Resend
- **SMS**: Twilio
- **Push**: Firebase Cloud Messaging

## Security Improvements Over v1

| Issue | v1 | v2 |
|---|---|---|
| JWT verification | Decode-only (no signature check) | `jose.jwtVerify` — always verified |
| Unauthenticated uploads | `/api/upload/event-image` open to all | Requires auth |
| Stack traces to client | `res.json({ stack: err.stack })` | Never exposed |
| Rate limiting | None | `express-rate-limit` on all endpoints |
| CORS | Not configured | Explicit allowlist |
| Security headers | None | `helmet` |
| Cron secret | Optional (open if unset) | Required in production |
| Env validation | Silent empty defaults | Zod schema — exits if invalid |
| Auth system | Dual Manus + Supabase (confused) | Supabase only, clean |
| Error format | Raw error messages | Sanitised, no internals leaked |

## Setup

### 1. Prerequisites

- Node.js 20+
- pnpm 10+
- A Supabase project
- A PostgreSQL database (Supabase's built-in works)

### 2. Clone and install

```bash
git clone https://github.com/your-org/qliniqit-v2
cd qliniqit-v2
pnpm install
```

### 3. Configure environment

```bash
cp .env.example .env
# Fill in all required values
```

Required variables (the server will exit with a clear error if any are missing):

- `DATABASE_URL` — PostgreSQL connection string
- `SUPABASE_URL` — Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` — Service role key (not anon key)
- `SUPABASE_JWT_SECRET` — From Supabase dashboard → Settings → API
- `JWT_SECRET` — App secret, min 32 chars (`openssl rand -base64 32`)
- `CRON_SECRET` — Protects cron endpoints, min 16 chars
- `UNSUBSCRIBE_SECRET` — Signs email unsubscribe tokens
- `STRIPE_SECRET_KEY` — Stripe API key
- `STRIPE_WEBHOOK_SECRET` — Stripe webhook signing secret
- `AWS_*` — S3 credentials for file storage

### 4. Run migrations

```bash
pnpm db:generate   # generate SQL from schema
pnpm db:migrate    # apply migrations to database
```

### 5. Start development server

```bash
pnpm dev
```

The server starts on `http://localhost:3000`.

### 6. (Optional) Seed data

```bash
node scripts/seed-specialties.mjs
node scripts/seed-providers.mjs
```

## Project Structure

```
qliniqit-v2/
├── client/src/          # React frontend
│   ├── pages/           # Route components
│   ├── components/      # Shared UI components
│   ├── hooks/           # Custom React hooks
│   └── lib/             # Client utilities, tRPC client
├── server/
│   ├── _core/           # Server bootstrap: index.ts, env.ts, trpc.ts, context.ts, jwt.ts
│   ├── routers/         # tRPC routers (one file per domain)
│   ├── middleware/       # Express middleware: auth.ts, rateLimiter.ts
│   ├── jobs/            # Cron jobs: reminders, expiry, etc.
│   ├── lib/             # Shared server utilities: pdf, email, storage, etc.
│   ├── stripe/          # Stripe webhook handler
│   └── daily/           # Daily.co webhook handler
├── shared/              # Shared types and constants (client + server)
├── drizzle/
│   ├── schema.ts        # PostgreSQL schema (65+ tables)
│   └── migrations/      # Generated SQL migrations
├── .env.example         # All environment variables documented
└── drizzle.config.ts
```

## Key Patterns

### Authentication

Every tRPC procedure uses one of three procedure types:
- `publicProcedure` — no auth required
- `protectedProcedure` — any authenticated user
- `providerProcedure` — provider or admin only
- `adminProcedure` — admin only

REST endpoints use the `requireAuth` / `requireProviderAuth` Express middleware.

### Error handling

tRPC errors never include `stack` in the response. REST endpoints log errors server-side but only return `{ error: "message" }` to the client — never raw Error objects.

### Database

Use `getDb()` to get the Drizzle client. In tRPC procedures, use `requireDb()` which throws a proper `INTERNAL_SERVER_ERROR` if unavailable.

## Deployment

### Supabase

1. Create a project at supabase.com
2. Copy the database URL, project URL, anon key, service role key, and JWT secret
3. Run `pnpm db:migrate` against the Supabase database

### Railway / Render / Fly.io

Build command: `pnpm build`
Start command: `node dist/index.js`

Set all required env vars in the platform's dashboard.

### Cron jobs

Register these external cron triggers (e.g. via Supabase Edge Functions, cron-job.org, or Railway cron):

| Endpoint | Schedule | Secret header |
|---|---|---|
| `POST /api/cron/reminders` | Every 15 min | `x-cron-secret` |
| `POST /api/cron/expire-recordings` | Daily at 2am UTC | `x-cron-secret` |
| `POST /api/cron/event-reminders` | Every hour | `x-cron-secret` |
