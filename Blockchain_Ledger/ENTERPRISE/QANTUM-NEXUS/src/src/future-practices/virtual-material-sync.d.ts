/**
 * ☁️ VIRTUAL MATERIAL SYNC ENGINE
 *
 * Advanced Practice #4: Auto-update Docker/AWS/GCP templates with Singularity Core.
 *
 * This module synchronizes infrastructure templates across all cloud providers,
 * ensuring consistent deployments and automatic propagation of core updates.
 *
 * Features:
 * - Multi-cloud template management
 * - Automatic version synchronization
 * - Infrastructure as Code generation
 * - Deployment validation
 * - Rollback capabilities
 *
 * @version 1.0.0
 * @phase Future Practices - Beyond Phase 100
 * @author QANTUM AI Architect
 */
import { EventEmitter } from 'events';
interface CloudTemplate {
    templateId: string;
    provider: 'aws' | 'azure' | 'gcp' | 'docker' | 'kubernetes';
    name: string;
    version: string;
    content: string;
    hash: string;
    lastUpdated: number;
    dependencies: string[];
    variables: Record<string, TemplateVariable>;
}
interface TemplateVariable {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
    default?: any;
    required: boolean;
    description: string;
}
interface SyncResult {
    templateId: string;
    provider: string;
    status: 'updated' | 'created' | 'unchanged' | 'failed';
    oldVersion?: string;
    newVersion: string;
    changes: string[];
    errors: string[];
    timestamp: number;
}
interface DeploymentConfig {
    environment: 'development' | 'staging' | 'production';
    region: string;
    variables: Record<string, any>;
    dryRun: boolean;
}
interface VirtualMaterialConfig {
    outputDir: string;
    providers: ('aws' | 'azure' | 'gcp' | 'docker' | 'kubernetes')[];
    autoSync: boolean;
    validateOnSync: boolean;
    backupBeforeUpdate: boolean;
}
export declare class VirtualMaterialSyncEngine extends EventEmitter {
    private config;
    private templates;
    private syncHistory;
    private singularityCore;
    private static readonly TEMPLATE_GENERATORS;
    constructor(config?: Partial<VirtualMaterialConfig>);
    /**
     * 🚀 Initialize sync engine
     */
    initialize(): Promise<void>;
    /**
     * 📦 Load Singularity Core configuration
     */
    private loadSingularityCore;
    /**
     * 🔄 Sync all templates
     */
    syncAllTemplates(vars?: Record<string, any>): Promise<SyncResult[]>;
    /**
     * Sync templates for specific provider
     */
    private syncProviderTemplates;
    /**
     * Get template types for provider
     */
    private getTemplateTypesForProvider;
    /**
     * Generate and save template
     */
    private generateAndSaveTemplate;
    /**
     * Get generator function
     */
    private getGenerator;
    /**
     * Get template file path
     */
    private getTemplateFilePath;
    /**
     * Validate template
     */
    private validateTemplate;
    /**
     * Detect changes between templates
     */
    private detectChanges;
    /**
     * Get default variables
     */
    private getDefaultVariables;
    /**
     * 🐳 Generate Dockerfile
     */
    private static generateDockerTemplate;
    /**
     * 🐙 Generate Docker Compose
     */
    private static generateDockerComposeTemplate;
    /**
     * ☁️ Generate AWS CloudFormation Template
     */
    private static generateAWSTemplate;
    /**
     * Generate AWS Lambda Template
     */
    private static generateAWSLambdaTemplate;
    private static generateECSTemplate;
    private static generateECRTemplate;
    /**
     * ☁️ Generate Azure ARM Template
     */
    private static generateAzureTemplate;
    private static generateAzureFunctionsTemplate;
    private static generateAzureContainerAppsTemplate;
    /**
     * ☁️ Generate GCP Cloud Run Template
     */
    private static generateGCPTemplate;
    private static generateGCPFunctionsTemplate;
    private static generateGKETemplate;
    /**
     * ☸️ Generate Kubernetes Deployment Template
     */
    private static generateKubernetesTemplate;
    private static generateK8sServiceTemplate;
    private static generateK8sConfigMapTemplate;
    private static generateK8sIngressTemplate;
    private static generateK8sHPATemplate;
    /**
     * 📊 Get sync statistics
     */
    getStats(): {
        totalTemplates: number;
        lastSync: number;
        providers: Record<string, number>;
        successRate: number;
    };
}
export declare function createVirtualMaterialSync(config?: Partial<VirtualMaterialConfig>): VirtualMaterialSyncEngine;
export type { CloudTemplate, SyncResult, DeploymentConfig, VirtualMaterialConfig };
//# sourceMappingURL=virtual-material-sync.d.ts.map