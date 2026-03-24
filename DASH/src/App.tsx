import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { useState, useRef, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { motion } from 'framer-motion';
import './App.css';

function NeuralMesh() {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  return (
    <group ref={meshRef}>
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      {/* Visual representation of 57,179 nodes would go here using InstancedMesh */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={0.5} wireframe />
      </mesh>
      <mesh position={[2, 1, -1]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#ff00ff" wireframe />
      </mesh>
    </group>
  );
}

function App() {
  const [equity, setEquity] = useState<number>(0);
  const [status, setStatus] = useState("INITIALIZING CONNECTION...");

  useEffect(() => {
    const connectToCore = async () => {
      try {
        const eq = await invoke<number>('get_empire_equity');
        setEquity(eq);
        setStatus("CORE: ACTIVE | RESONANCE: 100%");
      } catch (e) {
        console.error(e);
        setStatus("CORE: DISCONNECTED");
      }
    };
    
    // Simulate real-time stream
    const interval = setInterval(() => {
        // In reality, this would listen to an event from Rust
        connectToCore();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-screen bg-black text-cyan-400 font-mono overflow-hidden relative">
      
      {/* 3D Background Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <NeuralMesh />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none p-8">
        
        {/* Header / Vault */}
        <header className="flex justify-between items-start pointer-events-auto">
          <div>
            <h1 className="text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
              HELIOS
            </h1>
            <p className="text-xs opacity-70">SOVEREIGN DESKTOP INTERFACE</p>
          </div>
          
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-gray-400">Total Equity</p>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              key={equity}
              className="text-5xl font-bold text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)]"
            >
              ${equity.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </motion.div>
          </div>
        </header>

        {/* Center / Mesh Info */}
        <div className="flex-1 flex items-center justify-center">
            {/* The 3D Mesh is behind, this space is for interacting with nodes */}
        </div>

        {/* Footer / Terminal */}
        <footer className="w-full bg-black/80 backdrop-blur-md border border-cyan-900/50 rounded-lg p-4 pointer-events-auto">
          <div className="flex items-center gap-4">
            <span className="text-cyan-600 animate-pulse">➜</span>
            <input 
              type="text" 
              placeholder="ENTER COMMAND (ASH)..." 
              className="bg-transparent border-none outline-none w-full text-cyan-100 placeholder-cyan-900/50 uppercase"
              autoFocus
            />
            <div className="text-xs text-cyan-800">
                {status}
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default App;
