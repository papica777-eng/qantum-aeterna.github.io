import React, { useState } from 'react';

// Complexity: O(n) rendering where n is the number of test runs
export default function TestRuns({ onBack }: { onBack?: () => void }) {
  const [runs] = useState([
    { id: 'RUN-992', suite: 'Ghost Regression', status: 'SUCCESS', duration: '45s', date: '2026-04-16 11:15' },
    { id: 'RUN-991', suite: 'DOM Isolation', status: 'FAILED', duration: '12s', date: '2026-04-16 10:45' },
    { id: 'RUN-990', suite: 'Swarm Orchestration', status: 'SUCCESS', duration: '2m 10s', date: '2026-04-16 09:30' },
    { id: 'RUN-989', suite: 'Zero Entropy Sync', status: 'SUCCESS', duration: '18s', date: '2026-04-16 08:00' },
  ]);

  return (
    <div className="w-full min-h-screen bg-[#0f0f1a] text-slate-300 p-8 font-sans relative overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-blue-500/20 pb-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              </button>
            )}
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span className="text-blue-400">⏱️</span> Test Runs
            </h1>
          </div>
        </div>

        <div className="grid gap-3 mt-8">
          {runs.map(run => (
            <div key={run.id} className="bg-[#1a1a2e] border border-blue-900/30 p-4 rounded-xl flex items-center justify-between hover:border-blue-500/40 transition">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded flex items-center justify-center ${run.status === 'SUCCESS' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-red-900/30 text-red-400'}`}>
                  {run.status === 'SUCCESS' ? '✓' : '✗'}
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-mono text-blue-400 text-sm">{run.id}</span>
                  <span className="text-lg font-semibold text-white">{run.suite}</span>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-500 uppercase">Duration</span>
                  <span className="text-sm font-mono text-slate-300">{run.duration}</span>
                </div>
                <div className="flex flex-col items-center w-36">
                  <span className="text-xs text-slate-500 uppercase">Timestamp</span>
                  <span className="text-sm text-slate-400">{run.date}</span>
                </div>
                <button className="px-3 py-1 bg-blue-950/40 text-blue-400 border border-blue-800 rounded hover:bg-blue-900 transition">
                  VIEW LOGS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
