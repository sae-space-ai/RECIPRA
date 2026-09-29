/**
 * @recipra/audit
 *
 * Audit trail foundation.
 *
 * CRITICAL:
 * - Append-only (enforced by DB trigger)
 * - No passwords, tokens, secrets, or unnecessary PII
 * - Every entry has: actor, tenant, action, resource, timestamp, correlation, result
 * - Correlation IDs link related audit entries
 */

import type { TenantId, UserId, CorrelationId } from '@recipra/contracts';

/**
 * Audit entry.
 */
export interface AuditEntry {
  readonly id: string;
  readonly tenantId: TenantId;
  readonly actorId?: UserId;
  readonly actorType: 'user' | 'system' | 'policy_engine' | 'adapter';
  readonly action: string;
  readonly resourceType: string;
  readonly resourceId?: string;
  readonly correlationId?: CorrelationId;
  readonly result: 'success' | 'failure' | 'denied';
  readonly details?: Record<string, unknown>;
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly createdAt: string;
}

/**
 * Input for creating an audit entry.
 */
export interface CreateAuditEntryInput {
  readonly tenantId: TenantId;
  readonly actorId?: UserId;
  readonly actorType: 'user' | 'system' | 'policy_engine' | 'adapter';
  readonly action: string;
  readonly resourceType: string;
  readonly resourceId?: string;
  readonly correlationId?: CorrelationId;
  readonly result: 'success' | 'failure' | 'denied';
  readonly details?: Record<string, unknown>;
  readonly ipAddress?: string;
  readonly userAgent?: string;
}

/**
 * Audit store interface.
 */
export interface AuditStore {
  create(input: CreateAuditEntryInput): Promise<AuditEntry>;
  getByCorrelation(correlationId: CorrelationId): Promise<AuditEntry[]>;
  getByResource(resourceType: string, resourceId: string): Promise<AuditEntry[]>;
}

/**
 * Sanitizes details to remove sensitive data.
 */
export function sanitizeAuditDetails(details: Record<string, unknown>): Record<string, unknown> {
  const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'creditCard', 'ssn'];
  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(details)) {
    if (sensitiveKeys.some(sk => key.toLowerCase().includes(sk.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeAuditDetails(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}
