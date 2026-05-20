# Bible KJV Reader

Static, offline-friendly Bible reader built with Vanilla JS + Tailwind CSS.  
Bible text sourced from [aruljohn/Bible-kjv](https://github.com/aruljohn/Bible-kjv) (MIT License) via jsDelivr CDN.

## Features

| Feature | Details |
|---|---|
| 66 books | Full KJV — fetched on demand from CDN |
| Notes | Click verse number or double-click any verse — 5 highlight colours |
| Progress | Per-book chapter progress bar (stored in localStorage) |
| Continue | Header button resumes last read position |
| Search | Current chapter or current book full-text search |
| Copy | Copies `Book Ch:V — "text" (KJV)` to clipboard |
| Font | Size (12–30 px) + family (Sans / Georgia / Palatino) |
| Dark mode | Toggle in header, saved between sessions |
| Responsive | Mobile-first, works on all screen sizes |

## Keyboard Shortcuts

| Key | Action |
|---|---|
| `Alt + ←` | Previous chapter |
| `Alt + →` | Next chapter |
| `Esc` | Close any open modal / panel |

## Project Structure

```
/
├── index.html          — single-page app shell + all CSS
├── script.js           — all application logic (modular functions)
└── data/
    └── books.json      — 66-book metadata (name, file, testament, chapter count)
```

Bible JSON files are **not** stored locally — they are fetched at runtime from:  
`https://cdn.jsdelivr.net/gh/aruljohn/Bible-kjv@master/<BookName>.json`

Fetched books are cached in memory for the session, so each book is downloaded at most once.

## localStorage Keys

| Key | Contents |
|---|---|
| `bible_notes` | `{ "1 John 1:3": { text, color, savedAt } }` |
| `bible_progress` | `{ "Genesis": { "1": true, "3": true } }` |
| `bible_last_read` | `{ bookName, file, chapter }` |
| `bible_settings` | `{ theme, fontSize, fontFamily }` |

---

## Local Development

No build step required. Serve the project root with any static file server:

```bash
# Python
python3 -m http.server 8080

# Node (npx)
npx serve .

# VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

Then open `http://localhost:8080` in your browser.

> **Why a server?** The `fetch('./data/books.json')` call requires HTTP — opening `index.html` directly as a `file://` URL will be blocked by CORS.

---

## GitHub Pages Deploy

### Option A — Deploy from the repository root (simplest)

1. Push the project to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

2. Go to **Settings → Pages** in your repository.
3. Under *Source*, select **Deploy from a branch**.
4. Choose branch `main`, folder `/ (root)`, then click **Save**.
5. GitHub will provide a URL like `https://YOUR_USERNAME.github.io/YOUR_REPO/`.

### Option B — Deploy with GitHub Actions (recommended for larger projects)

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

Then in **Settings → Pages**, set source to **GitHub Actions**.

---

## Offline / Self-Hosted Mode

If you want all Bible data stored locally (no CDN dependency):

1. Clone the Bible-kjv data repository:
   ```bash
   git clone https://github.com/aruljohn/Bible-kjv.git bible-data
   cp bible-data/*.json data/
   rm -rf bible-data
   ```

2. In `script.js`, change line 7:
   ```js
   // Before
   const DATA_BASE_URL = 'https://cdn.jsdelivr.net/gh/aruljohn/Bible-kjv@master/';
   // After
   const DATA_BASE_URL = './data/';
   ```

3. Commit and push. The app now works fully offline after the first page load.
