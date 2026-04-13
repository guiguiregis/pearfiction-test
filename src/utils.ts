import { CONFIG } from "./config";

export interface WinDetail {
  paylineId: number;
  symbolId: string;
  count: number;
  payout: number;
}

type Paytable = Record<string, Record<number, number>>;

function payoutForSymbolCount(
  paytable: Paytable,
  symbolId: string,
  count: number,
): number | null {
  const p = paytable[symbolId]?.[count];
  return p ?? null;
}

// Straight horizontal lines (paylines 1–3): must match from column 0 along the row.
function winLeftAnchored(path: string[]): {
  symbolId: string;
  count: number;
  payout: number;
} | null {
  const paytable = CONFIG.PAYTABLE as Paytable;
  const firstSymbol = path[0];
  let matchCount = 1;
  for (let col = 1; col < path.length; col++) {
    if (path[col] === firstSymbol) {
      matchCount++;
    } else {
      break;
    }
  }
  if (matchCount < 3) return null;
  const payout = payoutForSymbolCount(paytable, firstSymbol, matchCount);
  if (payout == null) return null;
  return { symbolId: firstSymbol, count: matchCount, payout };
}

// Zig-zag lines (paylines 4–7): best contiguous run of the same symbol anywhere on the path.
function winBestRunOnPath(path: string[]): {
  symbolId: string;
  count: number;
  payout: number;
} | null {
  const paytable = CONFIG.PAYTABLE as Paytable;
  let best: { symbolId: string; count: number; payout: number } | null = null;
  for (let start = 0; start < path.length; start++) {
    const symbolId = path[start];
    let count = 1;
    for (let i = start + 1; i < path.length && path[i] === symbolId; i++) {
      count++;
    }
    if (count < 3) continue;
    const payout = payoutForSymbolCount(paytable, symbolId, count);
    if (payout == null) continue;
    if (
      !best ||
      payout > best.payout ||
      (payout === best.payout && count > best.count)
    ) {
      best = { symbolId, count, payout };
    }
  }
  return best;
}

const ZIGZAG_PAYLINE_INDEX_START = 3;

// First index in PAYLINES that is a zig-zag (payline 4 in the spec).
export function evaluateSpin(positions: number[]) {
  let totalWins = 0;
  const winDetails: WinDetail[] = [];

  const screen: string[][] = [];
  for (let row = 0; row < CONFIG.ROW_COUNT; row++) {
    screen[row] = [];
    for (let col = 0; col < CONFIG.REEL_COUNT; col++) {
      const band = CONFIG.BANDS[col];
      const pos = positions[col];
      screen[row][col] = band[(pos + row) % band.length];
    }
  }

  CONFIG.PAYLINES.forEach((line: number[], index: number) => {
    const path = line.map((row: number, col: number) => screen[row][col]);
    const win =
      index < ZIGZAG_PAYLINE_INDEX_START
        ? winLeftAnchored(path)
        : winBestRunOnPath(path);
    if (win) {
      totalWins += win.payout;
      winDetails.push({
        paylineId: index + 1,
        symbolId: win.symbolId,
        count: win.count,
        payout: win.payout,
      });
    }
  });

  return { totalWins, winDetails };
}
