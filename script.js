// ============================================================
//  Kutsal Kitap — KJV Bible + Kur'an-ı Kerim  |  script.js
// ============================================================

// ─── CONFIG ──────────────────────────────────────────────────
const DATA_BASE_URL  = 'https://cdn.jsdelivr.net/gh/aruljohn/Bible-kjv@master/';
const BOOKS_META_URL = './data/books.json';
const QURAN_API_URL  = 'https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/tur-elmalilihamdiya.min.json';

const QURAN_BOOK = { id: -1, name: "Kur'an-ı Kerim", file: null, chapters: 114 };

const QURAN_SURAHS = [
  { id:   1, name: 'Fatiha'      }, { id:   2, name: 'Bakara'      }, { id:   3, name: "Al-i İmran"  },
  { id:   4, name: 'Nisa'        }, { id:   5, name: 'Maide'       }, { id:   6, name: "En'am"       },
  { id:   7, name: "A'raf"       }, { id:   8, name: 'Enfal'       }, { id:   9, name: 'Tevbe'       },
  { id:  10, name: 'Yunus'       }, { id:  11, name: 'Hud'         }, { id:  12, name: 'Yusuf'       },
  { id:  13, name: "Ra'd"        }, { id:  14, name: 'İbrahim'     }, { id:  15, name: 'Hicr'        },
  { id:  16, name: 'Nahl'        }, { id:  17, name: 'İsra'        }, { id:  18, name: 'Kehf'        },
  { id:  19, name: 'Meryem'      }, { id:  20, name: 'Taha'        }, { id:  21, name: 'Enbiya'      },
  { id:  22, name: 'Hac'         }, { id:  23, name: 'Müminun'     }, { id:  24, name: 'Nur'         },
  { id:  25, name: 'Furkan'      }, { id:  26, name: 'Şuara'       }, { id:  27, name: 'Neml'        },
  { id:  28, name: 'Kasas'       }, { id:  29, name: 'Ankebut'     }, { id:  30, name: 'Rum'         },
  { id:  31, name: 'Lokman'      }, { id:  32, name: 'Secde'       }, { id:  33, name: 'Ahzab'       },
  { id:  34, name: 'Sebe'        }, { id:  35, name: 'Fatır'       }, { id:  36, name: 'Yasin'       },
  { id:  37, name: 'Saffat'      }, { id:  38, name: 'Sad'         }, { id:  39, name: 'Zümer'       },
  { id:  40, name: 'Mümin'       }, { id:  41, name: 'Fussilet'    }, { id:  42, name: 'Şura'        },
  { id:  43, name: 'Zuhruf'      }, { id:  44, name: 'Duhan'       }, { id:  45, name: 'Casiye'      },
  { id:  46, name: 'Ahkaf'       }, { id:  47, name: 'Muhammed'    }, { id:  48, name: 'Fetih'       },
  { id:  49, name: 'Hucurat'     }, { id:  50, name: 'Kaf'         }, { id:  51, name: 'Zariyat'     },
  { id:  52, name: 'Tur'         }, { id:  53, name: 'Necm'        }, { id:  54, name: 'Kamer'       },
  { id:  55, name: 'Rahman'      }, { id:  56, name: 'Vakıa'       }, { id:  57, name: 'Hadid'       },
  { id:  58, name: 'Mücadile'    }, { id:  59, name: 'Haşr'        }, { id:  60, name: 'Mümtehine'   },
  { id:  61, name: 'Saf'         }, { id:  62, name: 'Cuma'        }, { id:  63, name: 'Münafikun'   },
  { id:  64, name: 'Tegabun'     }, { id:  65, name: 'Talak'       }, { id:  66, name: 'Tahrim'      },
  { id:  67, name: 'Mülk'        }, { id:  68, name: 'Kalem'       }, { id:  69, name: 'Hakka'       },
  { id:  70, name: 'Mearic'      }, { id:  71, name: 'Nuh'         }, { id:  72, name: 'Cin'         },
  { id:  73, name: 'Müzzemmil'   }, { id:  74, name: 'Müddessir'   }, { id:  75, name: 'Kıyame'      },
  { id:  76, name: 'İnsan'       }, { id:  77, name: 'Mürselat'    }, { id:  78, name: 'Nebe'        },
  { id:  79, name: 'Naziat'      }, { id:  80, name: 'Abese'       }, { id:  81, name: 'Tekvir'      },
  { id:  82, name: 'İnfitar'     }, { id:  83, name: 'Mutaffifin'  }, { id:  84, name: 'İnşikak'     },
  { id:  85, name: 'Büruc'       }, { id:  86, name: 'Tarık'       }, { id:  87, name: "A'la"        },
  { id:  88, name: 'Gaşiye'      }, { id:  89, name: 'Fecr'        }, { id:  90, name: 'Beled'       },
  { id:  91, name: 'Şems'        }, { id:  92, name: 'Leyl'        }, { id:  93, name: 'Duha'        },
  { id:  94, name: 'İnşirah'     }, { id:  95, name: 'Tin'         }, { id:  96, name: 'Alak'        },
  { id:  97, name: 'Kadir'       }, { id:  98, name: 'Beyyine'     }, { id:  99, name: 'Zilzal'      },
  { id: 100, name: 'Adiyat'      }, { id: 101, name: 'Karia'       }, { id: 102, name: 'Tekasür'     },
  { id: 103, name: 'Asr'         }, { id: 104, name: 'Hümeze'      }, { id: 105, name: 'Fil'         },
  { id: 106, name: 'Kureyş'      }, { id: 107, name: 'Maun'        }, { id: 108, name: 'Kevser'      },
  { id: 109, name: 'Kafirun'     }, { id: 110, name: 'Nasr'        }, { id: 111, name: 'Tebbet'      },
  { id: 112, name: 'İhlas'       }, { id: 113, name: 'Felak'       }, { id: 114, name: 'Nas'         },
];

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
  notes:         'bible_notes',
  progress:      'bible_progress',
  lastRead:      'bible_last_read',
  settings:      'bible_settings',
  quranNotes:    'quran_notes',
  quranProgress: 'quran_progress',
  quranLastRead: 'quran_last_read',
};

