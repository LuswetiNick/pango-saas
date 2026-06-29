# Getting Started

Status: Draft baseline  
Audience: Developers, AI agents  
Last updated: 2026-06-29

## Purpose

This guide explains how to set up Pango locally for development.

## Prerequisites

Install:

```txt
Node.js 20+
pnpm
Docker Desktop or Docker Engine
Git
```

Recommended tools:

```txt
VS Code
Prisma VS Code extension
Postman/Insomnia or Bruno
```

## Clone Repository

```bash
git clone <repo-url> pango
cd pango
```

## Install Dependencies

```bash
pnpm install
```

## Environment Setup

```bash
cp .env.example .env.local
```

Fill required values in `.env.local`.

Minimum local variables:

```txt
DATABASE_URL=
NEXT_PUBLIC_APP_URL=http://localhost:3000
APP_ENV=local
AUTH_SECRET=
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

For local development, payment/SMS/email providers may use mock adapters.

## Start Local Services

```bash
docker compose up -d
```

Expected local services:

```txt
PostgreSQL
Optional local email test server
```

## Database Setup

```bash
pnpm db:migrate
pnpm db:seed
```

Open Prisma Studio:

```bash
pnpm db:studio
```

## Start Development Server

```bash
pnpm dev
```

Expected apps:

```txt
apps/web       http://localhost:3000
apps/worker    local job runner if configured
```

## Common Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm db:migrate
pnpm db:deploy
pnpm db:seed
pnpm db:studio
```

## First Manual Test

After setup, verify:

1. Web app loads.
2. Landlord can sign up or use seeded account.
3. Landlord can create property.
4. Landlord can create unit.
5. Landlord can add tenant and tenancy.
6. Landlord can generate invoice.
7. Landlord can record manual payment.
8. Receipt is created.
9. Arrears dashboard updates correctly.

## Troubleshooting

### Database connection fails

Check:

```txt
DATABASE_URL
Docker container status
Postgres port conflict
```

### Prisma client errors

Run:

```bash
pnpm db:generate
```

### Environment validation fails

Compare `.env.local` with `.env.example`.

### Worker jobs not running

Check:

```txt
worker process is started
Inngest/Trigger.dev local dev server is running
required signing/event keys are set
```
