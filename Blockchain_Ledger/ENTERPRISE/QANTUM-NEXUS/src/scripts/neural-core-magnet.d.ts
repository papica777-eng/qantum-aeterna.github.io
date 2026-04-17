#!/usr/bin/env node
/**
 * 🧲 PHASE 2: NEURAL CORE MAGNET
 *
 * Neural absorption system for vectorizing and analyzing unique modules:
 * 1. Semantic Search Engine - vector-based code search
 * 2. Pattern Recognition - identifies architectural patterns
 * 3. Auto-Documentation - generates intelligent descriptions
 */
interface CodeVector {
    file: string;
    vector: number[];
    tokens: string[];
    embeddings: Map<string, number>;
}
interface ArchitecturalPattern {
    name: string;
    description: string;
    files: string[];
    confidence: number;
    features: string[];
}
interface ModuleDocumentation {
    file: string;
    description: string;
    purpose: string;
    dependencies: string[];
    exports: string[];
    complexity: number;
    category: string;
}
interface NeuralAbsorptionResult {
    vectors: CodeVector[];
    patterns: ArchitecturalPattern[];
    documentation: ModuleDocumentation[];
    searchIndex: Map<string, number[]>;
}
declare class NeuralCoreMagnet {
    private taxonomyPath;
    private taxonomy;
    private stopWords;
    constructor(taxonomyPath?: string);
    /**
     * Load taxonomy file
     */
    private loadTaxonomy;
    /**
     * Tokenize code content
     */
    private tokenize;
    /**
     * Create TF-IDF vector for code
     */
    private createVector;
    /**
     * Calculate global token frequencies
     */
    private calculateGlobalTokens;
    /**
     * Vectorize unique modules
     */
    vectorizeModules(uniqueFiles: string[]): CodeVector[];
    /**
     * Identify architectural patterns
     */
    recognizePatterns(files: string[]): ArchitecturalPattern[];
    /**
     * Generate auto-documentation for modules
     */
    generateDocumentation(files: string[]): ModuleDocumentation[];
    /**
     * Build semantic search index
     */
    buildSearchIndex(vectors: CodeVector[]): Map<string, number[]>;
    /**
     * Search code by semantic query
     */
    semanticSearch(query: string, vectors: CodeVector[], topK?: number): string[];
    /**
     * Run full neural absorption
     */
    absorb(targetDir: string, deduplicate?: boolean): Promise<NeuralAbsorptionResult>;
    /**
     * Scan directory for files
     */
    private scanDirectory;
    /**
     * Save neural absorption results
     */
    saveResults(result: NeuralAbsorptionResult, outputDir: string): void;
    /**
     * Generate human-readable summary
     */
    private generateSummary;
}
export { NeuralCoreMagnet, NeuralAbsorptionResult, ArchitecturalPattern, ModuleDocumentation };
//# sourceMappingURL=neural-core-magnet.d.ts.map