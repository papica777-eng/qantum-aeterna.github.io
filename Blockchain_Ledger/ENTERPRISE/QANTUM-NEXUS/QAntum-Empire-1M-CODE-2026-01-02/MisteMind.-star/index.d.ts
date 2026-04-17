/**
 * QANTUM v15.1 THE CHRONOS ENGINE
 * TypeScript Type Definitions
 * 
 * @copyright 2025 Dimitar Prodromov (papica777-eng). All Rights Reserved.
 * @license Commercial License Required for Business Use
 */

declare module 'qantum' {
    import { EventEmitter } from 'events';

    // ═══════════════════════════════════════════════════════════════════
    // 📊 COMMON TYPES
    // ═══════════════════════════════════════════════════════════════════

    export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    export type Severity = 'critical' | 'high' | 'medium' | 'low';
    export type HealthStatus = 'healthy' | 'degraded' | 'critical' | 'dead';

    export interface BaseConfig {
        dataDir?: string;
        verbose?: boolean;
        logLevel?: LogLevel;
    }

    // ═══════════════════════════════════════════════════════════════════
    // ⏰ CHRONOS ENGINE (v15.0)
    // ═══════════════════════════════════════════════════════════════════

    export interface ChronosConfig extends BaseConfig {
        autoLearn?: boolean;
        predictOnInit?: boolean;
        saveInterval?: number;
        lookAheadSteps?: number;
        simulationSamples?: number;
        autoHeal?: boolean;
        healthCheckInterval?: number;
        verboseHealing?: boolean;
    }

    export interface ChronosStats {
        sessionsStarted: number;
        testsRun: number;
        lessonsLearned: number;
        predictionsGenerated: number;
        predictionAccuracy: number;
        healingsPerformed: number;
        healingSuccessRate: number;
        strategicDecisions: number;
    }

    export class QAntumChronos extends EventEmitter {
        constructor(config?: ChronosConfig);
        readonly version: string;
        readonly codename: string;
        readonly stats: ChronosStats;
        
        initialize(): Promise<void>;
        start(): void;
        stop(): void;
        
        learnFromOutcome(outcome: any): void;
        predictOutcome(scenario: any): any;
        makeStrategicDecision(options: any[]): any;
        
        saveState(): void;
        loadState(): void;
        getStats(): ChronosStats;
        getReport(): any;
    }

    export class ChronosEngine {
        constructor(config?: any);
        loadHeuristics(): void;
        loadExperience(): void;
        getStats(): any;
    }

    export class FutureSimulator {
        constructor();
        simulate(scenario: any): any;
        getMutationTypes(): string[];
    }

    export class GlobalHeuristicMatrix {
        constructor(config?: any);
        getWeights(): Record<string, number>;
        updateWeight(strategy: string, delta: number): void;
    }

    export class StrategicSingularity {
        constructor(config?: any);
        decide(options: any[], context?: any): any;
        getDecisionHistory(): any[];
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🥋 API SENSEI (v15.1)
    // ═══════════════════════════════════════════════════════════════════

    export interface APISenseiConfig {
        baseURL?: string;
        timeout?: number;
        retries?: number;
        retryDelay?: number;
        headers?: Record<string, string>;
    }

    export interface APIResponse {
        status: number;
        statusText: string;
        headers: Record<string, string>;
        data: any;
        responseTime: number;
    }

    export class APISensei extends EventEmitter {
        constructor(config?: APISenseiConfig);
        setBasicAuth(username: string, password: string): this;
        setBearerToken(token: string): this;
        setApiKey(key: string, headerName?: string): this;
        get(path: string, options?: any): Promise<APIResponse>;
        post(path: string, data?: any, options?: any): Promise<APIResponse>;
        put(path: string, data?: any, options?: any): Promise<APIResponse>;
        patch(path: string, data?: any, options?: any): Promise<APIResponse>;
        delete(path: string, options?: any): Promise<APIResponse>;
        graphql(query: string, variables?: any): Promise<APIResponse>;
        expect(response: APIResponse): APIAssertions;
        validateSchema(response: APIResponse, schema: any): boolean;
        setVariable(name: string, value: any): this;
        getVariable(name: string): any;
        printReport(): void;
        getMetrics(): any;
    }

    export interface APIAssertions {
        statusCode(code: number): this;
        statusCodeIn(codes: number[]): this;
        hasHeader(name: string, value?: string): this;
        hasProperty(path: string): this;
        propertyEquals(path: string, value: any): this;
        responseTimeBelow(ms: number): this;
        matchesSchema(schema: any): this;
    }

    export class APITestChain {
        constructor(sensei: APISensei);
        step(name: string, fn: (sensei: APISensei) => Promise<any>): this;
        run(): Promise<any[]>;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🧠 NEURO-SENTINEL (v12.0)
    // ═══════════════════════════════════════════════════════════════════

