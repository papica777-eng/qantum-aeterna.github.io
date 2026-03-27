import re

file_path = "helios-ui/src/components/ClientPortal.tsx"

with open(file_path, "r") as f:
    content = f.read()

partner_hub_component = """
  const renderPartnerHub = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-geist text-[#00E5FF] drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]">Partner Integrations</h2>
          <p className="text-gray-400 mt-1">Live-sync connection health & API metrics</p>
        </div>
        <button className="px-4 py-2 glass-card text-white rounded-lg hover:border-[#00E5FF] transition-all duration-300 flex items-center">
          <Link className="w-4 h-4 mr-2" />
          Add Integration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { name: 'Binance API', status: 'Connected', latency: '42ms', sync: 'Live', type: 'Exchange', icon: DollarSign },
          { name: 'Kraken Pro', status: 'Connected', latency: '55ms', sync: 'Live', type: 'Exchange', icon: Activity },
          { name: 'Stripe Billing', status: 'Connected', latency: '12ms', sync: 'Webhook', type: 'Payments', icon: CreditCard },
          { name: 'AWS Infrastructure', status: 'Optimal', latency: '8ms', sync: 'Continuous', type: 'Compute', icon: HardDrive }
        ].map((partner, idx) => (
          <div key={idx} className="glass-card rounded-xl p-6 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00E5FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg bg-[#121225] border border-[rgba(255,255,255,0.08)] flex items-center justify-center">
                  <partner.icon className="w-6 h-6 text-[#8B5CF6]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{partner.name}</h3>
                  <span className="text-sm text-gray-500">{partner.type}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-[#00ff9d] relative">
                  <span className="absolute -inset-1 rounded-full bg-[#00ff9d] opacity-40 animate-ping"></span>
                </span>
                <span className="text-sm text-[#00ff9d]">{partner.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-[#0a0a12]/50 rounded-lg p-3 border border-[rgba(255,255,255,0.05)]">
                <p className="text-xs text-gray-500 mb-1">Latency</p>
                <p className="text-sm font-mono text-white">{partner.latency}</p>
              </div>
              <div className="bg-[#0a0a12]/50 rounded-lg p-3 border border-[rgba(255,255,255,0.05)]">
                <p className="text-xs text-gray-500 mb-1">Sync State</p>
                <p className="text-sm font-mono text-white">{partner.sync}</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.05)] flex justify-between items-center">
              <button className="text-xs text-gray-400 hover:text-[#00E5FF] transition-colors">Configure</button>
              <button className="text-xs text-gray-400 hover:text-[#ff4b2b] transition-colors">Disconnect</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
"""

# Insert renderPartnerHub before renderSettings
content = content.replace("const renderSettings = () => (", partner_hub_component + "\n  const renderSettings = () => (")

# Map activeView 'partner' to renderPartnerHub
content = content.replace("{activeView === 'settings' && renderSettings()}", "{activeView === 'partner' && renderPartnerHub()}\n            {activeView === 'settings' && renderSettings()}")

with open(file_path, "w") as f:
    f.write(content)

print("Partner Hub implementation complete")
