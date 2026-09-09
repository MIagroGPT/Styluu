import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  UserPlus, 
  Star, 
  Clock, 
  DollarSign, 
  Shield, 
  Check, 
  Percent, 
  TrendingUp, 
  Settings2,
  Sparkles,
  ArrowRight,
  Info,
  Calendar,
  X,
  Edit,
  Trash2,
  CheckCircle2,
  User,
  Scissors
} from 'lucide-react';

const COMMISSION_PRESETS = [35, 40, 45, 50, 55, 60];

const PRESET_AVATARS = [
  { label: 'Barbero 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { label: 'Estilista 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { label: 'Colorista 1', url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80' },
  { label: 'Esteticista 1', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' },
  { label: 'Nail Artist', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' },
  { label: 'Barbero 2', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { label: 'Barbero 3', url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=300&q=80' },
  { label: 'Estilista 2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80' }
];

const PRESET_COLORS = [
  '#6045F4', '#53E6D4', '#F472B6', '#FB923C', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'
];

const ALL_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

const TIME_OPTIONS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', 
  '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', 
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', 
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', 
  '19:00', '19:30', '20:00', '20:30', '21:00'
];

export const StaffManager = () => {
  const { 
    staffMembers, 
    updateStaffCommission, 
    addStaffMember, 
    updateStaffSchedule, 
    deleteStaffMember, 
    setBusinessTab, 
    getVenueOperatingHours,
    showToast 
  } = useApp();

  const storeHours = getVenueOperatingHours ? getVenueOperatingHours() : {
    openingHour: '08:00',
    closingHour: '20:00',
    openDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    formatted: '08:00 - 20:00'
  };

  // Filter time options strictly within store opening hours bounds
  const timeOptions = TIME_OPTIONS.filter(
    t => t >= storeHours.openingHour && t <= storeHours.closingHour
  );
  const activeTimeOptions = timeOptions.length >= 2 ? timeOptions : [storeHours.openingHour, storeHours.closingHour];

  // Inline Commission Edit State
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [customRateInput, setCustomRateInput] = useState('');

  // Modal: Add Staff State
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffRole, setNewStaffRole] = useState('Master Barber & Stylist');
  const [newStaffAvatar, setNewStaffAvatar] = useState(PRESET_AVATARS[0].url);
  const [newStaffColor, setNewStaffColor] = useState('#6045F4');
  const [newStaffCommission, setNewStaffCommission] = useState(50);
  const [newStaffSpecialties, setNewStaffSpecialties] = useState('Corte Clásico, Barba VIP, Estilo');
  const [newStaffStartHour, setNewStaffStartHour] = useState(storeHours.openingHour || '09:00');
  const [newStaffEndHour, setNewStaffEndHour] = useState(storeHours.closingHour || '19:00');
  const [newStaffWorkDays, setNewStaffWorkDays] = useState(storeHours.openDays || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']);

  // Modal: Edit Schedule State (Day by Day bounded by Store Hours)
  const [scheduleModalStaff, setScheduleModalStaff] = useState(null);
  const [scheduleDailyMap, setScheduleDailyMap] = useState({});

  // Handlers for Commission
  const handleStartEdit = (staff) => {
    setEditingStaffId(staff.id);
    setCustomRateInput(String(staff.commissionRate || 50));
  };

  const handleSaveCommission = (staffId) => {
    const num = Math.min(100, Math.max(0, parseInt(customRateInput, 10) || 50));
    updateStaffCommission(staffId, num);
    setEditingStaffId(null);
  };

  // Open Edit Schedule Modal with per-day clamping according to store schedule
  const handleOpenScheduleModal = (staff) => {
    setScheduleModalStaff(staff);
    const sch = staff.schedule || {};
    const existingDaily = sch.dailySchedule || {};

    const initialMap = {};
    ALL_DAYS.forEach(day => {
      const storeDay = storeHours.dailySchedule?.[day] || { 
        isOpen: storeHours.openDays?.includes(day), 
        openingHour: storeHours.openingHour || '09:00', 
        closingHour: storeHours.closingHour || '20:00' 
      };

      const existingStaffDay = existingDaily[day] || {
        isWorking: (sch.workDays || storeHours.openDays || []).includes(day),
        startHour: sch.startHour || storeDay.openingHour,
        endHour: sch.endHour || storeDay.closingHour
      };

      if (!storeDay.isOpen) {
        initialMap[day] = {
          isWorking: false,
          startHour: storeDay.openingHour,
          endHour: storeDay.closingHour
        };
      } else {
        let sH = existingStaffDay.startHour || storeDay.openingHour;
        let eH = existingStaffDay.endHour || storeDay.closingHour;
        if (sH < storeDay.openingHour) sH = storeDay.openingHour;
        if (sH >= storeDay.closingHour) sH = storeDay.openingHour;
        if (eH > storeDay.closingHour) eH = storeDay.closingHour;
        if (eH <= sH) eH = storeDay.closingHour;

        initialMap[day] = {
          isWorking: Boolean(existingStaffDay.isWorking),
          startHour: sH,
          endHour: eH
        };
      }
    });

    setScheduleDailyMap(initialMap);
  };

  const handleToggleStaffDay = (day) => {
    const storeDay = storeHours.dailySchedule?.[day] || { isOpen: false };
    if (!storeDay.isOpen) {
      showToast(`El salón está cerrado los ${day}s en el perfil del negocio`, 'warning');
      return;
    }

    setScheduleDailyMap(prev => {
      const current = prev[day] || { isWorking: false, startHour: storeDay.openingHour, endHour: storeDay.closingHour };
      return {
        ...prev,
        [day]: {
          ...current,
          isWorking: !current.isWorking
        }
      };
    });
  };

  const handleChangeStaffDayHour = (day, field, val) => {
    setScheduleDailyMap(prev => {
      const current = prev[day] || {};
      return {
        ...prev,
        [day]: {
          ...current,
          [field]: val
        }
      };
    });
  };

  const handleCopyStaffDayToAll = (sourceDay) => {
    const source = scheduleDailyMap[sourceDay];
    if (!source) return;

    setScheduleDailyMap(prev => {
      const updated = { ...prev };
      ALL_DAYS.forEach(day => {
        const storeDay = storeHours.dailySchedule?.[day];
        if (storeDay && storeDay.isOpen) {
          let sH = source.startHour;
          let eH = source.endHour;
          if (sH < storeDay.openingHour) sH = storeDay.openingHour;
          if (sH >= storeDay.closingHour) sH = storeDay.openingHour;
          if (eH > storeDay.closingHour) eH = storeDay.closingHour;
          if (eH <= sH) eH = storeDay.closingHour;

          updated[day] = {
            ...updated[day],
            isWorking: true,
            startHour: sH,
            endHour: eH
          };
        }
      });
      return updated;
    });

    showToast(`Horario de ${sourceDay} copiado y acotado a los días de apertura del salón`, 'info');
  };

  // Save Schedule
  const handleSaveSchedule = (e) => {
    e.preventDefault();
    if (!scheduleModalStaff) return;

    const activeDays = Object.keys(scheduleDailyMap).filter(d => scheduleDailyMap[d]?.isWorking);
    if (activeDays.length === 0) {
      showToast('El especialista debe tener al menos un día asignado de trabajo', 'warning');
      return;
    }

    const workingConfigs = Object.values(scheduleDailyMap).filter(d => d.isWorking);
    const minStart = workingConfigs.length > 0 
      ? workingConfigs.reduce((min, d) => d.startHour < min ? d.startHour : min, '23:59')
      : '09:00';
    const maxEnd = workingConfigs.length > 0
      ? workingConfigs.reduce((max, d) => d.endHour > max ? d.endHour : max, '00:00')
      : '19:00';

    updateStaffSchedule(scheduleModalStaff.id, {
      startHour: minStart,
      endHour: maxEnd,
      workDays: activeDays,
      dailySchedule: scheduleDailyMap
    });
    setScheduleModalStaff(null);
  };

  // Toggle Day in schedule
  const toggleWorkDay = (day, currentList, setter) => {
    if (currentList.includes(day)) {
      if (currentList.length === 1) {
        showToast('El especialista debe tener al menos un día asignado', 'warning');
        return;
      }
      setter(currentList.filter(d => d !== day));
    } else {
      setter([...currentList, day]);
    }
  };

  // Open Add Staff Modal
  const handleOpenAddStaffModal = () => {
    setNewStaffStartHour(storeHours.openingHour || '09:00');
    setNewStaffEndHour(storeHours.closingHour || '19:00');
    setNewStaffWorkDays(storeHours.openDays || ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']);
    setIsAddStaffModalOpen(true);
  };

  // Submit Add Staff
  const handleAddStaffSubmit = (e) => {
    e.preventDefault();
    if (!newStaffName.trim()) {
      showToast('Por favor introduce el nombre del especialista', 'warning');
      return;
    }

    const specsArray = newStaffSpecialties
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addStaffMember({
      name: newStaffName.trim(),
      role: newStaffRole.trim(),
      avatar: newStaffAvatar,
      color: newStaffColor,
      commissionRate: Number(newStaffCommission) || 50,
      specialties: specsArray.length > 0 ? specsArray : ['Corte Clásico', 'Estilismo'],
      schedule: {
        startHour: newStaffStartHour,
        endHour: newStaffEndHour,
        workDays: newStaffWorkDays
      }
    });

    setIsAddStaffModalOpen(false);
    // Reset form
    setNewStaffName('');
    setNewStaffRole('Master Barber & Stylist');
    setNewStaffCommission(50);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl text-brand-carbon">
            Equipo & Especialistas
          </h2>
          <p className="text-xs text-slate-500">
            Configura las comisiones pactadas con cada estilista, horarios de atención y accesos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setBusinessTab('commissions')}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            <DollarSign className="w-4 h-4 text-brand-purple" />
            <span>Ver Módulo de Comisiones</span>
          </button>

          <button
            onClick={handleOpenAddStaffModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-black shadow-brand-sm hover:shadow-purple-glow transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Añadir Especialista</span>
          </button>
        </div>
      </div>

      {/* Advisory Banner */}
      <div className="p-4 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 flex items-start gap-3 text-xs text-slate-700">
        <Info className="w-4 h-4 text-brand-purple flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-brand-carbon">Gestión de Comisiones, Propinas & Horarios:</strong>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            Puedes configurar individualmente el horario de atención y el porcentaje de comisión pactado (%) para cada estilista. 
            La comisión se calcula <strong>únicamente sobre el valor de los servicios</strong> y las propinas se asignan al <strong>100%</strong> de forma íntegra.
          </p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffMembers.map((staff) => {
          const isEditing = editingStaffId === staff.id;
          const currentRate = typeof staff.commissionRate === 'number' ? staff.commissionRate : 50;
          const schedule = staff.schedule || {
            startHour: '09:00',
            endHour: '19:00',
            workDays: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
          };

          return (
            <div
              key={staff.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:shadow-brand-sm transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={staff.avatar}
                        alt={staff.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                      />
                      <div 
                        className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white"
                        style={{ backgroundColor: staff.color || '#6045F4' }}
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-brand-carbon">{staff.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">{staff.role}</p>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-500 mt-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{staff.rating || 5.0}</span>
                        <span className="text-slate-400 font-normal">({staff.reviewsCount || 0} reseñas)</span>
                      </div>
                    </div>
                  </div>

                  {/* Delete Option if more than 1 staff */}
                  {staffMembers.length > 1 && (
                    <button
                      onClick={() => {
                        if (window.confirm(`¿Seguro que deseas eliminar a ${staff.name} del equipo?`)) {
                          deleteStaffMember(staff.id);
                        }
                      }}
                      className="p-1.5 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Eliminar especialista"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Specialties Chips */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                    Especialidades
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {staff.specialties?.map((spec, idx) => (
                      <span key={idx} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Configurable Commission Box */}
                <div className="p-4 rounded-2xl bg-brand-soft-card border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-carbon flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5 text-brand-purple" />
                      Comisión Pactada:
                    </span>
                    
                    {!isEditing && (
                      <button
                        onClick={() => handleStartEdit(staff)}
                        className="text-[11px] text-brand-purple font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Settings2 className="w-3 h-3" />
                        <span>Editar %</span>
                      </button>
                    )}
                  </div>

                  {isEditing ? (
                    /* Inline Commission Editor */
                    <div className="space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={customRateInput}
                            onChange={(e) => setCustomRateInput(e.target.value)}
                            placeholder="Ej: 50"
                            className="w-full px-3 py-1.5 rounded-xl border border-brand-purple bg-white text-xs font-black text-brand-carbon focus:outline-none pr-7"
                          />
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-bold text-xs text-slate-400">%</span>
                        </div>

                        <button
                          onClick={() => handleSaveCommission(staff.id)}
                          className="px-3 py-1.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-bold shadow-sm cursor-pointer"
                        >
                          Guardar
                        </button>

                        <button
                          onClick={() => setEditingStaffId(null)}
                          className="px-2 py-1.5 rounded-xl text-slate-400 hover:text-slate-600 text-xs font-semibold cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap items-center gap-1 pt-1">
                        <span className="text-[10px] text-slate-400 font-medium">Presets:</span>
                        {COMMISSION_PRESETS.map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => setCustomRateInput(String(pct))}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                              String(pct) === customRateInput
                                ? 'bg-brand-purple text-white border-brand-purple'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {pct}%
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Display Commission Rate */
                    <div className="flex items-baseline justify-between pt-0.5">
                      <div>
                        <span className="font-display font-black text-2xl text-brand-purple">
                          {currentRate}%
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium ml-1.5">
                          sobre servicios (+100% propinas)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer: Horario & Shortcut */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                    <Clock className="w-3.5 h-3.5 text-brand-purple" />
                    <span>{schedule.startHour} - {schedule.endHour}</span>
                  </span>

                  <button
                    onClick={() => handleOpenScheduleModal(staff)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-purple/10 text-slate-700 hover:text-brand-purple text-[11px] font-bold transition-colors cursor-pointer"
                  >
                    <Calendar className="w-3 h-3" />
                    <span>Editar Horario</span>
                  </button>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                  <span className="truncate max-w-[200px]">
                    {schedule.workDays?.length === 7 
                      ? 'Todos los días' 
                      : (schedule.workDays?.join(', ') || 'Lun - Sáb')}
                  </span>

                  <button
                    onClick={() => setBusinessTab('commissions')}
                    className="text-brand-purple hover:text-brand-purple-dark font-bold flex items-center gap-0.5"
                  >
                    <span>Liquidaciones</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: EDITAR HORARIO DEL ESPECIALISTA (DÍA A DÍA ACOTADO AL SALÓN)    */}
      {/* ========================================================================= */}
      {scheduleModalStaff && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-carbon/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-2xl w-full shadow-2xl space-y-5 animate-in fade-in duration-200 border border-slate-100 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={scheduleModalStaff.avatar}
                  alt={scheduleModalStaff.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-brand-purple/30 shadow-xs"
                />
                <div>
                  <h3 className="font-bold text-base text-brand-carbon leading-tight">
                    Editar Horario de Atención
                  </h3>
                  <p className="text-xs text-brand-purple font-semibold">
                    {scheduleModalStaff.name} • {scheduleModalStaff.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setScheduleModalStaff(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-4 text-xs font-semibold">
              
              {/* Master Store Hours Notice */}
              <div className="p-3.5 rounded-2xl bg-brand-purple/5 border border-brand-purple/20 space-y-1">
                <div className="flex items-center gap-2 text-brand-carbon font-bold">
                  <Clock className="w-4 h-4 text-brand-purple flex-shrink-0" />
                  <span>Horarios Acotados a la Jornada de la Tienda:</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Las horas disponibles para cada especialista están estrictamente restringidas al horario configurado para cada día en la tienda (ej. si los sábados la tienda cierra a las 4:00 PM, la hora máxima de salida permitida será las 4:00 PM).
                </p>
              </div>

              {/* 7-DAY SCHEDULE MATRIX FOR SPECIALIST */}
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Jornada por Día de la Semana
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Activa los días laborables y define su entrada/salida
                  </span>
                </div>

                <div className="space-y-2">
                  {ALL_DAYS.map((day) => {
                    const storeDay = storeHours.dailySchedule?.[day] || { 
                      isOpen: storeHours.openDays?.includes(day), 
                      openingHour: storeHours.openingHour || '09:00', 
                      closingHour: storeHours.closingHour || '20:00' 
                    };
                    const isStoreOpen = Boolean(storeDay.isOpen);
                    const staffDay = scheduleDailyMap[day] || { 
                      isWorking: false, 
                      startHour: storeDay.openingHour, 
                      endHour: storeDay.closingHour 
                    };
                    const isWorking = isStoreOpen && Boolean(staffDay.isWorking);

                    // Filter valid time options strictly within this specific day's store hours
                    const validStartOptions = TIME_OPTIONS.filter(
                      t => t >= storeDay.openingHour && t < storeDay.closingHour
                    );
                    const validEndOptions = TIME_OPTIONS.filter(
                      t => t > (staffDay.startHour || storeDay.openingHour) && t <= storeDay.closingHour
                    );

                    // Duration
                    let duration = 0;
                    if (isWorking && staffDay.startHour && staffDay.endHour) {
                      const [sH, sM] = staffDay.startHour.split(':').map(Number);
                      const [eH, eM] = staffDay.endHour.split(':').map(Number);
                      duration = Math.max(0, ((eH * 60 + eM) - (sH * 60 + sM)) / 60);
                    }

                    return (
                      <div 
                        key={day}
                        className={`p-3 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          !isStoreOpen
                            ? 'bg-slate-100/60 border-slate-200/80 opacity-60'
                            : isWorking
                              ? 'bg-white border-brand-purple/30 shadow-2xs'
                              : 'bg-slate-50/80 border-slate-200 text-slate-500'
                        }`}
                      >
                        {/* Day & Working Switch */}
                        <div className="flex items-center gap-2.5 min-w-[150px]">
                          <button
                            type="button"
                            disabled={!isStoreOpen}
                            onClick={() => handleToggleStaffDay(day)}
                            className={`px-2.5 py-1 rounded-xl text-[11px] font-black transition-all cursor-pointer flex items-center gap-1 ${
                              !isStoreOpen
                                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                : isWorking
                                  ? 'bg-emerald-500 text-white shadow-2xs'
                                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${isWorking ? 'bg-white' : 'bg-slate-400'}`} />
                            <span>{!isStoreOpen ? 'Cerrado' : (isWorking ? 'Labora' : 'Descanso')}</span>
                          </button>

                          <div>
                            <span className={`font-bold text-xs ${isWorking ? 'text-brand-carbon' : 'text-slate-500'}`}>
                              {day}
                            </span>
                            {isStoreOpen && (
                              <span className="text-[9px] text-brand-purple block font-semibold">
                                Salón: {storeDay.openingHour} - {storeDay.closingHour}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Hours Selectors */}
                        {isStoreOpen && isWorking ? (
                          <div className="flex flex-wrap items-center gap-2 flex-1 sm:justify-center">
                            <div className="flex items-center gap-1">
                              <span className="text-[10.5px] text-slate-500 font-semibold">Entrada:</span>
                              <select
                                value={staffDay.startHour || storeDay.openingHour}
                                onChange={(e) => handleChangeStaffDayHour(day, 'startHour', e.target.value)}
                                className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-bold text-brand-carbon focus:outline-none focus:border-brand-purple cursor-pointer shadow-2xs"
                              >
                                {validStartOptions.map(t => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>
                            </div>

                            <span className="text-slate-400 font-bold hidden sm:inline">-</span>

                            <div className="flex items-center gap-1">
                              <span className="text-[10.5px] text-slate-500 font-semibold">Salida:</span>
                              <select
                                value={staffDay.endHour || storeDay.closingHour}
                                onChange={(e) => handleChangeStaffDayHour(day, 'endHour', e.target.value)}
                                className="px-2 py-1 rounded-lg border border-slate-200 bg-white text-xs font-bold text-brand-carbon focus:outline-none focus:border-brand-purple cursor-pointer shadow-2xs"
                              >
                                {validEndOptions.map(t => (
                                  <option key={t} value={t}>{t}</option>
                                ))}
                              </select>
                            </div>

                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-brand-purple/10 text-brand-purple">
                              {duration % 1 === 0 ? duration : duration.toFixed(1)}h
                            </span>
                          </div>
                        ) : (
                          <div className="flex-1 sm:text-center text-[11px] text-slate-400 italic">
                            {!isStoreOpen 
                              ? '🔒 Salón cerrado por configuración del negocio' 
                              : '⚪ Día libre / descanso asignado'}
                          </div>
                        )}

                        {/* Action: Copy to other open days */}
                        {isStoreOpen && isWorking && (
                          <div className="flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => handleCopyStaffDayToAll(day)}
                              title="Copiar este horario a los demás días abiertos"
                              className="text-[9.5px] font-bold text-slate-500 hover:text-brand-purple hover:bg-brand-purple/10 px-2 py-0.5 rounded-md border border-slate-200 transition-all cursor-pointer whitespace-nowrap"
                            >
                              Copiar horario
                            </button>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setScheduleModalStaff(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-black shadow-brand-sm cursor-pointer"
                >
                  Guardar Horario del Especialista
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: AÑADIR NUEVO ESPECIALISTA AL EQUIPO                              */}
      {/* ========================================================================= */}
      {isAddStaffModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-carbon/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in duration-200 border border-slate-100 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-brand-carbon leading-tight">
                    Añadir Nuevo Especialista
                  </h3>
                  <p className="text-xs text-slate-400">
                    Crea el perfil, comisión pactada y horario de trabajo.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddStaffModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-xs font-semibold">
              
              {/* Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Nombre Completo *</label>
                  <input
                    type="text"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    placeholder="Ej: Alejandro Mendoza"
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1 font-bold">Cargo / Rol *</label>
                  <input
                    type="text"
                    value={newStaffRole}
                    onChange={(e) => setNewStaffRole(e.target.value)}
                    placeholder="Ej: Master Barber, Colorista..."
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple font-medium"
                  />
                </div>
              </div>

              {/* Commission Rate Config */}
              <div className="p-3.5 rounded-2xl bg-brand-soft-card border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-slate-700 font-bold flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-brand-purple" />
                    Comisión Pactada (% sobre servicios):
                  </label>
                  <span className="font-display font-black text-brand-purple text-base">
                    {newStaffCommission}%
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newStaffCommission}
                    onChange={(e) => setNewStaffCommission(Math.min(100, Math.max(0, Number(e.target.value))))}
                    className="w-24 px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-bold text-brand-carbon focus:outline-none focus:border-brand-purple"
                  />
                  <div className="flex flex-wrap gap-1">
                    {COMMISSION_PRESETS.map(pct => (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => setNewStaffCommission(pct)}
                        className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          newStaffCommission === pct
                            ? 'bg-brand-purple text-white border-brand-purple'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {pct}%
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Avatar Selection */}
              <div className="space-y-2">
                <label className="block text-slate-600 font-bold">Seleccionar Avatar / Foto de Perfil:</label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AVATARS.map((av, idx) => (
                    <div
                      key={idx}
                      onClick={() => setNewStaffAvatar(av.url)}
                      className={`p-1.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-1 ${
                        newStaffAvatar === av.url 
                          ? 'border-brand-purple bg-brand-purple/5 shadow-xs' 
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-10 h-10 rounded-full object-cover" />
                      <span className="text-[9px] font-medium text-slate-500 truncate w-full text-center">
                        {av.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Color Selection for Calendar */}
              <div className="space-y-1.5">
                <label className="block text-slate-600 font-bold">Color Identificador en el Calendario:</label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewStaffColor(color)}
                      className={`w-7 h-7 rounded-full transition-transform cursor-pointer border-2 ${
                        newStaffColor === color ? 'scale-110 border-brand-carbon ring-2 ring-brand-purple/30' : 'border-white'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-slate-600 mb-1 font-bold">Especialidades (separadas por coma):</label>
                <input
                  type="text"
                  value={newStaffSpecialties}
                  onChange={(e) => setNewStaffSpecialties(e.target.value)}
                  placeholder="Ej: Fade Cuts, Diseño de Barba, Tinte..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple font-medium"
                />
              </div>

              {/* Schedule Range */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                    Horario de Trabajo
                  </span>
                  <span className="text-[10px] text-brand-purple font-bold bg-brand-purple/10 px-2 py-0.5 rounded-md">
                    Salón: {storeHours.openingHour} - {storeHours.closingHour}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-500 mb-1 text-[11px]">Entrada:</label>
                    <select
                      value={newStaffStartHour}
                      onChange={(e) => setNewStaffStartHour(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    >
                      {activeTimeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-500 mb-1 text-[11px]">Salida:</label>
                    <select
                      value={newStaffEndHour}
                      onChange={(e) => setNewStaffEndHour(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold"
                    >
                      {activeTimeOptions.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {ALL_DAYS.map(day => {
                    const isSelected = newStaffWorkDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleWorkDay(day, newStaffWorkDays, setNewStaffWorkDays)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border transition-all cursor-pointer ${
                          isSelected 
                            ? 'bg-brand-purple text-white border-brand-purple' 
                            : 'bg-white text-slate-500 border-slate-200'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddStaffModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-black shadow-brand-sm cursor-pointer"
                >
                  Guardar Especialista
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
