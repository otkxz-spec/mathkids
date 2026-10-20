const L = require('./app.js');
const assert = require('assert');

/* ---------- question generation ---------- */
const cfgBase = { ops:['add','sub','mul','div'], tables:[3,7], count:100, range:20, multMax:12, mode:'type' };
let n = 0;
for (const range of [10,20,100,1000]) for (const mm of [10,12]) {
  const cfg = Object.assign({}, cfgBase, { range, multMax: mm });
  for (let i = 0; i < 50; i++) for (const q of L.buildRound(cfg)) {
    n++;
    assert(Number.isInteger(q.answer) && q.answer >= 0, q.text);
    assert(!('choices' in q), 'typed mode must not carry choices');
    if (q.op === 'add') assert(q.a + q.b === q.answer && q.answer <= range, q.text);
    if (q.op === 'sub') assert(q.a - q.b === q.answer && q.a <= range, q.text);
    if (q.op === 'mul') { assert(q.a * q.b === q.answer); assert(cfg.tables.includes(q.table)); assert(q.a === q.table || q.b === q.table); }
    if (q.op === 'div') { assert(cfg.tables.includes(q.b) && q.table === q.b && q.a % q.b === 0 && q.a / q.b === q.answer && q.answer >= 1 && q.answer <= mm, q.text); }
  }
}
assert(L.buildRound({ ops:['div'], tables:[12], count:10, range:20, multMax:12 }).every(q => q.b === 12));
const r2 = L.buildRound({ ops:['mul'], tables:[1,2,3,4,5,6,7,8,9,10,11,12], count:20, range:20, multMax:12 });
assert.strictEqual(new Set(r2.map(q => q.text)).size, 20);

/* ---------- multiple choice ---------- */
let mcCount = 0;
for (const range of [10,20,100,1000]) for (const mm of [10,12]) {
  const cfg = Object.assign({}, cfgBase, { range, multMax: mm, mode: 'choice' });
  for (let i = 0; i < 40; i++) for (const q of L.buildRound(cfg)) {
    mcCount++;
    assert.strictEqual(q.choices.length, 4, q.text);
    assert.strictEqual(new Set(q.choices).size, 4, 'duplicate choices ' + q.text + ' ' + q.choices);
    assert.strictEqual(q.choices.filter(c => c === q.answer).length, 1, 'exactly one correct ' + q.text);
    assert(q.choices.every(c => Number.isInteger(c) && c >= 0), 'non-negative ints ' + q.choices);
  }
}
// tiny answers (0, 1, 2) still produce 4 unique non-negative choices
for (const ans of [0, 1, 2]) for (const op of ['add','sub','mul','div']) {
  const ch = L.makeChoices({ op, a: 1, b: 1, answer: ans });
  assert.strictEqual(new Set(ch).size, 4); assert(ch.includes(ans)); assert(ch.every(c => c >= 0));
}
// correct answer is not always in the same slot
const slots = new Set();
for (let i = 0; i < 200; i++) { const q = L.makeQuestion('mul', { tables:[7], multMax:10, range:20 }); slots.add(L.makeChoices(q).indexOf(q.answer)); }
assert.strictEqual(slots.size, 4, 'answer position should be randomised');

/* ---------- validation / messages ---------- */
assert.strictEqual(L.validateConfig({ ops:[], tables:[], count:5 }), 'errNoOp');
assert.strictEqual(L.validateConfig({ ops:['mul'], tables:[], count:5 }), 'errNoTable');
assert.strictEqual(L.validateConfig({ ops:['add'], tables:[], count:0 }), 'errCount');
assert.strictEqual(L.validateConfig({ ops:['add'], tables:[], count:101 }), 'errCount');
assert.strictEqual(L.validateConfig({ ops:['add'], tables:[], count:10 }), null);

/* ---------- progress tracking ---------- */
const mk = (op, table, ok) => ({ q: Object.assign({ op }, table ? { table } : {}), ok });
const day = (y, m, d, h = 15) => new Date(y, m - 1, d, h).getTime();
let st = L.emptyStats();
L.recordRound(st, [mk('mul', 7, true), mk('mul', 7, false), mk('div', 7, true), mk('add', 0, true)], { ts: day(2026,10,18), mode: 'type', ms: 30000 });
assert.strictEqual(st.rounds, 1); assert.strictEqual(st.questions, 4); assert.strictEqual(st.correct, 3);
assert.deepStrictEqual(st.ops.mul, { n: 2, c: 1 }); assert.deepStrictEqual(st.ops.div, { n: 1, c: 1 }); assert.deepStrictEqual(st.ops.add, { n: 1, c: 1 });
assert.deepStrictEqual(st.tables[7], { n: 3, c: 2 }, 'mul and div both count toward the table');
assert.strictEqual(st.tables[0], undefined, 'add/sub have no table');
assert.deepStrictEqual(st.history[0].ops.sort(), ['add','div','mul']);
assert.strictEqual(st.history[0].correct, 3);
assert.strictEqual(st.days.length, 1);
// second round same day doesn't add a day
L.recordRound(st, [mk('sub', 0, true)], { ts: day(2026,10,18,20), mode: 'choice', ms: 5000 });
assert.strictEqual(st.days.length, 1); assert.strictEqual(st.rounds, 2);
// history cap
for (let i = 0; i < 80; i++) L.recordRound(st, [mk('add', 0, true)], { ts: day(2026,10,18) + i, mode: 'type', ms: 1 });
assert.strictEqual(st.history.length, L.HISTORY_MAX); assert.strictEqual(st.rounds, 82);

// streaks
const keys = (...ds) => ds.map(d => L.dayKey(day(2026, 10, d)));
assert.strictEqual(L.streakDays([], day(2026,10,19)), 0);
assert.strictEqual(L.streakDays(keys(17,18,19), day(2026,10,19)), 3, 'includes today');
assert.strictEqual(L.streakDays(keys(16,17,18), day(2026,10,19)), 3, 'yesterday still counts');
assert.strictEqual(L.streakDays(keys(15,16), day(2026,10,19)), 0, 'broken streak');
assert.strictEqual(L.streakDays(keys(10,11,17,18,19), day(2026,10,19)), 3, 'gap stops the count');
assert.strictEqual(L.streakDays([L.dayKey(day(2026,10,31)), L.dayKey(day(2026,11,1))], day(2026,11,1)), 2, 'month boundary');

// mastery colours
assert.strictEqual(L.masteryLevel(undefined), 'none'); assert.strictEqual(L.masteryLevel({ n: 0, c: 0 }), 'none');
assert.strictEqual(L.masteryLevel({ n: 10, c: 9 }), 'good'); assert.strictEqual(L.masteryLevel({ n: 10, c: 7 }), 'ok');
assert.strictEqual(L.masteryLevel({ n: 10, c: 6 }), 'low');

/* ---------- i18n ---------- */
assert.deepStrictEqual(Object.keys(L.I18N.en).sort(), Object.keys(L.I18N.es).sort());
const html = require('fs').readFileSync('index.html', 'utf8');
for (const m of html.matchAll(/data-i18n(?:-aria|-placeholder)?="(\w+)"/g)) assert(L.I18N.en[m[1]], 'missing ' + m[1]);
const src = require('fs').readFileSync('app.js', 'utf8');
for (const m of src.matchAll(/\bt\('(\w+)'\)/g)) assert(L.I18N.en[m[1]], 'missing t() key ' + m[1]);

console.log('OK –', n, 'typed +', mcCount, 'multiple-choice questions checked');
