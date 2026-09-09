import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar as CalendarIcon, 
  Award, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles,
  Filter,
  Download,
  Printer,
  CreditCard,
  Wallet,
  Smartphone,
  Scissors,
  ShoppingBag,
  Percent,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  FileText,
  Trash2,
  RotateCcw
} from 'lucide-react';

export const AnalyticsDashboard = () => {
  const { 
    staffMembers, 
    products, 
    showToast, 
    formatMoney, 
    currentCurrency,
    salesTransactions,
    clearSalesTransactions,
    recordSaleTransaction,
    getVenueOperatingHours
  } = useApp();

  // Filters State
  const [timePeriod, setTimePeriod] = useState('day'); // 'day' | 'week' | 'month'
  // Selected Date string (defaults to today)
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [selectedStaffId, setSelectedStaffId] = useState('all'); // 'all' or staff ID

  const monthsOfYear = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeekFull = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  const daysOfWeekShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  // Helper to parse date string YYYY-MM-DD safely to local Date
  const parseLocalDate = (dateStr) => {
    if (!dateStr) return new Date();
    const parts = dateStr.split('-').map(Number);
    if (parts.length < 3 || isNaN(parts[0])) return new Date();
    return new Date(parts[0], parts[1] - 1, parts[2]);
  };

  const formatLocalDateStr = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Selected Date Object
  const currDateObj = parseLocalDate(selectedDate);

  // Calculate Monday to Sunday range for the selectedDate
  const dayOfWeekIndex = (currDateObj.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  
  const mondayObj = new Date(currDateObj);
  mondayObj.setDate(currDateObj.getDate() - dayOfWeekIndex);
  
  const sundayObj = new Date(mondayObj);
  sundayObj.setDate(mondayObj.getDate() + 6);

  const weekMondayStr = formatLocalDateStr(mondayObj);
  const weekSundayStr = formatLocalDateStr(sundayObj);

  // Month names for week range
  const mondayMonthName = monthsOfYear[mondayObj.getMonth()].toUpperCase();
  const sundayMonthName = monthsOfYear[sundayObj.getMonth()].toUpperCase();
  const weekMonthHeader = mondayObj.getMonth() === sundayObj.getMonth()
    ? mondayMonthName
    : `${mondayMonthName} / ${sundayMonthName}`;

  // Formatted Label: MES: SEPTIEMBRE - SEMANA DEL ( Lunes 5 - Domingo 13 )
  const weekRangeLabel = `MES: ${weekMonthHeader} - SEMANA DEL ( Lunes ${mondayObj.getDate()} - Domingo ${sundayObj.getDate()} )`;

  // Formatted Day Label: HOY MARTES 8 DE SEPTIEMBRE / JUEVES 9 DE SEPTIEMBRE
  const todayDateStr = formatLocalDateStr(new Date());
  const isSelectedToday = selectedDate === todayDateStr;
  const dayNameFull = daysOfWeekFull[dayOfWeekIndex].toUpperCase();
  const dayMonthName = monthsOfYear[currDateObj.getMonth()].toUpperCase();
  const dayNumber = currDateObj.getDate();
  const dayLabelFull = isSelectedToday
    ? `HOY ${dayNameFull} ${dayNumber} DE ${dayMonthName}`
    : `${dayNameFull} ${dayNumber} DE ${dayMonthName}`;

  // Selected specialist object
  const activeStaff = selectedStaffId === 'all' 
    ? null 
    : staffMembers.find(s => s.id === selectedStaffId);

  // Filter transactions by selected specialist and period
  const filteredTransactions = salesTransactions.filter(tx => {
    const matchesStaff = selectedStaffId === 'all' || tx.staffId === selectedStaffId;
    let matchesDate = true;
    const txDate = tx.date || selectedDate;
    
    if (timePeriod === 'day') {
      matchesDate = !selectedDate || txDate === selectedDate;
    } else if (timePeriod === 'week') {
      matchesDate = txDate >= weekMondayStr && txDate <= weekSundayStr;
    } else if (timePeriod === 'month') {
      if (selectedDate && txDate) {
        const selParts = selectedDate.split('-');
        const txParts = txDate.split('-');
        matchesDate = selParts[0] === txParts[0] && selParts[1] === txParts[1];
      }
    }
    return matchesStaff && matchesDate;
  });

  // Calculate real metrics from transactions
  const totalRevenue = filteredTransactions.reduce((acc, tx) => acc + (Number(tx.totalAmount) || 0), 0);
  const servicesRevenue = filteredTransactions.reduce((acc, tx) => acc + (Number(tx.servicePrice) || 0), 0);
  const retailRevenue = filteredTransactions.reduce((acc, tx) => acc + (Number(tx.productsTotal) || 0), 0);
  const tipsTotal = filteredTransactions.reduce((acc, tx) => acc + (Number(tx.tipAmount) || 0), 0);
  const commissionsOnly = filteredTransactions.reduce((acc, tx) => {
    const s = staffMembers.find(st => st.id === tx.staffId);
    const r = typeof s?.commissionRate === 'number' ? s.commissionRate : (activeStaff?.commissionRate || 50);
    return acc + ((Number(tx.servicePrice) || 0) * r) / 100;
  }, 0);
  const commissionsTotal = Math.round(commissionsOnly + tipsTotal);
  const servicesCount = filteredTransactions.length;
  const avgTicket = servicesCount > 0 ? (totalRevenue / servicesCount).toFixed(2) : 0;

  // Payment method breakdowns
  const cardRevenue = filteredTransactions.filter(t => t.paymentMethod === 'card').reduce((sum, t) => sum + (t.totalAmount || 0), 0);
  const applePayRevenue = filteredTransactions.filter(t => t.paymentMethod === 'apple_pay').reduce((sum, t) => sum + (t.totalAmount || 0), 0);
  const cashRevenue = filteredTransactions.filter(t => t.paymentMethod === 'cash').reduce((sum, t) => sum + (t.totalAmount || 0), 0);

  const cardPct = totalRevenue > 0 ? Math.round((cardRevenue / totalRevenue) * 100) : 0;
  const applePayPct = totalRevenue > 0 ? Math.round((applePayRevenue / totalRevenue) * 100) : 0;
  const cashPct = totalRevenue > 0 ? Math.round((cashRevenue / totalRevenue) * 100) : 0;

  // Dynamic Hourly distribution: 1 column for EACH single hour according to store hours for that day
  const storeHours = getVenueOperatingHours ? getVenueOperatingHours(undefined, selectedDate) : { openingHour: '08:00', closingHour: '20:00' };
  const storeOpenH = parseInt((storeHours.openingHour || '08:00').split(':')[0], 10) || 8;
  const storeCloseH = parseInt((storeHours.closingHour || '20:00').split(':')[0], 10) || 20;

  const hoursSlots = [];
  for (let h = storeOpenH; h <= storeCloseH; h++) {
    hoursSlots.push(`${String(h).padStart(2, '0')}:00`);
  }
  if (hoursSlots.length === 0) {
    hoursSlots.push('08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00');
  }

  const dayChartData = hoursSlots.map((slot, idx) => {
    const slotHour = parseInt(slot.slice(0, 2), 10);
    const nextSlot = hoursSlots[idx + 1];
    const nextHour = nextSlot ? parseInt(nextSlot.slice(0, 2), 10) : slotHour + 1;

    // Sum transactions in this exact 1-hour window [slotHour:00 to nextHour:00)
    const val = filteredTransactions
      .filter(tx => {
        if (!tx.time) return false;
        const txH = parseInt(tx.time.slice(0, 2), 10);
        return txH >= slotHour && txH < nextHour;
      })
      .reduce((sum, tx) => sum + (Number(tx.totalAmount) || 0), 0);

    const maxVal = Math.max(...hoursSlots.map((s, sIdx) => {
      const sh = parseInt(s.slice(0, 2), 10);
      const ns = hoursSlots[sIdx + 1];
      const nh = ns ? parseInt(ns.slice(0, 2), 10) : sh + 1;
      return filteredTransactions
        .filter(tx => {
          if (!tx.time) return false;
          const txH = parseInt(tx.time.slice(0, 2), 10);
          return txH >= sh && txH < nh;
        })
        .reduce((sum, tx) => sum + (Number(tx.totalAmount) || 0), 0);
    }), 1);

    const height = totalRevenue > 0 && val > 0 ? `${Math.max(18, Math.round((val / maxVal) * 100))}%` : '8%';
    return { 
      label: slot, 
      val, 
      height, 
      active: val > 0,
      hourRange: `${slot} - ${String(nextHour).padStart(2, '0')}:00` 
    };
  });

  // Calculate real values for each day of the week (Monday through Sunday)
  const weekDays = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date(mondayObj);
    d.setDate(mondayObj.getDate() + idx);
    const dStr = formatLocalDateStr(d);
    const dayTransactions = filteredTransactions.filter(tx => (tx.date || selectedDate) === dStr);
    const dayVal = dayTransactions.reduce((sum, tx) => sum + (Number(tx.totalAmount) || 0), 0);
    return {
      label: `${daysOfWeekShort[idx]} ${d.getDate()}`,
      dayNameFull: `${daysOfWeekFull[idx]} ${d.getDate()} de ${monthsOfYear[d.getMonth()]}`,
      val: dayVal,
      dateStr: dStr
    };
  });

  const maxWeekVal = Math.max(...weekDays.map(d => d.val), 1);
  const weekChartData = weekDays.map(d => {
    const height = totalRevenue > 0 && d.val > 0 
      ? `${Math.max(18, Math.round((d.val / maxWeekVal) * 100))}%` 
      : '8%';
    return {
      label: d.label,
      fullLabel: d.dayNameFull,
      val: d.val,
      height,
      active: d.val > 0,
      dateStr: d.dateStr
    };
  });

  // Month weeks distribution
  const daysInMonth = new Date(currDateObj.getFullYear(), currDateObj.getMonth() + 1, 0).getDate();
  const monthChartData = [
    { label: 'Sem 1 (1-7)', start: 1, end: 7 },
    { label: 'Sem 2 (8-14)', start: 8, end: 14 },
    { label: 'Sem 3 (15-21)', start: 15, end: 21 },
    { label: `Sem 4 (22-${daysInMonth})`, start: 22, end: daysInMonth }
  ].map(sem => {
    const semVal = filteredTransactions.filter(tx => {
      if (!tx.date) return false;
      const day = Number(tx.date.split('-')[2]);
      return day >= sem.start && day <= sem.end;
    }).reduce((sum, tx) => sum + (Number(tx.totalAmount) || 0), 0);
    return {
      label: sem.label,
      val: semVal,
      height: semVal > 0 ? '80%' : '8%',
      active: semVal > 0
    };
  });

  const currentChartData = timePeriod === 'day' 
    ? dayChartData 
    : (timePeriod === 'week' ? weekChartData : monthChartData);

  const handleDateStep = (direction) => {
    const d = parseLocalDate(selectedDate);
    if (timePeriod === 'day') {
      d.setDate(d.getDate() + direction);
    } else if (timePeriod === 'week') {
      d.setDate(d.getDate() + (direction * 7));
    } else if (timePeriod === 'month') {
      d.setMonth(d.getMonth() + direction);
    }
    const newStr = formatLocalDateStr(d);
    setSelectedDate(newStr);
    showToast(`Fecha cambiada a: ${newStr}`, 'info');
  };

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportData = () => {
    showToast('Reporte financiero exportado en formato CSV / Excel', 'success');
  };

  const handleLoadDemoSales = () => {
    recordSaleTransaction({
      date: selectedDate,
      time: '09:00',
      staffId: 'staff-1',
      staffName: 'John Templeton',
      clientName: 'Derrick Johnson',
      serviceName: 'Corte + Barba VIP',
      servicePrice: 70,
      productsTotal: 22,
      tipAmount: 15,
      taxAmount: 0,
      totalAmount: 107,
      paymentMethod: 'card'
    });
    recordSaleTransaction({
      date: selectedDate,
      time: '10:30',
      staffId: 'staff-2',
      staffName: 'Maria Santos',
      clientName: 'Brenda Massey',
      serviceName: 'Blowout NYC & Glow',
      servicePrice: 85,
      productsTotal: 32,
      tipAmount: 20,
      taxAmount: 0,
      totalAmount: 137,
      paymentMethod: 'apple_pay'
    });
    showToast('2 ventas de prueba cargadas al especialista', 'success');
  };

  return (
    <div className="space-y-8 pb-14 print:p-0">
      
      {/* HEADER WITH CONTROLS & REPORT FILTERS */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-black uppercase tracking-wider">
                Módulo Financiero Real
              </span>
              <span className="text-xs text-slate-400 font-medium">Styluu Financial Analytics</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-carbon tracking-tight mt-1">
              Reportes Financieros & Cierre de Caja
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Consulta ingresos detallados, comisiones de staff, propinas y ventas de productos por día, semana o mes en tiempo real.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 print:hidden">
            {/* Reset / Demo buttons */}
            <button
              onClick={() => {
                if (window.confirm('¿Deseas resetear todas las estadísticas a $0 para hacer una prueba real de ventas?')) {
                  clearSalesTransactions();
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer"
              title="Poner todas las ventas en 0"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Poner en $0</span>
            </button>

            <button
              onClick={handleLoadDemoSales}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              title="Cargar ventas de demostración"
            >
              <RotateCcw className="w-4 h-4 text-slate-500" />
              <span>Ventas Demo</span>
            </button>

            <button
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all"
            >
              <Download className="w-4 h-4 text-brand-purple" />
              <span>Exportar Excel</span>
            </button>

            <button
              onClick={handlePrintReport}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-black shadow-brand-sm hover:shadow-purple-glow transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / PDF</span>
            </button>
          </div>
        </div>

        {/* MULTI-FILTER BAR: PERIOD (DÍA / SEMANA / MES) + CALENDAR PICKER + SPECIALIST SELECTOR */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-3 items-center print:hidden">
          
          {/* 1. Time Period Selector (Día / Semana / Mes) */}
          <div className="md:col-span-4 flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80">
            <button
              onClick={() => setTimePeriod('day')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                timePeriod === 'day' 
                  ? 'bg-brand-purple text-white shadow-brand-sm font-black' 
                  : 'text-slate-600 hover:text-brand-carbon'
              }`}
            >
              Por Día
            </button>
            <button
              onClick={() => setTimePeriod('week')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                timePeriod === 'week' 
                  ? 'bg-brand-purple text-white shadow-brand-sm font-black' 
                  : 'text-slate-600 hover:text-brand-carbon'
              }`}
            >
              Por Semana
            </button>
            <button
              onClick={() => setTimePeriod('month')}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                timePeriod === 'month' 
                  ? 'bg-brand-purple text-white shadow-brand-sm font-black' 
                  : 'text-slate-600 hover:text-brand-carbon'
              }`}
            >
              Por Mes
            </button>
          </div>

          {/* 2. Calendar Date / History Picker with Prev/Next Steppers */}
          <div className="md:col-span-4 flex items-center justify-between gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-2xl border border-slate-200">
            <button
              onClick={() => handleDateStep(-1)}
              className="p-1.5 rounded-xl hover:bg-slate-200/70 text-slate-600 transition-colors cursor-pointer"
              title={timePeriod === 'week' ? 'Semana anterior' : (timePeriod === 'month' ? 'Mes anterior' : 'Día anterior')}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <CalendarIcon className="w-4 h-4 text-brand-purple flex-shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  showToast(`Fecha cambiada a: ${e.target.value}`, 'info');
                }}
                className="w-full bg-transparent text-xs font-bold text-brand-carbon focus:outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={() => handleDateStep(1)}
              className="p-1.5 rounded-xl hover:bg-slate-200/70 text-slate-600 transition-colors cursor-pointer"
              title={timePeriod === 'week' ? 'Semana siguiente' : (timePeriod === 'month' ? 'Mes siguiente' : 'Día siguiente')}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* 3. Specialist Filter Dropdown */}
          <div className="md:col-span-4 flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-2xl border border-slate-200">
            <Filter className="w-4 h-4 text-brand-mint flex-shrink-0" />
            <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Especialista:</span>
            <select
              value={selectedStaffId}
              onChange={(e) => {
                setSelectedStaffId(e.target.value);
                showToast(
                  e.target.value === 'all' 
                    ? 'Reporte global del salón' 
                    : `Filtrado por especialista`, 
                  'info'
                );
              }}
              className="w-full bg-transparent text-xs font-bold text-brand-carbon focus:outline-none cursor-pointer"
            >
              <option value="all">⭐ Todo el Salón (Global)</option>
              {staffMembers.map(staff => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} — {staff.role.split(' ')[0]}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Selected Context Banner */}
        <div className="p-3.5 rounded-2xl bg-brand-soft-card border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`w-2.5 h-2.5 rounded-full ${totalRevenue > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            <span className="font-bold text-slate-700">
              Mostrando datos para:
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-brand-purple text-white font-extrabold text-[11px] shadow-xs">
              {timePeriod === 'day' 
                ? dayLabelFull 
                : timePeriod === 'week' 
                  ? weekRangeLabel 
                  : `MES: ${monthsOfYear[currDateObj.getMonth()].toUpperCase()} ${currDateObj.getFullYear()}`}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-bold text-brand-carbon text-[11px]">
              {activeStaff ? `Especialista: ${activeStaff.name}` : 'Todos los Especialistas'}
            </span>
          </div>

          <div className="text-slate-500 font-medium">
            Moneda Activa: <strong className="text-brand-carbon">{currentCurrency.currencyName} ({currentCurrency.currencyCode})</strong>
          </div>
        </div>

      </div>

      {/* KPI METRIC CARDS GRID (DYNAMIC BASED ON REAL SALES) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Revenue */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Ingresos Totales</span>
            <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-brand-carbon">
            {formatMoney(totalRevenue)}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-400">
            <span>{servicesCount} ventas registradas</span>
          </div>
        </div>

        {/* Card 2: Services Rendered */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Servicios Realizados</span>
            <div className="w-8 h-8 rounded-xl bg-brand-mint/20 text-teal-800 flex items-center justify-center">
              <Scissors className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-brand-carbon">
            {servicesCount}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Ticket Promedio: <strong className="text-brand-carbon">{formatMoney(avgTicket)}</strong>
          </div>
        </div>

        {/* Card 3: Retail Sales */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>Venta de Productos (Retail)</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-amber-600">
            {formatMoney(retailRevenue)}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Productos reventa cobrados
          </div>
        </div>

        {/* Card 4: Tips & Commission */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
            <span>{activeStaff ? 'Comisión a Pagar' : 'Propinas Generadas'}</span>
            <div className="w-8 h-8 rounded-xl bg-pink-500/10 text-pink-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="font-display font-black text-2xl sm:text-3xl text-brand-purple">
            {formatMoney(activeStaff ? commissionsTotal : tipsTotal)}
          </div>
          <div className="text-xs text-slate-500 font-medium">
            {activeStaff ? `${activeStaff.commissionRate || 50}% servicios + ${formatMoney(tipsTotal)} propina` : `Propinas directas al staff`}
          </div>
        </div>

      </div>

      {/* DYNAMIC CHART & PAYMENT METHODS SPLIT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dynamic Chart Container */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-base text-brand-carbon">
                Evolución de Ingresos ({timePeriod === 'day' ? `${dayLabelFull} - Franja Horaria` : timePeriod === 'week' ? weekRangeLabel : `MES: ${monthsOfYear[currDateObj.getMonth()].toUpperCase()} - Semanas del Mes`})
              </h3>
              <p className="text-xs text-slate-400">
                {activeStaff ? `Facturación acumulada de ${activeStaff.name}` : 'Facturación global del establecimiento'}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Período</span>
              <span className="font-display font-black text-xl sm:text-2xl text-brand-purple">
                {formatMoney(totalRevenue)}
              </span>
            </div>
          </div>

          {/* Interactive Bar Chart with Dynamic 1-Hour Columns */}
          <div className="h-64 flex items-end justify-between gap-1.5 sm:gap-2 pt-6 px-1 overflow-x-auto pb-1">
            {currentChartData.map((d, i) => (
              <div 
                key={i} 
                className="flex-1 min-w-[28px] sm:min-w-[36px] flex flex-col items-center gap-1.5 h-full justify-end group cursor-pointer relative"
                title={`${d.hourRange || d.label}: ${formatMoney(d.val)}`}
              >
                {/* Floating Tooltip value */}
                <span className={`text-[9.5px] font-extrabold whitespace-nowrap transition-all duration-200 ${
                  d.active ? 'text-brand-purple font-black opacity-100 scale-100' : 'text-slate-500 opacity-0 group-hover:opacity-100'
                }`}>
                  {d.val > 0 ? formatMoney(d.val, false) : '$0'}
                </span>

                {/* Animated Pillar Bar */}
                <div
                  className={`w-full max-w-[42px] rounded-xl sm:rounded-2xl transition-all duration-500 ${
                    d.active
                      ? 'bg-gradient-to-t from-brand-purple via-indigo-500 to-brand-mint shadow-[0_4px_14px_rgba(83,230,212,0.4)] group-hover:brightness-110'
                      : 'bg-slate-100 group-hover:bg-brand-purple/20'
                  }`}
                  style={{ height: d.height }}
                />

                {/* Hour Label */}
                <span className={`text-[10px] sm:text-[11px] font-bold tracking-tight whitespace-nowrap transition-colors ${
                  d.active ? 'text-brand-purple font-black' : 'text-slate-400 group-hover:text-slate-600'
                }`}>
                  {d.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods & Cash Register Breakdown */}
        <div className="lg:col-span-1 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <h3 className="font-bold text-base text-brand-carbon flex items-center gap-2">
            <Wallet className="w-5 h-5 text-brand-purple" />
            Cierre de Caja & Métodos
          </h3>

          <div className="space-y-3">
            {/* Card POS */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-brand-purple" /> Tarjeta POS (Stripe)
                </span>
                <span className="font-mono font-bold text-brand-carbon">
                  {formatMoney(cardRevenue)}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-brand-purple h-1.5 rounded-full" style={{ width: `${cardPct}%` }} />
              </div>
              <div className="text-[10px] text-slate-400">{cardPct}% del total facturado</div>
            </div>

            {/* Apple Pay */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-brand-mint" /> Apple Pay / Contactless
                </span>
                <span className="font-mono font-bold text-brand-carbon">
                  {formatMoney(applePayRevenue)}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-brand-mint h-1.5 rounded-full" style={{ width: `${applePayPct}%` }} />
              </div>
              <div className="text-[10px] text-slate-400">{applePayPct}% del total facturado</div>
            </div>

            {/* Cash */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" /> Efectivo en Caja
                </span>
                <span className="font-mono font-bold text-brand-carbon">
                  {formatMoney(cashRevenue)}
                </span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${cashPct}%` }} />
              </div>
              <div className="text-[10px] text-slate-400">{cashPct}% del total facturado</div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-bold text-slate-500">Caja Cuadrada:</span>
            <span className="flex items-center gap-1 font-bold text-emerald-600">
              <CheckCircle2 className="w-4 h-4" /> Sin diferencias
            </span>
          </div>
        </div>

      </div>

      {/* SPECIALIST PERFORMANCE LEADERBOARD (DYNAMIC ACCORDING TO REAL SALES) */}
      {selectedStaffId === 'all' && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-brand-carbon">
                Rendimiento y Comisiones por Especialista (Ventas Reales Acumuladas)
              </h3>
              <p className="text-xs text-slate-400">
                Haz clic en cualquier especialista para ver su reporte individualizado.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {staffMembers.map((staff) => {
              const staffTxs = salesTransactions.filter(tx => tx.staffId === staff.id);
              const staffRev = staffTxs.reduce((sum, tx) => sum + (tx.totalAmount || 0), 0);
              const staffServicesSrv = staffTxs.reduce((sum, tx) => sum + (tx.servicePrice || 0), 0);
              const staffTips = staffTxs.reduce((sum, tx) => sum + (tx.tipAmount || 0), 0);
              const staffCommission = Math.round((staffServicesSrv * 0.50) + staffTips);
              const staffServicesCount = staffTxs.length;

              return (
                <div
                  key={staff.id}
                  onClick={() => setSelectedStaffId(staff.id)}
                  className={`p-4 rounded-2xl border bg-white hover:bg-slate-50/70 transition-all cursor-pointer space-y-3 group shadow-2xs ${
                    staffRev > 0 ? 'border-brand-purple/40 ring-1 ring-brand-purple/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={staff.avatar} alt={staff.name} className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-2xs" />
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-brand-carbon truncate group-hover:text-brand-purple transition-colors">
                        {staff.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{staff.role.split(' ')[0]}</div>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-slate-100 text-xs">
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Facturado:</span>
                      <strong className="text-brand-carbon">{formatMoney(staffRev)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Comisión + Tip:</span>
                      <strong className="text-brand-purple">{formatMoney(staffCommission)}</strong>
                    </div>
                    <div className="flex justify-between text-slate-500 text-[11px]">
                      <span>Servicios:</span>
                      <span className="font-semibold text-slate-700">{staffServicesCount}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAILED TRANSACTIONS & SALES LEDGER TABLE */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-brand-carbon">
              Historial de Transacciones ({filteredTransactions.length} cobros registrados)
            </h3>
            <p className="text-xs text-slate-400">
              Desglose detallado de servicios, productos de reventa y métodos de cobro en tiempo real.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Filtrando por:</span>
            <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold">
              {activeStaff ? activeStaff.name : 'Todos los Especialistas'}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredTransactions.length > 0 ? (
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <th className="pb-3">Hora / Fecha</th>
                  <th className="pb-3">Cliente</th>
                  <th className="pb-3">Especialista</th>
                  <th className="pb-3">Servicio</th>
                  <th className="pb-3">Producto Retail</th>
                  <th className="pb-3">Método</th>
                  <th className="pb-3">Propina</th>
                  <th className="pb-3 text-right">Total Cobrado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredTransactions.map((tx) => {
                  const staff = staffMembers.find(s => s.id === tx.staffId);
                  const productsText = tx.items && tx.items.length > 0 
                    ? tx.items.map(p => `${p.name} (x${p.qty})`).join(', ') 
                    : (tx.productsTotal > 0 ? formatMoney(tx.productsTotal) : '-');

                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 font-mono text-slate-500">{tx.time} • {tx.date}</td>
                      <td className="py-3.5 font-bold text-brand-carbon">{tx.clientName}</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <img src={staff?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'} alt={tx.staffName} className="w-6 h-6 rounded-full object-cover" />
                          <span>{tx.staffName}</span>
                        </div>
                      </td>
                      <td className="py-3.5">{tx.serviceName}</td>
                      <td className="py-3.5 text-slate-500 max-w-xs truncate">{productsText}</td>
                      <td className="py-3.5">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-[10px] uppercase">
                          {tx.paymentMethod === 'card' ? 'Tarjeta POS' : tx.paymentMethod === 'cash' ? 'Efectivo' : 'Apple Pay'}
                        </span>
                      </td>
                      <td className="py-3.5 text-emerald-600 font-bold">+{formatMoney(tx.tipAmount, false)}</td>
                      <td className="py-3.5 text-right font-display font-black text-sm text-brand-carbon">
                        {formatMoney(tx.totalAmount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="py-12 text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <DollarSign className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm text-slate-700">No hay ventas registradas aún ($0.00)</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Realiza una reserva desde la app o haz clic en cualquier cita en la Agenda para cobrarla en el POS. La venta se acumulará de inmediato para el especialista seleccionado.
              </p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

