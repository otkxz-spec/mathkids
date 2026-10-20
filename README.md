# Math Kids

Free, offline, ad-free math practice for children. A static, installable web app (PWA) hosted on GitHub Pages.

- Addition, subtraction (1–3 digits), multiplication tables and division (tables 1–12)
- Typed (on-screen keypad or physical keyboard) or multiple-choice answers
- English / Spanish, light / dark / auto theme, optional sound effects
- Multiple local profiles with progress by operation, difficulty and table, plus day streaks
- Works offline after the first visit; all data stays in the browser (`localStorage`)

See [roadmap.md](roadmap.md) for planned work and [CHANGELOG.md](CHANGELOG.md) for history.

## Project files

| File | Purpose |
|---|---|
| `index.html` | Screens and sheets (markup only) |
| `style.css` | Design tokens, light/dark themes, layout |
| `app.js` | Logic + UI. Pure functions are exported for tests |
| `sw.js` | Service worker: network-first, offline fallback |
| `manifest.json` | PWA install metadata and icons |
| `icon-*.png` | App icons |
| `test.js` | Unit tests (Node, no dependencies) |
| `roadmap.md` / `CHANGELOG.md` / `AGENTS.md` | Planning, history, contributor/agent rules |

## Run locally

Any static server works, e.g. `npx serve .` or `python -m http.server`, then open `http://localhost:8000`.
(Opening `index.html` directly also works, but the service worker only runs over http/https.)

## Tests

Requires [Node.js](https://nodejs.org) 18+:

```
node test.js
```

## Deploy with GitHub Pages

1. Upload all files in this folder to the repository root (replace the old ones).
2. Repository Settings > Pages > Deploy from a branch > `main` / `(root)`.
3. Open `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.
4. On every release, bump `VERSION` in `sw.js`.

Existing profiles and progress are migrated automatically.
