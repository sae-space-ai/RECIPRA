-- RECIPRA Database Foundation
-- HITO 1: Database Schema
-- PostgreSQL 17+ required
-- All monetary values: NUMERIC (never float)
-- All tenant-scoped tables: RLS enabled
-- App role: NEVER superuser/BYPASSRLS

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ROLES (execute as superuser once, then switch to app role)
-- ============================================================================
-- DO NOT run these in production without reviewing
-- CREATE ROLE recipra_app LOGIN PASSWORD 'CHANGE_ME';
-- CREATE ROLE recipra_readonly LOGIN PASSWORD 'CHANGE_ME';
-- GRANT CONNECT ON DATABASE recipra TO recipra_app;
-- GRANT USAGE ON SCHEMA public TO recipra_app;

-- ============================================================================
-- ENUMS
-- ============================================================================
CREATE TYPE conversion_state AS ENUM (
  'RECEIVED',
  'PENDING',
  'VERIFIED',
  'APPROVED',
  'REWARDED',
  'SETTLED',
  'REJECTED',
  'REVERSED',
  'DISPUTED',
  'FRAUD_HOLD',
  'MANUAL_REVIEW'
);

CREATE TYPE offer_type AS ENUM (
  'CPA', 'CPL', 'CPI', 'CPS',
  'SURVEY', 'CASHBACK', 'PTC',
  'REWARDED_AD', 'TASK', 'GAME'
);

CREATE TYPE incentive_allowed AS ENUM (
  'INCENTIVIZED',
  'NON_INCENTIVIZED',
  'BOTH'
);

CREATE TYPE ledger_entry_status AS ENUM ('DRAFT', 'POSTED');

CREATE TYPE payout_state AS ENUM (
  'REQUESTED',
  'RESERVED',
  'APPROVED',
  'REJECTED',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'REVERSED'
);

CREATE TYPE tenant_status AS ENUM ('active', 'suspended', 'pending');

CREATE TYPE offer_status AS ENUM ('active', 'paused', 'expired');

-- ============================================================================
-- TENANTS
-- ============================================================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  domain VARCHAR(255),
  status tenant_status NOT NULL DEFAULT 'pending',
  default_currency CHAR(3) NOT NULL DEFAULT 'EUR',
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- USERS (identity can be global, membership tenant-specific)
-- ============================================================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE,
  email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

CREATE TABLE tenant_memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) NOT NULL DEFAULT 'member', -- platform_superadmin, tenant_owner, tenant_admin, member, etc.
  permissions JSONB NOT NULL DEFAULT '[]',
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

CREATE INDEX idx_tenant_memberships_tenant ON tenant_memberships(tenant_id);
CREATE INDEX idx_tenant_memberships_user ON tenant_memberships(user_id);

-- ============================================================================
-- OFFERS
-- ============================================================================
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  type offer_type NOT NULL,
  category VARCHAR(100),
  countries TEXT[] NOT NULL DEFAULT '{}',
  devices TEXT[] NOT NULL DEFAULT '{}',
  incentive_allowed incentive_allowed NOT NULL DEFAULT 'BOTH',
  
  -- Economics (NUMERIC, never float)
  gross_amount NUMERIC(20, 8) NOT NULL CHECK (gross_amount >= 0),
  user_reward NUMERIC(20, 8) NOT NULL CHECK (user_reward >= 0),
  referral_reward NUMERIC(20, 8) NOT NULL DEFAULT 0 CHECK (referral_reward >= 0),
  provider_cost NUMERIC(20, 8) NOT NULL CHECK (provider_cost >= 0),
  platform_margin NUMERIC(20, 8) NOT NULL CHECK (platform_margin >= 0),
  
  -- Invariant check (can be enforced via trigger or application)
  CONSTRAINT offer_economics_invariant CHECK (
    gross_amount = user_reward + referral_reward + provider_cost + platform_margin
  ),
  
  provider VARCHAR(255) NOT NULL,
  external_id VARCHAR(255),
  status offer_status NOT NULL DEFAULT 'active',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  daily_cap INTEGER NOT NULL DEFAULT 0,
  conversions_today INTEGER NOT NULL DEFAULT 0,
  terms TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_offers_tenant ON offers(tenant_id);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_offers_type ON offers(type);

-- ============================================================================
-- TRACKING (clicks)
-- ============================================================================
CREATE TABLE clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  click_id VARCHAR(100) NOT NULL UNIQUE, -- signed, non-predictable
  signature VARCHAR(255) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  correlation_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_clicks_tenant ON clicks(tenant_id);
