import { Shield, Lock, Eye, Key, Server, Globe, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Security</h1>
        <p className="text-sm text-gray-400 mt-1">Threat model, controls, and tenant isolation</p>
      </div>

      {/* Threat Model */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Threat Model</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { threat: 'Anonymous Attacker', severity: 'medium', controls: 'Rate limits, CSRF, input validation' },
            { threat: 'Bot / Scraper', severity: 'medium', controls: 'CAPTCHA, velocity limits, fingerprinting' },
            { threat: 'Malicious Member', severity: 'high', controls: 'RLS, fraud rules, self-referral detection' },
            { threat: 'Affiliate Fraud', severity: 'high', controls: 'Click validation, conversion verification, IP/device checks' },
            { threat: 'Malicious Tenant', severity: 'critical', controls: 'RLS, tenant isolation, no cross-tenant access' },
            { threat: 'Compromised Provider', severity: 'high', controls: 'Webhook signature, replay protection, schema validation' },
            { threat: 'Insider Threat', severity: 'high', controls: 'Audit log, RBAC, least privilege, evidence' },
            { threat: 'Credential Thief', severity: 'critical', controls: 'Session rotation, hashed tokens, HttpOnly cookies' },
          ].map(item => (
            <div key={item.threat} className="p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-white">{item.threat}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                  item.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                  item.severity === 'high' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-yellow-500/10 text-yellow-400'
                }`}>{item.severity}</span>
              </div>
              <p className="text-[10px] text-gray-400 mt-1">{item.controls}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Multi-Tenant Isolation</h3>
          </div>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> PostgreSQL RLS on every tenant-scoped table</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> ENABLE RLS + FORCE RLS</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> App DB role never superuser/BYPASSRLS</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> Tenant from session/authorization, not browser</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" /> Tests: Tenant-A cannot read Tenant-B data</li>
          </ul>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Key className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Identity & Session</h3>
          </div>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" /> OAuth: state cryptographically random, hashed-at-rest</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" /> PKCE where applicable</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" /> Redirect URI validated</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" /> Tokens never in frontend/logs</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-cyan-400 mt-0.5 shrink-0" /> Session: HttpOnly + Secure + SameSite + rotation</li>
          </ul>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Server className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">Webhook Security</h3>
          </div>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" /> Signature verification (HMAC-SHA256)</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" /> Timestamp/replay protection</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" /> Schema validation</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" /> Idempotency keys</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" /> NEVER webhook → wallet directly</li>
          </ul>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">Tracking Security</h3>
          </div>
          <ul className="space-y-2 text-xs text-gray-400">
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" /> Click ID non-predictable, signed</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" /> Tamper/replay protection</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" /> Self-referral detection</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" /> Bot detection, duplicate attribution prevention</li>
            <li className="flex items-start gap-2"><CheckCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" /> Flood protection</li>
          </ul>
        </div>
      </div>

      {/* Prohibitions */}
      <div className="bg-gray-900 border border-red-500/20 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h3 className="text-sm font-semibold text-red-400">Hard Prohibitions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            'No wallet.balance += X',
            'No AI → ledger direct',
            'No reward on RECEIVED state',
            'No browser redirect as payment proof',
            'No unverified webhook processing',
            'No disabling RLS to fix bugs',
            'No app superuser/BYPASSRLS',
            'No secrets in Git',
            'No IEEE-754 for money',
            'No editing/deleting POSTED entries',
          ].map(item => (
            <div key={item} className="flex items-center gap-2 text-xs text-red-300">
              <span className="text-red-500">✕</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* RBAC */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">RBAC — Role-Based Access Control</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left px-3 py-2 font-medium">Role</th>
                <th className="text-left px-3 py-2 font-medium">Key Permissions</th>
              </tr>
            </thead>
            <tbody>
              {[
                { role: 'platform_superadmin', perms: 'All platform operations, tenant management, system config' },
                { role: 'tenant_owner', perms: 'Full tenant control, module install, finance, compliance' },
                { role: 'tenant_admin', perms: 'Tenant operations, campaign management, user management' },
                { role: 'finance_manager', perms: 'ledger.read, payout.approve, reconciliation.manage' },
                { role: 'campaign_manager', perms: 'campaign.create, offer.manage, tracking.read' },
                { role: 'compliance_officer', perms: 'evidence.read, privacy.request.process, sae.read' },
                { role: 'member', perms: 'offer.read, wallet.read, referral.read, payout.request' },
              ].map(item => (
                <tr key={item.role} className="border-b border-gray-800/50">
                  <td className="px-3 py-2 font-mono text-emerald-400">{item.role}</td>
                  <td className="px-3 py-2 text-gray-400">{item.perms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Observability */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-semibold text-white">Observability</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            'Structured logs with correlation IDs',
            'Request tracing (distributed)',
            'Health/readiness endpoints',
            'Worker health monitoring',
            'DB health & connection pool metrics',
            'Outbox lag monitoring',
            'Webhook failure alerts',
            'Conversion/reversal/payout latency',
            'Provider latency & margin metrics',
          ].map(item => (
            <div key={item} className="flex items-center gap-2 text-xs text-gray-300">
              <Shield className="w-3 h-3 text-cyan-400 shrink-0" />
              {item}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          <strong className="text-red-400">Never log:</strong> passwords, OAuth/PSP secrets, session tokens, or full PII.
        </p>
      </div>
    </div>
  );
}
