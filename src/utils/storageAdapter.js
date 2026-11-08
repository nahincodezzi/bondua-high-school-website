/**
 * Storage Adapter with Configurable Prefix and One-Time Legacy Migration
 * Keeps data backwards-compatible while moving away from school-specific hardcoded keys.
 */

export const STORAGE_PREFIX = import.meta.env?.VITE_STORAGE_PREFIX || 'site_';

export function getStorageKey(suffix) {
  return `${STORAGE_PREFIX}${suffix}`;
}

export function runStorageMigration() {
  if (typeof window === 'undefined') return;

  try {
    const migrationMarker = `${STORAGE_PREFIX}v3_migrated`;
    if (localStorage.getItem(migrationMarker) === 'true') return;

    // Keys to migrate from legacy 'bdhs_' to active prefix
    const keys = [
      'info', 'slides', 'notices', 'teachers', 'students', 
      'admissions', 'results', 'fees', 'gallery', 'academic_groups', 
      'academic_config', 'uniform', 'system_users', 'theme', 'lang', 'auth'
    ];

    keys.forEach(k => {
      const legacyKey = `bdhs_${k}`;
      const newKey = getStorageKey(k);
      const val = localStorage.getItem(legacyKey);
      if (val !== null && localStorage.getItem(newKey) === null) {
        localStorage.setItem(newKey, val);
      }
    });

    localStorage.setItem(migrationMarker, 'true');
  } catch (err) {
    console.warn('Storage prefix migration caught error:', err);
  }
}

export function getStoredItem(keySuffix, defaultValue = null) {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const primaryKey = getStorageKey(keySuffix);
    let val = localStorage.getItem(primaryKey);
    // Fallback to legacy bdhs_ if primary not set yet
    if (val === null) {
      val = localStorage.getItem(`bdhs_${keySuffix}`);
    }
    return val;
  } catch {
    return defaultValue;
  }
}

export function setStoredItem(keySuffix, value) {
  if (typeof window === 'undefined') return;
  try {
    const primaryKey = getStorageKey(keySuffix);
    const str = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(primaryKey, str);
    // Keep legacy key mirrored for smooth rollover
    localStorage.setItem(`bdhs_${keySuffix}`, str);
  } catch (err) {
    console.warn('Error saving to storage:', err);
  }
}

