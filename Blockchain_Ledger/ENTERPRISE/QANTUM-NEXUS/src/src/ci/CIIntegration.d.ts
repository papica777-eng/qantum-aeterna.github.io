/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: CI/CD INTEGRATION
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * CI provider integrations, config generators, pipeline helpers
 * GitHub Actions, GitLab CI, Jenkins, Azure DevOps support
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export type CIProvider = 'github' | 'gitlab' | 'jenkins' | 'azure' | 'circleci' | 'bitbucket';
export interface CIConfig {
    provider: CIProvider;
    projectName: string;
    nodeVersion: string;
    browsers: Array<'chromium' | 'firefox' | 'webkit'>;
    parallel: number;
    retries: number;
    testCommand: string;
    artifactPaths: string[];
    environment?: Record<string, string>;
    secrets?: string[];
    triggers?: {
        push?: boolean;
        pullRequest?: boolean;
        schedule?: string;
        manual?: boolean;
    };
    cache?: {
        enabled: boolean;
        paths: string[];
    };
    notifications?: {
        slack?: string;
        email?: string[];
    };
}
export interface PipelineStep {
    name: string;
    command: string;
    condition?: string;
    timeout?: number;
    continueOnError?: boolean;
    env?: Record<string, string>;
}
export declare class CIDetector {
    /**
     * Detect current CI environment
     */
    static detect(): {
        isCI: boolean;
        provider?: CIProvider;
        buildId?: string;
        branch?: string;
        commit?: string;
        prNumber?: string;
        actor?: string;
    };
    private static extractPRNumber;
}
export declare class GitHubActionsGenerator {
    static generate(config: CIConfig): string;
}
export declare class GitLabCIGenerator {
    static generate(config: CIConfig): string;
}
export declare class JenkinsfileGenerator {
    static generate(config: CIConfig): string;
}
export declare class AzurePipelinesGenerator {
    static generate(config: CIConfig): string;
}
export declare class CIConfigManager extends EventEmitter {
    private config;
    constructor(config?: Partial<CIConfig>);
    /**
     * Generate CI config
     */
    generate(provider?: CIProvider): string;
    /**
     * Write config file
     */
    write(outputPath?: string): string;
    /**
     * Get default output path
     */
    private getDefaultPath;
    /**
     * Update config
     */
    updateConfig(updates: Partial<CIConfig>): void;
    /**
     * Get current config
     */
    getConfig(): CIConfig;
}
export declare class CIReporter extends EventEmitter {
    private ci;
    /**
     * Report test start
     */
    testStart(testName: string): void;
    /**
     * Report test end
     */
    testEnd(testName: string, passed: boolean, duration: number): void;
    /**
     * Report warning
     */
    warning(message: string, file?: string, line?: number): void;
    /**
     * Report error
     */
    error(message: string, file?: string, line?: number): void;
    /**
     * Set output variable
     */
    setOutput(name: string, value: string): void;
    /**
     * Add summary
     */
    addSummary(markdown: string): void;
    /**
     * Create annotation
     */
    annotate(type: 'error' | 'warning' | 'notice', message: string, options?: {
        file?: string;
        line?: number;
        endLine?: number;
        title?: string;
    }): void;
    /**
     * Get CI info
     */
    getInfo(): ReturnType<typeof CIDetector.detect>;
}
declare const _default: {
    CIDetector: typeof CIDetector;
    CIConfigManager: typeof CIConfigManager;
    CIReporter: typeof CIReporter;
    GitHubActionsGenerator: typeof GitHubActionsGenerator;
    GitLabCIGenerator: typeof GitLabCIGenerator;
    JenkinsfileGenerator: typeof JenkinsfileGenerator;
    AzurePipelinesGenerator: typeof AzurePipelinesGenerator;
};
export default _default;
//# sourceMappingURL=CIIntegration.d.ts.map