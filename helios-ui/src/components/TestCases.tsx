import React, { useState } from 'react';

// Complexity: O(n) rendering where n is the number of test cases
export default function TestCases({ onBack }: { onBack?: () => void }) {
  const [cases] = useState([
    { id: 'TC-001', name: 'Neural Link Startup', status: 'ACTIVE', priority: 'CRITICAL', lastRun: '1h ago' },
    { id: 'TC-002', name: 'Quantum Bridge Verify', status: 'ACTIVE', priority: 'HIGH', lastRun: '2h ago' },
    { id: 'TC-003', name: 'Legacy DOM Bypass', status: 'DRAFT', priority: 'MEDIUM', lastRun: 'Never' },
    { id: 'TC-004', name: 'Shadow Router Audit', status: 'ACTIVE', priority: 'HIGH', lastRun: '3h ago' },
  ]);

  return (
    <div className="w-full min-h-screen bg-[#0f0f1a] text-slate-300 p-8 font-sans relative overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
          <div className="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
              </button>
            )}
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span className="text-cyan-400">🧪</span> Test Cases
            </h1>
          </div>
          <button className="px-4 py-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 font-mono text-sm rounded hover:bg-purple-600/40 transition">
            + CREATE_NEW_CASE
          </button>
        </div>

        <div className="grid gap-4 mt-8">
          {cases.map(tc => (
            <div key={tc.id} className="bg-[#1a1a2e] border border-cyan-900/40 p-5 rounded-xl flex items-center justify-between hover:border-cyan-500/50 transition">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-cyan-400 text-sm">{tc.id}</span>
                <span className="text-lg font-semibold text-white">{tc.name}</span>
              </div>
              <div className="flex items-center gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-500 uppercase">Priority</span>
                  <span className={`text-sm font-bold ${tc.priority === 'CRITICAL' ? 'text-red-400' : 'text-amber-400'}`}>{tc.priority}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xs text-slate-500 uppercase">Status</span>
                  <span className="text-sm font-medium text-emerald-400">{tc.status}</span>
                </div>
                <div className="flex flex-col items-center w-24">
                  <span className="text-xs text-slate-500 uppercase">Last Run</span>
                  <span className="text-sm text-slate-400">{tc.lastRun}</span>
                </div>
                <button className="px-3 py-1 bg-cyan-950/40 text-cyan-400 border border-cyan-800 rounded hover:bg-cyan-900 transition">
                  EXECUTE
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
