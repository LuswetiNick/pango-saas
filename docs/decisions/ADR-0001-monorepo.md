# ADR-0001: Use a pnpm + Turborepo Monorepo

Status: Accepted  
Date: 2026-06-29

## Context

Pango will start with a web app and worker app, but may later add a mobile app, public API, AI assistant, real-time chat, and additional integrations. The project needs shared domain logic, validation, types, utilities, and provider adapters across multiple runtimes.

## Decision

Use a monorepo with `pnpm` workspaces and Turborepo.

Initial structure:

```txt
apps/web
apps/worker
packages/domain
packages/db
packages/validators
packages/auth
packages/events
packages/integrations
packages/ui
packages/utils
packages/config
```

## Consequences

Benefits:

- Shared business logic across web, worker, and future API/mobile apps.
- Easier refactoring.
- Consistent validation and types.
- Centralized CI/CD.
- Better context for AI coding agents.

Trade-offs:

- Requires workspace discipline.
- Requires clear dependency boundaries.
- Tooling setup is slightly more complex than a single app repository.

## Alternatives Considered

### Single Next.js repository

Rejected because it would make future worker/mobile/API extraction harder.

### Multiple repositories

Rejected because it would add coordination overhead too early.
