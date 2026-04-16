'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Brain, Zap, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface RunResult {
  status: 'success' | 'error';
  message: string;
  runId?: string;
}

export function AutonomousControls() {
  const [testDescription, setTestDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastResult, setLastResult] = useState<RunResult | null>(null);

  const runTests = async () => {
    if (!projectId.trim()) {
      setLastResult({ status: 'error', message: 'Project ID required to start a run.' });
      return;
    }
    setIsRunning(true);
    setLastResult(null);
    try {
      const res = await fetch('/api/v1/runs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId }),
      });
      const data = await res.json();
      if (res.ok) {
        setLastResult({ 
          status: 'success', 
          message: `Run started: ${data.run?.id?.slice(0, 8) ?? 'OK'}`,
          runId: data.run?.id
        });
      } else {
        setLastResult({ 
          status: 'error', 
          message: data.error?.message || 'Run failed to start.' 
        });
      }
    } catch (err: any) {
      setLastResult({ status: 'error', message: `Network error: ${err.message}` });
    } finally {
      setIsRunning(false);
    }
  };

  const generateTest = async () => {
    if (!testDescription.trim()) return;
    setIsGenerating(true);
    setLastResult(null);
    try {
      const res = await fetch('/api/v1/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: testDescription }),
      });
      const data = await res.json();
      if (res.ok) {
        setLastResult({ status: 'success', message: 'Test generated successfully.' });
        setTestDescription('');
      } else {
        setLastResult({ 
          status: 'error', 
          message: data.error?.message || 'Generation failed.' 
        });
      }
    } catch (err: any) {
      setLastResult({ status: 'error', message: `Network error: ${err.message}` });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Autonomous Cognitive Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Project ID input */}
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Project ID</label>
          <input
            type="text"
            placeholder="Enter project ID..."
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={runTests} disabled={isRunning} className="flex-1">
            {isRunning ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Starting Run...</>
            ) : (
              <><Play className="h-4 w-4 mr-2" /> Run Tests</>
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">AI Test Generation</label>
          <textarea
            placeholder="Describe the test scenario in natural language..."
            value={testDescription}
            onChange={(e) => setTestDescription(e.target.value)}
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
          <Button 
            onClick={generateTest} 
            disabled={isGenerating || !testDescription.trim()} 
            className="w-full" 
            variant="outline"
          >
            {isGenerating ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
            ) : (
              <><Sparkles className="h-4 w-4 mr-2" /> Generate AI Test</>
            )}
          </Button>
        </div>

        {/* Result feedback */}
        {lastResult && (
          <div className={`flex items-center gap-2 p-3 rounded-md text-sm ${
            lastResult.status === 'success' 
              ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}>
            {lastResult.status === 'success' 
              ? <CheckCircle2 className="h-4 w-4 shrink-0" /> 
              : <XCircle className="h-4 w-4 shrink-0" />}
            <span className="font-mono text-xs">{lastResult.message}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>System Status: Online</span>
          <div className="flex items-center gap-1">
            <Zap className="h-4 w-4 text-green-500" />
            <span>Autonomous Mode</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
