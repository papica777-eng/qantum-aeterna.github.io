#!/usr/bin/env npx tsx
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PARALLEL AUDIT SWARM — Batch 500 / конфигурируем concurrency
 * ═══════════════════════════════════════════════════════════════════════════════
 * Usage:
 *   npx tsx qa/run-parallel-swarm.ts [terminalUrl] [totalRuns] [concurrency]
 *   TERMINAL_URL=http://localhost:3000/vortex npx tsx qa/run-parallel-swarm.ts 100 8
 *
 * Env: зареди .env от корена на проекта (PINECONE_API_KEY за LTM Anchor).
 * HUD STATUS: QA_ENGINE ARMED. PARALLEL_MODE READY.
 */

import * as path from 'path';
import { config } from 'dotenv';

config({ path: path.resolve(process.cwd(), '.env') });

import { getTerminalUrl, VORTEX_SWARM_DEFAULT_RUNS, VORTEX_SWARM_DEFAULT_CONCURRENCY } from '../vortex-config';
import { runParallelAudits } from './VortexAuditRunner';
import { anchorGoldenPatterns, isGoldenPattern, GOLDEN_PATTERN_THRESHOLD_PCT, useOracleMode } from './vortex-pinecone-anchor';

const terminalUrl = process.argv[2] || process.env.TERMINAL_URL || getTerminalUrl();
const totalRuns = parseInt(process.argv[3] || process.env.TOTAL_RUNS || String(VORTEX_SWARM_DEFAULT_RUNS), 10);
const concurrency = parseInt(process.argv[4] || process.env.CONCURRENCY || String(VORTEX_SWARM_DEFAULT_CONCURRENCY), 10);

async function main() {
  console.log('/// IGNITING_PARALLEL_AUDIT_SWARM ///');
  console.log(`   TERMINAL_URL=${terminalUrl}`);
  console.log(`   TOTAL_RUNS=${totalRuns} CONCURRENCY=${concurrency}`);
  console.log(`   LTM_ANCHOR: Golden Patterns when diff > ${GOLDEN_PATTERN_THRESHOLD_PCT}% (${useOracleMode() ? 'Oracle/vortex-oracle' : 'Legacy/qantum-empire'})`);
  console.log('');

  const results = await runParallelAudits(terminalUrl, totalRuns, concurrency, {
    headless: true,
    waitTimeoutMs: 60_000,
  });

  const vortexWins = results.filter((r) => r.vortex.profit > r.ai.profit).length;
  const aiWins = results.filter((r) => r.ai.profit > r.vortex.profit).length;
  const anomalies = results.filter((r) => r.anomalyDetected).length;
  const goldenCount = results.filter(isGoldenPattern).length;
  const anchored = await anchorGoldenPatterns(results);

  console.log('');
  console.log('/// SWARM_COMPLETE ///');
  console.log(`   VORTEX wins: ${vortexWins}/${results.length}`);
  console.log(`   Standard AI wins: ${aiWins}/${results.length}`);
  console.log(`   Anomalies detected: ${anomalies}`);
  console.log(`   Golden Patterns (diff > ${GOLDEN_PATTERN_THRESHOLD_PCT}%): ${goldenCount}`);
  console.log(`   LTM Anchor (Pinecone): ${anchored} stored`);
  console.log(`   Results persisted: vortex-audit-runs.json`);
}

main().catch((err) => {
  console.error('/// SWARM_ABORT ///', err);
  process.exit(1);
});
