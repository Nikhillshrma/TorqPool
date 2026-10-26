import { DealerBid } from '../types/index.ts';

/**
 * Calculates progress percentage (0 - 100) towards reaching the dealer auction threshold
 */
export function calculateProgress(current: number, target: number): number {
  if (target <= 0) return 0;
  const percentage = (current / target) * 100;
  return Math.min(Math.max(Math.round(percentage), 0), 100);
}

/**
 * Checks if the pool has reached the threshold to trigger reverse dealer auction
 */
export function isBiddingUnlocked(current: number, target: number): boolean {
  return current >= target;
}

/**
 * Formats Indian Rupees into human-readable currency with Lakhs and Crores or standard format
 */
export function formatINR(amount: number): string {
  const formatted = Math.round(amount).toLocaleString('en-IN');
  return `₹${formatted}`;
}

/**
 * Formats compact numbers in Lacs or Crores (e.g. ₹1.45L or ₹48.2 Cr)
 */
export function formatCompactINR(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }
  return formatINR(amount);
}

/**
 * Calculates savings breakdown considering vehicle discount + optional bundled insurance
 */
export function calculateSavingsBreakdown(
  retailPrice: number,
  bulkDiscountPercentage: number,
  bundledInsurance: boolean,
  standardInsuranceCost: number,
  insuranceDiscountPercentage: number = 15
) {
  const vehicleSavings = Math.round((retailPrice * bulkDiscountPercentage) / 100);
  const vehicleDiscountedPrice = retailPrice - vehicleSavings;

  let insuranceSavings = 0;
  let discountedInsuranceCost = standardInsuranceCost;

  if (bundledInsurance && standardInsuranceCost > 0) {
    insuranceSavings = Math.round((standardInsuranceCost * insuranceDiscountPercentage) / 100);
    discountedInsuranceCost = standardInsuranceCost - insuranceSavings;
  }

  const totalOriginalCost = retailPrice + (bundledInsurance ? standardInsuranceCost : 0);
  const totalDiscountedCost = vehicleDiscountedPrice + (bundledInsurance ? discountedInsuranceCost : 0);
  const totalSavings = vehicleSavings + insuranceSavings;
  const effectiveDiscountRate = totalOriginalCost > 0 
    ? Number(((totalSavings / totalOriginalCost) * 100).toFixed(1)) 
    : 0;

  return {
    vehicleSavings,
    vehicleDiscountedPrice,
    insuranceSavings,
    discountedInsuranceCost,
    totalOriginalCost,
    totalDiscountedCost,
    totalSavings,
    effectiveDiscountRate,
  };
}

/**
 * Identifies the leading dealer bid based on highest cash discount + add-on value
 */
export function findLeadingBid(bids: DealerBid[]): DealerBid | null {
  if (!bids || bids.length === 0) return null;
  return [...bids].sort((a, b) => b.cashDiscountPerUnit - a.cashDiscountPerUnit)[0];
}

/**
 * Validates refundable deposit token requirement
 */
export function validateDepositToken(tokenAmount: number, requiredAmount: number = 5000): boolean {
  return tokenAmount >= requiredAmount;
}

/**
 * Validates Indian government identity document format
 */
export function validateIdFormat(type: 'Aadhaar' | 'PAN' | 'GSTIN', idNumber: string): boolean {
  const clean = idNumber.replace(/\s+/g, '').toUpperCase();
  if (type === 'Aadhaar') {
    // 12 digits
    return /^\d{12}$/.test(clean);
  }
  if (type === 'PAN') {
    // 5 letters, 4 numbers, 1 letter
    return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(clean);
  }
  if (type === 'GSTIN') {
    // 15 alphanumeric
    return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(clean);
  }
  return clean.length >= 6;
}
