/**
 * @recipra/evidence
 *
 * Evidence and provenance foundation (ARCHEION adapter interface).
 *
 * CRITICAL:
 * - ARCHEION records provenance; it does NOT determine truth
 * - Flow: SOURCE → ASSET → CLAIM → EVIDENCE → PROVENANCE → COHERENCE → WORKFLOW → HUMAN REVIEW → DECISION → VERIFICATION RECEIPT
 * - No private documents uploaded to public repo
 * - No external ARCHEION integration yet (interface only)
 */

import type { TenantId, EventId } from '@recipra/contracts';

/**
 * Evidence record.
 */
export interface EvidenceRecord {
  readonly id: string;
  readonly tenantId: TenantId;
  readonly sourceType: string; // 'webhook', 'conversion', 'payment', 'payout', 'ai_decision', 'human_review'
  readonly sourceId: string;
  readonly evidenceType: string; // 'raw_event', 'signature', 'hash', 'screenshot', 'document'
  readonly content: string; // hash or reference
  readonly contentHash: string; // SHA-256
  readonly metadata: Record<string, unknown>;
  readonly createdAt: string;
}

/**
 * Provenance chain.
 */
export interface ProvenanceChain {
  readonly eventId: EventId;
  readonly evidenceIds: string[];
  readonly verificationStatus: 'pending' | 'verified' | 'rejected';
  readonly verifiedAt?: string;
  readonly verifiedBy?: string;
}

/**
 * Verification receipt.
 */
export interface VerificationReceipt {
  readonly id: string;
  readonly eventId: EventId;
  readonly evidenceIds: string[];
  readonly verifiedAt: string;
  readonly verifiedBy: string;
  readonly receiptHash: string;
}

/**
 * Evidence adapter interface (for future ARCHEION connection).
 */
export interface EvidenceAdapter {
  store(record: Omit<EvidenceRecord, 'id' | 'createdAt'>): Promise<EvidenceRecord>;
  get(id: string): Promise<EvidenceRecord | null>;
  getBySource(sourceType: string, sourceId: string): Promise<EvidenceRecord[]>;
  verify(id: string, verifiedBy: string): Promise<VerificationReceipt>;
}

/**
 * In-memory evidence adapter (for testing).
 */
export class InMemoryEvidenceAdapter implements EvidenceAdapter {
  private records: Map<string, EvidenceRecord> = new Map();
  private counter = 0;

  async store(record: Omit<EvidenceRecord, 'id' | 'createdAt'>): Promise<EvidenceRecord> {
    const id = `evd_${++this.counter}`;
    const full: EvidenceRecord = {
      ...record,
      id,
      createdAt: new Date().toISOString(),
    };
    this.records.set(id, full);
    return full;
  }

  async get(id: string): Promise<EvidenceRecord | null> {
    return this.records.get(id) ?? null;
  }

  async getBySource(sourceType: string, sourceId: string): Promise<EvidenceRecord[]> {
    return Array.from(this.records.values()).filter(
      r => r.sourceType === sourceType && r.sourceId === sourceId
    );
  }

  async verify(id: string, verifiedBy: string): Promise<VerificationReceipt> {
    const record = this.records.get(id);
    if (!record) throw new Error(`Evidence not found: ${id}`);
    return {
      id: `rcp_${++this.counter}`,
      eventId: record.sourceId as EventId,
      evidenceIds: [id],
      verifiedAt: new Date().toISOString(),
      verifiedBy,
      receiptHash: `hash_${record.contentHash}`,
    };
  }
}
