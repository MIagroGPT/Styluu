import React from 'react';

export const Logo = ({ 
  className = 'h-9', 
  variant = 'dark', // 'dark' (dark text for light bg) | 'white' | 'light' (white text for dark bg) | 'icon'
  showText = true,
  subtitle = 'Beauty & Barber OS',
  showSubtitle = true,
  onClick
}) => {
  const isLight = variant === 'white' || variant === 'light';

  const logoSrc = isLight 
    ? '/bublyme-logo-light.png' 
    : '/bublyme-logo-dark.png';

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none group transition-all duration-200 ${onClick ? 'cursor-pointer hover:opacity-95' : ''}`}
    >
      <img
        src={logoSrc}
        alt="Bublyme"
        className={`${className} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
      />
      {showSubtitle && subtitle && (
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full self-center ml-1 border ${
          isLight 
            ? 'bg-white/10 text-brand-mint border-white/15' 
            : 'bg-brand-purple/10 text-brand-purple border-brand-purple/20'
        }`}>
          {subtitle}
        </span>
      )}
    </div>
  );
};
