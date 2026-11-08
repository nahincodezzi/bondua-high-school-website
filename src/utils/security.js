/**
 * Cryptographic security utilities for Bondua Daulatpur High School
 * Uses native Web Crypto API (SHA-256) for collision-resistant password hashing
 */

export async function hashPassword(plainPassword) {
  if (!plainPassword) return '';

  const cryptoObj = (typeof window !== 'undefined' && window.crypto && window.crypto.subtle)
    ? window.crypto
    : (typeof crypto !== 'undefined' && crypto.subtle ? crypto : null);

  if (cryptoObj?.subtle) {
    const msgUint8 = new TextEncoder().encode(plainPassword);
    const hashBuffer = await cryptoObj.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toLowerCase();
  }

  // Pure JS fallback if crypto.subtle is unavailable (legacy / non-secure contexts)
  let hash = 0;
  for (let i = 0; i < plainPassword.length; i++) {
    const char = plainPassword.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `fallback-${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

export async function verifyPassword(inputPassword, storedCredential) {
  if (!inputPassword || !storedCredential) return false;
  
  // Hash comparison only (N2: direct-match / 64-char hash bypass eliminated)
  const inputHash = await hashPassword(inputPassword);
  return inputHash.toLowerCase() === storedCredential.toLowerCase();
}
