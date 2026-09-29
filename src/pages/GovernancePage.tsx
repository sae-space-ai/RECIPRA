import { Brain, Shield, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

export default function GovernancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">AI Governance & SAE</h1>
        <p className="text-sm text-gray-400 mt-1">Systematic AI Evaluation — Human Responsibility Indelegable</p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">AI Gateway</h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Application → AI Gateway → Policy → Model Router → Provider Adapter → Model
          </p>
          <div className="space-y-2">
            {[
              'AI Decision ID registered for every call',
              'System/model/version/provider/purpose logged',
              'Input classification & output captured',
              'Policy authorization before execution',
              'Human oversight evidence recorded',
              'No LLM defines RECIPRA behavior',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-300">
                <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">SAE Governance Control Plane</h3>
          </div>
          <p className="text-xs text-gray-400 mb-3">
            Independent of finances. Records systems, models, versions, purpose, risk, controls, reviews, incidents.
          </p>
          <div className="bg-gray-800/50 rounded-lg p-3 font-mono text-[10px] text-gray-300 overflow-x-auto">
            <pre>{`AI System → Provider → Intended Purpose
  → Classification → Risk Level
  → Control → Evidence
  → Human Oversight → Incident
  → Review → Owner (human)`}</pre>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Eye className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] text-amber-400">Principle: Identifiable human owner for every AI system</span>
          </div>
        </div>
      </div>

      {/* EU AI Act Classification */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">EU AI Act — System Classification</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { risk: 'Prohibited', desc: 'Subliminal manipulation, exploitation of vulnerabilities', color: 'red', systems: 0 },
            { risk: 'High Risk', desc: 'Critical infrastructure, law enforcement, border control', color: 'amber', systems: 0 },
            { risk: 'Limited Risk', desc: 'Transparency obligations, AI-generated content labeling', color: 'yellow', systems: 2 },
            { risk: 'Minimal Risk', desc: 'Spam filters, game AI, recommendation systems', color: 'emerald', systems: 3 },
          ].map(item => (
            <div key={item.risk} className={`border border-${item.color}-500/20 rounded-lg p-3`}>
              <h4 className={`text-xs font-semibold text-${item.color}-400`}>{item.risk}</h4>
              <p className="text-[10px] text-gray-400 mt-1">{item.desc}</p>
              <p className="text-lg font-bold text-white mt-2">{item.systems}</p>
              <p className="text-[10px] text-gray-500">systems classified</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          No generic "AI Act compliant" claims. Each system/use/role is individually classified with applicable obligations.
        </p>
      </div>

      {/* Policy Engine */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Policy Engine Rules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {[
            'CAN_REWARD_CONVERSION',
            'CAN_SHOW_INCENT_OFFER',
            'CAN_APPROVE_PAYOUT',
            'REQUIRES_KYC',
            'REQUIRES_HUMAN_REVIEW',
            'CAN_USE_AI_AUTOMATION',
            'CAN_PROCESS_PERSONAL_DATA',
          ].map(rule => (
            <div key={rule} className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-xs font-mono text-gray-300">{rule}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400">
            <strong className="text-amber-400">AI produces signals; Policy decides.</strong> High-risk operations require MANUAL_REVIEW.
            AI never posts to ledger or autonomously approves material payouts.
          </p>
        </div>
      </div>

      {/* AI Operator (Future) */}
      <div className="bg-gray-900 border border-dashed border-gray-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-400">AI Operator — Future</h3>
          <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-500">NOT_STARTED</span>
        </div>
        <p className="text-xs text-gray-500">
          Analyzes margin loss, post-reversal economics, LTV/CAC, campaign profitability, payout anomalies, reconciliation gaps.
          Capabilities: analyze, recommend, simulate.
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400">No direct ledger access</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400">No critical payout</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400">No evidence deletion</span>
          <span className="px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400">No history mutation</span>
        </div>
      </div>
    </div>
  );
}