    export interface SentinelConfig extends BaseConfig {
        healthThreshold?: number;
        monitorInterval?: number;
        slackWebhook?: string;
        shadow?: { maxClones?: number; basePort?: number };
        chaos?: { safeMode?: boolean; allowedScenarios?: string[] };
    }

    export interface HealthReport {
        score: number;
        status: HealthStatus;
        checks: {
            shadowAlive: boolean;
            responseTime: number;
            errorRate: number;
            memoryOk: boolean;
            servicesUp: boolean;
        };
        timestamp: Date;
    }

    export class NeuroSentinel extends EventEmitter {
        constructor(config?: SentinelConfig);
        ignite(targetUrl: string): Promise<this>;
        runChaosScenario(scenario: string, target?: string, options?: { duration?: number }): Promise<any>;
        checkSystemHealth(shadow?: any): Promise<HealthReport>;
        shutdown(): Promise<any>;
        getReport(): any;
    }

    export class ShadowCloneEngine {
        constructor(config?: any);
        createShadowClone(sourceEnv: string, cloneName?: string): Promise<any>;
        destroyShadowClone(cloneName: string): Promise<boolean>;
        getActiveClones(): any[];
    }

    export class ChaosEngine {
        constructor(config?: any);
        unleashChaos(scenarioName: string, target?: string, options?: any): Promise<any>;
        stopChaos(attackId: string): Promise<boolean>;
        emergencyStop(): Promise<void>;
        getStats(): any;
    }

    export class GeneticSelfRepairEngine {
        constructor(config?: any);
        analyzeAndRepair(error: Error, context?: any): Promise<any>;
        getStats(): any;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 👑 SOVEREIGN CORE (v13.0)
    // ═══════════════════════════════════════════════════════════════════

    export class SovereignAgent {
        constructor(config?: any);
        initialize(): Promise<void>;
        mapApplication(url: string): Promise<any>;
        generateTests(appMap: any): Promise<string[]>;
        runTests(tests: string[]): Promise<any>;
        getReport(): any;
    }

    export class ApplicationMapper {
        constructor();
        crawl(url: string, options?: any): Promise<any>;
        getEndpoints(): string[];
        getForms(): any[];
    }

    export class SecurityEngine {
        constructor(config?: any);
        scan(url: string): Promise<any>;
        testSQLInjection(url: string): Promise<any[]>;
        testXSS(url: string): Promise<any[]>;
        testCSRF(url: string): Promise<any[]>;
        getReport(): any;
    }

    export const PAYLOADS: { SQL_INJECTION: string[]; XSS: string[] };
    export const SIGNATURES: { SQL_ERROR: RegExp[]; XSS_SUCCESS: RegExp[] };

    // ═══════════════════════════════════════════════════════════════════
    // 🧠 OMNISCIENT CORE (v14.0)
    // ═══════════════════════════════════════════════════════════════════

    export class OmniscientCore extends EventEmitter {
        constructor(config?: any);
        initialize(): Promise<void>;
        start(): void;
        stop(): void;
        predictFuture(scenario: any): any;
        getCollectiveWisdom(): any;
    }

    export class HiveAgent {
        constructor(id: string, config?: any);
        learn(experience: any): void;
        decide(options: any[]): any;
        shareKnowledge(): any;
    }

    export class SentinelAgent extends HiveAgent { monitor(): Promise<any>; }
    export class GuardianAgent extends HiveAgent { protect(): Promise<any>; }
    export class OracleAgent extends HiveAgent { predict(scenario: any): any; }

    export class FutureMindingEngine {
        constructor();
        predict(scenario: any): any;
        getPredictionHistory(): any[];
    }

    export class CollectiveIntelligence {
        constructor(config?: any);
        addAgent(agent: HiveAgent): void;
        removeAgent(id: string): void;
        vote(options: any[]): any;
        consensus(): any;
    }

    export class CollectiveMemory {
        constructor();
        store(key: string, value: any): void;
        retrieve(key: string): any;
        search(query: string): any[];
    }

    export class OversightMesh { constructor(); addNode(agent: HiveAgent): void; monitor(): any; }
    export class SelfRepairEngine { constructor(); diagnose(system: any): any; repair(diagnosis: any): Promise<boolean>; }
    export class KnowledgeDNA { constructor(); evolve(knowledge: any): any; mutate(gene: any): any; }

    // ═══════════════════════════════════════════════════════════════════
    // 🔭 PRECISION OBSERVER
    // ═══════════════════════════════════════════════════════════════════

    export class PrecisionObserver extends EventEmitter {
        constructor(config?: any);
        addTarget(name: string, url: string, options?: any): void;
        removeTarget(name: string): void;
        onAlert(callback: (alert: any) => void): void;
        start(): void;
        stop(): void;
        checkAllTargets(): Promise<void>;
        getReport(): any;
        getHealthScore(): number;
    }

