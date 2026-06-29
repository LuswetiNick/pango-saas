# Pango Linear Backlog Setup

Status: Draft
Audience: Founder, developers, AI coding agents

## Purpose

This document provides a Linear-ready project structure for Pango MVP. It organizes the MVP into projects, milestones, issues, labels, priorities, estimates, and linked documentation references.

## Recommended Linear Workspace Structure

### Team

Create one team first:

- **Pango Engineering**
- Suggested team key: `PNG`

Later, if the team grows, split into:

- Product
- Web
- Platform
- QA

For now, one engineering team is simpler.

## Suggested Labels

Create these labels in Linear:

- `area:docs`
- `area:devops`
- `area:architecture`
- `area:database`
- `area:auth`
- `area:domain`
- `area:ui`
- `area:payments`
- `area:invoices`
- `area:notifications`
- `area:reports`
- `area:maintenance`
- `area:admin`
- `area:security`
- `type:feature`
- `type:chore`
- `type:bug`
- `type:research`
- `priority:critical`
- `mvp`
- `blocked`

## Suggested Cycles / Milestones

Use weekly or two-week cycles. For a small team, two-week cycles are easier.

1. **Cycle 1 — Project Foundation**
2. **Cycle 2 — Data Model and Auth**
3. **Cycle 3 — Landlord Rent Roll**
4. **Cycle 4 — Invoices and Manual Payments**
5. **Cycle 5 — Arrears, Receipts, Notifications**
6. **Cycle 6 — Tenant Portal and Maintenance**
7. **Cycle 7 — Reports, Admin, Beta Hardening**
8. **Cycle 8 — M-Pesa STK Push Scaffold**

## Suggested Projects

### Project 1 — Foundation and Collaboration Setup

Goal: Set up the monorepo, documentation, CI, branch strategy, and team collaboration baseline.

Issues:

1. **Scaffold Pango monorepo using shadcn monorepo template**
   - Priority: High
   - Labels: `type:chore`, `area:architecture`, `mvp`
   - Estimate: 2
   - Description: Initialize the Pango repository using the shadcn monorepo template, pnpm workspaces, and Turborepo. Ensure `apps/web` and `packages/ui` work correctly.
   - Acceptance Criteria:
     - Monorepo initializes locally.
     - `pnpm install` succeeds.
     - `pnpm dev` runs the web app.
     - README and docs folder are committed.

2. **Add Pango domain package structure**
   - Priority: High
   - Labels: `type:chore`, `area:architecture`, `area:domain`, `mvp`
   - Estimate: 2
   - Description: Add `packages/domain`, `packages/db`, `packages/validators`, `packages/auth`, `packages/events`, `packages/integrations`, and `packages/utils`.
   - Acceptance Criteria:
     - Each package has `package.json`, `src/index.ts`, and TypeScript config.
     - Imports follow workspace alias conventions.

3. **Configure root scripts and Turborepo pipeline**
   - Priority: High
   - Labels: `type:chore`, `area:devops`, `mvp`
   - Estimate: 2
   - Acceptance Criteria:
     - Root scripts exist for `dev`, `build`, `lint`, `typecheck`, `format`, and `format:check`.
     - Turborepo tasks are configured.

4. **Set up initial GitHub Actions CI**
   - Priority: High
   - Labels: `type:chore`, `area:devops`, `mvp`
   - Estimate: 2
   - Acceptance Criteria:
     - CI runs on PRs and pushes to `main`.
     - CI checks install, format, lint, typecheck, and build.
     - Prisma checks are not added until Prisma is installed.

5. **Configure branch protection and PR workflow**
   - Priority: Medium
   - Labels: `type:chore`, `area:devops`, `mvp`
   - Estimate: 1
   - Acceptance Criteria:
     - `main` is protected.
     - PRs are required before merge.
     - CI must pass before merge.

6. **Add minimum coding documentation set**
   - Priority: High
   - Labels: `type:chore`, `area:docs`, `mvp`
   - Estimate: 1
   - Acceptance Criteria:
     - Docs exist under `docs/`.
     - Root README links to the documentation index.

### Project 2 — Database, Auth, and Multi-Tenancy

Goal: Implement the foundational data and access-control model.

Issues:

1. **Install and configure Prisma package**
   - Priority: High
   - Labels: `type:chore`, `area:database`, `mvp`
   - Estimate: 2
   - Acceptance Criteria:
     - `packages/db` contains Prisma schema.
     - `pnpm db:validate` works.
     - `pnpm db:generate` works.

2. **Create initial Prisma schema for Pango MVP**
   - Priority: High
   - Labels: `type:feature`, `area:database`, `mvp`
   - Estimate: 5
   - Acceptance Criteria:
     - Models exist for User, Account, Membership, Property, Unit, Tenant, Tenancy, RentSchedule, Invoice, Payment, Receipt, MaintenanceRequest, Expense, NotificationLog, RawWebhookEvent, AuditLog.
     - Money fields use integer minor units.
     - Account-scoped tables include `accountId`.

