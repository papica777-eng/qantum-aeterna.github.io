/**
 * 💳 BILLING PAGE
 * Complexity: O(1) — hash-mapped plan lookup
 * Neural QA Nexus — Subscription & Payment Management
 */

import React, { useState } from 'react';
import {
  CreditCard, CheckCircle, Zap, Shield, Star, Crown,
  Download, AlertTriangle, ChevronRight, Lock, ArrowUpRight,
  Calendar, Receipt, TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type PlanId = 'starter' | 'professional' | 'enterprise' | 'sovereign';

interface Plan {
  id: PlanId;
  name: string;
  price: number;
  interval: string;
  description: string;
  features: string[];
  badge?: string;
  gradient: string;
  icon: React.ReactNode;
}

const PLANS: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 49,
    interval: '/month',
    description: 'For solo QA engineers and small teams',
    gradient: 'from-blue-600 to-cyan-600',
    icon: <Zap className="w-5 h-5" />,
    features: [
      '5 concurrent test runs',
      '10,000 API calls/month',
      'Self-healing (basic)',
      'Email support',
      'DOM scanner access',
      '7-day log retention',
    ],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 199,
    interval: '/month',
    description: 'For growing QA departments',
    gradient: 'from-purple-600 to-violet-600',
    icon: <Star className="w-5 h-5" />,
    badge: 'POPULAR',
    features: [
      '25 concurrent test runs',
      '100,000 API calls/month',
      'Self-healing (advanced)',
      'Visual AI recognition',
      'Priority support (24h)',
      '30-day log retention',
      'Analytics dashboard',
      'Slack integration',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 599,
    interval: '/month',
    description: 'For enterprise QA at scale',
    gradient: 'from-orange-600 to-red-600',
    icon: <Shield className="w-5 h-5" />,
    features: [
      'Unlimited test runs',
      'Unlimited API calls',
      'Full self-healing suite',
      'Visual AI + NLP commands',
      'Dedicated support (4h SLA)',
      '90-day log retention',
      'Custom integrations',
      'SOC2 compliance reports',
      'SAML/SSO',
    ],
  },
  {
    id: 'sovereign',
    name: 'Sovereign',
    price: 1499,
    interval: '/month',
    description: 'The full Aeterna Nexus. Absolute power.',
    gradient: 'from-yellow-500 to-amber-600',
    icon: <Crown className="w-5 h-5" />,
    badge: 'ULTIMATE',
    features: [
      'Everything in Enterprise',
      'Knox security layer',
      'Soul Runtime integration',
      'Quantum AI reasoning',
      'White-label deployment',
      'Dedicated infrastructure',
      '1-year log retention',
      '15-min SLA response',
      'Revenue share program',
      'Level 7 access',
    ],
  },
];

const INVOICE_HISTORY = [
  { id: 'INV-2026-04', date: 'Apr 1, 2026', amount: 199, status: 'paid', plan: 'Professional' },
  { id: 'INV-2026-03', date: 'Mar 1, 2026', amount: 199, status: 'paid', plan: 'Professional' },
  { id: 'INV-2026-02', date: 'Feb 1, 2026', amount: 49, status: 'paid', plan: 'Starter' },
  { id: 'INV-2026-01', date: 'Jan 1, 2026', amount: 49, status: 'paid', plan: 'Starter' },
];

