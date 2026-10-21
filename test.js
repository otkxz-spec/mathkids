/* Math Kids tests – run with:  node test.js   (no dependencies) */
const L = require('./app.js');
const assert = require('assert');
const fs = require('fs');

/* ---------- question generation ---------- */
let n = 0;
for (const digits of [1, 2, 3]) {
  const cfg = { ...L.defaultCfg(), ops: ['add', 'sub', 'mul', 'div'], digits, tables: [3, 7, 12], count: 100, mode: 'type' };
  const [lo, hi] = L.bounds(digits);
  for (let i = 0; i < 30; i++) for (const q of L.makeRound(cfg)) {
    n++;
    assert(Number.isInteger(q.answer) && q.answer >= 0, q.text);
    assert(!('choices' in q), 'typed mode must not carry choices');
    if (q.op === 'add') { assert.strictEqual(q.a + q.b, q.answer); assert(q.a >= lo && q.a <= hi && q.b >= lo && q.b <= hi, q.text); assert.strictEqual(q.digits, digits); }
    if (q.op === 'sub') { assert.strictEqual(q.a - q.b, q.answer); assert(q.a >= q.b, 'no negatives ' + q.text); assert(q.b >= lo && q.a <= hi, q.text); }
    if (q.op === 'mul') { assert.strictEqual(q.a * q.b, q.answer); assert(cfg.tables.includes(q.table)); assert(q.a === q.table || q.b === q.table); assert.strictEqual(q.digits, null); }
    if (q.op === 'div') { assert(cfg.tables.includes(q.b) && q.table === q.b && q.a % q.b === 0 && q.a / q.b === q.answer && q.answer >= 1 && q.answer <= 12, q.text); }
  }
}
assert(L.makeRound({ ...L.defaultCfg(), ops: ['div'], tables: [12], count: 10 }).every(q => q.b === 12));
const r2 = L.makeRound({ ...L.defaultCfg(), ops: ['mul'], tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], count: 20 });
assert.strictEqual(new Set(r2.map(q => q.text)).size, 20, 'no duplicate questions when the pool is large');

/* ---------- multiple choice ---------- */
let mc = 0;
for (const digits of [1, 2, 3]) {
  const cfg = { ...L.defaultCfg(), ops: ['add', 'sub', 'mul', 'div'], digits, tables: [1, 2, 7], count: 100, mode: 'choice' };
  for (let i = 0; i < 30; i++) for (const q of L.makeRound(cfg)) {
    mc++;
    assert.strictEqual(q.choices.length, 4, q.text);
    assert.strictEqual(new Set(q.choices).size, 4, 'duplicate choices ' + q.text + ' ' + q.choices);
    assert.strictEqual(q.choices.filter(c => c === q.answer).length, 1, 'exactly one correct ' + q.text);
    assert(q.choices.every(c => Number.isInteger(c) && c >= 0), 'non-negative ints ' + q.choices);
  }
}
for (const ans of [0, 1, 2]) for (const [a, b] of [[0, 0], [1, 1], [2, 0]]) {
  const ch = L.choices(ans, a, b);
  assert.strictEqual(new Set(ch).size, 4); assert(ch.includes(ans)); assert(ch.every(c => c >= 0));
}
const slots = new Set();
for (let i = 0; i < 300; i++) slots.add(L.choices(42, 6, 7).indexOf(42));
assert.strictEqual(slots.size, 4, 'answer position should be randomised');

/* ---------- validation ---------- */
assert.strictEqual(L.validateConfig({ ops: [], tables: [], count: 5 }), 'errOps');
assert.strictEqual(L.validateConfig({ ops: ['mul'], tables: [], count: 5 }), 'errTables');
assert.strictEqual(L.validateConfig({ ops: ['add'], tables: [], count: 0 }), 'errCount');
assert.strictEqual(L.validateConfig({ ops: ['add'], tables: [], count: 101 }), 'errCount');
assert.strictEqual(L.validateConfig({ ops: ['add'], tables: [], count: 2.5 }), 'errCount');
assert.strictEqual(L.validateConfig({ ops: ['add'], tables: [], count: 10 }), null);

