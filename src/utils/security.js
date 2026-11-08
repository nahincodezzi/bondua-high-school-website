/**
 * Cryptographic security utilities for School ERP
 * Implements PBKDF2 with 10,000 iterations & unique per-user salt (BUG 4 fix)
 * Backwards-compatible with v2 salted SHA-256 and legacy unsalted SHA-256
 */

const SYSTEM_PEPPER = 'bdhs_secure_pepper_2026_enterprise_v2';

export async function hashPasswordPbkdf2(plainPassword, userSalt = '') {
  if (!plainPassword) return '';
  const cryptoObj = (typeof window !== 'undefined' && window.crypto && window.crypto.subtle)
    ? window.crypto
    : (typeof crypto !== 'undefined' && crypto.subtle ? crypto : null);

  const enc = new TextEncoder();
  const effectiveSalt = userSalt ? `salt_user_${userSalt.toLowerCase()}` : SYSTEM_PEPPER;

  if (cryptoObj?.subtle) {
    try {
      const keyMaterial = await cryptoObj.subtle.importKey(
        'raw',
        enc.encode(plainPassword),
        { name: 'PBKDF2' },
        false,
        ['deriveBits']
      );
      const derived = await cryptoObj.subtle.deriveBits(
        {
          name: 'PBKDF2',
          salt: enc.encode(effectiveSalt),
          iterations: 10000,
          hash: 'SHA-256'
        },
        keyMaterial,
        256
      );
      const hashArray = Array.from(new Uint8Array(derived));
      return `pbkdf2$10k$` + hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toLowerCase();
    } catch {}
  }

  return hashPassword(plainPassword, effectiveSalt);
}

// Pure legacy unsalted hasher for seamless backward compatibility
async function hashLegacyUnsalted(plainPassword) {
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

  let hash = 0;
  for (let i = 0; i < plainPassword.length; i++) {
    const char = plainPassword.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `fallback-${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

export async function hashPassword(plainPassword, salt = '') {
  if (!plainPassword) return '';

  const effectiveSalt = salt || SYSTEM_PEPPER;
  const combined = `salt:${effectiveSalt}:${plainPassword}`;

  const cryptoObj = (typeof window !== 'undefined' && window.crypto && window.crypto.subtle)
    ? window.crypto
    : (typeof crypto !== 'undefined' && crypto.subtle ? crypto : null);

  if (cryptoObj?.subtle) {
    const msgUint8 = new TextEncoder().encode(combined);
    const hashBuffer = await cryptoObj.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return `v2$${hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toLowerCase()}`;
  }

  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `v2-fb-${Math.abs(hash).toString(16).padStart(8, '0')}`;
}

export async function verifyPassword(inputPassword, storedCredential, username = '') {
  if (!inputPassword || !storedCredential) return false;

  const target = storedCredential.trim().toLowerCase();

  // 1. Verify modern PBKDF2 hash (10,000 rounds with per-user salt)
  if (target.startsWith('pbkdf2$')) {
    const pbkdf2WithUser = await hashPasswordPbkdf2(inputPassword, username);
    if (pbkdf2WithUser.toLowerCase() === target) return true;

    const pbkdf2Default = await hashPasswordPbkdf2(inputPassword, '');
    if (pbkdf2Default.toLowerCase() === target) return true;
  }

  // 2. Verify salted SHA-256 hash (v2$)
  if (target.startsWith('v2$') || target.startsWith('v2-fb-')) {
    const saltedWithUsername = await hashPassword(inputPassword, username || SYSTEM_PEPPER);
    if (saltedWithUsername.toLowerCase() === target) return true;

    const saltedDefault = await hashPassword(inputPassword, SYSTEM_PEPPER);
    if (saltedDefault.toLowerCase() === target) return true;
  }

  // 3. Backward compatibility with legacy unsalted SHA-256
  const legacyHash = await hashLegacyUnsalted(inputPassword);
  if (legacyHash.toLowerCase() === target) return true;

  // 4. Fallback direct match if plain string (dev legacy)
  return inputPassword === storedCredential;
}
