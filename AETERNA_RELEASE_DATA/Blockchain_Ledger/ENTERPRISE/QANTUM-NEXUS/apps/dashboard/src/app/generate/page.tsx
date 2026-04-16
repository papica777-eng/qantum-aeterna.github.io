'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import SupremeMeditationDashboard from '@/components/nexus/ai-core/supreme-meditation-dashboard';
import AutonomousThoughtVisualizer from '@/components/nexus/ai-core/autonomous-thought-visualizer';
import { Sparkles } from 'lucide-react';

export default function GeneratePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AI Generation Core</h1>
            <p className="text-muted-foreground text-sm">Configure and trigger autonomous test generation and system meditation</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-medium">
            <Sparkles className="h-4 w-4" />
            Neural Engine Active
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
            <SupremeMeditationDashboard />
            <AutonomousThoughtVisualizer />
        </div>
      </div>
    </DashboardLayout>
  );
}
