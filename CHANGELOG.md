# Changelog

## 3.1.0 — Retry and explanation flow (roadmap 3.1.1)
### Added
- **Practice / Quiz mode** per profile (Home → "How do you want to answer?"). Default: Practice.
  - Practice: one retry after a wrong answer (wrong multiple-choice option is greyed out), then the answer + explanation.
  - Quiz: one answer only, then the answer + explanation.
- Short operation-specific explanation after an unresolved answer (make-10 / count-on, column add with carry, think-addition / column subtract with borrow, equal groups / split-the-fact, inverse multiplication), in English and Spanish.
- **Show me** button with a worked example: place-value steps and dot pictures / arrays for small numbers.
- Summary shows **First try / On retry / Unresolved**; stars and % give half credit for a correct retry. Answer list shows explanations for missed questions (also when instant feedback is off).
- Progress stats record `firstTry` and `retry` counts; history entries record outcomes.
### Migration
- Existing profiles get `feedbackMode: 'practice'`; old stats and results are kept unchanged.

## 3.0.2 — Visible version
### Added
- App version shown at the bottom of the Settings panel (e.g. "Version 3.0.2"), so you can confirm which release is live.
- Single `APP_VERSION` constant in `app.js`; tests ensure it matches `sw.js` and has a changelog entry.

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
