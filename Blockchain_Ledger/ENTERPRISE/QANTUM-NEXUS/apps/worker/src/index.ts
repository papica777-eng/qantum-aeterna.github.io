/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ⚡ QANTUM NEXUS WORKER — Autonomous Healing Execution Engine
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Entry point for the BullMQ Consumer.
 *
 * Architecture:
 *   Redis (BullMQ Queue) → Worker → NexusBridge → SelfHealingEngine
 *   → Prisma (HealingJob) → Dashboard (WebSocket)
 *
 * Queues:
 *   - "qantum:healing"  → UI/NETWORK/LOGIC healing jobs
 *   - "qantum:ghost"    → Ghost Mode stealth tests
 *   - "qantum:scan"     → Scheduled full-site QA scans
 *
 * // Complexity: O(1) per job dispatch (BullMQ handles concurrency)
 */

import 'dotenv/config';
import { Worker, Queue, QueueEvents, Job } from 'bullmq';
import { NexusBridge } from './bridge/NexusBridge';
import type { AnyHealingJob } from './bridge/NexusBridge';

// ═══════════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const REDIS_CONFIG = {
  host:     process.env.REDIS_HOST || 'localhost',
  port:     parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null, // Required by BullMQ
};

const CONCURRENCY = parseInt(process.env.WORKER_CONCURRENCY || '4'); // Ryzen 7000: use 4 cores

// ═══════════════════════════════════════════════════════════════════════════
// WORKER FACTORY
// ═══════════════════════════════════════════════════════════════════════════

async function createHealingWorker(bridge: NexusBridge): Promise<Worker> {
  const worker = new Worker<AnyHealingJob, any>(
    'qantum:healing',
    async (job: Job<AnyHealingJob>) => {
      console.log(`\n🔬 [Worker] Processing job ${job.id} — Domain: ${job.data.domain}`);

      // Update job progress
      await job.updateProgress(10);

      const result = await bridge.process(job.data);

      await job.updateProgress(100);

      if (!result.success) {
        console.warn(`⚠️  [Worker] Job ${job.id} healing failed: ${result.error}`);
      } else {
        console.log(`✅ [Worker] Job ${job.id} healed via strategy: ${result.strategy}`);
        console.log(`   LivenessToken: ${result.livenessToken.substring(0, 20)}...`);
        console.log(`   Duration: ${result.duration}ms`);
      }

      return result;
    },
    {
      connection:  REDIS_CONFIG,
      concurrency: CONCURRENCY,
    }
  );

  // ── Events ────────────────────────────────────────────────────────────────

  worker.on('completed', (job, result) => {
    console.log(`🎯 [Worker] Completed: ${job.id} — Success: ${result.success}`);
  });

  worker.on('failed', (job, err) => {
    console.error(`💀 [Worker] Failed: ${job?.id} — ${err.message}`);
  });

  worker.on('stalled', (jobId) => {
    console.warn(`⚠️  [Worker] Stalled job detected: ${jobId}`);
  });

  worker.on('error', (err) => {
    console.error('💥 [Worker] Worker error:', err.message);
  });

  return worker;
}

// ═══════════════════════════════════════════════════════════════════════════
// HEALTH CHECK
// ═══════════════════════════════════════════════════════════════════════════

async function startHealthCheck(): Promise<void> {
  const healingQueue = new Queue('qantum:healing', {
    connection: REDIS_CONFIG,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
      removeOnComplete: { count: 100 },
      removeOnFail:     { count: 50 },
    }
  });

  // Report queue health every 30s
  setInterval(async () => {
    try {
      const counts = await healingQueue.getJobCounts('active', 'waiting', 'completed', 'failed');
      console.log(`\n📊 [Worker] Queue Health: active=${counts.active} waiting=${counts.waiting} completed=${counts.completed} failed=${counts.failed}`);
    } catch {
      // Silently skip — never crash health check
    }
  }, 30_000);
}

// ═══════════════════════════════════════════════════════════════════════════
// GRACEFUL SHUTDOWN
// ═══════════════════════════════════════════════════════════════════════════

function registerShutdown(bridge: NexusBridge, workers: Worker[]): void {
  const shutdown = async (signal: string) => {
    console.log(`\n🛑 [Worker] ${signal} received. Graceful shutdown...`);

    // Close all workers (no new jobs)
    await Promise.all(workers.map(w => w.close()));

    // Shutdown bridge (close browser + Prisma)
    await bridge.shutdown();

    console.log('✅ [Worker] Shutdown complete.');
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT',  () => shutdown('SIGINT'));
  process.on('uncaughtException', (err) => {
    console.error('💥 [Worker] Uncaught exception:', err);
    shutdown('UNCAUGHT_EXCEPTION');
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════

async function main(): Promise<void> {
  console.log(`
  ╔═══════════════════════════════════════════════════════════╗
  ║     ⚡ QANTUM NEXUS WORKER v1.0.0                        ║
  ║     🌉 Bridge: BullMQ → SelfHealingEngine → Prisma       ║
  ║     🔬 Concurrency: ${CONCURRENCY} cores                          ║
  ╚═══════════════════════════════════════════════════════════╝
  `);

  // ── Initialize Bridge ────────────────────────────────────────────────────
  const bridge = NexusBridge.getInstance();
  await bridge.initialize();

  bridge.on('bridge:ready', () => {
    console.log('🌉 [Worker] NexusBridge is ONLINE');
  });

  bridge.on('bridge:result', (result) => {
    console.log(`📡 [Worker] Bridge result: ${result.domain} — ${result.success ? '✅' : '❌'}`);
  });

  // ── Start Workers ────────────────────────────────────────────────────────
  const healingWorker = await createHealingWorker(bridge);
  const allWorkers    = [healingWorker];

  // ── Health Check ─────────────────────────────────────────────────────────
  await startHealthCheck();

  // ── Graceful Shutdown ────────────────────────────────────────────────────
  registerShutdown(bridge, allWorkers);

  console.log(`\n🚀 [Worker] ONLINE. Waiting for healing jobs on qantum:healing queue...`);
  console.log(`   Redis: ${REDIS_CONFIG.host}:${REDIS_CONFIG.port}`);
}

main().catch((err) => {
  console.error('💥 [Worker] Fatal startup error:', err);
  process.exit(1);
});
