# The Change Embassy — Website

Production-ready static website for The Change Embassy church.

---

## Project Structure

```
tce-website/
├── index.html               ← Main page
├── assets/
│   ├── css/
│   │   └── styles.css       ← All styles (design tokens → components → responsive)
│   ├── js/
│   │   └── main.js          ← All scripts (IIFE-wrapped, no globals except intentional)
│   └── images/              ← All image assets (rename guide below)
└── README.md
```

---

## Image Rename Guide

Copy images from your original `assets/images/` folder into `assets/images/` using these
standardised, lowercase, hyphenated filenames:

| Original filename              | Rename to                      |
|-------------------------------|-------------------------------|
| `background.png`              | `background.png`              |
| `can't wait to meet you.png`  | `cant-wait-to-meet-you.png`   |
| `LOGO with text.png`          | `logo-with-text.png`          |
| `mandate1.png`                | `mandate1.png`                |
| `mandate2.png`                | `mandate2.png`                |
| `marriage enrichment.png`     | `marriage-enrichment.png`     |
| `Medical outreach.png`        | `medical-outreach.png`        |
| `OFFERING.jpg.jpeg`           | `offering.jpg`                |
| `pastor 3.png`                | `pastor3.png`                 |
| `pastor1.png`                 | `pastor1.png`                 |
| `pastor2.png`                 | `pastor2.png`                 |
| `prophetic shift.png`         | `prophetic-shift.png`         |
| `school of ministry.png`      | `school-of-ministry.png`      |

> **Tip (macOS/Linux):** Run from your original images folder:
> ```bash
> cp "can't wait to meet you.png" cant-wait-to-meet-you.png
> cp "LOGO with text.png"         logo-with-text.png
> cp "marriage enrichment.png"    marriage-enrichment.png
> cp "Medical outreach.png"       medical-outreach.png
> cp "OFFERING.jpg.jpeg"          offering.jpg
> cp "pastor 3.png"               pastor3.png
> cp "prophetic shift.png"        prophetic-shift.png
> cp "school of ministry.png"     school-of-ministry.png
> ```

---

## What Changed (vs. the original monolithic file)

### Files split
| Concern       | Old                          | New                          |
|---------------|------------------------------|------------------------------|
| HTML          | `the-change-embassy.html`    | `index.html`                 |
| CSS           | `<style>` block (635 lines)  | `assets/css/styles.css`      |
| JavaScript    | `<script>` block (113 lines) | `assets/js/main.js`          |

### HTML improvements
- `<script>` moved to bottom with `defer` (no render-blocking JS)
- `<meta name="description">` added for SEO
- `<link rel="preconnect">` for Google Fonts (faster font load)
- All `onclick="…"` on nav/buttons kept minimal; logic lives in `main.js`
- `aria-label`, `role`, `aria-expanded` added throughout for accessibility
- `loading="lazy"` and explicit `width`/`height` on all `<img>` tags (prevents layout shift)
- `<p>` tags used properly instead of bare text in `event-card-desc`, `resource-desc`, etc.
- `&amp;` used correctly in place of bare `&` in HTML text

### CSS improvements
- Duplicate `gap:` declarations removed (e.g. mandate-top had two `gap:` lines)
- Duplicate `:root {}` block for events vars merged into the single root block
- All image paths updated to `../images/<kebab-case-name>.png`
- No functional style changes — pixel-perfect to the original

### JS improvements
- Everything wrapped in an IIFE (`(function(){ 'use strict'; … }())`) — no global pollution
- `window.toggleMobileMenu` and `window.toggleFaq` explicitly exported (needed for inline handlers)
- `observer.unobserve(el)` added so scroll animations fire only once (performance)
- Countdown guard for `diff <= 0` shows `00` instead of negative numbers
- `{ passive: true }` on scroll listener (better performance on mobile)

### Image naming
- All filenames normalised to lowercase, hyphenated (no spaces, no uppercase, no double extensions)

---

## Deployment

This is a plain static site — no build step required. Deploy the entire `tce-website/` folder
to any static host (Netlify, Vercel, GitHub Pages, cPanel file manager, etc.).

If you want smaller production assets, run the optional PowerShell helper:

```powershell
.\build-minify.ps1
```

That script generates `assets/css/styles.min.css` and `assets/js/main.min.js` from the
existing source files. If ImageMagick is installed, it can also convert a few large PNG/JPG
assets to WebP.

Make sure `assets/images/` contains all renamed images before deploying.
