import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { calculateDistanceKm, formatDistance, openDirections } from '../../lib/geoUtils';
import { 
  Star, 
  MapPin, 
  Navigation, 
  Calendar, 
  Sparkles, 
  Scissors, 
  Heart, 
  Flame, 
  X, 
  ArrowRight,
  Crosshair,
  ExternalLink,
  Layers
} from 'lucide-react';

export const InteractiveVenueMap = ({ 
  venues = [], 
  selectedVenueId = null, 
  onSelectVenue = null,
  height = '100%',
  interactive = true,
  defaultCenter = [25.7654, -80.1912],
  defaultZoom = 13,
  showControls = true
}) => {
  const { setSelectedVenue, setCurrentView, openBookingModal } = useApp();
  
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const userMarkerRef = useRef(null);

  const [userLocation, setUserLocation] = useState(null);
  const [activePopupVenue, setActivePopupVenue] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [tileMode, setTileMode] = useState('voyager'); // 'voyager' | 'osm'

  // Determine icon by venue category
  const getCategorySymbol = (category) => {
    switch (category) {
      case 'barber': return '💈';
      case 'hair-salon': return '💇';
      case 'nails': return '💅';
      case 'spa': return '🧖';
      default: return '✨';
    }
  };

  // ── Initialize Leaflet Map ──────────────────────────────────────────────
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Voyager modern clean tiles
      const tileLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          maxZoom: 19,
          subdomains: 'abcd',
        }
      ).addTo(map);

      mapInstanceRef.current = map;

      // Close popup on map click background
      map.on('click', () => {
        setActivePopupVenue(null);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // ── Render Custom Pill Markers for Venues ───────────────────────────────
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !venues) return;

    // Clear old markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    const bounds = L.latLngBounds();
    let hasValidCoords = false;

    venues.forEach(venue => {
      if (!venue || !venue.lat || !venue.lng) return;

      const isSelected = selectedVenueId === venue.id || (activePopupVenue && activePopupVenue.id === venue.id);
      const catSymbol = getCategorySymbol(venue.category);

      // Create Custom HTML Pin Marker (Fresha Style)
      const pinHtml = `
        <div class="group relative cursor-pointer transform transition-all duration-200 ${isSelected ? 'scale-110 z-50' : 'hover:scale-110 hover:z-40'}">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg font-black text-xs transition-all ${
            isSelected 
              ? 'bg-brand-purple text-white ring-4 ring-brand-purple/30 scale-105 shadow-purple-glow' 
              : 'bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/80 hover:bg-brand-purple hover:border-brand-purple'
          }">
            <span class="text-xs">${catSymbol}</span>
            <span class="text-amber-400 font-extrabold">★</span>
            <span class="tracking-tight">${Number(venue.rating || 5.0).toFixed(1)}</span>
          </div>
          <!-- Pin Pointer Arrow -->
          <div class="w-2 h-2 mx-auto rotate-45 -mt-1 transition-all ${
            isSelected ? 'bg-brand-purple' : 'bg-slate-900 group-hover:bg-brand-purple'
          }"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-venue-pin',
        html: pinHtml,
        iconSize: [80, 36],
        iconAnchor: [40, 36],
      });

      const marker = L.marker([venue.lat, venue.lng], { icon: customIcon }).addTo(map);

      // Marker Click & Hover Handlers
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setActivePopupVenue(venue);
        if (onSelectVenue) onSelectVenue(venue);
        map.panTo([venue.lat, venue.lng], { animate: true, duration: 0.5 });
      });

      markersRef.current[venue.id] = marker;
      bounds.extend([venue.lat, venue.lng]);
      hasValidCoords = true;
    });

    if (hasValidCoords && !userLocation && interactive && venues.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [venues, selectedVenueId, activePopupVenue]);

  // ── Handle GPS Geolocation ──────────────────────────────────────────────
  const handleLocateUser = useCallback(() => {
    if (!navigator.geolocation) {
      alert('La geolocalización no es soportada por tu navegador');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const coords = [latitude, longitude];
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);

        const map = mapInstanceRef.current;
        if (map) {
          // Remove previous user beacon
          if (userMarkerRef.current) userMarkerRef.current.remove();

          // Pulse radar beacon HTML for user location
          const userBeaconHtml = `
            <div class="relative flex items-center justify-center">
              <div class="w-8 h-8 rounded-full bg-cyan-400/30 animate-ping absolute"></div>
              <div class="w-4 h-4 rounded-full bg-cyan-500 border-2 border-white shadow-lg relative z-10"></div>
            </div>
          `;

          const userIcon = L.divIcon({
            className: 'user-gps-beacon',
            html: userBeaconHtml,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });

          userMarkerRef.current = L.marker(coords, { icon: userIcon }).addTo(map);
          map.flyTo(coords, 14, { animate: true, duration: 1.2 });
        }
      },
      (err) => {
        console.warn('Geolocation denied or unavailable:', err);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Calculate live distance from user location to active popup venue
  const dynamicDistance = activePopupVenue && userLocation
    ? calculateDistanceKm(userLocation.lat, userLocation.lng, activePopupVenue.lat, activePopupVenue.lng)
    : null;

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-100 flex flex-col">
      
      {/* The Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px] z-10" />

      {/* Map Interactive Overlays and Floating Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          
          {/* Geolocation GPS Button */}
          <button
            onClick={handleLocateUser}
            disabled={isLocating}
            className={`p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-lg text-slate-700 hover:text-brand-purple hover:bg-white transition-all flex items-center gap-2 text-xs font-bold ${
              isLocating ? 'animate-pulse text-brand-purple' : ''
            }`}
            title="Mi Ubicación GPS"
          >
            <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin text-brand-purple' : 'text-slate-600'}`} />
            <span className="hidden sm:inline">Cerca de mí</span>
          </button>

          {/* Zoom Controls */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-lg p-1 flex flex-col divide-y divide-slate-100">
            <button
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="p-2.5 text-slate-700 hover:text-brand-purple hover:bg-slate-50 rounded-xl transition-colors font-bold text-sm"
              title="Acercar"
            >
              +
            </button>
            <button
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="p-2.5 text-slate-700 hover:text-brand-purple hover:bg-slate-50 rounded-xl transition-colors font-bold text-sm"
              title="Alejar"
            >
              -
            </button>
          </div>

        </div>
      )}

      {/* Floating Card Popup on Marker Hover / Click (Fresha Style) */}
      {activePopupVenue && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 max-w-sm w-[92%] sm:w-80 bg-white rounded-3xl p-3.5 shadow-2xl border border-slate-200 animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Close Popup button */}
          <button
            onClick={() => setActivePopupVenue(null)}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black text-white transition-all z-20"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Venue Image */}
          <div className="relative h-36 w-full rounded-2xl overflow-hidden mb-3 group cursor-pointer"
            onClick={() => {
              setSelectedVenue(activePopupVenue);
              setCurrentView('venue-detail');
            }}
          >
            <img
              src={activePopupVenue.image || activePopupVenue.images?.[0]}
              alt={activePopupVenue.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Rating Tag */}
            <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-xs font-black text-slate-900 shadow-sm">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{Number(activePopupVenue.rating || 5.0).toFixed(1)}</span>
              <span className="text-[10px] text-slate-500 font-normal">({activePopupVenue.reviewsCount || 400})</span>
            </div>

            {/* Distance badge if GPS active */}
            {dynamicDistance !== null ? (
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-brand-mint text-brand-carbon text-[10px] font-black uppercase shadow-sm">
                📍 {formatDistance(dynamicDistance)}
              </div>
            ) : activePopupVenue.distance && (
              <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-white/90 text-slate-700 text-[10px] font-bold">
                {activePopupVenue.distance}
              </div>
            )}
          </div>

          {/* Venue Info */}
          <div className="space-y-1 mb-3">
            <h4 
              onClick={() => {
                setSelectedVenue(activePopupVenue);
                setCurrentView('venue-detail');
              }}
              className="font-bold text-sm text-slate-900 truncate hover:text-brand-purple cursor-pointer transition-colors"
            >
              {activePopupVenue.name}
            </h4>
            <p className="text-[11px] text-slate-500 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{activePopupVenue.address || activePopupVenue.city}</span>
            </p>
          </div>

          {/* Action Buttons: "Cómo llegar" (GPS route) & "Agendar" */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            
            {/* GPS Directions Route Button */}
            <button
              type="button"
              onClick={() => openDirections(activePopupVenue.lat, activePopupVenue.lng, activePopupVenue.address, activePopupVenue.name)}
              className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors group"
              title="Abrir ruta en Google Maps / GPS"
            >
              <Navigation className="w-3.5 h-3.5 text-brand-purple group-hover:scale-110 transition-transform" />
              <span>Cómo llegar</span>
            </button>

            {/* Agendar / Ver Perfil */}
            <button
              type="button"
              onClick={() => {
                setSelectedVenue(activePopupVenue);
                openBookingModal(activePopupVenue);
              }}
              className="py-2.5 px-3 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white font-bold text-xs flex items-center justify-center gap-1 shadow-brand-sm transition-colors"
            >
              <span>Agendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default InteractiveVenueMap;
