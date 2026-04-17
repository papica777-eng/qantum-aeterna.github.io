'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useStore } from '@/stores/nexus-store';

const navigationGroups = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: '/', icon: '📊' },
      { name: 'Projects', href: '/projects', icon: '📁', badge: '3' },
      { name: 'Test Cases', href: '/tests', icon: '🧪' },
      { name: 'Test Runs', href: '/runs', icon: '▶️' },
    ]
  },
  {
    title: 'Pro Features',
    items: [
      { name: 'API Sensei', href: '/generate', icon: '🥋' },
      { name: 'Self-Healing', href: '/healing', icon: '🧬' },
      { name: 'Logs & Metrics', href: '/logs', icon: '📋' },
    ]
  },
  {
    title: 'Account',
    items: [
      { name: 'Billing', href: '/billing', icon: '💳' },
      { name: 'Settings', href: '/settings', icon: '⚙️' },
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
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-[var(--q-border)] shrink-0">
            <span className="text-[32px]">🧠</span>
            <span className="text-[20px] font-bold bg-gradient-to-br from-white to-[var(--q-primary-light)] bg-clip-text text-transparent">
              QANTUM
            </span>
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
                          'flex items-center gap-3 px-4 py-3 rounded-[10px] no-underline transition-all duration-200',
                          isActive
                            ? 'bg-[var(--q-primary)] text-white'
                            : 'text-[var(--q-text-secondary)] hover:bg-[rgba(139,92,246,0.1)] hover:text-[var(--q-text-primary)]'
                        )}
                      >
                        <span className="text-[20px] w-6 text-center">{item.icon}</span>
                        <span className="flex-1 font-medium">{item.name}</span>
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
          <div className="pt-6 border-t border-[var(--q-border)] shrink-0 mt-auto">
            <div className="flex items-center gap-3 p-3 bg-[var(--q-bg-input)] rounded-[12px]">
              <div className="w-10 h-10 rounded-[10px] bg-gradient-to-br from-[var(--q-primary)] to-[var(--q-primary-dark)] flex items-center justify-center font-semibold text-white">
                DP
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold text-[var(--q-text-primary)] truncate">Dimitar Prodromov</div>
                <div className="text-[12px] text-[var(--q-success)]">QAntum Architect</div>
              </div>
              <button className="bg-transparent border-none text-[var(--q-text-secondary)] cursor-pointer text-[18px] hover:scale-110 transition-transform">
                🚪
              </button>
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
