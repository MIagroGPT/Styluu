import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Star, MapPin, Sparkles, Check, Clock, ChevronRight } from 'lucide-react';

export const VenueCard = ({ venue }) => {
  const { language, t } = useLanguage();
  const { openBookingModal, setSelectedVenue, setCurrentView, formatMoney } = useApp();

  const handleCardClick = () => {
    setSelectedVenue(venue);
    setCurrentView('venue-detail');
  };

  const handleBookClick = (e) => {
    e.stopPropagation();
    openBookingModal(venue);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-3xl border border-slate-200/80 hover:border-brand-purple/30 shadow-sm hover:shadow-brand-md transition-all duration-300 flex flex-col overflow-hidden cursor-pointer transform hover:-translate-y-1"
    >
      {/* Top Image Container */}
      <div className="relative h-52 sm:h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={venue.image}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {venue.badges?.map((badge, idx) => (
            <span 
              key={idx} 
              className="px-2.5 py-1 rounded-full bg-brand-carbon/80 backdrop-blur-md text-white text-[10px] font-bold tracking-wide uppercase border border-white/10"
            >
              {badge}
            </span>
          ))}
        </div>

        {/* Rating Pill */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md text-brand-carbon">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-black">{venue.rating.toFixed(1)}</span>
          <span className="text-[11px] text-slate-400 font-medium">({venue.reviewsCount})</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category & Distance */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-medium">
            <span className="text-brand-purple font-bold uppercase tracking-wider text-[11px]">
              {venue.category.toUpperCase()}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-mint" />
              {venue.city}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-lg text-brand-carbon group-hover:text-brand-purple transition-colors leading-snug">
            {venue.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-medium">
            {venue.tagline}
          </p>

          {/* Featured Service Item */}
          {venue.services && venue.services[0] && (
            <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-mint" />
                <span className="line-clamp-1">{language === 'en' ? venue.services[0].nameEn : venue.services[0].name}</span>
              </div>
              <span className="font-bold text-brand-carbon">
                {formatMoney(venue.services[0].price)}
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-semibold block leading-none">
              {t('from_price')}
            </span>
            <span className="font-display font-black text-lg text-brand-carbon leading-tight">
              {formatMoney(venue.startingPrice)}
            </span>
          </div>

          <button
            onClick={handleBookClick}
            className="px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold text-xs shadow-sm hover:shadow-brand-sm transition-all duration-200 flex items-center gap-1.5"
          >
            <span>{t('book_now')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
