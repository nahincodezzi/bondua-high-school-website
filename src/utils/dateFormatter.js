/**
 * Date and Numeral formatting utilities for Bondua Daulatpur High School
 * Complies with Bengali (Bangla) standard typography and Asia/Dhaka timezone
 */

const BANGLA_MONTHS = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

const BANGLA_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const ENGLISH_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

/**
 * Converts English digits (0-9) to Bangla numerals (০-৯)
 */
export function toBanglaNumerals(input) {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[0-9]/g, d => BANGLA_DIGITS[d]);
}

/**
 * Converts Bangla numerals (০-৯) to English digits (0-9)
 */
export function toEnglishNumerals(input) {
  if (input === null || input === undefined) return '';
  return String(input).replace(/[০-৯]/g, d => {
    const idx = BANGLA_DIGITS.indexOf(d);
    return idx !== -1 ? ENGLISH_DIGITS[idx] : d;
  });
}

/**
 * Formats a date string (YYYY-MM-DD) into full localized date
 * Example: '2026-10-25' -> '২৫ অক্টোবর ২০২৬' (bn) or '25 Oct 2026' (en)
 */
export function formatBanglaDate(dateStr, lang = 'bn') {
  if (!dateStr || dateStr === '#') return '';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;

    if (lang === 'bn') {
      const day = toBanglaNumerals(d.getDate());
      const month = BANGLA_MONTHS[d.getMonth()];
      const year = toBanglaNumerals(d.getFullYear());
      return `${day} ${month} ${year}`;
    } else {
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  } catch {
    return dateStr;
  }
}

/**
 * Returns current date in 'YYYY-MM-DD' formatted according to Asia/Dhaka timezone
 * Fixes timezone shift bugs when ISO string UTC rolls back a day
 */
export function getDhakaDateString(date = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Dhaka',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(date);
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