/* ---------- progress tracking ---------- */
const mk = (op, extra, ok) => ({ q: { op, table: null, digits: null, ...extra }, ok });
const at = (y, m, d, h = 15) => new Date(y, m - 1, d, h).getTime();
const st = L.emptyStats();
L.recordRound(st, [mk('mul', { table: 7 }, true), mk('mul', { table: 7 }, false), mk('div', { table: 7 }, true), mk('add', { digits: 2 }, true)], { ts: at(2026, 10, 18), mode: 'type', digits: 2 });
assert.strictEqual(st.rounds, 1); assert.strictEqual(st.questions, 4); assert.strictEqual(st.correct, 3);
assert.deepStrictEqual(st.ops.mul, { n: 2, c: 1 });
assert.deepStrictEqual(st.tables[7], { n: 3, c: 2 }, 'mul and div both count toward the table');
assert.deepStrictEqual(st.digits['add-2'], { n: 1, c: 1 });
assert.strictEqual(st.history[0].correct, 3);
L.recordRound(st, [mk('sub', { digits: 1 }, true)], { ts: at(2026, 10, 18, 20), mode: 'choice', digits: 1 });
assert.strictEqual(st.days.length, 1, 'second round same day does not add a day');
for (let i = 0; i < 80; i++) L.recordRound(st, [mk('add', { digits: 1 }, true)], { ts: at(2026, 10, 18) + i, mode: 'type', digits: 1 });
assert.strictEqual(st.history.length, L.HISTORY_MAX); assert.strictEqual(st.rounds, 82);

/* ---------- day keys & streaks (local time) ---------- */
assert.strictEqual(L.dayKey(at(2026, 10, 19, 23)), '2026-10-19', 'late evening stays on the local day');
assert.strictEqual(L.dayKey(at(2026, 10, 19, 0)), '2026-10-19');
const keys = (...ds) => ds.map(d => L.dayKey(at(2026, 10, d)));
assert.strictEqual(L.streak([], at(2026, 10, 19)), 0);
assert.strictEqual(L.streak(keys(17, 18, 19), at(2026, 10, 19, 22)), 3, 'includes today');
assert.strictEqual(L.streak(keys(16, 17, 18), at(2026, 10, 19)), 3, 'yesterday still counts');
assert.strictEqual(L.streak(keys(15, 16), at(2026, 10, 19)), 0, 'broken streak');
assert.strictEqual(L.streak(keys(10, 11, 17, 18, 19), at(2026, 10, 19)), 3, 'gap stops the count');
assert.strictEqual(L.streak([L.dayKey(at(2026, 10, 31)), L.dayKey(at(2026, 11, 1))], at(2026, 11, 1)), 2, 'month boundary');

/* ---------- mastery colours ---------- */
assert.strictEqual(L.level(undefined), 'noneLevel'); assert.strictEqual(L.level({ n: 0, c: 0 }), 'noneLevel');
assert.strictEqual(L.level({ n: 10, c: 9 }), 'good'); assert.strictEqual(L.level({ n: 10, c: 7 }), 'mid'); assert.strictEqual(L.level({ n: 10, c: 6 }), 'low');

/* ---------- profiles / migration ---------- */
assert.strictEqual(L.defaultName('en', 1), 'Player 1');
assert.strictEqual(L.defaultName('es', 1), 'Jugador 1');
const migrated = L.normalizeProfile({ id: 'x', name: 'Player profile', avatar: '🦊', config: { ops: ['mul'], count: 0 } }, 'en');
assert.strictEqual(migrated.name, 'Player 1', 'v3 naming bug is repaired');
assert.strictEqual(migrated.config.count, 10, 'invalid stored count is reset');
assert.strictEqual(migrated.config.digits, 1, 'missing config gets defaults');
assert.deepStrictEqual(migrated.stats, L.emptyStats());
const kept = L.normalizeProfile({ id: 'y', name: 'Ana', stats: { rounds: 4 } }, 'es');
assert.strictEqual(kept.name, 'Ana'); assert.strictEqual(kept.stats.rounds, 4);

/* ---------- i18n ---------- */
assert.deepStrictEqual(Object.keys(L.TR.en).sort(), Object.keys(L.TR.es).sort(), 'en/es keys match');
const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
for (const m of html.matchAll(/data-ta?="(\w+)"/g)) assert(L.TR.en[m[1]], 'missing html key ' + m[1]);
const src = fs.readFileSync(__dirname + '/app.js', 'utf8');
for (const m of src.matchAll(/\bt\('(\w+)'\)/g)) assert(L.TR.en[m[1]], 'missing t() key ' + m[1]);

