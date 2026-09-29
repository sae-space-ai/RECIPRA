import { mockModules } from '../data/mockData';
import type { ModuleStatus } from '../types/domain';

const statusColors: Record<ModuleStatus, string> = {
  NOT_STARTED: 'bg-gray-500/10 text-gray-400',
  DESIGNED: 'bg-blue-500/10 text-blue-400',
  IMPLEMENTING: 'bg-amber-500/10 text-amber-400',
  IMPLEMENTED: 'bg-emerald-500/10 text-emerald-400',
  UNIT_TESTED: 'bg-cyan-500/10 text-cyan-400',
  INTEGRATION_TESTED: 'bg-teal-500/10 text-teal-400',
  E2E_TESTED: 'bg-green-500/10 text-green-400',
  SECURITY_TESTED: 'bg-purple-500/10 text-purple-400',
  READY_FOR_REVIEW: 'bg-indigo-500/10 text-indigo-400',
  MERGED: 'bg-violet-500/10 text-violet-400',
  DEPLOYED: 'bg-emerald-500/10 text-emerald-400',
  PRODUCTION_VERIFIED: 'bg-emerald-500/20 text-emerald-300',
  BLOCKED_BY_CREDENTIALS: 'bg-red-500/10 text-red-400',
};

const categoryLabels: Record<string, { label: string; color: string }> = {
  core: { label: 'Core', color: 'border-emerald-500/30 bg-emerald-500/5' },
  business: { label: 'Business', color: 'border-blue-500/30 bg-blue-500/5' },
  pro: { label: 'PRO', color: 'border-purple-500/30 bg-purple-500/5' },
  ai: { label: 'AI', color: 'border-amber-500/30 bg-amber-500/5' },
};

export default function ModulesPage() {
  const categories = ['core', 'business', 'pro', 'ai'] as const;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Modules</h1>
        <p className="text-sm text-gray-400 mt-1">Modular architecture — installable, versioned, permissioned</p>
      </div>

      {/* Module Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {categories.map(cat => {
          const count = mockModules.filter(m => m.category === cat).length;
          const active = mockModules.filter(m => m.category === cat && ['IMPLEMENTED', 'UNIT_TESTED', 'INTEGRATION_TESTED', 'E2E_TESTED', 'DEPLOYED', 'PRODUCTION_VERIFIED'].includes(m.status)).length;
          return (
            <div key={cat} className={`border rounded-xl p-4 ${categoryLabels[cat].color}`}>
              <p className="text-xs font-medium text-gray-400">{categoryLabels[cat].label}</p>
              <p className="text-2xl font-bold text-white mt-1">{active}/{count}</p>
              <p className="text-[10px] text-gray-500">active/total</p>
            </div>
          );
        })}
      </div>

      {/* Module List by Category */}
      {categories.map(cat => {
        const modules = mockModules.filter(m => m.category === cat);
        if (modules.length === 0) return null;
        return (
          <div key={cat}>
            <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                cat === 'core' ? 'bg-emerald-400' : cat === 'business' ? 'bg-blue-400' : cat === 'pro' ? 'bg-purple-400' : 'bg-amber-400'
              }`} />
              {categoryLabels[cat].label} Modules
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {modules.map(mod => (
                <div key={mod.id} className={`border rounded-xl p-4 ${categoryLabels[cat].color} hover:border-opacity-60 transition-all`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-white">{mod.name}</h3>
                      <p className="text-[10px] text-gray-500 font-mono">v{mod.version} • {mod.id}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${statusColors[mod.status]}`}>
                      {mod.status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{mod.description}</p>
                  {mod.dependencies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {mod.dependencies.map(dep => (
                        <span key={dep} className="px-1.5 py-0.5 rounded text-[10px] bg-gray-800/80 text-gray-400">
                          → {dep}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {mod.permissions.slice(0, 3).map(perm => (
                      <span key={perm} className="px-1.5 py-0.5 rounded text-[10px] bg-gray-800/50 text-gray-500">
                        {perm}
                      </span>
                    ))}
                    {mod.permissions.length > 3 && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] text-gray-500">+{mod.permissions.length - 3}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Module Manifest */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Module Manifest Structure</h3>
        <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto">
          <pre>{`{
  "module_id": "offers",
  "name": "Offers",
  "version": "2.0.0",
  "dependencies": ["tenant", "tracking"],
  "permissions": ["offer.read", "offer.manage"],
  "subscribed_events": ["offer.created.v1", "offer.updated.v1"],
  "emitted_events": ["offer.converted.v1"],
  "database_schema": { "tables": [...], "migrations": [...] },
  "api": { "endpoints": [...] },
  "ui_extensions": { "panels": [...], "widgets": [...] },
  "pricing": { "model": "included", "metering": null },
  "compliance": { "gdpr": true, "ai_act": null },
  "rollback": { "strategy": "migration_reverse" }
}`}</pre>
        </div>
      </div>
    </div>
  );
}
