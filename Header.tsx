import React from 'react';
import { ShieldCheck, Flame, Users, Store, PlusCircle, Car } from 'lucide-react';

interface HeaderProps {
  activeView: 'marketplace' | 'dashboard' | 'vendor';
  setActiveView: (view: 'marketplace' | 'dashboard' | 'vendor') => void;
  joinedCount: number;
  onOpenCreatePool: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  joinedCount,
  onOpenCreatePool,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#000000]/90 backdrop-blur-md border-b border-[#222222]">
      {/* Top micro banner */}
      <div className="bg-[#121212] border-b border-[#1E1E1E] text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[#A0A0A0]">
          <div className="flex items-center space-x-3">
            <span className="flex items-center text-[#FFCC00] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-ping mr-2 inline-block" />
              LIVE AUCTIONS ACTIVE
            </span>
            <span className="hidden md:inline">|</span>
            <span className="hidden md:inline text-white">
              ₹48.2 Cr+ Negotiated across 1,840+ vehicles
            </span>
          </div>
          <div className="flex items-center space-x-4 text-xs font-mono">
            <span className="flex items-center text-[#A0A0A0]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFCC00] mr-1" />
              100% Escrow Protected
            </span>
            <span className="text-[#FFCC00] font-bold">14 Active Pools in India</span>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveView('marketplace')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-[#FFCC00] to-[#E6B800] flex items-center justify-center text-black font-black text-2xl shadow-[0_0_20px_rgba(255,204,0,0.4)] group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-2xl tracking-tighter text-white">
                TORQ<span className="text-[#FFCC00]">POOL</span>
              </span>
              <span className="text-[10px] font-mono uppercase bg-[#1E1E1E] text-[#FFCC00] border border-[#FFCC00]/30 px-1.5 py-0.5 rounded font-bold">
                BETA
              </span>
            </div>
            <p className="text-[11px] text-[#A0A0A0] tracking-wide uppercase font-medium">
              Group Buying & Reverse Auction
            </p>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center space-x-1 bg-[#121212] p-1.5 rounded-xl border border-[#222222]">
          <button
            onClick={() => setActiveView('marketplace')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeView === 'marketplace'
                ? 'bg-[#1E1E1E] text-[#FFCC00] shadow-sm border border-[#333333]'
                : 'text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-[#FFCC00]" />
              <span>Pool Marketplace</span>
            </span>
          </button>

          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all relative ${
              activeView === 'dashboard'
                ? 'bg-[#1E1E1E] text-[#FFCC00] shadow-sm border border-[#333333]'
                : 'text-[#A0A0A0] hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-[#FFCC00]" />
              <span>My Pools</span>
              {joinedCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs font-mono font-bold bg-[#FFCC00] text-black rounded-full">
                  {joinedCount}
                </span>
              )}
            </span>
          </button>

          <button
            onClick={() => setActiveView('vendor')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeView === 'vendor'
                ? 'bg-[#FFCC00] text-black font-bold shadow-[0_0_15px_rgba(255,204,0,0.3)]'
                : 'text-[#A0A0A0] hover:text-[#FFCC00] hover:bg-[#1A1A1A]'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Store className="w-4 h-4" />
              <span>Dealer / Vendor Portal</span>
            </span>
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenCreatePool}
            className="hidden lg:flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-semibold border border-[#333333] bg-[#1E1E1E] text-white hover:border-[#FFCC00] hover:text-[#FFCC00] transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-[#FFCC00]" />
            <span>Create Pool</span>
          </button>

          {/* Quick Portal Switcher (Mobile/Tablet Friendly) */}
          <button
            onClick={() => setActiveView(activeView === 'vendor' ? 'marketplace' : 'vendor')}
            className={`flex md:hidden items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
              activeView === 'vendor'
                ? 'bg-[#FFCC00] text-black'
                : 'bg-[#1E1E1E] text-[#FFCC00] border border-[#FFCC00]/40'
            }`}
          >
            {activeView === 'vendor' ? (
              <>
                <Car className="w-3.5 h-3.5" />
                <span>Buyer View</span>
              </>
            ) : (
              <>
                <Store className="w-3.5 h-3.5" />
                <span>Dealer View</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav subbar */}
      <div className="flex md:hidden border-t border-[#1E1E1E] bg-[#121212] px-3 py-2 justify-around text-xs">
        <button
          onClick={() => setActiveView('marketplace')}
          className={`flex items-center space-x-1 py-1 px-2 rounded font-medium ${
            activeView === 'marketplace' ? 'text-[#FFCC00] font-bold' : 'text-[#A0A0A0]'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Pools</span>
        </button>
        <button
          onClick={() => setActiveView('dashboard')}
          className={`flex items-center space-x-1 py-1 px-2 rounded font-medium ${
            activeView === 'dashboard' ? 'text-[#FFCC00] font-bold' : 'text-[#A0A0A0]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>My Pools ({joinedCount})</span>
        </button>
        <button
          onClick={() => setActiveView('vendor')}
          className={`flex items-center space-x-1 py-1 px-2 rounded font-medium ${
            activeView === 'vendor' ? 'text-[#FFCC00] font-bold' : 'text-[#A0A0A0]'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Dealer Portal</span>
        </button>
      </div>
    </header>
  );
};
