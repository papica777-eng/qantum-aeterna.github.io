import { SovereignHUD } from './components/SovereignHUD';
import ClientPortal from './components/ClientPortal';
import { ImmersiveLanding } from './components/ImmersiveLanding';
import { QuantumTelemetryDashboard } from './components/QuantumTelemetryDashboard';
import { QuantumGlitch404 } from './components/QuantumGlitch404';
import { CommandPalette } from './components/CommandPalette';
import Partnerships from './components/Partnerships';
import SelfHealingDashboard from './components/SelfHealingDashboard';
import LogsViewer from './components/LogsViewer';
import BillingPage from './components/BillingPage';
import { useState, useEffect } from 'react';
import "./App.css";
import "./LegacyComponents.css";

const BACKEND_URL = 'https://aeternaaa-production.up.railway.app';
type AppMode = 'landing' | 'client' | 'admin' | 'telemetry' | '404' | 'partnerships' | 'healing' | 'logs' | 'billing';

function App() {
  const [mode, setMode] = useState<AppMode>('landing');

  // Complexity: O(1) — hash-mapped URL routing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    const path = window.location.pathname;

    const pathMap: Record<string, AppMode> = {
      '/partnerships': 'partnerships',
      '/telemetry': 'telemetry',
      '/healing': 'healing',
      '/logs': 'logs',
      '/billing': 'billing',
      '/404': '404',
      '/not-found': '404',
    };

    const modeMap: Record<string, AppMode> = {
      'admin': 'admin',
      'client': 'client',
      'telemetry': 'telemetry',
      'partnerships': 'partnerships',
      'healing': 'healing',
      'logs': 'logs',
      'billing': 'billing',
    };

    if (pathMap[path]) {
      setMode(pathMap[path]);
    } else if (modeParam && modeMap[modeParam]) {
      setMode(modeMap[modeParam]);
    } else if (path.includes('/not-found')) {
      setMode('404');
    }
  }, []);

  // Update URL when mode changes (SPA routing without reload)
  const navigateTo = (newMode: AppMode) => {
    setMode(newMode);
    const modeToPath: Partial<Record<AppMode, string>> = {
      'landing': '/',
      'healing': '/healing',
      'logs': '/logs',
      'billing': '/billing',
      'telemetry': '/telemetry',
      'partnerships': '/partnerships',
    };
    const path = modeToPath[newMode];
    if (path) {
      window.history.pushState({}, '', path);
    }
  };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden selection:bg-cyan-500/30 relative">
      <CommandPalette onNavigate={setMode} />

      {/* Dev Nav — hidden in production via CSS or env check */}
      <div className="fixed top-4 left-4 z-[90] flex gap-2 flex-wrap">
        {([
          { id: 'landing', label: '🌌 Landing' },
          { id: 'client',  label: '🌐 Client' },
          { id: 'healing', label: '🔬 Healing' },
          { id: 'logs',    label: '📋 Logs' },
          { id: 'billing', label: '💳 Billing' },
          { id: 'telemetry', label: '📊 Telemetry' },
          { id: 'admin',   label: '👑 Admin' },
        ] as const).map(({ id, label }) => (
          <button
            key={id}
            onClick={() => navigateTo(id as AppMode)}
            className={`px-3 py-1.5 rounded-lg text-sm transition font-medium ${
              mode === id
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white/70'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Mode Rendering */}
      {mode === 'landing'      && <ImmersiveLanding />}
      {mode === 'partnerships' && <Partnerships />}
      {mode === 'client'       && <ClientPortal />}
      {mode === 'admin'        && <SovereignHUD />}
      {mode === 'telemetry'    && <QuantumTelemetryDashboard />}
      {mode === 'healing'      && <SelfHealingDashboard onBack={() => navigateTo('landing')} />}
      {mode === 'logs'         && <LogsViewer onBack={() => navigateTo('landing')} />}
      {mode === 'billing'      && <BillingPage onBack={() => navigateTo('landing')} />}
      {mode === '404'          && <QuantumGlitch404 onNavigateHome={() => navigateTo('landing')} />}
    </div>
  );
}

export default App;
