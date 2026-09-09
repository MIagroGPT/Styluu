import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { 
  ShieldCheck, 
  CreditCard, 
  Smartphone,
  Sparkles,
  ArrowUpRight,
  Globe
} from 'lucide-react';

export const Footer = () => {
  const { t } = useLanguage();
  const { setCurrentView, setBusinessTab } = useApp();

  return (
    <footer className="bg-brand-carbon text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-purple to-brand-mint flex items-center justify-center font-display font-black text-xl text-white">
                S
              </div>
              <span className="font-display font-black text-2xl tracking-tight text-white">
                styluu<span className="text-brand-mint">.com</span>
              </span>
            </div>
            
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              {t('footer_tagline')} Conectamos a los mejores profesionales del cuidado personal con clientes exigentes en todo el mundo.
            </p>

            {/* Social SVGs */}
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-brand-purple flex items-center justify-center text-slate-300 hover:text-white transition-all text-xs font-bold">
                IG
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-brand-purple flex items-center justify-center text-slate-300 hover:text-white transition-all text-xs font-bold">
                X
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-brand-purple flex items-center justify-center text-slate-300 hover:text-white transition-all text-xs font-bold">
                FB
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800/80 hover:bg-brand-purple flex items-center justify-center text-slate-300 hover:text-white transition-all text-xs font-bold">
                IN
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <ShieldCheck className="w-4 h-4 text-brand-mint" />
                HIPAA & SOC-2 Ready
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50">
                <CreditCard className="w-4 h-4 text-brand-mint" />
                Stripe / Apple Pay Secure
              </span>
            </div>
          </div>

          {/* Column 1: Marketplace / Clientes */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
              Marketplace
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><button onClick={() => setCurrentView('explore')} className="hover:text-brand-mint transition-colors">Barberías en Miami</button></li>
              <li><button onClick={() => setCurrentView('explore')} className="hover:text-brand-mint transition-colors">Salones en New York</button></li>
              <li><button onClick={() => setCurrentView('explore')} className="hover:text-brand-mint transition-colors">Spas en Los Ángeles</button></li>
              <li><button onClick={() => setCurrentView('explore')} className="hover:text-brand-mint transition-colors">Manicura & Nails</button></li>
              <li><button onClick={() => setCurrentView('explore')} className="hover:text-brand-mint transition-colors">Tratamientos Faciales</button></li>
              <li><button onClick={() => setCurrentView('my-bookings')} className="hover:text-brand-mint transition-colors">Mis Citas & Reservas</button></li>
            </ul>
          </div>

          {/* Column 2: Styluu for Business (SaaS) */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-brand-mint uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Styluu for Business
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><button onClick={() => { setCurrentView('business-os'); setBusinessTab('calendar'); }} className="hover:text-white transition-colors flex items-center gap-1">Calendario Multi-Staff <ArrowUpRight className="w-3 h-3 text-slate-500" /></button></li>
              <li><button onClick={() => { setCurrentView('business-os'); setBusinessTab('pos'); }} className="hover:text-white transition-colors flex items-center gap-1">Punto de Venta POS <ArrowUpRight className="w-3 h-3 text-slate-500" /></button></li>
              <li><button onClick={() => { setCurrentView('business-os'); setBusinessTab('clients'); }} className="hover:text-white transition-colors flex items-center gap-1">CRM & Fidelización <ArrowUpRight className="w-3 h-3 text-slate-500" /></button></li>
              <li><button onClick={() => { setCurrentView('business-os'); setBusinessTab('analytics'); }} className="hover:text-white transition-colors flex items-center gap-1">Reportes & Métricas <ArrowUpRight className="w-3 h-3 text-slate-500" /></button></li>
              <li><button onClick={() => { setCurrentView('business-os'); setBusinessTab('team'); }} className="hover:text-white transition-colors flex items-center gap-1">Comisiones & Staff <ArrowUpRight className="w-3 h-3 text-slate-500" /></button></li>
            </ul>
          </div>

          {/* Column 3: App & Hosting */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-200 uppercase tracking-wider">
              Descarga la App
            </h4>
            <p className="text-xs text-slate-400">
              Lleva tus citas en el bolsillo o gestiona tu negocio desde cualquier lugar.
            </p>
            <div className="space-y-2 pt-1">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3 hover:border-brand-mint/50 transition-all cursor-pointer">
                <Smartphone className="w-5 h-5 text-brand-mint" />
                <div className="text-left">
                  <div className="text-[10px] text-slate-400 uppercase">Disponible en</div>
                  <div className="text-xs font-bold text-white">App Store & Google Play</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} Styluu Inc. ({t('footer_rights')})
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-200 transition-colors">{t('footer_privacy')}</a>
            <a href="#" className="hover:text-slate-200 transition-colors">{t('footer_terms')}</a>
            <a href="#" className="hover:text-slate-200 transition-colors">{t('footer_cookies')}</a>
            <span className="text-slate-600">|</span>
            <span className="text-brand-mint font-semibold">www.styluu.com</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
