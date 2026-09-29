# RECIPRA — Reward OS Platform

> **Canonical Repository:** https://github.com/sae-space-ai/RECIPRA
> **Owner:** Prof. Manuel Gago Fernández
> **Status:** HITO 1 — Bootstrap + Architecture + CI + Database Foundation

## Mission

RECIPRA is a proprietary, modular, multi-tenant, event-driven, portable, verifiable and extensible platform for:
- Rewards, affiliate marketing (CPA/CPL/CPI/CPS)
- Surveys, offerwalls, cashback, rewarded ads
- Tasks, loyalty, promotions, coupons, contests, games
- Traffic exchange, merchant offers, referrals
- Multilevel revenue-sharing on **verified real economic activity only**
- Subscriptions, premium memberships, advertising, SaaS, white-label
- Marketplace, PRO and AI modules

## Canonical Economic Invariant

```
gross = user_reward + referral_reward + provider_cost + platform_margin
```

Example: €10.00 = €5.00 + €0.50 + €1.00 + €3.50

All monetary values stored as PostgreSQL `NUMERIC(20,8)` — IEEE-754 float **PROHIBITED**.

## Architecture

- **Pattern:** Modular Monolith + Strict Domain Boundaries + Event-Oriented
- **Stack:** Node 22+, TypeScript, React, Next.js, Fastify, Zod, PostgreSQL, Redis, S3, Docker
- **Database:** PostgreSQL 17+ with RLS, double-entry ledger, transactional outbox
- **Events:** Versioned domain events, at-least-once delivery, idempotent consumers

## Source of Truth

| What | Source |
|------|--------|
| Transactional | PostgreSQL |
| Economic | Double-Entry Ledger |
| Software | Git |
| Operational | Events + Audit |
| Evidence | ARCHEION |
| Authorization | Policy Engine |
| AI Governance | SAE |

## Hard Prohibitions

- ✕ No `wallet.balance += X` (projection only)
- ✕ No AI → ledger direct access
- ✕ No reward on RECEIVED state
- ✕ No editing POSTED ledger entries
- ✕ No disabling RLS to fix bugs
- ✕ No app superuser/BYPASSRLS
- ✕ No secrets in Git
- ✕ No IEEE-754 for money
- ✕ No browser redirect as payment proof
- ✕ No unverified webhook processing

## Milestones

1. **HITO 1:** Bootstrap + Architecture + CI + Database Foundation ← **ACTIVE**
2. **HITO 2:** Identity + Tenant + RBAC + RLS + Session
3. **HITO 3:** Offer + Tracking + Signed Click + Webhook Gateway
4. **HITO 4:** Conversion + Policy + Economic Distribution + Ledger + Wallet
5. **HITO 5:** Referral + Payout + Sandbox PSP + Settlement + Reconciliation
6. **HITO 6:** SAE + ARCHEION + Trust Ledger + E2E Canonical
7. **HITO 7:** Web + Admin + Preview Deployment

## Project Structure

```
RECIPRA/
├── apps/
│   ├── web/          # Member-facing web app (Next.js)
│   ├── admin/        # Admin dashboard
│   ├── api/          # API server (Fastify)
│   └── worker/       # Background workers
├── packages/
│   ├── contracts/    # TypeScript domain types, event envelopes
│   ├── database/     # Shared DB utilities
│   ├── events/       # Event definitions
│   └── ...
├── database/
│   └── migrations/   # PostgreSQL migrations (deterministic order)
├── docs/
│   ├── architecture/ # System context, domain map, economic model
│   └── adr/          # Architecture Decision Records
└── tests/
    ├── unit/
    ├── integration/
    ├── economic/
    ├── security/
    └── e2e/
```

## Database Foundation

Migration: `database/migrations/001_foundation.sql`

Core tables:
- `tenants` — Multi-tenant isolation
- `users` — Identity (global)
- `tenant_memberships` — User-tenant relationship, roles
- `offers` — Offer catalog, economics (NUMERIC)
- `clicks` — Signed tracking links
- `conversions` — State machine, verification
- `ledger_transactions` — Double-entry transactions
- `ledger_entries` — Debit/credit pairs, immutable when POSTED
- `referrals` — Multi-level referral network
- `payouts` — Payout state machine
- `event_outbox` — Transactional outbox
- `audit_log` — Append-only audit trail

All tenant-scoped tables have RLS enabled + forced.

## Event Contracts

24 versioned event types defined in `src/contracts/events.ts`:
- Identity: user.created, session.created
- Tenant: created
- Offer: created
- Tracking: click.created
- Conversion: received, verified, approved, rewarded, settled, reversed
- Ledger: transaction.created, transaction.posted
- Referral: created, reward.created
- Payment: succeeded, failed
- Payout: requested, completed
- Risk: detected
- Audit: entry.created
- AI: decision.created (future)

## License

Proprietary. All Core, domain economics, schemas, contracts, event model, module specification, policy model, evidence model and architectural documentation remain under RECIPRA control.

## External Adapters (Substitutable)

| Provider | Role | Interface |
|----------|------|-----------|
| Google/GitHub/Meta/X | Identity | `IdentityProviderAdapter` |
| Stripe/Sandbox PSP | Payment | `PaymentProviderAdapter` |
| Affiliate Networks | Offers | `NetworkAdapter` |
| Offerwalls/Surveys | Content | `OfferwallAdapter` |
| OpenAI/Anthropic | AI Models | `ModelProviderAdapter` |

**Principle:** Google ≠ Identity. Stripe ≠ Payment. OpenAI ≠ AI. Vercel ≠ Architecture.
