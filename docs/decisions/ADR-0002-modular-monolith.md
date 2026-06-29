# ADR-0002: Use a Modular Monolith Instead of Microservices

Status: Accepted  
Date: 2026-06-29

## Context

Pango needs to move quickly while maintaining correctness for payments, invoices, receipts, arrears, and reports. The team does not yet have scale pressure requiring independent services.

Microservices would introduce distributed transactions, service-to-service authentication, separate deployments, network failure handling, and extra infrastructure before product validation.

## Decision

Use a modular monolith for the MVP.

Business modules will be separated inside `packages/domain`, but they will share one PostgreSQL database and one core deployment architecture.

## Consequences

Benefits:

- Faster development.
- Easier debugging.
- Stronger consistency for financial workflows.
- Simpler local development.
- Lower infrastructure overhead.

Trade-offs:

- Requires discipline to maintain boundaries.
- Modules are not independently deployable.
- Future extraction may be needed if scale/team boundaries demand it.

## Extraction Rule

Only extract a service later if at least one is true:

```txt
A separate team owns it
It needs independent scaling
It has different reliability requirements
It needs a different database
It has a significantly different deployment cadence
```

## Alternatives Considered

### Microservices from day one

Rejected as premature.

### Single unstructured app

Rejected because it would become hard to maintain and extend.
