// src/engine/types.ts

// Ensure this is a string-based union
export type SlotSymbol = "A" | "B" | "C" | "D";

export interface SpinResult {
  reels: SlotSymbol[][]; // FIX: Change from symbol[][] to SlotSymbol[][]
  rows: SlotSymbol[][]; // FIX: Change from symbol[][] to SlotSymbol[][]
  winnings: number;
  totalBet: number;
  net: number;
  symbolCountsObserved: Record<string, number>; // FIX: Use string or SlotSymbol as key
}

export interface SpinParams {
  lines: number;
  betPerLine: number;
}

// Add these if you are using them in slotEngine.ts
export type SymbolsCount = Record<SlotSymbol, number>;
export type SymbolValues = Record<SlotSymbol, number>;
