"use strict";
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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HOOKS = exports.PluginManager = exports.HookRegistry = void 0;
exports.createPlugin = createPlugin;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const events_1 = require("events");
// ═══════════════════════════════════════════════════════════════════════════════
// PLUGIN HOOK SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════
class HookRegistry {
    hooks = new Map();
    register(name, handler) {
        if (!this.hooks.has(name)) {
            this.hooks.set(name, new Set());
        }
        this.hooks.get(name).add(handler);
    }
    unregister(name, handler) {
        this.hooks.get(name)?.delete(handler);
    }
    async trigger(name, context) {
        const handlers = this.hooks.get(name);
        if (!handlers || handlers.size === 0) {
            return [];
        }
        const results = [];
        for (const handler of handlers) {
            try {
                const result = await handler(context);
                results.push(result);
            }
            catch (error) {
                console.error(`Hook ${name} error:`, error);
            }
        }
        return results;
    }
    async triggerWaterfall(name, initialValue) {
        const handlers = this.hooks.get(name);
        if (!handlers || handlers.size === 0) {
            return initialValue;
        }
        let value = initialValue;
        for (const handler of handlers) {
            try {
                value = await handler(value);
            }
            catch (error) {
                console.error(`Hook ${name} error:`, error);
            }
        }
        return value;
    }
    getHookNames() {
        return Array.from(this.hooks.keys());
    }
}
exports.HookRegistry = HookRegistry;
// ═══════════════════════════════════════════════════════════════════════════════
// PLUGIN MANAGER
// ═══════════════════════════════════════════════════════════════════════════════
class PluginManager extends events_1.EventEmitter {
    plugins = new Map();
    hooks = new HookRegistry();
    commands = new Map();
    reporters = new Map();
    adapters = new Map();
    pluginPaths = [];
    storageDir;
    constructor(options = {}) {
        super();
        this.pluginPaths = options.pluginPaths || ['./plugins', './node_modules'];
        this.storageDir = options.storageDir || './.mind-plugins';
    }
    /**
     * Load plugin from path
     */
    async load(pluginPath) {
        try {
            const resolvedPath = this.resolvePath(pluginPath);
            // Load package.json or plugin module
            const metadata = await this.loadMetadata(resolvedPath);
            const plugin = await this.loadModule(resolvedPath, metadata);
            this.plugins.set(metadata.name, {
                plugin,
                state: 'inactive',
                loadedAt: new Date()
            });
            this.emit('loaded', metadata.name);
        }
        catch (error) {
            throw new Error(`Failed to load plugin ${pluginPath}: ${error.message}`);
        }
    }
    /**
     * Activate plugin
     */
    async activate(name) {
        const loaded = this.plugins.get(name);
        if (!loaded) {
            throw new Error(`Plugin not found: ${name}`);
        }
        if (loaded.state === 'active') {
            return;
        }
        loaded.state = 'activating';
        try {
            // Check dependencies
            await this.checkDependencies(loaded.plugin.metadata);
            // Create context
            const context = this.createContext(loaded.plugin.metadata);
            // Activate
            await loaded.plugin.activate(context);
            loaded.state = 'active';
            loaded.activatedAt = new Date();
            this.emit('activated', name);
        }
        catch (error) {
            loaded.state = 'error';
            loaded.error = error;
            throw error;
        }
    }
    /**
     * Deactivate plugin
     */
    async deactivate(name) {
        const loaded = this.plugins.get(name);
        if (!loaded || loaded.state !== 'active') {
            return;
        }
        loaded.state = 'deactivating';
        try {
            if (loaded.plugin.deactivate) {
                await loaded.plugin.deactivate();
            }
            // Cleanup hooks registered by plugin
            this.cleanupPlugin(name);
            loaded.state = 'inactive';
            this.emit('deactivated', name);
        }
        catch (error) {
            loaded.state = 'error';
            loaded.error = error;
            throw error;
        }
    }
    /**
     * Unload plugin
     */
    async unload(name) {
        await this.deactivate(name);
        this.plugins.delete(name);
        this.emit('unloaded', name);
    }
    /**
     * Discover and load plugins from paths
     */
    async discover() {
        const discovered = [];
        for (const basePath of this.pluginPaths) {
            if (!fs.existsSync(basePath))
                continue;
            const entries = fs.readdirSync(basePath, { withFileTypes: true });
            for (const entry of entries) {
                if (!entry.isDirectory())
                    continue;
                const pluginDir = path.join(basePath, entry.name);
                const packagePath = path.join(pluginDir, 'package.json');
                if (fs.existsSync(packagePath)) {
                    try {
                        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
                        if (pkg.mindEngine || pkg.keywords?.includes('mind-engine-plugin')) {
                            await this.load(pluginDir);
                            discovered.push(pkg.name);
                        }
                    }
                    catch {
                        // Skip invalid packages
                    }
                }
            }
        }
        return discovered;
    }
    /**
     * Get plugin info
     */
    get(name) {
        return this.plugins.get(name);
    }
    /**
     * List all plugins
     */
    list() {
        return Array.from(this.plugins.entries()).map(([name, loaded]) => ({
            name,
            state: loaded.state,
            version: loaded.plugin.metadata.version
        }));
    }
    /**
     * Trigger hook
     */
    async triggerHook(name, context) {
        return this.hooks.trigger(name, context);
    }
    /**
     * Get registered command
     */
    getCommand(name) {
        return this.commands.get(name);
    }
    /**
     * Get all commands
     */
    getCommands() {
        return Array.from(this.commands.values());
    }
    /**
     * Get reporter
     */
    getReporter(name) {
        return this.reporters.get(name);
    }
    /**
     * Get adapter
     */
    getAdapter(name) {
        return this.adapters.get(name);
    }
    resolvePath(pluginPath) {
        if (path.isAbsolute(pluginPath)) {
            return pluginPath;
        }
        // Check in plugin paths
        for (const basePath of this.pluginPaths) {
            const full = path.join(basePath, pluginPath);
            if (fs.existsSync(full)) {
                return full;
            }
        }
        // Try require.resolve
        return require.resolve(pluginPath);
    }
    async loadMetadata(pluginPath) {
        const packagePath = path.join(pluginPath, 'package.json');
        if (fs.existsSync(packagePath)) {
            const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
            return {
                name: pkg.name,
                version: pkg.version,
                description: pkg.description,
                author: pkg.author,
                license: pkg.license,
                dependencies: pkg.dependencies,
                main: pkg.main || 'index.js',
                hooks: pkg.mindEngine?.hooks
            };
        }
        // Fallback for single-file plugins
        return {
            name: path.basename(pluginPath, '.js'),
            version: '1.0.0',
            main: path.basename(pluginPath)
        };
    }
    async loadModule(pluginPath, metadata) {
        const mainPath = path.join(pluginPath, metadata.main || 'index.js');
        const module = require(mainPath);
        const plugin = module.default || module;
        if (typeof plugin.activate !== 'function') {
            throw new Error('Plugin must export activate function');
        }
        return {
            metadata,
            activate: plugin.activate,
            deactivate: plugin.deactivate
        };
    }
    async checkDependencies(metadata) {
        if (!metadata.dependencies)
            return;
        for (const [dep, version] of Object.entries(metadata.dependencies)) {
            // Check if dependency plugin is loaded
            if (dep.startsWith('mind-plugin-')) {
                const loaded = this.plugins.get(dep);
                if (!loaded || loaded.state !== 'active') {
                    // Try to auto-load and activate
                    await this.load(dep);
                    await this.activate(dep);
                }
            }
        }
    }
    createContext(metadata) {
        const pluginStorage = this.createStorage(metadata.name);
        return {
            mind: {
                version: '1.0.0',
                registerHook: (name, handler) => {
                    this.hooks.register(name, handler);
                },
                unregisterHook: (name, handler) => {
                    this.hooks.unregister(name, handler);
                },
                registerCommand: (command) => {
                    this.commands.set(command.name, command);
                },
                registerReporter: (reporter) => {
                    this.reporters.set(reporter.name, reporter);
                },
                registerAdapter: (adapter) => {
                    this.adapters.set(adapter.name, adapter);
                }
            },
            config: {},
            logger: this.createLogger(metadata.name),
            storage: pluginStorage
        };
    }
    createLogger(name) {
        const prefix = `[${name}]`;
        return {
            debug: (msg, ...args) => console.debug(prefix, msg, ...args),
            info: (msg, ...args) => console.info(prefix, msg, ...args),
            warn: (msg, ...args) => console.warn(prefix, msg, ...args),
            error: (msg, ...args) => console.error(prefix, msg, ...args)
        };
    }
    createStorage(name) {
        const storePath = path.join(this.storageDir, `${name}.json`);
        let data = {};
        // Load existing
        if (fs.existsSync(storePath)) {
            try {
                data = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
            }
            catch { }
        }
        const save = () => {
            if (!fs.existsSync(this.storageDir)) {
                fs.mkdirSync(this.storageDir, { recursive: true });
            }
            fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
        };
        return {
            get: (key) => data[key],
            set: (key, value) => {
                data[key] = value;
                save();
            },
            delete: (key) => {
                delete data[key];
                save();
            },
            clear: () => {
                data = {};
                save();
            }
        };
    }
    cleanupPlugin(name) {
        // Would cleanup hooks, commands, reporters, adapters registered by plugin
        // In real implementation, we'd track what each plugin registered
    }
}
exports.PluginManager = PluginManager;
// ═══════════════════════════════════════════════════════════════════════════════
// BUILT-IN HOOKS
// ═══════════════════════════════════════════════════════════════════════════════
exports.HOOKS = {
    // Lifecycle hooks
    BEFORE_ALL: 'mind:beforeAll',
    AFTER_ALL: 'mind:afterAll',
    BEFORE_EACH: 'mind:beforeEach',
    AFTER_EACH: 'mind:afterEach',
    // Test hooks
    TEST_START: 'mind:testStart',
    TEST_END: 'mind:testEnd',
    TEST_RETRY: 'mind:testRetry',
    TEST_SKIP: 'mind:testSkip',
    // Browser hooks
    BROWSER_LAUNCH: 'mind:browserLaunch',
    BROWSER_CLOSE: 'mind:browserClose',
    PAGE_CREATE: 'mind:pageCreate',
    PAGE_CLOSE: 'mind:pageClose',
    // Navigation hooks
    NAVIGATION_START: 'mind:navigationStart',
    NAVIGATION_END: 'mind:navigationEnd',
    // Action hooks
    BEFORE_ACTION: 'mind:beforeAction',
    AFTER_ACTION: 'mind:afterAction',
    ACTION_ERROR: 'mind:actionError',
    // Report hooks
    REPORT_GENERATE: 'mind:reportGenerate',
    // Transform hooks
    CONFIG_TRANSFORM: 'mind:configTransform',
    SELECTOR_TRANSFORM: 'mind:selectorTransform',
    DATA_TRANSFORM: 'mind:dataTransform'
};
// ═══════════════════════════════════════════════════════════════════════════════
// PLUGIN TEMPLATE
// ═══════════════════════════════════════════════════════════════════════════════
function createPlugin(metadata, handlers) {
    return {
        metadata: { ...metadata, main: 'index.js' },
        activate: handlers.activate,
        deactivate: handlers.deactivate
    };
}
// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════
exports.default = {
    PluginManager,
    HookRegistry,
    HOOKS: exports.HOOKS,
    createPlugin
};
//# sourceMappingURL=PluginSystem.js.map