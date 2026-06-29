# System Overview

Status: Accepted baseline  
Audience: Developers, DevOps, AI agents  
Last updated: 2026-06-29

## Purpose

This document explains Pango’s system architecture for the MVP and the extension path for future features such as mobile, AI, real-time chat, and public APIs.

## Architecture Decision

Use a monorepo with a modular monolith, not microservices.

```txt
Monorepo
  apps/web       Next.js UI + Server Actions + Route Handlers
  apps/worker    Background jobs

  packages/domain        Business logic
  packages/db            Prisma/Postgres
  packages/validators    Shared validation
  packages/auth          Actor and permissions
  packages/events        Event contracts and publisher
  packages/integrations  External provider adapters
  packages/ui            Shared UI
  packages/utils         Common helpers
```

## High-Level Flow

```txt
User
  → apps/web
    → Server Action or Route Handler
      → packages/domain
        → packages/db
        → packages/events
        → packages/integrations
          → M-Pesa / SMS / Email / Storage

Scheduled or retryable work
  → apps/worker
    → packages/domain
```

## Key Principle

Next.js is the first delivery adapter, not the architecture itself. Business logic must remain framework-independent inside `packages/domain`.

## Runtime Components

### `apps/web`

Responsible for:

- Marketing pages.
- Authentication screens.
- Landlord dashboard.
- Tenant portal.
- Admin dashboard.
- Server Actions for UI mutations.
- Route Handlers for webhooks, uploads, and health checks.

### `apps/worker`

Responsible for:

- Monthly invoice generation.
- Overdue invoice marking.
- Scheduled reminders.
- M-Pesa callback processing.
- Receipt generation.
- Monthly summaries.

### `packages/domain`

Responsible for:

- Core business use cases.
- Permission enforcement at domain level.
- Transaction workflows.
- Financial rules.
- Audit logging triggers.
- Domain event emission.

### `packages/db`

Responsible for:

- Prisma schema.
- Migrations.
- Prisma client.
- Seed scripts.

### `packages/integrations`

Responsible for external provider adapters:

- Daraja/Pesapal payment provider.
- Africa’s Talking SMS provider.
- Resend email provider.
- R2/S3 storage provider.
- Future AI provider.

## Data Store

Use one PostgreSQL database for the MVP. Do not split databases by module.

The database uses shared tables with account-scoped rows:

```txt
Account
  ├── Properties
  ├── Units
  ├── Tenants
  ├── Tenancies
  ├── Invoices
  ├── Payments
  ├── Receipts
  ├── MaintenanceRequests
  ├── Expenses
  ├── NotificationLogs
  ├── RawWebhookEvents
  └── AuditLogs
```

## Future Extension Path

### Mobile App

Add:

```txt
apps/mobile
apps/api
```

Mobile should call `apps/api`; API should call `packages/domain`.

### Real-Time Chat

Add:

```txt
packages/domain/chat
packages/realtime
```

Chat can consume domain events, but payments and invoices must not depend on chat.

### AI Assistant

Add:

```txt
packages/ai
```

AI tools must call domain services and use the same permission model as the web app.

### Public API

Add:

```txt
apps/api
```

Expose versioned endpoints only when agencies, integrations, or mobile clients require them.

## Do Not Use in MVP

```txt
Microservices
Kubernetes
Kafka
Separate database per module
Direct Prisma calls from React components
Business logic inside Route Handlers
Business logic inside Server Actions
```
