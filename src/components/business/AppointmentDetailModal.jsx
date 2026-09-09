import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  Calendar, 
  Clock, 
  Scissors, 
  DollarSign, 
  Phone, 
  Mail, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  XCircle,
  ShoppingBag
} from 'lucide-react';

export const AppointmentDetailModal = ({ appointment, isOpen, onClose, onOpenPOS }) => {
  const { staffMembers, updateAppointmentStatus, formatMoney, salesTransactions = [] } = useApp();

  if (!isOpen || !appointment) return null;

  const staff = staffMembers.find(s => s.id === appointment.staffId);
  const matchingTx = salesTransactions.find(tx => 
    (tx.id === appointment.id || (tx.staffId === appointment.staffId && tx.date === appointment.date && (tx.clientName === appointment.clientName || tx.serviceName === appointment.serviceName))) &&
    (tx.settled || tx.payoutStatus === 'paid')
  );
  const isCommissionSettled = Boolean(appointment.commissionSettled || matchingTx);

  const handleStatusChange = (status) => {
    updateAppointmentStatus(appointment.id, status);
  };

  const handleCharge = () => {
    onClose();
    onOpenPOS(appointment);
  };

  const isCancelled = appointment.status === 'cancelled';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-carbon/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-400">ID: {appointment.id}</span>
            {isCancelled && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-black uppercase">
                Cancelada
              </span>
            )}
            {appointment.rescheduleReason && !isCancelled && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                Reagendada
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Client & Service summary */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-black text-2xl text-brand-carbon">
              {appointment.clientName}
            </h3>
            <p className="text-xs font-semibold text-brand-purple">
              {appointment.serviceName}
            </p>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">Total</span>
            <span className="font-display font-black text-2xl text-brand-carbon">
              {formatMoney ? formatMoney(appointment.price) : `$${appointment.price}`}
            </span>
          </div>
        </div>

        {/* Cancellation Reason Alert Box */}
        {(appointment.cancellationReason || isCancelled) && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-rose-700">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Motivo de Cancelación Registrado:</span>
            </div>
            <p className="italic text-rose-900 bg-white/60 p-2 rounded-xl border border-rose-100">
              "{appointment.cancellationReason || 'Cancelada por el cliente / negocio.'}"
            </p>
          </div>
        )}

        {/* Reschedule Reason Alert Box */}
        {appointment.rescheduleReason && (
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Historial de Reagendamiento:</span>
            </div>
            <p className="italic text-amber-900 bg-white/60 p-2 rounded-xl border border-amber-100">
              "{appointment.rescheduleReason}"
            </p>
          </div>
        )}

        {/* Detail Matrix */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" /> Especialista
            </span>
            <span className="font-bold text-brand-carbon">{staff?.name || 'Staff Styluu'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" /> Fecha & Horario
            </span>
            <span className="font-bold text-brand-carbon">{appointment.date} • {appointment.startTime} - {appointment.endTime || '11:00'}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Teléfono
            </span>
            <span className="font-bold text-brand-carbon">{appointment.clientPhone || 'No registrado'}</span>
          </div>

          {appointment.clientEmail && (
            <div className="flex items-center justify-between">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Correo
              </span>
              <span className="font-bold text-brand-carbon">{appointment.clientEmail}</span>
            </div>
          )}

          {/* Commission & Settlement Status */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-slate-500 font-bold flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-brand-purple" /> Estado de Comisión:
            </span>
            {isCommissionSettled ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> PAGADA (Liquidada)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <Clock className="w-3.5 h-3.5 text-amber-600" /> Pendiente de Liquidación
              </span>
            )}
          </div>

          {appointment.notes && (
            <div className="pt-2 border-t border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Notas de la Cita:</span>
              <p className="text-slate-700 italic mt-0.5">{appointment.notes}</p>
            </div>
          )}
        </div>

        {/* Status Actions */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
            Cambiar Estado de la Cita:
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleStatusChange('confirmed')}
              className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                appointment.status === 'confirmed'
                  ? 'bg-brand-purple text-white border-brand-purple'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Confirmada
            </button>

            <button
              onClick={() => handleStatusChange('in_progress')}
              className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                appointment.status === 'in_progress'
                  ? 'bg-brand-mint text-brand-carbon border-brand-mint font-black'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              En Servicio
            </button>

            <button
              onClick={() => handleStatusChange('completed')}
              className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                appointment.status === 'completed'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              Completada
            </button>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
          <button
            onClick={() => handleStatusChange('cancelled')}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              isCancelled 
                ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                : 'text-rose-600 hover:bg-rose-50'
            }`}
          >
            {isCancelled ? 'Cita ya Cancelada' : 'Cancelar Cita'}
          </button>

          {!isCancelled && (
            <button
              onClick={handleCharge}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-brand-purple to-brand-mint text-white font-extrabold text-sm shadow-brand-md hover:shadow-purple-glow flex items-center gap-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Cobrar en POS ({formatMoney ? formatMoney(appointment.price) : `$${appointment.price}`})</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
