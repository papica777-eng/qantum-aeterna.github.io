'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/stores/nexus-store';
import { 
  LayoutDashboard, 
  Folder, 
  Zap, 
  PlayCircle, 
  Brain, 
  Dna, 
  ClipboardList, 
  CreditCard, 
  Settings,
  ChevronDown,
  LogOut,
  Sparkles
} from 'lucide-react';

const navigationGroups = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: '/', icon: LayoutDashboard },
      { name: 'Projects', href: '/projects', icon: Folder, badge: '3' },
      { name: 'Test Cases', href: '/tests', icon: Zap },
      { name: 'Test Runs', href: '/runs', icon: PlayCircle },
    ]
  },
  {
    title: 'Pro Features',
    items: [
      { name: 'API Sensei', href: '/generate', icon: Brain },
      { name: 'Self-Healing', href: '/healing', icon: Sparkles },
      { name: 'Logs & Metrics', href: '/logs', icon: ClipboardList },
    ]
  },
  {
    title: 'Account',
    items: [
      { name: 'Billing', href: '/billing', icon: CreditCard },
      { name: 'Settings', href: '/settings', icon: Settings },
    ]
  }
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const connectNexus = useStore((state) => state.connect);

  useEffect(() => {
    setMounted(true);
    connectNexus();
  }, [connectNexus]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--q-bg-dark)] text-[var(--q-text-primary)]">
      {/* Mobile sidebar backdrop */}
      {mounted && sidebarOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - EXACT MATCH TO DASHBOARD.HTML */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '280px',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--q-bg-card)',
          borderRight: '1px solid var(--q-border)',
          zIndex: 100,
          padding: '24px',
          transform: mounted && sidebarOpen ? 'translateX(0)' : undefined,
        }}
        className={cn(
          'transition-transform duration-300',
          !mounted || !sidebarOpen ? 'max-lg:-translate-x-full' : ''
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/20">
                Q
              </div>
              <span className="text-xl font-black tracking-tight text-white group-hover:text-blue-400 transition-colors">
                QAntum
              </span>
            </div>
            
            <button className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-left">
              <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center text-[10px] font-bold text-purple-400 border border-purple-500/30">
                QE
              </div>
              <span className="flex-1 text-xs font-bold text-slate-300">QAntum Empire</span>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto space-y-6">
            {navigationGroups.map((group) => (
              <div key={group.title} className="mb-6">
                <div className="text-[11px] font-semibold text-[var(--q-text-muted)] uppercase tracking-[1px] mb-3 pl-3">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl no-underline transition-all duration-200 group relative',
                          isActive
                            ? 'bg-purple-600/90 text-white shadow-lg shadow-purple-600/20'
                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <item.icon className={cn(
                          "h-5 w-5 transition-colors",
                          isActive ? "text-white" : "text-slate-500 group-hover:text-purple-400"
                        )} />
                        <span className="flex-1 text-sm font-semibold">{item.name}</span>
                        {item.badge && (
                          <span className="ml-auto bg-[var(--q-error)] text-white text-[11px] font-semibold px-2 py-[2px] rounded-[10px]">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Footer */}
          <div className="pt-6 border-t border-white/5 shrink-0 mt-auto">
            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg overflow-hidden group-hover:scale-105 transition-transform">
                DP
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-bold text-white truncate">Dimitar Prodromov</div>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  QAntum Architect
                </div>
              </div>
              <LogOut className="h-4 w-4 text-slate-500 group-hover:text-red-400 transition-colors" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div 
        style={{
          marginLeft: '280px',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--q-bg-dark)'
        }}
        className="max-lg:!ml-0"
      >
        <main className="flex-1 p-8 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
