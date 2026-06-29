# Security Model

Status: Draft baseline  
Audience: Developers, security reviewers, AI agents  
Last updated: 2026-06-29

## Purpose

This document defines the minimum security model for Pango MVP.

Pango handles personal data, tenant records, rental payments, receipts, maintenance records, and reports. The system must prioritize tenant isolation, account-scoped access, payment integrity, and auditability.

## Security Principles

```txt
Default deny.
Authenticate every protected route.
Authorize every protected action.
Never trust client-provided accountId.
Scope every business query by accountId.
Keep financial records auditable.
Make payment callbacks idempotent.
Log sensitive admin activity.
Do not collect unnecessary sensitive data in MVP.
```

## Roles

```txt
LANDLORD
TENANT
ADMIN
SUPPORT
```

## Landlord Access Rule

A landlord can access resources only if:

```txt
resource.accountId === actor.accountId
```

Queries must use `id + accountId`, not `id` alone.

Good:

```ts
where: {
  id: invoiceId,
  accountId: actor.accountId,
}
```

Bad:

```ts
where: {
  id: invoiceId,
}
```

## Tenant Access Rule

A tenant can only access records linked to their tenant profile/user.

Tenant must not access:

```txt
landlord dashboard
other tenant records
account-wide reports
admin routes
```

## Admin Access Rule

Admin users can inspect support records but must not silently modify financial records.

Admin actions that inspect or affect sensitive data must be audit logged.

## Data Classification

### Public

```txt
Marketing page content
Public documentation
```

### Internal

```txt
Support notes
Internal audit logs
Operational metrics
```

### Confidential

```txt
Tenant names
Phone numbers
Email addresses
Tenancy records
Maintenance requests
Receipts
Payment history
```

### Sensitive

```txt
M-Pesa references
Payment provider payloads
Authentication IDs
Provider API keys
Future national ID or screening documents
```

MVP should avoid collecting national ID copies, payslips, bank statements, and tenant screening documents.

## Payment Security

Payment workflows must enforce:

```txt
Idempotency
Duplicate receipt prevention
Duplicate M-Pesa receipt prevention
Amount mismatch detection
Raw webhook storage
Audit logging
Transaction-safe invoice updates
```

Webhook routes must:

```txt
Validate basic payload shape
Store raw event
Return quickly
Process business logic in worker
Handle duplicates safely
```

## File Upload Security

File uploads must enforce:

```txt
Authenticated upload request
Allowed file types
Maximum file size
Private storage by default
Randomized storage keys
No direct trust of client-provided filenames
```

## Secrets Management

Rules:

```txt
Never commit secrets.
Use environment variables.
Use separate credentials per environment.
Restrict production secrets to production.
Rotate keys after suspected exposure.
```

## Audit Logging Requirements

Audit at minimum:

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
admin.webhook_reviewed
```

## Common Threats

| Threat | Mitigation |
|---|---|
| Landlord accesses another landlord’s data | Account-scoped queries and tests |
| Tenant sees another tenant’s records | Tenant ownership checks |
| Fake payment callback | Provider validation, raw event storage, idempotency |
| Duplicate payment recording | Unique references and idempotency keys |
| Receipt tampering | Immutable receipt records |
| Admin silently edits financial data | Audit logs and correction policy |
| Sensitive document leakage | Avoid collecting sensitive docs in MVP |
| File upload abuse | Type/size limits and private storage |

## Security Review Checklist

Before beta:

```txt
[ ] Protected routes require authentication
[ ] Server Actions verify authorization
[ ] Route Handlers verify provider/internal auth
[ ] All business queries are account-scoped
[ ] Tenant portal isolation tested
[ ] Payment workflows tested for duplicates
[ ] M-Pesa callback idempotency tested
[ ] File upload restrictions implemented
[ ] Secrets are not committed
[ ] Audit logs exist for sensitive actions
```
