import React from 'react';

// Complexity: O(1) static rendering
export default function Projects({ onBack }: { onBack?: () => void }) {
  const projects = [
    { name: 'Core Substrate', env: 'Production', nodes: 12, health: '100%' },
    { name: 'Quantum Legacy', env: 'Staging', nodes: 4, health: '98.5%' },
    { name: 'API Gateway', env: 'Production', nodes: 8, health: '100%' },
  ];

  return (
    <div className="w-full min-h-screen bg-[#0f0f1a] text-slate-300 p-8 font-sans relative overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4 border-b border-emerald-500/20 pb-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
          )}
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span className="text-emerald-400">📂</span> Workspace Projects
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {projects.map(proj => (
            <div key={proj.name} className="bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1a] border border-emerald-900/30 p-6 rounded-xl relative overflow-hidden group cursor-pointer hover:border-emerald-500/50 transition">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition"></div>
              <h3 className="text-xl font-bold text-white mb-1">{proj.name}</h3>
              <p className="text-sm font-mono text-emerald-400 mb-6">{proj.env}</p>
              
              <div className="flex justify-between items-center text-sm border-t border-emerald-900/30 pt-4 mt-auto">
                <div className="flex flex-col">
                  <span className="text-slate-500 text-xs">Active Nodes</span>
                  <span className="font-mono text-white">{proj.nodes}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-slate-500 text-xs">System Health</span>
                  <span className="font-mono text-emerald-400">{proj.health}</span>
                </div>
              </div>
            </div>
          ))}
          <div className="bg-[#1a1a2e]/50 border border-dashed border-slate-700 p-6 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#1a1a2e] transition hover:border-emerald-500/50">
            <div className="text-center">
              <span className="block text-3xl mb-2 text-slate-500">+</span>
              <span className="text-slate-400 font-medium">NEW_PROJECT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
