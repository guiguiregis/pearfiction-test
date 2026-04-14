# Pearfiction slot (PixiJS)

A minimal **5×3** reel slot built with **PixiJS v8**, **TypeScript**, and **Vite**. Symbols load on a preloader screen; each spin picks random band positions, updates the reels (no spin animation), and evaluates wins on seven paylines with the paytable from the assignment brief.

## Requirements

- **Node.js** 18+ (recommended)

## Setup

```bash
npm install
```

## Scripts

| Command           | Description                                               |
|-------------------|-----------------------------------------------------------|
| `npm run dev`     | Start the Vite dev server with hot reload                 |
| `npm start`       | Same as `npm run dev`                                     |
| `npm run build`   | Run ESLint, `tsc`, then production Vite build             |
| `npm run ci`      | Lint, unit tests, `tsc`, and Vite build (use in CI)       |
| `npm run lint`    | Run ESLint                                                |
| `npm run test`    | Run Vitest once (`vitest run`)                            |
| `npm run test:watch` | Vitest in watch mode                                   |

Open the URL Vite prints (usually `http://localhost:5173`).

## Payline rules

The spec’s worked examples require two behaviours (see `src/utils.ts`):

1. **Paylines 1–3** (straight horizontal rows): the winning run is the **same symbol from column 0** along the row until the first mismatch (classic left-to-right line pay).
2. **Paylines 4–7** (zig-zags): take the **best paying contiguous run** of one symbol **anywhere** on that payline path (so cases like payline 7 in the brief can pay while column 0 differs).

`evaluateSpin` is covered by unit tests that match every totals / win-detail example in `public/programming exercise.md`.

## Project layout

| Path | Role |
|------|------|
| `src/main.ts` | Pixi app, asset loading, layout (reels → spin → win text), resize scaling |
| `src/utils.ts` | Win evaluation: screen grid from bands, paylines 1–3 vs 4–7 rules |
| `src/utils.test.ts` | Vitest cases for `evaluateSpin` vs exercise examples |
| `src/config.ts` | Reel bands, paylines, paytable (`Paytable` type exported) |
| `src/components/Reel.ts` | One reel column: stacked symbol sprites |
| `public/assets/` | Symbol and spin button PNGs |
| `public/style.css` | Page and `#pixi-container` layout |
| `public/programming exercise.md` | Original brief and reference examples |

## Behaviour (brief)

- **Grid:** five columns × three visible rows per the band math in `config.ts`.
- **UI:** reels centered, spin button under the reels, multiline win text under the spin; the whole cluster scales to fit the viewport on resize.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs `npm ci` and `npm run ci` on pushes and pull requests to `main` / `master`.

## Production build

```bash
npm run build
```

Output is written to `dist/`. Serve that folder with any static host.
