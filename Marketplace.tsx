import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  ShieldCheck, 
  Sparkles, 
  Flame, 
  ArrowUpRight, 
  CheckCircle2, 
  Filter,
  Car,
  Bike,
  Truck,
  FileCheck
} from 'lucide-react';
import { Pool, VehicleCategory, ServiceType } from '../types/index.ts';
import { calculateProgress, formatINR } from '../utils/poolLogic.ts';

interface MarketplaceProps {
  pools: Pool[];
  joinedPoolIds: string[];
  onSelectPool: (pool: Pool) => void;
  onJoinPool: (pool: Pool) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  pools,
  joinedPoolIds,
  onSelectPool,
  onJoinPool,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedService, setSelectedService] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'closing' | 'joined' | 'discount'>('closing');

  // Cities extracted
  const cities = ['All', 'Jaipur', 'Delhi NCR', 'Bengaluru', 'Mumbai', 'Pune', 'Chandigarh'];

  const filteredPools = useMemo(() => {
    return pools
      .filter((pool) => {
        const matchesSearch =
          pool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pool.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pool.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          pool.city.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCity = selectedCity === 'All' || pool.city === selectedCity;
        const matchesCategory =
          selectedCategory === 'All' || pool.category === selectedCategory;
        const matchesService =
          selectedService === 'All' ||
          pool.serviceType === selectedService ||
          (selectedService === 'bundle' && pool.serviceType === 'bundle');

        return matchesSearch && matchesCity && matchesCategory && matchesService;
      })
      .sort((a, b) => {
        if (sortBy === 'closing') {
          return a.expiryHoursLeft - b.expiryHoursLeft;
        }
        if (sortBy === 'joined') {
          return b.currentBuyers - a.currentBuyers;
        }
        if (sortBy === 'discount') {
          return b.bulkDiscountPercentage - a.bulkDiscountPercentage;
        }
        return 0;
      });
  }, [pools, searchQuery, selectedCity, selectedCategory, selectedService, sortBy]);

  return (
    <section id="marketplace-section" className="py-16 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Marketplace Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[#222222]">
          <div>
            <div className="flex items-center space-x-2 text-[#FFCC00] text-xs font-mono font-bold tracking-wider uppercase mb-1">
              <Flame className="w-4 h-4 fill-[#FFCC00]" />
              <span>THE CORE ENGINE</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
              ACTIVE <span className="text-[#FFCC00]">BUYING POOLS</span>
            </h2>
            <p className="mt-1 text-sm text-[#A0A0A0]">
              Browse live aggregations. Join with ₹5,000 refundable token to push the pool into reverse auction.
            </p>
          </div>

          <div className="mt-4 md:mt-0 flex items-center space-x-2 text-xs font-mono text-[#A0A0A0] bg-[#121212] px-3.5 py-2 rounded-xl border border-[#2A2A2A]">
            <span className="w-2 h-2 rounded-full bg-[#FFCC00] animate-pulse" />
            <span>Showing <strong className="text-white">{filteredPools.length}</strong> Pools Open for Bidding</span>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-[#121212] p-5 rounded-2xl border border-[#262626] mb-10 space-y-4">
          {/* Search bar & Sort */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="relative md:col-span-2">
              <Search className="w-4 h-4 text-[#A0A0A0] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by vehicle (Creta, Thar, Nexon), brand, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#1E1E1E] text-white pl-10 pr-4 py-2.5 rounded-xl border border-[#333333] focus:border-[#FFCC00] focus:ring-1 focus:ring-[#FFCC00] text-sm outline-none transition-all placeholder:text-[#666666]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#A0A0A0] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <label className="text-xs font-mono text-[#A0A0A0] uppercase whitespace-nowrap">Sort:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                aria-label="Sort pools"
                className="w-full bg-[#1E1E1E] text-white px-3 py-2.5 rounded-xl border border-[#333333] focus:border-[#FFCC00] text-sm outline-none cursor-pointer"
              >
                <option value="closing">Closing Soonest</option>
                <option value="joined">Most Buyers Joined</option>
                <option value="discount">Highest Discount %</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="pt-2 border-t border-[#222222] flex flex-wrap gap-4 text-xs">
            {/* Category Filter */}
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-[#8E8E8E] font-mono mr-1 flex items-center">
                <Filter className="w-3.5 h-3.5 mr-1" /> Category:
              </span>
              {(['All', 'cars', 'bikes', 'commercial'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#FFCC00] text-black font-bold shadow-sm'
                      : 'bg-[#1E1E1E] text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A]'
                  }`}
                >
                  {cat === 'All' && 'All Categories'}
                  {cat === 'cars' && 'Cars / SUVs'}
                  {cat === 'bikes' && 'Motorcycles'}
                  {cat === 'commercial' && 'Commercial Fleet'}
                </button>
              ))}
            </div>

            {/* Service Filter */}
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="text-[#8E8E8E] font-mono mr-1">Service:</span>
              {[
                { id: 'All', label: 'All Services' },
                { id: 'vehicle', label: 'Vehicles' },
                { id: 'insurance', label: 'Group Insurance' },
                { id: 'bundle', label: 'Combined Bundle' },
              ].map((serv) => (
                <button
                  key={serv.id}
                  onClick={() => setSelectedService(serv.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    selectedService === serv.id
                      ? 'bg-[#FFCC00] text-black font-bold shadow-sm'
                      : 'bg-[#1E1E1E] text-[#A0A0A0] hover:text-white hover:bg-[#2A2A2A]'
                  }`}
                >
                  {serv.label}
                </button>
              ))}
            </div>

            {/* City Filter */}
            <div className="flex items-center space-x-1.5 flex-wrap w-full mt-1">
              <span className="text-[#8E8E8E] font-mono mr-1 flex items-center">
                <MapPin className="w-3 h-3 mr-1" /> City:
              </span>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                    selectedCity === city
                      ? 'bg-white text-black font-bold'
                      : 'bg-[#1A1A1A] text-[#8E8E8E] hover:text-white hover:bg-[#242424]'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pool Grid */}
        {filteredPools.length === 0 ? (
          <div className="text-center py-20 bg-[#121212] rounded-2xl border border-[#222222]">
            <Users className="w-12 h-12 text-[#444444] mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-1">No pools match your filters</h3>
            <p className="text-sm text-[#A0A0A0] mb-4">
              Try adjusting your city, category, or search keyword.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCity('All');
                setSelectedCategory('All');
                setSelectedService('All');
              }}
              className="px-4 py-2 bg-[#FFCC00] text-black font-bold text-xs rounded-lg"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPools.map((pool) => {
              const progress = calculateProgress(pool.currentBuyers, pool.targetBuyers);
              const isJoined = joinedPoolIds.includes(pool.id);
              const spotsLeft = Math.max(pool.targetBuyers - pool.currentBuyers, 0);
              const isReadyForBids = pool.currentBuyers >= pool.targetBuyers;

              return (
                <motion.div
                  key={pool.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.25 }}
                  className="bg-[#1E1E1E] rounded-2xl overflow-hidden border border-[#2A2A2A] hover:border-[#FFCC00] hover:shadow-[0_0_25px_rgba(255,204,0,0.2)] transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Card Image Banner */}
                  <div className="relative h-48 w-full overflow-hidden bg-black">
                    <img
                      src={pool.imageUrl}
                      alt={pool.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E1E] via-transparent to-black/60" />

                    {/* Top tags */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="flex items-center space-x-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase bg-black/80 backdrop-blur-md text-[#FFCC00] border border-[#FFCC00]/40">
                        <MapPin className="w-3 h-3 text-[#FFCC00]" />
                        <span>{pool.city}</span>
                      </span>

                      <span className="flex items-center space-x-1 px-2 py-1 rounded-md text-[10px] font-mono bg-black/80 backdrop-blur-md text-white border border-[#333333]">
                        <Clock className="w-3 h-3 text-[#FFCC00]" />
                        <span>{pool.expiryHoursLeft}h left</span>
                      </span>
                    </div>

                    {/* Category icon indicator */}
                    <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-[#121212]/90 text-white border border-[#333333] flex items-center">
                        {pool.category === 'cars' && <Car className="w-3 h-3 mr-1 text-[#FFCC00]" />}
                        {pool.category === 'bikes' && <Bike className="w-3 h-3 mr-1 text-[#FFCC00]" />}
                        {pool.category === 'commercial' && <Truck className="w-3 h-3 mr-1 text-[#FFCC00]" />}
                        {pool.category}
                      </span>
                      {pool.serviceType === 'bundle' && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FFCC00] text-black">
                          +15% Insurance
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-extrabold text-white group-hover:text-[#FFCC00] transition-colors leading-tight">
                            {pool.title}
                          </h3>
                          <p className="text-xs text-[#A0A0A0] mt-0.5">
                            {pool.subtitle}
                          </p>
                        </div>
                      </div>

                      {/* Pricing block */}
                      <div className="mt-4 p-3 rounded-xl bg-black/50 border border-[#262626]">
                        <div className="flex items-baseline justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-[#8E8E8E] block uppercase">Est. Bulk Price</span>
                            <span className="text-xl font-black font-mono text-[#FFCC00]">
                              {formatINR(pool.estimatedBulkPrice)}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] font-mono text-[#8E8E8E] line-through block">
                              MSRP {formatINR(pool.retailPrice)}
                            </span>
                            <span className="text-xs font-black text-white bg-[#2A2A2A] px-2 py-0.5 rounded font-mono">
                              Save {pool.bulkDiscountPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Dynamic Progress Bar */}
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-semibold text-white flex items-center">
                            <Users className="w-3.5 h-3.5 text-[#FFCC00] mr-1.5" />
                            {pool.currentBuyers} of {pool.targetBuyers} Buyers
                          </span>
                          <span className={`font-mono text-xs font-bold ${isReadyForBids ? 'text-[#FFCC00]' : 'text-[#A0A0A0]'}`}>
                            {isReadyForBids ? '🔥 100% UNLOCKED' : `${spotsLeft} spots to war`}
                          </span>
                        </div>

                        {/* Visual Progress Bar Track */}
                        <div className="w-full bg-[#121212] h-2.5 rounded-full overflow-hidden border border-[#2E2E2E]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full transition-all ${
                              isReadyForBids
                                ? 'bg-gradient-to-r from-[#FFCC00] to-[#FFE066] shadow-[0_0_12px_#FFCC00]'
                                : 'bg-gradient-to-r from-[#B38F00] to-[#FFCC00]'
                            }`}
                          />
                        </div>

                        {/* Status message */}
                        <div className="mt-2 flex items-center justify-between text-[11px] text-[#A0A0A0]">
                          <span className="flex items-center">
                            <ShieldCheck className="w-3 h-3 text-[#FFCC00] mr-1" />
                            ₹5,000 Refundable Escrow
                          </span>
                          <span className="font-mono text-[#FFCC00]">
                            {progress}% filled
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Interactive CTAs */}
                    <div className="mt-6 pt-4 border-t border-[#262626] flex items-center space-x-2">
                      <button
                        onClick={() => onSelectPool(pool)}
                        aria-label={`View details for ${pool.title}`}
                        className="flex-1 py-2.5 px-3 rounded-xl bg-[#121212] hover:bg-[#1A1A1A] border border-[#333333] hover:border-[#FFCC00]/50 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1"
                      >
                        <span>Details & Bids</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#FFCC00]" />
                      </button>

                      <button
                        onClick={() => onJoinPool(pool)}
                        aria-label={`Join pool for ${pool.title}`}
                        className={`py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 ${
                          isJoined
                            ? 'bg-[#121212] text-[#FFCC00] border border-[#FFCC00]'
                            : 'bg-[#FFCC00] hover:bg-[#E6B800] text-black shadow-[0_0_15px_rgba(255,204,0,0.3)] hover:shadow-[0_0_20px_rgba(255,204,0,0.5)] active:scale-95'
                        }`}
                      >
                        {isJoined ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#FFCC00]" />
                            <span>Joined</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Join Pool</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
