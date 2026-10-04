import React, { useState, useRef, useEffect } from 'react';
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
  Compass,
  ShieldCheck,
  Smartphone,
  LogOut,
  Scissors,
  CheckCircle2
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
    currentCurrency,
    domainInfo,
    navigateToMain,
    navigateToBiz,
    navigateToApp,
    currentUser,
    isAuthenticated,
    openAuthModal,
    logout
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const userMenuRef = useRef(null);
  const currencyMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (currencyMenuRef.current && !currencyMenuRef.current.contains(event.target)) {
        setIsCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeBookingsCount = (Array.isArray(clientBookings) ? clientBookings : []).filter(b => b && b.status === 'confirmed').length;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div onClick={() => navigateToMain()} className="flex items-center cursor-pointer">
            <Logo />
          </div>

          {/* Center Navigation Links for Desktop */}
          <nav className="hidden md:flex items-center gap-1 bg-brand-soft-card p-1.5 rounded-full border border-slate-200/80">
            <button
              onClick={() => navigateToMain()}
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
              onClick={() => {
                if (currentView === 'landing') {
                  const el = document.getElementById('planes');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setCurrentView('pricing');
                } else {
                  setCurrentView('pricing');
                }
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                currentView === 'pricing'
                  ? 'bg-white text-brand-carbon shadow-sm'
                  : 'text-slate-600 hover:text-brand-carbon'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
              <span>Planes</span>
            </button>

            <button
              onClick={() => {
                if (currentView === 'landing') {
                  const el = document.getElementById('descargar-app');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else setCurrentView('download-app');
                } else {
                  setCurrentView('download-app');
                }
              }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                currentView === 'download-app'
                  ? 'bg-white text-brand-carbon shadow-sm'
                  : 'text-slate-600 hover:text-brand-carbon'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-brand-mint" />
              <span>Apps</span>
            </button>

            <button
              onClick={() => navigateToApp()}
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

          {/* Right Controls: Currency, Language & Auth / Business OS */}
          <div className="hidden lg:flex items-center gap-2.5">
            
            {/* Multi-Currency / Country Selector Dropdown */}
            <div className="relative" ref={currencyMenuRef}>
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

            {/* Business OS Access Button */}
            {currentView === 'business-os' ? (
              <button
                onClick={() => navigateToMain()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all"
              >
                <Compass className="w-4 h-4 text-brand-purple" />
                {t('nav_switch_to_client')}
              </button>
            ) : (
              <button
                onClick={() => {
                  if (isAuthenticated && currentUser?.role === 'partner') {
                    navigateToBiz();
                  } else {
                    openAuthModal('register', 'partner', 'staff');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-carbon to-[#1E252B] hover:from-black hover:to-brand-carbon text-white text-xs font-bold shadow-md hover:shadow-lg transition-all group"
              >
                <LayoutDashboard className="w-4 h-4 text-brand-mint group-hover:rotate-12 transition-transform" />
                <span>{t('nav_business')}</span>
                <span className="bg-brand-purple/40 text-brand-mint text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-extrabold border border-brand-mint/30">
                  BOOKEA
                </span>
              </button>
            )}

            {/* Unified User Profile & Authentication Controls */}
            {isAuthenticated && currentUser ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-slate-200 hover:border-brand-purple/40 hover:bg-brand-purple/5 transition-all shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-purple to-indigo-600 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                    {currentUser.name ? currentUser.name.charAt(0) : <User className="w-4 h-4" />}
                  </div>
                  <div className="text-left hidden xl:block">
                    <div className="text-xs font-bold text-slate-800 leading-tight max-w-[100px] truncate">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] text-brand-purple font-extrabold capitalize">
                      {currentUser.role === 'partner' ? 'Negocio' : 'Cliente VIP'}
                    </div>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-3 bg-slate-50 rounded-2xl mb-1 border border-slate-100">
                      <div className="font-bold text-sm text-slate-900 truncate">
                        {currentUser.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {currentUser.email}
                      </div>
                      <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-black uppercase tracking-wider">
                        {currentUser.role === 'partner' ? '💈 Socio Bublyme' : '✨ Cliente VIP'}
                      </div>
                    </div>

                    <div className="space-y-0.5 text-xs font-semibold text-slate-700">
                      <button
                        onClick={() => {
                          navigateToApp();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 flex items-center gap-2 text-left transition-colors"
                      >
                        <Calendar className="w-4 h-4 text-brand-purple" />
                        <span>Mis Reservas & Citas</span>
                      </button>

                      {currentUser.role === 'partner' && (
                        <button
                          onClick={() => {
                            navigateToBiz('calendar');
                            setIsUserMenuOpen(false);
                          }}
                          className="w-full px-3 py-2.5 rounded-xl hover:bg-brand-mint/20 text-teal-900 flex items-center gap-2 text-left transition-colors font-bold"
                        >
                          <LayoutDashboard className="w-4 h-4 text-teal-600" />
                          <span>Panel Business OS</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setCurrentView('explore');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl hover:bg-slate-100 flex items-center gap-2 text-left transition-colors"
                      >
                        <Store className="w-4 h-4 text-slate-500" />
                        <span>Explorar Salones & Spas</span>
                      </button>

                      <div className="my-1 border-t border-slate-100" />

                      <button
                        onClick={() => {
                          logout();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl hover:bg-rose-50 text-rose-600 flex items-center gap-2 text-left transition-colors font-bold"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Cerrar Sesión</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login', 'client')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-brand-purple hover:bg-brand-purple/5 transition-all border border-slate-200"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => openAuthModal('register', 'client')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-brand-purple hover:bg-brand-purple-dark shadow-brand-sm transition-all"
                >
                  Registrarme
                </button>
              </div>
            )}

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
          
          {/* Mobile Auth Header */}
          {isAuthenticated && currentUser ? (
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-sm">
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div>
                  <div className="font-bold text-sm text-slate-800">{currentUser.name}</div>
                  <div className="text-xs text-slate-500">{currentUser.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2 rounded-xl text-rose-600 bg-rose-50 hover:bg-rose-100"
                title="Cerrar sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                onClick={() => {
                  openAuthModal('login', 'client');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 text-center text-xs font-bold text-slate-700 bg-white rounded-xl shadow-xs"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  openAuthModal('register', 'client');
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 text-center text-xs font-bold text-white bg-brand-purple rounded-xl shadow-xs"
              >
                Crear Cuenta
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pb-2 border-b border-slate-100">
            <button
              onClick={() => { navigateToMain(); setIsMobileMenuOpen(false); }}
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
            onClick={() => {
              if (currentView === 'landing') {
                const el = document.getElementById('planes');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setCurrentView('pricing');
              } else {
                setCurrentView('pricing');
              }
              setIsMobileMenuOpen(false);
            }}
            className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              <span>Planes & Precios</span>
            </div>
            <span className="bg-brand-mint text-brand-carbon text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              7 Días Gratis
            </span>
          </button>

          <button
            onClick={() => {
              if (currentView === 'landing') {
                const el = document.getElementById('descargar-app');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else setCurrentView('download-app');
              } else {
                setCurrentView('download-app');
              }
              setIsMobileMenuOpen(false);
            }}
            className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-brand-mint" />
              <span>Descargar Apps (iOS & Android)</span>
            </div>
            <span className="bg-brand-purple/15 text-brand-purple text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
              PWA
            </span>
          </button>

          <button
            onClick={() => { navigateToApp(); setIsMobileMenuOpen(false); }}
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
            onClick={() => { 
              if (isAuthenticated && currentUser?.role === 'partner') {
                navigateToBiz();
              } else {
                openAuthModal('register', 'partner', 'staff');
              }
              setIsMobileMenuOpen(false); 
            }}
            className="w-full p-3.5 rounded-xl bg-gradient-to-r from-brand-carbon to-[#1E252B] text-white font-bold text-sm flex items-center justify-between shadow-lg"
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-brand-mint" />
              <span>{t('nav_business')}</span>
            </div>
            <span className="bg-brand-mint text-brand-carbon text-[11px] font-black px-2.5 py-0.5 rounded-md">
              BOOKEA
            </span>
          </button>
        </div>
      )}
    </header>
  );
};

