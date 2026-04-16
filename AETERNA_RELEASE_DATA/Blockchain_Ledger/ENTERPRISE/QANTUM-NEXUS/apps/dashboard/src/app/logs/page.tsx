import DashboardLayout from "@/components/layout/dashboard-layout";
import { LiveFeedPanel } from "@/components/nexus/operations/live-feed-panel";
import { WatchdogPanel } from "@/components/dashboard/watchdog-panel";

export default function LogsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full space-y-4 p-4 lg:p-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">
            Real-time telemetry and autonomous swarm activity monitoring.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
          <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-backgroundShadow">
            <LiveFeedPanel />
          </div>
          <div className="flex flex-col h-full border rounded-xl overflow-hidden bg-backgroundShadow">
            <WatchdogPanel />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
