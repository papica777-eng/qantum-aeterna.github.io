#!/usr/bin/env node
/**
 * 🚀 PHASE 3: INTEGRATION IN QANTUM
 *
 * Integrates analyzed modules into QAntum:
 * 1. Extracts TOP 50 most valuable modules
 * 2. Integrates into OmniCore
 * 3. Creates @qantum/core-utils shared library
 * 4. Generates training dataset for code-gen models
 */
interface ModuleValue {
    file: string;
    score: number;
    category: string;
    complexity: number;
    dependencies: number;
    exports: number;
    reusability: number;
}
interface IntegrationPlan {
    topModules: ModuleValue[];
    omniCoreIntegrations: string[];
    sharedLibraryModules: string[];
    trainingDataset: TrainingExample[];
}
interface TrainingExample {
    input: string;
    output: string;
    category: string;
    metadata: {
        complexity: number;
        language: string;
        pattern: string;
    };
}
declare class QAntumIntegrator {
    private taxonomyPath;
    private docsPath;
    private patternsPath;
    private taxonomy;
    private documentation;
    private patterns;
    constructor(analysisDir: string);
    /**
     * Load analysis data
     */
    private loadAnalysisData;
    /**
     * Calculate module value score
     */
    private calculateModuleValue;
    /**
     * Extract TOP 50 most valuable modules
     */
    extractTopModules(topN?: number): ModuleValue[];
    /**
     * Identify modules for OmniCore integration
     */
    identifyOmniCoreModules(topModules: ModuleValue[]): string[];
    /**
     * Identify modules for shared library
     */
    identifySharedLibraryModules(topModules: ModuleValue[]): string[];
    /**
     * Generate training dataset for code-gen models
     */
    generateTrainingDataset(topModules: ModuleValue[]): TrainingExample[];
    /**
     * Find architectural pattern for file
     */
    private findPattern;
    /**
     * Create @qantum/core-utils package structure
     */
    createSharedLibraryStructure(modules: string[], outputDir: string): void;
    /**
     * Generate OmniCore integration guide
     */
    generateOmniCoreGuide(modules: string[], outputDir: string): void;
    /**
     * Run full integration process
     */
    integrate(outputDir: string): IntegrationPlan;
    /**
     * Save integration plan
     */
    saveIntegrationPlan(plan: IntegrationPlan, outputDir: string): void;
    /**
     * Generate human-readable summary
     */
    private generateSummary;
}
export { QAntumIntegrator, IntegrationPlan, ModuleValue, TrainingExample };
//# sourceMappingURL=qantum-integrator.d.ts.map