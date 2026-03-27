import re

file_path = "helios-ui/src/components/ClientPortal.tsx"

with open(file_path, "r") as f:
    content = f.read()

# Make sure Search is imported
if "Search" not in content:
    content = content.replace("Settings, LogOut,", "Settings, LogOut, Search,")

# Add missing icons for the new nav items
if "Network" not in content:
    content = content.replace("Terminal", "Terminal, Network, DollarSign, Link, Code, FileText")

# Update the NAV_ITEMS array definition
nav_items_old = r"const NAV_ITEMS = \[.*?\];"
nav_items_new = """const NAV_ITEMS = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'swarm', label: 'Swarm Intelligence', icon: Network },
    { id: 'finance', label: 'Financial Gateway', icon: DollarSign },
    { id: 'partner', label: 'Partner Integrations', icon: Link },
    { id: 'api', label: 'Developer API', icon: Code },
    { id: 'audit', label: 'Audit Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];"""

content = re.sub(nav_items_old, nav_items_new, content, flags=re.DOTALL)

# Update State to handle new views
state_old = "const [activeView, setActiveView] = useState<'overview' | 'settings'>('overview');"
state_new = "const [activeView, setActiveView] = useState<'overview' | 'swarm' | 'finance' | 'partner' | 'api' | 'audit' | 'settings'>('overview');"
content = content.replace(state_old, state_new)

with open(file_path, "w") as f:
    f.write(content)

print("Updated Navigation")
