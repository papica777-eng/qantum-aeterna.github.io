/**
 * 🔔 QANTUM - Slack & Discord Webhooks Integration
 *
 * Features:
 * - Live test failure alerts with video links
 * - Success celebration messages
 * - Daily summary reports
 * - Self-healing notifications
 *
 * @version 1.0.0
 */
interface WebhookConfig {
    slackWebhookUrl?: string;
    discordWebhookUrl?: string;
    teamsWebhookUrl?: string;
    enabled: boolean;
}
interface TestResult {
    name: string;
    status: 'passed' | 'failed' | 'skipped' | 'healed';
    duration: number;
    error?: string;
    screenshot?: string;
    video?: string;
    healingInfo?: {
        oldSelector: string;
        newSelector: string;
        strategy: string;
        confidence: number;
    };
}
interface RunSummary {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    healed: number;
    passRate: number;
    duration: number;
    reportUrl?: string;
}
export declare class WebhookNotifier {
    private config;
    constructor(config: WebhookConfig);
    /**
     * Send test failure alert to Slack
     */
    sendSlackFailureAlert(test: TestResult): Promise<void>;
    /**
     * Send self-healing notification to Slack
     */
    sendSlackHealingAlert(test: TestResult): Promise<void>;
    /**
     * Send success celebration to Slack
     */
    sendSlackSuccessCelebration(summary: RunSummary): Promise<void>;
    /**
     * Send daily summary to Slack
     */
    sendSlackDailySummary(summary: RunSummary): Promise<void>;
    /**
     * Send test failure alert to Discord
     */
    sendDiscordFailureAlert(test: TestResult): Promise<void>;
    /**
     * Send success celebration to Discord
     */
    sendDiscordSuccessCelebration(summary: RunSummary): Promise<void>;
    /**
     * Send daily summary to Discord
     */
    sendDiscordDailySummary(summary: RunSummary): Promise<void>;
    private sendWebhook;
}
export declare function createWebhookNotifier(config: WebhookConfig): WebhookNotifier;
export {};
//# sourceMappingURL=webhooks.d.ts.map