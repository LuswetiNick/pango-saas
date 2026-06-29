# Database Schema Overview

Status: Draft baseline  
Audience: Developers, DB reviewers, AI agents  
Last updated: 2026-06-29

## Purpose

This document defines the MVP database model for Pango. The schema supports landlord rent operations, manual payments, future M-Pesa payments, receipts, arrears, maintenance, reports, notifications, webhooks, and audit logs.

## Database Decision

Use:

```txt
PostgreSQL
Prisma ORM
Single shared database
Account-scoped multi-tenancy
```

## Core Ownership Model

```txt
User
  └── Membership
        └── Account
              ├── Properties
              ├── Units
              ├── Tenants
              ├── Tenancies
              ├── RentSchedules
              ├── Invoices
              ├── Payments
              ├── PaymentTransactions
              ├── Receipts
              ├── MaintenanceRequests
              ├── Expenses
              ├── NotificationLogs
              ├── RawWebhookEvents
              └── AuditLogs
```

## Multi-Tenancy Rule

Every business table should include `accountId` unless there is a strong reason not to.

Examples:

```txt
Property.accountId
Unit.accountId
Tenant.accountId
Tenancy.accountId
Invoice.accountId
Payment.accountId
Receipt.accountId
MaintenanceRequest.accountId
Expense.accountId
NotificationLog.accountId
AuditLog.accountId
```

Never trust client-provided `accountId`. Resolve account context server-side.

## Money Rule

Store money as integer minor units using `BigInt`.

```txt
KES 35,000.00 → 3,500,000 minor units
```

Do not use floating-point values for money.

## Key Models

### `User`

Represents a person who can authenticate.

Fields:

```txt
id
externalAuthId
name
email
phone
status
createdAt
updatedAt
```

### `Account`

Represents a landlord workspace.

Fields:

```txt
id
name
slug
status
createdAt
updatedAt
```

### `Membership`

Connects users to accounts with roles.

Roles:

```txt
LANDLORD
ADMIN
SUPPORT
```

### `Property`

A rental property owned/managed by an account.

Fields:

```txt
id
accountId
name
area
address
propertyType
notes
isActive
```

### `Unit`

A rentable unit under a property.

Statuses:

```txt
VACANT
OCCUPIED
MAINTENANCE
INACTIVE
```

Important constraints:

```txt
Unit name should be unique per property.
```

### `Tenant`

A tenant contact/profile under an account.

Fields:

```txt
id
accountId
userId optional
fullName
phone
email optional
notes
```

Constraint:

```txt
Unique tenant phone per account.
```

### `Tenancy`

The active or historical relationship between tenant and unit.

Statuses:

```txt
ACTIVE
ENDED
TERMINATED
PENDING
```

Important rule:

```txt
One active tenancy per unit.
```

Use a PostgreSQL partial unique index for this rule.

### `RentSchedule`

Defines rent amount and due day for a tenancy.

Fields:

```txt
amountMinor
dueDay
startDate
endDate
isActive
```

Due day should be between 1 and 28 for MVP.

### `Invoice`

Represents a rent obligation for a billing month.

Statuses:

```txt
DRAFT
OPEN
PARTIALLY_PAID
PAID
OVERDUE
CANCELLED
```

Important constraints:

```txt
Unique invoice number per account.
Unique tenancy + billingMonth.
```

### `PaymentTransaction`

Represents an external payment attempt, such as M-Pesa STK Push.

Statuses:

```txt
PENDING
SUCCESS
FAILED
CANCELLED
EXPIRED
REVIEW_REQUIRED
```

### `Payment`

Represents actual money received and applied to an invoice.

Methods:

```txt
MPESA_MANUAL
MPESA_STK
CASH
BANK_TRANSFER
OTHER
```

### `Receipt`

Represents proof of payment.

Rule:

```txt
Receipts are immutable financial records.
```

### `MaintenanceRequest`

Represents a tenant issue.

Statuses:

```txt
OPEN
IN_PROGRESS
WAITING_ON_PARTS
RESOLVED
CLOSED
CANCELLED
```

### `Expense`

Represents a landlord-recorded expense for management reporting.

Note: Expenses are for management reporting and should not reduce tax-readiness gross rent calculations.

### `NotificationLog`

Records SMS/email/in-app/WhatsApp notification attempts.

### `RawWebhookEvent`

Stores incoming webhook payloads before processing.

### `AuditLog`

Records sensitive business and admin actions.

## Required Transaction Boundaries

### Tenant Assignment

```txt
Create or reuse tenant
Create tenancy
Create rent schedule
Update unit status to OCCUPIED
Write audit log
```

### Manual Payment

```txt
Create payment
Update invoice amountPaidMinor
Update invoice balanceMinor
Update invoice status
Emit payment.completed event
Write audit log
```

### M-Pesa Callback Success

```txt
Mark transaction SUCCESS
Create payment
Apply payment to invoice
Emit payment.completed event
Write audit log
```

### Receipt Generation

```txt
Check existing receipt by paymentId
Generate receipt number
Create receipt
Generate document
Update storage fields
```

## Idempotency Requirements

| Workflow | Idempotency Key |
|---|---|
| Invoice generation | `accountId:tenancyId:billingMonth` |
| M-Pesa callback | `CheckoutRequestID` or `MpesaReceiptNumber` |
| Receipt generation | `paymentId` |
| Scheduled reminder | `invoiceId:reminderStage:date` |
| Manual M-Pesa payment | `accountId:mpesaReceiptNumber` |

## Reporting Rules

Tax-readiness reports should use completed gross rent payments. Expenses should not reduce the tax-readiness estimate.

Management reports may show:

```txt
rent collected - expenses = management net view
```

But this must not be labelled as tax calculation.
