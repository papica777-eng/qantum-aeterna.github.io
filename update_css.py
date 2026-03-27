import re

css_file = "helios-ui/src/index.css"

with open(css_file, "r") as f:
    content = f.read()

# Update colors for Midnight Void theme
content = re.sub(r'--quantum-void: #[0-9a-fA-F]+;', '--quantum-void: #05050A;', content)
content = re.sub(r'--quantum-dark: #[0-9a-fA-F]+;', '--quantum-dark: #0A0A12;', content)
content = re.sub(r'--quantum-medium: #[0-9a-fA-F]+;', '--quantum-medium: rgba(20, 20, 30, 0.4);', content)
content = re.sub(r'--quantum-light: #[0-9a-fA-F]+;', '--quantum-light: #1A1A24;', content)
content = re.sub(r'--quantum-border: #[0-9a-fA-F]+;', '--quantum-border: rgba(255, 255, 255, 0.08);', content)

# Primary Accent
content = re.sub(r'--neon-cyan: #[0-9a-fA-F]+;', '--neon-cyan: #00E5FF;', content)
# Secondary Accent
content = re.sub(r'--neon-purple: #[0-9a-fA-F]+;', '--neon-purple: #8B5CF6;', content)

# Add cosmic background animation keyframes
cosmic_bg = """
/* Cosmic Particle Mesh Background */
.cosmic-mesh-bg {
  background: radial-gradient(circle at center, #0A0A12 0%, #05050A 100%);
  position: relative;
  overflow: hidden;
}

.cosmic-mesh-bg::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image:
    radial-gradient(rgba(0, 229, 255, 0.05) 1px, transparent 1px),
    radial-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px);
  background-size: 40px 40px, 30px 30px;
  background-position: 0 0, 15px 15px;
  animation: cosmicDrift 100s linear infinite;
  z-index: 0;
  opacity: 0.6;
}

@keyframes cosmicDrift {
  0% { transform: translateY(0) translateX(0); }
  100% { transform: translateY(-400px) translateX(-200px); }
}

.glass-card {
  background: rgba(20, 20, 30, 0.4);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.glass-sidebar {
  background: rgba(10, 10, 18, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
}

.pulse-ring {
  position: relative;
}
.pulse-ring::before {
  content: '';
  position: absolute;
  left: -4px; top: -4px; right: -4px; bottom: -4px;
  border-radius: 50%;
  background: var(--neon-cyan);
  opacity: 0.4;
  animation: pulse-ring-anim 2s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
  z-index: -1;
}

@keyframes pulse-ring-anim {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(2.5); opacity: 0; }
}

.text-inter { font-family: 'Inter', sans-serif; }
.text-geist { font-family: 'Geist', sans-serif; }
.text-roboto-mono { font-family: 'Roboto Mono', monospace; }

.font-mono-numbers { font-family: 'Roboto Mono', 'JetBrains Mono', monospace; }
"""

if "cosmic-mesh-bg" not in content:
    content += cosmic_bg

with open(css_file, "w") as f:
    f.write(content)

print("Updated index.css")
