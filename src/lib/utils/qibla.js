// ═══════════════════════════════════════════════════════════
// Qibla Calculation Utility
// Kaaba coordinates: 21.4225°N, 39.8262°E
// ═══════════════════════════════════════════════════════════

const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;
const EARTH_RADIUS_KM = 6371;

export function calculateQiblaDirection(lat, lng) {
  const latRad = toRad(lat);
  const lngRad = toRad(lng);
  const kaabaLatRad = toRad(KAABA_LAT);
  const kaabaLngRad = toRad(KAABA_LNG);

  const dLng = kaabaLngRad - lngRad;

  const y = Math.sin(dLng);
  const x = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(dLng);

  let bearing = Math.atan2(y, x);
  bearing = toDeg(bearing);
  bearing = (bearing + 360) % 360;

  return bearing;
}

export function calculateDistanceToKaaba(lat, lng) {
  const latRad = toRad(lat);
  const lngRad = toRad(lng);
  const kaabaLatRad = toRad(KAABA_LAT);
  const kaabaLngRad = toRad(KAABA_LNG);

  const dLat = kaabaLatRad - latRad;
  const dLng = kaabaLngRad - lngRad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(latRad) * Math.cos(kaabaLatRad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

export function normalizeDegrees(deg) {
  return ((deg % 360) + 360) % 360;
}

export function formatDegrees(deg) {
  return `${Math.round(deg)}°`;
}

export function getDirectionName(deg) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const idx = Math.round(deg / 45) % 8;
  return directions[idx];
}

export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 100) return `${km.toFixed(1)} km`;
  return `${Math.round(km).toLocaleString()} km`;
}
