# RECIPRA — System Context

> Source of Truth: https://github.com/sae-space-ai/RECIPRA
> Owner: Prof. Manuel Gago Fernández
> Status: HITO 1 — BOOTSTRAP + ARCHITECTURE

## 1. Mission

RECIPRA is a proprietary, modular, multi-tenant, event-driven, portable, verifiable and extensible platform for:
- Rewards, affiliate marketing (CPA/CPL/CPI/CPS)
- Surveys, offerwalls, cashback, rewarded ads
- Tasks, loyalty, promotions, coupons, contests, games
- Traffic exchange, merchant offers, referrals
- Multilevel revenue-sharing on **verified real economic activity only**
- Subscriptions, premium memberships, advertising, SaaS, white-label
- Marketplace, PRO and AI modules

## 2. System Boundary

```
┌──────────────────────────────────────────────────────────────┐
│                    RECIPRA PLATFORM                           │
│                                                              │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ apps/web │  │apps/admin│  │ apps/api │  │ apps/worker │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬──────┘  │
│       │              │              │               │         │
│  ┌────┴──────────────┴──────────────┴───────────────┴──────┐ │
│  │              packages/contracts (TypeScript)             │ │
│  │         Domain types, event envelopes, API schemas       │ │
│  └───────────────────────┬──────────────────────────────────┘ │
│                          │                                    │
│  ┌───────────────────────┴──────────────────────────────────┐ │
│  │                  Domain Core (TypeScript)                 │ │
│  │  Identity│Tenant│Ledger│Wallet│Offers│Tracking│Policy    │ │
│  │  Referral│Payments│Payout│Fraud│Audit│Evidence│Events    │ │
│  └───────────────────────┬──────────────────────────────────┘ │
│                          │                                    │
│  ┌───────────────────────┴──────────────────────────────────┐ │
│  │              PostgreSQL (Source of Transactional Truth)    │ │
│  │  RLS│Double-Entry Ledger│Outbox│State Machines│Indexes   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Adapter Layer (Substitutable)                │ │
│  │  OAuth│PSP│Networks│Offerwalls│Surveys│Email│AI│Storage  │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

## 3. External Actors (Adapters — NOT Dependencies)

| Actor | Role | Adapter Interface | Replaceable |
|-------|------|-------------------|-------------|
| Google/GitHub/Meta/X | Identity providers | `IdentityProviderAdapter` | YES |
| Stripe/Sandbox PSP | Payment service | `PaymentProviderAdapter` | YES |
| Affiliate Networks | Offer sources | `NetworkAdapter` | YES |
| Offerwalls/Surveys | Content providers | `OfferwallAdapter` | YES |
| OpenAI/Anthropic/etc | AI models | `ModelProviderAdapter` | YES |
| SendGrid/etc | Email delivery | `NotificationAdapter` | YES |
| S3-compatible | File storage | `StorageAdapter` | YES |

**Principle:** Google ≠ Identity. Stripe ≠ Payment. OpenAI ≠ AI. Vercel ≠ Architecture.

## 4. Trust Boundaries

1. **Browser/Client** — Untrusted. No business logic. No secrets.
2. **API/BFF** — Trust boundary. Derives tenant_id, user_id, roles from session.
3. **Domain Core** — Enforces invariants. Never trusts client-provided authorization.
4. **PostgreSQL** — Source of truth. RLS enforces tenant isolation at DB level.
5. **Adapters** — External systems. All responses verified (signatures, schemas).

## 5. Economic Model (Canonical)

```
gross = user_reward + referral_reward + provider_cost + platform_margin
```

Example: €10.00 = €5.00 + €0.50 + €1.00 + €3.50

- All monetary values: PostgreSQL `NUMERIC`, application `string`/decimal library
- IEEE-754 `Number`/`float` **PROHIBITED** for money
- Every distribution must close exactly (invariant check)
- Rounding rules defined per currency

## 6. State as Source of Truth

| What | Source |
|------|--------|
| Transactional truth | PostgreSQL |
| Economic truth | Double-entry ledger |
| Software truth | Git |
| Operational evolution | Events + Audit |
| Proof/evidence | ARCHEION |
| Authorization control | Policy Engine |
| AI governance | SAE |
| Evidence provenance | ARCHEION |

## 7. Evolution Phases

1. **B2C propio** → Reward platform
2. **Reward OS** → Full economic engine
3. **Affiliate Network OS** → Multi-party network
4. **SaaS multi-tenant** → White-label platform
5. **Marketplace** → Module ecosystem
6. **Monetization/Acquisition/Intelligence** → Infrastructure
