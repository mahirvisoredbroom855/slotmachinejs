import { Router } from "express";
import { AuthRequest, authenticateUser } from "../middleware/auth";
import { getUserStats, getRecentSpins, getUserBalance } from "../db/userService";
import { getExpectedProbabilities } from "../engine/slotEngine";

const router = Router();

router.get("/", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;

    // Get stats and recent spins
    const [stats, recentSpins, balance] = await Promise.all([
      getUserStats(uid),
      getRecentSpins(uid, 50),
      getUserBalance(uid),
    ]);

    if (!stats) {
      return res.json({
        balance,
        stats: null,
        recentSpins: [],
        expectedProbabilities: getExpectedProbabilities(),
      });
    }

    // Calculate observed probabilities
    const totalSymbols = Object.values(stats.symbolFrequencies)
      .reduce((sum, count) => sum + count, 0);

    const observedProbabilities: { [key: string]: number } = {};
    Object.keys(stats.symbolFrequencies).forEach((symbol) => {
      observedProbabilities[symbol] = stats.symbolFrequencies[symbol] / totalSymbols;
    });

    return res.json({
      balance,
      stats: {
        ...stats,
        observedProbabilities,
        roi: stats.totalBet > 0 ? (stats.netProfit / stats.totalBet) * 100 : 0,
      },
      recentSpins,
      expectedProbabilities: getExpectedProbabilities(),
    });
  } catch (error) {
    console.error("Stats error:", error);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
});

export default router;
