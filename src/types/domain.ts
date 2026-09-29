// RECIPRA Domain Types - Canonical definitions
// Status classification per mandate

export type ModuleStatus =
  | 'NOT_STARTED'
  | 'DESIGNED'
  | 'IMPLEMENTING'
  | 'IMPLEMENTED'
  | 'UNIT_TESTED'
  | 'INTEGRATION_TESTED'
  | 'E2E_TESTED'
  | 'SECURITY_TESTED'
  | 'READY_FOR_REVIEW'
  | 'MERGED'
  | 'DEPLOYED'
  | 'PRODUCTION_VERIFIED'
  | 'BLOCKED_BY_CREDENTIALS';

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

export type OfferType = 'CPA' | 'CPL' | 'CPI' | 'CPS' | 'SURVEY' | 'CASHBACK' | 'PTC' | 'REWARDED_AD' | 'TASK' | 'GAME';

export type IncentiveAllowed = 'INCENTIVIZED' | 'NON_INCENTIVIZED' | 'BOTH';

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  status: 'active' | 'suspended' | 'pending';
  createdAt: string;
  modules: string[];
}

export interface Offer {
  id: string;
  tenantId: string;
  title: string;
  description: string;
  type: OfferType;
  category: string;
  countries: string[];
  devices: string[];
  incentiveAllowed: IncentiveAllowed;
  grossAmount: string; // Decimal string - NEVER IEEE-754
  userReward: string;
  referralReward: string;
  providerCost: string;
  platformMargin: string;
  provider: string;
  status: 'active' | 'paused' | 'expired';
  startDate: string;
  endDate: string;
  dailyCap: number;
  conversionsToday: number;
}

export interface WalletBalance {
  available: string;
  pending: string;
  reserved: string;
  paid: string;
  reversed: string;
}

export interface LedgerEntry {
  id: string;
  tenantId: string;
  transactionId: string;
  accountId: string;
  accountType: string;
  debit: string;
  credit: string;
  currency: string;
  status: 'POSTED' | 'DRAFT';
  correlationId: string;
  createdAt: string;
  description: string;
}

export interface Referral {
  id: string;
  tenantId: string;
  referrerId: string;
  referredId: string;
  level: number;
  status: 'active' | 'inactive';
  totalEarnings: string;
  createdAt: string;
}

export interface Conversion {
  id: string;
  tenantId: string;
  offerId: string;
  clickId: string;
  userId: string;
  state: ConversionState;
  grossAmount: string;
  userReward: string;
  referralReward: string;
  providerCost: string;
  platformMargin: string;
  correlationId: string;
  receivedAt: string;
  verifiedAt?: string;
  approvedAt?: string;
  rewardedAt?: string;
  settledAt?: string;
}

export interface PlatformMetrics {
  totalUsers: number;
  activeOffers: number;
  conversionsToday: number;
  grossToday: string;
  netMarginToday: string;
  pendingPayouts: string;
  reversalRate: number;
  fraudDetected: number;
}

export interface AuditEntry {
  id: string;
  tenantId: string;
  actor: string;
  action: string;
  resource: string;
  timestamp: string;
  correlationId: string;
  result: 'success' | 'failure' | 'denied';
  details: string;
}

export interface ModuleDefinition {
  id: string;
  name: string;
  version: string;
  category: 'core' | 'business' | 'pro' | 'ai';
  status: ModuleStatus;
  description: string;
  dependencies: string[];
  permissions: string[];
}

export interface EventEnvelope {
  eventId: string;
  type: string;
  version: number;
  tenantId: string;
  aggregateId: string;
  occurredAt: string;
  actor: string;
  correlationId: string;
  causationId?: string;
  payload: Record<string, unknown>;
}