3. **Add database seed script**
   - Priority: Medium
   - Labels: `type:chore`, `area:database`, `mvp`
   - Estimate: 2
   - Acceptance Criteria:
     - Seed creates demo landlord account, properties, units, tenants, invoices, partial payment, and maintenance request.

4. **Implement actor context and permission helpers**
   - Priority: High
   - Labels: `type:feature`, `area:auth`, `area:security`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Current user/account can be resolved server-side.
     - Client-provided `accountId` is never trusted.
     - Landlord, tenant, and admin access helpers exist.

5. **Configure authentication provider**
   - Priority: High
   - Labels: `type:feature`, `area:auth`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Landlord can sign up/sign in.
     - Session is available server-side.
     - New landlord creates an account/workspace.

### Project 3 — Landlord Rent Roll

Goal: Allow landlords to model their rental business.

Issues:

1. **Build landlord dashboard shell**
   - Priority: High
   - Labels: `type:feature`, `area:ui`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Dashboard layout exists.
     - Navigation includes Overview, Properties, Tenants, Invoices, Payments, Maintenance, Reports, Settings.

2. **Implement property creation flow**
   - Priority: High
   - Labels: `type:feature`, `area:domain`, `area:ui`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Landlord can create property.
     - Property is account-scoped.
     - Audit log is written.

3. **Implement unit creation flow**
   - Priority: High
   - Labels: `type:feature`, `area:domain`, `area:ui`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Landlord can create units under property.
     - Unit has rent amount, deposit, and status.
     - Unit names are unique per property.

4. **Implement tenant and tenancy creation flow**
   - Priority: High
   - Labels: `type:feature`, `area:domain`, `mvp`
   - Estimate: 5
   - Acceptance Criteria:
     - Landlord can add tenant.
     - Tenant can be assigned to a unit.
     - Active tenancy and rent schedule are created.
     - Unit becomes occupied.
     - Active tenancy uniqueness is enforced.

5. **Build rent roll table**
   - Priority: Medium
   - Labels: `type:feature`, `area:ui`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Landlord can view properties, units, tenant assignment, rent amount, and status.

### Project 4 — Invoices and Manual Payments

Goal: Build the first complete rent operations loop without relying on live M-Pesa.

Issues:

1. **Implement invoice generation service**
   - Priority: High
   - Labels: `type:feature`, `area:invoices`, `area:domain`, `mvp`
   - Estimate: 5
   - Acceptance Criteria:
     - Invoice can be generated for active tenancy.
     - Duplicate invoice for same tenancy/billing month is blocked.
     - Invoice amount copies current rent schedule.

2. **Build invoice list and detail pages**
   - Priority: High
   - Labels: `type:feature`, `area:invoices`, `area:ui`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Landlord can see invoices by status, tenant, property, unit, amount, due date, and balance.

3. **Implement manual payment recording service**
   - Priority: High
   - Labels: `type:feature`, `area:payments`, `area:domain`, `mvp`
   - Estimate: 5
   - Acceptance Criteria:
     - Landlord can record M-Pesa manual, cash, bank, or other payment.
     - Payment updates invoice amount paid, balance, and status transactionally.
     - Duplicate M-Pesa references are blocked.

4. **Build payment recording UI**
   - Priority: High
   - Labels: `type:feature`, `area:payments`, `area:ui`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Payment form validates amount, method, date, and reference.
     - Partial payments are supported.

5. **Implement receipt generation service**
   - Priority: High
   - Labels: `type:feature`, `area:payments`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Receipt is generated for completed payment.
     - Receipt number is unique.
     - Receipt is immutable.

### Project 5 — Arrears, Notifications, and Reports

Goal: Make Pango useful after invoices and payments are recorded.

Issues:

1. **Build arrears dashboard**
   - Priority: High
   - Labels: `type:feature`, `area:invoices`, `area:ui`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Landlord can see overdue and partially paid invoices.
     - Arrears show tenant, unit, amount due, due date, and days overdue.

2. **Implement overdue invoice job**
   - Priority: High
   - Labels: `type:feature`, `area:invoices`, `area:devops`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Daily job marks open/partial invoices as overdue when past due.
     - Paid/cancelled invoices are ignored.

3. **Implement SMS notification abstraction**
   - Priority: Medium
   - Labels: `type:feature`, `area:notifications`, `area:integrations`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Notification provider interface exists.
     - Mock provider works locally.
     - NotificationLog records attempts.

4. **Implement manual rent reminder**
   - Priority: Medium
   - Labels: `type:feature`, `area:notifications`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Landlord can send reminder for unpaid invoice.
     - Reminder is not sent for paid invoice.
     - Duplicate reminder for same invoice/day is blocked.

5. **Build rent collection report**
   - Priority: Medium
   - Labels: `type:feature`, `area:reports`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Report shows completed payments by date range and property.

6. **Build tax-readiness report**
   - Priority: Medium
   - Labels: `type:feature`, `area:reports`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Report uses gross completed rent payments.
     - Expenses do not reduce tax estimate.
     - UI includes tax-readiness disclaimer.

### Project 6 — Tenant Portal and Maintenance

Goal: Give tenants lightweight self-service and maintenance reporting.

Issues:

