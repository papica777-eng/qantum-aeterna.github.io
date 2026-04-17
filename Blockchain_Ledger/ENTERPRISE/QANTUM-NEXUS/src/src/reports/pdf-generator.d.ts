/**
 * 📄 QANTUM - Executive PDF Report Generator
 *
 * Generates beautiful PDF reports with:
 * - Executive Summary
 * - ROI Calculator (money saved)
 * - Test Statistics & Graphs
 * - AI Self-Healing Analytics
 * - Security Compliance Score
 *
 * @version 1.0.0
 */
interface TestMetrics {
    totalTests: number;
    passed: number;
    failed: number;
    skipped: number;
    healed: number;
    passRate: number;
    avgDuration: number;
    totalDuration: number;
}
interface ROIMetrics {
    hoursManualTesting: number;
    hoursSaved: number;
    avgQASalaryPerHour: number;
    moneySaved: number;
    bugsPreventedInProduction: number;
    estimatedBugCost: number;
    totalROI: number;
}
interface ReportData {
    companyName: string;
    projectName: string;
    reportDate: Date;
    period: string;
    metrics: TestMetrics;
    roi: ROIMetrics;
    healingHistory: Array<{
        selector: string;
        newSelector: string;
        strategy: string;
        confidence: number;
        timestamp: Date;
    }>;
    trendData: number[];
}
export declare class ExecutivePDFReport {
    private doc;
    private colors;
    constructor();
    /**
     * Generate Executive PDF Report
     */
    generate(data: ReportData, outputPath: string): Promise<string>;
    /**
     * Cover Page - Premium branding
     */
    private addCoverPage;
    /**
     * Executive Summary - For C-Level
     */
    private addExecutiveSummary;
    /**
     * ROI Analysis - The Money Page
     */
    private addROIAnalysis;
    /**
     * Test Metrics Details
     */
    private addTestMetrics;
    /**
     * Self-Healing Report
     */
    private addSelfHealingReport;
    /**
     * Recommendations Page
     */
    private addRecommendations;
    private addHeader;
    private addMetricBox;
    private addProgressBar;
}
export declare function generateExecutiveReport(outputDir?: string): Promise<string>;
export {};
//# sourceMappingURL=pdf-generator.d.ts.map