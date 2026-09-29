import { Wallet, ArrowUpRight, ArrowDownLeft, Lock, Clock, CheckCircle } from 'lucide-react';
import { mockWallet, mockLedgerEntries } from '../data/mockData';

export default function WalletPage() {
  const walletCards = [
    { label: 'Available', value: `€${mockWallet.available}`, icon: Wallet, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Pending', value: `€${mockWallet.pending}`, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Reserved', value: `€${mockWallet.reserved}`, icon: Lock, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Paid', value: `€${mockWallet.paid}`, icon: ArrowUpRight, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Reversed', value: `€${mockWallet.reversed}`, icon: ArrowDownLeft, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Wallet & Ledger</h1>
        <p className="text-sm text-gray-400 mt-1">Double-entry accounting — Wallet is a projection of the Ledger</p>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {walletCards.map(card => (
          <div key={card.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className={`p-2 rounded-lg ${card.bg} w-fit`}>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <p className={`text-xl font-bold mt-3 ${card.color}`}>{card.value}</p>
            <p className="text-xs text-gray-400 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Architecture Notice */}
      <div className="bg-gray-900 border border-amber-500/20 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded bg-amber-500/10">
            <Lock className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-amber-400">Ledger Immutability Principle</h3>
            <p className="text-xs text-gray-400 mt-1">
              All balances are derived from immutable ledger entries. POSTED transactions cannot be edited or deleted.
              Corrections are made via compensating entries (reversals). Wallet balances are read-model projections — never authoritative.
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300">No wallet.balance += X</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300">No set-balance operations</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300">No AI/frontend direct balance modification</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300">PostgreSQL NUMERIC only</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ledger Entries */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Ledger Entries</h3>
            <p className="text-xs text-gray-400 mt-0.5">Double-entry — every transaction has balanced debits and credits</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400">All balanced</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800 text-gray-400">
                <th className="text-left px-4 py-3 font-medium">Transaction</th>
                <th className="text-left px-4 py-3 font-medium">Account</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-right px-4 py-3 font-medium">Debit</th>
                <th className="text-right px-4 py-3 font-medium">Credit</th>
                <th className="text-left px-4 py-3 font-medium">Correlation</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockLedgerEntries.map(entry => (
                <tr key={entry.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                  <td className="px-4 py-3 font-mono text-gray-300">{entry.transactionId}</td>
                  <td className="px-4 py-3 text-gray-300">{entry.accountId}</td>
                  <td className="px-4 py-3">
                    <span className="px-1.5 py-0.5 rounded bg-gray-800 text-gray-400">{entry.accountType}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-red-400">
                    {entry.debit !== '0.00' ? `€${entry.debit}` : '—'}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-400">
                    {entry.credit !== '0.00' ? `€${entry.credit}` : '—'}
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-500 text-[10px]">{entry.correlationId}</td>
                  <td className="px-4 py-3">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-medium">
                      {entry.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-800/30">
                <td colSpan={3} className="px-4 py-3 font-semibold text-gray-300">Totals (tx_001)</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-red-400">€0.25</td>
                <td className="px-4 py-3 text-right font-mono font-bold text-emerald-400">€2.25</td>
                <td colSpan={2} className="px-4 py-3 text-right">
                  <span className="text-[10px] text-gray-500">+ provider_receivable €2.50 = balanced</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Trust Ledger */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'Economic Ledger', desc: 'Money, points, rewards, commissions, referrals, payments, payouts, reversals', color: 'emerald' },
          { name: 'Decision Ledger', desc: 'Rules, algorithms, AI model/version, policy, human intervention', color: 'blue' },
          { name: 'Compliance Ledger', desc: 'Consent, purpose, control, assessment, incident, review, evidence', color: 'purple' },
        ].map(chain => (
          <div key={chain.name} className={`bg-gray-900 border border-${chain.color}-500/20 rounded-xl p-4`}>
            <h4 className={`text-sm font-semibold text-${chain.color}-400`}>{chain.name}</h4>
            <p className="text-xs text-gray-400 mt-2">{chain.desc}</p>
            <div className="mt-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-gray-500">Correlated via event_id, correlation_id, causation_id</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
