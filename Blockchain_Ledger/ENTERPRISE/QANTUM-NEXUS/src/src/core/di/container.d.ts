/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * QAntum
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * @copyright 2025 Димитър Продромов (Dimitar Prodromov). All Rights Reserved.
 * @license PROPRIETARY AND CONFIDENTIAL
 *
 * This file is part of QAntum.
 * Unauthorized copying, modification, distribution, or use of this file,
 * via any medium, is strictly prohibited without express written permission.
 *
 * For licensing inquiries: dimitar.papazov@QAntum.dev
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'node:events';
/**
 * Service token for type-safe dependency injection
 * @template T - The service type this token represents
 */
export declare class ServiceToken<T> {
    /** Unique identifier for the service */
    readonly id: symbol;
    /** Human-readable name for debugging */
    readonly name: string;
    /** Type marker (never used at runtime) */
    readonly _type: T;
    /**
     * Create a new service token
     * @param name - Human-readable identifier
     */
    constructor(name: string);
}
/**
 * Core service tokens for QANTUM
 * Use these to inject dependencies throughout the application
 */
export declare const ServiceTokens: {
    readonly BrowserEngine: ServiceToken<IBrowserEngine>;
    readonly BrowserPool: ServiceToken<IBrowserPool>;
    readonly AIProvider: ServiceToken<IAIProvider>;
    readonly ModelRouter: ServiceToken<IModelRouter>;
    readonly Database: ServiceToken<IDatabase>;
    readonly CacheProvider: ServiceToken<ICacheProvider>;
    readonly NeuralVault: ServiceToken<INeuralVault>;
    readonly WorkerPool: ServiceToken<IWorkerPool>;
    readonly TaskScheduler: ServiceToken<ITaskScheduler>;
    readonly Sandbox: ServiceToken<ISandbox>;
    readonly CircuitBreaker: ServiceToken<ICircuitBreaker>;
    readonly Logger: ServiceToken<ILogger>;
    readonly MetricsCollector: ServiceToken<IMetricsCollector>;
    readonly HealthChecker: ServiceToken<IHealthChecker>;
    readonly Config: ServiceToken<IConfig>;
    readonly Environment: ServiceToken<IEnvironment>;
    readonly ErrorHandler: ServiceToken<IErrorHandler>;
    readonly RetryStrategy: ServiceToken<IRetryStrategy>;
    readonly SemanticCore: ServiceToken<ISemanticCore>;
    readonly MutationEngine: ServiceToken<IMutationEngine>;
    readonly GhostExecutor: ServiceToken<IGhostExecutor>;
    readonly SwarmOrchestrator: ServiceToken<ISwarmOrchestrator>;
    readonly AgentFactory: ServiceToken<IAgentFactory>;
};
/** Browser automation engine interface */
export interface IBrowserEngine {
    launch(): Promise<void>;
    close(): Promise<void>;
    newPage(): Promise<unknown>;
    getStatus(): 'idle' | 'busy' | 'closed';
}
/** Pool of browser instances */
export interface IBrowserPool {
    acquire(): Promise<IBrowserEngine>;
    release(browser: IBrowserEngine): void;
    getSize(): number;
    getActiveCount(): number;
}
/** AI model provider interface */
export interface IAIProvider {
    generate(prompt: string, options?: AIGenerateOptions): Promise<AIResponse>;
    chat(messages: ChatMessage[], options?: AIChatOptions): Promise<AIResponse>;
    embed(text: string): Promise<number[]>;
    getModel(): string;
    isAvailable(): Promise<boolean>;
}
/** Options for AI generation */
export interface AIGenerateOptions {
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
}
/** Options for AI chat */
export interface AIChatOptions extends AIGenerateOptions {
    systemPrompt?: string;
}
/** AI response structure */
export interface AIResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
    };
    model: string;
    finishReason: 'stop' | 'length' | 'error';
}
/** Chat message structure */
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}
/** Routes requests to appropriate AI models */
export interface IModelRouter {
    route(task: string, options?: RouteOptions): Promise<IAIProvider>;
    setPreferred(model: string): void;
    getAvailableModels(): string[];
}
/** Route options */
export interface RouteOptions {
    preferredModel?: string;
    fallbackEnabled?: boolean;
}
/** Database interface */
export interface IDatabase {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    query<T>(sql: string, params?: unknown[]): Promise<T[]>;
    execute(sql: string, params?: unknown[]): Promise<{
        affectedRows: number;
    }>;
    transaction<T>(fn: (tx: ITransaction) => Promise<T>): Promise<T>;
}
/** Transaction interface */
export interface ITransaction {
    query<T>(sql: string, params?: unknown[]): Promise<T[]>;
    execute(sql: string, params?: unknown[]): Promise<{
        affectedRows: number;
    }>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
}
/** Cache provider interface */
export interface ICacheProvider {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<boolean>;
    clear(): Promise<void>;
    has(key: string): Promise<boolean>;
}
/** Encrypted storage vault */
export interface INeuralVault {
    store(key: string, data: unknown): Promise<void>;
    retrieve<T>(key: string): Promise<T | null>;
    delete(key: string): Promise<boolean>;
    list(): Promise<string[]>;
}
/** Worker thread pool */
export interface IWorkerPool {
    submit<T>(task: WorkerTask): Promise<T>;
    getStats(): WorkerPoolStats;
    scaleUp(count: number): void;
    scaleDown(count: number): void;
    shutdown(graceful: boolean): Promise<void>;
}
/** Worker task definition */
export interface WorkerTask {
    type: string;
    payload: unknown;
    priority?: number;
    timeout?: number;
}
/** Worker pool statistics */
export interface WorkerPoolStats {
    totalWorkers: number;
    activeWorkers: number;
    queueSize: number;
    completedTasks: number;
}
/** Task scheduler interface */
export interface ITaskScheduler {
    schedule(task: ScheduledTask): string;
    cancel(taskId: string): boolean;
    getScheduled(): ScheduledTask[];
}
/** Scheduled task definition */
export interface ScheduledTask {
    id?: string;
    fn: () => Promise<void>;
    interval?: number;
    cron?: string;
    runOnce?: boolean;
}
/** Sandboxed execution environment */
export interface ISandbox {
    execute<T>(code: string, context?: Record<string, unknown>): Promise<SandboxResult<T>>;
    validateCode(code: string): Promise<ValidationResult>;
}
/** Sandbox execution result */
export interface SandboxResult<T> {
    success: boolean;
    result?: T;
    error?: string;
    violations: SecurityViolation[];
    executionTime: number;
}
/** Validation result */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
/** Security violation record */
export interface SecurityViolation {
    type: string;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
}
/** Circuit breaker for resilience */
export interface ICircuitBreaker {
    execute<T>(fn: () => Promise<T>, fallback?: () => Promise<T>): Promise<T>;
    getState(): 'closed' | 'open' | 'half-open';
    reset(): void;
    trip(): void;
}
/** Logging interface */
export interface ILogger {
    debug(message: string, meta?: Record<string, unknown>): void;
    info(message: string, meta?: Record<string, unknown>): void;
    warn(message: string, meta?: Record<string, unknown>): void;
    error(message: string, error?: Error, meta?: Record<string, unknown>): void;
    fatal(message: string, error?: Error, meta?: Record<string, unknown>): void;
}
/** Metrics collector interface */
export interface IMetricsCollector {
    increment(metric: string, value?: number, tags?: Record<string, string>): void;
    gauge(metric: string, value: number, tags?: Record<string, string>): void;
    histogram(metric: string, value: number, tags?: Record<string, string>): void;
    timing(metric: string, duration: number, tags?: Record<string, string>): void;
}
/** Health checker interface */
export interface IHealthChecker {
    check(): Promise<HealthStatus>;
    registerCheck(name: string, check: () => Promise<CheckResult>): void;
    unregisterCheck(name: string): void;
}
/** Overall health status */
export interface HealthStatus {
    healthy: boolean;
    checks: Record<string, CheckResult>;
    timestamp: Date;
}
/** Individual check result */
export interface CheckResult {
    healthy: boolean;
    message?: string;
    duration: number;
}
/** Configuration interface */
export interface IConfig {
    get<T>(key: string, defaultValue?: T): T;
    set(key: string, value: unknown): void;
    has(key: string): boolean;
    getAll(): Record<string, unknown>;
}
/** Environment interface */
export interface IEnvironment {
    get(key: string, defaultValue?: string): string;
    isDevelopment(): boolean;
    isProduction(): boolean;
    isTest(): boolean;
}
/** Error handler interface */
export interface IErrorHandler {
    handle(error: Error, context?: ErrorContext): Promise<ErrorHandleResult>;
    registerStrategy(type: string, strategy: ErrorStrategy): void;
}
/** Error context */
export interface ErrorContext {
    operation: string;
    component: string;
    metadata?: Record<string, unknown>;
    neuralSnapshot?: NeuralSnapshot;
}
/** Neural snapshot for error debugging */
export interface NeuralSnapshot {
    memoryUsage: NodeJS.MemoryUsage;
    activeHandles: number;
    uptime: number;
    timestamp: Date;
    stackTrace: string;
}
/** Error handling result */
export interface ErrorHandleResult {
    recovered: boolean;
    retried: boolean;
    retryCount: number;
    finalError?: Error;
}
/** Error handling strategy */
export interface ErrorStrategy {
    canHandle(error: Error): boolean;
    handle(error: Error, context: ErrorContext): Promise<ErrorHandleResult>;
}
/** Retry strategy interface */
export interface IRetryStrategy {
    execute<T>(fn: () => Promise<T>, options?: RetryOptions): Promise<T>;
}
/** Retry options */
export interface RetryOptions {
    maxRetries?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    retryCondition?: (error: Error) => boolean;
}
/** Semantic analysis core */
export interface ISemanticCore {
    analyze(input: string): Promise<SemanticAnalysis>;
    generatePrediction(context: unknown): Promise<PredictionResult>;
}
/** Semantic analysis result */
export interface SemanticAnalysis {
    intent: string;
    entities: Array<{
        type: string;
        value: string;
    }>;
    confidence: number;
}
/** Prediction result */
export interface PredictionResult {
    prediction: unknown;
    confidence: number;
    reasoning: string[];
}
/** Mutation engine interface */
export interface IMutationEngine {
    propose(context: unknown): Promise<MutationProposal[]>;
    apply(mutation: MutationProposal): Promise<MutationResult>;
    rollback(mutationId: string): Promise<void>;
}
/** Mutation proposal */
export interface MutationProposal {
    id: string;
    type: string;
    target: string;
    changes: unknown;
    confidence: number;
}
/** Mutation result */
export interface MutationResult {
    success: boolean;
    applied: boolean;
    rollbackAvailable: boolean;
}
/** Ghost execution layer */
export interface IGhostExecutor {
    execute(action: unknown): Promise<GhostResult>;
    getActiveGhosts(): number;
}
/** Ghost execution result */
export interface GhostResult {
    success: boolean;
    result: unknown;
    duration: number;
}
/** Swarm orchestrator interface */
export interface ISwarmOrchestrator {
    assignTask(task: unknown): Promise<string>;
    getAgentStatus(agentId: string): AgentStatus;
    shutdown(): Promise<void>;
}
/** Agent status */
export interface AgentStatus {
    id: string;
    type: string;
    state: 'idle' | 'working' | 'error';
    currentTask?: string;
}
/** Agent factory interface */
export interface IAgentFactory {
    create(type: string, config?: unknown): unknown;
    getAvailableTypes(): string[];
}
/**
 * Service lifetime determines how instances are created and shared
 */
