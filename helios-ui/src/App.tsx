import { SovereignHUD } from './components/SovereignHUD';
import ClientPortal from './components/ClientPortal';
import { ImmersiveLanding } from './components/ImmersiveLanding';
import { QuantumTelemetryDashboard } from './components/QuantumTelemetryDashboard';
import { QuantumGlitch404 } from './components/QuantumGlitch404';
import { CommandPalette } from './components/CommandPalette';
import { useState, useEffect } from 'react';
import "./App.css";
import "./LegacyComponents.css";

const BACKEND_URL = 'https://aeternaaa-production.up.railway.app';
type AppMode = 'landing' | 'client' | 'admin' | 'telemetry' | '404';

function App() {
  const [mode, setMode] = useState<AppMode>('landing');

  // Check URL params for mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const modeParam = params.get('mode');
    const path = window.location.pathname;
    
    if (modeParam === 'admin') {
      setMode('admin');
    } else if (modeParam === 'client') {
      setMode('client');
    } else if (modeParam === 'telemetry' || path === '/telemetry') {
      setMode('telemetry');
    } else if (path === '/404' || path.includes('/not-found')) {
      setMode('404');
    }
  }, []);

  return (
    <div className="w-screen h-screen bg-black overflow-hidden selection:bg-cyan-500/30 relative">
      <CommandPalette onNavigate={setMode} />
      {/* Mode Toggle - Enhanced with all modes */}
      <div className="fixed top-4 left-4 z-[90] flex gap-2 flex-wrap">
        <button 
          onClick={() => setMode('landing')}
          className={`px-3 py-1.5 rounded-lg text-sm transition font-medium ${mode === 'landing' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white/70'}`}
        >
          🌌 Landing
        </button>
        <button 
          onClick={() => setMode('client')}
          className={`px-3 py-1.5 rounded-lg text-sm transition font-medium ${mode === 'client' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white/70'}`}
        >
          🌐 Client
        </button>
        <button 
          onClick={() => setMode('telemetry')}
          className={`px-3 py-1.5 rounded-lg text-sm transition font-medium ${mode === 'telemetry' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white/70'}`}
        >
          📊 Telemetry
        </button>
        <button 
          onClick={() => setMode('admin')}
          className={`px-3 py-1.5 rounded-lg text-sm transition font-medium ${mode === 'admin' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white/70'}`}
        >
          👑 Admin
        </button>
        <button 
          onClick={() => setMode('404')}
          className={`px-3 py-1.5 rounded-lg text-sm transition font-medium ${mode === '404' ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white' : 'bg-white/10 hover:bg-white/20 text-white/70'}`}
        >
          ⚠️ 404
        </button>
      </div>

      {/* Render based on mode */}
      {mode === 'landing' && <ImmersiveLanding />}
      {mode === 'client' && <ClientPortal />}
      {mode === 'admin' && <SovereignHUD />}
      {mode === 'telemetry' && <QuantumTelemetryDashboard />}
      {mode === '404' && <QuantumGlitch404 onNavigateHome={() => setMode('landing')} />}
    </div>
  );
}

export default App;