/* ---------- 3.1.1 retry & explanations ---------- */
const q7 = { op: 'mul', a: 6, b: 7, answer: 42, table: 7, text: '6 × 7' };
const rec = (q) => ({ q, given: [], outcome: null, ok: false });
// practice: wrong then right = retry
let r = rec(q7); L.attempt(r, 40, true); assert.strictEqual(r.outcome, null, 'retry pending'); L.attempt(r, 42, true);
assert.strictEqual(r.outcome, 'retry'); assert(r.ok);
// practice: right first time
r = rec(q7); L.attempt(r, 42, true); assert.strictEqual(r.outcome, 'first');
// practice: two wrong = unresolved, further attempts ignored (no farming)
r = rec(q7); L.attempt(r, 1, true); L.attempt(r, 2, true); assert.strictEqual(r.outcome, 'unresolved');
L.attempt(r, 42, true); assert.strictEqual(r.outcome, 'unresolved'); assert.strictEqual(r.given.length, 2); assert(!r.ok);
// quiz: one wrong = unresolved immediately
r = rec(q7); L.attempt(r, 1, false); assert.strictEqual(r.outcome, 'unresolved');
// resolved-correct can't be re-scored either
r = rec(q7); L.attempt(r, 42, true); L.attempt(r, 1, true); assert.strictEqual(r.outcome, 'first'); assert.strictEqual(r.given.length, 1);

// scoring: first=1, retry=0.5
const sc = L.scoreRound([{ outcome: 'first' }, { outcome: 'retry' }, { outcome: 'unresolved' }, { outcome: 'first' }]);
assert.deepStrictEqual([sc.first, sc.retry, sc.unresolved, sc.total, sc.points, sc.pct], [2, 1, 1, 4, 2.5, 63]);
assert.strictEqual(L.scoreRound([{ ok: true }, { ok: false }]).first, 1, 'legacy results count ok as first try');

// recordRound tracks outcomes
const st2 = L.emptyStats();
L.recordRound(st2, [{ q: q7, ok: true, outcome: 'first' }, { q: q7, ok: true, outcome: 'retry' }, { q: q7, ok: false, outcome: 'unresolved' }], { ts: at(2026, 10, 20), mode: 'type', feedbackMode: 'practice', digits: 1 });
assert.deepStrictEqual([st2.correct, st2.firstTry, st2.retry], [2, 1, 1]);
assert.deepStrictEqual([st2.history[0].firstTry, st2.history[0].retry, st2.history[0].correct], [1, 1, 2]);
const legacyStats = { ...L.emptyStats() }; delete legacyStats.firstTry; delete legacyStats.retry;
L.recordRound(legacyStats, [{ q: q7, ok: true }], { ts: at(2026, 10, 20), mode: 'type', digits: 1 });
assert.strictEqual(legacyStats.firstTry, 1, 'old stats objects gain counters');

// migration default
assert.strictEqual(L.normalizeProfile({ id: 'z', name: 'A', config: {} }, 'en').config.feedbackMode, 'practice');
assert.strictEqual(L.normalizeProfile({ id: 'z', name: 'A', config: { feedbackMode: 'quiz' } }, 'en').config.feedbackMode, 'quiz');
assert.strictEqual(L.normalizeProfile({ id: 'z', name: 'A', config: { feedbackMode: 'bogus' } }, 'en').config.feedbackMode, 'practice');

