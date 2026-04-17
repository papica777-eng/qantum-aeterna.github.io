'use client';

import { useState } from 'react';
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useStore } from "@/stores/nexus-store";
import { Loader2, TerminalSquare, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GeneratePage() {
  const generateTest = useStore((state) => state.generateTest);
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleManifest = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setOutput("");
    
    // Call the mock generator in store
    const result = await generateTest(prompt);
    
    setOutput(result);
    setIsGenerating(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col flex-1 h-[calc(100vh-2rem)] overflow-hidden">
        <div className="flex flex-col space-y-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">AI Asset Generator</h1>
          <p className="text-muted-foreground">
            Generate new Micro-SaaS logic nodes and autonomous agents.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
          
          {/* Left panel - prompt */}
          <div className="flex flex-col space-y-6 w-full md:w-1/3 bg-slate-900/50 border border-slate-800 rounded-3xl p-6">
            <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-cyan-600 rounded-2xl rotate-3 flex items-center justify-center shadow-lg mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 22 4-10 4 10"/><path d="M12 18H8"/><path d="M12 18h4"/></svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Prompt Substrate</h2>
              <p className="text-sm text-muted-foreground">Describe the required integration or test case flow. The swarm will generate the corresponding logic node and test mapping.</p>
            </div>
            
            <textarea 
              className="flex-1 w-full bg-black/40 border border-slate-700 rounded-xl p-4 resize-none outline-none focus:ring-2 focus:ring-violet-500 font-mono text-sm"
              placeholder="e.g. Test user login flow handling incorrect passwords and lockouts..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <Button 
              className="w-full h-14 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700 text-lg font-bold disabled:opacity-50"
              onClick={handleManifest}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Manifesting...</>
              ) : "Manifest Node"}
            </Button>
          </div>

          {/* Right panel - output */}
          <div className="flex-1 flex flex-col bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden relative">
            <div className="h-12 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4">
               <div className="flex items-center gap-2 text-slate-400">
                  <TerminalSquare className="h-4 w-4" />
                  <span className="text-sm font-mono text-slate-400">generated_node.ts</span>
               </div>
               {output && (
                 <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 group">
                   {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-slate-400 group-hover:text-white" />}
                   <span className="ml-2 text-xs">{copied ? 'Copied' : 'Copy'}</span>
                 </Button>
               )}
            </div>
            
            <div className="flex-1 p-4 overflow-auto">
              {!output && !isGenerating && (
                 <div className="h-full flex flex-col items-center justify-center text-slate-600">
                    <TerminalSquare className="h-12 w-12 mb-4 opacity-50" />
                    <p className="font-mono text-sm">Awaiting neural compilation...</p>
                 </div>
              )}
              {isGenerating && (
                 <div className="h-full flex flex-col items-center justify-center text-violet-400">
                    <Loader2 className="h-12 w-12 mb-4 animate-spin" />
                    <p className="font-mono text-sm animate-pulse">Synthesizing substrate pathways...</p>
                 </div>
              )}
              {output && !isGenerating && (
                <pre className="font-mono text-sm text-cyan-50 leading-relaxed overflow-x-auto whitespace-pre-wrap">
                  {output}
                </pre>
              )}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