// ─── STATE ───────────────────────────────────────────────────
const state = {
  mode: 'bible',       // 'bible' | 'quran'
  books: [],
  bookData: null,
  quranData: null,     // cached quran chapters (all 114, fetched once)
  currentBook: null,
  currentChapter: 1,
  searchQuery: '',
  settings: {
    theme: 'light',
    fontSize: 17,
    fontFamily: 'inter',
  },
};

const bookCache = {};

// ─── STORAGE (mode-aware) ────────────────────────────────────
const Storage = {
  _get(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
  },
  _set(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* storage full */ }
  },

  _notesKey()    { return state.mode === 'quran' ? STORAGE_KEYS.quranNotes    : STORAGE_KEYS.notes;    },
  _progressKey() { return state.mode === 'quran' ? STORAGE_KEYS.quranProgress : STORAGE_KEYS.progress; },
  _lastReadKey() { return state.mode === 'quran' ? STORAGE_KEYS.quranLastRead : STORAGE_KEYS.lastRead;  },

  getNotes()        { return this._get(this._notesKey())    || {}; },
  getNote(ref)      { return this.getNotes()[ref]           || null; },
  saveNote(ref, d)  { const n = this.getNotes(); n[ref] = d; this._set(this._notesKey(), n); },
  deleteNote(ref)   { const n = this.getNotes(); delete n[ref]; this._set(this._notesKey(), n); },

  getProgress()             { return this._get(this._progressKey()) || {}; },
  markChapterRead(book, ch) {
    const p = this.getProgress();
    if (!p[book]) p[book] = {};
    p[book][String(ch)] = true;
    this._set(this._progressKey(), p);
  },
  chaptersRead(book) { return Object.keys((this.getProgress()[book]) || {}).length; },

  getLastRead()                        { return this._get(this._lastReadKey()); },
  setLastRead(bookName, file, chapter) { this._set(this._lastReadKey(), { bookName, file, chapter }); },

  getSettings()  { return { ...state.settings, ...(this._get(STORAGE_KEYS.settings) || {}) }; },
  saveSettings() { this._set(STORAGE_KEYS.settings, state.settings); },
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

