import React from 'react';

export const Logo = ({ className = 'h-9', showText = true, variant = 'color' }) => {
  return (
    <div className={`flex items-center gap-2.5 select-none cursor-pointer group`}>
      {/* Visual Logo Mark with user's official gradient */}
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-purple via-[#7C5FF6] to-brand-mint flex items-center justify-center shadow-brand-sm group-hover:shadow-brand-md transition-all duration-300 transform group-hover:scale-105">
          <span className="font-display font-black text-white text-2xl tracking-tighter -mt-0.5">
            S
          </span>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-brand-mint rounded-full border-2 border-white shadow-sm animate-pulse" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-display font-extrabold text-2xl tracking-tight text-brand-carbon flex items-center leading-none">
            styluu
            <span className="w-2 h-2 rounded-full bg-brand-purple ml-0.5 inline-block"></span>
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 leading-none mt-0.5">
            Beauty & Barber OS
          </span>
        </div>
      )}
    </div>
  );
};
