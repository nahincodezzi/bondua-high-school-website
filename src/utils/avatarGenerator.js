// Institutional Avatar Generator with Dynamic Theme Tokens
function getThemeToken(token, fallback) {
  if (typeof window !== 'undefined' && typeof document !== 'undefined' && document.documentElement) {
    try {
      const val = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
      if (val) return val;
    } catch {
      // fallback
    }
  }
  return fallback;
}

export function createEducatorAvatar({
  _nameEn = "Teacher",
  _initials = "BD",
  designation = "Faculty Member",
  gender = "male",
  role = "faculty"
}) {
  const isHead = role === 'headmaster' || designation.includes('Headmaster');
  const isAsst = designation.includes('Assistant Headmaster');
  const isStaff = role === 'staff';
  const isFemale = gender === 'female';

  const themeDeep = getThemeToken('--c-deep', '#0B3D2E');
  const themePrimary = getThemeToken('--c-primary', '#0F6B47');
  const themeAccent = getThemeToken('--c-accent', '#E8B931');
  const themeAccentHover = getThemeToken('--c-accent-hover', '#D4A520');
  const themeMuted = getThemeToken('--c-muted', '#4A5A50');

  const primaryColor = isHead ? themeDeep : isStaff ? themeMuted : themePrimary;
  const accentColor = isHead ? themeAccent : isAsst ? themeAccentHover : isStaff ? themeMuted : themeAccent;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="400" height="480">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="60%" stop-color="${themeDeep}"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <radialGradient id="ambient" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${themeAccent}"/>
      <stop offset="50%" stop-color="${themeAccent}"/>
      <stop offset="100%" stop-color="${themeAccentHover}"/>
    </linearGradient>
    <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${themeDeep}"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="400" height="480" fill="url(#bgGrad)"/>
  <rect width="400" height="480" fill="url(#ambient)"/>

  <!-- Academic Guilloche Circles -->
  <circle cx="200" cy="180" r="140" fill="none" stroke="${accentColor}" stroke-opacity="0.15" stroke-width="1.5" stroke-dasharray="6 4"/>
  <circle cx="200" cy="180" r="115" fill="none" stroke="${accentColor}" stroke-opacity="0.2" stroke-width="1"/>
  <circle cx="200" cy="180" r="92" fill="none" stroke="#ffffff" stroke-opacity="0.1" stroke-width="1"/>

  <!-- Institutional Crest Watermark -->
  <g transform="translate(160, 40) scale(0.8)" opacity="0.35">
    <circle cx="50" cy="50" r="45" fill="none" stroke="${accentColor}" stroke-width="2"/>
    <polygon points="50,15 53,24 62,24 55,29 57,38 50,33 43,38 45,29 38,24 47,24" fill="${accentColor}"/>
    <path d="M 28 62 Q 50 56 50 68 Q 50 56 72 62 L 72 70 Q 50 64 50 76 Q 50 64 28 70 Z" fill="${accentColor}"/>
  </g>

  <!-- Educator Formal Silhouette / Attire -->
  <g transform="translate(0, 50)">
    ${isFemale ? `
      <!-- Female Formal Educator Attire -->
      <path d="M 120 380 Q 200 370 280 380 L 320 450 L 80 450 Z" fill="${primaryColor}" opacity="0.9"/>
      <path d="M 130 380 C 130 340 160 310 200 310 C 240 310 270 340 270 380 L 300 450 L 100 450 Z" fill="${themeDeep}"/>
      <path d="M 150 320 Q 200 360 250 380 L 230 450 L 140 450 Z" fill="${primaryColor}" stroke="${accentColor}" stroke-width="2" stroke-dasharray="4 2"/>
      <path d="M 160 300 Q 200 320 240 300" stroke="${accentColor}" stroke-width="2" fill="none"/>
    ` : `
      <!-- Male Formal Educator Attire -->
      <path d="M 90 440 C 90 350 140 310 200 310 C 260 310 310 350 310 440 L 330 450 L 70 450 Z" fill="url(#suitGrad)"/>
      <polygon points="200,310 180,360 220,360" fill="#f8fafc"/>
      <polygon points="200,320 194,360 206,360" fill="${accentColor}"/>
      <polygon points="194,360 206,360 203,420 197,420" fill="${accentColor}"/>
      <!-- Lapels -->
      <polygon points="140,330 180,380 165,395 125,345" fill="${themeDeep}"/>
      <polygon points="260,330 220,380 235,395 275,345" fill="${themeDeep}"/>
      <!-- Gold Lapel Pin -->
      <circle cx="160" cy="360" r="3" fill="url(#goldGrad)"/>
    `}

    <!-- Head & Portrait Monogram Frame -->
    <circle cx="200" cy="200" r="72" fill="${themeDeep}" stroke="url(#goldGrad)" stroke-width="4"/>
    <circle cx="200" cy="200" r="64" fill="${primaryColor}" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.6"/>

    <!-- Academic Cap / Star Icon above Monogram -->
    <g transform="translate(182, 142) scale(0.75)">
      <polygon points="24,6 44,14 24,22 4,14" fill="${accentColor}"/>
      <polygon points="12,17 12,28 24,32 36,28 36,17 24,21" fill="${accentColor}" opacity="0.8"/>
      <line x1="40" y1="15" x2="40" y2="30" stroke="${accentColor}" stroke-width="2"/>
      <circle cx="40" cy="31" r="2.5" fill="${accentColor}"/>
    </g>

    <!-- Educator Emblem Watermark -->
    <g transform="translate(168, 172) scale(1.3)" opacity="0.85">
      <circle cx="24" cy="24" r="22" fill="none" stroke="${accentColor}" stroke-width="1.5" stroke-dasharray="3 2"/>
      <path d="M 12 18 L 24 12 L 36 18 L 24 24 Z" fill="${accentColor}"/>
      <path d="M 16 21 L 16 28 C 16 32 32 32 32 28 L 32 21" fill="none" stroke="${accentColor}" stroke-width="1.5"/>
      <line x1="33" y1="19" x2="35" y2="27" stroke="${accentColor}" stroke-width="1.2"/>
      <line x1="15" y1="19" x2="13" y2="27" stroke="${accentColor}" stroke-width="1.2"/>
    </g>
  </g>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
