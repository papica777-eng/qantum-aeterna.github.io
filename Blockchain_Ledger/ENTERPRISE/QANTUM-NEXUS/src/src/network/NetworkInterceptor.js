"use strict";
/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * 🧠 QANTUM HYBRID v1.0.0 - Network Interceptor
 * HAR recording/playback, GraphQL filtering, request mocking
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
exports.NetworkInterceptor = void 0;
const events_1 = require("events");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// ═══════════════════════════════════════════════════════════════════════════════
// NETWORK INTERCEPTOR
// ═══════════════════════════════════════════════════════════════════════════════
class NetworkInterceptor extends events_1.EventEmitter {
    page;
    config;
    harEntries = [];
    mocks = new Map();
    stubs = new Map();
    graphQLMocks = new Map();
    requestLog = [];
    pendingRequests = new Map();
    isRecording = false;
    interceptActive = false;
    constructor(config) {
        super();
        this.config = {
            enabled: config?.enabled ?? true,
            recordHar: config?.recordHar ?? false,
            harPath: config?.harPath,
            mockEnabled: config?.mockEnabled ?? true,
            stubEnabled: config?.stubEnabled ?? true,
            graphQLEnabled: config?.graphQLEnabled ?? true,
            blockPatterns: config?.blockPatterns ?? [],
            allowPatterns: config?.allowPatterns ?? ['**/*'],
        };
    }
    /**
     * Set Playwright page and start intercepting
     */
    async setPage(page) {
        this.page = page;
        await this.setupInterception();
        return this;
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // INTERCEPTION SETUP
    // ═══════════════════════════════════════════════════════════════════════════
    async setupInterception() {
        if (!this.page || !this.config.enabled || this.interceptActive)
            return;
        // Listen to requests
        this.page.on('request', (request) => this.onRequest(request));
        this.page.on('response', (response) => this.onResponse(response));
        this.page.on('requestfailed', (request) => this.onRequestFailed(request));
        // Setup route handler for mocking
        await this.page.route('**/*', async (route) => {
            await this.handleRoute(route);
        });
        this.interceptActive = true;
        console.log('🌐 Network interceptor active');
    }
    onRequest(request) {
        const id = `${request.method()}-${request.url()}-${Date.now()}`;
        this.pendingRequests.set(id, {
            start: Date.now(),
            request,
        });
        this.emit('request', {
            method: request.method(),
            url: request.url(),
            resourceType: request.resourceType(),
        });
    }
    onResponse(response) {
        const request = response.request();
        const url = request.url();
        // Find pending request
        for (const [id, pending] of this.pendingRequests.entries()) {
            if (pending.request.url() === url) {
                const duration = Date.now() - pending.start;
                const log = {
                    timestamp: pending.start,
                    method: request.method(),
                    url,
                    resourceType: request.resourceType(),
                    status: response.status(),
                    duration,
                };
                this.requestLog.push(log);
                this.pendingRequests.delete(id);
                // Record HAR entry
                if (this.isRecording) {
                    this.recordHarEntry(request, response, duration);
                }
                this.emit('response', log);
                break;
            }
        }
    }
    onRequestFailed(request) {
        const url = request.url();
        for (const [id, pending] of this.pendingRequests.entries()) {
            if (pending.request.url() === url) {
                const log = {
                    timestamp: pending.start,
                    method: request.method(),
                    url,
                    resourceType: request.resourceType(),
                    error: request.failure()?.errorText,
                };
                this.requestLog.push(log);
                this.pendingRequests.delete(id);
                this.emit('requestFailed', log);
                break;
            }
        }
    }
    async handleRoute(route) {
        const request = route.request();
        const url = request.url();
        const method = request.method();
        // Check blocked patterns
        for (const pattern of this.config.blockPatterns) {
            if (this.matchPattern(url, pattern)) {
                await route.abort();
                this.emit('blocked', { url, pattern });
                return;
            }
        }
        // Check mocks
        for (const [, mock] of this.mocks) {
            if (this.matchPattern(url, mock.url) && (!mock.method || mock.method === method)) {
                await this.fulfillMock(route, mock);
                return;
            }
        }
        // Check stubs
        for (const [id, stub] of this.stubs) {
            if (this.matchPattern(url, stub.url)) {
                if (stub.remaining > 0 || stub.remaining === -1) {
                    await this.fulfillStub(route, stub);
                    if (stub.remaining > 0)
                        stub.remaining--;
                    if (stub.remaining === 0)
                        this.stubs.delete(id);
                    return;
                }
            }
        }
        // Check GraphQL mocks
        if (this.config.graphQLEnabled && url.includes('graphql')) {
            const graphqlResult = await this.handleGraphQL(route);
            if (graphqlResult)
                return;
        }
        // Continue normally
        await route.continue();
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // MOCKING
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Add a mock (intercept and replace response)
     */
    mock(config) {
        const id = `mock-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        this.mocks.set(id, config);
        console.log(`🎭 Mock registered: ${config.url}`);
        return this;
    }
    /**
     * Add a stub (Cypress-style fixture-based mock)
     */
    stub(config) {
        const id = `stub-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        this.stubs.set(id, { ...config, remaining: config.times ?? -1 });
        console.log(`📌 Stub registered: ${config.url}`);
        return this;
    }
    /**
     * Intercept (alias for mock, Cypress-style)
     */
    intercept(url, response) {
        if (typeof response === 'function') {
            // Custom handler - not implemented in this version
            console.warn('Custom route handlers not yet supported');
            return this;
        }
        return this.mock({
            url,
            body: response,
        });
    }
    /**
     * Clear all mocks and stubs
     */
    clearMocks() {
        this.mocks.clear();
        this.stubs.clear();
        this.graphQLMocks.clear();
        console.log('🧹 All mocks cleared');
        return this;
    }
    async fulfillMock(route, mock) {
        if (mock.delay) {
            await new Promise((r) => setTimeout(r, mock.delay));
        }
        const body = typeof mock.body === 'object' ? JSON.stringify(mock.body) : mock.body;
        await route.fulfill({
            status: mock.status ?? 200,
            headers: {
                'Content-Type': 'application/json',
                ...mock.headers,
            },
            body: body ?? '',
        });
        this.emit('mocked', { url: route.request().url(), mock });
    }
    async fulfillStub(route, stub) {
        let body;
        if (stub.fixture) {
            // Load from fixture file
            const fixturePath = path.resolve(stub.fixture);
            if (fs.existsSync(fixturePath)) {
                body = fs.readFileSync(fixturePath, 'utf-8');
            }
            else {
                console.warn(`Fixture not found: ${fixturePath}`);
                await route.continue();
                return;
            }
        }
        else if (stub.response?.body) {
            body = typeof stub.response.body === 'object'
                ? JSON.stringify(stub.response.body)
                : stub.response.body;
        }
        else {
            await route.continue();
            return;
        }
        await route.fulfill({
            status: stub.response?.status ?? 200,
            headers: {
                'Content-Type': 'application/json',
                ...stub.response?.headers,
            },
            body,
        });
        this.emit('stubbed', { url: route.request().url() });
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // GRAPHQL
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Mock a GraphQL operation
     */
    mockGraphQL(config) {
        const id = config.alias ?? config.operationName ?? `gql-${Date.now()}`;
        this.graphQLMocks.set(id, config);
        console.log(`🔷 GraphQL mock registered: ${id}`);
        return this;
    }
    async handleGraphQL(route) {
        const request = route.request();
        try {
            const postData = request.postData();
            if (!postData)
                return false;
            const body = JSON.parse(postData);
            const operationName = body.operationName;
            const query = body.query;
            for (const [, config] of this.graphQLMocks) {
                // Match by operation name
                if (config.operationName && config.operationName !== operationName) {
                    continue;
                }
                // Match by query
                if (config.query) {
                    const queryPattern = config.query instanceof RegExp
                        ? config.query
                        : new RegExp(config.query);
                    if (!queryPattern.test(query)) {
                        continue;
                    }
                }
                // Match by variables
                if (config.variables) {
                    const requestVars = body.variables || {};
                    let varsMatch = true;
                    for (const [key, value] of Object.entries(config.variables)) {
                        if (requestVars[key] !== value) {
                            varsMatch = false;
                            break;
                        }
                    }
                    if (!varsMatch)
                        continue;
                }
                // Match found - fulfill
                await route.fulfill({
                    status: 200,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(config.response ?? { data: {} }),
                });
                this.emit('graphqlMocked', { operationName, alias: config.alias });
                return true;
            }
        }
        catch {
            // Not valid GraphQL
        }
        return false;
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // HAR RECORDING
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Start recording HAR
     */
    startRecording() {
        this.isRecording = true;
        this.harEntries = [];
        console.log('🔴 HAR recording started');
        return this;
    }
    /**
     * Stop recording HAR
     */
    stopRecording() {
        this.isRecording = false;
        console.log('⏹️ HAR recording stopped');
        return this;
    }
    /**
     * Save HAR file
     */
    saveHar(filepath) {
        const outputPath = filepath ?? this.config.harPath ?? `./har-${Date.now()}.har`;
        const har = {
            version: '1.2',
            creator: {
                name: 'QANTUM Hybrid',
                version: '26.0',
            },
            entries: this.harEntries,
        };
        fs.writeFileSync(outputPath, JSON.stringify(har, null, 2));
        console.log(`💾 HAR saved: ${outputPath}`);
        return outputPath;
    }
    /**
     * Load and replay HAR
     */
    async loadHar(filepath) {
        const content = fs.readFileSync(filepath, 'utf-8');
        const har = JSON.parse(content);
        for (const entry of har.entries) {
            this.mock({
                url: entry.request.url,
                method: entry.request.method,
                status: entry.response.status,
                headers: Object.fromEntries(entry.response.headers.map(h => [h.name, h.value])),
                body: entry.response.content.text,
            });
        }
        console.log(`📂 HAR loaded: ${har.entries.length} entries`);
        return this;
    }
    async recordHarEntry(request, response, duration) {
        try {
            const entry = {
                startedDateTime: new Date().toISOString(),
                time: duration,
                request: {
                    method: request.method(),
                    url: request.url(),
                    headers: Object.entries(request.headers()).map(([name, value]) => ({ name, value })),
                    postData: request.postData() ? {
                        mimeType: 'application/json',
                        text: request.postData(),
                    } : undefined,
                },
                response: {
                    status: response.status(),
                    statusText: response.statusText(),
                    headers: Object.entries(response.headers()).map(([name, value]) => ({ name, value })),
                    content: {
                        size: 0,
                        mimeType: response.headers()['content-type'] ?? 'text/plain',
                        text: undefined,
                    },
                },
                timings: {
                    wait: 0,
                    receive: duration,
                },
            };
            // Try to get body
            try {
                const body = await response.text();
                entry.response.content.text = body;
                entry.response.content.size = body.length;
            }
            catch { }
            this.harEntries.push(entry);
        }
        catch { }
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // BLOCKING
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Block requests matching pattern
     */
    block(pattern) {
        this.config.blockPatterns.push(pattern);
        console.log(`🚫 Blocking: ${pattern}`);
        return this;
    }
    /**
     * Block common tracking/analytics
     */
    blockTrackers() {
        const trackers = [
            '**/google-analytics.com/**',
            '**/googletagmanager.com/**',
            '**/facebook.net/**',
            '**/doubleclick.net/**',
            '**/hotjar.com/**',
            '**/mixpanel.com/**',
            '**/segment.io/**',
            '**/amplitude.com/**',
        ];
        trackers.forEach(t => this.block(t));
        return this;
    }
    /**
     * Block images (for faster tests)
     */
    blockImages() {
        this.block('**/*.png');
        this.block('**/*.jpg');
        this.block('**/*.jpeg');
        this.block('**/*.gif');
        this.block('**/*.svg');
        this.block('**/*.webp');
        return this;
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // WAITING
    // ═══════════════════════════════════════════════════════════════════════════
    /**
     * Wait for specific request
     */
    async waitForRequest(urlPattern, options) {
        if (!this.page)
            return null;
        try {
            return await this.page.waitForRequest(urlPattern, {
                timeout: options?.timeout ?? 30000,
            });
        }
        catch {
            return null;
        }
    }
    /**
     * Wait for specific response
     */
    async waitForResponse(urlPattern, options) {
        if (!this.page)
            return null;
        try {
            return await this.page.waitForResponse(urlPattern, {
                timeout: options?.timeout ?? 30000,
            });
        }
        catch {
            return null;
        }
    }
    /**
     * Wait for network idle
     */
    async waitForNetworkIdle(options) {
        if (!this.page)
            return;
        await this.page.waitForLoadState('networkidle', {
            timeout: options?.timeout ?? 30000,
        });
    }
    // ═══════════════════════════════════════════════════════════════════════════
    // UTILITIES
    // ═══════════════════════════════════════════════════════════════════════════
    matchPattern(url, pattern) {
        if (pattern instanceof RegExp) {
            return pattern.test(url);
        }
        // Convert glob to regex
        const regex = new RegExp(pattern
            .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*'));
        return regex.test(url);
    }
    /**
     * Get request log
     */
    getRequestLog() {
        return [...this.requestLog];
    }
    /**
     * Get requests by resource type
     */
    getRequestsByType(type) {
        return this.requestLog.filter(r => r.resourceType === type);
    }
    /**
     * Get failed requests
     */
    getFailedRequests() {
        return this.requestLog.filter(r => r.error || (r.status && r.status >= 400));
    }
    /**
     * Clear request log
     */
    clearLog() {
        this.requestLog = [];
        return this;
    }
    /**
     * Get statistics
     */
    getStatistics() {
        const byType = {};
        const byStatus = {};
        let totalDuration = 0;
        let totalSize = 0;
        let countWithDuration = 0;
        for (const log of this.requestLog) {
            byType[log.resourceType] = (byType[log.resourceType] || 0) + 1;
            const statusGroup = log.status ? `${Math.floor(log.status / 100)}xx` : 'error';
            byStatus[statusGroup] = (byStatus[statusGroup] || 0) + 1;
            if (log.duration) {
                totalDuration += log.duration;
                countWithDuration++;
            }
            if (log.size) {
                totalSize += log.size;
            }
        }
        return {
            totalRequests: this.requestLog.length,
            byType,
            byStatus,
            avgDuration: countWithDuration > 0 ? Math.round(totalDuration / countWithDuration) : 0,
            totalSize,
        };
    }
}
exports.NetworkInterceptor = NetworkInterceptor;
exports.default = NetworkInterceptor;
//# sourceMappingURL=NetworkInterceptor.js.map