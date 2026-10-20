# Math Kids Product Roadmap

> **Purpose:** Evolve Math Kids from a quiz app into a safe, engaging, evidence-informed learning tool that builds arithmetic fluency without distracting children from the mathematics.
>
> **Current baseline (v3):** Addition, subtraction, multiplication, division; 1–3 digit addition/subtraction; multiplication-table selection; typed and multiple-choice answers; English/Spanish; profiles; local progress tracking; round summaries; offline-capable PWA deployed on GitHub Pages.

## Status tracker

| Item | Status |
|---|---|
| 3.0.1 Maintenance (bug fixes, tests, readable source) | ✅ Done |
| 3.0.2 Visible app version in Settings | ✅ Done |
| 3.1.1 Retry and explanation flow | ✅ Done (v3.1.0) |
| 3.1.2 Error-aware answer choices | ⬜ Next |
| 3.1.3 Skills model | ⬜ |
| 3.2 Adaptive practice | ⬜ |
| 3.6 Accessibility baseline | 🟡 Started (keyboard input, focus rings, ARIA labels) |
| 3.3 Engagement and rewards | ⬜ |
| 3.4 Additional learning modes | ⬜ |
| 3.5 Parent dashboard and export | ⬜ |
| 3.7 Privacy and deployment hardening | ⬜ |
| 4.0 Optional cloud sync | ⬜ |

---

## 1. Product principles

Every feature should support at least one of these principles:

1. **Learning comes first.** The mathematical action should be the central interaction, not a task children must complete before a separate game.
2. **Short, successful sessions.** Default sessions should feel achievable, with clear progress and a natural stopping point.
3. **Adaptive, not punitive.** Difficulty should respond to performance without labeling children as weak or showing public rankings.
4. **Useful feedback.** Incorrect answers should receive a brief explanation or another attempt, not only a red mark.
5. **Celebrate effort and mastery.** Reward consistency, improvement, strategy use, and accuracy instead of speed alone.
6. **Child-safe by default.** No ads, chat, behavioral profiling, public leaderboards, or unnecessary personal data.
7. **Accessible and calm.** Large touch targets, readable type, reduced-motion support, color-independent status indicators, and optional sound.
8. **Parent visibility without pressure.** Progress should help an adult choose the next practice area without turning the experience into surveillance.
9. **Offline-first.** Core learning, profiles, and progress should continue to work without a network connection.
10. **Simple architecture.** Prefer plain HTML/CSS/JavaScript and local storage until a real requirement justifies accounts or a backend.

---

## 2. Success measures

Track these locally by profile. Do not add remote analytics until a privacy review is complete.

- **Learning:** accuracy by skill, improvement across the last 5 comparable rounds, error type, and mastery retention.
- **Engagement:** completed sessions, return days, voluntary extra rounds, and sessions abandoned before completion.
- **Usability:** setup completion, accidental exits, questions skipped, and use of help/explanations.
- **Safety:** zero advertising, zero public social features, zero unnecessary child data, and no feature blocked behind manipulative reward loops.

### Initial product targets

- A child can start a practice round in **three taps or fewer** from the home screen after profile setup.
- Default rounds contain **10 questions**, with 5-question quick practice available.
- A normal round has a clear endpoint and never auto-starts another round.
- Every incorrect response offers either a useful explanation, a second attempt, or a worked example.
- All essential controls remain usable at **200% browser zoom** and on a **360 × 640 px** viewport.

---

## 3. Prioritized roadmap

## Release 3.1 — Learning-quality foundation

**Goal:** Make practice more instructive before adding more rewards.

### 3.1.1 Retry and explanation flow

- Add a setting with two modes:
  - **Practice mode:** one retry before revealing the answer.
  - **Quiz mode:** one answer only, explanation shown afterward.
- After an incorrect answer, show a short operation-specific explanation:
  - Addition: place-value or count-on explanation.
  - Subtraction: difference/count-back explanation.
  - Multiplication: repeated groups or known-fact decomposition.
  - Division: equal groups and inverse multiplication fact.
- Add a **Show me** button for a worked example.
- Never require reading a long paragraph during a question.

**Acceptance criteria**

- A wrong answer cannot be submitted repeatedly to farm points.
- Explanations are available in English and Spanish.
- Explanations work in typed and multiple-choice modes.
- The round summary distinguishes first-try correct, retry correct, and unresolved questions.

### 3.1.2 Error-aware answer choices

Replace generic near-miss distractors with common error patterns:

- Addition: off-by-one, place-value error, ignored carry.
- Subtraction: reversed subtraction, off-by-one, borrowing error.
- Multiplication: neighboring-table fact, addition instead of multiplication.
- Division: nearby quotient, divisor/quotient confusion, multiplication result.

**Acceptance criteria**

