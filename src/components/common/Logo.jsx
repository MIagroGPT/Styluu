import React from 'react';

export const Logo = ({ 
  className = 'h-10 sm:h-11', 
  variant = 'dark', // 'dark' (dark text for light bg) | 'white' | 'light' (white text for dark bg) | 'icon'
  onClick
}) => {
  const isLight = variant === 'white' || variant === 'light';

  const logoSrc = isLight 
    ? '/bublyme-logo-light.png' 
    : '/bublyme-logo-dark.png';

  return (
    <div 
      onClick={onClick}
      className={`inline-flex items-center select-none group transition-all duration-200 py-1 ${onClick ? 'cursor-pointer hover:opacity-95' : ''}`}
    >
      <img
        src={logoSrc}
        alt="Bublyme"
        className={`${className} w-auto object-contain transition-transform duration-300 group-hover:scale-105`}
      />
    </div>
  );
};

