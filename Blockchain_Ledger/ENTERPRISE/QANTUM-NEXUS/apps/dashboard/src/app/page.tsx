'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { UsageChart } from '@/components/dashboard/usage-chart';
import { HealingInsights } from '@/components/dashboard/healing-insights';
import { RecentRuns } from '@/components/dashboard/recent-runs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Critical System Alert - Vision Alignment */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Alert className="bg-purple-500/10 border-purple-500/20 text-purple-400">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle className="font-bold">SYSTEM STATUS: OPTIMIZED</AlertTitle>
          <AlertDescription>
            Neutralized: CORRUPTED_FILE threat detected and auto-healed via Neural Bridge.
          </AlertDescription>
        </Alert>
      </motion.div>

      {/* Stats Overview */}
      <StatsCards />

      {/* Main Insights Grid */}
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <UsageChart />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <HealingInsights />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6">
        <RecentRuns />
      </div>
    </div>
  );
}
