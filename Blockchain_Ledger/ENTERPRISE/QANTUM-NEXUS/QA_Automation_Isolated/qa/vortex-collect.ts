#!/usr/bin/env npx tsx
/**
 * Пуска Vortex: терминал + swarm + Pinecone (Oracle). Конфигурация: vortex-config.ts (singular).
 */

import * as path from 'path';
import { config } from 'dotenv';
import { spawn } from 'child_process';
import * as http from 'http';

config({ path: path.resolve(process.cwd(), '.env') });

import {
  getTerminalUrl,
  VORTEX_PORT,
  VORTEX_TERMINAL_PATH,
  VORTEX_DEFAULT_RUNS,
  VORTEX_DEFAULT_CONCURRENCY,
} from '../vortex-config';
import { runParallelAudits } from './VortexAuditRunner';
import { anchorGoldenPatterns, isGoldenPattern, useOracleMode, GOLDEN_PATTERN_THRESHOLD_PCT } from './vortex-pinecone-anchor';

const TERMINAL_URL = getTerminalUrl(VORTEX_PORT);

function waitForServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const deadline = Date.now() + 15000;
    const tick = () => {
      const req = http.get(`${TERMINAL_URL}`, (res) => {
        if (res.statusCode === 200) {
          resolve();
          return;
        }
        if (Date.now() > deadline) {
          reject(new Error('Server did not respond 200 in time'));
          return;
        }
        setTimeout(tick, 500);
      });
      req.on('error', () => {
        if (Date.now() > deadline) {
          reject(new Error('Server not reachable'));
          return;
        }
        setTimeout(tick, 500);
      });
    };
    tick();
  });
}

async function main() {
  const runs = parseInt(process.env.VORTEX_COLLECT_RUNS || String(VORTEX_DEFAULT_RUNS), 10);
  const concurrency = parseInt(process.env.VORTEX_COLLECT_CONCURRENCY || String(VORTEX_DEFAULT_CONCURRENCY), 10);

  console.log('/// VORTEX_COLLECT: terminal + swarm + Pinecone Oracle ///');
  console.log(`   PINECONE_ORACLE_INDEX=${process.env.PINECONE_ORACLE_INDEX || '(not set, will use Legacy)'}`);
  console.log(`   Runs=${runs} Concurrency=${concurrency}`);
  console.log('');

  const child = spawn('npx', ['tsx', VORTEX_TERMINAL_PATH], {
    cwd: path.dirname(VORTEX_TERMINAL_PATH),
    stdio: 'pipe',
    shell: true,
    env: { ...process.env, VORTEX_TERMINAL_PORT: String(VORTEX_PORT) },
  });

  let stderr = '';
  child.stderr?.on('data', (d) => { stderr += d.toString(); });
  child.stdout?.on('data', (d) => process.stdout.write(d.toString()));
  child.on('error', (e) => console.error('Terminal process error:', e));

  await new Promise((r) => setTimeout(r, 2500));

  try {
    await waitForServer();
  } catch (e) {
    console.error('Terminal server failed to start:', (e as Error).message);
    if (stderr) console.error(stderr);
    child.kill();
    process.exit(1);
  }

  console.log('   Terminal ready at', TERMINAL_URL);
  console.log('');

  const results = await runParallelAudits(TERMINAL_URL, runs, concurrency, {
    headless: true,
    waitTimeoutMs: 60_000,
  });

  const vortexWins = results.filter((r) => r.vortex.profit > r.ai.profit).length;
  const goldenCount = results.filter(isGoldenPattern).length;
  const anchored = await anchorGoldenPatterns(results);

  console.log('');
  console.log('/// VORTEX_COLLECT_DONE ///');
  console.log(`   VORTEX wins: ${vortexWins}/${results.length}`);
  console.log(`   Golden Patterns (diff > ${GOLDEN_PATTERN_THRESHOLD_PCT}%): ${goldenCount}`);
  console.log(`   Pinecone (${useOracleMode() ? 'Oracle' : 'Legacy'}): ${anchored} stored`);
  console.log('   Results: vortex-audit-runs.json');
  child.kill();
}

main().catch((err) => {
  console.error('/// VORTEX_COLLECT_ABORT ///', err);
  process.exit(1);
});
