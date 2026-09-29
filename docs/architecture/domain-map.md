# RECIPRA — Domain Map

## 1. Bounded Contexts

### Core Domain
- **Identity** — Authentication, OAuth adapters, session management
- **Tenant** — Multi-tenant isolation, RLS enforcement, configuration
- **Ledger** — Double-entry accounting, immutable transactions
- **Wallet** — Read-model projection from ledger (available/pending/reserved/paid/reversed)
- **Policy** — Authorization rules, risk decisions, human review escalation

### Business Domain
- **Offers** — Offer catalog, incentive rules, country/device filtering, caps
- **Tracking** — Signed click IDs, impression→click→conversion attribution
- **Conversion** — State machine (RECEIVED→VERIFIED→APPROVED→REWARDED→SETTLED)
- **Referral** — Multi-level rewards on verified economic activity only
- **Payments** — PaymentProviderAdapter for PSP integration
- **Payout** — Request→reserve→policy→PSP→settlement→reconciliation
- **Fraud** — Rule-based detection, velocity checks, anomaly detection
- **Reconciliation** — Internal vs provider settlement matching

### Supporting Domain
- **Audit** — Append-only action log, correlation tracking
- **Evidence** — ARCHEION provenance, verification receipts
- **Events** — Domain event envelope, transactional outbox
- **Notifications** — Email, in-app, web push adapters
- **CMS** — Pages, FAQ, terms, privacy, legal content versioning

### Future Domains
- **SAE** — AI System governance control plane
- **AI Gateway** — Model routing, provider adapters, decision logging
- **Site Builder** — White-label platform builder
- **Marketplace** — Module catalog, install/upgrade, billing
- **Module SDK** — Third-party module development kit

## 2. Aggregates

### Tenant Aggregate
```
Tenant
├── Configuration (brand, domain, modules, rules)
├── Memberships (users, roles, permissions)
└── Settings (currency, locale, payout rules)
```

### Offer Aggregate
```
Offer
├── Economics (gross, user_reward, referral_reward, cost, margin)
├── Rules (incentive_allowed, countries, devices, caps)
├── Provider (network, campaign, tracking)
└── Status (active, paused, expired)
```

### Conversion Aggregate
```
Conversion
├── State (RECEIVED→VERIFIED→APPROVED→REWARDED→SETTLED)
├── Tracking (click_id, correlation_id)
├── Economics (gross, distribution)
├── Verification (webhook signature, replay check)
└── Evidence (provenance, audit trail)
```

### Ledger Transaction Aggregate
```
LedgerTransaction
├── Entries (debit/credit pairs, balanced)
├── Accounts (platform, user, provider, referral)
├── Status (DRAFT→POSTED, POSTED is immutable)
└── Correlation (event_id, conversion_id, payout_id)
```

### Payout Aggregate
```
Payout
├── Request (user, amount, currency)
├── Reserve (wallet balance lock)
├── Policy (risk check, KYC if needed)
├── PSP (payment provider execution)
├── Settlement (webhook verification)
└── Reconciliation (internal vs external match)
```

## 3. Domain Events

### Identity Events
- `identity.user.created.v1`
- `identity.user.updated.v1`
- `identity.session.created.v1`
- `identity.session.revoked.v1`

### Tenant Events
- `tenant.created.v1`
- `tenant.updated.v1`
- `tenant.member.added.v1`
- `tenant.member.removed.v1`

### Offer Events
- `offer.created.v1`
- `offer.updated.v1`
- `offer.paused.v1`
- `offer.expired.v1`

### Tracking Events
- `tracking.impression.created.v1`
- `tracking.click.created.v1`
- `tracking.click.redirected.v1`

### Conversion Events
- `conversion.received.v1`
- `conversion.verified.v1`
- `conversion.approved.v1`
- `conversion.rejected.v1`
- `conversion.rewarded.v1`
- `conversion.settled.v1`
- `conversion.reversed.v1`
- `conversion.disputed.v1`

### Ledger Events
- `ledger.transaction.created.v1`
- `ledger.transaction.posted.v1`
- `ledger.entry.created.v1`

### Wallet Events
- `wallet.balance.updated.v1` (projection event)

### Referral Events
- `referral.created.v1`
- `referral.reward.created.v1`

### Payment Events
- `payment.created.v1`
- `payment.succeeded.v1`
- `payment.failed.v1`
- `payment.chargeback.v1`

### Payout Events
- `payout.requested.v1`
- `payout.reserved.v1`
- `payout.approved.v1`
- `payout.rejected.v1`
- `payout.completed.v1`
- `payout.failed.v1`

