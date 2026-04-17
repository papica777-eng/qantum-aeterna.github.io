'use client';
import { useStore } from '@/stores/nexus-store';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Eye, 
  Zap, 
  Lock, 
  AlertTriangle, 
  CheckCircle2, 
  Activity,
  Cpu,
  HardDrive,
  Database,
  GitBranch,
  Radio,
  RefreshCw,
  Play,
  Pause,
  Terminal,
  Send,
  X,
  Wifi,
  WifiOff
} from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════════
// BOOT SEQUENCE & COMMANDS
// ═══════════════════════════════════════════════════════════════════════════════

const BOOT_SEQUENCE = [
  "INITIALIZING SYSTEM DIAGNOSTICS...",
  "LOADING TELEMETRY MODULES... OK",
  "ACTIVATING SURVEILLANCE NETWORK... OK", 
  "AWAITING CONNECTIONS."
];

const WATCHDOG_COMMANDS: Record<string, () => string> = {
  help: () => `
╔═══════════════════════════════════════════════════════════════╗
║              🛡️ ETERNAL WATCHDOG COMMANDS                     ║
╠═══════════════════════════════════════════════════════════════╣
║  help        - Показва тази помощ                             ║
║  status      - Статус на Дежурния                             ║
║  patrol      - Стартира патрул                                ║
║  prisoners   - Списък на затворниците                         ║
║  health      - Проверка на здравето                           ║
║  stats       - Статистика                                     ║
║  teleport    - Телепортира се до проблем                      ║
║  clear       - Изчиства терминала                             ║
╚═══════════════════════════════════════════════════════════════╝`,
  status: () => `
🛡️ ETERNAL WATCHDOG STATUS: RUNNING NATIVE`,
  patrol: () => `
👁️ PATROL INITIATED -> AWAITING STREAM...`,
  clear: () => `CLEAR`,
};

// Default static fallback state
const WATCHDOG_STATE_DEFAULT = {
  status: 'PATROLLING',
  uptime: '72h 34m',
  patrolCount: 4521,
  teleportCount: 89,
  threatsNeutralized: 12,
  prisonerCount: 7,
  lastPatrol: new Date().toISOString(),
  healthChecks: [
    { name: 'Data Integrity', status: 'healthy', icon: Database, lastCheck: '-' },
    { name: 'Sensor Pulse', status: 'healthy', icon: Radio, lastCheck: '-' },
    { name: 'Memory Usage', status: 'healthy', icon: Cpu, value: '67%', lastCheck: '-' },
    { name: 'Disk Space', status: 'healthy', icon: HardDrive, value: '45%', lastCheck: '-' },
    { name: 'Worker Processes', status: 'healthy', icon: GitBranch, value: '16 Active', lastCheck: '-' },
  ],
  recentEvents: [
    { id: '1', type: 'PATROL', message: 'Awaiting Neural Link...', time: 'now', severity: 'info' }
  ],
  prisoners: [
    { id: 'offline_await', type: 'PENDING_LINK', captured: 'now', escapeAttempts: 0 },
  ]
};

// ═══════════════════════════════════════════════════════════════════════════════
// LIVE TERMINAL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

