# AI Agent Context

Status: Active baseline  
Audience: AI coding agents, developers supervising AI agents  
Last updated: 2026-06-29

## Purpose

This document gives AI coding agents stable context for developing Pango. Agents must follow these rules unless a human maintainer explicitly changes the architecture.

## Product Summary

Pango is a landlord-first rental operations SaaS for the Kenyan market.

The MVP helps landlords:

```txt
create properties and units
add tenants
create tenancies
set rent schedules
generate invoices
record payments
issue receipts
track arrears
send reminders
manage maintenance
log expenses
export reports
```

## MVP Boundary

Do not implement these unless explicitly requested:

```txt
Public marketplace
Google Maps listing search
Tenant applications
Tenant screening
National ID verification
Payslip or bank statement upload
E-signature leases
Caretaker accounts
WhatsApp Business API
AI assistant
Real-time chat
Native mobile app
Agency white-label
Deposit escrow
```

## Architecture

Use:

```txt
Monorepo
Modular monolith
Next.js web app
Worker app
PostgreSQL + Prisma
Domain package for business logic
Server Actions for UI mutations
Route Handlers for webhooks/HTTP endpoints
Background jobs for scheduled/retryable work
```

## Required Package Boundaries

Business logic must be implemented in:

```txt
packages/domain
```

Database schema/client belongs in:

```txt
packages/db
```

Validation schemas belong in:

```txt
packages/validators
```

External providers belong in:

```txt
packages/integrations
```

Do not put business logic inside:

```txt
React components
Next.js pages
Server Actions
Route Handlers
Worker handlers
```

These entry points should call domain services.

## Critical Rules

### Authorization

Never trust client-provided `accountId`.

Always resolve actor/account context server-side.

Every landlord query must be scoped by account.

Every tenant query must be scoped to the tenant’s own records.

### Financial Workflows

Payment and invoice updates must be transactional.

Do not create a completed payment without updating the invoice balance.

Do not generate duplicate receipts.

Do not silently edit receipts.

### Idempotency

These must be idempotent:

```txt
invoice generation
M-Pesa callback processing
receipt generation
scheduled rent reminders
manual M-Pesa payment reference recording
```

### Audit Logs

Write audit logs for:

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

## Preferred Implementation Pattern

Server Action:

```txt
resolve actor
validate input
call domain service
revalidate path
return ActionResult
```

Domain Service:

```txt
check permissions
load account-scoped records
apply business rules
run transaction if needed
emit event if needed
write audit log if needed
return result
```

Worker Job:

```txt
validate event
call domain service
rely on idempotency
log outcome
```

Route Handler:

```txt
validate request
store raw payload if webhook
enqueue job
return quickly
```

## Forbidden Shortcuts

AI agents must not:

```txt
Call Prisma directly from React components
Trust accountId from form data
Bypass domain services
Skip authorization checks
Skip validation
Skip tests for payment/invoice changes
Implement out-of-scope MVP features
Collect sensitive tenant documents in MVP
Modify financial records without audit logs
Put long-running M-Pesa processing inside webhook route
```

## Definition of Done for AI Tasks

A task is complete only when:

```txt
Code follows package boundaries
Validation is implemented
Authorization is enforced
Tests are added or updated
Financial workflows are transactional if needed
Idempotency is handled if applicable
Audit logs are added where applicable
Docs are updated if behavior changes
Lint/typecheck/tests pass
```
