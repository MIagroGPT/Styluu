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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Styluu UI Error caught:", error, errorInfo);
  }
  handleReload = () => {
    window.location.reload();
  };
  handleHome = () => {
    try { localStorage.removeItem('styluu_view'); } catch {}
    window.location.href = '/';
  };
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 text-center font-sans">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-4 border border-slate-100">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold text-2xl">
              ✨
            </div>
            <h2 className="text-xl font-black text-slate-900">Styluu</h2>
            <p className="text-xs text-slate-500">
              Haz clic abajo para refrescar y continuar donde estabas.
            </p>
            <div className="space-y-2 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3.5 px-6 bg-brand-purple text-white rounded-2xl font-bold hover:opacity-95 transition-all shadow-brand-sm"
              >
                Recargar página
              </button>
              <button
                onClick={this.handleHome}
                className="w-full py-2.5 px-6 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 transition-all"
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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

  const isKnownView = ['landing', 'explore', 'venue-detail', 'my-bookings'].includes(currentView);

  return (
    <div className="min-h-screen flex flex-col bg-brand-soft-canvas text-brand-carbon font-sans selection:bg-brand-purple selection:text-white">
      {/* Universal Top Header */}
      <Navbar />

      {/* Dynamic View Router */}
      <main className="flex-1">
        {(currentView === 'landing' || !isKnownView) && (
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
    <ErrorBoundary>
      <LanguageProvider>
        <AppProvider>
          <MainContent />
        </AppProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}

export default App;
