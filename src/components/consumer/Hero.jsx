import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Search, MapPin, Calendar as CalendarIcon, Sparkles, ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';

export const Hero = () => {
  const { t } = useLanguage();
  const { setCurrentView, setSearchQuery, setSelectedLocation, setSelectedCategory } = useApp();

  const [serviceInput, setServiceInput] = useState('');
  const [locationInput, setLocationInput] = useState('Miami, FL');
  const [dateInput, setDateInput] = useState('Hoy');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(serviceInput);
    setSelectedLocation(locationInput);
    setCurrentView('explore');
  };

  const quickPills = [
    { label: 'Corte de Cabello', cat: 'barber' },
    { label: 'Balayage NYC', cat: 'hair-salon' },
    { label: 'Barba VIP', cat: 'barber' },
    { label: 'Russian Manicure', cat: 'nails' },
    { label: 'Hydrafacial Spa', cat: 'spa' },
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-brand-soft-canvas to-white pt-10 pb-20 lg:pt-16 lg:pb-28">
      {/* Subtle background glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden -z-10 opacity-60">
        <div className="absolute top-4 left-1/4 w-80 h-80 bg-brand-purple/20 rounded-full blur-3xl" />
        <div className="absolute top-10 right-1/4 w-80 h-80 bg-brand-mint/25 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Floating Badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs sm:text-sm font-extrabold shadow-sm animate-pulse">
            <Sparkles className="w-4 h-4 text-brand-purple" />
            <span>{t('hero_badge')}</span>
          </div>
        </div>

        {/* Hero Main Headline */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-brand-carbon leading-[1.08]">
            {t('hero_title_1')}{' '}
            <span className="bg-gradient-to-r from-brand-purple via-[#7E69F7] to-brand-mint bg-clip-text text-transparent">
              {t('hero_title_2')}
            </span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto font-normal leading-relaxed">
            {t('hero_subtitle')}
          </p>
        </div>

        {/* High Conversion Search Box */}
        <div className="mt-10 max-w-4xl mx-auto">
          <form 
            onSubmit={handleSearch}
            className="bg-white p-2.5 sm:p-3 rounded-3xl sm:rounded-full border border-slate-200/90 shadow-brand-md hover:shadow-brand-lg transition-all duration-300"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-1 items-center">
              
              {/* Field 1: Service */}
              <div className="sm:col-span-5 flex items-center gap-3 px-4 py-3 rounded-2xl sm:rounded-full hover:bg-slate-50 transition-colors">
                <Search className="w-5 h-5 text-brand-purple flex-shrink-0" />
                <div className="text-left w-full">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t('hero_search_service')}
                  </label>
                  <input
                    type="text"
                    value={serviceInput}
                    onChange={(e) => setServiceInput(e.target.value)}
                    placeholder={t('hero_search_service_hint')}
                    className="w-full bg-transparent text-sm font-semibold text-brand-carbon placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-8 bg-slate-200" />

              {/* Field 2: Location */}
              <div className="sm:col-span-4 flex items-center gap-3 px-4 py-3 rounded-2xl sm:rounded-full hover:bg-slate-50 transition-colors">
                <MapPin className="w-5 h-5 text-brand-mint flex-shrink-0" />
                <div className="text-left w-full">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {t('hero_search_location')}
                  </label>
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder={t('hero_search_location_hint')}
                    className="w-full bg-transparent text-sm font-semibold text-brand-carbon placeholder:text-slate-400 focus:outline-none"
                  />
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full h-12 rounded-2xl sm:rounded-full bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-brand-md hover:shadow-purple-glow transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Search className="w-4 h-4" />
                  <span>{t('hero_search_btn')}</span>
                </button>
              </div>

            </div>
          </form>

          {/* Quick Search Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-400 mr-1">Populares:</span>
            {quickPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setServiceInput(pill.label);
                  setSelectedCategory(pill.cat);
                  setSearchQuery(pill.label);
                  setCurrentView('explore');
                }}
                className="px-3.5 py-1.5 rounded-full bg-white hover:bg-brand-purple/10 border border-slate-200 hover:border-brand-purple text-xs font-semibold text-slate-700 hover:text-brand-purple transition-all shadow-2xs"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Metrics Proof Badges */}
        <div className="mt-14 max-w-4xl mx-auto grid grid-cols-3 gap-4 pt-8 border-t border-slate-200/80">
          <div className="text-center">
            <div className="font-display font-black text-2xl sm:text-3xl text-brand-carbon">
              +5,000
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              {t('hero_stats_salons')}
            </div>
          </div>

          <div className="text-center border-x border-slate-200">
            <div className="font-display font-black text-2xl sm:text-3xl text-brand-purple">
              1.2M+
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              {t('hero_stats_bookings')}
            </div>
          </div>

          <div className="text-center">
            <div className="font-display font-black text-2xl sm:text-3xl text-brand-carbon flex items-center justify-center gap-1">
              <span>4.9</span>
              <Star className="w-5 h-5 text-amber-400 fill-amber-400 inline" />
            </div>
            <div className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              {t('hero_stats_rating')}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
