/**
 * NEXUS STORE v2 — Sovereign State Management
 * Architect: DIMITAR PRODROMOV
 * Bridge: QANTUM-NEXUS ↔ QAntum-Mind-Engine-Self-Healing
 *
 * // Complexity: O(1) for all selectors
 */

import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import type { ElementType } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// ENUMS — Mirror of OmniCore/evolution/VortexHealingNexus.ts
// ═══════════════════════════════════════════════════════════════════════════

export enum DaemonState {
  DORMANT      = 'DORMANT',
  INITIALIZING = 'INITIALIZING',
  AWAKENING    = 'AWAKENING',
  ACTIVE       = 'ACTIVE',
  PATROLLING   = 'PATROLLING',
  HEALING      = 'HEALING',
  MEDITATING   = 'MEDITATING',
  EVOLVING     = 'EVOLVING',
  EMERGENCY    = 'EMERGENCY',
  TERMINATED   = 'TERMINATED',
}

export enum ThreatLevel {
  NONE     = 'NONE',
  LOW      = 'LOW',
  MEDIUM   = 'MEDIUM',
  HIGH     = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum HealingDomain {
  UI       = 'UI',
  NETWORK  = 'NETWORK',
  LOGIC    = 'LOGIC',
  DATABASE = 'DATABASE',
}

export enum InsightSeverity {
  LOW         = 'LOW',
  MEDIUM      = 'MEDIUM',
  HIGH        = 'HIGH',
  CRITICAL    = 'CRITICAL',
  INFO        = 'INFO',
  ADVISORY    = 'ADVISORY',
  WARNING     = 'WARNING',
  BREAKTHROUGH = 'BREAKTHROUGH',
}

// ── Thought / AI-Core types ────────────────────────────────────────────────

export enum DecisionOutcome {
  APPROVED    = 'APPROVED',
  REJECTED    = 'REJECTED',
  REJECT      = 'REJECT',
  DEFERRED    = 'DEFERRED',
  DEFER       = 'DEFER',
  ESCALATED   = 'ESCALATED',
  ESCALATE    = 'ESCALATE',
  EXECUTE     = 'EXECUTE',
  INVESTIGATE = 'INVESTIGATE',
  ADAPT       = 'ADAPT',
}

export interface ThoughtNode {
  id: string;
  type: ThoughtType;
  content: string;
  confidence: number;
  timestamp: string;
  outcome?: DecisionOutcome;
  decision?: string;
  query?: string;
  precedents?: string[];
  children?: ThoughtNode[];
  metadata?: Record<string, unknown>;
}

export interface VectorMatch {
  id: string;
  score: number;
  content: string;
  metadata: Record<string, unknown>;
  namespace?: string;
  filePath?: string;
  project?: string;
}

export interface MeditationInsight {
  id: string;
  severity: InsightSeverity;
  title: string;
  description: string;
  timestamp: string;
  acknowledged: boolean;
  source: string;
  evidence?: string[];
  recommendations?: string[];
}

export type HealingPolicy = 'conservative' | 'balanced' | 'aggressive';

export enum ThoughtType {
  PLAN         = 'PLAN',
  ACTION       = 'ACTION',
  REFLECTION   = 'REFLECTION',
  HEALING      = 'HEALING',
  ANALYSIS     = 'ANALYSIS',
  DECISION     = 'DECISION',
  STRATEGIC    = 'STRATEGIC',
  TACTICAL     = 'TACTICAL',
  REACTIVE     = 'REACTIVE',
  PREDICTIVE   = 'PREDICTIVE',
  DIAGNOSTIC   = 'DIAGNOSTIC',
  CREATIVE     = 'CREATIVE',
  CORRECTIVE   = 'CORRECTIVE',
  EVOLUTIONARY = 'EVOLUTIONARY',
}

// ═══════════════════════════════════════════════════════════════════════════
// INTERFACES
// ═══════════════════════════════════════════════════════════════════════════

export interface SubSystemStatus {
  type: string;
  state: DaemonState;
  healthScore: number;
  lastActivity: Date | string;
  errorCount?: number;
}

export interface DaemonStatus {
  id: string;
  name: string;
  state: DaemonState;
  uptime: number;
  lastHeartbeat: Date | string;
  metrics: {
    cpu: number;
    memory: number;
    tasksProcessed: number;
    errorsHandled: number;
  };
  subSystems: SubSystemStatus[];
}

export interface HealingEvent {
  id: string;
  type: 'ERROR_FIX' | 'TODO_RESOLVED' | 'DEPENDENCY_UPDATE' | 'CODE_REFACTOR';
  description: string;
  target: string;
  domain: HealingDomain;
  timestamp: string;
  autoFixed: boolean;
  rollbackAvailable: boolean;
  status: 'fixed' | 'pending' | 'failed';
  livenessToken?: string;
  strategy?: string;
  duration?: number;
}

export interface LiveFeedItem {
  id: string;
  severity: InsightSeverity;
  message: string;
  timestamp: string;
  domain?: HealingDomain;
  type?: string; // event type (thought | insight | healing | vector | alert)
}

export interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
  overall: number;
  threatLevel: ThreatLevel;
}

