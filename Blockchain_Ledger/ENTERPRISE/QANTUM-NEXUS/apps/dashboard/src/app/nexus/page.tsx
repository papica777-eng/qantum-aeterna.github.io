'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Activity, Database, Shield, Zap,
  Network, Settings, RefreshCw, Sparkles,
  Cpu, Eye, Ghost, BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useNexusStore,
  useSystemHealth,
  useDaemonStatus,
  usePineconeStats,
  useHealingEvents,
  DaemonState
} from '@/stores/nexus-store';

import DashboardLayout from '@/components/layout/dashboard-layout';

// AI Core Components
import { AutonomousThoughtVisualizer } from '@/components/nexus/ai-core/autonomous-thought-visualizer';
import { SupremeMeditationDashboard } from '@/components/nexus/ai-core/supreme-meditation-dashboard';
import { EternalMemoryExplorer } from '@/components/nexus/ai-core/eternal-memory-explorer';
import { NeuralCoreFeed } from '@/components/nexus/ai-core/neural-core-feed';

// Daemon Components
import { MegaDaemonConsole } from '@/components/nexus/daemons/mega-daemon-console';

// Operations Components
import { SelfHealingWatcher } from '@/components/nexus/operations/self-healing-watcher';
import { LiveFeedPanel } from '@/components/nexus/operations/live-feed-panel';

// Multimodal Components
import { MisterMindChat } from '@/components/nexus/multimodal/mister-mind-chat';

type TabId = 'overview' | 'thoughts' | 'meditation' | 'memory' | 'daemons' | 'healing';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
  description: string;
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', icon: Activity, description: 'System Dashboard' },
  { id: 'thoughts', label: 'Autonomous Thought', icon: Brain, description: 'Decision Flow' },
  { id: 'meditation', label: 'Supreme Meditation', icon: Zap, description: 'Meta Insights' },
  { id: 'memory', label: 'Eternal Memory', icon: Database, description: '52K+ Vectors' },
  { id: 'daemons', label: 'Mega Daemon', icon: Shield, description: 'Orchestration' },
  { id: 'healing', label: 'Self-Healing', icon: RefreshCw, description: 'Auto Repair' },
];

export default function NexusPage() {
  const [activeTab, setActiveTab] = React.useState<TabId>('overview');
  const { connect, disconnect, isConnected } = useNexusStore();
  const systemHealth = useSystemHealth();

  React.useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  const getStatusColor = () => {
    if (systemHealth.overall >= 80) return 'text-emerald-400';
    if (systemHealth.overall >= 50) return 'text-amber-400';
    return 'text-red-400';
  };

  const getStatusBg = () => {
    if (systemHealth.overall >= 80) return 'bg-emerald-500/20 border-emerald-500/30';
    if (systemHealth.overall >= 50) return 'bg-amber-500/20 border-amber-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hub Header Integration */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-violet-600/10 to-transparent border border-violet-500/20">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-violet-600 shadow-lg shadow-violet-600/20">
              <Network className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">NEXUS CORE MODULE</h2>
              <p className="text-sm text-slate-400">Neural Integration v34.1 • ALPHA_ACCESS</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <div className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg border backdrop-blur-sm',
                getStatusBg()
              )}>
                <span className={cn('text-xs font-bold', getStatusColor())}>
                  {systemHealth.overall >= 80 ? 'HEALTHY' : 
                   systemHealth.overall >= 50 ? 'DEGRADED' : 'CRITICAL'}
                </span>
                <span className="text-sm font-bold text-white">
                  {systemHealth.overall}%
                </span>
              </div>
              <div className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold border',
                  isConnected
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400'
                )}>
                {isConnected ? 'LIVE' : 'OFFLINE'}
              </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex gap-2 overflow-x-auto pb-2 noscrollbar">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap border',
                activeTab === tab.id
                  ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-600/20'
                  : 'text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800/50'
              )}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Main Hub Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && <OverviewTab />}
            {activeTab === 'thoughts' && <AutonomousThoughtVisualizer />}
            {activeTab === 'meditation' && <SupremeMeditationDashboard />}
            {activeTab === 'memory' && <MemoryTab />}
            {activeTab === 'daemons' && <MegaDaemonConsole />}
            {activeTab === 'healing' && <HealingTab />}
          </motion.div>
        </AnimatePresence>

        {/* Mister Mind Chat Widget */}
        <MisterMindChat />
      </div>
    </DashboardLayout>
  );
}

// ============ OVERVIEW TAB ============
function OverviewTab() {
  const systemHealth = useSystemHealth();
  const daemonStatus = useDaemonStatus();
  const pineconeStats = usePineconeStats();
  const healingEvents = useHealingEvents();

  const stats = [
    { 
      label: 'System Health', 
      value: `${systemHealth?.overall ?? 100}%`, 
      icon: Activity,
      color: (systemHealth?.overall ?? 100) >= 80 ? 'text-emerald-400' : 'text-amber-400',
      bg: 'from-emerald-500/20'
    },
    { 
      label: 'Daemon Status', 
      value: daemonStatus?.state ?? 'ACTIVE', 
      icon: Shield,
      color: 'text-violet-400',
      bg: 'from-violet-500/20'
    },
    { 
      label: 'Vectors', 
      value: (pineconeStats?.totalVectors ?? 52573).toLocaleString(), 
      icon: Database,
      color: 'text-cyan-400',
      bg: 'from-cyan-500/20'
    },
    { 
      label: 'Auto-Healed', 
      value: (healingEvents?.length ?? 0).toString(), 
      icon: RefreshCw,
      color: 'text-pink-400',
      bg: 'from-pink-500/20'
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={cn(
              'relative p-6 rounded-2xl border border-white/5 overflow-hidden',
              'bg-[#0d0d12]',
              'hover:border-violet-500/30 transition-all group'
            )}
          >
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={cn('h-6 w-6', stat.color)} />
                <Sparkles className="h-4 w-4 text-white/10" />
              </div>
              <p className="text-3xl font-black text-white mb-1 tracking-tight">{stat.value}</p>
              <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <LiveFeedPanel />
          <AutonomousThoughtVisualizer />
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <MegaDaemonConsole />
          <NeuralCoreFeed />
        </div>
      </div>
    </div>
  );
}

// ============ MEMORY TAB ============
function MemoryTab() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8">
        <EternalMemoryExplorer />
      </div>
      <div className="col-span-12 lg:col-span-4">
        <NeuralCoreFeed />
      </div>
    </div>
  );
}

// ============ HEALING TAB ============
function HealingTab() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-8">
        <SelfHealingWatcher />
      </div>
      <div className="col-span-12 lg:col-span-4">
        <LiveFeedPanel />
      </div>
    </div>
  );
}