CREATE INDEX idx_clicks_offer ON clicks(offer_id);
CREATE INDEX idx_clicks_user ON clicks(user_id);
CREATE INDEX idx_clicks_click_id ON clicks(click_id);

-- ============================================================================
-- CONVERSIONS
-- ============================================================================
CREATE TABLE conversions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  click_id UUID REFERENCES clicks(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  state conversion_state NOT NULL DEFAULT 'RECEIVED',
  
  -- Economics (from offer at time of conversion)
  gross_amount NUMERIC(20, 8) NOT NULL,
  user_reward NUMERIC(20, 8) NOT NULL,
  referral_reward NUMERIC(20, 8) NOT NULL DEFAULT 0,
  provider_cost NUMERIC(20, 8) NOT NULL,
  platform_margin NUMERIC(20, 8) NOT NULL,
  
  -- Verification
  external_id VARCHAR(255),
  webhook_signature VARCHAR(255),
  raw_event JSONB,
  
  -- Tracking
  correlation_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  idempotency_key VARCHAR(255) UNIQUE,
  
  -- Timestamps
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ,
  settled_at TIMESTAMPTZ,
  reversed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_conversions_tenant ON conversions(tenant_id);
CREATE INDEX idx_conversions_offer ON conversions(offer_id);
CREATE INDEX idx_conversions_user ON conversions(user_id);
CREATE INDEX idx_conversions_state ON conversions(state);
CREATE INDEX idx_conversions_correlation ON conversions(correlation_id);

-- ============================================================================
-- LEDGER (double-entry, immutable when POSTED)
-- ============================================================================
CREATE TABLE ledger_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  description TEXT,
  correlation_id UUID NOT NULL,
  causation_id UUID,
  status ledger_entry_status NOT NULL DEFAULT 'DRAFT',
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ledger_transactions_tenant ON ledger_transactions(tenant_id);
CREATE INDEX idx_ledger_transactions_correlation ON ledger_transactions(correlation_id);

CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  transaction_id UUID NOT NULL REFERENCES ledger_transactions(id) ON DELETE CASCADE,
  account_id VARCHAR(255) NOT NULL, -- e.g., 'user_wallet_123', 'platform_revenue', 'provider_receivable'
  account_type VARCHAR(50) NOT NULL, -- asset, liability, equity, revenue, expense
  debit NUMERIC(20, 8) NOT NULL DEFAULT 0 CHECK (debit >= 0),
  credit NUMERIC(20, 8) NOT NULL DEFAULT 0 CHECK (credit >= 0),
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  description TEXT,
  status ledger_entry_status NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Cannot have both debit and credit
  CONSTRAINT ledger_entry_not_both CHECK (
    (debit > 0 AND credit = 0) OR (debit = 0 AND credit > 0)
  )
);

CREATE INDEX idx_ledger_entries_tenant ON ledger_entries(tenant_id);
CREATE INDEX idx_ledger_entries_transaction ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_entries_account ON ledger_entries(account_id);

-- Trigger: Prevent UPDATE/DELETE of POSTED entries
CREATE OR REPLACE FUNCTION prevent_posted_modification()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'POSTED' THEN
    RAISE EXCEPTION 'Cannot modify POSTED ledger entries';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_posted_entry_modification
BEFORE UPDATE OR DELETE ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION prevent_posted_modification();

CREATE TRIGGER trg_prevent_posted_transaction_modification
BEFORE UPDATE OR DELETE ON ledger_transactions
FOR EACH ROW EXECUTE FUNCTION prevent_posted_modification();

-- ============================================================================
-- REFERRALS
-- ============================================================================
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level INTEGER NOT NULL DEFAULT 1 CHECK (level > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  total_earned NUMERIC(20, 8) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(tenant_id, referred_id), -- user can only be referred once per tenant
  CONSTRAINT no_self_referral CHECK (referrer_id != referred_id)
);

CREATE INDEX idx_referrals_tenant ON referrals(tenant_id);
CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);