export interface PineconeStats {
  vectors: number;
  totalVectors: number;
  dimension: number;
  usage: number;
  indexedAt?: string;
  avgLatency?: number;  // ms
  queriesExecuted?: number;
}

export interface AutoHealingState {
  enabled: boolean;
  policy: HealingPolicy;
}

// ═══════════════════════════════════════════════════════════════════════════
// STORE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

interface NexusState {
  // System
  health: SystemHealth;
  daemon: DaemonStatus;
  liveFeed: LiveFeedItem[];

  // Healing
  healingEvents: HealingEvent[];
  autoHealing: AutoHealingState;

  // Pinecone / Vector DB
  pinecone: PineconeStats;
  pineconeStats: PineconeStats; // alias for components that use pineconeStats

  // AI Core — Thought stream
  thoughtFlow: ThoughtNode[];
  activeThought: ThoughtNode | null;

  // Meditation state
  isInMeditation: boolean;
  meditationDepth: number;
  insights: MeditationInsight[];

  // Connection status
  isConnected: boolean;
  lastSync: string | null;

  // ─── Actions ───────────────────────────────────────────────────────────

  // System
  setHealth: (health: Partial<SystemHealth>) => void;
  setDaemonState: (state: DaemonState) => void;
  updateSubSystem: (type: string, status: Partial<SubSystemStatus>) => void;
  pushLiveFeed: (item: Omit<LiveFeedItem, 'id'>) => void;

  // Healing
  pushHealingEvent: (event: Omit<HealingEvent, 'id'>) => void;
  rollbackHealing: (id: string) => void;
  clearHealingEvents: () => void;

  // Auto-healing policy
  setHealingEnabled: (enabled: boolean) => void;
  toggleAutoHealing: () => void;
  setHealingPolicy: (policy: HealingPolicy) => void;

  // Connection
  connect: () => void;
  disconnect: () => void;
  setConnected: (connected: boolean) => void;
  syncMetrics: (metrics: Partial<SystemHealth>) => void;

  // AI Core — Thought stream
  triggerThought: (thought: Omit<ThoughtNode, 'id'>) => void;
  setActiveThought: (thought: ThoughtNode | null) => void;

  // Memory search
  searchMemory: (query: string) => Promise<VectorMatch[]>;

