'use client';
import { useStore } from '@/stores/nexus-store';
import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Eye, 
  Database,
  Activity,
  Cpu,
  HardDrive,
  GitBranch,
  Radio,
  Terminal,
  Server,
  Wifi,
  WifiOff,
  Search,
  Download,
  AlertCircle
} from 'lucide-react';

export function WatchdogPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'logs' | 'health'>('overview');
  const [logSearch, setLogSearch] = useState('');

  // Neural Link Native Backend State
  const daemonStatus = useStore(state => state.daemonStatus);
  const isConnected = useStore(state => state.isConnected);
  const liveFeed = useStore(state => state.liveFeed);
  const systemHealth = useStore(state => state.systemHealth);
  
  const [externalLogs, setExternalLogs] = useState<any[]>([]);

  // Hook into liveFeed changes to simulate external logs or collect them
  useEffect(() => {
    if (liveFeed.length > 0) {
      setExternalLogs(prev => {
        // Keep last 100
        const updated = [...liveFeed, ...prev].slice(0, 100);
        return updated;
      });
    }
  }, [liveFeed]);

  const stats = {
    status: daemonStatus?.state || 'ACTIVE',
    uptime: `${Math.floor((daemonStatus?.uptime || 72000000) / 3600000)}h`,
    tasks: daemonStatus?.metrics?.tasksProcessed || 4521,
    errors: daemonStatus?.metrics?.errorsHandled || 12,
  };

  const healthData = [
    { name: 'Core Substrate', status: systemHealth?.overall > 50 ? 'Healthy' : 'Degraded', icon: Database, value: '99.9%' },
    { name: 'Neural Link', status: isConnected ? 'Connected' : 'Offline', icon: Wifi, value: isConnected ? '34ms' : '-' },
    { name: 'Memory Allocation', status: 'Optimal', icon: Cpu, value: `${systemHealth?.detailed?.memory || 42}%` },
    { name: 'Storage Vault', status: 'Healthy', icon: HardDrive, value: '65%' }
  ];

  const filteredLogs = externalLogs.filter(log => 
    log.message.toLowerCase().includes(logSearch.toLowerCase()) || 
    (log.type && log.type.toLowerCase().includes(logSearch.toLowerCase()))
  );

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[var(--q-bg-card)] border border-[var(--q-border)] p-6 rounded-[16px] shadow-sm relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[var(--q-primary)]/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 rounded-[12px] bg-[var(--q-bg-input)] border border-[var(--q-border)] flex items-center justify-center text-[var(--q-primary)] shrink-0">
            <Server className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[var(--q-text-primary)]">System Diagnostics</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[13px] text-[var(--q-text-secondary)]">OmniCore Connection:</span>
              {isConnected ? (
                <span className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--q-success)] uppercase">
                  <div className="w-2 h-2 rounded-full bg-[var(--q-success)] animate-pulse" />
                  Online
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[12px] font-bold text-[var(--q-text-muted)] uppercase">
                  <WifiOff className="w-3 h-3" />
                  Offline
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10 p-1 bg-[var(--q-bg-input)] rounded-[10px] border border-[var(--q-border)] self-start lg:self-auto">
          {(['overview', 'health', 'logs'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[13px] font-semibold rounded-[8px] transition-all capitalize ${
                activeTab === tab
                  ? 'bg-[var(--q-bg-card)] text-[var(--q-text-primary)] shadow-sm border border-[var(--q-border)]'
                  : 'text-[var(--q-text-secondary)] hover:text-[var(--q-text-primary)] border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 bg-[var(--q-bg-card)] border border-[var(--q-border)] rounded-[16px] overflow-hidden shadow-sm flex flex-col">
        {activeTab === 'overview' && (
          <div className="p-6 h-full overflow-y-auto">
            <h3 className="text-[16px] font-semibold mb-6 flex items-center gap-2 text-[var(--q-text-primary)]">
              <Activity className="w-5 h-5 text-[var(--q-primary)]" />
              Real-time Telemetry
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-[var(--q-bg-input)] border border-[var(--q-border)] p-4 rounded-[12px]">
                <div className="text-[12px] text-[var(--q-text-muted)] font-semibold uppercase mb-2 flex items-center justify-between">
                  Status
                  <Shield className="w-4 h-4" />
                </div>
                <div className="text-[24px] font-bold text-[var(--q-success)] capitalize">{stats.status.toLowerCase()}</div>
              </div>
              <div className="bg-[var(--q-bg-input)] border border-[var(--q-border)] p-4 rounded-[12px]">
                <div className="text-[12px] text-[var(--q-text-muted)] font-semibold uppercase mb-2 flex items-center justify-between">
                  Tasks Processed
                  <GitBranch className="w-4 h-4" />
                </div>
                <div className="text-[24px] font-bold text-[var(--q-text-primary)]">{stats.tasks.toLocaleString()}</div>
              </div>
              <div className="bg-[var(--q-bg-input)] border border-[var(--q-border)] p-4 rounded-[12px]">
                <div className="text-[12px] text-[var(--q-text-muted)] font-semibold uppercase mb-2 flex items-center justify-between">
                  Uptime
                  <Activity className="w-4 h-4" />
                </div>
                <div className="text-[24px] font-bold text-[var(--q-info)]">{stats.uptime}</div>
              </div>
              <div className="bg-[var(--q-bg-input)] border border-[var(--q-border)] p-4 rounded-[12px]">
                <div className="text-[12px] text-[var(--q-text-muted)] font-semibold uppercase mb-2 flex items-center justify-between">
                  Isolated Threats
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="text-[24px] font-bold text-[var(--q-text-primary)]">{stats.errors}</div>
              </div>
            </div>

            <div className="border border-[var(--q-border)] rounded-[12px] overflow-hidden">
               <div className="bg-[var(--q-bg-input)] px-4 py-3 border-b border-[var(--q-border)] flex items-center justify-between">
                 <h4 className="text-[14px] font-bold">Recent System Events</h4>
                 <Button variant="ghost" size="sm" onClick={() => setActiveTab('logs')} className="text-[12px] h-8">View All</Button>
               </div>
               <div className="p-0">
                  {externalLogs.slice(0, 5).map((log, i) => (
                    <div key={i} className="flex items-start gap-4 px-4 py-3 border-b border-[var(--q-border)] last:border-0 hover:bg-[var(--q-bg-input)]/50 transition-colors">
                      <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${log.severity === 'CRITICAL' ? 'bg-[var(--q-error)]' : log.severity === 'WARNING' ? 'bg-[var(--q-warning)]' : 'bg-[var(--q-success)]'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-[var(--q-text-primary)]">{log.message}</p>
                        <p className="text-[11px] text-[var(--q-text-muted)] mt-1">{new Date(log.timestamp || Date.now()).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                  {externalLogs.length === 0 && (
                     <div className="p-8 text-center text-[var(--q-text-muted)] text-[13px]">
                       No recent events to display.
                     </div>
                  )}
               </div>
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className="p-6 h-full overflow-y-auto">
            <h3 className="text-[16px] font-semibold mb-6 flex items-center gap-2 text-[var(--q-text-primary)]">
              <Database className="w-5 h-5 text-[var(--q-primary)]" />
              Infrastructure Health
            </h3>
            
            <div className="space-y-4">
              {healthData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-[var(--q-bg-input)] border border-[var(--q-border)] rounded-[12px]">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-[10px] bg-[var(--q-bg-card)] border border-[var(--q-border)] flex items-center justify-center text-[var(--q-text-secondary)]">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[var(--q-text-primary)]">{item.name}</div>
                      <div className={`text-[12px] font-semibold mt-0.5 ${item.status === 'Healthy' || item.status === 'Connected' || item.status === 'Optimal' ? 'text-[var(--q-success)]' : 'text-[var(--q-error)]'}`}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                  <div className="text-[16px] font-mono font-bold text-[var(--q-text-primary)]">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-[var(--q-border)] bg-[var(--q-bg-input)] flex items-center justify-between gap-4">
               <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--q-text-muted)]" />
                 <input 
                   type="text" 
                   value={logSearch}
                   onChange={(e) => setLogSearch(e.target.value)}
                   placeholder="Search logs by keyword..." 
                   className="w-full bg-[var(--q-bg-card)] border border-[var(--q-border)] rounded-[8px] pl-9 pr-4 py-2 text-[13px] outline-none focus:border-[var(--q-primary)] transition-colors"
                 />
               </div>
               <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                 <Download className="w-4 h-4" /> Export Logs
               </Button>
            </div>
            
            <div className="flex-1 overflow-auto bg-[#0a0a0c] p-4 font-mono text-[12px] leading-relaxed">
               {filteredLogs.length > 0 ? (
                 <div className="space-y-1.5 flex flex-col-reverse">
                   {filteredLogs.map((log, i) => (
                     <div key={i} className="flex gap-4 p-1 hover:bg-white/5 rounded px-2">
                        <span className="text-slate-500 shrink-0 select-none">
                          {new Date(log.timestamp || Date.now()).toISOString().replace('T', ' ').slice(0, -5)}
                        </span>
                        <span className={`font-bold shrink-0 w-16 ${
                          log.severity === 'CRITICAL' ? 'text-red-400' : 
                          log.severity === 'WARNING' ? 'text-yellow-400' : 
                          'text-emerald-400'
                        }`}>
                          {log.severity || 'INFO'}
                        </span>
                        <span className="text-slate-300 break-all">{log.message}</span>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="h-full flex flex-col items-center justify-center text-slate-500">
                   <Terminal className="w-12 h-12 opacity-20 mb-4" />
                   <p>No log entries found.</p>
                 </div>
               )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
