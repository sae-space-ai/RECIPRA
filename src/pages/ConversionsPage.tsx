import { mockConversions } from '../data/mockData';
import type { ConversionState } from '../types/domain';

const stateColors: Record<ConversionState, string> = {
  RECEIVED: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  PENDING: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  VERIFIED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  APPROVED: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  REWARDED: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  SETTLED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  REJECTED: 'bg-red-500/10 text-red-400 border-red-500/20',
  REVERSED: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  DISPUTED: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  FRAUD_HOLD: 'bg-red-500/10 text-red-400 border-red-500/20',
  MANUAL_REVIEW: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const stateFlow: ConversionState[] = ['RECEIVED', 'VERIFIED', 'APPROVED', 'REWARDED', 'SETTLED'];

export default function ConversionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Conversions</h1>
        <p className="text-sm text-gray-400 mt-1">State machine: RECEIVED → PENDING → VERIFIED → APPROVED → REWARDED → SETTLED</p>
      </div>

      {/* State Machine Diagram */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Conversion State Machine</h3>
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {stateFlow.map((state, i) => (
            <div key={state} className="flex items-center gap-1 shrink-0">
              <span className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${stateColors[state]}`}>
                {state}
              </span>
              {i < stateFlow.length - 1 && <span className="text-gray-600">→</span>}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
          <span>Alternative exits:</span>
          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400">REJECTED</span>
          <span className="px-2 py-0.5 rounded bg-orange-500/10 text-orange-400">REVERSED</span>
          <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400">FRAUD_HOLD</span>
          <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">MANUAL_REVIEW</span>
        </div>
        <p className="text-xs text-gray-500 mt-3">
          <strong className="text-amber-400">RECEIVED does NOT produce money.</strong> Only after VERIFIED + APPROVED does the ledger post entries.
        </p>
      </div>

      {/* Conversion Flow */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Conversion Processing Pipeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { step: '1', title: 'Provider Event', desc: 'Webhook received → signature verification → timestamp/replay protection', color: 'blue' },
            { step: '2', title: 'Normalize & Validate', desc: 'Schema validation → idempotency check → immutable raw event stored', color: 'cyan' },
            { step: '3', title: 'Policy & Risk', desc: 'Fraud rules → velocity checks → Policy engine decision', color: 'purple' },
            { step: '4', title: 'Distribution', desc: 'Verified → approved → distribution → ledger → wallet → evidence', color: 'emerald' },
          ].map(item => (
            <div key={item.step} className={`p-3 rounded-lg border border-${item.color}-500/20 bg-${item.color}-500/5`}>
              <div className={`w-6 h-6 rounded-full bg-${item.color}-500/20 flex items-center justify-center text-xs font-bold text-${item.color}-400 mb-2`}>
                {item.step}
              </div>
              <h4 className="text-xs font-semibold text-white">{item.title}</h4>
              <p className="text-[10px] text-gray-400 mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Conversions Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800">
          <h3 className="text-sm font-semibold text-white">Recent Conversions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left px-4 py-3 font-medium">ID</th>
                <th className="text-left px-4 py-3 font-medium">Offer</th>
                <th className="text-left px-4 py-3 font-medium">State</th>
                <th className="text-right px-4 py-3 font-medium">Gross</th>
                <th className="text-right px-4 py-3 font-medium">User</th>
                <th className="text-right px-4 py-3 font-medium">Referral</th>
                <th className="text-right px-4 py-3 font-medium">Margin</th>
                <th className="text-left px-4 py-3 font-medium">Correlation</th>
                <th className="text-left px-4 py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody>
              {mockConversions.map(conv => (
                <tr key={conv.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-mono text-gray-300">{conv.id}</td>
                  <td className="px-4 py-3 text-gray-300">{conv.offerId}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${stateColors[conv.state]}`}>
                      {conv.state}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-white">€{conv.grossAmount}</td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-400">€{conv.userReward}</td>
                  <td className="px-4 py-3 text-right font-mono text-cyan-400">€{conv.referralReward}</td>
                  <td className="px-4 py-3 text-right font-mono text-purple-400">€{conv.platformMargin}</td>
                  <td className="px-4 py-3 font-mono text-gray-500 text-[10px]">{conv.correlationId}</td>
                  <td className="px-4 py-3 text-gray-400">{new Date(conv.receivedAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
