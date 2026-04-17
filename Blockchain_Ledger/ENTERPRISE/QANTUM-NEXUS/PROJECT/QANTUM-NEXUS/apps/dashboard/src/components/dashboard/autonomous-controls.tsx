'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Sparkles, Brain, Zap } from 'lucide-react';

export function AutonomousControls() {
  const [testDescription, setTestDescription] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRunning(false);
  };

  const generateTest = async () => {
    if (!testDescription.trim()) return;
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsGenerating(false);
    setTestDescription('');
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
        <div className="flex gap-2">
          <Button onClick={runTests} disabled={isRunning} className="flex-1">
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running...' : 'Run Tests'}
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
            <Sparkles className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Generate AI Test'}
          </Button>
        </div>
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
