/**
 * Data Sanitizer for Bondua Daulatpur High School
 * Automatically purges legacy "Bandua" spellings and ensures valid dual-language fallbacks.
 */

export function sanitizeBonduaString(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/Bandua/g, 'Bondua')
    .replace(/bandua/g, 'bondua')
    .replace(/BANDUA/g, 'BONDUA');
}

export function deepSanitizeBondua(val) {
  if (val === null || val === undefined) return val;
  if (typeof val === 'string') {
    return sanitizeBonduaString(val);
  }
  if (Array.isArray(val)) {
    return val.map(deepSanitizeBondua);
  }
  if (typeof val === 'object') {
    const res = {};
    for (const key of Object.keys(val)) {
      res[key] = deepSanitizeBondua(val[key]);
    }
    return res;
  }
  return val;
}