async function loadQuranData() {
  const res = await fetch(QURAN_API_URL);
  if (!res.ok) throw new Error('Cannot fetch Quran data');
  const json = await res.json();

  // Group flat verse array by surah number into Bible-compatible format
  const surahMap = {};
  for (const v of json.quran) {
    if (!surahMap[v.chapter]) surahMap[v.chapter] = [];
    surahMap[v.chapter].push({ verse: String(v.verse), text: v.text });
  }

  const chapters = [];
  for (let i = 1; i <= 114; i++) {
    chapters.push({ chapter: String(i), verses: surahMap[i] || [] });
  }
  return { chapters };
}

// ─── HELPERS ─────────────────────────────────────────────────
function getSurahName(num) {
  return QURAN_SURAHS[num - 1]?.name || `Sure ${num}`;
}

function getVerseRef(chNum, verseNum) {
  if (state.mode === 'quran') return `${getSurahName(chNum)} ${chNum}:${verseNum}`;
  return `${state.currentBook.name} ${chNum}:${verseNum}`;
}

// ─── NAVIGATION ──────────────────────────────────────────────
async function navigateTo(bookMeta, chapter, scrollToVerse = null) {
  if (state.mode === 'quran') {
    if (!state.quranData) {
      showLoading(true);
      try {
        state.quranData = await loadQuranData();
      } catch {
        showToast('Kur\'an verileri yüklenemedi. İnternet bağlantınızı kontrol edin.', 'error');
        showLoading(false);
        return;
      }
      showLoading(false);
    }
    state.bookData    = state.quranData;
    state.currentBook = QURAN_BOOK;
    state.currentChapter = Math.max(1, Math.min(chapter, 114));
  } else {
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
  }

  Storage.markChapterRead(state.currentBook.name, state.currentChapter);
  Storage.setLastRead(state.currentBook.name, state.currentBook.file || null, state.currentChapter);

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
  const { currentChapter: ch, bookData } = state;
  const total    = bookData.chapters.length;
  const progress = Storage.getProgress()[state.currentBook.name] || {};

  let titleHtml;
  if (state.mode === 'quran') {
    titleHtml = `Sure ${ch} &middot; ${htmlEscape(getSurahName(ch))} <span class="chapter-total">/ ${total}</span>`;
  } else {
    titleHtml = `${htmlEscape(state.currentBook.name)} &middot; Chapter ${ch} <span class="chapter-total">/ ${total}</span>`;
  }

  const pills = bookData.chapters.map(c => {
    const n       = parseInt(c.chapter);
    const isCur   = n === ch;
    const isRead  = !isCur && !!progress[String(n)];
    const tooltip = state.mode === 'quran' ? `Sure ${n}: ${getSurahName(n)}` : `Chapter ${n}`;
    return `<button class="chapter-pill${isCur ? ' current' : isRead ? ' read' : ''}"
      onclick="goToChapter(${n})" aria-label="${htmlEscape(tooltip)}" title="${htmlEscape(tooltip)}">${n}</button>`;
  }).join('');

  document.getElementById('chapterNav').innerHTML = `
    <div class="chapter-nav-top">
      <button class="nav-btn" onclick="prevChapter()" ${ch <= 1 ? 'disabled' : ''} aria-label="Previous">&#8592;</button>
      <span class="chapter-title">${titleHtml}</span>
      <button class="nav-btn" onclick="nextChapter()" ${ch >= total ? 'disabled' : ''} aria-label="Next">&#8594;</button>
    </div>
    <div class="chapter-pills">${pills}</div>`;
}

