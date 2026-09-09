import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { CATEGORIES } from '../../data/mockData';
import { ArrowRight } from 'lucide-react';

export const CategoryGrid = () => {
  const { language, t } = useLanguage();
  const { setSelectedCategory, setCurrentView } = useApp();

  const handleCategoryClick = (catId) => {
    setSelectedCategory(catId);
    setCurrentView('explore');
  };

  return (
    <section className="py-16 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="font-display font-black text-3xl sm:text-4xl text-brand-carbon tracking-tight">
            {t('cat_title')}
          </h2>
          <p className="text-slate-500 text-base">
            {t('cat_subtitle')}
          </p>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {CATEGORIES.map((category) => {
            const displayName = language === 'en' ? category.nameEn : category.name;
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group relative h-56 sm:h-64 rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-brand-md transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Background */}
                <img
                  src={category.image}
                  alt={displayName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Dark Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-carbon/90 via-brand-carbon/40 to-transparent group-hover:via-brand-carbon/30 transition-colors" />

                {/* Tag pill */}
                {category.tag && (
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-extrabold uppercase tracking-wider">
                    {category.tag}
                  </div>
                )}

                {/* Bottom Content */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex flex-col justify-end">
                  <h3 className="font-display font-bold text-lg sm:text-xl text-white tracking-tight leading-snug group-hover:text-brand-mint transition-colors">
                    {displayName}
                  </h3>
                  <div className="flex items-center justify-between text-xs text-slate-300 mt-1">
                    <span>{category.count}</span>
                    <ArrowRight className="w-4 h-4 text-brand-mint opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
