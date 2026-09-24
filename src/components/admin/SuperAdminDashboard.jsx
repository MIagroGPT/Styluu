import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  ShieldCheck,
  Store,
  Users,
  Calendar,
  DollarSign,
  Scissors,
  Plus,
  Search,
  ExternalLink,
  Settings,
  Star,
  MapPin,
  Clock,
  Trash2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Filter,
  X,
  Phone,
  Mail,
  Building2
} from 'lucide-react';

const CATEGORY_LABELS = {
  'all': 'Todas las Categorías',
  'barber': 'Barberías',
  'hair-salon': 'Peluquerías & Salones',
  'spa': 'Spas & Bienestar',
  'nails': 'Uñas & Manicura'
};

const SAMPLE_COVERS = [
  { label: 'Barbería Moderna', url: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80' },
  { label: 'Salón Glamour', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=80' },
  { label: 'Spa & Wellness', url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80' },
  { label: 'Studio de Uñas', url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=900&q=80' },
];

export const SuperAdminDashboard = () => {
  const {
    venues,
    clientsCRM,
    calendarAppointments,
    clientBookings,
    salesTransactions,
    formatMoney,
    setCurrentView,
    setActiveVenueId,
    setSelectedVenue,
    createVenue,
    deleteVenue,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isNewVenueModalOpen, setIsNewVenueModalOpen] = useState(false);

  // New Venue Form State
  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('barber');
  const [city, setCity] = useState('Bogotá, Colombia');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [openingHour, setOpeningHour] = useState('09:00');
  const [closingHour, setClosingHour] = useState('20:00');
  const [imageUrl, setImageUrl] = useState(SAMPLE_COVERS[0].url);

  // Global Platform Metrics
  const totalVenues = venues.length;
  const totalClients = clientsCRM.length;
  const totalAppointments = calendarAppointments.length + clientBookings.length;
  const totalServices = venues.reduce((acc, v) => acc + (v.services?.length || 0), 0);
  const totalVolume = salesTransactions.reduce((acc, t) => acc + (Number(t.totalAmount) || 0), 0);

  // Filtered Venues
  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        (v.name && v.name.toLowerCase().includes(q)) ||
        (v.city && v.city.toLowerCase().includes(q)) ||
        (v.address && v.address.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [venues, selectedCategory, searchQuery]);

  const handleOpenBusinessOSForVenue = (venueId) => {
    setActiveVenueId(venueId);
    setCurrentView('business-os');
  };

  const handleViewMarketplace = (venue) => {
    setSelectedVenue(venue);
    setCurrentView('venue-detail');
  };

  const handleDeleteVenue = async (venueId, venueName) => {
    if (venues.length <= 1) {
      alert('Debe existir al menos un establecimiento en la plataforma.');
      return;
    }
    if (window.confirm(`¿Estás seguro de que deseas eliminar "${venueName}" del directorio de Styluu?`)) {
      await deleteVenue(venueId);
    }
  };

  const handleCreateVenueSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    await createVenue({
      name: name.trim(),
      tagline: tagline.trim() || 'Establecimiento afiliado a Styluu',
      category,
      city: city.trim() || 'Bogotá, Colombia',
      address: address.trim() || 'Calle Principal',
      phone: phone.trim(),
      email: email.trim(),
      openingHour,
      closingHour,
      image: imageUrl,
      images: [imageUrl]
    });

    setIsNewVenueModalOpen(false);
    // Reset Form
    setName('');
    setTagline('');
    setAddress('');
    setPhone('');
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* Top Super Admin Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-mint flex items-center justify-center text-white shadow-lg shadow-brand-purple/20">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-black text-xl text-white tracking-tight">Styluu</span>
                <span className="px-2 py-0.5 rounded-full bg-brand-purple/20 text-brand-mint border border-brand-mint/30 text-[10px] font-black uppercase tracking-wider">
                  Super Admin Maestro
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Panel Global de Plataforma & Red Multi-Establecimientos
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setCurrentView('landing')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <span>Ver Marketplace</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentView('business-os')}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <span>Ir a Business OS</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsNewVenueModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-xs font-black text-white shadow-brand-sm transition-all flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar Nuevo Negocio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-8">
        
        {/* Global Platform Metrics Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Negocios</span>
              <div className="w-7 h-7 rounded-lg bg-brand-purple/20 text-brand-purple flex items-center justify-center">
                <Store className="w-4 h-4 text-brand-mint" />
              </div>
            </div>
            <div className="font-display font-black text-2xl sm:text-3xl text-white">
              {totalVenues}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Establecimientos activos</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Clientes Red</span>
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="font-display font-black text-2xl sm:text-3xl text-white">
              {totalClients}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Registrados en el CRM</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Citas Totales</span>
              <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="font-display font-black text-2xl sm:text-3xl text-white">
              {totalAppointments}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Agendadas en plataforma</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Servicios</span>
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Scissors className="w-4 h-4" />
              </div>
            </div>
            <div className="font-display font-black text-2xl sm:text-3xl text-white">
              {totalServices}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">En menús activos</p>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-2xl bg-slate-800/80 border border-brand-purple/40 space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] font-bold uppercase tracking-wider">Volumen POS</span>
              <div className="w-7 h-7 rounded-lg bg-brand-purple/20 text-brand-mint flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="font-display font-black text-xl sm:text-2xl text-brand-mint truncate">
              {formatMoney(totalVolume)}
            </div>
            <p className="text-[10px] text-slate-400 font-medium">Transaccionado</p>
          </div>

        </section>

        {/* Directory Controls: Search & Category Filter */}
        <section className="bg-slate-800/60 rounded-3xl p-5 border border-slate-700/60 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-black text-lg text-white">
                Directorio Maestro de Establecimientos
              </h2>
              <p className="text-xs text-slate-400">
                Visualiza, accede y administra cualquiera de los comercios afiliados a Styluu
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nombre, ciudad..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
                />
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {Object.entries(CATEGORY_LABELS).map(([catKey, catLabel]) => {
              const count = catKey === 'all'
                ? venues.length
                : venues.filter(v => v.category === catKey).length;
              const isSelected = selectedCategory === catKey;
              return (
                <button
                  key={catKey}
                  onClick={() => setSelectedCategory(catKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-brand-purple text-white shadow-brand-sm'
                      : 'bg-slate-900/80 border border-slate-700/80 text-slate-400 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <span>{catLabel}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Venues Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredVenues.map((venue) => {
            const cover = (venue.images && venue.images[0]) || 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=900&q=80';
            const servicesCount = venue.services?.length || 0;

            return (
              <div
                key={venue.id}
                className="bg-slate-800/80 rounded-3xl border border-slate-700/80 overflow-hidden shadow-lg hover:border-slate-600 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Cover & Badges */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-950">
                    <img
                      src={cover}
                      alt={venue.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />
                    
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-black text-brand-mint uppercase tracking-wider border border-white/10">
                        {CATEGORY_LABELS[venue.category] || venue.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-xs font-bold text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{venue.rating || 5.0}</span>
                      <span className="text-[10px] text-slate-400">({venue.reviewsCount || 0})</span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="font-display font-black text-lg text-white leading-tight drop-shadow-md">
                        {venue.name}
                      </h3>
                      <p className="text-xs text-slate-300 truncate drop-shadow-sm">
                        {venue.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-4 h-4 text-brand-purple shrink-0" />
                      <span className="truncate">{venue.address} • {venue.city}</span>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{venue.hours || `${venue.openingHour || '09:00'} - ${venue.closingHour || '20:00'}`}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-300 font-bold">
                        <Scissors className="w-3.5 h-3.5 text-brand-mint" />
                        <span>{servicesCount} servicios</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons Footer */}
                <div className="p-4 pt-0 space-y-2">
                  <button
                    onClick={() => handleOpenBusinessOSForVenue(venue.id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-bold shadow-brand-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Administrar en Business OS</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewMarketplace(venue)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Ver Ficha Pública</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => handleDeleteVenue(venue.id, venue.name)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Eliminar del catálogo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </section>

      </main>

      {/* Modal: Registrar Nuevo Establecimiento */}
      {isNewVenueModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-5 animate-in fade-in my-8">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-brand-purple/20 text-brand-mint flex items-center justify-center">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-white">
                    Registrar Nuevo Establecimiento
                  </h3>
                  <p className="text-xs text-slate-400">
                    Agrega un nuevo salón, barbería o spa a la red Styluu
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewVenueModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVenueSubmit} className="space-y-4 text-xs font-semibold text-slate-300">
              <div>
                <label className="block text-slate-400 mb-1">Nombre del Establecimiento *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Golden Blades Barber Studio"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Eslogan o Especialidad</label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="Ej: Barbería Premium & Tratamientos Capilares"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-purple"
                  >
                    <option value="barber">Barbería</option>
                    <option value="hair-salon">Peluquería / Salón de Belleza</option>
                    <option value="spa">Spa & Bienestar</option>
                    <option value="nails">Studio de Uñas & Manicura</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Ciudad</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Ej: Bogotá, Colombia"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Dirección Completa</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ej: Cra 15 # 85-30, Zona Rosa"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-purple"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Horario Apertura</label>
                  <input
                    type="time"
                    value={openingHour}
                    onChange={(e) => setOpeningHour(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Horario Cierre</label>
                  <input
                    type="time"
                    value={closingHour}
                    onChange={(e) => setClosingHour(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-brand-purple"
                  />
                </div>
              </div>

              {/* Sample Cover Photos Selector */}
              <div>
                <label className="block text-slate-400 mb-1.5">Foto de Portada</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SAMPLE_COVERS.map((cov, idx) => (
                    <div
                      key={idx}
                      onClick={() => setImageUrl(cov.url)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all h-16 ${
                        imageUrl === cov.url
                          ? 'border-brand-mint ring-2 ring-brand-mint/30'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={cov.url} alt={cov.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center text-[10px] text-white font-bold text-center px-1">
                        {cov.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsNewVenueModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-800"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-black shadow-brand-sm transition-all flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Crear Establecimiento</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
