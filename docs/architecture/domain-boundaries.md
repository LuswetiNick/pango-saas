# Domain Boundaries

Status: Accepted baseline  
Audience: Developers, reviewers, AI agents  
Last updated: 2026-06-29

## Purpose

This document defines Pango’s domain boundaries and dependency rules. It exists to keep the codebase scalable and maintainable as the project grows.

## Core Rule

```txt
Business logic lives in packages/domain.
Application adapters call domain services.
Shared packages must not depend on apps/web.
```

## Bounded Contexts

### Accounts

Owns:

- Account/workspace records.
- Memberships.
- Roles.
- Account status.

### Properties and Units

Owns:

- Property records.
- Unit records.
- Unit status.
- Rent-roll views.

### Tenants and Tenancies

Owns:

- Tenant contact records.
- Active/historical tenancy records.
- Rent schedule setup.
- Tenant assignment and move-out workflows.

### Invoices

Owns:

- Monthly rent invoice generation.
- Invoice status.
- Billing month rules.
- Due date rules.
- Arrears derivation.

### Payments

Owns:

- Manual payment recording.
- M-Pesa transaction attempts.
- Payment application to invoices.
- Payment reversals.
- Idempotency checks.

### Receipts

Owns:

- Receipt numbering.
- Receipt generation.
- Receipt immutability.
- Receipt reversal status.

### Maintenance

Owns:

- Maintenance requests.
- Maintenance statuses.
- Maintenance attachments.
- Maintenance-linked expenses.

### Reports

Owns:

- Rent collection report.
- Arrears report.
- Tenant statement.
- Expense report.
- Tax-readiness report.

### Notifications

Owns:

- SMS/email sending requests.
- Notification logs.
- Reminder duplicate prevention.

### Audit

Owns:

- Audit log creation.
- Sensitive action tracking.

## Dependency Rules

### Allowed

```txt
apps/web → packages/domain
apps/web → packages/validators
apps/web → packages/auth
apps/web → packages/ui
apps/web → packages/utils

apps/worker → packages/domain
apps/worker → packages/events
apps/worker → packages/integrations

packages/domain → packages/db
packages/domain → packages/auth
packages/domain → packages/events
packages/domain → packages/integrations
packages/domain → packages/validators
packages/domain → packages/utils
```

### Forbidden

```txt
packages/domain → apps/web
packages/domain → React
packages/domain → Next.js
packages/db → apps/web
packages/validators → apps/web
React component → Prisma
Server Action → complex financial workflow inline
Route Handler → long-running business workflow inline
Worker job → duplicate payment logic
```

## Adapter Pattern

Entry points are adapters:

```txt
Server Action
  → validate input
  → resolve actor
  → call domain service

Route Handler
  → validate request
  → store raw event if needed
  → enqueue job or call service

Worker Job
  → call domain service
```

## Service Pattern

Domain services should:

1. Accept an `ActorContext` where user permissions matter.
2. Validate permissions or call a policy function.
3. Load required records using account-scoped queries.
4. Run business rules.
5. Use transactions for multi-write workflows.
6. Emit domain events for side effects.
7. Write audit logs for sensitive changes.

## Example Domain Service Responsibility

`recordManualPayment()` owns:

```txt
Check actor can manage payments
Load invoice by invoiceId + accountId
Validate invoice is payable
Check duplicate external reference
Create payment
Update invoice paid amount and balance
Update invoice status
Emit payment.completed
Write audit log
```

No UI component, Server Action, Route Handler, or worker should duplicate this logic.
