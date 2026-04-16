'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  CheckCircle2,
  XCircle,
  Wand2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { cn, formatPercentage } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface DashboardStats {
  totalRuns: number;
  totalRunsChange: number;
  passRate: number;
  passRateChange: number;
  failedTests: number;
  failedTestsChange: number;
  healedSelectors: number;
  healedSelectorsChange: number;
}

// Fallback mock until API is live
const MOCK_STATS: DashboardStats = {
  totalRuns: 1308,
  totalRunsChange: 12.9,
  passRate: 96.0,
  passRateChange: 2.6,
  failedTests: 55,
  failedTestsChange: -14.0,
  healedSelectors: 148,
  healedSelectorsChange: 17.0,
};

export function StatsCards() {
  const [stats, setStats] = useState<DashboardStats>(MOCK_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/v1/dashboard/stats');
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        // Fallback to mock — backend not running
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Poll every 30s for live updates
    const interval = setInterval(fetchStats, 30_000);
    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      title: 'Total Test Runs',
      value: stats?.totalRuns.toLocaleString() || '0',
      change: stats?.totalRunsChange || 0,
      icon: Activity,
      color: 'text-blue-500',
    },
    {
      title: 'Pass Rate',
      value: formatPercentage(stats?.passRate || 0),
      change: stats?.passRateChange || 0,
      icon: CheckCircle2,
      color: 'text-green-500',
    },
    {
      title: 'Failed Tests',
      value: stats?.failedTests.toLocaleString() || '0',
      change: stats?.failedTestsChange || 0,
      icon: XCircle,
      color: 'text-red-500',
      invertChange: true,
    },
    {
      title: 'Healed Selectors',
      value: stats?.healedSelectors.toLocaleString() || '0',
      change: stats?.healedSelectorsChange || 0,
      icon: Wand2,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="singularity-card quantum-glow overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <div className={cn('p-2 rounded-lg', card.color.replace('text-', 'bg-') + '/10')}>
              <card.icon className={cn('h-4 w-4', card.color)} />
            </div>
          </CardHeader>
          <CardContent>
            <div className={cn('text-3xl font-bold stat-number', loading && 'opacity-50 animate-pulse')}>
              {card.value}
            </div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              {card.change > 0 ? (
                <ArrowUpRight className={cn(
                  'h-4 w-4 mr-1',
                  (card as any).invertChange ? 'text-red-500' : 'text-emerald-500'
                )} />
              ) : (
                <ArrowDownRight className={cn(
                  'h-4 w-4 mr-1',
                  (card as any).invertChange ? 'text-green-500' : 'text-red-500'
                )} />
              )}
              <span className={cn(
                card.change > 0
                  ? (card as any).invertChange ? 'text-red-500' : 'text-green-500'
                  : (card as any).invertChange ? 'text-green-500' : 'text-red-500'
              )}>
                {Math.abs(card.change).toFixed(1)}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
