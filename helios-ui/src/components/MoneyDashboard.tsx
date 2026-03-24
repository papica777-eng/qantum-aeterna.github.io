/**
 * 💰 AETERNAAA Money Dashboard
 * Integrated with AETERNAAA product catalog and payment system
 */

import React, { useState, useEffect } from 'react';
import { 
  Zap, Brain, Sparkles, CreditCard, TrendingUp, Users, 
  DollarSign, Send, Check, Activity, BarChart3, Wallet 
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'one-time' | 'monthly' | 'yearly';
  features: string[];
  formattedPrice: string;
  category: 'access' | 'enterprise' | 'premium';
}

interface Stats {
  totalRevenue: number;
  todayRevenue: number;
  activeSubscriptions: number;
  growthPercent: number;
  cryptoAssets?: {
    totalUSD: number;
    assets: Array<{ asset: string; amount: string; valueUSD: number }>;
  };
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8890';

export default function MoneyDashboard() {
  const [page, setPage] = useState<'home' | 'pricing' | 'admin' | 'chat'>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load products from AETERNAAA API
    fetch(`${API_BASE}/api/products`)
      .then(r => r.json())
      .then(data => {
        if (data.products) {
          setProducts(data.products);
        }
      })
      .catch(console.error);

    // Load stats
    loadStats();
    const statsInterval = setInterval(loadStats, 30000); // Update every 30s

    return () => clearInterval(statsInterval);
  }, []);

  const loadStats = async () => {
    try {
      // Get telemetry from backend
      const telemetryRes = await fetch(`${API_BASE}/telemetry`);
      const telemetry = await telemetryRes.json();
      
      // Get economy stats
      const economyRes = await fetch(`${API_BASE}/api/economy/stats`);
      const economy = await economyRes.json();

      setStats({
        totalRevenue: telemetry.realized_revenue || economy.totalRevenue || 0,
        todayRevenue: economy.todayRevenue || 0,
        activeSubscriptions: economy.activeSubscriptions || 0,
        growthPercent: economy.growthPercent || 0,
        cryptoAssets: telemetry.crypto_assets ? {
          totalUSD: telemetry.total_liquid_usd || 0,
          assets: telemetry.crypto_assets.map((a: any) => ({
            asset: a.asset,
            amount: a.free,
            valueUSD: parseFloat(a.free) * (a.asset === 'USDT' || a.asset === 'USDC' ? 1 : 0)
          }))
        } : undefined
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleCheckout = async (productId: string) => {
    const email = prompt('Enter your email:');
    if (!email) return;

    try {
      const res = await fetch(`${API_BASE}/api/economy/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          successUrl: `${window.location.origin}/success`,
          cancelUrl: `${window.location.origin}/pricing`
        })
      });

      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert('Failed to create checkout session');
      }
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    setLoading(true);
    setChatHistory(prev => [...prev, { role: 'user', text: chatInput }]);

    try {
      const res = await fetch(`${API_BASE}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: chatInput })
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'ai', text: data.response }]);
    } catch (e: any) {
      setChatHistory(prev => [...prev, { role: 'ai', text: 'Error: ' + e.message }]);
    }
    setChatInput('');
    setLoading(false);
  };

  return (
    <div className="min-h-screen text-white">
      {/* Navigation */}
      <nav className="border-b border-purple-500/20 p-4 bg-gray-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold">
            <span className="text-3xl">🌌</span>
            <span className="gradient-text">AETERNAAA</span>
            <span className="text-sm text-gray-400 ml-2">Money Dashboard</span>
          </div>
          <div className="flex gap-6">
            <button 
              onClick={() => setPage('home')} 
              className={`hover:text-purple-400 transition ${page === 'home' ? 'text-purple-400' : ''}`}
            >
              Home
            </button>
            <button 
              onClick={() => setPage('pricing')} 
              className={`hover:text-purple-400 transition ${page === 'pricing' ? 'text-purple-400' : ''}`}
            >
              Pricing
            </button>
            <button 
              onClick={() => setPage('admin')} 
              className={`hover:text-purple-400 transition ${page === 'admin' ? 'text-purple-400' : ''}`}
            >
              Revenue
            </button>
            <button 
              onClick={() => setPage('chat')} 
              className={`hover:text-purple-400 transition ${page === 'chat' ? 'text-purple-400' : ''}`}
            >
              AI Chat
            </button>
          </div>
        </div>
      </nav>

      {/* Home Page */}
      {page === 'home' && (
        <div className="max-w-7xl mx-auto p-8">
          <div className="text-center py-20">
            <h1 className="text-6xl font-bold mb-6">
              <span className="gradient-text">AETERNAAA</span>
              <br />
              <span className="text-white">Sovereign Cognitive Entity</span>
            </h1>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Enterprise AI platform with integrated payment processing. 
              Generate revenue through Stripe and track crypto assets via Binance.
            </p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => setPage('pricing')}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-semibold text-lg hover:opacity-90 pulse-glow"
              >
                View Plans
              </button>
              <button 
                onClick={() => setPage('admin')}
                className="px-8 py-4 border border-purple-500 rounded-lg font-semibold text-lg hover:bg-purple-500/20"
              >
                Revenue Dashboard
              </button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 py-12">
            <FeatureCard 
              icon={<Brain className="w-8 h-8" />}
              title="Rust Backend"
              desc="High-performance API with Axum framework"
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title="Stripe Integration"
              desc="Live payment processing with webhooks"
            />
            <FeatureCard 
              icon={<Wallet className="w-8 h-8" />}
              title="Binance Tracking"
              desc="Real-time crypto asset monitoring"
            />
          </div>
        </div>
      )}

      {/* Pricing Page */}
      {page === 'pricing' && (
        <div className="max-w-6xl mx-auto p-8">
          <h2 className="text-4xl font-bold text-center mb-4 gradient-text">💰 Pricing Plans</h2>
          <p className="text-center text-gray-400 mb-12">Choose your access level to AETERNAAA</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <PricingCard
                key={product.id}
                product={product}
                popular={product.category === 'enterprise'}
                onBuy={() => handleCheckout(product.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Revenue Dashboard */}
      {page === 'admin' && stats && (
        <div className="max-w-7xl mx-auto p-8">
          <h2 className="text-3xl font-bold mb-8 gradient-text">📊 Revenue Dashboard</h2>
          
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={<DollarSign />} 
              label="Total Revenue" 
              value={`€${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
              color="green" 
            />
            <StatCard 
              icon={<TrendingUp />} 
              label="Today" 
              value={`€${stats.todayRevenue.toLocaleString()}`} 
              color="blue" 
            />
            <StatCard 
              icon={<Users />} 
              label="Active Subs" 
              value={stats.activeSubscriptions.toString()} 
              color="purple" 
            />
            <StatCard 
              icon={<Activity />} 
              label="Growth" 
              value={`+${stats.growthPercent}%`} 
              color="pink" 
            />
          </div>

          {/* Crypto Assets */}
          {stats.cryptoAssets && stats.cryptoAssets.totalUSD > 0 && (
            <div className="bg-gray-900/50 rounded-xl p-6 glow-box mb-8">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Wallet className="w-6 h-6" />
                Crypto Assets (Binance)
              </h3>
              <div className="text-3xl font-bold text-green-400 mb-4">
                ${stats.cryptoAssets.totalUSD.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {stats.cryptoAssets.assets.slice(0, 6).map((asset, i) => (
                  <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm text-gray-400">{asset.asset}</div>
                    <div className="text-lg font-semibold">{asset.amount}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="bg-gray-900/50 rounded-xl p-6 glow-box">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="text-gray-400 text-sm">
                Real-time transaction data will appear here when payments are processed.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Page */}
      {page === 'chat' && (
        <div className="max-w-4xl mx-auto p-8">
          <h2 className="text-3xl font-bold mb-6 gradient-text">🧠 AETERNAAA AI Chat</h2>
          
          <div className="bg-gray-900/50 rounded-xl p-6 glow-box min-h-[400px] max-h-[500px] overflow-y-auto mb-4">
            {chatHistory.length === 0 && (
              <p className="text-gray-500 text-center py-20">Ask AETERNAAA anything...</p>
            )}
            {chatHistory.map((msg, i) => (
              <div key={i} className={`mb-4 ${msg.role === 'user' ? 'text-right' : ''}`}>
                <div className={`inline-block max-w-[80%] p-4 rounded-xl ${
                  msg.role === 'user' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800 text-gray-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && <div className="text-purple-400">🤔 Thinking...</div>}
          </div>

          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleChat()}
              placeholder="Ask AETERNAAA..."
              className="flex-1 bg-gray-800 border border-purple-500/30 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500"
            />
            <button 
              onClick={handleChat}
              disabled={loading}
              className="px-6 py-3 bg-purple-600 rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition glow-box">
      <div className="text-purple-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}

function PricingCard({ product, popular, onBuy }: { product: Product; popular: boolean; onBuy: () => void }) {
  return (
    <div className={`bg-gray-900/50 rounded-xl p-8 border ${popular ? 'border-purple-500 glow-box' : 'border-gray-700'} relative`}>
      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 px-4 py-1 rounded-full text-sm font-semibold">
          POPULAR
        </div>
      )}
      <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
      <div className="text-4xl font-bold mb-1">{product.formattedPrice}</div>
      <p className="text-gray-400 mb-6 text-sm">{product.description}</p>
      <ul className="space-y-3 mb-8">
        {product.features.map((f, i) => (
          <li key={i} className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={onBuy}
        className={`w-full py-3 rounded-lg font-semibold transition ${
          popular 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90' 
            : 'bg-gray-700 hover:bg-gray-600'
        }`}
      >
        <CreditCard className="w-5 h-5 inline mr-2" />
        Subscribe
      </button>
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    pink: 'from-pink-500 to-rose-500'
  };
  return (
    <div className="bg-gray-900/50 rounded-xl p-6 glow-box">
      <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${colors[color]} mb-3`}>
        {icon}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
