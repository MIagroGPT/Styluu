import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  Clock, 
  Scissors, 
  Calendar as CalendarIcon, 
  Check, 
  DollarSign, 
  Lock, 
  Sparkles,
  Phone,
  Mail,
  ChevronDown
} from 'lucide-react';

export const NewAppointmentModal = ({ initialData, isOpen, onClose }) => {
  const { 
    staffMembers = [], 
    venues = [], 
    setCalendarAppointments, 
    showToast, 
    formatMoney, 
    currentCurrency 
  } = useApp();

  const getTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Extract catalog of services from venue or fallback
  const catalogServices = (venues && venues[0]?.services && venues[0].services.length > 0)
    ? venues[0].services
    : [
        { id: 'srv-1', name: 'Corte de Cabello Signature', price: 45, duration: 40, category: 'Cabello' },
        { id: 'srv-2', name: 'Diseño y Perfilado de Barba', price: 30, duration: 30, category: 'Barba' },
        { id: 'srv-3', name: 'Combo Completo: Corte + Barba VIP', price: 70, duration: 65, category: 'Combos' },
        { id: 'srv-4', name: 'Limpieza Facial & Mascarilla de Carbón', price: 35, duration: 25, category: 'Tratamientos' },
        { id: 'srv-5', name: 'Perfilado de Cejas con Navaja', price: 15, duration: 15, category: 'Detalles' }
      ];

  const defaultService = catalogServices[0] || {
    id: 'srv-1',
    name: 'Corte de Cabello Signature',
    price: 45,
    duration: 40,
    category: 'Cabello'
  };

  const [clientName, setClientName] = useState('Cliente Walk-in');
  const [clientPhone, setClientPhone] = useState('+1 (305) 555-0000');
  const [clientEmail, setClientEmail] = useState('walkin@styluu.com');
  const [selectedStaffId, setSelectedStaffId] = useState(staffMembers[0]?.id || 'staff-1');
  
  const [selectedServiceId, setSelectedServiceId] = useState(defaultService.id);
  const [serviceName, setServiceName] = useState(defaultService.name);
  const [serviceCategory, setServiceCategory] = useState(defaultService.category || 'General');
  const [serviceDuration, setServiceDuration] = useState(defaultService.duration || 45);
  const [price, setPrice] = useState(defaultService.price || 45);

  const [date, setDate] = useState(getTodayStr());
  const [time, setTime] = useState('11:00');
  const [notes, setNotes] = useState('');

  // Automatically synchronize state whenever the modal opens or the user clicks a specific slot/date in the calendar
  useEffect(() => {
    if (isOpen) {
      if (initialData?.date) {
        setDate(initialData.date);
      } else {
        setDate(getTodayStr());
      }

      if (initialData?.time) {
        setTime(initialData.time);
      }

      if (initialData?.staffId) {
        setSelectedStaffId(initialData.staffId);
      } else if (staffMembers.length > 0 && !selectedStaffId) {
        setSelectedStaffId(staffMembers[0].id);
      }

      if (initialData?.clientName) {
        setClientName(initialData.clientName);
      }

      // If initial service was passed or default
      if (initialData?.serviceName) {
        const found = catalogServices.find(s => s.name === initialData.serviceName);
        if (found) {
          setSelectedServiceId(found.id);
          setServiceName(found.name);
          setPrice(found.price);
          setServiceCategory(found.category || 'General');
          setServiceDuration(found.duration || 45);
        }
      }
    }
  }, [isOpen, initialData]);

  // Handle service dropdown selection: automatically sets fixed price and duration
  const handleServiceChange = (e) => {
    const srvId = e.target.value;
    setSelectedServiceId(srvId);
    const found = catalogServices.find(s => s.id === srvId);
    if (found) {
      setServiceName(found.name);
      setPrice(found.price);
      setServiceCategory(found.category || 'General');
      setServiceDuration(found.duration || 45);
    }
  };

  // Helper to calculate end time based on start time + service duration
  const calculateEndTime = (startTimeStr, durationMinutes = 45) => {
    if (!startTimeStr) return '12:00';
    const parts = startTimeStr.split(':').map(Number);
    const startH = isNaN(parts[0]) ? 10 : parts[0];
    const startM = isNaN(parts[1]) ? 0 : parts[1];
    const totalMinutes = startH * 60 + startM + durationMinutes;
    const endH = Math.floor(totalMinutes / 60) % 24;
    const endM = totalMinutes % 60;
    return `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const staff = staffMembers.find(s => s.id === selectedStaffId);
    const computedEndTime = calculateEndTime(time, serviceDuration);

    const newApt = {
      id: `apt-manual-${Date.now()}`,
      staffId: selectedStaffId,
      clientName: clientName.trim() || 'Cliente Walk-in',
      clientPhone: clientPhone.trim(),
      clientEmail: clientEmail.trim(),
      serviceName,
      serviceCategory,
      price: Number(price),
      startTime: time,
      endTime: computedEndTime,
      duration: Number(serviceDuration),
      date: date || getTodayStr(),
      status: 'confirmed',
      color: staff?.color || '#6045F4',
      notes: notes.trim()
    };

    setCalendarAppointments(prev => [...prev, newApt]);
    if (showToast) {
      showToast(`¡Cita agendada para ${newApt.clientName} el ${date} a las ${time} (${staff?.name || 'Staff'})!`, 'success');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-carbon/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in duration-200 border border-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-brand-purple to-indigo-600 text-white flex items-center justify-center shadow-brand-sm">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg text-brand-carbon leading-tight">
                Agendar Cita Manual
              </h3>
              <p className="text-[11px] text-slate-400">
                Selección sincronizada en vivo con la agenda
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-brand-carbon transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
          
          {/* Client Name */}
          <div>
            <label className="block text-slate-500 mb-1 font-bold">
              Nombre del Cliente <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Ej. Alejandro Salazar"
                className="w-full pl-3.5 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-brand-carbon focus:outline-none focus:border-brand-purple bg-slate-50/50"
                required
              />
            </div>
          </div>

          {/* Phone & Assigned Specialist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 mb-1 font-bold">Teléfono</label>
              <div className="relative">
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+52 33 1479 0654"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-brand-carbon focus:outline-none focus:border-brand-purple bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-bold">Especialista Asignado</label>
              <div className="relative">
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-brand-carbon focus:outline-none focus:border-brand-purple bg-slate-50/50 appearance-none pr-8 cursor-pointer"
                >
                  {staffMembers.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.role.split(' ')[0]})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Service Dropdown & Fixed Non-Editable Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Service Dropdown (Displays all services with default price & duration) */}
            <div>
              <label className="block text-slate-500 mb-1 font-bold">
                Servicio <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedServiceId}
                  onChange={handleServiceChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-brand-carbon focus:outline-none focus:border-brand-purple bg-slate-50/50 appearance-none pr-8 cursor-pointer"
                  required
                >
                  {catalogServices.map(srv => (
                    <option key={srv.id} value={srv.id}>
                      {srv.name} ({srv.duration} min) — {formatMoney(srv.price)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Price (Fixed / Non-Editable) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-500 font-bold">
                  Precio ({currentCurrency?.currencyCode || 'USD'})
                </label>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded font-bold border border-amber-200/80 flex items-center gap-0.5">
                  <Lock className="w-2.5 h-2.5" /> Fijo
                </span>
              </div>
              <div className="relative">
                <div className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100/80 text-xs font-black text-brand-carbon flex items-center justify-between cursor-not-allowed select-none">
                  <span>{formatMoney(price)}</span>
                  <span className="text-[10px] text-slate-400 font-normal">No editable</span>
                </div>
                {/* Hidden input to ensure form integrity */}
                <input type="hidden" name="price" value={price} />
              </div>
            </div>

          </div>

          {/* Date & Start Time (Auto pre-filled from calendar selection) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 mb-1 font-bold">
                Fecha de la Cita <span className="text-brand-purple text-[10px] font-normal">(Auto)</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-brand-carbon focus:outline-none focus:border-brand-purple bg-slate-50/50"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1 font-bold">
                Hora de Inicio <span className="text-brand-purple text-[10px] font-normal">(Auto)</span>
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-brand-carbon focus:outline-none focus:border-brand-purple bg-slate-50/50"
                  required
                />
              </div>
            </div>
          </div>

          {/* Special Notes */}
          <div>
            <label className="block text-slate-500 mb-1 font-bold">Notas / Instrucciones especiales</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Preferencias del cliente, estilo..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:border-brand-purple bg-slate-50/50"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white font-black text-xs shadow-brand-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Guardar Cita</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