export default function BillingPage({ onBack }: { onBack?: () => void }) {
  const [currentPlan] = useState<PlanId>('professional');
  const [selectedPlan, setSelectedPlan] = useState<PlanId | null>(null);
  const [activeTab, setActiveTab] = useState<'plans' | 'payment' | 'invoices'>('plans');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleUpgrade = () => {
    if (!selectedPlan || selectedPlan === currentPlan) return;
    setIsUpgrading(true);
    setTimeout(() => {
      setIsUpgrading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans">
      {/* Header */}
      <nav className="border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition text-gray-400 hover:text-white">
                ← Back
              </button>
            )}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-widest uppercase text-white/90">Billing & Plans</h1>
                <p className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest">
                  Current: Professional · €199/mo
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {(['plans', 'payment', 'invoices'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition ${
                  activeTab === tab ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-green-500/20 border border-green-500/30 rounded-xl backdrop-blur-xl"
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-bold text-sm">Plan upgraded successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-[1400px] mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Plans Tab */}
          {activeTab === 'plans' && (
            <motion.div
              key="plans"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl font-black mb-4">Choose Your <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Sovereignty Level</span></h2>
                <p className="text-gray-400 max-w-xl mx-auto">Scale from solo engineer to enterprise command. Every tier unlocks deeper access to the Aeterna Nexus.</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {PLANS.map((plan, i) => {
                  const isCurrent = plan.id === currentPlan;
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <motion.div
                      key={plan.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => setSelectedPlan(plan.id === currentPlan ? null : plan.id)}
                      className={`relative bg-[#0d0d12] rounded-2xl border-2 transition-all cursor-pointer group ${
                        isCurrent
                          ? 'border-purple-500/50 shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]'
                          : isSelected
                          ? 'border-white/30 shadow-[0_0_20px_-5px_rgba(255,255,255,0.1)]'
                          : 'border-white/5 hover:border-white/15'
                      }`}
                    >
                      {/* Badge */}
                      {(plan.badge || isCurrent) && (
                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          isCurrent ? 'bg-purple-500 text-white' : 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black'
                        }`}>
                          {isCurrent ? 'CURRENT PLAN' : plan.badge}
                        </div>
                      )}

                      <div className="p-6">
                        {/* Icon & Name */}
                        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${plan.gradient} mb-4`}>
                          {plan.icon}
                        </div>
                        <h3 className="text-xl font-black text-white mb-1">{plan.name}</h3>
                        <p className="text-xs text-gray-500 mb-5 leading-relaxed">{plan.description}</p>

                        {/* Price */}
                        <div className="mb-6">
                          <span className="text-4xl font-black text-white">€{plan.price}</span>
                          <span className="text-gray-500 text-sm">{plan.interval}</span>
                        </div>

                        {/* Features */}
                        <ul className="space-y-2 mb-6">
                          {plan.features.map((feat, j) => (
                            <li key={j} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                              <span className="text-gray-300">{feat}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Select Button */}
                        <button
                          className={`w-full py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition ${
                            isCurrent
                              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 cursor-default'
                              : isSelected
                              ? `bg-gradient-to-r ${plan.gradient} text-white hover:opacity-90`
                              : 'bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {isCurrent ? 'Active Plan' : isSelected ? 'Selected ✓' : 'Select Plan'}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Upgrade CTA */}
              {selectedPlan && selectedPlan !== currentPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0d0d12] border border-white/10 rounded-2xl p-6 flex items-center justify-between"
                >
                  <div>
                    <p className="text-white font-bold text-lg">
                      Upgrade to <span className="text-purple-400">{PLANS.find(p => p.id === selectedPlan)?.name}</span>
                    </p>
                    <p className="text-gray-500 text-sm">Change takes effect immediately. Prorated billing applied.</p>
                  </div>
                  <button
                    onClick={handleUpgrade}
                    disabled={isUpgrading}
                    className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition disabled:opacity-50"
                  >
                    {isUpgrading ? (
                      <><span className="animate-spin">⟳</span> Processing...</>
                    ) : (
                      <><Lock className="w-4 h-4" /> Upgrade Securely</>
                    )}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Payment Tab */}
          {activeTab === 'payment' && (
            <motion.div
              key="payment"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl"
            >
              <h2 className="text-2xl font-black mb-8">Payment Method</h2>

              {/* Current Card */}
              <div className="bg-gradient-to-br from-purple-900/60 to-indigo-900/60 border border-purple-500/20 rounded-2xl p-8 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10">
                  <CreditCard className="w-40 h-40" />
                </div>
                <div className="flex justify-between items-start mb-8">
                  <div className="w-12 h-8 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md" />
                  <span className="text-xs font-mono text-gray-400">VISA</span>
                </div>
                <div className="text-xl font-mono tracking-[0.3em] text-white mb-6">
                  •••• •••• •••• 4242
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Card Holder</div>
                    <div className="font-bold">Dimitar Prodromov</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-xs mb-1">Expires</div>
                    <div className="font-bold">12/2028</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-5 bg-[#0d0d12] border border-white/5 hover:border-white/15 rounded-xl transition group">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Update Payment Method</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition" />
                </button>
                <button className="w-full flex items-center justify-between p-5 bg-[#0d0d12] border border-white/5 hover:border-white/15 rounded-xl transition group">
                  <div className="flex items-center gap-3">
                    <Receipt className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Billing Address</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition" />
                </button>
                <button className="w-full flex items-center justify-between p-5 bg-[#0d0d12] border border-white/5 hover:border-red-500/20 rounded-xl transition group">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <span className="font-medium text-red-400">Cancel Subscription</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-red-400 transition" />
                </button>
              </div>

              <div className="mt-6 flex items-center gap-2 text-xs text-gray-600">
                <Lock className="w-3 h-3" />
                Secured by 256-bit AES encryption · Knox protocol active
              </div>
            </motion.div>
          )}

          {/* Invoices Tab */}
          {activeTab === 'invoices' && (
            <motion.div
              key="invoices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black">Invoice History</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-white/10 transition">
                  <Download className="w-4 h-4" /> Export All
                </button>
              </div>

              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[
                  { label: 'Total Paid', value: `€${INVOICE_HISTORY.reduce((s, i) => s + i.amount, 0)}`, color: 'text-green-400', icon: <TrendingUp /> },
                  { label: 'Invoices', value: INVOICE_HISTORY.length, color: 'text-white', icon: <Receipt /> },
                  { label: 'Next Billing', value: 'May 1, 2026', color: 'text-purple-400', icon: <Calendar /> },
                ].map(stat => (
                  <div key={stat.label} className="bg-[#0d0d12] border border-white/5 rounded-xl p-6">
                    <div className="text-gray-500 opacity-70 mb-2">{React.cloneElement(stat.icon as React.ReactElement, { className: 'w-5 h-5' })}</div>
                    <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-widest mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Invoice Table */}
              <div className="bg-[#0d0d12] border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Invoice</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Date</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Plan</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Amount</th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody>
                    {INVOICE_HISTORY.map((inv, i) => (
                      <motion.tr
                        key={inv.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-b border-white/5 last:border-0 hover:bg-white/3 transition"
                      >
                        <td className="px-6 py-4 font-mono text-sm text-gray-300">{inv.id}</td>
                        <td className="px-6 py-4 text-sm text-gray-400">{inv.date}</td>
                        <td className="px-6 py-4 text-sm text-gray-300">{inv.plan}</td>
                        <td className="px-6 py-4 text-sm font-bold text-white">€{inv.amount}</td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-1.5 text-xs font-bold text-green-400">
                            <CheckCircle className="w-3 h-3" /> Paid
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-white transition">
                            <Download className="w-3 h-3" /> PDF
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
