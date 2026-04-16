'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import SelfHealingWatcher from '@/components/nexus/operations/self-healing-watcher';
import { Wand2 } from 'lucide-react';

export default function HealingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Self-Healing Infrastructure</h1>
            <p className="text-muted-foreground text-sm">Monitor autonomous recovery and system stabilization events</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
            <Wand2 className="h-4 w-4" />
            Active Surveillance
          </div>
        </div>

        {/* Self Healing Watcher */}
        <div className="h-[calc(100vh-200px)]">
          <SelfHealingWatcher />
        </div>
      </div>
    </DashboardLayout>
  );
}
