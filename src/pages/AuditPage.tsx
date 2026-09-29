import { mockAuditEntries } from '../data/mockData';
import { FileText, Shield, Clock, ArrowRight } from 'lucide-react';

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Audit & Evidence</h1>
        <p className="text-sm text-gray-400 mt-1">Append-only audit log — ARCHEION evidence provenance</p>
      </div>

      {/* Architecture */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">Audit Trail</h3>
          </div>
          <p className="text-xs text-gray-400">
            Every action is recorded: actor, tenant, action, resource, timestamp, correlation_id, result.
            Append-only. No secrets logged. No PII in plain text.
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300">Append-only</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300">Correlation IDs</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300">No secrets</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300">Tenant-scoped</span>
          </div>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-4 h-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">ARCHEION Evidence</h3>
          </div>
          <p className="text-xs text-gray-400">
            SOURCE → ASSET → CLAIM → EVIDENCE → PROVENANCE → COHERENCE → WORKFLOW → HUMAN REVIEW → DECISION → VERIFICATION RECEIPT.
            ARCHEION records provenance; it does not determine truth.
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300">Provenance</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300">Verification Receipt</span>
            <span className="px-2 py-0.5 rounded text-[10px] bg-gray-800 text-gray-300">Human Review</span>
          </div>
        </div>
      </div>

      {/* Event Flow */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Event Envelope Structure</h3>
        <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-xs text-gray-300 overflow-x-auto">
          <pre>{`{
  "event_id": "evt_...",
  "type": "conversion.verified.v1",
  "version": 1,
  "tenant_id": "tenant_recipra_demo",
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

      {/* Audit Log */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Audit Log</h3>
          <span className="text-xs text-gray-500">Append-only • Tenant-scoped</span>
        </div>
        <div className="divide-y divide-gray-800/50">
          {mockAuditEntries.map(entry => (
            <div key={entry.id} className="px-5 py-3 hover:bg-gray-800/30 transition-colors">
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-gray-500 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-gray-300">{entry.action}</span>
                    <ArrowRight className="w-3 h-3 text-gray-600" />
                    <span className="text-xs font-mono text-gray-500">{entry.resource}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      entry.result === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                      entry.result === 'denied' ? 'bg-red-500/10 text-red-400' :
                      'bg-amber-500/10 text-amber-400'
                    }`}>
                      {entry.result}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{entry.details}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-gray-500">Actor: {entry.actor}</span>
                    <span className="text-[10px] text-gray-500">Correlation: {entry.correlationId}</span>
                    <span className="text-[10px] text-gray-500">{new Date(entry.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
