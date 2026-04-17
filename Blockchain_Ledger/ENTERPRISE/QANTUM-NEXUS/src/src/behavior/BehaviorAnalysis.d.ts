/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * MIND-ENGINE: BEHAVIOR ANALYSIS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * User flow analysis, heatmap generation, session recording, behavior reporting
 *
 * @author dp | QAntum Labs
 * @version 1.0.0
 * @license Commercial
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { EventEmitter } from 'events';
export interface UserAction {
    type: 'click' | 'type' | 'scroll' | 'hover' | 'navigate' | 'wait';
    timestamp: number;
    target?: string;
    value?: string;
    position?: {
        x: number;
        y: number;
    };
    duration?: number;
    metadata?: Record<string, any>;
}
export interface FlowStep {
    action: UserAction;
    page: string;
    screenshot?: string;
    elementInfo?: ElementInfo;
    timing: {
        actionStart: number;
        actionEnd: number;
        pageLoadTime?: number;
    };
}
export interface ElementInfo {
    selector: string;
    tagName: string;
    text?: string;
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    visible: boolean;
}
export interface FlowAnalysis {
    flowId: string;
    name: string;
    steps: FlowStep[];
    totalDuration: number;
    pageTransitions: number;
    errorCount: number;
    patterns: FlowPattern[];
    recommendations: string[];
}
export interface FlowPattern {
    type: string;
    description: string;
    frequency: number;
    steps: number[];
}
export interface HeatmapData {
    pageUrl: string;
    width: number;
    height: number;
    clicks: Array<{
        x: number;
        y: number;
        count: number;
    }>;
    moves: Array<{
        x: number;
        y: number;
        density: number;
    }>;
    scrollDepth: number[];
    attention: AttentionZone[];
}
export interface AttentionZone {
    bounds: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    timeSpent: number;
    interactionCount: number;
}
export interface SessionRecording {
    sessionId: string;
    startTime: Date;
    endTime?: Date;
    actions: RecordedAction[];
    pages: string[];
    duration: number;
    metadata: Record<string, any>;
}
export interface RecordedAction {
    timestamp: number;
    type: string;
    data: any;
    screenshot?: string;
}
export declare class UserFlowAnalyzer extends EventEmitter {
    private flows;
    private currentFlowId;
    private patterns;
    /**
     * Start recording a new flow
     */
    startFlow(name: string): string;
    /**
     * Record a step in the current flow
     */
    recordStep(action: UserAction, page: string, elementInfo?: ElementInfo): void;
    /**
     * End current flow and analyze
     */
    endFlow(): FlowAnalysis | null;
    /**
     * Analyze flow patterns
     */
    analyzeFlow(flowId: string, steps: FlowStep[]): FlowAnalysis;
    /**
     * Compare two flows
     */
    compareFlows(flowId1: string, flowId2: string): FlowComparison;
    /**
     * Get optimal path for a goal
     */
    getOptimalPath(startPage: string, goalPage: string): FlowStep[];
    private countPageTransitions;
    private detectPatterns;
    private findRepeatedSequences;
    private generateRecommendations;
    private findCommonSteps;
    private findUniqueSteps;
    private calculateTimingDiff;
}
interface FlowComparison {
    flow1Steps: number;
    flow2Steps: number;
    commonSteps: number;
    uniqueToFlow1: number;
    uniqueToFlow2: number;
    timingDifference: number;
}
export declare class HeatmapGenerator extends EventEmitter {
    private heatmapData;
    private gridSize;
    /**
     * Record click
     */
    recordClick(pageUrl: string, x: number, y: number): void;
    /**
     * Record mouse movement
     */
    recordMove(pageUrl: string, x: number, y: number): void;
    /**
     * Record scroll depth
     */
    recordScroll(pageUrl: string, scrollY: number, pageHeight: number): void;
    /**
     * Record attention zone
     */
    recordAttention(pageUrl: string, zone: AttentionZone): void;
    /**
     * Generate heatmap visualization data
     */
    generateVisualization(pageUrl: string): HeatmapVisualization;
    /**
     * Export heatmap as HTML
     */
    exportAsHTML(pageUrl: string, outputPath: string): void;
    private getOrCreateHeatmap;
    private intensityToColor;
    private findHotspots;
    private generateScrollVisualization;
}
interface HeatmapVisualization {
    pageUrl: string;
    width: number;
    height: number;
    clickHeatmap: Array<{
        x: number;
        y: number;
        count: number;
        intensity: number;
        color: string;
    }>;
    hotspots: Hotspot[];
    scrollDepth: Array<{
        depth: number;
        reached: boolean;
    }>;
    attentionZones: AttentionZone[];
}
interface Hotspot {
    x: number;
    y: number;
    clicks: number;
}
export declare class SessionRecorder extends EventEmitter {
    private sessions;
    private activeSession;
    private recordingInterval;
    private screenshotInterval;
    /**
     * Start recording session
     */
    startSession(metadata?: Record<string, any>): string;
    /**
     * Record action
     */
    recordAction(type: string, data: any, screenshot?: string): void;
    /**
     * Record page visit
     */
    recordPage(url: string): void;
    /**
     * End session
     */
    endSession(): SessionRecording | null;
    /**
     * Get session by ID
     */
    getSession(sessionId: string): SessionRecording | undefined;
    /**
     * Export session
     */
    exportSession(sessionId: string, outputPath: string): void;
    /**
     * Generate session replay
     */
    generateReplay(sessionId: string): SessionReplay;
    /**
     * Replay session (returns async generator)
     */
    replaySession(sessionId: string): AsyncGenerator<ReplayStep>;
    private delay;
}
interface SessionReplay {
    sessionId: string;
    totalDuration: number;
    steps: ReplayStep[];
    pages: string[];
    metadata: Record<string, any>;
}
interface ReplayStep {
    delay: number;
    action: string;
    data: any;
    screenshot?: string;
}
export declare class BehaviorReporter extends EventEmitter {
    private flowAnalyzer;
    private heatmapGenerator;
    private sessionRecorder;
    constructor(flowAnalyzer: UserFlowAnalyzer, heatmapGenerator: HeatmapGenerator, sessionRecorder: SessionRecorder);
    /**
     * Generate comprehensive behavior report
     */
    generateReport(options: ReportOptions): BehaviorReport;
    /**
     * Export report as HTML
     */
    exportAsHTML(report: BehaviorReport, outputPath: string): void;
    private generateSummary;
    private analyzeUserFlows;
    private analyzeHeatmaps;
    private analyzeSessionStats;
    private generateRecommendations;
    private generateChartData;
}
interface ReportOptions {
    period: {
        start: Date;
        end: Date;
    };
    pages?: string[];
    includeScreenshots?: boolean;
}
interface BehaviorReport {
    generatedAt: Date;
    period: {
        start: Date;
        end: Date;
    };
    summary: BehaviorSummary;
    userFlows: FlowSummary[];
    heatmapInsights: HeatmapInsight[];
    sessionStats: SessionStats;
    recommendations: Recommendation[];
    charts: ChartData[];
}
interface BehaviorSummary {
    totalSessions: number;
    totalFlows: number;
    totalActions: number;
    avgSessionDuration: number;
    uniquePages: number;
}
interface FlowSummary {
    name: string;
    steps: number;
    pageTransitions: number;
    patterns: string[];
}
interface HeatmapInsight {
    page: string;
    clickPoints: number;
    hotspots: number;
    maxScroll: number;
}
interface SessionStats {
    shortest: number;
    longest: number;
    average: number;
    mostVisitedPage: string;
    mostCommonAction: string;
}
interface Recommendation {
    category: string;
    suggestion: string;
    priority: 'low' | 'medium' | 'high';
}
interface ChartData {
    type: string;
    data: any;
}
export declare function createFlowAnalyzer(): UserFlowAnalyzer;
export declare function createHeatmapGenerator(): HeatmapGenerator;
export declare function createSessionRecorder(): SessionRecorder;
export declare function createBehaviorReporter(flowAnalyzer: UserFlowAnalyzer, heatmapGenerator: HeatmapGenerator, sessionRecorder: SessionRecorder): BehaviorReporter;
declare const _default: {
    UserFlowAnalyzer: typeof UserFlowAnalyzer;
    HeatmapGenerator: typeof HeatmapGenerator;
    SessionRecorder: typeof SessionRecorder;
    BehaviorReporter: typeof BehaviorReporter;
    createFlowAnalyzer: typeof createFlowAnalyzer;
    createHeatmapGenerator: typeof createHeatmapGenerator;
    createSessionRecorder: typeof createSessionRecorder;
    createBehaviorReporter: typeof createBehaviorReporter;
};
export default _default;
//# sourceMappingURL=BehaviorAnalysis.d.ts.map