/**
 * @recipra/auth
 *
 * Identity and authentication foundation.
 *
 * HITO 1: Defines adapter interfaces only. No real OAuth implementation.
 * HITO 2: Will implement OAuth adapters (Google, GitHub, Meta, X).
 *
 * CRITICAL:
 * - OAuth state must be cryptographically random, hashed-at-rest, expirable, one-use
 * - PKCE where applicable
 * - Redirect URI validated
 * - Tokens never in frontend/logs
 * - Session: HttpOnly + Secure + SameSite + rotation
 */

import type { UserId, TenantId, SessionId } from '@recipra/contracts';

/**
 * Normalized identity from any OAuth provider.
 * Adapters convert provider-specific responses to this format.
 */
export interface NormalizedIdentity {
  readonly provider: string; // 'google' | 'github' | 'meta' | 'x'
  readonly providerUserId: string;
  readonly email?: string;
  readonly emailVerified: boolean;
  readonly displayName?: string;
  readonly avatarUrl?: string;
}

/**
 * Identity provider adapter interface.
 * All OAuth providers must implement this interface.
 */
export interface IdentityProviderAdapter {
  readonly providerId: string;

  /**
   * Generates the authorization URL for OAuth flow.
   * Must include: state (random, hashed), PKCE code_challenge, redirect_uri.
   */
  getAuthorizationUrl(params: {
    redirectUri: string;
    state: string;
    codeChallenge?: string;
    scopes?: string[];
  }): string;

  /**
   * Exchanges authorization code for tokens.
   * Must validate: state, PKCE code_verifier, redirect_uri.
   * Returns normalized identity.
   */
  exchangeCode(params: {
    code: string;
    state: string;
    redirectUri: string;
    codeVerifier?: string;
  }): Promise<NormalizedIdentity>;

  /**
   * Refreshes an access token.
   */
  refreshToken?(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }>;

  /**
   * Revokes a token.
   */
  revokeToken?(token: string): Promise<void>;
}

/**
 * Session data stored server-side.
 * The session ID sent to client is opaque; the hash is stored in DB.
 */
export interface Session {
  readonly id: SessionId;
  readonly userId: UserId;
  readonly tenantId: TenantId;
  readonly roles: string[];
  readonly permissions: string[];
  readonly createdAt: string;
  readonly expiresAt: string;
  readonly lastActivityAt: string;
  readonly ipAddress?: string;
  readonly userAgent?: string;
}

/**
 * Session store interface.
 */
export interface SessionStore {
  create(session: Omit<Session, 'id'>): Promise<Session>;
  get(id: SessionId): Promise<Session | null>;
  update(id: SessionId, data: Partial<Session>): Promise<Session>;
  revoke(id: SessionId): Promise<void>;
  revokeAll(userId: UserId): Promise<void>;
}

/**
 * RBAC role definitions.
 */
export const ROLES = {
  PLATFORM_SUPERADMIN: 'platform_superadmin',
  TENANT_OWNER: 'tenant_owner',
  TENANT_ADMIN: 'tenant_admin',
  FINANCE_MANAGER: 'finance_manager',
  CAMPAIGN_MANAGER: 'campaign_manager',
  COMPLIANCE_OFFICER: 'compliance_officer',
  SUPPORT_AGENT: 'support_agent',
  ANALYST: 'analyst',
  DEVELOPER: 'developer',
  MEMBER: 'member',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

/**
 * Permission definitions.
 */
export const PERMISSIONS = {
  // Ledger
  LEDGER_READ: 'ledger.read',
  LEDGER_POST: 'ledger.post',

  // Payout
  PAYOUT_REQUEST: 'payout.request',
  PAYOUT_APPROVE: 'payout.approve',

  // Campaign
  CAMPAIGN_CREATE: 'campaign.create',
  CAMPAIGN_MANAGE: 'campaign.manage',

  // Provider
  PROVIDER_CREDENTIALS_MANAGE: 'provider.credentials.manage',

  // AI
  AI_SYSTEM_APPROVE: 'ai.system.approve',

  // Evidence
  EVIDENCE_READ: 'evidence.read',
  EVIDENCE_WRITE: 'evidence.write',

  // Privacy
  PRIVACY_REQUEST_PROCESS: 'privacy.request.process',

  // Module
  MODULE_INSTALL: 'module.install',

  // Offer
  OFFER_READ: 'offer.read',
  OFFER_MANAGE: 'offer.manage',

  // Tracking
  TRACKING_CREATE: 'tracking.create',
  TRACKING_READ: 'tracking.read',

  // Referral
  REFERRAL_READ: 'referral.read',
  REFERRAL_MANAGE: 'referral.manage',

  // Risk
  RISK_READ: 'risk.read',
  RISK_MANAGE: 'risk.manage',

  // Wallet
  WALLET_READ: 'wallet.read',

  // Identity
  IDENTITY_READ: 'identity.read',
  IDENTITY_WRITE: 'identity.write',

  // Tenant
  TENANT_READ: 'tenant.read',
  TENANT_WRITE: 'tenant.write',

  // Policy
  POLICY_READ: 'policy.read',
  POLICY_MANAGE: 'policy.manage',

  // SAE
  SAE_READ: 'sae.read',
  SAE_MANAGE: 'sae.manage',

  // Site
  SITE_MANAGE: 'site.manage',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
