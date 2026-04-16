import React from 'react';

// Complexity: O(1) settings mapping
export default function Settings({ onBack }: { onBack?: () => void }) {
  return (
    <div className="w-full min-h-screen bg-[#0f0f1a] text-slate-300 p-8 font-sans relative overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 border-b border-orange-500/20 pb-4">
          {onBack && (
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-lg transition">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
            </button>
          )}
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <span className="text-orange-400">⚙️</span> Settings & Substrate
          </h1>
        </div>

        <div className="bg-[#1a1a2e] border border-orange-900/30 p-8 rounded-xl space-y-8 mt-8">
          
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-400 border-b border-orange-900/30 pb-2">Neural Link Configuration</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-xs uppercase text-slate-500 mb-1">Heartbeat Frequency (ms)</label>
                <input type="text" defaultValue="5000" className="bg-[#0f0f1a] border border-slate-700 rounded px-3 py-2 text-white font-mono" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs uppercase text-slate-500 mb-1">Fallback Route</label>
                <input type="text" defaultValue="wss://qantum.aeterna.loc/bridge" className="bg-[#0f0f1a] border border-slate-700 rounded px-3 py-2 text-white font-mono" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-bold text-orange-400 border-b border-orange-900/30 pb-2">Cognitive Limits</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
                <span>Zero-Copy Memory Management (Require mmap)</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
                <span>Thread Pinning (Bind bridge to Core 0-3)</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-orange-500" />
                <span>Shadow DOM Piercing Protocol</span>
              </label>
            </div>
          </div>

          <div className="pt-6">
            <button className="px-6 py-2 bg-orange-600/20 text-orange-400 border border-orange-500/50 rounded font-bold hover:bg-orange-600/40 transition">
              APPLY_MUTATIONS
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
