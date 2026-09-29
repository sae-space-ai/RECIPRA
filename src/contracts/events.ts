// RECIPRA Event Contracts
// Versioned domain events — envelope structure
// All events must include: event_id, type, version, tenant_id, aggregate_id, occurred_at, actor, correlation_id, payload

export interface EventEnvelope<T = Record<string, unknown>> {
  event_id: string;
  type: string;
  version: number;
  tenant_id: string;
  aggregate_type: string;
  aggregate_id: string;
  occurred_at: string; // ISO 8601
  actor: string; // user_id or 'system' or 'policy_engine'
  correlation_id: string;
  causation_id?: string;
  payload: T;
  evidence?: Record<string, unknown>;
}

// ============================================================================
// IDENTITY EVENTS
// ============================================================================
export interface UserCreatedPayload {
  user_id: string;
  email: string;
  email_verified: boolean;
  provider?: string;
}
export type UserCreatedEvent = EventEnvelope<UserCreatedPayload> & { type: 'identity.user.created.v1'; version: 1 };

export interface SessionCreatedPayload {
  session_id: string;
  user_id: string;
  ip_address?: string;
  user_agent?: string;
}
export type SessionCreatedEvent = EventEnvelope<SessionCreatedPayload> & { type: 'identity.session.created.v1'; version: 1 };

// ============================================================================
// TENANT EVENTS
// ============================================================================
export interface TenantCreatedPayload {
  tenant_id: string;
  name: string;
  slug: string;
  owner_user_id: string;
}
export type TenantCreatedEvent = EventEnvelope<TenantCreatedPayload> & { type: 'tenant.created.v1'; version: 1 };

// ============================================================================
// OFFER EVENTS
// ============================================================================
export interface OfferCreatedPayload {
  offer_id: string;
  title: string;
  type: string;
  gross_amount: string; // decimal string
  user_reward: string;
  referral_reward: string;
  provider_cost: string;
  platform_margin: string;
  provider: string;
}
export type OfferCreatedEvent = EventEnvelope<OfferCreatedPayload> & { type: 'offer.created.v1'; version: 1 };

// ============================================================================
// TRACKING EVENTS
// ============================================================================
export interface ClickCreatedPayload {
  click_id: string; // signed, non-predictable
  offer_id: string;
  user_id?: string;
  signature: string;
  ip_address?: string;
}
export type ClickCreatedEvent = EventEnvelope<ClickCreatedPayload> & { type: 'tracking.click.created.v1'; version: 1 };

// ============================================================================
// CONVERSION EVENTS
// ============================================================================
export interface ConversionReceivedPayload {
  conversion_id: string;
  offer_id: string;
  click_id: string;
  user_id: string;
  gross_amount: string;
  external_id?: string;
  webhook_signature: string;
}
export type ConversionReceivedEvent = EventEnvelope<ConversionReceivedPayload> & { type: 'conversion.received.v1'; version: 1 };

export interface ConversionVerifiedPayload {
  conversion_id: string;
  verified_by: string; // 'system' or specific check
  replay_check: boolean;
  signature_valid: boolean;
}
export type ConversionVerifiedEvent = EventEnvelope<ConversionVerifiedPayload> & { type: 'conversion.verified.v1'; version: 1 };

export interface ConversionApprovedPayload {
  conversion_id: string;
  policy_decision: string;
  policy_rule: string;
  human_review: boolean;
}
export type ConversionApprovedEvent = EventEnvelope<ConversionApprovedPayload> & { type: 'conversion.approved.v1'; version: 1 };

export interface ConversionRewardedPayload {
  conversion_id: string;
  transaction_id: string;
  user_reward: string;
  referral_reward: string;
}
export type ConversionRewardedEvent = EventEnvelope<ConversionRewardedPayload> & { type: 'conversion.rewarded.v1'; version: 1 };

export interface ConversionSettledPayload {
  conversion_id: string;
  settled_at: string;
}
export type ConversionSettledEvent = EventEnvelope<ConversionSettledPayload> & { type: 'conversion.settled.v1'; version: 1 };

export interface ConversionReversedPayload {
  conversion_id: string;
  reason: string;
  reversal_transaction_id: string;
}
export type ConversionReversedEvent = EventEnvelope<ConversionReversedPayload> & { type: 'conversion.reversed.v1'; version: 1 };

// ============================================================================
// LEDGER EVENTS
// ============================================================================
export interface LedgerTransactionCreatedPayload {
  transaction_id: string;
  entry_count: number;
  total_debit: string;
  total_credit: string;
  balanced: boolean;
}
export type LedgerTransactionCreatedEvent = EventEnvelope<LedgerTransactionCreatedPayload> & { type: 'ledger.transaction.created.v1'; version: 1 };

