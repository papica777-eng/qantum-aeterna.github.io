/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: VISUAL TESTING ENGINE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Screenshot comparison, baseline management, diff generation
 * Pixel-perfect and perceptual comparison modes
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface VisualConfig {
    baselineDir: string;
    diffDir: string;
    actualDir: string;
    threshold: number;
    antialiasDetection: boolean;
    ignoreColors: boolean;
    ignoreAntialiasing: boolean;
    diffColor: {
        r: number;
        g: number;
        b: number;
    };
    generateDiff: boolean;
    updateBaseline: boolean | 'missing' | 'all';
    comparisonMethod: 'pixel' | 'perceptual' | 'ssim';
}
export interface CompareResult {
    match: boolean;
    diffPercentage: number;
    diffPixels: number;
    totalPixels: number;
    baselinePath?: string;
    actualPath?: string;
    diffPath?: string;
    dimensions: {
        baseline: {
            width: number;
            height: number;
        };
        actual: {
            width: number;
            height: number;
        };
    };
    error?: string;
}
export interface Baseline {
    name: string;
    path: string;
    hash: string;
    width: number;
    height: number;
    createdAt: Date;
    updatedAt: Date;
    metadata?: Record<string, any>;
}
export interface VisualTestOptions {
    name: string;
    threshold?: number;
    ignoreRegions?: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
    maskColor?: {
        r: number;
        g: number;
        b: number;
    };
    viewport?: {
        width: number;
        height: number;
    };
    fullPage?: boolean;
    element?: string;
    clip?: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    waitBefore?: number;
    metadata?: Record<string, any>;
}
export declare class VisualComparator {
    private config;
    constructor(config?: Partial<VisualConfig>);
    /**
     * Compare two images
     */
    compare(baseline: Buffer | string, actual: Buffer | string, options?: {
        threshold?: number;
        ignoreRegions?: VisualTestOptions['ignoreRegions'];
    }): Promise<CompareResult>;
    /**
     * Pixel-by-pixel comparison
     */
    private pixelCompare;
    /**
     * Perceptual comparison (LAB color space)
     */
    private perceptualCompare;
    /**
     * SSIM comparison
     */
    private ssimCompare;
    /**
     * Calculate hash for image
     */
    calculateHash(buffer: Buffer): string;
}
export declare class BaselineManager extends EventEmitter {
    private config;
    private baselines;
    private comparator;
    constructor(config?: Partial<VisualConfig>);
    /**
     * Save baseline
     */
    saveBaseline(name: string, screenshot: Buffer, metadata?: Record<string, any>): Baseline;
    /**
     * Get baseline
     */
    getBaseline(name: string): Baseline | undefined;
    /**
     * Check if baseline exists
     */
    hasBaseline(name: string): boolean;
    /**
     * Update baseline
     */
    updateBaseline(name: string, screenshot: Buffer): Baseline;
    /**
     * Delete baseline
     */
    deleteBaseline(name: string): boolean;
    /**
     * List all baselines
     */
    listBaselines(filter?: {
        prefix?: string;
    }): Baseline[];
    /**
     * Cleanup unused baselines
     */
    cleanup(usedNames: string[]): number;
    private ensureDirectories;
    private getBaselinePath;
    private loadBaselines;
    private rebuildIndex;
    private saveBaselineIndex;
}
export declare class VisualTestingEngine extends EventEmitter {
    private config;
    private baselineManager;
    private comparator;
    private results;
    constructor(config?: Partial<VisualConfig>);
    /**
     * Take screenshot and compare with baseline
     */
    check(page: any, options: VisualTestOptions): Promise<CompareResult>;
    /**
     * Generate diff image
     */
    private generateDiff;
    private createPlaceholderDiff;
    /**
     * Get all results
     */
    getResults(): Map<string, CompareResult>;
    /**
     * Get summary
     */
    getSummary(): {
        total: number;
        passed: number;
        failed: number;
        avgDiffPercentage: number;
    };
    /**
     * Clear results
     */
    clearResults(): void;
    /**
     * Update specific baseline
     */
    updateBaseline(name: string, screenshot: Buffer): void;
    /**
     * Get baseline manager
     */
    getBaselineManager(): BaselineManager;
}
export declare class VisualRegressionSuite extends EventEmitter {
    private engine;
    private tests;
    private name;
    constructor(name: string, config?: Partial<VisualConfig>);
    /**
     * Add visual test
     */
    addTest(options: VisualTestOptions): this;
    /**
     * Run all tests
     */
    run(page: any): Promise<{
        name: string;
        passed: number;
        failed: number;
        results: CompareResult[];
    }>;
}
declare const _default: {
    VisualTestingEngine: typeof VisualTestingEngine;
    VisualComparator: typeof VisualComparator;
    BaselineManager: typeof BaselineManager;
    VisualRegressionSuite: typeof VisualRegressionSuite;
};
export default _default;
//# sourceMappingURL=VisualTesting.d.ts.map