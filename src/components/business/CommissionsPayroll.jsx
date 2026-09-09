import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  DollarSign, 
  Percent, 
  Calendar, 
  User, 
  Printer, 
  Download, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  CreditCard, 
  Filter, 
  RotateCcw,
  Scissors,
  ShoppingBag,
  ArrowUpRight,
  Receipt,
  Check,
  AlertCircle,
  ChevronDown,
  FileText,
  BadgeCheck,
  History,
  X,
  Eye
} from 'lucide-react';

export const CommissionsPayroll = () => {
  const { 
    staffMembers, 
    salesTransactions, 
    payrollSettlements,
    settlePayrollPeriod,
    toggleTicketSettled,
    formatMoney, 
    currentCurrency, 
    showToast,
    recordSaleTransaction 
  } = useApp();

  // Active Main Sub-Tab: 'active_payroll' | 'settlement_history'
  const [activeTab, setActiveTab] = useState('active_payroll');

  // Specialist Filter
  const [selectedStaffId, setSelectedStaffId] = useState('all'); // 'all' | staffId

  // Period Filter: 'week' | 'month' | 'custom' (Default to 'week' since liquidation is weekly)
  const [periodType, setPeriodType] = useState('week');

  // Status Filter for tickets: 'all' | 'pending' | 'paid'
  const [statusTicketFilter, setStatusTicketFilter] = useState('all');

  // Reference Date for Week navigation
  const todayStr = new Date().toISOString().split('T')[0];
  const [weekRefDate, setWeekRefDate] = useState(todayStr);

  // Custom Date Range
  const firstOfMonthStr = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(firstOfMonthStr);
  const [endDate, setEndDate] = useState(todayStr);

  // Settlement Modal State
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [viewingSettlementReceipt, setViewingSettlementReceipt] = useState(null);

  // Active Specialist Object
  const activeStaff = selectedStaffId === 'all' 
    ? null 
    : staffMembers.find(s => s.id === selectedStaffId);

  // Date & Week Calculation Helpers
  const monthsOfYear = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

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

  // Compute Monday to Sunday of the active week
  const refDateObj = parseLocalDate(weekRefDate);
  const dayOfWeekIndex = (refDateObj.getDay() + 6) % 7; // Monday = 0, Sunday = 6
  
  const mondayObj = new Date(refDateObj);
  mondayObj.setDate(refDateObj.getDate() - dayOfWeekIndex);
  
  const sundayObj = new Date(mondayObj);
  sundayObj.setDate(mondayObj.getDate() + 6);

  const weekMondayStr = formatLocalDateStr(mondayObj);
  const weekSundayStr = formatLocalDateStr(sundayObj);

  const mondayMonthName = monthsOfYear[mondayObj.getMonth()].toUpperCase();
  const sundayMonthName = monthsOfYear[sundayObj.getMonth()].toUpperCase();
  const weekMonthHeader = mondayObj.getMonth() === sundayObj.getMonth()
    ? mondayMonthName
    : `${mondayMonthName} / ${sundayMonthName}`;

  const currentMonthName = monthsOfYear[new Date().getMonth()].toUpperCase();
  const isCurrentMonth = weekMonthHeader === currentMonthName;

  // Granular formatted labels for liquidation vouchers and badges
  const weekMonthLabel = isCurrentMonth ? `ACTUAL (${weekMonthHeader})` : weekMonthHeader;
  const weekDetailedLabel = `Semana del Lunes ${mondayObj.getDate()} al Domingo ${sundayObj.getDate()} de ${monthsOfYear[sundayObj.getMonth()]}`;
  const weekShortRange = `Lunes ${mondayObj.getDate()} - Domingo ${sundayObj.getDate()}`;
  const weekFullBannerLabel = `MES: ${weekMonthHeader} - SEMANA DEL ( Lunes ${mondayObj.getDate()} - Domingo ${sundayObj.getDate()} )`;

  // Week navigation helpers
  const handlePrevWeek = () => {
    const d = new Date(mondayObj);
    d.setDate(d.getDate() - 7);
    setWeekRefDate(formatLocalDateStr(d));
  };

  const handleNextWeek = () => {
    const d = new Date(mondayObj);
    d.setDate(d.getDate() + 7);
    setWeekRefDate(formatLocalDateStr(d));
  };

  const handleCurrentWeek = () => {
    setWeekRefDate(todayStr);
  };

  // Filter transactions by specialist and period / custom date range
  const dateFilteredTransactions = salesTransactions.filter(tx => {
    // 1. Staff Filter
    if (selectedStaffId !== 'all' && tx.staffId !== selectedStaffId) {
      return false;
    }

    // 2. Date Filter
    const txDate = tx.date || todayStr;

    if (periodType === 'week') {
      return txDate >= weekMondayStr && txDate <= weekSundayStr;
    }

    if (periodType === 'month') {
      const currentYM = todayStr.slice(0, 7);
      return txDate.startsWith(currentYM);
    }

    if (periodType === 'custom') {
      if (startDate && txDate < startDate) return false;
      if (endDate && txDate > endDate) return false;
      return true;
    }

    return true;
  });

  // Calculate Commissions earned per transaction using stylist's configured commission rate
  const allCalculatedTransactions = dateFilteredTransactions.map(tx => {
    const staff = staffMembers.find(s => s.id === tx.staffId);
    const rate = typeof staff?.commissionRate === 'number' ? staff.commissionRate : 50;
    const servicePrice = Number(tx.servicePrice) || 0;
    const commissionEarned = (servicePrice * rate) / 100;
    const tipAmount = Number(tx.tipAmount) || 0;
    const staffTotal = commissionEarned + tipAmount;
    const isPaid = tx.settled || tx.payoutStatus === 'paid';

    return {
      ...tx,
      staffName: staff?.name || tx.staffName || 'Especialista',
      staffAvatar: staff?.avatar,
      commissionRate: rate,
      commissionEarned,
      staffTotal,
      isPaid
    };
  });

  // Apply Status Filter (All / Pending / Paid)
  const transactionsWithCalculations = allCalculatedTransactions.filter(tx => {
    if (statusTicketFilter === 'pending') return !tx.isPaid;
    if (statusTicketFilter === 'paid') return tx.isPaid;
    return true;
  });

  // Totals for the current date-filtered set (regardless of status filter for high-level KPIs)
  const totalServiceSales = allCalculatedTransactions.reduce((acc, tx) => acc + (Number(tx.servicePrice) || 0), 0);
  const totalRetailSales = allCalculatedTransactions.reduce((acc, tx) => acc + (Number(tx.productsTotal) || 0), 0);
  const totalTips = allCalculatedTransactions.reduce((acc, tx) => acc + (Number(tx.tipAmount) || 0), 0);
  const totalCommissionsEarned = allCalculatedTransactions.reduce((acc, tx) => acc + tx.commissionEarned, 0);
  const totalPayrollPayout = totalCommissionsEarned + totalTips;

  // Pending vs Paid totals
  const pendingTransactions = allCalculatedTransactions.filter(tx => !tx.isPaid);
  const pendingPayoutAmount = pendingTransactions.reduce((acc, tx) => acc + tx.staffTotal, 0);
  const paidTransactions = allCalculatedTransactions.filter(tx => tx.isPaid);
  const paidPayoutAmount = paidTransactions.reduce((acc, tx) => acc + tx.staffTotal, 0);

  // Breakdown per specialist
  const staffSummaries = staffMembers.map(staff => {
    const staffTxs = allCalculatedTransactions.filter(tx => tx.staffId === staff.id);
    const servicesCount = staffTxs.length;
    const serviceSales = staffTxs.reduce((sum, tx) => sum + (Number(tx.servicePrice) || 0), 0);
    const rate = typeof staff.commissionRate === 'number' ? staff.commissionRate : 50;
    const commission = (serviceSales * rate) / 100;
    const tips = staffTxs.reduce((sum, tx) => sum + (Number(tx.tipAmount) || 0), 0);
    const totalPayout = commission + tips;
    const pendingCount = staffTxs.filter(tx => !tx.isPaid).length;
    const paidCount = staffTxs.filter(tx => tx.isPaid).length;

    return {
      ...staff,
      servicesCount,
      serviceSales,
      commission,
      tips,
      totalPayout,
      pendingCount,
      paidCount,
      isFullyPaid: servicesCount > 0 && pendingCount === 0
    };
  });

  const periodLabel = periodType === 'week' 
    ? weekFullBannerLabel 
    : periodType === 'month' 
      ? `MES: ${weekMonthHeader} (${todayStr.slice(0, 7)})` 
      : `Período ${startDate} al ${endDate}`;

  const handleConfirmPeriodSettlement = () => {
    const txIdsToSettle = pendingTransactions.map(tx => tx.id);
    
    settlePayrollPeriod({
      staffId: selectedStaffId,
      staffName: activeStaff?.name || 'Todo el Salón (Consolidado)',
      periodType,
      monthLabel: weekMonthLabel,
      weekLabel: weekDetailedLabel,
      weekShortRange,
      periodLabel: periodType === 'week' ? `MES: ${weekMonthHeader} - SEMANA DEL (${mondayObj.getDate()} al ${sundayObj.getDate()})` : periodLabel,
      startDate: periodType === 'week' ? weekMondayStr : (periodType === 'custom' ? startDate : `${todayStr.slice(0, 7)}-01`),
      endDate: periodType === 'week' ? weekSundayStr : (periodType === 'custom' ? endDate : todayStr),
      transactionIds: txIdsToSettle,
      totalServices: totalServiceSales,
      totalCommissions: totalCommissionsEarned,
      totalTips,
      totalPaid: pendingPayoutAmount,
      ticketsCount: txIdsToSettle.length
    });

    setIsSettleModalOpen(false);
  };

  const handlePrintPayroll = () => {
    window.print();
  };

  const handleExportCSV = () => {
    showToast('Reporte de comisiones y nómina exportado a CSV / Excel', 'success');
  };

  const handleLoadDemoSales = () => {
    recordSaleTransaction({
      date: todayStr,
      time: '09:30',
      staffId: 'staff-1',
      staffName: 'John Templeton',
      clientName: 'Derrick Johnson',
      serviceName: 'Corte + Barba VIP',
      servicePrice: 70,
      productsTotal: 22,
      tipAmount: 10.50, // 15% strictly on service
      taxAmount: 0,
      totalAmount: 102.50,
      paymentMethod: 'card',
      settled: false
    });
    recordSaleTransaction({
      date: todayStr,
      time: '11:00',
      staffId: 'staff-2',
      staffName: 'Maria Santos',
      clientName: 'Brenda Massey',
      serviceName: 'Blowout NYC & Glow',
      servicePrice: 85,
      productsTotal: 0,
      tipAmount: 17.00, // 20% strictly on service
      taxAmount: 0,
      totalAmount: 102.00,
      paymentMethod: 'apple_pay',
      settled: true // Demo already marked as paid
    });
    recordSaleTransaction({
      date: todayStr,
      time: '14:30',
      staffId: 'staff-5',
      staffName: 'Michael Vance',
      clientName: 'Diego Ramirez',
      serviceName: 'Skin Fade + Hot Towel',
      servicePrice: 65,
      productsTotal: 24,
      tipAmount: 9.75, // 15% strictly on service
      taxAmount: 0,
      totalAmount: 98.75,
      paymentMethod: 'cash',
      settled: false
    });
    showToast('3 ventas demo cargadas (1 PAGADA y 2 PENDIENTES)', 'success');
  };

  return (
    <div className="space-y-8 pb-16 print:p-0">
      
      {/* TOP BAR: TABS (ACTIVE TICKETS VS SETTLEMENT REPORTS) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-3 print:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('active_payroll')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'active_payroll'
                ? 'bg-brand-purple text-white shadow-brand-sm font-black'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Liquidación & Tickets del Período</span>
          </button>

          <button
            onClick={() => setActiveTab('settlement_history')}
            className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              activeTab === 'settlement_history'
                ? 'bg-brand-purple text-white shadow-brand-sm font-black'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Reporte de Liquidaciones Emitidas ({payrollSettlements.length})</span>
          </button>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleLoadDemoSales}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Cargar Ventas Demo</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all"
          >
            <Download className="w-3.5 h-3.5 text-brand-purple" />
            <span>Exportar Excel</span>
          </button>

          <button
            onClick={handlePrintPayroll}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-black shadow-brand-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Reporte</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: ACTIVE PAYROLL & TICKETS */}
      {activeTab === 'active_payroll' && (
        <div className="space-y-8">
          
          {/* FILTER CONTROL CARD */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
            
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-black text-2xl sm:text-3xl text-brand-carbon">
                  Control de Comisiones & Liquidaciones
                </h2>
                <p className="text-xs text-slate-500 max-w-2xl mt-1">
                  Revisa comisiones pactadas sobre servicios, propinas al 100% y marca los períodos o tickets como <strong>PAGADAS</strong>.
                </p>
              </div>

              {/* Settle Action Button */}
              <div className="print:hidden">
                <button
                  onClick={() => setIsSettleModalOpen(true)}
                  disabled={pendingTransactions.length === 0}
                  className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black text-xs flex items-center gap-2 shadow-brand-md transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  <span>Liquidar Período ({pendingTransactions.length} pendientes: {formatMoney(pendingPayoutAmount)})</span>
                </button>
              </div>
            </div>

            {/* MULTI-FILTER BAR */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-12 gap-3 items-center print:hidden">
              
              {/* 1. Specialist Dropdown */}
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Filtrar por Especialista:
                </label>
                <div className="relative">
                  <select
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-brand-carbon focus:outline-none focus:border-brand-purple appearance-none"
                  >
                    <option value="all">👥 Todo el Equipo (Consolidado)</option>
                    {staffMembers.map(staff => (
                      <option key={staff.id} value={staff.id}>
                        👤 {staff.name} — Comisión: {staff.commissionRate || 50}%
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 2. Period Selector */}
              <div className="md:col-span-4">
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Período de Liquidación:
                </label>
                <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPeriodType('week')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      periodType === 'week'
                        ? 'bg-brand-purple text-white shadow-sm font-black'
                        : 'text-slate-600 hover:text-brand-carbon'
                    }`}
                  >
                    Semanal
                  </button>
                  <button
                    type="button"
                    onClick={() => setPeriodType('month')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      periodType === 'month'
                        ? 'bg-brand-purple text-white shadow-sm font-black'
                        : 'text-slate-600 hover:text-brand-carbon'
                    }`}
                  >
                    Mensual
                  </button>
                  <button
                    type="button"
                    onClick={() => setPeriodType('custom')}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                      periodType === 'custom'
                        ? 'bg-brand-purple text-white shadow-sm font-black'
                        : 'text-slate-600 hover:text-brand-carbon'
                    }`}
                  >
                    Rango Fechas
                  </button>
                </div>
              </div>

              {/* 3. Week Navigation / Custom Date Range Pickers */}
              <div className="md:col-span-4">
                {periodType === 'week' ? (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Navegar Semana:
                    </label>
                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                      <button
                        type="button"
                        onClick={handlePrevWeek}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all shadow-2xs"
                        title="Semana Anterior"
                      >
                        ◀
                      </button>
                      <button
                        type="button"
                        onClick={handleCurrentWeek}
                        className="flex-1 py-1.5 rounded-lg bg-white border border-slate-200 text-brand-carbon text-[11px] font-black hover:bg-slate-50 transition-all text-center truncate px-2 shadow-2xs"
                        title="Volver a la Semana Actual"
                      >
                        {weekShortRange}
                      </button>
                      <button
                        type="button"
                        onClick={handleNextWeek}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all shadow-2xs"
                        title="Semana Siguiente"
                      >
                        ▶
                      </button>
                    </div>
                  </div>
                ) : periodType === 'custom' ? (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Día Inicial a Día Final:
                    </label>
                    <div className="flex items-center gap-1.5">
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-1/2 px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-brand-carbon focus:outline-none focus:border-brand-purple"
                      />
                      <span className="text-slate-400 text-xs font-bold">a</span>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-1/2 px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-brand-carbon focus:outline-none focus:border-brand-purple"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                      Moneda Activa:
                    </label>
                    <div className="px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-brand-carbon flex items-center justify-between">
                      <span>{currentCurrency.currencyName}</span>
                      <span className="text-brand-purple font-mono font-black">{currentCurrency.currencyCode} ({currentCurrency.flag})</span>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Context Status Banner */}
            <div className="p-4 rounded-2xl bg-brand-soft-card border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${dateFilteredTransactions.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                <span className="font-bold text-slate-700">Mostrando:</span>
                <span className="px-2.5 py-1 rounded-lg bg-brand-purple text-white font-extrabold text-[11px]">
                  {activeStaff ? activeStaff.name : 'Todo el Salón'}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 font-bold text-brand-carbon text-[11px]">
                  {periodLabel}
                </span>
                {activeStaff && (
                  <span className="px-2.5 py-1 rounded-lg bg-brand-mint/30 text-teal-900 font-black text-[11px]">
                    Comisión: {activeStaff.commissionRate || 50}%
                  </span>
                )}
              </div>

              {/* Status summary pills */}
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  Pagadas: {paidTransactions.length} ({formatMoney(paidPayoutAmount)})
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-bold">
                  Pendientes: {pendingTransactions.length} ({formatMoney(pendingPayoutAmount)})
                </span>
              </div>
            </div>

          </div>

          {/* 5 KEY FINANCIAL METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Card 1: Ventas Servicios */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Ventas Servicios</span>
                <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                  <Scissors className="w-4 h-4" />
                </div>
              </div>
              <div className="font-display font-black text-2xl text-brand-carbon">
                {formatMoney(totalServiceSales)}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {allCalculatedTransactions.length} servicios cobrados
              </div>
            </div>

            {/* Card 2: Ventas Retail */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Ventas Retail</span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
              </div>
              <div className="font-display font-black text-2xl text-amber-600">
                {formatMoney(totalRetailSales)}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Productos tienda (sin propina)
              </div>
            </div>

            {/* Card 3: Comisiones Ganadas */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Comisiones %</span>
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <Percent className="w-4 h-4" />
                </div>
              </div>
              <div className="font-display font-black text-2xl text-blue-600">
                {formatMoney(totalCommissionsEarned)}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                {activeStaff ? `${activeStaff.commissionRate || 50}% sobre servicios` : 'Según % de cada estilista'}
              </div>
            </div>

            {/* Card 4: Propinas Acumuladas */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Propinas (100%)</span>
                <div className="w-8 h-8 rounded-xl bg-brand-mint/20 text-teal-800 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="font-display font-black text-2xl text-teal-800">
                {formatMoney(totalTips)}
              </div>
              <div className="text-[11px] text-slate-500 font-medium">
                Calculadas solo s/ servicios
              </div>
            </div>

            {/* Card 5: TOTAL NETO A PAGAR */}
            <div className="bg-gradient-to-br from-brand-purple to-indigo-700 text-white rounded-3xl p-5 shadow-brand-md space-y-2">
              <div className="flex items-center justify-between text-xs text-white/80 font-bold uppercase">
                <span>Total Liquidación</span>
                <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="font-display font-black text-2xl text-brand-mint">
                {formatMoney(totalPayrollPayout)}
              </div>
              <div className="text-[11px] text-white/80 font-medium">
                {pendingPayoutAmount > 0 ? `Pendiente: ${formatMoney(pendingPayoutAmount)}` : 'Todo Liquidado (PAGADA)'}
              </div>
            </div>

          </div>

          {/* TEAM SUMMARY CARDS (When viewing 'all') */}
          {selectedStaffId === 'all' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-black text-lg text-brand-carbon">
                  Resumen por Miembro del Equipo
                </h3>
                <span className="text-xs text-slate-400 font-semibold">{staffMembers.length} Especialistas</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {staffSummaries.map((staff) => (
                  <div
                    key={staff.id}
                    className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4 hover:border-brand-purple/40 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={staff.avatar}
                            alt={staff.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-brand-carbon">{staff.name}</h4>
                            <p className="text-[11px] text-slate-400">{staff.role}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="px-2.5 py-1 rounded-xl bg-brand-purple/10 text-brand-purple text-xs font-black block">
                            {staff.commissionRate || 50}% Com.
                          </span>
                          {staff.isFullyPaid ? (
                            <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                              🟢 PAGADA
                            </span>
                          ) : staff.pendingCount > 0 ? (
                            <span className="text-[10px] text-amber-600 font-bold block mt-1">
                              ⏳ {staff.pendingCount} pendiente{staff.pendingCount > 1 ? 's' : ''}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Metrics Box */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Ventas Servicios</span>
                          <span className="font-bold text-brand-carbon">{formatMoney(staff.serviceSales)}</span>
                          <span className="text-[10px] text-slate-400 block">({staff.servicesCount} citas)</span>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Comisión Ganada</span>
                          <span className="font-bold text-blue-600">{formatMoney(staff.commission)}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Propinas</span>
                          <span className="font-bold text-teal-800">{formatMoney(staff.tips)}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-200">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total a Pagar</span>
                          <span className="font-display font-black text-sm text-brand-purple">{formatMoney(staff.totalPayout)}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedStaffId(staff.id)}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-brand-purple hover:text-white text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                    >
                      <span>Ver Tickets de {staff.name.split(' ')[0]}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DETAILED TRANSACTIONS TABLE WITH "ESTADO (PAGADA / PENDIENTE)" */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-display font-black text-lg text-brand-carbon">
                  Historial Detallado de Tickets & Estado de Pago
                </h3>
                <p className="text-xs text-slate-400">
                  Desglose ticket por ticket. Haz clic en el botón de estado para marcar individualmente como <strong>PAGADA</strong>.
                </p>
              </div>

              {/* Status Filter Pills */}
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setStatusTicketFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusTicketFilter === 'all' ? 'bg-white text-brand-purple shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Todos ({allCalculatedTransactions.length})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusTicketFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusTicketFilter === 'pending' ? 'bg-white text-amber-700 shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Pendientes ({pendingTransactions.length})
                </button>

                <button
                  type="button"
                  onClick={() => setStatusTicketFilter('paid')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    statusTicketFilter === 'paid' ? 'bg-white text-emerald-700 shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Pagadas ({paidTransactions.length})
                </button>
              </div>
            </div>

            {transactionsWithCalculations.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Receipt className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-brand-carbon">No hay tickets registrados</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    No se han registrado ventas que coincidan con los filtros activos.
                  </p>
                </div>
                <button
                  onClick={handleLoadDemoSales}
                  className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold shadow-brand-sm"
                >
                  Cargar Ventas Demo
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-3">Fecha / Hora</th>
                      <th className="pb-3">Especialista</th>
                      <th className="pb-3">Cliente</th>
                      <th className="pb-3">Servicio</th>
                      <th className="pb-3 text-right">Venta Servicio</th>
                      <th className="pb-3 text-center">% Com.</th>
                      <th className="pb-3 text-right">Comisión</th>
                      <th className="pb-3 text-right">Propina (s/ serv.)</th>
                      <th className="pb-3 text-right">Total Staff</th>
                      <th className="pb-3 text-center">Método</th>
                      <th className="pb-3 text-center">ESTADO</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {transactionsWithCalculations.map((tx) => (
                      <tr key={tx.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3.5 font-medium text-slate-500">
                          <div>{tx.date}</div>
                          <div className="text-[10px] text-slate-400">{tx.time}</div>
                        </td>

                        <td className="py-3.5">
                          <div className="flex items-center gap-2">
                            {tx.staffAvatar && (
                              <img
                                src={tx.staffAvatar}
                                alt={tx.staffName}
                                className="w-6 h-6 rounded-full object-cover border border-slate-200"
                              />
                            )}
                            <span className="font-bold text-brand-carbon">{tx.staffName}</span>
                          </div>
                        </td>

                        <td className="py-3.5 font-medium text-slate-700">
                          {tx.clientName}
                        </td>

                        <td className="py-3.5">
                          <span className="font-semibold text-brand-carbon">{tx.serviceName}</span>
                          {tx.productsTotal > 0 && (
                            <div className="text-[10px] text-amber-600 font-medium">
                              + Retail: {formatMoney(tx.productsTotal)}
                            </div>
                          )}
                        </td>

                        <td className="py-3.5 text-right font-bold text-brand-carbon">
                          {formatMoney(tx.servicePrice)}
                        </td>

                        <td className="py-3.5 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-black text-[10px]">
                            {tx.commissionRate}%
                          </span>
                        </td>

                        <td className="py-3.5 text-right font-bold text-blue-600">
                          {formatMoney(tx.commissionEarned)}
                        </td>

                        <td className="py-3.5 text-right font-bold text-teal-800">
                          {tx.tipAmount > 0 ? formatMoney(tx.tipAmount) : '—'}
                        </td>

                        <td className="py-3.5 text-right">
                          <span className="font-display font-black text-sm text-brand-purple">
                            {formatMoney(tx.staffTotal)}
                          </span>
                        </td>

                        <td className="py-3.5 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase">
                            {tx.paymentMethod === 'apple_pay' ? 'Apple Pay' : tx.paymentMethod === 'card' ? 'Tarjeta' : 'Efectivo'}
                          </span>
                        </td>

                        {/* ESTADO COLUMN (PAGADA / PENDIENTE) */}
                        <td className="py-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => toggleTicketSettled(tx.id)}
                            title="Haz clic para alternar entre PAGADA y PENDIENTE"
                            className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1 mx-auto shadow-2xs ${
                              tx.isPaid
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200'
                            }`}
                          >
                            {tx.isPaid ? (
                              <>
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>PAGADA</span>
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3" />
                                <span>PENDIENTE</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 font-bold text-xs bg-slate-50/70">
                      <td colSpan={4} className="py-3.5 px-2 text-brand-carbon uppercase">
                        Totales Filtrados:
                      </td>
                      <td className="py-3.5 text-right text-brand-carbon font-black">
                        {formatMoney(transactionsWithCalculations.reduce((s, tx) => s + (Number(tx.servicePrice) || 0), 0))}
                      </td>
                      <td className="py-3.5 text-center text-slate-400">—</td>
                      <td className="py-3.5 text-right text-blue-600 font-black">
                        {formatMoney(transactionsWithCalculations.reduce((s, tx) => s + tx.commissionEarned, 0))}
                      </td>
                      <td className="py-3.5 text-right text-teal-800 font-black">
                        {formatMoney(transactionsWithCalculations.reduce((s, tx) => s + tx.tipAmount, 0))}
                      </td>
                      <td className="py-3.5 text-right text-brand-purple font-display font-black text-sm">
                        {formatMoney(transactionsWithCalculations.reduce((s, tx) => s + tx.staffTotal, 0))}
                      </td>
                      <td colSpan={2} className="py-3.5 text-center text-slate-400">—</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </div>

        </div>
      )}

      {/* VIEW 2: SETTLEMENT HISTORY REPORTS */}
      {activeTab === 'settlement_history' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-display font-black text-2xl text-brand-carbon">
                Reporte de Períodos Liquidados & Comprobantes Emitidos
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Registro histórico de todas las liquidaciones y nóminas pagadas a los estilistas con número de comprobante.
              </p>
            </div>

            {payrollSettlements.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <FileText className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-base text-brand-carbon">No hay liquidaciones registradas todavía</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Cuando marques un período como liquidado desde la pestaña de tickets, el comprobante oficial de nómina se guardará aquí.
                  </p>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {payrollSettlements.map((settle) => {
                  const settleMonth = settle.monthLabel || `ACTUAL (${currentMonthName})`;
                  const settleWeek = settle.weekLabel || (
                    settle.periodLabel?.includes('SEMANA') 
                      ? settle.periodLabel 
                      : `Semana del Lunes ${mondayObj.getDate()} al Domingo ${sundayObj.getDate()} de ${monthsOfYear[sundayObj.getMonth()]}`
                  );
                  const ticketsCount = settle.ticketsCount || settle.transactionIds?.length || 1;

                  return (
                    <div key={settle.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center flex-shrink-0">
                          <BadgeCheck className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-brand-carbon">{settle.staffName}</span>
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                              PAGADA
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">{settle.id}</span>
                          </div>
                          <p className="text-xs text-slate-500">
                            <strong>MES: {settleMonth}</strong> • <span className="text-brand-purple font-semibold">{settleWeek}</span> • Liquidado el {settle.date} ({ticketsCount} {ticketsCount === 1 ? 'ticket' : 'tickets'} incluidos)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Pagado</span>
                          <span className="font-display font-black text-lg text-brand-purple">
                            {formatMoney(settle.totalPaid)}
                          </span>
                        </div>

                        <button
                          onClick={() => setViewingSettlementReceipt(settle)}
                          className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver Comprobante</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: CONFIRM PERIOD SETTLEMENT */}
      {isSettleModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-carbon/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in duration-200 border border-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-brand-carbon">
                    Confirmar Liquidación Semanal de Nómina
                  </h3>
                  <p className="text-xs text-slate-400">Estado resultante: PAGADA</p>
                </div>
              </div>
              <button 
                onClick={() => setIsSettleModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Summary details */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Especialista / Salón:</span>
                <span className="font-bold text-brand-carbon">{activeStaff ? activeStaff.name : 'Todo el Salón'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mes:</span>
                <span className="font-bold text-brand-carbon uppercase">{weekMonthLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Semana a Liquidar:</span>
                <span className="font-bold text-brand-purple text-right">{weekDetailedLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Tickets a liquidar:</span>
                <span className="font-bold text-brand-carbon">{pendingTransactions.length} servicios</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Comisiones generadas:</span>
                <span className="font-bold text-blue-600">{formatMoney(pendingTransactions.reduce((s, tx) => s + tx.commissionEarned, 0))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Propinas (100%):</span>
                <span className="font-bold text-teal-800">{formatMoney(pendingTransactions.reduce((s, tx) => s + tx.tipAmount, 0))}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-sm">
                <span className="text-brand-carbon">MONTO TOTAL A PAGAR:</span>
                <span className="text-brand-purple font-display font-black text-lg">{formatMoney(pendingPayoutAmount)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Al confirmar, todos los tickets de esta semana cambiarán su estado a <strong>PAGADA</strong> y se emitirá el comprobante oficial de liquidación.
            </p>

            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsSettleModalOpen(false)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleConfirmPeriodSettlement}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center gap-2 shadow-md"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Confirmar y Marcar como PAGADA</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: VIEW OFFICIAL PAYROLL RECEIPT VOUCHER */}
      {viewingSettlementReceipt && (() => {
        const receiptMonth = viewingSettlementReceipt.monthLabel || `ACTUAL (${currentMonthName})`;
        const receiptWeek = viewingSettlementReceipt.weekLabel || (
          viewingSettlementReceipt.periodLabel?.includes('SEMANA') 
            ? viewingSettlementReceipt.periodLabel 
            : `Semana del Lunes ${mondayObj.getDate()} al Domingo ${sundayObj.getDate()} de ${monthsOfYear[sundayObj.getMonth()]}`
        );
        const ticketsCount = viewingSettlementReceipt.ticketsCount || viewingSettlementReceipt.transactionIds?.length || 1;

        return (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-carbon/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in duration-200 border border-slate-100">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] text-brand-purple font-black uppercase tracking-wider">Styluu Payroll</span>
                  <h3 className="font-display font-black text-xl text-brand-carbon">Comprobante de Liquidación</h3>
                </div>
                <button onClick={() => setViewingSettlementReceipt(null)} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-xs space-y-3">
                <div className="flex justify-between text-slate-500 font-mono">
                  <span>Comprobante:</span>
                  <span className="font-bold text-brand-carbon">{viewingSettlementReceipt.id}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Especialista:</span>
                  <span className="font-bold text-brand-carbon">{viewingSettlementReceipt.staffName}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Mes:</span>
                  <span className="font-bold text-brand-carbon uppercase">{receiptMonth}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Semana Liquidada:</span>
                  <span className="font-bold text-brand-purple text-right">{receiptWeek}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-mono">
                  <span>Fecha Pago:</span>
                  <span className="font-bold text-brand-carbon">{viewingSettlementReceipt.date}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Servicios Liquidados:</span>
                  <span className="font-bold text-brand-carbon">{ticketsCount} {ticketsCount === 1 ? 'ticket' : 'tickets'}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Estado:</span>
                  <span className="inline-flex items-center gap-1 font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <Check className="w-3 h-3 stroke-[3]" />
                    PAGADA
                  </span>
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-between font-sans font-black text-base text-brand-carbon">
                  <span>TOTAL LIQUIDADO:</span>
                  <span className="text-brand-purple font-display text-xl">{formatMoney(viewingSettlementReceipt.totalPaid)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => setViewingSettlementReceipt(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cerrar
                </button>
                <button
                  onClick={() => window.print()}
                  className="w-1/2 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-brand-sm transition-all"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir Recibo</span>
                </button>
              </div>

            </div>
          </div>
        );
      })()}

    </div>
  );
};
