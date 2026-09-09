import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  User, 
  Filter, 
  Search, 
  Check, 
  Sparkles,
  SlidersHorizontal,
  MoreVertical,
  CalendarDays,
  CalendarRange,
  CalendarCheck,
  Grid,
  TrendingUp,
  Tag,
  Trash2,
  RotateCcw,
  CheckCircle2,
  BadgeCheck
} from 'lucide-react';

export const MultiStaffCalendar = ({ onOpenNewAppointment, onSelectAppointment }) => {
  const { t } = useLanguage();
  const { 
    calendarAppointments, 
    salesTransactions = [],
    payrollSettlements = [],
    staffMembers, 
    formatMoney, 
    currentCurrency,
    getStoreTimeSlots,
    getVenueOperatingHours,
    clearCalendarAppointments,
    resetCalendarAppointments
  } = useApp();

  // Helper to determine if an appointment has settled commission (PAGADA)
  const isAppointmentSettled = (apt) => {
    if (!apt) return false;
    if (apt.commissionSettled) return true;
    const matchingTx = salesTransactions.find(tx => 
      (tx.id === apt.id || (tx.staffId === apt.staffId && tx.date === apt.date && (tx.clientName === apt.clientName || tx.serviceName === apt.serviceName))) &&
      (tx.settled || tx.payoutStatus === 'paid')
    );
    return Boolean(matchingTx);
  };

  // Helper to check day settlement status for staff or whole team
  const getDaySettlementSummary = (dateStr, staffId = null) => {
    const dayApts = calendarAppointments.filter(a => 
      a.date === dateStr && 
      (staffId && staffId !== 'all' ? a.staffId === staffId : true) &&
      a.status !== 'cancelled'
    );
    if (dayApts.length === 0) return { total: 0, settled: 0, isAllSettled: false, hasSettled: false };
    const settledCount = dayApts.filter(a => isAppointmentSettled(a)).length;
    return {
      total: dayApts.length,
      settled: settledCount,
      isAllSettled: settledCount > 0 && settledCount === dayApts.length,
      hasSettled: settledCount > 0
    };
  };

  // View Mode: 'day' | 'week' | 'month' | 'year'
  const [calendarViewMode, setCalendarViewMode] = useState('day');
  
  // Date State (Initializes to actual real-time current date)
  const [currentDate, setCurrentDate] = useState(() => new Date());
  
  // Filters State
  const [staffFilter, setStaffFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const monthsOfYear = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  // Helper to format date object to YYYY-MM-DD
  const getLocalDateStr = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const selectedDateStr = getLocalDateStr(currentDate);

  // Day specific operating hours status (e.g. Saturdays shorter hours, Sundays closed)
  const currentDayOperatingHours = getVenueOperatingHours 
    ? getVenueOperatingHours(undefined, selectedDateStr) 
    : { isOpen: true, openingHour: '09:00', closingHour: '20:00', targetDay: 'Hoy' };

  // Dynamic time slots derived specifically for the viewed day
  const timeSlots = getStoreTimeSlots ? getStoreTimeSlots(30, selectedDateStr) : [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', 
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
  ];

  // Live Real-Time Clock State (updates every 5 seconds for smooth accuracy)
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Calculate live vertical position of the current time indicator
  const getLiveIndicator = () => {
    if (!timeSlots || timeSlots.length === 0) return null;

    const todayStr = getLocalDateStr(currentTime);
    // Show only when viewing today's date
    if (selectedDateStr !== todayStr) return null;

    const firstSlot = timeSlots[0];
    const lastSlot = timeSlots[timeSlots.length - 1];

    const [firstH, firstM] = firstSlot.split(':').map(Number);
    const [lastH, lastM] = lastSlot.split(':').map(Number);

    const slotDuration = 30; // 30 minutes per slot row
    const rowHeight = 60; // 60px height per slot row
    
    const startMinutes = firstH * 60 + firstM;
    const endMinutes = lastH * 60 + lastM + slotDuration;

    const curH = currentTime.getHours();
    const curM = currentTime.getMinutes();
    const curS = currentTime.getSeconds();
    const nowMinutes = curH * 60 + curM + (curS / 60);

    // If within or at boundaries of store hours
    if (nowMinutes < startMinutes || nowMinutes > endMinutes) {
      return null;
    }

    const minutesElapsed = nowMinutes - startMinutes;
    const topPx = (minutesElapsed / slotDuration) * rowHeight;

    const formattedTime = currentTime.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });

    return {
      topPx,
      formattedTime,
      nowMinutes
    };
  };

  const liveIndicator = getLiveIndicator();

  const visibleStaff = staffFilter === 'all' 
    ? staffMembers 
    : staffMembers.filter(s => s.id === staffFilter);

  // Filtered Appointments list (by staff, status, search)
  const filteredAppointments = calendarAppointments.filter(apt => {
    const matchesStaff = staffFilter === 'all' || apt.staffId === staffFilter;
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesSearch = !searchTerm.trim() || 
      (apt.clientName && apt.clientName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (apt.serviceName && apt.serviceName.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStaff && matchesStatus && matchesSearch;
  });

  // Appointments on the specific selected day
  const currentDayAppointments = filteredAppointments.filter(apt => apt.date === selectedDateStr);

  // Status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress':
        return 'border-brand-mint bg-brand-mint/20 text-teal-900';
      case 'completed':
        return 'border-slate-300 bg-slate-100 text-slate-700';
      case 'cancelled':
        return 'border-rose-300 bg-rose-50 text-rose-700';
      default:
        return 'border-brand-purple/30 bg-brand-purple/10 text-brand-purple';
    }
  };

  // Date Navigation handlers
  const handleNavigate = (direction) => {
    const newDate = new Date(currentDate);
    if (calendarViewMode === 'day') {
      newDate.setDate(newDate.getDate() + direction);
    } else if (calendarViewMode === 'week') {
      newDate.setDate(newDate.getDate() + (direction * 7));
    } else if (calendarViewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + direction);
    } else if (calendarViewMode === 'year') {
      newDate.setFullYear(newDate.getFullYear() + direction);
    }
    setCurrentDate(newDate);
  };

  const handleSetToday = () => {
    setCurrentDate(new Date());
  };

  const formatDateDisplay = () => {
    const year = currentDate.getFullYear();
    const month = monthsOfYear[currentDate.getMonth()];
    const day = currentDate.getDate();
    const dayIndex = (currentDate.getDay() + 6) % 7; // Monday = 0
    const dayName = daysOfWeek[dayIndex];

    if (calendarViewMode === 'day') {
      return `${dayName}, ${day} de ${month} ${year}`;
    } else if (calendarViewMode === 'week') {
      const curr = new Date(currentDate);
      const dayOfWeekIndex = (curr.getDay() + 6) % 7;
      const startW = new Date(curr);
      startW.setDate(curr.getDate() - dayOfWeekIndex);
      const endW = new Date(startW);
      endW.setDate(startW.getDate() + 6);
      return `${startW.getDate()} ${monthsOfYear[startW.getMonth()].slice(0, 3)} - ${endW.getDate()} ${monthsOfYear[endW.getMonth()].slice(0, 3)} ${year}`;
    } else if (calendarViewMode === 'month') {
      return `${month} ${year}`;
    } else {
      return `Año ${year}`;
    }
  };

  const handleSlotClick = (staffId, time, dateStr = selectedDateStr) => {
    onOpenNewAppointment({
      staffId,
      time,
      date: dateStr
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden flex flex-col min-h-[860px]">
      
      {/* 1. TOP CONTROL HEADER WITH DATE NAV & PRIMARY VIEW MODES (DÍA / SEMANA / MES / AÑO) */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-slate-50/70">
        
        {/* Left: Today & Date Step Navigator */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSetToday}
            className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-black text-brand-carbon hover:bg-slate-50 shadow-2xs transition-all cursor-pointer"
          >
            {t('bos_today')}
          </button>

          <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5 shadow-2xs">
            <button 
              onClick={() => handleNavigate(-1)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-bold text-brand-carbon flex items-center gap-1.5 select-none min-w-[170px] justify-center">
              <CalendarIcon className="w-3.5 h-3.5 text-brand-purple" />
              {formatDateDisplay()}
            </span>
            <button 
              onClick={() => handleNavigate(1)}
              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: VIEW SELECTOR TABS (Día / Semana / Mes / Año) */}
        <div className="flex bg-slate-200/80 p-1 rounded-2xl border border-slate-300/40">
          <button
            onClick={() => setCalendarViewMode('day')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              calendarViewMode === 'day' 
                ? 'bg-brand-purple text-white shadow-brand-sm font-black' 
                : 'text-slate-600 hover:text-brand-carbon'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Día</span>
          </button>

          <button
            onClick={() => setCalendarViewMode('week')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              calendarViewMode === 'week' 
                ? 'bg-brand-purple text-white shadow-brand-sm font-black' 
                : 'text-slate-600 hover:text-brand-carbon'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Semana</span>
          </button>

          <button
            onClick={() => setCalendarViewMode('month')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              calendarViewMode === 'month' 
                ? 'bg-brand-purple text-white shadow-brand-sm font-black' 
                : 'text-slate-600 hover:text-brand-carbon'
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5" />
            <span>Mes</span>
          </button>

          <button
            onClick={() => setCalendarViewMode('year')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              calendarViewMode === 'year' 
                ? 'bg-brand-purple text-white shadow-brand-sm font-black' 
                : 'text-slate-600 hover:text-brand-carbon'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>Año</span>
          </button>
        </div>

        {/* Right: Actions (Clean Agenda, Demo Reset & New Appointment) */}
        <div className="flex items-center gap-2">
          {/* Clear & Demo Buttons */}
          <button
            onClick={() => {
              if (window.confirm('¿Deseas vaciar la agenda por completo para agendar citas reales desde cero?')) {
                clearCalendarAppointments();
              }
            }}
            title="Limpiar todas las citas y dejar agenda vacía"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span className="hidden md:inline">Limpiar Agenda</span>
          </button>

          <button
            onClick={() => resetCalendarAppointments()}
            title="Restablecer citas de demostración"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Cargar Demo</span>
          </button>

          {/* New Appointment Button */}
          <button
            onClick={() => onOpenNewAppointment({ date: selectedDateStr })}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-black shadow-brand-sm hover:shadow-purple-glow transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t('bos_new_appointment')}</span>
          </button>
        </div>

      </div>

      {/* 2. ACTIVE FILTERS SECONDARY BAR (Staff Filter, Status Filter & Search) */}
      <div className="px-5 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white text-xs">
        
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Staff Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <User className="w-3.5 h-3.5 text-brand-purple" />
            <select
              value={staffFilter}
              onChange={(e) => setStaffFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">⭐ Todos los Especialistas ({staffMembers.length})</option>
              {staffMembers.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.role.split(' ')[0]})</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5">
            <Tag className="w-3.5 h-3.5 text-brand-mint" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">Todos los Estados</option>
              <option value="confirmed">Confirmadas</option>
              <option value="in_progress">En Servicio</option>
              <option value="completed">Completadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por cliente o servicio..."
              className="pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium focus:outline-none focus:border-brand-purple w-48 sm:w-60"
            />
          </div>

        </div>

        {/* Right Active Summary */}
        <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-3">
          {calendarViewMode === 'day' ? (
            <span>Citas en este día ({selectedDateStr}): <strong className="text-brand-purple">{currentDayAppointments.length} citas</strong></span>
          ) : (
            <span>Total en base de datos: <strong className="text-brand-purple">{filteredAppointments.length} citas</strong></span>
          )}
        </div>

      </div>

      {/* 3. DYNAMIC CALENDAR VIEWS (DAY, WEEK, MONTH, YEAR) */}

      {/* VISTA 1: VISTA DE DÍA (MULTI-STAFF MATRIX) */}
      {calendarViewMode === 'day' && (
        !currentDayOperatingHours.isOpen || timeSlots.length === 0 ? (
          <div className="flex-1 p-12 flex flex-col items-center justify-center text-center space-y-4 bg-slate-50/50 min-h-[450px]">
            <div className="w-16 h-16 rounded-3xl bg-slate-200/80 text-slate-500 flex items-center justify-center shadow-xs">
              <Clock className="w-8 h-8 text-slate-600" />
            </div>
            <div className="max-w-md space-y-1">
              <h3 className="font-display font-black text-lg text-brand-carbon">
                Salón Cerrado los {currentDayOperatingHours.targetDay || 'días no laborables'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                El negocio no tiene jornada de atención al público configurada para esta fecha ({selectedDateStr}).
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => handleNavigate(1)}
                className="px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-bold shadow-brand-sm transition-all cursor-pointer"
              >
                Ver siguiente día
              </button>
              <button
                onClick={handleSetToday}
                className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all cursor-pointer"
              >
                Ir a Hoy
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-auto bg-slate-50/30">
            <div className="min-w-[920px] relative">
              
              {/* Header Row: Staff Column Headers */}
              <div className="sticky top-0 z-10 bg-white border-b border-slate-200 grid grid-cols-[80px_repeat(5,1fr)] shadow-xs">
              {/* Time empty corner */}
              <div className="p-3.5 border-r border-slate-200 text-center font-mono text-xs font-bold text-slate-400 bg-slate-50/80">
                GMT-4
              </div>

              {/* Staff Columns */}
              {visibleStaff.map((staff) => {
                const staffDayApts = currentDayAppointments.filter(a => a.staffId === staff.id);
                const daySettlement = getDaySettlementSummary(selectedDateStr, staff.id);

                return (
                  <div 
                    key={staff.id} 
                    className={`p-3 border-r border-slate-200 flex items-center justify-between transition-colors ${
                      daySettlement.isAllSettled ? 'bg-emerald-50/40 border-b-2 border-b-emerald-500' : 'bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative">
                        <img
                          src={staff.avatar}
                          alt={staff.name}
                          className="w-9 h-9 rounded-full object-cover border-2 border-slate-100 shadow-2xs"
                        />
                        <div 
                          className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border border-white"
                          style={{ backgroundColor: staff.color }}
                        />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-brand-carbon leading-tight">{staff.name}</h4>
                        <span className="text-[10px] text-slate-400 font-medium leading-none block mt-0.5">
                          {staff.role}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                        staffDayApts.length > 0 ? 'bg-brand-purple/10 text-brand-purple' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {staffDayApts.length} {staffDayApts.length === 1 ? 'cita' : 'citas'}
                      </span>
                      {daySettlement.isAllSettled && (
                        <span className="inline-flex items-center gap-0.5 text-[8.5px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> PAGADA
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time Rows & Slot Cells */}
            <div className="divide-y divide-slate-200/70 relative">
              
              {/* LIVE REAL-TIME MOVING TIME INDICATOR LINE & BADGE */}
              {liveIndicator && (
                <div 
                  className="absolute left-0 right-0 z-30 pointer-events-none flex items-center transition-all duration-700 ease-out"
                  style={{ top: `${liveIndicator.topPx}px` }}
                >
                  {/* Left Column (80px) Floating Glass Time Badge */}
                  <div className="w-[80px] flex justify-center items-center px-1">
                    <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-slate-950/90 text-white shadow-lg backdrop-blur-md border border-brand-purple/40 ring-1 ring-white/10">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-mint opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-mint"></span>
                      </span>
                      <span className="font-mono text-[9px] font-black text-brand-mint tracking-tight">
                        {liveIndicator.formattedTime}
                      </span>
                    </div>
                  </div>

                  {/* Laser Living Gradient Timeline across all staff columns */}
                  <div className="flex-1 relative flex items-center">
                    {/* Soft ambient aura background */}
                    <div className="absolute inset-x-0 h-4 bg-gradient-to-r from-brand-purple/25 via-brand-mint/30 to-pink-500/25 blur-sm" />

                    {/* Glowing Head Beacon Orb with radar pulse */}
                    <div className="relative z-20 -ml-1.5 flex items-center justify-center">
                      <span className="absolute w-4 h-4 rounded-full bg-brand-mint/40 animate-ping" />
                      <div className="w-3 h-3 rounded-full bg-white border-2 border-brand-purple shadow-[0_0_12px_#53E6D4,0_0_20px_#6045F4] animate-beacon relative z-10" />
                    </div>

                    {/* Fluid Living Gradient Line shifting through brand colors */}
                    <div className="h-[2px] flex-1 rounded-full animate-live-gradient shadow-[0_0_10px_rgba(96,69,244,0.7),0_0_16px_rgba(83,230,212,0.8)] relative z-10" />

                    {/* Micro Live Tag on far right */}
                    <div className="mr-3 px-2 py-0.5 rounded-full bg-slate-900/90 text-[8px] font-black tracking-widest uppercase text-white/95 border border-brand-purple/30 shadow-md flex items-center gap-1 relative z-10 backdrop-blur-sm">
                      <Sparkles className="w-2.5 h-2.5 text-brand-mint animate-pulse" />
                      <span className="bg-gradient-to-r from-brand-mint via-purple-300 to-pink-300 bg-clip-text text-transparent">
                        EN VIVO
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {timeSlots.map((time) => (
                <div key={time} className="grid grid-cols-[80px_repeat(5,1fr)] h-[60px] group">
                  
                  {/* Time Label */}
                  <div className="p-2 border-r border-slate-200 text-center font-mono text-xs text-slate-400 font-medium bg-slate-50/40 select-none flex items-center justify-center">
                    {time}
                  </div>

                  {/* Staff Cells */}
                  {visibleStaff.map((staff) => {
                    const matchingApt = currentDayAppointments.find(
                      apt => apt.staffId === staff.id && (apt.startTime === time || apt.startTime?.slice(0, 5) === time)
                    );

                    const isCancelled = matchingApt?.status === 'cancelled';
                    const isSettled = isAppointmentSettled(matchingApt);

                    return (
                      <div
                        key={staff.id}
                        onClick={() => (!matchingApt || isCancelled) && handleSlotClick(staff.id, time, selectedDateStr)}
                        className={`p-1.5 border-r border-slate-200/80 relative transition-colors ${
                          matchingApt ? (isCancelled ? 'bg-rose-50/20' : (isSettled ? 'bg-emerald-50/30' : 'bg-white')) : 'hover:bg-brand-purple/5 cursor-pointer'
                        }`}
                      >
                        {matchingApt && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectAppointment(matchingApt);
                            }}
                            className={`h-full w-full p-2.5 rounded-2xl text-xs flex flex-col justify-between shadow-2xs hover:shadow-brand-sm transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5 border ${
                              isCancelled 
                                ? 'opacity-60 border-rose-300 bg-rose-50/40' 
                                : isSettled 
                                  ? 'border-emerald-400 bg-emerald-50/30' 
                                  : ''
                            }`}
                            style={{
                              backgroundColor: !isCancelled && !isSettled ? (matchingApt.color ? `${matchingApt.color}18` : '#6045F418') : undefined,
                              borderColor: !isCancelled && !isSettled ? (matchingApt.color ? `${matchingApt.color}40` : '#6045F440') : undefined
                            }}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className={`font-extrabold text-[11px] truncate ${isCancelled ? 'line-through text-rose-800' : 'text-brand-carbon'}`}>
                                {matchingApt.clientName}
                              </span>
                              <span className={`font-bold text-[10px] ${isCancelled ? 'line-through text-slate-400' : 'text-brand-carbon'}`}>
                                {formatMoney(matchingApt.price)}
                              </span>
                            </div>

                            <div className={`text-[10px] truncate font-medium ${isCancelled ? 'text-slate-400' : 'text-slate-600'}`}>
                              {matchingApt.serviceName}
                            </div>

                            <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mt-0.5 gap-1">
                              <span className="truncate">{matchingApt.startTime} - {matchingApt.endTime}</span>
                              <div className="flex items-center gap-1 shrink-0">
                                {isSettled && !isCancelled && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[8.5px] font-black bg-emerald-600 text-white shadow-2xs">
                                    <CheckCircle2 className="w-2.5 h-2.5" /> PAGADA
                                  </span>
                                )}
                                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${getStatusColor(matchingApt.status)}`}>
                                  {matchingApt.status === 'cancelled' ? 'Cancelada' : matchingApt.status}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {!matchingApt && (
                          <div className="opacity-0 group-hover:opacity-100 absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-[10px] font-bold text-brand-purple flex items-center gap-1">
                              <Plus className="w-3 h-3" /> Agendar
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    )}

      {/* VISTA 2: VISTA DE SEMANA (7 DÍAS REALES LUN-DOM SEGÚN LA FECHA SELECCIONADA) */}
      {calendarViewMode === 'week' && (() => {
        const curr = new Date(currentDate);
        const dayOfWeekIndex = (curr.getDay() + 6) % 7; // Monday = 0
        const monday = new Date(curr);
        monday.setDate(curr.getDate() - dayOfWeekIndex);

        const weekDays = Array.from({ length: 7 }, (_, idx) => {
          const d = new Date(monday);
          d.setDate(monday.getDate() + idx);
          const dateStr = getLocalDateStr(d);
          const isToday = d.toDateString() === new Date().toDateString();
          const isSelected = d.toDateString() === currentDate.toDateString();
          const dayApts = filteredAppointments.filter(a => a.date === dateStr);
          const settlement = getDaySettlementSummary(dateStr, staffFilter === 'all' ? null : staffFilter);
          const dayHours = getVenueOperatingHours ? getVenueOperatingHours(undefined, dateStr) : { isOpen: true, formatted: '09:00 - 20:00' };
          return {
            dateObj: d,
            dateStr,
            dayName: daysOfWeek[idx],
            dayNumber: d.getDate(),
            monthName: monthsOfYear[d.getMonth()],
            isToday,
            isSelected,
            dayApts,
            settlement,
            dayHours
          };
        });

        return (
          <div className="flex-1 p-6 overflow-auto bg-slate-50/50 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {weekDays.map((wd) => {
                const isDayLiquidated = wd.settlement.isAllSettled;
                return (
                  <div 
                    key={wd.dateStr}
                    className={`bg-white rounded-2xl border p-4 shadow-2xs space-y-3 flex flex-col justify-between transition-all ${
                      isDayLiquidated
                        ? 'border-emerald-400/90 ring-2 ring-emerald-400/20 bg-emerald-50/15'
                        : wd.isToday 
                          ? 'border-brand-purple ring-2 ring-brand-purple/20 bg-brand-purple/[0.02]' 
                          : (wd.isSelected ? 'border-brand-purple/50 shadow-sm' : 'border-slate-200')
                    }`}
                  >
                    <div>
                      <div 
                        onClick={() => {
                          setCurrentDate(wd.dateObj);
                          setCalendarViewMode('day');
                        }}
                        className="flex items-center justify-between pb-2 border-b border-slate-100 cursor-pointer hover:opacity-80"
                      >
                        <div>
                          <div className={`text-xs font-bold ${wd.isToday ? 'text-brand-purple font-black' : (isDayLiquidated ? 'text-emerald-700 font-bold' : 'text-slate-500')}`}>
                            {wd.dayName} {wd.isToday && '• Hoy'}
                          </div>
                          <div className="font-display font-black text-lg text-brand-carbon">
                            {wd.dayNumber} {wd.monthName.slice(0, 3)}
                          </div>
                          <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded inline-block mt-0.5 ${wd.dayHours?.isOpen ? 'text-slate-500 bg-slate-100' : 'text-slate-400 bg-slate-100'}`}>
                            {wd.dayHours?.isOpen ? wd.dayHours.formatted : '🔒 Cerrado'}
                          </span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            wd.dayApts.length > 0 ? 'bg-brand-purple/15 text-brand-purple' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {wd.dayApts.length} {wd.dayApts.length === 1 ? 'cita' : 'citas'}
                          </span>
                          {isDayLiquidated && (
                            <span className="inline-flex items-center gap-0.5 text-[8px] font-black px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                              <CheckCircle2 className="w-2 h-2 text-emerald-600" /> PAGADA
                            </span>
                          )}
                          {wd.settlement.hasSettled && !isDayLiquidated && (
                            <span className="inline-flex items-center gap-0.5 text-[8px] font-bold px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              🟢 {wd.settlement.settled}/{wd.settlement.total}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 max-h-96 overflow-y-auto">
                        {wd.dayApts.map((apt) => {
                          const staff = staffMembers.find(s => s.id === apt.staffId);
                          const isSettled = isAppointmentSettled(apt);
                          return (
                            <div
                              key={apt.id}
                              onClick={() => onSelectAppointment(apt)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer text-xs space-y-1 shadow-2xs ${
                                isSettled 
                                  ? 'bg-emerald-50/40 border-emerald-300 hover:border-emerald-400' 
                                  : 'border-slate-100 bg-slate-50/70 hover:bg-brand-purple/10 hover:border-brand-purple/40'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[11px] text-brand-carbon truncate">{apt.clientName}</span>
                                <span className="font-black text-[10px] text-brand-purple">{formatMoney(apt.price)}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 truncate">{apt.serviceName}</div>
                              <div className="flex items-center justify-between text-[9px] font-mono text-slate-400">
                                <span>{apt.startTime} • {staff?.name?.split(' ')[0] || 'Staff'}</span>
                                {isSettled && (
                                  <span className="inline-flex items-center gap-0.5 px-1 py-0.2 rounded text-[8px] font-black bg-emerald-600 text-white">
                                    PAGADA
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}

                        {wd.dayApts.length === 0 && (
                          <div className="py-8 text-center text-slate-300 text-[11px]">
                            Sin citas
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onOpenNewAppointment({ date: wd.dateStr })}
                      className="w-full py-1.5 rounded-lg border border-dashed border-slate-300 hover:border-brand-purple text-[10px] font-bold text-slate-500 hover:text-brand-purple transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" /> Añadir Cita
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* VISTA 3: VISTA DE MES (CALENDARIO MENSUAL DINÁMICO) */}
      {calendarViewMode === 'month' && (() => {
        const daysInCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const startDayOffset = (new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() + 6) % 7; // Monday = 0
        const todayDate = new Date();
        const isCurrentMonth = todayDate.getMonth() === currentDate.getMonth() && todayDate.getFullYear() === currentDate.getFullYear();

        return (
          <div className="flex-1 p-6 overflow-auto bg-slate-50/50 space-y-4">
            <div className="grid grid-cols-7 gap-2">
              {daysOfWeek.map(d => (
                <div key={d} className="text-center font-bold text-xs text-slate-400 uppercase py-2">
                  {d.slice(0, 3)}
                </div>
              ))}

              {/* Blank placeholder cells before the 1st day of the month */}
              {Array.from({ length: startDayOffset }).map((_, emptyIdx) => (
                <div key={`empty-${emptyIdx}`} className="min-h-[96px] p-2 rounded-2xl border border-transparent opacity-0 pointer-events-none" />
              ))}

              {/* Days of the month */}
              {Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1).map((dayNum) => {
                const isSelectedDay = isCurrentMonth && todayDate.getDate() === dayNum;
                const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNum);
                const dayStr = getLocalDateStr(cellDate);
                const dayApts = filteredAppointments.filter(a => a.date === dayStr);
                const count = dayApts.length;
                const totalDayRevenue = dayApts.reduce((sum, a) => sum + (Number(a.price) || 0), 0);
                const settlement = getDaySettlementSummary(dayStr, staffFilter === 'all' ? null : staffFilter);

                return (
                  <div
                    key={dayNum}
                    onClick={() => {
                      setCurrentDate(cellDate);
                      setCalendarViewMode('day');
                    }}
                    className={`min-h-[96px] p-2.5 rounded-2xl border bg-white hover:border-brand-purple hover:shadow-brand-sm transition-all cursor-pointer flex flex-col justify-between ${
                      settlement.isAllSettled
                        ? 'border-emerald-400 bg-emerald-50/20'
                        : isSelectedDay 
                          ? 'border-brand-purple ring-2 ring-brand-purple/20 bg-brand-purple/5' 
                          : 'border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                        isSelectedDay ? 'bg-brand-purple text-white shadow-2xs' : (settlement.isAllSettled ? 'bg-emerald-600 text-white' : 'text-slate-700')
                      }`}>
                        {dayNum}
                      </span>
                      <div className="flex items-center gap-1">
                        {settlement.isAllSettled && (
                          <span className="text-[8px] font-black px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                            PAGADA
                          </span>
                        )}
                        {count > 0 && !settlement.isAllSettled && (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-brand-mint/30 text-teal-900">
                            {count} {count === 1 ? 'cita' : 'citas'}
                          </span>
                        )}
                      </div>
                    </div>

                    {count > 0 ? (
                      <div className="space-y-0.5">
                        <div className="text-[10px] font-bold text-brand-carbon truncate">
                          {formatMoney(totalDayRevenue)}
                        </div>
                        <div className="flex gap-1 items-center">
                          {settlement.hasSettled && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Comisión Liquidada" />}
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-purple" />
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-mint" />
                        </div>
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-300">Disponible</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* VISTA 4: VISTA DE AÑO (12 MESES) */}
      {calendarViewMode === 'year' && (
        <div className="flex-1 p-6 overflow-auto bg-slate-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {monthsOfYear.map((monthName, mIdx) => {
              const currentYear = currentDate.getFullYear();
              const isCurrentMonth = new Date().getMonth() === mIdx && new Date().getFullYear() === currentYear;
              
              const monthApts = filteredAppointments.filter(a => {
                if (!a.date) return false;
                const parts = a.date.split('-');
                return Number(parts[0]) === currentYear && Number(parts[1]) === (mIdx + 1);
              });
              const monthlyTotalRevenue = monthApts.reduce((sum, a) => sum + (Number(a.price) || 0), 0);

              return (
                <div
                  key={monthName}
                  onClick={() => {
                    setCurrentDate(new Date(currentYear, mIdx, 1));
                    setCalendarViewMode('month');
                  }}
                  className={`bg-white rounded-3xl p-5 border shadow-sm hover:shadow-brand-md transition-all cursor-pointer space-y-3 ${
                    isCurrentMonth ? 'border-brand-purple ring-2 ring-brand-purple/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <h4 className="font-display font-black text-base text-brand-carbon">
                      {monthName} {currentYear}
                    </h4>
                    {isCurrentMonth && (
                      <span className="px-2 py-0.5 rounded-full bg-brand-purple text-white text-[10px] font-bold uppercase">
                        Actual
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Citas Registradas:</span>
                      <strong className="text-brand-carbon font-bold">{monthApts.length} citas</strong>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Facturación Real:</span>
                      <strong className="text-brand-purple font-black">{formatMoney(monthlyTotalRevenue)}</strong>
                    </div>
                  </div>

                  {/* Visual status */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                      <span>Estado</span>
                      <span>{monthApts.length > 0 ? `${monthApts.length} citas agendadas` : 'Sin actividad'}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-brand-purple to-brand-mint h-2 rounded-full transition-all" 
                        style={{ width: `${Math.min(100, monthApts.length * 8)}%` }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
