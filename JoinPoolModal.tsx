import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Lock, 
  UploadCloud, 
  FileCheck2, 
  AlertCircle, 
  CreditCard, 
  QrCode, 
  Sparkles, 
  ArrowRight, 
  ChevronLeft,
  Percent,
  Info
} from 'lucide-react';
import { Pool, JoinedPoolRecord } from '../types/index.ts';
import { calculateProgress, calculateSavingsBreakdown, formatINR } from '../utils/poolLogic.ts';

interface JoinPoolModalProps {
  pool: Pool | null;
  isOpen: boolean;
  onClose: () => void;
  onCompleteJoin: (record: JoinedPoolRecord) => void;
  onViewDashboard?: () => void;
}

export const JoinPoolModal: React.FC<JoinPoolModalProps> = ({
  pool,
  isOpen,
  onClose,
  onCompleteJoin,
  onViewDashboard,
}) => {
  if (!isOpen || !pool) return null;

  // Step state: 1 = Config & Insurance, 2 = KYC Upload, 3 = Escrow Deposit Payment, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form states
  const [selectedVariant, setSelectedVariant] = useState(pool.variants[0] || 'Standard');
  const [selectedColor, setSelectedColor] = useState(pool.colors[0]?.name || 'Standard');
  const [bundleInsurance, setBundleInsurance] = useState<boolean>(true); // default true for high conversion
  
  // KYC State
  const [idType, setIdType] = useState<'Aadhaar' | 'PAN' | 'GSTIN'>('Aadhaar');
  const [idNumber, setIdNumber] = useState('8721 9904 1238');
  const [fullName, setFullName] = useState('Rahul Verma');
  const [phoneNumber, setPhoneNumber] = useState('+91 98201 44521');
  const [kycFileUploaded, setKycFileUploaded] = useState<boolean>(true);
  const [kycFileName, setKycFileName] = useState('aadhaar_front_verified.pdf');
  const [isVerifyingKYC, setIsVerifyingKYC] = useState(false);
  const [kycVerified, setKycVerified] = useState(true);

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [upiId, setUpiId] = useState('rahul.verma@okaxis');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Savings calculations
  const breakdown = calculateSavingsBreakdown(
    pool.retailPrice,
    pool.bulkDiscountPercentage,
    bundleInsurance,
    pool.standardInsuranceCost,
    pool.insuranceDiscountPercentage
  );

  const progress = calculateProgress(pool.currentBuyers, pool.targetBuyers);

  // Handle Mock File Drop
  const handleSimulateFileUpload = (fileName: string) => {
    setIsVerifyingKYC(true);
    setKycFileName(fileName);
    setTimeout(() => {
      setIsVerifyingKYC(false);
      setKycFileUploaded(true);
      setKycVerified(true);
    }, 600);
  };

  // Handle Complete Payment
  const handleAuthorizeEscrow = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setStep(4);

      const record: JoinedPoolRecord = {
        poolId: pool.id,
        joinedAt: 'Just now',
        tokenPaid: 5000,
        escrowTxId: `ESC-${Math.floor(100000 + Math.random() * 900000)}`,
        selectedVariant,
        selectedColor,
        bundledInsurance: bundleInsurance,
        kycStatus: 'verified',
        applicantName: fullName,
        applicantPhone: phoneNumber,
        applicantCity: pool.city,
        idType,
        idNumber,
      };

      onCompleteJoin(record);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-[#121212] border border-[#2E2E2E] rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden my-8"
      >
        {/* Top Header Banner */}
        <div className="bg-[#1A1A1A] p-5 border-b border-[#2A2A2A] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFCC00] text-black font-black flex items-center justify-center text-lg">
              ⚡
            </div>
            <div>
              <h3 className="text-lg font-black text-white leading-tight">
                {step === 4 ? 'POOL COMMITMENT CONFIRMED' : `JOIN POOL: ${pool.title}`}
              </h3>
              <p className="text-xs text-[#A0A0A0]">
                {pool.city} Syndicate • {pool.currentBuyers} of {pool.targetBuyers} Buyers Joined
              </p>
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

        {/* Step Progression Tabs (if not step 4) */}
        {step !== 4 && (
          <div className="bg-black/40 px-6 py-3 border-b border-[#222222] flex items-center justify-between text-xs font-mono">
            <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-[#FFCC00]' : 'text-[#555555]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 1 ? 'bg-[#FFCC00] text-black' : 'bg-[#222222] text-[#888888]'}`}>
                1
              </span>
              <span>Vehicle & Insurance</span>
            </div>
            <div className="h-0.5 w-6 bg-[#333333]" />
            <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-[#FFCC00]' : 'text-[#555555]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 2 ? 'bg-[#FFCC00] text-black' : 'bg-[#222222] text-[#888888]'}`}>
                2
              </span>
              <span>KYC Verification</span>
            </div>
            <div className="h-0.5 w-6 bg-[#333333]" />
            <div className={`flex items-center space-x-2 ${step >= 3 ? 'text-[#FFCC00]' : 'text-[#555555]'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step >= 3 ? 'bg-[#FFCC00] text-black' : 'bg-[#222222] text-[#888888]'}`}>
                3
              </span>
              <span>₹5,000 Escrow Deposit</span>
            </div>
          </div>
        )}

        {/* Step Body */}
        <div className="p-6">
          {/* STEP 1: Variant, Color & Insurance Bundling */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Pool Progress Indicator */}
              <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2E2E2E]">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-white font-bold">
                    Group Progress: {pool.currentBuyers} / {pool.targetBuyers} Buyers
                  </span>
                  <span className="text-[#FFCC00] font-bold">
                    {progress}% Locked
                  </span>
                </div>
                <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#B38F00] to-[#FFCC00] h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-2 text-[11px] text-[#A0A0A0]">
                  Your join will add 1 buyer, pushing the pool closer to unlocking the dealer reverse auction!
                </p>
              </div>

              {/* Variant Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2 font-bold">
                  Select Trim / Variant:
                </label>
                <div className="space-y-2">
                  {pool.variants.map((v) => (
                    <div
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`p-3 rounded-xl border text-sm flex items-center justify-between cursor-pointer transition-all ${
                        selectedVariant === v
                          ? 'bg-[#1E1E1E] border-[#FFCC00] text-white shadow-[0_0_15px_rgba(255,204,0,0.15)]'
                          : 'bg-[#161616] border-[#2A2A2A] text-[#A0A0A0] hover:text-white hover:border-[#444444]'
                      }`}
                    >
                      <span className="font-semibold">{v}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        selectedVariant === v ? 'border-[#FFCC00] bg-[#FFCC00]' : 'border-[#444444]'
                      }`}>
                        {selectedVariant === v && <Check className="w-3 h-3 text-black stroke-[3]" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exterior Color Swatches */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2 font-bold">
                  Preferred Exterior Color:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {pool.colors.map((c) => (
                    <div
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`p-2.5 rounded-xl border text-xs flex items-center space-x-2.5 cursor-pointer transition-all ${
                        selectedColor === c.name
                          ? 'bg-[#1E1E1E] border-[#FFCC00] text-white font-bold'
                          : 'bg-[#161616] border-[#2A2A2A] text-[#A0A0A0] hover:text-white'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-[#555555] shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="truncate">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CRUCIAL FEATURE: Insurance Bundling Toggle */}
              <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2E2E2E] hover:border-[#FFCC00]/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-[#FFCC00]/10 border border-[#FFCC00]/30 rounded-lg text-[#FFCC00] shrink-0 mt-0.5">
                      <Percent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-bold text-white">
                          Add Group Motor Insurance
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-[#FFCC00] text-black">
                          Extra 15% OFF
                        </span>
                      </div>
                      <p className="text-xs text-[#A0A0A0] mt-0.5">
                        Pool with other buyers for collective underwriting discount with Zero-Depreciation & 24/7 Roadside Assistance.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <button
                    type="button"
                    onClick={() => setBundleInsurance(!bundleInsurance)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
                      bundleInsurance ? 'bg-[#FFCC00]' : 'bg-[#333333]'
                    }`}
                  >
                    <div
                      className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                        bundleInsurance ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {bundleInsurance && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 pt-3 border-t border-[#2A2A2A] grid grid-cols-2 text-xs font-mono"
                  >
                    <div className="text-[#A0A0A0]">
                      Standard Policy: <span className="line-through text-[#666666]">{formatINR(pool.standardInsuranceCost)}</span>
                    </div>
                    <div className="text-right text-[#FFCC00] font-bold">
                      Group Rate: {formatINR(breakdown.discountedInsuranceCost)} (Save {formatINR(breakdown.insuranceSavings)})
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Total Live Savings Summary */}
              <div className="p-4 rounded-xl bg-black border border-[#2E2E2E]">
                <div className="flex justify-between items-center text-xs text-[#A0A0A0] mb-1 font-mono">
                  <span>Target Vehicle Discount:</span>
                  <span className="text-white font-bold">-{formatINR(breakdown.vehicleSavings)}</span>
                </div>
                {bundleInsurance && (
                  <div className="flex justify-between items-center text-xs text-[#A0A0A0] mb-1 font-mono">
                    <span>Group Insurance Discount (15%):</span>
                    <span className="text-[#FFCC00] font-bold">-{formatINR(breakdown.insuranceSavings)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#2A2A2A] flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white uppercase">Your Total Estimated Savings:</span>
                  <span className="text-xl font-black font-mono text-[#FFCC00]">
                    {formatINR(breakdown.totalSavings)}
                  </span>
                </div>
              </div>

              {/* Next Step Button */}
              <button
                onClick={() => setStep(2)}
                className="w-full py-3.5 bg-[#FFCC00] hover:bg-[#E6B800] text-black font-black text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,204,0,0.3)] flex items-center justify-center space-x-2"
              >
                <span>Continue to KYC Verification</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: KYC Upload (Missing Feature 3) */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2E2E2E] flex items-start space-x-3">
                <ShieldCheck className="w-5 h-5 text-[#FFCC00] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-white block">Why do we require KYC for buying pools?</span>
                  <p className="text-[#A0A0A0] mt-0.5">
                    Dealers will only offer 10-18% bulk cuts if every buyer is proven real. Unverified accounts lead to dealers withdrawing their auction bids.
                  </p>
                </div>
              </div>

              {/* Identity Document Selector */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2 font-bold">
                  Choose Verification Document:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Aadhaar', 'PAN', 'GSTIN'] as const).map((doc) => (
                    <button
                      key={doc}
                      type="button"
                      onClick={() => setIdType(doc)}
                      className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all ${
                        idType === doc
                          ? 'bg-[#1E1E1E] border-[#FFCC00] text-[#FFCC00] font-bold'
                          : 'bg-[#161616] border-[#2A2A2A] text-[#A0A0A0]'
                      }`}
                    >
                      {doc} Card
                    </button>
                  ))}
                </div>
              </div>

              {/* Applicant Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-[#A0A0A0] mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-[#1A1A1A] text-white px-3 py-2 rounded-lg border border-[#333333] focus:border-[#FFCC00] text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-[#A0A0A0] mb-1">{idType} Number</label>
                  <input
                    type="text"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    className="w-full bg-[#1A1A1A] text-white px-3 py-2 rounded-lg border border-[#333333] focus:border-[#FFCC00] text-xs outline-none font-mono"
                  />
                </div>
              </div>

              {/* Mock Drag & Drop Upload Zone */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2 font-bold">
                  Upload {idType} Document (Front / PDF):
                </label>

                <div 
                  onClick={() => handleSimulateFileUpload(`${idType.toLowerCase()}_scan_verified.pdf`)}
                  className="border-2 border-dashed border-[#333333] hover:border-[#FFCC00] bg-black/60 rounded-2xl p-6 text-center cursor-pointer transition-all group"
                >
                  {isVerifyingKYC ? (
                    <div className="py-4">
                      <div className="w-8 h-8 border-2 border-[#FFCC00] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                      <p className="text-xs text-[#FFCC00] font-mono">Running OCR & DigiLocker checksum...</p>
                    </div>
                  ) : kycVerified ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-[#FFCC00]/15 border border-[#FFCC00] text-[#FFCC00] flex items-center justify-center mb-2">
                        <FileCheck2 className="w-6 h-6" />
                      </div>
                      <span className="text-sm font-bold text-white">{kycFileName}</span>
                      <span className="text-xs font-mono text-[#FFCC00] mt-1 flex items-center">
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Verified via Sandbox • Ready for Auction
                      </span>
                      <span className="text-[10px] text-[#777777] mt-1">Click to replace file</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <UploadCloud className="w-10 h-10 text-[#666666] group-hover:text-[#FFCC00] mb-2 transition-colors" />
                      <span className="text-xs font-bold text-white">Click or drag & drop {idType} document</span>
                      <span className="text-[10px] text-[#A0A0A0] mt-1">Supports PDF, PNG, JPEG up to 10MB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="px-4 py-3 bg-[#1A1A1A] hover:bg-[#222222] text-[#A0A0A0] hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!kycVerified}
                  className="flex-1 py-3 bg-[#FFCC00] hover:bg-[#E6B800] text-black font-black text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,204,0,0.3)] flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <span>Proceed to Escrow Deposit</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: "Skin in the Game" Deposit Payment (Missing Feature 1) */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              {/* Escrow Explanation Card */}
              <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2E2E2E]">
                <div className="flex items-start space-x-3">
                  <div className="p-2.5 bg-[#FFCC00]/15 text-[#FFCC00] rounded-xl border border-[#FFCC00]/40 shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center">
                      Refundable ₹5,000 "Skin in the Game" Token
                    </h4>
                    <p className="text-xs text-[#A0A0A0] mt-1 leading-relaxed">
                      This token is held securely in an RBI-regulated escrow account. It is <strong>100% refundable</strong> if you do not accept the winning dealership bid, or if the pool does not reach quorum.
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#2A2A2A] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#A0A0A0]">Escrow Custodian:</span>
                  <span className="text-white font-bold">ICICI Trustee Escrow Syndicate</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-[#A0A0A0] mb-2 font-bold">
                  Select Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                      paymentMethod === 'upi'
                        ? 'bg-[#1E1E1E] border-[#FFCC00] text-[#FFCC00]'
                        : 'bg-[#161616] border-[#2A2A2A] text-[#A0A0A0]'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>UPI / QR</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                      paymentMethod === 'card'
                        ? 'bg-[#1E1E1E] border-[#FFCC00] text-[#FFCC00]'
                        : 'bg-[#161616] border-[#2A2A2A] text-[#A0A0A0]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cards</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex flex-col items-center space-y-1 transition-all ${
                      paymentMethod === 'netbanking'
                        ? 'bg-[#1E1E1E] border-[#FFCC00] text-[#FFCC00]'
                        : 'bg-[#161616] border-[#2A2A2A] text-[#A0A0A0]'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>NetBanking</span>
                  </button>
                </div>
              </div>

              {/* UPI Input / QR Preview */}
              {paymentMethod === 'upi' && (
                <div className="bg-black/60 p-4 rounded-xl border border-[#2A2A2A] space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-[#A0A0A0] mb-1">Your Virtual UPI ID:</label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full bg-[#1A1A1A] text-white px-3 py-2 rounded-lg border border-[#333333] focus:border-[#FFCC00] text-xs font-mono outline-none"
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-[11px] text-[#A0A0A0]">
                    <span className="w-2 h-2 rounded-full bg-[#FFCC00]" />
                    <span>Collect request will be routed to Google Pay / PhonePe / Paytm</span>
                  </div>
                </div>
              )}

              {/* Total Escrow Due */}
              <div className="p-4 rounded-xl bg-black border border-[#2E2E2E] flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#A0A0A0] block font-mono">Token Escrow Amount:</span>
                  <span className="text-xl font-black font-mono text-[#FFCC00]">₹5,000.00</span>
                </div>
                <div className="text-right text-[11px] text-[#A0A0A0]">
                  <span className="text-white font-semibold">100% Refundable</span>
                  <br />
                  <span>Immediate reverse refund</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-3 bg-[#1A1A1A] hover:bg-[#222222] text-[#A0A0A0] hover:text-white rounded-xl text-xs font-bold transition-colors flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
                <button
                  onClick={handleAuthorizeEscrow}
                  disabled={isProcessingPayment}
                  className="flex-1 py-3.5 bg-[#FFCC00] hover:bg-[#E6B800] text-black font-black text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,204,0,0.4)] flex items-center justify-center space-x-2"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Securing Escrow Vault...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Authorize ₹5,000 Escrow Deposit</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Success Confirmation */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FFCC00]/20 border-2 border-[#FFCC00] text-[#FFCC00] flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,204,0,0.4)]">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <h3 className="text-2xl font-black text-white uppercase">You're in the Syndicate!</h3>
                <p className="text-xs text-[#A0A0A0] mt-1 max-w-md mx-auto">
                  Your spot for <strong className="text-white">{pool.title}</strong> is locked. Dealerships have received your verified KYC commitment.
                </p>
              </div>

              {/* Receipt card */}
              <div className="bg-[#1A1A1A] p-4 rounded-xl border border-[#2E2E2E] text-left max-w-md mx-auto space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#A0A0A0]">Deposit Token:</span>
                  <span className="text-[#FFCC00] font-bold">₹5,000 (Escrow Held)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A0A0A0]">Trim & Color:</span>
                  <span className="text-white truncate max-w-[200px]">{selectedVariant} • {selectedColor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A0A0A0]">Group Insurance:</span>
                  <span className={bundleInsurance ? 'text-[#FFCC00] font-bold' : 'text-[#888888]'}>
                    {bundleInsurance ? 'Included (+15% Discount)' : 'Opted Out'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A0A0A0]">KYC State:</span>
                  <span className="text-white font-bold flex items-center">
                    <Check className="w-3 h-3 text-[#FFCC00] mr-1" />
                    Verified ({idType})
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    onClose();
                    onViewDashboard?.();
                  }}
                  className="px-6 py-3 bg-[#FFCC00] hover:bg-[#E6B800] text-black font-black text-xs rounded-xl shadow-[0_0_20px_rgba(255,204,0,0.3)]"
                >
                  View in My Dashboard
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