// ─── RENDER: PROGRESS BAR ────────────────────────────────────
function renderProgressBar() {
  const total  = state.bookData.chapters.length;
  const read   = Storage.chaptersRead(state.currentBook.name);
  const pct    = total > 0 ? Math.round((read / total) * 100) : 0;
  const unit   = state.mode === 'quran' ? 'sure okundu' : 'chapters read';

  document.getElementById('progressContainer').innerHTML = `
    <div class="progress-wrap">
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <span class="progress-label">${pct}% &bull; ${read} / ${total} ${unit}</span>
    </div>`;
}

// ─── RENDER: VERSES ──────────────────────────────────────────
function renderVerses() {
  const { bookData, currentChapter: ch, searchQuery } = state;
  const chData = bookData.chapters[ch - 1];
  if (!chData) return;

  const notes  = Storage.getNotes();
  const isDark = document.documentElement.classList.contains('dark');
  const query  = searchQuery.toLowerCase().trim();

  document.getElementById('versesContainer').innerHTML = chData.verses.map(v => {
    const ref  = getVerseRef(ch, v.verse);
    const note = notes[ref];

    let bgStyle = '';
    if (note?.color && NOTE_COLORS[note.color]) {
      bgStyle = `style="background-color:${NOTE_COLORS[note.color][isDark ? 'dark' : 'light']}"`;
    }

    const safeText   = htmlEscape(v.text);
    const displayText = query
      ? safeText.replace(new RegExp(`(${escapeRegex(query)})`, 'gi'), '<mark>$1</mark>')
      : safeText;
    const isMatch = query && v.text.toLowerCase().includes(query);

    return `
      <div class="verse-row${isMatch ? ' search-match' : ''}" id="v-${v.verse}"
           data-ref="${htmlEscape(ref)}" ${bgStyle}
           ondblclick="openNoteModalEl(this)">
        <span class="verse-num" onclick="openNoteModalEl(this.closest('.verse-row'))"
              title="Not ekle / düzenle">${v.verse}</span>
        <span class="verse-text">${displayText}</span>
        <button class="copy-btn" onclick="copyVerseEl(this.closest('.verse-row'), event)"
                title="Ayet kopyala" aria-label="Ayet kopyala">${iconCopy()}</button>
        ${note ? `<span class="note-dot" style="background:${NOTE_COLORS[note.color]?.dot || '#888'}"
                        title="${htmlEscape((note.text || '').slice(0, 60))}"></span>` : ''}
      </div>`;
  }).join('');
}

// ─── MODE SWITCHING ──────────────────────────────────────────
async function switchMode() {
  const newMode = state.mode === 'bible' ? 'quran' : 'bible';
  state.mode = newMode;
  localStorage.setItem('app_mode', newMode);

  state.searchQuery = '';
  document.getElementById('searchInput').value = '';
  document.getElementById('searchResults').innerHTML = '';
  if (!document.getElementById('searchPanel').classList.contains('hidden')) toggleSearch();

  updateModeBtn();
  updateSearchUI();

  if (state.mode === 'quran') {
    state.bookData    = null;
    state.currentBook = null;
    const last = Storage.getLastRead();
    await navigateTo(QURAN_BOOK, last?.chapter || 1);
  } else {
    // Restore Bible position
    state.bookData    = null;
    state.currentBook = null;
    const last      = Storage.getLastRead();
    const startMeta = last
      ? (state.books.find(b => b.file === last.file || b.name === last.bookName) || state.books[0])
      : state.books[0];
    await navigateTo(startMeta, last?.chapter || 1);
  }
}

