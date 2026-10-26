import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ShieldCheck, 
  Flame, 
  Radio, 
  Trophy, 
  Sparkles, 
  Download, 
  CheckCircle, 
  Building2, 
  Car, 
  Clock, 
  ArrowUpRight,
  RefreshCw,
  QrCode,
  FileCheck2
} from 'lucide-react';
import { Pool, JoinedPoolRecord } from '../types/index.ts';
import { calculateProgress, formatINR } from '../utils/poolLogic.ts';

interface UserDashboardProps {
  joinedRecords: JoinedPoolRecord[];
  pools: Pool[];
  onExploreMore: () => void;
  onSimulateFillPool: (poolId: string) => void;
  onAcceptBid: (poolId: string, bidId: string) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  joinedRecords,
  pools,
  onExploreMore,
  onSimulateFillPool,
  onAcceptBid,
}) => {
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(
    joinedRecords[0]?.poolId || pools[0]?.id || null
  );
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [acceptedPool, setAcceptedPool] = useState<Pool | null>(null);

  // Map joined records to pool objects
  const joinedPoolsData = joinedRecords.map((record) => {
    const pool = pools.find((p) => p.id === record.poolId);
    return { record, pool };
  }).filter((item): item is { record: JoinedPoolRecord; pool: Pool } => item.pool !== undefined);

  // Current active pool for viewing radar
  const currentPoolData = 
    joinedPoolsData.find((item) => item.pool.id === selectedPoolId) 
    || joinedPoolsData.find((item) => item.pool.currentBuyers >= item.pool.targetBuyers)
    || joinedPoolsData[0] 
    || null;

  const currentPool = currentPoolData?.pool || null;
  const currentRecord = currentPoolData?.record || null;

  const isQuorumMet = currentPool ? currentPool.currentBuyers >= currentPool.targetBuyers : false;

  const handleOpenCertificate = (pool: Pool) => {
    setAcceptedPool(pool);
    setShowCertificateModal(true);
  };

  return (
    <div className="py-12 bg-black min-h-screen text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#222222]">
          <div>
            <div className="flex items-center space-x-2 text-[#FFCC00] text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <Users className="w-4 h-4" />
              <span>BUYER CONTROL PANEL</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              MY <span className="text-[#FFCC00]">JOINED POOLS</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#A0A0A0] mt-1">
              Track syndicate progress, monitor live reverse auction dealer bids, and download your bulk allocation vouchers.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <div className="bg-[#121212] border border-[#2E2E2E] px-4 py-2 rounded-xl text-xs font-mono">
              <span className="text-[#A0A0A0] block text-[10px]">TOTAL ESCROW SECURED</span>
              <span className="text-[#FFCC00] font-black text-sm">
                {formatINR(joinedRecords.length * 5000)} (100% Refundable)
              </span>
            </div>
          </div>
        </div>

        {/* If no joined pools, show high-converting prompt */}
        {joinedRecords.length === 0 ? (
          <div className="text-center py-20 bg-[#121212] rounded-2xl border border-[#262626] p-8 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#FFCC00]/10 border border-[#FFCC00]/30 text-[#FFCC00] flex items-center justify-center mx-auto mb-4">
              <Car className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white uppercase">No Joined Pools Yet</h3>
            <p className="text-xs text-[#A0A0A0] mt-2 max-w-md mx-auto leading-relaxed">
              You haven't locked in with any vehicle or insurance pool yet. Join an existing syndicate in your city to unlock fleet-level bulk discounts!
            </p>
            <button
              onClick={onExploreMore}
              className="mt-6 px-6 py-3 bg-[#FFCC00] hover:bg-[#E6B800] text-black font-black text-xs rounded-xl shadow-[0_0_20px_rgba(255,204,0,0.3)] transition-all"
            >
              Explore Active Pools
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Joined Pools Selector List */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A0A0A0] flex items-center">
                <span>Active Syndicates ({joinedPoolsData.length}):</span>
              </h3>

              {joinedPoolsData.map(({ pool, record }) => {
                const isSelected = pool.id === selectedPoolId;
                const poolProgress = calculateProgress(pool.currentBuyers, pool.targetBuyers);
                const isPoolFull = pool.currentBuyers >= pool.targetBuyers;

                return (
                  <div
                    key={pool.id}
                    onClick={() => setSelectedPoolId(pool.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1E1E1E] border-[#FFCC00] shadow-[0_0_25px_rgba(255,204,0,0.2)]'
                        : 'bg-[#141414] border-[#262626] hover:border-[#444444]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-black text-[#FFCC00] border border-[#FFCC00]/30">
                            {pool.city}
                          </span>
                          {isPoolFull ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFCC00] text-black flex items-center animate-pulse">
                              <Radio className="w-2.5 h-2.5 mr-1" />
                              BIDS INCOMING
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono text-white bg-[#222222]">
                              FILLING
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-white">{pool.title}</h4>
                        <p className="text-xs text-[#A0A0A0] mt-0.5">{record.selectedVariant}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] font-mono text-[#8E8E8E] block">Escrow Paid</span>
                        <span className="text-sm font-black font-mono text-[#FFCC00]">₹5,000</span>
                      </div>
                    </div>

                    {/* Mini progress */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-[#A0A0A0]">{pool.currentBuyers}/{pool.targetBuyers} Buyers</span>
                        <span className="text-[#FFCC00] font-bold">{poolProgress}%</span>
                      </div>
                      <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#B38F00] to-[#FFCC00] h-full rounded-full"
                          style={{ width: `${poolProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Meta tags */}
                    <div className="mt-3 pt-3 border-t border-[#262626] flex items-center justify-between text-[11px] text-[#A0A0A0]">
                      <span className="flex items-center">
                        <ShieldCheck className="w-3 h-3 text-[#FFCC00] mr-1" />
                        KYC {record.kycStatus}
                      </span>
                      <span className="text-[#888888] font-mono">
                        Txn: {record.escrowTxId}
                      </span>
                    </div>

                    {/* Simulation trigger if not yet full */}
                    {!isPoolFull && (
                      <div className="mt-3 pt-2 border-t border-[#262626] flex items-center justify-between">
                        <span className="text-[10px] text-[#888888]">Demo action:</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSimulateFillPool(pool.id);
                          }}
                          className="text-[11px] font-mono text-[#FFCC00] hover:underline flex items-center bg-black/60 px-2 py-1 rounded border border-[#FFCC00]/30"
                        >
                          <Flame className="w-3 h-3 mr-1" />
                          Simulate Hit 10/10 Threshold
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Column: Live Pool Radar & Bidding War View */}
            <div className="lg:col-span-7">
              {currentPool && (
                <div className="space-y-6">
                  {/* CRITICAL FEATURE: "Bids Incoming" RADAR ANIMATION (when pool hits 10/10) */}
                  {isQuorumMet ? (
                    <div className="bg-[#121212] rounded-2xl border-2 border-[#FFCC00] p-6 shadow-[0_0_40px_rgba(255,204,0,0.25)] relative overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="w-3 h-3 rounded-full bg-[#FFCC00] animate-ping" />
                          <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center">
                            REVERSE AUCTION RADAR: <span className="text-[#FFCC00] ml-1.5">BIDS INCOMING</span>
                          </h3>
                        </div>
                        <span className="text-xs font-mono font-bold text-black bg-[#FFCC00] px-3 py-1 rounded-full uppercase">
                          Live 24h Window
                        </span>
                      </div>

                      <p className="text-xs text-[#A0A0A0] mb-6">
                        Pool quorum reached with <strong className="text-white">10 verified buyers</strong> and ₹50,000 collective escrow committed. Authorized dealerships are in an active reverse auction.
                      </p>

                      {/* Visual Sonar Radar Screen */}
                      <div className="relative w-full h-72 rounded-2xl bg-black border border-[#2E2E2E] overflow-hidden flex items-center justify-center mb-6">
                        {/* Concentric rings */}
                        <div className="absolute w-24 h-24 rounded-full border border-[#FFCC00]/25" />
                        <div className="absolute w-44 h-44 rounded-full border border-[#FFCC00]/20" />
                        <div className="absolute w-64 h-64 rounded-full border border-[#FFCC00]/15" />
                        <div className="absolute w-full h-full rounded-full border border-[#FFCC00]/10" />

                        {/* Crosshairs */}
                        <div className="absolute inset-x-0 top-1/2 h-px bg-[#FFCC00]/20" />
                        <div className="absolute inset-y-0 left-1/2 w-px bg-[#FFCC00]/20" />

                        {/* Radar Sweep Line */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-full h-full animate-radar-sweep origin-center rounded-full bg-[conic-gradient(from_0deg,_transparent_0deg,_transparent_300deg,_rgba(255,204,0,0.35)_360deg)]" />
                        </div>

                        {/* Center syndicate marker */}
                        <div className="relative z-10 flex flex-col items-center">
                          <div className="w-5 h-5 rounded-full bg-[#FFCC00] text-black flex items-center justify-center font-black text-[10px] shadow-[0_0_15px_#FFCC00]">
                            ⚡
                          </div>
                          <span className="text-[10px] font-mono font-bold text-white bg-black/90 px-2 py-0.5 rounded mt-1 border border-[#333333]">
                            {currentPool.city} Group (10 Buyers)
                          </span>
                        </div>

                        {/* Pulsing Dealer Blips on Radar */}
                        <div className="absolute top-12 left-20 z-10 flex items-center space-x-1.5 animate-pulse">
                          <div className="w-3.5 h-3.5 rounded-full bg-[#FFCC00] shadow-[0_0_12px_#FFCC00]" />
                          <span className="text-[9px] font-mono font-bold bg-black/90 text-[#FFCC00] px-1.5 py-0.5 rounded border border-[#FFCC00]/40">
                            Dealer #1 (MI Rd)
                          </span>
                        </div>

                        <div className="absolute bottom-14 right-24 z-10 flex items-center space-x-1.5 animate-pulse">
                          <div className="w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#FFFFFF]" />
                          <span className="text-[9px] font-mono text-white bg-black/90 px-1.5 py-0.5 rounded border border-[#444444]">
                            Dealer #2 (Tonk Rd)
                          </span>
                        </div>

                        <div className="absolute top-16 right-20 z-10 flex items-center space-x-1.5 animate-pulse">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#FFCC00]/70" />
                          <span className="text-[9px] font-mono text-[#A0A0A0] bg-black/90 px-1 py-0.5 rounded">
                            Insurer Syndicate
                          </span>
                        </div>

                        {/* Distance labels */}
                        <div className="absolute bottom-2 left-3 text-[10px] font-mono text-[#666666]">
                          RADAR RANGE: 45 KM METRO RADIUS
                        </div>
                        <div className="absolute top-2 right-3 text-[10px] font-mono text-[#FFCC00]">
                          STATUS: 3 DEALERS COMPETING
                        </div>
                      </div>

                      {/* Live Bids Feed Leaderboard */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-mono font-bold uppercase text-white flex items-center">
                            <Trophy className="w-4 h-4 text-[#FFCC00] mr-1.5" />
                            Live Reverse Auction Leaderboard:
                          </h4>
                          <span className="text-[11px] font-mono text-[#A0A0A0]">
                            Dealers bidding down prices
                          </span>
                        </div>

                        {currentPool.bids.map((bid, index) => (
                          <div
                            key={bid.id}
                            className={`p-4 rounded-xl border transition-all ${
                              bid.isLeading
                                ? 'bg-[#1A1A1A] border-[#FFCC00] shadow-[0_0_20px_rgba(255,204,0,0.15)]'
                                : 'bg-[#141414] border-[#2A2A2A]'
                            }`}
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-extrabold text-white text-sm">
                                    {bid.dealerName}
                                  </span>
                                  {bid.isLeading && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-[#FFCC00] text-black">
                                      #1 LEADING BID
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-[#A0A0A0] mt-0.5">
                                  {bid.dealerType} • Guaranteed dispatch in {bid.deliveryGuaranteeDays} days
                                </p>
                              </div>

                              <div className="text-right">
                                <span className="text-[10px] font-mono text-[#8E8E8E] block uppercase">
                                  Offered Cash Discount
                                </span>
                                <span className="text-lg font-black font-mono text-[#FFCC00]">
                                  -{formatINR(bid.cashDiscountPerUnit)}
                                </span>
                              </div>
                            </div>

                            <div className="mt-2.5 flex flex-wrap gap-1.5">
                              {bid.freeAddons.map((addon) => (
                                <span key={addon} className="px-2 py-0.5 rounded bg-black border border-[#333333] text-[10px] text-white">
                                  ✓ {addon}
                                </span>
                              ))}
                            </div>

                            {/* Action to accept bid */}
                            <div className="mt-3 pt-3 border-t border-[#262626] flex items-center justify-between">
                              <span className="text-[11px] font-mono text-[#888888]">
                                Bid locked {bid.submittedAt}
                              </span>
                              <button
                                onClick={() => handleOpenCertificate(currentPool)}
                                className="px-4 py-1.5 bg-[#FFCC00] hover:bg-[#E6B800] text-black font-extrabold text-xs rounded-lg transition-all shadow-sm"
                              >
                                Accept Bid & Claim Voucher
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Waiting for pool quorum */
                    <div className="bg-[#121212] rounded-2xl border border-[#2E2E2E] p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-5 h-5 text-[#FFCC00]" />
                          <h3 className="text-lg font-black text-white uppercase">
                            Syndicate Quorum Status: Filling
                          </h3>
                        </div>
                        <span className="text-xs font-mono text-[#A0A0A0]">
                          {currentPool.targetBuyers - currentPool.currentBuyers} spots left
                        </span>
                      </div>

                      <p className="text-xs text-[#A0A0A0] leading-relaxed mb-6">
                        Once <strong className="text-white">{currentPool.targetBuyers} buyers</strong> commit their refundable ₹5,000 token, the platform will automatically trigger the reverse auction radar and notify certified regional dealerships.
                      </p>

                      <div className="p-4 bg-black/60 rounded-xl border border-[#2A2A2A] flex flex-col sm:flex-row items-center justify-between gap-3">
                        <div className="flex items-center space-x-3 text-xs">
                          <div className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse" />
                          <span>Waiting for quorum to activate dealer reverse auction</span>
                        </div>
                        <button
                          onClick={() => onSimulateFillPool(currentPool.id)}
                          className="px-4 py-2 bg-[#FFCC00] text-black text-xs font-bold rounded-lg whitespace-nowrap shadow-sm hover:bg-[#E6B800]"
                        >
                          Simulate Hit 10/10 Quorum Now
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Commitment Details Card */}
                  <div className="bg-[#141414] rounded-2xl border border-[#262626] p-5">
                    <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#A0A0A0] mb-3">
                      My Locked Contract Parameters:
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="bg-black p-3 rounded-xl border border-[#2A2A2A]">
                        <span className="text-[#8E8E8E] text-[10px] block">Selected Variant</span>
                        <span className="text-white font-bold truncate block">{currentRecord.selectedVariant}</span>
                      </div>
                      <div className="bg-black p-3 rounded-xl border border-[#2A2A2A]">
                        <span className="text-[#8E8E8E] text-[10px] block">Exterior Color</span>
                        <span className="text-white font-bold block">{currentRecord.selectedColor}</span>
                      </div>
                      <div className="bg-black p-3 rounded-xl border border-[#2A2A2A]">
                        <span className="text-[#8E8E8E] text-[10px] block">Group Insurance</span>
                        <span className="text-[#FFCC00] font-bold block">
                          {currentRecord.bundledInsurance ? '+15% Applied' : 'Declined'}
                        </span>
                      </div>
                      <div className="bg-black p-3 rounded-xl border border-[#2A2A2A]">
                        <span className="text-[#8E8E8E] text-[10px] block">Escrow Status</span>
                        <span className="text-white font-bold block flex items-center">
                          <CheckCircle className="w-3 h-3 text-[#FFCC00] mr-1" />
                          Verified
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Allocation Certificate Modal */}
      {showCertificateModal && acceptedPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-[#141414] border-2 border-[#FFCC00] rounded-2xl p-6 shadow-[0_0_50px_rgba(255,204,0,0.3)] relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#FFCC00] text-black font-black flex items-center justify-center text-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="text-base font-black text-white">GROUP ALLOCATION CERTIFICATE</h3>
                  <p className="text-[11px] text-[#A0A0A0] font-mono">TORQPOOL OFFICIAL BULK VOUCHER</p>
                </div>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="text-[#888888] hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="bg-black p-5 rounded-xl border border-[#2E2E2E] space-y-3 font-mono text-xs">
              <div className="flex justify-between border-b border-[#222222] pb-2">
                <span className="text-[#8E8E8E]">Voucher Code:</span>
                <span className="text-[#FFCC00] font-bold">TRQ-BULK-2025-9812</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E8E]">Vehicle:</span>
                <span className="text-white font-bold">{acceptedPool.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E8E]">City Syndicate:</span>
                <span className="text-white">{acceptedPool.city} Group (10 Verified Buyers)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E8E]">Winning Dealership:</span>
                <span className="text-white font-bold">{acceptedPool.bids[0]?.dealerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E8E]">Discount Locked:</span>
                <span className="text-[#FFCC00] font-bold">
                  {formatINR(acceptedPool.bids[0]?.cashDiscountPerUnit || 175000)} OFF
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8E8E8E]">Escrow Deductible:</span>
                <span className="text-white">₹5,000 adjusted against final invoice</span>
              </div>

              <div className="pt-3 border-t border-[#222222] flex items-center justify-center py-2">
                <div className="flex items-center space-x-2 text-[11px] text-[#FFCC00]">
                  <QrCode className="w-5 h-5" />
                  <span>Show this QR at showroom for priority allotment</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center space-x-3">
              <button
                onClick={() => {
                  alert('Certificate downloaded to device (Simulated)');
                  setShowCertificateModal(false);
                }}
                className="flex-1 py-3 bg-[#FFCC00] text-black font-black text-xs rounded-xl flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF Voucher</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
