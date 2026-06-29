# Pango Engineering Workspace

Status: Active baseline  
Audience: Developers, reviewers, AI coding agents  
Last updated: 2026-06-29

## Purpose

Pango is a landlord-first rental operations SaaS for the Kenyan market. The MVP focuses on helping landlords manage properties, units, tenants, invoices, payments, receipts, arrears, reminders, maintenance requests, expenses, and tax-readiness reports.

This repository should be built as a production-ready monorepo using a modular monolith architecture. The goal is to move fast without creating a system that becomes difficult to extend when features such as real-time chat, AI assistants, public APIs, or a mobile app are added later.

## Architecture Summary

```txt
Monorepo
  apps/web       Next.js web app for landlord, tenant, and admin dashboards
  apps/worker    Background jobs for invoices, reminders, callbacks, receipts

  packages/domain        Business logic and use cases
  packages/db            Prisma schema, migrations, database client
  packages/validators    Zod input schemas
  packages/auth          Actor context, roles, permission helpers
  packages/events        Domain event contracts and publisher
  packages/integrations  M-Pesa, SMS, email, storage, AI adapters
  packages/ui            Shared web UI components
  packages/utils         Money, dates, phone, idempotency helpers
  packages/config        Shared TypeScript, ESLint, Tailwind config
```

## Key Engineering Rules

1. Keep business logic in `packages/domain`, not in React components, Server Actions, or Route Handlers.
2. Server Actions are adapters for authenticated UI mutations.
3. Route Handlers are adapters for webhooks, uploads, health checks, and future HTTP APIs.
4. Worker jobs should call domain services instead of duplicating business logic.
5. Every business record must be account-scoped.
6. Never trust client-provided `accountId`.
7. Payment, invoice, receipt, and reversal workflows must use database transactions where required.
8. M-Pesa callbacks, receipt generation, invoice generation, and scheduled reminders must be idempotent.
9. Receipts are immutable financial records.
10. Admin support actions must create audit logs.

## Getting Started

```bash
pnpm install
cp .env.example .env.local
docker compose up -d
pnpm db:migrate
pnpm db:seed
pnpm dev
```

## Common Commands

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm db:migrate
pnpm db:deploy
pnpm db:studio
pnpm db:seed
```

## Documentation Index

Start here:

- `docs/README.md`
- `docs/product/mvp-scope.md`
- `docs/product/user-flows.md`
- `docs/architecture/system-overview.md`
- `docs/architecture/domain-boundaries.md`
- `docs/database/schema-overview.md`
- `docs/api/api-overview.md`
- `docs/development/getting-started.md`
- `docs/development/coding-standards.md`
- `docs/development/testing-guide.md`
- `docs/devops/ci-cd.md`
- `docs/security/security-model.md`
- `docs/ai/ai-agent-context.md`
- `docs/decisions/`
