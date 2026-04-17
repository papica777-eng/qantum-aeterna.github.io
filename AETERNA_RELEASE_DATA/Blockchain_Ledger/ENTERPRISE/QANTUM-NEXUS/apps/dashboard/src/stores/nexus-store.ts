import { create } from 'zustand';

export const InsightSeverity = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL',
  WARNING: 'WARNING',
  STRATEGIC: 'STRATEGIC',
  BREAKTHROUGH: 'BREAKTHROUGH'
} as const;

export const DecisionOutcome = {
  OPTIMAL: 'OPTIMAL',
  SUBOPTIMAL: 'SUBOPTIMAL',
  FATAL: 'FATAL',
  PENDING: 'PENDING'
} as const;

export const SystemSubsystem = {
  CORE: 'CORE',
  MEMORY: 'MEMORY',
  NETWORK: 'NETWORK',
  DAEMON: 'DAEMON'
} as const;

export const SubsystemState = {
  HEALTHY: 'HEALTHY',
  DEGRADED: 'DEGRADED',
  FAILED: 'FAILED',
  RECOVERING: 'RECOVERING'
} as const;

export const ThoughtType = {
  COMPUTATION: 'COMPUTATION',
  ANALYSIS: 'ANALYSIS',
  DECISION: 'DECISION',
  ACTION: 'ACTION',
  STRATEGIC: 'STRATEGIC',
  WARNING: 'WARNING'
} as const;

export const DaemonState = {
  DORMANT: 'DORMANT',
  INITIALIZING: 'INITIALIZING',
  AWAKENING: 'AWAKENING',
  ACTIVE: 'ACTIVE',
  PATROLLING: 'PATROLLING',
  HEALING: 'HEALING',
  MEDITATING: 'MEDITATING',
  EVOLVING: 'EVOLVING',
  EMERGENCY: 'EMERGENCY',
  TERMINATED: 'TERMINATED'
} as const;

export type InsightSeverity = keyof typeof InsightSeverity;
export type DecisionOutcome = keyof typeof DecisionOutcome;
export type SystemSubsystem = keyof typeof SystemSubsystem;
export type SubsystemState = keyof typeof SubsystemState;
export type ThoughtType = keyof typeof ThoughtType;
export type DaemonState = keyof typeof DaemonState;

export interface FeedItem {
  id: string;
  type: 'insight' | 'thought' | 'healing' | 'vector' | 'alert';
  message: string;
  severity?: InsightSeverity;
  timestamp: string;
  details?: any;
}

interface NexusState {
  isConnected: boolean;
  systemHealth: { overall: number; detailed: { cpu: number; memory: number } };
  daemonStatus: { state: DaemonState; name: string; uptime: number; metrics: any; subSystems: any[] };
  pineconeStats: { totalVectors: number };
  liveFeed: FeedItem[];
  healingEvents: any[];
  insights: any[];
  thoughtFlow: any[];
  activeThought: any | null;
  testCases: any[];
  testRuns: any[];
  projects: any[];

  // Actions
  connect: (url?: string) => void;
  disconnect: () => void;
  toggleHealing: () => void;
  runTest: (id: string | string[]) => void;
  generateTest: (prompt: string) => Promise<string>;
  _ws: WebSocket | null;
}

const DUMMY_PROJECTS = [
  { id: 'proj_1', name: 'OmniCore Backend', description: 'Core rust nodes and sovereign telemetrics via gRPC.', testsCount: 452, runsCount: 15430, passRate: 98.4, lastActivity: '2 mins ago', members: 3, status: 'active', favorite: true, color: 'from-cyan-500 to-blue-500' },
  { id: 'proj_2', name: 'Nexus Dashboard v3', description: 'Frontend React UI NextJS application tests.', testsCount: 189, runsCount: 5200, passRate: 94.2, lastActivity: '1 hr ago', members: 2, status: 'active', favorite: false, color: 'from-purple-500 to-pink-500' },
  { id: 'proj_3', name: 'Wealth Bridge', description: 'Solana/XRPL arbitrage execution paths.', testsCount: 3000, runsCount: 99401, passRate: 99.9, lastActivity: '1 sec ago', members: 1, status: 'active', favorite: true, color: 'from-emerald-500 to-teal-500' }
];

