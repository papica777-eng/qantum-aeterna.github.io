/**
 * Client Portal - Complete user experience
 * Registration → Payment → Dashboard → SaaS Usage
 *
 * E2E Upgrades:
 * - Frictionless Registration (Loading states, sleek UI)
 * - Notification Matrix (Toasts for all key actions)
 * - Premium Client Dashboard ($195k enterprise feel)
 */

import React, { useState, useEffect } from 'react';
import { 
  User, CreditCard, CheckCircle, Star, ArrowRight, Mail, Lock,
  Zap, Brain, Shield, Globe, Activity, Settings, LogOut, Search,
  Loader2, AlertCircle, Info, Check, BarChart3, HardDrive,
  RefreshCw, Terminal, Receipt
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type UserFlow = 'landing' | 'register' | 'login' | 'payment' | 'dashboard' | 'app';

interface UserData {
  email: string;
  name: string;
  plan?: string;
  subscriptions: string[];
  isLoggedIn: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  popular?: boolean;
  apps: string[];
}

const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'node_access',
    name: 'Node Access',
    price: 29,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Access to 1 SaaS application',
      'Basic neural node access',
      'API access (1000 req/day)',
      'Community support',
      'Basic telemetry dashboard'
    ],
    apps: ['wealth_scanner']
  },
  {
    id: 'galactic_core',
    name: 'Galactic Core',
    price: 99,
    currency: 'EUR',
    interval: 'month',
    popular: true,
    features: [
      'Access to 3 SaaS applications',
      'Advanced neural processing',
      'API access (10000 req/day)',
      'Priority 24/7 support',
      'Advanced telemetry & analytics',
      'Custom integrations'
    ],
    apps: ['wealth_scanner', 'sector_security', 'network_optimizer']
  },
  {
    id: 'omega_syndicate',
    name: 'Omega Syndicate',
    price: 299,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Unlimited access to ALL SaaS',
      'Dedicated neural cluster',
      'Unlimited API access',
      'White-glove onboarding',
      'Custom AI model training',
      'Enterprise SLA (99.99%)'
    ],
    apps: ['wealth_scanner', 'sector_security', 'network_optimizer', 'valuation_gate', 'automation_nexus', 'intelligence_core']
  }
];

// --- NOTIFICATION MATRIX ---

