import {
  DEFAULT_LOCALE,
  LANG_FLAGS,
  SUPPORTED_LOCALES,
  assertLangNameKeys,
  langCodeShort,
  localeJsonUrl,
  normalizeLocale,
  resolveLangDisplayName,
} from './locale-core.js';

/**
 * @param {string} locale
 * @returns {Promise<Record<string, string>>}
 */
export async function loadTranslationMap(locale) {
  const code = normalizeLocale(locale) ?? DEFAULT_LOCALE;
  const res = await fetch(localeJsonUrl(code));
  if (!res.ok) throw new Error(`locale fetch failed: ${code}`);
  const data = await res.json();
  assertLangNameKeys(data, code);
  return data;
}

/**
 * @param {Record<string, string>} strings
 */
export function applyTextToDom(strings) {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (key && strings[key]) el.textContent = strings[key];
  });
  const title = `${strings.heroA ?? ''} ${strings.heroB ?? ''}`.trim();
  if (title) document.title = `Wordacadabra — ${title}`;
  const desc = strings.mixDesc;
  if (desc) {
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', desc);
  }
  const video = document.getElementById('heroVideo');
  if (video && strings.live) video.setAttribute('aria-label', strings.live);
}

/**
 * Заполняет выпадающий список языков: код + название на текущем языке UI.
 * @param {Record<string, string>} strings
 * @param {string} activeLocale
 */
export function updateLangSelect(strings, activeLocale) {
  const select = document.getElementById('langSelect');
  if (!select) return;
  if (strings.langMenuLabel) {
    select.setAttribute('aria-label', strings.langMenuLabel);
  }
  const prev = select.value;
  select.replaceChildren();
  for (const loc of SUPPORTED_LOCALES) {
    const opt = document.createElement('option');
    opt.value = loc;
    const name = resolveLangDisplayName(strings, loc);
    const flag = LANG_FLAGS[loc] ?? '';
    opt.textContent = flag ? `${flag} ${langCodeShort(loc)} — ${name}` : `${langCodeShort(loc)} — ${name}`;
    if (loc === activeLocale) opt.selected = true;
    select.appendChild(opt);
  }
  if (prev && prev !== activeLocale) select.value = activeLocale;
}