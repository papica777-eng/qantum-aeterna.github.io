import re

file_path = "helios-ui/src/components/ClientPortal.tsx"

with open(file_path, "r") as f:
    content = f.read()

# Make sure all icons are imported
icons_to_import = ["Search", "Network", "DollarSign", "Link", "Code", "FileText"]
import_line_pattern = r"import \{\s*(.*?)\s*\} from 'lucide-react';"

match = re.search(import_line_pattern, content)
if match:
    existing_icons = [i.strip() for i in match.group(1).split(",")]
    for icon in icons_to_import:
        if icon not in existing_icons:
            existing_icons.append(icon)

    new_import_line = f"import {{ {', '.join(existing_icons)} }} from 'lucide-react';"
    content = content.replace(match.group(0), new_import_line)

# Add top nav search bar
search_bar_html = """
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-4 h-4 text-gray-400 group-hover:text-[#00E5FF] transition-colors" />
              </div>
              <input
                type="text"
                className="w-full bg-[rgba(20,20,30,0.4)] border border-[rgba(255,255,255,0.08)] rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] transition-all backdrop-blur-md"
                placeholder="Search commands, apps, or data..."
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <kbd className="hidden sm:inline-block px-2 py-0.5 text-xs font-mono text-gray-500 bg-[#0a0a12] border border-[rgba(255,255,255,0.08)] rounded">Cmd K</kbd>
              </div>
            </div>
          </div>
"""

header_start = r'<header className="[^"]*">'
match_header = re.search(header_start, content)

if match_header and "Search commands" not in content:
    # Find the end of the opening tag and insert our search bar
    header_tag = match_header.group(0)
    # Ensure it looks good
    content = content.replace(
        header_tag,
        '<header className="h-16 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between px-8 bg-[rgba(10,10,18,0.6)] backdrop-blur-xl z-20 sticky top-0">' + search_bar_html
    )

with open(file_path, "w") as f:
    f.write(content)

print("Icons fixed and Top Nav configured")
