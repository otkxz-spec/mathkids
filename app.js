/* Math Kids – addition, subtraction, multiplication & division practice.
   Plain HTML/CSS/JS, no build step. Works offline as an installable PWA.
   v2: multiple-choice mode + profiles with progress tracking. */
(function (root) {
  'use strict';

  /* ------------------------------------------------------------------ *
   *  Translations
   * ------------------------------------------------------------------ */
  const I18N = {
    en: {
      appTitle: 'Math Kids', settings: 'Settings', close: 'Close', quit: 'Quit', back: 'Back', edit: 'Edit',
      chooseOps: 'What do you want to practice?',
      add: 'Addition', sub: 'Subtraction', mul: 'Multiplication', div: 'Division',
      chooseTables: 'Which tables?', all: 'All', none: 'None',
      tablesHintMul: 'Questions will use the tables you pick.',
      tablesHintNone: 'Pick at least one table for multiplication / division.',
      howMany: 'How many questions?', custom: 'Custom',
      modeTitle: 'How do you want to answer?', modeType: 'Type it', modeChoice: 'Multiple choice',
      start: 'Start',
      errNoOp: 'Pick at least one operation.',
      errNoTable: 'Pick at least one multiplication table.',
      errCount: 'Enter a number of questions between 1 and 100.',
      question: 'Question', of: 'of',
      great: 'Great! ✔', oops: 'Not quite. The answer is',
      next: 'Next ➜', finish: 'Finish ➜',
      results: 'Results', correct: 'Correct', incorrect: 'Incorrect', time: 'Time',
      showAnswers: 'Show answers', hideAnswers: 'Hide answers',
      playAgain: 'Play again', home: 'Home',
      yourAnswer: 'You answered', noAnswer: 'no answer',
      msg100: 'Perfect score! You are a math star! 🌟',
      msg80: 'Awesome job! Keep it up! 🎉',
      msg50: 'Good effort! Practice makes perfect. 💪',
      msg0: "Don't give up! Try again, you can do it! 🚀",
      confirmQuit: 'Quit this round? It will not be saved.',
      savedTo: 'Saved to',
      language: 'Language',
      numberRange: 'Add / subtract numbers up to',
      multiplierMax: 'Multiply / divide by numbers up to',
      instantFeedback: 'Show right / wrong after each question',
      sound: 'Sound effects',
      theme: 'Theme', themeAuto: 'Auto', themeLight: 'Light', themeDark: 'Dark',
      reset: 'Reset to defaults', confirmReset: 'Reset all settings?',
      profiles: 'Profiles', addProfile: '+ Add profile', newProfile: 'New profile', editProfile: 'Edit profile',
      welcomeTitle: 'Welcome! Who is playing?', defaultProfile: 'Player 1',
      name: 'Name', namePlaceholder: 'Your name', avatar: 'Choose an avatar',
      save: 'Save', cancel: 'Cancel', deleteProfile: 'Delete profile',
      confirmDeleteProfile: 'Delete this profile and all of its progress?',
      errName: 'Please enter a name.',
      progress: 'Progress', myProgress: 'My progress',
      rounds: 'Rounds', questions: 'Questions', accuracy: 'Accuracy', streak: 'Day streak',
      byOperation: 'By operation', tablesProgress: 'Tables (× and ÷)',
      tablesLegend: 'Green: 90%+ · Yellow: 70–89% · Red: under 70% · Grey: not practiced yet',
      recentRounds: 'Recent rounds',
      noProgress: 'No rounds yet. Play a round to start tracking progress!',
      resetProgress: 'Reset progress', confirmResetProgress: 'Erase all progress for this profile?'
    },
    es: {
      appTitle: 'Mate Kids', settings: 'Ajustes', close: 'Cerrar', quit: 'Salir', back: 'Atrás', edit: 'Editar',
      chooseOps: '¿Qué quieres practicar?',
      add: 'Suma', sub: 'Resta', mul: 'Multiplicación', div: 'División',
      chooseTables: '¿Qué tablas?', all: 'Todas', none: 'Ninguna',
      tablesHintMul: 'Las preguntas usarán las tablas que elijas.',
      tablesHintNone: 'Elige al menos una tabla para multiplicar / dividir.',
      howMany: '¿Cuántas preguntas?', custom: 'Otro',
      modeTitle: '¿Cómo quieres responder?', modeType: 'Escribirla', modeChoice: 'Opción múltiple',
      start: 'Empezar',
      errNoOp: 'Elige al menos una operación.',
      errNoTable: 'Elige al menos una tabla de multiplicar.',
      errCount: 'Escribe un número de preguntas entre 1 y 100.',
      question: 'Pregunta', of: 'de',
      great: '¡Muy bien! ✔', oops: 'Casi. La respuesta es',
      next: 'Siguiente ➜', finish: 'Terminar ➜',
      results: 'Resultados', correct: 'Correctas', incorrect: 'Incorrectas', time: 'Tiempo',
      showAnswers: 'Mostrar respuestas', hideAnswers: 'Ocultar respuestas',
      playAgain: 'Jugar otra vez', home: 'Inicio',
      yourAnswer: 'Respondiste', noAnswer: 'sin respuesta',
      msg100: '¡Puntuación perfecta! ¡Eres una estrella de las mates! 🌟',
      msg80: '¡Excelente trabajo! ¡Sigue así! 🎉',
      msg50: '¡Buen esfuerzo! La práctica hace al maestro. 💪',
      msg0: '¡No te rindas! Inténtalo de nuevo, ¡tú puedes! 🚀',
      confirmQuit: '¿Salir de esta ronda? No se guardará.',
      savedTo: 'Guardado en',
      language: 'Idioma',
      numberRange: 'Sumar / restar números hasta',
      multiplierMax: 'Multiplicar / dividir por números hasta',
      instantFeedback: 'Mostrar si es correcto o no tras cada pregunta',
      sound: 'Efectos de sonido',
      theme: 'Tema', themeAuto: 'Auto', themeLight: 'Claro', themeDark: 'Oscuro',
      reset: 'Restablecer valores', confirmReset: '¿Restablecer todos los ajustes?',
      profiles: 'Perfiles', addProfile: '+ Agregar perfil', newProfile: 'Nuevo perfil', editProfile: 'Editar perfil',
      welcomeTitle: '¡Bienvenido! ¿Quién va a jugar?', defaultProfile: 'Jugador 1',
      name: 'Nombre', namePlaceholder: 'Tu nombre', avatar: 'Elige un avatar',
      save: 'Guardar', cancel: 'Cancelar', deleteProfile: 'Eliminar perfil',
      confirmDeleteProfile: '¿Eliminar este perfil y todo su progreso?',
      errName: 'Escribe un nombre.',
      progress: 'Progreso', myProgress: 'Mi progreso',
      rounds: 'Rondas', questions: 'Preguntas', accuracy: 'Precisión', streak: 'Días seguidos',
      byOperation: 'Por operación', tablesProgress: 'Tablas (× y ÷)',
      tablesLegend: 'Verde: 90%+ · Amarillo: 70–89% · Rojo: menos de 70% · Gris: sin practicar',
      recentRounds: 'Rondas recientes',
      noProgress: 'Aún no hay rondas. ¡Juega una para empezar a registrar tu progreso!',
      resetProgress: 'Borrar progreso', confirmResetProgress: '¿Borrar todo el progreso de este perfil?'
    }
  };

  /* ------------------------------------------------------------------ *
   *  Pure logic (also used by tests)
   * ------------------------------------------------------------------ */
  const OPS = [
    { id: 'add', sym: '+' },
    { id: 'sub', sym: '−' },
    { id: 'mul', sym: '×' },
    { id: 'div', sym: '÷' }
  ];
  const SYMBOL = { add: '+', sub: '−', mul: '×', div: '÷' };
  const AVATARS = ['🦊', '🐼', '🦁', '🐯', '🐸', '🐵', '🐙', '🦄', '🐶', '🐱', '🚀', '⚽'];
  const HISTORY_MAX = 50;

  const DEFAULT_SETTINGS = {
    lang: null,            // resolved on first load from the browser language
    range: 20,             // add / subtract max
    multMax: 10,           // multiply / divide upper factor
    feedback: true,
    sound: true,
    theme: 'auto'
  };

  function defaultConfig() { return { ops: ['mul'], tables: [2, 3, 4, 5], count: 10, mode: 'type' }; }

  function randInt(min, max, rng) {
    rng = rng || Math.random;
    return Math.floor(rng() * (max - min + 1)) + min;
  }
  function pick(arr, rng) { return arr[randInt(0, arr.length - 1, rng)]; }
  function shuffle(arr, rng) {
    rng = rng || Math.random;
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }

  /** Build a single question object for an operation. */
  function makeQuestion(op, cfg, rng) {
    rng = rng || Math.random;
    const range = cfg.range, mmax = cfg.multMax;
    let a, b, answer, table;
    switch (op) {
      case 'add': {
        a = randInt(1, range - 1, rng);       // sum never exceeds the chosen range
        b = randInt(1, range - a, rng);
        answer = a + b; break;
      }
      case 'sub': {
        a = randInt(1, range, rng);
        b = randInt(0, a, rng);               // never negative
        answer = a - b; break;
      }
      case 'mul': {
        table = pick(cfg.tables, rng);
        const n = randInt(1, mmax, rng);
        if (rng() < 0.5) { a = table; b = n; } else { a = n; b = table; }
        answer = a * b; break;
      }
      case 'div': {
        table = pick(cfg.tables, rng);        // divisor comes from the selected tables
        const n = randInt(1, mmax, rng);
        a = table * n; b = table; answer = n; break;
      }
      default: throw new Error('Unknown op ' + op);
    }
    const q = { op: op, a: a, b: b, answer: answer, text: a + ' ' + SYMBOL[op] + ' ' + b };
    if (table) q.table = table;
    return q;
  }

  /** Three plausible wrong answers + the right one, shuffled. */
  function makeChoices(q, rng) {
    rng = rng || Math.random;
    const ans = q.answer, wrong = new Set();
    const ok = v => Number.isInteger(v) && v >= 0 && v !== ans && !wrong.has(v);
    let pool;
    if (q.op === 'mul') pool = [ans + q.a, ans - q.a, ans + q.b, ans - q.b, ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans - 10];
    else if (q.op === 'div') pool = [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3, ans - 3, q.b];
    else pool = [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3, ans - 3, ans + 10, ans - 10];
    shuffle(pool, rng).forEach(v => { if (wrong.size < 3 && ok(v)) wrong.add(v); });
    for (let d = 1; wrong.size < 3; d++) {      // always terminates (e.g. answer 0 or 1)
      if (ok(ans + d)) wrong.add(ans + d);
      if (wrong.size < 3 && ok(ans - d)) wrong.add(ans - d);
    }
    return shuffle([ans].concat(Array.from(wrong)), rng);
  }

  /** Build a full round, avoiding repeated questions when possible. */
  function buildRound(cfg, rng) {
    rng = rng || Math.random;
    const out = [], seen = new Set();
    for (let i = 0; i < cfg.count; i++) {
      let q, tries = 0;
      do {
        q = makeQuestion(pick(cfg.ops, rng), cfg, rng);
        tries++;
      } while (seen.has(q.text) && tries < 30);
      seen.add(q.text);
      if (cfg.mode === 'choice') q.choices = makeChoices(q, rng);
      out.push(q);
    }
    return out;
  }

  function validateConfig(cfg) {
    if (!cfg.ops.length) return 'errNoOp';
    if ((cfg.ops.includes('mul') || cfg.ops.includes('div')) && !cfg.tables.length) return 'errNoTable';
    if (!Number.isInteger(cfg.count) || cfg.count < 1 || cfg.count > 100) return 'errCount';
    return null;
  }

  function messageKey(pct) {
    if (pct === 100) return 'msg100';
    if (pct >= 80) return 'msg80';
    if (pct >= 50) return 'msg50';
    return 'msg0';
  }
  function starsFor(pct) { return pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0; }

  /* ---------- progress tracking ---------- */
  function emptyStats() { return { rounds: 0, questions: 0, correct: 0, ops: {}, tables: {}, days: [], history: [] }; }

  function dayKey(ts) {
    const d = new Date(ts);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function bump(map, key, ok) {
    const e = map[key] || (map[key] = { n: 0, c: 0 });
    e.n++; if (ok) e.c++;
  }

  /** Add one finished round to a stats object (mutates and returns it). */
  function recordRound(stats, results, meta) {
    let correct = 0;
    results.forEach(r => {
      stats.questions++;
      if (r.ok) { stats.correct++; correct++; }
      bump(stats.ops, r.q.op, r.ok);
      if (r.q.table) bump(stats.tables, r.q.table, r.ok);
    });
    stats.rounds++;
    const key = dayKey(meta.ts);
    if (!stats.days.includes(key)) stats.days.push(key);
    if (stats.days.length > 400) stats.days = stats.days.slice(-400);
    stats.history.push({
      ts: meta.ts, mode: meta.mode, correct: correct, total: results.length, ms: meta.ms,
      ops: Array.from(new Set(results.map(r => r.q.op)))
    });
    if (stats.history.length > HISTORY_MAX) stats.history = stats.history.slice(-HISTORY_MAX);
    return stats;
  }

  /** Consecutive practice days ending today (or yesterday, so the streak isn't lost before today's round). */
  function streakDays(days, nowTs) {
    if (!days.length) return 0;
    const set = new Set(days);
    const d = new Date(nowTs); d.setHours(12, 0, 0, 0);   // noon avoids DST edge cases
    if (!set.has(dayKey(d.getTime()))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (set.has(dayKey(d.getTime()))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function pct(c, n) { return n ? Math.round(c / n * 100) : 0; }
  function masteryLevel(entry) {
    if (!entry || !entry.n) return 'none';
    const p = pct(entry.c, entry.n);
    return p >= 90 ? 'good' : p >= 70 ? 'ok' : 'low';
  }

  const logic = {
    makeQuestion, makeChoices, buildRound, validateConfig, messageKey, starsFor,
    emptyStats, recordRound, streakDays, masteryLevel, dayKey, pct, defaultConfig,
    I18N, OPS, AVATARS, HISTORY_MAX
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports = logic; }
  if (typeof document === 'undefined') return;

  /* ------------------------------------------------------------------ *
   *  Browser UI
   * ------------------------------------------------------------------ */
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const store = {
    get(k, d) { try { const v = localStorage.getItem('mk_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('mk_' + k, JSON.stringify(v)); } catch (e) { /* private mode */ } }
  };

  /* ---------- state ---------- */
  let settings = Object.assign({}, DEFAULT_SETTINGS, store.get('settings', {}));
  if (!settings.lang) settings.lang = (navigator.language || 'en').toLowerCase().startsWith('es') ? 'es' : 'en';

  const t = key => (I18N[settings.lang] && I18N[settings.lang][key]) || I18N.en[key] || key;

  let profiles = [];
  let activeId = null;
  let firstRun = false;

  function newId() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function newProfile(name, avatar, cfg) {
    return { id: newId(), name: name, avatar: avatar, config: Object.assign(defaultConfig(), cfg || {}), stats: emptyStats() };
  }
  function sanitizeProfile(p) {
    const cfg = Object.assign(defaultConfig(), p.config || {});
    cfg.ops = Array.isArray(cfg.ops) ? cfg.ops : ['mul'];
    cfg.tables = Array.isArray(cfg.tables) ? cfg.tables : [2, 3, 4, 5];
    if (cfg.mode !== 'choice') cfg.mode = 'type';
    return {
      id: p.id || newId(), name: String(p.name || '?').slice(0, 16), avatar: p.avatar || AVATARS[0],
      config: cfg, stats: Object.assign(emptyStats(), p.stats || {})
    };
  }
  function loadProfiles() {
    const saved = store.get('profiles', null);
    if (Array.isArray(saved) && saved.length) {
      profiles = saved.map(sanitizeProfile);
      activeId = store.get('active', null);
      if (!profiles.some(p => p.id === activeId)) activeId = profiles[0].id;
    } else {
      // first launch (or upgrade from v1: keep the old selections for the first profile)
      const old = store.get('config', null);
      const p = newProfile(t('defaultProfile'), AVATARS[0], old && typeof old === 'object' ? old : null);
      profiles = [sanitizeProfile(p)];
      activeId = profiles[0].id;
      firstRun = true;
      saveProfiles();
    }
  }
  function P() { return profiles.find(p => p.id === activeId) || profiles[0]; }
  function cfg() { return P().config; }
  function saveProfiles() { store.set('profiles', profiles); store.set('active', activeId); }
  function saveSettings() { store.set('settings', settings); }

  /* ---------- sound ---------- */
  let audioCtx = null;
  function beep(freqs, dur) {
    if (!settings.sound) return;
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      let when = audioCtx.currentTime;
      freqs.forEach(f => {
        const o = audioCtx.createOscillator(), g = audioCtx.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(.18, when); g.gain.exponentialRampToValueAtTime(.001, when + dur);
        o.connect(g); g.connect(audioCtx.destination);
        o.start(when); o.stop(when + dur); when += dur * .9;
      });
    } catch (e) { /* ignore */ }
  }
  const sfx = {
    right: () => beep([660, 880], .14),
    wrong: () => beep([220, 180], .2),
    done: () => beep([523, 659, 784, 1047], .16)
  };

  /* ---------- screens & sheets ---------- */
  function currentScreen() { const s = $('.screen.active'); return s ? s.id : ''; }
  function show(id) {
    $$('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  }
  function openSheet(id) {
    $$('.sheet').forEach(s => s.classList.toggle('hidden', s.id !== id));
    $('#sheet-backdrop').classList.remove('hidden');
  }
  function closeSheets() {
    $$('.sheet').forEach(s => s.classList.add('hidden'));
    $('#sheet-backdrop').classList.add('hidden');
  }

  /* ---------- i18n + theme ---------- */
  function applyLang() {
    document.documentElement.lang = settings.lang;
    document.title = t('appTitle');
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
    $$('[data-i18n-placeholder]').forEach(el => el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder)));
    renderHome(); updateSettingsUI();
    if (round && currentScreen() === 'screen-quiz') { renderQuestionMeta(); updateNextLabels(); }
    if (currentScreen() === 'screen-summary') renderSummary();
    if (currentScreen() === 'screen-progress') renderProgress();
    if (!$('#sheet-profiles').classList.contains('hidden')) renderProfileList();
    if (!$('#sheet-profile-edit').classList.contains('hidden')) renderEditorLabels();
  }
  function applyTheme() {
    const dark = settings.theme === 'dark' ||
      (settings.theme === 'auto' && window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    const meta = $('meta[name="theme-color"]'); if (meta) meta.content = dark ? '#0f1020' : '#4f46e5';
  }

  /* ---------- home ---------- */
  const COUNTS = [5, 10, 15, 20, 30];

  function renderHome() {
    renderProfileChips(); renderOps(); renderModes(); renderTables(); renderTablesHint(); renderCounts();
  }

  function renderProfileChips() {
    const p = P();
    $$('.profile-chip').forEach(chip => {
      $('.pc-avatar', chip).textContent = p.avatar;
      $('.pc-name', chip).textContent = p.name;
    });
  }

  function renderOps() {
    const box = $('#ops'); box.innerHTML = '';
    OPS.forEach(o => {
      const on = cfg().ops.includes(o.id);
      const b = document.createElement('button');
      b.className = 'chip' + (on ? ' on' : '');
      b.innerHTML = '<span class="sym">' + o.sym + '</span><span>' + esc(t(o.id)) + '</span>';
      b.setAttribute('aria-pressed', on);
      b.onclick = () => {
        const c = cfg();
        c.ops = c.ops.includes(o.id) ? c.ops.filter(x => x !== o.id) : c.ops.concat(o.id);
        saveProfiles(); renderOps(); clearError();
      };
      box.appendChild(b);
    });
    $('#tables-card').classList.toggle('hidden', !usesTables());
  }
  function usesTables() { return cfg().ops.includes('mul') || cfg().ops.includes('div'); }

  function renderModes() {
    const box = $('#modes'); box.innerHTML = '';
    [['type', '⌨️', 'modeType'], ['choice', '🔘', 'modeChoice']].forEach(m => {
      const on = cfg().mode === m[0];
      const b = document.createElement('button');
      b.className = 'chip' + (on ? ' on' : '');
      b.innerHTML = '<span class="sym">' + m[1] + '</span><span>' + esc(t(m[2])) + '</span>';
      b.setAttribute('aria-pressed', on);
      b.onclick = () => { cfg().mode = m[0]; saveProfiles(); renderModes(); };
      box.appendChild(b);
    });
  }

  function renderTables() {
    const box = $('#tables'); box.innerHTML = '';
    for (let n = 1; n <= 12; n++) {
      const on = cfg().tables.includes(n);
      const b = document.createElement('button');
      b.className = 'chip' + (on ? ' on' : '');
      b.textContent = n;
      b.setAttribute('aria-pressed', on);
      b.onclick = () => {
        const c = cfg();
        c.tables = c.tables.includes(n) ? c.tables.filter(x => x !== n) : c.tables.concat(n).sort((a, b) => a - b);
        saveProfiles(); renderTables(); renderTablesHint(); clearError();
      };
      box.appendChild(b);
    }
  }
  function renderTablesHint() {
    $('#tables-hint').textContent = cfg().tables.length ? t('tablesHintMul') : t('tablesHintNone');
  }

  function renderCounts() {
    const box = $('#counts'); box.innerHTML = '';
    const custom = $('#count-custom');
    COUNTS.forEach(n => {
      const b = document.createElement('button');
      b.className = 'chip' + (cfg().count === n ? ' on' : '');
      b.textContent = n;
      b.onclick = () => { cfg().count = n; custom.value = ''; saveProfiles(); renderCounts(); clearError(); };
      box.appendChild(b);
    });
    custom.value = COUNTS.includes(cfg().count) ? '' : cfg().count;
  }

  function clearError() { $('#start-error').textContent = ''; }

  /* ---------- quiz ---------- */
  let round = null;      // { questions, idx, results[], startedAt, answered, input, mode }

  function roundConfig() {
    return Object.assign({}, cfg(), { range: settings.range, multMax: settings.multMax });
  }

  function startRound() {
    const c = roundConfig();
    round = { questions: buildRound(c), idx: 0, results: [], startedAt: Date.now(), answered: false, input: '', mode: c.mode };
    show('screen-quiz');
    renderQuestion();
  }

  function startFromHome() {
    const raw = $('#count-custom').value.trim();
    if (raw !== '') cfg().count = Number(raw);
    const err = validateConfig(cfg());
    if (err) { $('#start-error').textContent = t(err); return; }
    saveProfiles();
    startRound();
  }

  function renderQuestionMeta() {
    const n = round.questions.length;
    $('#progress-text').textContent = t('question') + ' ' + (round.idx + 1) + ' ' + t('of') + ' ' + n;
    $('#progress-bar').style.width = ((round.idx) / n * 100) + '%';
    const score = round.results.filter(r => r.ok).length;
    $('#score-live').textContent = '⭐ ' + score;
  }

  function isLast() { return round.idx === round.questions.length - 1; }
  function updateNextLabels() {
    const label = isLast() ? t('finish') : t('next');
    $('#mc-next').textContent = label;
    if (round.answered && round.mode === 'type') $('#key-enter').textContent = label;
  }

  function renderQuestion() {
    const q = round.questions[round.idx];
    const mc = round.mode === 'choice';
    round.answered = false; round.input = '';
    $('#q-text').textContent = q.text;
    const box = $('#q-answer');
    box.textContent = '?'; box.className = 'answer-box empty';
    const fb = $('#feedback'); fb.textContent = ''; fb.className = 'feedback';
    $('#keypad').classList.toggle('hidden', mc);
    $('#choices').classList.toggle('hidden', !mc);
    $('#mc-next').classList.add('hidden');
    const enter = $('#key-enter'); enter.textContent = '✓'; enter.classList.remove('next');
    if (mc) renderChoices(q);
    renderQuestionMeta();
  }

  function renderChoices(q) {
    const box = $('#choices'); box.innerHTML = '';
    q.choices.forEach((v, i) => {
      const b = document.createElement('button');
      b.className = 'choice'; b.textContent = v; b.dataset.val = v;
      b.onclick = () => chooseOption(i);
      box.appendChild(b);
    });
  }

  function chooseOption(i) {
    if (!round || round.answered || round.mode !== 'choice') return;
    const v = round.questions[round.idx].choices[i];
    if (v === undefined) return;
    $('#q-answer').textContent = v; $('#q-answer').classList.remove('empty');
    submit(v);
  }

  function pressKey(k) {
    if (!round || round.mode !== 'type') return;
    const box = $('#q-answer');
    if (round.answered) { if (k === 'enter') advance(); return; }
    if (k === 'back') round.input = round.input.slice(0, -1);
    else if (k === 'enter') { if (round.input !== '') submit(parseInt(round.input, 10)); return; }
    else if (/^\d$/.test(k) && round.input.length < 6) round.input += k;
    box.textContent = round.input === '' ? '?' : round.input;
    box.classList.toggle('empty', round.input === '');
  }

  function submit(given) {
    const q = round.questions[round.idx];
    const ok = given === q.answer;
    round.results.push({ q: q, given: given, ok: ok });
    round.answered = true;
    ok ? sfx.right() : sfx.wrong();
    renderQuestionMeta();

    if (!settings.feedback) { advance(); return; }

    const box = $('#q-answer'), fb = $('#feedback');
    box.classList.remove('empty'); box.classList.add(ok ? 'right' : 'wrong');
    fb.className = 'feedback ' + (ok ? 'right' : 'wrong');
    fb.textContent = ok ? t('great') : t('oops') + ' ' + q.answer;

    if (round.mode === 'choice') {
      $$('#choices .choice').forEach(b => {
        const v = Number(b.dataset.val);
        b.disabled = true;
        if (v === q.answer) b.classList.add('right');
        else if (v === given) b.classList.add('wrong');
      });
      $('#mc-next').classList.remove('hidden');
    } else {
      $('#key-enter').classList.add('next');
    }
    updateNextLabels();
  }

  function advance() {
    if (isLast()) { finishRound(); return; }
    round.idx++; renderQuestion();
  }

  /* ---------- summary ---------- */
  function finishRound() {
    round.endedAt = Date.now();
    recordRound(P().stats, round.results, { ts: round.endedAt, mode: round.mode, ms: round.endedAt - round.startedAt });
    saveProfiles();
    $('#progress-bar').style.width = '100%';
    sfx.done();
    show('screen-summary');
    $('#answers').classList.add('hidden');
    renderSummary();
  }

  function fmtTime(ms) {
    const s = Math.round(ms / 1000);
    return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  }

  function renderSummary() {
    if (!round) return;
    const total = round.questions.length;
    const right = round.results.filter(r => r.ok).length;
    const p = pct(right, total);
    const stars = starsFor(p);
    $('#stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    $('#score-big').textContent = right + ' / ' + total;
    $('#score-msg').textContent = t(messageKey(p));
    $('#stat-correct').textContent = right;
    $('#stat-wrong').textContent = total - right;
    $('#stat-time').textContent = fmtTime((round.endedAt || Date.now()) - round.startedAt);
    $('#summary-profile').textContent = t('savedTo') + ' ' + P().avatar + ' ' + P().name;

    const list = $('#answers'); list.innerHTML = '';
    round.questions.forEach((q, i) => {
      const r = round.results[i];
      const row = document.createElement('div');
      row.className = 'ans-row ' + (r && r.ok ? 'ok' : 'bad');
      const yours = !r || Number.isNaN(r.given) ? t('noAnswer') : r.given;
      row.innerHTML =
        '<span class="mark">' + (r && r.ok ? '✔' : '✘') + '</span>' +
        '<span class="q">' + esc(q.text) + ' = ' + q.answer + '</span>' +
        (r && r.ok ? '' : '<span class="yours">' + esc(t('yourAnswer')) + ' <s>' + esc(yours) + '</s></span>');
      list.appendChild(row);
    });
    updateToggleLabel();
  }
  function updateToggleLabel() {
    const hidden = $('#answers').classList.contains('hidden');
    $('#btn-toggle-answers').textContent = hidden ? t('showAnswers') : t('hideAnswers');
  }

  /* ---------- progress screen ---------- */
  function fmtDate(ts) {
    try { return new Date(ts).toLocaleDateString(settings.lang, { day: 'numeric', month: 'short' }); }
    catch (e) { return dayKey(ts); }
  }

  function renderProgress() {
    renderProfileChips();
    const s = P().stats;
    const has = s.rounds > 0;
    $('#prog-empty').classList.toggle('hidden', has);
    $('#prog-body').classList.toggle('hidden', !has);
    $('#btn-reset-progress').classList.toggle('hidden', !has);
    if (!has) return;

    $('#tile-rounds').textContent = s.rounds;
    $('#tile-questions').textContent = s.questions;
    $('#tile-accuracy').textContent = pct(s.correct, s.questions) + '%';
    $('#tile-streak').textContent = '🔥 ' + streakDays(s.days, Date.now());

    // by operation
    const ops = $('#prog-ops'); ops.innerHTML = '';
    OPS.forEach(o => {
      const e = s.ops[o.id] && s.ops[o.id].n > 0 ? s.ops[o.id] : null;
      const p = e ? pct(e.c, e.n) : 0;
      const row = document.createElement('div');
      row.className = 'op-row';
      row.innerHTML =
        '<span class="op-name"><b>' + o.sym + '</b> ' + esc(t(o.id)) + '</span>' +
        '<span class="op-bar"><i class="lvl-' + masteryLevel(e) + '" style="width:' + p + '%"></i></span>' +
        '<span class="op-val">' + (e ? p + '% <small>(' + e.c + '/' + e.n + ')</small>' : '–') + '</span>';
      ops.appendChild(row);
    });

    // tables mastery grid
    const grid = $('#prog-tables'); grid.innerHTML = '';
    for (let n = 1; n <= 12; n++) {
      const e = s.tables[n];
      const cell = document.createElement('div');
      cell.className = 'tcell lvl-' + masteryLevel(e);
      const seen = e && e.n > 0;
      cell.innerHTML = '<b>' + n + '</b><small>' + (seen ? pct(e.c, e.n) + '%' : '–') + '</small>';
      cell.title = seen ? e.c + '/' + e.n : '';
      grid.appendChild(cell);
    }

    // trend chart (last 10) + list
    const last = s.history.slice(-10);
    const bars = $('#prog-chart'); bars.innerHTML = '';
    last.forEach(h => {
      const p = pct(h.correct, h.total);
      const col = document.createElement('div');
      col.className = 'bar-col';
      col.innerHTML = '<span>' + p + '</span><div class="bar-track"><div class="bar lvl-' + (p >= 90 ? 'good' : p >= 70 ? 'ok' : 'low') +
        '" style="height:' + Math.max(p, 4) + '%"></div></div>';
      bars.appendChild(col);
    });
    const list = $('#prog-recent'); list.innerHTML = '';
    last.slice().reverse().forEach(h => {
      const row = document.createElement('div');
      row.className = 'recent-row';
      const symbols = h.ops.map(o => SYMBOL[o]).join(' ');
      row.innerHTML =
        '<span class="r-date">' + esc(fmtDate(h.ts)) + '</span>' +
        '<span class="r-mode">' + (h.mode === 'choice' ? '🔘' : '⌨️') + '</span>' +
        '<span class="r-ops">' + esc(symbols) + '</span>' +
        '<span class="r-score">' + h.correct + '/' + h.total + '</span>' +
        '<span class="r-pct">' + pct(h.correct, h.total) + '%</span>';
      list.appendChild(row);
    });
  }

  /* ---------- profiles ---------- */
  let editing = null;   // { id: string|null, avatar: string, first: boolean }

  function renderProfileList() {
    const box = $('#profile-list'); box.innerHTML = '';
    profiles.forEach(p => {
      const row = document.createElement('div');
      row.className = 'profile-row' + (p.id === activeId ? ' active' : '');
      const pick = document.createElement('button');
      pick.className = 'pr-main';
      const av = document.createElement('span'); av.className = 'pr-avatar'; av.textContent = p.avatar;
      const nm = document.createElement('span'); nm.className = 'pr-name'; nm.textContent = p.name;
      const meta = document.createElement('small');
      meta.textContent = p.stats.rounds ? p.stats.rounds + ' ' + t('rounds').toLowerCase() + ' · ' + pct(p.stats.correct, p.stats.questions) + '%' : '';
      const txt = document.createElement('span'); txt.className = 'pr-text'; txt.appendChild(nm); txt.appendChild(meta);
      pick.appendChild(av); pick.appendChild(txt);
      if (p.id === activeId) { const ck = document.createElement('span'); ck.className = 'pr-check'; ck.textContent = '✓'; pick.appendChild(ck); }
      pick.onclick = () => switchProfile(p.id);
      const ed = document.createElement('button');
      ed.className = 'icon-btn small'; ed.textContent = '✏️'; ed.setAttribute('aria-label', t('edit') + ' ' + p.name);
      ed.onclick = () => openEditor(p.id);
      row.appendChild(pick); row.appendChild(ed);
      box.appendChild(row);
    });
  }

  function openProfiles() { renderProfileList(); openSheet('sheet-profiles'); }

  function switchProfile(id) {
    activeId = id; saveProfiles(); closeSheets();
    renderHome();
    if (currentScreen() === 'screen-progress') renderProgress();
  }

  function renderEditorLabels() {
    $('#pe-title').textContent = editing.first ? t('welcomeTitle') : editing.id ? t('editProfile') : t('newProfile');
    $('#pe-cancel').classList.toggle('hidden', false);
    $('#pe-delete').classList.toggle('hidden', !(editing.id && profiles.length > 1));
  }

  function renderAvatarPicker() {
    const box = $('#pe-avatars'); box.innerHTML = '';
    AVATARS.forEach(a => {
      const b = document.createElement('button');
      b.className = 'avatar-btn' + (a === editing.avatar ? ' on' : '');
      b.textContent = a;
      b.setAttribute('aria-pressed', a === editing.avatar);
      b.onclick = () => { editing.avatar = a; renderAvatarPicker(); };
      box.appendChild(b);
    });
  }

  function openEditor(id, first) {
    const p = id ? profiles.find(x => x.id === id) : null;
    editing = {
      id: id || null, first: !!first,
      avatar: p ? p.avatar : AVATARS[profiles.length % AVATARS.length]
    };
    $('#pe-name').value = p ? p.name : '';
    $('#pe-error').textContent = '';
    renderEditorLabels(); renderAvatarPicker();
    openSheet('sheet-profile-edit');
    setTimeout(() => { try { $('#pe-name').focus(); $('#pe-name').select(); } catch (e) { /* ignore */ } }, 50);
  }

  function saveEditor() {
    const name = $('#pe-name').value.trim().slice(0, 16);
    if (!name) { $('#pe-error').textContent = t('errName'); return; }
    if (editing.id) {
      const p = profiles.find(x => x.id === editing.id);
      p.name = name; p.avatar = editing.avatar;
      saveProfiles(); renderHome();
      if (currentScreen() === 'screen-progress') renderProgress();
      if (editing.first) closeSheets(); else openProfiles();
    } else {
      const p = sanitizeProfile(newProfile(name, editing.avatar));
      profiles.push(p); activeId = p.id; saveProfiles();
      closeSheets(); renderHome();
      if (currentScreen() === 'screen-progress') renderProgress();
    }
  }

  function deleteEditing() {
    if (!editing.id || profiles.length < 2) return;
    if (!confirm(t('confirmDeleteProfile'))) return;
    profiles = profiles.filter(p => p.id !== editing.id);
    if (!profiles.some(p => p.id === activeId)) activeId = profiles[0].id;
    saveProfiles(); renderHome();
    if (currentScreen() === 'screen-progress') renderProgress();
    openProfiles();
  }

  /* ---------- settings sheet ---------- */
  function updateSettingsUI() {
    const seg = (id, val) => $$('#' + id + ' button').forEach(b => b.classList.toggle('on', b.dataset.val === String(val)));
    seg('set-lang', settings.lang); seg('set-range', settings.range);
    seg('set-mult', settings.multMax); seg('set-theme', settings.theme);
    $('#set-feedback').checked = settings.feedback;
    $('#set-sound').checked = settings.sound;
  }

  function bindSegmented(id, key, parse) {
    $$('#' + id + ' button').forEach(b => b.addEventListener('click', () => {
      settings[key] = parse ? parse(b.dataset.val) : b.dataset.val;
      saveSettings();
      if (key === 'lang') applyLang(); else if (key === 'theme') applyTheme();
      updateSettingsUI();
    }));
  }

  /* ---------- wire up ---------- */
  function init() {
    loadProfiles();
    applyTheme(); applyLang();

    $('#tables-all').onclick = () => { cfg().tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; saveProfiles(); renderTables(); renderTablesHint(); clearError(); };
    $('#tables-none').onclick = () => { cfg().tables = []; saveProfiles(); renderTables(); renderTablesHint(); };
    $('#count-custom').addEventListener('input', () => {
      const v = $('#count-custom').value.trim();
      if (v !== '') { cfg().count = Number(v); $$('#counts .chip').forEach(c => c.classList.remove('on')); }
      clearError();
    });
    $('#btn-start').onclick = startFromHome;

    $$('#keypad button').forEach(b => b.addEventListener('click', () => pressKey(b.dataset.key)));
    $('#mc-next').onclick = () => { if (round && round.answered) advance(); };
    document.addEventListener('keydown', e => {
      if (currentScreen() !== 'screen-quiz' || !round) return;
      if (!$('#sheet-backdrop').classList.contains('hidden')) return;
      if (round.mode === 'choice') {
        if (/^[1-4]$/.test(e.key)) chooseOption(Number(e.key) - 1);
        else if (e.key === 'Enter' && round.answered) { e.preventDefault(); advance(); }
        return;
      }
      if (/^\d$/.test(e.key)) pressKey(e.key);
      else if (e.key === 'Backspace') pressKey('back');
      else if (e.key === 'Enter') { e.preventDefault(); pressKey('enter'); }
    });
    $('#btn-quit').onclick = () => { if (confirm(t('confirmQuit'))) { round = null; show('screen-home'); } };

    $('#btn-toggle-answers').onclick = () => { $('#answers').classList.toggle('hidden'); updateToggleLabel(); };
    $('#btn-again').onclick = startRound;
    $('#btn-home').onclick = () => { round = null; show('screen-home'); renderHome(); };
    $('#btn-summary-progress').onclick = () => { renderProgress(); show('screen-progress'); };

    // progress
    $('#btn-open-progress').onclick = () => { renderProgress(); show('screen-progress'); };
    $('#btn-progress-back').onclick = () => { round = null; show('screen-home'); renderHome(); };
    $('#btn-reset-progress').onclick = () => {
      if (!confirm(t('confirmResetProgress'))) return;
      P().stats = emptyStats(); saveProfiles(); renderProgress();
    };

    // profiles
    $$('.profile-chip').forEach(c => c.addEventListener('click', openProfiles));
    $('#btn-add-profile').onclick = () => openEditor(null);
    $('#pe-save').onclick = saveEditor;
    $('#pe-cancel').onclick = () => { if (editing.first || !profiles.length) closeSheets(); else if (editing.id) openProfiles(); else openProfiles(); };
    $('#pe-delete').onclick = deleteEditing;
    $('#pe-name').addEventListener('keydown', e => { if (e.key === 'Enter') saveEditor(); });
    $('#btn-close-profiles').onclick = closeSheets;

    // settings
    $('#btn-open-settings').onclick = () => { updateSettingsUI(); openSheet('sheet-settings'); };
    $('#btn-close-settings').onclick = closeSheets;
    $('#sheet-backdrop').onclick = closeSheets;
    bindSegmented('set-lang', 'lang');
    bindSegmented('set-range', 'range', Number);
    bindSegmented('set-mult', 'multMax', Number);
    bindSegmented('set-theme', 'theme');
    $('#set-feedback').onchange = e => { settings.feedback = e.target.checked; saveSettings(); };
    $('#set-sound').onchange = e => { settings.sound = e.target.checked; saveSettings(); if (settings.sound) sfx.right(); };
    $('#btn-reset').onclick = () => {
      if (!confirm(t('confirmReset'))) return;
      const lang = settings.lang;
      settings = Object.assign({}, DEFAULT_SETTINGS, { lang: lang });
      saveSettings(); applyTheme(); applyLang();
    };
    if (window.matchMedia) matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

    if (firstRun) openEditor(activeId, true);

    if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})(typeof window !== 'undefined' ? window : globalThis);
