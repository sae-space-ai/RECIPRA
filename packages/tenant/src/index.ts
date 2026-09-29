/**
 * @recipra/tenant
 *
 * Multi-tenant isolation foundation.
 *
 * CRITICAL:
 * - Identity can be global; membership is tenant-specific
 * - All tenant-scoped tables must have tenant_id or clear ownership
 * - RLS enforced at database level (ENABLE + FORCE)
 * - App DB role NEVER superuser/BYPASSRLS
 * - Tenant context from session, NOT from client request
 * - Tests must verify Tenant-A cannot access Tenant-B data
 */

import type { TenantId, UserId } from '@recipra/contracts';

/**
 * Tenant configuration.
 */
export interface Tenant {
  readonly id: TenantId;
  readonly name: string;
  readonly slug: string;
  readonly domain?: string;
  readonly status: 'active' | 'suspended' | 'pending';
  readonly defaultCurrency: string;
  readonly config: Record<string, unknown>;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Tenant membership (user-tenant relationship).
 */
export interface TenantMembership {
  readonly id: string;
  readonly tenantId: TenantId;
  readonly userId: UserId;
  readonly role: string;
  readonly permissions: string[];
  readonly status: 'active' | 'inactive';
  readonly createdAt: string;
}

/**
 * Tenant context for the current request.
 * Derived from session, NOT from client request.
 */
export interface TenantContext {
  readonly tenantId: TenantId;
  readonly userId: UserId;
  readonly role: string;
  readonly permissions: string[];
}

/**
 * Validates that a tenant context is properly formed.
 */
export function validateTenantContext(ctx: unknown): ctx is TenantContext {
  if (!ctx || typeof ctx !== 'object') return false;
  const c = ctx as Record<string, unknown>;
  return (
    typeof c.tenantId === 'string' &&
    typeof c.userId === 'string' &&
    typeof c.role === 'string' &&
    Array.isArray(c.permissions)
  );
}

/**
 * Tenant isolation test helper.
 * Verifies that a query cannot access data from another tenant.
 */
export function buildTenantIsolationTestSQL(tenantA: string, tenantB: string): string {
  return `
    -- Test: Tenant A cannot read Tenant B's data
    SET LOCAL app.current_tenant_id = '${tenantA}';
    
    -- This should return 0 rows (Tenant B's data)
    SELECT COUNT(*) as count FROM offers WHERE tenant_id = '${tenantB}';
    
    -- If count > 0, RLS is broken!
  `;
}
