'use client';

import DashboardLayout from "@/components/layout/dashboard-layout";
import { useStore } from "@/stores/nexus-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, HeartPulse } from "lucide-react";

export default function HealingPage() {
  const healingEvents = useStore((state) => state.healingEvents) || [];

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Self-Healing Nexus</h1>
          <p className="text-muted-foreground">
            Monitoring and managing autonomous recovery protocols and substrate integrity.
          </p>
        </div>
        
        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="bg-slate-900/50 border-slate-800">
             <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                <ShieldCheck className="h-8 w-8 text-emerald-400 mb-2" />
                <h3 className="text-2xl font-bold">{healingEvents.length}</h3>
                <p className="text-sm text-muted-foreground">Selectors Healed</p>
             </CardContent>
           </Card>
           <Card className="bg-slate-900/50 border-slate-800">
             <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                <HeartPulse className="h-8 w-8 text-violet-400 mb-2 animate-pulse" />
                <h3 className="text-2xl font-bold">10.2M</h3>
                <p className="text-sm text-muted-foreground">Logic Nodes Monitored</p>
             </CardContent>
           </Card>
           <Card className="bg-slate-900/50 border-slate-800">
             <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="h-8 w-8 text-cyan-400 mb-2" />
                <h3 className="text-2xl font-bold">99.9%</h3>
                <p className="text-sm text-muted-foreground">Resolution Confidence</p>
             </CardContent>
           </Card>
        </div>

        <div className="flex flex-col space-y-4 pt-4">
          <h2 className="text-xl font-semibold">Recent Healing Events</h2>
          
          {healingEvents.length === 0 ? (
             <div className="flex-1 flex items-center justify-center border-2 border-dashed rounded-xl p-12 bg-slate-900/30 border-slate-800">
               <div className="text-center space-y-4">
                 <ShieldCheck className="w-12 h-12 text-muted-foreground flex items-center justify-center mx-auto" />
                 <h2 className="text-xl font-semibold text-muted-foreground">Substrate Stable</h2>
                 <p className="text-muted-foreground text-sm max-w-sm">No entropy detected. UI structure matches DOM mappings perfectly.</p>
               </div>
             </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {healingEvents.map((event, idx) => (
                <Card key={event.id || idx} className="bg-slate-900/50 border-slate-800 hover:border-violet-500/50 transition-colors">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        Selector Drift Detected
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-1">{event.message}</CardDescription>
                    </div>
                    <div className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded-full uppercase tracking-wider font-semibold">
                      {event.status || 'Applied'}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 bg-black/40 p-3 rounded border border-slate-800 font-mono text-sm mt-2">
                       <span className="text-red-400 line-through decoration-red-500/50">{event.selector}</span>
                       <ArrowRight className="h-4 w-4 text-muted-foreground" />
                       <span className="text-emerald-400">{event.resolvedTo}</span>
                    </div>
                    <div className="flex gap-6 mt-4 text-sm text-muted-foreground">
                       <div><strong>Confidence:</strong> {event.confidence}%</div>
                       <div><strong>Time Saved:</strong> {event.timeSaved}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