export declare enum ServiceLifetime {
    /** Single instance shared across all requests */
    Singleton = "singleton",
    /** New instance for each scope (e.g., per request) */
    Scoped = "scoped",
    /** New instance every time it's resolved */
    Transient = "transient"
}
/**
 * 💎 Dependency Injection Container
 *
 * Central registry for all application services.
 * Supports singleton, scoped, and transient lifetimes.
 *
 * @example
 * ```typescript
 * const container = new DIContainer();
 *
 * // Register a singleton service
 * container.register(ServiceTokens.Logger, () => new ConsoleLogger(), ServiceLifetime.Singleton);
 *
 * // Resolve the service
 * const logger = await container.resolve(ServiceTokens.Logger);
 * logger.info('Hello from DI!');
 * ```
 */
export declare class DIContainer extends EventEmitter {
    private registrations;
    private scopedInstances;
    private currentScope;
    private resolving;
    /**
     * Register a service with the container
     * @param token - Service token for type-safe resolution
     * @param factory - Factory function to create the service
     * @param lifetime - How the service instance should be managed
     * @throws Error if token is already registered
     */
    register<T>(token: ServiceToken<T>, factory: (container: DIContainer) => T | Promise<T>, lifetime?: ServiceLifetime): void;
    /**
     * Replace an existing service registration
     * @param token - Service token to replace
     * @param factory - New factory function
     * @param lifetime - New lifetime (optional, keeps existing if not provided)
     */
    replace<T>(token: ServiceToken<T>, factory: (container: DIContainer) => T | Promise<T>, lifetime?: ServiceLifetime): void;
    /**
     * Resolve a service from the container
     * @param token - Service token to resolve
     * @returns The resolved service instance
     * @throws Error if service is not registered or circular dependency detected
     */
    resolve<T>(token: ServiceToken<T>): Promise<T>;
    /**
     * Resolve a registration based on its lifetime
     */
    private resolveRegistration;
    /**
     * Run a function within a new scope
     * @param scopeId - Unique identifier for the scope
     * @param fn - Function to run within the scope
     * @returns The result of the function
     */
    runInScope<T>(scopeId: string, fn: () => Promise<T>): Promise<T>;
    /**
     * Check if a service is registered
     * @param token - Service token to check
     * @returns True if the service is registered
     */
    isRegistered<T>(token: ServiceToken<T>): boolean;
    /**
     * Get all registered service names
     * @returns Array of registered service names
     */
    getRegisteredServices(): string[];
    /**
     * Clear all registrations and instances
     * Use with caution - mainly for testing
     */
    clear(): void;
    /**
     * Create a child container that inherits registrations
     * @returns A new child container
     */
    createChild(): DIContainer;
}
/**
 * Global DI container instance
 * Use this for application-wide service resolution
 */
export declare const globalContainer: DIContainer;
/**
 * Metadata key for storing injection tokens
 */
export declare const INJECT_METADATA_KEY: unique symbol;
/**
 * Store injection metadata for a class constructor parameter
 * @param target - Class constructor
 * @param token - Service token to inject
 * @param parameterIndex - Constructor parameter index
 */
export declare function storeInjectionMetadata(target: object, token: ServiceToken<unknown>, parameterIndex: number): void;
/**
 * Retrieve injection metadata for a class
 * @param target - Class constructor
 * @returns Array of service tokens indexed by parameter position
 */
export declare function getInjectionMetadata(target: object): Array<ServiceToken<unknown> | undefined>;
export default DIContainer;
//# sourceMappingURL=container.d.ts.map