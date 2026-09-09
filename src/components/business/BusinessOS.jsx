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
  DollarSign
} from 'lucide-react';

export const BusinessOS = () => {
  const { t } = useLanguage();
  const { 
    businessTab, 
    setBusinessTab, 
    setCurrentView, 
    calendarAppointments,
    venues,
    showToast
  } = useApp();

  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [newAppointmentSlotData, setNewAppointmentSlotData] = useState(null);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [posAppointment, setPosAppointment] = useState(null);
  const [isPOSOpen, setIsPOSOpen] = useState(false);

  const currentSalon = venues[0];

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

          {/* Active Venue Selector Card */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-3">
            <img
              src={currentSalon.image}
              alt={currentSalon.name}
              className="w-10 h-10 rounded-xl object-cover border border-slate-600"
            />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-xs text-white truncate">{currentSalon.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentSalon.city}</div>
            </div>
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
