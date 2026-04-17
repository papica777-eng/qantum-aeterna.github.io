'use client';

import * as React from 'react';
import { WatchdogPanel } from '@/components/dashboard/watchdog-panel';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { motion } from 'framer-motion';

export default function LogsPage() {
  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white">System Logs</h1>
        </div>
        
        <WatchdogPanel />
      </motion.div>
    </DashboardLayout>
  );
}