- Four choices remain unique and non-negative.
- Exactly one choice is correct.
- Every distractor has an internal `reasonCode` so progress can summarize common mistakes.

### 3.1.3 Skills model

Introduce stable skill IDs instead of relying only on operation names:

- `ADD_1D_NO_CARRY`
- `ADD_2D_NO_CARRY`
- `ADD_2D_WITH_CARRY`
- `ADD_3D_MIXED`
- `SUB_1D`
- `SUB_2D_NO_BORROW`
- `SUB_2D_WITH_BORROW`
- `SUB_3D_MIXED`
- `MUL_TABLE_1` through `MUL_TABLE_12`
- `DIV_TABLE_1` through `DIV_TABLE_12`

Each question should contain `skillId`, `difficulty`, `answer`, and optional `reasonCode` fields.

**Acceptance criteria**

- Existing profiles migrate without losing historical totals.
- New progress records are stored by skill ID.
- The UI continues to show friendly labels rather than technical IDs.

---

## Release 3.2 — Adaptive practice

**Goal:** Give each child the right amount of challenge.

### 3.2.1 Practice recommendations

Add a prominent **Practice for me** button that builds a 10-question round using:

- 60% skills needing practice.
- 30% skills currently being learned.
- 10% mastered skills for retention.

If there is insufficient history, use the child's last selected settings.

### 3.2.2 Mastery states

Use four internal states per skill:

- **New:** fewer than 5 attempts.
- **Learning:** at least 5 attempts and below 80% accuracy.
- **Ready:** at least 10 attempts and 80–89% accuracy.
- **Mastered:** at least 15 attempts and at least 90% accuracy, including performance on more than one day.

These are starting thresholds, not permanent truth. Revisit after testing with real users.

### 3.2.3 Spaced review

- Reintroduce previously mastered facts after increasing intervals.
- Prioritize facts answered incorrectly or slowly, but do not punish slower children.
- Keep a maximum of two difficulty jumps within one session.
- Give the child a visible **Make it easier** option at all times.

**Acceptance criteria**

- The app can explain why a recommended skill was selected in parent-friendly language.
- Adaptive rounds never include an operation disabled for that profile unless an adult enables recommendations across all operations.
- Recommendation logic has deterministic automated tests.

---

## Release 3.3 — Engagement without distraction

**Goal:** Keep children interested while preserving mathematical focus.

### 3.3.1 Stars and XP

- Award stars for completed learning goals, not for tapping quickly.
- Suggested scoring:
  - 1 star: complete a round.
  - 1 additional star: at least 80% first-try accuracy.
  - 1 additional star: improve a focus skill or achieve 100%.
- Never remove previously earned stars.

### 3.3.2 Achievement badges

Initial badges:

- **First Steps:** complete the first round.
- **Perfect Round:** achieve 100% on a round with at least 10 questions.
- **Addition Explorer:** complete 50 addition questions.
- **Subtraction Explorer:** complete 50 subtraction questions.
- **Table Master:** master one multiplication table.
- **Division Detective:** complete 50 division questions.
- **Comeback Kid:** improve a skill by at least 20 percentage points across comparable rounds.
- **Practice Streak:** practice on 3 different consecutive days.

Badges should be private to the profile and should not rank children against each other.

### 3.3.3 Collection and customization

- Let children spend earned stars on cosmetic themes, avatar accessories, or a room/planet collection.
- Cosmetics must never affect question difficulty or learning access.
- Include a **Calm mode** that disables celebrations, animations, and sound.

### 3.3.4 Micro-celebrations

- Use brief, skippable celebrations after milestones or at the end of a round.
- Avoid confetti after every answer.
- Respect the browser's `prefers-reduced-motion` setting.
- Do not use infinite feeds, countdown pressure, loot boxes, or random rewards.

**Acceptance criteria**

- A child can skip every celebration immediately.
- Turning on Calm mode removes nonessential motion and sound.
- Rewards cannot be purchased and are not connected to advertisements.

---

## Release 3.4 — More learning modes

**Goal:** Move beyond isolated calculation while keeping the app approachable.

### 3.4.1 Visual models

Add optional visual aids:

- Ten-frames for addition and subtraction within 20.
- Number lines for addition, subtraction, and early multiplication.
- Arrays for multiplication.
- Equal-group diagrams for division.
- Base-ten blocks for 2- and 3-digit addition/subtraction.

### 3.4.2 Fact-family mode

Present connected facts together:

- `3 × 4 = 12`
- `4 × 3 = 12`
- `12 ÷ 3 = 4`
- `12 ÷ 4 = 3`

### 3.4.3 Missing-number mode

Examples:

- `__ + 7 = 12`
- `34 − __ = 19`
- `6 × __ = 42`
- `56 ÷ __ = 8`

### 3.4.4 Word problems

