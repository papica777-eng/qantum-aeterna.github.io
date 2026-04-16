'use client';

import { useState } from 'react';
import DashboardLayout from '@/components/layout/dashboard-layout';
import { useStore } from '@/stores/nexus-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play,
  Square,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  Timer,
  Monitor,
  Smartphone,
  Globe,
  GitBranch,
  GitCommit,
  ExternalLink,
  ChevronDown,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface TestRun {
  id: string;
  name: string;
  status: 'running' | 'passed' | 'failed' | 'cancelled';
  progress: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: string;
  startedAt: string;
  branch: string;
  commit: string;
  browser: 'chrome' | 'firefox' | 'safari' | 'edge';
  triggeredBy: string;
  parallelism: number;
}

const browserIcons = {
  chrome: '🌐',
  firefox: '🦊',
  safari: '🧭',
  edge: '📘'
};

const statusConfig = {
  running: { color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Loader2, animate: true },
  passed: { color: 'text-green-400', bg: 'bg-green-500/10', icon: CheckCircle2, animate: false },
  failed: { color: 'text-red-400', bg: 'bg-red-500/10', icon: XCircle, animate: false },
  cancelled: { color: 'text-gray-400', bg: 'bg-gray-500/10', icon: AlertCircle, animate: false },
};

export default function RunsPage() {
  const runsStore = useStore((state) => state.testRuns) || [];
  const [runs, setRuns] = useState(runsStore);
  const [filter, setFilter] = useState<'all' | 'running' | 'passed' | 'failed'>('all');

  // Sync internal state with store
  if (runsStore !== runs) setRuns(runsStore);

  const filteredRuns = runs.filter(run => 
    filter === 'all' ? true : run.status === filter
  );

  const runningCount = runs.filter(r => r.status === 'running').length;
  const passedCount = runs.filter(r => r.status === 'passed').length;
  const failedCount = runs.filter(r => r.status === 'failed').length;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Test Runs</h1>
            <p className="text-muted-foreground">
              Monitor test execution and view results in real-time
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-700 hover:to-cyan-700">
              <Play className="h-4 w-4" />
              New Run
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card 
            className={`bg-slate-900/50 border-slate-800 cursor-pointer transition-all ${filter === 'all' ? 'ring-2 ring-violet-500' : ''}`}
            onClick={() => setFilter('all')}
          >
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Runs</span>
                <span className="text-2xl font-bold">{runs.length}</span>
              </div>
            </CardContent>
          </Card>
          <Card 
            className={`bg-slate-900/50 border-slate-800 cursor-pointer transition-all ${filter === 'running' ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => setFilter('running')}
          >
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-blue-400">Running</span>
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                  <span className="text-2xl font-bold text-blue-400">{runningCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card 
            className={`bg-slate-900/50 border-slate-800 cursor-pointer transition-all ${filter === 'passed' ? 'ring-2 ring-green-500' : ''}`}
            onClick={() => setFilter('passed')}
          >
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-400">Passed</span>
                <span className="text-2xl font-bold text-green-400">{passedCount}</span>
              </div>
            </CardContent>
          </Card>
          <Card 
            className={`bg-slate-900/50 border-slate-800 cursor-pointer transition-all ${filter === 'failed' ? 'ring-2 ring-red-500' : ''}`}
            onClick={() => setFilter('failed')}
          >
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-red-400">Failed</span>
                <span className="text-2xl font-bold text-red-400">{failedCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Runs List */}
        <div className="space-y-4">
          {filteredRuns.map((run) => {
            const StatusIcon = statusConfig[run.status].icon;
            
            return (
              <Card key={run.id} className="bg-slate-900/50 border-slate-800 overflow-hidden hover:border-slate-700 transition-all cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    {/* Left Side - Main Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <StatusIcon 
                          className={`h-5 w-5 ${statusConfig[run.status].color} ${statusConfig[run.status].animate ? 'animate-spin' : ''}`} 
                        />
                        <h3 className="font-semibold text-lg">{run.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${statusConfig[run.status].bg} ${statusConfig[run.status].color}`}>
                          {run.status}
                        </span>
                      </div>

                      {/* Progress Bar for Running */}
                      {run.status === 'running' && (
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-blue-400">{run.progress}%</span>
                          </div>
                          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all duration-500"
                              style={{ width: `${run.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Meta Info */}
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <GitBranch className="h-4 w-4" />
                          <span>{run.branch}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GitCommit className="h-4 w-4" />
                          <span className="font-mono">{run.commit}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>{browserIcons[run.browser]}</span>
                          <span className="capitalize">{run.browser}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          <span>{run.parallelism}x parallel</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Side - Stats */}
                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Timer className="h-4 w-4 text-muted-foreground" />
                          <span>{run.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{run.startedAt}</span>
                        </div>
                      </div>

                      {/* Test Results */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 bg-green-500/10 px-3 py-1 rounded-full">
                          <CheckCircle2 className="h-4 w-4 text-green-400" />
                          <span className="text-green-400 text-sm font-medium">{run.passedTests}</span>
                        </div>
                        <div className="flex items-center gap-1.5 bg-red-500/10 px-3 py-1 rounded-full">
                          <XCircle className="h-4 w-4 text-red-400" />
                          <span className="text-red-400 text-sm font-medium">{run.failedTests}</span>
                        </div>
                        <span className="text-muted-foreground text-sm">/ {run.totalTests} tests</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">by {run.triggeredBy}</span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRuns.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Monitor className="h-12 w-12 mb-4 opacity-50" />
            <p>No test runs found matching your filter</p>
            <Button variant="link" onClick={() => setFilter('all')}>
              Show all runs
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
