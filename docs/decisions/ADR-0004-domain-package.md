# ADR-0004: Keep Business Logic in packages/domain

Status: Accepted  
Date: 2026-06-29

## Context

Pango starts with a Next.js web app, but future requirements may include a mobile app, AI assistant, public API, real-time chat, and additional workers. If business logic lives inside Next.js Server Actions or React components, future adapters will duplicate or rewrite critical workflows.

## Decision

All core business logic must live in `packages/domain`.

`apps/web`, `apps/worker`, and future `apps/api` are adapters that call domain services.

## Consequences

Benefits:

- Business logic is reusable across web, worker, API, mobile, and AI tools.
- Easier testing.
- Cleaner boundaries.
- Lower future migration overhead.
- Less risk of duplicate financial logic.

Trade-offs:

- Slightly more upfront structure.
- Developers must avoid shortcuts in Server Actions and Route Handlers.

## Rule

```txt
If a function changes business state, it probably belongs in packages/domain.
```

Examples:

```txt
createTenantWithTenancy
recordManualPayment
generateInvoiceForTenancy
applyPaymentToInvoice
generateReceiptForPayment
sendRentReminder
```
