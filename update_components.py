import re
import os

files_to_update = [
    "helios-ui/src/components/ClientPortal.tsx"
]

for file_path in files_to_update:
    if not os.path.exists(file_path): continue

    with open(file_path, "r") as f:
        content = f.read()

    # Update background to cosmic-mesh-bg
    content = re.sub(
        r'className="min-h-screen bg-\[#020205\] text-white font-sans overflow-hidden flex"',
        r'className="min-h-screen cosmic-mesh-bg text-white font-sans overflow-hidden flex"',
        content
    )
    content = re.sub(
        r'className="min-h-screen bg-\[#020205\] text-white font-sans flex flex-col relative overflow-hidden"',
        r'className="min-h-screen cosmic-mesh-bg text-white font-sans flex flex-col relative overflow-hidden"',
        content
    )

    # Update Glass Sidebar
    content = re.sub(
        r'className="w-64 bg-\[#0a0a12\] border-r border-\[#2a2a50\] flex flex-col"',
        r'className="w-64 glass-sidebar flex flex-col relative z-10"',
        content
    )

    # Update Glass Cards
    content = re.sub(r'bg-\[#121225\] border border-\[#2a2a50\] rounded-xl', r'glass-card rounded-xl', content)
    content = re.sub(r'bg-\[#1a1a3a\]/50 border border-\[#2a2a50\] rounded-xl', r'glass-card rounded-xl', content)
    content = re.sub(r'bg-\[#0a0a12\] border border-\[#2a2a50\] rounded-xl', r'glass-card rounded-xl', content)

    # Primary Action Buttons
    content = re.sub(
        r'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500',
        r'bg-gradient-to-r from-[#00E5FF] to-[#00B4D8] hover:from-[#00FFFF] hover:to-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] text-black font-semibold transition-all duration-300',
        content
    )

    # Update specific hex colors to the required palette
    content = content.replace('text-cyan-400', 'text-[#00E5FF]')
    content = content.replace('text-cyan-500', 'text-[#00E5FF]')
    content = content.replace('border-cyan-500', 'border-[#00E5FF]')
    content = content.replace('text-purple-400', 'text-[#8B5CF6]')
    content = content.replace('text-purple-500', 'text-[#8B5CF6]')

    # Add Cmd+K search bar to Top Nav
    top_nav_pattern = r'(<header className="h-16 border-b border-\[#2a2a50\] flex items-center justify-between px-8">)'
    top_nav_replacement = r'''\1
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400 group-hover:text-[#00E5FF] transition-colors" />
              </div>
              <input
                type="text"
                className="w-full bg-[#0a0a12]/50 border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-[#00E5FF]/50 focus:ring-1 focus:ring-[#00E5FF]/50 transition-all backdrop-blur-md"
                placeholder="Search commands, apps, or data..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono text-gray-500 bg-[#121225] border border-white/10 rounded">Cmd K</kbd>
              </div>
            </div>
          </div>'''

    if "Search className" not in content and "Cmd K" not in content:
        # Add Search to imports if not there
        if "Search," not in content:
            content = content.replace("Settings, LogOut,", "Settings, LogOut, Search,")
        content = re.sub(top_nav_pattern, top_nav_replacement, content)

    # Micro-interactions for Online status
    online_pattern = r'(<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></span>)'
    online_replacement = r'<span className="w-2 h-2 rounded-full bg-[#00ff9d] mr-2 relative"><span className="absolute -inset-1 rounded-full bg-[#00ff9d] opacity-40 animate-ping"></span></span>'
    content = re.sub(online_pattern, online_replacement, content)

    with open(file_path, "w") as f:
        f.write(content)

print("Updated ClientPortal.tsx components")
