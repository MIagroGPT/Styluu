import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { ConfirmationCard } from './ConfirmationCard';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Clock, 
  Calendar as CalendarIcon, 
  User, 
  Sparkles, 
  CreditCard, 
  Wallet, 
  ShieldCheck,
  Star
} from 'lucide-react';

export const BookingFlowModal = () => {
  const { language, t } = useLanguage();
  const { 
    isBookingModalOpen, 
    closeBookingModal, 
    bookingVenue, 
    staffMembers, 
    addAppointment,
    confirmedBookingData
  } = useApp();

  const [step, setStep] = useState(1); // 1: Services, 2: Staff, 3: Date/Time, 4: Customer Info
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const daysShort = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthsShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const datesList = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const label = i === 0 ? 'Hoy' : (i === 1 ? 'Mañana' : `${daysShort[d.getDay()]} ${d.getDate()} ${monthsShort[d.getMonth()]}`);
    return {
      label,
      val,
      day: String(d.getDate())
    };
  });

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 AM');
  
  const [clientName, setClientName] = useState('Diego Ramirez');
  const [clientPhone, setClientPhone] = useState('+1 (786) 555-4422');
  const [clientEmail, setClientEmail] = useState('diego.ramirez@mail.com');
  const [paymentMethod, setPaymentMethod] = useState('venue'); // 'venue' | 'online'

  if (!isBookingModalOpen || !bookingVenue) return null;

  const venueServices = bookingVenue.services || [];

  // Initialize selected service if empty
  if (selectedServices.length === 0 && venueServices.length > 0) {
    if (bookingVenue.initialSelectedServices && bookingVenue.initialSelectedServices.length > 0) {
      setSelectedServices(bookingVenue.initialSelectedServices);
    } else {
      setSelectedServices([venueServices[0]]);
    }
  }

  const toggleService = (srv) => {
    if (selectedServices.find(s => s.id === srv.id)) {
      if (selectedServices.length > 1) {
        setSelectedServices(selectedServices.filter(s => s.id !== srv.id));
      }
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);

  const availableSlots = [
    '09:00 AM', '09:45 AM', '10:00 AM', '10:30 AM', 
    '11:15 AM', '01:00 PM', '02:00 PM', '03:00 PM', 
    '04:15 PM', '05:00 PM', '06:30 PM'
  ];

  const handleConfirmBooking = () => {
    addAppointment({
      venue: bookingVenue,
      services: selectedServices,
      staff: selectedStaff,
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      totalPrice,
      totalDuration,
      clientName,
      clientPhone,
      clientEmail,
      paymentMethod
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-carbon/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* If confirmation done, show confirmation card */}
        {confirmedBookingData ? (
          <div className="p-6">
            <ConfirmationCard booking={confirmedBookingData} onClose={closeBookingModal} />
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="p-1.5 rounded-full hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h3 className="font-display font-black text-lg text-brand-carbon">
                    {bookingVenue.name}
                  </h3>
                  <div className="text-xs text-slate-400">
                    Paso {step} de 4: {
                      step === 1 ? 'Servicios' :
                      step === 2 ? 'Especialista' :
                      step === 3 ? 'Fecha y Hora' : 'Tus Datos'
                    }
                  </div>
                </div>
              </div>

              <button
                onClick={closeBookingModal}
                className="p-2 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Progress bar */}
            <div className="w-full bg-slate-100 h-1">
              <div 
                className="bg-gradient-to-r from-brand-purple to-brand-mint h-1 transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* STEP 1: SELECT SERVICES */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-base text-brand-carbon">
                      Elige los servicios que deseas reservar:
                    </h4>
                    <span className="text-xs text-brand-purple font-semibold">
                      {selectedServices.length} seleccionados
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {venueServices.map((srv) => {
                      const isSelected = !!selectedServices.find(s => s.id === srv.id);
                      const name = language === 'en' ? srv.nameEn : srv.name;

                      return (
                        <div
                          key={srv.id}
                          onClick={() => toggleService(srv)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isSelected
                              ? 'border-brand-purple bg-brand-purple/5 shadow-brand-sm'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="font-bold text-sm text-brand-carbon">{name}</div>
                            <div className="text-xs text-slate-400 flex items-center gap-2">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {srv.duration} min
                              </span>
                              <span>•</span>
                              <span>{srv.category}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-display font-black text-base text-brand-carbon">
                              ${srv.price}
                            </span>
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                              isSelected ? 'bg-brand-purple text-white' : 'border border-slate-300 text-transparent'
                            }`}>
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: SELECT SPECIALIST */}
              {step === 2 && (
                <div className="space-y-4">
                  <h4 className="font-bold text-base text-brand-carbon">
                    ¿Con quién te gustaría atenderte?
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Any specialist option */}
                    <div
                      onClick={() => setSelectedStaff(null)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                        selectedStaff === null
                          ? 'border-brand-purple bg-brand-purple/5 ring-2 ring-brand-purple/20'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand-purple to-brand-mint text-white flex items-center justify-center font-bold">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-xs sm:text-sm text-brand-carbon">Cualquier Profesional</div>
                        <div className="text-[11px] text-emerald-600 font-semibold">Mayor disponibilidad</div>
                      </div>
                      {selectedStaff === null && <Check className="w-5 h-5 text-brand-purple stroke-[3]" />}
                    </div>

                    {/* Staff members */}
                    {staffMembers.map((staff) => {
                      const isSelected = selectedStaff?.id === staff.id;
                      return (
                        <div
                          key={staff.id}
                          onClick={() => setSelectedStaff(staff)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? 'border-brand-purple bg-brand-purple/5 ring-2 ring-brand-purple/20'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <img
                            src={staff.avatar}
                            alt={staff.name}
                            className="w-12 h-12 rounded-full object-cover border border-slate-200"
                          />
                          <div className="flex-1">
                            <div className="font-bold text-xs sm:text-sm text-brand-carbon">{staff.name}</div>
                            <div className="text-[11px] text-slate-500">{staff.role}</div>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{staff.rating}</span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-5 h-5 text-brand-purple stroke-[3]" />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: SELECT DATE & TIME */}
              {step === 3 && (
                <div className="space-y-6">
                  {/* Date Selector Row */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Selecciona una Fecha
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {datesList.map((d) => (
                        <button
                          key={d.val}
                          type="button"
                          onClick={() => setSelectedDate(d.val)}
                          className={`p-3 rounded-2xl border text-center transition-all ${
                            selectedDate === d.val
                              ? 'bg-brand-purple text-white border-brand-purple shadow-brand-sm'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div className="text-[10px] uppercase font-bold opacity-80">{d.label.split(' ')[0]}</div>
                          <div className="font-display font-black text-lg">{d.day}</div>
                          <div className="text-[9px] uppercase opacity-80">Sep 2026</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots Grid (Styled like palette image) */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Horas Disponibles
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                      {availableSlots.map((slot) => {
                        const isSlotSelected = selectedTimeSlot === slot;
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className={`py-3 px-2 rounded-xl text-xs font-bold transition-all ${
                              isSlotSelected
                                ? 'bg-brand-mint text-brand-carbon shadow-mint-glow font-black border-2 border-brand-mint'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: CUSTOMER INFO & PAYMENT */}
              {step === 4 && (
                <div className="space-y-5">
                  <h4 className="font-bold text-base text-brand-carbon">
                    Tus Datos de Contacto
                  </h4>

                  <div className="space-y-3 text-left">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 mb-1">
                        Nombre Completo
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-purple"
                        placeholder="Ej: Diego Ramirez"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">
                          Teléfono (WhatsApp)
                        </label>
                        <input
                          type="text"
                          value={clientPhone}
                          onChange={(e) => setClientPhone(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-purple"
                          placeholder="+1 (305) 000-0000"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={clientEmail}
                          onChange={(e) => setClientEmail(e.target.value)}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold focus:outline-none focus:border-brand-purple"
                          placeholder="tu@correo.com"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="space-y-2 pt-2">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Método de Pago
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div
                        onClick={() => setPaymentMethod('venue')}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                          paymentMethod === 'venue'
                            ? 'border-brand-purple bg-brand-purple/5 ring-2 ring-brand-purple/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Wallet className="w-5 h-5 text-brand-purple" />
                        <div>
                          <div className="font-bold text-xs text-brand-carbon">Pagar en el Local</div>
                          <div className="text-[11px] text-slate-500">Efectivo o Tarjeta</div>
                        </div>
                      </div>

                      <div
                        onClick={() => setPaymentMethod('online')}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center gap-3 ${
                          paymentMethod === 'online'
                            ? 'border-brand-purple bg-brand-purple/5 ring-2 ring-brand-purple/20'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <CreditCard className="w-5 h-5 text-brand-mint" />
                        <div>
                          <div className="font-bold text-xs text-brand-carbon">Pagar Online</div>
                          <div className="text-[11px] text-slate-500">Apple Pay / Tarjeta</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Modal Bottom Sticky Summary & Navigation */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] text-slate-400 block font-medium">Total Estimado ({totalDuration} min)</span>
                <span className="font-display font-black text-2xl text-brand-carbon">
                  ${totalPrice}
                </span>
              </div>

              {step < 4 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  className="px-6 py-3.5 rounded-2xl bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold text-sm shadow-brand-md flex items-center gap-2"
                >
                  <span>Continuar</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleConfirmBooking}
                  className="px-6 py-3.5 rounded-2xl bg-brand-purple hover:bg-brand-purple-dark text-white font-black text-sm shadow-brand-md hover:shadow-purple-glow transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Confirmar Reserva</span>
                </button>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  );
};
