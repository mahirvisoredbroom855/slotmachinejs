import { SlotSymbol, SymbolsCount, SymbolValues, SpinResult, SpinParams } from "./types";

const ROWS = 3;
const COLS = 3;

export const SYMBOLS_COUNT: SymbolsCount = {
  "A": 2,
  "B": 4,
  "C": 6,
  "D": 8,
};

export const SYMBOL_VALUES: SymbolValues = {
  "A": 5,
  "B": 4,
  "C": 3,
  "D": 2,
};

/**
 * Generates random reels based on weighted symbol distribution
 */
export const spin = (): SlotSymbol[][] => { // FIX: changed symbol to SlotSymbol
  const symbols: SlotSymbol[] = []; // FIX: changed symbol to SlotSymbol
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol as SlotSymbol);
    }
  }

  const reels: SlotSymbol[][] = []; // FIX: SlotSymbol

  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols];

    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1);
    }
  }

  return reels;
};

/**
 * Transposes reels (columns) into rows for payline checking
 */
export const transpose = (reels: SlotSymbol[][]): SlotSymbol[][] => { // FIX: SlotSymbol
  const rows: SlotSymbol[][] = [];

  for (let i = 0; i < ROWS; i++) {
    rows.push([]);
    for (let j = 0; j < COLS; j++) {
      rows[i].push(reels[j][i]);
    }
  }

  return rows;
};

/**
 * Calculates winnings based on matching symbols in active paylines
 */
export const getWinnings = (rows: SlotSymbol[][], betPerLine: number, lines: number): number => { // FIX: SlotSymbol
  let winnings = 0;

  for (let row = 0; row < lines; row++) {
    const symbols = rows[row];
    let allSame = true;

    for (const symbol of symbols) {
      if (symbol !== symbols[0]) {
        allSame = false;
        break;
      }
    }

    if (allSame) {
      // symbols[0] is now SlotSymbol, so it can index SYMBOL_VALUES
      winnings += betPerLine * SYMBOL_VALUES[symbols[0]];
    }
  }

  return winnings;
};

/**
 * Counts observed symbol frequencies in the reels
 */
export const countSymbols = (reels: SlotSymbol[][]): { [key: string]: number } => { // FIX: SlotSymbol
  const counts: { [key: string]: number } = { A: 0, B: 0, C: 0, D: 0 };

  for (const reel of reels) {
    for (const symbol of reel) {
      counts[symbol]++; // This works now because SlotSymbol is a string-based type
    }
  }

  return counts;
};

/**
 * Main spin function
 */
export const runSpin = (params: SpinParams): SpinResult => {
  const { lines, betPerLine } = params;
  const totalBet = betPerLine * lines;

  const reels = spin();
  const rows = transpose(reels);
  const winnings = getWinnings(rows, betPerLine, lines);
  const net = winnings - totalBet;
  const symbolCountsObserved = countSymbols(reels);

  return {
    reels,
    rows,
    winnings,
    totalBet,
    net,
    symbolCountsObserved,
  };
};

export const getExpectedProbabilities = (): { [key: string]: number } => {
  const total = Object.values(SYMBOLS_COUNT).reduce((sum: number, count: number) => sum + count, 0); // Added types
  const probabilities: { [key: string]: number } = {};

  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    probabilities[symbol] = count / total;
  }

  return probabilities;
};
