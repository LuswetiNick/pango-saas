# Coding Standards

Status: Draft baseline  
Audience: Developers, reviewers, AI agents  
Last updated: 2026-06-29

## Purpose

This document defines coding standards for Pango. The goal is to keep the codebase consistent, testable, scalable, and safe for financial workflows.

## Core Principles

```txt
Keep business logic out of UI.
Keep domain code framework-independent.
Use account-scoped queries everywhere.
Never trust client-provided accountId.
Use transactions for financial workflows.
Use events for background side effects.
Make payment callbacks idempotent.
Keep receipts immutable.
Document architectural decisions.
Optimize correctness before cleverness.
```

## SOLID Guidelines

### Single Responsibility

Each file/module should have one clear reason to change.

Good:

```txt
invoice.service.ts         invoice workflows
invoice.calculator.ts      invoice calculations
invoice.policy.ts          invoice permissions
invoice.types.ts           invoice-specific types
```

Bad:

```txt
invoice.service.ts contains UI formatting, SMS sending, Prisma calls, and React components
```

### Open/Closed

Use provider interfaces for external services.

```ts
interface SmsProvider {
  sendSms(input: SendSmsInput): Promise<SendSmsResult>;
}
```

Then implement:

```txt
AfricasTalkingSmsProvider
MockSmsProvider
FutureWhatsAppProvider
```

### Interface Segregation

Prefer small interfaces.

Good:

```txt
SmsProvider
EmailProvider
StorageProvider
PaymentProvider
```

Avoid one giant provider interface.

### Dependency Inversion

Domain services should depend on interfaces or adapter abstractions, not hardcoded vendor APIs.

## Naming Conventions

### Files

```txt
*.service.ts       business logic
*.policy.ts        permissions and access rules
*.types.ts         domain-specific types
*.schema.ts        Zod validation schemas
*.actions.ts       Next.js Server Actions
*.queries.ts       read/query helpers
*.route.ts         Route Handler files
```

### Functions

Use verb-first names:

```txt
createProperty
createUnit
createTenantWithTenancy
generateInvoiceForTenancy
recordManualPayment
applyPaymentToInvoice
generateReceiptForPayment
sendRentReminder
```

### Events

Use past-tense domain event names:

```txt
invoice.created
invoice.overdue
payment.completed
receipt.generated
maintenance.created
maintenance.status_changed
```

## Server Actions

Server Actions should:

1. Resolve actor/account context.
2. Parse and validate input.
3. Call a domain service.
4. Revalidate affected paths.
5. Return `ActionResult`.

Server Actions should not:

```txt
Contain complex business workflows
Call external providers directly
Perform payment reconciliation inline
Bypass domain services
Trust client-provided accountId
```

## Route Handlers

Route Handlers should:

1. Validate request.
2. Authenticate or verify provider when needed.
3. Store raw payload if needed.
4. Enqueue worker job for long-running work.
5. Return quickly.

Webhook handlers must be thin.

## Domain Services

Domain services should:

1. Accept an `ActorContext` where permissions matter.
2. Validate permissions through policy functions.
3. Query by `id + accountId`.
4. Use transactions for multi-write workflows.
5. Emit events for side effects.
6. Write audit logs where needed.

## Database Access

Do not call Prisma directly from React components.

Preferred flow:

```txt
React component
  → Server Action/query
    → domain service
      → packages/db
```

## Money Handling

Rules:

```txt
Store money as BigInt integer minor units.
Never use floats for money.
Use shared money utilities for parsing and formatting.
```

## Date Handling

Rules:

```txt
Store timestamps in UTC.
Display dates in EAT.
Use YYYY-MM for billingMonth.
Due day must be 1–28 for MVP.
```

## Error Handling

Use typed application errors.

```ts
class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}
```

Do not expose raw provider/database errors to users.

## Audit Logging

Audit these events at minimum:

```txt
property.created
unit.created
tenant.created
tenancy.created
invoice.created
payment.recorded
payment.reversed
receipt.generated
maintenance.status_changed
admin.account_viewed
admin.payment_reviewed
```

## AI Agent Rules

AI agents must not:

```txt
Put business logic in React components
Call Prisma directly from UI
Bypass domain services
Trust client-provided accountId
Silently edit financial records
Add out-of-scope marketplace/chat/AI/mobile features without approval
```
