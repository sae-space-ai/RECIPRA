/**
 * @recipra/contracts
 *
 * Canonical domain contracts for RECIPRA.
 *
 * CRITICAL RULES:
 * - Money is NEVER represented as JS Number/float. Always string (decimal).
 * - All monetary values in PostgreSQL are NUMERIC(20,8).
 * - All IDs are branded string types for type safety.
 * - Domain events are versioned.
 */

// ============================================================================
// BRAND TYPES (for type safety at compile time)
// ============================================================================

declare const __brand: unique symbol;
type Brand<T, B extends string> = T & { readonly [__brand]: B };

/** Tenant identifier (UUID string) */
export type TenantId = Brand<string, 'TenantId'>;

/** User identifier (UUID string) */
export type UserId = Brand<string, 'UserId'>;

/** Correlation identifier (UUID string) */
export type CorrelationId = Brand<string, 'CorrelationId'>;

/** Causation identifier (UUID string) */
export type CausationId = Brand<string, 'CausationId'>;

/** Event identifier (UUID string) */
export type EventId = Brand<string, 'EventId'>;

/** Aggregate identifier (UUID string) */
export type AggregateId = Brand<string, 'AggregateId'>;

/** Click identifier (signed, non-predictable) */
export type ClickId = Brand<string, 'ClickId'>;

/** Conversion identifier (UUID string) */
export type ConversionId = Brand<string, 'ConversionId'>;

/** Offer identifier (UUID string) */
export type OfferId = Brand<string, 'OfferId'>;

/** Transaction identifier (UUID string) */
export type TransactionId = Brand<string, 'TransactionId'>;

/** Ledger entry identifier (UUID string) */
export type LedgerEntryId = Brand<string, 'LedgerEntryId'>;

/** Payout identifier (UUID string) */
export type PayoutId = Brand<string, 'PayoutId'>;

/** Referral identifier (UUID string) */
export type ReferralId = Brand<string, 'ReferralId'>;

/** Session identifier (opaque, hashed-at-rest) */
export type SessionId = Brand<string, 'SessionId'>;

// ============================================================================
// MONEY / DECIMAL
// ============================================================================

/**
 * ISO 4217 currency code (3 uppercase letters).
 * Examples: 'EUR', 'USD', 'GBP', 'JPY'
 */
export type Currency = Brand<string, 'Currency'>;

/**
 * Monetary amount represented as a decimal string.
 * NEVER use JS Number/float for money.
 *
 * Examples: '10.00', '5.50', '0.005'
 *
 * Precision: up to 8 decimal places (matches PostgreSQL NUMERIC(20,8))
 */
export type Money = Brand<string, 'Money'>;

/**
 * Creates a Money value from a string.
 * Validates format: optional minus, digits, optional decimal point + digits.
 */
export function money(value: string): Money {
  if (!/^-?\d+(\.\d+)?$/.test(value)) {
    throw new Error(`Invalid money format: ${value}`);
  }
  return value as Money;
}

/**
 * Creates a Currency value from a string.
 * Validates format: 3 uppercase letters.
 */
export function currency(code: string): Currency {
  if (!/^[A-Z]{3}$/.test(code)) {
    throw new Error(`Invalid currency code: ${code}`);
  }
  return code as Currency;
}

// ============================================================================
// ENUMS
// ============================================================================

export type ConversionState =
  | 'RECEIVED'
  | 'PENDING'
  | 'VERIFIED'
  | 'APPROVED'
  | 'REWARDED'
  | 'SETTLED'
  | 'REJECTED'
  | 'REVERSED'
  | 'DISPUTED'
  | 'FRAUD_HOLD'
  | 'MANUAL_REVIEW';

export type OfferType =
  | 'CPA'
  | 'CPL'
  | 'CPI'
  | 'CPS'
  | 'SURVEY'
  | 'CASHBACK'
  | 'PTC'
  | 'REWARDED_AD'
  | 'TASK'
  | 'GAME';

export type IncentiveAllowed =
  | 'INCENTIVIZED'
  | 'NON_INCENTIVIZED'
  | 'BOTH';

export type LedgerEntryStatus = 'DRAFT' | 'POSTED';

export type PayoutState =
  | 'REQUESTED'
  | 'RESERVED'
  | 'APPROVED'
  | 'REJECTED'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'REVERSED';

export type TenantStatus = 'active' | 'suspended' | 'pending';

export type OfferStatus = 'active' | 'paused' | 'expired';

export type AuditResult = 'success' | 'failure' | 'denied';

// ============================================================================
// DOMAIN EVENT ENVELOPE
// ============================================================================

