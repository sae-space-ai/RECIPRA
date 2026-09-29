import { useState } from 'react';
import { LayoutDashboard, Gift, Wallet, Users, FileText, Shield, Brain, Settings, Menu, X, ChevronDown, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'offers', label: 'Offers', icon: Gift },
  { id: 'wallet', label: 'Wallet & Ledger', icon: Wallet },
  { id: 'referrals', label: 'Referrals', icon: Users },
  { id: 'conversions', label: 'Conversions', icon: Zap },
  { id: 'audit', label: 'Audit & Evidence', icon: FileText },
  { id: 'modules', label: 'Modules', icon: Settings },
  { id: 'governance', label: 'AI Governance', icon: Brain },
  { id: 'security', label: 'Security', icon: Shield },
];

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
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
              onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
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
            <p className="text-xs text-gray-400">Tenant</p>
            <p className="text-sm font-medium text-white">RECIPRA-DEMO</p>
            <p className="text-[10px] text-emerald-400 mt-1">● Production Verified</p>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-800">
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                <span>RECIPRA-DEMO</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">All Systems Operational</span>
              </div>
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-xs font-bold text-gray-900">
                    D
                  </div>
                  <span className="text-sm font-medium hidden sm:block">Demo User</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-xl py-2">
                    <div className="px-3 py-2 border-b border-gray-800">
                      <p className="text-sm font-medium">Demo User</p>
                      <p className="text-xs text-gray-400">demo@recipra.io</p>
                    </div>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800">Profile</button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800">Privacy</button>
                    <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-800">Sign Out</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
