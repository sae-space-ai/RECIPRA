/**
 * @recipra/policy
 *
 * Policy Engine foundation.
 *
 * CRITICAL:
 * - AI produces signals; Policy decides
 * - High-risk operations require MANUAL_REVIEW
 * - AI never posts to ledger or autonomously approves material payouts
 * - Every policy decision is recorded with evidence
 */

import type { TenantId, UserId, ConversionId, PayoutId } from '@recipra/contracts';

/**
 * Policy decision result.
 */
export interface PolicyDecision {
  readonly allowed: boolean;
  readonly rule: string;
  readonly reason: string;
  readonly requiresHumanReview: boolean;
  readonly riskLevel: 'low' | 'medium' | 'high' | 'critical';
  readonly evidence: Record<string, unknown>;
}

/**
 * Policy rule interface.
 */
export interface PolicyRule {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  evaluate(context: PolicyContext): Promise<PolicyDecision>;
}

/**
 * Context for policy evaluation.
 */
export interface PolicyContext {
  readonly tenantId: TenantId;
  readonly userId?: UserId;
  readonly action: string;
  readonly resource: Record<string, unknown>;
}

/**
 * Policy Engine interface.
 */
export interface PolicyEngine {
  evaluate(context: PolicyContext): Promise<PolicyDecision>;
  registerRule(rule: PolicyRule): void;
}

/**
 * Canonical policy rules.
 */
export const POLICY_RULES = {
  CAN_REWARD_CONVERSION: 'CAN_REWARD_CONVERSION',
  CAN_SHOW_INCENT_OFFER: 'CAN_SHOW_INCENT_OFFER',
  CAN_APPROVE_PAYOUT: 'CAN_APPROVE_PAYOUT',
  REQUIRES_KYC: 'REQUIRES_KYC',
  REQUIRES_HUMAN_REVIEW: 'REQUIRES_HUMAN_REVIEW',
  CAN_USE_AI_AUTOMATION: 'CAN_USE_AI_AUTOMATION',
  CAN_PROCESS_PERSONAL_DATA: 'CAN_PROCESS_PERSONAL_DATA',
} as const;

export type PolicyRuleName = typeof POLICY_RULES[keyof typeof POLICY_RULES];

/**
 * Conversion policy context.
 */
export interface ConversionPolicyContext extends PolicyContext {
  readonly action: 'conversion.approve';
  readonly resource: {
    conversionId: ConversionId;
    offerId: string;
    userId: UserId;
    grossAmount: string;
    clickAge: number; // seconds since click
    ipAddresses: string[];
    deviceFingerprints: string[];
  };
}

/**
 * Payout policy context.
 */
export interface PayoutPolicyContext extends PolicyContext {
  readonly action: 'payout.approve';
  readonly resource: {
    payoutId: PayoutId;
    userId: UserId;
    amount: string;
    currency: string;
    availableBalance: string;
    accountAge: number; // days
    previousPayouts: number;
  };
}
