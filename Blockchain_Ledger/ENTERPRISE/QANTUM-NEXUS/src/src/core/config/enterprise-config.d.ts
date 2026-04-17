/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ENTERPRISE CONFIGURATION MANAGEMENT
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * God Mode Configuration with:
 * - Environment-based configuration
 * - Schema validation on startup
 * - Type-safe configuration access
 * - Hot-reload capability
 * - Configuration change auditing
 * - Secret management integration
 * - Configuration versioning
 */
/**
 * Configuration schema definition
 */
export interface ConfigSchema {
    [key: string]: {
        type: 'string' | 'number' | 'boolean' | 'object' | 'array';
        required: boolean;
        default?: unknown;
        validator?: (value: unknown) => boolean;
        secret?: boolean;
        description?: string;
    };
}
/**
 * Enterprise Configuration Manager
 */
export declare class EnterpriseConfigManager {
    private config;
    private schema;
    private watchers;
    private configPath?;
    private hotReload;
    private fileWatcher?;
    constructor(schema: ConfigSchema, options?: {
        configPath?: string;
        hotReload?: boolean;
    });
    /**
     * Initialize configuration
     */
    initialize(): Promise<void>;
    /**
     * Load configuration from environment variables
     */
    private loadFromEnvironment;
    /**
     * Load configuration from file
     */
    private loadFromFile;
    /**
     * Validate configuration against schema
     */
    private validate;
    /**
     * Get configuration value
     */
    get<T = unknown>(key: string, defaultValue?: T): T;
    /**
     * Set configuration value
     */
    set(key: string, value: unknown): void;
    /**
     * Check if configuration key exists
     */
    has(key: string): boolean;
    /**
     * Get all configuration keys
     */
    keys(): string[];
    /**
     * Watch for configuration changes
     */
    watch(callback: (key: string, value: unknown) => void): () => void;
    /**
     * Set up hot reload for configuration file
     */
    private setupHotReload;
    /**
     * Notify watchers of configuration changes
     */
    private notifyWatchers;
    /**
     * Parse value from string to appropriate type
     */
    private parseValue;
    /**
     * Validate value type
     */
    private validateType;
    /**
     * Convert config key to environment variable format
     */
    private toEnvKey;
    /**
     * Export configuration (excluding secrets)
     */
    exportConfig(): Record<string, unknown>;
    /**
     * Shutdown and cleanup
     */
    shutdown(): void;
}
/**
 * Default QAntum configuration schema
 */
export declare const QAntumConfigSchema: ConfigSchema;
export declare function createConfigManager(schema?: ConfigSchema, options?: {
    configPath?: string;
    hotReload?: boolean;
}): EnterpriseConfigManager;
export declare function getConfigManager(): EnterpriseConfigManager;
//# sourceMappingURL=enterprise-config.d.ts.map