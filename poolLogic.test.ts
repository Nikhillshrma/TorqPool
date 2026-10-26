import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateProgress,
  isBiddingUnlocked,
  calculateSavingsBreakdown,
  findLeadingBid,
  validateDepositToken,
  validateIdFormat,
} from './poolLogic.ts';
import { DealerBid } from '../types/index.ts';

test('calculateProgress returns accurate clamped percentage', () => {
  assert.equal(calculateProgress(7, 10), 70);
  assert.equal(calculateProgress(0, 10), 0);
  assert.equal(calculateProgress(10, 10), 100);
  assert.equal(calculateProgress(12, 10), 100);
  assert.equal(calculateProgress(15, 20), 75);
});

test('isBiddingUnlocked triggers only when target is met or exceeded', () => {
  assert.equal(isBiddingUnlocked(9, 10), false);
  assert.equal(isBiddingUnlocked(10, 10), true);
  assert.equal(isBiddingUnlocked(11, 10), true);
});

test('calculateSavingsBreakdown accurately computes vehicle and bundled insurance discounts', () => {
  const result = calculateSavingsBreakdown(
    1500000, // 15L car
    10,      // 10% vehicle discount = 150k
    true,    // with insurance bundle
    60000,   // standard 60k insurance
    15       // 15% insurance discount = 9k
  );

  assert.equal(result.vehicleSavings, 150000);
  assert.equal(result.vehicleDiscountedPrice, 1350000);
  assert.equal(result.insuranceSavings, 9000);
  assert.equal(result.discountedInsuranceCost, 51000);
  assert.equal(result.totalSavings, 159000);
  assert.equal(result.totalDiscountedCost, 1401000);
});

test('findLeadingBid picks the highest cash discount dealer bid', () => {
  const bids: DealerBid[] = [
    {
      id: 'b1',
      poolId: 'p1',
      dealerName: 'Apex Hyundai',
      dealerType: 'Authorized OEM Showroom',
      city: 'Jaipur',
      rating: 4.8,
      cashDiscountPerUnit: 140000,
      freeAddons: ['Ceramic Shield'],
      deliveryGuaranteeDays: 7,
      submittedAt: '10m ago',
      isLeading: false,
    },
    {
      id: 'b2',
      poolId: 'p1',
      dealerName: 'Jaipur Central Hyundai',
      dealerType: 'Authorized OEM Showroom',
      city: 'Jaipur',
      rating: 4.9,
      cashDiscountPerUnit: 165000,
      freeAddons: ['5-Yr Warranty', 'Floor Mats'],
      deliveryGuaranteeDays: 5,
      submittedAt: '2m ago',
      isLeading: true,
    },
  ];

  const leading = findLeadingBid(bids);
  assert.ok(leading);
  assert.equal(leading?.id, 'b2');
  assert.equal(leading?.cashDiscountPerUnit, 165000);
});

test('validateDepositToken ensures ₹5000 skin-in-the-game token', () => {
  assert.equal(validateDepositToken(5000), true);
  assert.equal(validateDepositToken(10000), true);
  assert.equal(validateDepositToken(2000), false);
});

test('validateIdFormat validates Aadhaar and PAN documents', () => {
  assert.equal(validateIdFormat('Aadhaar', '987654321098'), true);
  assert.equal(validateIdFormat('Aadhaar', '1234'), false);
  assert.equal(validateIdFormat('PAN', 'ABCDE1234F'), true);
  assert.equal(validateIdFormat('PAN', 'INVALID123'), false);
});
