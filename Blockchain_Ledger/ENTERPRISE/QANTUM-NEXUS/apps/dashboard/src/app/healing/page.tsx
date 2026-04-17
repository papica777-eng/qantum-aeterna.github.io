'use client';

import * as React from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { SelfHealingWatcher } from '@/components/nexus/operations/self-healing-watcher';
import { HealingInsights } from '@/components/dashboard/healing-insights';
import { motion } from 'framer-motion';
import { RefreshCw, ShieldCheck, Zap } from 'lucide-react';

export default function HealingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
              <RefreshCw className="h-8 w-8 text-purple-400" />
              Self-Healing Diagnostics
            </h1>
            <p className="text-gray-400 mt-1">Autonomous system integrity and neural bridge repair logs.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-sm">
            <ShieldCheck className="h-4 w-4" />
            INTEGRITY: 100%
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <SelfHealingWatcher />
          </div>
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <HealingInsights />
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/5 space-y-4">
              <h3 className="font-bold text-white flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-400" />
                Neural Bridge Active
              </h3>
              <p className="text-sm text-gray-400">
                The QAntum Nexus is actively monitoring for bit-rot and corrupted filaments. Auto-repair is set to 'Absolute Singularity' mode.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
