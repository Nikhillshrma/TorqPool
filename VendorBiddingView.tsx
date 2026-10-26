import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Trophy, 
  ShieldCheck, 
  Flame, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Clock, 
  Send,
  Car,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { Pool, DealerBid } from '../types/index.ts';
import { calculateProgress, formatINR } from '../utils/poolLogic.ts';

interface VendorBiddingViewProps {
  pools: Pool[];
  onSubmitBid: (newBid: DealerBid) => void;
  onSwitchToBuyer: () => void;
}

export const VendorBiddingView: React.FC<VendorBiddingViewProps> = ({
  pools,
  onSubmitBid,
  onSwitchToBuyer,
}) => {
  // Pre-select pool that has high buyer count or first pool
  const [selectedPoolId, setSelectedPoolId] = useState<string>(pools[0]?.id || '');
  
  // Dealer credentials
  const [dealerName, setDealerName] = useState('Rajputana Hyundai (MI Road Flagship)');
  const [dealerType, setDealerType] = useState<'Authorized OEM Showroom' | 'Direct Underwriter' | 'Fleet Distributor'>('Authorized OEM Showroom');
  
  // Bidding form inputs
  const [cashDiscount, setCashDiscount] = useState<number>(180000);
  const [deliveryDays, setDeliveryDays] = useState<number>(5);
  const [addonCeramic, setAddonCeramic] = useState(true);
  const [addonWarranty, setAddonWarranty] = useState(true);
  const [addonAccessories, setAddonAccessories] = useState(true);
  const [addonZeroDep, setAddonZeroDep] = useState(false);
  const [dealerNotes, setDealerNotes] = useState('Priority chassis allocation with zero waiting queue and free home delivery in Jaipur.');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bidSuccessMessage, setBidSuccessMessage] = useState<string | null>(null);

  const selectedPool = pools.find((p) => p.id === selectedPoolId) || pools[0];

  const handleSubmitBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPool) return;

    setIsSubmitting(true);

    const addons: string[] = [];
    if (addonCeramic) addons.push('5-Year Ceramic Coating');
    if (addonWarranty) addons.push('Extended 7-Yr Warranty');
    if (addonAccessories) addons.push('OEM Accessories Kit (₹25k)');
    if (addonZeroDep) addons.push('Zero-Depreciation Waiver');

    const newBid: DealerBid = {
      id: `bid-custom-${Date.now()}`,
      poolId: selectedPool.id,
      dealerName,
      dealerType,
      city: selectedPool.city,
      rating: 4.9,
      cashDiscountPerUnit: Number(cashDiscount),
      freeAddons: addons,
      deliveryGuaranteeDays: Number(deliveryDays),
      submittedAt: 'Just now',
      isLeading: true,
      notes: dealerNotes,
    };

    setTimeout(() => {
      onSubmitBid(newBid);
      setIsSubmitting(false);
      setBidSuccessMessage(`Bid of ${formatINR(cashDiscount)} successfully submitted! You are now the leading dealer for ${selectedPool.title}.`);
      setTimeout(() => setBidSuccessMessage(null), 5000);
    }, 600);
  };

  return (
    <div className="py-12 bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Dealer Hub Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#222222]">
          <div>
            <div className="flex items-center space-x-2 text-[#FFCC00] text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <Building2 className="w-4 h-4" />
              <span>AUTHORIZED DEALER & BROKER PORTAL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              DEALERSHIP <span className="text-[#FFCC00]">BIDDING ENGINE</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#A0A0A0] mt-1">
              Bid in bulk on guaranteed consumer groups with committed ₹5,000 escrow tokens. Win 10-25 vehicle allocations in a single transaction.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <button
              onClick={onSwitchToBuyer}
              className="px-4 py-2 bg-[#1E1E1E] hover:bg-[#2A2A2A] text-white border border-[#333333] hover:border-[#FFCC00] rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5"
            >
              <Car className="w-3.5 h-3.5 text-[#FFCC00]" />
              <span>Back to Buyer Marketplace</span>
            </button>
          </div>
        </div>

        {/* Dealer Profile & Escrow Summary Banner */}
        <div className="bg-[#121212] border border-[#262626] rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] font-mono text-[#8E8E8E] uppercase block">Authenticated Showroom</span>
            <span className="font-bold text-white text-sm block mt-0.5">{dealerName}</span>
            <span className="text-[11px] text-[#FFCC00] font-mono">ID: DLR-JPR-8812 • Verified OEM</span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#8E8E8E] uppercase block">Ready Pools</span>
            <span className="font-black font-mono text-white text-xl block mt-0.5">
              {pools.filter((p) => p.currentBuyers >= p.targetBuyers).length} Pools Unlocked
            </span>
            <span className="text-[11px] text-[#A0A0A0]">Awaiting bulk dealer dispatch</span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#8E8E8E] uppercase block">Total Verified Buyers</span>
            <span className="font-black font-mono text-[#FFCC00] text-xl block mt-0.5">
              {pools.reduce((acc, curr) => acc + curr.currentBuyers, 0)} Active Shoppers
            </span>
            <span className="text-[11px] text-[#A0A0A0]">With ₹5k refundable tokens</span>
          </div>

          <div>
            <span className="text-[10px] font-mono text-[#8E8E8E] uppercase block">Direct Escrow Pool</span>
            <span className="font-black font-mono text-white text-xl block mt-0.5">
              {formatINR(pools.reduce((acc, curr) => acc + curr.currentBuyers * 5000, 0))}
            </span>
            <span className="text-[11px] text-[#FFCC00]">Held in RBI-regulated trustee escrow</span>
          </div>
        </div>

        {/* Success toast banner */}
        {bidSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-[#1E1E1E] border border-[#FFCC00] rounded-xl text-[#FFCC00] text-xs font-mono flex items-center space-x-2"
          >
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{bidSuccessMessage}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Pool Selector */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A0A0A0]">
                Select Syndicate to Bid On:
              </h3>
              <span className="text-[11px] font-mono text-[#FFCC00]">
                {pools.length} Pools Available
              </span>
            </div>

            <div className="space-y-3">
              {pools.map((pool) => {
                const isSelected = pool.id === selectedPoolId;
                const progress = calculateProgress(pool.currentBuyers, pool.targetBuyers);
                const isReady = pool.currentBuyers >= pool.targetBuyers;

                return (
                  <div
                    key={pool.id}
                    onClick={() => {
                      setSelectedPoolId(pool.id);
                      // suggest slightly higher discount than leading bid
                      const leadingDiscount = pool.bids[0]?.cashDiscountPerUnit || 150000;
                      setCashDiscount(leadingDiscount + 10000);
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1E1E1E] border-[#FFCC00] shadow-[0_0_20px_rgba(255,204,0,0.2)]'
                        : 'bg-[#141414] border-[#262626] hover:border-[#444444]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-black text-[#FFCC00] border border-[#FFCC00]/30">
                            {pool.city}
                          </span>
                          {isReady ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-[#FFCC00] text-black">
                              10/10 READY FOR BULK
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#A0A0A0] bg-[#222222]">
                              {pool.currentBuyers}/{pool.targetBuyers} Buyers
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white">{pool.title}</h4>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-[#8E8E8E] block">MSRP</span>
                        <span className="text-xs font-mono font-bold text-white">{formatINR(pool.retailPrice)}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs font-mono">
                      <span className="text-[#888888]">
                        Committed Escrow: <strong className="text-[#FFCC00]">{formatINR(pool.currentBuyers * 5000)}</strong>
                      </span>
                      <span className="text-[#A0A0A0]">
                        {pool.bids.length} Bids Logged
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Bid Submission Console */}
          <div className="lg:col-span-7">
            {selectedPool && (
              <div className="bg-[#141414] rounded-2xl border border-[#2E2E2E] p-6 space-y-6">
                <div className="border-b border-[#242424] pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#FFCC00] uppercase font-bold">
                        Bidding Console for {selectedPool.city} Syndicate
                      </span>
                      <h3 className="text-xl font-black text-white mt-0.5">
                        {selectedPool.title}
                      </h3>
                      <p className="text-xs text-[#A0A0A0]">
                        {selectedPool.currentBuyers} Verified Buyers with {formatINR(selectedPool.currentBuyers * 5000)} committed in escrow.
                      </p>
                    </div>

                    <div className="text-right bg-black p-3 rounded-xl border border-[#2E2E2E]">
                      <span className="text-[10px] font-mono text-[#8E8E8E] block">Top Current Bid</span>
                      <span className="text-base font-black font-mono text-[#FFCC00]">
                        -{formatINR(selectedPool.bids[0]?.cashDiscountPerUnit || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form to submit bid */}
                <form onSubmit={handleSubmitBid} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1 font-bold">
                        Dealership Name:
                      </label>
                      <input
                        type="text"
                        value={dealerName}
                        onChange={(e) => setDealerName(e.target.value)}
                        required
                        className="w-full bg-[#1A1A1A] text-white px-3 py-2.5 rounded-xl border border-[#333333] focus:border-[#FFCC00] text-xs outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1 font-bold">
                        Organization Type:
                      </label>
                      <select
                        value={dealerType}
                        onChange={(e) => setDealerType(e.target.value as any)}
                        aria-label="Organization Type"
                        className="w-full bg-[#1A1A1A] text-white px-3 py-2.5 rounded-xl border border-[#333333] focus:border-[#FFCC00] text-xs outline-none"
                      >
                        <option value="Authorized OEM Showroom">Authorized OEM Showroom</option>
                        <option value="Direct Underwriter">Direct Underwriter</option>
                        <option value="Fleet Distributor">Fleet Distributor</option>
                      </select>
                    </div>
                  </div>

                  {/* Cash Discount Input Field (Explicitly required by prompt) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-mono uppercase tracking-wider text-[#FFCC00] font-bold">
                        Bulk Cash Discount Offered (Per Unit in ₹):
                      </label>
                      <span className="text-[11px] font-mono text-[#A0A0A0]">
                        Standard MSRP: {formatINR(selectedPool.retailPrice)}
                      </span>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-mono text-[#A0A0A0]">
                        ₹
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={cashDiscount}
                        onChange={(e) => setCashDiscount(Number(e.target.value))}
                        required
                        className="w-full bg-black text-white pl-8 pr-4 py-3 rounded-xl border border-[#333333] focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] text-lg font-black font-mono outline-none"
                      />
                    </div>
                    <p className="mt-1 text-[11px] text-[#8E8E8E]">
                      This discount will be applied directly to each buyer's invoice upon group allotment.
                    </p>
                  </div>

                  {/* Addon Checkboxes */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2 font-bold">
                      Include Free Value-Add Perks (Sweeten Your Bid):
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <label className="flex items-center space-x-2 bg-[#1A1A1A] p-3 rounded-xl border border-[#2E2E2E] cursor-pointer hover:border-[#444444]">
                        <input
                          type="checkbox"
                          checked={addonCeramic}
                          onChange={(e) => setAddonCeramic(e.target.checked)}
                          className="w-4 h-4 accent-[#FFCC00]"
                        />
                        <span className="text-white">5-Year Ceramic Body Shield</span>
                      </label>

                      <label className="flex items-center space-x-2 bg-[#1A1A1A] p-3 rounded-xl border border-[#2E2E2E] cursor-pointer hover:border-[#444444]">
                        <input
                          type="checkbox"
                          checked={addonWarranty}
                          onChange={(e) => setAddonWarranty(e.target.checked)}
                          className="w-4 h-4 accent-[#FFCC00]"
                        />
                        <span className="text-white">Extended 7-Yr OEM Warranty</span>
                      </label>

                      <label className="flex items-center space-x-2 bg-[#1A1A1A] p-3 rounded-xl border border-[#2E2E2E] cursor-pointer hover:border-[#444444]">
                        <input
                          type="checkbox"
                          checked={addonAccessories}
                          onChange={(e) => setAddonAccessories(e.target.checked)}
                          className="w-4 h-4 accent-[#FFCC00]"
                        />
                        <span className="text-white">Free Accessories Kit (₹25k)</span>
                      </label>

                      <label className="flex items-center space-x-2 bg-[#1A1A1A] p-3 rounded-xl border border-[#2E2E2E] cursor-pointer hover:border-[#444444]">
                        <input
                          type="checkbox"
                          checked={addonZeroDep}
                          onChange={(e) => setAddonZeroDep(e.target.checked)}
                          className="w-4 h-4 accent-[#FFCC00]"
                        />
                        <span className="text-white">Zero-Dep Insurance Waiver</span>
                      </label>
                    </div>
                  </div>

                  {/* Dispatch Window */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1 font-bold">
                        Guaranteed Delivery (Days):
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="30"
                        value={deliveryDays}
                        onChange={(e) => setDeliveryDays(Number(e.target.value))}
                        className="w-full bg-[#1A1A1A] text-white px-3 py-2.5 rounded-xl border border-[#333333] focus:border-[#FFCC00] text-xs font-mono outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-1 font-bold">
                        Allocation Note for Buyers:
                      </label>
                      <input
                        type="text"
                        value={dealerNotes}
                        onChange={(e) => setDealerNotes(e.target.value)}
                        className="w-full bg-[#1A1A1A] text-white px-3 py-2.5 rounded-xl border border-[#333333] focus:border-[#FFCC00] text-xs outline-none"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#FFCC00] hover:bg-[#E6B800] text-black font-black text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(255,204,0,0.3)] flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>Broadcasting Bid to Buyer Radar...</span>
                      </div>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Bulk Discount Bid for {selectedPool.currentBuyers} Buyers</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