const DUMMY_TEST_CASES = [
  {
    id: 'suite_1',
    name: 'Authentication Flow',
    expanded: true,
    tests: [
      { id: 'tc_1', name: 'Login with valid bio-metrics', status: 'passed', duration: '120ms', lastRun: '5 mins ago', priority: 'high' },
      { id: 'tc_2', name: 'Reject forged token handshake', status: 'passed', duration: '84ms', lastRun: '5 mins ago', priority: 'high' },
      { id: 'tc_3', name: 'Rate limit brute force attempt', status: 'failed', duration: '5003ms', lastRun: '1 hour ago', priority: 'medium' }
    ]
  },
  {
    id: 'suite_2',
    name: 'Payment Execution',
    expanded: false,
    tests: [
      { id: 'tc_4', name: 'Stripe webhook validation signature', status: 'passed', duration: '45ms', lastRun: '1 day ago', priority: 'high' },
      { id: 'tc_5', name: 'Crypto bridging confirmation buffer', status: 'pending', duration: '-', lastRun: '-', priority: 'low' }
    ]
  }
];

const DUMMY_TEST_RUNS = [
  { id: 'run_881', name: 'Nightly Core Regression', status: 'running', progress: 68, totalTests: 1200, passedTests: 812, failedTests: 4, duration: '12m 40s', startedAt: '12 mins ago', branch: 'main', commit: 'c4b68c3', browser: 'chrome', triggeredBy: 'Auto-Scheduler', parallelism: 16 },
  { id: 'run_880', name: 'Frontend PR #45 Validation', status: 'passed', progress: 100, totalTests: 189, passedTests: 189, failedTests: 0, duration: '2m 15s', startedAt: '1 hr ago', branch: 'feature/brutalist-ui', commit: '892dd65', browser: 'firefox', triggeredBy: 'Dimitar Prodromov', parallelism: 4 },
  { id: 'run_879', name: 'Wealth Bridge Load Test', status: 'failed', progress: 100, totalTests: 3000, passedTests: 2999, failedTests: 1, duration: '45m 10s', startedAt: '4 hrs ago', branch: 'main', commit: '1ab23c', browser: 'chrome', triggeredBy: 'Watchdog', parallelism: 32 }
];

const DUMMY_HEALING_EVENTS = [
  { id: 'heal_1', selector: '.btn-login', resolvedTo: '[data-test-id="submit-auth"]', confidence: 99.4, timeSaved: '4 hours', status: 'applied', message: 'Element obscured by new layout. Shadow DOM penetrated.' },
  { id: 'heal_2', selector: '#cart-total', resolvedTo: '.price-summary strong', confidence: 85.2, timeSaved: '2 hours', status: 'applied', message: 'Class name obfuscation detected. Used semantic visual matching.' },
];

