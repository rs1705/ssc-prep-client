# EptSSC client — Next.js

See `../CLAUDE.md` for product, colour and safety rules that apply everywhere.

## Commands

```bash
npm run dev          # next dev on :3000 (or preview "client" from ../.claude/launch.json)
npx tsc --noEmit -p .
npm run lint         # eslint (warnings are OK, errors are not)
npm test             # vitest run
npm run build        # don't run while `next dev` is running: it breaks the dev server
```

Before calling work done: `tsc` clean, `npm test` green, lint has no errors, and the change
checked in the browser (phone width 375px too, if it's a layout change).

## Layout of the code

- `app/` — routes. Subject pages under `app/SSC/[subject]/…`; mock tests at `app/mock-tests`
  (the running test is `app/mock-tests/attempt`, which renders full-screen — see
  `components/custom/app-layout.tsx`).
- `features/<area>/` — feature code: `mock` (exam screen, attempts, score trend), `pyq`
  (topic practice runner, session logic), `games`, `hangman`, `wordle`, `match`, `cloze`,
  `spelling`, `pinpoint`, `flashcards`, `dashboard`, `landing`, `review`, …
- `components/custom/` — shared app chrome (sidebar, top bar, loaders, layouts).
- `lib/` — pure logic and helpers: `subject-theme.ts` (the only colour themes),
  `storage.ts` (localStorage helpers), `activity-log.ts`, `progress-sync.ts` (account sync),
  `today-plan.ts`, `nav.ts`.
- `features/content/` — the question content renderer (blocks, diagrams). Copied unchanged from
  `ingestion-pipeline/src/content/`; change it there and copy it over. App-only: `Blocks.tsx`, `app-theme.css`.
- `redux/` — RTK Query APIs (`FlashcardApiSlice.ts` base, `PyqApi.ts`).

## Conventions

- Tailwind tokens: `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`,
  `brand-*`. Subject colours only via `subjectTheme()` / `SUBJECT_HUE`.
- Combine classes with `cn()` from `lib/utils`.
- Progress that should follow the user across devices lives in localStorage *and* is added
  to `lib/progress-sync.ts` (and to the server merge in `server/src/progress/merge.ts`).
- `useEffect` bodies always use braces. Never `useEffect(() => someCall())`: newer Chrome
  returns a Promise from `scrollTo` and React crashes with "destroy is not a function".
- API reads go through RTK Query; GETs retry while the server wakes (`lib/server-wake.ts`).
- Pure logic gets a vitest test next to it (`*.test.ts`). Tests that touch localStorage
  stub `window` the way `features/games/sessions.test.ts` does.
- Words shown to users are plain and short. No jargon in UI copy.
