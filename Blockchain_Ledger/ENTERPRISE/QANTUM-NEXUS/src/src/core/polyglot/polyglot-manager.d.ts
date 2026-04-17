/**
 * ═══════════════════════════════════════════════════════════════════════════
 * POLYGLOT INTEGRATION SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Multi-Language Integration for Maximum Performance & Stability:
 * - Rust: Performance-critical operations, memory safety
 * - Go: Concurrent processing, microservices
 * - C++: Legacy system integration, low-level operations
 * - Python: Data science, ML models
 *
 * Features:
 * - FFI (Foreign Function Interface) bridges
 * - Type-safe communication
 * - Error handling across language boundaries
 * - Performance monitoring
 * - Automatic fallback to TypeScript implementation
 */
/**
 * Supported languages for integration
 */
export declare enum SupportedLanguage {
    RUST = "rust",
    GO = "go",
    CPP = "cpp",
    PYTHON = "python",
    TYPESCRIPT = "typescript"
}
/**
 * Module metadata
 */
export interface PolyglotModuleMetadata {
    name: string;
    language: SupportedLanguage;
    path: string;
    version: string;
    capabilities: string[];
    fallback?: string;
}
/**
 * Communication protocol
 */
export interface PolyglotMessage {
    id: string;
    method: string;
    params: unknown[];
    timestamp: number;
}
export interface PolyglotResponse {
    id: string;
    result?: unknown;
    error?: {
        code: string;
        message: string;
    };
    timestamp: number;
    executionTime: number;
}
/**
 * Polyglot Module Manager
 *
 * Manages integration with modules written in different languages
 */
export declare class PolyglotModuleManager {
    private modules;
    private initialized;
    /**
     * Initialize the polyglot system
     */
    initialize(): Promise<void>;
    /**
     * Discover available polyglot modules
     */
    private discoverModules;
    private findManifests;
    /**
     * Load a polyglot module
     */
    private loadModule;
    /**
     * Call a method on a polyglot module
     */
    call<T = unknown>(moduleName: string, method: string, ...params: unknown[]): Promise<T>;
    /**
     * Call TypeScript fallback implementation
     */
    private callFallback;
    /**
     * Get module health status
     */
    getModuleHealth(moduleName: string): Promise<{
        healthy: boolean;
        language: string;
        version: string;
    }>;
    /**
     * Reload a module (hot-reload support)
     */
    reloadModule(moduleName: string): Promise<void>;
    /**
     * Shutdown all modules
     */
    shutdown(): Promise<void>;
}
export declare function getPolyglotManager(): PolyglotModuleManager;
//# sourceMappingURL=polyglot-manager.d.ts.map