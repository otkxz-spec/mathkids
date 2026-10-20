# AGENTS.md — rules for coding agents (Copilot, Antigravity, etc.)

Read `README.md`, `roadmap.md` and `CHANGELOG.md` before editing.

## Architecture
- Plain HTML/CSS/JavaScript, no build step, no dependencies. Hosted as static files on GitHub Pages.
- `app.js`: pure logic at the top (exported for tests), browser UI below the `typeof document` guard.
- Data lives in `localStorage` under `mk_settings`, `mk_profiles`, `mk_active`. Never break existing data; migrate in `normalizeProfile`.

## Rules
1. One roadmap item per branch / PR; state the acceptance criteria first.
2. Every user-facing string goes in `TR.en` **and** `TR.es` (tests enforce matching keys).
3. Use `data-t` (text) / `data-ta` (aria-label) attributes for translatable markup.
4. Add or update tests in `test.js`; run `node test.js` before finishing.
5. Bump `VERSION` in `sw.js` and update `CHANGELOG.md` and the roadmap status table on every release.
6. Escape any user-provided text (`esc()`) before inserting HTML.
7. No analytics, ads, tracking, accounts, cloud storage or new dependencies without an explicit roadmap decision.
8. Don't redesign unrelated screens during a scoped task.
9. Report files changed, tests run, known limitations and manual checks still needed.