function updateModeBtn() {
  const btn = document.getElementById('modeToggleBtn');
  if (state.mode === 'quran') {
    btn.textContent = '✝ Bible';
    btn.title = 'Bible\'a geç';
    document.getElementById('bookSelectBtn').innerHTML = `${iconBook()} Sure Seç`;
  } else {
    btn.textContent = '☪ Kur\'an';
    btn.title = 'Kur\'an\'a geç';
    document.getElementById('bookSelectBtn').innerHTML = `${iconBook()} Kitap Seç`;
  }
}

function updateSearchUI() {
  const scope = document.getElementById('searchScope');
  if (state.mode === 'quran') {
    scope.options[0].text = 'Bu sure';
    scope.options[1].text = "Tüm Kur'an";
  } else {
    scope.options[0].text = 'Bu bölüm';
    scope.options[1].text = 'Bu kitap';
  }
}

// ─── BOOK / SURAH MODAL ──────────────────────────────────────
function openBookModal() {
  const modal = document.getElementById('bookModal');
  modal.classList.remove('hidden');
  document.getElementById('bookSearchInput').value = '';

  const tabs = document.querySelector('.testament-tabs');

  if (state.mode === 'quran') {
    document.querySelector('#bookModal .modal-title').textContent = 'Sure Seç';
    document.getElementById('bookSearchInput').placeholder = 'Sure ara…';
    tabs.style.display = 'none';
    renderSurahGrid('');
  } else {
    document.querySelector('#bookModal .modal-title').textContent = 'Select Book';
    document.getElementById('bookSearchInput').placeholder = 'Search books…';
    tabs.style.display = '';
    document.querySelectorAll('.testament-tab').forEach((t, i) => t.classList.toggle('active', i === 0));
    renderBookGrid('OT', '');
  }

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

function renderSurahGrid(query) {
  const surahs = QURAN_SURAHS.filter(s =>
    !query ||
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    String(s.id).includes(query)
  );

  const progress = Storage.getProgress()[QURAN_BOOK.name] || {};
  const el = document.getElementById('bookListContainer');

  if (!surahs.length) {
    el.innerHTML = `<p class="empty-msg">Sure bulunamadı</p>`;
    return;
  }

  el.innerHTML = `<div class="book-grid">${surahs.map(s => {
    const isRead = !!progress[String(s.id)];
    const isCur  = state.mode === 'quran' && state.currentChapter === s.id;
    return `
      <button class="book-item${isCur ? ' current' : ''}" onclick="selectSurah(${s.id})">
        <span class="book-abbr">${s.id}</span>
        <span class="book-name">${s.name}</span>
        ${isRead ? `<span class="book-pct" title="Okundu">✓</span>` : ''}
      </button>`;
  }).join('')}</div>`;
}

async function selectBook(id) {
  const meta = state.books.find(b => b.id === id);
  if (!meta) return;
  closeBookModal();
  await navigateTo(meta, 1);
}

async function selectSurah(id) {
  closeBookModal();
  await navigateTo(QURAN_BOOK, id);
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
  showToast('Not kaydedildi');
}

function deleteNote() {
  if (!_noteRef) return;
  if (!confirm('Bu notu sil?')) return;
  Storage.deleteNote(_noteRef);
  closeNoteModal();
  renderVerses();
  showToast('Not silindi');
}

// ─── SEARCH ──────────────────────────────────────────────────
function toggleSearch() {
  const panel   = document.getElementById('searchPanel');
  const opening = panel.classList.contains('hidden');
  panel.classList.toggle('hidden', !opening);
  if (opening) document.getElementById('searchInput').focus();
  else {
    state.searchQuery = '';
    document.getElementById('searchInput').value = '';
    document.getElementById('searchResults').innerHTML = '';
    if (state.bookData) renderVerses();
  }
}

function doSearch() {
  const query = document.getElementById('searchInput').value.trim();
  const scope = document.getElementById('searchScope').value;

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
        results.push({ chNum, verse: v.verse, text: v.text, ref: getVerseRef(chNum, v.verse) });
      }
    });
  });

  renderSearchResults(results, query);
}

