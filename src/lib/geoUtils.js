// Geolocation and GPS Navigation Utilities for Bublyme

/**
 * Calculates the great-circle distance between two geographic points using Haversine formula
 * @param {number} lat1 Latitude of point 1
 * @param {number} lon1 Longitude of point 1
 * @param {number} lat2 Latitude of point 2
 * @param {number} lon2 Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;

  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

/**
 * Formats distance in kilometers into a clean, human-readable string
 * @param {number} distanceKm Distance in km
 * @returns {string} e.g. "650 m", "1.4 km", "8.3 km"
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) return null;
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return `${meters} m`;
  }
  return `${distanceKm.toFixed(1)} km`;
};

/**
 * Generates an optimized Google Maps Route URL from current GPS to destination
 */
export const getGoogleMapsDirectionsUrl = (lat, lng, address = '', name = '') => {
  const query = (lat && lng) 
    ? `${lat},${lng}`
    : encodeURIComponent(address || name);
  return `https://www.google.com/maps/dir/?api=1&destination=${query}&travelmode=driving`;
};

/**
 * Generates an Apple Maps Route URL
 */
export const getAppleMapsDirectionsUrl = (lat, lng, address = '') => {
  if (lat && lng) {
    return `https://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
  }
  return `https://maps.apple.com/?daddr=${encodeURIComponent(address)}&dirflg=d`;
};

/**
 * Generates a Waze Navigation URL
 */
export const getWazeDirectionsUrl = (lat, lng) => {
  if (lat && lng) {
    return `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  }
  return `https://waze.com/ul`;
};

/**
 * Universal action to open the best GPS navigation route in a new tab or native maps app
 */
export const openDirections = (lat, lng, address = '', name = '') => {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const url = isIOS 
    ? getAppleMapsDirectionsUrl(lat, lng, address)
    : getGoogleMapsDirectionsUrl(lat, lng, address, name);

  window.open(url, '_blank', 'noopener,noreferrer');
};

/**
 * Geocode address/city into GPS coordinates [lat, lng] using OpenStreetMap Nominatim
 */
export const geocodeAddress = async (address = '', city = '') => {
  const cleanQuery = `${address} ${city}`.trim();
  if (!cleanQuery) return null;

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cleanQuery)}&limit=1`, {
      headers: { 'Accept-Language': 'es,en' }
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
    }
  } catch (e) {
    console.warn('Geocoding fetch fallback:', e);
  }

  // City and zone coordinate fallbacks
  const text = cleanQuery.toLowerCase();
  if (text.includes('guadalajara') || text.includes('zapopan') || text.includes('jalisco') || text.includes('45645') || text.includes('senderos')) {
    return { lat: 20.5400, lng: -103.4645 };
  }
  if (text.includes('cdmx') || text.includes('mexico') || text.includes('méxico') || text.includes('polanco') || text.includes('roma')) {
    return { lat: 19.4326, lng: -99.1332 };
  }
  if (text.includes('bogot') || text.includes('colombia')) {
    return { lat: 4.7110, lng: -74.0721 };
  }
  if (text.includes('medell')) {
    return { lat: 6.2442, lng: -75.5812 };
  }
  if (text.includes('miami') || text.includes('brickell') || text.includes('wynwood')) {
    return { lat: 25.7617, lng: -80.1918 };
  }
  if (text.includes('new york') || text.includes('ny') || text.includes('soho')) {
    return { lat: 40.7128, lng: -74.0060 };
  }
  if (text.includes('monterrey') || text.includes('nuevo leon')) {
    return { lat: 25.6866, lng: -100.3161 };
  }
  if (text.includes('madrid') || text.includes('españa')) {
    return { lat: 40.4168, lng: -3.7038 };
  }
  return null;
};

