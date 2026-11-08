/**
 * Single source of truth for resolving theme-aware school logos
 * @param {Object} schoolInfo - School settings object
 * @param {'emerald'|'indigo'} theme - Active UI theme
 * @param {'dark'|'light'} surface - Surface background lightness
 * @returns {string|null} Resolved logo image URL or null for generic monogram
 */
export function resolveLogo(schoolInfo, theme = 'emerald', surface = 'dark') {
  if (!schoolInfo) return null;

  const currentTheme = theme === 'indigo' ? 'indigo' : 'emerald';
  const otherTheme = currentTheme === 'indigo' ? 'emerald' : 'indigo';
  const otherSurface = surface === 'dark' ? 'light' : 'dark';

  const logos = schoolInfo.logos;

  if (logos && typeof logos === 'object') {
    // 1. Target theme + Target surface
    if (logos[currentTheme]?.[surface]) return logos[currentTheme][surface];
    // 2. Target theme + Other surface
    if (logos[currentTheme]?.[otherSurface]) return logos[currentTheme][otherSurface];
    // 3. Other theme + Target surface
    if (logos[otherTheme]?.[surface]) return logos[otherTheme][surface];
    // 4. Other theme + Other surface
    if (logos[otherTheme]?.[otherSurface]) return logos[otherTheme][otherSurface];
  }

  // 5. Legacy single logo field
  if (schoolInfo.logo && typeof schoolInfo.logo === 'string') {
    return schoolInfo.logo;
  }

  // 6. Null triggers generic dynamic monogram
  return null;
}

