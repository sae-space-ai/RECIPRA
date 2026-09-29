# Security Policy

## Reporting a Vulnerability

**DO NOT** open a public issue for security vulnerabilities.

Contact: [security@recipra.io](mailto:security@recipra.io)

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Security Model

### Trust Boundaries

1. **Browser/Client** — Untrusted. No business logic. No secrets.
2. **API/BFF** — Trust boundary. Derives tenant_id, user_id, roles from session.
3. **Domain Core** — Enforces invariants. Never trusts client-provided authorization.
4. **PostgreSQL** — Source of truth. RLS enforces tenant isolation.
5. **Adapters** — External systems. All responses verified.

### Controls Implemented (HITO 1)

- ✅ TypeScript strict mode
- ✅ No IEEE-754 for monetary values (NUMERIC only)
- ✅ Database schema with RLS foundation
- ✅ Ledger immutability triggers
- ✅ Audit log immutability triggers
- ✅ Economic invariant constraints

### Controls Pending

- ⏳ OAuth implementation (HITO 2)
- ⏳ Session management (HITO 2)
- ⏳ Webhook signature verification (HITO 3)
- ⏳ Click ID signing (HITO 3)
- ⏳ Fraud detection rules (HITO 5)
- ⏳ AI governance (HITO 6)

### Hard Prohibitions

- ✕ No `wallet.balance += X`
- ✕ No AI → ledger direct
- ✕ No reward on RECEIVED state
- ✕ No editing POSTED ledger entries
- ✕ No disabling RLS to fix bugs
- ✕ No app superuser/BYPASSRLS
- ✕ No secrets in Git
- ✕ No IEEE-754 for money

## Threat Model

See [docs/architecture/trust-model.md](docs/architecture/trust-model.md)

## Security Testing

- RLS cross-tenant isolation tests
- Ledger immutability tests
- Economic invariant tests
- Webhook replay tests (when implemented)
- Click signature tests (when implemented)
