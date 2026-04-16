'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { CreditCard, Zap, Shield, Sparkles } from 'lucide-react';

export default function BillingPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Resource & Billing</h1>
            <p className="text-muted-foreground text-sm">Manage your compute credits and enterprise subscription</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-medium">
            <CreditCard className="h-4 w-4" />
            Active Subscription: Enterprise
          </div>
        </div>

        {/* Pricing Cards Placeholder */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="p-6 rounded-2xl border border-violet-500/20 bg-[#12121a] flex flex-col items-center text-center space-y-4">
            <Zap className="h-10 w-10 text-violet-400" />
            <div>
              <h3 className="text-lg font-bold">Standard Compute</h3>
              <p className="text-sm text-muted-foreground">For small automation tasks</p>
            </div>
            <p className="text-3xl font-black font-mono">$49/mo</p>
            <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">Current Plan</button>
          </div>

          <div className="p-6 rounded-2xl border-2 border-violet-500 bg-[#12121a] flex flex-col items-center text-center space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-violet-500 text-[10px] font-bold text-white uppercase tracking-widest">Most Popular</div>
            <Sparkles className="h-10 w-10 text-violet-400" />
            <div>
              <h3 className="text-lg font-bold">QAntum Elite</h3>
              <p className="text-sm text-muted-foreground">Full self-healing capacity</p>
            </div>
            <p className="text-3xl font-black font-mono">$199/mo</p>
            <button className="w-full py-2 rounded-lg bg-violet-600 hover:bg-violet-700 transition-colors text-sm font-medium">Upgrade Now</button>
          </div>

          <div className="p-6 rounded-2xl border border-violet-500/20 bg-[#12121a] flex flex-col items-center text-center space-y-4">
            <Shield className="h-10 w-10 text-cyan-400" />
            <div>
              <h3 className="text-lg font-bold">Sovereign Entity</h3>
              <p className="text-sm text-muted-foreground">Unlimited scale & custom nodes</p>
            </div>
            <p className="text-3xl font-black font-mono">Custom</p>
            <button className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium">Contact Sales</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
