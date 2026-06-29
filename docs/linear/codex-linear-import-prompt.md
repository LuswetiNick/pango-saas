# Codex Prompt: Import Pango MVP Backlog into Linear

## Purpose

Use this prompt with Codex CLI after Linear MCP has been configured. Codex should read the local Pango documentation and Linear backlog files, then create or reuse the Linear team, projects, labels, and issues for the Pango MVP.

## Before Running This Prompt

Make sure Linear MCP is configured in Codex CLI:

```bash
codex mcp add linear --url https://mcp.linear.app/mcp
codex mcp login linear
```

Make sure these files exist in the repository:

```txt
docs/linear/linear-backlog.md
docs/linear/linear-issues.csv
```

Then run Codex from the repository root:

```bash
codex
```

Paste or reference this file in Codex:

```txt
Read docs/linear/codex-linear-import-prompt.md and execute the task.
```

---

# Task Prompt for Codex

You are working inside the Pango repository.

You have access to Linear through MCP. Your task is to create the initial Linear project structure, labels, docs references, and MVP backlog for Pango.

## Important Safety Rules

- Do not create duplicates.
- Before creating any team, project, label, or issue, search Linear first.
- If an item already exists, reuse it instead of creating a duplicate.
- Create items in phases.
- After each phase, summarize what was created, reused, skipped, or failed.
- If you are unsure about a destructive action, do not perform it.
- Do not delete or archive anything.
- Do not invite users or manage team members.
- Do not expose secrets or API tokens.
- Do not modify the local source code except for writing an import summary file under `docs/linear/import-results.md`.

## Project Context

Pango is a landlord-first rental management SaaS for the Kenyan market. The MVP helps landlords manage properties, units, tenants, rent invoices, manual payments, receipts, arrears, reminders, maintenance requests, reports, and tax-readiness records.

## Architecture Context

- Monorepo using pnpm workspaces and Turborepo.
- Next.js App Router for the web app.
- PostgreSQL and Prisma for the database.
- Domain logic lives in `packages/domain`.
- Database schema/client lives in `packages/db`.
- Zod schemas live in `packages/validators`.
- Shared UI lives in `packages/ui`.
- Background jobs live in `apps/worker`.
- Server Actions are used for authenticated UI mutations.
- Route Handlers are used for webhooks, uploads, health checks, and future HTTP APIs.
- Business logic must not live inside React components or route handlers.

## Read These Local Files First

Read the following files before creating Linear items:

```txt
docs/linear/linear-backlog.md
docs/linear/linear-issues.csv
docs/README.md
docs/product/mvp-scope.md
docs/product/user-flows.md
docs/architecture/system-overview.md
docs/architecture/domain-boundaries.md
docs/database/schema-overview.md
docs/api/api-overview.md
docs/development/getting-started.md
docs/development/coding-standards.md
docs/development/testing-guide.md
docs/devops/ci-cd.md
docs/security/security-model.md
docs/ai/ai-agent-context.md
```

If any of these files are missing, continue with the files that exist and mention the missing files in the final summary.

## Goal

Create a clean Linear workspace setup for the Pango MVP so a small engineering team can start working from a clear, organized backlog.

## Preferred Linear Team

- Team name: `Pango Engineering`
- Team key: `PNG`

If a matching team already exists, use it.

If creating a team is not supported by the available Linear MCP tools, find the closest existing engineering/product team and ask me which team to use before creating issues.

## Create or Reuse These Linear Projects

### 1. Foundation and Collaboration Setup

Purpose: Repository setup, monorepo scaffold, CI, documentation, coding standards, and team collaboration foundation.

### 2. Database, Auth, and Multi-Tenancy

Purpose: PostgreSQL, Prisma, core data model, authentication, roles, account-scoped access, and tenant isolation.

### 3. Landlord Rent Roll

Purpose: Property, unit, tenant, and tenancy management for landlords.

### 4. Invoices and Manual Payments

Purpose: Invoice generation, manual payment recording, partial payments, invoice balances, and receipt generation.

### 5. Arrears, Notifications, and Reports

Purpose: Overdue invoice detection, arrears dashboard, reminders, rent collection reports, tenant statements, and tax-readiness reports.

### 6. Tenant Portal and Maintenance

Purpose: Tenant access, tenant dashboard, maintenance requests, maintenance status tracking, and maintenance attachments.

### 7. Admin, Security, and Beta Hardening

Purpose: Admin support tools, audit logs, security checks, beta readiness, and production-hardening tasks.

### 8. M-Pesa STK Push Scaffold

Purpose: Payment transaction model, STK Push initiation, callback route, callback worker, idempotency, and reconciliation scaffolding.

