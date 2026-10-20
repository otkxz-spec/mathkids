# Math Kids (v2)

Static web app / installable Android PWA. No build step, no dependencies.

## Features
- Addition, subtraction, multiplication, division; choose tables 1-12 and number of questions
- **Type it** or **Multiple choice** answer mode (choices are plausible near-misses, e.g. 7x8 -> 48, 49, 56, 64)
- **Profiles**: each child has a name, avatar, their own last-used selections and their own progress
- **Progress** per profile: rounds, questions, accuracy, day streak, accuracy by operation,
  mastery grid for tables 1-12 (green 90%+, yellow 70-89%, red <70%), last-10-rounds chart
- Round summary with score, stars, time and a "Show answers" list
- Settings: English / Spanish, number ranges, instant feedback, sound, light / dark theme

## Data & privacy
Everything is stored in the browser's localStorage on the device (`mk_profiles`, `mk_settings`).
Nothing is sent anywhere. Clearing site data or uninstalling the app erases progress.
Progress keeps lifetime totals plus the last 50 rounds per profile.
Upgrading from v1 keeps the old selections inside the first profile.

## Run locally
    python -m http.server 8080      # then open http://localhost:8080

## Deploy (any static host; HTTPS is required for install + offline)
- GitHub Pages: push files to a repo > Settings > Pages > deploy from branch.
- Netlify / Cloudflare Pages / Vercel: drag & drop the folder.
- Azure Static Web Apps: point it at this folder, no build command.

## Android
- Quick: open the deployed URL in Chrome > menu > "Install app" / "Add to Home screen".
- Google Play: wrap with PWABuilder (pwabuilder.com) or Bubblewrap to get an .aab (Trusted Web Activity).

## Customise
- Texts / languages: `I18N` object at the top of `app.js`.
- Avatars: `AVATARS` array in `app.js`.
- Colours: CSS variables at the top of `style.css`.
- After changing files, bump `VERSION` in `sw.js` so installed copies refresh (currently mathkids-v2).

## Tests
    node test.js        # question generation, multiple-choice, stats/streaks, translations
