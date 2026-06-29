# Core User Flows

Status: Accepted baseline  
Audience: Product, engineering, QA, AI agents  
Last updated: 2026-06-29

## Purpose

This document defines the core workflows for Pango MVP. These flows drive the database schema, API design, UI routes, service boundaries, background jobs, and tests.

## Primary Flow Map

```txt
LANDLORD
  ├── Sign up
  ├── Create property
  ├── Create units
  ├── Add tenant
  ├── Assign tenant to unit
  ├── Set rent schedule
  ├── Generate invoice
  ├── Record payment or trigger M-Pesa
  ├── View arrears
  ├── Send reminders
  ├── Manage maintenance
  └── Export reports

TENANT
  ├── Accept invite
  ├── View rent due
  ├── View payment history
  ├── Download receipts
  └── Submit maintenance request

ADMIN
  ├── View accounts
  ├── Inspect payment issues
  ├── Inspect failed webhooks/jobs
  ├── Add support notes
  └── Review audit logs
```

## Flow 1: Landlord Signup

### Happy Path

1. Landlord visits Pango.
2. Clicks “Start free”.
3. Enters name, phone number, email, and authentication details.
4. System creates user.
5. System creates landlord account/workspace.
6. System creates membership with role `LANDLORD`.
7. User lands on onboarding.
8. Empty state prompts landlord to create first property.

### Required Records

- `User`
- `Account`
- `Membership`

### Acceptance Criteria

- User has an active account.
- User has landlord membership.
- Dashboard queries are scoped to account.

## Flow 2: Create Property

1. Landlord clicks “Add property”.
2. Enters property name, area, type, optional address/notes.
3. System creates property under current account.
4. User is prompted to add first unit.

### Acceptance Criteria

- Property belongs to current account.
- Client-provided `accountId` is ignored.
- Audit log is written.

## Flow 3: Create Unit

1. Landlord opens property.
2. Clicks “Add unit”.
3. Enters unit number/name, rent amount, deposit, status.
4. System creates unit under property.
5. Unit appears in rent-roll table.

### Acceptance Criteria

- Unit belongs to property and account.
- Rent amount is stored as integer minor units.
- Unit name is unique within property.

## Flow 4: Add Tenant and Tenancy

1. Landlord opens vacant unit.
2. Clicks “Add tenant”.
3. Enters tenant name, phone, optional email.
4. Sets move-in date, rent amount, deposit, payment due day.
5. System creates or reuses tenant record.
6. System creates tenancy.
7. System creates rent schedule.
8. Unit status becomes `OCCUPIED`.

### Acceptance Criteria

- Unit has only one active tenancy.
- Due day is between 1 and 28.
- Tenant phone is normalized.
- Operation is transactional.

## Flow 5: Generate Invoice

### Automatic

1. Daily job runs.
2. System finds active tenancies due today.
3. System checks for duplicate invoice for billing month.
4. System creates invoice with status `OPEN`.

### Manual

1. Landlord opens tenant/unit page.
2. Clicks “Create invoice”.
3. Selects billing month and amount.
4. System creates invoice if no duplicate exists.

### Acceptance Criteria

- Idempotent by `accountId:tenancyId:billingMonth`.
- One invoice per tenancy per billing month.
- Invoice amount is copied from rent schedule at creation time.

## Flow 6: Record Manual Payment

1. Landlord opens invoice.
2. Clicks “Record payment”.
3. Enters amount, method, payment date, optional M-Pesa receipt number.
4. System creates payment.
5. System applies payment to invoice.
6. System updates invoice status and balance.
7. System emits `payment.completed` event.
8. Receipt job generates receipt.

### Acceptance Criteria

- Payment and invoice update are transactional.
- Partial payments are supported.
- Duplicate M-Pesa receipt numbers are blocked.
- Receipt generation is idempotent.

## Flow 7: M-Pesa STK Push

1. Tenant or landlord initiates M-Pesa payment.
2. System creates `PaymentTransaction` with status `PENDING`.
3. System calls payment provider.
4. Provider sends callback to webhook endpoint.
5. Webhook stores raw event and enqueues worker job.
6. Worker validates callback and applies payment if successful.
7. Receipt is generated.

### Acceptance Criteria

- Webhook route is thin and fast.
- Callback processing is idempotent.
- Duplicate callbacks do not create duplicate payments.
- Amount mismatches are flagged for review.

## Flow 8: Arrears Detection

1. Daily job checks unpaid invoices past due date.
2. System marks invoices `OVERDUE`.
3. Landlord arrears dashboard shows tenant, unit, balance, days overdue.

### Acceptance Criteria

- Arrears are derived from invoices and payments.
- Paid/cancelled invoices are ignored.

## Flow 9: Send Rent Reminder

1. Landlord clicks “Send reminder” or scheduled job runs.
2. System re-checks invoice status.
3. If unpaid, SMS is sent.
4. Notification log is created.

### Acceptance Criteria

- No reminders for paid invoices.
- No duplicate reminder for same invoice/reminder stage/day.
- SMS failures are logged.

## Flow 10: Maintenance Request

1. Tenant submits maintenance request.
2. Landlord receives notification.
3. Landlord updates status.
4. Optional expense is linked to request.

### Acceptance Criteria

- Tenant can only create request for active tenancy.
- Landlord can only view account-scoped requests.

## Flow 11: Reports

1. Landlord opens reports.
2. Selects date range and optional property.
3. System shows gross rent received, arrears, expenses, tenant statements, and tax-readiness estimate.
4. Landlord exports CSV/PDF where supported.

### Acceptance Criteria

- Tax-readiness uses completed gross rent payments.
- Expenses do not reduce tax-readiness estimate.

## Flow 12: Admin Support

1. Admin opens admin dashboard.
2. Searches account.
3. Inspects payments, webhooks, notifications, and audit logs.
4. Adds support note.

### Acceptance Criteria

- Admin access is restricted.
- Admin inspection actions are audit logged.
- Admin cannot silently edit financial records.
