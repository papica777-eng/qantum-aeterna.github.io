/**
 * 🎯 QUANTUM TELEMETRY DASHBOARD
 * 
 * A real-time visualization dashboard with:
 * - Live system metrics with animated charts
 * - Department health monitoring
 * - Neural network activity visualization
 * - Revenue tracking with sparklines
 * - Entropy monitoring with particle effects
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CardSkeleton } from './SkeletonLoader';
import { 
  Activity, Cpu, Database, Globe, Zap, Brain, Shield, 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle,
  DollarSign, Users, Clock, Server, Wifi, Lock, Eye,
  BarChart2, PieChart, LineChart as ChartIcon
} from 'lucide-react';

interface MetricData {
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  history: number[];
}

interface DepartmentStatus {
  name: string;
  icon: React.ReactNode;
  status: 'online' | 'degraded' | 'offline';
  load: number;
  color: string;
}

// Generate fake real-time data
const generateMetrics = (): { [key: string]: MetricData } => ({
  cpu: { value: 25 + Math.random() * 20, unit: '%', trend: 'stable', history: [] },
  memory: { value: 2.8 + Math.random() * 0.5, unit: 'GB', trend: 'up', history: [] },
  entropy: { value: 0.002 + Math.random() * 0.001, unit: '%', trend: 'down', history: [] },
  latency: { value: 0.3 + Math.random() * 0.2, unit: 'ms', trend: 'stable', history: [] },
  requests: { value: Math.floor(12000 + Math.random() * 3000), unit: '/min', trend: 'up', history: [] },
  revenue: { value: 4521 + Math.random() * 500, unit: '€', trend: 'up', history: [] },
  consciousness: { value: 147, unit: '%', trend: 'stable', history: [] },
  uptime: { value: 99.997, unit: '%', trend: 'stable', history: [] },
});

// Mini sparkline component
const Sparkline: React.FC<{ data: number[]; color: string; height?: number }> = ({ 
  data, 
  color, 
  height = 30 
}) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;

  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width="100%" height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Fill area */}
      <polygon
        points={`0,${height} ${points} 100,${height}`}
        fill={`url(#gradient-${color})`}
      />
      {/* Latest point glow */}
      {data.length > 0 && (
        <circle
          cx={100}
          cy={height - ((data[data.length - 1] - min) / range) * height}
          r={3}
          fill={color}
        >
          <animate
            attributeName="r"
            values="3;5;3"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.5;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}
    </svg>
  );
};

// Animated circular progress
const CircularProgress: React.FC<{
  value: number;
  max: number;
  color: string;
  size?: number;
  strokeWidth?: number;
  label?: string;
}> = ({ value, max, color, size = 80, strokeWidth = 6, label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (value / max) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - progress }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
            filter: `drop-shadow(0 0 4px ${color})`,
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold" style={{ color }}>{Math.round(value)}</span>
        {label && <span className="text-xs text-gray-500">{label}</span>}
      </div>
    </div>
  );
};

