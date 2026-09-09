import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { 
  Store, 
  Image as ImageIcon, 
  MapPin, 
  Clock, 
  Save, 
  Upload, 
  Sparkles, 
  Check, 
  Plus, 
  Trash2, 
  Eye, 
  FolderOpen, 
  ArrowUpCircle, 
  Camera,
  Coins,
  Globe2,
  DollarSign
} from 'lucide-react';

export const VenueProfileEditor = () => {
  const { t } = useLanguage();
  const { 
    venues, 
    setVenues, 
    setSelectedVenue, 
    setCurrentView, 
    showToast,
    selectedCountry,
    setBusinessCountry,
    currencies,
    currentCurrency,
    formatMoney,
    getVenueOperatingHours,
    updateVenueOperatingHours
  } = useApp();

  const currentVenue = venues[0];
  const initialHoursObj = getVenueOperatingHours ? getVenueOperatingHours(currentVenue) : null;
  
  const DEFAULT_DAYS = {
    'Lunes':     { isOpen: true,  openingHour: '09:00', closingHour: '20:00' },
    'Martes':    { isOpen: true,  openingHour: '09:00', closingHour: '20:00' },
    'Miércoles': { isOpen: true,  openingHour: '09:00', closingHour: '20:00' },
    'Jueves':    { isOpen: true,  openingHour: '09:00', closingHour: '20:00' },
    'Viernes':   { isOpen: true,  openingHour: '09:00', closingHour: '20:00' },
    'Sábado':    { isOpen: true,  openingHour: '10:00', closingHour: '18:00' },
    'Domingo':   { isOpen: false, openingHour: '10:00', closingHour: '14:00' }
  };

  const [name, setName] = useState(currentVenue?.name || '');
  const [tagline, setTagline] = useState(currentVenue?.tagline || '');
  const [category, setCategory] = useState(currentVenue?.category || 'barber');
  const [city, setCity] = useState(currentVenue?.city || 'Miami, FL');
  const [address, setAddress] = useState(currentVenue?.address || '');
  const [dailySchedule, setDailySchedule] = useState(() => {
    return initialHoursObj?.dailySchedule || currentVenue?.dailySchedule || DEFAULT_DAYS;
  });
  const [startingPrice, setStartingPrice] = useState(currentVenue?.startingPrice || 35);
  
  // Images
  const [mainImage, setMainImage] = useState(currentVenue?.image || '');
  const [galleryImages, setGalleryImages] = useState(currentVenue?.images || [currentVenue?.image]);
  const [badges, setBadges] = useState(currentVenue?.badges || ['Top Rated 2026', 'Styluu Verified']);
  const [newBadgeText, setNewBadgeText] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Drag and drop states
  const [isDraggingCover, setIsDraggingCover] = useState(false);
  const [isDraggingGallery, setIsDraggingGallery] = useState(false);

  // Hidden File input refs
  const coverFileInputRef = useRef(null);
  const galleryFileInputRef = useRef(null);

  // Handlers for Daily Schedule
  const handleToggleDay = (day) => {
    setDailySchedule(prev => {
      const current = prev[day] || { isOpen: false, openingHour: '09:00', closingHour: '20:00' };
      const openCount = Object.values(prev).filter(d => d.isOpen).length;
      if (current.isOpen && openCount <= 1) {
        showToast('El negocio debe tener al menos un día abierto a la semana', 'warning');
        return prev;
      }
      return {
        ...prev,
        [day]: {
          ...current,
          isOpen: !current.isOpen
        }
      };
    });
  };

  const handleChangeDayHour = (day, field, value) => {
    setDailySchedule(prev => {
      const current = prev[day] || { isOpen: true, openingHour: '09:00', closingHour: '20:00' };
      let newOpen = field === 'openingHour' ? value : current.openingHour;
      let newClose = field === 'closingHour' ? value : current.closingHour;
      
      if (newOpen >= newClose) {
        showToast('La hora de cierre debe ser posterior a la hora de apertura', 'warning');
      }

      return {
        ...prev,
        [day]: {
          ...current,
          [field]: value
        }
      };
    });
  };

  const handleCopyHoursToAll = (sourceDay) => {
    const source = dailySchedule[sourceDay];
    if (!source) return;
    setDailySchedule(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(day => {
        if (day !== 'Domingo') {
          updated[day] = {
            ...updated[day],
            openingHour: source.openingHour,
            closingHour: source.closingHour,
            isOpen: true
          };
        }
      });
      return updated;
    });
    showToast(`Horario de ${sourceDay} (${source.openingHour} - ${source.closingHour}) copiado a Lunes a Sábado`, 'info');
  };

  const handleQuickPresetWeekdays = () => {
    setDailySchedule(prev => {
      const updated = { ...prev };
      ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].forEach(d => {
        updated[d] = { isOpen: true, openingHour: '09:00', closingHour: '20:00' };
      });
      updated['Sábado'] = { isOpen: true, openingHour: '10:00', closingHour: '18:00' };
      updated['Domingo'] = { isOpen: false, openingHour: '10:00', closingHour: '14:00' };
      return updated;
    });
    showToast('Plantilla comercial aplicada: Lun-Vie (09:00-20:00), Sáb (10:00-18:00), Dom (Cerrado)', 'success');
  };

  // 1. Process and load local file for Cover Image
  const processCoverFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP)', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target.result;
      setMainImage(result);
      showToast('¡Foto de portada cargada correctamente!', 'success');
    };
    reader.readAsDataURL(file);
  };

  // 2. Process local files for Gallery
  const processGalleryFiles = (files) => {
    const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (validFiles.length === 0) {
      showToast('Por favor selecciona archivos de imagen válidos', 'warning');
      return;
    }

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGalleryImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    showToast(`Se agregaron ${validFiles.length} foto(s) a la galería`, 'info');
  };

  // Drag and drop handlers for Cover
  const handleCoverDragOver = (e) => {
    e.preventDefault();
    setIsDraggingCover(true);
  };

  const handleCoverDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingCover(false);
  };

  const handleCoverDrop = (e) => {
    e.preventDefault();
    setIsDraggingCover(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processCoverFile(e.dataTransfer.files[0]);
    }
  };

  // Drag and drop handlers for Gallery
  const handleGalleryDragOver = (e) => {
    e.preventDefault();
    setIsDraggingGallery(true);
  };

  const handleGalleryDragLeave = (e) => {
    e.preventDefault();
    setIsDraggingGallery(false);
  };

  const handleGalleryDrop = (e) => {
    e.preventDefault();
    setIsDraggingGallery(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processGalleryFiles(e.dataTransfer.files);
    }
  };

  const TIME_OPTIONS_STORE = [
    '06:00', '06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', 
    '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', 
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', 
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', 
    '22:00', '22:30', '23:00'
  ];

  const ALL_DAYS_STORE = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const formatHourDisplay = (hStr) => {
    if (!hStr) return '09:00 AM';
    const [h, m] = hStr.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m || 0).padStart(2, '0')} ${period}`;
  };

  // Calculate open days list
  const activeOpenDays = Object.keys(dailySchedule).filter(d => dailySchedule[d]?.isOpen);
  const openConfigs = Object.values(dailySchedule).filter(d => d?.isOpen);
  const overallMinOpen = openConfigs.length > 0 ? openConfigs.reduce((min, d) => d.openingHour < min ? d.openingHour : min, '23:59') : '09:00';
  const overallMaxClose = openConfigs.length > 0 ? openConfigs.reduce((max, d) => d.closingHour > max ? d.closingHour : max, '00:00') : '20:00';
  const formattedHoursString = `${formatHourDisplay(overallMinOpen)} - ${formatHourDisplay(overallMaxClose)}`;

  // Save changes
  const handleSaveProfile = (e) => {
    if (e) e.preventDefault();

    // Update master operating hours and cascade to staff
    if (updateVenueOperatingHours) {
      updateVenueOperatingHours(currentVenue.id, dailySchedule, overallMaxClose, activeOpenDays, formattedHoursString);
    }
    
    const updatedVenue = {
      ...currentVenue,
      name,
      tagline,
      category,
      city,
      address,
      dailySchedule,
      openingHour: overallMinOpen,
      closingHour: overallMaxClose,
      openDays: activeOpenDays,
      hours: formattedHoursString,
      startingPrice: Number(startingPrice),
      image: mainImage,
      images: galleryImages,
      badges
    };

    const updatedVenues = venues.map(v => v.id === currentVenue.id ? updatedVenue : v);
    setVenues(updatedVenues);
    setSelectedVenue(updatedVenue);
    
    // Save directly to localStorage for permanent storage
    localStorage.setItem('styluu_venues', JSON.stringify(updatedVenues));
    showToast('¡Información del negocio y horarios diarios guardados con éxito!', 'success');
  };

  const handleAddGalleryImage = () => {
    if (!newImageUrl.trim()) return;
    setGalleryImages([...galleryImages, newImageUrl.trim()]);
    setNewImageUrl('');
    showToast('Foto agregada a la galería', 'info');
  };

  const handleRemoveGalleryImage = (index) => {
    setGalleryImages(galleryImages.filter((_, i) => i !== index));
    showToast('Foto eliminada de la galería', 'info');
  };

  const handleAddBadge = () => {
    if (!newBadgeText.trim()) return;
    setBadges([...badges, newBadgeText.trim()]);
    setNewBadgeText('');
  };

  const handleRemoveBadge = (index) => {
    setBadges(badges.filter((_, i) => i !== index));
  };

  const handlePreviewInMarketplace = () => {
    handleSaveProfile();
    setCurrentView('venue-detail');
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={coverFileInputRef}
        onChange={(e) => e.target.files && processCoverFile(e.target.files[0])}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={galleryFileInputRef}
        onChange={(e) => e.target.files && processGalleryFiles(e.target.files)}
        accept="image/*"
        multiple
        className="hidden"
      />

      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl text-brand-carbon">
            Editor de Perfil de Negocio & Marketplace
          </h2>
          <p className="text-xs text-slate-500">
            Personaliza el nombre de tu salón, fotos, ubicación, horarios y lo que ven tus clientes en www.styluu.com.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handlePreviewInMarketplace}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-all"
          >
            <Eye className="w-4 h-4 text-brand-purple" />
            <span>Ver cómo lo ven los clientes</span>
          </button>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-black shadow-brand-sm hover:shadow-purple-glow transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Cambios</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-8">
        
        {/* SECTION 1: IMAGES & MEDIA (DRAG AND DROP + FILE PICKER) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-brand-carbon">
                Imágenes del Salón (Portada y Galería)
              </h3>
              <p className="text-[11px] text-slate-400">
                Puedes <strong>arrastrar y soltar cualquier imagen con tu mouse</strong> o hacer clic en <strong>"Cargar Foto"</strong> para buscar en tu computadora.
              </p>
            </div>
          </div>

          {/* MAIN COVER IMAGE (PORTADA) WITH DRAG AND DROP */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700">
                Foto Principal de Portada
              </label>

              {/* Botón para abrir el buscador de archivos del sistema */}
              <button
                type="button"
                onClick={() => coverFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-brand-purple/10 hover:bg-brand-purple text-brand-purple hover:text-white text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <FolderOpen className="w-4 h-4" />
                <span>Cargar Foto desde mi Computadora</span>
              </button>
            </div>

            {/* Drag & Drop Portada Zone */}
            <div
              onDragOver={handleCoverDragOver}
              onDragLeave={handleCoverDragLeave}
              onDrop={handleCoverDrop}
              onClick={() => coverFileInputRef.current?.click()}
              className={`relative rounded-3xl overflow-hidden border-2 border-dashed transition-all cursor-pointer group flex flex-col items-center justify-center min-h-[230px] sm:min-h-[270px] ${
                isDraggingCover
                  ? 'border-brand-mint bg-brand-mint/10 scale-[1.01] shadow-mint-glow'
                  : 'border-slate-300 hover:border-brand-purple bg-slate-50/70 hover:bg-slate-50'
              }`}
            >
              {mainImage ? (
                <>
                  <img
                    src={mainImage}
                    alt="Portada preview"
                    className="w-full h-full max-h-[320px] object-cover absolute inset-0"
                  />
                  {/* Overlay on hover or drag */}
                  <div className={`absolute inset-0 bg-brand-carbon/60 transition-opacity flex flex-col items-center justify-center text-white gap-2 p-4 text-center ${
                    isDraggingCover ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`}>
                    <Camera className="w-8 h-8 text-brand-mint animate-bounce" />
                    <span className="font-bold text-sm">
                      {isDraggingCover ? '¡Suelta tu imagen aquí!' : 'Haz clic o arrastra otra imagen para cambiar la portada'}
                    </span>
                    <span className="text-[11px] text-slate-300">
                      Soporta JPG, PNG, WEBP de alta calidad
                    </span>
                  </div>
                  <span className="absolute bottom-3 left-3 bg-brand-carbon/80 text-white text-[10px] px-2.5 py-1 rounded-lg font-bold backdrop-blur-md">
                    Foto de Portada Actual
                  </span>
                </>
              ) : (
                <div className="p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-brand-purple/10 text-brand-purple flex items-center justify-center mx-auto">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-brand-carbon">
                      Arrastra tu imagen aquí o haz clic para cargar
                    </p>
                    <p className="text-xs text-slate-400">
                      Formatos recomendados: JPG o PNG (1200x800 px)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Input manual de URL / ruta */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-400 font-semibold whitespace-nowrap">O pega una URL:</span>
              <input
                type="text"
                value={mainImage}
                onChange={(e) => setMainImage(e.target.value)}
                placeholder="https://ejemplo.com/mifoto.jpg"
                className="flex-1 px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-brand-purple"
              />
            </div>
          </div>

          {/* GALLERY IMAGES (DRAG AND DROP MULTI-PHOTOS) */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-xs font-bold text-slate-700">
                  Fotos de la Galería del Salón ({galleryImages.length})
                </label>
                <p className="text-[11px] text-slate-400">
                  Fotos del interior, sillones, productos y trabajos realizados.
                </p>
              </div>

              <button
                type="button"
                onClick={() => galleryFileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-brand-purple hover:text-white text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Cargar Fotos de Galería</span>
              </button>
            </div>

            {/* Drag & Drop Gallery Zone */}
            <div
              onDragOver={handleGalleryDragOver}
              onDragLeave={handleGalleryDragLeave}
              onDrop={handleGalleryDrop}
              onClick={() => galleryFileInputRef.current?.click()}
              className={`p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex items-center justify-center gap-3 ${
                isDraggingGallery
                  ? 'border-brand-mint bg-brand-mint/15 shadow-mint-glow'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <ArrowUpCircle className="w-6 h-6 text-brand-purple" />
              <div className="text-xs text-slate-600 font-semibold">
                {isDraggingGallery 
                  ? '¡Suelta las fotos aquí para agregarlas a la galería!' 
                  : 'Arrastra fotos aquí desde tu computadora o haz clic para seleccionar varias'}
              </div>
            </div>

            {/* Input URL for gallery */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="O pega una URL web para agregar a la galería..."
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-purple"
              />
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="px-4 py-2 rounded-xl bg-brand-mint text-brand-carbon text-xs font-black hover:opacity-90 flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Agregar</span>
              </button>
            </div>

            {/* Gallery Thumbnails Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {galleryImages.map((imgUrl, index) => (
                <div key={index} className="relative group h-32 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                  <img src={imgUrl} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
                  
                  {/* Set as Cover button */}
                  <button
                    type="button"
                    onClick={() => {
                      setMainImage(imgUrl);
                      showToast('Foto asignada como portada', 'success');
                    }}
                    className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-brand-carbon/80 text-white text-[9px] font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Hacer Portada
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(index)}
                    className="absolute top-2 right-2 p-1.5 rounded-lg bg-rose-600 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-700 cursor-pointer"
                    title="Eliminar foto"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SECTION 2: BASIC BUSINESS INFORMATION */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-brand-mint/20 text-teal-800 flex items-center justify-center">
              <Store className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-brand-carbon">
                Información General del Negocio
              </h3>
              <p className="text-[11px] text-slate-400">
                Detalles principales visibles en la búsqueda y perfil del cliente.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold">
            <div>
              <label className="block text-slate-600 mb-1">Nombre del Salón o Barbería</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Categoría Principal</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-purple"
              >
                <option value="barber">Barbería</option>
                <option value="hair-salon">Salón de Belleza / Peluquería</option>
                <option value="nails">Salón de Uñas (Nails)</option>
                <option value="spa">Spa & Masajes</option>
                <option value="aesthetics">Medicina Estética</option>
                <option value="pet-grooming">Peluquería de Mascotas</option>
                <option value="tattoo">Tatuaje & Piercing</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-600 mb-1">Eslogan / Descripción Corta (Tagline)</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
                placeholder="Ej: Barbería Moderna de Alta Gama y Cuidado Masculino"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Dirección Completa</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Ciudad y Estado (Ej: Miami, FL / New York, NY)</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>

            <div>
              <label className="block text-slate-600 mb-1">Precio Inicial en Marketplace ($ USD)</label>
              <input
                type="number"
                value={startingPrice}
                onChange={(e) => setStartingPrice(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-purple"
              />
            </div>

            {/* MASTER SALON OPERATING HOURS COMPONENT (DAY BY DAY CUSTOMIZATION) */}
            <div className="sm:col-span-2 p-5 sm:p-6 rounded-3xl bg-brand-soft-card border border-brand-purple/20 space-y-4">
              
              {/* Header & Overall Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
                      <Clock className="w-4 h-4" />
                    </div>
                    <h4 className="text-sm font-display font-black text-brand-carbon">
                      Horario de Atención del Negocio (Personalizable Día por Día)
                    </h4>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Establece el rango de apertura y cierre para cada día de la semana (ej. Sábados menos horas, Domingos medio tiempo o cerrado).
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-brand-purple text-white font-mono font-bold text-xs shadow-xs">
                    {activeOpenDays.length} días abiertos
                  </span>
                </div>
              </div>

              {/* Quick Presets Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-1 pb-1">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 mr-1">
                  Plantillas Rápidas:
                </span>
                
                <button
                  type="button"
                  onClick={handleQuickPresetWeekdays}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-purple text-slate-700 text-[11px] font-bold shadow-2xs hover:text-brand-purple transition-all cursor-pointer"
                >
                  ⚡ Lun-Vie (09:00 - 20:00) + Sáb (10:00 - 18:00) + Dom Cerrado
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleDay('Domingo')}
                  className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-brand-purple text-slate-700 text-[11px] font-bold shadow-2xs hover:text-brand-purple transition-all cursor-pointer"
                >
                  {dailySchedule['Domingo']?.isOpen ? '🔒 Cerrar Domingos' : '🟢 Abrir Domingos'}
                </button>
              </div>

              {/* 7-DAY SCHEDULE MATRIX */}
              <div className="space-y-2.5 pt-2">
                {ALL_DAYS_STORE.map((day) => {
                  const dayConfig = dailySchedule[day] || { isOpen: false, openingHour: '09:00', closingHour: '20:00' };
                  const isOpen = Boolean(dayConfig.isOpen);

                  // Calculate daily hours duration
                  let durationHours = 0;
                  if (isOpen && dayConfig.openingHour && dayConfig.closingHour) {
                    const [oH, oM] = dayConfig.openingHour.split(':').map(Number);
                    const [cH, cM] = dayConfig.closingHour.split(':').map(Number);
                    durationHours = Math.max(0, ((cH * 60 + cM) - (oH * 60 + oM)) / 60);
                  }

                  return (
                    <div 
                      key={day}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        isOpen 
                          ? 'bg-white border-slate-200 shadow-2xs hover:border-brand-purple/40' 
                          : 'bg-slate-100/70 border-slate-200/80 opacity-75'
                      }`}
                    >
                      {/* Left: Day Name & Open/Closed Switch */}
                      <div className="flex items-center gap-3 min-w-[170px]">
                        <button
                          type="button"
                          onClick={() => handleToggleDay(day)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-1.5 ${
                            isOpen 
                              ? 'bg-emerald-500 text-white shadow-xs' 
                              : 'bg-slate-300 text-slate-700 hover:bg-slate-400'
                          }`}
                        >
                          <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-white' : 'bg-slate-500'}`} />
                          <span>{isOpen ? 'Abierto' : 'Cerrado'}</span>
                        </button>

                        <div>
                          <span className={`font-bold text-xs ${isOpen ? 'text-brand-carbon' : 'text-slate-500'}`}>
                            {day}
                          </span>
                          {day === 'Sábado' && (
                            <span className="text-[9px] text-amber-600 block font-semibold">Jornada reducida</span>
                          )}
                          {day === 'Domingo' && (
                            <span className="text-[9px] text-slate-400 block font-medium">Fin de semana</span>
                          )}
                        </div>
                      </div>

                      {/* Center: Hours Selectors if Open, or Closed Notice */}
                      {isOpen ? (
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 flex-1 md:justify-center">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-500 font-semibold">Apertura:</span>
                            <select
                              value={dayConfig.openingHour || '09:00'}
                              onChange={(e) => handleChangeDayHour(day, 'openingHour', e.target.value)}
                              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-brand-carbon focus:outline-none focus:border-brand-purple cursor-pointer shadow-2xs"
                            >
                              {TIME_OPTIONS_STORE.map(t => (
                                <option key={t} value={t}>{t} ({formatHourDisplay(t)})</option>
                              ))}
                            </select>
                          </div>

                          <span className="text-slate-400 font-bold hidden sm:inline">—</span>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-slate-500 font-semibold">Cierre:</span>
                            <select
                              value={dayConfig.closingHour || '20:00'}
                              onChange={(e) => handleChangeDayHour(day, 'closingHour', e.target.value)}
                              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white text-xs font-bold text-brand-carbon focus:outline-none focus:border-brand-purple cursor-pointer shadow-2xs"
                            >
                              {TIME_OPTIONS_STORE.map(t => (
                                <option key={t} value={t}>{t} ({formatHourDisplay(t)})</option>
                              ))}
                            </select>
                          </div>

                          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-lg bg-brand-purple/10 text-brand-purple border border-brand-purple/20">
                            {durationHours % 1 === 0 ? durationHours : durationHours.toFixed(1)} hrs
                          </span>
                        </div>
                      ) : (
                        <div className="flex-1 md:text-center text-xs text-slate-500 font-medium italic">
                          🔒 Cerrado al público (La agenda y miembros del equipo bloquearán este día)
                        </div>
                      )}

                      {/* Right: Quick Action to copy */}
                      {isOpen && (
                        <div className="flex items-center justify-end">
                          <button
                            type="button"
                            onClick={() => handleCopyHoursToAll(day)}
                            title="Copiar este horario a los demás días"
                            className="text-[10px] font-bold text-slate-500 hover:text-brand-purple hover:bg-brand-purple/10 px-2 py-1 rounded-lg border border-slate-200 hover:border-brand-purple/30 transition-all cursor-pointer whitespace-nowrap"
                          >
                            Copiar a otros días
                          </button>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Badges / Etiquetas destacadas */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700">
              Etiquetas Destacadas (Badges)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newBadgeText}
                onChange={(e) => setNewBadgeText(e.target.value)}
                placeholder="Ej: Top Rated 2026, Estacionamiento Gratis..."
                className="flex-1 px-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-brand-purple"
              />
              <button
                type="button"
                onClick={handleAddBadge}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Añadir Etiqueta
              </button>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {badges.map((badge, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5"
                >
                  {badge}
                  <button
                    type="button"
                    onClick={() => handleRemoveBadge(idx)}
                    className="hover:text-rose-600 font-bold ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* SECTION 3: COUNTRY, CURRENCY & REGIONAL SETTINGS */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-brand-purple/10 text-brand-purple flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-brand-carbon">
                País, Moneda & Configuración Regional del Comercio
              </h3>
              <p className="text-[11px] text-slate-400">
                Selecciona el país de tu establecimiento estético para aplicar automáticamente su moneda oficial (MXN, COP, USD, EUR, etc.) en toda la plataforma.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {Object.values(currencies).map((curr) => {
              const isSelected = selectedCountry === curr.countryId;
              return (
                <div
                  key={curr.countryId}
                  onClick={() => setBusinessCountry(curr.countryId)}
                  className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-brand-purple bg-brand-purple/5 shadow-brand-sm ring-2 ring-brand-purple/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{curr.flag}</span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                      isSelected ? 'bg-brand-purple text-white shadow-2xs' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {curr.currencyCode}
                    </span>
                  </div>

                  <div>
                    <div className="font-bold text-xs text-brand-carbon">{curr.countryName}</div>
                    <div className="text-[11px] text-slate-500 font-medium">{curr.currencyName}</div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-[11px] flex items-center justify-between font-bold">
                    <span className="text-slate-400 font-normal">Muestra ($40 USD):</span>
                    <span className="text-brand-purple">{formatMoney(40)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Floating Save Bar */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="px-8 py-3.5 rounded-2xl bg-brand-purple hover:bg-brand-purple-dark text-white font-black text-sm shadow-brand-md hover:shadow-purple-glow transition-all flex items-center gap-2 cursor-pointer"
          >
            <Check className="w-5 h-5 stroke-[3]" />
            <span>Guardar Todos los Cambios</span>
          </button>
        </div>

      </form>

    </div>
  );
};
