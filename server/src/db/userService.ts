import { usersCollection, spinsCollection, statsCollection } from "./firestore";
import { SpinResult } from "../engine/types";

export interface UserData {
  email: string;
  balance: number;
  createdAt: Date;
  lastLoginAt: Date;
}

export interface SpinRecord extends SpinResult {
  createdAt: Date;
  lines: number;
  betPerLine: number;
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
  lastUpdated: Date;
}

// Get or create user
export const getOrCreateUser = async (uid: string, email: string): Promise<UserData> => {
  const userRef = usersCollection().doc(uid);
  const userDoc = await userRef.get();

  if (!userDoc.exists) {
    const newUser: UserData = {
      email,
      balance: 1000,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    };
    await userRef.set(newUser);
    return newUser;
  } else {
    const userData = userDoc.data() as UserData;
    await userRef.update({ lastLoginAt: new Date() });
    return userData;
  }
};

// Get user balance
export const getUserBalance = async (uid: string): Promise<number> => {
  const userDoc = await usersCollection().doc(uid).get();
  const userData = userDoc.data() as UserData;
  return userData.balance;
};

// Update user balance
export const updateUserBalance = async (uid: string, newBalance: number): Promise<void> => {
  await usersCollection().doc(uid).update({ balance: newBalance });
};

// Record a spin - ✅ FIXED: Convert nested arrays to strings
export const recordSpin = async (
  uid: string,
  spinResult: SpinResult,
  lines: number,
  betPerLine: number,
  balanceAfter: number
): Promise<void> => {
  try {
    // Convert nested arrays to comma-separated strings for Firestore
    const spinRecord = {
      reels: spinResult.reels.map(reel => reel.join(',')),
      rows: spinResult.rows.map(row => row.join(',')),
      winnings: spinResult.winnings,
      totalBet: spinResult.totalBet,
      net: spinResult.net,
      symbolCountsObserved: spinResult.symbolCountsObserved,
      lines,
      betPerLine,
      balanceAfter,
      createdAt: new Date(),
    };

    await spinsCollection(uid).add(spinRecord);
    await updateStats(uid, spinResult);
  } catch (error) {
    console.error('❌ Error in recordSpin:', error);
    throw error;
  }
};

// Update aggregated stats
const updateStats = async (uid: string, spinResult: SpinResult): Promise<void> => {
  const statsRef = statsCollection(uid).doc("current");
  const statsDoc = await statsRef.get();

  if (!statsDoc.exists) {
    const initialStats: UserStats = {
      totalSpins: 1,
      totalBet: spinResult.totalBet,
      totalWinnings: spinResult.winnings,
      netProfit: spinResult.net,
      winRate: spinResult.winnings > 0 ? 1 : 0,
      avgBetSize: spinResult.totalBet,
      symbolFrequencies: spinResult.symbolCountsObserved,
      lastUpdated: new Date(),
    };

    await statsRef.set(initialStats as FirebaseFirestore.DocumentData);
    return;
  }

  const stats = statsDoc.data() as UserStats;

  const newTotalSpins = stats.totalSpins + 1;
  const newTotalBet = stats.totalBet + spinResult.totalBet;
  const newTotalWinnings = stats.totalWinnings + spinResult.winnings;
  const newNetProfit = stats.netProfit + spinResult.net;

  const wins = (spinResult.winnings > 0 ? 1 : 0) + stats.winRate * stats.totalSpins;

  const updatedFrequencies = { ...stats.symbolFrequencies };
  Object.keys(spinResult.symbolCountsObserved).forEach((symbol) => {
    updatedFrequencies[symbol] =
      (updatedFrequencies[symbol] || 0) + spinResult.symbolCountsObserved[symbol];
  });

  const updatedStats: UserStats = {
    totalSpins: newTotalSpins,
    totalBet: newTotalBet,
    totalWinnings: newTotalWinnings,
    netProfit: newNetProfit,
    winRate: wins / newTotalSpins,
    avgBetSize: newTotalBet / newTotalSpins,
    symbolFrequencies: updatedFrequencies,
    lastUpdated: new Date(),
  };

  await statsRef.set(updatedStats as FirebaseFirestore.DocumentData, { merge: true });
};

// Get user stats
export const getUserStats = async (uid: string): Promise<UserStats | null> => {
  const statsDoc = await statsCollection(uid).doc("current").get();
  if (!statsDoc.exists) return null;
  return statsDoc.data() as UserStats;
};

// Get recent spins - ✅ FIXED: Convert strings back to arrays
export const getRecentSpins = async (uid: string, limit: number = 50): Promise<SpinRecord[]> => {
  const snapshot = await spinsCollection(uid).orderBy("createdAt", "desc").limit(limit).get();
  
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    
    // Convert comma-separated strings back to nested arrays
    return {
      ...data,
      reels: data.reels.map((reel: string) => reel.split(',')),
      rows: data.rows.map((row: string) => row.split(',')),
      createdAt: data.createdAt.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    } as any;
  });
};