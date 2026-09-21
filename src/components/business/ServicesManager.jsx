import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Plus, Scissors, Clock, DollarSign, Edit, Trash2, Check, X, Sparkles } from 'lucide-react';

const SERVICE_CATEGORIES = [
  'Cabello',
  'Barba',
  'Combos',
  'Tratamientos',
  'Detalles',
  'Uñas',
  'Spa',
  'General'
];

export const ServicesManager = () => {
  const { venues, updateVenueServices, showToast, formatMoney, currentCurrency } = useApp();
  const activeVenue = venues[0] || {};
  const [services, setServices] = useState(activeVenue?.services || []);
  const [isAdding, setIsAdding] = useState(false);
  const [editingService, setEditingService] = useState(null);

  // Form state for new service
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(45);
  const [newDuration, setNewDuration] = useState(40);
  const [newCategory, setNewCategory] = useState('Cabello');
  const [newDescription, setNewDescription] = useState('');

  // Form state for editing service
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(45);
  const [editDuration, setEditDuration] = useState(40);
  const [editCategory, setEditCategory] = useState('Cabello');
  const [editDescription, setEditDescription] = useState('');

  // Synchronize when active venue updates in context
  useEffect(() => {
    if (activeVenue?.services) {
      setServices(activeVenue.services);
    }
  }, [activeVenue?.services]);

  // Open Edit Modal
  const handleStartEdit = (srv) => {
    setEditingService(srv);
    setEditName(srv.name || '');
    setEditPrice(srv.price || 0);
    setEditDuration(srv.duration || 30);
    setEditCategory(srv.category || 'Cabello');
    setEditDescription(srv.description || '');
  };

  // Save Edited Service
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingService) return;

    const updated = services.map(s => {
      if (s.id === editingService.id) {
        return {
          ...s,
          name: editName.trim(),
          nameEn: editName.trim(),
          category: editCategory,
          duration: Number(editDuration) || 30,
          price: Number(editPrice) || 0,
          description: editDescription.trim() || s.description
        };
      }
      return s;
    });

    setServices(updated);
    setEditingService(null);

    if (updateVenueServices) {
      await updateVenueServices(activeVenue.id, updated);
    }
    showToast('¡Servicio actualizado exitosamente!', 'success');
  };

  // Add New Service
  const handleAddService = async (e) => {
    e.preventDefault();
    const created = {
      id: `srv-${Date.now()}`,
      name: newName.trim(),
      nameEn: newName.trim(),
      description: newDescription.trim() || 'Servicio personalizado creado en el panel de control.',
      price: Number(newPrice) || 0,
      duration: Number(newDuration) || 30,
      category: newCategory
    };

    const updated = [created, ...services];
    setServices(updated);
    setIsAdding(false);
    setNewName('');
    setNewPrice(45);
    setNewDuration(40);
    setNewDescription('');

    if (updateVenueServices) {
      await updateVenueServices(activeVenue.id, updated);
    }
    showToast('¡Servicio añadido al catálogo y guardado!', 'success');
  };

  // Delete Service
  const handleDeleteService = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este servicio?')) return;
    const updated = services.filter(s => s.id !== id);
    setServices(updated);

    if (updateVenueServices) {
      await updateVenueServices(activeVenue.id, updated);
    }
    showToast('Servicio eliminado del catálogo', 'info');
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
            Define la duración, precios y categorías visibles en tu perfil de Styluu y citas.
          </p>
        </div>

        <button
          onClick={() => { setIsAdding(!isAdding); setEditingService(null); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-black shadow-brand-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Servicio</span>
        </button>
      </div>

      {/* Add Service Drawer */}
      {isAdding && (
        <form onSubmit={handleAddService} className="bg-white rounded-3xl p-6 border border-brand-purple/30 shadow-md space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-brand-carbon flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              Añadir Nuevo Servicio al Menú
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs font-semibold">
            <div className="sm:col-span-2">
              <label className="block text-slate-500 mb-1">Nombre del Servicio</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ej: Keratina Brasileña"
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Categoría</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple bg-white"
              >
                {SERVICE_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Duración (min)</label>
              <input
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                required
                min="5"
                step="5"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold">
            <div>
              <label className="block text-slate-500 mb-1">
                Precio Base USD (Vista cliente: <span className="text-brand-purple font-bold">{formatMoney(newPrice)}</span>)
              </label>
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                required
                min="0"
                step="1"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Descripción corta</label>
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Detalle o productos incluidos..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-brand-purple text-white text-xs font-black shadow-sm hover:bg-brand-purple-dark transition-all"
            >
              Guardar en Catálogo
            </button>
          </div>
        </form>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-brand-carbon/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in duration-200 border border-slate-100">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-brand-carbon leading-tight">
                    Editar Servicio
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Modifica precios, tiempo y categoría del servicio
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-slate-500 mb-1">Nombre del Servicio</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-brand-carbon focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Categoría</label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-purple text-xs"
                  >
                    {SERVICE_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Duración (minutos)</label>
                  <input
                    type="number"
                    value={editDuration}
                    onChange={(e) => setEditDuration(e.target.value)}
                    required
                    min="5"
                    step="5"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple text-xs"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-slate-500">Precio Base USD</label>
                  <span className="text-[11px] text-brand-purple font-black">
                    Vista cliente: {formatMoney(editPrice)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">$</span>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    required
                    min="0"
                    step="1"
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple text-sm font-bold text-brand-carbon"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Styluu convierte automáticamente el precio según la moneda ({currentCurrency.currencyCode}) que el cliente seleccione.
                </p>
              </div>

              <div>
                <label className="block text-slate-500 mb-1">Descripción</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="2"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple text-xs font-normal"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white font-black text-xs shadow-brand-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Guardar Cambios</span>
                </button>
              </div>
            </form>

          </div>
        </div>
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

              <div className="flex items-center gap-3 sm:gap-4">
                <span className="font-display font-black text-base sm:text-lg text-brand-carbon">
                  {formatMoney(srv.price)}
                </span>
                <button
                  onClick={() => handleStartEdit(srv)}
                  className="p-2 rounded-xl text-slate-400 hover:text-brand-purple hover:bg-brand-purple/10 transition-colors"
                  title="Editar servicio"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteService(srv.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Eliminar servicio"
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