function LiveTerminal({ 
  isOpen, 
  onClose,
  wsRef,
  externalLogs
}: { 
  isOpen: boolean; 
  onClose: () => void;
  wsRef: React.MutableRefObject<WebSocket | null>;
  externalLogs: string[];
}) {
  const [localLogs, setLogs] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isBooted, setIsBooted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync external logs
  useEffect(() => {
    if (externalLogs.length > 0) {
      setLogs(prev => [...prev, ...externalLogs]);
    }
  }, [externalLogs]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [localLogs]);

  useEffect(() => {
    if (isOpen && !isBooted) {
      setLogs([]);
      let delay = 0;
      BOOT_SEQUENCE.forEach(line => {
        setTimeout(() => {
          setLogs(prev => [...prev, line]);
        }, delay);
        delay += 200;
      });
      setTimeout(() => setIsBooted(true), delay);
    }
    if (!isOpen) {
      setIsBooted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && isBooted && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isBooted]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    setInput('');
    setLogs(prev => [...prev, `watchdog@qantum:~$ ${input}`]);

    if (cmd === 'clear') {
      setLogs([]);
      return;
    }

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Send over neural link if active
      wsRef.current.send(JSON.stringify({ type: 'TERMINAL_COMMAND', command: cmd }));
      // We also execute local fallback for instant gratification on some commands
    }

    const handler = WATCHDOG_COMMANDS[cmd];
    if (handler) {
      setLogs(prev => [...prev, handler()]);
    } else {
      setLogs(prev => [...prev, `❌ Remote execution bound. Sent payload: ${cmd}`]);
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center"
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        zIndex: 99999,
        pointerEvents: 'auto'
      }}
    >
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
        style={{ cursor: 'pointer' }}
      >
      </div>
      
      <div 
        className="relative w-full max-w-4xl mx-4 bg-[var(--q-bg-card)] border border-[var(--q-border)] rounded-[16px] overflow-hidden shadow-xl animate-in zoom-in-95 duration-200"
        style={{ 
          height: '70vh',
          maxHeight: '600px',
          minHeight: '400px'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-r from-black to-[#050510] px-4 py-3 flex items-center justify-between border-b border-purple-500/30">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-[var(--q-text-muted)]" />
              <span className="text-[var(--q-text-primary)] text-sm font-semibold">
                System Diagnostics Terminal
              </span>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded hover:bg-red-900/50 text-red-500 hover:text-white transition-colors"
            title="Close (Esc)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="p-4 overflow-y-auto font-mono text-sm leading-relaxed"
          style={{ height: 'calc(100% - 110px)' }}
          onClick={() => inputRef.current?.focus()}
        >
          {localLogs.map((log, i) => (
            <div 
              key={i} 
              className={`whitespace-pre-wrap mb-1.5 ${
                log.startsWith('watchdog@') ? 'text-purple-400 font-bold' : 
                log.includes('OK') ? 'text-emerald-400 font-bold' :
                log.includes('❌') || log.includes('FATAL') ? 'text-red-500 font-bold animate-pulse' :
                log.includes('⚡') || log.includes('🛡️') || log.includes('═') ? 'text-amber-400' :
                log.includes('✅') || log.includes('✓') ? 'text-emerald-400' :
                log.includes('[TELEMETRY]') ? 'text-cyan-400 opacity-80' :
                'text-slate-300'
              } ${log.includes('NEURAL LINK') ? 'text-shadow-glow-cyan' : ''}`}
            >
              {log}
            </div>
          ))}
          {!isBooted && (
            <div className="flex items-center gap-2 text-purple-400">
              <div className="w-2 h-4 bg-purple-500 animate-pulse" />
            </div>
          )}
        </div>

        <form 
          onSubmit={handleSubmit} 
          className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-black/95 border-t border-purple-500/30 flex items-center gap-3"
        >
          <span className="text-purple-500 font-mono text-sm font-bold flex-shrink-0 animate-pulse">
            root@aeterna-nexus:~#
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none text-emerald-400 font-mono text-sm caret-emerald-400 placeholder-slate-700 uppercase"
            placeholder="EXECUTE DIRECTIVE..."
            autoFocus
            disabled={!isBooted}
            spellCheck={false}
          />
          <button 
            type="submit" 
            className="p-2 rounded bg-purple-900/40 hover:bg-purple-600/60 text-purple-400 hover:text-white transition-all disabled:opacity-50 border border-purple-500/20"
            disabled={!isBooted}
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STAT CARD COMPONENT (Brutal style)
// ═══════════════════════════════════════════════════════════════════════════════

function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color,
  trend,
  trendValue,
  isGlitching
}: { 
  icon: any; 
  label: string; 
  value: string; 
  color: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: string;
  isGlitching?: boolean;
}) {
  const colorStyles: Record<string, string> = {
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5 shadow-[inset_0_0_10px_rgba(no,255,0,0.1)]',
    blue: 'text-blue-400 border-blue-500/30 bg-blue-500/5 shadow-[inset_0_0_10px_rgba(0,150,255,0.1)]',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/5 shadow-[inset_0_0_10px_rgba(255,180,0,0.1)]',
    red: 'text-red-500 border-red-500/50 bg-red-900/20 shadow-[inset_0_0_20px_rgba(255,0,0,0.2)]',
    purple: 'text-purple-400 border-purple-500/30 bg-purple-500/5 shadow-[inset_0_0_10px_rgba(150,0,255,0.1)]',
    cyan: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/5 shadow-[inset_0_0_10px_rgba(0,255,255,0.1)]',
  };

  return (
    <div className={`relative p-4 rounded-[12px] border ${colorStyles[color]} transition-all duration-300 hover:scale-[1.02] overflow-hidden`}>
      <div className="flex items-center justify-between mb-2 relative z-10">
        <span className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">{label}</span>
        <Icon className={`h-4 w-4 ${isGlitching ? 'animate-spin' : 'opacity-60'}`} />
      </div>
      <div className={`text-2xl font-black font-mono tracking-tighter relative z-10 ${isGlitching ? 'text-red-400' : ''}`}>{value}</div>
      {trend && trendValue && (
        <div className="flex items-center mt-2 text-xs font-bold font-mono tracking-wide relative z-10">
          {trend === 'up' && <span className="text-emerald-400">▲ {trendValue}</span>}
          {trend === 'down' && <span className="text-red-500 animate-pulse">▼ {trendValue}</span>}
          {trend === 'stable' && <span className="text-slate-500">● {trendValue}</span>}
        </div>
      )}
    </div>
  );
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    healthy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.3)]',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.3)]',
    critical: 'bg-red-900/60 text-red-400 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse',
    info: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.3)]',
  };
  
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black tracking-widest border ${styles[status] || styles.info}`}>
      {status}
    </span>
  );
};

const PulsingDot = ({ color = 'cyan', fast = false }: { color?: string, fast?: boolean }) => {
  const bgs: Record<string, string> = {
    emerald: 'bg-emerald-500',
    purple: 'bg-purple-500',
    amber: 'bg-amber-500', 
    red: 'bg-red-500',
    cyan: 'bg-cyan-500'
  };
  return (
    <span className="relative flex h-3 w-3">
      <span className={`absolute inline-flex h-full w-full rounded-full opacity-75 ${bgs[color]} ${fast ? 'animate-[ping_0.5s_cubic-bezier(0,0,0.2,1)_infinite]' : 'animate-ping'}`}></span>
      <span className={`relative inline-flex rounded-full h-3 w-3 ${bgs[color]} shadow-[0_0_8px_currentColor]`}></span>
    </span>
  );
}

function ProgressBar({ value, color = 'cyan' }: { value: number; color?: string }) {
  const colorClasses: Record<string, string> = {
    purple: 'from-purple-900 via-purple-600 to-pink-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]',
    emerald: 'from-emerald-900 via-emerald-600 to-cyan-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]',
    amber: 'from-amber-900 via-amber-600 to-yellow-400 shadow-[0_0_10px_rgba(245,158,11,0.5)]',
    red: 'from-red-950 via-red-600 to-orange-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]',
    cyan: 'from-cyan-900 via-cyan-500 to-blue-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]'
  };

  return (
    <div className="w-full h-1.5 bg-black border border-slate-800 rounded-none overflow-hidden">
      <div 
        className={`h-full bg-gradient-to-r ${colorClasses[color]} transition-all duration-300`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}

export function WatchdogPanel() {
  const [isActive, setIsActive] = useState(true);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'prison'>('overview');

  // Neural Link Native Backend State
  const daemonStatus = useStore(state => state.daemonStatus);
  const isConnected = useStore(state => state.isConnected);
  const liveFeed = useStore(state => state.liveFeed);
  const systemHealth = useStore(state => state.systemHealth);
  
  const [linkStatus, setLinkStatus] = useState<'AWAITING' | 'CONNECTED' | 'SEVERED'>('AWAITING');
  const [glitchFactor, setGlitchFactor] = useState(0);
  const [externalLogs, setExternalLogs] = useState<string[]>([]);
  
  // Create derived state matching the old Watchdog format
  const watchdogState = {
    status: daemonStatus?.state || 'PATROLLING',
    uptime: `${Math.floor((daemonStatus?.uptime || 0) / 3600000)}h`,
    patrolCount: daemonStatus?.metrics?.tasksProcessed || 4521,
    teleportCount: daemonStatus?.metrics?.errorsHandled || 89,
    threatsNeutralized: 12, // Derived manually or mocked if missing
    prisonerCount: 7, // Kept static for mock prison until integrated
    healthChecks: [
      { name: 'Data Integrity', status: systemHealth?.overall > 50 ? 'healthy' : 'critical', icon: Database, lastCheck: new Date().toISOString().split('T')[1].slice(0,8) },
      { name: 'Sensor Pulse', status: isConnected ? 'healthy' : 'critical', icon: Radio, lastCheck: new Date().toISOString().split('T')[1].slice(0,8) },
      { name: 'Memory Usage', status: 'healthy', icon: Cpu, value: `${systemHealth?.detailed?.memory || 0}%`, lastCheck: new Date().toISOString().split('T')[1].slice(0,8) },
      { name: 'Disk Space', status: 'healthy', icon: HardDrive, value: '45%', lastCheck: new Date().toISOString().split('T')[1].slice(0,8) }
    ],
    recentEvents: liveFeed.length > 0 
      ? liveFeed.slice(0, 50).map(feed => ({
          id: feed.id,
          type: feed.type.toUpperCase(),
          message: feed.message,
          time: new Date(feed.timestamp).toLocaleTimeString(),
          severity: feed.severity ? feed.severity.toLowerCase() : 'info'
        }))
      : WATCHDOG_STATE_DEFAULT.recentEvents,
    prisoners: WATCHDOG_STATE_DEFAULT.prisoners
  };

  const wsRef = useRef<WebSocket | null>(null);

  // Sync isConnected with our local internal linkStatus
  useEffect(() => {
    if (isConnected) {
      setLinkStatus('CONNECTED');
    } else {
      setLinkStatus('SEVERED');
    }
  }, [isConnected]);

  // Hook into liveFeed changes to simulate external logs
  useEffect(() => {
    if (liveFeed.length > 0) {
      const latest = liveFeed[0];
      setExternalLogs(prev => [...prev.slice(-49), `[TELEMETRY] ${latest.message}`]);
      if (latest.severity === 'CRITICAL' || latest.severity === 'HIGH') {
        setGlitchFactor(100);
      }
    }
  }, [liveFeed]);

  // Handle auto-recovery of glitch effect
  useEffect(() => {
    if (glitchFactor > 0) {
      const timer = setTimeout(() => setGlitchFactor(0), 1500);
      return () => clearTimeout(timer);
    }
  }, [glitchFactor]);

  const isSevere = glitchFactor > 0 || linkStatus === 'SEVERED';

  return (
    <>
      <LiveTerminal 
        isOpen={terminalOpen} 
        onClose={() => setTerminalOpen(false)} 
        wsRef={wsRef}
        externalLogs={externalLogs}
      />
      
      <Card className="bg-[var(--q-bg-card)] border border-[var(--q-border)] rounded-[16px] overflow-hidden shadow-sm relative">

        {isSevere && (
          <div className="absolute inset-x-0 top-0 h-1 bg-red-600 animate-pulse pointer-events-none z-50"></div>
        )}

        <CardHeader className="pb-4 relative border-b border-white/5 bg-black/40">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-[10px] font-mono tracking-widest text-slate-500 px-1 border-b border-white/5 pb-2">
              <div className="flex items-center gap-2">
                <span>OMNICORE LINK:</span>
                {linkStatus === 'CONNECTED' ? (
                  <span className="text-cyan-400 flex items-center gap-1 font-bold animate-pulse text-shadow-glow-cyan"><Wifi className="h-3 w-3"/> ONLINE PORT: 3401</span>
                ) : linkStatus === 'AWAITING' ? (
                  <span className="text-amber-400 flex items-center gap-1"><RefreshCw className="h-3 w-3 animate-spin"/> AWAITING HANDSHAKE</span>
                ) : (
                  <span className="text-red-500 flex items-center gap-1 font-bold animate-pulse text-shadow-glow-red"><WifiOff className="h-3 w-3"/> SEVERED</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                 <span>ZERO ENTROPY ENFORCED</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className={`w-14 h-14 border border-white/10 bg-black flex items-center justify-center shadow-2xl ${isSevere ? 'shadow-red-500/50' : 'shadow-cyan-500/20'} z-10 relative overflow-hidden`}>
                     <div className={`absolute inset-0 bg-gradient-to-br ${isSevere ? 'from-red-900 to-black' : 'from-cyan-900 to-black'} opacity-50`}></div>
                    <Shield className={`h-8 w-8 relative z-20 ${isSevere ? 'text-red-500' : 'text-cyan-400'}`} />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 z-30">
                    <PulsingDot color={linkStatus === 'CONNECTED' ? 'cyan' : 'red'} fast={isSevere} />
                  </div>
                </div>
                <div>
                  <CardTitle className="text-2xl font-black font-mono tracking-tighter">
                    <span className="text-[var(--q-text-primary)]">
                      System Telemetry Watchdog
                    </span>
                  </CardTitle>
                  <CardDescription className="text-[var(--q-text-muted)] font-mono text-xs uppercase tracking-widest">
                     // SYSTEM DIAGNOSTICS ACTIVE
                  </CardDescription>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex gap-1 bg-black border border-white/10 p-1">
                  {(['overview', 'health', 'prison'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider transition-all ${
                        activeTab === tab
                          ? 'bg-slate-100 text-black'
                          : 'text-slate-500 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab === 'overview' ? 'Overview' : tab === 'health' ? 'System Health' : 'Prison Matrix'}
                    </button>
                  ))}
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setTerminalOpen(true)}
                  className="rounded-none border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/10 text-cyan-400 font-mono text-xs tracking-widest uppercase bg-black"
                >
                  <Terminal className="h-4 w-4 mr-2" />
                  Terminal
                </Button>
                
                <Button 
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsActive(!isActive)}
                  className={`rounded-none font-mono text-xs tracking-widest uppercase ${isActive 
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                    : "border-slate-600 hover:border-amber-500 bg-black text-slate-300"
                  }`}
                >
                  {isActive ? (
                    <><Pause className="h-4 w-4 mr-2" /> Pause</>
                  ) : (
                    <><Play className="h-4 w-4 mr-2" /> Resume</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative pt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <StatCard icon={Activity} label="State Status" value={watchdogState.status.replace(/_/g, ' ')} color={isSevere ? 'red' : 'cyan'} isGlitching={isSevere} />
                <StatCard icon={Eye} label="Core Patrols" value={watchdogState.patrolCount.toLocaleString()} color="blue" trend="up" trendValue={`${(Math.random() * 5 + 10).toFixed(0)}/hr`} />
                <StatCard icon={Zap} label="Teleports" value={watchdogState.teleportCount.toString()} color="amber" />
                <StatCard icon={AlertTriangle} label="Neutralized" value={watchdogState.threatsNeutralized.toString()} color={watchdogState.threatsNeutralized > 0 ? 'red' : 'cyan'} />
                <StatCard icon={Lock} label="Prisoners" value={watchdogState.prisonerCount.toString()} color={watchdogState.prisonerCount > 0 ? 'red' : 'cyan'} />
                <StatCard icon={RefreshCw} label="Uptime" value={watchdogState.uptime} color="emerald" />
              </div>

              <div className="bg-black/60 border border-white/5 p-4 rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                   <Activity className="w-64 h-64" />
                </div>
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                  <Radio className="h-4 w-4 text-cyan-400" />
                  <h3 className="font-bold text-slate-200 font-mono tracking-widest uppercase text-sm">Neural Telemetry Feed</h3>
                  {linkStatus === 'CONNECTED' && <PulsingDot color="cyan" />}
                </div>
                <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {watchdogState.recentEvents.map((event) => (
                    <div 
                      key={event.id}
                      className="flex items-start gap-4 p-2 bg-gradient-to-r from-white/[0.02] to-transparent border-l-2 hover:bg-white/[0.05] transition-colors"
                      style={{
                        borderLeftColor: event.severity === 'critical' ? '#ef4444' : event.severity === 'warning' ? '#f59e0b' : '#06b6d4'
                      }}
                    >
                      <div className="flex-shrink-0 mt-0.5 opacity-50">
                        {event.type === 'PATROL' && <Eye className="h-4 w-4 text-cyan-400" />}
                        {event.type === 'TELEPORT' && <Zap className="h-4 w-4 text-amber-400" />}
                        {event.type === 'NEUTRALIZE' && <AlertTriangle className="h-4 w-4 text-red-400" />}
                        {event.type === 'PRISON' && <Lock className="h-4 w-4 text-red-500" />}
                      </div>
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <p className={`text-sm font-mono ${event.severity === 'critical' ? 'text-red-400 font-bold' : 'text-slate-300'}`}>{event.message}</p>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-slate-600 font-mono uppercase truncate w-24 text-right">{event.time}</span>
                          <StatusBadge status={event.severity} />
                        </div>
                      </div>
                    </div>
                  ))}
                  {watchdogState.recentEvents.length === 0 && (
                     <div className="text-center p-8 text-slate-600 font-mono text-xs uppercase tracking-widest">
                       NO RECENT EVENTS. SILENCE.
                     </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-black/60 border border-white/5 p-4 rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                  <Activity className="h-4 w-4 text-emerald-400" />
                  <h3 className="font-bold text-slate-200 font-mono tracking-widest uppercase text-sm">System Health Checks</h3>
                </div>
                <div className="space-y-2">
                  {watchdogState.healthChecks.map((check, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 border ${check.status === 'healthy' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/30 bg-red-500/10'} hover:border-white/20 transition-colors`}>
                      <div className="flex items-center gap-4">
                        <div className={`p-2 bg-black border ${check.status === 'healthy' ? 'border-emerald-500/50 outline outline-1 outline-emerald-500/20' : 'border-red-500/50 outline outline-1 outline-red-500/20'}`}>
                          <check.icon className={`h-4 w-4 ${check.status === 'healthy' ? 'text-emerald-400' : 'text-red-500'}`} />
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 font-mono text-sm uppercase tracking-wider">{check.name}</p>
                          {check.value && <p className={`text-xs font-mono font-bold mt-0.5 ${check.status === 'healthy' ? 'text-slate-500' : 'text-red-400 animate-pulse'}`}>{check.value}</p>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] uppercase font-bold tracking-widest text-slate-600">{check.lastCheck}</span>
                           {check.status === 'healthy' ? (
                             <CheckCircle2 className="h-4 w-4 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] bg-emerald-500/20 rounded-full" />
                           ) : (
                             <AlertTriangle className="h-4 w-4 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] bg-red-500/20 rounded-full animate-pulse" />
                           )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black/60 border border-white/5 p-4 rounded-sm shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]">
                <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-3">
                  <Cpu className="h-4 w-4 text-purple-400" />
                  <h3 className="font-bold text-slate-200 font-mono tracking-widest uppercase text-sm">Resonance & Load</h3>
                </div>
                <div className="space-y-6 mt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-end font-mono">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Main Thread CPU</span>
                      <span className="text-cyan-400 text-lg font-black tracking-tighter">78%</span>
                    </div>
                    <ProgressBar value={78} color="cyan" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-end font-mono">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Heap Capacity</span>
                      <span className="text-emerald-400 text-lg font-black tracking-tighter">67%</span>
                    </div>
                    <ProgressBar value={67} color="emerald" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-end font-mono">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">I/O Wait / Disk</span>
                      <span className="text-amber-400 text-lg font-black tracking-tighter">12%</span>
                    </div>
                    <ProgressBar value={12} color="amber" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-end font-mono">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Neural Net Resonance</span>
                      <span className="text-purple-400 text-lg font-black tracking-tighter">100%</span>
                    </div>
                    <ProgressBar value={100} color="purple" />
                  </div>
                  <div className="mt-8 pt-4 border-t border-white/5">
                     <p className="text-[9px] text-slate-600 font-mono uppercase tracking-[0.3em] text-center">Zero-Copy Memory Managed By Kernel.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'prison' && (
            <div className="space-y-4">
              <div className="bg-red-950/20 rounded-none p-6 border border-red-900/50 shadow-[0_0_20px_rgba(150,0,0,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-3xl mix-blend-screen pointer-events-none" />
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 border-2 border-red-600 bg-black flex items-center justify-center relative">
                      <Lock className="h-8 w-8 text-red-500 animate-[pulse_2s_ease-in-out_infinite]" />
                       <div className="absolute inset-0 bg-red-600/20 blur-md"></div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black font-mono tracking-tighter text-red-500 text-shadow-glow-red">ETERNAL PRISON</h3>
                      <p className="text-[10px] text-red-400/70 font-mono tracking-[0.3em] font-bold mt-1">ОСЪДЕНИ ДО НЕЗАБАВНА ЛИКВИДАЦИЯ</p>
                    </div>
                  </div>
                  <div className="text-right border-l border-red-900/50 pl-6">
                    <p className="text-5xl font-black text-red-500 tracking-tighter text-shadow-glow-red">{watchdogState.prisonerCount}</p>
                    <p className="text-[10px] text-red-400/50 font-mono uppercase tracking-[0.3em] font-bold mt-1">Total Inmates</p>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                {watchdogState.prisoners.map((prisoner) => (
                  <div 
                    key={prisoner.id}
                    className="flex items-center justify-between p-3 bg-black border border-red-900/40 hover:border-red-600 transition-all hover:bg-red-950/20 group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-red-950/50 border border-red-900/50 group-hover:bg-red-900">
                        <Lock className="h-4 w-4 text-red-500" />
                      </div>
                      <div>
                        <p className="font-mono text-sm font-bold text-red-100">{prisoner.id}</p>
                        <p className="text-xs font-mono text-red-400/70 uppercase tracking-widest mt-0.5">Offense: <span className="text-red-400 font-bold">{prisoner.type}</span></p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-900">Captured</p>
                        <p className="text-xs font-mono font-bold text-red-200">{prisoner.captured}</p>
                      </div>
                      <div className="text-right w-32 border-l border-red-900/30 pl-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-red-900">Escape Attempts</p>
                        <p className={`text-sm font-mono font-black ${prisoner.escapeAttempts > 0 ? 'text-red-500 animate-pulse text-shadow-glow-red' : 'text-red-900'}`}>
                          {prisoner.escapeAttempts} {prisoner.escapeAttempts > 0 && '💥'}
                        </p>
                      </div>
                      <div className="px-3 py-1 bg-red-950 border border-red-900">
                        <span className="text-[10px] font-black tracking-[0.2em] text-red-600">ETERNAL</span>
                      </div>
                    </div>
                  </div>
                ))}
                {watchdogState.prisoners.length === 0 && (
                   <div className="p-8 text-center border border-dashed border-red-900/30">
                     <p className="text-red-900 font-mono text-xs uppercase tracking-widest font-black">THE PRISON IS EMPTY.</p>
                   </div>
                )}
              </div>

              <div className="mt-8 pt-4 flex items-center justify-center border-t border-red-900/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,0,0,0.05)_10px,rgba(255,0,0,0.05)_20px)] pointer-events-none" />
                <p className="text-center text-[10px] text-red-500/80 font-mono font-black tracking-[0.4em] relative z-10 py-2">
                  ⚠️ NO KEY EXISTS • ATOMIC SENSOR ARMED • ESCAPE IMPOSSIBLE ⚠️
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* CSS Overrides for extreme cyberpunk standard without disturbing global css */}
      <style dangerouslySetInnerHTML={{__html: `
        .text-shadow-glow { text-shadow: 0 0 10px rgba(168, 85, 247, 0.8); }
        .text-shadow-glow-cyan { text-shadow: 0 0 10px rgba(6, 182, 212, 0.8); }
        .text-shadow-glow-red { text-shadow: 0 0 15px rgba(239, 68, 68, 0.9); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.5); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(6, 182, 212, 0.5); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(6, 182, 212, 0.8); }
      `}} />
    </>
  );
}