- Add short, age-appropriate word problems.
- Use familiar contexts without brand references.
- Support optional read-aloud.
- Record word-problem performance separately from calculation fluency.

### 3.4.5 Mixed challenge mode

- Combine learned skills in one round.
- Label this as a challenge, not a default.
- Keep question complexity separate from calculation size.

---

## Release 3.5 — Parent view and learning plans

**Goal:** Turn the collected progress into useful, low-pressure guidance.

### 3.5.1 Parent gate

Protect profile deletion, progress reset, data export, and learning-plan changes behind an adult gate. Use an adult-readable prompt rather than collecting a password from the child.

### 3.5.2 Parent dashboard

Show:

- Current accuracy and attempt volume by skill.
- First-try accuracy versus retry accuracy.
- Recent improvement.
- Skills ready to advance.
- Skills needing review.
- Common answer-error categories.
- Practice frequency without shaming missed days.

### 3.5.3 Weekly learning plan

Allow an adult to set:

- 2–5 focus skills.
- Preferred round length.
- Days of practice.
- Whether speed challenges are permitted.
- Maximum difficulty.

### 3.5.4 Export and portability

- Export one profile or all profiles to a human-readable JSON file.
- Import with schema-version validation.
- Offer a printable one-page progress summary.
- Include a clear **Delete all local data** action.

---

## Release 3.6 — Accessibility and inclusive design

**Goal:** Make the app comfortable for a wider range of children.

### Required improvements

- Keyboard access for every control.
- Visible focus indicators.
- Screen-reader labels and meaningful announcements.
- Status never communicated by color alone; include icon and text.
- Minimum 44 × 44 CSS-pixel touch targets.
- High-contrast theme.
- Dyslexia-friendly font option, while retaining the system font as default.
- Reduced-motion and no-sound modes.
- Optional larger numbers and simplified screen layout.
- Read-aloud for instructions and word problems, with no automatic audio.
- Left-to-right layout testing for English and Spanish; establish a localization framework before adding right-to-left languages.

### Accessibility release gate

- Complete keyboard-only test.
- Complete screen-reader smoke test on Android TalkBack and one desktop screen reader.
- Test at 200% browser zoom.
- Test 360 × 640 px, 390 × 844 px, tablet portrait, and tablet landscape.
- Run automated checks, but do not treat automated results as sufficient by themselves.

---

## Release 3.7 — Privacy, safety, and deployment hardening

**Goal:** Be safe enough for genuine child use before broader distribution.

### Privacy

- Keep the default experience account-free and local-only.
- Do not collect full names, birth dates, school names, precise locations, contact details, photos, voice recordings, advertising identifiers, or free-text chat.
- If cloud sync is added later, design a verifiable parental-consent flow and complete a legal/privacy review before launch.
- Publish a plain-language parent privacy notice describing exactly what is stored and where.
- Add data export and deletion before any cloud storage.

### Security

- Apply a strict Content Security Policy.
- Escape all profile names and imported content.
- Validate imported JSON against a versioned schema.
- Add dependency scanning if third-party packages are introduced.
- Add automated tests for local-storage migration and corrupt-data recovery.
- Never place API keys or secrets in the GitHub Pages repository.

### Reliability

- Add a first-run onboarding test.
- Add offline smoke tests.
- Add service-worker upgrade tests.
- Add backup before destructive data migration.
- Include a visible app version in Parent Settings.
- Maintain `CHANGELOG.md` and migration notes.

---

## Release 4.0 — Optional cloud sync and multi-device use

**Do not begin this release until the local-only product is validated with families.**

Possible scope:

- Adult-owned account with child subprofiles.
- Encrypted profile sync across devices.
- Parent-controlled recovery and deletion.
- No child-to-child messaging or public profiles.
- No public leaderboards.
- Explicit offline behavior and conflict resolution.

Cloud sync introduces privacy, security, operational, and legal obligations. Treat it as a separate product phase rather than a small feature.

---

## 4. User-experience improvements backlog

Prioritize alongside the releases above:

- One-tap **Quick practice** from the home screen.
- Clear explanation of Typed versus Multiple Choice mode.
- Preview examples under each difficulty selection.
- Undo profile deletion for the current session.
- Confirm before abandoning an unfinished round.
- Pause/resume for longer rounds.
- Keep the primary action within thumb reach on phones.
- Prevent double taps from submitting two answers.
- Preserve an unfinished round if the browser is accidentally refreshed.
- Make error messages specific and place them near the control needing attention.
- Add an optional session-end question: “Was that too easy, just right, or too hard?”
- Add a child-friendly tutorial that can be skipped and reopened.
- Offer a neutral visual theme for older children.
- Separate “number size” from “regrouping/borrowing” difficulty.

---

## 5. Content-quality checklist

Every new skill or question generator must meet these conditions:

