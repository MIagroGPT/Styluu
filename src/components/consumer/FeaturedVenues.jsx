import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { VenueCard } from './VenueCard';
import { InteractiveVenueMap } from './InteractiveVenueMap';
import { Sparkles, Filter, Store, Map, List, MapPin, SlidersHorizontal } from 'lucide-react';

export const FeaturedVenues = () => {
  const { t } = useLanguage();
  const { venues, selectedCategory, setSelectedCategory, currentView } = useApp();

  const [showMap, setShowMap] = useState(true);
  const [hoveredVenueId, setHoveredVenueId] = useState(null);

  const filterTabs = [
    { id: 'all', label: t('featured_filter_all') || 'Todos los locales' },
    { id: 'barber', label: '💈 Barbería' },
    { id: 'hair-salon', label: '💇 Peluquería' },
    { id: 'spa', label: '🧖 Spa & Relax' },
    { id: 'nails', label: '💅 Nails Studio' },
  ];

  const filteredVenues = (venues || []).filter(venue => {
    if (!venue) return false;
    if (selectedCategory === 'all') return true;
    return venue.category === selectedCategory;
  });

  return (
    <section className="py-12 lg:py-16 bg-brand-soft-canvas min-h-screen">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header and Filter Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8 pb-6 border-b border-slate-200/80">
          
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint/20 text-teal-900 text-xs font-black uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" />
              Directorio Geolocalizado Bublyme
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-brand-carbon tracking-tight">
              {t('featured_title')}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              {filteredVenues.length} establecimientos verificados disponibles para reservar hoy
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            
            {/* Filter Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === tab.id
                      ? 'bg-brand-purple text-white shadow-sm'
                      : 'text-slate-600 hover:text-brand-carbon hover:bg-slate-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Toggle Map / List View Button (Fresha Style) */}
            <button
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black text-xs border shadow-sm transition-all ${
                showMap 
                  ? 'bg-brand-carbon text-white border-brand-carbon shadow-md' 
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {showMap ? (
                <>
                  <List className="w-4 h-4 text-brand-mint" />
                  <span>Ocultar Mapa</span>
                </>
              ) : (
                <>
                  <Map className="w-4 h-4 text-brand-purple" />
                  <span>Ver Mapa en Vivo</span>
                </>
              )}
            </button>

          </div>
        </div>

        {/* Main Content: Split View (List + Interactive Map) */}
        {showMap ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Venue Cards Grid */}
            <div className="lg:col-span-7 xl:col-span-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {filteredVenues.map((venue) => (
                  <VenueCard 
                    key={venue.id} 
                    venue={venue} 
                    isHovered={hoveredVenueId === venue.id}
                    onMouseEnter={() => setHoveredVenueId(venue.id)}
                    onMouseLeave={() => setHoveredVenueId(null)}
                  />
                ))}
              </div>

              {filteredVenues.length === 0 && (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
                  <p className="text-slate-500 font-bold text-sm">No encontramos salones en esta categoría.</p>
                  <button 
                    onClick={() => setSelectedCategory('all')}
                    className="mt-4 px-4 py-2 bg-brand-purple text-white rounded-xl text-xs font-bold"
                  >
                    Ver todos los locales
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Interactive Live Map */}
            <div className="hidden lg:block lg:col-span-5 xl:col-span-6 sticky top-28 h-[calc(100vh-140px)]">
              <InteractiveVenueMap 
                venues={filteredVenues}
                selectedVenueId={hoveredVenueId}
                onSelectVenue={(venue) => setHoveredVenueId(venue?.id)}
              />
            </div>

          </div>
        ) : (
          /* Full Width Grid when Map is hidden */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVenues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedVenues;
