/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: REPORTERS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Multi-format reporting: HTML, JSON, JUnit, Allure, Console
 * Real-time dashboard support
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface TestResult {
    id: string;
    name: string;
    suite?: string;
    status: 'passed' | 'failed' | 'skipped' | 'pending';
    duration: number;
    startTime: Date;
    endTime?: Date;
    error?: {
        message: string;
        stack?: string;
        screenshot?: string;
    };
    steps?: StepResult[];
    attachments?: Attachment[];
    metadata?: Record<string, any>;
    retries?: number;
    browser?: string;
    tags?: string[];
}
export interface StepResult {
    name: string;
    status: 'passed' | 'failed' | 'skipped';
    duration: number;
    error?: string;
    screenshot?: string;
}
export interface Attachment {
    name: string;
    type: 'screenshot' | 'video' | 'log' | 'trace' | 'html' | 'json' | 'other';
    path?: string;
    content?: string;
    contentType?: string;
}
export interface SuiteResult {
    name: string;
    tests: TestResult[];
    startTime: Date;
    endTime: Date;
    duration: number;
    passed: number;
    failed: number;
    skipped: number;
    suites?: SuiteResult[];
}
export interface ReportConfig {
    outputDir: string;
    reportName?: string;
    timestamp?: boolean;
    embedScreenshots?: boolean;
    embedVideos?: boolean;
    includeSteps?: boolean;
}
export declare abstract class BaseReporter extends EventEmitter {
    protected config: ReportConfig;
    protected results: TestResult[];
    protected suites: Map<string, SuiteResult>;
    protected startTime: Date;
    constructor(config?: Partial<ReportConfig>);
    /**
     * Add test result
     */
    addResult(result: TestResult): void;
    /**
     * Get summary
     */
    getSummary(): {
        total: number;
        passed: number;
        failed: number;
        skipped: number;
        duration: number;
        passRate: number;
    };
    /**
     * Generate report
     */
    abstract generate(): Promise<string>;
    /**
     * Get report filename
     */
    protected getReportPath(extension: string): string;
    protected ensureOutputDir(): void;
}
export declare class HTMLReporter extends BaseReporter {
    generate(): Promise<string>;
    private renderTestRow;
    private formatDuration;
    private escapeHtml;
}
export declare class JSONReporter extends BaseReporter {
    generate(): Promise<string>;
}
export declare class JUnitReporter extends BaseReporter {
    generate(): Promise<string>;
    private escapeXml;
}
export declare class ConsoleReporter extends BaseReporter {
    private colors;
    generate(): Promise<string>;
    private formatDuration;
}
export declare class AllureReporter extends BaseReporter {
    private allureDir;
    constructor(config?: Partial<ReportConfig>);
    generate(): Promise<string>;
    private convertToAllure;
    private convertStatus;
    private getAllureType;
    private generateUUID;
    private hashString;
}
export declare class MultiReporter extends EventEmitter {
    private reporters;
    /**
     * Add reporter
     */
    addReporter(reporter: BaseReporter): this;
    /**
     * Add result to all reporters
     */
    addResult(result: TestResult): void;
    /**
     * Generate all reports
     */
    generate(): Promise<string[]>;
    /**
     * Get combined summary
     */
    getSummary(): ReturnType<BaseReporter['getSummary']>;
}
export declare class ReporterFactory {
    static create(type: 'html' | 'json' | 'junit' | 'console' | 'allure', config?: Partial<ReportConfig>): BaseReporter;
    static createMulti(types: Array<'html' | 'json' | 'junit' | 'console' | 'allure'>, config?: Partial<ReportConfig>): MultiReporter;
}
declare const _default: {
    HTMLReporter: typeof HTMLReporter;
    JSONReporter: typeof JSONReporter;
    JUnitReporter: typeof JUnitReporter;
    ConsoleReporter: typeof ConsoleReporter;
    AllureReporter: typeof AllureReporter;
    MultiReporter: typeof MultiReporter;
    ReporterFactory: typeof ReporterFactory;
};
export default _default;
//# sourceMappingURL=Reporters.d.ts.map