  // Meditation
  startMeditation: () => void;
  stopMeditation: () => void;
  acknowledgeInsight: (id: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// STORE — SUBSTRATE INSTANTIATION
// ═══════════════════════════════════════════════════════════════════════════

export const useNexusStore = create<NexusState>()(
  subscribeWithSelector((set, get) => ({
    // ─── Initial State ────────────────────────────────────────────────────

    health: {
      cpu: 12,
      memory: 45,
      disk: 23,
      network: 100,
      overall: 95,
      threatLevel: ThreatLevel.NONE,
    },

    daemon: {
      id: 'mega-supreme-001',
      name: 'MegaSupremeDaemon',
      state: DaemonState.ACTIVE,
      uptime: 86400,
      lastHeartbeat: new Date().toISOString(),
      metrics: {
        cpu: 12,
        memory: 45,
        tasksProcessed: 1247,
        errorsHandled: 23,
      },
      subSystems: [
        { type: 'ETERNAL_WATCHDOG',   state: DaemonState.PATROLLING, healthScore: 98, lastActivity: new Date().toISOString() },
        { type: 'UNIFIED_GUARDIAN',   state: DaemonState.ACTIVE,     healthScore: 95, lastActivity: new Date().toISOString() },
        { type: 'MEMORY_WATCHDOG',    state: DaemonState.ACTIVE,     healthScore: 92, lastActivity: new Date().toISOString() },
        { type: 'ECOSYSTEM_MONITOR',  state: DaemonState.ACTIVE,     healthScore: 89, lastActivity: new Date().toISOString() },
        { type: 'VECTOR_SYNC',        state: DaemonState.ACTIVE,     healthScore: 100, lastActivity: new Date().toISOString() },
        { type: 'AUTONOMOUS_THOUGHT', state: DaemonState.MEDITATING, healthScore: 97, lastActivity: new Date().toISOString() },
        { type: 'GHOST_PROTOCOL',     state: DaemonState.ACTIVE,     healthScore: 100, lastActivity: new Date().toISOString() },
        { type: 'KILL_SWITCH',        state: DaemonState.DORMANT,    healthScore: 100, lastActivity: new Date().toISOString() },
      ],
    },

    liveFeed: [
      { id: 'l1', severity: InsightSeverity.HIGH,   message: 'Neural Link Latency Peak detected',   timestamp: new Date(Date.now() - 10000).toISOString(), domain: HealingDomain.NETWORK },
      { id: 'l2', severity: InsightSeverity.LOW,    message: 'Memory pool optimized by GC sweep',    timestamp: new Date(Date.now() - 60000).toISOString(), domain: HealingDomain.LOGIC },
      { id: 'l3', severity: InsightSeverity.MEDIUM, message: 'Selector drift detected on /dashboard', timestamp: new Date(Date.now() - 30000).toISOString(), domain: HealingDomain.UI },
    ],

    healingEvents: [
      {
        id: 'h1',
        type: 'ERROR_FIX',
        description: 'Repaired broken selector: #login-btn → [data-testid="login"]',
        target: '/auth/login',
        domain: HealingDomain.UI,
        timestamp: new Date(Date.now() - 600000).toISOString(),
        autoFixed: true,
        rollbackAvailable: true,
        status: 'fixed',
        strategy: 'NeuralMap:SelfHealing',
        duration: 342,
      },
      {
        id: 'h2',
        type: 'DEPENDENCY_UPDATE',
        description: 'Auto-patched stale @playwright/test version mismatch',
        target: 'package.json',
        domain: HealingDomain.LOGIC,
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        autoFixed: true,
        rollbackAvailable: false,
        status: 'fixed',
        strategy: 'EvolutionaryHardening:CodeMutation',
        duration: 1240,
      },
    ],

    autoHealing: {
      enabled: true,
      policy: 'balanced',
    },

    pinecone: {
      vectors: 125043,
      totalVectors: 125043,
      dimension: 1536,
      usage: 89,
      indexedAt: new Date(Date.now() - 3600000).toISOString(),
      avgLatency: 42,
      queriesExecuted: 8821,
    },

    get pineconeStats() { return (this as any).pinecone; },

    // AI Core state
    thoughtFlow: [
      {
        id: 'th1',
        type: ThoughtType.ANALYSIS,
        content: 'Analyzing selector drift across 12 test suites',
        confidence: 0.94,
        timestamp: new Date(Date.now() - 5000).toISOString(),
      },
    ],
    activeThought: null,

    // Meditation state
    isInMeditation: false,
    meditationDepth: 0,
    insights: [
      {
        id: 'ins1',
        severity: InsightSeverity.WARNING,
        title: 'Selector Drift Detected',
        description: '3 tests have broken selectors on /dashboard route',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        acknowledged: false,
        source: 'NeuralMapper',
      },
    ],

    isConnected: false,
    lastSync: null,

    // ─── Actions ─────────────────────────────────────────────────────────

    setHealth: (health) =>
      set((s) => ({
        health: { ...s.health, ...health },
      })),

    setDaemonState: (state) =>
      set((s) => ({
        daemon: { ...s.daemon, state, lastHeartbeat: new Date().toISOString() },
      })),

    updateSubSystem: (type, update) =>
      set((s) => ({
        daemon: {
          ...s.daemon,
          subSystems: s.daemon.subSystems.map((ss) =>
            ss.type === type ? { ...ss, ...update } : ss
          ),
        },
      })),

    pushLiveFeed: (item) =>
      set((s) => ({
        liveFeed: [
          { ...item, id: `lf-${Date.now()}-${Math.random().toString(36).slice(2, 7)}` },
          ...s.liveFeed,
        ].slice(0, 100), // Max 100 entries — O(1) cost at steady state
      })),

    pushHealingEvent: (event) =>
      set((s) => ({
        healingEvents: [
          {
            ...event,
            id: `he-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          },
          ...s.healingEvents,
        ].slice(0, 50), // Max 50 events
      })),

    rollbackHealing: (id) =>
      set((s) => ({
        healingEvents: s.healingEvents.map((e) =>
          e.id === id
            ? { ...e, status: 'pending', rollbackAvailable: false }
            : e
        ),
      })),

    clearHealingEvents: () => set({ healingEvents: [] }),

    setHealingEnabled: (enabled) =>
      set((s) => ({
        autoHealing: { ...s.autoHealing, enabled },
      })),

    toggleAutoHealing: () =>
      set((s) => ({
        autoHealing: { ...s.autoHealing, enabled: !s.autoHealing.enabled },
      })),

    setHealingPolicy: (policy) =>
      set((s) => ({
        autoHealing: { ...s.autoHealing, policy },
      })),

    setConnected: (connected) =>
      set({ isConnected: connected, lastSync: connected ? new Date().toISOString() : null }),

    connect: () => set({ isConnected: true, lastSync: new Date().toISOString() }),
    disconnect: () => set({ isConnected: false }),

    syncMetrics: (metrics) =>
      set((s) => ({
        health: { ...s.health, ...metrics },
        lastSync: new Date().toISOString(),
      })),

    // AI Core — thought stream
    triggerThought: (thought) =>
      set((s) => ({
        thoughtFlow: [
          { ...thought, id: `th-${Date.now()}` },
          ...s.thoughtFlow,
        ].slice(0, 50),
        activeThought: { ...thought, id: `th-${Date.now()}` },
      })),

    setActiveThought: (thought) => set({ activeThought: thought }),

    // Memory search — stub (real impl via API call)
    searchMemory: async (_query: string): Promise<VectorMatch[]> => {
      // TODO: wire to Pinecone API via /api/v1/memory/search
      return [];
    },

    // Meditation
    startMeditation: () => set({ isInMeditation: true, meditationDepth: 1 }),
    stopMeditation: () => set({ isInMeditation: false, meditationDepth: 0 }),
    acknowledgeInsight: (id) =>
      set((s) => ({
        insights: s.insights.map((ins) =>
          ins.id === id ? { ...ins, acknowledged: true } : ins
        ),
      })),
  }))
);

// ═══════════════════════════════════════════════════════════════════════════
// SELECTORS — O(1) access, zero unnecessary re-renders
// ═══════════════════════════════════════════════════════════════════════════

export const useSystemHealth  = () => useNexusStore((s) => s.health);
export const useDaemonStatus  = () => useNexusStore((s) => s.daemon);
export const usePineconeStats = () => useNexusStore((s) => s.pinecone);
export const useHealingEvents = () => useNexusStore((s) => s.healingEvents);
export const useLiveFeed      = () => useNexusStore((s) => s.liveFeed);
export const useAutoHealing   = () => useNexusStore((s) => ({
  enabled:   s.autoHealing.enabled,
  policy:    s.autoHealing.policy,
  toggle:    s.toggleAutoHealing,
  setPolicy: s.setHealingPolicy,
}));
export const useIsConnected   = () => useNexusStore((s) => s.isConnected);
export const useThoughtFlow   = () => useNexusStore((s) => s.thoughtFlow);
export const useActiveThought = () => useNexusStore((s) => s.activeThought);
export const useInsights      = () => useNexusStore((s) => s.insights);

// Legacy compat
export const useNexusHealth = useSystemHealth;
