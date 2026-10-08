// ═══════════════════════════════════════════════════════════
// Qibla Direction Calculation
// Uses Great Circle Formula (Haversine variant)
// ═══════════════════════════════════════════════════════════

// Kaaba coordinates (Mecca)
export const KAABA_LAT = 21.4225;
export const KAABA_LNG = 39.8262;

/**
 * Calculate Qibla direction from user's location
 * Returns degrees from North (0-360)
 */
export function calculateQibla(lat, lng) {
  const latRad = toRad(lat);
  const lngRad = toRad(lng);
  const kaabaLatRad = toRad(KAABA_LAT);
  const kaabaLngRad = toRad(KAABA_LNG);

  const dLng = kaabaLngRad - lngRad;

  const x = Math.sin(dLng);
  const y = Math.cos(latRad) * Math.tan(kaabaLatRad) - Math.sin(latRad) * Math.cos(dLng);

  let qibla = Math.atan2(x, y);
  qibla = toDeg(qibla);
  qibla = (qibla + 360) % 360;

  return qibla;
}

/**
 * Calculate distance to Kaaba in km
 */
export function calculateDistance(lat, lng) {
  const R = 6371; // Earth radius in km
  const dLat = toRad(KAABA_LAT - lat);
  const dLng = toRad(KAABA_LNG - lng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat)) * Math.cos(toRad(KAABA_LAT)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

/**
 * Get compass direction name from degrees
 */
export function getDirectionName(deg) {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

export function getDirectionNameBn(deg) {
  const directions = ['উত্তর', 'উত্তর-পূর্ব', 'পূর্ব', 'দক্ষিণ-পূর্ব', 'দক্ষিণ', 'দক্ষিণ-পশ্চিম', 'পশ্চিম', 'উত্তর-পশ্চিম'];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}
