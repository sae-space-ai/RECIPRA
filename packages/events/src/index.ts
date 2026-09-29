/**
 * @recipra/events
 *
 * Event system foundation with Transactional Outbox pattern.
 *
 * CRITICAL:
 * - Business mutation + outbox event in SAME transaction
 * - At-least-once delivery → consumers must be idempotent
 * - Retries track: attempts, last_error, next_attempt
 * - No external broker yet (outbox only)
 */

import type { DomainEvent, TenantId, EventId, CorrelationId } from '@recipra/contracts';

/**
 * Outbox entry (pending event delivery).
 */
export interface OutboxEntry {
  readonly id: string;
  readonly tenantId: TenantId;
  readonly eventType: string;
  readonly eventVersion: number;
  readonly aggregateType: string;
  readonly aggregateId: string;
  readonly payload: Record<string, unknown>;
  readonly correlationId?: CorrelationId;
  readonly causationId?: string;
  readonly occurredAt: string;
  readonly status: 'pending' | 'delivered' | 'failed';
  readonly attempts: number;
  readonly lastError?: string;
  readonly nextAttemptAt?: string;
  readonly deliveredAt?: string;
  readonly createdAt: string;
}

/**
 * Outbox store interface.
 */
export interface OutboxStore {
  /**
   * Creates an outbox entry.
   * MUST be called within the same transaction as the business mutation.
   */
  create(entry: Omit<OutboxEntry, 'id' | 'status' | 'attempts' | 'createdAt'>): Promise<OutboxEntry>;

  /**
   * Fetches pending entries for delivery.
   */
  fetchPending(limit: number): Promise<OutboxEntry[]>;

  /**
   * Marks an entry as delivered.
   */
  markDelivered(id: string): Promise<void>;

  /**
   * Marks an entry as failed with error details.
   */
  markFailed(id: string, error: string, nextAttemptAt: string): Promise<void>;
}

/**
 * Event publisher interface.
 */
export interface EventPublisher {
  publish<TPayload>(event: DomainEvent<TPayload>): Promise<void>;
}

/**
 * Event handler interface.
 */
export interface EventHandler<TPayload = Record<string, unknown>> {
  readonly eventType: string;
  handle(event: DomainEvent<TPayload>): Promise<void>;
}

/**
 * Event bus interface.
 */
export interface EventBus {
  subscribe<TPayload>(handler: EventHandler<TPayload>): void;
  publish<TPayload>(event: DomainEvent<TPayload>): Promise<void>;
}

/**
 * Creates a domain event with all required fields.
 */
export function createDomainEvent<TPayload>(params: {
  eventType: string;
  eventVersion: number;
  tenantId: TenantId;
  aggregateType: string;
  aggregateId: string;
  actor: string;
  correlationId: CorrelationId;
  causationId?: string;
  payload: TPayload;
  evidence?: Record<string, unknown>;
}): DomainEvent<TPayload> {
  return {
    event_id: `evt_${crypto.randomUUID()}` as EventId,
    event_type: params.eventType,
    event_version: params.eventVersion,
    tenant_id: params.tenantId,
    aggregate_type: params.aggregateType,
    aggregate_id: params.aggregateId as any,
    occurred_at: new Date().toISOString(),
    actor: params.actor,
    correlation_id: params.correlationId,
    causation_id: params.causationId as any,
    payload: params.payload,
    evidence: params.evidence,
  };
}

/**
 * In-memory event bus (for testing).
 */
export class InMemoryEventBus implements EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();
  private publishedEvents: DomainEvent[] = [];

  subscribe<TPayload>(handler: EventHandler<TPayload>): void {
    const existing = this.handlers.get(handler.eventType) ?? [];
    existing.push(handler as EventHandler);
    this.handlers.set(handler.eventType, existing);
  }

  async publish<TPayload>(event: DomainEvent<TPayload>): Promise<void> {
    this.publishedEvents.push(event as DomainEvent);
    const handlers = this.handlers.get(event.event_type) ?? [];
    for (const handler of handlers) {
      await handler.handle(event as DomainEvent);
    }
  }

  getPublishedEvents(): DomainEvent[] {
    return [...this.publishedEvents];
  }
}
