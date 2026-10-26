export type VehicleCategory = 'cars' | 'bikes' | 'commercial';
export type ServiceType = 'vehicle' | 'insurance' | 'bundle';
export type PoolStatus = 'filling' | 'ready_for_bids' | 'bidding_active' | 'closed';

export interface DealerBid {
  id: string;
  poolId: string;
  dealerName: string;
  dealerType: 'Authorized OEM Showroom' | 'Direct Underwriter' | 'Fleet Distributor';
  city: string;
  rating: number;
  cashDiscountPerUnit: number;
  freeAddons: string[];
  deliveryGuaranteeDays: number;
  submittedAt: string;
  isLeading: boolean;
  notes?: string;
}

export interface Pool {
  id: string;
  title: string;
  subtitle: string;
  category: VehicleCategory;
  serviceType: ServiceType;
  city: string;
  brand: string;
  model: string;
  currentBuyers: number;
  targetBuyers: number;
  retailPrice: number;
  estimatedBulkPrice: number;
  bulkDiscountPercentage: number;
  tokenDepositAmount: number; // ₹5,000 standard
  insuranceDiscountPercentage: number; // e.g. 15% extra discount
  standardInsuranceCost: number;
  expiryHoursLeft: number;
  status: PoolStatus;
  imageUrl: string;
  specs: {
    engine?: string;
    transmission?: string;
    mileage?: string;
    seating?: string;
    coverage?: string;
    fleetSizeMin?: string;
  };
  variants: string[];
  colors: { name: string; hex: string }[];
  escrowPoolLockedAmount: number;
  bids: DealerBid[];
}

export interface JoinedPoolRecord {
  poolId: string;
  joinedAt: string;
  tokenPaid: number;
  escrowTxId: string;
  selectedVariant: string;
  selectedColor: string;
  bundledInsurance: boolean;
  kycStatus: 'verified' | 'pending';
  applicantName: string;
  applicantPhone: string;
  applicantCity: string;
  idType: 'Aadhaar' | 'PAN' | 'GSTIN';
  idNumber: string;
  acceptedBidId?: string;
}

export interface TickerDeal {
  id: string;
  vehicle: string;
  location: string;
  units: number;
  discountSaved: string;
  totalSaved: string;
  badge: string;
}
