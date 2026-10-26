import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap, TrendingDown, CheckCircle2, ChevronRight, Award } from 'lucide-react';
import { TickerDeal } from '../types/index.ts';

interface HeroSectionProps {
  deals: TickerDeal[];
  onExplorePools: () => void;
  onOpenVendorPortal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  deals,
  onExplorePools,
  onOpenVendorPortal,
}) => {
  return (
    <section className="relative overflow-hidden bg-black pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-[#222222]">
      {/* Background cyber grid & glow effects - strictly warm/yellow/charcoal, NO purple/indigo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFCC00]/10 via-black to-black pointer-events-none" />
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(to right, #333333 1px, transparent 1px), linear-gradient(to bottom, #333333 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Auto-scrolling ticker bar */}
      <div className="mb-10 w-full overflow-hidden bg-[#121212] border-y border-[#262626] py-3 relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#121212] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#121212] to-transparent z-10 pointer-events-none" />
        
        <div className="flex items-center">
          <div className="px-4 py-1 text-[11px] font-black uppercase tracking-wider bg-[#FFCC00] text-black rounded mr-3 shrink-0 flex items-center font-mono ml-4">
            <Zap className="w-3.5 h-3.5 mr-1 fill-black" />
            RECENT DEALS CLOSED
          </div>
          
          <div className="animate-marquee flex items-center space-x-8 text-sm">
            {[...deals, ...deals].map((deal, idx) => (
              <div 
                key={`${deal.id}-${idx}`}
                className="flex items-center space-x-3 bg-[#1A1A1A] border border-[#2E2E2E] px-4 py-1.5 rounded-full whitespace-nowrap hover:border-[#FFCC00] transition-colors cursor-default"
              >
                <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
                <span className="font-bold text-white">{deal.vehicle}</span>
                <span className="text-[#A0A0A0]">in {deal.location}</span>
                <span className="text-[#FFCC00] font-bold font-mono bg-black/60 px-2 py-0.5 rounded border border-[#FFCC00]/30">
                  {deal.discountSaved}
                </span>
                <span className="text-xs text-[#8E8E8E] hidden sm:inline">({deal.totalSaved} pool)</span>
                <span className="text-[10px] text-black bg-[#FFCC00] font-black px-1.5 py-0.5 rounded uppercase">
                  {deal.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Top trust badge */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-[#121212] border border-[#333333] hover:border-[#FFCC00]/60 px-4 py-1.5 rounded-full mb-6 cursor-pointer"
            onClick={onExplorePools}
          >
            <span className="flex h-2 w-2 rounded-full bg-[#FFCC00]" />
            <span className="text-xs font-bold text-white tracking-wide uppercase">
              Reverse Auction Dealership Engine
            </span>
            <span className="text-xs text-[#A0A0A0]">•</span>
            <span className="text-xs text-[#FFCC00] font-semibold flex items-center">
              Active Pools Open Now <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </motion.div>

          {/* Aggressive bold headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white uppercase leading-[1.05]"
          >
            BUY TOGETHER,{' '}
            <span className="text-[#FFCC00] underline decoration-[#FFCC00]/40 decoration-wavy decoration-2">
              SAVE MASSIVELY.
            </span>
          </motion.h1>

          {/* Subheadline with high-conviction value proposition */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-[#A0A0A0] font-normal max-w-2xl mx-auto leading-relaxed"
          >
            Why negotiate alone against car dealerships and insurers? Aggregate demand with 10+ buyers in your city, lock your spot with a refundable <span className="text-white font-semibold">₹5,000 escrow token</span>, and let authorized dealers bid down their prices in a real-time bulk auction.
          </motion.p>

          {/* Hero CTAs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onExplorePools}
              className="w-full sm:w-auto px-8 py-4 bg-[#FFCC00] hover:bg-[#E6B800] text-black font-extrabold text-base rounded-xl transition-all shadow-[0_0_30px_rgba(255,204,0,0.4)] hover:shadow-[0_0_40px_rgba(255,204,0,0.6)] flex items-center justify-center space-x-2 group active:scale-95"
            >
              <span>Explore Active Pools</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenVendorPortal}
              className="w-full sm:w-auto px-7 py-4 bg-[#1E1E1E] hover:bg-[#252525] text-white hover:text-[#FFCC00] border border-[#333333] hover:border-[#FFCC00]/70 font-bold text-base rounded-xl transition-all flex items-center justify-center space-x-2 active:scale-95"
            >
              <Award className="w-5 h-5 text-[#FFCC00]" />
              <span>Dealer Bidding Portal</span>
            </button>
          </motion.div>

          {/* Core Trust & Metrics Row */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 text-left"
          >
            <div className="bg-[#121212] border border-[#222222] p-4 rounded-xl hover:border-[#FFCC00]/50 transition-colors">
              <div className="flex items-center text-[#FFCC00] mb-1">
                <TrendingDown className="w-4 h-4 mr-1.5" />
                <span className="text-xl font-black font-mono">₹1.45 Lakh</span>
              </div>
              <p className="text-xs text-[#A0A0A0]">Average savings negotiated per vehicle</p>
            </div>

            <div className="bg-[#121212] border border-[#222222] p-4 rounded-xl hover:border-[#FFCC00]/50 transition-colors">
              <div className="flex items-center text-[#FFCC00] mb-1">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                <span className="text-xl font-black font-mono">₹5,000</span>
              </div>
              <p className="text-xs text-[#A0A0A0]">100% Refundable Escrow Deposit</p>
            </div>

            <div className="bg-[#121212] border border-[#222222] p-4 rounded-xl hover:border-[#FFCC00]/50 transition-colors">
              <div className="flex items-center text-[#FFCC00] mb-1">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                <span className="text-xl font-black font-mono">+15% Cut</span>
              </div>
              <p className="text-xs text-[#A0A0A0]">Motor Insurance Group Bundling</p>
            </div>

            <div className="bg-[#121212] border border-[#222222] p-4 rounded-xl hover:border-[#FFCC00]/50 transition-colors">
              <div className="flex items-center text-[#FFCC00] mb-1">
                <Zap className="w-4 h-4 mr-1.5" />
                <span className="text-xl font-black font-mono">24h War</span>
              </div>
              <p className="text-xs text-[#A0A0A0]">Fast reverse dealership auction</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