export const useStore = create<NexusState>((set, get) => ({
  isConnected: false,
  _ws: null,
  systemHealth: { overall: 98, detailed: { cpu: 20, memory: 40 } },
  daemonStatus: {
    state: 'ACTIVE',
    name: 'MEGADAEMON-01',
    uptime: 3600000,
    metrics: { cpu: 2, memory: 12, tasksProcessed: 1250, errorsHandled: 0 },
    subSystems: []
  },
  pineconeStats: { totalVectors: 52573 },
  liveFeed: [],
  healingEvents: DUMMY_HEALING_EVENTS,
  insights: [],
  thoughtFlow: [],
  activeThought: null,
  testCases: DUMMY_TEST_CASES,
  testRuns: DUMMY_TEST_RUNS,
  projects: DUMMY_PROJECTS,

  runTest: (id: string | string[]) => {
    // Simulate triggering a test run
    set(state => ({
      testRuns: [{
        id: `run_sim_${Math.floor(Math.random()*1000)}`,
        name: 'Manual Override Run',
        status: 'running',
        progress: 0,
        totalTests: Array.isArray(id) ? id.length : 1,
        passedTests: 0,
        failedTests: 0,
        duration: '0s',
        startedAt: 'Just now',
        branch: 'main',
        commit: 'dirty',
        browser: 'chrome',
        triggeredBy: 'Architect',
        parallelism: 1
      }, ...state.testRuns]
    }));
  },

  generateTest: async (prompt: string) => {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(`// Auto-Generated Logic Node for: ${prompt}
import { test, expect } from '@playwright/test';

test('Autonomous Verification: ${prompt.slice(0, 20)}...', async ({ page }) => {
  // AETERNA: ZERO ENTROPY INITIATED
  await page.goto('/');
  // Substrate verification logic injected
  await expect(page.locator('body')).toBeVisible();
});`);
      }, 1500);
    });
  },

  connect: (url?: string) => {
    const wsUrl = url || process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3401/';
    
    let finalUrl = wsUrl;
    if (typeof window !== 'undefined' && window.location.protocol === 'https:' && finalUrl.startsWith('ws://') && !finalUrl.includes('localhost')) {
       finalUrl = finalUrl.replace('ws://', 'wss://');
    }

    const currentWs = get()._ws;
    if (currentWs) return;

    try {
      const ws = new WebSocket(finalUrl);

      ws.onopen = () => {
        set({ isConnected: true, _ws: ws });
        console.log('[NexusStore] Connected to OmniCore telemetry');
      };

      ws.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          if (raw.type === 'FEED_EVENT') {
             set((state) => ({ liveFeed: [raw.data, ...state.liveFeed].slice(0, 100) }));
          } else if (raw.type === 'DAEMON_STATUS') {
             set({ daemonStatus: raw.data });
          } else if (raw.type === 'SYSTEM_HEALTH') {
             set({ systemHealth: raw.data });
          } else if (raw.type === 'PINECONE_STATS') {
             set({ pineconeStats: raw.data });
          } else if (raw.type === 'HEALING_EVENT') {
             set((state) => ({ healingEvents: [raw.data, ...state.healingEvents].slice(0, 50) }));
          } else if (raw.type === 'THOUGHT') {
             set((state) => ({ 
               thoughtFlow: [raw.data, ...state.thoughtFlow].slice(0, 50),
               activeThought: raw.data
             }));
          } else if (raw.type === 'TEST_RUNS_SYNC') {
             set({ testRuns: raw.data });
          } else if (raw.type === 'TEST_CASES_SYNC') {
             set({ testCases: raw.data });
          } else if (raw.type === 'PROJECTS_SYNC') {
             set({ projects: raw.data });
          }
        } catch (e) {
          // ignore parse errors
        }
      };

      ws.onclose = () => {
        set({ isConnected: false, _ws: null });
        setTimeout(() => get().connect(url), 5000); 
      };

      ws.onerror = () => {
        set({ isConnected: false });
      };
      
    } catch(err) {
       console.error('[NexusStore] failed to initialize socket', err);
    }
  },

  disconnect: () => {
    const ws = get()._ws;
    if (ws) {
      ws.close();
    }
    set({ isConnected: false, _ws: null });
  },

  toggleHealing: () => {
  }
}));

export const useNexusStore = () => useStore((s) => ({ isConnected: s.isConnected, connect: s.connect, disconnect: s.disconnect, runTest: s.runTest, generateTest: s.generateTest }));
export const useSystemHealth = () => useStore((s) => s.systemHealth);
export const useDaemonStatus = () => useStore((s) => s.daemonStatus);
export const usePineconeStats = () => useStore((s) => s.pineconeStats);
export const useHealingEvents = () => useStore((s) => s.healingEvents);
export const useLiveFeed = () => useStore((s) => s.liveFeed);
export const useInsights = () => useStore((s) => s.insights);
export const useThoughtFlow = () => useStore((s) => s.thoughtFlow);
export const useActiveThought = () => useStore((s) => s.activeThought);
export const useAutoHealing = () => ({ isActive: true, toggleHealing: useStore((s) => s.toggleHealing), recentEvents: useStore((s) => s.healingEvents) });

export const useNexusConnection = () => {
  const connect = useStore((s) => s.connect);
  const disconnect = useStore((s) => s.disconnect);
};
