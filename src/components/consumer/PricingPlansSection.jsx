import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Check, 
  Sparkles, 
  Rocket, 
  ShieldCheck, 
  Smartphone, 
  Users, 
  Infinity, 
  Calendar, 
  BarChart3, 
  CreditCard, 
  Receipt, 
  ShoppingBag, 
  PieChart, 
  Clock, 
  Gift, 
  ArrowRight,
  Zap,
  HelpCircle
} from 'lucide-react';

export const PricingPlansSection = () => {
  const { t } = useLanguage();
  const { currentCurrency, navigateToBiz, formatMoney } = useApp();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'
  const [selectedPlanId, setSelectedPlanId] = useState('staff');

  // Convert MXN baseline to active currency cleanly
  const getPrice = (mxnPrice) => {
    if (currentCurrency?.currencyCode === 'MXN') {
      const base = billingCycle === 'yearly' ? Math.round(mxnPrice * 0.8) : mxnPrice;
      return {
        amount: `$${base.toLocaleString('es-MX')}`,
        code: 'MXN',
        period: billingCycle === 'yearly' ? '/mes (facturado anual)' : '/mes'
      };
    }
    if (currentCurrency?.currencyCode === 'USD') {
      const usdBase = Math.round(mxnPrice / 17);
      const finalPrice = billingCycle === 'yearly' ? Math.round(usdBase * 0.8) : usdBase;
      return {
        amount: `$${finalPrice}`,
        code: 'USD',
        period: billingCycle === 'yearly' ? '/mo (billed annually)' : '/month'
      };
    }
    if (currentCurrency?.currencyCode === 'COP') {
      const copBase = Math.round((mxnPrice / 17) * 4200);
      const finalPrice = billingCycle === 'yearly' ? Math.round(copBase * 0.8) : copBase;
      return {
        amount: `$${finalPrice.toLocaleString('es-CO')}`,
        code: 'COP',
        period: billingCycle === 'yearly' ? '/mes (facturado anual)' : '/mes'
      };
    }
    // Default fallback
    const converted = Math.round(mxnPrice * (currentCurrency?.rateMultiplier ? currentCurrency.rateMultiplier / 240 : 1));
    return {
      amount: `$${converted.toLocaleString()}`,
      code: currentCurrency?.currencyCode || 'MXN',
      period: billingCycle === 'yearly' ? '/mes' : '/mes'
    };
  };

  const plans = [
    {
      id: 'independiente',
      name: 'Plan Independiente',
      badge: 'Precio de apertura',
      tagline: 'Más reservas · Más clientes · Más crecimiento',
      description: 'Todo lo que necesitas para gestionar y hacer crecer tu negocio en un solo lugar.',
      baseMxnPrice: 100,
      userCapacity: '1 Especialista / Profesional independiente',
      capacityBadge: '1 Usuario',
      capacityIcon: Users,
      popular: false,
      color: 'from-blue-600 via-cyan-500 to-teal-400',
      buttonBg: 'bg-slate-900 hover:bg-slate-800 text-white',
      trialDays: 7,
      features: [
        { title: 'Reservas 24/7', desc: 'Tus clientes pueden agendar en línea en cualquier momento' },
        { title: 'CRM Clientes', desc: 'Organiza, segmenta y fideliza a tus clientes con historial' },
        { title: 'Reportes de Ventas', desc: 'Conoce tu desempeño y toma mejores decisiones' },
        { title: 'Historial de Servicios', desc: 'Lleva un registro completo y notas de cada cliente' },
        { title: 'Analítica de Resultados', desc: 'Visualiza el crecimiento de ingresos en tiempo real' },
        { title: 'MarketPlace (Tienda online)', desc: 'Perfil público verificado en www.bublyme.com' },
        { title: 'Sistema POS (Punto de pago)', desc: 'Gestiona ventas en tu local de forma rápida y sencilla' },
        { title: 'Pasarela de Pagos', desc: 'Acepta pagos con tarjeta, transferencias y Apple Pay' },
        { title: 'Datafono', desc: 'Conecta tu datafono y cobra de manera profesional' }
      ]
    },
    {
      id: 'staff',
      name: 'Plan Staff',
      badge: 'Más Popular',
      tagline: 'Un equipo más organizado hace un negocio más grande',
      description: 'Diseñado para equipos de trabajo que quieren ofrecer el mejor servicio y multiplicar su facturación.',
      baseMxnPrice: 500,
      userCapacity: 'Incluye hasta 6 usuarios con roles, turnos y comisiones individuales',
      capacityBadge: 'Hasta 6 Usuarios',
      capacityIcon: Users,
      popular: true,
      color: 'from-brand-purple via-indigo-600 to-brand-mint',
      buttonBg: 'bg-gradient-to-r from-brand-purple to-brand-mint hover:opacity-95 text-white shadow-lg shadow-brand-purple/25',
      trialDays: 7,
      features: [
        { title: 'Todo lo del Plan Independiente', desc: 'Incluye todas las herramientas y pasarela' },
        { title: 'Hasta 6 Usuarios / Especialistas', desc: 'Gestiona a tu equipo con roles y permisos específicos' },
        { title: 'Calendario Multi-Staff Matricial', desc: 'Vista simultánea por columnas de cada profesional' },
        { title: 'Liquidación Automática de Nómina', desc: 'Cálculo de comisiones por servicio y comprobantes' },
        { title: 'Gestión de Propinas y Rendimiento', desc: 'Control de propinas y métricas por especialista' },
        { title: 'Control de Inventario y Stock', desc: 'Alertas de stock bajo y venta cruzada en POS' },
        { title: 'Recordatorios Automatizados', desc: 'Notificaciones WhatsApp y SMS para reducir no-shows' }
      ]
    },
    {
      id: 'ilimitado',
      name: 'Plan Ilimitado',
      badge: 'Potencia Total',
      tagline: 'Más clientes · Más reservas · Más crecimiento · Sin límites',
      description: 'Todo el poder de Bublyme para hacer crecer tu salón, barbería o franquicia sin restricciones.',
      baseMxnPrice: 900,
      userCapacity: 'Usuarios y colaboradores ilimitados. Todo tu equipo sin restricciones.',
      capacityBadge: 'Usuarios Ilimitados ♾️',
      capacityIcon: Infinity,
      popular: false,
      color: 'from-fuchsia-600 via-purple-600 to-cyan-400',
      buttonBg: 'bg-gradient-to-r from-slate-900 to-brand-purple hover:brightness-110 text-white shadow-md',
      trialDays: 7,
      features: [
        { title: 'Todo lo del Plan Staff', desc: 'Todas las funciones del sistema incluidas' },
        { title: 'Usuarios Ilimitados ♾️', desc: 'Agrega a todos los barberos, estilistas y recepcionistas que quieras' },
        { title: 'Soporte Prioritario VIP 24/7', desc: 'Atención directa vía WhatsApp y asesor dedicado' },
        { title: 'Múltiples Sedes y Sucursales', desc: 'Consolida varias sucursales bajo una misma cuenta' },
        { title: 'Módulo Financiero y Cierre de Caja Avanzado', desc: 'Auditoría detallada de ingresos y balances' },
        { title: 'Campañas de Marketing Masivo', desc: 'Fidelización automatizada para clientes inactivos' }
      ]
    }
  ];

  const gridFeaturePillars = [
    {
      icon: Calendar,
      title: 'Reservas 24/7',
      desc: 'Tus clientes agendan en línea en cualquier momento sin llamadas ni esperas.',
      color: 'bg-purple-500/10 text-brand-purple'
    },
    {
      icon: Users,
      title: 'CRM Clientes',
      desc: 'Organiza, segmenta y fideliza a tus clientes con historial de citas y notas.',
      color: 'bg-pink-500/10 text-pink-600'
    },
    {
      icon: BarChart3,
      title: 'Reportes de Ventas',
      desc: 'Conoce tu desempeño financiero diario, semanal y mensual con gráficos en vivo.',
      color: 'bg-emerald-500/10 text-emerald-600'
    },
    {
      icon: Clock,
      title: 'Historial de Servicios',
      desc: 'Lleva un registro visual completo de fórmulas, fotos y preferencias de cada cliente.',
      color: 'bg-amber-500/10 text-amber-600'
    },
    {
      icon: PieChart,
      title: 'Analítica de Resultados',
      desc: 'Visualiza el crecimiento de tu salón y la tasa de ocupación de tu equipo.',
      color: 'bg-blue-500/10 text-blue-600'
    },
    {
      icon: ShoppingBag,
      title: 'MarketPlace Online',
      desc: 'Vende tus productos retail y servicios en el directorio oficial de Bublyme.',
      color: 'bg-rose-500/10 text-rose-600'
    },
    {
      icon: Receipt,
      title: 'Punto de Venta POS',
      desc: 'Gestiona cobros rápidos en caja, aplica descuentos, divide cuentas y propinas.',
      color: 'bg-teal-500/10 text-teal-600'
    },
    {
      icon: CreditCard,
      title: 'Pasarela & Datafono',
      desc: 'Acepta pagos con tarjetas crédito/débito, transferencias y terminal de pago.',
      color: 'bg-indigo-500/10 text-indigo-600'
    }
  ];

  return (
    <section id="planes" className="py-20 lg:py-28 bg-gradient-to-b from-white via-brand-soft-canvas to-white relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 -left-40 w-96 h-96 bg-brand-purple/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 -right-40 w-96 h-96 bg-brand-mint/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Planes Transparentes y Flexibles</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl text-brand-carbon tracking-tight leading-tight">
            Tu negocio en buenas manos.{' '}
            <span className="bg-gradient-to-r from-brand-purple via-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Elige el plan ideal.
            </span>
          </h2>

          <p className="text-slate-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Sin contratos forzosos. Todos los planes incluyen <strong>7 días de prueba gratis</strong> con acceso completo a todas las funciones.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="flex items-center justify-center gap-3 pt-6">
            <div className="bg-slate-100 p-1.5 rounded-2xl border border-slate-200 inline-flex items-center shadow-inner">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-brand-carbon shadow-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Facturación Mensual
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-brand-purple text-white shadow-brand-sm'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>Facturación Anual</span>
                <span className="px-2 py-0.5 rounded-full bg-brand-mint text-brand-carbon text-[10px] font-black uppercase">
                  20% OFF
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-20">
          {plans.map((plan) => {
            const priceInfo = getPrice(plan.baseMxnPrice);
            const CapacityIcon = plan.capacityIcon;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl sm:rounded-4xl transition-all duration-300 flex flex-col justify-between p-7 sm:p-9 ${
                  plan.popular
                    ? 'bg-white border-2 border-brand-purple shadow-2xl lg:-translate-y-3 z-20'
                    : 'bg-white/90 border border-slate-200/90 shadow-lg hover:shadow-xl hover:border-slate-300'
                }`}
              >
                {/* Popular Pill Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-purple to-brand-mint text-white text-[11px] font-black uppercase tracking-wider shadow-md">
                    ⭐ {plan.badge}
                  </div>
                )}

                <div>
                  {/* Card Header */}
                  <div className="space-y-3 pb-6 border-b border-slate-100">
                    {!plan.popular && (
                      <span className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">
                        {plan.badge}
                      </span>
                    )}

                    <h3 className="font-display font-black text-2xl text-brand-carbon">
                      {plan.name}
                    </h3>

                    <p className="text-xs text-brand-purple font-bold">
                      {plan.tagline}
                    </p>

                    <p className="text-xs text-slate-500 leading-relaxed min-h-[36px]">
                      {plan.description}
                    </p>

                    {/* Price Display */}
                    <div className="pt-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-display font-black text-4xl sm:text-5xl text-brand-carbon tracking-tight">
                          {priceInfo.amount}
                        </span>
                        <span className="text-xs font-bold text-slate-400">
                          {priceInfo.code}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {priceInfo.period}
                        </span>
                      </div>

                      {/* 7 Days Free Trial Badge */}
                      <div className="inline-flex items-center gap-1.5 mt-3 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
                        <Gift className="w-3.5 h-3.5 text-emerald-600" />
                        <span>7 días de prueba gratis</span>
                      </div>
                    </div>

                    {/* Capacity pill */}
                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center gap-2.5 mt-4">
                      <div className="w-8 h-8 rounded-xl bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-brand-purple font-bold">
                        <CapacityIcon className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <div className="font-black text-slate-800">{plan.capacityBadge}</div>
                        <div className="text-[11px] text-slate-500">{plan.userCapacity}</div>
                      </div>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <div className="py-6 space-y-3">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Incluido en este plan:
                    </div>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5 text-xs">
                        <div className="w-4 h-4 rounded-full bg-brand-mint/30 text-teal-800 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                          <Check className="w-3 h-3" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800">{feat.title}: </span>
                          <span className="text-slate-600">{feat.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card CTA Button */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => navigateToBiz('calendar')}
                    className={`w-full py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${plan.buttonBg}`}
                  >
                    <span>Comienza ahora (7 días gratis)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-center text-slate-400 mt-2 font-medium">
                    Sin cobros sorpresa · Cancela cuando quieras
                  </p>
                </div>

              </div>
            );
          })}
        </div>

        {/* 8 Feature Pillars Showcase from Flyer */}
        <div className="bg-white rounded-3xl sm:rounded-4xl p-8 sm:p-12 border border-slate-200/90 shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-display font-black text-2xl sm:text-3xl text-brand-carbon">
              Todo lo que necesitas para operar, atraer clientes y crecer
            </h3>
            <p className="text-xs sm:text-sm text-slate-500">
              Herramientas de nivel corporativo diseñadas para ser simples, rápidas y potentes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {gridFeaturePillars.map((pillar, pIdx) => {
              const Icon = pillar.icon;
              return (
                <div key={pIdx} className="p-5 rounded-2xl bg-brand-soft-canvas border border-slate-200/70 space-y-2.5 hover:border-brand-purple/40 transition-all">
                  <div className={`w-10 h-10 rounded-xl ${pillar.color} flex items-center justify-center font-bold`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-brand-carbon">{pillar.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{pillar.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Trust Guarantees Bar */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-around gap-4 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                <Rocket className="w-3.5 h-3.5" />
              </div>
              <span>Sin contratos a largo plazo</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>Seguro y 100% confiable</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                <Smartphone className="w-3.5 h-3.5" />
              </div>
              <span>Accesible desde cualquier dispositivo</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default PricingPlansSection;