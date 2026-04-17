/**
 * 🎯 THE AUDIT - Final System Verification
 *
 * Complete audit of QANTUM:
 * - All 100 phases verification
 * - Integration tests
 * - Performance benchmarks
 * - Security audit
 * - Code quality metrics
 * - Final certification
 *
 * Target: 100% Pass Rate on ALL tests
 *
 * @version 1.0.0
 * @phase 96-100 - The Singularity
 */
import { EventEmitter } from 'events';
interface AuditConfig {
    outputDir: string;
    verbose: boolean;
    categories: AuditCategory[];
    thresholds: AuditThresholds;
}
type AuditCategory = 'unit_tests' | 'integration_tests' | 'performance' | 'security' | 'code_quality' | 'documentation' | 'compatibility';
interface AuditThresholds {
    passRate: number;
    codeQuality: number;
    testCoverage: number;
    performanceScore: number;
    securityScore: number;
}
interface AuditResult {
    category: AuditCategory;
    name: string;
    status: 'pass' | 'fail' | 'warning' | 'skip';
    score: number;
    maxScore: number;
    details: string;
    duration: number;
}
interface CategoryReport {
    category: AuditCategory;
    results: AuditResult[];
    passed: number;
    failed: number;
    warnings: number;
    score: number;
    maxScore: number;
}
interface FinalAuditReport {
    timestamp: string;
    version: string;
    categories: CategoryReport[];
    totalTests: number;
    totalPassed: number;
    totalFailed: number;
    passRate: number;
    overallScore: number;
    certification: 'CERTIFIED' | 'CONDITIONALLY_CERTIFIED' | 'NOT_CERTIFIED';
    certificationDetails: string;
    recommendations: string[];
}
export declare class TheAudit extends EventEmitter {
    private config;
    private results;
    private categoryReports;
    constructor(config?: Partial<AuditConfig>);
    /**
     * 🎯 Run complete audit
     */
    runAudit(): Promise<FinalAuditReport>;
    /**
     * Audit single category
     */
    private auditCategory;
    /**
     * Run individual check
     */
    private runCheck;
    /**
     * Generate final report
     */
    private generateFinalReport;
    /**
     * Display final report
     */
    private displayReport;
    /**
     * Save report to file
     */
    private saveReport;
    /**
     * Format category name
     */
    private formatCategory;
    /**
     * Sleep helper
     */
    private sleep;
}
export declare function createAudit(config?: Partial<AuditConfig>): TheAudit;
export type { AuditConfig, AuditResult, FinalAuditReport, CategoryReport };
//# sourceMappingURL=the-audit.d.ts.map