import React from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { HeroSearchSection } from './components/HeroSearchSection';
import { TrustBar } from './components/TrustBar';
import { DashboardAccessCards } from './components/DashboardAccessCards';
import { FeaturedProperties } from './components/FeaturedProperties';
import { FeaturedVehicles } from './components/FeaturedVehicles';
import { StatsCounter } from './components/StatsCounter';
import { BottomCTA } from './components/BottomCTA';
import { Footer } from './components/Footer';
import { RoleLoginModal } from './components/RoleLoginModal';
import { RoleDashboardModal } from './components/RoleDashboardModal';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { LoanCalculatorModal } from './components/LoanCalculatorModal';
import { CompareDrawer } from './components/CompareDrawer';
import { TashiAIChatModal } from './components/TashiAIChatModal';
import { BackToTop } from './components/BackToTop';
import { Toast } from './components/Toast';

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF8F5] text-slate-900 selection:bg-[#9e1b27] selection:text-white">
      {/* 1. Floating Capsule Header & Bhutan Ribbon */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero Section with Tabbed Capsule Search & Popular Chips */}
        <HeroSearchSection />

        {/* 3. Trust Bar (4 Value Proposition Pills) */}
        <TrustBar />

        {/* 4. Access Your Dashboard (5 Role Access Cards) */}
        <DashboardAccessCards />

        {/* 5. Featured Properties (With Map View Toggle & Compare) */}
        <FeaturedProperties />

        {/* 6. Featured Vehicles (With Compare) */}
        <FeaturedVehicles />

        {/* 7. Stats Counter (Properties, Vehicles, Users, Verified) */}
        <StatsCounter />

        {/* 8. Bottom CTA Banner with Bhutanese Artwork */}
        <BottomCTA />
      </main>

      {/* 9. Footer with Bhutanese Textile Ribbon */}
      <Footer />

      {/* Floating Back to Top Button */}
      <BackToTop />

      {/* Floating Tashi AI Concierge Assistant */}
      <TashiAIChatModal />

      {/* Floating Side-by-Side Compare Drawer */}
      <CompareDrawer />

      {/* Modals & Overlays */}
      <RoleLoginModal />
      <RoleDashboardModal />
      <PropertyDetailModal />
      <LoanCalculatorModal />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
