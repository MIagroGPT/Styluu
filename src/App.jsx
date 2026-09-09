import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { NotificationToast } from './components/common/NotificationToast';
import { Hero } from './components/consumer/Hero';
import { CategoryGrid } from './components/consumer/CategoryGrid';
import { FeaturedVenues } from './components/consumer/FeaturedVenues';
import { BusinessPromoSection } from './components/consumer/BusinessPromoSection';
import { VenueDetailView } from './components/consumer/VenueDetailView';
import { BookingFlowModal } from './components/booking/BookingFlowModal';
import { ClientPortal } from './components/client/ClientPortal';
import { BusinessOS } from './components/business/BusinessOS';
import { Sparkles, ArrowRight, ShieldCheck, Check } from 'lucide-react';

const MainContent = () => {
  const { currentView } = useApp();

  // If Business OS mode is active, render the dedicated SaaS layout
  if (currentView === 'business-os') {
    return (
      <div className="min-h-screen bg-brand-soft-canvas text-brand-carbon">
        <BusinessOS />
        <NotificationToast />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-brand-soft-canvas text-brand-carbon font-sans selection:bg-brand-purple selection:text-white">
      {/* Universal Top Header */}
      <Navbar />

      {/* Dynamic View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <>
            <Hero />
            <CategoryGrid />
            <FeaturedVenues />
            <BusinessPromoSection />
          </>
        )}

        {currentView === 'explore' && (
          <div className="py-8">
            <FeaturedVenues />
          </div>
        )}

        {currentView === 'venue-detail' && (
          <VenueDetailView />
        )}

        {currentView === 'my-bookings' && (
          <ClientPortal />
        )}
      </main>

      {/* Universal Modal and Toasts */}
      <BookingFlowModal />
      <NotificationToast />

      {/* Universal Footer */}
      <Footer />
    </div>
  );
};

export function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <MainContent />
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;