// explanations: every "a = b = c" chain in the line/steps must be arithmetically true and end in the answer
const evalExpr = s => Function('"use strict";return (' + s.replace(/×/g, '*').replace(/−/g, '-').replace(/÷/g, '/') + ')')();
function checkChains(text, ctx) {
  for (const seg of text.split(',')) {
    if (!seg.includes('=') || seg.includes('→')) continue;
    const vals = seg.split('=').map(p => evalExpr(p.trim()));
    assert(vals.every(v => v === vals[0]), 'bad maths in "' + seg + '" for ' + ctx);
  }
}
let explained = 0;
for (const digits of [1, 2, 3]) {
  const cfg = { ...L.defaultCfg(), ops: ['add', 'sub', 'mul', 'div'], digits, tables: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], count: 100 };
  for (let i = 0; i < 20; i++) for (const q of L.makeRound(cfg)) {
    explained++;
    const x = L.explain(q);
    assert(L.TR.en[x.key] && L.TR.es[x.key], 'explain key translated ' + x.key);
    assert(x.line.length > 0 && x.line.length <= 80, 'short line: ' + x.line);
    assert(x.line.split(/[ ,=→+×−]+/).includes(String(q.answer)), 'line shows answer: ' + q.text + ' → ' + x.line);
    checkChains(x.line, q.text);
    for (const s of x.steps) { assert(L.TR.en[s.k], 'step key ' + s.k); checkChains(s.v, q.text); }
    assert.strictEqual(x.steps[x.steps.length - 1].v, `${q.text} = ${q.answer}`);
    if (q.op === 'add' && q.digits > 1) { // column digits must rebuild the answer
      const cols = x.steps.filter(s => /^p/.test(s.k));
      const rebuilt = Number(cols.map(s => s.v.includes('=') ? String(Number(s.v.split('=')[1]) % 10) : s.v).reverse().join(''));
      assert.strictEqual(rebuilt, q.answer, 'column add rebuilds ' + q.text);
    }
    if (q.op === 'sub' && q.digits > 1 && !(q.a < 20 && q.b < 10)) {
      const cols = x.steps.filter(s => /^p/.test(s.k));
      assert.strictEqual(Number(cols.map(s => s.v.split('=')[1].trim()).reverse().join('')), q.answer, 'column sub rebuilds ' + q.text);
    }
  }
}
// specific examples from the plan
assert.strictEqual(L.explain({ op: 'add', a: 8, b: 5, answer: 13, text: '8 + 5' }).line, '8 + 2 = 10, 10 + 3 = 13');
assert.strictEqual(L.explain({ op: 'mul', a: 6, b: 7, answer: 42, table: 6, text: '6 × 7' }).line, '6 × 5 + 6 × 2 = 30 + 12 = 42');
assert.strictEqual(L.explain({ op: 'div', a: 42, b: 6, answer: 7, table: 6, text: '42 ÷ 6' }).line, '6 × 7 = 42');
assert.strictEqual(L.explain({ op: 'sub', a: 52, b: 17, answer: 35, text: '52 − 17' }).line, '17 + 35 = 52');
assert(L.explain({ op: 'add', a: 47, b: 38, answer: 85, text: '47 + 38' }).steps[0].carry, 'ones column carries');
assert(L.explain({ op: 'sub', a: 52, b: 17, answer: 35, text: '52 − 17' }).steps[0].borrow, 'ones column borrows');
assert.strictEqual(L.explain({ op: 'add', a: 999, b: 999, answer: 1998, text: '999 + 999' }).steps.filter(s => /^p/.test(s.k)).length, 4, 'thousands carry');

/* ---------- 3.2.0 round hundreds & place value ---------- */
// Round hundreds (digits = 100): operands 100..900, multiples of 100, non-negative sub, hundred-step choices
for (const mode of ['type', 'choice']) {
  const cfg = { ...L.defaultCfg(), ops: ['add', 'sub'], digits: 100, count: 50, mode };
  for (let i = 0; i < 10; i++) for (const q of L.makeRound(cfg)) {
    n++;
    assert(q.a >= 100 && q.a <= 900 && q.a % 100 === 0, 'a is round hundred: ' + q.text);
    assert(q.b >= 100 && q.b <= 900 && q.b % 100 === 0, 'b is round hundred: ' + q.text);
    assert.strictEqual(q.digits, 100);
    if (q.op === 'add') assert.strictEqual(q.a + q.b, q.answer);
    if (q.op === 'sub') { assert.strictEqual(q.a - q.b, q.answer); assert(q.answer >= 0, 'non-negative hundred sub'); }
    if (mode === 'choice') {
      assert.strictEqual(new Set(q.choices).size, 4);
      assert(q.choices.includes(q.answer));
      assert(q.choices.every(c => c >= 0 && c % 100 === 0), 'round-hundred choices: ' + q.choices);
    }
    const x = L.explain(q);
    assert.strictEqual(x.key, 'xHundreds');
    assert(x.line.endsWith('→ ' + q.answer), 'hundreds explain line: ' + x.line);
  }
}

// Place-value decomposition and block trading (10 -> 1)
assert.deepStrictEqual(L.decompose(3407), { th: 3, h: 4, t: 0, u: 7 });
let bs = { th: 0, h: 0, t: 0, u: 9 };
bs = L.stepBlocks(bs, 'u', 1);
assert.deepStrictEqual([bs.th, bs.h, bs.t, bs.u, bs.value, bs.traded], [0, 0, 1, 0, 10, 'trade10']);
bs = L.stepBlocks({ th: 0, h: 0, t: 9, u: 0 }, 't', 1);
assert.deepStrictEqual([bs.th, bs.h, bs.t, bs.u, bs.value, bs.traded], [0, 1, 0, 0, 100, 'trade100']);
bs = L.stepBlocks({ th: 0, h: 9, t: 0, u: 0 }, 'h', 1);
assert.deepStrictEqual([bs.th, bs.h, bs.t, bs.u, bs.value, bs.traded], [1, 0, 0, 0, 1000, 'trade1000']);
bs = L.stepBlocks({ th: 0, h: 0, t: 0, u: 0 }, 'u', -1);
assert.strictEqual(bs.value, 0, 'cannot go below 0');

