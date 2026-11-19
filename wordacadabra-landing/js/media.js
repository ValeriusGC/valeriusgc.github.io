import { resolveLocaleMedia } from './locale-core.js';

function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = () => reject(new Error(`image failed: ${url}`));
    img.src = url;
  });
}

function preloadVideo(url) {
  return new Promise((resolve, reject) => {
    const v = document.createElement('video');
    v.preload = 'metadata';
    const fail = () => reject(new Error(`video failed: ${url}`));
    const timer = setTimeout(fail, 25000);
    const done = (ok) => {
      clearTimeout(timer);
      v.removeAttribute('src');
      v.load();
      ok ? resolve(url) : fail();
    };
    v.addEventListener('loadedmetadata', () => done(true), { once: true });
    v.addEventListener('error', () => done(false), { once: true });
    v.src = url;
  });
}

/**
 * Загружает медиа будущей локали; при ошибке — reject.
 * @param {string} locale
 */
export async function prepareLocaleMedia(locale) {
  const paths = resolveLocaleMedia(locale);
  const urls = [paths.heroPoster, ...paths.screens, paths.heroVideo];
  await Promise.all(urls.map((u) => (u.endsWith('.mp4') ? preloadVideo(u) : preloadImage(u))));
  return paths;
}

/**
 * @param {ReturnType<typeof resolveLocaleMedia>} paths
 */
export function applyLocaleMedia(paths) {
  const cards = document.querySelectorAll('#mixes .card img');
  const video = document.getElementById('heroVideo');
  if (!video) throw new Error('hero video missing');
  video.pause();
  video.poster = paths.heroPoster;
  const source = video.querySelector('source');
  if (source) source.src = paths.heroVideo;
  else video.src = paths.heroVideo;
  video.load();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    video.removeAttribute('autoplay');
    video.pause();
    video.setAttribute('controls', '');
  } else {
    video.setAttribute('autoplay', '');
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.play().catch(() => {});
  }
  paths.screens.forEach((src, i) => {
    if (cards[i]) cards[i].src = src;
  });
}