/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LTM ANCHOR — Golden Patterns в Pinecone
 * ═══════════════════════════════════════════════════════════════════════════════
 * Резултати с разлика VORTEX vs Standard AI > 1.26% се записват в Pinecone.
 *
 * Два режима:
 * - Oracle (Integrated Inference): PINECONE_ORACLE_INDEX=vortex-oracle → upsert с "text",
 *   Pinecone векторизира автоматично (multilingual-e5-large). Zero friction, metadata-scaled RAG.
 * - Legacy: qantum-empire, 384-dim вектори от runId.
 *
 * Сигналът (VORTEX) vs шумът (Standard AI). Математиката не греши.
 */

import { Pinecone } from '@pinecone-database/pinecone';
import type { AuditRunRecord } from './VortexAuditRunner';

const INITIAL_CAPITAL = 100_000;
/** Праг за запис като Golden Pattern: разлика VORTEX − AI в % от капитал. */
export const GOLDEN_PATTERN_THRESHOLD_PCT = 1.26;
const PINECONE_INDEX = process.env.PINECONE_INDEX ?? 'qantum-empire';
const PINECONE_NAMESPACE_GOLDEN = 'vortex-golden';
const PINECONE_ORACLE_INDEX = process.env.PINECONE_ORACLE_INDEX ?? '';
const PINECONE_ORACLE_HOST = process.env.PINECONE_ORACLE_HOST ?? '';
/** Съвпада с qantum-empire (dimension 384). */
const VECTOR_DIMENSION = 384;

/** Детерминистичен вектор от runId (за legacy индекс). */
function vectorFromRunId(runId: string): number[] {
  let h = 0;
  for (let i = 0; i < runId.length; i++) {
    h = (Math.imul(31, h) + runId.charCodeAt(i)) | 0;
  }
  const out: number[] = [];
  for (let i = 0; i < VECTOR_DIMENSION; i++) {
    out.push(((h * (i + 1)) % 1000) / 1000 - 0.5);
  }
  return out;
}

let _client: Pinecone | null = null;

function getClient(): Pinecone {
  if (!_client) {
    const apiKey = process.env.PINECONE_API_KEY;
    if (!apiKey) throw new Error('PINECONE_API_KEY required for LTM Anchor');
    _client = new Pinecone({ apiKey });
  }
  return _client;
}

/** Дали да ползваме Oracle (Integrated Inference) индекс. */
export function useOracleMode(): boolean {
  return Boolean(PINECONE_ORACLE_INDEX);
}

/**
 * Връща true ако разликата (VORTEX profit % − AI profit %) > 1.26%.
 */
export function isGoldenPattern(record: AuditRunRecord): boolean {
  const pnlDiffPct = (record.vortex.profit - record.ai.profit) / INITIAL_CAPITAL * 100;
  return pnlDiffPct > GOLDEN_PATTERN_THRESHOLD_PCT;
}

/** Текст за Oracle: семантично описание за векторно търсене. */
function toOracleText(record: AuditRunRecord, pnlDiffPct: number): string {
  const v = record.vortex;
  const a = record.ai;
  const profitDelta = (v.profit - a.profit).toFixed(2);
  return [
    'VORTEX beats Standard AI.',
    `Profit delta ${profitDelta} USD (${pnlDiffPct.toFixed(2)}%).`,
    `Drawdown VORTEX ${v.drawdown.toFixed(2)}% vs AI ${a.drawdown.toFixed(2)}%.`,
    `Trades VORTEX ${v.trades ?? 0} vs AI ${a.trades ?? 0}.`,
    'Mathematical edge verified. Low entropy execution.',
  ].join(' ');
}

/**
 * Oracle: запис в индекс с Integrated Inference (текст → вектор в Pinecone).
 * Namespace: vortex-golden. MCP-совместима структура за metadata-scaled RAG.
 */
