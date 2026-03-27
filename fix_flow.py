import re

file_path = "helios-ui/src/components/ClientPortal.tsx"

with open(file_path, "r") as f:
    content = f.read()

# Update Notification Matrix (Toasts) to match the new visual signature
toast_pattern = r'(<div\s+className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg flex items-center space-x-3 transition-all transform \${[\s\S]*?`}\s*>[\s\S]*?</div>\s*</div>)'

new_toast = """<div
        className={`fixed bottom-8 right-8 p-4 rounded-xl shadow-[0_4_30px_rgba(0,0,0,0.5)] flex items-center space-x-3 transition-all duration-300 transform ${
          toast.visible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
        } ${
          toast.type === 'success' ? 'glass-card border-[#00E5FF]/50' :
          toast.type === 'error' ? 'glass-card border-[#ff4b2b]/50' :
          'glass-card border-[#8B5CF6]/50'
        } z-50`}
      >
        {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-[#00E5FF]" />}
        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#ff4b2b]" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-[#8B5CF6]" />}
        <span className="text-white font-inter text-sm font-medium">{toast.message}</span>
      </div>"""

content = re.sub(toast_pattern, new_toast, content)

with open(file_path, "w") as f:
    f.write(content)

print("Notification Matrix and E2E Flow updated")
