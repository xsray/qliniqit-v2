#!/bin/bash
# QliniqiT v2 — Local Setup Script
# Run: chmod +x setup.sh && ./setup.sh

set -e

TEAL='\033[0;36m'
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo -e "${TEAL}╔══════════════════════════════════════╗${NC}"
echo -e "${TEAL}║     QliniqiT v2 — Local Setup        ║${NC}"
echo -e "${TEAL}╚══════════════════════════════════════╝${NC}"
echo ""

# ─── Check Node.js ────────────────────────────────────────────────────────────
echo -e "${TEAL}[1/5] Checking Node.js...${NC}"
if ! command -v node &> /dev/null; then
  echo -e "${RED}✗ Node.js not found. Install from https://nodejs.org (v20+)${NC}"
  exit 1
fi
NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo -e "${RED}✗ Node.js v20+ required (you have $(node -v))${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Node.js $(node -v)${NC}"

# ─── Check/install pnpm ───────────────────────────────────────────────────────
echo -e "${TEAL}[2/5] Checking pnpm...${NC}"
if ! command -v pnpm &> /dev/null; then
  echo -e "${YELLOW}  pnpm not found — installing...${NC}"
  npm install -g pnpm
fi
echo -e "${GREEN}✓ pnpm $(pnpm -v)${NC}"

# ─── Install dependencies ─────────────────────────────────────────────────────
echo -e "${TEAL}[3/5] Installing dependencies...${NC}"
pnpm install
echo -e "${GREEN}✓ Dependencies installed${NC}"

# ─── Set up .env ──────────────────────────────────────────────────────────────
echo -e "${TEAL}[4/5] Setting up environment...${NC}"
if [ -f ".env" ]; then
  echo -e "${GREEN}✓ .env already exists${NC}"
else
  cp .env.example .env
  echo -e "${YELLOW}✓ Created .env from .env.example${NC}"
  echo ""
  echo -e "${YELLOW}  ⚠️  You need to fill in these required values in .env:${NC}"
  echo ""
  echo -e "  ${YELLOW}1. DATABASE_URL${NC}       — PostgreSQL connection string"
  echo -e "     Get it from: https://supabase.com → Your project → Settings → Database"
  echo -e "     Looks like: postgresql://postgres.xxx:password@aws-0-...supabase.com:5432/postgres"
  echo ""
  echo -e "  ${YELLOW}2. SUPABASE_URL${NC}       — Your Supabase project URL"
  echo -e "     https://supabase.com → Your project → Settings → API → Project URL"
  echo ""
  echo -e "  ${YELLOW}3. SUPABASE_SERVICE_ROLE_KEY${NC} — Service role key (NOT the anon key)"
  echo -e "     https://supabase.com → Your project → Settings → API → service_role"
  echo ""
  echo -e "  ${YELLOW}4. SUPABASE_JWT_SECRET${NC} — JWT secret"
  echo -e "     https://supabase.com → Your project → Settings → API → JWT Secret"
  echo ""
  echo -e "  ${YELLOW}5. JWT_SECRET${NC}         — Any random 32+ char string"
  echo -e "     Run: openssl rand -base64 32"
  echo ""
  echo -e "  ${YELLOW}6. CRON_SECRET${NC}        — Any random 16+ char string"
  echo -e "  ${YELLOW}7. UNSUBSCRIBE_SECRET${NC} — Any random 16+ char string"
  echo ""
  echo -e "  ${YELLOW}8. STRIPE_SECRET_KEY${NC}  — From https://dashboard.stripe.com/test/apikeys"
  echo -e "  ${YELLOW}9. STRIPE_WEBHOOK_SECRET${NC} — From Stripe webhook settings"
  echo ""
  echo -e "  ${YELLOW}10. AWS_*${NC}             — S3 credentials (or use Supabase Storage)"
  echo ""
  echo -e "  ${TEAL}  Edit .env now, then re-run: pnpm dev${NC}"
  echo ""
  exit 0
fi

# ─── Check .env is filled in ─────────────────────────────────────────────────
echo -e "${TEAL}[5/5] Validating environment...${NC}"
MISSING=()
while IFS= read -r line; do
  [[ "$line" =~ ^#|^$ ]] && continue
  KEY="${line%%=*}"
  VALUE="${line#*=}"
  if [[ "$VALUE" == *"..."* ]] || [[ "$VALUE" == "change-me"* ]] || [[ -z "$VALUE" ]]; then
    MISSING+=("$KEY")
  fi
done < .env

if [ ${#MISSING[@]} -gt 0 ]; then
  echo -e "${YELLOW}  ⚠️  These .env values still need to be filled in:${NC}"
  for key in "${MISSING[@]}"; do
    echo -e "  ${YELLOW}• $key${NC}"
  done
  echo ""
  echo -e "${TEAL}  Fill them in and re-run: pnpm dev${NC}"
  exit 0
fi

echo -e "${GREEN}✓ Environment looks good${NC}"
echo ""
echo -e "${GREEN}╔══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ Ready! Run: pnpm dev              ║${NC}"
echo -e "${GREEN}║  Then open: http://localhost:3000     ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${TEAL}First time?${NC} Also run migrations:"
echo -e "  ${TEAL}pnpm db:push${NC}   (pushes schema to your Supabase database)"
echo ""
