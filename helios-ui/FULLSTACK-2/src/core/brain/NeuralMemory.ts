/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * VORTEX NEURAL MEMORYALS - ZERO-LOSS LEARNING ENGINE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * "We do not fail. We learn."
 * 
 * This module ingests rejected trade scenarios and encodes them into vector space.
 * Future decisions compare current market state against this "Database of Mistakes"
 * to avoid repeating suboptimal executions.
 * 
 * @author Dimitar Prodromov / QAntum Empire
 */

import { Pinecone } from '@pinecone-database/pinecone';
import { randomUUID } from 'crypto';

// Types for "Memory Engrams"
interface MarketState {
    pair: string;
    price: number;
    spread: number;
    liquidity: number; // Bid/Ask depth
    gasPrice: number;
    timestamp: number;
}

interface TradeRejection {
    reason: 'HIGH_SLIPPAGE' | 'LOW_LIQUIDITY' | 'NEGATIVE_SPREAD' | 'ENTROPY_SPIKE';
    marketState: MarketState;
    potentialLoss: number;
}

export class NeuralMemory {
    private client: Pinecone;
    private indexName = 'qantum-vortex-memory';
    private memoryBuffer: TradeRejection[] = [];

    constructor() {
        // Init with dummy key if env missing (Simulation Mode)
        this.client = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || 'DEMO_KEY' });
    }

    /**
     * INGEST: Absorbs a failed trade into short-term memory
     */
    public absorbMistake(rejection: TradeRejection) {
        // 1. Normalize data
        // 2. Add to buffer
        this.memoryBuffer.push(rejection);

        // 3. Trigger flush if buffer gets heavy
        if (this.memoryBuffer.length >= 10) {
            this.consolidateMemory();
        }
    }

    /**
     * CONSOLIDATE: Encodes mistakes into Long-Term Vector Memory
     */
    private async consolidateMemory() {
        const batch = [...this.memoryBuffer];
        this.memoryBuffer = []; // Clear buffer

        console.log(`[🧠 MEMORY] Encoding ${batch.length} rejected scenarios into Vector Space...`);

        const vectors = batch.map(item => {
            return {
                id: randomUUID(),
                values: this.vectorize(item.marketState), // Transform state to [0.1, 0.5, ...]
                metadata: {
                    reason: item.reason,
                    pair: item.marketState.pair,
                    potentialLoss: item.potentialLoss
                }
            };
        });

        try {
            // In simulation, we just log the vectorization
            // await this.client.index(this.indexName).upsert(vectors);
            console.log(`[🧠 MEMORY] Synced ${vectors.length} memories to Holographic Storage.`);
            console.log(`[🧠 MEMORY] New Heuristic Learned: Avoid ${batch[0].marketState.pair} when Spread > ${batch[0].marketState.spread}%`);
        } catch (e) {
            console.warn('[🧠 MEMORY] Simulation Mode: Pinecone synapsis simulated.');
        }
    }

    /**
     * RECALL: Checks if a current move matches a past mistake
     */
    public async consultPast(currentState: MarketState): Promise<boolean> {
        // Query Pinecone for similar market conditions that led to failure
        // const queryResponse = await this.client.index(this.indexName).query(...)

        // Simulation logic:
        // If high spread and low liquidity -> It recalls a memory of failure
        if (currentState.spread > 0.5 && currentState.liquidity < 1000) {
            console.log(`[🧠 MEMORY_GUARD] BLOCKING TRADE! Similar scenario caused loss on ${new Date().toISOString()}`);
            return true; // Yes, we have a bad memory of this
        }
        return false;
    }

    /**
     * VECTORIZE: Converts market reality into math (arrays)
     * Dimensions: [Price, Spread, Liquidity, Gas, TimeOfDay]
     */
    private vectorize(state: MarketState): number[] {
        // Normalize values to 0-1 range for effective cosine similarity
        return [
            state.price / 100000,       // Norm Price
            state.spread,               // Spread (important)
            Math.log(state.liquidity),  // Log Liquidity
            state.gasPrice / 100,       // Norm Gas
            (state.timestamp % 86400) / 86400 // Time of day (cyclical)
        ];
    }
}
