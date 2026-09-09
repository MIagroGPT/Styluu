import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Scissors, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  QrCode, 
  Heart, 
  Settings, 
  ChevronRight,
  RefreshCw,
  Plus,
  X,
  CalendarCheck,
  AlertTriangle,
  Info
} from 'lucide-react';

const QUICK_REASONS = [
  'Cambio de horario laboral',
  'Imprevisto personal o familiar',
  'Problema de salud / Malestar',
  'Dificultad con el transporte',
  'Deseo cambiar de servicio',
  'Otro motivo'
];

const AVAILABLE_RESCHEDULE_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '12:00 PM',
  '02:00 PM',
  '03:30 PM',
  '05:00 PM',
  '06:30 PM'
];

export const ClientPortal = () => {
  const { t } = useLanguage();
  const { 
    clientBookings, 
    cancelClientBookingWithReason, 
    rescheduleClientBooking, 
    openBookingModal, 
    venues, 
    setCurrentView,
    formatMoney 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' | 'past'
  
  // Modal State for Reschedule & Cancellation
  const [modalBooking, setModalBooking] = useState(null);
  const [actionType, setActionType] = useState('reschedule'); // 'reschedule' | 'cancel'
  const [reasonText, setReasonText] = useState('');
  const [selectedQuickReason, setSelectedQuickReason] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('10:30 AM');

  const upcomingBookings = clientBookings.filter(b => b.status === 'confirmed');
  const pastBookings = clientBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const handleOpenActionModal = (booking, type = 'reschedule') => {
    setModalBooking(booking);
    setActionType(type);
    setSelectedQuickReason('');
    setReasonText('');
    // Default reschedule date to tomorrow or booking date
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    setNewDate(tomorrow.toISOString().split('T')[0]);
    setNewTime('10:30 AM');
  };

  const handleCloseModal = () => {
    setModalBooking(null);
    setReasonText('');
    setSelectedQuickReason('');
  };

  const handleConfirmAction = () => {
    if (!modalBooking) return;
    const finalReason = [selectedQuickReason, reasonText.trim()].filter(Boolean).join(' - ') || 'Sin motivo especificado';

    if (actionType === 'cancel') {
      cancelClientBookingWithReason(modalBooking.id, finalReason);
    } else {
      rescheduleClientBooking(modalBooking.id, newDate, newTime, finalReason);
    }
    handleCloseModal();
  };

  return (
    <div className="bg-brand-soft-canvas min-h-screen py-10 pb-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-left">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80"
                alt="Diego Ramirez"
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-brand-purple/20 shadow-md"
              />
              <div className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-brand-mint border-2 border-white" />
            </div>
            <div>
              <h2 className="font-display font-black text-xl sm:text-2xl text-brand-carbon">
                Diego Ramirez
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                diego.ramirez@mail.com • Miembro Styluu VIP
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-extrabold uppercase">
                  Nivel Platinum
                </span>
                <span className="text-xs text-slate-400">Miami, FL</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-2 sm:gap-3 bg-brand-purple text-white p-3 sm:p-4 rounded-2xl shadow-brand-sm">
            <div className="text-center px-3 border-r border-white/20">
              <div className="font-display font-black text-xl">{clientBookings.length + 11}</div>
              <div className="text-[10px] text-white/80 uppercase font-semibold">Citas Hechas</div>
            </div>
            <div className="text-center px-3 border-r border-white/20">
              <div className="font-display font-black text-xl">3</div>
              <div className="text-[10px] text-white/80 uppercase font-semibold">Favoritos</div>
            </div>
            <div className="text-center px-3">
              <div className="font-display font-black text-xl text-brand-mint">{upcomingBookings.length}</div>
              <div className="text-[10px] text-white/80 uppercase font-semibold">Próximas</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex gap-3">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'upcoming'
                  ? 'bg-brand-purple text-white shadow-brand-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Próximas Citas ({upcomingBookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('past')}
              className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                activeTab === 'past'
                  ? 'bg-brand-purple text-white shadow-brand-sm'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Historial de Citas ({pastBookings.length})</span>
            </button>
          </div>

          <button
            onClick={() => setCurrentView('explore')}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-mint text-brand-carbon text-xs font-black hover:shadow-mint-glow transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nueva Reserva</span>
          </button>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {activeTab === 'upcoming' && (
            <>
              {upcomingBookings.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-brand-carbon">No tienes citas próximas activas</h3>
                    <p className="text-xs text-slate-500">¿Listo para tu próximo corte o sesión de spa?</p>
                  </div>
                  <button
                    onClick={() => setCurrentView('explore')}
                    className="px-6 py-3 rounded-2xl bg-brand-purple text-white font-extrabold text-xs shadow-brand-sm"
                  >
                    Explorar salones y reservar
                  </button>
                </div>
              ) : (
                upcomingBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-brand-purple/40 shadow-sm transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      {booking.staffAvatar ? (
                        <img
                          src={booking.staffAvatar}
                          alt={booking.staffName}
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-purple/20 shadow-sm"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center font-bold">
                          <Scissors className="w-7 h-7" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Confirmada
                          </span>
                          <span className="text-xs font-mono text-slate-400">{booking.bookingCode}</span>
                          {booking.rescheduleReason && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              Reagendada
                            </span>
                          )}
                        </div>

                        <h3 className="font-display font-bold text-lg text-brand-carbon">
                          {booking.serviceName}
                        </h3>

                        <p className="text-xs font-semibold text-brand-purple">
                          {booking.venueName} • Con {booking.staffName}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1 font-semibold text-brand-carbon">
                            <Calendar className="w-3.5 h-3.5 text-brand-purple" />
                            {booking.date}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-brand-carbon">
                            <Clock className="w-3.5 h-3.5 text-brand-mint" />
                            {booking.time}
                          </span>
                          <span className="flex items-center gap-1 text-slate-400">
                            <MapPin className="w-3.5 h-3.5" />
                            {booking.venueAddress}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price & Action Buttons with 2h Policy Indicator */}
                    <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      <div className="text-left md:text-right">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Total</span>
                        <span className="font-display font-black text-2xl text-brand-carbon">
                          {formatMoney ? formatMoney(booking.price) : `$${booking.price}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Reagendar button */}
                        <button
                          onClick={() => handleOpenActionModal(booking, 'reschedule')}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-brand-purple hover:bg-brand-purple/10 border border-brand-purple/30 transition-colors flex items-center gap-1.5"
                          title="Permitido hasta 2 horas antes de la cita"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reagendar (2h antes)</span>
                        </button>

                        {/* Cancelar button */}
                        <button
                          onClick={() => handleOpenActionModal(booking, 'cancel')}
                          className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1.5"
                          title="Permitido hasta 2 horas antes de la cita"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancelar (2h antes)</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'past' && (
            <div className="space-y-3">
              {pastBookings.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 text-center text-slate-500 text-sm">
                  No tienes citas pasadas o canceladas registradas en esta sesión.
                </div>
              ) : (
                pastBookings.map((b) => (
                  <div key={b.id} className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-brand-carbon">{b.serviceName}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          b.status === 'cancelled' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {b.status === 'cancelled' ? 'Cancelada' : 'Completada'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500">{b.venueName} • Con {b.staffName} • {b.date} a las {b.time}</div>
                      
                      {b.cancellationReason && (
                        <div className="text-xs text-rose-600 font-medium bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100 mt-2">
                          <span className="font-bold">Motivo de cancelación:</span> {b.cancellationReason}
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <span className="font-display font-bold text-sm text-brand-carbon">
                        {formatMoney ? formatMoney(b.price) : `$${b.price}`}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

      </div>

      {/* POPUP MODAL: Reagendar / Cancelar Cita (Hasta 2 horas antes) */}
      {modalBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-carbon/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in duration-200 border border-slate-100">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${actionType === 'reschedule' ? 'bg-brand-purple/10 text-brand-purple' : 'bg-rose-100 text-rose-600'}`}>
                  {actionType === 'reschedule' ? <RefreshCw className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-brand-carbon">
                    {actionType === 'reschedule' ? 'Reagendar Cita' : 'Cancelar Cita'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">Código: {modalBooking.bookingCode}</p>
                </div>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Appointment Preview */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 text-xs space-y-1.5">
              <div className="font-bold text-sm text-brand-carbon">{modalBooking.serviceName}</div>
              <div className="text-slate-500 font-medium">
                {modalBooking.venueName} • Con <strong className="text-brand-carbon">{modalBooking.staffName}</strong>
              </div>
              <div className="text-slate-600 flex items-center gap-3 pt-1">
                <span className="flex items-center gap-1 font-semibold text-brand-purple">
                  <Calendar className="w-3.5 h-3.5" /> {modalBooking.date}
                </span>
                <span className="flex items-center gap-1 font-semibold text-brand-mint">
                  <Clock className="w-3.5 h-3.5" /> {modalBooking.time}
                </span>
              </div>
            </div>

            {/* 2-Hour Policy Notice Banner */}
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs">
              <Info className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Política de Gestión de Citas:</span>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Las citas se pueden reagendar o cancelar sin penalización hasta <strong>2 horas antes</strong> de la hora acordada.
                </p>
              </div>
            </div>

            {/* Action Switcher Tabs (Reagendar vs Cancelar) */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setActionType('reschedule')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  actionType === 'reschedule'
                    ? 'bg-white text-brand-purple shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reagendar (2h antes)</span>
              </button>

              <button
                type="button"
                onClick={() => setActionType('cancel')}
                className={`py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 ${
                  actionType === 'cancel'
                    ? 'bg-white text-rose-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Cancelar (2h antes)</span>
              </button>
            </div>

            {/* If Reschedule: Date & Time Picker */}
            {actionType === 'reschedule' && (
              <div className="space-y-3 pt-1 animate-in fade-in duration-150">
                <div>
                  <label className="block text-xs font-bold text-brand-carbon uppercase tracking-wider mb-1.5">
                    Selecciona Nueva Fecha:
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-brand-carbon focus:outline-none focus:border-brand-purple bg-slate-50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-carbon uppercase tracking-wider mb-1.5">
                    Selecciona Nuevo Horario:
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {AVAILABLE_RESCHEDULE_SLOTS.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setNewTime(slot)}
                        className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition-all border ${
                          newTime === slot
                            ? 'bg-brand-purple text-white border-brand-purple shadow-sm'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-brand-purple/40'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Motivo Section (Reason Chips + Textarea) */}
            <div className="space-y-2 pt-1">
              <label className="block text-xs font-bold text-brand-carbon uppercase tracking-wider">
                Motivo del {actionType === 'reschedule' ? 'Reagendamiento' : 'Cancelación'}:
              </label>
              
              {/* Quick Select Pills */}
              <div className="flex flex-wrap gap-1.5">
                {QUICK_REASONS.map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setSelectedQuickReason(reason)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all border ${
                      selectedQuickReason === reason
                        ? 'bg-brand-purple text-white border-brand-purple'
                        : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {reason}
                  </button>
                ))}
              </div>

              {/* Custom Reason Textarea */}
              <textarea
                rows={2}
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Escribe o amplía el motivo aquí (se registrará en tu ficha de cliente y en el calendario del negocio)..."
                className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-brand-carbon placeholder:text-slate-400 focus:outline-none focus:border-brand-purple"
              />
            </div>

            {/* Modal Bottom Buttons */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Mantener Cita
              </button>

              <button
                type="button"
                onClick={handleConfirmAction}
                className={`px-5 py-2.5 rounded-xl font-extrabold text-xs text-white shadow-md transition-all flex items-center gap-2 ${
                  actionType === 'reschedule'
                    ? 'bg-brand-purple hover:bg-brand-purple-dark shadow-brand-sm'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                {actionType === 'reschedule' ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Confirmar Reagendar (2h antes)</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Confirmar Cancelación (2h antes)</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