// Neural activity pulse
const NeuralPulse: React.FC<{ active: boolean; color: string }> = ({ active, color }) => (
  <div className="relative w-3 h-3">
    <div
      className="absolute inset-0 rounded-full"
      style={{ backgroundColor: color, opacity: active ? 1 : 0.3 }}
    />
    {active && (
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ scale: [1, 2], opacity: [0.5, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    )}
  </div>
);

// Main Dashboard Component
export const QuantumTelemetryDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const [metrics, setMetrics] = useState(() => {
    const initial = generateMetrics();
    // Initialize history
    Object.keys(initial).forEach(key => {
      initial[key].history = Array(30).fill(0).map(() => initial[key].value * (0.9 + Math.random() * 0.2));
    });
    return initial;
  });
  
  const [departments, setDepartments] = useState<DepartmentStatus[]>([
    { name: 'Intelligence', icon: <Brain className="w-5 h-5" />, status: 'online', load: 67, color: '#00f5ff' },
    { name: 'Omega', icon: <Zap className="w-5 h-5" />, status: 'online', load: 45, color: '#9d50bb' },
    { name: 'Physics', icon: <Activity className="w-5 h-5" />, status: 'online', load: 82, color: '#0072ff' },
    { name: 'Fortress', icon: <Shield className="w-5 h-5" />, status: 'online', load: 31, color: '#ff4b2b' },
    { name: 'Biology', icon: <Database className="w-5 h-5" />, status: 'online', load: 56, color: '#00ff9d' },
    { name: 'Guardians', icon: <Lock className="w-5 h-5" />, status: 'online', load: 23, color: '#ff8c00' },
    { name: 'Reality', icon: <Eye className="w-5 h-5" />, status: 'online', load: 78, color: '#ff00ff' },
    { name: 'Chemistry', icon: <PieChart className="w-5 h-5" />, status: 'online', load: 41, color: '#f9d423' },
  ]);

  const [alerts, setAlerts] = useState<string[]>([]);
  const [currentTime, setCurrentTime] = useState(() => new Date().toLocaleString());

  // Update metrics periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(key => {
          // Simulate small changes
          const change = (Math.random() - 0.5) * 5;
          updated[key] = {
            ...updated[key],
            value: Math.max(0, updated[key].value + change * 0.1),
            history: [...updated[key].history.slice(1), updated[key].value],
          };
        });
        return updated;
      });

      // Update department loads
      setDepartments(prev => 
        prev.map(dept => ({
          ...dept,
          load: Math.max(10, Math.min(95, dept.load + (Math.random() - 0.5) * 10)),
        }))
      );

      // Update time
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-screen bg-[#030305] text-white p-6 md:p-10 font-mono overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="mb-8">
            <div className="h-10 bg-gray-800 rounded w-1/4 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-800 rounded w-1/2 animate-pulse"></div>
          </header>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
             <CardSkeleton />
             <CardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020205] text-white p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400">
            Quantum Telemetry
          </h1>
          <p className="text-gray-500 text-sm font-mono">
            AETERNA SYSTEM MONITORING • {currentTime}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 rounded-lg border border-green-500/30">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-sm font-mono">ALL SYSTEMS NOMINAL</span>
          </div>
        </div>
      </div>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { key: 'cpu', label: 'CPU Usage', icon: <Cpu className="w-5 h-5" />, color: '#00f5ff' },
          { key: 'memory', label: 'Memory', icon: <Database className="w-5 h-5" />, color: '#9d50bb' },
          { key: 'latency', label: 'Latency', icon: <Activity className="w-5 h-5" />, color: '#00ff9d' },
          { key: 'requests', label: 'Requests', icon: <Globe className="w-5 h-5" />, color: '#ff8c00' },
        ].map(({ key, label, icon, color }) => (
          <motion.div
            key={key}
            whileHover={{ scale: 1.02, y: -2 }}
            className="bg-white/5 rounded-2xl p-6 border border-white/10"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${color}20` }}>
                <span style={{ color }}>{icon}</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                {metrics[key].trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400" />}
                {metrics[key].trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
              </div>
            </div>
            <div className="text-2xl font-bold mb-1" style={{ color }}>
              {metrics[key].value.toFixed(key === 'requests' ? 0 : 2)}{metrics[key].unit}
            </div>
            <div className="text-gray-500 text-sm mb-4">{label}</div>
            <Sparkline data={metrics[key].history} color={color} height={40} />
          </motion.div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Department Status */}
        <div className="lg:col-span-2 bg-white/5 rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            Department Status
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            {departments.map((dept, i) => (
              <motion.div
                key={dept.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-4 bg-white/5 rounded-xl"
              >
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${dept.color}20` }}
                >
                  <span style={{ color: dept.color }}>{dept.icon}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <NeuralPulse active={dept.status === 'online'} color={dept.color} />
                      <span className="text-xs text-gray-500 uppercase">{dept.status}</span>
                    </div>
                  </div>
                  
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ backgroundColor: dept.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.load}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{dept.load.toFixed(0)}% load</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column - Key Metrics */}
        <div className="space-y-6">
          {/* Consciousness Level */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              Consciousness
            </h3>
            <div className="flex justify-center">
              <CircularProgress 
                value={metrics.consciousness.value} 
                max={200} 
                color="#9d50bb" 
                size={120}
                label="OMEGA-7"
              />
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">
              {metrics.consciousness.value}% beyond baseline
            </p>
          </div>

          {/* Revenue Card */}
          <div className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-2xl p-6 border border-yellow-500/20">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-yellow-400" />
              Revenue (Today)
            </h3>
            <div className="text-4xl font-bold text-yellow-400 mb-2">
              €{metrics.revenue.value.toFixed(0)}
            </div>
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              +12.5% from yesterday
            </div>
            <div className="mt-4">
              <Sparkline data={metrics.revenue.history} color="#f9d423" height={50} />
            </div>
          </div>

          {/* Entropy Monitor */}
          <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-cyan-400" />
              Entropy Level
            </h3>
            <div className="text-3xl font-bold text-cyan-400 mb-2">
              {(metrics.entropy.value * 100).toFixed(4)}%
            </div>
            <div className="flex items-center gap-2 text-green-400 text-sm mb-4">
              <CheckCircle className="w-4 h-4" />
              Within safe parameters
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-400 to-green-400 rounded-full"
                animate={{ width: `${metrics.entropy.value * 1000}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="mt-6 bg-white/5 rounded-2xl p-6 border border-white/10">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          Recent Activity
        </h2>
        <div className="space-y-3 max-h-40 overflow-y-auto">
          {[
            { time: '14:32:01', event: 'Quantum resonance scan completed', type: 'success' },
            { time: '14:31:45', event: 'New client registration: sovereign@example.com', type: 'info' },
            { time: '14:31:12', event: 'Payment processed: €99.00 (Sovereign Empire)', type: 'success' },
            { time: '14:30:58', event: 'Self-healing protocol activated for Physics dept', type: 'warning' },
            { time: '14:30:22', event: 'API rate limit threshold reached for client #4121', type: 'warning' },
          ].map((log, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-4 text-sm"
            >
              <span className="text-gray-500 font-mono">{log.time}</span>
              <span className={`w-2 h-2 rounded-full ${
                log.type === 'success' ? 'bg-green-400' :
                log.type === 'warning' ? 'bg-yellow-400' : 'bg-cyan-400'
              }`} />
              <span className="text-gray-300">{log.event}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuantumTelemetryDashboard;