/**
 * Canonical domain event envelope.
 * All events must follow this structure.
 *
 * - event_id: unique identifier for this event
 * - event_type: namespaced type with version (e.g., 'conversion.verified.v1')
 * - event_version: integer version
 * - tenant_id: tenant that owns this event
 * - aggregate_type: type of aggregate (e.g., 'conversion', 'ledger_transaction')
 * - aggregate_id: identifier of the aggregate
 * - occurred_at: ISO 8601 timestamp
 * - actor: who caused this event (user_id, 'system', 'policy_engine')
 * - correlation_id: correlates related events across aggregates
 * - causation_id: event that caused this event (optional)
 * - payload: event-specific data
 * - evidence: optional provenance/verification data
 */
export interface DomainEvent<TPayload = Record<string, unknown>> {
  readonly event_id: EventId;
  readonly event_type: string;
  readonly event_version: number;
  readonly tenant_id: TenantId;
  readonly aggregate_type: string;
  readonly aggregate_id: AggregateId;
  readonly occurred_at: string; // ISO 8601
  readonly actor: string;
  readonly correlation_id: CorrelationId;
  readonly causation_id?: CausationId;
  readonly payload: TPayload;
  readonly evidence?: Record<string, unknown>;
}

// ============================================================================
// CONVERSION EVENTS
// ============================================================================

export interface ConversionReceivedPayload {
  readonly conversion_id: ConversionId;
  readonly offer_id: OfferId;
  readonly click_id: ClickId;
  readonly user_id: UserId;
  readonly gross_amount: Money;
  readonly user_reward: Money;
  readonly referral_reward: Money;
  readonly provider_cost: Money;
  readonly platform_margin: Money;
  readonly external_id?: string;
  readonly webhook_signature: string;
}

export interface ConversionVerifiedPayload {
  readonly conversion_id: ConversionId;
  readonly verified_by: string;
  readonly replay_check_passed: boolean;
  readonly signature_valid: boolean;
}

export interface ConversionApprovedPayload {
  readonly conversion_id: ConversionId;
  readonly policy_decision: string;
  readonly policy_rule: string;
  readonly human_review: boolean;
}

export interface ConversionRewardedPayload {
  readonly conversion_id: ConversionId;
  readonly transaction_id: TransactionId;
  readonly user_reward: Money;
  readonly referral_reward: Money;
}

export interface ConversionSettledPayload {
  readonly conversion_id: ConversionId;
  readonly settled_at: string;
}

export interface ConversionReversedPayload {
  readonly conversion_id: ConversionId;
  readonly reason: string;
  readonly reversal_transaction_id: TransactionId;
}

// ============================================================================
// LEDGER EVENTS
// ============================================================================

export interface LedgerTransactionCreatedPayload {
  readonly transaction_id: TransactionId;
  readonly entry_count: number;
  readonly total_debit: Money;
  readonly total_credit: Money;
  readonly balanced: boolean;
  readonly currency: Currency;
}

export interface LedgerTransactionPostedPayload {
  readonly transaction_id: TransactionId;
  readonly correlation_id: CorrelationId;
  readonly entry_count: number;
}

// ============================================================================
// PAYOUT EVENTS
// ============================================================================

export interface PayoutRequestedPayload {
  readonly payout_id: PayoutId;
  readonly user_id: UserId;
  readonly amount: Money;
  readonly currency: Currency;
}

export interface PayoutCompletedPayload {
  readonly payout_id: PayoutId;
  readonly external_id: string;
  readonly provider: string;
  readonly settled_at: string;
}

// ============================================================================
// RISK EVENTS
// ============================================================================

export interface RiskDetectedPayload {
  readonly resource_type: string;
  readonly resource_id: string;
  readonly risk_type: string;
  readonly severity: 'low' | 'medium' | 'high' | 'critical';
  readonly details: string;
}

// ============================================================================
// ECONOMIC INVARIANT
// ============================================================================

/**
 * Validates the canonical economic invariant:
 * gross = user_reward + referral_reward + provider_cost + platform_margin
 *
 * All values are Money (decimal strings). Uses string-based decimal arithmetic.
 * Returns true if invariant holds, false otherwise.
 *
 * NOTE: This is a simplified check. Production should use a proper decimal library.
 */
export function validateEconomicInvariant(params: {
  gross_amount: Money;
  user_reward: Money;
  referral_reward: Money;
  provider_cost: Money;
  platform_margin: Money;
}): boolean {
  const { gross_amount, user_reward, referral_reward, provider_cost, platform_margin } = params;

  // Parse as integers (multiply by 10^8 to avoid floating point)
  const scale = 100_000_000;
  const parse = (m: Money): bigint => {
    const parts = m.split('.');
    const whole = BigInt(parts[0] ?? '0');
    const decimal = parts[1] ? parts[1].padEnd(8, '0').slice(0, 8) : '00000000';
    return whole * BigInt(scale) + BigInt(decimal);
  };

  const gross = parse(gross_amount);
  const sum = parse(user_reward) + parse(referral_reward) + parse(provider_cost) + parse(platform_margin);

  return gross === sum;
}

// ============================================================================
// RE-EXPORTS
// ============================================================================

export type { } from './events';