async function anchorOracle(record: AuditRunRecord): Promise<boolean> {
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) return false;

  const pnlDiffPct = (record.vortex.profit - record.ai.profit) / INITIAL_CAPITAL * 100;
  const profitDelta = record.vortex.profit - record.ai.profit;

  let host = PINECONE_ORACLE_HOST;
  if (!host) {
    try {
      const client = getClient();
      const desc = await client.describeIndex(PINECONE_ORACLE_INDEX);
      host = desc.host ?? '';
    } catch {
      console.warn('[LTM Anchor] Oracle: describeIndex failed, set PINECONE_ORACLE_HOST');
      return false;
    }
  }
  if (!host) return false;

  const text = toOracleText(record, pnlDiffPct);
  const recordPayload = {
    id: `golden_${record.runId}`,
    text,
    type: 'GOLDEN_PATTERN',
    hit_rate: record.vortex.hitRate / 100,
    profit_delta: Math.round(profitDelta * 100) / 100,
    drawdown: record.vortex.drawdown / 100,
    integrity_score: 1,
    version: 'VORTEX_OMEGA_1.0',
    timestamp: record.timestamp,
    runId: record.runId,
    vortexProfit: record.vortex.profit,
    aiProfit: record.ai.profit,
    pnlDiffPct: Math.round(pnlDiffPct * 100) / 100,
    vortexHitRate: record.vortex.hitRate,
    aiHitRate: record.ai.hitRate,
    vortexDrawdown: record.vortex.drawdown,
    aiDrawdown: record.ai.drawdown,
    vortexTrades: record.vortex.trades ?? 0,
    aiTrades: record.ai.trades ?? 0,
    architect: 'Dimitar Prodromov',
  };

  try {
    const url = `https://${host}/records/namespaces/${encodeURIComponent(PINECONE_NAMESPACE_GOLDEN)}/upsert`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Api-Key': apiKey,
        'Content-Type': 'application/json',
        'X-Pinecone-API-Version': '2025-04',
      },
      body: JSON.stringify({ records: [recordPayload] }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`${res.status} ${err}`);
    }
    return true;
  } catch (err) {
    console.warn('[LTM Anchor] Oracle upsert failed:', (err as Error).message);
    return false;
  }
}

/**
 * Legacy: запис в qantum-empire с готов 384-dim вектор.
 */
async function anchorLegacy(record: AuditRunRecord): Promise<boolean> {
  const pnlDiffPct = (record.vortex.profit - record.ai.profit) / INITIAL_CAPITAL * 100;

  try {
    const client = getClient();
    const index = client.index(PINECONE_INDEX);
    const ns = index.namespace(PINECONE_NAMESPACE_GOLDEN);

    const id = `golden_${record.runId}`;
    const values = vectorFromRunId(record.runId);
    const metadata = {
      type: 'golden_pattern',
      runId: record.runId,
      timestamp: record.timestamp,
      vortexProfit: record.vortex.profit,
      aiProfit: record.ai.profit,
      pnlDiffPct: Math.round(pnlDiffPct * 100) / 100,
      vortexHitRate: record.vortex.hitRate,
      aiHitRate: record.ai.hitRate,
      vortexDrawdown: record.vortex.drawdown,
      aiDrawdown: record.ai.drawdown,
      vortexTrades: record.vortex.trades ?? 0,
      aiTrades: record.ai.trades ?? 0,
    };

    await ns.upsert([{ id, values, metadata }]);
    return true;
  } catch (err) {
    console.warn('[LTM Anchor] Legacy upsert failed (run continues):', (err as Error).message);
    return false;
  }
}

/**
 * Записва един run като Golden Pattern при разлика > 1.26%.
 * Избира Oracle (Integrated Inference) или Legacy според PINECONE_ORACLE_INDEX.
 */
export async function anchorGoldenPattern(record: AuditRunRecord): Promise<boolean> {
  if (!isGoldenPattern(record)) return false;
  return useOracleMode() ? anchorOracle(record) : anchorLegacy(record);
}

/**
 * Anchor-ва множество записи; връща броя успешно записани.
 * След всеки Batch 500 може да викаш това за автоматично записване в vortex-golden.
 */
export async function anchorGoldenPatterns(records: AuditRunRecord[]): Promise<number> {
  const golden = records.filter(isGoldenPattern);
  let anchored = 0;
  const mode = useOracleMode() ? 'Oracle' : 'Legacy';
  if (golden.length > 0) {
    console.log(`/// MCP_ANCHOR: UPLOADING_TO_VORTEX_GOLDEN (${mode}) ///`);
  }
  for (const record of golden) {
    const ok = await anchorGoldenPattern(record);
    if (ok) anchored++;
  }
  if (anchored > 0) {
    console.log(`/// ETERNAL_HISTORY_UPDATED: ${anchored} Golden Pattern(s) ///`);
  }
  return anchored;
}
