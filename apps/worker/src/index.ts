/**
 * @recipra/worker
 *
 * Background worker for outbox event delivery.
 *
 * HITO 1: Skeleton only. No real processing yet.
 *
 * CRITICAL:
 * - Consumers must be idempotent (at-least-once delivery)
 * - No infinite loop designed for serverless
 * - No real processing until HITO 2+
 */

/**
 * Outbox processor (skeleton).
 * In production, this polls the event_outbox table and delivers events.
 */
class OutboxProcessor {
  private running = false;

  async start(): Promise<void> {
    if (this.running) return;
    this.running = true;
    console.log('[RECIPRA Worker] Outbox processor started (skeleton)');
    console.log('[RECIPRA Worker] No real processing until HITO 2+');
  }

  async stop(): Promise<void> {
    this.running = false;
    console.log('[RECIPRA Worker] Outbox processor stopped');
  }

  /**
   * Process pending outbox entries.
   * In production: SELECT FROM event_outbox WHERE status = 'pending' ...
   */
  async processPending(): Promise<number> {
    // Skeleton: no real processing
    console.log('[RECIPRA Worker] processPending called (no-op in HITO 1)');
    return 0;
  }
}

// Main entry point
async function main() {
  const processor = new OutboxProcessor();

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('[RECIPRA Worker] SIGTERM received');
    await processor.stop();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('[RECIPRA Worker] SIGINT received');
    await processor.stop();
    process.exit(0);
  });

  await processor.start();

  // In production: poll loop with proper intervals
  // For HITO 1: just log and exit
  console.log('[RECIPRA Worker] HITO 1 skeleton complete. Exiting.');
}

main().catch(err => {
  console.error('[RECIPRA Worker] Fatal error:', err);
  process.exit(1);
});

export { OutboxProcessor };
