import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { useApp } from '../../context/AppContext';
import { calculateDistanceKm, formatDistance, openDirections } from '../../lib/geoUtils';
import { 
  Star, 
  MapPin, 
  Navigation, 
  Sparkles, 
  Crosshair, 
  Plus, 
  Minus,
  Layers
} from 'lucide-react';

export const InteractiveVenueMap = ({ 
  venues = [], 
  selectedVenueId = null, 
  onSelectVenue = null,
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
  const [isLocating, setIsLocating] = useState(false);

  // Expose global bridge functions for popup clicks
  useEffect(() => {
    window.__bublyme_book = (venueId) => {
      const v = (venues || []).find(item => item.id === venueId);
      if (v) {
        setSelectedVenue(v);
        openBookingModal(v);
      }
    };

    window.__bublyme_directions = (venueId) => {
      const v = (venues || []).find(item => item.id === venueId);
      if (v) {
        openDirections(v.lat, v.lng, v.address, v.name);
      }
    };

    window.__bublyme_detail = (venueId) => {
      const v = (venues || []).find(item => item.id === venueId);
      if (v) {
        setSelectedVenue(v);
        setCurrentView('venue-detail');
      }
    };

    return () => {
      delete window.__bublyme_book;
      delete window.__bublyme_directions;
      delete window.__bublyme_detail;
    };
  }, [venues, setSelectedVenue, openBookingModal, setCurrentView]);

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

  // ── Initialize Leaflet Map with 100% Free OpenStreetMap Tiles (No API key needed) ──
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        zoomControl: false,
        attributionControl: false
      });

      // 100% Free OpenStreetMap tile server (Never requires API keys, ultra fast and globally accessible)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        subdomains: ['a', 'b', 'c']
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // ── Build HTML for Pin-Anchored Popup ──────────────────────────────────
  const buildPopupHtml = (venue, dynamicDistStr) => {
    const imgUrl = venue.image || venue.images?.[0] || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80';
    const rating = Number(venue.rating || 5.0).toFixed(1);
    const reviews = venue.reviewsCount || 400;
    const address = venue.address || venue.city || 'Ubicación céntrica';
    const distBadge = dynamicDistStr ? `📍 ${dynamicDistStr}` : (venue.distance ? `📍 ${venue.distance}` : '');

    return `
      <div class="w-72 bg-white rounded-3xl p-3 shadow-2xl border border-slate-200/90 text-slate-800 font-sans text-left animate-in fade-in zoom-in-95 duration-150 select-none">
        
        <!-- Image Header -->
        <div class="relative h-32 w-full rounded-2xl overflow-hidden cursor-pointer group mb-2.5" onclick="window.__bublyme_detail('${venue.id}')">
          <img src="${imgUrl}" alt="${venue.name}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          
          <!-- Rating tag -->
          <div class="absolute bottom-2 left-2 flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-xs font-black text-slate-900 shadow-sm">
            <span class="text-amber-500">★</span>
            <span>${rating}</span>
            <span class="text-[10px] text-slate-500 font-normal">(${reviews})</span>
          </div>

          <!-- Distance tag -->
          ${distBadge ? `
            <div class="absolute bottom-2 right-2 px-2 py-0.5 rounded-lg bg-brand-mint text-brand-carbon text-[10px] font-black uppercase shadow-sm">
              ${distBadge}
            </div>
          ` : ''}
        </div>

        <!-- Venue Details -->
        <div class="space-y-1 mb-3 px-1">
          <h4 class="font-bold text-sm text-slate-900 truncate hover:text-brand-purple cursor-pointer transition-colors" onclick="window.__bublyme_detail('${venue.id}')">
            ${venue.name}
          </h4>
          <p class="text-[11px] text-slate-500 truncate flex items-center gap-1">
            <span>📍 ${address}</span>
          </p>
        </div>

        <!-- Actions: "Cómo llegar" & "Agendar" -->
        <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
          <button 
            type="button"
            onclick="window.__bublyme_directions('${venue.id}')"
            class="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>🧭 Cómo llegar</span>
          </button>

          <button 
            type="button"
            onclick="window.__bublyme_book('${venue.id}')"
            class="py-2.5 px-3 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white font-bold text-xs flex items-center justify-center gap-1 shadow-brand-sm transition-colors"
          >
            <span>Agendar</span>
            <span>→</span>
          </button>
        </div>

      </div>
    `;
  };

  // ── Render Custom Pill Markers & Attach Leaflet Popups to Pins ──────────
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

      const isSelected = selectedVenueId === venue.id;
      const catSymbol = getCategorySymbol(venue.category);

      // Distance calculation from user GPS if active
      let distStr = null;
      if (userLocation) {
        const distKm = calculateDistanceKm(userLocation.lat, userLocation.lng, venue.lat, venue.lng);
        distStr = formatDistance(distKm);
      }

      // Create Custom Pin Icon
      const pinHtml = `
        <div class="group relative cursor-pointer transform transition-all duration-200 ${isSelected ? 'scale-110 z-50' : 'hover:scale-110 hover:z-40'}">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg font-black text-xs transition-all ${
            isSelected 
              ? 'bg-brand-purple text-white ring-4 ring-brand-purple/30 scale-105 shadow-purple-glow' 
              : 'bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 hover:bg-brand-purple hover:border-brand-purple'
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

      // Bind PopUp Directly Above Marker
      const popupContent = buildPopupHtml(venue, distStr);
      marker.bindPopup(popupContent, {
        offset: [0, -34],
        closeButton: false,
        className: 'venue-pin-popup',
        autoPan: true,
        autoPanPadding: [30, 30]
      });

      marker.on('click', () => {
        if (onSelectVenue) onSelectVenue(venue);
      });

      markersRef.current[venue.id] = marker;
      bounds.extend([venue.lat, venue.lng]);
      hasValidCoords = true;
    });

    // Programmatically open popup when selectedVenueId changes from parent
    if (selectedVenueId && markersRef.current[selectedVenueId]) {
      const selectedMarker = markersRef.current[selectedVenueId];
      selectedMarker.openPopup();
      map.panTo(selectedMarker.getLatLng(), { animate: true, duration: 0.4 });
    }

    if (hasValidCoords && !userLocation && !selectedVenueId && interactive && venues.length > 1) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [venues, selectedVenueId, userLocation]);

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
          if (userMarkerRef.current) userMarkerRef.current.remove();

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

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 bg-slate-100 flex flex-col">
      
      {/* The Leaflet Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px] z-10" />

      {/* Floating Controls */}
      {showControls && (
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
          
          {/* GPS Locate Button */}
          <button
            type="button"
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
              type="button"
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="p-2.5 text-slate-700 hover:text-brand-purple hover:bg-slate-50 rounded-xl transition-colors font-bold text-sm"
              title="Acercar"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="p-2.5 text-slate-700 hover:text-brand-purple hover:bg-slate-50 rounded-xl transition-colors font-bold text-sm"
              title="Alejar"
            >
              -
            </button>
          </div>

        </div>
      )}

    </div>
  );
};

export default InteractiveVenueMap;
