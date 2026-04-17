/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: PLUGIN SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Extensible plugin architecture for Mind Engine
 * Plugin loading, lifecycle, hooks, and extensions
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface PluginMetadata {
    name: string;
    version: string;
    description?: string;
    author?: string;
    license?: string;
    dependencies?: Record<string, string>;
    engines?: Record<string, string>;
    main?: string;
    hooks?: string[];
}
export interface PluginContext {
    mind: MindEngineContext;
    config: Record<string, any>;
    logger: Logger;
    storage: PluginStorage;
}
export interface MindEngineContext {
    version: string;
    registerHook: (name: string, handler: HookHandler) => void;
    unregisterHook: (name: string, handler: HookHandler) => void;
    registerCommand: (command: PluginCommand) => void;
    registerReporter: (reporter: PluginReporter) => void;
    registerAdapter: (adapter: PluginAdapter) => void;
}
export interface Logger {
    debug: (message: string, ...args: any[]) => void;
    info: (message: string, ...args: any[]) => void;
    warn: (message: string, ...args: any[]) => void;
    error: (message: string, ...args: any[]) => void;
}
export interface PluginStorage {
    get: (key: string) => any;
    set: (key: string, value: any) => void;
    delete: (key: string) => void;
    clear: () => void;
}
export type HookHandler = (context: any) => Promise<any> | any;
export interface PluginCommand {
    name: string;
    description: string;
    execute: (args: string[], options: Record<string, any>) => Promise<void>;
}
export interface PluginReporter {
    name: string;
    onTestStart?: (test: any) => void;
    onTestEnd?: (test: any, result: any) => void;
    onSuiteStart?: (suite: any) => void;
    onSuiteEnd?: (suite: any, results: any) => void;
    generate?: (results: any) => Promise<void>;
}
export interface PluginAdapter {
    name: string;
    init: () => Promise<void>;
    dispose: () => Promise<void>;
    execute: (action: any) => Promise<any>;
}
export interface Plugin {
    metadata: PluginMetadata;
    activate: (context: PluginContext) => Promise<void> | void;
    deactivate?: () => Promise<void> | void;
}
export type PluginState = 'inactive' | 'activating' | 'active' | 'deactivating' | 'error';
interface LoadedPlugin {
    plugin: Plugin;
    state: PluginState;
    error?: Error;
    loadedAt: Date;
    activatedAt?: Date;
}
export declare class HookRegistry {
    private hooks;
    register(name: string, handler: HookHandler): void;
    unregister(name: string, handler: HookHandler): void;
    trigger(name: string, context: any): Promise<any[]>;
    triggerWaterfall(name: string, initialValue: any): Promise<any>;
    getHookNames(): string[];
}
export declare class PluginManager extends EventEmitter {
    private plugins;
    private hooks;
    private commands;
    private reporters;
    private adapters;
    private pluginPaths;
    private storageDir;
    constructor(options?: {
        pluginPaths?: string[];
        storageDir?: string;
    });
    /**
     * Load plugin from path
     */
    load(pluginPath: string): Promise<void>;
    /**
     * Activate plugin
     */
    activate(name: string): Promise<void>;
    /**
     * Deactivate plugin
     */
    deactivate(name: string): Promise<void>;
    /**
     * Unload plugin
     */
    unload(name: string): Promise<void>;
    /**
     * Discover and load plugins from paths
     */
    discover(): Promise<string[]>;
    /**
     * Get plugin info
     */
    get(name: string): LoadedPlugin | undefined;
    /**
     * List all plugins
     */
    list(): Array<{
        name: string;
        state: PluginState;
        version: string;
    }>;
    /**
     * Trigger hook
     */
    triggerHook(name: string, context: any): Promise<any[]>;
    /**
     * Get registered command
     */
    getCommand(name: string): PluginCommand | undefined;
    /**
     * Get all commands
     */
    getCommands(): PluginCommand[];
    /**
     * Get reporter
     */
    getReporter(name: string): PluginReporter | undefined;
    /**
     * Get adapter
     */
    getAdapter(name: string): PluginAdapter | undefined;
    private resolvePath;
    private loadMetadata;
    private loadModule;
    private checkDependencies;
    private createContext;
    private createLogger;
    private createStorage;
    private cleanupPlugin;
}
export declare const HOOKS: {
    readonly BEFORE_ALL: "mind:beforeAll";
    readonly AFTER_ALL: "mind:afterAll";
    readonly BEFORE_EACH: "mind:beforeEach";
    readonly AFTER_EACH: "mind:afterEach";
    readonly TEST_START: "mind:testStart";
    readonly TEST_END: "mind:testEnd";
    readonly TEST_RETRY: "mind:testRetry";
    readonly TEST_SKIP: "mind:testSkip";
    readonly BROWSER_LAUNCH: "mind:browserLaunch";
    readonly BROWSER_CLOSE: "mind:browserClose";
    readonly PAGE_CREATE: "mind:pageCreate";
    readonly PAGE_CLOSE: "mind:pageClose";
    readonly NAVIGATION_START: "mind:navigationStart";
    readonly NAVIGATION_END: "mind:navigationEnd";
    readonly BEFORE_ACTION: "mind:beforeAction";
    readonly AFTER_ACTION: "mind:afterAction";
    readonly ACTION_ERROR: "mind:actionError";
    readonly REPORT_GENERATE: "mind:reportGenerate";
    readonly CONFIG_TRANSFORM: "mind:configTransform";
    readonly SELECTOR_TRANSFORM: "mind:selectorTransform";
    readonly DATA_TRANSFORM: "mind:dataTransform";
};
export declare function createPlugin(metadata: Omit<PluginMetadata, 'main'>, handlers: {
    activate: (context: PluginContext) => Promise<void> | void;
    deactivate?: () => Promise<void> | void;
}): Plugin;
declare const _default: {
    PluginManager: typeof PluginManager;
    HookRegistry: typeof HookRegistry;
    HOOKS: {
        readonly BEFORE_ALL: "mind:beforeAll";
        readonly AFTER_ALL: "mind:afterAll";
        readonly BEFORE_EACH: "mind:beforeEach";
        readonly AFTER_EACH: "mind:afterEach";
        readonly TEST_START: "mind:testStart";
        readonly TEST_END: "mind:testEnd";
        readonly TEST_RETRY: "mind:testRetry";
        readonly TEST_SKIP: "mind:testSkip";
        readonly BROWSER_LAUNCH: "mind:browserLaunch";
        readonly BROWSER_CLOSE: "mind:browserClose";
        readonly PAGE_CREATE: "mind:pageCreate";
        readonly PAGE_CLOSE: "mind:pageClose";
        readonly NAVIGATION_START: "mind:navigationStart";
        readonly NAVIGATION_END: "mind:navigationEnd";
        readonly BEFORE_ACTION: "mind:beforeAction";
        readonly AFTER_ACTION: "mind:afterAction";
        readonly ACTION_ERROR: "mind:actionError";
        readonly REPORT_GENERATE: "mind:reportGenerate";
        readonly CONFIG_TRANSFORM: "mind:configTransform";
        readonly SELECTOR_TRANSFORM: "mind:selectorTransform";
        readonly DATA_TRANSFORM: "mind:dataTransform";
    };
    createPlugin: typeof createPlugin;
};
export default _default;
//# sourceMappingURL=PluginSystem.d.ts.map