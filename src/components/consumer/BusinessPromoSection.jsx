import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  CreditCard, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  Smartphone,
  ShieldCheck,
  Zap,
  Play
} from 'lucide-react';

export const BusinessPromoSection = () => {
  const { t } = useLanguage();
  const { setCurrentView, setBusinessTab } = useApp();
  const [activeFeatureTab, setActiveFeatureTab] = useState(0);

  const features = [
    {
      title: t('biz_feat_1_title'),
      desc: t('biz_feat_1_desc'),
      icon: Calendar,
      color: 'from-brand-purple to-[#8168F9]',
      tabKey: 'calendar'
    },
    {
      title: t('biz_feat_2_title'),
      desc: t('biz_feat_2_desc'),
      icon: CreditCard,
      color: 'from-teal-500 to-brand-mint',
      tabKey: 'pos'
    },
    {
      title: t('biz_feat_3_title'),
      desc: t('biz_feat_3_desc'),
      icon: Smartphone,
      color: 'from-pink-500 to-rose-400',
      tabKey: 'appointments'
    },
    {
      title: t('biz_feat_4_title'),
      desc: t('biz_feat_4_desc'),
      icon: TrendingUp,
      color: 'from-amber-500 to-orange-400',
      tabKey: 'analytics'
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-brand-carbon text-white relative overflow-hidden">
      {/* Dynamic background lights */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-brand-purple/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-brand-mint/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Pitch */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-mint/15 border border-brand-mint/30 text-brand-mint text-xs font-black tracking-widest uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            {t('biz_pitch_badge')}
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
            {t('biz_pitch_title')}
          </h2>

          <p className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {t('biz_pitch_subtitle')}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => {
                setCurrentView('business-os');
                setBusinessTab('calendar');
              }}
              className="px-7 py-3.5 rounded-2xl bg-brand-purple hover:bg-brand-purple-dark text-white font-black text-sm sm:text-base shadow-lg hover:shadow-purple-glow transition-all flex items-center gap-2 group"
            >
              <span>{t('biz_cta_btn')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => {
                setCurrentView('business-os');
                setBusinessTab('calendar');
              }}
              className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm sm:text-base border border-slate-700 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-brand-mint fill-brand-mint" />
              <span>{t('biz_cta_demo')}</span>
            </button>
          </div>
        </div>

        {/* Interactive Showcase Preview Board (Fresha-style multi-staff calendar representation) */}
        <div className="mt-12 bg-slate-900/90 rounded-3xl sm:rounded-4xl border border-slate-700/80 p-4 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* Top Bar of the SaaS mockup */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-slate-400 pl-2">
                styluu.com/business-os/calendar
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-brand-purple/20 text-brand-purple text-xs font-bold border border-brand-purple/30">
                Live Scheduler
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-brand-mint text-xs font-bold border border-emerald-500/30 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-mint animate-pulse" />
                Sincronizado en tiempo real
              </span>
            </div>
          </div>

          {/* Mini Interactive Multi-Staff Calendar Grid Preview */}
          <div className="pt-6 overflow-x-auto">
            <div className="min-w-[700px]">
              
              {/* Staff Headers Row */}
              <div className="grid grid-cols-6 gap-3 pb-4 border-b border-slate-800 text-xs font-bold text-slate-300">
                <div className="text-slate-500 font-mono">HORA</div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-[10px] text-white">JT</div>
                  <span>John (Barber)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-teal-400 text-brand-carbon flex items-center justify-center text-[10px] font-black">MS</div>
                  <span>Maria (Color)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-pink-500 flex items-center justify-center text-[10px] text-white">WL</div>
                  <span>Wendy (Spa)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-[10px] text-white">AJ</div>
                  <span>Amy (Nails)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-sky-500 flex items-center justify-center text-[10px] text-white">MV</div>
                  <span>Michael (Barber)</span>
                </div>
              </div>

              {/* Time rows with simulated appointments */}
              <div className="divide-y divide-slate-800/60 font-sans text-xs">
                
                {/* Row 9:00 AM */}
                <div className="grid grid-cols-6 gap-3 py-3 items-center">
                  <span className="text-slate-500 font-mono">09:00 AM</span>
                  <div className="p-2.5 rounded-xl bg-purple-600/90 text-white font-medium shadow-sm hover:scale-102 transition-transform cursor-pointer">
                    <div className="font-bold text-[11px]">Derrick Johnson</div>
                    <div className="text-[10px] opacity-80">Corte + Barba VIP</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-teal-500/90 text-brand-carbon font-medium shadow-sm hover:scale-102 transition-transform cursor-pointer">
                    <div className="font-bold text-[11px]">Brenda Massey</div>
                    <div className="text-[10px] opacity-90">Blowout NYC & Glow</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-dashed border-slate-700 text-slate-500 text-center py-2 rounded-xl">
                    Disponible
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/90 text-white font-medium shadow-sm">
                    <div className="font-bold text-[11px]">Megan White</div>
                    <div className="text-[10px] opacity-80">Russian Manicure</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-dashed border-slate-700 text-slate-500 text-center py-2 rounded-xl">
                    Disponible
                  </div>
                </div>

                {/* Row 10:00 AM */}
                <div className="grid grid-cols-6 gap-3 py-3 items-center">
                  <span className="text-slate-500 font-mono">10:00 AM</span>
                  <div className="p-2.5 rounded-xl bg-purple-600/90 text-white font-medium shadow-sm">
                    <div className="font-bold text-[11px]">Alex Rodriguez</div>
                    <div className="text-[10px] opacity-80">Fade Skin Master</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-teal-500/90 text-brand-carbon font-medium shadow-sm">
                    <div className="font-bold text-[11px]">Alena Geidt</div>
                    <div className="text-[10px] opacity-90">Balayage Completo</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-pink-500/90 text-white font-medium shadow-sm">
                    <div className="font-bold text-[11px]">James Horwitz</div>
                    <div className="text-[10px] opacity-80">Masaje Holístico</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-500/90 text-white font-medium shadow-sm">
                    <div className="font-bold text-[11px]">Lucy Evans</div>
                    <div className="text-[10px] opacity-80">Gel-X Extensions</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-sky-500/90 text-white font-medium shadow-sm">
                    <div className="font-bold text-[11px]">Zain Dias</div>
                    <div className="text-[10px] opacity-80">Corte + Barba Express</div>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* 4 Feature pillars below preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-800">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx}
                  onClick={() => {
                    setCurrentView('business-os');
                    setBusinessTab(feat.tabKey);
                  }}
                  className="p-5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-brand-mint/40 transition-all cursor-pointer group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${feat.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white group-hover:text-brand-mint transition-colors mb-1">
                    {feat.title}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
};
