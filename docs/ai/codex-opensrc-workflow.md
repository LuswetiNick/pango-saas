# Pango Codex + opensrc Workflow

Status: Active  
Audience: Developers, AI coding agents, reviewers  
Purpose: Define how Pango uses `opensrc` to give Codex current package source context before each implementation PR.

---

## 1. Why we use opensrc

Pango uses several fast-moving packages: Next.js, better-auth, Prisma, shadcn/ui, Turborepo, Zod, and testing tools. Codex should not rely only on memory when implementing features. Before each PR, Codex should fetch and inspect the actual source code or package implementation for the technologies used in that PR.

`opensrc` helps by fetching package source code and making it searchable locally so Codex can inspect real implementations, not just type definitions or outdated examples.

---

## 2. Install opensrc

Install globally:

```bash
npm install -g opensrc
```

Or use it through `npx`:

```bash
npx opensrc --help
```

---

## 3. General PR workflow

For every implementation PR, follow this pattern:

```txt
1. Identify packages relevant to the PR.
2. Use opensrc to fetch source context for those packages.
3. Ask Codex to inspect the fetched package source before making changes.
4. Ask Codex to summarize relevant APIs/patterns it found.
5. Implement only the PR scope.
6. Run lint, typecheck, tests, and build.
7. Update docs if implementation differs from the plan.
```

---

## 4. Source context rules for Codex

Codex must:

```txt
Read local project docs first.
Use opensrc for technologies directly touched by the PR.
Summarize the relevant package patterns before editing code.
Prefer official package source and local installed versions.
Avoid implementing from memory when source context is available.
Keep changes within the current PR scope.
```

Codex must not:

```txt
Fetch unrelated packages.
Copy large blocks of third-party source into Pango.
Bypass project architecture rules.
Implement future features outside the current PR.
Commit opensrc cache/source directories unless explicitly intended.
Expose tokens, secrets, or local environment values.
```

---

## 5. Suggested packages by PR

### PR 1: Database and auth package foundations

Relevant packages:

```txt
prisma
@prisma/client
typescript
turbo
zod
```

Focus:

```txt
Prisma schema/package setup
Prisma client export patterns
Monorepo TypeScript package exports
Turborepo package scripts
Zod validation conventions if validation stubs are added
```

### PR 2: better-auth setup

Relevant packages:

```txt
better-auth
@better-auth/prisma-adapter
@prisma/client
next
```

Focus:

```txt
better-auth server config
Prisma adapter usage
Next.js App Router route handler integration
Auth package boundaries
```

### PR 3: email/password auth pages

Relevant packages:

```txt
better-auth
next
react-hook-form
zod
@hookform/resolvers
```

Focus:

```txt
better-auth client APIs
form validation
safe client/server separation
Next.js form patterns
```

### PR 4: email OTP verification

Relevant packages:

```txt
better-auth
resend
zod
```

Focus:

```txt
better-auth email OTP plugin
email sending callback/provider pattern
OTP verification flow
safe error handling
```

### PR 5: workspace onboarding

Relevant packages:

```txt
better-auth
@better-auth/prisma-adapter
zod
next
```

Focus:

```txt
organization plugin
member roles
active organization/account context
server-side redirects
```

### PR 6: account context and redirects

Relevant packages:

```txt
better-auth
next
```

Focus:

```txt
server-side session validation
safe redirect helpers
protected Server Components
server actions
```

### PR 7: protected dashboard shell

Relevant packages:

```txt
next
@pango/ui
shadcn/ui-related packages
```

Focus:

```txt
Next.js route groups
Server Components
shared UI usage
protected dashboard rendering
```

### PR 8: audit log foundation

Relevant packages:

```txt
prisma
@prisma/client
zod
```

Focus:

```txt
append-only audit model
transaction-safe audit writes
metadata typing
```

### PR 9: tests for auth/account helpers

Relevant packages:

```txt
vitest
@testing-library/react
next
zod
```

Focus:

```txt
unit testing helper functions
mocking auth context
redirect matrix tests
validation tests
```

---

## 6. Recommended commands

Fetch package sources:

```bash
opensrc fetch prisma
opensrc fetch @prisma/client
opensrc fetch better-auth
opensrc fetch @better-auth/prisma-adapter
opensrc fetch next
opensrc fetch zod
opensrc fetch turbo
```

List fetched sources:

```bash
opensrc list
```

Find source path for a package:

```bash
opensrc path better-auth
```

Search inside fetched source:

```bash
rg "organization" "$(opensrc path better-auth)"
rg "prismaAdapter" "$(opensrc path @better-auth/prisma-adapter)"
rg "toNextJsHandler" "$(opensrc path better-auth)"
```

Remove stale source when no longer needed:

```bash
opensrc remove better-auth
```

---

## 7. Git ignore rule

If opensrc creates a local source/cache folder inside the repository, keep it out of Git unless the team intentionally decides otherwise.

