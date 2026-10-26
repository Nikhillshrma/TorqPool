import React from 'react';
import { ShieldCheck, Lock, Award, HeartHandshake } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-[#222222] py-12 text-xs text-[#A0A0A0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-[#1E1E1E]">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-[#FFCC00] text-black font-black flex items-center justify-center text-base">
                ⚡
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                TORQ<span className="text-[#FFCC00]">POOL</span>
              </span>
            </div>
            <p className="text-xs text-[#8E8E8E] leading-relaxed">
              India's premier reverse-auction group-buying aggregator for vehicles and bulk insurance syndicates. Unlocking enterprise fleet rates for individual and SME buyers.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase text-white mb-3">
              Supported Syndicates
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="hover:text-white transition-colors cursor-pointer">SUV & Passenger Car Pools</li>
              <li className="hover:text-white transition-colors cursor-pointer">Electric Vehicle (EV) Hubs</li>
              <li className="hover:text-white transition-colors cursor-pointer">SME Commercial Fleet Logistics</li>
              <li className="hover:text-white transition-colors cursor-pointer">Group Motor Insurance Bundles</li>
              <li className="hover:text-white transition-colors cursor-pointer">Adventure Motorcycles</li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase text-white mb-3">
              Active Metro Hubs
            </h4>
            <ul className="space-y-2 text-xs">
              <li>Jaipur Metro Syndicate Hub</li>
              <li>Delhi NCR Commercial Fleet Corridor</li>
              <li>Bengaluru Tech Clean Energy Corridor</li>
              <li>Mumbai Western Express Syndicate</li>
              <li>Pune Chakan Industrial Transport</li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs font-bold uppercase text-white mb-3">
              Trust & Escrow Guarantee
            </h4>
            <div className="space-y-2.5">
              <div className="flex items-center space-x-2 text-white">
                <ShieldCheck className="w-4 h-4 text-[#FFCC00]" />
                <span>100% Refundable Escrow Tokens</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Lock className="w-4 h-4 text-[#FFCC00]" />
                <span>RBI-Regulated Trustee Escrow</span>
              </div>
              <div className="flex items-center space-x-2 text-white">
                <Award className="w-4 h-4 text-[#FFCC00]" />
                <span>Verified OEM Dealerships Only</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#666666]">
          <p>© 2026 TORQPOOL Technologies India Pvt. Ltd. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono">
            Designed for high conversion • Built with React, Tailwind CSS & Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
};
