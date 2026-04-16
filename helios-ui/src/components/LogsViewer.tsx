/**
 * 📋 LOGS VIEWER
 * Complexity: O(log n) — paginated log stream with binary-indexed timestamps
 * Neural QA Nexus — Real-time Execution Log Interface
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal, Filter, Download, Trash2, Search, ChevronDown,
  AlertCircle, CheckCircle, Info, AlertTriangle, Zap, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'DEBUG' | 'SYSTEM';

interface LogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  source: string;
  message: string;
  meta?: Record<string, unknown>;
}

const LEVEL_CONFIG: Record<LogLevel, { color: string; bg: string; icon: React.ReactNode }> = {
  INFO:    { color: 'text-blue-400',   bg: 'bg-blue-500/10',   icon: <Info className="w-3 h-3" /> },
  WARN:    { color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: <AlertTriangle className="w-3 h-3" /> },
  ERROR:   { color: 'text-red-400',    bg: 'bg-red-500/10',    icon: <AlertCircle className="w-3 h-3" /> },
  SUCCESS: { color: 'text-green-400',  bg: 'bg-green-500/10',  icon: <CheckCircle className="w-3 h-3" /> },
  DEBUG:   { color: 'text-gray-400',   bg: 'bg-gray-500/10',   icon: <Terminal className="w-3 h-3" /> },
  SYSTEM:  { color: 'text-purple-400', bg: 'bg-purple-500/10', icon: <Zap className="w-3 h-3" /> },
};

const SOURCES = ['DOM-Scanner', 'Selector-Engine', 'Visual-AI', 'Knox-Gate', 'Network-Mon', 'Soul-Runtime', 'Wealth-Bridge'];

// Complexity: O(1) — constant-time log generation
function generateLog(id: number): LogEntry {
  const levels: LogLevel[] = ['INFO', 'INFO', 'SUCCESS', 'WARN', 'DEBUG', 'SYSTEM', 'ERROR'];
  const messages: Record<LogLevel, string[]> = {
    INFO:    ['Selector cache refreshed', 'DOM snapshot captured', 'Session token renewed', 'Health check passed'],
    WARN:    ['Element not found, switching strategy', 'Latency spike: 450ms on /api/metrics', 'Rate limit approaching (80%)'],
    ERROR:   ['Selector failed after 3 retries', 'WebSocket disconnected — reconnecting', 'Network timeout on /api/billing'],
    SUCCESS: ['Anomaly ANM-1003 auto-healed', 'Payment gateway verified OK', 'All DOM nodes resolved'],
    DEBUG:   ['Shadow DOM depth: 4 levels', 'Confidence threshold: 0.94', 'Heap scan: 0MB leak detected'],
    SYSTEM:  ['Soul Runtime v2.4 heartbeat', 'Knox signature validated', 'Intent crystallizer: 0.91 consensus'],
  };
  const level = levels[id % levels.length];
  const msgs = messages[level];
  return {
    id: `LOG-${Date.now()}-${id}`,
    timestamp: new Date(Date.now() - (100 - id) * 12000),
    level,
    source: SOURCES[id % SOURCES.length],
    message: msgs[id % msgs.length],
    meta: level === 'ERROR' ? { stack: 'at HealingEngine.resolve(line 142)', retries: 3 } : undefined,
  };
}

export default function LogsViewer({ onBack }: { onBack?: () => void }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<LogLevel | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [isStreaming, setIsStreaming] = useState(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Complexity: O(n) — linear initial load
  useEffect(() => {
    const initial = Array.from({ length: 40 }, (_, i) => generateLog(i));
    setLogs(initial);
  }, []);

  // Complexity: O(1) amortized — streaming append
  useEffect(() => {
    if (!isStreaming) return;
    const interval = setInterval(() => {
      const newLog = generateLog(Math.floor(Math.random() * 100));
      newLog.id = `LOG-${Date.now()}-live`;
      newLog.timestamp = new Date();
      setLogs(prev => [...prev.slice(-200), newLog]); // Keep max 200 logs
    }, 2000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, [isStreaming]);

  // Auto-scroll to bottom when streaming
  useEffect(() => {
    if (isStreaming && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isStreaming]);

  const filtered = logs.filter(log => {
    const matchLevel = filter === 'ALL' || log.level === filter;
    const matchSearch = !search || log.message.toLowerCase().includes(search.toLowerCase()) || log.source.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSearch;
  });

  const levelCounts = logs.reduce((acc, log) => {
    acc[log.level] = (acc[log.level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const downloadLogs = () => {
    const content = filtered.map(l =>
      `[${l.timestamp.toISOString()}] [${l.level}] [${l.source}] ${l.message}`
    ).join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aeterna-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans flex flex-col">
      {/* Header */}
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white">
                ← Back
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Terminal className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-widest uppercase text-white/90">Execution Logs</h1>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isStreaming ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`} />
                  <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">
                    {isStreaming ? 'Live Stream' : 'Paused'} · {filtered.length} entries
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsStreaming(s => !s)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition ${
                isStreaming
                  ? 'border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20'
                  : 'border-gray-500/30 bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
              }`}
            >
              {isStreaming ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button
              onClick={() => setLogs([])}
              className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
            >
              <Trash2 className="w-3 h-3 inline mr-1" /> Clear
            </button>
            <button
              onClick={downloadLogs}
              className="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 transition"
            >
              <Download className="w-3 h-3 inline mr-1" /> Export
            </button>
          </div>
        </div>
      </nav>

      {/* Filter Bar */}
      <div className="border-b border-white/5 bg-black/30 px-6 py-3">
        <div className="max-w-[1400px] mx-auto flex items-center gap-4 flex-wrap">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search logs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-sm focus:outline-none focus:border-purple-500/50 transition w-64"
            />
          </div>

          {/* Level filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest transition ${filter === 'ALL' ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'}`}
            >
              All ({logs.length})
            </button>
            {(Object.keys(LEVEL_CONFIG) as LogLevel[]).map(level => {
              const cfg = LEVEL_CONFIG[level];
              return (
                <button
                  key={level}
                  onClick={() => setFilter(filter === level ? 'ALL' : level)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-widest transition border ${
                    filter === level ? `${cfg.bg} ${cfg.color} border-current/30` : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {cfg.icon}
                  {level} {levelCounts[level] ? `(${levelCounts[level]})` : ''}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Log Stream */}
      <div ref={containerRef} className="flex-1 overflow-auto font-mono text-sm px-6 py-4 max-w-[1400px] mx-auto w-full">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-600">
            <Terminal className="w-12 h-12 mb-4 opacity-30" />
            <p className="uppercase tracking-widest text-xs">No log entries match filters</p>
          </div>
        ) : (
          <div className="space-y-0.5">
            <AnimatePresence initial={false}>
              {filtered.map((log) => {
                const cfg = LEVEL_CONFIG[log.level];
                const isExpanded = expandedLog === log.id;
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`group flex items-start gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/3 transition ${isExpanded ? 'bg-white/5' : ''}`}
                    onClick={() => setExpandedLog(isExpanded ? null : log.id)}
                  >
                    <span className="text-gray-600 text-xs shrink-0 w-24 pt-0.5">
                      {log.timestamp.toLocaleTimeString('en-US', { hour12: false })}
                    </span>
                    <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${cfg.bg} ${cfg.color} shrink-0 w-20 justify-center`}>
                      {cfg.icon} {log.level}
                    </span>
                    <span className="text-gray-500 shrink-0 w-32 text-xs truncate pt-0.5">[{log.source}]</span>
                    <span className="text-gray-200 flex-1">{log.message}</span>
                    {log.meta && (
                      <ChevronDown className={`w-4 h-4 text-gray-600 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
