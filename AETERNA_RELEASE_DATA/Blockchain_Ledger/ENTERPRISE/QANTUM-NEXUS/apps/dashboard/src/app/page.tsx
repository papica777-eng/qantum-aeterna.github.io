'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { WatchdogPanel } from '@/components/dashboard/watchdog-panel';
import { RecentRuns } from '@/components/dashboard/recent-runs';
import { HealingInsights } from '@/components/dashboard/healing-insights';
import { AutonomousControls } from '@/components/dashboard/autonomous-controls';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Monitor your test execution and self-healing performance</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live
          </div>
        </div>

        {/* Stats Row */}
        <StatsCards />

        {/* Eternal Watchdog HUD — Full Width */}
        <WatchdogPanel />

        {/* Bottom row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <RecentRuns />
          </div>
          <div className="space-y-6">
            <HealingInsights />
            <AutonomousControls />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
