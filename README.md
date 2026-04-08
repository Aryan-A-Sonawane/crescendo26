# CRESCENDO'26 Platform

Full-stack event platform for Crescendo 2026, an inter-college technical, cultural, and sports festival.

This repository contains the production website, participant onboarding system, event operations dashboards, and venue entry workflows used by organizers.

## Platform Purpose

The project was built as both a public-facing festival website and an internal event-operations system. It unified registration, event participation, live venue control, and organizer workflows in one platform so that the team could run Crescendo 2026 with fewer manual handoffs and faster on-ground decisions.

## Website Experience

- Indian Odyssey themed festival web experience designed for technical, cultural, and sports audiences
- Event discovery across categories with dedicated pages for competitions, timeline, partners, rulebooks, and team
- Participant onboarding with OTP and Google sign-in options
- Profile experience with ticket visibility, event status, and QR-based gate pass generation

## Dashboard System

### Super Admin Dashboard

- Managed event lifecycle controls (status, format, venue, and on-spot entry settings)
- Access governance for organizers through role and assignment management
- Coordinator and venue-team permission control from a single operations panel

### Coordinator Dashboard

- Live queue operations for event participants
- Round-based execution for solo and versus formats
- Score updates, remarks, starred rounds, and completion flow
- On-spot registration-to-queue workflow for real-time participant intake
- Export and audit-friendly operational visibility

### Venue Team Dashboard

- Camera-based QR validation for participant gate entries
- Instant entry logging and verification checks
- Live entry list visibility for crowd control and audit traceability

## Impact

### Organizing Team Impact

- Reduced dependency on scattered sheets and manual gate/event coordination
- Improved operational clarity through role-based access and centralized workflows
- Faster event execution with live queueing, scoring, and round control
- Better accountability through logs, validation checks, and structured audit scripts

### Audience Impact

- Smoother registration and onboarding experience
- Faster venue entry through QR-based gate validation
- Better transparency on participation status through profile and ticket visibility
- Improved event-day flow due to quicker organizer response and reduced bottlenecks

## Scale and Observability

The platform handled 2,067 visitors and 7,716 page views in its first 12 hours while tracking edge requests, function errors and compute usage.

## Tech Stack

- Frontend/App: Next.js 16 (App Router), React 19, TypeScript
- Styling/UI: Tailwind CSS 4, Framer Motion, shadcn/radix tooling
- Database: Neon Postgres
- ORM/Data Layer: Prisma 7 with Neon adapter
- Validation: Zod
- Email: Nodemailer (OTP mail flow)
- QR and Scan: qrcode + jsQR
- Analytics/Observability: Vercel Analytics and Vercel runtime observability

## Repository Structure

```
crescendo26/
|- data/                 CSV sources for ticket/event imports
|- config/               local config helpers
|- frontend/             Next.js application (main product)
|  |- app/               routes, pages, API route handlers
|  |- components/        reusable UI components
|  |- lib/               auth, db, mailer, utilities
|  |- prisma/            schema and migrations
|  |- scripts/           import, audit, and integrity scripts
|  |- public/            static assets
|- README.md             this document
```

## Reliability and Networking Notes

The Neon DB client setup includes a custom DNS-aware fetch path to mitigate network environments where *.neon.tech DNS resolution is unreliable. This is implemented in the app data layer and mirrored in operational scripts.

## License

Internal project for Crescendo 2026 operations and event delivery.
