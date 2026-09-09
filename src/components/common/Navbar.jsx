import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { 
  Search, 
  Globe, 
  Calendar, 
  Briefcase, 
  Sparkles, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  LayoutDashboard,
  Store,
  Compass
} from 'lucide-react';

export const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { 
    currentView, 
    setCurrentView, 
    clientBookings, 
    searchQuery, 
    setSearchQuery,
    selectedCountry,
    setBusinessCountry,
    currencies,
    currentCurrency
  } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  const activeBookingsCount = clientBookings.filter(b => b.status === 'confirmed').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div onClick={() => setCurrentView('landing')} className="flex items-center cursor-pointer">
            <Logo />
          </div>

          {/* Center Navigation Links for Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-brand-soft-card p-1.5 rounded-full border border-slate-200/80">
            <button
              onClick={() => setCurrentView('landing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                currentView === 'landing'
                  ? 'bg-white text-brand-carbon shadow-sm'
                  : 'text-slate-600 hover:text-brand-carbon'
              }`}
            >
              <Compass className="w-4 h-4 text-brand-purple" />
              {t('nav_home')}
            </button>

            <button
              onClick={() => setCurrentView('explore')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                currentView === 'explore' || currentView === 'venue-detail'
                  ? 'bg-white text-brand-carbon shadow-sm'
                  : 'text-slate-600 hover:text-brand-carbon'
              }`}
            >
              <Store className="w-4 h-4 text-brand-mint" />
              {t('nav_explore')}
            </button>

            <button
              onClick={() => setCurrentView('my-bookings')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                currentView === 'my-bookings'
                  ? 'bg-white text-brand-carbon shadow-sm'
                  : 'text-slate-600 hover:text-brand-carbon'
              }`}
            >
              <Calendar className="w-4 h-4 text-brand-purple" />
              {t('nav_my_bookings')}
              {activeBookingsCount > 0 && (
                <span className="w-5 h-5 bg-brand-purple text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {activeBookingsCount}
                </span>
              )}
            </button>
          </nav>

          {/* Right Controls: Currency, Language & Switch to Styluu for Business OS */}
          <div className="hidden lg:flex items-center gap-2.5">
            
            {/* Multi-Currency / Country Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-all"
                title="Seleccionar país y moneda"
              >
                <span>{currentCurrency?.flag || '🇺🇸'}</span>
                <span>{currentCurrency?.currencyCode || 'USD'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isCurrencyDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in">
                  <div className="px-3 py-1.5 text-[10px] font-black uppercase text-slate-400 border-b border-slate-100">
                    País & Tipo de Moneda
                  </div>
                  {Object.values(currencies || {}).map((curr) => (
                    <button
                      key={curr.countryId}
                      onClick={() => {
                        setBusinessCountry(curr.countryId);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-slate-50 transition-colors ${
                        selectedCountry === curr.countryId ? 'text-brand-purple font-bold bg-brand-purple/5' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{curr.flag}</span>
                        <span>{curr.countryName}</span>
                      </div>
                      <span className="font-mono text-[11px] font-bold text-slate-400">{curr.currencyCode}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              title="Cambiar idioma / Switch language"
            >
              <Globe className="w-3.5 h-3.5 text-brand-purple" />
              <span>{language.toUpperCase()}</span>
            </button>

            {/* Switch Mode Button */}
            {currentView === 'business-os' ? (
              <button
                onClick={() => setCurrentView('landing')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
              >
                <Compass className="w-4 h-4 text-brand-purple" />
                {t('nav_switch_to_client')}
              </button>
            ) : (
              <button
                onClick={() => setCurrentView('business-os')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-carbon to-[#1E252B] hover:from-black hover:to-brand-carbon text-white text-xs font-bold shadow-md hover:shadow-lg transition-all group"
              >
                <LayoutDashboard className="w-4 h-4 text-brand-mint group-hover:rotate-12 transition-transform" />
                <span>{t('nav_business')}</span>
                <span className="bg-brand-purple/40 text-brand-mint text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold border border-brand-mint/30">
                  Fresha Pro
                </span>
              </button>
            )}

            {/* Client User avatar pill */}
            <button 
              onClick={() => setCurrentView('my-bookings')}
              className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Mi Cuenta</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg border border-slate-200 text-xs font-bold"
            >
              {language.toUpperCase()}
            </button>
            
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <button
              onClick={() => { setCurrentView('landing'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left font-bold text-sm flex items-center gap-2 ${currentView === 'landing' ? 'bg-brand-purple text-white' : 'bg-slate-50 text-slate-700'}`}
            >
              <Compass className="w-4 h-4" />
              {t('nav_home')}
            </button>
            <button
              onClick={() => { setCurrentView('explore'); setIsMobileMenuOpen(false); }}
              className={`p-3 rounded-xl text-left font-bold text-sm flex items-center gap-2 ${currentView === 'explore' ? 'bg-brand-purple text-white' : 'bg-slate-50 text-slate-700'}`}
            >
              <Store className="w-4 h-4" />
              {t('nav_explore')}
            </button>
          </div>

          <button
            onClick={() => { setCurrentView('my-bookings'); setIsMobileMenuOpen(false); }}
            className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-brand-purple" />
              <span>{t('nav_my_bookings')}</span>
            </div>
            {activeBookingsCount > 0 && (
              <span className="bg-brand-purple text-white px-2 py-0.5 rounded-full text-xs font-bold">
                {activeBookingsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => { setCurrentView('business-os'); setIsMobileMenuOpen(false); }}
            className="w-full p-3.5 rounded-xl bg-gradient-to-r from-brand-carbon to-[#1E252B] text-white font-bold text-sm flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-brand-mint" />
              <span>{t('nav_business')}</span>
            </div>
            <span className="bg-brand-mint text-brand-carbon text-[11px] font-black px-2.5 py-0.5 rounded-md">
              SaaS Pro
            </span>
          </button>
        </div>
      )}
    </header>
  );
};
