import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function BillingPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col h-full space-y-4 p-4 lg:p-8">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Wealth Bridge & Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription, compute usage, and autonomous revenue streams.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-2xl bg-backgroundShadow space-y-4">
            <h3 className="text-lg font-semibold">Current Usage</h3>
            <p className="text-4xl font-bold">1.2 TB</p>
            <p className="text-sm text-green-500">↑ 12% from last month</p>
          </div>
          <div className="p-6 border rounded-2xl bg-backgroundShadow space-y-4">
            <h3 className="text-lg font-semibold">Projected MRR</h3>
            <p className="text-4xl font-bold">$12,450</p>
            <p className="text-sm text-green-500">O(1) Efficiency scaling</p>
          </div>
          <div className="p-6 border rounded-2xl bg-backgroundShadow border-primary/50 shadow-lg shadow-primary/10">
            <h3 className="text-lg font-semibold text-primary">Enterprise Plan</h3>
            <button className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity">
              Manage Billing
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
