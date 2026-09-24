import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { MultiStaffCalendar } from './MultiStaffCalendar';
import { ClientsCRM } from './ClientsCRM';
import { ServicesManager } from './ServicesManager';
import { StaffManager } from './StaffManager';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { CommissionsPayroll } from './CommissionsPayroll';
import { NewAppointmentModal } from './NewAppointmentModal';
import { AppointmentDetailModal } from './AppointmentDetailModal';
import { POSCheckoutModal } from './POSCheckoutModal';
import { VenueProfileEditor } from './VenueProfileEditor';
import { ProductsInventoryManager } from './ProductsInventoryManager';
import { 
  Calendar, 
  Users, 
  Scissors, 
  UserCheck, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  Plus, 
  Bell, 
  Store, 
  ExternalLink,
  ChevronRight,
  LogOut,
  Sparkles,
  ShieldCheck,
  ShoppingBag,
  DollarSign,
  ChevronDown,
  Check
} from 'lucide-react';

export const BusinessOS = () => {
  const { t } = useLanguage();
  const { 
    businessTab, 
    setBusinessTab, 
    setCurrentView, 
    calendarAppointments,
    venues,
    activeVenue,
    activeVenueId,
    setActiveVenueId,
    showToast
  } = useApp();

  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [newAppointmentSlotData, setNewAppointmentSlotData] = useState(null);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [posAppointment, setPosAppointment] = useState(null);
  const [isPOSOpen, setIsPOSOpen] = useState(false);
  const [isVenueDropdownOpen, setIsVenueDropdownOpen] = useState(false);

  const currentSalon = activeVenue || (venues && venues[0]) || {
    name: 'The Hustle Barber & Lounge',
    city: 'Miami, FL',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=80'
  };

  const navItems = [
    { id: 'calendar', label: t('bos_calendar'), icon: Calendar, badge: `${calendarAppointments.length}` },
    { id: 'venue-profile', label: 'Perfil & Fotos del Salón', icon: Store },
    { id: 'products', label: 'Productos & Inventario', icon: ShoppingBag },
    { id: 'pos', label: t('bos_pos'), icon: CreditCard },
    { id: 'clients', label: t('bos_clients'), icon: Users },
    { id: 'services', label: t('bos_services'), icon: Scissors },
    { id: 'team', label: t('bos_team'), icon: UserCheck },
    { id: 'commissions', label: 'Comisiones & Pagos', icon: DollarSign, badge: 'Nómina' },
    { id: 'analytics', label: t('bos_analytics'), icon: TrendingUp },
  ];

  const handleOpenNewAppointment = (slotData = {}) => {
    setNewAppointmentSlotData(slotData);
    setIsNewAppointmentOpen(true);
  };

  const handleSelectAppointment = (apt) => {
    setSelectedAppointment(apt);
    setIsDetailOpen(true);
  };

  const handleOpenPOS = (apt) => {
    setPosAppointment(apt || calendarAppointments[0]);
    setIsPOSOpen(true);
  };

  return (
    <div className="min-h-screen bg-brand-soft-canvas flex flex-col lg:flex-row">
      
      {/* Left Sidebar */}
      <aside className="w-full lg:w-72 bg-brand-carbon text-white flex flex-col justify-between border-r border-slate-800 p-4 lg:p-6 lg:min-h-screen">
        
        {/* Top Brand & Salon Title */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-mint flex items-center justify-center font-display font-black text-xl text-white">
                S
              </div>
              <div>
                <span className="font-display font-black text-xl tracking-tight text-white block leading-none">
                  styluu
                </span>
                <span className="text-[10px] text-brand-mint font-bold uppercase tracking-widest leading-none mt-0.5 block">
                  Business OS
                </span>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('landing')}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
              title="Volver a la Web"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Active Venue Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsVenueDropdownOpen(!isVenueDropdownOpen)}
              className="w-full p-3 rounded-2xl bg-slate-800/80 border border-slate-700/60 hover:border-brand-purple/50 flex items-center justify-between gap-2.5 transition-all text-left group"
              title="Cambiar de establecimiento o sede"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={(currentSalon?.images && currentSalon.images[0]) || currentSalon?.image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=80'}
                  alt={currentSalon?.name || 'Styluu Salon'}
                  className="w-9 h-9 rounded-xl object-cover border border-slate-600 shrink-0"
                />
                <div className="min-w-0">
                  <div className="font-bold text-xs text-white truncate flex items-center gap-1">
                    <span>{currentSalon?.name}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block shrink-0"></span>
                    <span className="truncate">{currentSalon?.city}</span>
                  </div>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-white transition-transform shrink-0 ${isVenueDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isVenueDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl p-2 shadow-2xl z-50 animate-in fade-in space-y-1">
                <div className="px-2.5 py-1 text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Cambiar Establecimiento
                </div>
                {venues.map((v) => {
                  const isSelected = v.id === currentSalon?.id;
                  const vImg = (v.images && v.images[0]) || v.image || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=400&q=80';
                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setActiveVenueId(v.id);
                        setIsVenueDropdownOpen(false);
                        showToast(`Sede activa: ${v.name}`, 'info');
                      }}
                      className={`w-full p-2 rounded-xl flex items-center justify-between text-left transition-colors ${
                        isSelected ? 'bg-brand-purple/20 text-white border border-brand-purple/40' : 'hover:bg-slate-800 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img src={vImg} alt={v.name} className="w-7 h-7 rounded-lg object-cover shrink-0" />
                        <div className="min-w-0">
                          <div className="text-xs font-bold truncate">{v.name}</div>
                          <div className="text-[10px] text-slate-400 truncate">{v.city}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-brand-mint shrink-0 ml-1" />}
                    </button>
                  );
                })}

                <div className="pt-1 border-t border-slate-800 mt-1">
                  <button
                    onClick={() => {
                      setIsVenueDropdownOpen(false);
                      setCurrentView('super-admin');
                    }}
                    className="w-full p-2 rounded-xl text-left text-xs font-bold text-brand-mint hover:bg-slate-800 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span>Panel Super Admin Maestro</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = businessTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setBusinessTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
                    isActive
                      ? 'bg-brand-purple text-white shadow-brand-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white text-brand-purple' : 'bg-slate-800 text-brand-mint'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Quick Actions */}
        <div className="space-y-3 pt-6 border-t border-slate-800">
          <button
            onClick={() => handleOpenPOS(calendarAppointments[0])}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-mint hover:opacity-95 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md"
          >
            <CreditCard className="w-4 h-4" />
            <span>Abrir Caja / POS</span>
          </button>

          <button
            onClick={() => setCurrentView('landing')}
            className="w-full py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold flex items-center justify-center gap-2"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Ver mi salón en Styluu</span>
          </button>
        </div>

      </aside>

      {/* Main OS View Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        
        {/* Dynamic subview */}
        {businessTab === 'calendar' && (
          <MultiStaffCalendar
            onOpenNewAppointment={handleOpenNewAppointment}
            onSelectAppointment={handleSelectAppointment}
          />
        )}

        {businessTab === 'venue-profile' && <VenueProfileEditor />}
        {businessTab === 'products' && <ProductsInventoryManager />}

        {businessTab === 'pos' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto">
                <CreditCard className="w-8 h-8" />
              </div>
              <h3 className="font-display font-black text-2xl text-brand-carbon">
                Punto de Venta & Caja Registradora
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Selecciona una cita del calendario o abre un cobro directo para cobrar con tarjeta, efectivo o Apple Pay.
              </p>
              <button
                onClick={() => handleOpenPOS(calendarAppointments[0])}
                className="px-6 py-3 rounded-2xl bg-brand-purple text-white font-extrabold text-xs shadow-brand-sm"
              >
                Abrir Terminal de Cobro
              </button>
            </div>
          </div>
        )}

        {businessTab === 'clients' && <ClientsCRM />}
        {businessTab === 'services' && <ServicesManager />}
        {businessTab === 'team' && <StaffManager />}
        {businessTab === 'commissions' && <CommissionsPayroll />}
        {businessTab === 'analytics' && <AnalyticsDashboard />}

      </main>

      {/* Modals */}
      <NewAppointmentModal
        isOpen={isNewAppointmentOpen}
        initialData={newAppointmentSlotData}
        onClose={() => setIsNewAppointmentOpen(false)}
      />

      <AppointmentDetailModal
        isOpen={isDetailOpen}
        appointment={selectedAppointment}
        onClose={() => setIsDetailOpen(false)}
        onOpenPOS={handleOpenPOS}
      />

      <POSCheckoutModal
        isOpen={isPOSOpen}
        appointment={posAppointment}
        onClose={() => setIsPOSOpen(false)}
      />

    </div>
  );
};
