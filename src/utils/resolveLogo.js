/**
 * Single source of truth for resolving school logo.
 * Kept for backwards compatibility with legacy callers.
 * Now routes through getSchoolLogo to guarantee theme-independence and a single source of truth.
 */
import { getSchoolLogo, DEFAULT_SCHOOL_LOGO } from './branding';

export function resolveLogo(schoolInfo) {
  return getSchoolLogo(schoolInfo);
}

export { getSchoolLogo, DEFAULT_SCHOOL_LOGO };
