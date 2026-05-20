# Padros' Kutsal Kitap

**A clean, distraction-free reader for the KJV Bible and the Quran — no install, no build, pure web.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-padrosum.github.io-4a7c59?style=flat-square&logo=github)](https://padrosum.github.io/kutsalkitap)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue?style=flat-square)](LICENSE)
[![HTML](https://img.shields.io/badge/Built%20with-HTML%20%2B%20Vanilla%20JS-orange?style=flat-square)](index.html)

---

## Features

### Two sacred texts, one interface

| | Bible (KJV) | Kur'an-ı Kerim |
|---|---|---|
| **Content** | 66 books, full King James Version | 114 surahs, Elmalılı Hamdi Yazır Turkish translation |
| **Source** | [aruljohn/Bible-kjv](https://github.com/aruljohn/Bible-kjv) via jsDelivr | [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api) |
| **Navigation** | Book → Chapter | Surah picker |
| **Search scope** | Current chapter or full book | Current surah or full Quran |

### Reader experience

- **Verse notes** — click a verse number (or double-click anywhere on a verse) to add a note with 5 highlight colours: blue, green, yellow, red, purple
- **Reading progress** — per-book/surah progress bar; read chapters are visually marked in the chapter picker
- **Continue reading** — header button jumps straight back to where you left off
- **Full-text search** — live highlighting in both results list and the open chapter
- **Copy verse** — copies `Reference — "text" (KJV / Elmalılı Hamdi Yazır)` to clipboard
- **Font controls** — size (12–30 px, adjustable in 1 px steps) and three font families (Inter, Georgia, Palatino)
- **Dark mode** — toggle in the header; preference persisted across sessions
- **Keyboard shortcuts** — see table below
- **Mobile-first** — fully responsive layout, works on phones and tablets

### Keyboard shortcuts

| Key | Action |
|---|---|
| `Alt + ←` | Previous chapter / surah |
| `Alt + →` | Next chapter / surah |
| `Esc` | Close modal or search panel |

---

## Tech stack

| Layer | Choice |
|---|---|
| Markup | Plain HTML5 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) via CDN + hand-written CSS variables for theming |
| Logic | Vanilla JavaScript (ES2020+), no framework |
| Data | Fetched at runtime from jsDelivr CDN; cached in memory per session |
| Persistence | `localStorage` (notes, progress, last-read position, display settings) |
| Build step | **None** |

---

## Project structure

```
kutsalkitap/
├── index.html       — single-page shell + all CSS
├── script.js        — all application logic (~790 lines)
└── data/
    └── books.json   — 66-book metadata (name, abbreviation, testament, chapter count)
```

Bible JSON files are **not** bundled — they are fetched on demand:  
`https://cdn.jsdelivr.net/gh/aruljohn/Bible-kjv@master/<BookName>.json`

Each book is downloaded at most once per session (cached in memory).

---

## localStorage schema

| Key | Value |
|---|---|
| `bible_notes` | `{ "John 3:16": { text, color, savedAt } }` |
| `bible_progress` | `{ "Genesis": { "1": true, "5": true } }` |
| `bible_last_read` | `{ bookName, file, chapter }` |
| `bible_settings` | `{ theme, fontSize, fontFamily }` |
| `quran_notes` | same shape as `bible_notes` |
| `quran_progress` | same shape as `bible_progress` |
| `quran_last_read` | `{ bookName, chapter }` |
| `app_mode` | `"bible"` \| `"quran"` |

---

## Running locally

No build step required. Serve the project root with any static server:

```bash
# Python
python3 -m http.server 8080

# Node
npx serve .

# VS Code
# Install "Live Server" → right-click index.html → Open with Live Server
```

Then open `http://localhost:8080`.

> **Why a server?** `fetch('./data/books.json')` is blocked by the browser when opened as a `file://` URL (CORS restriction). Any HTTP server, even a local one, works fine.

---

## Deploying to GitHub Pages

### Option A — branch deploy (simplest)

1. Push to GitHub.
2. Go to **Settings → Pages**.
3. Under *Source*, choose **Deploy from a branch**, select `main` / `(root)`, click **Save**.
4. Your app will be live at `https://<username>.github.io/<repo>/`.

### Option B — GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: .
      - id: deployment
        uses: actions/deploy-pages@v4
```

Then set **Settings → Pages → Source** to **GitHub Actions**.

---

## Offline / self-hosted mode

To remove the CDN dependency and bundle all Bible data locally:

```bash
git clone https://github.com/aruljohn/Bible-kjv.git _tmp
cp _tmp/*.json data/
rm -rf _tmp
```

Then change line 6 of `script.js`:

```js
// Before
const DATA_BASE_URL = 'https://cdn.jsdelivr.net/gh/aruljohn/Bible-kjv@master/';

// After
const DATA_BASE_URL = './data/';
```

The app will now work fully offline after the first page load.

---

## Data sources & credits

| Source | License |
|---|---|
| [aruljohn/Bible-kjv](https://github.com/aruljohn/Bible-kjv) — KJV Bible JSON | MIT |
| [fawazahmed0/quran-api](https://github.com/fawazahmed0/quran-api) — Quran editions API | Unlicense |
| Elmalılı Hamdi Yazır Meali — Quran translation used | Public domain |

---

## License

This project is licensed under the **GNU General Public License v3.0** — see [LICENSE](LICENSE) for details.