## Create or Reuse These Labels

### Product Area Labels

```txt
area: docs
area: devops
area: architecture
area: database
area: auth
area: rent-roll
area: invoices
area: payments
area: receipts
area: notifications
area: reports
area: maintenance
area: tenant-portal
area: admin
area: security
area: mpesa
area: ai-agents
```

### Work Type Labels

```txt
type: feature
type: chore
type: bug
type: docs
type: refactor
type: test
type: spike
```

### Risk Labels

```txt
risk: financial
risk: security
risk: data-integrity
risk: integration
```

## Priority Guidance

- Urgent: Blocks project setup or prevents safe development.
- High: Required for MVP core flow.
- Medium: Important but not blocking the first rent loop.
- Low: Nice-to-have or later hardening.

## MVP Build Sequence

1. Foundation and repo setup.
2. Database, auth, and multi-tenancy.
3. Property and unit management.
4. Tenant and tenancy management.
5. Invoice generation.
6. Manual payment recording.
7. Receipt generation.
8. Arrears dashboard.
9. Notifications and reports.
10. Tenant portal and maintenance.
11. Admin/security hardening.
12. M-Pesa STK Push scaffold.

---

# Execution Plan

## Phase 1: Inspect Linear

- Search for existing teams related to Pango.
- Search for existing projects with the names listed above.
- Search for existing labels listed above.
- Search for existing Pango issues.
- Return a short summary of what exists.
- Do not create anything until the inspection is complete.

## Phase 2: Create or Reuse Team, Projects, and Labels

- Use or create the `Pango Engineering` team if supported.
- Create missing projects.
- Create missing labels.
- Reuse existing items where possible.
- Do not create issues yet.
- Summarize created and reused items.

## Phase 3: Import Issues from CSV

- Read `docs/linear/linear-issues.csv`.
- For each issue row, map it to the correct Linear project.
- Apply relevant labels.
- Set priority based on the CSV or inferred priority.
- Use the issue title and description from the CSV.
- Before creating each issue, search for an existing issue with the same or very similar title in the Pango team.
- If an existing issue is found, skip creation and note it as reused/skipped.
- Create at most 10 issues at a time.
- After every batch of 10 issues, summarize progress before continuing.

If the CSV does not include all required fields, infer sensible values using the project context and documentation. Do not invent unrelated features outside the MVP.

## Issue Description Format

Each Linear issue should include:

```md
## Summary

Briefly explain the task.

## Context

Explain why this matters for Pango.

## Scope

- What should be implemented or documented.
- What should not be included.

## Acceptance Criteria

- Clear checklist of done conditions.

## Technical Notes

Mention relevant packages, apps, or docs.

## Related Docs

List local docs paths where relevant.
```

## Related Docs Mapping

### Foundation Issues

```txt
README.md
docs/README.md
docs/development/getting-started.md
docs/devops/ci-cd.md
docs/ai/ai-agent-context.md
```

### Architecture Issues

```txt
docs/architecture/system-overview.md
docs/architecture/domain-boundaries.md
docs/development/coding-standards.md
```

### Database/Auth Issues

```txt
docs/database/schema-overview.md
docs/security/security-model.md
docs/architecture/domain-boundaries.md
```

### API/Backend Issues

```txt
docs/api/api-overview.md
docs/architecture/domain-boundaries.md
docs/development/coding-standards.md
```

### Product/User Flow Issues

```txt
docs/product/mvp-scope.md
docs/product/user-flows.md
```

### Testing Issues

```txt
docs/development/testing-guide.md
```

### Security/Admin Issues

```txt
docs/security/security-model.md
```

### AI-Agent Issues

```txt
docs/ai/ai-agent-context.md
```

---

# Phase 4: Create Repo-Side Import Summary

After the Linear setup is complete, create or update:

```txt
docs/linear/import-results.md
```

The file should contain:

```md
# Linear Import Results

Date:
Workspace:
Team used:

## Projects

- Created:
- Reused:
- Failed:

## Labels

- Created:
- Reused:
- Failed:

## Issues

- Created:
- Reused/skipped:
- Failed:

## Notes

Mention any missing files, unsupported MCP actions, permission issues, or manual follow-up tasks.

## Recommended Next Steps

List what I should do manually in Linear.
```

---

# Final Response Requirements

When done, provide:

1. The Linear team used.
2. Projects created/reused.
3. Number of labels created/reused.
4. Number of issues created/reused/skipped/failed.
5. Path to the local import summary file.
6. Any manual actions I need to take.

Do not create users, invite teammates, delete items, archive items, or change workspace settings.
