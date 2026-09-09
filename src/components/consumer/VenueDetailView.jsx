import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Star, 
  MapPin, 
  Clock, 
  Phone, 
  Share2, 
  Heart, 
  ChevronLeft, 
  Check, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  User,
  ArrowRight,
  ShoppingBag,
  Scissors
} from 'lucide-react';

export const VenueDetailView = () => {
  const { language, t } = useLanguage();
  const { selectedVenue, setCurrentView, openBookingModal, staffMembers, products, addToCart, formatMoney } = useApp();
  
  const [activeMainTab, setActiveMainTab] = useState('services'); // 'services' | 'products'
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedServices, setSelectedServices] = useState([]);

  if (!selectedVenue) return null;

  const services = selectedVenue.services || [];
  const categories = ['All', ...new Set(services.map(s => s.category))];

  const filteredServices = activeCategory === 'All' 
    ? services 
    : services.filter(s => s.category === activeCategory);

  const toggleService = (srv) => {
    if (selectedServices.find(s => s.id === srv.id)) {
      setSelectedServices(selectedServices.filter(s => s.id !== srv.id));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const totalPrice = selectedServices.reduce((acc, s) => acc + s.price, 0);
  const totalDuration = selectedServices.reduce((acc, s) => acc + s.duration, 0);

  const handleProceedBooking = () => {
    openBookingModal({
      ...selectedVenue,
      initialSelectedServices: selectedServices.length > 0 ? selectedServices : [services[0]]
    });
  };

  return (
    <div className="bg-white min-h-screen pb-28">
      
      {/* Top back button navigation */}
      <div className="border-b border-slate-100 bg-white sticky top-20 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <button
            onClick={() => setCurrentView('explore')}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-purple transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Volver a Explorar</span>
          </button>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full border border-slate-200 text-slate-600 hover:text-brand-purple hover:bg-slate-50 transition-all">
              <Share2 className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-full border border-slate-200 text-slate-600 hover:text-rose-500 hover:bg-rose-50 transition-all">
              <Heart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Image Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 h-72 sm:h-96 rounded-3xl overflow-hidden shadow-sm">
          <div className="md:col-span-2 h-full">
            <img
              src={selectedVenue.images?.[0] || selectedVenue.image}
              alt={selectedVenue.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="hidden md:grid grid-rows-2 gap-3 h-full">
            <img
              src={selectedVenue.images?.[1] || selectedVenue.image}
              alt="Salon detail"
              className="w-full h-full object-cover"
            />
            <img
              src={selectedVenue.images?.[2] || selectedVenue.image}
              alt="Salon interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Main Info & Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Venue Info, Services, Specialists, Products */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Header Title & Badges */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-black uppercase tracking-wider">
                  {selectedVenue.category.toUpperCase()}
                </span>
                {selectedVenue.badges?.map((b, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                    {b}
                  </span>
                ))}
              </div>

              <h1 className="font-display font-black text-3xl sm:text-4xl text-brand-carbon tracking-tight">
                {selectedVenue.name}
              </h1>

              <p className="text-slate-600 text-sm font-medium">
                {selectedVenue.tagline}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 pt-1">
                <div className="flex items-center gap-1.5 font-bold text-brand-carbon">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{selectedVenue.rating.toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({selectedVenue.reviewsCount} opiniones verificadas)</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-mint" />
                  <span>{selectedVenue.address}</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <Clock className="w-4 h-4" />
                  <span>Abierto hoy: {selectedVenue.hours}</span>
                </div>
              </div>
            </div>

            {/* Specialist Team Roster */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="font-display font-bold text-xl text-brand-carbon">
                Equipo de Especialistas
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-3">
                {staffMembers.map((staff) => (
                  <div 
                    key={staff.id} 
                    className="flex-shrink-0 flex items-center gap-3 p-3 rounded-2xl border border-slate-200 bg-white hover:border-brand-purple/40 transition-all cursor-pointer shadow-2xs"
                  >
                    <img 
                      src={staff.avatar} 
                      alt={staff.name} 
                      className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" 
                    />
                    <div>
                      <div className="font-bold text-xs text-brand-carbon">{staff.name}</div>
                      <div className="text-[11px] text-slate-500">{staff.role}</div>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 mt-0.5">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{staff.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TAB SELECTOR: SERVICIOS VS PRODUCTOS */}
            <div className="border-b border-slate-200 flex gap-4">
              <button
                onClick={() => setActiveMainTab('services')}
                className={`pb-3 font-display font-black text-lg flex items-center gap-2 border-b-2 transition-all ${
                  activeMainTab === 'services'
                    ? 'border-brand-purple text-brand-purple'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <Scissors className="w-5 h-5" />
                <span>Menú de Servicios ({services.length})</span>
              </button>

              <button
                onClick={() => setActiveMainTab('products')}
                className={`pb-3 font-display font-black text-lg flex items-center gap-2 border-b-2 transition-all ${
                  activeMainTab === 'products'
                    ? 'border-brand-purple text-brand-purple'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Productos & Reventa ({products.length})</span>
                <span className="px-2 py-0.5 rounded-full bg-brand-mint/30 text-teal-900 text-[10px] font-black uppercase">
                  Tienda
                </span>
              </button>
            </div>

            {/* TAB 1: SERVICES CATALOG */}
            {activeMainTab === 'services' && (
              <div className="space-y-6">
                {/* Category Pills */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                        activeCategory === cat
                          ? 'bg-brand-purple text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Service List */}
                <div className="space-y-3">
                  {filteredServices.map((srv) => {
                    const isSelected = !!selectedServices.find(s => s.id === srv.id);
                    const name = language === 'en' ? srv.nameEn : srv.name;

                    return (
                      <div
                        key={srv.id}
                        onClick={() => toggleService(srv)}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
                          isSelected
                            ? 'border-brand-purple bg-brand-purple/5 shadow-brand-sm ring-2 ring-brand-purple/20'
                            : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm sm:text-base text-brand-carbon">
                              {name}
                            </h4>
                            {srv.popular && (
                              <span className="px-2 py-0.5 rounded-full bg-brand-mint/30 text-teal-900 text-[10px] font-black uppercase">
                                Popular
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">
                            {srv.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium pt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {srv.duration} mins
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="font-display font-black text-lg text-brand-carbon">
                              {formatMoney(srv.price)}
                            </span>
                          </div>

                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            isSelected 
                              ? 'bg-brand-purple text-white shadow-sm' 
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}>
                            {isSelected ? <Check className="w-5 h-5 stroke-[2.5]" /> : <Plus className="w-5 h-5" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: RETAIL PRODUCTS CATALOG */}
            {activeMainTab === 'products' && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-brand-mint/15 border border-brand-mint/30 flex items-center justify-between text-xs text-teal-900">
                  <div className="flex items-center gap-2 font-semibold">
                    <ShoppingBag className="w-4 h-4 text-teal-800" />
                    <span>Lleva tus productos favoritos en tu cita o cómpralos con recogida inmediata en el local.</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-brand-purple/40 shadow-2xs hover:shadow-brand-sm transition-all flex flex-col justify-between"
                    >
                      <div className="flex gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-20 h-20 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-brand-purple uppercase">{prod.category}</span>
                          <h4 className="font-bold text-xs sm:text-sm text-brand-carbon leading-snug line-clamp-2">
                            {prod.name}
                          </h4>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{prod.description}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="font-display font-black text-lg text-brand-carbon">
                            {formatMoney(prod.price)}
                          </span>
                          <span className="text-[10px] text-slate-400 ml-1">({prod.stock} disp.)</span>
                        </div>

                        <button
                          onClick={() => addToCart(prod)}
                          className="px-3.5 py-1.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-bold flex items-center gap-1 shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Añadir</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Sticky Booking Summary Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-white rounded-3xl border border-slate-200 p-6 shadow-brand-md space-y-6">
              <h3 className="font-display font-bold text-lg text-brand-carbon border-b border-slate-100 pb-3">
                Resumen de Reserva
              </h3>

              {selectedServices.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs space-y-2">
                  <Sparkles className="w-8 h-8 mx-auto text-slate-300" />
                  <p>Selecciona un servicio para comenzar tu reserva en línea.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {selectedServices.map(s => (
                      <div key={s.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                        <div>
                          <div className="font-bold text-slate-800">{language === 'en' ? s.nameEn : s.name}</div>
                          <div className="text-[10px] text-slate-400">{s.duration} min</div>
                        </div>
                        <div className="font-bold text-slate-900">{formatMoney(s.price)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Tiempo estimado:</span>
                      <span className="font-semibold text-slate-800">{totalDuration} minutos</span>
                    </div>
                    <div className="flex justify-between items-baseline pt-2">
                      <span className="font-bold text-sm text-brand-carbon">Total:</span>
                      <span className="font-display font-black text-2xl text-brand-purple">{formatMoney(totalPrice)}</span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={handleProceedBooking}
                className="w-full py-3.5 rounded-2xl bg-brand-purple hover:bg-brand-purple-dark text-white font-extrabold text-sm shadow-brand-md hover:shadow-purple-glow transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>Reservar Cita Ahora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="space-y-2 pt-2 text-[11px] text-slate-400 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-600 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>Cancelación gratuita hasta 24h antes</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Confirmación inmediata por WhatsApp</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
