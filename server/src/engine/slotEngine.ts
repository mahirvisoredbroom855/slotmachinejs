import { Symbol, SymbolsCount, SymbolValues, SpinResult, SpinParams } from './types';

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
export const spin = (): Symbol[][] => {
  // Build weighted symbol pool
  const symbols: Symbol[] = [];
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    for (let i = 0; i < count; i++) {
      symbols.push(symbol as Symbol);
    }
  }

  const reels: Symbol[][] = [];
  
  for (let i = 0; i < COLS; i++) {
    reels.push([]);
    const reelSymbols = [...symbols]; // Copy pool for this reel
    
    for (let j = 0; j < ROWS; j++) {
      const randomIndex = Math.floor(Math.random() * reelSymbols.length);
      const selectedSymbol = reelSymbols[randomIndex];
      reels[i].push(selectedSymbol);
      reelSymbols.splice(randomIndex, 1); // Remove selected symbol
    }
  }
  
  return reels;
};

/**
 * Transposes reels (columns) into rows for payline checking
 */
export const transpose = (reels: Symbol[][]): Symbol[][] => {
  const rows: Symbol[][] = [];
  
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
export const getWinnings = (rows: Symbol[][], betPerLine: number, lines: number): number => {
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
      winnings += betPerLine * SYMBOL_VALUES[symbols[0]];
    }
  }
  
  return winnings;
};

/**
 * Counts observed symbol frequencies in the reels
 */
export const countSymbols = (reels: Symbol[][]): { [key: string]: number } => {
  const counts: { [key: string]: number } = { A: 0, B: 0, C: 0, D: 0 };
  
  for (const reel of reels) {
    for (const symbol of reel) {
      counts[symbol]++;
    }
  }
  
  return counts;
};

/**
 * Main spin function that orchestrates the entire spin process
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

/**
 * Calculate expected probabilities for analytics
 */
export const getExpectedProbabilities = (): { [key: string]: number } => {
  const total = Object.values(SYMBOLS_COUNT).reduce((sum, count) => sum + count, 0);
  const probabilities: { [key: string]: number } = {};
  
  for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
    probabilities[symbol] = count / total;
  }
  
  return probabilities;
};