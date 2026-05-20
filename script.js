// ============================================================
//  Bible Reader — KJV  |  script.js
//  Data source: github.com/aruljohn/Bible-kjv (MIT)
//  Served via jsDelivr CDN — no local Bible JSON files needed
// ============================================================

// ─── CONFIG ──────────────────────────────────────────────────
const DATA_BASE_URL = 'https://cdn.jsdelivr.net/gh/aruljohn/Bible-kjv@master/';
const BOOKS_META_URL = './data/books.json';

const NOTE_COLORS = {
  blue:   { light: 'rgba(59,130,246,0.18)',  dark: 'rgba(59,130,246,0.30)',  dot: '#3b82f6' },
  green:  { light: 'rgba(34,197,94,0.18)',   dark: 'rgba(34,197,94,0.30)',   dot: '#22c55e' },
  yellow: { light: 'rgba(234,179,8,0.22)',   dark: 'rgba(234,179,8,0.30)',   dot: '#eab308' },
  red:    { light: 'rgba(239,68,68,0.18)',   dark: 'rgba(239,68,68,0.30)',   dot: '#ef4444' },
  purple: { light: 'rgba(168,85,247,0.18)',  dark: 'rgba(168,85,247,0.30)',  dot: '#a855f7' },
};

const FONT_FAMILIES = {
  inter:   "'Inter', system-ui, sans-serif",
  georgia: "Georgia, 'Times New Roman', serif",
  serif:   "'Palatino Linotype', Palatino, serif",
};

const STORAGE_KEYS = {
  notes:    'bible_notes',
  progress: 'bible_progress',
  lastRead: 'bible_last_read',
  settings: 'bible_settings',
};

// ─── STATE ───────────────────────────────────────────────────
const state = {
  books: [],           // full book metadata array
  bookData: null,      // loaded book JSON from CDN
  currentBook: null,   // current book metadata object
  currentChapter: 1,   // 1-indexed chapter number
  searchQuery: '',
  settings: {
    theme: 'light',
    fontSize: 17,
    fontFamily: 'inter',
  },
};

// In-memory cache so each book is fetched at most once per session
const bookCache = {};

// ─── STORAGE ─────────────────────────────────────────────────
const Storage = {
  _get(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  _set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage full */ }
  },

  getNotes()        { return this._get(STORAGE_KEYS.notes)    || {}; },
  getNote(ref)      { return this.getNotes()[ref]              || null; },
  saveNote(ref, d)  { const n = this.getNotes(); n[ref] = d; this._set(STORAGE_KEYS.notes, n); },
  deleteNote(ref)   { const n = this.getNotes(); delete n[ref]; this._set(STORAGE_KEYS.notes, n); },

  getProgress()                 { return this._get(STORAGE_KEYS.progress) || {}; },
  markChapterRead(book, ch)     {
    const p = this.getProgress();
    if (!p[book]) p[book] = {};
    p[book][String(ch)] = true;
    this._set(STORAGE_KEYS.progress, p);
  },
  chaptersRead(book)            { return Object.keys((this.getProgress()[book]) || {}).length; },

  getLastRead()                           { return this._get(STORAGE_KEYS.lastRead); },
  setLastRead(bookName, file, chapter)    { this._set(STORAGE_KEYS.lastRead, { bookName, file, chapter }); },

  getSettings()   { return { ...state.settings, ...(this._get(STORAGE_KEYS.settings) || {}) }; },
  saveSettings()  { this._set(STORAGE_KEYS.settings, state.settings); },
};

// ─── DATA LOADING ────────────────────────────────────────────
async function loadBooksList() {
  const res = await fetch(BOOKS_META_URL);
  if (!res.ok) throw new Error('Cannot fetch books.json');
  return res.json();
}

async function loadBook(file) {
  if (bookCache[file]) return bookCache[file];
  const res = await fetch(`${DATA_BASE_URL}${file}`);
  if (!res.ok) throw new Error(`Cannot fetch ${file}`);
  const data = await res.json();
  bookCache[file] = data;
  return data;
}

