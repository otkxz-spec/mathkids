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

/* ---------- PWA ---------- */
const manifest = JSON.parse(fs.readFileSync(__dirname + '/manifest.json', 'utf8'));
assert(manifest.icons.length >= 2, 'manifest has icons');
for (const i of manifest.icons) assert(fs.existsSync(__dirname + '/' + i.src), 'icon exists ' + i.src);

console.log('OK –', n, 'typed +', mc, 'multiple-choice questions checked; all tests passed.');
