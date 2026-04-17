#!/usr/bin/env node
/**
 * 🔥 PHASE 1: DEDUPLICATION + ANALYSIS
 *
 * This script performs:
 * 1. SHA-256 hashing of all source files
 * 2. Identifies and removes identical duplicates
 * 3. Groups files by similarity (>90% code overlap)
 * 4. Generates TAXONOMY.json with domain categorization
 */
interface SimilarityGroup {
    files: string[];
    similarity: number;
    representativeFile: string;
}
interface TaxonomyCategory {
    [category: string]: string[];
}
interface DeduplicationReport {
    totalFiles: number;
    uniqueFiles: number;
    duplicates: {
        [hash: string]: string[];
    };
    similarityGroups: SimilarityGroup[];
    taxonomy: TaxonomyCategory;
    stats: {
        totalSize: number;
        uniqueSize: number;
        savedSpace: number;
    };
}
declare class DeduplicationAnalyzer {
    private fileMap;
    private hashMap;
    private rootDir;
    private extensions;
    constructor(rootDir: string);
    /**
     * Calculate SHA-256 hash of file content
     */
    private hashContent;
    /**
     * Calculate Jaccard similarity between two sets of lines
     */
    private calculateSimilarity;
    /**
     * Recursively scan directory for source files
     */
    private scanDirectory;
    /**
     * Process individual file
     */
    private processFile;
    /**
     * Find similar files (>90% overlap)
     */
    private findSimilarFiles;
    /**
     * Categorize files by domain
     */
    private categorizeTaxonomy;
    /**
     * Generate comprehensive deduplication report
     */
    analyze(): DeduplicationReport;
    /**
     * Save report to file
     */
    saveReport(report: DeduplicationReport, outputDir: string): void;
    /**
     * Generate human-readable summary
     */
    private generateSummary;
}
export { DeduplicationAnalyzer, DeduplicationReport, TaxonomyCategory };
//# sourceMappingURL=deduplicate-analyze.d.ts.map