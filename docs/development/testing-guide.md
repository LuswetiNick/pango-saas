# Testing Guide

Status: Draft baseline  
Audience: Developers, QA, AI agents  
Last updated: 2026-06-29

## Purpose

This document defines the testing strategy for Pango MVP.

Pango handles rent, payments, receipts, and tenant records. Tests must prioritize financial correctness, authorization, idempotency, and tenant isolation.

## Test Types

### Unit Tests

Use unit tests for pure business logic and calculations.

Test:

```txt
invoice status calculation
payment application
partial payment behavior
receipt idempotency
billing month formatting
money parsing/formatting
phone normalization
permission policies
```

### Integration Tests

Use integration tests for workflows involving the database.

Test:

```txt
create property
create unit
create tenant with tenancy
generate invoice
record manual payment
create receipt
mark invoice overdue
send reminder log
create maintenance request
```

### Route Handler Tests

Use route tests for webhooks and HTTP endpoints.

Test:

```txt
health endpoint returns ok
M-Pesa webhook stores raw event
invalid webhook is rejected or quarantined
duplicate webhook does not duplicate payment
upload presign endpoint requires auth
```

### End-to-End Tests

Use E2E tests for critical user journeys.

Test:

```txt
landlord signs up
creates property
creates unit
adds tenant
generates invoice
records payment
sees receipt
views arrears dashboard
tenant submits maintenance request
landlord updates maintenance status
```

## Critical Financial Test Cases

### Manual Payment

```txt
full payment marks invoice PAID
partial payment marks invoice PARTIALLY_PAID
payment cannot exceed invoice balance unless credit support exists
payment cannot be recorded on cancelled invoice
duplicate M-Pesa receipt number is blocked
```

### M-Pesa Callback

```txt
successful callback creates payment
duplicate callback does not duplicate payment
failed callback marks transaction failed
cancelled callback marks transaction cancelled
amount mismatch is flagged for review
missing invoice is flagged for review
```

### Receipt

```txt
receipt generated after payment.completed
same payment does not create multiple receipts
receipt remains immutable
reversed payment marks receipt reversed instead of deleting it
```

### Invoice Generation

```txt
active tenancy generates invoice on due day
duplicate job run does not create duplicate invoice
inactive tenancy does not generate invoice
billing month is stored consistently
```

## Authorization Tests

Every sensitive query/mutation must be tested for tenant isolation.

Test:

```txt
landlord cannot access another landlord’s property
landlord cannot access another landlord’s invoice
landlord cannot record payment for another account’s invoice
tenant cannot see another tenant’s receipts
tenant cannot access landlord dashboard
admin-only route rejects non-admin users
```

## Minimum Test Coverage Before Beta

The following workflows must have tests before beta:

```txt
create tenant with tenancy
monthly invoice generation
manual payment recording
partial payments
receipt generation
arrears calculation
rent reminders
M-Pesa callback processing if enabled
permission checks for landlord and tenant access
```

## Test Data

Seed data should include:

```txt
Demo landlord account
One property: Kasarani Heights
Three units: A1, A2, B1
Two tenants: Aisha Mohamed, Brian Otieno
One paid invoice
One partially paid invoice
One overdue invoice
One maintenance request
```

## Definition of Done for Tests

A feature is not done unless:

```txt
Unit tests cover business rules
Integration tests cover DB workflow where relevant
Authorization checks are tested
Idempotency is tested for jobs/webhooks
Error states are tested
CI passes
```
