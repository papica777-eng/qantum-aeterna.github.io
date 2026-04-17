'use client';

import DashboardLayout from '@/components/layout/dashboard-layout';
import { useState } from 'react';
import { useStore } from '@/stores/nexus-store';

export default function DashboardPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [licenseVisible, setLicenseVisible] = useState(false);

  // Hooking to our QA store from earlier
  const runTest = useStore((state) => state.runTest);
  
  const handleRunPrediction = () => {
    setToastMessage('Running prediction analysis...');
    // Fake prediction trigger
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <header className="flex justify-between items-center mb-8 flex-col lg:flex-row gap-4 lg:gap-0 lg:items-center">
        <div>
          <h1 className="text-[28px] font-bold">Dashboard</h1>
          <p className="text-[var(--q-text-secondary)] mt-1">Welcome back! Here's what's happening with your tests.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 rounded-[10px] text-[14px] font-medium transition-all duration-200 flex items-center gap-2 bg-[var(--q-bg-input)] text-[var(--q-text-primary)] border border-[var(--q-border)] hover:border-[var(--q-primary)] relative">
            🔔 Notifications
            <span className="absolute -top-1 -right-1 w-[18px] h-[18px] bg-[var(--q-error)] rounded-full text-[11px] font-semibold flex items-center justify-center">3</span>
          </button>
          <button 
            onClick={handleRunPrediction}
            className="px-6 py-3 rounded-[10px] text-[14px] font-medium transition-all duration-200 flex items-center gap-2 bg-gradient-to-br from-[var(--q-primary)] to-[var(--q-primary-dark)] text-white hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(139,92,246,0.4)] border-none"
          >
            <span>🔮</span>
            Run Prediction
          </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard color="purple" icon="🔮" value="156" label="Predictions Made" change="↑ 12%" />
        <StatCard color="green" icon="✅" value="94%" label="Accuracy Rate" change="↑ 3%" />
        <StatCard color="blue" icon="🐛" value="23" label="Bugs Prevented" change="↑ 8" />
        <StatCard color="orange" icon="⏱️" value="47h" label="Time Saved" change="↑ 5h" />
      </div>

      {/* Cards Grid 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 mb-8">
        {/* Activity Card */}
        <div className="bg-[var(--q-bg-card)] border border-[var(--q-border)] rounded-[16px] p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-[18px] font-semibold">Recent Activity</h3>
            <a href="#" className="text-[var(--q-primary)] font-medium text-[14px] hover:underline">View All →</a>
          </div>
          <div className="flex flex-col gap-4">
            <ActivityItem icon="✅" color="success" title="Prediction completed - 3 high-risk tests identified" time="2 minutes ago" />
            <ActivityItem icon="⚠️" color="warning" title="API endpoint /users showing degraded performance" time="15 minutes ago" />
            <ActivityItem icon="🔄" color="info" title="Chronos Engine analyzed 500 test patterns" time="1 hour ago" />
            <ActivityItem icon="🎯" color="success" title="Bug prediction accuracy improved to 94%" time="3 hours ago" />
          </div>
        </div>

        {/* License Card */}
        <div className="bg-gradient-to-br from-[rgba(139,92,246,0.2)] to-[rgba(124,58,237,0.1)] border border-[rgba(139,92,246,0.3)] rounded-[16px] p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-[18px] font-semibold">🔑 Your License</h3>
          </div>
          <div className="flex items-center gap-3 bg-[var(--q-bg-input)] p-4 rounded-[12px] mb-4">
            <code className="flex-1 font-mono text-[16px] tracking-[2px] text-[var(--q-success)]">
              {licenseVisible ? 'MM-X29A-V981-L0P4' : 'MM-XXXX-XXXX-XXXX'}
            </code>
            <button className="text-[18px] hover:bg-[var(--q-bg-card)] p-2 rounded-[8px] transition-colors" title="Copy">📋</button>
            <button onClick={() => setLicenseVisible(!licenseVisible)} className="text-[18px] hover:bg-[var(--q-bg-card)] p-2 rounded-[8px] transition-colors" title="Show/Hide">👁️</button>
          </div>
          <div className="flex justify-between text-[14px] text-[var(--q-text-secondary)]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--q-success)] animate-pulse-dot"></span>
              Active
            </div>
            <div>Renews: Jan 28, 2026</div>
          </div>
        </div>
      </div>

      {/* Cards Grid 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6 mb-8">
        {/* Usage Chart */}
        <div className="bg-[var(--q-bg-card)] border border-[var(--q-border)] rounded-[16px] p-6">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-[18px] font-semibold">Usage This Week</h3>
            <select className="bg-[var(--q-bg-input)] border border-[var(--q-border)] rounded-[8px] px-3 py-2 text-[13px] text-[var(--q-text-primary)] outline-none focus:border-[var(--q-primary)]">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="flex items-end gap-2 h-[200px] py-5">
            <ChartBar height="60%" value="45" />
            <ChartBar height="80%" value="62" />
            <ChartBar height="45%" value="34" />
            <ChartBar height="90%" value="71" />
            <ChartBar height="70%" value="55" />
            <ChartBar height="55%" value="42" />
            <ChartBar height="95%" value="78" />
          </div>
          <div className="flex justify-between pt-3 border-t border-[var(--q-border)]">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <span key={day} className="text-[11px] text-[var(--q-text-muted)]">{day}</span>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--q-bg-card)] border border-[var(--q-border)] rounded-[16px] p-6">
          <div className="mb-5">
            <h3 className="text-[18px] font-semibold">Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction icon="🔮" label="New Prediction" onClick={handleRunPrediction} />
            <QuickAction icon="📊" label="View Reports" />
            <QuickAction icon="🔗" label="API Docs" />
            <QuickAction icon="💬" label="Get Support" />
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      <div className={`fixed bottom-6 right-6 px-6 py-4 bg-[var(--q-bg-card)] border border-[var(--q-border)] border-l-4 border-l-[var(--q-success)] rounded-[12px] flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.3)] transition-all duration-300 z-50 ${toastMessage ? 'translate-y-0 opacity-100' : 'translate-y-[100px] opacity-0'}`}>
        <span>✓</span>
        <span>{toastMessage}</span>
      </div>

    </DashboardLayout>
  );
}

