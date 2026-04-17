/**
 * 🌟 SINGULARITY ORCHESTRATOR - The Final Module
 *
 * Central orchestrator for all Phase 91-100 modules:
 * - SelfOptimizingEngine
 * - GlobalDashboardV3
 * - AutoDeployPipeline
 * - CommercializationEngine
 * - FinalStressTest
 * - TheAudit
 *
 * This is the brain that connects all singularity components
 * into a cohesive, self-sustaining system.
 *
 * @version 1.0.0
 * @phase 96-100 - The Singularity COMPLETE
 */
export { SelfOptimizingEngine } from './self-optimizing-engine';
export type { PerformanceMetric, OptimizationSuggestion } from './self-optimizing-engine';
export { GlobalDashboardV3, createGlobalDashboard } from './global-dashboard-v3';
export type { SwarmNode, TestFlow } from './global-dashboard-v3';
export { AutoDeployPipeline, createDeployPipeline } from './auto-deploy-pipeline';
export type { BuildArtifact, DeploymentTarget, ReleaseManifest } from './auto-deploy-pipeline';
export { CommercializationEngine, createCommercializationEngine } from './commercialization-engine';
export type { Customer, LicenseKey, ProductTier, PaymentEvent } from './commercialization-engine';
export { FinalStressTest, createStressTest, ALL_PHASES } from './final-stress-test';
export type { StressTestConfig, StressTestReport, PhaseResult, SystemMetrics } from './final-stress-test';
export { TheAudit, createAudit } from './the-audit';
export type { AuditConfig, AuditResult, FinalAuditReport, CategoryReport } from './the-audit';
import { SelfOptimizingEngine } from './self-optimizing-engine';
import { GlobalDashboardV3 } from './global-dashboard-v3';
import { AutoDeployPipeline } from './auto-deploy-pipeline';
import { CommercializationEngine } from './commercialization-engine';
import { FinalStressTest } from './final-stress-test';
import { TheAudit } from './the-audit';
import { EventEmitter } from 'events';
export declare class SingularityOrchestrator extends EventEmitter {
    optimizer: SelfOptimizingEngine;
    dashboard: GlobalDashboardV3;
    deployer: AutoDeployPipeline;
    commerce: CommercializationEngine;
    stressTest: FinalStressTest;
    audit: TheAudit;
    constructor();
    /**
     * Setup event wiring between modules
     */
    private setupEventWiring;
    /**
     * 🚀 Launch full singularity system
     */
    launch(): Promise<void>;
    /**
     * 🧪 Run full verification
     */
    verify(): Promise<boolean>;
    /**
     * 📦 Deploy to production
     */
    deploy(): Promise<void>;
    /**
     * 🛑 Shutdown singularity system
     */
    shutdown(): Promise<void>;
}
export declare function createSingularity(): SingularityOrchestrator;
export default SingularityOrchestrator;
//# sourceMappingURL=index.d.ts.map