1. **Implement tenant portal shell**
   - Priority: Medium
   - Labels: `type:feature`, `area:ui`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Tenant can access home, payments, receipts, and maintenance pages.
     - Tenant cannot access landlord dashboard.

2. **Implement tenant balance view**
   - Priority: Medium
   - Labels: `type:feature`, `area:payments`, `area:ui`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Tenant sees current unpaid invoices and payment history.

3. **Implement tenant receipt view**
   - Priority: Medium
   - Labels: `type:feature`, `area:payments`, `mvp`
   - Estimate: 2
   - Acceptance Criteria:
     - Tenant can view/download issued receipts.

4. **Implement maintenance request creation**
   - Priority: Medium
   - Labels: `type:feature`, `area:maintenance`, `mvp`
   - Estimate: 4
   - Acceptance Criteria:
     - Tenant can submit maintenance request for active tenancy.
     - Request includes title, category, description, optional attachment.

5. **Build landlord maintenance queue**
   - Priority: Medium
   - Labels: `type:feature`, `area:maintenance`, `area:ui`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Landlord can view, filter, and update maintenance request statuses.

### Project 7 — Admin, Security, and Beta Hardening

Goal: Make the app supportable for beta landlords.

Issues:

1. **Build admin dashboard shell**
   - Priority: Medium
   - Labels: `type:feature`, `area:admin`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Admin can view accounts, users, payments, and webhook events.

2. **Implement audit log viewer**
   - Priority: Medium
   - Labels: `type:feature`, `area:admin`, `area:security`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - Admin can inspect sensitive actions.
     - Financial actions are visible in audit logs.

3. **Add Sentry/error monitoring**
   - Priority: Medium
   - Labels: `type:chore`, `area:devops`, `area:security`, `mvp`
   - Estimate: 2
   - Acceptance Criteria:
     - Web app reports errors to Sentry in staging/production.

4. **Add security review checklist**
   - Priority: Medium
   - Labels: `type:chore`, `area:security`, `area:docs`, `mvp`
   - Estimate: 1
   - Acceptance Criteria:
     - Checklist covers tenant isolation, account scoping, payments, receipts, file uploads, and admin actions.

5. **Create beta release checklist**
   - Priority: Medium
   - Labels: `type:chore`, `area:docs`, `mvp`
   - Estimate: 1
   - Acceptance Criteria:
     - Checklist covers environment variables, database migrations, seed data, smoke tests, backups, and rollback.

### Project 8 — M-Pesa STK Push Scaffold

Goal: Prepare M-Pesa integration without blocking manual-payment MVP.

Issues:

1. **Create payment provider abstraction**
   - Priority: Medium
   - Labels: `type:feature`, `area:payments`, `area:integrations`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - PaymentProvider interface exists.
     - Mock provider exists.
     - Domain code does not directly depend on Daraja.

2. **Add PaymentTransaction model and service**
   - Priority: Medium
   - Labels: `type:feature`, `area:payments`, `area:database`, `mvp`
   - Estimate: 3
   - Acceptance Criteria:
     - External payment attempts can be recorded.
     - CheckoutRequestID uniqueness is enforced.

3. **Build M-Pesa callback route handler**
   - Priority: Medium
   - Labels: `type:feature`, `area:payments`, `area:integrations`, `mvp`
   - Estimate: 4
   - Acceptance Criteria:
     - Callback route stores raw webhook payload.
     - Callback route enqueues processing job.
     - Route does not perform full payment application inline.

4. **Build M-Pesa callback processor job**
   - Priority: Medium
   - Labels: `type:feature`, `area:payments`, `area:devops`, `mvp`
   - Estimate: 5
   - Acceptance Criteria:
     - Callback is processed idempotently.
     - Successful callback creates payment and applies it to invoice.
     - Failed/cancelled callback updates transaction status.

## Recommended Linear Documents

Create these as Linear docs or link to repo docs:

1. **Pango MVP Scope**
   - Source: `docs/product/mvp-scope.md`
   - Purpose: Defines what is in and out of the MVP.

2. **Pango Core User Flows**
   - Source: `docs/product/user-flows.md`
   - Purpose: Defines landlord, tenant, admin workflows.

3. **Pango System Architecture**
   - Source: `docs/architecture/system-overview.md`
   - Purpose: Explains monorepo, modular monolith, domain package, worker, and Postgres setup.

4. **Pango Domain Boundaries**
   - Source: `docs/architecture/domain-boundaries.md`
   - Purpose: Defines package/module ownership and dependency rules.

5. **Pango API Overview**
   - Source: `docs/api/api-overview.md`
   - Purpose: Defines Server Actions, Route Handlers, and backend contracts.

6. **Pango Database Schema Overview**
   - Source: `docs/database/schema-overview.md`
   - Purpose: Defines core data models and transaction rules.

7. **Pango AI Agent Context**
   - Source: `docs/ai/ai-agent-context.md`
   - Purpose: Gives AI agents the stable context and constraints for coding tasks.

## Recommended Project Links

Once the GitHub repo exists, add these links to Linear project docs:

- GitHub repo
- Vercel project
- Production URL
- Staging URL
- Sentry project
- Database provider dashboard
- Pango docs directory

