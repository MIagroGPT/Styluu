import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Plus, Scissors, Clock, DollarSign, Edit, Trash2, Check } from 'lucide-react';

export const ServicesManager = () => {
  const { venues, showToast, formatMoney, currentCurrency } = useApp();
  const [services, setServices] = useState(venues[0]?.services || []);
  const [isAdding, setIsAdding] = useState(false);

  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(50);
  const [newDuration, setNewDuration] = useState(45);
  const [newCategory, setNewCategory] = useState('Cabello');

  const handleAddService = (e) => {
    e.preventDefault();
    const created = {
      id: `srv-${Date.now()}`,
      name: newName,
      nameEn: newName,
      description: 'Servicio personalizado creado en el panel de control.',
      price: Number(newPrice),
      duration: Number(newDuration),
      category: newCategory
    };
    setServices([created, ...services]);
    setIsAdding(false);
    setNewName('');
    showToast('Servicio añadido al catálogo', 'success');
  };

  const handleDeleteService = (id) => {
    setServices(services.filter(s => s.id !== id));
    showToast('Servicio eliminado', 'warning');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl text-brand-carbon">
            Catálogo de Servicios & Precios
          </h2>
          <p className="text-xs text-slate-500">
            Define la duración, precios y categorías visibles en tu perfil de Styluu.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-black shadow-brand-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      {/* Add Service Drawer */}
      {isAdding && (
        <form onSubmit={handleAddService} className="bg-white rounded-3xl p-6 border border-brand-purple/30 shadow-md space-y-4 animate-in fade-in">
          <h3 className="font-bold text-sm text-brand-carbon">Añadir Nuevo Servicio al Menú</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-semibold">
            <div className="sm:col-span-2">
              <label className="block text-slate-500 mb-1">Nombre del Servicio</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej: Keratina Brasileña"
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Precio Base ({currentCurrency.currencyCode})</label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Duración (min)</label>
              <input
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-purple text-white text-xs font-black shadow-sm"
            >
              Guardar en Catálogo
            </button>
          </div>
        </form>
      )}

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100">
          {services.map((srv) => (
            <div key={srv.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-brand-carbon">{srv.name}</span>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">
                    {srv.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400">{srv.description}</p>
                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {srv.duration} mins
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-display font-black text-lg text-brand-carbon">
                  {formatMoney(srv.price)}
                </span>
                <button
                  onClick={() => handleDeleteService(srv.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