    export class MetricsCollector {
        constructor();
        recordHttp(data: any): void;
        recordMemory(): void;
        recordCpu(): void;
        recordError(error: Error, context?: any): void;
        recordCustom(name: string, value: number, tags?: Record<string, string>): void;
        getStats(type: string, field: string, timeRangeMs?: number): any;
        getAllStats(timeRangeMs?: number): any;
        reset(): void;
    }

    export class AnomalyDetector {
        constructor(config?: any);
        learnBaseline(metricName: string, values: number[]): any;
        detectAnomaly(metricName: string, value: number, context?: any): any[];
        getAnomalySummary(timeRangeMs?: number): any;
    }

    // ═══════════════════════════════════════════════════════════════════
    // 🚀 NEXUS & QUANTUM
    // ═══════════════════════════════════════════════════════════════════

    export class VideoToTestAI { constructor(); startRecording(page: any, sessionName?: string): Promise<void>; stopRecording(): string; generateTestCode(): string; }
    export class ScreenshotToTestAI { constructor(); analyzeScreenshot(imagePath: string): Promise<any>; suggestTests(analysis: any): any[]; }
    export class PredictiveBugDetector { constructor(); scanForPotentialBugs(page: any): Promise<any[]>; }
    export class QAntumNexus { constructor(config?: any); analyzeAndTest(page: any): Promise<any>; }
    export class VoiceTestingEngine { constructor(); processCommand(page: any, voiceText: string): Promise<any>; startInteractiveSession(page: any): Promise<this>; stopSession(): string; }
    export class SelfEvolvingTestEngine { constructor(); runWithEvolution(page: any, testFn: (page: any) => Promise<void>, testName?: string): Promise<any>; }
    export class QAntumQuantum { constructor(options?: any); parseNaturalLanguageTest(testDescription: string): any; runNaturalLanguageTest(page: any, testDescription: string): Promise<any>; }
    export class NaturalLanguageEngine { constructor(); parseTest(testDescription: string, language?: 'en' | 'bg' | 'auto'): any[]; generatePlaywrightCode(steps: any[]): string; }
    export class AITestGenerator { constructor(); analyzeSourceCode(code: string, filename?: string): any; generateTests(analysis: any): any; }
    export class VisualAIEngine { constructor(config?: any); captureBaseline(page: any, name: string): Promise<any>; compareWithBaseline(page: any, name: string): Promise<any>; }
    export class AutoDiscoveryEngine { constructor(); discoverEverything(page: any, url: string): Promise<any>; }

    // ═══════════════════════════════════════════════════════════════════
    // 🎭 LEGACY
    // ═══════════════════════════════════════════════════════════════════

    export const QAntumV8: any;
    export const PlaywrightProfessor: any;
    export const EngineOrchestrator: any;
    export const SupervisorAgent: any;

    // ═══════════════════════════════════════════════════════════════════
    // 🏭 FACTORY FUNCTIONS
    // ═══════════════════════════════════════════════════════════════════

    export function createChronos(config?: ChronosConfig): QAntumChronos;
    export function createAPISensei(config?: APISenseiConfig): APISensei;
    export function createSentinel(config?: SentinelConfig): NeuroSentinel;
    export function createChaos(config?: any): ChaosEngine;
    export function createSovereign(config?: any): SovereignAgent;
    export function createSecurityScanner(config?: any): SecurityEngine;
    export function createMapper(): ApplicationMapper;
    export function createOmniscient(config?: any): OmniscientCore;
    export function createCollective(config?: any): CollectiveIntelligence;
    export function createFutureMind(): FutureMindingEngine;
    export function createOversightMesh(): OversightMesh;
    export function createKnowledgeDNA(): KnowledgeDNA;
    export function createVideoAI(): VideoToTestAI;
    export function createVoice(): VoiceTestingEngine;
    export function createNaturalLanguage(): NaturalLanguageEngine;
    export function createQuantum(options?: any): QAntumQuantum;
    export function createNexus(config?: any): QAntumNexus;
    export function createObserver(config?: any): PrecisionObserver;
    export function createMetrics(): MetricsCollector;
    export function createAnomalyDetector(config?: any): AnomalyDetector;

    export function getModuleStatus(): {
        chronos: boolean;
        apiSensei: boolean;
        omniscient: boolean;
        sovereign: boolean;
        neuroSentinel: boolean;
        nexus: boolean;
        quantum: boolean;
        playwright: boolean;
    };

    // ═══════════════════════════════════════════════════════════════════
    // 📦 CONSTANTS
    // ═══════════════════════════════════════════════════════════════════

    export const VERSION: string;
    export const CODENAME: string;
}
