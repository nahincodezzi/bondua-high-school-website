import React from 'react';

export default function SchoolLogo({ 
  logo = null, 
  className = "w-full h-full", 
  alt = "School Logo",
  showFallbackText = true 
}) {
  if (logo) {
    return (
      <img 
        src={logo} 
        alt={alt} 
        className={`${className} object-contain`} 
      />
    );
  }

  return (
    <svg viewBox="0 0 100 100" className={className}>
      <circle cx="50" cy="50" r="46" fill="#064e3b" stroke="#f59e0b" strokeWidth="4"/>
      <circle cx="50" cy="50" r="39" fill="#ffffff" stroke="#064e3b" strokeWidth="1"/>
      <circle cx="50" cy="40" r="11" fill="#f59e0b"/>
      <path d="M 30 58 Q 50 52 50 64 Q 50 52 70 58 L 70 66 Q 50 60 50 72 Q 50 60 30 66 Z" fill="#064e3b"/>
      <path d="M 50 64 L 50 72" stroke="#ffffff" strokeWidth="1.5"/>
      <polygon points="50,14 52,18 56,18 53,21 54,25 50,22 46,25 47,21 44,18 48,18" fill="#f59e0b"/>
      {showFallbackText && (
        <>
          <text x="50" y="80" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#064e3b">ESTD 1990</text>
          <text x="50" y="87" textAnchor="middle" fontSize="5" fontWeight="600" fill="#64748b">EIIN: 106644</text>
        </>
      )}
    </svg>
  );
}
