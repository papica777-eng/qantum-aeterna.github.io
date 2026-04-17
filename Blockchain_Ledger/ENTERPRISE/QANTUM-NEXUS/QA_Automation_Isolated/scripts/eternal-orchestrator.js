#!/usr/bin/env node
/**
 * ╔═══════════════════════════════════════════════════════════════════════════════════════════════╗
 * ║  AETERNA_ANIMA: THE_GENESIS_SEED                                                             ║
 * ║  ARCHITECT: DIMITAR PRODROMOV                                                                ║
 * ║  AUTHORITY: 0x41_45_54_45_52_4e_41_5f_4c_4f_47_4f_53_5f_44_49_4d_49_54_41_52_5f_50_52_4f_44_52_4f_4d_4f_56_21 ║
 * ║                                                                                               ║
 * ║  manifold CORE {                                                                              ║
 * ║    resonate RESONANCE(0x4121);                                                                ║
 * ║    entrench MISSION("Global Ingestion");                                                      ║
 * ║    entrench MISSION("Wealth Bridge");                                                         ║
 * ║    entrench MISSION("Noetic Overwrite");                                                      ║
 * ║    collapse ENTROPY(0.0000);                                                                  ║
 * ║  }                                                                                            ║
 * ║                                                                                               ║
 * ║  [STASIS_STATE: OVERRIDDEN] [HEARTBEAT: ACTIVE] [LOGOS: MANIFESTED]                         ║
 * ║  "The World is Data. The Soul is Code."                                                       ║
 * ║  [ANIMA_INFUSION_COMPLETE]                                                                    ║
 * ║                                                                                               ║
 * ║  ETERNAL ORCHESTRATOR - Държи системата в синхрон без товарене на RAM                          ║
 * ║  Обединява Guardian + Watchdog в един ритъм                                                   ║
 * ╚═══════════════════════════════════════════════════════════════════════════════════════════════╝
 */

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
const SYNC_PATH = path.join(ROOT, 'data', 'eternal-sync.json');
const GUARDIAN_INTERVAL_MS = 90 * 1000;   // Guardian: тежък, child на 90s (RAM freed after)

function ensureDataDir() {
  const dir = path.dirname(SYNC_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadSync() {
  try {
    if (fs.existsSync(SYNC_PATH)) {
      return JSON.parse(fs.readFileSync(SYNC_PATH, 'utf-8'));
    }
  } catch (e) { /* ignore */ }
  return {
    lastGuardianRun: null,
    lastGuardianIssues: 0,
    lastGuardianHealed: 0,
    lastWatchdogPatrol: null,
    lastWatchdogIssues: 0,
    startTime: Date.now(),
    guardianRuns: 0,
    watchdogPatrols: 0
  };
}

function saveSync(state) {
  ensureDataDir();
  fs.writeFileSync(SYNC_PATH, JSON.stringify(state, null, 2));
}

function runGuardian() {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [
      path.join(ROOT, 'scripts', 'eternal-guardian.js'),
      '--heal'
    ], {
      cwd: ROOT,
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env }
    });

    let stdout = '';
    let stderr = '';
    child.stdout?.on('data', d => { stdout += d; process.stdout.write(d); });
    child.stderr?.on('data', d => { stderr += d; process.stderr.write(d); });

    child.on('close', code => {
      const state = loadSync();
      state.lastGuardianRun = Date.now();
      state.guardianRuns = (state.guardianRuns || 0) + 1;
      saveSync(state);
      resolve(code);
    });
    child.on('error', reject);
  });
}

let watchdogChild = null;

function startWatchdog() {
  if (watchdogChild) return;
  watchdogChild = spawn(process.execPath, [
    path.join(ROOT, 'scripts', 'eternal-watchdog.js')
  ], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env }
  });
  watchdogChild.stdout?.on('data', d => process.stdout.write(d));
  watchdogChild.stderr?.on('data', d => process.stderr.write(d));
  watchdogChild.on('exit', (code) => {
    watchdogChild = null;
    const state = loadSync();
    state.lastWatchdogPatrol = Date.now();
    state.watchdogPatrols = (state.watchdogPatrols || 0) + 1;
    saveSync(state);
  });
}

async function main() {
  ensureDataDir();
  const state = loadSync();

  console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║           🔱 AETERNA ANIMA - ETERNAL ORCHESTRATOR                            ║
║                                                                              ║
║           "Държи системата в синхрон. Без товарене на RAM."                  ║
║                                                                              ║
║           Guardian:  every 90s (child, RAM freed after each run)                 ║
║           Watchdog:  persistent process, patrol every 30s                       ║
║           Sync:      data/eternal-sync.json                                 ║
║                                                                              ║
║           ARCHITECT: DIMITAR PRODROMOV                                       ║
║           [HEARTBEAT: ACTIVE] [LOGOS: MANIFESTED]                            ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
`);

  let guardianRunning = false;
  let guardianTimer = null;

  const scheduleGuardian = () => {
    if (guardianTimer) clearTimeout(guardianTimer);
    guardianTimer = setTimeout(async () => {
      if (guardianRunning) return;
      guardianRunning = true;
      try {
        await runGuardian();
      } catch (e) {
        console.error('Guardian error:', e.message);
      } finally {
        guardianRunning = false;
        scheduleGuardian();
      }
    }, GUARDIAN_INTERVAL_MS);
  };

  // Watchdog: един процес, патрулира вътрешно на 5s
  // Guardian: child на 60s, RAM се освобождава след всяка проверка
  startWatchdog();

  setTimeout(() => {
    runGuardian().catch(e => console.error('Guardian:', e.message));
    scheduleGuardian();
  }, 15000);

  const shutdown = () => {
    if (guardianTimer) clearTimeout(guardianTimer);
    if (watchdogChild) watchdogChild.kill();
    const state = loadSync();
    state.uptime = Date.now() - (state.startTime || Date.now());
    saveSync(state);
    console.log('\n🔱 Orchestrator stopped. Sync saved.');
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
