# Wordacadabra landing — first working version

Static, responsive product landing with real app media and English / Russian / Spanish copy.

## Preview

Run in this directory:

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080. No build tools or dependencies required. The Google Fonts import is optional; system font fallbacks work offline.

## Assets

- `assets/hero.mp4`: real app gameplay, ~11 seconds, loop (not seamlessly edited)
- `assets/poster.jpg`: still frame from real gameplay
- `assets/logo.webp`: approved WA mark for the landing only
- `assets/mix.webp`, `album.webp`, `packs.webp`, `phone.webp`, `tablet.webp`: real app screenshots

## Release checklist

- Add verified store URLs only when ready; no placeholder purchase buttons are presented as live.
- Review Spanish and Russian marketing translations.
- Consider locale-specific screenshots/video in a later iteration.
- Check accessibility, responsive layout and autoplay on target devices.
- Replace optional Google Fonts import with self-hosted font assets if a fully offline site is required.
