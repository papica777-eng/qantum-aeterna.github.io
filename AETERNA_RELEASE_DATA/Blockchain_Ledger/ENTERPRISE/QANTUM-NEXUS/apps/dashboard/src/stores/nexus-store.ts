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
  activeThought: any;
  connect: (url?: string) => void;
  disconnect: () => void;
  toggleHealing: () => void;
  _ws: WebSocket | null;
}

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
  healingEvents: [],
  insights: [],
  thoughtFlow: [],
  activeThought: null,

  connect: (url = 'ws://localhost:3401/') => {
    const currentWs = get()._ws;
    if (currentWs) return; // Already connected or connecting

    try {
      const ws = new WebSocket(url);
      
      ws.onopen = () => {
        set({ isConnected: true, _ws: ws });
        console.log('[NexusStore] Connected to OmniCore telemetry');
      };

      ws.onmessage = (event) => {
        try {
          const raw = JSON.parse(event.data);
          // Handle telemetry updates dynamically
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
          }
        } catch (e) {
          // ignore parse errors
        }
      };

      ws.onclose = () => {
        set({ isConnected: false, _ws: null });
        setTimeout(() => get().connect(url), 5000); // Reconnect loop
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
     // example action
  }
}));

// Provide individual hooks for component backward compatibility
export const useNexusStore = () => useStore((s) => ({ isConnected: s.isConnected, connect: s.connect, disconnect: s.disconnect }));
export const useSystemHealth = () => useStore((s) => s.systemHealth);
export const useDaemonStatus = () => useStore((s) => s.daemonStatus);
export const usePineconeStats = () => useStore((s) => s.pineconeStats);
export const useHealingEvents = () => useStore((s) => s.healingEvents);
export const useLiveFeed = () => useStore((s) => s.liveFeed);
export const useInsights = () => useStore((s) => s.insights);
export const useThoughtFlow = () => useStore((s) => s.thoughtFlow);
export const useActiveThought = () => useStore((s) => s.activeThought);
export const useAutoHealing = () => ({ isActive: true, toggleHealing: useStore((s) => s.toggleHealing), recentEvents: useStore((s) => s.healingEvents) });

// Add a default background effect hook to connect on mount
export const useNexusConnection = () => {
  const connect = useStore((s) => s.connect);
  const disconnect = useStore((s) => s.disconnect);
  // Auto connect if not connected? Handled by a provider or layout usually.
};
