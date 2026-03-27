import React from 'react';
import { motion } from 'framer-motion';

const partners = [
  {
    name: 'OpenAI',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    proposal: 'Strategic alliance for AGI integration within OmniCore. Aeterna provides vast real-time data ingestion streams to train domain-specific models, while OpenAI provides exclusive API access and early compute allocation for our Swarm Intelligence.'
  },
  {
    name: 'Stripe',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
    proposal: 'Exclusive payment gateway for Aeterna\'s high-ticket B2B transactions. Proposal includes custom SLA for processing multi-million dollar SaaS subscriptions with minimal fraud risk via Aeterna\'s predictive risk models.'
  },
  {
    name: 'Binance',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/12/Binance_logo.svg',
    proposal: 'Institutional liquidity provision and direct API access for the WealthBridge Arbitrage Engine. Aeterna brings high-volume, automated order flow, while Binance provides zero-latency execution environments and reduced maker/taker fees.'
  },
  {
    name: 'AWS',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
    proposal: 'Enterprise infrastructure partnership. Aeterna utilizes AWS Outposts and specialized EC2 instances for localized, low-latency node processing, offering AWS case studies on extreme-scale autonomous cloud orchestration.'
  },
  {
    name: 'Vercel',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Vercel_logo_black.svg',
    proposal: 'Edge computing partnership for Aeterna\'s Global Gateway (aeterna.website). Seamless frontend delivery at edge nodes worldwide, with Aeterna acting as a premier enterprise use-case for Vercel\'s advanced edge middleware.'
  }
];

export const Partnerships: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-[#05050A] text-white p-8 md:p-16 font-mono selection:bg-[#00E5FF]/30">
      <div className="max-w-7xl mx-auto">
        <header className="mb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold mb-4 tracking-tighter"
          >
            GLOBAL <span className="text-[#00E5FF]">ALLIANCES</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Strategic collaboration proposals for industry leaders to integrate with the Aeterna Engine. We do not seek vendors; we seek symbiotic expansion.
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-black/40 border border-[#00E5FF]/20 rounded-xl p-6 backdrop-blur-md hover:border-[#00E5FF]/60 transition-all group"
            >
              <div className="h-16 mb-6 flex items-center justify-start filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                <img src={partner.logo} alt={partner.name} className="max-h-12 max-w-[150px] object-contain" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white/90 group-hover:text-[#00E5FF] transition-colors">
                {partner.name}
              </h3>
              <div className="w-8 h-[1px] bg-[#00E5FF]/50 mb-4 group-hover:w-full transition-all duration-500"></div>
              <p className="text-sm text-gray-400 leading-relaxed">
                {partner.proposal}
              </p>

              <button className="mt-6 text-xs text-[#00E5FF] uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors">
                <span>View Full Proposal</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Partnerships;
