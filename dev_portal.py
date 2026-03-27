import re

file_path = "helios-ui/src/components/ClientPortal.tsx"

with open(file_path, "r") as f:
    content = f.read()

dev_portal_component = """
  const renderDevPortal = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-geist text-[#8B5CF6] drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]">Developer API</h2>
          <p className="text-gray-400 mt-1">Interactive endpoints & SDK documentation</p>
        </div>
        <div className="flex space-x-4">
          <button className="px-4 py-2 glass-card text-white rounded-lg hover:border-[#00E5FF] transition-all duration-300">Generate Key</button>
          <button className="px-4 py-2 bg-[#121225] border border-[rgba(255,255,255,0.08)] text-white rounded-lg">Documentation ↗</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="glass-card p-4 rounded-xl border border-[rgba(255,255,255,0.08)]">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Authentication</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-sm cursor-pointer hover:bg-[rgba(0,229,255,0.1)] p-2 rounded transition-colors bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.05)] text-[#00E5FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] mr-2"></span>
                OAuth 2.0 Flow
              </li>
              <li className="flex items-center text-sm cursor-pointer hover:bg-[rgba(255,255,255,0.05)] p-2 rounded transition-colors text-gray-400">
                <span className="w-1.5 h-1.5 rounded-full bg-transparent border border-gray-500 mr-2"></span>
                API Keys
              </li>
            </ul>
          </div>

          <div className="glass-card p-4 rounded-xl border border-[rgba(255,255,255,0.08)]">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wider">Endpoints</h3>
            <ul className="space-y-2">
              {[
                { method: 'GET', path: '/v1/swarm/nodes', color: 'text-green-400' },
                { method: 'POST', path: '/v1/finance/tx', color: 'text-yellow-400' },
                { method: 'GET', path: '/v1/user/profile', color: 'text-green-400' },
                { method: 'DEL', path: '/v1/integration', color: 'text-red-400' }
              ].map((endpoint, idx) => (
                <li key={idx} className="flex items-center text-sm cursor-pointer hover:bg-[rgba(255,255,255,0.05)] p-2 rounded transition-colors font-mono">
                  <span className={`w-10 text-xs font-bold ${endpoint.color}`}>{endpoint.method}</span>
                  <span className="text-gray-300">{endpoint.path}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 glass-card rounded-xl overflow-hidden border border-[rgba(255,255,255,0.08)]">
          <div className="bg-[#0a0a12] px-4 py-3 flex items-center justify-between border-b border-[rgba(255,255,255,0.05)]">
            <div className="flex space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
              <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
            </div>
            <span className="text-xs text-gray-500 font-mono">bash / curl</span>
          </div>

          <div className="p-6 bg-[#05050A]">
            <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap overflow-x-auto">
<span className="text-gray-500"># Authenticate with OAuth 2.0</span>
<span className="text-blue-400">curl</span> -X POST https://api.aeterna.website/oauth/token \\
  -H <span className="text-green-300">"Content-Type: application/json"</span> \\
  -d '{'{'}"client_id": "your_id", "client_secret": "your_secret", "grant_type": "client_credentials"{'}'}'

<span className="text-gray-500"># Response</span>
<span className="text-[#00E5FF]">200 OK</span>
{'{'}
  <span className="text-purple-300">"access_token"</span>: "eyJhbGciOiJIUzI1NiIs...",
  <span className="text-purple-300">"token_type"</span>: "Bearer",
  <span className="text-purple-300">"expires_in"</span>: 3600
{'}'}
            </pre>
          </div>

          <div className="p-4 border-t border-[rgba(255,255,255,0.05)] flex justify-end">
            <button className="flex items-center px-4 py-2 bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 rounded transition-colors text-sm font-medium">
              <Code className="w-4 h-4 mr-2" />
              Try Endpoint
            </button>
          </div>
        </div>
      </div>
    </div>
  );
"""

# Insert renderDevPortal before renderSettings
content = content.replace("const renderSettings = () => (", dev_portal_component + "\n  const renderSettings = () => (")

# Map activeView 'api' to renderDevPortal
content = content.replace("{activeView === 'settings' && renderSettings()}", "{activeView === 'api' && renderDevPortal()}\n            {activeView === 'settings' && renderSettings()}")

with open(file_path, "w") as f:
    f.write(content)

print("Developer Portal implementation complete")
