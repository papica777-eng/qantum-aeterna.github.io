import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, ShieldAlert, Zap } from "lucide-react";

interface StatusData {
  status: string;
  active_runners: number;
  completed_jobs_session: number;
  total_tests_managed: number;
  self_healing_events: number;
  global_stability_score: string;
}

export function StatusCards({ data }: { data: StatusData | null }) {
  if (!data) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Tests</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total_tests_managed.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+201 from last hour</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Runners</CardTitle>
          <Zap className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.active_runners}</div>
          <p className="text-xs text-muted-foreground">Across 3 Regions</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Self-Healing Events</CardTitle>
          <ShieldAlert className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.self_healing_events}</div>
          <p className="text-xs text-muted-foreground">Tests saved from failure</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stability Score</CardTitle>
          <CheckCircle className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.global_stability_score}</div>
          <p className="text-xs text-muted-foreground">Predictive Analytics</p>
        </CardContent>
      </Card>
    </div>
  );
}
