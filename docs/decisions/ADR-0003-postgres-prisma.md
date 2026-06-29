# ADR-0003: Use PostgreSQL + Prisma as the Primary Database Layer

Status: Accepted  
Date: 2026-06-29

## Context

Pango’s core data is relational and financial:

```txt
Accounts
Properties
Units
Tenants
Tenancies
Invoices
Payments
Receipts
MaintenanceRequests
Expenses
Reports
AuditLogs
```

The product needs strong consistency, reporting, relational constraints, transaction support, and a durable migration workflow.

## Decision

Use PostgreSQL as the primary database and Prisma as the ORM/migration layer.

## Consequences

Benefits:

- Strong fit for relational rental data.
- Good reporting capabilities.
- Transaction support for payment workflows.
- Type-safe Prisma client.
- Migration history through Prisma Migrate.
- Easier future data exports and admin reporting.

Trade-offs:

- Requires schema and migration discipline.
- Some PostgreSQL-specific constraints may require raw SQL migrations.
- Real-time features require additional tooling later.

## Alternatives Considered

### Convex

Not chosen as primary database for MVP. It is strong for reactive real-time apps but Pango’s MVP is centered on financial records, invoices, payments, receipts, and reports.

### MongoDB/document database

Not chosen because the core data is relational and reporting-heavy.

### Supabase-only stack

Possible alternative, but current decision keeps auth/storage/provider choices more modular.
