import { useState } from 'react';
import { 
  LayoutDashboard, Database, Shield, GitBranch, Zap, FileText, 
  Menu, X, ChevronRight, CheckCircle, AlertCircle, Clock,
  ArrowRight, Lock, Eye, Brain, Users, DollarSign
} from 'lucide-react';

type Page = 'overview' | 'architecture' | 'modules' | 'economics' | 'events' | 'security' | 'database' | 'milestones';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: 'overview' as Page, label: 'Project Overview', icon: LayoutDashboard },
    { id: 'architecture' as Page, label: 'Architecture', icon: GitBranch },
    { id: 'modules' as Page, label: 'Modules', icon: Zap },
    { id: 'economics' as Page, label: 'Economic Model', icon: DollarSign },
    { id: 'events' as Page, label: 'Event Flow', icon: ArrowRight },
    { id: 'security' as Page, label: 'Security', icon: Shield },
    { id: 'database' as Page, label: 'Database', icon: Database },
    { id: 'milestones' as Page, label: 'Milestones', icon: FileText },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'overview': return <OverviewPage />;
      case 'architecture': return <ArchitecturePage />;
      case 'modules': return <ModulesPage />;
      case 'economics': return <EconomicsPage />;
      case 'events': return <EventsPage />;
      case 'security': return <SecurityPage />;
      case 'database': return <DatabasePage />;
      case 'milestones': return <MilestonesPage />;
      default: return <OverviewPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center">
            <Zap className="w-5 h-5 text-gray-900" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">RECIPRA</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Reward OS v2.1</p>
          </div>
        </div>
        <nav className="px-3 py-4 space-y-1">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentPage(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentPage === item.id
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
          <div className="px-3 py-2 rounded-lg bg-gray-800/50">
            <p className="text-xs text-gray-400">Repository</p>
            <p className="text-sm font-medium text-white">sae-space-ai/RECIPRA</p>
            <p className="text-[10px] text-emerald-400 mt-1">● HITO 1: Bootstrap</p>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-800">
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                <span>RECIPRA Platform</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white">{navItems.find(n => n.id === currentPage)?.label}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">HITO 1 Active</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// OVERVIEW PAGE
// ============================================================================
function OverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">RECIPRA — Reward OS Platform</h1>
        <p className="text-sm text-gray-400 mt-1">Proprietary, modular, multi-tenant, event-driven platform for verified economic activity</p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <GitBranch className="w-5 h-5 text-emerald-400" />
            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400">Active</span>
          </div>
          <p className="text-2xl font-bold text-white mt-3">HITO 1</p>
          <p className="text-xs text-gray-400 mt-1">Bootstrap + Architecture</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <Database className="w-5 h-5 text-cyan-400" />
            <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/10 text-cyan-400">Ready</span>
          </div>
          <p className="text-2xl font-bold text-white mt-3">PostgreSQL</p>
          <p className="text-xs text-gray-400 mt-1">Foundation Schema</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <FileText className="w-5 h-5 text-purple-400" />
            <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400">Complete</span>
          </div>
          <p className="text-2xl font-bold text-white mt-3">9</p>
          <p className="text-xs text-gray-400 mt-1">Architecture Docs</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <Zap className="w-5 h-5 text-amber-400" />
            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400">Defined</span>
          </div>
          <p className="text-2xl font-bold text-white mt-3">24</p>
          <p className="text-xs text-gray-400 mt-1">Event Types</p>
        </div>
      </div>

      {/* Mission */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Mission</h3>
        <p className="text-sm text-gray-300 leading-relaxed">
          RECIPRA is a proprietary, modular, multi-tenant, event-driven, portable, verifiable and extensible platform for 
          rewards, affiliate marketing (CPA/CPL/CPI/CPS), surveys, offerwalls, cashback, rewarded ads, tasks, loyalty, 
          promotions, coupons, contests, games, traffic exchange, merchant offers, referrals, and multilevel revenue-sharing 
          based exclusively on <span className="text-emerald-400 font-semibold">verified real economic activity</span>.
        </p>
      </div>

      {/* Key Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Core Principles</h3>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Economic Invariant:</strong> gross = user + referral + cost + margin (exact)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Double-Entry Ledger:</strong> Immutable, balanced, PostgreSQL source of truth</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Multi-Tenant RLS:</strong> Every table tenant-scoped, app role never superuser</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">No IEEE-754:</strong> All monetary values NUMERIC/decimal string</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong className="text-white">Adapters Substitutable:</strong> Google ≠ Identity, Stripe ≠ Payment, OpenAI ≠ AI</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-900 border border-red-500/20 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-red-400 mb-3">Hard Prohibitions</h3>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>No wallet.balance += X (projection only)</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>No AI → ledger direct access</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>No reward on RECEIVED state</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>No editing POSTED ledger entries</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>No disabling RLS to fix bugs</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Source of Truth */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Source of Truth</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { what: 'Transactional', source: 'PostgreSQL', icon: Database, color: 'emerald' },
            { what: 'Economic', source: 'Double-Entry Ledger', icon: DollarSign, color: 'cyan' },
            { what: 'Software', source: 'Git', icon: GitBranch, color: 'purple' },
            { what: 'Operational', source: 'Events + Audit', icon: FileText, color: 'amber' },
          ].map(item => (
            <div key={item.what} className={`p-3 rounded-lg border border-${item.color}-500/20 bg-${item.color}-500/5`}>
              <item.icon className={`w-5 h-5 text-${item.color}-400 mb-2`} />
              <p className="text-xs text-gray-400">{item.what}</p>
              <p className="text-sm font-semibold text-white mt-1">{item.source}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ARCHITECTURE PAGE
// ============================================================================
function ArchitecturePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Architecture</h1>
        <p className="text-sm text-gray-400 mt-1">Modular Monolith + Strict Domain Boundaries + Event-Oriented</p>
      </div>

      {/* System Context Diagram */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">System Context</h3>
        <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto">
          <pre>{`┌──────────────────────────────────────────────────────────────┐
│                    RECIPRA PLATFORM                           │
│                                                              │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ apps/web │  │apps/admin│  │ apps/api │  │ apps/worker │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬──────┘  │
│       │              │              │               │         │
│  ┌────┴──────────────┴──────────────┴───────────────┴──────┐ │
│  │              packages/contracts (TypeScript)             │ │
│  └───────────────────────┬──────────────────────────────────┘ │
│                          │                                    │
│  ┌───────────────────────┴──────────────────────────────────┐ │
│  │                  Domain Core (TypeScript)                 │ │
│  │  Identity│Tenant│Ledger│Wallet│Offers│Tracking│Policy    │ │
│  └───────────────────────┬──────────────────────────────────┘ │
│                          │                                    │
│  ┌───────────────────────┴──────────────────────────────────┐ │
│  │              PostgreSQL (Source of Truth)                  │ │
│  │  RLS│Double-Entry Ledger│Outbox│State Machines│Indexes   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              Adapter Layer (Substitutable)                │ │
│  │  OAuth│PSP│Networks│Offerwalls│Surveys│Email│AI│Storage  │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘`}</pre>
        </div>
      </div>

      {/* Trust Boundaries */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Trust Boundaries</h3>
        <div className="space-y-3">
          {[
            { layer: 'Browser/Client', trust: 'Untrusted', desc: 'No business logic. No secrets. No direct DB access.' },
            { layer: 'API/BFF', trust: 'Trust Boundary', desc: 'Derives tenant_id, user_id, roles from session. Validates all input.' },
            { layer: 'Domain Core', trust: 'Enforces Invariants', desc: 'Never trusts client-provided authorization. Validates economics.' },
            { layer: 'PostgreSQL', trust: 'Source of Truth', desc: 'RLS enforces tenant isolation. Triggers prevent ledger mutation.' },
            { layer: 'Adapters', trust: 'External Systems', desc: 'All responses verified (signatures, schemas). Replaceable.' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-800/50 rounded-lg">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{item.layer}</p>
                <p className="text-xs text-emerald-400 mt-0.5">{item.trust}</p>
                <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adapters */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">External Adapters (Substitutable)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'Google/GitHub/Meta/X', role: 'Identity Providers', interface: 'IdentityProviderAdapter' },
            { name: 'Stripe/Sandbox PSP', role: 'Payment Service', interface: 'PaymentProviderAdapter' },
            { name: 'Affiliate Networks', role: 'Offer Sources', interface: 'NetworkAdapter' },
            { name: 'Offerwalls/Surveys', role: 'Content Providers', interface: 'OfferwallAdapter' },
            { name: 'OpenAI/Anthropic', role: 'AI Models', interface: 'ModelProviderAdapter' },
            { name: 'SendGrid/etc', role: 'Email Delivery', interface: 'NotificationAdapter' },
          ].map(item => (
            <div key={item.name} className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-xs text-gray-400">{item.role}</p>
              <p className="text-sm font-semibold text-white mt-1">{item.name}</p>
              <p className="text-[10px] text-emerald-400 font-mono mt-2">{item.interface}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          <strong className="text-amber-400">Principle:</strong> Google ≠ Identity. Stripe ≠ Payment. OpenAI ≠ AI. Vercel ≠ Architecture.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// MODULES PAGE
// ============================================================================
function ModulesPage() {
  const modules = [
    { name: 'Identity', status: 'DESIGNED', category: 'core', desc: 'OAuth adapters, session management, RBAC' },
    { name: 'Tenant', status: 'DESIGNED', category: 'core', desc: 'Multi-tenant isolation, RLS enforcement' },
    { name: 'Ledger', status: 'DESIGNED', category: 'core', desc: 'Double-entry accounting, immutable transactions' },
    { name: 'Wallet', status: 'DESIGNED', category: 'core', desc: 'Read-model projection from ledger' },
    { name: 'Policy', status: 'DESIGNED', category: 'core', desc: 'Authorization rules, risk decisions' },
    { name: 'Offers', status: 'DESIGNED', category: 'business', desc: 'Offer catalog, incentive rules, caps' },
    { name: 'Tracking', status: 'DESIGNED', category: 'business', desc: 'Signed click IDs, attribution' },
    { name: 'Conversion', status: 'DESIGNED', category: 'business', desc: 'State machine, verification, distribution' },
    { name: 'Referral', status: 'DESIGNED', category: 'business', desc: 'Multi-level rewards on verified activity' },
    { name: 'Payments', status: 'DESIGNED', category: 'core', desc: 'PaymentProviderAdapter for PSP' },
    { name: 'Payout', status: 'DESIGNED', category: 'core', desc: 'Request→reserve→policy→PSP→settlement' },
    { name: 'Fraud', status: 'DESIGNED', category: 'business', desc: 'Rule-based detection, velocity checks' },
    { name: 'Audit', status: 'DESIGNED', category: 'supporting', desc: 'Append-only action log' },
    { name: 'Events', status: 'DESIGNED', category: 'supporting', desc: 'Domain events, transactional outbox' },
  ];

  const statusColors: Record<string, string> = {
    NOT_STARTED: 'bg-gray-500/10 text-gray-400',
    DESIGNED: 'bg-blue-500/10 text-blue-400',
    IMPLEMENTING: 'bg-amber-500/10 text-amber-400',
    IMPLEMENTED: 'bg-emerald-500/10 text-emerald-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Modules</h1>
        <p className="text-sm text-gray-400 mt-1">Modular architecture — installable, versioned, permissioned</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map(mod => (
          <div key={mod.name} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">{mod.name}</h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{mod.category}</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusColors[mod.status]}`}>
                {mod.status}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">{mod.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-amber-500/20 rounded-xl p-4">
        <p className="text-xs text-gray-400">
          <strong className="text-amber-400">Status:</strong> All modules are in DESIGNED state. Implementation begins in HITO 2-6.
          No premature integration with external providers. Sandbox/deterministic providers first.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// ECONOMICS PAGE
// ============================================================================
function EconomicsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Economic Model</h1>
        <p className="text-sm text-gray-400 mt-1">Canonical distribution — exact invariant</p>
      </div>

      {/* Canonical Formula */}
      <div className="bg-gray-900 border border-emerald-500/20 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-emerald-400 mb-3">Canonical Economic Invariant</h3>
        <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm">
          <p className="text-emerald-400 text-lg font-bold">gross = user_reward + referral_reward + provider_cost + platform_margin</p>
        </div>
        <div className="mt-4 bg-gray-800/50 rounded-lg p-4">
          <p className="text-xs text-gray-400 mb-2">Example: €10.00 offer</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <p className="text-gray-500">User Reward</p>
              <p className="text-lg font-bold text-emerald-400">€5.00</p>
            </div>
            <div>
              <p className="text-gray-500">Referral</p>
              <p className="text-lg font-bold text-cyan-400">€0.50</p>
            </div>
            <div>
              <p className="text-gray-500">Provider Cost</p>
              <p className="text-lg font-bold text-amber-400">€1.00</p>
            </div>
            <div>
              <p className="text-gray-500">Platform Margin</p>
              <p className="text-lg font-bold text-purple-400">€3.50</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              Sum: €5.00 + €0.50 + €1.00 + €3.50 = <span className="text-emerald-400 font-bold">€10.00</span> ✓
            </p>
          </div>
        </div>
      </div>

      {/* Rules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Monetary Representation</h3>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>PostgreSQL: <code className="text-emerald-400">NUMERIC(20,8)</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Application: <code className="text-emerald-400">string</code> or decimal library</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="text-red-300">PROHIBITED: IEEE-754 <code>Number</code>/<code>float</code></span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Rounding rules defined per currency</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Every distribution closes exactly (invariant check)</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Ledger Principles</h3>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Double-entry: every transaction balanced</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>POSTED entries immutable (trigger enforced)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Corrections via compensating entries (reversals)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Wallet = projection, never authoritative</span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span className="text-red-300">No wallet.balance += X operations</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Distribution Flow */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Distribution Flow</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['Conversion Verified', 'Policy Approved', 'Ledger Posted', 'Wallet Updated', 'Referral Distributed'].map((step, i) => (
            <div key={step} className="flex items-center gap-2 shrink-0">
              <div className="px-3 py-2 bg-gray-800 rounded-lg text-xs text-white">{step}</div>
              {i < 4 && <ArrowRight className="w-4 h-4 text-gray-600" />}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          <strong className="text-amber-400">RECEIVED does NOT produce money.</strong> Only after VERIFIED + APPROVED does the ledger post entries.
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// EVENTS PAGE
// ============================================================================
function EventsPage() {
  const eventCategories = [
    { name: 'Identity', events: ['identity.user.created.v1', 'identity.session.created.v1'] },
    { name: 'Tenant', events: ['tenant.created.v1'] },
    { name: 'Offer', events: ['offer.created.v1'] },
    { name: 'Tracking', events: ['tracking.click.created.v1'] },
    { name: 'Conversion', events: ['conversion.received.v1', 'conversion.verified.v1', 'conversion.approved.v1', 'conversion.rewarded.v1', 'conversion.settled.v1', 'conversion.reversed.v1'] },
    { name: 'Ledger', events: ['ledger.transaction.created.v1', 'ledger.transaction.posted.v1'] },
    { name: 'Referral', events: ['referral.created.v1', 'referral.reward.created.v1'] },
    { name: 'Payment', events: ['payment.succeeded.v1', 'payment.failed.v1'] },
    { name: 'Payout', events: ['payout.requested.v1', 'payout.completed.v1'] },
    { name: 'Risk', events: ['risk.detected.v1'] },
    { name: 'Audit', events: ['audit.entry.created.v1'] },
    { name: 'AI (Future)', events: ['ai.decision.created.v1'] },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Event Flow</h1>
        <p className="text-sm text-gray-400 mt-1">Versioned domain events — transactional outbox pattern</p>
      </div>

      {/* Event Envelope */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Event Envelope Structure</h3>
        <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto">
          <pre>{`{
  "event_id": "evt_...",
  "type": "conversion.verified.v1",
  "version": 1,
  "tenant_id": "tenant_recipra_demo",
  "aggregate_type": "conversion",
  "aggregate_id": "conv_001",
  "occurred_at": "2026-06-15T10:28:05Z",
  "actor": "system",
  "correlation_id": "corr_conv_001",
  "causation_id": "evt_...",
  "payload": { ... },
  "evidence": { "webhook_signature": "...", "raw_event_hash": "..." }
}`}</pre>
        </div>
      </div>

      {/* Event Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eventCategories.map(cat => (
          <div key={cat.name} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-white mb-2">{cat.name}</h3>
            <div className="space-y-1">
              {cat.events.map(event => (
                <div key={event} className="flex items-center gap-2 text-xs">
                  <ArrowRight className="w-3 h-3 text-emerald-400 shrink-0" />
                  <span className="font-mono text-gray-300">{event}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Outbox Pattern */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Transactional Outbox Pattern</h3>
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['Business Mutation', 'Outbox Insert', 'Same Transaction', 'Commit', 'Worker Delivery', 'Idempotent Consumer'].map((step, i) => (
            <div key={step} className="flex items-center gap-2 shrink-0">
              <div className="px-3 py-2 bg-gray-800 rounded-lg text-xs text-white">{step}</div>
              {i < 5 && <ArrowRight className="w-4 h-4 text-gray-600" />}
            </div>
          ))}
        </div>
        <ul className="mt-4 space-y-2 text-xs text-gray-400">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Business mutation + outbox event in SAME transaction</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>At-least-once delivery → consumers must be idempotent</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Retries track: attempts, last_error, next_attempt</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// ============================================================================
// SECURITY PAGE
// ============================================================================
function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Security</h1>
        <p className="text-sm text-gray-400 mt-1">Threat model, controls, and tenant isolation</p>
      </div>

      {/* Multi-Tenant RLS */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Multi-Tenant Isolation (RLS)</h3>
        <ul className="space-y-2 text-xs text-gray-400">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>PostgreSQL RLS on every tenant-scoped table</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>ENABLE RLS + FORCE RLS (even for table owner)</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>App DB role never superuser/BYPASSRLS</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Tenant context from session, not client request</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Tests: Tenant-A cannot read Tenant-B data</span>
          </li>
        </ul>
      </div>

      {/* Webhook Security */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Webhook Security</h3>
        <ul className="space-y-2 text-xs text-gray-400">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Signature verification (HMAC-SHA256)</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Timestamp/replay protection</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Schema validation</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Idempotency keys</span>
          </li>
          <li className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="text-red-300">NEVER webhook → wallet directly</span>
          </li>
        </ul>
      </div>

      {/* Tracking Security */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Tracking Security</h3>
        <ul className="space-y-2 text-xs text-gray-400">
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Click ID non-predictable, cryptographically signed</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Tamper/replay protection</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Self-referral detection</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Bot detection, duplicate attribution prevention</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>Flood protection, velocity limits</span>
          </li>
        </ul>
      </div>

      {/* Threat Model */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Threat Model</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { threat: 'Anonymous Attacker', severity: 'medium' },
            { threat: 'Bot / Scraper', severity: 'medium' },
            { threat: 'Malicious Member', severity: 'high' },
            { threat: 'Affiliate Fraud', severity: 'high' },
            { threat: 'Malicious Tenant', severity: 'critical' },
            { threat: 'Compromised Provider', severity: 'high' },
            { threat: 'Insider Threat', severity: 'high' },
            { threat: 'Credential Thief', severity: 'critical' },
          ].map(item => (
            <div key={item.threat} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <span className="text-xs text-white">{item.threat}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                item.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                item.severity === 'high' ? 'bg-amber-500/10 text-amber-400' :
                'bg-yellow-500/10 text-yellow-400'
              }`}>{item.severity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// DATABASE PAGE
// ============================================================================
function DatabasePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Database Foundation</h1>
        <p className="text-sm text-gray-400 mt-1">PostgreSQL 17+ — RLS, double-entry ledger, transactional outbox</p>
      </div>

      {/* Schema Overview */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Core Tables</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { name: 'tenants', desc: 'Multi-tenant isolation' },
            { name: 'users', desc: 'Identity (global)' },
            { name: 'tenant_memberships', desc: 'User-tenant relationship, roles' },
            { name: 'offers', desc: 'Offer catalog, economics' },
            { name: 'clicks', desc: 'Signed tracking links' },
            { name: 'conversions', desc: 'State machine, verification' },
            { name: 'ledger_transactions', desc: 'Double-entry transactions' },
            { name: 'ledger_entries', desc: 'Debit/credit pairs, immutable' },
            { name: 'referrals', desc: 'Multi-level referral network' },
            { name: 'payouts', desc: 'Payout state machine' },
            { name: 'event_outbox', desc: 'Transactional outbox' },
            { name: 'audit_log', desc: 'Append-only audit trail' },
          ].map(table => (
            <div key={table.name} className="p-3 bg-gray-800/50 rounded-lg">
              <p className="text-sm font-mono text-emerald-400">{table.name}</p>
              <p className="text-xs text-gray-400 mt-1">{table.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Row Level Security</h3>
          <div className="bg-gray-800/50 rounded-lg p-3 font-mono text-xs text-gray-300">
            <pre>{`-- Enable RLS
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers FORCE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY tenant_isolation ON offers
  USING (tenant_id = current_setting(
    'app.current_tenant_id'
  )::UUID);`}</pre>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3">Ledger Immutability</h3>
          <div className="bg-gray-800/50 rounded-lg p-3 font-mono text-xs text-gray-300">
            <pre>{`-- Prevent modification
CREATE TRIGGER prevent_posted_modification
BEFORE UPDATE OR DELETE ON ledger_entries
FOR EACH ROW EXECUTE FUNCTION
  prevent_posted_modification();

-- Raises exception if status = 'POSTED'`}</pre>
          </div>
        </div>
      </div>

      {/* Migration File */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Migration File</h3>
        <p className="text-xs text-gray-400 mb-2">
          Location: <code className="text-emerald-400">database/migrations/001_foundation.sql</code>
        </p>
        <p className="text-xs text-gray-400">
          Can be executed from empty PostgreSQL 17+ in deterministic order. All tenant-scoped tables have RLS enabled.
          App role never superuser. Monetary values use NUMERIC(20,8).
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// MILESTONES PAGE
// ============================================================================
function MilestonesPage() {
  const milestones = [
    { id: 1, name: 'Bootstrap + Architecture + CI + Database Foundation', status: 'ACTIVE', items: ['Repository structure', 'Architecture docs', 'Database schema', 'Event contracts', 'TypeScript contracts'] },
    { id: 2, name: 'Identity + Tenant + RBAC + RLS + Session', status: 'NEXT', items: ['OAuth adapters', 'Session management', 'Multi-tenant RLS', 'RBAC implementation', 'RLS tests'] },
    { id: 3, name: 'Offer + Tracking + Signed Click + Webhook Gateway', status: 'PLANNED', items: ['Offer catalog', 'Signed click IDs', 'Webhook verification', 'Replay protection', 'Attribution'] },
    { id: 4, name: 'Conversion + Policy + Economic Distribution + Ledger + Wallet', status: 'PLANNED', items: ['Conversion state machine', 'Policy engine', 'Exact distribution', 'Double-entry ledger', 'Wallet projection'] },
    { id: 5, name: 'Referral + Payout + Sandbox PSP + Settlement + Reconciliation', status: 'PLANNED', items: ['Multi-level referral', 'Payout flow', 'Sandbox PSP', 'Settlement', 'Reconciliation'] },
    { id: 6, name: 'SAE + ARCHEION + Trust Ledger + E2E Canonical', status: 'PLANNED', items: ['AI governance', 'Evidence provenance', 'Trust ledger', 'E2E tests', 'Canonical scenario'] },
    { id: 7, name: 'Web + Admin + Preview Deployment', status: 'PLANNED', items: ['Member web app', 'Admin dashboard', 'Vercel preview', 'Production deployment'] },
  ];

  const statusColors: Record<string, string> = {
    ACTIVE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    NEXT: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    PLANNED: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Milestones</h1>
        <p className="text-sm text-gray-400 mt-1">Incremental delivery — no premature features</p>
      </div>

      <div className="space-y-4">
        {milestones.map(ms => (
          <div key={ms.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">HITO {ms.id}: {ms.name}</h3>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${statusColors[ms.status]}`}>
                {ms.status}
              </span>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ms.items.map(item => (
                <div key={item} className="flex items-center gap-2 text-xs text-gray-400">
                  {ms.status === 'ACTIVE' ? (
                    <Clock className="w-3 h-3 text-amber-400" />
                  ) : ms.status === 'NEXT' ? (
                    <ArrowRight className="w-3 h-3 text-blue-400" />
                  ) : (
                    <Clock className="w-3 h-3 text-gray-600" />
                  )}
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-900 border border-amber-500/20 rounded-xl p-4">
        <p className="text-xs text-gray-400">
          <strong className="text-amber-400">Principle:</strong> No Marketplace, PRO AI, or commercial integrations until HITO 7 complete.
          Each milestone must be reproducible, compilable, testable. No advancing with CRITICAL/HIGH issues open.
        </p>
      </div>
    </div>
  );
}
