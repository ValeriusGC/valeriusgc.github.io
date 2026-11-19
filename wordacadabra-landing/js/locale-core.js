/**
 * Канон локалей и путей к медиа (без DOM).
 */
export const SUPPORTED_LOCALES = [
  'en', 'es', 'de', 'fr', 'pt-BR', 'it', 'pl', 'cs', 'ro', 'ru',
];
export const DEFAULT_LOCALE = 'en';
export const STORAGE_KEY = 'wordacadabra-lang';

/** Декоративные флаги (не меняются с локалью UI). */
export const LANG_FLAGS = {
  en: '🇬🇧',
  es: '🇪🇸',
  de: '🇩🇪',
  fr: '🇫🇷',
  'pt-BR': '🇧🇷',
  it: '🇮🇹',
  pl: '🇵🇱',
  cs: '🇨🇿',
  ro: '🇷🇴',
  ru: '🇷🇺',
};

/** Короткий код для подписи в списке (EN, PT, …). */
export function langCodeShort(locale) {
  if (locale === 'pt-BR') return 'PT';
  return locale.toUpperCase();
}

/** Ключ в JSON переводов для названия языка. */
export function langNameKey(locale) {
  return locale === 'pt-BR' ? 'langName_pt_BR' : `langName_${locale}`;
}

export function normalizeLocale(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (s.toLowerCase() === 'pt-br') return 'pt-BR';
  return SUPPORTED_LOCALES.includes(s) ? s : null;
}

/** @param {string} locale */
export function resolveLocaleMedia(locale) {
  const base = `/assets/locales/${locale}`;
  return {
    heroVideo: `${base}/hero.mp4`,
    heroPoster: `${base}/hero-poster.webp`,
    screens: [1, 2, 3].map((n) => `${base}/screen-${n}.webp`),
  };
}

/** Меняется при правках locales/*.json (см. build-info.json localesVersion). */
let _localeJsonVersion = '';

export async function initLocaleBundleVersion() {
  if (_localeJsonVersion) return _localeJsonVersion;
  try {
    const res = await fetch('/build-info.json', { cache: 'no-store' });
    if (res.ok) {
      const info = await res.json();
      _localeJsonVersion = String(info.localesVersion ?? info.build ?? '');
    }
  } catch {
    /* ignore */
  }
  if (!_localeJsonVersion) _localeJsonVersion = '1';
  return _localeJsonVersion;
}

export function localeJsonUrl(locale) {
  const q = _localeJsonVersion ? `?v=${encodeURIComponent(_localeJsonVersion)}` : '';
  return `/locales/${locale}.json${q}`;
}

/** Запасные подписи (EN), если JSON устарел в кэше. */
export const FALLBACK_LANG_NAMES = {
  en: 'English',
  es: 'Spanish',
  de: 'German',
  fr: 'French',
  'pt-BR': 'Portuguese (Brazil)',
  it: 'Italian',
  pl: 'Polish',
  cs: 'Czech',
  ro: 'Romanian',
  ru: 'Russian',
};

export function resolveLangDisplayName(strings, loc) {
  const key = langNameKey(loc);
  const fromBundle = strings?.[key];
  if (typeof fromBundle === 'string' && fromBundle.trim()) return fromBundle.trim();
  return FALLBACK_LANG_NAMES[loc] ?? langCodeShort(loc);
}

export function assertLangNameKeys(strings, uiLocale) {
  const missing = SUPPORTED_LOCALES.filter((loc) => {
    const v = strings?.[langNameKey(loc)];
    return typeof v !== 'string' || !v.trim();
  });
  if (missing.length) {
    console.warn(`[i18n] ${uiLocale}: missing lang names for`, missing.join(', '));
  }
}