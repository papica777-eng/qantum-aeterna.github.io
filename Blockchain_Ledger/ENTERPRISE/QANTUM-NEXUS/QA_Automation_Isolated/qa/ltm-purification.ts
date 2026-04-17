/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║  MNEMOSYNE PROTOCOL — LTM Purification & Anchoring                          ║
 * ║  Deep memory audit: purge stale vectors, consolidate Golden Axioms           ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 *
 * Run when CPU load is low (e.g. nocturnal). Goal: VortexAI 5–10% smarter/faster.
 */

import { Pinecone } from '@pinecone-database/pinecone';

const INDEX_NAME = process.env.PINECONE_INDEX ?? process.env.PINECONE_ORACLE_INDEX ?? 'qantum-empire';
const NAMESPACE_GOLDEN = 'vortex-golden';
const STALE_DAYS = parseInt(process.env.LTM_STALE_DAYS ?? '30', 10);
const BATCH_SIZE = 100;

export interface LtmPurificationResult {
  purged: number;
  goldenAxiomsCreated: number;
  memoryIntegrity: string;
  totalScanned?: number;
}

function getClient(): Pinecone {
  const apiKey = process.env.PINECONE_API_KEY;
  if (!apiKey) throw new Error('PINECONE_API_KEY required for LTM Purification');
  return new Pinecone({ apiKey });
}

/**
 * List vector IDs in namespace (paginated).
 */
async function listVectorIds(index: ReturnType<Pinecone['index']>, namespace: string): Promise<string[]> {
  const ids: string[] = [];
  let paginationToken: string | undefined;
  do {
    const list = await index.namespace(namespace).listPaginated({ limit: BATCH_SIZE, paginationToken });
    const vectors = (list as any).vectors ?? (list as any).ids ?? [];
    for (const v of vectors) {
      const id = typeof v === 'string' ? v : (v.id ?? v);
      if (id) ids.push(id);
    }
    paginationToken = (list as any).pagination?.next;
  } while (paginationToken);
  return ids;
}

/**
 * Delete vectors older than STALE_DAYS (by metadata.timestamp if present).
 */
export async function runLtmPurification(options?: {
  deleteStaleDays?: number;
  dryRun?: boolean;
}): Promise<LtmPurificationResult> {
  const staleDays = options?.deleteStaleDays ?? STALE_DAYS;
  const dryRun = options?.dryRun ?? false;
  const cutoff = Date.now() - staleDays * 24 * 60 * 60 * 1000;
  let purged = 0;
  let goldenAxiomsCreated = 0;

  try {
    const client = getClient();
    const index = client.index(INDEX_NAME);

    // List all in vortex-golden (or default namespace)
    let ids: string[] = [];
    try {
      ids = await listVectorIds(index, NAMESPACE_GOLDEN);
    } catch (e) {
      return {
        purged: 0,
        goldenAxiomsCreated: 0,
        memoryIntegrity: `LIST_FAILED: ${(e as Error).message}`,
      };
    }

    const totalScanned = ids.length;
    if (totalScanned === 0) {
      return {
        purged: 0,
        goldenAxiomsCreated: 0,
        memoryIntegrity: 'OK',
        totalScanned: 0,
      };
    }

    // Fetch metadata in batches to find stale (by timestamp)
    const ns = index.namespace(NAMESPACE_GOLDEN);
    const toDelete: string[] = [];
    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
      const batch = ids.slice(i, i + BATCH_SIZE);
      try {
        const fetchRes = await ns.fetch(batch);
        const vectors = (fetchRes as any).vectors ?? {};
        for (const id of batch) {
          const meta = vectors[id]?.metadata ?? {};
          const ts = meta.timestamp ?? meta.created;
          const numTs = typeof ts === 'number' ? ts : (typeof ts === 'string' ? new Date(ts).getTime() : 0);
          if (numTs > 0 && numTs < cutoff) toDelete.push(id);
        }
      } catch (_) {
        // Skip batch on fetch error
      }
    }

    if (!dryRun && toDelete.length > 0) {
      for (let i = 0; i < toDelete.length; i += BATCH_SIZE) {
        const batch = toDelete.slice(i, i + BATCH_SIZE);
        await ns.deleteMany(batch);
        purged += batch.length;
      }
    } else if (dryRun) {
      purged = toDelete.length;
    }

    // Consolidate: "Golden Axioms" = we don't create new vectors here; that's done by vortex-golden anchor.
    // This step can aggregate top-scoring patterns into a summary record if needed. For now we report 0.
    goldenAxiomsCreated = 0;

    const integrity = totalScanned > 0
      ? `OK (${totalScanned} scanned, ${purged} stale purged)`
      : 'OK';

    return {
      purged,
      goldenAxiomsCreated,
      memoryIntegrity: integrity,
      totalScanned,
    };
  } catch (e) {
    return {
      purged: 0,
      goldenAxiomsCreated: 0,
      memoryIntegrity: `ERROR: ${(e as Error).message}`,
    };
  }
}

export default runLtmPurification;