-- ============================================================================
-- PAYOUTS
-- ============================================================================
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(20, 8) NOT NULL CHECK (amount > 0),
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  state payout_state NOT NULL DEFAULT 'REQUESTED',
  
  -- PSP
  provider VARCHAR(100),
  external_id VARCHAR(255),
  
  -- Tracking
  correlation_id UUID NOT NULL DEFAULT uuid_generate_v4(),
  idempotency_key VARCHAR(255) UNIQUE,
  
  -- Timestamps
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reserved_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payouts_tenant ON payouts(tenant_id);
CREATE INDEX idx_payouts_user ON payouts(user_id);
CREATE INDEX idx_payouts_state ON payouts(state);

-- ============================================================================
-- EVENTS OUTBOX (transactional outbox pattern)
-- ============================================================================
CREATE TABLE event_outbox (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  event_version INTEGER NOT NULL DEFAULT 1,
  aggregate_type VARCHAR(100) NOT NULL,
  aggregate_id UUID NOT NULL,
  payload JSONB NOT NULL,
  correlation_id UUID,
  causation_id UUID,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Delivery tracking
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending, delivered, failed
  attempts INTEGER NOT NULL DEFAULT 0,
  last_error TEXT,
  next_attempt_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_event_outbox_tenant ON event_outbox(tenant_id);
CREATE INDEX idx_event_outbox_status ON event_outbox(status);
CREATE INDEX idx_event_outbox_next_attempt ON event_outbox(next_attempt_at);

-- ============================================================================
-- AUDIT LOG (append-only)
-- ============================================================================
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_type VARCHAR(50) NOT NULL, -- user, system, policy_engine
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100) NOT NULL,
  resource_id UUID,
  correlation_id UUID,
  result VARCHAR(20) NOT NULL, -- success, failure, denied
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_tenant ON audit_log(tenant_id);
CREATE INDEX idx_audit_log_actor ON audit_log(actor_id);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_correlation ON audit_log(correlation_id);

-- Prevent UPDATE/DELETE on audit_log
CREATE OR REPLACE FUNCTION prevent_audit_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Cannot modify audit log entries';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_prevent_audit_modification
BEFORE UPDATE OR DELETE ON audit_log
FOR EACH ROW EXECUTE FUNCTION prevent_audit_modification();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tenant-scoped tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Force RLS (even for table owner)
ALTER TABLE tenants FORCE ROW LEVEL SECURITY;
ALTER TABLE tenant_memberships FORCE ROW LEVEL SECURITY;
ALTER TABLE offers FORCE ROW LEVEL SECURITY;
ALTER TABLE clicks FORCE ROW LEVEL SECURITY;
ALTER TABLE conversions FORCE ROW LEVEL SECURITY;
ALTER TABLE ledger_transactions FORCE ROW LEVEL SECURITY;
ALTER TABLE ledger_entries FORCE ROW LEVEL SECURITY;
ALTER TABLE referrals FORCE ROW LEVEL SECURITY;
ALTER TABLE payouts FORCE ROW LEVEL SECURITY;
ALTER TABLE event_outbox FORCE ROW LEVEL SECURITY;
ALTER TABLE audit_log FORCE ROW LEVEL SECURITY;

-- RLS Policies (example for offers - similar for other tables)
-- In production, tenant_id comes from session context, not client
CREATE POLICY tenant_isolation_offers ON offers
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_conversions ON conversions
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_ledger_transactions ON ledger_transactions
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_ledger_entries ON ledger_entries
  USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Add similar policies for all tenant-scoped tables...

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Set current tenant context (call at start of each request)
CREATE OR REPLACE FUNCTION set_tenant_context(p_tenant_id UUID)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config('app.current_tenant_id', p_tenant_id::TEXT, TRUE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get current tenant context
CREATE OR REPLACE FUNCTION get_current_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN current_setting('app.current_tenant_id')::UUID;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- VIEWS (read models)
-- ============================================================================

-- Wallet projection (read model from ledger)
CREATE VIEW wallet_balances AS
SELECT
  tenant_id,
  account_id,
  currency,
  SUM(credit) - SUM(debit) AS balance
FROM ledger_entries
WHERE status = 'POSTED'
GROUP BY tenant_id, account_id, currency;

-- Available balance per user (pending payouts excluded)
CREATE VIEW user_available_balances AS
SELECT
  e.tenant_id,
  REPLACE(e.account_id, 'user_wallet_', '')::UUID AS user_id,
  e.currency,
  SUM(e.credit) - SUM(e.debit) AS available_balance
FROM ledger_entries e
WHERE e.status = 'POSTED'
  AND e.account_id LIKE 'user_wallet_%'
GROUP BY e.tenant_id, e.account_id, e.currency;
