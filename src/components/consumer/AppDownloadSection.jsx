import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Smartphone, 
  QrCode, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Store, 
  User, 
  Calendar, 
  CreditCard, 
  BellRing, 
  Zap, 
  ShieldCheck, 
  ExternalLink,
  ArrowRight,
  Star,
  Share2,
  Plus
} from 'lucide-react';

export const AppDownloadSection = () => {
  const { t } = useLanguage();
  const { navigateToApp, navigateToBiz, domainInfo } = useApp();
  const [activeTab, setActiveTab] = useState('client'); // 'client' | 'business'
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [qrAppType, setQrAppType] = useState('client');

  const clientAppUrl = domainInfo?.appBaseUrl || 'https://app.bublyme.com';
  const bizAppUrl = domainInfo?.bizBaseUrl || 'https://biz.bublyme.com';

  const handleOpenQr = (type) => {
    setQrAppType(type);
    setIsQrModalOpen(true);
  };

  return (
    <section id="descargar-app" className="py-20 lg:py-28 bg-slate-950 text-white relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-brand-purple/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-40 w-96 h-96 bg-brand-mint/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-brand-mint text-xs font-black uppercase tracking-wider">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Ecosistema Móvil Bublyme</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            Lleva el poder de Bublyme en tu bolsillo.{' '}
            <span className="bg-gradient-to-r from-brand-mint via-teal-300 to-brand-purple bg-clip-text text-transparent">
              2 Apps para tu estilo de vida.
            </span>
          </h2>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Una aplicación diseñada para <strong>clientes</strong> que buscan agendar en segundos, y otra potente app para <strong>dueños y profesionales</strong> que gestionan su negocio.
          </p>

          {/* App Switcher Tabs */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <div className="bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 inline-flex items-center shadow-xl">
              <button
                type="button"
                onClick={() => setActiveTab('client')}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'client'
                    ? 'bg-brand-purple text-white shadow-brand-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Bublyme App (Clientes)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('business')}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === 'business'
                    ? 'bg-gradient-to-r from-teal-500 to-brand-mint text-brand-carbon shadow-brand-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Bublyme Biz (Negocios)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic App Showcase Card */}
        {activeTab === 'client' ? (
          /* 📱 CLIENT APP SHOWCASE */
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/50 rounded-3xl sm:rounded-4xl border border-slate-800 p-6 sm:p-12 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Info & Download Links */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-black uppercase tracking-wider border border-purple-500/30">
                    Para Clientes & Usuarios
                  </span>
                  <span className="text-xs text-amber-400 font-bold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    4.9 ★ (18.4K valoraciones)
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-4xl text-white leading-tight">
                  Reserva en tus salones y barberías favoritas en 3 clics
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Descubre los mejores especialistas de tu ciudad, consulta disponibilidad en tiempo real, reprograma citas sin llamadas y acumula beneficios VIP.
                </p>

                {/* Features List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <div className="w-6 h-6 rounded-lg bg-brand-purple/20 text-brand-mint flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Confirmación y recordatorios por WhatsApp</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <div className="w-6 h-6 rounded-lg bg-brand-purple/20 text-brand-mint flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Historial de visitas y valoraciones reales</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <div className="w-6 h-6 rounded-lg bg-brand-purple/20 text-brand-mint flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Pago seguro en línea o en el establecimiento</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <div className="w-6 h-6 rounded-lg bg-brand-purple/20 text-brand-mint flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Cancela o reprograma en 1 solo clic</span>
                  </div>
                </div>

                {/* Download Buttons & QR Code Trigger */}
                <div className="pt-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Direct Web App button */}
                    <button
                      onClick={() => navigateToApp()}
                      className="px-6 py-3.5 rounded-2xl bg-brand-purple hover:bg-brand-purple-dark text-white font-black text-sm shadow-brand-md transition-all flex items-center gap-2 group"
                    >
                      <Smartphone className="w-4 h-4 text-brand-mint" />
                      <span>Abrir App de Clientes</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* QR Code popup button */}
                    <button
                      onClick={() => handleOpenQr('client')}
                      className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2"
                    >
                      <QrCode className="w-4 h-4 text-brand-mint" />
                      <span>Escanear Código QR</span>
                    </button>
                  </div>

                  {/* App Store & Google Play Mock Badges */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => navigateToApp()}
                      className="px-4 py-2.5 rounded-xl bg-black border border-slate-700 hover:border-slate-500 transition-all flex items-center gap-3"
                    >
                      <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.61 1.35-.55.63-1.03 1.68-.9 2.7.99.08 2.01-.52 2.59-1.2"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-[9px] text-slate-400 uppercase leading-none">Disponible en</div>
                        <div className="text-xs font-bold text-white leading-tight">App Store</div>
                      </div>
                    </button>

                    <button
                      onClick={() => navigateToApp()}
                      className="px-4 py-2.5 rounded-xl bg-black border border-slate-700 hover:border-slate-500 transition-all flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                        <path d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 0 1-.22-.995V2.81c0-.368.08-.71.22-.996zm11.233 11.236l2.128 2.128-11.45 6.577 9.322-8.705zm0-2.098L5.52 2.247l11.45 6.577-2.128 2.128zm1.488 1.05l3.873 2.223c.854.49.854 1.288 0 1.778l-3.873 2.223-2.39-2.39 2.39-2.39z"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-[9px] text-slate-400 uppercase leading-none">Disponible en</div>
                        <div className="text-xs font-bold text-white leading-tight">Google Play</div>
                      </div>
                    </button>

                    <span className="text-xs text-slate-500 font-medium">o instala directo como PWA</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Phone Mockup Frame */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-72 sm:w-80 rounded-[44px] bg-slate-800 p-3 shadow-2xl border-4 border-slate-700">
                  {/* Speaker notch */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-20" />

                  {/* Screen Content */}
                  <div className="rounded-[36px] bg-brand-soft-canvas text-brand-carbon overflow-hidden border border-slate-700">
                    
                    {/* Screen Header */}
                    <div className="bg-white p-5 pt-8 border-b border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-xs">
                          DR
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">Diego Ramirez</div>
                          <div className="text-[10px] text-brand-purple font-bold">Miembro Bublyme VIP</div>
                        </div>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    </div>

                    {/* Booking Card UI in phone */}
                    <div className="p-4 space-y-3">
                      <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                            Confirmada
                          </span>
                          <span className="text-[10px] text-slate-400">Hoy, 10:30 AM</span>
                        </div>

                        <div className="text-xs font-black text-slate-800">
                          The Hustle Barber & Lounge
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Corte Fade Master + Barba VIP
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">Especialista: Alex</span>
                          <span className="font-bold text-brand-purple">$45 USD</span>
                        </div>
                      </div>

                      {/* Quick action in phone */}
                      <button 
                        onClick={() => navigateToApp()}
                        className="w-full py-2.5 rounded-xl bg-brand-purple text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Nueva Cita Rápida</span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* 💼 BUSINESS APP SHOWCASE */
          <div className="bg-gradient-to-b from-slate-900/90 to-slate-900/50 rounded-3xl sm:rounded-4xl border border-teal-500/30 p-6 sm:p-12 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              {/* Left Column: Info & Download Links */}
              <div className="lg:col-span-7 space-y-6">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-teal-500/20 text-brand-mint text-xs font-black uppercase tracking-wider border border-brand-mint/30">
                    Para Salones, Barberías & Spas
                  </span>
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" />
                    Sincronización en tiempo real
                  </span>
                </div>

                <h3 className="font-display font-black text-2xl sm:text-4xl text-white leading-tight">
                  Gestiona tu negocio completo desde la palma de tu mano
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  Accede a la agenda de tu equipo, atiende cobros en punto de venta (POS), consulta métricas de ingresos al instante y liquida comisiones con total transparencia.
                </p>

                {/* Features List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-brand-mint flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Calendario matricial por especialista</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-brand-mint flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Punto de Venta POS con lector de tarjetas</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-brand-mint flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Cálculo automático de comisiones y nómina</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-brand-mint flex items-center justify-center font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span>Alertas instantáneas de nuevas reservas</span>
                  </div>
                </div>

                {/* Download Buttons & QR Code Trigger */}
                <div className="pt-6 space-y-4">
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Direct Web App button */}
                    <button
                      onClick={() => navigateToBiz('calendar')}
                      className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-brand-mint hover:opacity-95 text-brand-carbon font-black text-sm shadow-brand-md transition-all flex items-center gap-2 group"
                    >
                      <Store className="w-4 h-4" />
                      <span>Abrir Bublyme Business OS</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* QR Code popup button */}
                    <button
                      onClick={() => handleOpenQr('business')}
                      className="px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center gap-2"
                    >
                      <QrCode className="w-4 h-4 text-brand-mint" />
                      <span>Escanear Código QR</span>
                    </button>
                  </div>

                  {/* App Store & Google Play Mock Badges */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => navigateToBiz('calendar')}
                      className="px-4 py-2.5 rounded-xl bg-black border border-slate-700 hover:border-slate-500 transition-all flex items-center gap-3"
                    >
                      <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.61 1.35-.55.63-1.03 1.68-.9 2.7.99.08 2.01-.52 2.59-1.2"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-[9px] text-slate-400 uppercase leading-none">Disponible en</div>
                        <div className="text-xs font-bold text-white leading-tight">App Store</div>
                      </div>
                    </button>

                    <button
                      onClick={() => navigateToBiz('calendar')}
                      className="px-4 py-2.5 rounded-xl bg-black border border-slate-700 hover:border-slate-500 transition-all flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                        <path d="M3.609 1.814L13.792 12 3.61 22.186a2.372 2.372 0 0 1-.22-.995V2.81c0-.368.08-.71.22-.996zm11.233 11.236l2.128 2.128-11.45 6.577 9.322-8.705zm0-2.098L5.52 2.247l11.45 6.577-2.128 2.128zm1.488 1.05l3.873 2.223c.854.49.854 1.288 0 1.778l-3.873 2.223-2.39-2.39 2.39-2.39z"/>
                      </svg>
                      <div className="text-left">
                        <div className="text-[9px] text-slate-400 uppercase leading-none">Disponible en</div>
                        <div className="text-xs font-bold text-white leading-tight">Google Play</div>
                      </div>
                    </button>

                    <span className="text-xs text-slate-500 font-medium">o accede en biz.bublyme.com</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Tablet / Phone Mockup Frame */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-72 sm:w-80 rounded-[44px] bg-slate-800 p-3 shadow-2xl border-4 border-slate-700">
                  {/* Speaker notch */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-20" />

                  {/* Screen Content */}
                  <div className="rounded-[36px] bg-brand-carbon text-white overflow-hidden border border-slate-700">
                    
                    {/* Screen Header */}
                    <div className="bg-slate-900 p-5 pt-8 border-b border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-black text-white">The Hustle Barber</div>
                        <div className="text-[10px] text-brand-mint font-bold">Ventas Hoy: $1,240 USD</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-md bg-brand-mint text-brand-carbon text-[9px] font-black uppercase">
                        POS Live
                      </span>
                    </div>

                    {/* Matrix Calendar in phone */}
                    <div className="p-4 space-y-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white">10:00 AM · Carlos Ruiz</div>
                          <div className="text-[10px] text-slate-400">Fade + Barba Express</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                          En Servicio
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-white">11:30 AM · Ana Torres</div>
                          <div className="text-[10px] text-slate-400">Balayage Completo</div>
                        </div>
                        <span className="px-2 py-0.5 rounded-md bg-teal-500/20 text-brand-mint text-[10px] font-bold">
                          Confirmada
                        </span>
                      </div>

                      <button
                        onClick={() => navigateToBiz('pos')}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-brand-mint text-brand-carbon font-black text-xs flex items-center justify-center gap-1.5 shadow-sm mt-2"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Cobrar en POS</span>
                      </button>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3 Step Quick Installation Guide (PWA) */}
        <div className="mt-12 bg-slate-900/60 rounded-3xl p-6 sm:p-8 border border-slate-800 text-center">
          <div className="text-xs font-black uppercase tracking-wider text-brand-mint mb-2">
            Instalación Instantánea en 5 Segundos
          </div>
          <h4 className="font-display font-black text-lg text-white mb-6">
            ¿Cómo instalar la App en tu iPhone o Android sin pasar por la tienda?
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-brand-purple text-white font-black flex items-center justify-center mx-auto">
                1
              </div>
              <div className="font-bold text-white">Abre en tu navegador móvil</div>
              <p className="text-[11px] text-slate-400">Entra a <strong>app.bublyme.com</strong> o <strong>biz.bublyme.com</strong> desde Safari o Chrome.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-brand-purple text-white font-black flex items-center justify-center mx-auto">
                2
              </div>
              <div className="font-bold text-white">Toca Compartir / Menú</div>
              <p className="text-[11px] text-slate-400">En Safari pulsa el icono <Share2 className="w-3 h-3 inline text-brand-mint" /> o en Chrome toca los tres puntos verticales.</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-brand-purple text-white font-black flex items-center justify-center mx-auto">
                3
              </div>
              <div className="font-bold text-white">"Agregar a Pantalla de Inicio"</div>
              <p className="text-[11px] text-slate-400">¡Listo! Tendrás el icono oficial de Bublyme en tu pantalla como una app nativa.</p>
            </div>
          </div>
        </div>

      </div>

      {/* QR Code Interactive Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-5 animate-in fade-in shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-brand-purple/20 text-brand-mint flex items-center justify-center mx-auto">
              <QrCode className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-display font-black text-lg text-white">
                Escanea con la cámara de tu móvil
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                {qrAppType === 'client' 
                  ? 'Abre la App de Clientes directamente en tu dispositivo' 
                  : 'Abre la consola Bublyme Business OS en tu dispositivo'}
              </p>
            </div>

            {/* QR Visual */}
            <div className="p-4 bg-white rounded-2xl inline-block mx-auto shadow-inner">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(qrAppType === 'client' ? clientAppUrl : bizAppUrl)}&color=0F172A`}
                alt="QR Code"
                className="w-44 h-44 mx-auto"
              />
            </div>

            <div className="text-[11px] font-mono text-brand-mint break-all">
              {qrAppType === 'client' ? clientAppUrl : bizAppUrl}
            </div>

            <button
              onClick={() => setIsQrModalOpen(false)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

    </section>
  );
};

export default AppDownloadSection;
