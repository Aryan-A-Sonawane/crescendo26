# CRESCENDO'26 Frontend

Next.js application for the Crescendo 2026 website and event operations platform.

For full project context, see the root README in the repository.

## Stack

- Next.js 16 App Router
- React 19 + TypeScript
- Tailwind CSS 4
- Prisma 7 + Neon Postgres
- Zod validation
- Nodemailer for OTP mail
- qrcode/jsQR for QR generation and scanning

## Run Locally

### Prerequisites

- Node.js 18+
- npm 9+
- Configured Neon/PostgreSQL database

### Setup

```bash
cd frontend
npm install
```

Create frontend/.env.local:

```env
DATABASE_URL=
DATABASE_URL_UNPOOLED=

NEXT_PUBLIC_SITE_URL=http://localhost:3000

EMAIL_USER=
EMAIL_PASS=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

SUPER_ADMIN_EMAILS=
```

Run migrations:

```bash
npx prisma migrate deploy
```

Start development server:

```bash
npm run dev
```

## Scripts

```bash
# App lifecycle
npm run dev
npm run build
npm run start
npm run lint

# Ticket import
npm run tickets:import:check
npm run tickets:import:apply

# Data and integrity checks
node scripts/db-integrity-check.cjs
node scripts/audit-event-played-scope.cjs
node scripts/audit-registered-effective.cjs
node scripts/audit-technical-pass-used.cjs
node scripts/reset-ticket-status.cjs
```

## Key Functional Areas

- Public pages: home, events, partners, team, timeline, rulebooks
- Registration and auth: OTP + Google OAuth + profile flows
- Event ops dashboards: super admin, coordinator, venue team
- Queue and rounds: start/end rounds, scoring, remarks, starred highlights
- Venue entry: camera QR scan and gate-entry logging

## Notes

- Keep secrets only in frontend/.env.local or deployment environment variables.
- The Neon client path includes DNS hardening for environments where default DNS resolution is unreliable.

