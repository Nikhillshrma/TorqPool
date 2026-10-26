import React, { useState } from 'react';
import { Header } from './components/Header.tsx';
import { HeroSection } from './components/HeroSection.tsx';
import { HowItWorks } from './components/HowItWorks.tsx';
import { Marketplace } from './components/Marketplace.tsx';
import { JoinPoolModal } from './components/JoinPoolModal.tsx';
import { PoolDetailModal } from './components/PoolDetailModal.tsx';
import { UserDashboard } from './components/UserDashboard.tsx';
import { VendorBiddingView } from './components/VendorBiddingView.tsx';
import { CreatePoolModal } from './components/CreatePoolModal.tsx';
import { Footer } from './components/Footer.tsx';
import { INITIAL_POOLS, INITIAL_TICKER_DEALS } from './data/mockData.ts';
import { Pool, JoinedPoolRecord, DealerBid } from './types/index.ts';

export default function App() {
  // Navigation View State
  const [activeView, setActiveView] = useState<'marketplace' | 'dashboard' | 'vendor'>('marketplace');

  // Core Application Data State
  const [pools, setPools] = useState<Pool[]>(INITIAL_POOLS);
  const [deals] = useState(INITIAL_TICKER_DEALS);

  // Pre-seed 1 joined pool so User Dashboard is immediately interactive and demonstrable
  const [joinedRecords, setJoinedRecords] = useState<JoinedPoolRecord[]>([
    {
      poolId: 'pool-creta-jpr',
      joinedAt: '2 hours ago',
      tokenPaid: 5000,
      escrowTxId: 'ESC-789214',
      selectedVariant: '1.5L Turbo Petrol DCT SX(O)',
      selectedColor: 'Abyss Black Pearl',
      bundledInsurance: true,
      kycStatus: 'verified',
      applicantName: 'Rahul Verma',
      applicantPhone: '+91 98201 44521',
      applicantCity: 'Jaipur',
      idType: 'Aadhaar',
      idNumber: '8721 9904 1238',
    },
  ]);

  // Modals state
  const [selectedPoolForDetail, setSelectedPoolForDetail] = useState<Pool | null>(null);
  const [selectedPoolForJoin, setSelectedPoolForJoin] = useState<Pool | null>(null);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreatePoolModalOpen, setIsCreatePoolModalOpen] = useState(false);

  // Joined pool IDs
  const joinedPoolIds = joinedRecords.map((r) => r.poolId);

  // Open Pool Details Modal
  const handleSelectPool = (pool: Pool) => {
    setSelectedPoolForDetail(pool);
    setIsDetailModalOpen(true);
  };

  // Open Join Flow Modal
  const handleOpenJoinFlow = (pool: Pool) => {
    setSelectedPoolForJoin(pool);
    setIsJoinModalOpen(true);
  };

  // Complete Join Flow Handler (Token paid, KYC verified, variant chosen)
  const handleCompleteJoin = (record: JoinedPoolRecord) => {
    // 1. Add record to user's joined list if not already present
    setJoinedRecords((prev) => {
      const exists = prev.some((r) => r.poolId === record.poolId);
      if (exists) return prev;
      return [record, ...prev];
    });

    // 2. Increment pool buyers and escrow
    setPools((prev) =>
      prev.map((p) => {
        if (p.id === record.poolId) {
          const updatedBuyers = p.currentBuyers + 1;
          const isFull = updatedBuyers >= p.targetBuyers;
          return {
            ...p,
            currentBuyers: updatedBuyers,
            escrowPoolLockedAmount: p.escrowPoolLockedAmount + 5000,
            status: isFull ? 'ready_for_bids' : p.status,
          };
        }
        return p;
      })
    );
  };

  // Simulate +1 buyer in a pool (for testing progress transitions)
  const handleSimulateJoinOne = (poolId: string) => {
    setPools((prev) =>
      prev.map((p) => {
        if (p.id === poolId) {
          const next = p.currentBuyers + 1;
          return {
            ...p,
            currentBuyers: next,
            escrowPoolLockedAmount: p.escrowPoolLockedAmount + 5000,
            status: next >= p.targetBuyers ? 'ready_for_bids' : p.status,
          };
        }
        return p;
      })
    );
  };

  // Simulate pool hitting 10/10 quorum to immediately test Radar animation
  const handleSimulateFillPool = (poolId: string) => {
    setPools((prev) =>
      prev.map((p) => {
        if (p.id === poolId) {
          return {
            ...p,
            currentBuyers: p.targetBuyers,
            escrowPoolLockedAmount: p.targetBuyers * 5000,
            status: 'ready_for_bids',
          };
        }
        return p;
      })
    );
  };

  // Handle dealer bidding submission from Vendor Portal
  const handleSubmitDealerBid = (newBid: DealerBid) => {
    setPools((prev) =>
      prev.map((p) => {
        if (p.id === newBid.poolId) {
          // Compare with existing bids
          const updatedBids = [newBid, ...p.bids.map((b) => ({ ...b, isLeading: false }))];
          return {
            ...p,
            bids: updatedBids,
            status: 'bidding_active',
          };
        }
        return p;
      })
    );
  };

  // Handle user creating a new buying pool
  const handleCreatePool = (newPool: Pool) => {
    setPools((prev) => [newPool, ...prev]);

    // Automatically join creator into the pool with verified status
    const creatorRecord: JoinedPoolRecord = {
      poolId: newPool.id,
      joinedAt: 'Just now',
      tokenPaid: 5000,
      escrowTxId: `ESC-${Math.floor(100000 + Math.random() * 900000)}`,
      selectedVariant: newPool.variants[0] || 'Standard',
      selectedColor: newPool.colors[0]?.name || 'Standard',
      bundledInsurance: true,
      kycStatus: 'verified',
      applicantName: 'Syndicate Creator',
      applicantPhone: '+91 98201 00000',
      applicantCity: newPool.city,
      idType: 'Aadhaar',
      idNumber: '9900 1122 3344',
    };

    setJoinedRecords((prev) => [creatorRecord, ...prev]);
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FFCC00] selection:text-black">
      {/* Top Header */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        joinedCount={joinedRecords.length}
        onOpenCreatePool={() => setIsCreatePoolModalOpen(true)}
      />

      {/* Main View Router */}
      <main>
        {activeView === 'marketplace' && (
          <>
            <HeroSection
              deals={deals}
              onExplorePools={() => {
                const el = document.getElementById('marketplace-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenVendorPortal={() => setActiveView('vendor')}
            />

            <HowItWorks
              onJoinClick={() => {
                const el = document.getElementById('marketplace-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <Marketplace
              pools={pools}
              joinedPoolIds={joinedPoolIds}
              onSelectPool={handleSelectPool}
              onJoinPool={handleOpenJoinFlow}
            />
          </>
        )}

        {activeView === 'dashboard' && (
          <UserDashboard
            joinedRecords={joinedRecords}
            pools={pools}
            onExploreMore={() => setActiveView('marketplace')}
            onSimulateFillPool={handleSimulateFillPool}
            onAcceptBid={(poolId, bidId) => {
              console.log('Accepted bid:', bidId, 'for pool:', poolId);
            }}
          />
        )}

        {activeView === 'vendor' && (
          <VendorBiddingView
            pools={pools}
            onSubmitBid={handleSubmitDealerBid}
            onSwitchToBuyer={() => setActiveView('marketplace')}
          />
        )}
      </main>

      {/* Modals */}
      <JoinPoolModal
        pool={selectedPoolForJoin}
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onCompleteJoin={handleCompleteJoin}
        onViewDashboard={() => setActiveView('dashboard')}
      />

      <PoolDetailModal
        pool={selectedPoolForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onOpenJoin={handleOpenJoinFlow}
        onSimulateJoinOne={handleSimulateJoinOne}
        isJoined={selectedPoolForDetail ? joinedPoolIds.includes(selectedPoolForDetail.id) : false}
      />

      <CreatePoolModal
        isOpen={isCreatePoolModalOpen}
        onClose={() => setIsCreatePoolModalOpen(false)}
        onCreatePool={handleCreatePool}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
