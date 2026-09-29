/**
 * @recipra/database
 *
 * Database foundation for RECIPRA.
 *
 * This package provides:
 * - Migration runner
 * - Database connection utilities
 * - RLS context management
 * - Ledger invariants
 *
 * CRITICAL: This package does NOT include an ORM. SQL is written directly
 * to maintain full control over RLS, triggers, and constraints.
 */

export interface DatabaseConfig {
  readonly url: string;
  readonly maxConnections?: number;
  readonly idleTimeoutMs?: number;
}

export interface MigrationResult {
  readonly applied: string[];
  readonly skipped: string[];
  readonly errors: Array<{ file: string; error: string }>;
}

/**
 * Migration file metadata.
 */
export interface Migration {
  readonly version: string;
  readonly name: string;
  readonly sql: string;
  readonly checksum: string;
}

/**
 * RLS context for tenant isolation.
 * Must be set at the start of each request.
 */
export interface RLSContext {
  readonly tenant_id: string;
  readonly user_id?: string;
  readonly roles?: string[];
}

/**
 * Sets the RLS context for the current transaction.
 * This MUST be called before any tenant-scoped query.
 */
export function buildSetTenantContextSQL(tenantId: string): string {
  // Validate UUID format
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tenantId)) {
    throw new Error(`Invalid tenant_id format: ${tenantId}`);
  }
  return `SELECT set_config('app.current_tenant_id', '${tenantId}', TRUE);`;
}

/**
 * Ledger invariant: SUM(debits) = SUM(credits) for a transaction.
 */
export const LEDGER_BALANCE_CHECK_SQL = `
  SELECT
    SUM(debit) as total_debit,
    SUM(credit) as total_credit
  FROM ledger_entries
  WHERE transaction_id = $1
  HAVING SUM(debit) != SUM(credit)
`;

/**
 * Economic invariant check for offers.
 */
export const OFFER_ECONOMIC_INVARIANT_SQL = `
  SELECT
    gross_amount = user_reward + referral_reward + provider_cost + platform_margin as valid
  FROM offers
  WHERE id = $1
`;

// Re-export types
export type { DatabaseConfig, MigrationResult, Migration, RLSContext };
