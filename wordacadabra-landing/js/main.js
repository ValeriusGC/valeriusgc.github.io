import {
  DEFAULT_LOCALE,
  STORAGE_KEY,
  initLocaleBundleVersion,
  normalizeLocale,
} from './locale-core.js';
import { applyTextToDom, loadTranslationMap, updateLangSelect } from './i18n.js';
import { applyLocaleMedia, prepareLocaleMedia } from './media.js';

/** @type {string} */
let activeLocale = DEFAULT_LOCALE;
/** @type {number} */
let switchGeneration = 0;

/**
 * Готовит и атомарно применяет локаль. При ошибке оставляет предыдущую.
 * @param {string} locale
 */
async function setLanguage(locale) {
  const normalized = normalizeLocale(locale);
  if (!normalized || normalized === activeLocale) return;
  const gen = ++switchGeneration;
  try {
    await initLocaleBundleVersion();
    const [strings, paths] = await Promise.all([
      loadTranslationMap(normalized),
      prepareLocaleMedia(normalized),
    ]);
    if (gen !== switchGeneration) return;
    document.documentElement.lang = normalized;
    applyTextToDom(strings);
    updateLangSelect(strings, normalized);
    applyLocaleMedia(paths);
    activeLocale = normalized;
    localStorage.setItem(STORAGE_KEY, normalized);
  } catch (err) {
    if (gen === switchGeneration) {
      console.error('locale switch failed', normalized, err);
      const select = document.getElementById('langSelect');
      if (select) select.value = activeLocale;
    }
  }
}

function initLangSwitcher() {
  const select = document.getElementById('langSelect');
  if (!select) return;
  select.addEventListener('change', () => {
    if (select.value !== activeLocale) setLanguage(select.value);
  });
}

/** Слушатели сразу — не ждём тяжёлой предзагрузки hero. */
initLangSwitcher();

async function boot() {
  await initLocaleBundleVersion();
  const stored = normalizeLocale(localStorage.getItem(STORAGE_KEY)) ?? DEFAULT_LOCALE;
  activeLocale = DEFAULT_LOCALE;
  switchGeneration++;
  const gen = switchGeneration;
  try {
    const [strings, paths] = await Promise.all([
      loadTranslationMap(stored),
      prepareLocaleMedia(stored),
    ]);
    if (gen !== switchGeneration) return;
    document.documentElement.lang = stored;
    applyTextToDom(strings);
    updateLangSelect(strings, stored);
    applyLocaleMedia(paths);
    activeLocale = stored;
  } catch (e) {
    console.error('boot failed, falling back to en', e);
    if (gen !== switchGeneration) return;
    const strings = await loadTranslationMap(DEFAULT_LOCALE);
    const paths = await prepareLocaleMedia(DEFAULT_LOCALE);
    document.documentElement.lang = DEFAULT_LOCALE;
    applyTextToDom(strings);
    updateLangSelect(strings, DEFAULT_LOCALE);
    applyLocaleMedia(paths);
    activeLocale = DEFAULT_LOCALE;
  }
}

boot().catch((e) => console.error('boot failed', e));