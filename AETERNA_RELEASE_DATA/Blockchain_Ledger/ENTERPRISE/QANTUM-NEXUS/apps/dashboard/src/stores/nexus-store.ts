import { create } from 'zustand';

// Types & Enums
export type DaemonState = 'IDLE' | 'ACTIVE' | 'HEALING' | 'ERROR';
export type InsightSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ThoughtType = 'PLAN' | 'ACTION' | 'REFLECTION' | 'HEALING';

interface SystemHealth {
  cpu: number;
  memory: number;
  disk: number;
  network: number;
}

interface Daemon {
  id: string;
  name: string;
  state: DaemonState;
  lastActive: string;
}

interface LiveFeedItem {
  id: string;
  severity: InsightSeverity;
  message: string;
  timestamp: string;
}

interface NexusState {
  health: SystemHealth;
  daemons: Daemon[];
  liveFeed: LiveFeedItem[];
  autoHealing: boolean;
  pinecone: {
    vectors: number;
    dimension: number;
    usage: number;
  };
  healingEvents: Array<{
    id: string;
    type: string;
    timestamp: string;
    status: 'fixed' | 'pending';
  }>;
  setHealth: (health: Partial<SystemHealth>) => void;
  updateDaemon: (id: string, state: DaemonState) => void;
  toggleAutoHealing: () => void;
}

export const useNexusStore = create<NexusState>((set) => ({
  health: {
    cpu: 45,
    memory: 67,
    disk: 23,
    network: 100,
  },
  daemons: [
    { id: '1', name: 'Neural Bridge', state: 'ACTIVE', lastActive: 'now' },
    { id: '2', name: 'Veritas Watcher', state: 'HEALING', lastActive: '2m ago' },
  ],
  liveFeed: [
    { id: 'l1', severity: 'HIGH', message: 'Neural Link Latency Peak', timestamp: '10s ago' },
    { id: 'l2', severity: 'LOW', message: 'Memory Optimized', timestamp: '1m ago' },
  ],
  autoHealing: true,
  pinecone: {
    vectors: 125043,
    dimension: 1536,
    usage: 89,
  },
  healingEvents: [
    { id: 'h1', type: 'Cache Overflow', timestamp: '10m ago', status: 'fixed' },
  ],
  setHealth: (health) => set((state) => ({ health: { ...state.health, ...health } })),
  updateDaemon: (id, state) => set((s) => ({
    daemons: s.daemons.map(d => d.id === id ? { ...d, state } : d)
  })),
  toggleAutoHealing: () => set((s) => ({ autoHealing: !s.autoHealing })),
}));

// Selectors for optimized re-renders
export const useSystemHealth = () => useNexusStore((state) => state.health);
export const useDaemonStatus = () => useNexusStore((state) => state.daemons);
export const usePineconeStats = () => useNexusStore((state) => state.pinecone);
export const useHealingEvents = () => useNexusStore((state) => state.healingEvents);
export const useLiveFeed = () => useNexusStore((state) => state.liveFeed);
export const useAutoHealing = () => useNexusStore((state) => state.autoHealing);

export { type Daemon as DaemonType };
