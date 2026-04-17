/**
 * 🚀 AUTO DEPLOY PIPELINE - Commercial Deployment System
 *
 * Automated pipeline for preparing QANTUM for commercial distribution:
 * - Docker containerization with obfuscation
 * - Multi-platform builds (Linux, Windows, macOS)
 * - Automatic versioning and changelog
 * - License embedding
 * - Cloud deployment automation
 *
 * "From code to cash in one click"
 *
 * @version 1.0.0
 * @phase 96-100 - The Singularity
 */
import { EventEmitter } from 'events';
interface DeployConfig {
    version: string;
    productName: string;
    dockerRegistry: string;
    platforms: Platform[];
    obfuscationLevel: 'none' | 'light' | 'standard' | 'paranoid';
    includeLicenseValidator: boolean;
    outputDir: string;
    envFile: string;
}
type Platform = 'linux-amd64' | 'linux-arm64' | 'windows-amd64' | 'darwin-amd64' | 'darwin-arm64';
interface BuildArtifact {
    id: string;
    platform: Platform;
    path: string;
    size: number;
    checksum: string;
    createdAt: number;
    dockerImage?: string;
}
interface DeploymentTarget {
    id: string;
    name: string;
    type: 'docker-registry' | 'aws-ecr' | 'azure-acr' | 'gcp-gcr' | 's3' | 'npm';
    config: Record<string, string>;
}
interface ReleaseManifest {
    version: string;
    releaseDate: string;
    artifacts: BuildArtifact[];
    changelog: string[];
    checksum: string;
    signature?: string;
}
export declare class AutoDeployPipeline extends EventEmitter {
    private config;
    private artifacts;
    private deploymentTargets;
    constructor(config?: Partial<DeployConfig>);
    /**
     * 🚀 Run full deployment pipeline
     */
    deploy(): Promise<ReleaseManifest>;
    /**
     * Step 1: Prepare build environment
     */
    private prepareBuildEnvironment;
    /**
     * Step 2: Run tests
     */
    private runTests;
    /**
     * Step 3: Build for all platforms
     */
    private buildAllPlatforms;
    /**
     * Build for specific platform
     */
    private buildForPlatform;
    /**
     * Step 4: Obfuscate code
     */
    private obfuscateCode;
    /**
     * Step 5: Build Docker images
     */
    private buildDockerImages;
    /**
     * Generate Dockerfile
     */
    private generateDockerfile;
    /**
     * Generate docker-compose.yml
     */
    private generateDockerCompose;
    /**
     * Step 6: Sign artifacts
     */
    private signArtifacts;
    /**
     * Step 7: Generate release manifest
     */
    private generateManifest;
    /**
     * Generate changelog
     */
    private generateChangelog;
    /**
     * Step 8: Deploy to targets
     */
    private deployToTargets;
    /**
     * Add deployment target
     */
    addTarget(target: DeploymentTarget): void;
    private calculateChecksum;
    private calculateManifestChecksum;
    private formatSize;
    private sleep;
}
export declare function createDeployPipeline(config?: Partial<DeployConfig>): AutoDeployPipeline;
export type { BuildArtifact, DeploymentTarget, ReleaseManifest };
//# sourceMappingURL=auto-deploy-pipeline.d.ts.map