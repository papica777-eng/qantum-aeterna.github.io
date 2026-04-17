"use strict";
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: BROWSER ORCHESTRATOR
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Multi-browser orchestration, parallel execution, browser pool
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrowserMatrix = exports.BrowserOrchestrator = exports.BrowserPool = void 0;
exports.createOrchestrator = createOrchestrator;
exports.createPool = createPool;
const events_1 = require("events");
// ═══════════════════════════════════════════════════════════════════════════════
// BROWSER POOL
// ═══════════════════════════════════════════════════════════════════════════════
class BrowserPool extends events_1.EventEmitter {
    instances = new Map();
    queue = [];
    config;
    cleanupTimer;
    idCounter = 0;
    constructor(config) {
        super();
        this.config = {
            maxTotal: 10,
            idleTimeout: 60000,
            acquireTimeout: 30000,
            ...config
        };
    }
    /**
     * Initialize pool with browsers
     */
    async initialize() {
        for (const browserConfig of this.config.browsers) {
            for (let i = 0; i < browserConfig.count; i++) {
                await this.createInstance(browserConfig.type, browserConfig.config);
            }
        }
        // Start cleanup timer
        this.cleanupTimer = setInterval(() => {
            this.cleanupIdleInstances();
        }, this.config.idleTimeout / 2);
        this.emit('initialized', this.getStats());
    }
    /**
     * Acquire browser instance
     */
    async acquire(type) {
        // Find available instance
        for (const [_, instance] of this.instances) {
            if (instance.type === type && !instance.inUse) {
                instance.inUse = true;
                instance.lastUsed = new Date();
                this.emit('acquired', instance.id);
                return instance;
            }
        }
        // Check if we can create new
        if (this.instances.size < this.config.maxTotal) {
            const instance = await this.createInstance(type);
            instance.inUse = true;
            return instance;
        }
        // Wait in queue
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                const idx = this.queue.findIndex(q => q.resolve === resolve);
                if (idx !== -1) {
                    this.queue.splice(idx, 1);
                }
                reject(new Error(`Acquire timeout for browser: ${type}`));
            }, this.config.acquireTimeout);
            this.queue.push({
                type,
                resolve: (instance) => {
                    clearTimeout(timeout);
                    resolve(instance);
                },
                reject
            });
        });
    }
    /**
     * Release browser instance
     */
    release(id) {
        const instance = this.instances.get(id);
        if (!instance)
            return;
        instance.inUse = false;
        instance.lastUsed = new Date();
        // Check if someone is waiting
        const waitingIdx = this.queue.findIndex(q => q.type === instance.type);
        if (waitingIdx !== -1) {
            const waiting = this.queue.splice(waitingIdx, 1)[0];
            instance.inUse = true;
            waiting.resolve(instance);
        }
        this.emit('released', id);
    }
    /**
     * Destroy browser instance
     */
    async destroy(id) {
        const instance = this.instances.get(id);
        if (!instance)
            return;
        try {
            await instance.browser?.close?.();
        }
        catch { }
        this.instances.delete(id);
        this.emit('destroyed', id);
    }
    /**
     * Shutdown pool
     */
    async shutdown() {
        if (this.cleanupTimer) {
            clearInterval(this.cleanupTimer);
        }
        const destroyPromises = [];
        for (const [id] of this.instances) {
            destroyPromises.push(this.destroy(id));
        }
        await Promise.all(destroyPromises);
        this.emit('shutdown');
    }
    /**
     * Get pool statistics
     */
    getStats() {
        const byType = {};
        let inUse = 0;
        for (const instance of this.instances.values()) {
            if (!byType[instance.type]) {
                byType[instance.type] = { total: 0, available: 0 };
            }
            byType[instance.type].total++;
            if (instance.inUse) {
                inUse++;
            }
            else {
                byType[instance.type].available++;
            }
        }
        return {
            total: this.instances.size,
            available: this.instances.size - inUse,
            inUse,
            byType: byType
        };
    }
    async createInstance(type, config) {
        const id = `${type}-${++this.idCounter}`;
        // In real implementation, launch actual browser
        const browser = {
            id,
            type,
            close: async () => { }
        };
        const instance = {
            id,
            type,
            browser,
            createdAt: new Date(),
            lastUsed: new Date(),
            inUse: false,
            pagesCount: 0
        };
        this.instances.set(id, instance);
        this.emit('created', id);
        return instance;
    }
    cleanupIdleInstances() {
        const now = Date.now();
        const minInstances = this.config.browsers.reduce((sum, b) => sum + b.count, 0);
        for (const [id, instance] of this.instances) {
            if (!instance.inUse &&
                this.instances.size > minInstances &&
                now - instance.lastUsed.getTime() > this.config.idleTimeout) {
                this.destroy(id);
            }
        }
    }
}
exports.BrowserPool = BrowserPool;
// ═══════════════════════════════════════════════════════════════════════════════
// BROWSER ORCHESTRATOR
// ═══════════════════════════════════════════════════════════════════════════════
class BrowserOrchestrator extends events_1.EventEmitter {
    pool;
    config;
    activeTasks = new Map();
    taskQueue = [];
    running = false;
    taskCounter = 0;
    constructor(config = {}) {
        super();
        this.config = {
            maxConcurrency: 4,
            defaultBrowser: 'chromium',
            retries: 2,
            ...config
        };
    }
    /**
     * Initialize orchestrator
     */
    async initialize() {
        if (this.config.pool) {
            this.pool = new BrowserPool(this.config.pool);
            await this.pool.initialize();
        }
        this.running = true;
        this.processQueue();
        this.emit('initialized');
    }
    /**
     * Execute task on browser
     */
    async execute(handler, options = {}) {
        const task = {
            id: `task-${++this.taskCounter}`,
            browser: options.browser || this.config.defaultBrowser,
            handler,
            timeout: options.timeout || 30000,
            retries: this.config.retries,
            resolve: () => { },
            reject: () => { }
        };
        return new Promise((resolve, reject) => {
            task.resolve = resolve;
            task.reject = reject;
            this.taskQueue.push(task);
            this.processQueue();
        });
    }
    /**
     * Execute tasks in parallel
     */
    async parallel(tasks) {
        return Promise.all(tasks.map(task => this.execute(task.handler, { browser: task.browser })));
    }
    /**
     * Execute task on all browsers
     */
    async onAllBrowsers(handler, browsers = ['chromium', 'firefox', 'webkit']) {
        const results = new Map();
        await Promise.all(browsers.map(async (type) => {
            const result = await this.execute((browser, page) => handler(browser, page, type), { browser: type });
            results.set(type, result);
        }));
        return results;
    }
    /**
     * Shutdown orchestrator
     */
    async shutdown() {
        this.running = false;
        // Wait for active tasks
        while (this.activeTasks.size > 0) {
            await new Promise(r => setTimeout(r, 100));
        }
        if (this.pool) {
            await this.pool.shutdown();
        }
        this.emit('shutdown');
    }
    async processQueue() {
        while (this.running &&
            this.taskQueue.length > 0 &&
            this.activeTasks.size < this.config.maxConcurrency) {
            const task = this.taskQueue.shift();
            this.activeTasks.set(task.id, task);
            this.runTask(task);
        }
    }
    async runTask(task) {
        let lastError;
        let retries = task.retries;
        while (retries >= 0) {
            try {
                // Get browser from pool
                const instance = this.pool
                    ? await this.pool.acquire(task.browser)
                    : { browser: {}, id: 'temp' };
                try {
                    // Execute with timeout
                    const result = await Promise.race([
                        task.handler(instance.browser, {}),
                        new Promise((_, reject) => setTimeout(() => reject(new Error('Task timeout')), task.timeout))
                    ]);
                    task.resolve(result);
                    this.emit('taskComplete', { id: task.id, success: true });
                }
                finally {
                    if (this.pool) {
                        this.pool.release(instance.id);
                    }
                }
                break;
            }
            catch (error) {
                lastError = error;
                retries--;
                if (retries >= 0) {
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        }
        if (lastError && retries < 0) {
            task.reject(lastError);
            this.emit('taskComplete', { id: task.id, success: false, error: lastError.message });
        }
        this.activeTasks.delete(task.id);
        this.processQueue();
    }
}
exports.BrowserOrchestrator = BrowserOrchestrator;
// ═══════════════════════════════════════════════════════════════════════════════
// BROWSER MATRIX
// ═══════════════════════════════════════════════════════════════════════════════
class BrowserMatrix {
    orchestrator;
    constructor(orchestrator) {
        this.orchestrator = orchestrator;
    }
    /**
     * Run test across browser matrix
     */
    async run(test, matrix) {
        const combinations = this.generateCombinations(matrix);
        const results = {
            total: combinations.length,
            passed: 0,
            failed: 0,
            results: []
        };
        await Promise.all(combinations.map(async (combo) => {
            try {
                const result = await this.orchestrator.execute((browser, page) => test(browser, page, combo), { browser: combo.browser });
                results.passed++;
                results.results.push({
                    context: combo,
                    success: true,
                    result
                });
            }
            catch (error) {
                results.failed++;
                results.results.push({
                    context: combo,
                    success: false,
                    error: error.message
                });
            }
        }));
        return results;
    }
    generateCombinations(matrix) {
        const combinations = [];
        for (const browser of matrix.browsers || ['chromium']) {
            for (const viewport of matrix.viewports || [{ width: 1920, height: 1080 }]) {
                for (const locale of matrix.locales || ['en-US']) {
                    combinations.push({
                        browser,
                        viewport,
                        locale
                    });
                }
            }
        }
        return combinations;
    }
}
exports.BrowserMatrix = BrowserMatrix;
// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════
function createOrchestrator(config) {
    return new BrowserOrchestrator(config);
}
function createPool(config) {
    return new BrowserPool(config);
}
exports.default = {
    BrowserPool,
    BrowserOrchestrator,
    BrowserMatrix,
    createOrchestrator,
    createPool
};
//# sourceMappingURL=BrowserOrchestrator.js.map