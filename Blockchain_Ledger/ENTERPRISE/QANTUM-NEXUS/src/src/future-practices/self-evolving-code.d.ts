/**
 * 🧬 SELF-EVOLVING CODE ENGINE
 *
 * Advanced Practice #1: Tests that rewrite themselves when business logic changes.
 *
 * This module monitors code changes, analyzes business logic diffs,
 * and automatically regenerates affected tests to maintain coverage.
 *
 * Features:
 * - AST-based code analysis
 * - Business logic change detection
 * - Automatic test regeneration
 * - Semantic preservation during evolution
 * - Git integration for change tracking
 *
 * @version 1.0.0
 * @phase Future Practices - Beyond Phase 100
 * @author QANTUM AI Architect
 */
import { EventEmitter } from 'events';
interface CodeChange {
    filePath: string;
    type: 'function' | 'class' | 'method' | 'api' | 'schema' | 'route';
    name: string;
    oldSignature: string;
    newSignature: string;
    changeType: 'added' | 'modified' | 'removed' | 'renamed';
    semanticImpact: 'breaking' | 'non-breaking' | 'enhancement';
    detectedAt: number;
}
interface TestEvolution {
    testId: string;
    testPath: string;
    targetCode: string;
    originalCode: string;
    evolvedCode: string;
    changes: CodeChange[];
    confidence: number;
    status: 'pending' | 'applied' | 'rejected' | 'failed';
    appliedAt?: number;
}
interface EvolutionConfig {
    watchDirs: string[];
    testDirs: string[];
    autoApply: boolean;
    confidenceThreshold: number;
    preserveComments: boolean;
    generateBackup: boolean;
    maxEvolutionsPerCycle: number;
}
export declare class SelfEvolvingCodeEngine extends EventEmitter {
    private config;
    private signatures;
    private pendingEvolutions;
    private evolutionHistory;
    private watcher;
    private isMonitoring;
    private static readonly PATTERNS;
    constructor(config?: Partial<EvolutionConfig>);
    /**
     * 🚀 Start monitoring for code changes
     */
    startMonitoring(): Promise<void>;
    /**
     * 🛑 Stop monitoring
     */
    stopMonitoring(): void;
    /**
     * 📸 Capture code signatures from all watched directories
     */
    captureSignatures(): Promise<void>;
    /**
     * 📝 Extract business logic signature from a file
     */
    private extractSignature;
    /**
     * 🔍 Extract function signatures
     */
    private extractFunctions;
    /**
     * 🏛️ Extract class signatures
     */
    private extractClasses;
    /**
     * 🔀 Extract method signatures from class body
     */
    private extractMethods;
    /**
     * 📦 Extract property names
     */
    private extractProperties;
    /**
     * 🛤️ Extract route signatures
     */
    private extractRoutes;
    /**
     * 📋 Extract schema/interface signatures
     */
    private extractSchemas;
    /**
     * Parse interface/type fields
     */
    private parseInterfaceFields;
    /**
     * 👁️ Start file watching
     */
    private startWatching;
    /**
     * 📝 Handle file change
     */
    private handleFileChange;
    /**
     * 🔎 Detect changes between signatures
     */
    private detectChanges;
    /**
     * 🎯 Find tests affected by changes
     */
    private findAffectedTests;
    /**
     * 🧬 Generate test evolution
     */
    private generateEvolution;
    /**
     * 🔄 Evolve test code for a specific change
     */
    private evolveTestForChange;
    /**
     * Parse parameters from signature
     */
    private parseParams;
    /**
     * Calculate confidence for evolution
     */
    private calculateEvolutionConfidence;
    /**
     * ✅ Apply evolution to test file
     */
    applyEvolution(evolution: TestEvolution): Promise<boolean>;
    /**
     * 📊 Get evolution statistics
     */
    getStats(): {
        totalEvolutions: number;
        applied: number;
        pending: number;
        rejected: number;
        avgConfidence: number;
    };
    /**
     * Get all source files from directory
     */
    private getSourceFiles;
    /**
     * Get all test files from directory
     */
    private getTestFiles;
    /**
     * Check if file is a source file
     */
    private isSourceFile;
    /**
     * Check if file is a test file
     */
    private isTestFile;
}
export declare function createSelfEvolvingEngine(config?: Partial<EvolutionConfig>): SelfEvolvingCodeEngine;
export type { CodeChange, TestEvolution, EvolutionConfig };
//# sourceMappingURL=self-evolving-code.d.ts.map