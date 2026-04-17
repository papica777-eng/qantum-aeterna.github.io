/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VORTEX AUDIT RUNNER
 * ═══════════════════════════════════════════════════════════════════════════════
 * Интелигентна машина за събиране на данни: използва POM за извличане на метрики,
 * Explicit Wait (без sleep), JSON персистенция, и презапуск на драйвъра на всеки
 * N симулации за избягване на memory leak (по препоръка на Димитър Продромов).
 */

import * as fs from 'fs';
import * as path from 'path';
import { Builder, WebDriver } from '../SeleniumAdapter_1';
import { SimulationTerminalPage, type ScrapedMetrics } from './SimulationTerminalPage';

export interface AuditRunRecord {
  runId: string;
  timestamp: string;
  url: string;
  vortex: ScrapedMetrics;
  ai: ScrapedMetrics;
  anomalyDetected: boolean;
  anomalyReason?: string;
}

const DEFAULT_RUNS_BEFORE_DRIVER_RESTART = 50;
const AUDIT_LOG_PATH = path.join(process.cwd(), 'vortex-audit-runs.json');

/**
 * Зарежда или инициализира лог от предишни runs.
 */
function loadAuditLog(): AuditRunRecord[] {
  try {
    const raw = fs.readFileSync(AUDIT_LOG_PATH, 'utf8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function appendAuditRun(record: AuditRunRecord): void {
  const log = loadAuditLog();
  log.push(record);
  fs.writeFileSync(AUDIT_LOG_PATH, JSON.stringify(log, null, 2), 'utf8');
}

/**
 * QA Edge Case: Ако AI има по-висок Hit Rate, но по-голяма загуба (по-нисък profit),
 * това е аномалия — провери Risk/Reward модула.
 */
function detectAnomaly(vortex: ScrapedMetrics, ai: ScrapedMetrics): { detected: boolean; reason?: string } {
  if (ai.hitRate > vortex.hitRate && ai.profit < vortex.profit) {
    return {
      detected: true,
      reason: 'AI губи капитал въпреки по-високия Hit Rate. Провери Risk/Reward модула.',
    };
  }
  if (vortex.profit > 0 && ai.profit > vortex.profit && ai.drawdown > vortex.drawdown * 1.5) {
    return {
      detected: true,
      reason: 'Standard AI печели повече при значително по-голям drawdown — рискът не е пропорционален.',
    };
  }
  return { detected: false };
}

/**
 * Стартира един аудит: навигира до URL, чака приключване на симулация (Explicit Wait),
 * извлича метрики чрез POM, записва в JSON, проверява за аномалии.
 */
export async function runAudit(
  driver: WebDriver,
  terminalUrl: string,
  options?: { waitTimeoutMs?: number; skipClickRun?: boolean }
): Promise<AuditRunRecord> {
  const terminal = new SimulationTerminalPage(driver);
  const waitTimeoutMs = options?.waitTimeoutMs ?? 60_000;

  await driver.get(terminalUrl);

  if (!options?.skipClickRun) {
    try {
      await terminal.clickRunSimulation();
    } catch {
      // Бутонът може да липсва ако страницата вече показва последен run
    }
  }

  await terminal.waitForSimulationComplete(waitTimeoutMs);

  const vortexData = await terminal.getMetrics('VORTEX');
  const aiData = await terminal.getMetrics('Standard AI');

  const { detected: anomalyDetected, reason: anomalyReason } = detectAnomaly(vortexData, aiData);
  if (anomalyDetected) {
    console.warn('⚠️ АНОМАЛИЯ:', anomalyReason);
  }

  const record: AuditRunRecord = {
    runId: `audit_${Date.now()}`,
    timestamp: new Date().toISOString(),
    url: terminalUrl,
    vortex: vortexData,
    ai: aiData,
    anomalyDetected,
    anomalyReason,
  };

  appendAuditRun(record);
  console.table([vortexData, aiData]);

  return record;
}

/**
 * Създава нов WebDriver (Builder pattern от SeleniumAdapter_1).
 */
export async function createDriver(headless: boolean = true): Promise<WebDriver> {
  const driver = await new Builder()
    .forBrowser('chromium')
    .headless(headless)
    .build();
  await driver.manage().timeouts().pageLoadTimeout(30_000);
  return driver;
}

/**
 * Пуска до maxRuns симулации с презапуск на драйвъра на всеки restartDriverEvery
 * симулации (за избягване на heap growth / memory leak).
 */
export async function runAuditBatch(
  terminalUrl: string,
  maxRuns: number = 10,
  restartDriverEvery: number = DEFAULT_RUNS_BEFORE_DRIVER_RESTART
): Promise<AuditRunRecord[]> {
  const results: AuditRunRecord[] = [];
  let driver: WebDriver | null = null;
  let runsInThisSession = 0;

  for (let i = 0; i < maxRuns; i++) {
    if (driver === null || runsInThisSession >= restartDriverEvery) {
      if (driver) {
        await driver.quit();
        driver = null;
      }
      driver = await createDriver(true);
      runsInThisSession = 0;
    }

    try {
      const record = await runAudit(driver!, terminalUrl, { skipClickRun: i > 0 });
      results.push(record);
      runsInThisSession++;
    } catch (error) {
      console.error('Mister Mind Error: Критичен срив при автоматизацията!', error);
      if (driver) {
        await driver.quit();
        driver = null;
      }
    }
  }

  if (driver) await driver.quit();
  return results;
}

/**
 * Parallel Simulation Swarm: натоварва N нишки едновременно (напр. 8/16 за Ryzen 7).
 * Всеки worker има собствен драйвер; batch-овете се изпълняват с Promise.all.
 * След всеки batch драйверите се затварят (контрол на heap).
 */
export async function runParallelAudits(
  terminalUrl: string,
  totalRuns: number,
  concurrency: number,
  options?: { headless?: boolean; waitTimeoutMs?: number }
): Promise<AuditRunRecord[]> {
  const headless = options?.headless ?? true;
  const waitTimeoutMs = options?.waitTimeoutMs ?? 60_000;
  const results: AuditRunRecord[] = [];
  const runOne = async (workerId: number): Promise<AuditRunRecord> => {
    const driver = await createDriver(headless);
    try {
      return await runAudit(driver, terminalUrl, { waitTimeoutMs, skipClickRun: false });
    } finally {
      await driver.quit();
    }
  };

  console.log(`/// IGNITING_PARALLEL_AUDIT_SWARM: CONCURRENCY=${concurrency} TOTAL_RUNS=${totalRuns} ///`);

  for (let i = 0; i < totalRuns; i += concurrency) {
    const batchSize = Math.min(concurrency, totalRuns - i);
    const batch = Array.from({ length: batchSize }, (_, idx) => runOne(i + idx));
    const batchResults = await Promise.all(batch);
    results.push(...batchResults);
    console.log(`/// BATCH_COMPLETED: ${Math.min(i + concurrency, totalRuns)}/${totalRuns} ///`);
  }

  return results;
}
