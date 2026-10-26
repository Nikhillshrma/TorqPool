import React from 'react';
import { motion } from 'motion/react';
import { Users2, Lock, Flame, ShieldAlert, CheckCircle, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onJoinClick: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onJoinClick }) => {
  const steps = [
    {
      number: '01',
      title: 'Join a Pool',
      subtitle: 'Team up with buyers in your city',
      description:
        'Select your desired car, bike, or commercial vehicle lot in your city. Each pool requires a critical mass (e.g. 10 buyers) to command tier-1 fleet pricing that retail buyers can never get alone.',
      icon: Users2,
      tag: 'Demand Aggregation',
      stat: '5-25 Buyers per syndicate',
    },
    {
      number: '02',
      title: 'Lock in with a Token',
      subtitle: 'Refundable ₹5,000 skin-in-the-game',
      description:
        'Pay a refundable ₹5,000 token into an RBI-compliant escrow account. This proves to dealerships you are a verified, ready-to-buy customer—not a random internet clicker. If final bids disappoint, get 100% back.',
      icon: Lock,
      tag: 'Escrow Protected',
      stat: 'Zero Risk • Auto-Refundable',
    },
    {
      number: '03',
      title: 'Dealers Bid for the Group',
      subtitle: 'High-stakes reverse auction',
      description:
        'Once the pool hits 100%, authorized OEM dealerships and direct insurance underwriters enter a live 24-hour bidding war. The dealer offering the highest cash discount + free add-ons wins the order.',
      icon: Flame,
      tag: 'Reverse Auction',
      stat: 'Dealers battle down prices',
    },
  ];

  return (
    <section className="py-20 bg-[#121212] border-b border-[#222222] relative overflow-hidden">
      {/* Background accents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center space-x-2 text-[#FFCC00] text-xs font-mono font-bold tracking-widest uppercase mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFCC00]" />
              <span>THE POWER OF BULK DEMAND</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              HOW <span className="text-[#FFCC00]">TORQPOOL</span> WORKS
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#A0A0A0] max-w-xl">
              Dealers offer 15-25% discounts to fleet operators and corporate buyers every day. We pool retail buyers to unlock those exact same fleet rates.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-3 text-xs text-[#A0A0A0]">
            <span className="flex items-center text-white font-medium">
              <CheckCircle className="w-4 h-4 text-[#FFCC00] mr-1.5" />
              RBI Escrow Account
            </span>
            <span>•</span>
            <span className="flex items-center text-white font-medium">
              <CheckCircle className="w-4 h-4 text-[#FFCC00] mr-1.5" />
              Verified KYC Only
            </span>
          </div>
        </div>

        {/* 3 Step Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="bg-[#1E1E1E] rounded-2xl p-6 border border-[#2E2E2E] hover:border-[#FFCC00] hover:shadow-[0_0_25px_rgba(255,204,0,0.18)] transition-all duration-300 relative group flex flex-col justify-between"
              >
                {/* Step number badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-black border border-[#333333] group-hover:border-[#FFCC00] flex items-center justify-center text-[#FFCC00] transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-mono text-3xl font-black text-[#333333] group-hover:text-[#FFCC00] transition-colors">
                    {step.number}
                  </span>
                </div>

                <div>
                  <div className="inline-block px-2.5 py-1 rounded bg-black/60 border border-[#333333] text-[10px] font-mono font-bold uppercase text-[#FFCC00] mb-3">
                    {step.tag}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-[#FFCC00] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#FFCC00] font-semibold mb-3">
                    {step.subtitle}
                  </p>
                  <p className="text-xs text-[#A0A0A0] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#2A2A2A] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8E8E8E]">{step.stat}</span>
                  <span className="text-[#FFCC00] group-hover:translate-x-1 transition-transform inline-flex items-center">
                    Step {step.number} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Why Deposit Callout Banner */}
        <div className="mt-10 bg-black border border-[#333333] rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-left">
            <div className="p-2.5 bg-[#FFCC00]/10 border border-[#FFCC00]/30 rounded-lg text-[#FFCC00] shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Why is the ₹5,000 Refundable Token required?
              </h4>
              <p className="text-xs text-[#A0A0A0]">
                Without financial commitment, dealership GMs ignore consumer petitions. When 10 buyers put up ₹50,000 in escrow, dealers clear their showroom floor and wage price cuts.
              </p>
            </div>
          </div>
          <button
            onClick={onJoinClick}
            className="shrink-0 px-4 py-2 bg-[#FFCC00] hover:bg-[#E6B800] text-black text-xs font-extrabold rounded-lg transition-colors whitespace-nowrap"
          >
            Join a Verified Pool
          </button>
        </div>
      </div>
    </section>
  );
};
