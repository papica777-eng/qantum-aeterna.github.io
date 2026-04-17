'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { WatchdogPanel } from '@/components/dashboard/watchdog-panel';
import { ShieldAlert } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Real-time Telemetry centerpiece */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <WatchdogPanel />
      </motion.div>

      {/* Auxiliary Neural Bridge Status */}
      <div className="grid grid-cols-1 gap-6">
        <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/20 text-purple-400/80 text-xs font-mono flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-4 w-4" />
            <span>NEURAL_BRIDGE_ACTIVE: Substrate parity verified at 100%</span>
          </div>
          <span>ETERNAL_PROTOCOL: V34.1_STABLE</span>
        </div>
      </div>
    </div>
  );
}