interface NotificationState {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

const Toast: React.FC<{ notification: NotificationState, onDismiss: (id: number) => void }> = ({ notification, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(notification.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-400" />,
    error: <AlertCircle className="w-5 h-5 text-red-400" />,
    info: <Info className="w-5 h-5 text-blue-400" />
  };

  const borderColors = {
    success: 'border-green-500/50',
    error: 'border-red-500/50',
    info: 'border-blue-500/50'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.9 }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-6 py-4 bg-black/90 backdrop-blur border ${borderColors[notification.type]} rounded-xl shadow-2xl min-w-[300px]`}
    >
      {icons[notification.type]}
      <p className="font-medium text-white/90">{notification.message}</p>
    </motion.div>
  );
};

// --- MAIN PORTAL ---

export const ClientPortal: React.FC = () => {
  const [currentFlow, setCurrentFlow] = useState<UserFlow>('landing');
  const [userData, setUserData] = useState<UserData>({
    email: '',
    name: '',
    subscriptions: [],
    isLoggedIn: false
  });
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);

  // Notification State
  const [notifications, setNotifications] = useState<NotificationState[]>([]);
  let notifIdCounter = 0;

  const showNotification = (message: string, type: 'success'|'error'|'info' = 'info') => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { message, type, id }]);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Language toggle mock
  const [language, setLanguage] = useState<'en'|'bg'>('en');

  useEffect(() => {
    // Check local storage for existing session
    const saved = localStorage.getItem('aeterna_user');
    if (saved) {
      const user = JSON.parse(saved);
      setUserData(user);
      setCurrentFlow('dashboard');
      showNotification('Welcome back to Aeterna', 'success');
    }
  }, []);

  const handleRegister = async (email: string, name: string, password: string) => {
    showNotification('Registration successful. Secure gateway establishing...', 'success');

    const newUser: UserData = {
      email,
      name,
      subscriptions: [],
      isLoggedIn: true
    };
    
    setUserData(newUser);
    localStorage.setItem('aeterna_user', JSON.stringify(newUser));
    
    // If no plan selected, show pricing
    if (!selectedPlan) {
      setCurrentFlow('payment');
    } else {
      await handlePayment(selectedPlan);
    }
  };

  const handlePayment = async (plan: PricingPlan) => {
    showNotification('Payment authenticated. Generating neural access keys...', 'success');
    
    // Simulate payment processing
    setTimeout(() => {
      const updatedUser = {
        ...userData,
        plan: plan.id,
        subscriptions: plan.apps,
        isLoggedIn: true
      };
      setUserData(updatedUser);
      localStorage.setItem('aeterna_user', JSON.stringify(updatedUser));
      setCurrentFlow('dashboard');
      showNotification('Dashboard access granted. Welcome to the Nexus.', 'success');
    }, 1500);
  };

  const logout = () => {
    localStorage.removeItem('aeterna_user');
    setUserData({ email: '', name: '', subscriptions: [], isLoggedIn: false });
    setCurrentFlow('landing');
    showNotification('Session terminated securely.', 'info');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-purple-500/30 font-sans text-inter">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10">
        {/* Language Toggle */}
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={() => setLanguage(l => l === 'en' ? 'bg' : 'en')}
            className="px-3 py-1 text-sm font-medium text-gray-400 hover:text-white border border-white/10 hover:border-white/30 rounded-full transition bg-black/20 backdrop-blur"
          >
            {language === 'en' ? 'БГ' : 'EN'}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {/* Landing Flow */}
          {currentFlow === 'landing' && (
            <LandingPage
              key="landing"
              language={language}
              onGetStarted={() => setCurrentFlow('register')}
              onLogin={() => setCurrentFlow('login')}
              onSelectPlan={(plan) => {
                setSelectedPlan(plan);
                setCurrentFlow('register');
              }}
            />
          )}

          {/* Registration */}
          {currentFlow === 'register' && (
            <RegistrationPage
              key="register"
              language={language}
              selectedPlan={selectedPlan}
              onRegister={handleRegister}
              onBack={() => setCurrentFlow('landing')}
            />
          )}

          {/* Login */}
          {currentFlow === 'login' && (
            <LoginPage
              key="login"
              language={language}
              onLogin={(email, password) => {
                showNotification('Authentication successful. Welcome back.', 'success');
                const user = { email, name: 'Demo User', subscriptions: ['wealth_scanner', 'sector_security'], plan: 'galactic_core', isLoggedIn: true };
                setUserData(user);
                localStorage.setItem('aeterna_user', JSON.stringify(user));
                setCurrentFlow('dashboard');
              }}
              onBack={() => setCurrentFlow('landing')}
            />
          )}

          {/* Payment */}
          {currentFlow === 'payment' && (
            <PaymentPage
              key="payment"
              language={language}
              plans={PRICING_PLANS}
              selectedPlan={selectedPlan}
              onSelectPlan={setSelectedPlan}
              onPayment={handlePayment}
              onBack={() => setCurrentFlow('register')}
            />
          )}

          {/* Client Dashboard */}
          {currentFlow === 'dashboard' && userData.isLoggedIn && (
            <ClientDashboard
              key="dashboard"
              language={language}
              user={userData}
              onLogout={logout}
              onLaunchApp={(appId) => setCurrentFlow('app')}
              onNavigate={(page) => {
                // Navigate via URL for full-page mode outside ClientPortal
                window.location.href = `/${page}`;
              }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Notification Matrix */}
      <AnimatePresence>
        {notifications.map(notif => (
          <Toast key={notif.id} notification={notif} onDismiss={removeNotification} />
        ))}
      </AnimatePresence>
    </div>
  );
};

// --- COMPONENTS ---

const LandingPage: React.FC<{
  language: 'en' | 'bg';
  onGetStarted: () => void;
  onLogin: () => void;
  onSelectPlan: (plan: PricingPlan) => void;
}> = ({ language, onGetStarted, onLogin, onSelectPlan }) => {
  const t = language === 'bg' ? {
    title: 'AETERNA.WEBSITE',
    subtitle: 'Последната SaaS платформа която ще ви трябва някога',
    description: 'Единна платформа. Всички инструменти. Превъзходна над всичко на пазара.',
    getStarted: 'Започни Безплатно',
    login: 'Вход',
    features: 'Революционни Features',
    pricing: 'Планове и Цени'
  } : {
    title: 'AETERNA.WEBSITE',
    subtitle: "The Last SaaS Platform You'll Ever Need",
    description: 'One platform. Every tool. Superior to everything on the market.',
    getStarted: 'Get Started Free',
    login: 'Login',
    features: 'Revolutionary Features', 
    pricing: 'Plans & Pricing'
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen"
    >
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl md:text-8xl font-black mb-6 tracking-tighter bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent"
        >
          {t.title}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl text-[#8B5CF6] font-medium mb-4 tracking-tight"
        >
          {t.subtitle}
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-400 mb-12 max-w-2xl"
        >
          {t.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4"
        >
          <button 
            onClick={onGetStarted}
            className="px-8 py-4 bg-white text-black rounded-xl font-bold text-lg hover:scale-105 transition-transform"
          >
            {t.getStarted}
          </button>
          <button 
            onClick={onLogin}
            className="px-8 py-4 border border-white/20 rounded-xl font-semibold text-lg hover:bg-white/10 transition"
          >
            {t.login}
          </button>
        </motion.div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5">
        <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">{t.pricing}</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => (
            <motion.div
              key={plan.id}
              whileHover={{ scale: 1.02, y: -5 }}
              className={`relative bg-black/40 backdrop-blur-md rounded-2xl p-8 border transition cursor-pointer overflow-hidden ${
                plan.popular ? 'border-purple-500/50 shadow-[0_0_30px_-10px_rgba(168,85,247,0.4)]' : 'border-white/10 hover:border-white/30'
              }`}
              onClick={() => onSelectPlan(plan)}
            >
              {plan.popular && (
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-purple-600 to-cyan-600" />
              )}
              {plan.popular && (
                <div className="text-center mb-6">
                  <span className="bg-purple-500/20 text-purple-300 border border-purple-500/30 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase">
                    {language === 'bg' ? 'НАЙ-ПОПУЛЯРЕН' : 'MOST POPULAR'}
                  </span>
                </div>
              )}
              
              <h3 className="text-xl font-bold mb-2 text-white/90">{plan.name}</h3>
              <div className="text-4xl font-black mb-1">
                €{plan.price}
                <span className="text-lg text-gray-500 font-medium">/{plan.interval}</span>
              </div>
              
              <ul className="space-y-3 mt-8 mb-8 text-sm text-gray-300">
                {plan.features.slice(0, 4).map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#8B5CF6] mt-0.5 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
                {plan.features.length > 4 && (
                  <li className="text-gray-500 font-medium text-xs uppercase tracking-wider mt-4">
                    + {plan.features.length - 4} {language === 'bg' ? 'ОЩЕ ФУНКЦИИ' : 'MORE FEATURES'}...
                  </li>
                )}
              </ul>
              
              <button className={`w-full py-4 rounded-xl font-bold transition ${plan.popular ? 'bg-white text-black hover:bg-gray-200' : 'bg-white/10 hover:bg-white/20'}`}>
                {language === 'bg' ? 'Избери План' : 'Select Plan'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const RegistrationPage: React.FC<{
  language: 'en' | 'bg';
  selectedPlan: PricingPlan | null;
  onRegister: (email: string, name: string, password: string) => void;
  onBack: () => void;
}> = ({ language, selectedPlan, onRegister, onBack }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = language === 'bg' ? {
    title: 'Инициализация на Акаунт',
    subtitle: 'Gateway to the Aeterna Ecosystem',
    emailLabel: 'ИДЕНТИФИКАТОР (EMAIL)',
    nameLabel: 'ПРОФИЛНО ИМЕ',
    passwordLabel: 'КЛЮЧ ЗА ДОСТЪП',
    createAccount: 'ИНСТАНЦИРАНЕ',
    alreadyHave: 'Вече имате достъп?',
    signIn: 'Влезте в системата',
    selectedPlan: 'ЦЕЛЕВИ ПЛАН'
  } : {
    title: 'Account Initialization',
    subtitle: 'Gateway to the Aeterna Ecosystem',
    emailLabel: 'IDENTIFIER (EMAIL)',
    nameLabel: 'PROFILE NAME',
    passwordLabel: 'ACCESS KEY',
    createAccount: 'INSTANTIATE',
    alreadyHave: 'Already have access?',
    signIn: 'Enter the system',
    selectedPlan: 'TARGET PLAN'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate frictionless validation delay
    setTimeout(() => {
      setIsLoading(false);
      onRegister(email, name, password);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, filter: 'blur(10px)' }}
      className="min-h-screen flex items-center justify-center px-6 py-12"
    >
      <div className="w-full max-w-md relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600/30 to-blue-600/30 rounded-[2rem] blur-xl opacity-50" />

        <div className="relative bg-[#0d0d12]/90 backdrop-blur-xl rounded-[2rem] border border-white/10 p-10 shadow-2xl">
          <div className="mb-10">
            <h1 className="text-3xl font-black mb-2 tracking-tight">{t.title}</h1>
            <p className="text-gray-400 font-medium">{t.subtitle}</p>
          </div>

          {selectedPlan && (
            <div className="mb-8 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#8B5CF6] tracking-wider mb-1">{t.selectedPlan}</div>
                <div className="font-bold text-white/90">{selectedPlan.name}</div>
              </div>
              <div className="text-right">
                <div className="font-black text-xl">€{selectedPlan.price}</div>
                <div className="text-xs text-gray-500 font-medium">/{selectedPlan.interval}</div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2">{t.emailLabel}</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#8B5CF6] transition-colors" />
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-white font-medium disabled:opacity-50"
                  placeholder="commander@aeterna.dev"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2">{t.nameLabel}</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#8B5CF6] transition-colors" />
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-white font-medium disabled:opacity-50"
                  placeholder="Jules Nexus"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 tracking-wider mb-2">{t.passwordLabel}</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-[#8B5CF6] transition-colors" />
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-white font-medium font-mono disabled:opacity-50"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-4 bg-white text-black rounded-xl font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : t.createAccount}
            </button>
          </form>

          <div className="text-center mt-8 text-sm text-gray-500 font-medium">
            {t.alreadyHave}{' '}
            <button 
              onClick={onBack}
              disabled={isLoading}
              className="text-white hover:text-[#8B5CF6] transition-colors underline decoration-white/30 underline-offset-4"
            >
              {t.signIn}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LoginPage: React.FC<{
  language: 'en' | 'bg';
  onLogin: (email: string, password: string) => void;
  onBack: () => void;
}> = ({ language, onLogin, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = language === 'bg' ? {
    title: 'Системен Вход',
    subtitle: 'Удостоверете вашата самоличност',
    login: 'АВТОРИЗАЦИЯ',
    forgotPassword: 'Възстановяване на достъп?',
    noAccount: 'Нямате идентификатор?',
    signUp: 'Инициализирайте акаунт'
  } : {
    title: 'System Entry',
    subtitle: 'Authenticate your identity',
    login: 'AUTHORIZE',
    forgotPassword: 'Recover access?',
    noAccount: 'No identifier?',
    signUp: 'Initialize account'
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email, password);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="min-h-screen flex items-center justify-center px-6 py-12"
    >
      <div className="w-full max-w-md relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/30 to-purple-600/30 rounded-[2rem] blur-xl opacity-50" />

        <div className="relative bg-[#0d0d12]/90 backdrop-blur-xl rounded-[2rem] border border-white/10 p-10 shadow-2xl">
          <div className="mb-10">
            <h1 className="text-3xl font-black mb-2 tracking-tight">{t.title}</h1>
            <p className="text-gray-400 font-medium">{t.subtitle}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  required
                  disabled={isLoading}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-white font-medium disabled:opacity-50"
                  placeholder="IDENTIFIER"
                />
              </div>
            </div>

            <div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="password"
                  required
                  disabled={isLoading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-white font-medium font-mono disabled:opacity-50"
                  placeholder="ACCESS KEY"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-4 bg-white text-black rounded-xl font-bold tracking-widest uppercase hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : t.login}
            </button>
          </form>

          <div className="text-center mt-8 space-y-4">
            <button disabled={isLoading} className="text-sm font-medium text-gray-500 hover:text-white transition-colors">
              {t.forgotPassword}
            </button>
            <div className="text-sm text-gray-500 font-medium pt-4 border-t border-white/5">
              {t.noAccount}{' '}
              <button 
                onClick={onBack}
                disabled={isLoading}
                className="text-white hover:text-blue-400 transition-colors underline decoration-white/30 underline-offset-4"
              >
                {t.signUp}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const PaymentPage: React.FC<{
  language: 'en' | 'bg';
  plans: PricingPlan[];
  selectedPlan: PricingPlan | null;
  onSelectPlan: (plan: PricingPlan) => void;
  onPayment: (plan: PricingPlan) => void;
  onBack: () => void;
}> = ({ language, plans, selectedPlan, onSelectPlan, onPayment, onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const t = language === 'bg' ? {
    title: 'Криптографско Заплащане',
    subtitle: 'Активация на лиценз към Aeterna Nexus',
    payNow: 'ОТОРИЗИРАЙ',
    mostPopular: 'НАЙ-ПОПУЛЯРЕН'
  } : {
    title: 'Cryptographic Settlement',
    subtitle: 'License activation for Aeterna Nexus',
    payNow: 'AUTHORIZE',
    mostPopular: 'MOST POPULAR'
  };

  const handlePay = () => {
    if (!selectedPlan) return;
    setIsProcessing(true);
    // Real-world: Call Stripe here.
    // For now: Handled by parent timeout
    onPayment(selectedPlan);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="min-h-screen py-24 px-6 flex flex-col items-center justify-center"
    >
      <div className="max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">{t.title}</h1>
          <p className="text-xl text-gray-400 font-medium">{t.subtitle}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Order Summary */}
          <div className="bg-[#0d0d12]/90 backdrop-blur-xl rounded-[2rem] border border-white/10 p-8">
            <h3 className="text-lg font-bold text-gray-400 tracking-wider uppercase mb-6">Order Summary</h3>
            {selectedPlan ? (
              <div>
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/5">
                  <div className="font-bold text-xl">{selectedPlan.name}</div>
                  <div className="font-black text-2xl">€{selectedPlan.price}</div>
                </div>
                <ul className="space-y-3 mb-8 text-sm text-gray-400">
                  {selectedPlan.features.slice(0, 3).map((f, i) => (
                    <li key={i} className="flex gap-2 items-start"><Check className="w-4 h-4 text-[#8B5CF6] shrink-0" />{f}</li>
                  ))}
                </ul>
                <div className="bg-black/50 p-4 rounded-xl text-xs font-mono text-gray-500 break-all border border-white/5">
                  UUID: {crypto.randomUUID()}
                  <br/>
                  TIMESTAMP: {new Date().toISOString()}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 font-medium text-center py-12 flex flex-col items-center">
                <div className="mb-4">No plan selected.</div>
                <button
                  onClick={onBack}
                  className="px-6 py-2 border border-white/20 text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
                >
                  {language === 'bg' ? 'Избери План' : 'Select Plan'}
                </button>
              </div>
            )}
          </div>

          {/* Payment Action */}
          <div className="flex flex-col justify-center gap-6">
            {selectedPlan && (
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-6 bg-white text-black rounded-[2rem] font-black text-xl tracking-widest uppercase hover:bg-gray-200 transition-all flex items-center justify-center disabled:opacity-70 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.5)]"
              >
                {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                  <>
                    <CreditCard className="w-6 h-6 mr-3" />
                    {t.payNow} €{selectedPlan.price}
                  </>
                )}
              </button>
            )}

            <button
              onClick={onBack}
              disabled={isProcessing}
              className="w-full py-4 border border-white/20 text-white rounded-[2rem] font-bold uppercase tracking-widest hover:bg-white/5 transition-colors"
            >
              {language === 'bg' ? 'Отказ' : 'Cancel'}
            </button>

            <div className="text-center text-xs font-medium text-gray-600 uppercase tracking-widest mt-4 flex items-center justify-center gap-2">
              <Shield className="w-4 h-4" /> SECURE 256-BIT ENCRYPTION
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Client Dashboard - Premium E2E Overhaul
const ClientDashboard: React.FC<{
  language: 'en' | 'bg';
  user: UserData;
  onLogout: () => void;
  onLaunchApp: (appId: string) => void;
  onNavigate?: (page: 'healing' | 'logs' | 'billing' | 'telemetry') => void;
}> = ({ language, user, onLogout, onLaunchApp, onNavigate }) => {
  const t = language === 'bg' ? {
    welcome: 'КОМАНДЕН ЦЕНТЪР',
    yourApps: 'АКТИВНИ ИНСТАНЦИИ',
    launch: 'ОТВОРИ',
    settings: 'Конфигурация',
    logout: 'Изход от системата',
    account: 'Системен Статус',
    stats: {
      vol: 'Обработен Обем',
      health: 'Здраве на Системата',
      nodes: 'Активни Възли'
    }
  } : {
    welcome: 'COMMAND CENTER',
    yourApps: 'ACTIVE INSTANCES',
    launch: 'LAUNCH',
    settings: 'Configuration',
    logout: 'Terminate Session',
    account: 'System Status',
    stats: {
      vol: 'Processed Volume',
      health: 'System Health',
      nodes: 'Active Nodes'
    }
  };

  const userApps = PRICING_PLANS
    .find(p => p.id === user.plan)?.apps || user.subscriptions;

  const availableApps = [
    { id: 'wealth_scanner', name: 'Wealth Scanner Pro', icon: '🔍', desc: 'Predictive market analysis', url: 'wealth-scanner.aeterna.website', color: 'from-blue-500 to-cyan-500' },
    { id: 'sector_security', name: 'Sector Security Suite', icon: '🛡️', desc: 'Enterprise threat protection', url: 'sector-security.aeterna.website', color: 'from-red-500 to-orange-500' },
    { id: 'network_optimizer', name: 'Network Optimizer Pro', icon: '🌐', desc: 'Latency & throughput routing', url: 'network-optimizer.aeterna.website', color: 'from-green-500 to-emerald-500' },
    { id: 'valuation_gate', name: 'Valuation Gate AI', icon: '💎', desc: 'Asset pricing algorithms', url: 'valuation-gate.aeterna.website', color: 'from-purple-500 to-pink-500' },
    { id: 'automation_nexus', name: 'Automation Nexus', icon: '🤖', desc: 'Workflow hyper-automation', url: 'automation-nexus.aeterna.website', color: 'from-yellow-500 to-amber-500' },
    { id: 'intelligence_core', name: 'Intelligence Core', icon: '🧠', desc: 'AGI reasoning module', url: 'intelligence-core.aeterna.website', color: 'from-indigo-500 to-violet-500' }
  ].filter(app => userApps.includes(app.id));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#050508] bg-[url('/grid.svg')] bg-center font-sans text-inter"
    >
      {/* Header */}
      <nav className="border-b border-white/5 bg-black/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white text-black rounded-lg flex items-center justify-center font-black text-xl tracking-tighter shadow-[0_0_20px_rgba(255,255,255,0.3)]">
              Æ
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-widest text-white/90">AETERNA.NEXUS</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs font-mono text-green-500 uppercase tracking-widest">Connected: {user.name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition">
              <Settings className="w-5 h-5" />
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold tracking-widest uppercase border border-white/10 hover:border-white/30 rounded-lg hover:bg-white/5 transition"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">{t.logout}</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-[1400px] mx-auto p-6 lg:p-12">
        {/* Top Stats - Enterprise Feel */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#0d0d12] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><BarChart3 className="w-24 h-24" /></div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t.stats.vol}</div>
            <div className="text-4xl font-black text-white">$14.2M</div>
            <div className="text-sm font-medium text-green-400 mt-2">+12.4% this week</div>
          </div>
          <div className="bg-[#0d0d12] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><Activity className="w-24 h-24" /></div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t.stats.health}</div>
            <div className="text-4xl font-black text-white">99.99%</div>
            <div className="text-sm font-medium text-[#8B5CF6] mt-2">Optimal routing</div>
          </div>
          <div className="bg-[#0d0d12] border border-white/5 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity"><HardDrive className="w-24 h-24" /></div>
            <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{t.stats.nodes}</div>
            <div className="text-4xl font-black text-white">{availableApps.length}</div>
            <div className="text-sm font-medium text-blue-400 mt-2">All instances active</div>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-sm font-black text-gray-400 tracking-[0.2em] uppercase mb-1">{t.yourApps}</h2>
            <div className="h-1 w-12 bg-purple-500 rounded-full" />
          </div>
          <div className="text-xs font-mono text-gray-500">SYS_TIME: {new Date().toLocaleTimeString()}</div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableApps.map((app, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={app.id}
              className="group bg-[#0d0d12] border border-white/5 hover:border-white/20 rounded-2xl p-1 transition-all hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.1)]"
            >
              <div className="bg-[#0a0a0f] rounded-xl p-6 h-full flex flex-col relative overflow-hidden">
                {/* Background glow based on app color */}
                <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br ${app.color} opacity-0 group-hover:opacity-10 rounded-full blur-3xl transition-opacity duration-500`} />

                <div className="flex items-start justify-between mb-6">
                  <div className="w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-2xl shadow-inner">
                    {app.icon}
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-[10px] font-bold tracking-widest text-green-400 uppercase">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    Online
                  </div>
                </div>

                <div className="flex-1 mb-8">
                  <h3 className="text-xl font-bold text-white/90 mb-2">{app.name}</h3>
                  <p className="text-sm text-gray-500 font-medium">{app.desc}</p>
                </div>

                <div className="mt-auto">
                  <div className="text-[10px] font-mono text-gray-600 mb-3 truncate">{app.url}</div>
                  <button
                    onClick={() => window.open(`https://${app.url}`, '_blank')}
                    className="w-full py-3 bg-white/5 hover:bg-white text-white hover:text-black rounded-lg text-xs font-bold tracking-widest uppercase transition-all flex items-center justify-center group/btn"
                  >
                    {t.launch}
                    <ArrowRight className="w-4 h-4 ml-2 opacity-50 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Access — System Pages */}
        <div className="mt-16 mb-4">
          <div className="mb-6">
            <h2 className="text-sm font-black text-gray-400 tracking-[0.2em] uppercase mb-1">SYSTEM ACCESS</h2>
            <div className="h-1 w-12 bg-blue-500 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate?.('healing')}
              className="group flex items-center gap-4 p-5 bg-[#0d0d12] border border-white/5 hover:border-purple-500/30 rounded-xl transition-all text-left hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.2)]"
            >
              <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/20 transition">
                <RefreshCw className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white/90">Self-Healing Engine</div>
                <div className="text-xs text-gray-500">Anomaly detection & auto-repair</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </button>
            <button
              onClick={() => onNavigate?.('logs')}
              className="group flex items-center gap-4 p-5 bg-[#0d0d12] border border-white/5 hover:border-green-500/30 rounded-xl transition-all text-left hover:shadow-[0_0_20px_-5px_rgba(34,197,94,0.2)]"
            >
              <div className="w-10 h-10 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/20 transition">
                <Terminal className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white/90">Execution Logs</div>
                <div className="text-xs text-gray-500">Live stream & audit trail</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-green-400 group-hover:translate-x-1 transition-all" />
            </button>
            <button
              onClick={() => onNavigate?.('billing')}
              className="group flex items-center gap-4 p-5 bg-[#0d0d12] border border-white/5 hover:border-yellow-500/30 rounded-xl transition-all text-left hover:shadow-[0_0_20px_-5px_rgba(234,179,8,0.2)]"
            >
              <div className="w-10 h-10 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex items-center justify-center group-hover:bg-yellow-500/20 transition">
                <Receipt className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <div className="text-sm font-bold text-white/90">Billing & Plans</div>
                <div className="text-xs text-gray-500">Subscriptions & invoices</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 ml-auto group-hover:text-yellow-400 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </div>

      </main>
    </motion.div>
  );
};

export default ClientPortal;
