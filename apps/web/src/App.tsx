/**
 * RECIPRA Web — Member-facing application.
 *
 * HITO 1: Minimal technical page. No business dashboard yet.
 * This demonstrates the build pipeline works.
 */

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981', marginBottom: '1rem' }}>
          RECIPRA
        </h1>
        <p style={{ fontSize: '1rem', color: '#9ca3af', marginBottom: '2rem' }}>
          Reward OS Platform
        </p>
        <div style={{ background: '#111118', border: '1px solid #1e1e2a', borderRadius: '12px', padding: '1.5rem', textAlign: 'left' }}>
          <h2 style={{ fontSize: '0.875rem', fontWeight: '600', color: '#fff', marginBottom: '1rem' }}>
            System Status
          </h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            <StatusRow label="Repository" value="sae-space-ai/RECIPRA" />
            <StatusRow label="Milestone" value="HITO 1 — Bootstrap" />
            <StatusRow label="Architecture" value="Modular Monolith" />
            <StatusRow label="Database" value="PostgreSQL 17+" />
            <StatusRow label="Ledger" value="Double-Entry (DESIGNED)" />
            <StatusRow label="Events" value="Transactional Outbox (DESIGNED)" />
            <StatusRow label="Web App" value="Build OK ✓" color="#10b981" />
          </div>
        </div>
        <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '1.5rem' }}>
          HITO 1: Bootstrap + Architecture + CI + Database Foundation
        </p>
      </div>
    </div>
  );
}

function StatusRow({ label, value, color = '#e5e7eb' }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0', fontSize: '0.75rem' }}>
      <span style={{ color: '#9ca3af' }}>{label}</span>
      <span style={{ color, fontFamily: 'monospace' }}>{value}</span>
    </div>
  );
}
