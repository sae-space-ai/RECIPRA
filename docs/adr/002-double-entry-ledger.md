# ADR-002: PostgreSQL Double-Entry Ledger

## Status
ACCEPTED

## Context
RECIPRA requires an immutable, verifiable economic truth. Options considered:
1. Application-level balance tracking (wallet.balance += X)
2. Event-sourced ledger without DB enforcement
3. PostgreSQL double-entry ledger with DB-level immutability

## Decision
**PostgreSQL double-entry ledger with DB-level immutability enforcement.**

PostgreSQL is the source of transactional AND economic truth. The ledger is enforced at the database level, not just application level.

## Schema
```sql
ledger_transactions (id, tenant_id, description, correlation_id, status, posted_at)
ledger_entries (id, transaction_id, account_id, account_type, debit, credit, currency, status)
```

## Invariants Enforced
1. Every transaction must balance: SUM(debits) = SUM(credits)
2. POSTED entries are immutable (trigger prevents UPDATE/DELETE)
3. All monetary values use NUMERIC(20,8), never float
4. Every entry has tenant_id, correlation_id
5. Cannot have both debit and credit on same entry

## Wallet Projection
Wallet balances are READ-MODEL projections from ledger entries:
```sql
CREATE VIEW wallet_balances AS
SELECT tenant_id, account_id, currency,
  SUM(credit) - SUM(debit) AS balance
FROM ledger_entries
WHERE status = 'POSTED'
GROUP BY tenant_id, account_id, currency;
```

## Corrections
Corrections use compensating entries (reversals), NEVER editing history.

## Consequences
- **Positive:** Immutable economic truth, verifiable, auditable
- **Positive:** DB-level enforcement (not just application)
- **Positive:** Wallet projection is always consistent with ledger
- **Negative:** More complex writes (must create balanced entries)
- **Negative:** Cannot "fix" errors by editing (must use reversals)
