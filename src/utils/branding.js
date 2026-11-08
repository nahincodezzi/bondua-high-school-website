import { useSchool } from '../context/useSchool';

export const DEFAULT_SCHOOL_LOGO = '/brand/logo-emerald.png';

/**
 * Single source of truth for resolving the school logo everywhere in the application.
 * Theme-independent: returns the exact same logo regardless of active theme (emerald / indigo).
 *
 * @param {Object} info - School settings object (schoolInfo / bdhs_info)
 * @returns {string} Image path or data URL
 */
export function getSchoolLogo(info) {
  if (!info) return DEFAULT_SCHOOL_LOGO;

  if (typeof info.schoolLogo === 'string' && info.schoolLogo.trim()) {
    return info.schoolLogo.trim();
  }

  // Backwards compatibility fallbacks
  if (typeof info.logo === 'string' && info.logo.trim()) {
    return info.logo.trim();
  }

  if (info.logos?.emerald?.onLight) return info.logos.emerald.onLight;
  if (info.logos?.emerald?.onDark) return info.logos.emerald.onDark;
  if (info.logos?.indigo?.onLight) return info.logos.indigo.onLight;
  if (info.logos?.indigo?.onDark) return info.logos.indigo.onDark;

  return DEFAULT_SCHOOL_LOGO;
}

/**
 * React hook to retrieve the single centralized school logo from context.
 *
 * @returns {string} Image path or data URL
 */
export function useSchoolLogo() {
  const context = useSchool();
  return getSchoolLogo(context?.schoolInfo);
}
