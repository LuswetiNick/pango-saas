# MVP Scope

Status: Accepted  
Audience: Product, engineering, AI agents  
Last updated: 2026-06-29

## Purpose

This document defines the Pango MVP boundary. It prevents overbuilding and keeps the first release focused on landlord rent operations.

## Product Definition

Pango MVP is a landlord-first rental operations SaaS for Kenya.

It allows landlords to:

- Create properties and units.
- Add tenants.
- Assign tenants to units through tenancy records.
- Set rent schedules.
- Generate monthly invoices.
- Record or process payments.
- Issue receipts.
- Track partial payments.
- Detect arrears.
- Send rent reminders.
- Manage maintenance requests.
- Log expenses.
- Export rent and tax-readiness reports.

## Primary User

Independent Kenyan landlord managing 5–50 residential units.

## Secondary Users

- Tenant: lightweight portal user.
- Admin: internal Pango support/operator user.

## Core MVP Promise

```txt
Know who has paid, who has not, send rent reminders, issue receipts, and keep clean rental records.
```

## In Scope

### Authentication and Account Management

- Landlord signup.
- Tenant invite access.
- Admin access.
- Role-based access control.
- Account-scoped data access.

### Property and Unit Management

- Create property.
- Create units under property.
- Unit status: `VACANT`, `OCCUPIED`, `MAINTENANCE`, `INACTIVE`.
- Rent-roll table.

### Tenant and Tenancy Management

- Add tenant name, phone, and optional email.
- Assign tenant to unit.
- Create active tenancy.
- Set rent amount and due day.
- Optional lease PDF upload.
- End tenancy.

### Invoices

- Manual invoice generation.
- Scheduled monthly invoice generation.
- Invoice statuses: `OPEN`, `PARTIALLY_PAID`, `PAID`, `OVERDUE`, `CANCELLED`.
- Duplicate invoice prevention.

### Payments and Receipts

- Manual M-Pesa payment recording.
- Cash, bank transfer, and other manual payment recording.
- Partial payment support.
- Invoice balance updates.
- Receipt generation.
- M-Pesa STK Push support if ready.
- M-Pesa callback processing if ready.

### Arrears and Reminders

- Arrears dashboard.
- Overdue invoice detection.
- Manual reminders.
- Scheduled reminders on day 1, day 3, and day 5 after due date.

### Maintenance and Expenses

- Tenant maintenance request.
- Landlord maintenance queue.
- Status updates.
- Optional maintenance expense.

### Reports

- Rent collection report.
- Arrears report.
- Tenant statement.
- Expense report.
- Tax-readiness report based on gross rent received.

### Admin Support

- Account inspection.
- Payment/webhook inspection.
- Support notes.
- Audit logs.

## Explicitly Out of MVP

```txt
Public property marketplace
Google Maps listing search
Tenant applications
Tenant screening
National ID verification
Payslip or bank statement upload
E-signature lease automation
Caretaker accounts
WhatsApp Business API
AI assistant
Real-time chat
Native mobile app
Agency white-label
Deposit escrow
```

The architecture should support these future features, but they must not be implemented in the MVP unless the scope is formally changed.

## MVP Success Metrics

| Metric | Target |
|---|---:|
| Beta landlords onboarded | 10 |
| Units created | 100+ |
| Tenants added | 80+ |
| Rent invoices generated | 100+ |
| Rent payments recorded or processed | KES 500,000+ |
| Receipts generated | 50+ |
| Maintenance requests logged | 20+ |
| Paid conversion after trial | 30%+ |
| Time to first property setup | < 10 minutes |
| Time to first invoice/reminder | < 20 minutes |

## MVP Product Loop

```txt
Create rent roll
→ generate invoice
→ receive or record payment
→ issue receipt
→ detect arrears
→ remind tenant
→ report rent collected
```

Everything in the MVP should support this loop.
