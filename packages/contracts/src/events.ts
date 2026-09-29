/**
 * Event type registry for RECIPRA.
 *
 * All event types must be registered here with their version.
 * This enables type-safe event handling and versioning.
 */

export const EVENT_TYPES = {
  // Identity
  'identity.user.created': 1,
  'identity.session.created': 1,
  'identity.session.revoked': 1,

  // Tenant
  'tenant.created': 1,
  'tenant.updated': 1,
  'tenant.member.added': 1,
  'tenant.member.removed': 1,

  // Offer
  'offer.created': 1,
  'offer.updated': 1,
  'offer.paused': 1,
  'offer.expired': 1,

  // Tracking
  'tracking.click.created': 1,

  // Conversion
  'conversion.received': 1,
  'conversion.verified': 1,
  'conversion.approved': 1,
  'conversion.rejected': 1,
  'conversion.rewarded': 1,
  'conversion.settled': 1,
  'conversion.reversed': 1,
  'conversion.disputed': 1,

  // Ledger
  'ledger.transaction.created': 1,
  'ledger.transaction.posted': 1,

  // Referral
  'referral.created': 1,
  'referral.reward.created': 1,

  // Payment
  'payment.succeeded': 1,
  'payment.failed': 1,
  'payment.chargeback': 1,

  // Payout
  'payout.requested': 1,
  'payout.reserved': 1,
  'payout.approved': 1,
  'payout.rejected': 1,
  'payout.completed': 1,
  'payout.failed': 1,

  // Risk
  'risk.detected': 1,
  'risk.reviewed': 1,
  'risk.resolved': 1,

  // Audit
  'audit.entry.created': 1,

  // Evidence
  'evidence.created': 1,
  'evidence.verified': 1,

  // AI (Future)
  'ai.decision.created': 1,
  'ai.system.registered': 1,
  'ai.incident.created': 1,
} as const;

export type EventType = keyof typeof EVENT_TYPES;

/**
 * Formats an event type with version.
 * Example: formatEventType('conversion.verified', 1) => 'conversion.verified.v1'
 */
export function formatEventType(type: EventType, version: number): string {
  return `${type}.v${version}`;
}

/**
 * Parses an event type string into type and version.
 * Example: parseEventType('conversion.verified.v1') => { type: 'conversion.verified', version: 1 }
 */
export function parseEventType(fullType: string): { type: string; version: number } | null {
  const match = fullType.match(/^(.+)\.v(\d+)$/);
  if (!match) return null;
  return {
    type: match[1]!,
    version: parseInt(match[2]!, 10),
  };
}