export interface LedgerTransactionPostedPayload {
  transaction_id: string;
  correlation_id: string;
  entry_count: number;
}
export type LedgerTransactionPostedEvent = EventEnvelope<LedgerTransactionPostedPayload> & { type: 'ledger.transaction.posted.v1'; version: 1 };

// ============================================================================
// REFERRAL EVENTS
// ============================================================================
export interface ReferralCreatedPayload {
  referral_id: string;
  referrer_id: string;
  referred_id: string;
  level: number;
}
export type ReferralCreatedEvent = EventEnvelope<ReferralCreatedPayload> & { type: 'referral.created.v1'; version: 1 };

export interface ReferralRewardCreatedPayload {
  referral_id: string;
  conversion_id: string;
  amount: string;
  transaction_id: string;
}
export type ReferralRewardCreatedEvent = EventEnvelope<ReferralRewardCreatedPayload> & { type: 'referral.reward.created.v1'; version: 1 };

// ============================================================================
// PAYMENT EVENTS
// ============================================================================
export interface PaymentSucceededPayload {
  payment_id: string;
  amount: string;
  currency: string;
  provider: string;
  external_id: string;
}
export type PaymentSucceededEvent = EventEnvelope<PaymentSucceededPayload> & { type: 'payment.succeeded.v1'; version: 1 };

export interface PaymentFailedPayload {
  payment_id: string;
  reason: string;
  provider?: string;
}
export type PaymentFailedEvent = EventEnvelope<PaymentFailedPayload> & { type: 'payment.failed.v1'; version: 1 };

// ============================================================================
// PAYOUT EVENTS
// ============================================================================
export interface PayoutRequestedPayload {
  payout_id: string;
  user_id: string;
  amount: string;
  currency: string;
}
export type PayoutRequestedEvent = EventEnvelope<PayoutRequestedPayload> & { type: 'payout.requested.v1'; version: 1 };

export interface PayoutCompletedPayload {
  payout_id: string;
  external_id: string;
  provider: string;
  settled_at: string;
}
export type PayoutCompletedEvent = EventEnvelope<PayoutCompletedPayload> & { type: 'payout.completed.v1'; version: 1 };

// ============================================================================
// FRAUD/RISK EVENTS
// ============================================================================
export interface RiskDetectedPayload {
  resource_type: string;
  resource_id: string;
  risk_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details: string;
}
export type RiskDetectedEvent = EventEnvelope<RiskDetectedPayload> & { type: 'risk.detected.v1'; version: 1 };

// ============================================================================
// AUDIT EVENTS
// ============================================================================
export interface AuditEntryCreatedPayload {
  audit_id: string;
  actor: string;
  action: string;
  resource_type: string;
  resource_id: string;
  result: 'success' | 'failure' | 'denied';
}
export type AuditEntryCreatedEvent = EventEnvelope<AuditEntryCreatedPayload> & { type: 'audit.entry.created.v1'; version: 1 };

// ============================================================================
// AI/GOVERNANCE EVENTS (Future)
// ============================================================================
export interface AIDecisionCreatedPayload {
  decision_id: string;
  system_id: string;
  model: string;
  model_version: string;
  provider: string;
  purpose: string;
  input_classification: string;
  output_summary: string;
  policy_applied: string;
  human_oversight: boolean;
}
export type AIDecisionCreatedEvent = EventEnvelope<AIDecisionCreatedPayload> & { type: 'ai.decision.created.v1'; version: 1 };

// ============================================================================
// EVENT TYPE REGISTRY
// ============================================================================
export const EVENT_TYPES = {
  // Identity
  'identity.user.created.v1': 1,
  'identity.session.created.v1': 1,
  // Tenant
  'tenant.created.v1': 1,
  // Offer
  'offer.created.v1': 1,
  // Tracking
  'tracking.click.created.v1': 1,
  // Conversion
  'conversion.received.v1': 1,
  'conversion.verified.v1': 1,
  'conversion.approved.v1': 1,
  'conversion.rewarded.v1': 1,
  'conversion.settled.v1': 1,
  'conversion.reversed.v1': 1,
  // Ledger
  'ledger.transaction.created.v1': 1,
  'ledger.transaction.posted.v1': 1,
  // Referral
  'referral.created.v1': 1,
  'referral.reward.created.v1': 1,
  // Payment
  'payment.succeeded.v1': 1,
  'payment.failed.v1': 1,
  // Payout
  'payout.requested.v1': 1,
  'payout.completed.v1': 1,
  // Risk
  'risk.detected.v1': 1,
  // Audit
  'audit.entry.created.v1': 1,
  // AI
  'ai.decision.created.v1': 1,
} as const;

export type EventType = keyof typeof EVENT_TYPES;
