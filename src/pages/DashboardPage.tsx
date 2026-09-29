import { TrendingUp, TrendingDown, Users, Gift, DollarSign, AlertTriangle, Activity, Shield } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { mockMetrics, revenueChartData, conversionStateData } from '../data/mockData';

export default function DashboardPage() {
  const statCards = [
    { label: 'Total Users', value: mockMetrics.totalUsers.toLocaleString(), icon: Users, change: '+12.5%', positive: true },
    { label: 'Active Offers', value: mockMetrics.activeOffers.toString(), icon: Gift, change: '+8', positive: true },
    { label: 'Gross Today', value: `€${mockMetrics.grossToday}`, icon: DollarSign, change: '+15.3%', positive: true },
    { label: 'Net Margin', value: `€${mockMetrics.netMarginToday}`, icon: TrendingUp, change: '+12.1%', positive: true },
    { label: 'Conversions Today', value: mockMetrics.conversionsToday.toLocaleString(), icon: Activity, change: '+23.7%', positive: true },
    { label: 'Pending Payouts', value: `€${mockMetrics.pendingPayouts}`, icon: DollarSign, change: '-5.2%', positive: false },
    { label: 'Reversal Rate', value: `${mockMetrics.reversalRate}%`, icon: TrendingDown, change: '-0.3%', positive: true },
    { label: 'Fraud Detected', value: mockMetrics.fraudDetected.toString(), icon: Shield, change: '+2', positive: false },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Platform overview — RECIPRA-DEMO tenant</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">Last updated: 2026-06-15 11:15 UTC</span>
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="p-2 rounded-lg bg-gray-800">
                <stat.icon className="w-4 h-4 text-gray-400" />
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                stat.positive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-white mt-3">{stat.value}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Revenue (7 days)</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Gross</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-cyan-400" /> Net Margin</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-400" /> Rewards</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={revenueChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" stroke="#6b7280" fontSize={11} />
              <YAxis stroke="#6b7280" fontSize={11} tickFormatter={(v) => `€${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
                labelStyle={{ color: '#9ca3af' }}
                formatter={(value: number) => [`€${value.toLocaleString()}`, '']}
              />
              <Area type="monotone" dataKey="gross" stroke="#10b981" fill="#10b98120" strokeWidth={2} />
              <Area type="monotone" dataKey="net" stroke="#06b6d4" fill="#06b6d420" strokeWidth={2} />
              <Area type="monotone" dataKey="rewards" stroke="#a855f7" fill="#a855f720" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion States */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Conversion States</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={conversionStateData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis type="number" stroke="#6b7280" fontSize={11} />
              <YAxis type="category" dataKey="state" stroke="#6b7280" fontSize={10} width={80} />
              <Tooltip
                contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {conversionStateData.map((entry, index) => (
                  <Bar key={index} dataKey="count" fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Economics Invariant */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-white">Economic Invariant — Canonical Distribution</h3>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm">
          <p className="text-emerald-400">gross = user_reward + referral_reward + provider_cost + platform_margin</p>
          <p className="text-gray-400 mt-2">Example: €10.00 = €5.00 + €0.50 + €1.00 + €3.50</p>
          <p className="text-gray-500 mt-1 text-xs">All amounts stored as PostgreSQL NUMERIC — IEEE-754 float prohibited for monetary values</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Recent Platform Events</h3>
        <div className="space-y-3">
          {[
            { time: '11:12:01', type: 'risk.detected', detail: 'Velocity anomaly on conv_005 — 15 conversions/2min same IP', severity: 'high' },
            { time: '11:05:02', type: 'conversion.verified', detail: 'conv_003 verified via webhook signature', severity: 'info' },
            { time: '11:00:04', type: 'conversion.approved', detail: 'conv_002 approved by policy engine', severity: 'info' },
            { time: '10:30:00', type: 'ledger.transaction.posted', detail: 'tx_001 — 5 balanced entries, correlation corr_conv_001', severity: 'info' },
            { time: '10:28:06', type: 'conversion.approved', detail: 'conv_001 approved — CAN_REWARD_CONVERSION passed', severity: 'info' },
          ].map((event, i) => (
            <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-800/50 last:border-0">
              <span className="text-xs text-gray-500 font-mono mt-0.5 w-16 shrink-0">{event.time}</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-medium shrink-0 ${
                event.severity === 'high' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'
              }`}>{event.type}</span>
              <span className="text-sm text-gray-300">{event.detail}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