Add if needed:

```gitignore
opensrc/
.sources/
```

Do not commit downloaded third-party package source into the Pango repository.

---

## 8. PR 1 Codex prompt using opensrc

Use this prompt for PR 1:

```txt
Implement PR 1 only: Create Pango database and auth package foundations.

Before editing files, use opensrc for package context.

Step 1: Read local project docs:
- docs/README.md
- docs/product/mvp-scope.md
- docs/architecture/system-overview.md
- docs/architecture/domain-boundaries.md
- docs/database/schema-overview.md
- docs/development/coding-standards.md
- docs/ai/ai-agent-context.md

Step 2: Use opensrc to fetch and inspect relevant package source:
- prisma
- @prisma/client
- typescript
- turbo
- zod

Use commands such as:
- opensrc fetch prisma
- opensrc fetch @prisma/client
- opensrc fetch turbo
- opensrc fetch zod
- opensrc list
- opensrc path <package>

Then search the fetched sources for relevant patterns, especially:
- Prisma client creation and package export patterns
- Prisma schema conventions
- monorepo package script conventions
- TypeScript package exports
- Zod schema organization if validation stubs are touched

Step 3: Before implementing, summarize:
- which packages were fetched
- which source paths were inspected
- which relevant implementation patterns you found
- any assumptions you are making

Step 4: Implement only PR 1.

Context:
Pango is a landlord-first rental management SaaS. We are implementing authentication and onboarding in small steps. This first step should only create the database and auth package foundations. Do not implement better-auth yet. Do not implement sign-in, sign-up, onboarding UI, properties, units, tenants, invoices, payments, M-Pesa, reports, or maintenance.

Requirements:
1. Create packages/db if it does not exist.
2. Configure Prisma inside packages/db.
3. Create packages/db/prisma/schema.prisma.
4. Create packages/db/src/client.ts and packages/db/src/index.ts.
5. Add package.json scripts for db validation, generation, migration, deploy, and studio.
6. Create packages/auth if it does not exist.
7. Add packages/auth/src/actor.ts with ActorContext and AppRole types.
8. Add packages/auth/src/roles.ts with role constants/helpers.
9. Add packages/auth/src/permissions.ts with basic permission helper stubs.
10. Add packages/auth/src/index.ts exports.
11. Update pnpm workspace configuration if needed.
12. Update root package.json scripts if needed.
13. Update .env.example with DATABASE_URL only if missing.
14. Update CI only if the relevant scripts exist.
15. Ensure lint, typecheck, and build pass.

Important rules:
- Do not implement UI.
- Do not install or configure better-auth in this PR.
- Do not add rental domain models yet.
- Do not accept accountId from client input anywhere.
- Do not put Prisma calls in React components.
- Keep this PR small and focused.
- Do not commit downloaded opensrc package source.

Acceptance criteria:
- packages/db exists and exports a reusable Prisma client.
- packages/auth exists and exports ActorContext, roles, and permission helper stubs.
- Prisma schema validates.
- Project builds and typechecks.
- CI passes.

After implementation:
- Run the relevant package manager commands for lint/typecheck/build.
- Run Prisma validation if Prisma scripts exist.
- Show changed files.
- Explain any docs updated.
```

---

## 9. Reusable Codex prompt template for future PRs

```txt
Implement this PR only: <PR title>.

Before editing files, use opensrc to fetch and inspect source for packages relevant to this PR.

Project docs to read first:
- docs/README.md
- docs/product/mvp-scope.md
- docs/architecture/system-overview.md
- docs/architecture/domain-boundaries.md
- docs/development/coding-standards.md
- docs/ai/ai-agent-context.md

Relevant packages for this PR:
- <package 1>
- <package 2>
- <package 3>

Use opensrc commands:
- opensrc fetch <package>
- opensrc list
- opensrc path <package>
- rg "<relevant term>" "$(opensrc path <package>)"

Before implementation, summarize:
- package sources fetched
- source paths inspected
- relevant patterns found
- assumptions

Scope:
<describe exact PR scope>

Out of scope:
<list what must not be implemented>

Requirements:
<checklist>

Acceptance criteria:
<checklist>

Security/scalability rules:
- Do not trust client-provided accountId.
- Validate session server-side.
- Keep business logic out of React components.
- Keep domain logic in packages/domain when applicable.
- Keep package boundaries clean.
- Do not commit opensrc-fetched source.

After implementation:
- Run lint/typecheck/build/tests that exist.
- Update docs if behavior differs from docs.
- Summarize changed files and risks.
```

---

## 10. Reviewer checklist

For PRs using opensrc, reviewers should verify:

```txt
Codex used package source relevant to the PR.
Codex summarized package patterns before implementing.
No downloaded package source was committed.
The implementation stayed within PR scope.
The code follows Pango package boundaries.
Security rules were respected.
CI passed.
Docs were updated where needed.
```
