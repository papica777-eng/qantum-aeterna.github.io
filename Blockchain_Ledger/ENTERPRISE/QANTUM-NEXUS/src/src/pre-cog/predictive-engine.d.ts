/**
 * 🔮 PRE-COG ENGINE - Predictive Test Analysis
 *
 * Uses git diff analysis and historical test data to predict
 * which tests are likely to fail based on code changes.
 *
 * Features:
 * - Git integration for change detection
 * - File-to-test correlation mapping
 * - Risk scoring algorithm
 * - CLI warnings for high-risk changes
 * - Smart test prioritization
 *
 * @version 1.0.0
 * @phase 66-70
 */
interface FileChange {
    path: string;
    status: 'added' | 'modified' | 'deleted' | 'renamed';
    additions: number;
    deletions: number;
    hunks: CodeHunk[];
}
interface CodeHunk {
    startLine: number;
    endLine: number;
    content: string;
    functions: string[];
}
interface TestCorrelation {
    testFile: string;
    testName: string;
    sourceFiles: string[];
    lastRun: number;
    lastResult: 'pass' | 'fail' | 'skip';
    failureHistory: FailureRecord[];
    avgDuration: number;
}
interface FailureRecord {
    timestamp: number;
    changedFiles: string[];
    errorMessage: string;
    gitCommit: string;
}
interface RiskAssessment {
    file: string;
    riskScore: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    affectedTests: TestPrediction[];
    reasons: string[];
}
interface TestPrediction {
    testFile: string;
    testName: string;
    failureProbability: number;
    correlationStrength: number;
    historicalFailures: number;
    recommendation: 'run' | 'skip' | 'prioritize';
}
interface PredictionReport {
    timestamp: number;
    gitBranch: string;
    gitCommit: string;
    changedFiles: FileChange[];
    riskAssessments: RiskAssessment[];
    recommendedTests: TestPrediction[];
    estimatedTime: number;
    confidence: number;
}
declare class CorrelationEngine {
    private correlations;
    private dbPath;
    constructor(dbPath?: string);
    /**
     * Load correlation data from disk
     */
    private loadCorrelations;
    /**
     * Save correlation data to disk
     */
    save(): void;
    /**
     * Record a test result and update correlations
     */
    recordTestResult(testFile: string, testName: string, result: 'pass' | 'fail' | 'skip', changedFiles: string[], duration: number, errorMessage?: string): void;
    /**
     * Get tests correlated with a source file
     */
    getCorrelatedTests(sourceFile: string): TestCorrelation[];
    /**
     * Get failure probability for a test given changed files
     */
    getFailureProbability(testFile: string, testName: string, changedFiles: string[]): number;
    private getCurrentCommit;
}
declare class GitAnalyzer {
    private repoPath;
    constructor(repoPath?: string);
    /**
     * Get changed files since a reference point
     */
    getChangedFiles(base?: string): FileChange[];
    /**
     * Get current branch name
     */
    getCurrentBranch(): string;
    /**
     * Get current commit hash
     */
    getCurrentCommit(): string;
    /**
     * Check if file exists in git history
     */
    isTracked(filePath: string): boolean;
    private getFileDetails;
    private parseStatus;
    private parseHunks;
    private extractFunctionNames;
}
declare class RiskScorer {
    private correlationEngine;
    constructor(correlationEngine: CorrelationEngine);
    /**
     * Calculate risk score for a file change
     */
    assessRisk(change: FileChange): RiskAssessment;
    private getFileTypeRisk;
    private predictAffectedTests;
    private scoreToLevel;
}
export declare class PredictiveEngine {
    private gitAnalyzer;
    private correlationEngine;
    private riskScorer;
    constructor(options?: {
        repoPath?: string;
        correlationsDb?: string;
    });
    /**
     * Generate a full prediction report for current changes
     */
    predict(base?: string): Promise<PredictionReport>;
    /**
     * Record test results to improve future predictions
     */
    recordResults(results: Array<{
        testFile: string;
        testName: string;
        result: 'pass' | 'fail' | 'skip';
        duration: number;
        errorMessage?: string;
    }>): void;
    /**
     * Get CLI-friendly warning messages
     */
    getWarnings(report: PredictionReport): string[];
    private calculateConfidence;
}
export declare function formatPredictionReport(report: PredictionReport): string;
export { CorrelationEngine, GitAnalyzer, RiskScorer };
//# sourceMappingURL=predictive-engine.d.ts.map