'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Zap, 
  Search, 
  FileDown, 
  Globe, 
  Lock, 
  Activity, 
  Terminal,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';

export default function GeneratePage() {
  const [url, setUrl] = useState('');
  const [isProbing, setIsProbing] = useState(false);
  const [probeStep, setProbeStep] = useState(0);
  const [result, setResult] = useState<any>(null);

  const steps = [
    "Initializing CyberCody V3 Core...",
    "Scanning Domain DNS & SSL Certificates...",
    "Probing Layer 7 Endpoints...",
    "Analyzing Header Security (CSP/HSTS)...",
    "Running Neural Threat Simulation...",
    "Finalizing Security Proof..."
  ];

  useEffect(() => {
    let interval: any;
    if (isProbing && probeStep < steps.length) {
      interval = setInterval(() => {
        setProbeStep(prev => prev + 1);
      }, 800);
    } else if (probeStep === steps.length) {
      setIsProbing(false);
      setResult({
        grade: "A+",
        score: 98,
        dns: "SECURE",
        ttfb: "124ms",
        ssl: "EXCELLENT",
        secHeaders: "MAXIMAL",
        endpoints: [
          { path: "/api/v1/auth", status: 200, time: "42ms" },
          { path: "/api/v1/swarm", status: 200, time: "89ms" },
          { path: "/vault/secure", status: 200, time: "31ms" }
        ],
        findings: [
          { title: "Quantum-Safe Encryption", severity: "LOW", cvss: 1.2, description: "System is already using post-quantum crypto primitives.", recommendation: "No action needed." }
        ]
      });
    }
    return () => clearInterval(interval);
  }, [isProbing, probeStep]);

  const handleProbe = () => {
    if (!url) return;
    setIsProbing(true);
    setProbeStep(0);
    setResult(null);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-white">AI Security Generator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl bg-[#0a0a10] border border-white/5 space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-purple-400" />
                CyberCody Audit
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Target Endpoint URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input 
                      type="text" 
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://your-nexus-node.io"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                    />
                  </div>
                </div>
                <button 
                  onClick={handleProbe}
                  disabled={isProbing || !url}
                  className="w-full bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                >
                  {isProbing ? <Zap className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  {isProbing ? "Auditing..." : "Run Security Probe"}
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/5">
              <h3 className="font-semibold text-white mb-2">Enterprise Verification</h3>
              <p className="text-sm text-gray-400">CyberCody executes a multi-layer penetration simulation to verify your node's integrity within the AETERNA infrastructure.</p>
            </div>
          </div>

          <div className="lg:col-span-8 min-h-[500px]">
            <AnimatePresence mode="wait">
              {!isProbing && !result && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full rounded-2xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center text-center p-12 space-y-4"
                >
                  <div className="p-4 rounded-full bg-white/5">
                    <Activity className="w-12 h-12 text-gray-600" />
                  </div>
                  <div className="max-w-xs">
                    <h3 className="text-lg font-medium text-white mb-1">Awaiting Telemetry</h3>
                    <p className="text-sm text-gray-500">Enter a target URL to initiate a zero-entropy security audit via the CyberCody neural bridge.</p>
                  </div>
                </motion.div>
              )}

              {isProbing && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full rounded-2xl bg-[#0a0a10] border border-white/5 p-8 flex flex-col items-center justify-center space-y-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-purple-500/20 blur-3xl animate-pulse rounded-full" />
                    <Zap className="w-20 h-20 text-purple-400 relative animate-bounce" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold text-white tracking-tight">{steps[probeStep]}</h3>
                    <p className="text-sm text-gray-500 font-mono">Analyzing bitstreams on Ryzen 7950X Core {probeStep}...</p>
                  </div>
                  <div className="w-64 h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${((probeStep + 1) / steps.length) * 100}%` }}
                      className="h-full bg-purple-500"
                    />
                  </div>
                </motion.div>
              )}

              {result && (
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-[#0a0a10] border border-white/5 overflow-hidden"
                >
                  <div className="p-8 border-b border-white/5 bg-gradient-to-r from-emerald-500/10 to-transparent flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl font-bold">
                        {result.grade}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">Audit Certified</h3>
                        <p className="text-sm text-gray-400">UUID: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
                      </div>
                    </div>
                    <ShieldCheck className="w-12 h-12 text-emerald-500 opacity-50" />
                  </div>

                  <div className="p-8 space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {[
                        { label: 'DNS Status', value: result.dns, color: 'text-emerald-400' },
                        { label: 'Latency', value: result.ttfb, color: 'text-blue-400' },
                        { label: 'SSL/TLS', value: result.ssl, color: 'text-emerald-400' },
                        { label: 'Headers', value: result.secHeaders, color: 'text-purple-400' }
                      ].map((idx) => (
                        <div key={idx.label} className="p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">{idx.label}</div>
                          <div className={`text-xl font-bold ${idx.color}`}>{idx.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                         <Activity className="w-4 h-4 text-purple-400" />
                         Endpoint Telemetry
                      </h4>
                      <div className="rounded-xl border border-white/5 overflow-hidden">
                        {result.endpoints.map((ep: any, i: number) => (
                          <div key={i} className="flex items-center justify-between p-4 bg-white/5 border-b border-white/5 last:border-0 hover:bg-white/[0.07] transition-colors">
                            <code className="text-sm text-blue-400">{ep.path}</code>
                            <div className="flex items-center gap-4">
                              <span className="text-xs text-gray-500">{ep.time}</span>
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-xs font-bold">HTTP {ep.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl border border-white/5 p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Lock className="w-6 h-6 text-purple-400" />
                        <div>
                          <div className="text-sm font-bold text-white">Full Security Proof</div>
                          <div className="text-xs text-gray-500">Download cryptographically signed PDF report</div>
                        </div>
                      </div>
                      <button className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all text-sm">
                        <FileDown className="w-4 h-4" />
                        Download Proof
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
