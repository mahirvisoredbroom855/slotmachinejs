import { Router } from "express";
import { AuthRequest, authenticateUser } from "../middleware/auth";
import { runSpin } from "../engine/slotEngine";
import { Symbol } from "../engine/types";

const router = Router();

interface SimulateRequestBody {
  trials: number;
  lines: number;
  betPerLine: number;
}

router.post("/", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { trials, lines, betPerLine } = req.body as SimulateRequestBody;

    // Validation
    if (!trials || trials < 1 || trials > 1_000_000) {
      return res.status(400).json({
        error: "Trials must be between 1 and 1,000,000",
      });
    }

    if (!lines || !betPerLine || lines < 1 || lines > 3 || betPerLine <= 0) {
      return res.status(400).json({
        error: "Invalid parameters. Lines must be 1-3, betPerLine must be > 0",
      });
    }

    // Run simulation
    let totalWinnings = 0;
    let totalBet = 0;
    let wins = 0;

    const symbolCounts: Record<Symbol, number> = { A: 0, B: 0, C: 0, D: 0 };
    const payoutDistribution: Record<number, number> = {};

    for (let i = 0; i < trials; i++) {
      const result = runSpin({ lines, betPerLine });

      totalWinnings += result.winnings;
      totalBet += result.totalBet;

      if (result.winnings > 0) wins++;

      // Track symbol frequencies
      (Object.keys(result.symbolCountsObserved) as Symbol[]).forEach((symbol) => {
        symbolCounts[symbol] += result.symbolCountsObserved[symbol];
      });

      // Track payout distribution
      const payout = result.winnings;
      payoutDistribution[payout] = (payoutDistribution[payout] || 0) + 1;
    }

    const netProfit = totalWinnings - totalBet;
    const avgReturn = totalBet > 0 ? totalWinnings / totalBet : 0;
    const winRate = wins / trials;

    // Calculate observed probabilities
    const totalSymbols = Object.values(symbolCounts).reduce((sum, count) => sum + count, 0);

    const observedProbabilities: Record<Symbol, number> = { A: 0, B: 0, C: 0, D: 0 };
    (Object.keys(symbolCounts) as Symbol[]).forEach((symbol) => {
      observedProbabilities[symbol] = totalSymbols > 0 ? symbolCounts[symbol] / totalSymbols : 0;
    });

    return res.json({
      trials,
      totalBet,
      totalWinnings,
      netProfit,
      avgReturn,
      roi: totalBet > 0 ? ((netProfit / totalBet) * 100).toFixed(2) + "%" : "0.00%",
      winRate: (winRate * 100).toFixed(2) + "%",
      symbolDistribution: observedProbabilities,
      payoutDistribution: Object.entries(payoutDistribution)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([payout, count]) => ({
          payout: Number(payout),
          count,
          percentage: ((count / trials) * 100).toFixed(2) + "%",
        })),
    });
  } catch (error) {
    console.error("Simulation error:", error);
    return res.status(500).json({ error: "Failed to run simulation" });
  }
});

export default router;