### Fraud Events
- `risk.detected.v1`
- `risk.reviewed.v1`
- `risk.resolved.v1`

### Audit Events
- `audit.entry.created.v1`

### Evidence Events
- `evidence.created.v1`
- `evidence.verified.v1`

### AI Events (Future)
- `ai.decision.created.v1`
- `ai.system.registered.v1`
- `ai.incident.created.v1`

## 4. Domain Invariants

### Economic Invariants
1. `gross = user_reward + referral_reward + provider_cost + platform_margin` (exact, no rounding errors)
2. Every ledger transaction must balance: `SUM(debits) = SUM(credits)`
3. POSTED ledger entries are immutable
4. Wallet balances are projections, never authoritative
5. No reward on RECEIVED state (only after VERIFIED+APPROVED)

### Conversion Invariants
1. State transitions are explicit and validated
2. RECEIVED does not produce money
3. Every conversion has a valid signed click_id
4. Webhook signature must be verified before processing
5. Idempotency: duplicate webhooks reference existing conversion

### Tenant Invariants
1. Every tenant-scoped table has RLS enabled
2. App DB role is never superuser/BYPASSRLS
3. Tenant context comes from session, not client
4. Tenant-A cannot read/write Tenant-B data

### Ledger Invariants
1. Every transaction has balanced entries
2. POSTED transactions cannot be edited/deleted
3. Corrections use compensating entries (reversals)
4. Every entry has tenant_id, correlation_id
5. Monetary values use NUMERIC, not float

### Referral Invariants
1. Rewards only on verified economic activity
2. No self-referral, circular referral, account farms
3. Multi-level only on real conversions, not signups
4. Referral rewards flow through ledger

### Payout Invariants
1. Cannot payout more than available balance
2. Reserve balance before processing
3. Policy check before PSP execution
4. Webhook verification before settlement
5. Reconciliation after settlement
6. Idempotency: no double payout

## 5. Domain Services

### ConversionService
- `receiveConversion(webhook)` — Validate signature, normalize, store raw
- `verifyConversion(conversionId)` — Check replay, schema, attribution
- `approveConversion(conversionId)` — Policy decision
- `rewardConversion(conversionId)` — Distribute to ledger
- `settleConversion(conversionId)` — Mark settled
- `reverseConversion(conversionId, reason)` — Compensating entries

### LedgerService
- `createTransaction(entries)` — Validate balance, create DRAFT
- `postTransaction(transactionId)` — Mark POSTED, immutable
- `reverseTransaction(transactionId, reason)` — Create compensating transaction
- `getBalance(accountId)` — Projection from entries

### WalletService (Read Model)
- `getAvailableBalance(userId)` — Sum of posted credits - debits
- `getPendingBalance(userId)` — Sum of unsettled conversions
- `getReservedBalance(userId)` — Sum of reserved payouts
- `getPaidTotal(userId)` — Sum of completed payouts
- `getReversedTotal(userId)` — Sum of reversals

### PayoutService
- `requestPayout(userId, amount)` — Validate balance, create request
- `reserveFunds(payoutId)` — Lock wallet balance
- `approvePayout(payoutId)` — Policy check
- `executePayout(payoutId)` — Call PSP adapter
- `settlePayout(payoutId)` — Verify webhook, mark completed
- `reconcilePayout(payoutId)` — Match internal vs external

### ReferralService
- `createReferral(referrerId, referredId)` — Validate no self-referral
- `calculateReferralReward(conversionId)` — Apply rules
- `distributeReferralReward(conversionId)` — Post to ledger
- `getReferralNetwork(userId)` — Return tree structure

### PolicyService
- `evaluateConversion(conversionId)` — Check fraud rules, risk
- `evaluatePayout(payoutId)` — Check limits, KYC
- `requiresHumanReview(resource)` — Decision based on risk
- `getDecision(resource)` — Return policy decision with evidence

### TrackingService
- `createClick(offerId, userId)` — Generate signed click_id
- `validateClick(clickId)` — Verify signature, check expiry
- `attributeConversion(clickId, conversionId)` — Link conversion to click
- `detectFraud(clickId)` — Check velocity, patterns

### FraudService
- `detectDuplicateAccounts(userId)` — Check shared identifiers
- `detectVelocity(userId, action)` — Check rate limits
- `detectImpossibleTiming(conversionId)` — Check click→conversion time
- `detectSelfReferral(referralId)` — Check circular references
- `detectAnomalies(resource)` — ML-based anomaly detection (future)
