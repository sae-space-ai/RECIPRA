import { useState } from 'react';
import { Search, Filter, Globe, Smartphone, Monitor, ExternalLink, TrendingUp } from 'lucide-react';
import { mockOffers } from '../data/mockData';
import type { OfferType } from '../types/domain';

const typeColors: Record<OfferType, string> = {
  CPA: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  CPL: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  CPI: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  CPS: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  SURVEY: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  CASHBACK: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
  PTC: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  REWARDED_AD: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  TASK: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  GAME: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const incentiveLabels: Record<string, { label: string; color: string }> = {
  INCENTIVIZED: { label: 'Incentivized', color: 'text-amber-400' },
  NON_INCENTIVIZED: { label: 'Non-Incent', color: 'text-blue-400' },
  BOTH: { label: 'Both', color: 'text-emerald-400' },
};

export default function OffersPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);

  const filtered = mockOffers.filter(o => {
    const matchSearch = o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.description.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === 'ALL' || o.type === typeFilter;
    return matchSearch && matchType;
  });

  const selected = mockOffers.find(o => o.id === selectedOffer);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Offers</h1>
          <p className="text-sm text-gray-400 mt-1">Browse and complete offers to earn rewards</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{filtered.length} offers available</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search offers..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-sm text-white appearance-none focus:outline-none focus:border-emerald-500/50"
          >
            <option value="ALL">All Types</option>
            <option value="SURVEY">Surveys</option>
            <option value="CPI">CPI (Install)</option>
            <option value="CPL">CPL (Lead)</option>
            <option value="CPS">CPS (Sale)</option>
            <option value="CASHBACK">Cashback</option>
            <option value="REWARDED_AD">Rewarded Ads</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Offers List */}
        <div className="lg:col-span-2 space-y-3">
          {filtered.map(offer => (
            <button
              key={offer.id}
              onClick={() => setSelectedOffer(offer.id)}
              className={`w-full text-left bg-gray-900 border rounded-xl p-4 transition-all hover:border-gray-600 ${
                selectedOffer === offer.id ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-gray-800'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${typeColors[offer.type]}`}>
                      {offer.type}
                    </span>
                    <span className={`text-[10px] font-medium ${incentiveLabels[offer.incentiveAllowed].color}`}>
                      {incentiveLabels[offer.incentiveAllowed].label}
                    </span>
                    <span className="text-[10px] text-gray-500">{offer.provider}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-white mt-2">{offer.title}</h3>
                  <p className="text-xs text-gray-400 mt-1 line-clamp-2">{offer.description}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      <Globe className="w-3 h-3" />
                      {offer.countries.join(', ')}
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500">
                      {offer.devices.includes('mobile') && <Smartphone className="w-3 h-3" />}
                      {offer.devices.includes('desktop') && <Monitor className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-bold text-emerald-400">€{offer.userReward}</p>
                  <p className="text-[10px] text-gray-500">reward</p>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                    <TrendingUp className="w-3 h-3" />
                    {offer.conversionsToday}/{offer.dailyCap}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Offer Detail */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-fit sticky top-20">
          {selected ? (
            <div className="space-y-4">
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${typeColors[selected.type]}`}>
                  {selected.type}
                </span>
                <h3 className="text-base font-bold text-white mt-2">{selected.title}</h3>
                <p className="text-xs text-gray-400 mt-1">{selected.description}</p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Economics</h4>
                <div className="bg-gray-800/50 rounded-lg p-3 space-y-2 font-mono text-xs">
                  <div className="flex justify-between"><span className="text-gray-400">Gross</span><span className="text-white">€{selected.grossAmount}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">User Reward</span><span className="text-emerald-400">€{selected.userReward}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Referral</span><span className="text-cyan-400">€{selected.referralReward}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Provider Cost</span><span className="text-amber-400">€{selected.providerCost}</span></div>
                  <div className="flex justify-between border-t border-gray-700 pt-2"><span className="text-gray-400">Platform Margin</span><span className="text-purple-400">€{selected.platformMargin}</span></div>
                  <div className="flex justify-between border-t border-gray-700 pt-2 font-bold">
                    <span className="text-gray-300">Invariant</span>
                    <span className="text-emerald-400">
                      {parseFloat(selected.grossAmount).toFixed(2)} = {(parseFloat(selected.userReward) + parseFloat(selected.referralReward) + parseFloat(selected.providerCost) + parseFloat(selected.platformMargin)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Details</h4>
                <div className="text-xs space-y-1">
                  <p className="text-gray-400">Provider: <span className="text-white">{selected.provider}</span></p>
                  <p className="text-gray-400">Countries: <span className="text-white">{selected.countries.join(', ')}</span></p>
                  <p className="text-gray-400">Devices: <span className="text-white">{selected.devices.join(', ')}</span></p>
                  <p className="text-gray-400">Daily Cap: <span className="text-white">{selected.conversionsToday}/{selected.dailyCap}</span></p>
                  <p className="text-gray-400">Period: <span className="text-white">{selected.startDate} → {selected.endDate}</span></p>
                </div>
              </div>

              <button className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-gray-900 font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Start Offer
              </button>
              <p className="text-[10px] text-gray-500 text-center">
                Click generates signed tracking link • Conversion verified via webhook
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">Select an offer to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
