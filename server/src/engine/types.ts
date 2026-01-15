export type Symbol = "A" | "B" | "C" | "D";

export interface SymbolsCount {
  [key: string]: number;
}

export interface SymbolValues {
  [key: string]: number;
}

export interface SpinResult {
  reels: Symbol[][];
  rows: Symbol[][];
  winnings: number;
  totalBet: number;
  net: number;
  symbolCountsObserved: { [key: string]: number };
}

export interface SpinParams {
  lines: number;
  betPerLine: number;
}