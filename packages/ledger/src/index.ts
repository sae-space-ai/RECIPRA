/**
 * @recipra/ledger
 *
 * Double-entry ledger foundation.
 *
 * CRITICAL INVARIANTS:
 * 1. Every transaction must balance: SUM(debits) = SUM(credits)
 * 2. POSTED entries are immutable (enforced by DB trigger)
 * 3. Corrections use compensating entries (reversals), never editing
 * 4. All monetary values: Money (string), never Number/float
 * 5. Wallet is a projection, never authoritative
 *
 * PROHIBITED:
 * - wallet.balance += X
 * - set-balance operations
 * - AI/frontend direct balance modification
 */

import type { TenantId, TransactionId, LedgerEntryId, Money, Currency, CorrelationId } from '@recipra/contracts';

/**
 * Account types in double-entry accounting.
 */
export type AccountType = 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';

/**
 * Ledger entry (one side of a transaction).
 */
export interface LedgerEntry {
  readonly id: LedgerEntryId;
  readonly tenantId: TenantId;
  readonly transactionId: TransactionId;
  readonly accountId: string;
  readonly accountType: AccountType;
  readonly debit: Money;
  readonly credit: Money;
  readonly currency: Currency;
  readonly description?: string;
  readonly status: 'DRAFT' | 'POSTED';
  readonly createdAt: string;
}

/**
 * Ledger transaction (group of balanced entries).
 */
export interface LedgerTransaction {
  readonly id: TransactionId;
  readonly tenantId: TenantId;
  readonly description?: string;
  readonly correlationId: CorrelationId;
  readonly causationId?: string;
  readonly status: 'DRAFT' | 'POSTED';
  readonly postedAt?: string;
  readonly entries: LedgerEntry[];
  readonly createdAt: string;
}

/**
 * Input for creating a ledger transaction.
 */
export interface CreateTransactionInput {
  readonly tenantId: TenantId;
  readonly description?: string;
  readonly correlationId: CorrelationId;
  readonly causationId?: string;
  readonly entries: Array<{
    accountId: string;
    accountType: AccountType;
    debit: Money;
    credit: Money;
    currency: Currency;
    description?: string;
  }>;
}

/**
 * Validates that a transaction is balanced.
 * SUM(debits) must equal SUM(credits).
 */
export function validateBalanced(entries: Array<{ debit: Money; credit: Money }>): boolean {
  let totalDebit = 0n;
  let totalCredit = 0n;

  for (const entry of entries) {
    // Parse Money strings to bigint (scaled by 10^8)
    const parseMoney = (m: Money): bigint => {
      const parts = m.split('.');
      const whole = BigInt(parts[0] ?? '0');
      const decimal = parts[1] ? parts[1].padEnd(8, '0').slice(0, 8) : '00000000';
      return whole * 100_000_000n + BigInt(decimal);
    };

    totalDebit += parseMoney(entry.debit);
    totalCredit += parseMoney(entry.credit);
  }

  return totalDebit === totalCredit;
}

/**
 * Wallet projection (read model from ledger).
 * This is derived from ledger entries, never authoritative.
 */
export interface WalletBalance {
  readonly accountId: string;
  readonly currency: Currency;
  readonly available: Money;
  readonly pending: Money;
  readonly reserved: Money;
  readonly paid: Money;
  readonly reversed: Money;
}

/**
 * Account ID conventions.
 */
export const ACCOUNT_TYPES = {
  USER_WALLET: (userId: string) => `user_wallet_${userId}`,
  REFERRAL_LIABILITY: (referralId: string) => `referral_liability_${referralId}`,
  PROVIDER_RECEIVABLE: 'provider_receivable',
  PLATFORM_REVENUE: 'platform_revenue',
  COST_PAYABLE: 'cost_payable',
  PLATFORM_CASH: 'platform_cash',
  PAYOUT_CLEARING: 'payout_clearing',
} as const;
