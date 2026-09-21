import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { Plus, Scissors, Clock, DollarSign, Edit, Trash2, Check, X, Sparkles, Filter, Tag } from 'lucide-react';

const BASE_SERVICE_CATEGORIES = [
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
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('Todas');

  // Dynamic list of categories from base + current venue services
  const allCategories = useMemo(() => {
    const fromServices = services.map(s => s.category).filter(Boolean);
    return Array.from(new Set([...BASE_SERVICE_CATEGORIES, ...fromServices]));
  }, [services]);

  const isHighDenom = ['COP', 'CLP', 'ARS'].includes(currentCurrency?.currencyCode);
  const isMedDenom = ['MXN', 'DOP'].includes(currentCurrency?.currencyCode);
  const defaultPrice = isHighDenom ? 50000 : (isMedDenom ? 450 : 45);
  const priceStep = isHighDenom ? 1000 : (isMedDenom ? 10 : 1);

  const normalizeToLocalPrice = (val) => {
    let num = Number(val) || 0;
    if (isHighDenom && num > 0 && num < 1000) {
      return Math.round(num * (currentCurrency?.rateMultiplier || 1));
    }
    if (isMedDenom && num > 0 && num < 100) {
      return Math.round(num * (currentCurrency?.rateMultiplier || 1));
    }
    return num;
  };

  // Form state for new service
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(defaultPrice);
  const [newDuration, setNewDuration] = useState(40);
  const [newCategory, setNewCategory] = useState('Cabello');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Form state for editing service
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(defaultPrice);
  const [editDuration, setEditDuration] = useState(40);
  const [editCategory, setEditCategory] = useState('Cabello');
  const [isCustomEditCategory, setIsCustomEditCategory] = useState(false);
  const [customEditCategoryInput, setCustomEditCategoryInput] = useState('');
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
    setEditPrice(normalizeToLocalPrice(srv.price));
    setEditDuration(srv.duration || 30);
    const cat = srv.category || 'Cabello';
    setEditCategory(cat);
    const isCustom = !BASE_SERVICE_CATEGORIES.includes(cat);
    setIsCustomEditCategory(isCustom);
    setCustomEditCategoryInput(isCustom ? cat : '');
    setEditDescription(srv.description || '');
  };

  // Save Edited Service
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingService) return;

    const finalCategory = isCustomEditCategory
      ? (customEditCategoryInput.trim() || 'General')
      : editCategory;

    const updated = services.map(s => {
      if (s.id === editingService.id) {
        return {
          ...s,
          name: editName.trim(),
          nameEn: editName.trim(),
          category: finalCategory,
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
    const finalCategory = isCustomCategory
      ? (customCategoryInput.trim() || 'General')
      : newCategory;

    const created = {
      id: `srv-${Date.now()}`,
      name: newName.trim(),
      nameEn: newName.trim(),
      description: newDescription.trim() || 'Servicio personalizado creado en el panel de control.',
      price: Number(newPrice) || 0,
      duration: Number(newDuration) || 30,
      category: finalCategory
    };

    const updated = [created, ...services];
    setServices(updated);
    setIsAdding(false);
    setNewName('');
    setNewPrice(defaultPrice);
    setNewDuration(40);
    setNewDescription('');
    setIsCustomCategory(false);
    setCustomCategoryInput('');

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
                value={isCustomCategory ? '__custom__' : newCategory}
                onChange={(e) => {
                  if (e.target.value === '__custom__') {
                    setIsCustomCategory(true);
                  } else {
                    setIsCustomCategory(false);
                    setNewCategory(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple bg-white"
              >
                {allCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="__custom__">+ Otra Categoría...</option>
              </select>
              {isCustomCategory && (
                <input
                  type="text"
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  placeholder="Nombre de la nueva categoría..."
                  required
                  className="w-full mt-2 px-3 py-1.5 rounded-xl border border-brand-purple bg-brand-purple/5 text-xs font-bold text-brand-carbon focus:outline-none"
                />
              )}
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
                Precio del Servicio ({currentCurrency?.currencyCode || 'COP'})
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 text-xs font-bold">
                  {currentCurrency?.currencySymbol || '$'}
                </span>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  required
                  min="0"
                  step={priceStep}
                  placeholder={isHighDenom ? '50000' : '45'}
                  className="w-full pl-7 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple text-xs font-bold text-brand-carbon"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                Vista previa: <span className="text-brand-purple font-bold">{formatMoney(newPrice)}</span>
              </p>
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
                    value={isCustomEditCategory ? '__custom__' : editCategory}
                    onChange={(e) => {
                      if (e.target.value === '__custom__') {
                        setIsCustomEditCategory(true);
                      } else {
                        setIsCustomEditCategory(false);
                        setEditCategory(e.target.value);
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-purple text-xs"
                  >
                    {allCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="__custom__">+ Otra Categoría...</option>
                  </select>
                  {isCustomEditCategory && (
                    <input
                      type="text"
                      value={customEditCategoryInput}
                      onChange={(e) => setCustomEditCategoryInput(e.target.value)}
                      placeholder="Nombre de la nueva categoría..."
                      required
                      className="w-full mt-2 px-3 py-1.5 rounded-xl border border-brand-purple bg-brand-purple/5 text-xs font-bold text-brand-carbon focus:outline-none"
                    />
                  )}
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
                  <label className="text-slate-500">
                    Precio del Servicio ({currentCurrency?.currencyCode || 'COP'})
                  </label>
                  <span className="text-[11px] text-brand-purple font-black">
                    Vista previa: {formatMoney(editPrice)}
                  </span>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400 text-sm font-bold">
                    {currentCurrency?.currencySymbol || '$'}
                  </span>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    required
                    min="0"
                    step={priceStep}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple text-sm font-bold text-brand-carbon"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  El precio se guardará directamente en la moneda de tu negocio ({currentCurrency?.currencyName || 'COP'}).
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

      {/* Category Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 pl-1">
          <Filter className="w-3.5 h-3.5" /> Categorías:
        </span>
        <button
          type="button"
          onClick={() => setActiveCategoryFilter('Todas')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
            activeCategoryFilter === 'Todas'
              ? 'bg-brand-purple text-white shadow-brand-sm'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <span>Todas</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeCategoryFilter === 'Todas' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
            {services.length}
          </span>
        </button>
        {allCategories.map(cat => {
          const count = services.filter(s => s.category === cat).length;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                activeCategoryFilter === cat
                  ? 'bg-brand-purple text-white shadow-brand-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{cat}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${activeCategoryFilter === cat ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        {(() => {
          const filteredServices = activeCategoryFilter === 'Todas'
            ? services
            : services.filter(s => s.category === activeCategoryFilter);

          if (filteredServices.length === 0) {
            return (
              <div className="p-8 text-center space-y-2">
                <Tag className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="font-bold text-sm text-brand-carbon">
                  No hay servicios en la categoría "{activeCategoryFilter}"
                </h4>
                <p className="text-xs text-slate-400">
                  Haz clic en "+ Nuevo Servicio" para registrar un servicio en esta categoría.
                </p>
              </div>
            );
          }

          return (
            <div className="divide-y divide-slate-100">
              {filteredServices.map((srv) => (
                <div key={srv.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-brand-carbon">{srv.name}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-purple/10 text-brand-purple text-[10px] font-black">
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
          );
        })()}
      </div>

    </div>
  );
};
