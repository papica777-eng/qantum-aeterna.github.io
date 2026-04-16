'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn, formatDuration, formatDate, getStatusColor, getStatusBg } from '@/lib/utils';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Ghost,
  Wand2,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TestRun {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running' | 'COMPLETED' | 'FAILED' | 'RUNNING' | 'PENDING';
  duration: number;
  passedTests: number;
  failedTests: number;
  healedTests: number;
  ghostMode: boolean;
  createdAt: string;
  // API shape
  passed?: number;
  failed?: number;
  totalTests?: number;
  completedAt?: string;
  startedAt?: string;
  project?: { name: string };
}

// Normalize API run to UI format
function normalizeRun(run: any): TestRun {
  const statusMap: Record<string, TestRun['status']> = {
    COMPLETED: 'passed',
    FAILED: 'failed',
    RUNNING: 'running',
    PENDING: 'running',
    passed: 'passed',
    failed: 'failed',
    running: 'running',
  };

  const durationMs = run.completedAt && run.startedAt
    ? new Date(run.completedAt).getTime() - new Date(run.startedAt).getTime()
    : run.duration || 0;

  return {
    id: run.id,
    name: run.name || run.project?.name || `Run #${String(run.id).slice(0, 8)}`,
    status: statusMap[run.status] || 'running',
    duration: durationMs,
    passedTests: run.passed ?? run.passedTests ?? 0,
    failedTests: run.failed ?? run.failedTests ?? 0,
    healedTests: run.healedTests ?? 0,
    ghostMode: run.ghostMode ?? false,
    createdAt: run.createdAt,
  };
}

const MOCK_RUNS: TestRun[] = [
  {
    id: 'run-1',
    name: 'E2E Checkout Flow',
    status: 'passed',
    duration: 45000,
    passedTests: 24,
    failedTests: 0,
    healedTests: 2,
    ghostMode: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
  },
  {
    id: 'run-2',
    name: 'Login Regression',
    status: 'failed',
    duration: 32000,
    passedTests: 18,
    failedTests: 3,
    healedTests: 1,
    ghostMode: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'run-3',
    name: 'Dashboard Tests',
    status: 'running',
    duration: 0,
    passedTests: 12,
    failedTests: 0,
    healedTests: 0,
    ghostMode: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
];

export function RecentRuns() {
  const [runs, setRuns] = useState<TestRun[]>(MOCK_RUNS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRuns = async () => {
      try {
        const res = await fetch('/api/v1/runs');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setRuns(data.slice(0, 5).map(normalizeRun));
          }
        }
      } catch {
        // Silently fallback — backend offline
      } finally {
        setLoading(false);
      }
    };

    fetchRuns();
    // Poll every 10s — runs can change frequently
    const interval = setInterval(fetchRuns, 10_000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Test Runs</CardTitle>
        <Link
          href="/runs"
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          View all
          <ExternalLink className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {runs?.map((run) => (
            <Link
              key={run.id}
              href={`/runs/${run.id}`}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {getStatusIcon(run.status)}
                <div>
                  <p className="font-medium">{run.name}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{formatDate(run.createdAt)}</span>
                    {run.duration > 0 && (
                      <>
                        <span>•</span>
                        <span>{formatDuration(run.duration)}</span>
                      </>
                    )}
                    {run.ghostMode && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-purple-400">
                          <Ghost className="h-3 w-3" />
                          Ghost
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Test counts */}
                <div className="flex items-center gap-3 text-sm">
                  <span className="flex items-center gap-1 text-green-500">
                    <CheckCircle2 className="h-4 w-4" />
                    {run.passedTests}
                  </span>
                  {run.failedTests > 0 && (
                    <span className="flex items-center gap-1 text-red-500">
                      <XCircle className="h-4 w-4" />
                      {run.failedTests}
                    </span>
                  )}
                  {run.healedTests > 0 && (
                    <span className="flex items-center gap-1 text-purple-500">
                      <Wand2 className="h-4 w-4" />
                      {run.healedTests}
                    </span>
                  )}
                </div>

                {/* Status badge */}
                <span
                  className={cn(
                    'px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
                    getStatusBg(run.status),
                    getStatusColor(run.status)
                  )}
                >
                  {run.status}
                </span>
              </div>
            </Link>
          ))}

          {loading && runs.length === 0 && (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Loading runs...
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
