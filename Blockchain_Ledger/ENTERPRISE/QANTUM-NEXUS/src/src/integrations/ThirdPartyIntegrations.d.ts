/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: THIRD-PARTY INTEGRATIONS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Jira, Slack, TestRail, GitHub, Azure DevOps integrations
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface IntegrationConfig {
    apiUrl: string;
    apiToken: string;
    projectId?: string;
    options?: Record<string, any>;
}
export interface TestResult {
    testId: string;
    name: string;
    status: 'passed' | 'failed' | 'skipped' | 'blocked';
    duration: number;
    error?: string;
    screenshots?: string[];
    metadata?: Record<string, any>;
}
export interface BugReport {
    title: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    severity: 'blocker' | 'critical' | 'major' | 'minor' | 'trivial';
    steps: string[];
    expectedResult: string;
    actualResult: string;
    attachments?: string[];
    labels?: string[];
    assignee?: string;
    environment?: string;
}
export declare class JiraIntegration extends EventEmitter {
    private config;
    private headers;
    constructor(config: JiraConfig);
    /**
     * Create bug from test failure
     */
    createBug(report: BugReport): Promise<JiraIssue>;
    /**
     * Update issue status
     */
    updateStatus(issueKey: string, status: string): Promise<void>;
    /**
     * Add comment to issue
     */
    addComment(issueKey: string, comment: string): Promise<void>;
    /**
     * Link test result to issue
     */
    linkTestResult(issueKey: string, result: TestResult): Promise<void>;
    /**
     * Search issues
     */
    searchIssues(jql: string): Promise<JiraIssue[]>;
    /**
     * Get issue details
     */
    getIssue(issueKey: string): Promise<JiraIssue>;
    private getTransitions;
    private uploadAttachment;
    private formatDescription;
    private mapPriority;
    private request;
}
interface JiraConfig {
    apiUrl: string;
    email: string;
    apiToken: string;
    projectKey: string;
}
interface JiraIssue {
    id: string;
    key: string;
    self: string;
    fields: Record<string, any>;
}
export declare class SlackIntegration extends EventEmitter {
    private webhookUrl;
    private channel;
    private botToken?;
    constructor(config: SlackConfig);
    /**
     * Send test summary
     */
    sendTestSummary(summary: TestSummary): Promise<void>;
    /**
     * Send alert
     */
    sendAlert(alert: AlertMessage): Promise<void>;
    /**
     * Send failure notification
     */
    sendFailureNotification(failure: FailureNotification): Promise<void>;
    /**
     * Upload file (requires bot token)
     */
    uploadFile(filePath: string, title: string): Promise<void>;
    private sendWebhook;
    private formatDuration;
}
interface SlackConfig {
    webhookUrl: string;
    channel: string;
    botToken?: string;
}
interface TestSummary {
    suiteName: string;
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    duration: number;
    passRate: number;
    failedTests: string[];
    branch?: string;
}
interface AlertMessage {
    type: 'error' | 'warning' | 'success' | 'info';
    title: string;
    message: string;
    fields?: Array<{
        name: string;
        value: string;
    }>;
    actions?: Array<{
        text: string;
        url: string;
        style?: 'primary' | 'danger';
    }>;
}
interface FailureNotification {
    testName: string;
    error: string;
    file: string;
    line?: number;
    stackTrace?: string;
}
export declare class TestRailIntegration extends EventEmitter {
    private config;
    private headers;
    constructor(config: TestRailConfig);
    /**
     * Create test run
     */
    createRun(name: string, caseIds?: number[]): Promise<TestRailRun>;
    /**
     * Add test result
     */
    addResult(runId: number, caseId: number, result: TestResult): Promise<void>;
    /**
     * Add multiple results
     */
    addResults(runId: number, results: Array<{
        caseId: number;
        result: TestResult;
    }>): Promise<void>;
    /**
     * Close test run
     */
    closeRun(runId: number): Promise<void>;
    /**
     * Get test cases
     */
    getCases(suiteId?: number): Promise<TestRailCase[]>;
    /**
     * Get run results
     */
    getResults(runId: number): Promise<TestRailResult[]>;
    /**
     * Sync test results from run
     */
    syncResults(runId: number, results: TestResult[], caseMapping: Map<string, number>): Promise<SyncResult>;
    private request;
}
interface TestRailConfig {
    apiUrl: string;
    username: string;
    apiKey: string;
    projectId: number;
    suiteId: number;
}
interface TestRailRun {
    id: number;
    name: string;
    url: string;
}
interface TestRailCase {
    id: number;
    title: string;
    section_id: number;
}
interface TestRailResult {
    id: number;
    test_id: number;
    status_id: number;
    comment: string;
}
interface SyncResult {
    synced: number;
    failed: number;
    total: number;
}
export declare class GitHubIntegration extends EventEmitter {
    private config;
    private headers;
    constructor(config: GitHubConfig);
    /**
     * Create issue from test failure
     */
    createIssue(title: string, body: string, labels?: string[]): Promise<GitHubIssue>;
    /**
     * Create check run
     */
    createCheckRun(name: string, headSha: string, conclusion: string, summary: string): Promise<void>;
    /**
     * Update commit status
     */
    updateStatus(sha: string, state: 'pending' | 'success' | 'failure' | 'error', description: string, context?: string): Promise<void>;
    /**
     * Add comment to PR
     */
    addPRComment(prNumber: number, comment: string): Promise<void>;
    /**
     * Create release
     */
    createRelease(tagName: string, name: string, body: string, draft?: boolean): Promise<void>;
    private request;
}
interface GitHubConfig {
    token: string;
    owner: string;
    repo: string;
    targetUrl?: string;
}
interface GitHubIssue {
    id: number;
    number: number;
    html_url: string;
}
export declare class AzureDevOpsIntegration extends EventEmitter {
    private config;
    private headers;
    constructor(config: AzureDevOpsConfig);
    /**
     * Create work item
     */
    createWorkItem(type: string, title: string, description: string): Promise<any>;
    /**
     * Create test run
     */
    createTestRun(name: string, planId: number): Promise<any>;
    /**
     * Add test results
     */
    addTestResults(runId: number, results: TestResult[]): Promise<void>;
    /**
     * Update build status
     */
    updateBuildStatus(buildId: number, status: string): Promise<void>;
    private request;
}
interface AzureDevOpsConfig {
    orgUrl: string;
    project: string;
    pat: string;
}
export declare class IntegrationManager extends EventEmitter {
    private integrations;
    /**
     * Register integration
     */
    register(name: string, integration: any): void;
    /**
     * Get integration
     */
    get<T>(name: string): T | undefined;
    /**
     * Broadcast test results to all integrations
     */
    broadcastResults(results: TestResult[]): Promise<BroadcastResult>;
    /**
     * Report failure to all integrations
     */
    reportFailure(failure: BugReport): Promise<void>;
}
interface BroadcastResult {
    outcomes: Record<string, boolean>;
}
export declare function createJiraIntegration(config: JiraConfig): JiraIntegration;
export declare function createSlackIntegration(config: SlackConfig): SlackIntegration;
export declare function createTestRailIntegration(config: TestRailConfig): TestRailIntegration;
export declare function createGitHubIntegration(config: GitHubConfig): GitHubIntegration;
export declare function createAzureDevOpsIntegration(config: AzureDevOpsConfig): AzureDevOpsIntegration;
export declare function createIntegrationManager(): IntegrationManager;
declare const _default: {
    JiraIntegration: typeof JiraIntegration;
    SlackIntegration: typeof SlackIntegration;
    TestRailIntegration: typeof TestRailIntegration;
    GitHubIntegration: typeof GitHubIntegration;
    AzureDevOpsIntegration: typeof AzureDevOpsIntegration;
    IntegrationManager: typeof IntegrationManager;
    createJiraIntegration: typeof createJiraIntegration;
    createSlackIntegration: typeof createSlackIntegration;
    createTestRailIntegration: typeof createTestRailIntegration;
    createGitHubIntegration: typeof createGitHubIntegration;
    createAzureDevOpsIntegration: typeof createAzureDevOpsIntegration;
    createIntegrationManager: typeof createIntegrationManager;
};
export default _default;
//# sourceMappingURL=ThirdPartyIntegrations.d.ts.map