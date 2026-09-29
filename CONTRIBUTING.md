# Contributing to RECIPRA

## Status

RECIPRA is a **proprietary project**. External contributions are not currently accepted.

This document is for internal development guidelines.

## Development Workflow

### Branch Strategy

- `main` — Stable. Protected. No direct commits.
- `feat/*` — Feature branches
- `fix/*` — Bug fixes
- `security/*` — Security fixes
- `chore/*` — Maintenance

### Pull Request Requirements

Every PR must include:

1. **WHAT** — What changed
2. **WHY** — Why it changed
3. **ARCHITECTURE** — How it fits the architecture
4. **DATABASE** — Migration impact (if any)
5. **RISK** — What could go wrong
6. **TEST-EVIDENCE** — How it was tested
7. **NEXT** — What comes next

### Code Standards

- TypeScript strict mode
- No `any` types
- No IEEE-754 for money (use string/decimal)
- All monetary values: PostgreSQL NUMERIC
- All tenant-scoped tables: RLS enabled
- All events: versioned, with correlation_id
- All ledger entries: balanced (debit = credit)

### Testing Requirements

- Unit tests for domain logic
- Integration tests for database operations
- Economic invariant tests
- Security tests (RLS, immutability)
- E2E tests for critical flows

### Commit Messages

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Definition of Done

- [ ] Code compiles (`pnpm typecheck`)
- [ ] Tests pass (`pnpm test`)
- [ ] Lint passes (`pnpm lint`)
- [ ] Database migrations work from clean DB
- [ ] RLS tests pass with runtime role
- [ ] Documentation updated
- [ ] No secrets committed
- [ ] PR description complete

## Architecture Principles

See [docs/architecture/](docs/architecture/)

## Economic Invariants

```
gross = user_reward + referral_reward + provider_cost + platform_margin
```

This invariant MUST hold exactly. No exceptions.

## Questions

Contact the project owner.
