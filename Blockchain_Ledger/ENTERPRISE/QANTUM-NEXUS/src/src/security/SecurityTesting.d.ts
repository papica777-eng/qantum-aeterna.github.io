/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: SECURITY TESTING
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * XSS, CSRF, SQL Injection detection, security scanner, penetration testing
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export type VulnerabilityType = 'xss' | 'sqli' | 'csrf' | 'lfi' | 'rfi' | 'xxe' | 'ssrf' | 'open-redirect' | 'header-injection' | 'command-injection' | 'path-traversal' | 'information-disclosure' | 'authentication-bypass' | 'insecure-deserialization';
export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
export interface Vulnerability {
    id: string;
    type: VulnerabilityType;
    severity: Severity;
    title: string;
    description: string;
    url: string;
    parameter?: string;
    payload?: string;
    evidence?: string;
    remediation: string;
    cwe?: string;
    owasp?: string;
    timestamp: Date;
}
export interface SecurityScanConfig {
    url: string;
    maxDepth?: number;
    maxPages?: number;
    timeout?: number;
    excludePatterns?: string[];
    includePatterns?: string[];
    scanTypes?: VulnerabilityType[];
    headers?: Record<string, string>;
    cookies?: Record<string, string>;
    authentication?: {
        type: 'basic' | 'bearer' | 'cookie' | 'form';
        credentials: Record<string, string>;
    };
}
export interface SecurityReport {
    scanId: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    target: string;
    pagesScanned: number;
    vulnerabilities: Vulnerability[];
    summary: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        info: number;
        total: number;
    };
    score: number;
}
export declare class XSSScanner extends EventEmitter {
    private page;
    private vulnerabilities;
    constructor(page: any);
    /**
     * Scan page for XSS vulnerabilities
     */
    scan(url: string): Promise<Vulnerability[]>;
    private testInput;
    private testURLParameters;
    private testForm;
    private detectXSSInContent;
    private addVulnerability;
}
export declare class SQLInjectionScanner extends EventEmitter {
    private page;
    private vulnerabilities;
    constructor(page: any);
    /**
     * Scan for SQL Injection vulnerabilities
     */
    scan(url: string): Promise<Vulnerability[]>;
    private testURLParameters;
    private testForms;
    private detectSQLError;
    private addVulnerability;
}
export declare class SecurityHeadersAnalyzer {
    private requiredHeaders;
    /**
     * Analyze security headers
     */
    analyze(url: string): Promise<HeaderAnalysis>;
    private analyzeHeader;
    private calculateScore;
    private calculateGrade;
}
export interface HeaderAnalysis {
    url: string;
    headers: Record<string, string>;
    missingHeaders: Array<{
        header: string;
        severity: Severity;
        description: string;
        recommendation: string;
    }>;
    presentHeaders: Array<{
        header: string;
        value: string;
        isSecure: boolean;
        notes: string[];
    }>;
    score: number;
    grade: string;
}
export declare class CSRFScanner extends EventEmitter {
    private page;
    private vulnerabilities;
    constructor(page: any);
    /**
     * Scan for CSRF vulnerabilities
     */
    scan(url: string): Promise<Vulnerability[]>;
    private checkForCSRFToken;
    private checkSameSiteCookie;
    private addVulnerability;
}
export declare class SecurityScanner extends EventEmitter {
    private config;
    private page;
    private vulnerabilities;
    constructor(page: any, config: SecurityScanConfig);
    /**
     * Run full security scan
     */
    scan(): Promise<SecurityReport>;
    private scanUrl;
    private shouldCrawl;
    private calculateSummary;
    private calculateScore;
}
export declare function createSecurityScanner(page: any, config: SecurityScanConfig): SecurityScanner;
declare const _default: {
    SecurityScanner: typeof SecurityScanner;
    XSSScanner: typeof XSSScanner;
    SQLInjectionScanner: typeof SQLInjectionScanner;
    CSRFScanner: typeof CSRFScanner;
    SecurityHeadersAnalyzer: typeof SecurityHeadersAnalyzer;
    XSS_PAYLOADS: string[];
    SQLI_PAYLOADS: string[];
    PATH_TRAVERSAL_PAYLOADS: string[];
    COMMAND_INJECTION_PAYLOADS: string[];
    createSecurityScanner: typeof createSecurityScanner;
};
export default _default;
//# sourceMappingURL=SecurityTesting.d.ts.map