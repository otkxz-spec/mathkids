# Changelog

## 3.0.1 — Maintenance

### Fixed
- Day streak broke for evening play: days were recorded in UTC instead of local time.
- Default profile was named "Player profile" in English; now "Player 1". Existing profiles with that name are repaired.
- Installed apps could stay on an old version: service worker is now network-first with offline fallback, and caches icons.
- App icons were never registered in `manifest.json`, blocking proper install.
- Sound effects toggle had no effect; correct/incorrect answers now play short tones.
- An invalid custom question count was kept in the profile; it is now only saved when valid.
- `test.js` targeted an older API and could not run; rewritten against the current code.

### Added
- Physical keyboard support in the quiz (digits, Backspace, Enter; 1–4 for multiple choice; Esc closes panels).
- Translated ARIA labels for icon buttons, live regions for question/feedback, visible focus rings, reduced-motion support.
- Meta description, favicon / apple-touch-icon.
- Auto theme follows system changes live.
- `roadmap.md`, `CHANGELOG.md`, `AGENTS.md`.

### Changed
- `app.js` and `index.html` reformatted into readable source.
- Pure logic exported via `module.exports` (Node) and `window.MathKidsTest` (browser).

## 3.0.0
- 1-, 2-, or 3-digit difficulty for addition and subtraction.
- Subtraction never produces negative answers.
- Progress records addition/subtraction accuracy by digit count.
