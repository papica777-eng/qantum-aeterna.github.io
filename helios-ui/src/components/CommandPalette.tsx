import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type AppMode = 'landing' | 'client' | 'admin' | 'telemetry' | '404';

interface CommandPaletteProps {
  onNavigate: (mode: AppMode) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { id: 'landing', label: 'Go to Landing Page', icon: '🌌' },
    { id: 'client', label: 'Go to Client Portal', icon: '🌐' },
    { id: 'telemetry', label: 'Go to Telemetry Dashboard', icon: '📊' },
    { id: 'admin', label: 'Go to Admin (Sovereign HUD)', icon: '👑' },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      setSearchTerm('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        executeCommand(filteredCommands[selectedIndex].id as AppMode);
      }
    }
  };

  const executeCommand = (id: AppMode) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-xl bg-black/90 border border-[#2a2a50] rounded-xl shadow-[0_0_40px_rgba(0,255,255,0.1)] overflow-hidden"
          >
            <div className="flex items-center px-4 py-3 border-b border-[#2a2a50]/50">
              <span className="text-gray-400 mr-3">⌘K</span>
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-lg font-mono"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="max-h-[60vh] overflow-y-auto py-2">
              {filteredCommands.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-500 font-mono">
                  No commands found.
                </div>
              ) : (
                filteredCommands.map((cmd, index) => (
                  <div
                    key={cmd.id}
                    className={`px-4 py-3 mx-2 rounded-lg cursor-pointer flex items-center transition-colors ${
                      index === selectedIndex
                        ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/30'
                        : 'text-gray-300 hover:bg-white/5 border border-transparent'
                    }`}
                    onClick={() => executeCommand(cmd.id as AppMode)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <span className="mr-3 text-xl">{cmd.icon}</span>
                    <span className="font-mono text-sm">{cmd.label}</span>
                    {index === selectedIndex && (
                      <span className="ml-auto text-xs text-cyan-500/70 font-mono">↵ to execute</span>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="px-4 py-2 border-t border-[#2a2a50]/50 flex justify-between items-center text-xs text-gray-500 font-mono">
              <div className="flex gap-4">
                <span><kbd className="bg-white/10 px-1 rounded">↑</kbd> <kbd className="bg-white/10 px-1 rounded">↓</kbd> to navigate</span>
                <span><kbd className="bg-white/10 px-1 rounded">↵</kbd> to select</span>
                <span><kbd className="bg-white/10 px-1 rounded">esc</kbd> to close</span>
              </div>
              <div className="text-cyan-500/50">AETERNA NEXUS</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
