import React from 'react';
import { motion } from 'motion/react';
import { 
  X, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  Flame, 
  CheckCircle2, 
  Trophy, 
  Building2, 
  Sparkles,
  ArrowRight,
  Plus
} from 'lucide-react';
import { Pool } from '../types/index.ts';
import { calculateProgress, formatINR } from '../utils/poolLogic.ts';

interface PoolDetailModalProps {
  pool: Pool | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenJoin: (pool: Pool) => void;
  onSimulateJoinOne: (poolId: string) => void;
  isJoined: boolean;
}

export const PoolDetailModal: React.FC<PoolDetailModalProps> = ({
  pool,
  isOpen,
  onClose,
  onOpenJoin,
  onSimulateJoinOne,
  isJoined,
}) => {
  if (!isOpen || !pool) return null;

  const progress = calculateProgress(pool.currentBuyers, pool.targetBuyers);
  const isReady = pool.currentBuyers >= pool.targetBuyers;
  const spotsLeft = Math.max(pool.targetBuyers - pool.currentBuyers, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-3xl bg-[#121212] border border-[#2E2E2E] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden my-8 max-h-[90vh] flex flex-col"
      >
        {/* Modal Top Bar */}
        <div className="relative h-64 w-full bg-black shrink-0">
          <img
            src={pool.imageUrl}
            alt={pool.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/70" />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/70 hover:bg-black text-[#A0A0A0] hover:text-white flex items-center justify-center border border-[#333333] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Badges on hero */}
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded bg-[#FFCC00] text-black text-xs font-mono font-black uppercase">
                {pool.city} Syndicate
              </span>
              <span className="px-2.5 py-1 rounded bg-black/80 text-white border border-[#333333] text-xs font-mono">
                {pool.category.toUpperCase()}
              </span>
              <span className="px-2.5 py-1 rounded bg-black/80 text-[#FFCC00] border border-[#FFCC00]/40 text-xs font-mono">
                {pool.expiryHoursLeft}h Remaining
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              {pool.title}
            </h2>
            <p className="text-xs text-[#A0A0A0] mt-0.5">{pool.subtitle}</p>
          </div>
        </div>

        {/* Scrollable details body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Dynamic Progress Bar Box */}
          <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-[#2A2A2A]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-[#FFCC00]" />
                <span className="font-extrabold text-white text-base">
                  {pool.currentBuyers} of {pool.targetBuyers} Buyers Committed
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-[#FFCC00] bg-black px-2.5 py-1 rounded border border-[#FFCC00]/30">
                {isReady ? '100% QUORUM MET' : `${spotsLeft} MORE NEEDED`}
              </span>
            </div>

            <div className="w-full bg-black h-3 rounded-full overflow-hidden border border-[#2E2E2E]">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isReady
                    ? 'bg-gradient-to-r from-[#FFCC00] to-[#FFE066] shadow-[0_0_15px_#FFCC00]'
                    : 'bg-gradient-to-r from-[#B38F00] to-[#FFCC00]'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-[#A0A0A0]">
              <span>Escrow locked: <strong className="text-white font-mono">{formatINR(pool.currentBuyers * 5000)}</strong></span>
              {/* Quick simulation helper to let user test 10/10 threshold easily */}
              {!isReady && (
                <button
                  onClick={() => onSimulateJoinOne(pool.id)}
                  className="text-[11px] font-mono text-[#FFCC00] hover:underline flex items-center"
                >
                  <Plus className="w-3 h-3 mr-0.5" />
                  Simulate buyer join (+1)
                </button>
              )}
            </div>
          </div>

          {/* Pricing & Bulk Advantage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A]">
              <span className="text-[10px] font-mono text-[#8E8E8E] block uppercase">Standard MSRP</span>
              <span className="text-lg font-bold font-mono text-white line-through">
                {formatINR(pool.retailPrice)}
              </span>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A]">
              <span className="text-[10px] font-mono text-[#8E8E8E] block uppercase">Target Group Price</span>
              <span className="text-lg font-black font-mono text-[#FFCC00]">
                {formatINR(pool.estimatedBulkPrice)}
              </span>
            </div>
            <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2A2A2A]">
              <span className="text-[10px] font-mono text-[#8E8E8E] block uppercase">Est. Bulk Savings</span>
              <span className="text-lg font-black font-mono text-white">
                {pool.bulkDiscountPercentage}% OFF
              </span>
            </div>
          </div>

          {/* Specifications Grid */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A0A0A0] mb-3">
              Vehicle & Syndicate Specifications:
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              {Object.entries(pool.specs).map(([key, val]) => (
                <div key={key} className="bg-[#161616] p-3 rounded-xl border border-[#262626]">
                  <span className="text-[#8E8E8E] capitalize block text-[10px] font-mono">{key}</span>
                  <span className="font-semibold text-white mt-0.5 block truncate">{val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Live Dealer Bids Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A0A0A0] flex items-center">
                <Flame className="w-3.5 h-3.5 text-[#FFCC00] mr-1.5" />
                Live Dealership Reverse Bids ({pool.bids.length}):
              </h4>
              <span className="text-[11px] text-[#FFCC00] font-mono">
                {isReady ? 'Active Auction' : 'Preliminary Showroom Quotes'}
              </span>
            </div>

            <div className="space-y-3">
              {pool.bids.length === 0 ? (
                <div className="p-4 bg-[#161616] rounded-xl border border-[#262626] text-center text-xs text-[#8E8E8E]">
                  No dealer bids submitted yet. Be the first to join and unlock dealer bidding!
                </div>
              ) : (
                pool.bids.map((bid) => (
                  <div
                    key={bid.id}
                    className={`p-4 rounded-xl border transition-all ${
                      bid.isLeading
                        ? 'bg-[#1E1E1E] border-[#FFCC00] shadow-[0_0_15px_rgba(255,204,0,0.15)]'
                        : 'bg-[#161616] border-[#2A2A2A]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2.5">
                        <Building2 className="w-4 h-4 text-[#FFCC00] shrink-0 mt-0.5" />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-white text-sm">{bid.dealerName}</span>
                            {bid.isLeading && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFCC00] text-black flex items-center">
                                <Trophy className="w-3 h-3 mr-1" />
                                LEADING BID
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-[#A0A0A0]">{bid.dealerType} • ★ {bid.rating} Rating</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-[#A0A0A0] block font-mono">Cash Discount</span>
                        <span className="text-base font-black font-mono text-[#FFCC00]">
                          -{formatINR(bid.cashDiscountPerUnit)}
                        </span>
                      </div>
                    </div>

                    {/* Free Addons */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {bid.freeAddons.map((addon) => (
                        <span key={addon} className="px-2 py-0.5 rounded bg-black/60 border border-[#333333] text-[10px] text-white">
                          ✓ {addon}
                        </span>
                      ))}
                    </div>

                    <div className="mt-2 pt-2 border-t border-[#262626] flex items-center justify-between text-[11px] font-mono text-[#8E8E8E]">
                      <span>Guaranteed dispatch: <strong className="text-white">{bid.deliveryGuaranteeDays} days</strong></span>
                      <span>Bid placed {bid.submittedAt}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Bottom Sticky CTA */}
        <div className="p-4 bg-[#161616] border-t border-[#2A2A2A] flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#A0A0A0] block">Refundable Escrow Token</span>
            <span className="text-lg font-black font-mono text-[#FFCC00]">₹5,000</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#333333] text-xs font-bold text-white hover:bg-[#222222]"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenJoin(pool);
              }}
              className="px-6 py-2.5 bg-[#FFCC00] hover:bg-[#E6B800] text-black font-black text-xs rounded-xl shadow-[0_0_20px_rgba(255,204,0,0.3)] flex items-center space-x-1.5"
            >
              <span>{isJoined ? 'Manage Commitment' : 'Join Pool (₹5,000)'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
