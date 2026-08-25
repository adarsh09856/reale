import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
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

// Admin & Staff Workspace
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StaffLoginPortal } from './components/admin/StaffLoginPortal';

const AppContent = () => {
  const { isAdminView, setIsAdminView, currentUser, setCurrentUser } = useApp();

  // Listen for direct URL hashtag navigation (e.g. https://domain.com/#/admin)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#/admin' || window.location.hash === '#admin') {
        setIsAdminView(true);
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [setIsAdminView]);

  const isStaff = currentUser && (
    ['super_admin', 'admin', 'broker', 'agent', 'editor'].includes(currentUser.role) ||
    currentUser.permissions?.includes('dashboard:read')
  );

  // -------------------------------------------------------------
  // ISOLATED INTERNAL STAFF & CRM WORKSPACE (Unlisted Direct Route)
  // -------------------------------------------------------------
  if (isAdminView) {
    if (!isStaff) {
      return (
        <div className="min-h-screen bg-[#0B132B]">
          <StaffLoginPortal
            onLoginSuccess={(staffUser) => {
              setCurrentUser(staffUser);
            }}
            onBackToPublic={() => {
              window.location.hash = '';
              setIsAdminView(false);
            }}
          />
          <Toast />
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-[#F4F6F9]">
        <AdminDashboard
          onExitAdmin={() => {
            window.location.hash = '';
            setIsAdminView(false);
          }}
        />
        <Toast />
      </div>
    );
  }

  // -------------------------------------------------------------
  // PUBLIC-FACING CUSTOMER MARKETPLACE (Zero Admin Links)
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FAF8F5] text-slate-900 selection:bg-[#9e1b27] selection:text-white">
      {/* 1. Floating Capsule Header & Bhutan Ribbon */}
      <Header />

      <main className="flex-1">
        {/* 2. Hero Section with Tabbed Capsule Search & Popular Chips */}
        <HeroSearchSection />

        {/* 3. Trust Bar (4 Value Proposition Pills) */}
        <TrustBar />

        {/* 4. Client & Investor Services (Public Services Grid) */}
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

      {/* 9. Full Footer */}
      <Footer />

      {/* 10. Floating Interactive Drawers & Overlays */}
      <BackToTop />
      <CompareDrawer />
      <TashiAIChatModal />

      {/* 11. Customer Modals */}
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
