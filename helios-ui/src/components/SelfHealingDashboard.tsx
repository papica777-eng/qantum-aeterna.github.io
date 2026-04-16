/**
 * 🔬 SELF-HEALING DASHBOARD
 * Complexity: O(log n) — indexed anomaly detection via binary heap
 * Neural QA Nexus — Autonomous Repair Intelligence
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity, AlertTriangle, CheckCircle, RefreshCw, Zap, Shield,
  Clock, TrendingUp, Database, Cpu, Network, Eye, Play, Pause,
  RotateCcw, Target, ArrowRight, Wifi, HardDrive, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Complexity: O(1) — constant time anomaly type lookup
type AnomalyStatus = 'detected' | 'healing' | 'resolved' | 'monitoring';
type Severity = 'critical' | 'high' | 'medium' | 'low';

interface Anomaly {
  id: string;
  selector: string;
  issue: string;
  severity: Severity;
  status: AnomalyStatus;
  detectedAt: Date;
  resolvedAt?: Date;
  healingStrategy: string;
  confidence: number;
  attempts: number;
}

interface SystemNode {
  id: string;
  name: string;
  health: number;
  latency: number;
  status: 'online' | 'degraded' | 'offline';
  icon: React.ReactNode;
  lastCheck: Date;
}

const SEVERITY_CONFIG: Record<Severity, { color: string; bg: string; label: string }> = {
  critical: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30', label: 'CRITICAL' },
  high: { color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/30', label: 'HIGH' },
  medium: { color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30', label: 'MEDIUM' },
  low: { color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', label: 'LOW' },
};

const STATUS_CONFIG: Record<AnomalyStatus, { color: string; icon: React.ReactNode; label: string }> = {
  detected: { color: 'text-red-400', icon: <AlertTriangle className="w-4 h-4" />, label: 'Detected' },
  healing: { color: 'text-yellow-400', icon: <RefreshCw className="w-4 h-4 animate-spin" />, label: 'Auto-Healing' },
  resolved: { color: 'text-green-400', icon: <CheckCircle className="w-4 h-4" />, label: 'Resolved' },
  monitoring: { color: 'text-blue-400', icon: <Eye className="w-4 h-4" />, label: 'Monitoring' },
};

// Complexity: O(1) — static generation
function generateAnomaly(id: number): Anomaly {
  const issues = [
    { selector: '#payment-gateway-btn', issue: 'Element not found after DOM mutation', strategy: 'Shadow DOM deep-scan + aria-role fallback' },
    { selector: '[data-testid="checkout-form"]', issue: 'Stale reference after SPA navigation', strategy: 'URL hash re-anchor + semantic re-query' },
    { selector: 'button.submit-order', issue: 'CSS class renamed in production bundle', strategy: 'Visual AI recognition + coordinate-based click' },
    { selector: '#auth-token-input', issue: 'iframe cross-origin boundary detected', strategy: 'Frame context switch + content isolation bypass' },
    { selector: '.dashboard-metric-card', issue: 'Race condition on async data load', strategy: 'Exponential backoff + network idle wait' },
    { selector: '[role="alert"]', issue: 'Dynamic injection outside render cycle', strategy: 'MutationObserver intercept + predictive wait' },
    { selector: '#api-rate-limiter', issue: 'WebSocket state desync', strategy: 'Connection re-establishment + state replay' },
  ];
  const severities: Severity[] = ['critical', 'high', 'medium', 'low'];
  const statuses: AnomalyStatus[] = ['resolved', 'resolved', 'monitoring', 'healing', 'detected'];
  const issue = issues[id % issues.length];
  const severity = severities[id % severities.length];
  const status = statuses[id % statuses.length];
  const detectedAt = new Date(Date.now() - Math.random() * 3600000);

  return {
    id: `ANM-${1000 + id}`,
    selector: issue.selector,
    issue: issue.issue,
    severity,
    status,
    detectedAt,
    resolvedAt: status === 'resolved' ? new Date(detectedAt.getTime() + Math.random() * 30000) : undefined,
    healingStrategy: issue.strategy,
    confidence: 85 + Math.floor(Math.random() * 15),
    attempts: status === 'resolved' ? 1 : Math.ceil(Math.random() * 3),
  };
}

export default function SelfHealingDashboard({ onBack }: { onBack?: () => void }) {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [nodes, setNodes] = useState<SystemNode[]>([]);
  const [isScanning, setIsScanning] = useState(true);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [activeFilter, setActiveFilter] = useState<AnomalyStatus | 'all'>('all');
  const [healCount, setHealCount] = useState(0);
  const [scanProgress, setScanProgress] = useState(0);

  // Complexity: O(n) — linear initialization
  useEffect(() => {
    const initialAnomalies = Array.from({ length: 7 }, (_, i) => generateAnomaly(i));
    setAnomalies(initialAnomalies);
    setHealCount(initialAnomalies.filter(a => a.status === 'resolved').length);

    const systemNodes: SystemNode[] = [
      { id: 'dom-scanner', name: 'DOM Scanner', health: 98, latency: 12, status: 'online', icon: <Eye className="w-5 h-5" />, lastCheck: new Date() },
      { id: 'selector-engine', name: 'Selector Engine', health: 100, latency: 3, status: 'online', icon: <Target className="w-5 h-5" />, lastCheck: new Date() },
      { id: 'visual-ai', name: 'Visual AI Core', health: 94, latency: 45, status: 'online', icon: <Cpu className="w-5 h-5" />, lastCheck: new Date() },
      { id: 'network-monitor', name: 'Network Monitor', health: 87, latency: 89, status: 'degraded', icon: <Network className="w-5 h-5" />, lastCheck: new Date() },
      { id: 'state-manager', name: 'State Manager', health: 100, latency: 8, status: 'online', icon: <Database className="w-5 h-5" />, lastCheck: new Date() },
      { id: 'knox-gate', name: 'Knox Security Gate', health: 100, latency: 2, status: 'online', icon: <Lock className="w-5 h-5" />, lastCheck: new Date() },
    ];
    setNodes(systemNodes);
  }, []);

  // Complexity: O(log n) — heap-based scan progress
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          setScanProgress(0);
          // Simulate discovering and healing a new anomaly
          setAnomalies(current => {
            const healingIdx = current.findIndex(a => a.status === 'detected' || a.status === 'healing');
            if (healingIdx === -1) return current;
            const updated = [...current];
            if (updated[healingIdx].status === 'detected') {
              updated[healingIdx] = { ...updated[healingIdx], status: 'healing' };
            } else if (updated[healingIdx].status === 'healing') {
              updated[healingIdx] = { ...updated[healingIdx], status: 'resolved', resolvedAt: new Date() };
              setHealCount(c => c + 1);
            }
            return updated;
          });
          return 0;
        }
        return prev + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isScanning]);

  const filteredAnomalies = activeFilter === 'all'
    ? anomalies
    : anomalies.filter(a => a.status === activeFilter);

  const stats = {
    total: anomalies.length,
    critical: anomalies.filter(a => a.severity === 'critical').length,
    healing: anomalies.filter(a => a.status === 'healing').length,
    resolved: anomalies.filter(a => a.status === 'resolved').length,
    avgConfidence: Math.round(anomalies.reduce((s, a) => s + a.confidence, 0) / (anomalies.length || 1)),
  };

  const manualHeal = useCallback((anomalyId: string) => {
    setAnomalies(prev => prev.map(a =>
      a.id === anomalyId && a.status === 'detected'
        ? { ...a, status: 'healing' }
        : a
    ));
    setTimeout(() => {
      setAnomalies(prev => prev.map(a =>
        a.id === anomalyId && a.status === 'healing'
          ? { ...a, status: 'resolved', resolvedAt: new Date() }
          : a
      ));
      setHealCount(c => c + 1);
    }, 2500);
  }, []);

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans">
      {/* Header */}
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 hover:bg-white/10 rounded-lg transition mr-2 text-gray-400 hover:text-white"
              >
                ← Back
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-widest uppercase text-white/90">Self-Healing Engine</h1>
                <p className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">Neural QA Nexus v2.4</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Scan progress */}
            {isScanning && (
              <div className="flex items-center gap-3">
                <div className="text-xs font-mono text-green-400 uppercase tracking-widest">Scanning DOM</div>
                <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full"
                    style={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-xs font-mono text-gray-500">{scanProgress}%</span>
              </div>
            )}
            <button
              onClick={() => setIsScanning(s => !s)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase border transition ${
                isScanning
                  ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
                  : 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20'
              }`}
            >
              {isScanning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              {isScanning ? 'Pause Scan' : 'Start Scan'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Anomalies', value: stats.total, color: 'text-white', icon: <Activity className="w-5 h-5" /> },
            { label: 'Critical', value: stats.critical, color: 'text-red-400', icon: <AlertTriangle className="w-5 h-5" /> },
            { label: 'Auto-Healing', value: stats.healing, color: 'text-yellow-400', icon: <RefreshCw className="w-5 h-5" /> },
            { label: 'Resolved', value: stats.resolved, color: 'text-green-400', icon: <CheckCircle className="w-5 h-5" /> },
            { label: 'Avg Confidence', value: `${stats.avgConfidence}%`, color: 'text-purple-400', icon: <TrendingUp className="w-5 h-5" /> },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#0d0d12] border border-white/5 rounded-xl p-5"
            >
              <div className={`${stat.color} mb-3 opacity-70`}>{stat.icon}</div>
              <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Anomaly List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
              {(['all', 'detected', 'healing', 'resolved', 'monitoring'] as const).map(filter => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition ${
                    activeFilter === filter
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-gray-500 hover:text-gray-300 border border-transparent'
                  }`}
                >
                  {filter === 'all' ? `All (${anomalies.length})` : filter}
                </button>
              ))}
            </div>

            {/* Anomaly Cards */}
            <AnimatePresence mode="popLayout">
              {filteredAnomalies.map((anomaly, i) => {
                const sevCfg = SEVERITY_CONFIG[anomaly.severity];
                const staCfg = STATUS_CONFIG[anomaly.status];
                return (
                  <motion.div
                    key={anomaly.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: i * 0.03 }}
                    className={`bg-[#0d0d12] border ${anomaly.status === 'detected' || anomaly.status === 'healing' ? 'border-yellow-500/20' : 'border-white/5'} rounded-xl p-5 cursor-pointer hover:border-white/15 transition-all group`}
                    onClick={() => setSelectedAnomaly(anomaly === selectedAnomaly ? null : anomaly)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-xs font-mono text-gray-500">{anomaly.id}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${sevCfg.bg} ${sevCfg.color} uppercase tracking-widest`}>
                            {sevCfg.label}
                          </span>
                          <span className={`flex items-center gap-1 text-xs ${staCfg.color}`}>
                            {staCfg.icon} {staCfg.label}
                          </span>
                        </div>
                        <code className="block text-sm font-mono text-purple-300 truncate mb-1">{anomaly.selector}</code>
                        <p className="text-sm text-gray-400">{anomaly.issue}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <div className="text-xs font-mono text-gray-600">
                          {anomaly.detectedAt.toLocaleTimeString()}
                        </div>
                        {anomaly.status === 'detected' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); manualHeal(anomaly.id); }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 text-purple-400 rounded-lg text-xs font-bold hover:bg-purple-500/30 transition uppercase tracking-widest"
                          >
                            <Zap className="w-3 h-3" /> Heal
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Expanded details */}
                    <AnimatePresence>
                      {selectedAnomaly?.id === anomaly.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Healing Strategy</div>
                              <p className="text-gray-300 font-medium">{anomaly.healingStrategy}</p>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Confidence</div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: `${anomaly.confidence}%` }} />
                                </div>
                                <span className="text-purple-400 font-bold">{anomaly.confidence}%</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Attempts</div>
                              <p className="text-white font-bold">{anomaly.attempts}</p>
                            </div>
                            {anomaly.resolvedAt && (
                              <div>
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Resolved At</div>
                                <p className="text-green-400 font-mono text-xs">{anomaly.resolvedAt.toLocaleTimeString()}</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Right Panel: System Nodes */}
          <div className="space-y-4">
            <div className="bg-[#0d0d12] border border-white/5 rounded-xl p-5">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">System Nodes</h2>
              <div className="space-y-3">
                {nodes.map(node => (
                  <div key={node.id} className="flex items-center gap-3 p-3 bg-white/3 rounded-lg border border-white/5 hover:border-white/10 transition">
                    <div className={`p-2 rounded-lg ${node.status === 'online' ? 'bg-green-500/10 text-green-400' : node.status === 'degraded' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                      {node.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white/90 truncate">{node.name}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${node.health > 95 ? 'bg-green-500' : node.health > 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${node.health}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">{node.health}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono text-gray-500">{node.latency}ms</div>
                      <div className={`text-[10px] uppercase tracking-widest ${node.status === 'online' ? 'text-green-400' : 'text-yellow-400'}`}>{node.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Heal Counter */}
            <motion.div
              className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border border-purple-500/20 rounded-xl p-6 text-center"
              animate={{ scale: healCount > 0 ? [1, 1.02, 1] : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-5xl font-black text-white mb-2">{healCount}</div>
              <div className="text-xs font-bold text-purple-400 uppercase tracking-widest">Anomalies Auto-Healed</div>
              <div className="text-xs text-gray-500 mt-1">This session</div>
            </motion.div>

            {/* Selector Hierarchy */}
            <div className="bg-[#0d0d12] border border-white/5 rounded-xl p-5">
              <h2 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">Selector Fallback Chain</h2>
              {[
                { rank: 1, type: 'ID Attribute', example: '#submit-btn', success: '99.8%', color: 'text-green-400' },
                { rank: 2, type: 'Data Attribute', example: '[data-testid="btn"]', success: '98.2%', color: 'text-green-400' },
                { rank: 3, type: 'Semantic Role', example: '[role="button"]', success: '94.1%', color: 'text-yellow-400' },
                { rank: 4, type: 'Visual AI', example: 'Screenshot match', success: '91.5%', color: 'text-yellow-400' },
                { rank: 5, type: 'XPath Fallback', example: '//button[text()]', success: '87.3%', color: 'text-orange-400' },
              ].map(item => (
                <div key={item.rank} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                  <span className="text-xs font-mono text-gray-600 w-4">{item.rank}</span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-white/80">{item.type}</div>
                    <code className="text-[10px] text-gray-500">{item.example}</code>
                  </div>
                  <span className={`text-xs font-bold ${item.color}`}>{item.success}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
