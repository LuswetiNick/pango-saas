# API and Backend Entry Points Overview

Status: Draft baseline  
Audience: Developers, API designers, AI agents  
Last updated: 2026-06-29

## Purpose

This document defines how UI, webhooks, background jobs, and future clients interact with the Pango backend.

## Backend Entry Point Strategy

Use:

```txt
Server Actions for authenticated UI mutations
Route Handlers for webhooks, uploads, health checks, and future HTTP endpoints
Worker jobs for scheduled and retryable workflows
Domain services for business logic
```

## Core Rule

```txt
Entry points are adapters.
Business workflows live in packages/domain.
```

## Standard Server Action Flow

```txt
UI form/button
  → Server Action
    → resolve actor/account context
    → validate input with Zod
    → call domain service
    → revalidate affected paths
    → return ActionResult
```

## Standard Route Handler Flow

```txt
HTTP request
  → Route Handler
    → validate request
    → authenticate/verify provider if needed
    → store raw payload if needed
    → enqueue job or call domain service
    → return JSON response
```

## Standard Worker Job Flow

```txt
Job/event received
  → worker handler
    → validate event payload
    → call domain service
    → rely on service idempotency
    → log result
```

## Action Result Format

```ts
type ActionResult<T = undefined> =
  | {
      ok: true;
      data?: T;
      message?: string;
    }
  | {
      ok: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };
```

## HTTP JSON Response Format

Success:

```json
{
  "ok": true,
  "data": {}
}
```

Error:

```json
{
  "ok": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please fix the highlighted fields.",
    "details": {}
  }
}
```

## Actor Context

Every authenticated operation should resolve an actor.

```ts
type ActorContext = {
  userId: string;
  accountId?: string;
  role: "LANDLORD" | "TENANT" | "ADMIN" | "SUPPORT";
};
```

Rules:

```txt
Never trust client-provided accountId.
Landlord actions require account membership.
Tenant actions require tenant ownership.
Admin actions require ADMIN or SUPPORT role.
Sensitive admin actions must be audit logged.
```

## MVP Server Actions

### Properties

```txt
createPropertyAction
updatePropertyAction
deactivatePropertyAction
```

### Units

```txt
createUnitAction
updateUnitAction
updateUnitStatusAction
```

### Tenants and Tenancies

```txt
createTenantWithTenancyAction
endTenancyAction
resendTenantInviteAction
```

### Invoices

```txt
generateInvoiceAction
cancelInvoiceAction
```

### Payments

```txt
recordManualPaymentAction
reversePaymentAction
initiateMpesaPaymentAction
```

### Maintenance

```txt
createMaintenanceRequestAction
updateMaintenanceStatusAction
addMaintenanceExpenseAction
```

### Reports

```txt
exportRentCollectionReportAction
exportArrearsReportAction
exportTaxReadinessReportAction
```

### Admin

```txt
adminAddSupportNoteAction
adminMarkWebhookReviewedAction
adminSuspendAccountAction
```

## MVP Route Handlers

| Endpoint | Method | Auth | Purpose |
|---|---:|---|---|
| `/api/health` | GET | Public | Health check |
| `/api/webhooks/mpesa` | POST | Provider verification | Receive M-Pesa callback |
| `/api/uploads/presign` | POST | User auth | Generate upload URL |
| `/api/internal/jobs/generate-invoices` | POST | Secret header | Optional internal trigger |
| `/api/internal/jobs/send-reminders` | POST | Secret header | Optional internal trigger |

## M-Pesa Webhook Rule

The M-Pesa webhook route must be thin.

```txt
Receive payload
Validate basic shape
Store RawWebhookEvent
Enqueue process-mpesa-callback job
Return 200 quickly
```

Do not apply payments, generate receipts, or send notifications directly inside the webhook route.

## Background Jobs

| Job | Trigger | Purpose |
|---|---|---|
| `generate-monthly-invoices` | Daily schedule | Create invoices for due tenancies |
| `mark-overdue-invoices` | Daily schedule | Mark unpaid invoices overdue |
| `send-rent-reminders` | Schedule/event | Send SMS reminders |
| `process-mpesa-callback` | Webhook event | Process payment callback idempotently |
| `generate-receipt` | `payment.completed` | Generate receipt document |
| `send-monthly-summary` | Monthly schedule | Send landlord summary |

## Error Codes

```txt
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
VALIDATION_ERROR
DUPLICATE_RECORD
ACTIVE_TENANCY_EXISTS
INVOICE_ALREADY_PAID
PAYMENT_ALREADY_RECORDED
EXTERNAL_PROVIDER_ERROR
```

Errors returned to users should be safe and should not expose database stack traces or provider secrets.
