/**
 * 🤖 AUTONOMOUS EXPLORER - Self-Discovery Engine
 *
 * Automatically crawls websites, discovers business logic,
 * maps API dependencies, and prepares data for test generation.
 *
 * Features:
 * - Intelligent page crawling with parallel workers
 * - Form detection and field analysis
 * - Transaction flow discovery
 * - API endpoint mapping
 * - Business logic inference
 *
 * @version 1.0.0
 * @phase 84-86
 */
import { EventEmitter } from 'events';
interface ExplorerConfig {
    maxPages: number;
    maxDepth: number;
    parallelWorkers: number;
    timeout: number;
    respectRobotsTxt: boolean;
    captureNetworkTraffic: boolean;
    takeScreenshots: boolean;
    detectForms: boolean;
    detectAPIs: boolean;
    headless: boolean;
    outputDir: string;
}
interface DiscoveredPage {
    url: string;
    title: string;
    depth: number;
    parentUrl?: string;
    discoveredAt: number;
    crawledAt?: number;
    forms: DiscoveredForm[];
    links: DiscoveredLink[];
    buttons: DiscoveredButton[];
    inputs: DiscoveredInput[];
    anchors: string[];
    apiCalls: ApiCall[];
    screenshot?: string;
    pageType: 'landing' | 'form' | 'list' | 'detail' | 'checkout' | 'auth' | 'dashboard' | 'other';
    businessFunction?: string;
}
interface DiscoveredForm {
    id: string;
    name?: string;
    action: string;
    method: string;
    fields: FormField[];
    submitButton?: string;
    purpose: 'login' | 'register' | 'search' | 'contact' | 'checkout' | 'data-entry' | 'other';
}
interface FormField {
    name: string;
    type: string;
    label?: string;
    placeholder?: string;
    required: boolean;
    validation?: string;
    autocomplete?: string;
}
interface DiscoveredLink {
    url: string;
    text: string;
    isExternal: boolean;
    isNavigation: boolean;
    anchorId?: string;
}
interface DiscoveredButton {
    text: string;
    type: 'submit' | 'button' | 'reset';
    onClick?: string;
    anchorId?: string;
    businessAction?: string;
}
interface DiscoveredInput {
    name: string;
    type: string;
    label?: string;
    anchorId?: string;
}
interface ApiCall {
    id: string;
    method: string;
    url: string;
    requestHeaders: Record<string, string>;
    requestBody?: any;
    responseStatus: number;
    responseBody?: any;
    timestamp: number;
    duration: number;
    triggeredBy?: string;
}
interface TransactionFlow {
    id: string;
    name: string;
    startPage: string;
    endPage: string;
    steps: FlowStep[];
    apiSequence: string[];
    businessPurpose: string;
}
interface FlowStep {
    pageUrl: string;
    action: 'click' | 'fill' | 'select' | 'submit' | 'navigate';
    target?: string;
    value?: string;
    apiCalls: string[];
}
interface SiteMap {
    baseUrl: string;
    exploredAt: number;
    totalPages: number;
    totalForms: number;
    totalApiEndpoints: number;
    pages: Map<string, DiscoveredPage>;
    forms: Map<string, DiscoveredForm>;
    apiEndpoints: Map<string, ApiEndpoint>;
    transactionFlows: TransactionFlow[];
    authentication: AuthenticationInfo | null;
    userFlows: string[];
    criticalPaths: string[];
}
interface ApiEndpoint {
    url: string;
    method: string;
    requestSchema?: any;
    responseSchema?: any;
    usageCount: number;
    avgResponseTime: number;
    authentication: 'none' | 'bearer' | 'cookie' | 'api-key';
}
interface AuthenticationInfo {
    loginUrl: string;
    loginForm: string;
    usernameField: string;
    passwordField: string;
    submitButton: string;
    successIndicator: string;
    logoutUrl?: string;
}
export declare class AutonomousExplorer extends EventEmitter {
    private config;
    private neuralMap;
    private browser;
    private siteMap;
    private visitedUrls;
    private urlQueue;
    private activeWorkers;
    constructor(config?: Partial<ExplorerConfig>);
    /**
     * 🚀 Start autonomous exploration
     */
    explore(baseUrl: string): Promise<SiteMap>;
    /**
     * Run parallel crawlers
     */
    private runCrawlers;
    /**
     * Individual crawler worker
     */
    private crawlerWorker;
    /**
     * Crawl a single page
     */
    private crawlPage;
    /**
     * Analyze page content
     */
    private analyzePage;
    /**
     * Discover forms on page
     */
    private discoverForms;
    /**
     * Discover links on page
     */
    private discoverLinks;
    /**
     * Discover buttons on page
     */
    private discoverButtons;
    /**
     * Discover inputs on page
     */
    private discoverInputs;
    /**
     * Create cognitive anchors for important elements
     */
    private createAnchors;
    /**
     * Setup network traffic capture
     */
    private setupNetworkCapture;
    /**
     * Record API endpoint for pattern analysis
     */
    private recordApiEndpoint;
    /**
     * Detect transaction flows from discovered data
     */
    private detectTransactionFlows;
    /**
     * Identify authentication mechanism
     */
    private identifyAuthentication;
    /**
     * Analyze API patterns
     */
    private analyzeApiPatterns;
    private initializeSiteMap;
    private isApiRequest;
    private classifyPageType;
    private inferBusinessFunction;
    private takeScreenshot;
    private saveSiteMap;
    private sleep;
}
export declare function createExplorer(config?: Partial<ExplorerConfig>): AutonomousExplorer;
export { SiteMap, DiscoveredPage, DiscoveredForm, ApiCall, TransactionFlow };
//# sourceMappingURL=autonomous-explorer.d.ts.map