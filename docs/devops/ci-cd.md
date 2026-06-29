# CI/CD and Environment Guide

Status: Draft baseline  
Audience: Developers, DevOps, AI agents  
Last updated: 2026-06-29

## Purpose

This document defines the CI/CD workflow and environment strategy for Pango.

## Environments

| Environment | Purpose | Database | Payment Mode |
|---|---|---|---|
| Local | Developer machine | Local Postgres or dev branch | Mock/sandbox |
| Preview | Pull request deployments | Preview DB branch | Mock/sandbox |
| Staging | Production-like testing | Staging DB | Sandbox |
| Production | Live users | Production DB | Live/approved provider |

## Branching Strategy

Use trunk-based development with feature branches.

```txt
main          production-ready
feature/*     feature work
fix/*         bug fixes
chore/*       maintenance
docs/*        documentation changes
```

Rules:

```txt
No direct commits to main.
All changes go through pull requests.
CI must pass before merge.
Schema changes require migrations.
Major architectural decisions require ADRs.
```

## Pull Request Checklist

```txt
[ ] Summary added
[ ] Screenshots added for UI changes
[ ] Tests added or reason documented
[ ] Lint passes
[ ] Typecheck passes
[ ] Build passes
[ ] Prisma migration included if schema changed
[ ] Docs updated if behavior changed
[ ] No secrets committed
[ ] Authorization reviewed
[ ] Financial workflows reviewed if touched
```

## CI Workflow

On pull request:

```txt
Install dependencies
Check formatting
Run lint
Run typecheck
Run unit tests
Validate Prisma schema
Generate Prisma client
Run migration check
Build affected apps/packages
```

Recommended jobs:

```txt
install
lint
typecheck
test
prisma-validate
build
```

## Preview Deployment

On pull request:

```txt
Deploy apps/web preview
Use preview environment variables
Use isolated preview database where possible
Post preview URL to PR
```

## Staging Deployment

On merge to `main` or manually triggered:

```txt
Run full CI
Apply migrations to staging
Deploy web app
Deploy worker
Run smoke tests
```

## Production Deployment

Production deploy requires:

```txt
CI success
Migration review
Rollback plan
Manual approval for high-risk releases
```

Sequence:

```txt
Run CI
Verify backup/PITR
Apply migrations
Deploy web
Deploy worker
Run smoke tests
Monitor logs/errors
```

## Database Migration Rules

```txt
Never edit old migrations after merge.
Every schema change must include a migration.
Review generated SQL before merge.
Use raw SQL for PostgreSQL partial indexes where needed.
Production migrations should be backward-compatible when possible.
```

Commands:

```bash
pnpm db:migrate
pnpm db:deploy
pnpm db:studio
```

## Secrets Management

Rules:

```txt
Never commit secrets.
Only commit .env.example.
Use separate credentials per environment.
Production M-Pesa credentials only exist in production.
Rotate secrets after suspected exposure.
```

## Smoke Tests

After deployment, verify:

```txt
GET /api/health returns ok
Login works
Dashboard loads
Create property works
Create unit works
Generate invoice works
Record manual payment works
Receipt is generated
Worker job health is visible
Sentry/logs are receiving events
```

## Rollback Rules

For application-only failure:

```txt
Rollback app deployment.
Verify health endpoint.
Monitor logs.
```

For migration-related failure:

```txt
Stop deploy.
Assess whether migration is reversible.
Restore from backup only if necessary.
Document incident.
```

Never run destructive database rollback casually in production.
