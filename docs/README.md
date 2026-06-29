# Pango Documentation Index

Status: Active baseline  
Audience: Developers, AI agents, reviewers, product contributors  
Last updated: 2026-06-29

## Purpose

This folder contains the minimum documentation required to start coding Pango safely and consistently. These documents define the product scope, architecture, database model, API design, development standards, testing expectations, security rules, and AI-agent context.

## Minimum Coding Set

| Area | Document | Purpose |
|---|---|---|
| Product | `product/mvp-scope.md` | Defines what is in and out of the MVP |
| Product | `product/user-flows.md` | Defines the core landlord, tenant, and admin workflows |
| Architecture | `architecture/system-overview.md` | Explains the system architecture and deployment shape |
| Architecture | `architecture/domain-boundaries.md` | Defines package/module ownership and dependency rules |
| Database | `database/schema-overview.md` | Describes the core data model and financial constraints |
| API | `api/api-overview.md` | Defines Server Actions, Route Handlers, jobs, and response conventions |
| Development | `development/getting-started.md` | Local setup and first-run instructions |
| Development | `development/coding-standards.md` | Code style, SOLID rules, naming, module conventions |
| Development | `development/testing-guide.md` | Test strategy and expectations |
| DevOps | `devops/ci-cd.md` | CI/CD workflows, environments, release checks |
| Security | `security/security-model.md` | Access control, tenant isolation, payment safety, data rules |
| AI | `ai/ai-agent-context.md` | Stable context and rules for AI coding agents |
| Decisions | `decisions/*.md` | Architecture Decision Records |

## Documentation Maintenance Rules

1. Update documentation in the same PR as code changes when behavior, architecture, data model, or API contracts change.
2. Add an ADR for major decisions that affect long-term architecture.
3. Keep the MVP boundary clear. Do not silently add marketplace, AI, mobile, or chat features to the MVP.
4. If documentation and code disagree, treat it as a bug and resolve it quickly.
5. AI agents must read `docs/ai/ai-agent-context.md` before implementing tasks.
