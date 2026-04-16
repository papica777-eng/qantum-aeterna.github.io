'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { LiveFeedPanel } from '@/components/nexus/operations/live-feed-panel';
import { Terminal } from 'lucide-react';

export default function LogsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
            <p className="text-muted-foreground text-sm">Real-time telemetry and process activity logs</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-medium">
            <Terminal className="h-4 w-4" />
            Active Feed
          </div>
        </div>

        {/* Live Feed Panel */}
        <div className="flex-1 min-h-0">
          <LiveFeedPanel />
        </div>
      </div>
    </DashboardLayout>
  );
}
