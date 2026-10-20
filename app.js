/* Math Kids v3.0.1
 * Pure logic (question generation, stats, streaks) is exported for Node tests.
 * UI code only runs in the browser.
 */
(function (root) {
  'use strict';

  /* ------------------------------------------------------------------ */
  /* Translations                                                        */
  /* ------------------------------------------------------------------ */
  const TR = {
    en: {
      appName: 'Math Kids', player: 'Player',
      practice: 'What do you want to practice?', add: 'Addition', sub: 'Subtraction', mul: 'Multiplication', div: 'Division',
      difficulty: 'Addition & subtraction difficulty', difficultyHint: 'Controls the number of digits in both numbers.',
      digit1: '1 digit', digit2: '2 digits', digit3: '3 digits',
      tables: 'Which tables?', all: 'All', none: 'None', questions: 'How many questions?', custom: 'Custom',
      answerMode: 'How do you want to answer?', type: 'Type it', choice: 'Multiple choice',
      start: 'Start', next: 'Next', finish: 'Finish', results: 'Results', correct: 'Correct', incorrect: 'Incorrect', time: 'Time',
      showAnswers: 'Show answers', hideAnswers: 'Hide answers', progress: 'Progress', again: 'Play again', home: 'Home',
      byOperation: 'By operation', byDifficulty: 'Addition & subtraction by difficulty', tableProgress: 'Tables (× and ÷)',
      recent: 'Recent rounds', noProgress: 'Play a round to start tracking progress.', rounds: 'Rounds', accuracy: 'Accuracy', streak: 'Day streak',
      profiles: 'Profiles', addProfile: '+ Add profile', newProfile: 'New profile', editProfile: 'Edit profile', name: 'Name',
      save: 'Save', cancel: 'Cancel', deleteProfile: 'Delete profile', settings: 'Settings', language: 'Language',
      instantFeedback: 'Show feedback after each question', sound: 'Sound effects', theme: 'Theme', auto: 'Auto', light: 'Light', dark: 'Dark',
      resetProgress: 'Reset progress', great: 'Great! ✔', oops: 'Not quite. The answer is', saved: 'Saved to',
      errOps: 'Pick at least one operation.', errTables: 'Pick at least one multiplication table.', errCount: 'Enter 1 to 100 questions.',
      perfect: 'Perfect score! 🌟', awesome: 'Awesome job! 🎉', effort: 'Good effort! Keep practicing. 💪', tryAgain: 'Try again, you can do it! 🚀',
      confirmQuit: 'Quit this round? It will not be saved.', confirmDelete: 'Delete this profile and its progress?',
      confirmReset: 'Erase this profile’s progress?', nameError: 'Enter a name.',
      aProfile: 'Switch profile', aProgress: 'Progress', aSettings: 'Settings', aQuit: 'Quit round', aBack: 'Back', aClose: 'Close'
    },
    es: {
      appName: 'Mate Kids', player: 'Jugador',
      practice: '¿Qué quieres practicar?', add: 'Suma', sub: 'Resta', mul: 'Multiplicación', div: 'División',
      difficulty: 'Dificultad de suma y resta', difficultyHint: 'Controla la cantidad de dígitos en ambos números.',
      digit1: '1 dígito', digit2: '2 dígitos', digit3: '3 dígitos',
      tables: '¿Qué tablas?', all: 'Todas', none: 'Ninguna', questions: '¿Cuántas preguntas?', custom: 'Otro',
      answerMode: '¿Cómo quieres responder?', type: 'Escribir', choice: 'Opción múltiple',
      start: 'Empezar', next: 'Siguiente', finish: 'Terminar', results: 'Resultados', correct: 'Correctas', incorrect: 'Incorrectas', time: 'Tiempo',
      showAnswers: 'Mostrar respuestas', hideAnswers: 'Ocultar respuestas', progress: 'Progreso', again: 'Jugar otra vez', home: 'Inicio',
      byOperation: 'Por operación', byDifficulty: 'Suma y resta por dificultad', tableProgress: 'Tablas (× y ÷)',
      recent: 'Rondas recientes', noProgress: 'Juega una ronda para empezar a registrar el progreso.', rounds: 'Rondas', accuracy: 'Precisión', streak: 'Días seguidos',
      profiles: 'Perfiles', addProfile: '+ Agregar perfil', newProfile: 'Nuevo perfil', editProfile: 'Editar perfil', name: 'Nombre',
      save: 'Guardar', cancel: 'Cancelar', deleteProfile: 'Eliminar perfil', settings: 'Ajustes', language: 'Idioma',
      instantFeedback: 'Mostrar resultado después de cada pregunta', sound: 'Efectos de sonido', theme: 'Tema', auto: 'Auto', light: 'Claro', dark: 'Oscuro',
      resetProgress: 'Borrar progreso', great: '¡Muy bien! ✔', oops: 'Casi. La respuesta es', saved: 'Guardado en',
      errOps: 'Elige al menos una operación.', errTables: 'Elige al menos una tabla.', errCount: 'Escribe entre 1 y 100 preguntas.',
      perfect: '¡Puntuación perfecta! 🌟', awesome: '¡Excelente trabajo! 🎉', effort: '¡Buen esfuerzo! Sigue practicando. 💪', tryAgain: '¡Inténtalo de nuevo, tú puedes! 🚀',
      confirmQuit: '¿Salir? Esta ronda no se guardará.', confirmDelete: '¿Eliminar este perfil y su progreso?',
      confirmReset: '¿Borrar el progreso de este perfil?', nameError: 'Escribe un nombre.',
      aProfile: 'Cambiar perfil', aProgress: 'Progreso', aSettings: 'Ajustes', aQuit: 'Salir de la ronda', aBack: 'Atrás', aClose: 'Cerrar'
    }
  };

  /* ------------------------------------------------------------------ */
  /* Pure logic (tested in test.js)                                      */
  /* ------------------------------------------------------------------ */
  const OPS = [['add', '+'], ['sub', '−'], ['mul', '×'], ['div', '÷']];
  const AV = ['🦊', '🐼', '🦁', '🐯', '🐸', '🐵', '🐙', '🦄', '🐶', '🐱', '🚀', '⚽'];
  const HISTORY_MAX = 50;
  const COUNT_PRESETS = [5, 10, 15, 20, 30];

  const emptyStats = () => ({ rounds: 0, questions: 0, correct: 0, ops: {}, digits: {}, tables: {}, days: [], history: [] });
  const defaultCfg = () => ({ ops: ['add'], digits: 1, tables: [2, 3, 4, 5], count: 10, mode: 'type' });
  const defaultName = (lang, n) => `${(TR[lang] || TR.en).player} ${n}`;
  const symbolOf = op => OPS.find(x => x[0] === op)[1];

  function bounds(d) { return d === 1 ? [1, 9] : d === 2 ? [10, 99] : [100, 999]; }
  function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

  function oneQuestion(op, c) {
    let a, b, answer, table = null;
    if (op === 'add') {
      const [lo, hi] = bounds(c.digits); a = ri(lo, hi); b = ri(lo, hi); answer = a + b;
    } else if (op === 'sub') {
      const [lo, hi] = bounds(c.digits); a = ri(lo, hi); b = ri(lo, hi);
      if (b > a) [a, b] = [b, a];
      answer = a - b;
    } else if (op === 'mul') {
      table = c.tables[ri(0, c.tables.length - 1)];
      const other = ri(1, 12);
      if (Math.random() < 0.5) { a = table; b = other; } else { a = other; b = table; }
      answer = a * b;
    } else {
      table = c.tables[ri(0, c.tables.length - 1)];
      b = table; answer = ri(1, 12); a = b * answer;
    }
    const q = { op, a, b, answer, table, digits: (op === 'add' || op === 'sub') ? c.digits : null, text: `${a} ${symbolOf(op)} ${b}` };
    if (c.mode === 'choice') q.choices = choices(answer, a, b);
    return q;
  }

  function choices(ans, a, b) {
    const s = new Set([ans]);
    const pool = [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3, ans - 3, ans + a, ans - a, ans + b, ans - b].filter(x => x >= 0 && x !== ans);
    while (s.size < 4) {
      let x = pool.length ? pool.splice(ri(0, pool.length - 1), 1)[0] : ans + ri(1, 10);
      s.add(x);
    }
    const out = [...s];
    for (let i = out.length - 1; i > 0; i--) { const j = ri(0, i); [out[i], out[j]] = [out[j], out[i]]; }
    return out;
  }

  function makeRound(c) {
    const qs = [], seen = new Set();
    for (let i = 0; i < c.count; i++) {
      let q, k = 0;
      do { q = oneQuestion(c.ops[ri(0, c.ops.length - 1)], c); k++; } while (seen.has(q.text) && k < 30);
      seen.add(q.text); qs.push(q);
    }
    return qs;
  }

  /** Returns a translation key for the first problem, or null if valid. */
  function validateConfig(c) {
    if (!c.ops || !c.ops.length) return 'errOps';
    if (c.ops.some(o => o === 'mul' || o === 'div') && !(c.tables && c.tables.length)) return 'errTables';
    if (!Number.isInteger(c.count) || c.count < 1 || c.count > 100) return 'errCount';
    return null;
  }

  const pad = n => String(n).padStart(2, '0');
  /** Local-time day key (YYYY-MM-DD). Previously used UTC, which broke evening streaks. */
  function dayKey(input = new Date()) {
    const d = new Date(input);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  }

  function streak(days, now = Date.now()) {
    const set = new Set(days), d = new Date(now);
    d.setHours(12, 0, 0, 0);
    if (!set.has(dayKey(d))) d.setDate(d.getDate() - 1);
    let n = 0;
    while (set.has(dayKey(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  }

  function bump(map, k, ok) { const e = map[k] || (map[k] = { n: 0, c: 0 }); e.n++; if (ok) e.c++; }

  /** Adds a finished round to a stats object (mutates and returns it). */
  function recordRound(s, results, meta) {
    s.rounds++;
    results.forEach(r => {
      s.questions++;
      if (r.ok) s.correct++;
      bump(s.ops, r.q.op, r.ok);
      if (r.q.digits) bump(s.digits, `${r.q.op}-${r.q.digits}`, r.ok);
      if (r.q.table) bump(s.tables, r.q.table, r.ok);
    });
    const day = dayKey(meta.ts);
    if (!s.days.includes(day)) s.days.push(day);
    s.history.push({ ts: meta.ts, correct: results.filter(r => r.ok).length, total: results.length, mode: meta.mode, digits: meta.digits });
    s.history = s.history.slice(-HISTORY_MAX);
    return s;
  }

  function percent(c, n) { return n ? Math.round(c / n * 100) : 0; }
  function level(e) {
    if (!e || !e.n) return 'noneLevel';
    const p = percent(e.c, e.n);
    return p >= 90 ? 'good' : p >= 70 ? 'mid' : 'low';
  }

  function normalizeProfile(p, lang) {
    const config = { ...defaultCfg(), ...(p.config || {}) };
    if (!Number.isInteger(config.count) || config.count < 1 || config.count > 100) config.count = 10;
    let name = p.name;
    if (!name || name === 'Player profile') name = defaultName(lang, 1); // fix v3 naming bug
    return { ...p, name, config, stats: { ...emptyStats(), ...(p.stats || {}) } };
  }

  const core = { TR, OPS, HISTORY_MAX, emptyStats, defaultCfg, defaultName, bounds, oneQuestion, choices, makeRound,
    validateConfig, dayKey, streak, recordRound, percent, level, normalizeProfile };
  if (typeof module !== 'undefined' && module.exports) module.exports = core;
  root.MathKidsTest = core;
  if (typeof document === 'undefined') return;

  /* ------------------------------------------------------------------ */
  /* Browser UI                                                          */
  /* ------------------------------------------------------------------ */
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  function load(k, d) { try { const v = localStorage.getItem('mk_' + k); return v ? JSON.parse(v) : d; } catch { return d; } }
  function save(k, v) { try { localStorage.setItem('mk_' + k, JSON.stringify(v)); } catch { /* storage full/blocked */ } }
  function uid() { return 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
  function esc(s) { const d = document.createElement('div'); d.textContent = s; return d.innerHTML; }

  let settings = { lang: (navigator.language || 'en').startsWith('es') ? 'es' : 'en', feedback: true, sound: true, theme: 'auto', ...load('settings', {}) };
  let profiles = load('profiles', null), active = load('active', null), round = null, editing = null, chosenAvatar = AV[0];
  if (!Array.isArray(profiles) || !profiles.length) {
    profiles = [{ id: uid(), name: defaultName(settings.lang, 1), avatar: AV[0], config: defaultCfg(), stats: emptyStats() }];
  }
  profiles = profiles.map(p => normalizeProfile(p, settings.lang));
  if (!profiles.some(p => p.id === active)) active = profiles[0].id;
  saveAll();

  function saveAll() { save('profiles', profiles); save('active', active); }
  function P() { return profiles.find(p => p.id === active); }
  function t(k) { return TR[settings.lang][k] || TR.en[k] || k; }

  function show(id) { $$('.screen').forEach(x => x.classList.toggle('active', x.id === id)); }
  function openSheet(id) { $$('.sheet').forEach(x => x.classList.toggle('hidden', x.id !== id)); $('#backdrop').classList.remove('hidden'); }
  function closeSheets() { $$('.sheet').forEach(x => x.classList.add('hidden')); $('#backdrop').classList.add('hidden'); }
  function progressVisible() { return $('#progressScreen').classList.contains('active'); }

  function applyText() {
    $$('[data-t]').forEach(x => { x.textContent = t(x.dataset.t); });
    $$('[data-ta]').forEach(x => x.setAttribute('aria-label', t(x.dataset.ta)));
    document.documentElement.lang = settings.lang;
    document.title = t('appName');
    renderHome(); renderProfileHeaders(); applySettingsUI();
  }

  const darkQuery = matchMedia('(prefers-color-scheme: dark)');
  function applyTheme() {
    const dark = settings.theme === 'dark' || (settings.theme === 'auto' && darkQuery.matches);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  }
  if (darkQuery.addEventListener) darkQuery.addEventListener('change', () => { if (settings.theme === 'auto') applyTheme(); });

  /* Sound: short tones via Web Audio, honours the Sound setting. */
  let actx = null;
  function beep(ok) {
    if (!settings.sound) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const now = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(ok ? 660 : 260, now);
      if (ok) o.frequency.setValueAtTime(880, now + 0.09);
      g.gain.setValueAtTime(0.12, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      o.connect(g); g.connect(actx.destination); o.start(now); o.stop(now + 0.26);
    } catch { /* audio unavailable */ }
  }

  function chip(content, on, fn, html) {
    const b = document.createElement('button');
    b.className = 'chip' + (on ? ' on' : '');
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    if (html) b.innerHTML = content; else b.textContent = content;
    b.onclick = fn;
    return b;
  }

  function renderHome() {
    const c = P().config;
    $('#ops').innerHTML = '';
    OPS.forEach(([o, s]) => $('#ops').append(chip(`<span class="symbol">${s}</span>${esc(t(o))}`, c.ops.includes(o), () => {
      c.ops = c.ops.includes(o) ? c.ops.filter(x => x !== o) : [...c.ops, o]; saveAll(); renderHome();
    }, true)));

    $('#difficultyCard').classList.toggle('hidden', !c.ops.some(o => o === 'add' || o === 'sub'));
    $('#digits').innerHTML = '';
    [1, 2, 3].forEach(d => $('#digits').append(chip(t('digit' + d), c.digits === d, () => { c.digits = d; saveAll(); renderHome(); })));

    $('#tablesCard').classList.toggle('hidden', !c.ops.some(o => o === 'mul' || o === 'div'));
    $('#tables').innerHTML = '';
    for (let n = 1; n <= 12; n++) $('#tables').append(chip(n, c.tables.includes(n), () => {
      c.tables = c.tables.includes(n) ? c.tables.filter(x => x !== n) : [...c.tables, n].sort((a, b) => a - b); saveAll(); renderHome();
    }));

    $('#counts').innerHTML = '';
    COUNT_PRESETS.forEach(n => $('#counts').append(chip(n, c.count === n, () => { c.count = n; $('#customCount').value = ''; saveAll(); renderHome(); })));
    $('#customCount').value = COUNT_PRESETS.includes(c.count) ? '' : c.count;

    $('#modes').innerHTML = '';
    [['type', '⌨️'], ['choice', '🔘']].forEach(([m, i]) => $('#modes').append(chip(`<span class="symbol">${i}</span>${esc(t(m))}`, c.mode === m, () => {
      c.mode = m; saveAll(); renderHome();
    }, true)));
  }

  function start() {
    const c = P().config, raw = $('#customCount').value.trim();
    const count = raw ? Number(raw) : c.count;
    const err = validateConfig({ ...c, count });
    $('#error').textContent = err ? t(err) : '';
    if (err) return; // invalid custom value is never written to the profile
    c.count = count; saveAll();
    round = { questions: makeRound(c), i: 0, results: [], start: Date.now(), answered: false, input: '' };
    show('quiz'); renderQuestion();
  }

  function renderQuestion() {
    const q = round.questions[round.i], mc = P().config.mode === 'choice';
    round.answered = false; round.input = '';
    $('#qText').textContent = q.text; $('#qAnswer').textContent = '?'; $('#feedback').textContent = '';
    $('#nextBtn').classList.add('hidden');
    $('#choices').innerHTML = ''; $('#keypad').innerHTML = '';
    $('#choices').classList.toggle('hidden', !mc); $('#keypad').classList.toggle('hidden', mc);
    if (mc) {
      q.choices.forEach(v => {
        const b = document.createElement('button'); b.className = 'choice'; b.textContent = v; b.onclick = () => submit(v, b); $('#choices').append(b);
      });
    } else {
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', '✓'].forEach(k => {
        const b = document.createElement('button'); b.textContent = k; if (k === '✓') b.className = 'enter';
        if (k === '⌫') b.setAttribute('aria-label', 'Backspace'); if (k === '✓') b.setAttribute('aria-label', 'Enter');
        b.onclick = () => key(k); $('#keypad').append(b);
      });
    }
    updateQuizMeta();
  }

  function key(k) {
    if (round.answered) { if (k === '✓') advance(); return; }
    if (k === '⌫') round.input = round.input.slice(0, -1);
    else if (k === '✓') { if (round.input !== '') submit(Number(round.input)); return; }
    else if (round.input.length < 6) round.input += k;
    $('#qAnswer').textContent = round.input || '?';
  }

  function submit(v, btn) {
    if (round.answered) return;
    const q = round.questions[round.i], ok = v === q.answer;
    round.results.push({ q, given: v, ok }); round.answered = true;
    $('#qAnswer').textContent = v;
    beep(ok);
    if (settings.feedback) {
      $('#feedback').textContent = ok ? t('great') : `${t('oops')} ${q.answer}`;
      if (P().config.mode === 'choice') $$('#choices .choice').forEach(b => {
        b.disabled = true;
        if (Number(b.textContent) === q.answer) b.classList.add('right'); else if (b === btn) b.classList.add('wrong');
      });
      $('#nextBtn').textContent = round.i === round.questions.length - 1 ? t('finish') : t('next');
      $('#nextBtn').classList.remove('hidden');
    } else advance();
    updateQuizMeta();
  }

  function updateQuizMeta() {
    if (!round) return;
    $('#progressText').textContent = `${round.i + 1} / ${round.questions.length}`;
    $('#progressBar').style.width = `${round.i / round.questions.length * 100}%`;
    $('#liveScore').textContent = '⭐ ' + round.results.filter(r => r.ok).length;
  }
  function advance() { if (round.i === round.questions.length - 1) { finish(); return; } round.i++; renderQuestion(); }

  function finish() {
    round.end = Date.now();
    const c = P().config;
    recordRound(P().stats, round.results, { ts: round.end, mode: c.mode, digits: c.digits });
    saveAll(); show('summary'); $('#answers').classList.add('hidden'); renderSummary();
  }

  function renderSummary() {
    const right = round.results.filter(r => r.ok).length, total = round.results.length, p = percent(right, total);
    const stars = p >= 90 ? 3 : p >= 60 ? 2 : p >= 30 ? 1 : 0;
    $('#stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    $('#scoreBig').textContent = `${right} / ${total}`;
    $('#scoreMsg').textContent = t(p === 100 ? 'perfect' : p >= 80 ? 'awesome' : p >= 50 ? 'effort' : 'tryAgain');
    $('#sCorrect').textContent = right; $('#sWrong').textContent = total - right;
    const sec = Math.round((round.end - round.start) / 1000);
    $('#sTime').textContent = `${Math.floor(sec / 60)}:${pad(sec % 60)}`;
    $('#savedTo').textContent = `${t('saved')} ${P().avatar} ${P().name}`;
    $('#answers').innerHTML = round.results.map(r => `<div class="answerRow"><b>${r.ok ? '✔' : '✘'}</b><span class="grow">${esc(r.q.text)} = ${r.q.answer}</span>${r.ok ? '' : `<small><s>${r.given}</s></small>`}</div>`).join('');
    $('#answersBtn').textContent = t('showAnswers');
  }

  function statRow(label, e) {
    const p = e ? percent(e.c, e.n) : 0;
    return `<div class="statRow"><b>${label}</b><div class="meter grow"><i class="${level(e)}" style="width:${p}%"></i></div><span>${e ? `${p}% (${e.c}/${e.n})` : '–'}</span></div>`;
  }

  function renderProgress() {
    renderProfileHeaders();
    const s = P().stats, has = s.rounds > 0;
    $('#emptyProgress').classList.toggle('hidden', has); $('#progressBody').classList.toggle('hidden', !has); $('#resetProgress').classList.toggle('hidden', !has);
    if (!has) return;
    $('#tiles').innerHTML = [[s.rounds, t('rounds')], [s.questions, t('questions')], [percent(s.correct, s.questions) + '%', t('accuracy')], ['🔥 ' + streak(s.days), t('streak')]]
      .map(x => `<div class="tile"><b>${x[0]}</b><small>${x[1]}</small></div>`).join('');
    $('#opStats').innerHTML = OPS.map(([o, sym]) => statRow(`${sym} ${t(o)}`, s.ops[o])).join('');
    $('#difficultyStats').innerHTML = [['add', 1], ['add', 2], ['add', 3], ['sub', 1], ['sub', 2], ['sub', 3]]
      .map(([o, d]) => statRow(`${symbolOf(o)} ${t('digit' + d)}`, s.digits[`${o}-${d}`])).join('');
    $('#tableStats').innerHTML = '';
    for (let n = 1; n <= 12; n++) {
      const e = s.tables[n], d = document.createElement('div');
      d.className = 'tableCell ' + level(e); d.innerHTML = `${n}<small>${e ? percent(e.c, e.n) + '%' : '–'}</small>`;
      $('#tableStats').append(d);
    }
    $('#recent').innerHTML = s.history.slice(-10).reverse().map(h => `<div class="recentRow"><span class="grow">${new Date(h.ts).toLocaleDateString(settings.lang)} · ${h.mode === 'choice' ? '🔘' : '⌨️'}</span><b>${h.correct}/${h.total}</b><span>${percent(h.correct, h.total)}%</span></div>`).join('');
  }

  function renderProfileHeaders() { $$('.profile').forEach(b => { b.firstChild.textContent = P().avatar + ' '; b.querySelector('span').textContent = P().name; }); }
  function refreshAfterProfileChange() { renderHome(); renderProfileHeaders(); if (progressVisible()) renderProgress(); }
  function openProfiles() { renderProfiles(); openSheet('profilesSheet'); }

  function renderProfiles() {
    $('#profileList').innerHTML = '';
    profiles.forEach(p => {
      const d = document.createElement('div'); d.className = 'profileRow';
      d.innerHTML = `<span class="avatar">${p.avatar}</span><button class="selectProfile">${esc(p.name)} ${p.id === active ? '✓' : ''}</button><button class="edit" aria-label="${esc(t('editProfile'))}">✏️</button>`;
      d.querySelector('.selectProfile').onclick = () => { active = p.id; saveAll(); closeSheets(); refreshAfterProfileChange(); };
      d.querySelector('.edit').onclick = () => openEditor(p.id);
      $('#profileList').append(d);
    });
  }

  function openEditor(pid = null) {
    editing = pid;
    const p = profiles.find(x => x.id === pid);
    chosenAvatar = p ? p.avatar : AV[profiles.length % AV.length];
    $('#editorTitle').textContent = t(pid ? 'editProfile' : 'newProfile');
    $('#profileName').value = p ? p.name : '';
    $('#profileError').textContent = '';
    $('#deleteProfile').classList.toggle('hidden', !pid || profiles.length === 1);
    renderAvatars(); openSheet('editorSheet');
  }

  function renderAvatars() {
    $('#avatars').innerHTML = '';
    AV.forEach(a => {
      const b = document.createElement('button'); b.className = 'avatarBtn' + (a === chosenAvatar ? ' on' : ''); b.textContent = a;
      b.onclick = () => { chosenAvatar = a; renderAvatars(); }; $('#avatars').append(b);
    });
  }

  function saveProfile() {
    const name = $('#profileName').value.trim();
    if (!name) { $('#profileError').textContent = t('nameError'); return; }
    if (editing) { const p = profiles.find(x => x.id === editing); p.name = name; p.avatar = chosenAvatar; }
    else { const p = { id: uid(), name, avatar: chosenAvatar, config: defaultCfg(), stats: emptyStats() }; profiles.push(p); active = p.id; }
    saveAll(); closeSheets(); refreshAfterProfileChange();
  }

  function applySettingsUI() {
    $$('[data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === settings.lang));
    $$('[data-theme]').forEach(b => b.classList.toggle('on', b.dataset.theme === settings.theme));
    $('#feedbackToggle').checked = settings.feedback; $('#soundToggle').checked = settings.sound;
  }

  /* ----- event wiring ----- */
  $('#allTables').onclick = () => { P().config.tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; saveAll(); renderHome(); };
  $('#noTables').onclick = () => { P().config.tables = []; saveAll(); renderHome(); };
  $('#customCount').oninput = () => { $('#error').textContent = ''; };
  $('#startBtn').onclick = start;
  $('#nextBtn').onclick = advance;
  $('#quitBtn').onclick = () => { if (confirm(t('confirmQuit'))) { round = null; show('home'); } };
  $('#answersBtn').onclick = () => { const h = $('#answers').classList.toggle('hidden'); $('#answersBtn').textContent = t(h ? 'showAnswers' : 'hideAnswers'); };
  $('#againBtn').onclick = start;
  $('#homeBtn').onclick = () => show('home');
  $('#progressBtn').onclick = () => { renderProgress(); show('progressScreen'); };
  $('#summaryProgress').onclick = () => { renderProgress(); show('progressScreen'); };
  $('#progressBack').onclick = () => show('home');
  $('#profileBtn').onclick = openProfiles;
  $('#progressProfile').onclick = openProfiles;
  $('#addProfile').onclick = () => openEditor();
  $('#saveProfile').onclick = saveProfile;
  $('#cancelProfile').onclick = openProfiles;
  $('#deleteProfile').onclick = () => {
    if (editing && confirm(t('confirmDelete'))) {
      profiles = profiles.filter(p => p.id !== editing);
      if (active === editing) active = profiles[0].id;
      saveAll(); openProfiles(); refreshAfterProfileChange();
    }
  };
  $('#settingsBtn').onclick = () => { applySettingsUI(); openSheet('settingsSheet'); };
  $('#backdrop').onclick = closeSheets;
  $$('.close').forEach(b => { b.onclick = closeSheets; });
  $$('[data-lang]').forEach(b => { b.onclick = () => { settings.lang = b.dataset.lang; save('settings', settings); applyText(); }; });
  $$('[data-theme]').forEach(b => { b.onclick = () => { settings.theme = b.dataset.theme; save('settings', settings); applyTheme(); applySettingsUI(); }; });
  $('#feedbackToggle').onchange = e => { settings.feedback = e.target.checked; save('settings', settings); };
  $('#soundToggle').onchange = e => { settings.sound = e.target.checked; save('settings', settings); if (settings.sound) beep(true); };
  $('#resetProgress').onclick = () => { if (confirm(t('confirmReset'))) { P().stats = emptyStats(); saveAll(); renderProgress(); } };

  /* Physical keyboard: digits / Backspace / Enter in typed mode, 1–4 in multiple choice, Esc closes sheets. */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !$('#backdrop').classList.contains('hidden')) { closeSheets(); return; }
    if (!round || !$('#quiz').classList.contains('active') || !$('#backdrop').classList.contains('hidden')) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const mc = P().config.mode === 'choice';
    if (e.key === 'Enter') {
      e.preventDefault();
      if (round.answered) { if (settings.feedback) advance(); } else if (!mc) key('✓');
      return;
    }
    if (mc) {
      const i = Number(e.key) - 1, btns = $$('#choices .choice');
      if (!round.answered && i >= 0 && i < btns.length) btns[i].click();
      return;
    }
    if (/^[0-9]$/.test(e.key)) key(e.key);
    else if (e.key === 'Backspace') { e.preventDefault(); key('⌫'); }
  });

  applyTheme(); applyText();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
})(typeof globalThis !== 'undefined' ? globalThis : this);
