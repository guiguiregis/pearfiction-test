# Pearfiction slot (PixiJS)

A minimal **5×3** reel slot built with **PixiJS v8**, **TypeScript**, and **Vite**. Symbols load on a preloader screen; each spin picks random band positions, updates the reels (no spin animation), and evaluates wins on seven paylines with the paytable from the assignment brief.

## Requirements

- **Node.js** 18+ (recommended)

## Setup

```bash
npm install
```

## Scripts

| Command        | Description                                      |
|----------------|--------------------------------------------------|
| `npm run dev`  | Start the Vite dev server with hot reload        |
| `npm start`    | Same as `npm run dev`                            |
| `npm run build`| Run ESLint, `tsc`, then production Vite build    |
| `npm run lint` | Run ESLint                                     |

Open the URL Vite prints (usually `http://localhost:5173`).

## Project layout

| Path | Role |
|------|------|
| `src/main.ts` | Pixi app, asset loading, layout (reels → spin → win text), resize scaling |
| `src/utils.ts` | Win evaluation: screen grid from bands, paylines 1–3 vs 4–7 rules |
| `src/config.ts` | Reel bands, paylines, paytable, row/column counts |
| `src/components/Reel.ts` | One reel column: stacked symbol sprites |
| `public/assets/` | Symbol and spin button PNGs |
| `public/style.css` | Page and `#pixi-container` layout |
| `public/programming exercise.md` | Original brief and reference examples |

## Behaviour (brief)

- **Grid:** five columns × three visible rows per the band math in `config.ts`.
- **Paylines:** straight lines (1–3) pay left-to-right from column 0; zig-zag lines (4–7) use the best contiguous same-symbol run on the path (see `utils.ts` and the exercise examples).
- **UI:** reels centered, spin button under the reels, multiline win text under the spin; the whole cluster scales to fit the viewport on resize.

