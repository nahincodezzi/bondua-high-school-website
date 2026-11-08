import React from 'react';
import { useSchool } from '../../context/useSchool';
import { resolveLogo } from '../../utils/resolveLogo';

export default function SchoolLogo({ 
  logo = null, 
  surface = 'dark',
  className = "w-full h-full", 
  alt = "School Logo",
  showFallbackText = true 
}) {
  const { schoolInfo = {}, theme = 'emerald' } = useSchool() || {};

  // Resolve logo: explicit prop takes precedence, otherwise use theme/surface resolver
  const resolved = logo || resolveLogo(schoolInfo, theme, surface);

  if (resolved) {
    return (
      <img 
        src={resolved} 
        alt={alt || schoolInfo?.nameEn || "School Logo"} 
        className={`${className} object-contain`} 
      />
    );
  }

  // Theme-adaptive generic monogram fallback (no hard-coded school names or fixed EIIN)
  const isIndigo = theme === 'indigo';
  const primaryColor = isIndigo ? '#1E1B4B' : '#0B3D2E';
  const accentColor = isIndigo ? '#FACC15' : '#E8B931';
  const estdYear = schoolInfo?.established ? `ESTD ${schoolInfo.established}` : 'KNOWLEDGE';
  const eiinText = schoolInfo?.eiin ? `EIIN: ${schoolInfo.eiin}` : (schoolInfo?.shortName || 'SCHOOL');

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={alt}>
      <circle cx="50" cy="50" r="46" fill={primaryColor} stroke={accentColor} strokeWidth="4"/>
      <circle cx="50" cy="50" r="39" fill="#ffffff" stroke={primaryColor} strokeWidth="1"/>
      <circle cx="50" cy="40" r="11" fill={accentColor}/>
      <path d="M 30 58 Q 50 52 50 64 Q 50 52 70 58 L 70 66 Q 50 60 50 72 Q 50 60 30 66 Z" fill={primaryColor}/>
      <path d="M 50 64 L 50 72" stroke="#ffffff" strokeWidth="1.5"/>
      <polygon points="50,14 52,18 56,18 53,21 54,25 50,22 46,25 47,21 44,18 48,18" fill={accentColor}/>
      {showFallbackText && (
        <>
          <text x="50" y="80" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill={primaryColor}>{estdYear}</text>
          <text x="50" y="87" textAnchor="middle" fontSize="5" fontWeight="600" fill="#64748b">{eiinText}</text>
        </>
      )}
    </svg>
  );
}