// ─── NAVIGATION ──────────────────────────────────────────────
async function navigateTo(bookMeta, chapter, scrollToVerse = null) {
  // Fetch book data if not already loaded (or different book)
  if (!state.bookData || state.currentBook?.file !== bookMeta.file) {
    showLoading(true);
    try {
      state.bookData = await loadBook(bookMeta.file);
    } catch {
      showToast('Failed to load book. Check your internet connection.', 'error');
      showLoading(false);
      return;
    }
    showLoading(false);
  }

  state.currentBook    = bookMeta;
  state.currentChapter = Math.max(1, Math.min(chapter, state.bookData.chapters.length));

  Storage.markChapterRead(bookMeta.name, state.currentChapter);
  Storage.setLastRead(bookMeta.name, bookMeta.file, state.currentChapter);

  updateContinueBtn();
  renderChapterNav();
  renderProgressBar();
  renderVerses();

  if (scrollToVerse) {
    requestAnimationFrame(() => {
      const el = document.getElementById(`v-${scrollToVerse}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  } else {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
}

function prevChapter() {
  if (state.currentChapter > 1) navigateTo(state.currentBook, state.currentChapter - 1);
}

function nextChapter() {
  const total = state.bookData?.chapters.length || 1;
  if (state.currentChapter < total) navigateTo(state.currentBook, state.currentChapter + 1);
}

function goToChapter(num) {
  navigateTo(state.currentBook, num);
}

// ─── RENDER: CHAPTER NAV ─────────────────────────────────────
function renderChapterNav() {
  const { currentBook: book, currentChapter: ch, bookData } = state;
  const total = bookData.chapters.length;
  const progress = Storage.getProgress()[book.name] || {};

  const pills = bookData.chapters.map(c => {
    const n = parseInt(c.chapter);
    const isCurrent = n === ch;
    const isRead    = !isCurrent && !!progress[String(n)];
    return `<button class="chapter-pill${isCurrent ? ' current' : isRead ? ' read' : ''}"
      onclick="goToChapter(${n})" aria-label="Chapter ${n}" title="Chapter ${n}">${n}</button>`;
  }).join('');

  document.getElementById('chapterNav').innerHTML = `
    <div class="chapter-nav-top">
      <button class="nav-btn" onclick="prevChapter()" ${ch <= 1 ? 'disabled' : ''} aria-label="Previous">&#8592;</button>
      <span class="chapter-title">${book.name} &middot; Chapter ${ch} <span class="chapter-total">/ ${total}</span></span>
      <button class="nav-btn" onclick="nextChapter()" ${ch >= total ? 'disabled' : ''} aria-label="Next">&#8594;</button>
    </div>
    <div class="chapter-pills">${pills}</div>`;
}

// ─── RENDER: PROGRESS BAR ────────────────────────────────────
function renderProgressBar() {
  const { currentBook: book, bookData } = state;
  const total = bookData.chapters.length;
  const read  = Storage.chaptersRead(book.name);
  const pct   = total > 0 ? Math.round((read / total) * 100) : 0;

  document.getElementById('progressContainer').innerHTML = `
    <div class="progress-wrap">
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <span class="progress-label">${pct}% &bull; ${read} / ${total} chapters read</span>
    </div>`;
}

// ─── RENDER: VERSES ──────────────────────────────────────────
function renderVerses() {
  const { bookData, currentBook: book, currentChapter: ch, searchQuery } = state;
  const chData = bookData.chapters[ch - 1];
  if (!chData) return;

  const notes   = Storage.getNotes();
  const isDark  = document.documentElement.classList.contains('dark');
  const query   = searchQuery.toLowerCase().trim();

  document.getElementById('versesContainer').innerHTML = chData.verses.map(v => {
    const ref  = `${book.name} ${ch}:${v.verse}`;
    const note = notes[ref];

    // Background for highlighted verses
    let bgStyle = '';
    if (note?.color && NOTE_COLORS[note.color]) {
      bgStyle = `style="background-color:${NOTE_COLORS[note.color][isDark ? 'dark' : 'light']}"`;
    }

    // Search match highlight
    const safeText = htmlEscape(v.text);
    const displayText = query
      ? safeText.replace(new RegExp(`(${escapeRegex(query)})`, 'gi'), '<mark>$1</mark>')
      : safeText;

    const isMatch = query && v.text.toLowerCase().includes(query);

    return `
      <div class="verse-row${isMatch ? ' search-match' : ''}" id="v-${v.verse}"
           data-ref="${htmlEscape(ref)}" ${bgStyle}
           ondblclick="openNoteModalEl(this)">
        <span class="verse-num" onclick="openNoteModalEl(this.closest('.verse-row'))"
              title="Add / edit note">${v.verse}</span>
        <span class="verse-text">${displayText}</span>
        <button class="copy-btn" onclick="copyVerseEl(this.closest('.verse-row'), event)"
                title="Copy verse" aria-label="Copy verse">${iconCopy()}</button>
        ${note ? `<span class="note-dot" style="background:${NOTE_COLORS[note.color]?.dot || '#888'}"
                        title="${htmlEscape((note.text || '').slice(0, 60))}"></span>` : ''}
      </div>`;
  }).join('');
}

// ─── BOOK MODAL ──────────────────────────────────────────────
function openBookModal() {
  const modal = document.getElementById('bookModal');
  modal.classList.remove('hidden');
  document.getElementById('bookSearchInput').value = '';

  // Reset tabs to OT
  document.querySelectorAll('.testament-tab').forEach((t, i) => t.classList.toggle('active', i === 0));
  renderBookGrid('OT', '');
  document.getElementById('bookSearchInput').focus();
}

function closeBookModal() {
  document.getElementById('bookModal').classList.add('hidden');
}

function renderBookGrid(testament, query) {
  const books = state.books.filter(b => {
    const matchT = testament === 'ALL' || b.testament === testament;
    const matchQ = !query || b.name.toLowerCase().includes(query.toLowerCase());
    return matchT && matchQ;
  });

  const progress = Storage.getProgress();
  const el = document.getElementById('bookListContainer');

  if (!books.length) {
    el.innerHTML = `<p class="empty-msg">No books found</p>`;
    return;
  }

  el.innerHTML = `<div class="book-grid">${books.map(b => {
    const read  = Object.keys(progress[b.name] || {}).length;
    const pct   = read > 0 ? Math.round((read / b.chapters) * 100) : 0;
    const isCur = state.currentBook?.name === b.name;
    return `
      <button class="book-item${isCur ? ' current' : ''}" onclick="selectBook(${b.id})">
        <span class="book-abbr">${b.abbr}</span>
        <span class="book-name">${b.name}</span>
        ${pct > 0 ? `<span class="book-pct">${pct}%</span>` : ''}
      </button>`;
  }).join('')}</div>`;
}

async function selectBook(id) {
  const meta = state.books.find(b => b.id === id);
  if (!meta) return;
  closeBookModal();
  await navigateTo(meta, 1);
}

// ─── NOTE MODAL ──────────────────────────────────────────────
let _noteRef = null;

function openNoteModalEl(el) {
  openNoteModal(el.dataset.ref);
}

function openNoteModal(ref) {
  _noteRef = ref;
  const note = Storage.getNote(ref);

  document.getElementById('noteRef').textContent  = ref;
  document.getElementById('noteText').value       = note?.text || '';

  const selectedColor = note?.color || 'yellow';
  document.querySelectorAll('.color-opt').forEach(el =>
    el.classList.toggle('selected', el.dataset.color === selectedColor)
  );

  document.getElementById('noteDeleteBtn').style.display = note ? '' : 'none';
  document.getElementById('noteModal').classList.remove('hidden');
  document.getElementById('noteText').focus();
}

function closeNoteModal() {
  document.getElementById('noteModal').classList.add('hidden');
  _noteRef = null;
}

function saveNote() {
  if (!_noteRef) return;
  const text  = document.getElementById('noteText').value.trim();
  const color = document.querySelector('.color-opt.selected')?.dataset.color || 'yellow';
  Storage.saveNote(_noteRef, { text, color, savedAt: Date.now() });
  closeNoteModal();
  renderVerses();
  showToast('Note saved');
}

function deleteNote() {
  if (!_noteRef) return;
  if (!confirm('Delete this note?')) return;
  Storage.deleteNote(_noteRef);
  closeNoteModal();
  renderVerses();
  showToast('Note deleted');
}

// ─── SEARCH ──────────────────────────────────────────────────
function toggleSearch() {
  const panel = document.getElementById('searchPanel');
  const opening = panel.classList.contains('hidden');
  panel.classList.toggle('hidden', !opening);
  if (opening) document.getElementById('searchInput').focus();
  else {
    // Clear search when closing
    state.searchQuery = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
    if (state.bookData) renderVerses();
  }
}

function doSearch() {
  const query = document.getElementById('searchInput').value.trim();
  const scope = document.getElementById('searchScope').value; // 'chapter' | 'book'

  state.searchQuery = query;
  if (state.bookData) renderVerses();

  if (!query || !state.bookData) {
    document.getElementById('searchResults').innerHTML = '';
    return;
  }

  const chapters = scope === 'chapter'
    ? [state.bookData.chapters[state.currentChapter - 1]]
    : state.bookData.chapters;

  const results = [];
  chapters.forEach(ch => {
    const chNum = parseInt(ch.chapter);
    ch.verses.forEach(v => {
      if (v.text.toLowerCase().includes(query.toLowerCase())) {
        results.push({ chNum, verse: v.verse, text: v.text,
          ref: `${state.currentBook.name} ${chNum}:${v.verse}` });
      }
    });
  });

  renderSearchResults(results, query);
}

function renderSearchResults(results, query) {
  const el = document.getElementById('searchResults');
  if (!results.length) {
    el.innerHTML = `<p class="empty-msg">No results for &ldquo;${htmlEscape(query)}&rdquo;</p>`;
    return;
  }

  const safeQ = escapeRegex(query);
  el.innerHTML = `
    <p class="results-count">${results.length} result${results.length !== 1 ? 's' : ''}</p>
    <div class="result-list">${results.map(r => {
      const hi = htmlEscape(r.text).replace(new RegExp(`(${safeQ})`, 'gi'), '<mark>$1</mark>');
      return `
        <div class="result-item" onclick="navigateTo(state.currentBook, ${r.chNum}, '${r.verse}')">
          <span class="result-ref">${htmlEscape(r.ref)}</span>
          <span class="result-text">${hi}</span>
        </div>`;
    }).join('')}</div>`;
}

// ─── COPY VERSE ──────────────────────────────────────────────
function copyVerseEl(row, event) {
  event.stopPropagation();
  const ref    = row.dataset.ref;                   // "1 John 1:3"
  const vNum   = ref.split(':')[1];                 // "3"
  const chData = state.bookData.chapters[state.currentChapter - 1];
  const verse  = chData?.verses.find(v => v.verse === vNum);
  if (!verse) return;

  const text = `${ref} — "${verse.text}" (KJV)`;
  navigator.clipboard?.writeText(text)
    .then(() => showToast('Verse copied!'))
    .catch(() => showToast('Copy failed', 'error'));
}

// ─── SETTINGS ────────────────────────────────────────────────
function applySettings() {
  const { theme, fontSize, fontFamily } = state.settings;

  // Theme
  document.documentElement.classList.toggle('dark', theme === 'dark');
  const themeIcon = theme === 'dark' ? iconMoon() : iconSun();
  document.getElementById('themeToggleBtn').innerHTML = themeIcon;

  // Font size
  const container = document.getElementById('versesContainer');
  container.style.fontSize   = `${fontSize}px`;
  document.getElementById('fontSizeDisplay').textContent = `${fontSize}px`;

  // Font family
  container.style.fontFamily = FONT_FAMILIES[fontFamily] || FONT_FAMILIES.inter;
  document.querySelectorAll('.font-family-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.family === fontFamily)
  );

  Storage.saveSettings();
}

function toggleDarkMode() {
  state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
  applySettings();
  if (state.bookData) renderVerses(); // refresh note highlight colors
}

function changeFontSize(delta) {
  state.settings.fontSize = Math.max(12, Math.min(30, state.settings.fontSize + delta));
  applySettings();
}

function setFontFamily(family) {
  if (!FONT_FAMILIES[family]) return;
  state.settings.fontFamily = family;
  applySettings();
}

// ─── CONTINUE BUTTON ─────────────────────────────────────────
function updateContinueBtn() {
  const last = Storage.getLastRead();
  const btn  = document.getElementById('continueBtn');
  if (!last) { btn.classList.add('hidden'); return; }
  btn.classList.remove('hidden');
  btn.querySelector('.continue-label').textContent = `${last.bookName} ${last.chapter}`;
  btn.title = `Continue: ${last.bookName} Chapter ${last.chapter}`;
}

async function continueReading() {
  const last = Storage.getLastRead();
  if (!last) return;
  const meta = state.books.find(b => b.file === last.file || b.name === last.bookName);
  if (meta) await navigateTo(meta, last.chapter);
}

// ─── LOADING & TOAST ─────────────────────────────────────────
function showLoading(visible) {
  document.getElementById('loadingOverlay').classList.toggle('visible', visible);
}

function showToast(msg, type = 'success') {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className   = `toast show${type === 'error' ? ' error' : ''}`;
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2600);
}

// ─── UTILITIES ───────────────────────────────────────────────
function htmlEscape(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ─── INLINE SVG ICONS ────────────────────────────────────────
function iconCopy() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
}
function iconSun() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <circle cx="12" cy="12" r="5"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
}
function iconMoon() {
  return `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
}
function iconSearch() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>`;
}
function iconBook() {
  return `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`;
}

// ─── INIT ────────────────────────────────────────────────────
async function init() {
  // Apply saved settings
  state.settings = Storage.getSettings();
  applySettings();

  // Set icon-only buttons that JS renders
  document.getElementById('searchToggleBtn').innerHTML = `${iconSearch()} Search`;
  document.getElementById('bookSelectBtn').innerHTML   = `${iconBook()} Select Book`;

  // Load books metadata
  try {
    state.books = await loadBooksList();
  } catch {
    showToast('Failed to load books list', 'error');
    return;
  }

  updateContinueBtn();

  // ── Book modal wiring ──
  document.getElementById('bookSearchInput').addEventListener('input', e => {
    const active = document.querySelector('.testament-tab.active')?.dataset.testament || 'OT';
    renderBookGrid(active, e.target.value);
  });
  document.querySelectorAll('.testament-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.testament-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderBookGrid(tab.dataset.testament, document.getElementById('bookSearchInput').value);
    });
  });
  document.getElementById('bookModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeBookModal();
  });

  // ── Note modal wiring ──
  document.getElementById('noteModal').addEventListener('click', e => {
    if (e.target === e.currentTarget) closeNoteModal();
  });
  document.querySelectorAll('.color-opt').forEach(el => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.color-opt').forEach(c => c.classList.remove('selected'));
      el.classList.add('selected');
    });
  });

  // ── Search wiring ──
  document.getElementById('searchInput').addEventListener('input', doSearch);
  document.getElementById('searchScope').addEventListener('change', doSearch);

  // ── Keyboard shortcuts ──
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!document.getElementById('noteModal').classList.contains('hidden'))  { closeNoteModal();  return; }
      if (!document.getElementById('bookModal').classList.contains('hidden'))  { closeBookModal();  return; }
      if (!document.getElementById('searchPanel').classList.contains('hidden')){ toggleSearch();    return; }
    }
    if (e.altKey && e.key === 'ArrowLeft')  prevChapter();
    if (e.altKey && e.key === 'ArrowRight') nextChapter();
  });

  // ── Load last-read position or default to Genesis ──
  const last     = Storage.getLastRead();
  const startMeta = last
    ? (state.books.find(b => b.file === last.file || b.name === last.bookName) || state.books[0])
    : state.books[0];
  const startCh  = last?.chapter || 1;

  await navigateTo(startMeta, startCh);
}

document.addEventListener('DOMContentLoaded', init);
