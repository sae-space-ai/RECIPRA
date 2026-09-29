/**
 * RECIPRA Web — Home Page.
 *
 * HITO 1: Technical foundation page. No commercial UI.
 * This page identifies itself as RECIPRA Foundation/Development.
 */

export default function HomePage() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '640px', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem',
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem',
          }}>
            ⚡
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>RECIPRA</h1>
            <p style={{ fontSize: '0.625rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
              Reward OS — Foundation / Development
            </p>
          </div>
        </div>

        <div style={{
          background: '#111118', border: '1px solid #1e1e2a', borderRadius: '0.75rem',
          padding: '1.5rem', marginBottom: '1rem',
        }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff', marginBottom: '1rem' }}>
            HITO 1 — Bootstrap + Architecture + Foundation
          </h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <Row label="Repository" value="sae-space-ai/RECIPRA" />
            <Row label="Architecture" value="Modular Monolith + Event-Oriented" />
            <Row label="Database" value="PostgreSQL 17+ (RLS, Double-Entry)" />
            <Row label="Ledger" value="Immutable, Balanced, NUMERIC(20,8)" />
            <Row label="Events" value="Transactional Outbox (At-Least-Once)" />
            <Row label="Web" value="Next.js 14 App Router" />
            <Row label="API" value="Node.js HTTP (health/ready)" />
            <Row label="Worker" value="Outbox Processor (skeleton)" />
            <Row label="Status" value="READY_FOR_EXTERNAL_VERIFICATION" color="#10b981" />
          </div>
        </div>

        <div style={{
          background: '#111118', border: '1px solid #1e1e2a', borderRadius: '0.75rem',
          padding: '1.5rem', marginBottom: '1rem',
        }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff', marginBottom: '0.75rem' }}>
            Canonical Economic Invariant
          </h2>
          <code style={{
            display: 'block', background: '#0a0a0f', padding: '0.75rem', borderRadius: '0.5rem',
            fontSize: '0.75rem', color: '#10b981', fontFamily: 'monospace',
          }}>
            gross = user_reward + referral_reward + provider_cost + platform_margin
          </code>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.5rem' }}>
            All monetary values: PostgreSQL NUMERIC(20,8). IEEE-754 float PROHIBITED.
          </p>
        </div>

        <div style={{
          background: '#111118', border: '1px solid #7f1d1d33', borderRadius: '0.75rem',
          padding: '1rem',
        }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: '600', color: '#f87171', marginBottom: '0.5rem' }}>
            Hard Prohibitions
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', fontSize: '0.6875rem', color: '#9ca3af' }}>
            <span>✕ No wallet.balance += X</span>
            <span>✕ No AI → ledger direct</span>
            <span>✕ No reward on RECEIVED</span>
            <span>✕ No edit POSTED entries</span>
            <span>✕ No disable RLS</span>
            <span>✕ No IEEE-754 for money</span>
          </div>
        </div>

        <p style={{ fontSize: '0.6875rem', color: '#4b5563', marginTop: '1.5rem', textAlign: 'center' }}>
          No commercial data. No simulated production metrics. This is a technical foundation page.
        </p>
      </div>
    </main>
  );
}

function Row({ label, value, color = '#e5e7eb' }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.25rem 0', fontSize: '0.75rem' }}>
      <span style={{ color: '#9ca3af' }}>{label}</span>
      <span style={{ color, fontFamily: 'monospace', fontSize: '0.6875rem' }}>{value}</span>
    </div>
  );
}
