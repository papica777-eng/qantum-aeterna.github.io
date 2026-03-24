/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * THE HIVE MIND: TRIUMVIRATE CONSENSUS ENGINE (2030+ TECH)
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * Instead of a monolithic algorithm, we deploy three autonomous agents
 * with conflicting directives. They must debate and vote to execute a trade.
 * 
 * 🔴 REAPER:   Max Aggression, Zero Fear.
 * 🔵 GUARDIAN: Max Security, Zero Risk.
 * 🟣 ORACLE:   Historical Wisdom, Tie-Breaker.
 * 
 * @author Dimitar Prodromov / QAntum Empire
 */

export interface HiveVote {
    agent: 'REAPER' | 'GUARDIAN' | 'ORACLE';
    decision: 'BUY' | 'SELL' | 'HOLD';
    confidence: number; // 0.0 - 1.0
    reason: string;
}

export class HiveMind {

    // 🔴 THE REAPER (Aggressive Logic)
    public async consultReaper(obi: number): Promise<HiveVote> {
        // Reaper loves volatility. High OBI = ACTION.
        const isVolatile = Math.abs(obi) > 0.3;

        if (isVolatile) {
            return {
                agent: 'REAPER',
                decision: obi > 0 ? 'BUY' : 'SELL',
                confidence: 0.95 + (Math.random() * 0.05),
                reason: `VOLATILITY DETECTED (${obi}). BLOOD IN THE WATER.`
            };
        }
        return { agent: 'REAPER', decision: 'HOLD', confidence: 0.2, reason: "Boring market. Sleeping." };
    }

    // 🔵 THE GUARDIAN (Defensive Logic)
    public async consultGuardian(entropy: number): Promise<HiveVote> {
        // Guardian hates entropy. 
        if (entropy > 0.5) {
            return {
                agent: 'GUARDIAN',
                decision: 'HOLD',
                confidence: 1.0,
                reason: `ENTROPY SPIKE (${entropy.toFixed(2)}). SHIELDS UP!`
            };
        }
        return {
            agent: 'GUARDIAN',
            decision: 'BUY', // Buys are technically 'safe' if low entropy
            confidence: 0.6,
            reason: "Sector Clear. Permission to Engage."
        };
    }

    // 🟣 THE ORACLE (Memory Logic)
    public async consultOracle(symbol: string): Promise<HiveVote> {
        // Oracle checks the VSH (Simulated)
        const memoryGlitch = Math.random() > 0.8;

        if (memoryGlitch) {
            return {
                agent: 'ORACLE',
                decision: 'HOLD',
                confidence: 0.85,
                reason: `Déjà vu. We lost money on ${symbol} in this pattern before.`
            };
        }
        return {
            agent: 'ORACLE',
            decision: 'BUY',
            confidence: 0.75,
            reason: "Pattern matches successful vector #8921."
        };
    }

    /**
     * THE SYNAPSE: Where the debate happens
     */
    public async oscillate(symbol: string, obi: number, entropy: number): Promise<{ consensus: boolean, action: string, logs: string[] }> {
        const reaper = await this.consultReaper(obi);
        const guardian = await this.consultGuardian(entropy);
        const oracle = await this.consultOracle(symbol);

        const votes = [reaper, guardian, oracle];
        const buys = votes.filter(v => v.decision === 'BUY').length;
        const sells = votes.filter(v => v.decision === 'SELL').length;
        const holds = votes.filter(v => v.decision === 'HOLD').length;

        let logs = [
            `🔴 [REAPER]   ${reaper.decision} :: ${reaper.reason}`,
            `🔵 [GUARDIAN] ${guardian.decision} :: ${guardian.reason}`,
            `🟣 [ORACLE]   ${oracle.decision} :: ${oracle.reason}`
        ];

        // CONSENSUS RULES:
        // 1. If Guardian says HOLD (High Risk), we abort. (Veto Power)
        if (guardian.decision === 'HOLD' && guardian.confidence > 0.9) {
            return { consensus: false, action: 'ABORT_RISK_HIGH', logs };
        }

        // 2. We need at least 2 votes for action
        if (buys >= 2) return { consensus: true, action: 'EXECUTE_BUY', logs };
        if (sells >= 2) return { consensus: true, action: 'EXECUTE_SELL', logs };

        return { consensus: false, action: 'STALEMATE_HOLD', logs };
    }
}
