# ADR-003: Multi-Tenant RLS

## Status
ACCEPTED

## Context
RECIPRA is a multi-tenant SaaS platform. Each tenant's data must be completely isolated. Options considered:
1. Separate database per tenant
2. Separate schema per tenant
3. Shared tables with Row Level Security (RLS)

## Decision
**Shared tables with PostgreSQL Row Level Security (RLS).**

All tenant-scoped tables have:
- `tenant_id` column
- `ENABLE ROW LEVEL SECURITY`
- `FORCE ROW LEVEL SECURITY` (even for table owner)
- Policy: `USING (tenant_id = current_setting('app.current_tenant_id')::UUID)`

## Rules
1. App DB role is NEVER superuser or BYPASSRLS
2. Tenant context comes from session, NOT from client request
3. Migration/admin role is separate from runtime role
4. Tests must verify Tenant-A cannot access Tenant-B data
5. Child tables without direct `tenant_id` must have ownership-based policies

## Consequences
- **Positive:** Single database, simpler operations, consistent schema
- **Positive:** RLS enforced at DB level (not just application)
- **Positive:** Can verify isolation with SQL tests
- **Negative:** Requires discipline to always set tenant context
- **Negative:** Must protect child tables carefully