function StatCard({ color, icon, value, label, change }: any) {
  const colorMap: Record<string, { bg: string, iconBg: string }> = {
    purple: { bg: 'var(--q-primary)', iconBg: 'rgba(139, 92, 246, 0.2)' },
    green: { bg: 'var(--q-success)', iconBg: 'rgba(16, 185, 129, 0.2)' },
    blue: { bg: 'var(--q-info)', iconBg: 'rgba(59, 130, 246, 0.2)' },
    orange: { bg: 'var(--q-warning)', iconBg: 'rgba(245, 158, 11, 0.2)' }
  };

  return (
    <div className="bg-[var(--q-bg-card)] border border-[var(--q-border)] rounded-[16px] p-6 relative overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1" style={{ background: colorMap[color].bg }} />
      <div className="w-12 h-12 rounded-[12px] flex items-center justify-center text-[24px] mb-4" style={{ background: colorMap[color].iconBg }}>
        {icon}
      </div>
      <div className="text-[32px] font-bold mb-1">{value}</div>
      <div className="text-[14px] text-[var(--q-text-secondary)]">{label}</div>
      <div className={`absolute top-6 right-6 text-[13px] font-medium ${change.includes('↑') ? 'text-[var(--q-success)]' : 'text-[var(--q-error)]'}`}>
        {change}
      </div>
    </div>
  );
}

function ActivityItem({ icon, color, title, time }: any) {
  const colorMap: Record<string, string> = {
    success: 'rgba(16, 185, 129, 0.2)',
    warning: 'rgba(245, 158, 11, 0.2)',
    info: 'rgba(59, 130, 246, 0.2)',
    error: 'rgba(239, 68, 68, 0.2)'
  };
  return (
    <div className="flex gap-4 p-4 bg-[var(--q-bg-input)] rounded-[12px] hover:translate-x-1 transition-transform">
      <div className="w-10 h-10 rounded-[10px] flex items-center justify-center text-[18px] shrink-0" style={{ background: colorMap[color] }}>
        {icon}
      </div>
      <div>
        <div className="text-[14px] font-medium mb-1">{title}</div>
        <div className="text-[12px] text-[var(--q-text-muted)]">{time}</div>
      </div>
    </div>
  );
}

function ChartBar({ height, value }: { height: string, value: string }) {
  return (
    <div className="flex-1 bg-gradient-to-b from-[var(--q-primary)] to-[var(--q-primary-dark)] rounded-t-[4px] relative group hover:opacity-80 transition-opacity" style={{ height }}>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 text-[11px] text-[var(--q-text-secondary)] mb-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {value}
      </div>
    </div>
  );
}

function QuickAction({ icon, label, onClick }: any) {
  return (
    <div onClick={onClick} className="flex flex-col items-center gap-2 p-5 bg-[var(--q-bg-input)] border border-[var(--q-border)] rounded-[12px] cursor-pointer hover:border-[var(--q-primary)] hover:-translate-y-0.5 transition-all">
      <span className="text-[24px]">{icon}</span>
      <span className="text-[13px] font-medium">{label}</span>
    </div>
  );
}
