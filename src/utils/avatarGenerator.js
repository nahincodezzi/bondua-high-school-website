// Scratch test for avatar generator
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

  const primaryColor = isHead ? "#064e3b" : isStaff ? "#1e293b" : "#065f46";
  const accentColor = isHead ? "#f59e0b" : isAsst ? "#fbbf24" : isStaff ? "#94a3b8" : "#34d399";
  const roleBadge = isHead 
    ? "ACTING HEADMASTER" 
    : isAsst 
      ? "ASST HEADMASTER" 
      : isStaff 
        ? "OFFICE & SUPPORT STAFF" 
        : "FACULTY MEMBER";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 480" width="400" height="480">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${primaryColor}"/>
      <stop offset="60%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <radialGradient id="ambient" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="${accentColor}" stop-opacity="0.25"/>
      <stop offset="100%" stop-color="${accentColor}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="suitGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="400" height="480" fill="url(#bgGrad)"/>
  <rect width="400" height="480" fill="url(#ambient)"/>

  <!-- Academic Guilloche Circles -->
  <circle cx="200" cy="180" r="140" fill="none" stroke="${accentColor}" stroke-opacity="0.12" stroke-width="1.5" stroke-dasharray="6 4"/>
  <circle cx="200" cy="180" r="115" fill="none" stroke="${accentColor}" stroke-opacity="0.18" stroke-width="1"/>
  <circle cx="200" cy="180" r="92" fill="none" stroke="#ffffff" stroke-opacity="0.08" stroke-width="1"/>

  <!-- Institutional Crest Watermark -->
  <g transform="translate(160, 40) scale(0.8)" opacity="0.35">
    <circle cx="50" cy="50" r="45" fill="none" stroke="${accentColor}" stroke-width="2"/>
    <polygon points="50,15 53,24 62,24 55,29 57,38 50,33 43,38 45,29 38,24 47,24" fill="${accentColor}"/>
    <path d="M 28 62 Q 50 56 50 68 Q 50 56 72 62 L 72 70 Q 50 64 50 76 Q 50 64 28 70 Z" fill="${accentColor}"/>
  </g>

  <!-- Educator Formal Silhouette / Attire -->
  <g transform="translate(0, 50)">
    ${isFemale ? `
      <!-- Female Formal Educator Attire (Saree/Salwar Drapery) -->
      <path d="M 120 380 Q 200 370 280 380 L 320 450 L 80 450 Z" fill="#991b1b" opacity="0.9"/>
      <path d="M 130 380 C 130 340 160 310 200 310 C 240 310 270 340 270 380 L 300 450 L 100 450 Z" fill="#7f1d1d"/>
      <path d="M 150 320 Q 200 360 250 380 L 230 450 L 140 450 Z" fill="#b91c1c" stroke="${accentColor}" stroke-width="2" stroke-dasharray="4 2"/>
      <path d="M 160 300 Q 200 320 240 300" stroke="${accentColor}" stroke-width="2" fill="none"/>
    ` : `
      <!-- Male Formal Educator Attire (Collared Shirt, Tie & Blazer) -->
      <path d="M 90 440 C 90 350 140 310 200 310 C 260 310 310 350 310 440 L 330 450 L 70 450 Z" fill="url(#suitGrad)"/>
      <polygon points="200,310 180,360 220,360" fill="#f8fafc"/>
      <polygon points="200,320 194,360 206,360" fill="${accentColor}"/>
      <polygon points="194,360 206,360 203,420 197,420" fill="${accentColor}"/>
      <!-- Lapels -->
      <polygon points="140,330 180,380 165,395 125,345" fill="#1e293b"/>
      <polygon points="260,330 220,380 235,395 275,345" fill="#1e293b"/>
      <!-- Gold Lapel Pin -->
      <circle cx="160" cy="360" r="3" fill="url(#goldGrad)"/>
    `}

    <!-- Head & Portrait Monogram Frame -->
    <circle cx="200" cy="200" r="72" fill="#0f172a" stroke="url(#goldGrad)" stroke-width="4" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.5))"/>
    <circle cx="200" cy="200" r="64" fill="#064e3b" stroke="${accentColor}" stroke-width="1.5" stroke-opacity="0.6"/>

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
    </g>
  </g>

  <!-- Bottom Institutional Bar -->
  <rect x="30" y="420" width="340" height="42" rx="10" fill="#020617" fill-opacity="0.9" stroke="${accentColor}" stroke-width="1.2"/>
  
  <text x="200" y="438" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="10.5" font-weight="700" fill="${accentColor}" letter-spacing="1.5">
    ${roleBadge}
  </text>
  <text x="200" y="452" text-anchor="middle" font-family="'Segoe UI', Roboto, sans-serif" font-size="8.5" font-weight="500" fill="#94a3b8" letter-spacing="0.5">
    BONDUA DAULATPUR HIGH SCHOOL • ESTD 1990
  </text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
