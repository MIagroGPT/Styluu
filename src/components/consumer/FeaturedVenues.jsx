import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { VenueCard } from './VenueCard';
import { Sparkles, Filter, Store } from 'lucide-react';

export const FeaturedVenues = () => {
  const { t } = useLanguage();
  const { venues, selectedCategory, setSelectedCategory } = useApp();

  const filterTabs = [
    { id: 'all', label: t('featured_filter_all') },
    { id: 'barber', label: t('featured_filter_barbershop') },
    { id: 'hair-salon', label: t('featured_filter_salon') },
    { id: 'spa', label: t('featured_filter_spa') },
    { id: 'nails', label: t('featured_filter_nails') },
  ];

  const filteredVenues = venues.filter(venue => {
    if (selectedCategory === 'all') return true;
    return venue.category === selectedCategory;
  });

  return (
    <section className="py-16 bg-brand-soft-canvas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header and Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-mint/20 text-teal-800 text-xs font-black uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" />
              Styluu Marketplace
            </div>
            <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-carbon tracking-tight">
              {t('featured_title')}
            </h2>
            <p className="text-slate-500 text-sm sm:text-base max-w-xl">
              {t('featured_subtitle')}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/80 shadow-xs">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-brand-purple text-white shadow-sm'
                    : 'text-slate-600 hover:text-brand-carbon hover:bg-slate-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVenues.map((venue) => (
            <VenueCard key={venue.id} venue={venue} />
          ))}
        </div>

      </div>
    </section>
  );
};