// Place-value quiz questions (count each unit kind)
for (const mode of ['type', 'choice']) {
  const cfg = { ...L.defaultCfg(), ops: ['pv'], count: 60, mode };
  for (let i = 0; i < 10; i++) for (const q of L.makeRound(cfg)) {
    n++;
    assert.strictEqual(q.op, 'pv');
    assert.strictEqual(q.pvKind, 'blocks');
    assert(Array.isArray(q.pvPlaces) && (q.pvPlaces.length === 3 || q.pvPlaces.length === 4), 'pvPlaces list');
    assert(Number.isInteger(q.answer) && q.answer >= 0, 'pv answer int');
    assert(L.TR.en[q.promptKey] && L.TR.es[q.promptKey], 'pv prompt key translated: ' + q.promptKey);
    assert.strictEqual(q.blocks.th * 1000 + q.blocks.h * 100 + q.blocks.t * 10 + q.blocks.u, q.answer);
    const x = L.explain(q);
    assert.strictEqual(x.key, 'xPlaceValue');
  }
}

// Place-value equivalency questions (3.2.2)
const seenEqPrompts = new Set();
for (const mode of ['type', 'choice']) {
  const cfg = { ...L.defaultCfg(), ops: ['pvEq'], count: 60, mode };
  for (let i = 0; i < 10; i++) for (const q of L.makeRound(cfg)) {
    n++;
    seenEqPrompts.add(q.promptKey);
    assert.strictEqual(q.op, 'pvEq');
    assert.strictEqual(q.pvKind, 'equiv');
    assert(Number.isInteger(q.answer) && q.answer > 0, 'pvEq answer > 0');
    assert(Number.isInteger(q.promptNum) && q.promptNum > 0, 'pvEq promptNum > 0');
    assert(['th', 'h', 't', 'u'].includes(q.srcPlace) && ['th', 'h', 't', 'u'].includes(q.dstPlace), 'pvEq src/dst place');
    assert.strictEqual(q.promptNum * q.srcUnit, q.a, 'pvEq src total matches a');
    assert.strictEqual(q.answer * q.b, q.a, 'pvEq dst total matches a');
    assert.strictEqual(q.blocks.th * 1000 + q.blocks.h * 100 + q.blocks.t * 10 + q.blocks.u, q.a, 'pvEq blocks total matches a');
    assert(L.TR.en[q.promptKey] && L.TR.es[q.promptKey], 'pvEq prompt key translated: ' + q.promptKey);
    assert(L.TR.en[q.promptKey].includes('{n}') && L.TR.es[q.promptKey].includes('{n}'), 'pvEq prompt has {n}: ' + q.promptKey);
    if (mode === 'choice') {
      assert.strictEqual(new Set(q.choices).size, 4, '4 unique pvEq choices: ' + q.choices);
      assert(q.choices.includes(q.answer), 'pvEq choices include answer');
      assert(q.choices.every(c => Number.isInteger(c) && c > 0), 'pvEq choices positive ints');
    }
    const x = L.explain(q);
    assert.strictEqual(x.key, 'xPlaceValue');
    assert(x.line.split(/[ ,=→+×−]+/).includes(String(q.answer)), 'pvEq explain line includes answer: ' + x.line);
    checkChains(x.line, q.text);
  }
}
assert.strictEqual(seenEqPrompts.size, 7, 'all 7 equivalency question templates generated');

assert.strictEqual(L.normalizeProfile({ id: 'h', name: 'A', config: { digits: 100 } }, 'en').config.digits, 100, 'digits=100 preserved');
assert.strictEqual(L.normalizeProfile({ id: 'h', name: 'A', config: { digits: 99 } }, 'en').config.digits, 1, 'invalid digits reset');

/* ---------- PWA ---------- */
const manifest = JSON.parse(fs.readFileSync(__dirname + '/manifest.json', 'utf8'));
assert(manifest.icons.length >= 2, 'manifest has icons');
for (const i of manifest.icons) assert(fs.existsSync(__dirname + '/' + i.src), 'icon exists ' + i.src);
const sw = fs.readFileSync(__dirname + '/sw.js', 'utf8');
assert(sw.includes(`'mathkids-v${L.APP_VERSION}'`), 'sw.js VERSION must match APP_VERSION ' + L.APP_VERSION);
assert(fs.readFileSync(__dirname + '/CHANGELOG.md', 'utf8').includes(`## ${L.APP_VERSION}`), 'CHANGELOG has an entry for ' + L.APP_VERSION);

console.log('OK –', n, 'typed +', mc, 'multiple-choice questions checked,', explained, 'explanations verified; all tests passed.');
