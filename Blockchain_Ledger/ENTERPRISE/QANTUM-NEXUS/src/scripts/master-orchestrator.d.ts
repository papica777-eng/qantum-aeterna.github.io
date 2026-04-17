#!/usr/bin/env node
/**
 * 🔥 MASTER ORCHESTRATOR - 3-PHASE EXECUTION
 *
 * Orchestrates all 3 phases:
 * Phase 1: Deduplication + Analysis
 * Phase 2: Neural Absorption
 * Phase 3: QAntum Integration
 */
interface OrchestratorConfig {
    rootDir: string;
    outputDir: string;
    topModulesCount: number;
    skipPhase1: boolean;
    skipPhase2: boolean;
    skipPhase3: boolean;
}
declare class MasterOrchestrator {
    private config;
    private startTime;
    constructor(config?: Partial<OrchestratorConfig>);
    /**
     * Log with timestamp
     */
    private log;
    /**
     * Phase 1: Deduplication + Analysis
     */
    private runPhase1;
    /**
     * Phase 2: Neural Absorption
     */
    private runPhase2;
    /**
     * Phase 3: QAntum Integration
     */
    private runPhase3;
    /**
     * Run all phases
     */
    execute(): Promise<void>;
    /**
     * Print final summary
     */
    private printFinalSummary;
    /**
     * Get analysis stats
     */
    getStats(): any;
}
export { MasterOrchestrator, OrchestratorConfig };
//# sourceMappingURL=master-orchestrator.d.ts.map