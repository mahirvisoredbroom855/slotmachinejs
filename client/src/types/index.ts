export type Symbol = 'A' | 'B' | 'C' | 'D';

export interface SpinResult {
  reels: Symbol[][];
  rows: Symbol[][];
  winnings: number;
  totalBet: number;
  net: number;
  symbolCountsObserved: { [key: string]: number };
  balanceAfter: number;
}

export interface UserStats {
  totalSpins: number;
  totalBet: number;
  totalWinnings: number;
  netProfit: number;
  winRate: number;
  avgBetSize: number;
  symbolFrequencies: { [key: string]: number };
  observedProbabilities?: { [key: string]: number };
  roi?: number;
}

export interface SpinRecord {
  createdAt: string;
  lines: number;
  betPerLine: number;
  totalBet: number;
  winnings: number;
  net: number;
  balanceAfter: number;
}