- Correct answer verified by automated tests.
- No unintended negative subtraction results unless a future signed-number skill explicitly enables them.
- Division questions match the selected remainder policy.
- Multiple-choice options are unique and contain exactly one correct answer.
- Distractors are plausible but not ambiguous.
- Wording is grammatically correct in English and Spanish.
- The visual representation matches the equation.
- Content does not rely on stereotypes, commercial brands, or sensitive personal scenarios.
- Difficulty is determined by more than number size when appropriate, including carrying, borrowing, and number of steps.

---

## 6. Technical roadmap

### Near term

- Split `app.js` into modules:
  - `question-generator.js`
  - `progress-store.js`
  - `adaptive-engine.js`
  - `i18n.js`
  - `ui.js`
- Add a test runner and deterministic random-number injection.
- Add schema versions for settings, profiles, progress, questions, and imports.
- Create reusable components for chips, dialogs, progress meters, and answer feedback.
- Add `CHANGELOG.md`, `CONTRIBUTING.md`, and `AGENTS.md`.

### Testing minimums

- Unit tests for every question generator and difficulty rule.
- Property-style tests generating at least 1,000 questions per skill.
- Tests for unique answer options and exactly one correct option.
- Tests for profile separation and data migrations.
- End-to-end tests for English/Spanish, typed/multiple-choice, light/dark, and offline launch.
- Visual regression screenshots for key phone and tablet sizes.
- Accessibility checks for focus order, labels, contrast, and reduced motion.

### Performance budget

- Core app works without network access after installation.
- Avoid large frameworks, video backgrounds, and heavy animation libraries.
- Keep the initial application payload small enough to load comfortably on a basic mobile connection.
- Lazy-load optional illustrations and audio.

---

## 7. Suggested release order

1. **3.1 Learning-quality foundation**
2. **3.2 Adaptive practice**
3. **3.6 Accessibility baseline**
4. **3.3 Engagement and rewards**
5. **3.4 Additional learning modes**
6. **3.5 Parent dashboard and export**
7. **3.7 Privacy and deployment hardening**
8. **4.0 Optional cloud sync**

The order intentionally builds better teaching and accessibility before adding a larger reward system. Engagement features should reinforce learning behavior rather than mask weak instructional design.

---

## 8. Definition of done for every feature

A feature is complete only when:

- The child-facing behavior is implemented in English and Spanish.
- It works in typed and multiple-choice modes where applicable.
- Progress meaningfully records the outcome.
- Automated tests cover normal, boundary, and migration cases.
- The feature works offline.
- Keyboard, touch, reduced-motion, and dark-mode behavior are checked.
- No new personal data is collected without an explicit privacy decision.
- Existing profile progress is preserved.
- `README.md`, `CHANGELOG.md`, and the service-worker cache version are updated.
- A real-browser smoke test passes on phone and tablet layouts.

---

## 9. Instructions for coding agents

When implementing this roadmap:

1. Read `README.md`, `roadmap.md`, `CHANGELOG.md`, and `AGENTS.md` before editing.
2. Implement one roadmap item per branch or pull request.
3. State the acceptance criteria being addressed before changing code.
4. Preserve existing local-storage data through versioned migrations.
5. Add or update tests before declaring the item complete.
6. Do not add dependencies unless the benefit and bundle impact are documented.
7. Do not add analytics, cloud storage, authentication, advertising, or third-party tracking without an explicit roadmap decision.
8. Do not redesign unrelated screens during a scoped feature task.
9. Update the roadmap checkbox/status and changelog in the same change.
10. Report files changed, tests run, known limitations, and manual checks still required.

---

## 10. Evidence and review notes

This roadmap is a product recommendation, not a claim that every listed mechanic is proven to improve learning. Educational-app research emphasizes the importance of instructional design, implementation, accessibility, privacy, safety, and evidence of learning support. The product should measure learning outcomes and revise thresholds after observation with real families rather than assuming that engagement alone equals learning.

Suggested background reading:

- British Journal of Educational Technology, **Educational apps and learning: Current evidence on design and evaluation**: https://bera-journals.onlinelibrary.wiley.com/doi/epdf/10.1111/bjet.13360
- University of Michigan, **Children’s Learning App Evaluation and Review (CLEAR Method)**: https://marsal.umich.edu/projects/childrens-learning-app-evaluation-and-review
- **Efficacy of an Adaptive Game-Based Math Learning App**: https://link.springer.com/article/10.1007/s10643-022-01332-3

---

## 11. Next implementation milestone

Start with **Release 3.1.1: Retry and explanation flow**.

Recommended first issue:

> Add Practice and Quiz feedback modes. In Practice mode, allow one retry after an incorrect response, then show a concise worked explanation. Record first-try correct, retry correct, and unresolved outcomes separately. Support English and Spanish, typed and multiple-choice inputs, existing profiles, and offline mode.