function renderSearchResults(results, query) {
  const el = document.getElementById('searchResults');
  if (!results.length) {
    el.innerHTML = `<p class="empty-msg">Sonuç bulunamadı: &ldquo;${htmlEscape(query)}&rdquo;</p>`;
    return;
  }

  const safeQ = escapeRegex(query);
  el.innerHTML = `
    <p class="results-count">${results.length} sonuç</p>
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
  const ref    = row.dataset.ref;
  const vNum   = ref.split(':')[1];
  const chData = state.bookData.chapters[state.currentChapter - 1];
  const verse  = chData?.verses.find(v => v.verse === vNum);
  if (!verse) return;

  const source = state.mode === 'quran' ? '(Elmalılı Hamdi Yazır)' : '(KJV)';
  const text   = `${ref} — "${verse.text}" ${source}`;
  navigator.clipboard?.writeText(text)
    .then(() => showToast('Ayet kopyalandı!'))
    .catch(() => showToast('Kopyalama başarısız', 'error'));
}

// ─── SETTINGS ────────────────────────────────────────────────
function applySettings() {
  const { theme, fontSize, fontFamily } = state.settings;

  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.getElementById('themeToggleBtn').innerHTML = theme === 'dark' ? iconMoon() : iconSun();

  const container = document.getElementById('versesContainer');
  container.style.fontSize   = `${fontSize}px`;
  document.getElementById('fontSizeDisplay').textContent = `${fontSize}px`;

  container.style.fontFamily = FONT_FAMILIES[fontFamily] || FONT_FAMILIES.inter;
  document.querySelectorAll('.font-family-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.family === fontFamily)
  );

  Storage.saveSettings();
}

function toggleDarkMode() {
  state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
  applySettings();
  if (state.bookData) renderVerses();
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

  let label;
  if (state.mode === 'quran') {
    label = `${getSurahName(last.chapter)} ${last.chapter}`;
  } else {
    label = `${last.bookName} ${last.chapter}`;
  }
  btn.querySelector('.continue-label').textContent = label;
  btn.title = `Devam et: ${label}`;
}

async function continueReading() {
  const last = Storage.getLastRead();
  if (!last) return;
  if (state.mode === 'quran') {
    await navigateTo(QURAN_BOOK, last.chapter);
  } else {
    const meta = state.books.find(b => b.file === last.file || b.name === last.bookName);
    if (meta) await navigateTo(meta, last.chapter);
  }
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
  state.settings = Storage.getSettings();
  state.mode     = localStorage.getItem('app_mode') || 'bible';
  applySettings();

  document.getElementById('searchToggleBtn').innerHTML = `${iconSearch()} Ara`;
  updateModeBtn();
  updateSearchUI();

  try {
    state.books = await loadBooksList();
  } catch {
    showToast('Kitap listesi yüklenemedi', 'error');
    return;
  }

  updateContinueBtn();

  // ── Book modal wiring ──
  document.getElementById('bookSearchInput').addEventListener('input', e => {
    if (state.mode === 'quran') {
      renderSurahGrid(e.target.value);
    } else {
      const active = document.querySelector('.testament-tab.active')?.dataset.testament || 'OT';
      renderBookGrid(active, e.target.value);
    }
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

  // ── Load last-read position or default ──
  if (state.mode === 'quran') {
    const last = Storage.getLastRead();
    await navigateTo(QURAN_BOOK, last?.chapter || 1);
  } else {
    const last      = Storage.getLastRead();
    const startMeta = last
      ? (state.books.find(b => b.file === last.file || b.name === last.bookName) || state.books[0])
      : state.books[0];
    await navigateTo(startMeta, last?.chapter || 1);
  }
}

document.addEventListener('DOMContentLoaded', init);
