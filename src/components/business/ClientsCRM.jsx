import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  UserPlus, 
  Phone, 
  Mail, 
  Star, 
  Calendar, 
  DollarSign, 
  Tag, 
  MessageSquare,
  RefreshCw,
  XCircle,
  CheckCircle2
} from 'lucide-react';

export const ClientsCRM = () => {
  const { clientsCRM, setClientsCRM, showToast, formatMoney } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClient, setSelectedClient] = useState(clientsCRM[0] || null);

  const filteredClients = clientsCRM.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl text-brand-carbon">
            Directorio & CRM de Clientes
          </h2>
          <p className="text-xs text-slate-500">
            Gestiona perfiles, historial de visitas, fórmulas de color y estadísticas de citas.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, email..."
              className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:outline-none focus:border-brand-purple w-64"
            />
          </div>

          <button
            onClick={() => showToast('Formulario de nuevo cliente listo', 'info')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-bold shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Cliente</span>
          </button>
        </div>
      </div>

      {/* Main CRM Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Clients List */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
            {filteredClients.length} Clientes Registrados
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredClients.map((client) => {
              const isSelected = selectedClient?.id === client.id;
              const rescheduledCount = client.totalRescheduled || 0;
              const cancelledCount = client.totalCancelled || 0;

              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all flex items-center justify-between gap-4 ${
                    isSelected ? 'bg-brand-purple/10 border-brand-purple' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-11 h-11 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-brand-carbon">{client.name}</h4>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <span>{client.phone}</span>
                        <span>•</span>
                        <span>{client.email}</span>
                      </div>
                      
                      {/* Compact CRM Badges */}
                      <div className="flex items-center gap-2 mt-1">
                        {rescheduledCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            <RefreshCw className="w-2.5 h-2.5" /> {rescheduledCount} Reagendada{rescheduledCount > 1 ? 's' : ''}
                          </span>
                        )}
                        {cancelledCount > 0 && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            <XCircle className="w-2.5 h-2.5" /> {cancelledCount} Cancelada{cancelledCount > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-display font-black text-sm text-brand-carbon">
                      {formatMoney ? formatMoney(client.totalSpent) : `$${client.totalSpent}`}
                    </div>
                    <div className="text-[11px] text-slate-400 font-semibold">
                      {client.totalVisits} visitas
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Client Profile Card */}
        <div className="lg:col-span-1">
          {selectedClient ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 sticky top-24">
              <div className="text-center space-y-2">
                <img
                  src={selectedClient.avatar}
                  alt={selectedClient.name}
                  className="w-20 h-20 rounded-full object-cover mx-auto border-4 border-brand-purple/20 shadow-sm"
                />
                <h3 className="font-display font-bold text-xl text-brand-carbon">
                  {selectedClient.name}
                </h3>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  {selectedClient.tags?.map((tag, i) => (
                    <span key={i} className="px-2.5 py-0.5 rounded-full bg-brand-mint/20 text-teal-900 text-[10px] font-black uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* CRM Stats Grid (4 Boxes) */}
              <div className="grid grid-cols-2 gap-2.5 pt-2">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Total Gastado</div>
                  <div className="font-display font-black text-base text-brand-purple">
                    {formatMoney ? formatMoney(selectedClient.totalSpent) : `$${selectedClient.totalSpent}`}
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Citas Completadas</div>
                  <div className="font-display font-black text-base text-emerald-600 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{selectedClient.totalVisits}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center">
                  <div className="text-[10px] text-amber-700 uppercase font-bold">Reagendadas</div>
                  <div className="font-display font-black text-base text-amber-700 flex items-center justify-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>{selectedClient.totalRescheduled || 0}</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-center">
                  <div className="text-[10px] text-rose-700 uppercase font-bold">Canceladas</div>
                  <div className="font-display font-black text-base text-rose-700 flex items-center justify-center gap-1">
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{selectedClient.totalCancelled || 0}</span>
                  </div>
                </div>
              </div>

              {/* Info Rows */}
              <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-brand-purple" />
                  <span className="font-semibold">{selectedClient.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-brand-mint" />
                  <span className="font-semibold">{selectedClient.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>Última visita: <strong className="text-brand-carbon">{selectedClient.lastVisit}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400" />
                  <span>Especialista favorito: <strong className="text-brand-carbon">{selectedClient.favoriteStaff}</strong></span>
                </div>
              </div>

              {/* Private Notes */}
              <div className="space-y-1.5 border-t border-slate-100 pt-4">
                <label className="block text-[11px] font-bold text-slate-400 uppercase">
                  Notas de Estilo & Preferencias:
                </label>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 italic">
                  "{selectedClient.notes}"
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => showToast(`Recordatorio de WhatsApp enviado a ${selectedClient.name}`, 'success')}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar Mensaje de WhatsApp</span>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-8 text-center text-slate-400 text-xs">
              Selecciona un cliente para ver su ficha completa.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
