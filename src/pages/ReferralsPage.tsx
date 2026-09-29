import { Users, Copy, CheckCircle, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { mockReferrals } from '../data/mockData';

export default function ReferralsPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = 'https://demo.recipra.io/ref/USR_DEMO_2026';

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalEarnings = mockReferrals
    .filter(r => r.referrerId === 'user_demo')
    .reduce((sum, r) => sum + parseFloat(r.totalEarnings), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Referrals</h1>
        <p className="text-sm text-gray-400 mt-1">Multi-level referral rewards on verified economic activity only</p>
      </div>

      {/* Referral Link */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Your Referral Link</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-800 rounded-lg px-4 py-2.5 font-mono text-sm text-gray-300 truncate">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-semibold rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">Share this link. You earn rewards when your referrals complete verified offers.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <Users className="w-5 h-5 text-emerald-400" />
          <p className="text-2xl font-bold text-white mt-2">
            {mockReferrals.filter(r => r.referrerId === 'user_demo').length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Direct Referrals</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <p className="text-2xl font-bold text-white mt-2">€{totalEarnings.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Total Referral Earnings</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 text-purple-400" />
          <p className="text-2xl font-bold text-white mt-2">2</p>
          <p className="text-xs text-gray-400 mt-1">Max Referral Levels</p>
        </div>
      </div>

      {/* Rules */}
      <div className="bg-gray-900 border border-amber-500/20 rounded-xl p-4">
        <h3 className="text-sm font-semibold text-amber-400 mb-2">Referral Rules</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• Rewards only on <span className="text-white">verified economic activity</span> (not mere signups)</li>
          <li>• Self-referral, circular referral, and account farms are detected and blocked</li>
          <li>• Level 1: 10% of referral's reward • Level 2: 2% of sub-referral's reward</li>
          <li>• All referral rewards flow through the double-entry ledger</li>
          <li>• No payment for recruitment alone — only for actual offer completions</li>
        </ul>
      </div>

      {/* Referral Tree */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Your Referral Network</h3>
        <div className="space-y-3">
          {mockReferrals.filter(r => r.referrerId === 'user_demo').map(ref => (
            <div key={ref.id} className="flex items-center gap-4 p-3 bg-gray-800/50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-sm font-bold text-gray-900">
                L{ref.level}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">User {ref.referredId.split('_')[1]}</p>
                <p className="text-xs text-gray-400">Joined {new Date(ref.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-400">€{ref.totalEarnings}</p>
                <p className="text-[10px] text-gray-500">earned</p>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                ref.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-700 text-gray-400'
              }`}>
                {ref.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
