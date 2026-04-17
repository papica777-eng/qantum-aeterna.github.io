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
} from 'lucide-react';
import Link from 'next/link';

interface TestRun {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'running';
  duration: number;
  passedTests: number;
  failedTests: number;
  healedTests: number;
  ghostMode: boolean;
  createdAt: string;
}

const runs: TestRun[] = [
  {
    id: 'run-1',
    name: 'E2E Checkout Flow',
    status: 'passed',
    duration: 45000,
    passedTests: 24,
    failedTests: 0,
    healedTests: 2,
    ghostMode: true,
    createdAt: '2026-01-03T18:55:00.000Z',
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
    createdAt: '2026-01-03T18:30:00.000Z',
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
    createdAt: '2026-01-03T19:10:00.000Z',
  },
  {
    id: 'run-4',
    name: 'API Integration',
    status: 'passed',
    duration: 89000,
    passedTests: 156,
    failedTests: 0,
    healedTests: 8,
    ghostMode: true,
    createdAt: '2026-01-03T17:00:00.000Z',
  },
];

export function RecentRuns() {

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default:
        return null;
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
        </div>
      </CardContent>
    </Card>
  );
}
