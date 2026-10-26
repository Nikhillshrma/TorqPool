import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Plus, Sparkles, Building2, MapPin, Car, Shield } from 'lucide-react';
import { Pool, VehicleCategory, ServiceType } from '../types/index.ts';

interface CreatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePool: (newPool: Pool) => void;
}

export const CreatePoolModal: React.FC<CreatePoolModalProps> = ({
  isOpen,
  onClose,
  onCreatePool,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('Toyota Innova Hycross ZX(O)');
  const [subtitle, setSubtitle] = useState('Jaipur Airport Executives Syndicate');
  const [category, setCategory] = useState<VehicleCategory>('cars');
  const [serviceType, setServiceType] = useState<ServiceType>('bundle');
  const [city, setCity] = useState('Jaipur');
  const [targetBuyers, setTargetBuyers] = useState<number>(10);
  const [retailPrice, setRetailPrice] = useState<number>(3150000);
  const [bulkDiscountPercentage, setBulkDiscountPercentage] = useState<number>(12);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const estimatedBulkPrice = Math.round(retailPrice * (1 - bulkDiscountPercentage / 100));

    const newPool: Pool = {
      id: `pool-custom-${Date.now()}`,
      title,
      subtitle,
      category,
      serviceType,
      city,
      brand: title.split(' ')[0] || 'Custom',
      model: title,
      currentBuyers: 1, // creator is first buyer
      targetBuyers,
      retailPrice,
      estimatedBulkPrice,
      bulkDiscountPercentage,
      tokenDepositAmount: 5000,
      insuranceDiscountPercentage: 15,
      standardInsuranceCost: Math.round(retailPrice * 0.035),
      expiryHoursLeft: 72,
      status: 'filling',
      imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      specs: {
        engine: '2.0L Strong Hybrid / Petrol',
        transmission: 'e-CVT Automatic',
        seating: '7-8 Seater Executive Lounge',
      },
      variants: ['ZX(O) Hybrid', 'VX Hybrid', 'GX Petrol'],
      colors: [
        { name: 'Super White', hex: '#FFFFFF' },
        { name: 'Attitude Black', hex: '#111111' },
        { name: 'Silver Metallic', hex: '#999999' },
      ],
      escrowPoolLockedAmount: 5000,
      bids: [],
    };

    onCreatePool(newPool);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-xl bg-[#121212] border border-[#2E2E2E] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden my-8"
      >
        <div className="bg-[#1A1A1A] p-5 border-b border-[#2A2A2A] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FFCC00] text-black font-black flex items-center justify-center">
              <Plus className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">START A NEW BUYING POOL</h3>
              <p className="text-xs text-[#A0A0A0]">Aggregate demand for any vehicle model or fleet insurance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="w-8 h-8 rounded-lg bg-[#222222] hover:bg-[#333333] text-[#A0A0A0] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1 font-bold">
              Vehicle / Fleet Model Name:
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Tata Curvv EV / Mahindra Scorpio-N"
              className="w-full bg-[#1A1A1A] text-white px-3 py-2.5 rounded-xl border border-[#333333] focus:border-[#FFCC00] text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1 font-bold">
              Syndicate Subtitle / Focus:
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              required
              placeholder="e.g. IT Park Techies Bulk Purchase"
              className="w-full bg-[#1A1A1A] text-white px-3 py-2.5 rounded-xl border border-[#333333] focus:border-[#FFCC00] text-xs outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1 font-bold">City:</label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                aria-label="City"
                className="w-full bg-[#1A1A1A] text-white px-3 py-2.5 rounded-xl border border-[#333333] focus:border-[#FFCC00] text-xs outline-none"
              >
                <option value="Jaipur">Jaipur</option>
                <option value="Delhi NCR">Delhi NCR</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Pune">Pune</option>
                <option value="Chandigarh">Chandigarh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1 font-bold">Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                aria-label="Category"
                className="w-full bg-[#1A1A1A] text-white px-3 py-2.5 rounded-xl border border-[#333333] focus:border-[#FFCC00] text-xs outline-none"
              >
                <option value="cars">Cars / SUVs</option>
                <option value="bikes">Motorcycles</option>
                <option value="commercial">Commercial Fleet</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1 font-bold">Quorum Target:</label>
              <input
                type="number"
                min="5"
                max="50"
                value={targetBuyers}
                onChange={(e) => setTargetBuyers(Number(e.target.value))}
                className="w-full bg-[#1A1A1A] text-white px-3 py-2 rounded-xl border border-[#333333] focus:border-[#FFCC00] text-xs font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1 font-bold">Approx MSRP (₹):</label>
              <input
                type="number"
                step="10000"
                value={retailPrice}
                onChange={(e) => setRetailPrice(Number(e.target.value))}
                className="w-full bg-[#1A1A1A] text-white px-3 py-2 rounded-xl border border-[#333333] focus:border-[#FFCC00] text-xs font-mono outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-[#A0A0A0] mb-1 font-bold">Target Cut (%):</label>
              <input
                type="number"
                min="5"
                max="35"
                value={bulkDiscountPercentage}
                onChange={(e) => setBulkDiscountPercentage(Number(e.target.value))}
                className="w-full bg-[#1A1A1A] text-white px-3 py-2 rounded-xl border border-[#333333] focus:border-[#FFCC00] text-xs font-mono outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-black/60 rounded-xl border border-[#2E2E2E] text-xs text-[#A0A0A0] flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#FFCC00] shrink-0" />
            <span>As creator, your refundable ₹5,000 escrow spot is automatically verified.</span>
          </div>

          <div className="pt-2 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-[#1E1E1E] text-white text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-[#FFCC00] hover:bg-[#E6B800] text-black text-xs font-black rounded-xl shadow-[0_0_15px_rgba(255,204,0,0.3)]"
            >
              Launch Syndicate Pool
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
