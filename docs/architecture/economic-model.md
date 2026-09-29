# RECIPRA — Economic Model

## 1. Canonical Invariant

```
gross = user_reward + referral_reward + provider_cost + platform_margin
```

**This invariant MUST hold exactly for every conversion.** No rounding errors tolerated.

## 2. Monetary Representation

| Layer | Type | Example |
|-------|------|---------|
| PostgreSQL | `NUMERIC(20,8)` | `5.00000000` |
| TypeScript Domain | `string` | `"5.00"` |
| API Contract | `string` | `"5.00"` |
| Display | Formatted | `€5.00` |

**PROHIBITED:** `Number`, `float`, `double` for monetary values.

## 3. Currency

- Ledger currency: stored per-entry (CHAR(3), e.g., 'EUR', 'USD')
- Display currency: tenant-configured, may differ from ledger
- Conversion rates: separate service, never mixed with ledger

## 4. Rounding

- Defined per currency (EUR: 2 decimal, JPY: 0 decimal)
- Rounding mode: HALF_UP (configurable per tenant)
- Rounding differences absorbed by platform margin
- Every distribution must close exactly after rounding

## 5. Distribution Flow

```
1. Provider webhook received
2. Signature verified, replay checked
3. Conversion normalized, schema validated
4. Idempotency check (duplicate → return existing)
5. Fraud/risk rules evaluated
6. Policy decision: CAN_REWARD_CONVERSION?
7. If approved:
   a. Calculate distribution from offer economics
   b. Verify invariant: gross = user + referral + cost + margin
   c. Create ledger transaction (DRAFT)
   d. Verify balanced: SUM(debits) = SUM(credits)
   e. Post transaction (POSTED, immutable)
   f. Wallet projection updated
   g. Referral distribution (if applicable)
   h. Evidence recorded
   i. Audit entry created
   j. Event emitted to outbox
```

## 6. Account Types

| Account | Type | Description |
|---------|------|-------------|
| `user_wallet_{id}` | liability | User's available balance |
| `referral_liability_{id}` | liability | Referrer's earned rewards |
| `provider_receivable` | asset | Amount owed by provider |
| `platform_revenue` | revenue | Platform's margin |
| `cost_payable` | liability | Amount owed to network/provider |
| `platform_cash` | asset | Platform's cash account |
| `payout_clearing` | asset | Payouts in transit |

## 7. Example Transaction

Offer: €10.00 gross, user €5.00, referral €0.50, cost €1.00, margin €3.50

```
Transaction tx_001 (correlation: corr_conv_001):

DEBIT  provider_receivable      €10.00  (asset: provider owes us gross)
CREDIT user_wallet_demo         €5.00   (liability: we owe user reward)
CREDIT referral_liability_ref1  €0.50   (liability: we owe referrer)
CREDIT cost_payable             €1.00   (liability: we owe network for cost)
CREDIT platform_revenue         €3.50   (revenue: our margin)

SUM DEBITS:  €10.00
SUM CREDITS: €5.00 + €0.50 + €1.00 + €3.50 = €10.00  ✓ BALANCED
```

When provider settles (pays us):
```
DEBIT  platform_cash            €10.00  (cash received)
CREDIT provider_receivable      €10.00  (receivable cleared)
```

When user is paid out:
```
DEBIT  user_wallet_demo         €5.00   (liability cleared)
CREDIT platform_cash            €5.00   (cash paid out)
```

## 8. Reversals

When a conversion is reversed:
- Create compensating transaction (opposite entries)
- Reference original transaction (causation_id)
- Wallet projection automatically adjusts
- Evidence recorded
- Audit entry created

## 9. Payout Flow

```
1. User requests payout
2. Check available balance (wallet projection)
3. Reserve funds (create pending ledger entry)
4. Policy check (risk, KYC, limits)
5. Execute via PSP adapter
6. Receive webhook (signature verified)
7. Settlement (mark completed)
8. Reconciliation (internal vs external)
9. Evidence recorded
```

## 10. Referral Distribution

- Only on VERIFIED economic activity (not signups)
- Multi-level configurable (e.g., level 1: 10%, level 2: 2%)
- Self-referral, circular referral detected and blocked
- Referral rewards flow through ledger
- Referral wallet is separate projection

## 11. Analytics

- Gross revenue (before distribution)
- Net margin (after all costs)
- Reward cost (user + referral)
- Provider cost
- Reversal-adjusted margin
- ARPU, LTV, CAC
- Cohort analysis
- Provider/offer profitability
