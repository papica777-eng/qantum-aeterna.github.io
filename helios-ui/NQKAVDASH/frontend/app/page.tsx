"use client";

import { useEffect, useState } from "react";
import { StatusCards } from "@/components/status-cards";
import { LiveTerminal } from "@/components/live-terminal";
import { JobTrigger } from "@/components/job-trigger";
import { HeatmapMock } from "@/components/heatmap";

export default function Home() {
  const [stats, setStats] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/status");
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error("Backend offline", e);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Polling backup for stats
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <header className="mb-8 flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Veritas <span className="text-orange-500">Dashboard</span>
          </h1>
          <p className="text-slate-400 mt-1">
            "IT'sMine" Unified Platform • Playwright / Selenium / Cypress
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono text-green-500 bg-green-950/30 px-3 py-1 rounded border border-green-900">
            System Online
          </div>
        </div>
      </header>

      <section className="mb-8">
        <StatusCards data={stats} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2 space-y-8">
           <HeatmapMock />
           <JobTrigger onTrigger={fetchStats} />
        </div>
        <div>
          <LiveTerminal />
        </div>
      </div>
    </main>
  );
}
