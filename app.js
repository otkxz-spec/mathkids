/* Math Kids v3.0.1
 * Pure logic (question generation, stats, streaks) is exported for Node tests.
 * UI code only runs in the browser.
 */
(function (root) {
  'use strict';

  /** Keep in sync with VERSION in sw.js (test.js enforces this). */
  const APP_VERSION = '3.2.1';

  /* ------------------------------------------------------------------ */
  /* Translations                                                        */
  /* ------------------------------------------------------------------ */
  const TR = {
    en: {
      appName: 'Math Kids', player: 'Player', version: 'Version',
      practice: 'What do you want to practice?', add: 'Addition', sub: 'Subtraction', mul: 'Multiplication', div: 'Division', pv: 'Place value',
      difficulty: 'Addition & subtraction difficulty', difficultyHint: 'Controls the number of digits in both numbers (or round hundreds like 200 + 300).',
      digit1: '1 digit', digit2: '2 digits', digit3: '3 digits', digit100: '100s (200+300)',
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
      aProfile: 'Switch profile', aProgress: 'Progress', aSettings: 'Settings', aQuit: 'Quit round', aBack: 'Back', aClose: 'Close',
      practiceMode: 'Practice', quizMode: 'Quiz', feedbackModeHint: 'Practice: one more try after a mistake. Quiz: one try, then the explanation.',
      retryPrompt: 'Not quite — try again!', gotItRetry: 'Got it on the second try! ✔', showMe: 'Show me',
      firstTry: 'First try', onRetry: 'On retry', unresolved: 'Unresolved',
      xMakeTen: 'Make 10:', xCountOn: 'Count on:', xColumns: 'Ones first, then tens:', xThinkAdd: 'Think addition:', xCountBack: 'Count back:',
      xGroups: 'Equal groups:', xSplit: 'Split it:', xInverse: 'Use multiplication:', xSkipCount: 'Skip count:', xResult: 'Answer:',
      xHundreds: 'Count the hundreds:', xPlaceValue: 'Place value:',
      pOnes: 'Ones:', pTens: 'Tens:', pHundreds: 'Hundreds:', pThousands: 'Thousands:', carryOne: '→ carry 1', borrowed: '(borrowed 10)',
      exploreTitle: 'Place-value blocks', exploreOpen: '🧱 Explore blocks (units, tens, hundreds, thousands)',
      exploreHint: 'Tap + to add blocks. 10 of one unit automatically trade for 1 of the next!',
      uOne: 'Unit (1)', uTen: 'Ten (10)', uHundred: 'Hundred (100)', uThousand: 'Thousand (1,000)',
      eqTen: '10 units = 1 ten', eqHundred: '10 tens = 1 hundred (100)', eqThousand: '10 hundreds = 1 thousand (1,000)',
      trade10: '✨ 10 units → 1 ten!', trade100: '✨ 10 tens → 1 hundred!', trade1000: '✨ 10 hundreds → 1 thousand!',
      clearBlocks: 'Clear', randomNumber: 'Random number', quizBlocks: 'Practice quiz',
      pvWhatNumber: 'How many of each block are there?',
      pvHowMany1: 'How many of each unit are in {n}?', pvHowMany10: 'How many tens are in {n}?',
      pvHowMany100: 'How many hundreds are in {n}?', pvHowMany1000: 'How many thousands are in {n}?',
      pvEquiv10: '1 ten = ? units', pvEquiv100: '1 hundred = ? tens', pvEquiv100b: '1 hundred = ? units',
      pvEquiv1000: '1 thousand = ? hundreds', pvEquiv1000b: '1 thousand = ? units'
    },
    es: {
      appName: 'Mate Kids', player: 'Jugador', version: 'Versión',
      practice: '¿Qué quieres practicar?', add: 'Suma', sub: 'Resta', mul: 'Multiplicación', div: 'División', pv: 'Valor posicional',
      difficulty: 'Dificultad de suma y resta', difficultyHint: 'Controla la cantidad de dígitos en ambos números (o centenas exactas como 200 + 300).',
      digit1: '1 dígito', digit2: '2 dígitos', digit3: '3 dígitos', digit100: 'Centenas (200+300)',
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
      aProfile: 'Cambiar perfil', aProgress: 'Progreso', aSettings: 'Ajustes', aQuit: 'Salir de la ronda', aBack: 'Atrás', aClose: 'Cerrar',
      practiceMode: 'Práctica', quizMode: 'Examen', feedbackModeHint: 'Práctica: un intento más después de un error. Examen: un intento y luego la explicación.',
      retryPrompt: 'Casi — ¡inténtalo otra vez!', gotItRetry: '¡Lo lograste en el segundo intento! ✔', showMe: 'Muéstrame',
      firstTry: 'Al primer intento', onRetry: 'Al reintentar', unresolved: 'Sin resolver',
      xMakeTen: 'Forma 10:', xCountOn: 'Cuenta hacia adelante:', xColumns: 'Primero unidades, luego decenas:', xThinkAdd: 'Piensa en una suma:', xCountBack: 'Cuenta hacia atrás:',
      xGroups: 'Grupos iguales:', xSplit: 'Divídelo:', xInverse: 'Usa la multiplicación:', xSkipCount: 'Cuenta saltando:', xResult: 'Respuesta:',
      xHundreds: 'Cuenta las centenas:', xPlaceValue: 'Valor posicional:',
      pOnes: 'Unidades:', pTens: 'Decenas:', pHundreds: 'Centenas:', pThousands: 'Millares:', carryOne: '→ llevas 1', borrowed: '(pediste 10)',
      exploreTitle: 'Bloques de valor posicional', exploreOpen: '🧱 Explorar bloques (unidades, decenas, centenas, millares)',
      exploreHint: 'Toca + para agregar bloques. ¡10 de una unidad se cambian automáticamente por 1 de la siguiente!',
      uOne: 'Unidad (1)', uTen: 'Decena (10)', uHundred: 'Centena (100)', uThousand: 'Millar (1,000)',
      eqTen: '10 unidades = 1 decena', eqHundred: '10 decenas = 1 centena (100)', eqThousand: '10 centenas = 1 millar (1,000)',
      trade10: '✨ ¡10 unidades → 1 decena!', trade100: '✨ ¡10 decenas → 1 centena!', trade1000: '✨ ¡10 centenas → 1 millar!',
      clearBlocks: 'Limpiar', randomNumber: 'Número al azar', quizBlocks: 'Practicar',
      pvWhatNumber: '¿Cuántos bloques hay de cada tipo?',
      pvHowMany1: '¿Cuántos hay de cada unidad en {n}?', pvHowMany10: '¿Cuántas decenas hay en {n}?',
      pvHowMany100: '¿Cuántas centenas hay en {n}?', pvHowMany1000: '¿Cuántos millares hay en {n}?',
      pvEquiv10: '1 decena = ? unidades', pvEquiv100: '1 centena = ? decenas', pvEquiv100b: '1 centena = ? unidades',
      pvEquiv1000: '1 millar = ? centenas', pvEquiv1000b: '1 millar = ? unidades'
    }
  };

  /* ------------------------------------------------------------------ */
  /* Pure logic (tested in test.js)                                      */
  /* ------------------------------------------------------------------ */
  const OPS = [['add', '+'], ['sub', '−'], ['mul', '×'], ['div', '÷'], ['pv', '🧱']];
  const AV = ['🦊', '🐼', '🦁', '🐯', '🐸', '🐵', '🐙', '🦄', '🐶', '🐱', '🚀', '⚽'];
  const HISTORY_MAX = 50;
  const COUNT_PRESETS = [5, 10, 15, 20, 30];
  const DIGIT_LEVELS = [1, 2, 3, 100];

  const emptyStats = () => ({ rounds: 0, questions: 0, correct: 0, firstTry: 0, retry: 0, ops: {}, digits: {}, tables: {}, days: [], history: [] });
  const defaultCfg = () => ({ ops: ['add'], digits: 1, tables: [2, 3, 4, 5], count: 10, mode: 'type', feedbackMode: 'practice' });
  const defaultName = (lang, n) => `${(TR[lang] || TR.en).player} ${n}`;
  const symbolOf = op => OPS.find(x => x[0] === op)[1];

  function bounds(d) { return d === 1 ? [1, 9] : d === 2 ? [10, 99] : [100, 999]; }
  function ri(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

  /** Breaks a number (0..9999) into place-value block counts. */
  function decompose(n) {
    return { th: Math.floor(n / 1000) % 10, h: Math.floor(n / 100) % 10, t: Math.floor(n / 10) % 10, u: n % 10 };
  }

  /**
   * Adds or removes one block in the explorer and performs 10-for-1 trading.
   * Returns { th, h, t, u, value, traded: null | 'trade10' | 'trade100' | 'trade1000' }.
   */
  function stepBlocks(state, place, delta) {
    const s = { th: state.th || 0, h: state.h || 0, t: state.t || 0, u: state.u || 0 };
    s[place] = Math.max(0, s[place] + delta);
    let traded = null;
    if (s.u >= 10) { s.t += Math.floor(s.u / 10); s.u %= 10; traded = 'trade10'; }
    if (s.t >= 10) { s.h += Math.floor(s.t / 10); s.t %= 10; traded = 'trade100'; }
    if (s.h >= 10 && s.th < 9) { const c = Math.min(9 - s.th, Math.floor(s.h / 10)); s.th += c; s.h -= c * 10; traded = 'trade1000'; }
    s.th = Math.min(9, s.th); s.h = Math.min(9, s.h);
    s.value = s.th * 1000 + s.h * 100 + s.t * 10 + s.u;
    s.traded = traded;
    return s;
  }

  const PV_EQUIVS = [
    ['pvEquiv10', 10, 1, 10],
    ['pvEquiv100', 10, 10, 100],
    ['pvEquiv100b', 100, 1, 100],
    ['pvEquiv1000', 10, 100, 1000],
    ['pvEquiv1000b', 1000, 1, 1000]
  ];

  function onePlaceValueQuestion(c) {
    const hasTh = Math.random() < 0.45;
    const n = (hasTh ? ri(1, 3) * 1000 : 0) + ri(0, 5) * 100 + ri(0, 5) * 10 + ri(1, 6);
    const blk = decompose(n), places = hasTh ? ['th', 'h', 't', 'u'] : ['h', 't', 'u'];
    const q = { op: 'pv', pvKind: 'blocks', pvPlaces: places, a: n, b: 0, answer: n, blocks: blk, promptKey: 'pvWhatNumber', table: null, digits: null, text: `🧱 ${n}` };
    if (c.mode === 'choice') q.choices = choices(n, 10, 100);
    return q;
  }

  function oneQuestion(op, c) {
    if (op === 'pv') return onePlaceValueQuestion(c);
    let a, b, answer, table = null;
    if (op === 'add') {
      if (c.digits === 100) { a = ri(1, 9) * 100; b = ri(1, 9) * 100; }
      else { const [lo, hi] = bounds(c.digits); a = ri(lo, hi); b = ri(lo, hi); }
      answer = a + b;
    } else if (op === 'sub') {
      if (c.digits === 100) { a = ri(1, 9) * 100; b = ri(1, 9) * 100; }
      else { const [lo, hi] = bounds(c.digits); a = ri(lo, hi); b = ri(lo, hi); }
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
    const step = (ans % 100 === 0 && a >= 100 && b >= 100 && a % 100 === 0 && b % 100 === 0) ? 100 : 1;
    const pool = [ans + step, ans - step, ans + 2 * step, ans - 2 * step, ans + 3 * step, ans - 3 * step, ans + a, ans - a, ans + b, ans - b].filter(x => x >= 0 && x !== ans);
    while (s.size < 4) {
      let x = pool.length ? pool.splice(ri(0, pool.length - 1), 1)[0] : ans + ri(1, 10) * step;
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

  /* ----- Retry & explanation (3.1.1) ----- */

  /**
   * Registers one answer attempt on a result record {q, given:[], outcome, ok}.
   * outcome: null (retry pending) | 'first' | 'retry' | 'unresolved'.
   * Once resolved, further attempts are ignored (no point farming).
   */
  function attempt(rec, value, allowRetry) {
    if (rec.outcome) return rec;
    rec.given.push(value);
    if (value === rec.q.answer) rec.outcome = rec.given.length === 1 ? 'first' : 'retry';
    else if (!(allowRetry && rec.given.length < 2)) rec.outcome = 'unresolved';
    rec.ok = rec.outcome === 'first' || rec.outcome === 'retry';
    return rec;
  }

  /** Legacy results (pre-3.1) have no outcome: treat ok as first-try. */
  const outcomeOf = r => r.outcome || (r.ok ? 'first' : 'unresolved');

  /** First-try correct = 1 point, retry correct = 0.5. */
  function scoreRound(results) {
    const first = results.filter(r => outcomeOf(r) === 'first').length;
    const retry = results.filter(r => outcomeOf(r) === 'retry').length;
    const total = results.length, points = first + retry * 0.5;
    return { first, retry, unresolved: total - first - retry, total, points, pct: percent(points, total) };
  }

  const PLACE_KEYS = ['pOnes', 'pTens', 'pHundreds', 'pThousands'];
  const digitsOf = n => String(n).split('').reverse().map(Number);

  function columnAdd(a, b) {
    const A = digitsOf(a), B = digitsOf(b), steps = [];
    let carry = 0;
    for (let i = 0; i < Math.max(A.length, B.length); i++) {
      const x = A[i] || 0, y = B[i] || 0, s = x + y + carry;
      steps.push({ k: PLACE_KEYS[i], v: `${x} + ${y}${carry ? ' + ' + carry : ''} = ${s}`, carry: s >= 10 });
      carry = s >= 10 ? 1 : 0;
    }
    if (carry) steps.push({ k: PLACE_KEYS[A.length > B.length ? A.length : B.length], v: '1' });
    return steps;
  }

  function columnSub(a, b) {
    const A = digitsOf(a), B = digitsOf(b), steps = [];
    let borrow = 0;
    for (let i = 0; i < A.length; i++) {
      let x = A[i] - borrow; const y = B[i] || 0, borrowed = x < y;
      if (borrowed) x += 10;
      borrow = borrowed ? 1 : 0;
      if (i >= B.length && i === A.length - 1 && x === 0) break; // no leading zero column
      steps.push({ k: PLACE_KEYS[i], v: `${x} − ${y} = ${x - y}`, borrow: borrowed });
    }
    return steps;
  }

  const seq = (from, to, step = 1) => { const out = []; for (let n = from; step > 0 ? n <= to : n >= to; n += step) out.push(n); return out; };

  /**
   * Short, language-neutral explanation for a question.
   * Returns { key, line, steps:[{k, v, carry?, borrow?}] }; key/k are TR keys.
   */
  function explain(q) {
    const { op, a, b, answer: ans } = q, result = { k: 'xResult', v: `${q.text} = ${ans}` };
    if (op === 'pv') {
      if (q.pvKind === 'equiv') return { key: 'xPlaceValue', line: `${ans} × ${b} = ${a}`, steps: [result] };
      const blk = q.blocks || decompose(a);
      const parts = [blk.th * 1000, blk.h * 100, blk.t * 10, blk.u].filter(x => x > 0);
      const sumLine = parts.length > 1 ? `${parts.join(' + ')} = ${a}` : `${a} = ${a}`;
      const placeSteps = [['pThousands', blk.th], ['pHundreds', blk.h], ['pTens', blk.t], ['pOnes', blk.u]]
        .filter(([, v]) => v > 0 || q.pvKind === 'digit')
        .map(([k, v]) => ({ k, v: String(v) }));
      return { key: 'xPlaceValue', line: q.pvKind === 'blocks' ? sumLine : `${sumLine} → ${ans}`, steps: [...placeSteps, result] };
    }
    if (op === 'add') {
      if (q.digits === 100) {
        const ha = a / 100, hb = b / 100, hs = ans / 100;
        return { key: 'xHundreds', line: `${ha} + ${hb} = ${hs} → ${ans}`, steps: [{ k: 'pHundreds', v: `${ha} + ${hb} = ${hs}` }, result] };
      }
      if (a < 10 && b < 10) {
        const big = Math.max(a, b), small = Math.min(a, b);
        if (ans > 10) {
          const need = 10 - big;
          return { key: 'xMakeTen', line: `${big} + ${need} = 10, 10 + ${small - need} = ${ans}`, steps: [result] };
        }
        return { key: 'xCountOn', line: `${big} → ${seq(big + 1, ans).join(', ')}`, steps: [result] };
      }
      const steps = columnAdd(a, b);
      return { key: 'xColumns', line: `${steps.filter(s => s.v.includes('=')).map(s => s.v).join(', ')} → ${ans}`, steps: [...steps, result] };
    }
    if (op === 'sub') {
      if (q.digits === 100) {
        const ha = a / 100, hb = b / 100, hs = ans / 100;
        return { key: 'xHundreds', line: `${ha} − ${hb} = ${hs} → ${ans}`, steps: [{ k: 'pHundreds', v: `${ha} − ${hb} = ${hs}` }, result] };
      }
      const line = `${b} + ${ans} = ${a}`;
      if (a < 20 && b < 10) return { key: 'xThinkAdd', line, steps: [{ k: 'xCountBack', v: `${a} → ${seq(a - 1, ans, -1).join(', ')}` }, result] };
      return { key: 'xThinkAdd', line, steps: [...columnSub(a, b), result] };
    }
    if (op === 'mul') {
      const t = q.table || b, o = a === t ? b : a;
      if (o <= 5) {
        const line = o === 1 ? `1 × ${t} = ${ans}` : `${Array(o).fill(t).join(' + ')} = ${ans}`;
        return { key: 'xGroups', line, steps: [result] };
      }
      const line = `${t} × 5 + ${t} × ${o - 5} = ${t * 5} + ${t * (o - 5)} = ${ans}`;
      return { key: 'xSplit', line, steps: [{ k: 'xGroups', v: `${o} × ${t}` }, result] };
    }
    // division
    return { key: 'xInverse', line: `${b} × ${ans} = ${a}`, steps: [{ k: 'xSkipCount', v: seq(b, a, b).join(', ') }, result] };
  }

  /** Adds a finished round to a stats object (mutates and returns it). */
  function recordRound(s, results, meta) {
    s.rounds++;
    s.firstTry = s.firstTry || 0; s.retry = s.retry || 0;
    results.forEach(r => {
      s.questions++;
      if (r.ok) s.correct++;
      const o = outcomeOf(r);
      if (o === 'first') s.firstTry++; else if (o === 'retry') s.retry++;
      bump(s.ops, r.q.op, r.ok);
      if (r.q.digits) bump(s.digits, `${r.q.op}-${r.q.digits}`, r.ok);
      if (r.q.table) bump(s.tables, r.q.table, r.ok);
    });
    const day = dayKey(meta.ts), sc = scoreRound(results);
    if (!s.days.includes(day)) s.days.push(day);
    s.history.push({ ts: meta.ts, correct: sc.first + sc.retry, firstTry: sc.first, retry: sc.retry, total: results.length, mode: meta.mode, feedbackMode: meta.feedbackMode, digits: meta.digits });
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
    if (!DIGIT_LEVELS.includes(config.digits)) config.digits = 1;
    if (config.feedbackMode !== 'practice' && config.feedbackMode !== 'quiz') config.feedbackMode = 'practice';
    let name = p.name;
    if (!name || name === 'Player profile') name = defaultName(lang, 1); // fix v3 naming bug
    return { ...p, name, config, stats: { ...emptyStats(), ...(p.stats || {}) } };
  }

  const core = { APP_VERSION, TR, OPS, DIGIT_LEVELS, HISTORY_MAX, emptyStats, defaultCfg, defaultName, bounds, decompose, stepBlocks,
    oneQuestion, choices, makeRound, validateConfig, dayKey, streak, recordRound, percent, level, normalizeProfile, attempt, scoreRound, explain };
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
    $('#appVersion').textContent = `${t('version')} ${APP_VERSION}`;
    renderHome(); renderProfileHeaders(); applySettingsUI();
    if ($('#exploreScreen').classList.contains('active')) renderExplore();
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
    DIGIT_LEVELS.forEach(d => $('#digits').append(chip(t('digit' + d), c.digits === d, () => { c.digits = d; saveAll(); renderHome(); })));

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

    $('#feedbackModes').innerHTML = '';
    [['practice', '🌱', 'practiceMode'], ['quiz', '📝', 'quizMode']].forEach(([m, i, k]) => $('#feedbackModes').append(chip(`<span class="symbol">${i}</span>${esc(t(k))}`, c.feedbackMode === m, () => {
      c.feedbackMode = m; saveAll(); renderHome();
    }, true)));
  }

  function start() {
    const c = P().config, raw = $('#customCount').value.trim();
    const count = raw ? Number(raw) : c.count;
    const err = validateConfig({ ...c, count });
    $('#error').textContent = err ? t(err) : '';
    if (err) return; // invalid custom value is never written to the profile
    c.count = count; saveAll();
    round = { questions: makeRound(c), i: 0, results: [], current: null, start: Date.now(), answered: false, input: '' };
    show('quiz'); renderQuestion();
  }

  /* Base-ten blocks rendering (1000 cube, 100 flat, 10 rod, 1 unit). */
  function blockSVG(kind) {
    if (kind === 'th') {
      let lines = '';
      for (let i = 1; i < 10; i++) {
        const p = i * 3.6;
        lines += `<line x1="${p}" y1="12" x2="${p}" y2="48"/><line x1="0" y1="${12 + p}" x2="36" y2="${12 + p}"/>`;
        lines += `<line x1="${p}" y1="12" x2="${p + 12}" y2="0"/><line x1="${i * 1.2}" y1="${12 - i * 1.2}" x2="${36 + i * 1.2}" y2="${12 - i * 1.2}"/>`;
        lines += `<line x1="36" y1="${12 + p}" x2="48" y2="${p}"/><line x1="${36 + i * 1.2}" y1="${12 - i * 1.2}" x2="${36 + i * 1.2}" y2="${48 - i * 1.2}"/>`;
      }
      return `<svg class="blk blk-th" viewBox="-1 -1 50 50" aria-hidden="true"><polygon class="face-top" points="0,12 12,0 48,0 36,12"/><polygon class="face-side" points="36,12 48,0 48,36 36,48"/><rect class="face-front" x="0" y="12" width="36" height="36"/><g class="gridlines">${lines}</g></svg>`;
    }
    if (kind === 'h') {
      let lines = '';
      for (let i = 1; i < 10; i++) { const p = i * 3.4; lines += `<line x1="${p}" y1="0" x2="${p}" y2="34"/><line x1="0" y1="${p}" x2="34" y2="${p}"/>`; }
      return `<svg class="blk blk-h" viewBox="-1 -1 36 36" aria-hidden="true"><rect class="face-front" x="0" y="0" width="34" height="34" rx="2"/><g class="gridlines">${lines}</g></svg>`;
    }
    if (kind === 't') {
      let lines = '';
      for (let i = 1; i < 10; i++) lines += `<line x1="0" y1="${i * 3.4}" x2="8" y2="${i * 3.4}"/>`;
      return `<svg class="blk blk-t" viewBox="-1 -1 10 36" aria-hidden="true"><rect class="face-front" x="0" y="0" width="8" height="34" rx="1.5"/><g class="gridlines">${lines}</g></svg>`;
    }
    return `<svg class="blk blk-u" viewBox="-1 -1 12 12" aria-hidden="true"><rect class="face-front" x="0" y="0" width="10" height="10" rx="2"/></svg>`;
  }

  function blocksTrayHTML(blk, showEmpty = false, inputPlaces = null, values = {}) {
    const groups = [['th', 'pThousands', 1000], ['h', 'pHundreds', 100], ['t', 'pTens', 10], ['u', 'pOnes', 1]];
    const list = inputPlaces ? groups.filter(([k]) => inputPlaces.includes(k)) : groups.filter(([k]) => showEmpty || blk[k] > 0);
    return `<div class="pvTray">${list.map(([k, labelKey, mult]) => {
      const count = blk[k] || 0;
      const items = Array(count).fill(blockSVG(k)).join('');
      const label = esc(t(labelKey).replace(':', ''));
      const foot = inputPlaces
        ? `<label class="pvSlotLabel">${label}<button type="button" class="pvSlot" data-slot="${k}">${values[k] !== undefined && values[k] !== '' ? esc(String(values[k])) : '?'}</button></label>`
        : `<small>${label} <b>${count * mult}</b></small>`;
      return `<div class="pvCol" data-place="${k}"><div class="pvPile">${items || '<span class="pvZero">0</span>'}</div>${foot}</div>`;
    }).join('')}</div>`;
  }

  function questionDisplayText(q) {
    if (q.op !== 'pv') return q.text;
    if (q.pvKind === 'digit') return t(q.promptKey).replace('{n}', q.promptNum);
    return t(q.promptKey);
  }

  /* Explanation rendering (text comes from explain(); all inserted strings are escaped). */
  function explainHTML(q) { const x = explain(q); return `<b>${esc(t(x.key))}</b> ${esc(x.line)}`; }
  function stepsHTML(q) {
    const x = explain(q);
    return x.steps.map(s => `<div class="step"><b>${esc(t(s.k))}</b> ${esc(s.v)}${s.carry ? ' ' + esc(t('carryOne')) : ''}${s.borrow ? ' ' + esc(t('borrowed')) : ''}</div>`).join('') + dotsHTML(q);
  }
  function dotsHTML(q) {
    const row = n => `<span class="dotrow">${'●'.repeat(n)}</span>`;
    if (q.op === 'pv' && q.blocks) return blocksTrayHTML(q.blocks);
    if ((q.op === 'add' || q.op === 'sub') && q.digits === 100) {
      const ha = q.a / 100, hb = q.b / 100;
      if (q.op === 'add') return `<div class="pvMini">${Array(ha).fill(blockSVG('h')).join('')} <b class="pvOp">+</b> ${Array(hb).fill(blockSVG('h')).join('')}</div>`;
      return `<div class="pvMini">${Array(ha - hb).fill(blockSVG('h')).join('')}<span class="pvCross">${Array(hb).fill(blockSVG('h')).join('')}</span></div>`;
    }
    if (q.op === 'add' && q.a < 10 && q.b < 10) return `<div class="dots">${row(q.a)} + ${row(q.b)}</div>`;
    if (q.op === 'sub' && q.a < 20 && q.b < 10) return `<div class="dots"><span class="dotrow">${'●'.repeat(q.answer)}<s>${'●'.repeat(q.b)}</s></span></div>`;
    if (q.op === 'mul' && q.answer <= 72) { const t0 = q.table || q.b, o = q.a === t0 ? q.b : q.a; return `<div class="dots">${Array(o).fill(row(t0)).join('<br>')}</div>`; }
    if (q.op === 'div' && q.a <= 72) return `<div class="dots">${Array(q.b).fill(row(q.answer)).join('<br>')}</div>`;
    return '';
  }

  function pvCombine(places, slots) {
    const mult = { th: 1000, h: 100, t: 10, u: 1 };
    return places.reduce((acc, k) => acc + Number(slots[k] || 0) * mult[k], 0);
  }

  function updatePvSlotsUI() {
    const q = round.questions[round.i];
    if (!q || !q.pvPlaces) return;
    $$('#qBlocks .pvSlot').forEach(b => {
      const k = b.dataset.slot, v = round.pvSlots[k];
      b.textContent = v !== undefined && v !== '' ? v : '?';
      b.classList.toggle('active', !round.answered && round.pvFocus === k);
    });
    const allFilled = q.pvPlaces.every(k => round.pvSlots[k] !== undefined && round.pvSlots[k] !== '');
    $('#qAnswer').textContent = allFilled ? pvCombine(q.pvPlaces, round.pvSlots) : '?';
  }

  function renderQuestion() {
    const q = round.questions[round.i], isPvSlots = Boolean(q.pvPlaces);
    const mc = P().config.mode === 'choice' && !isPvSlots;
    round.answered = false; round.input = ''; round.current = null;
    round.pvSlots = {}; round.pvFocus = isPvSlots ? q.pvPlaces[0] : null;
    const isPv = q.op === 'pv';
    $('#qWrap').classList.toggle('pvPrompt', isPv);
    $('#qText').textContent = questionDisplayText(q);
    $('#qAnswer').textContent = '?'; $('#feedback').textContent = '';
    const qBlocks = $('#qBlocks');
    if (isPv && q.pvKind !== 'digit') {
      qBlocks.innerHTML = blocksTrayHTML(q.blocks, isPvSlots, q.pvPlaces || null, round.pvSlots);
      qBlocks.classList.remove('hidden');
      if (isPvSlots) {
        $$('#qBlocks .pvSlot').forEach(b => {
          b.onclick = () => { if (!round.answered) { round.pvFocus = b.dataset.slot; updatePvSlotsUI(); } };
        });
        updatePvSlotsUI();
      }
    } else { qBlocks.innerHTML = ''; qBlocks.classList.add('hidden'); }
    $('#explain').classList.add('hidden'); $('#showMe').classList.add('hidden'); $('#showMe').innerHTML = '';
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
    const q = round.questions[round.i];
    if (q.pvPlaces) {
      const places = q.pvPlaces, idx = places.indexOf(round.pvFocus);
      if (k === '⌫') {
        if (round.pvSlots[round.pvFocus] !== undefined && round.pvSlots[round.pvFocus] !== '') round.pvSlots[round.pvFocus] = '';
        else if (idx > 0) { round.pvFocus = places[idx - 1]; round.pvSlots[round.pvFocus] = ''; }
      } else if (k === '✓') {
        const missing = places.find(p => round.pvSlots[p] === undefined || round.pvSlots[p] === '');
        if (missing) { round.pvFocus = missing; updatePvSlotsUI(); return; }
        submit(pvCombine(places, round.pvSlots));
        return;
      } else if (/^[0-9]$/.test(k)) {
        round.pvSlots[round.pvFocus] = k;
        const nextEmpty = places.find((p, i) => i > idx && (round.pvSlots[p] === undefined || round.pvSlots[p] === ''));
        if (nextEmpty) round.pvFocus = nextEmpty;
        else if (idx < places.length - 1) round.pvFocus = places[idx + 1];
      }
      updatePvSlotsUI();
      return;
    }
    if (k === '⌫') round.input = round.input.slice(0, -1);
    else if (k === '✓') { if (round.input !== '') submit(Number(round.input)); return; }
    else if (round.input.length < 6) round.input += k;
    $('#qAnswer').textContent = round.input || '?';
  }

  function submit(v, btn) {
    if (round.answered) return;
    const q = round.questions[round.i], c = P().config, mc = c.mode === 'choice' && !q.pvPlaces;
    const rec = round.current || (round.current = { q, given: [], outcome: null, ok: false });
    attempt(rec, v, settings.feedback && c.feedbackMode === 'practice');

    if (!rec.outcome) { // Practice mode: one more try
      beep(false);
      $('#feedback').textContent = t('retryPrompt');
      round.input = ''; $('#qAnswer').textContent = '?';
      if (q.pvPlaces) {
        const firstWrong = q.pvPlaces.find(p => Number(round.pvSlots[p]) !== q.blocks[p]);
        q.pvPlaces.forEach(p => { if (Number(round.pvSlots[p]) !== q.blocks[p]) round.pvSlots[p] = ''; });
        round.pvFocus = firstWrong || q.pvPlaces[0];
        updatePvSlotsUI();
      }
      if (btn) { btn.disabled = true; btn.classList.add('tried'); }
      return;
    }

    round.results.push(rec); round.current = null; round.answered = true;
    $('#qAnswer').textContent = v;
    if (q.pvPlaces) {
      $$('#qBlocks .pvSlot').forEach(b => {
        const p = b.dataset.slot, right = Number(round.pvSlots[p]) === q.blocks[p];
        b.classList.remove('active');
        b.classList.add(right ? 'right' : 'wrong');
        if (!right) b.textContent = `${round.pvSlots[p]} → ${q.blocks[p]}`;
      });
    }
    beep(rec.ok);
    if (settings.feedback) {
      $('#feedback').textContent = rec.outcome === 'first' ? t('great') : rec.outcome === 'retry' ? t('gotItRetry') : `${t('oops')} ${q.answer}`;
      if (rec.outcome === 'unresolved') { $('#explainLine').innerHTML = explainHTML(q); $('#explain').classList.remove('hidden'); }
      if (mc) $$('#choices .choice').forEach(b => {
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
    recordRound(P().stats, round.results, { ts: round.end, mode: c.mode, feedbackMode: c.feedbackMode, digits: c.digits });
    saveAll(); show('summary'); $('#answers').classList.add('hidden'); renderSummary();
  }

  function renderSummary() {
    const sc = scoreRound(round.results), p = sc.pct;
    const stars = p >= 90 ? 3 : p >= 60 ? 2 : p >= 30 ? 1 : 0;
    $('#stars').textContent = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    $('#scoreBig').textContent = `${sc.first + sc.retry} / ${sc.total}`;
    $('#scoreMsg').textContent = t(p === 100 ? 'perfect' : p >= 80 ? 'awesome' : p >= 50 ? 'effort' : 'tryAgain');
    $('#sFirst').textContent = sc.first; $('#sRetry').textContent = sc.retry; $('#sUnresolved').textContent = sc.unresolved;
    const sec = Math.round((round.end - round.start) / 1000);
    $('#sTime').textContent = `${Math.floor(sec / 60)}:${pad(sec % 60)}`;
    $('#savedTo').textContent = `${t('saved')} ${P().avatar} ${P().name}`;
    const icon = { first: '✔', retry: '🔁', unresolved: '✘' };
    $('#answers').innerHTML = round.results.map(r => {
      const wrong = r.given.filter(g => g !== r.q.answer);
      const qLabel = questionDisplayText(r.q);
      return `<div class="answerRow"><b>${icon[r.outcome]}</b><span class="grow">${esc(qLabel)} = ${r.q.answer}${r.outcome !== 'first' ? `<small class="explainSmall">${explainHTML(r.q)}</small>` : ''}</span>${wrong.length ? `<small><s>${wrong.map(esc).join(' ')}</s></small>` : ''}</div>`;
    }).join('');
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
    $('#difficultyStats').innerHTML = [['add', 1], ['add', 2], ['add', 3], ['add', 100], ['sub', 1], ['sub', 2], ['sub', 3], ['sub', 100]]
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

  /* ----- Place-value interactive explorer ----- */
  let expState = { th: 1, h: 2, t: 3, u: 4, value: 1234, traded: null };

  function openExplore() {
    renderExplore();
    show('exploreScreen');
  }

  function renderExplore() {
    const s = expState;
    $('#expTotal').textContent = s.value.toLocaleString(settings.lang);
    const parts = [];
    if (s.th) parts.push(`${s.th} × 1000 (${s.th * 1000})`);
    if (s.h) parts.push(`${s.h} × 100 (${s.h * 100})`);
    if (s.t) parts.push(`${s.t} × 10 (${s.t * 10})`);
    if (s.u || !parts.length) parts.push(`${s.u} × 1 (${s.u})`);
    $('#expExpanded').textContent = parts.join(' + ') + ` = ${s.value}`;
    $('#expTradeMsg').textContent = s.traded ? t(s.traded) : '';
    $('#expTray').innerHTML = blocksTrayHTML(s, true);
    const controls = [['th', 'uThousand'], ['h', 'uHundred'], ['t', 'uTen'], ['u', 'uOne']];
    $('#expControls').innerHTML = '';
    controls.forEach(([k, labelKey]) => {
      const box = document.createElement('div');
      box.className = 'expCtrl';
      box.innerHTML = `<div class="expIcon">${blockSVG(k)}</div><small>${esc(t(labelKey))}</small><div class="expBtns"><button class="minus" aria-label="-">−</button><b>${s[k]}</b><button class="plus" aria-label="+">+</button></div>`;
      box.querySelector('.minus').onclick = () => { expState = stepBlocks(expState, k, -1); renderExplore(); };
      box.querySelector('.plus').onclick = () => { expState = stepBlocks(expState, k, 1); if (expState.traded) beep(true); renderExplore(); };
      $('#expControls').append(box);
    });
  }

  /* ----- event wiring ----- */
  $('#exploreBtn').onclick = openExplore;
  $('#exploreBack').onclick = () => show('home');
  $('#expClear').onclick = () => { expState = { th: 0, h: 0, t: 0, u: 0, value: 0, traded: null }; renderExplore(); };
  $('#expRandom').onclick = () => {
    const n = ri(1, 3) * 1000 + ri(0, 6) * 100 + ri(0, 7) * 10 + ri(1, 8);
    expState = { ...decompose(n), value: n, traded: null };
    renderExplore();
  };
  $('#expQuiz').onclick = () => {
    const c = P().config;
    if (!c.ops.includes('pv')) c.ops = ['pv'];
    saveAll(); renderHome(); start();
  };
  $('#allTables').onclick = () => { P().config.tables = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]; saveAll(); renderHome(); };
  $('#noTables').onclick = () => { P().config.tables = []; saveAll(); renderHome(); };
  $('#customCount').oninput = () => { $('#error').textContent = ''; };
  $('#startBtn').onclick = start;
  $('#nextBtn').onclick = advance;
  $('#showMeBtn').onclick = () => {
    const box = $('#showMe');
    if (box.classList.contains('hidden') && round) box.innerHTML = stepsHTML(round.questions[round.i]);
    box.classList.toggle('hidden');
  };
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
    const q = round.questions[round.i], mc = P().config.mode === 'choice' && !(q && q.pvPlaces);
    if (e.key === 'Enter') {
      e.preventDefault();
      if (round.answered) { if (settings.feedback) advance(); } else if (!mc) key('✓');
      return;
    }
    if (q && q.pvPlaces && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
      const idx = q.pvPlaces.indexOf(round.pvFocus);
      const next = idx + (e.key === 'ArrowRight' ? 1 : -1);
      if (next >= 0 && next < q.pvPlaces.length) { round.pvFocus = q.pvPlaces[next]; updatePvSlotsUI(); }
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
