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

const stats = {
  totalRuns: 1284,
  totalRunsChange: 12.5,
  passRate: 94.2,
  passRateChange: 2.1,
  failedTests: 47,
  failedTestsChange: -8.3,
  healedSelectors: 156,
  healedSelectorsChange: 23.4,
};

export function StatsCards() {
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
      {cards.map((card, index) => (
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
            <div className="text-3xl font-bold stat-number">{card.value}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-2">
              {card.change > 0 ? (
                <ArrowUpRight className={cn(
                  'h-4 w-4 mr-1',
                  card.invertChange ? 'text-red-500' : 'text-emerald-500'
                )} />
              ) : (
                <ArrowDownRight className={cn(
                  'h-4 w-4 mr-1',
                  card.invertChange ? 'text-green-500' : 'text-red-500'
                )} />
              )}
              <span className={cn(
                card.change > 0
                  ? card.invertChange ? 'text-red-500' : 'text-green-500'
                  : card.invertChange ? 'text-green-500' : 'text-red-500'
              )}>
                {Math.abs(card.change)}%
              </span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
