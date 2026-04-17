'use client';

import { useState } from 'react';
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Loader2, Globe, ShieldCheck, Zap, Server, ChevronRight, FileDown } from "lucide-react";
import { PdfReport } from "@/components/dashboard/pdf-report";

export default function ApiSenseiPage() {
  const [url, setUrl] = useState("");
  const [isProbing, setIsProbing] = useState(false);
  const [probeStep, setProbeStep] = useState(0);
  const [result, setResult] = useState<any>(null);
  
  // For the PDF component
  const [reportData, setReportData] = useState({ timestamp: "", uuid: "" });

  const steps = [
    "Resolving DNS & Host...",
    "Validating SSL/TLS Certificate...",
    "Pinging Endpoints & TTFB...",
    "Analyzing Security Headers...",
    "Finalizing Telemetry Report..."
  ];

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !url.includes('.')) return;
    
    // Ensure protocol for display purposes
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    setUrl(targetUrl);
    setResult(null);
    setIsProbing(true);
    setProbeStep(0);

    // Mock progress visual sequence while fetching
    const progressTimer = setInterval(() => {
        setProbeStep((prev) => {
            if (prev < steps.length - 1) return prev + 1;
            return prev;
        });
    }, 800);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: targetUrl })
      });

      const data = await response.json();
      
      clearInterval(progressTimer);
      setProbeStep(steps.length - 1); // jump to end

      const newUuid = crypto.randomUUID().toUpperCase();
      const newTimestamp = new Date().toISOString();
      setReportData({ timestamp: newTimestamp, uuid: newUuid });

      if (!response.ok) {
         // Create a failure result based on the real error
         setResult({
           dns: 'FAIL',
           ttfb: 'FAIL',
           ssl: 'FAIL',
           secHeaders: 'UNREACHABLE',
           grade: 'F',
           endpoints: [
             { path: 'CONNECTION', status: 'ERR', time: data.error || 'Connection Refused' }
           ]
         });
      } else {
         // Valid result from backend
         setResult(data);
      }
    } catch (err: any) {
       clearInterval(progressTimer);
       setResult({
          dns: 'FAIL', ttfb: 'FAIL', ssl: 'FAIL', secHeaders: 'ERROR', grade: 'F',
          endpoints: [{ path: 'CRITICAL_FAULT', status: 500, time: err.message }]
       });
    } finally {
       setIsProbing(false);
    }
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <>
      {/* Hidden PDF component strictly for printing via window.print() overlay */}
      {result && (
        <PdfReport 
          url={url} 
          result={result} 
          timestamp={reportData.timestamp} 
          uuid={reportData.uuid} 
        />
      )}

      {/* Main Dashboard (Hidden during print) */}
      <div className="print:hidden">
        <DashboardLayout>
          
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-[28px] font-bold">API Sensei</h1>
              <p className="text-[var(--q-text-secondary)] mt-1">
                Deep-probe websites and APIs. Generate unforgeable PDF proofs.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Panel: Initialization */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              <div className="bg-[var(--q-bg-card)] border border-[var(--q-border)] rounded-[16px] p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--q-primary)] to-[var(--q-info)]" />
                
                <h2 className="text-[20px] font-bold mb-4 flex items-center gap-2">
                  <Globe className="text-[var(--q-primary)] h-6 w-6" /> Target Auditor
                </h2>
                
                <form onSubmit={handleAudit} className="space-y-4">
                  <div>
                    <label className="block text-[13px] text-[var(--q-text-muted)] font-medium mb-1 uppercase tracking-wider">
                      Target URL / Endpoint
                    </label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="e.g. api.aeterna.cloud"
                        className="w-full bg-[var(--q-bg-input)] border border-[var(--q-border)] rounded-[10px] py-3 pl-4 pr-12 text-[15px] font-mono text-[var(--q-text-primary)] focus:outline-none focus:border-[var(--q-primary)] transition-colors"
                        disabled={isProbing}
                      />
                      <Zap className={`absolute right-4 top-3 h-5 w-5 ${isProbing ? 'text-[var(--q-warning)]' : 'text-[var(--q-text-muted)]'}`} />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isProbing || !url.trim()}
                    className="w-full h-[52px] rounded-[10px] font-bold text-[15px] border-none text-white transition-all bg-[var(--q-primary)] hover:bg-[var(--q-primary-dark)] shadow-md disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                  >
                    {isProbing ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> ANALYZING TARGET...</>
                    ) : (
                      "EXECUTE AUDIT"
                    )}
                  </button>
                </form>
              </div>

              {/* Status Tracker */}
              {isProbing && (
                <div className="bg-[var(--q-bg-card)] border border-[var(--q-border)] rounded-[16px] p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-[14px] font-bold uppercase tracking-wider text-[var(--q-text-muted)] mb-4">Diagnostic Sequence</h3>
                  <div className="space-y-4">
                    {steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-3">
                         <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                           index < probeStep ? 'bg-[var(--q-success)] text-white' : 
                           index === probeStep ? 'bg-[var(--q-primary)] text-white' : 
                           'bg-[var(--q-bg-input)] text-[var(--q-text-muted)]'
                         }`}>
                           {index < probeStep ? '✓' : index + 1}
                         </div>
                         <span className={`text-[14px] font-medium ${index <= probeStep ? 'text-[var(--q-text-primary)]' : 'text-[var(--q-text-muted)]'}`}>
                           {step}
                         </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right Panel: Results */}
            <div className="lg:col-span-7">
              {!result && !isProbing ? (
                <div className="h-full min-h-[400px] border-2 border-dashed border-[var(--q-border)] rounded-[16px] flex flex-col items-center justify-center text-[var(--q-text-muted)] p-8 text-center bg-[var(--q-bg-card)] opacity-50">
                   <Server className="h-16 w-16 mb-4 opacity-30" />
                   <p className="text-[18px] font-medium text-[var(--q-text-secondary)]">Awaiting Target Parameters</p>
                   <p className="text-[14px] mt-2 max-w-[400px]">Enter a domain or API endpoint on the left to initiate a full diagnostic sequence and generate a verified PDF proof.</p>
                </div>
              ) : result ? (
                <div className="bg-[var(--q-bg-card)] border border-[var(--q-border)] rounded-[16px] p-0 shadow-xl overflow-hidden animate-in zoom-in-95 duration-500">
                   
                   {/* Top Result Banner */}
                   <div className="bg-gradient-to-r from-[var(--q-success)] to-emerald-600 p-8 text-white flex justify-between items-center">
                     <div>
                       <div className="text-[48px] font-black leading-none drop-shadow-md">{result.grade}</div>
                       <div className="text-[14px] font-semibold tracking-wider uppercase opacity-90 mt-2">Target Certified</div>
                     </div>
                     <ShieldCheck className="h-20 w-20 opacity-30 mix-blend-overlay" />
                   </div>

                   {/* Data Grid */}
                   <div className="p-8">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-[20px] font-bold">Telemetry Breakdown</h3>
                        <div className="text-[12px] font-mono text-[var(--q-text-muted)] bg-[var(--q-bg-input)] px-3 py-1 rounded-full border border-[var(--q-border)]">
                          {reportData.timestamp}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <div className="p-4 bg-[var(--q-bg-input)] rounded-[12px] border border-[var(--q-border)]">
                          <div className="text-[11px] text-[var(--q-text-muted)] uppercase font-semibold mb-1">DNS</div>
                          <div className="text-[20px] font-mono font-bold text-[var(--q-text-primary)]">{result.dns}</div>
                        </div>
                        <div className="p-4 bg-[var(--q-bg-input)] rounded-[12px] border border-[var(--q-border)]">
                          <div className="text-[11px] text-[var(--q-text-muted)] uppercase font-semibold mb-1">TTFB</div>
                          <div className="text-[20px] font-mono font-bold text-[var(--q-info)]">{result.ttfb}</div>
                        </div>
                        <div className="p-4 bg-[var(--q-bg-input)] rounded-[12px] border border-[var(--q-border)]">
                          <div className="text-[11px] text-[var(--q-text-muted)] uppercase font-semibold mb-1">SSL/TLS</div>
                          <div className="text-[20px] font-mono font-bold text-[var(--q-success)]">{result.ssl}</div>
                        </div>
                        <div className="p-4 bg-[var(--q-bg-input)] rounded-[12px] border border-[var(--q-border)]">
                          <div className="text-[11px] text-[var(--q-text-muted)] uppercase font-semibold mb-1">Headers</div>
                          <div className="text-[14px] font-mono font-bold text-[var(--q-warning)] truncate">{result.secHeaders}</div>
                        </div>
                      </div>

                      <div className="mb-8">
                        <h4 className="text-[14px] font-bold uppercase text-[var(--q-text-muted)] mb-3 flex items-center justify-between">
                          <span>Endpoint Map</span>
                          <span className="text-[10px] bg-[var(--q-bg-dark)] px-2 py-0.5 rounded text-[var(--q-text-primary)]">Layer 7</span>
                        </h4>
                        <div className="border border-[var(--q-border)] rounded-[10px] overflow-hidden">
                           {result.endpoints.map((ep: any, idx: number) => (
                             <div key={idx} className="flex justify-between items-center p-3 border-b border-[var(--q-border)] last:border-0 bg-[var(--q-bg-input)]">
                               <div className="font-mono text-[14px]">{ep.path}</div>
                               <div className="flex gap-4 items-center">
                                 <span className="font-mono text-[13px] text-[var(--q-text-secondary)]">{ep.time}</span>
                                 <span className={`px-2 py-1 rounded-[4px] text-[11px] font-bold ${ep.status === 200 ? 'bg-[var(--q-success)]/20 text-[var(--q-success)]' : 'bg-[var(--q-error)]/20 text-[var(--q-error)]'}`}>
                                   HTTP {ep.status}
                                 </span>
                               </div>
                             </div>
                           ))}
                        </div>
                      </div>

                      {result.findings && result.findings.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-[14px] font-bold uppercase text-[var(--q-text-muted)] mb-3 flex items-center gap-2">
                             <ShieldCheck className="w-4 h-4 text-[var(--q-warning)]" /> CyberCody Security Audit
                          </h4>
                          <div className="space-y-3">
                            {result.findings.map((f: any, idx: number) => (
                               <div key={idx} className="border border-[var(--q-warning)]/30 bg-[var(--q-warning)]/5 p-4 rounded-[10px]">
                                  <div className="flex justify-between items-start mb-2">
                                     <div className="flex items-center gap-2">
                                        <span className="bg-[var(--q-warning)] text-[var(--q-bg-dark)] text-[10px] px-2 py-0.5 rounded-[4px] font-bold uppercase">{f.severity}</span>
                                        <h5 className="font-bold text-[14px] text-[var(--q-text-primary)]">{f.title}</h5>
                                     </div>
                                     <span className="text-[12px] font-mono text-[var(--q-text-muted)] border border-[var(--q-border)] px-1.5 rounded bg-[var(--q-bg-input)]">CVSS: {f.cvss}</span>
                                  </div>
                                  <p className="text-[13px] text-[var(--q-text-secondary)] mb-2">{f.description}</p>
                                  <div className="bg-[var(--q-bg-dark)] p-3 rounded-[6px] border border-[var(--q-border)]">
                                     <div className="text-[11px] font-bold text-[var(--q-text-muted)] uppercase mb-1">Recommendation</div>
                                     <code className="text-[12px] text-[var(--q-primary)] font-mono">{f.recommendation}</code>
                                  </div>
                               </div>
                            ))}
                          </div>
                        </div>
                      )}
                   </div>

                   {/* Actions Footer */}
                   <div className="bg-[var(--q-bg-input)] border-t border-[var(--q-border)] p-6 flex justify-between items-center">
                     <div className="text-[12px] font-mono text-[var(--q-text-muted)]">
                       HASH: {reportData.uuid.split('-')[0]}
                     </div>
                     <button 
                       onClick={handlePrintPDF}
                       className="bg-[var(--q-text-primary)] text-[var(--q-bg-dark)] hover:bg-[var(--q-primary-light)] px-5 py-2.5 rounded-[8px] font-bold text-[14px] flex items-center gap-2 transition-colors"
                     >
                       <FileDown className="h-4 w-4" /> Download PDF Proof
                     </button>
                   </div>
                </div>
              ) : (
                <div className="h-full border border-[var(--q-border)] rounded-[16px] bg-[var(--q-bg-card)] overflow-hidden flex flex-col relative">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Zap className="w-64 h-64 text-[var(--q-primary)] animate-pulse" />
                  </div>
                  <div className="flex-1 p-8 flex flex-col justify-end">
                     <div className="text-[18px] font-mono text-[var(--q-primary)] mb-2">Analyzing Node:</div>
                     <div className="text-[32px] font-bold truncate text-white">{url}</div>
                  </div>
                  <div className="h-2 w-full bg-[var(--q-bg-input)]">
                     <div className="h-full bg-gradient-to-r from-[var(--q-primary)] to-[var(--q-info)] transition-all ease-out duration-300" style={{ width: `${((probeStep + 1) / steps.length) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>

          </div>
        </DashboardLayout>
      </div>
    </>
  );
}
