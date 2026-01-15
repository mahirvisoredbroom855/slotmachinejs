import express from "express";
import { runSpin } from "../engine/slotEngine";
// import { SlotSymbol } from "../engine/types";

const router = express.Router();

router.post("/", (req, res) => {
  try {
    const { numSpins, lines, betPerLine } = req.body;

    // 1. Initialize trackers
    const symbolCounts: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    let totalWinnings = 0;
    let totalBet = 0;

    // 2. Run the simulation loop
    for (let i = 0; i < numSpins; i++) {
      // 'result' is defined inside this block
      const result = runSpin({ lines, betPerLine });

      totalWinnings += result.winnings;
      totalBet += result.totalBet;

      // FIX: Access result.symbolCountsObserved inside the loop
      Object.keys(result.symbolCountsObserved).forEach((symbol) => {
        symbolCounts[symbol] += result.symbolCountsObserved[symbol];
      });
    }

    // 3. Post-simulation math
    const totalSymbols = Object.values(symbolCounts).reduce(
      (sum: number, count: number) => sum + count,
      0
    );

    const observedProbabilities: Record<string, number> = { A: 0, B: 0, C: 0, D: 0 };
    Object.keys(symbolCounts).forEach((symbol) => {
      observedProbabilities[symbol] = totalSymbols > 0 ? symbolCounts[symbol] / totalSymbols : 0;
    });

    // 4. Return results
    return res.json({
      numSpins,
      totalWinnings,
      totalBet,
      netProfit: totalWinnings - totalBet,
      rtp: totalBet > 0 ? (totalWinnings / totalBet) * 100 : 0,
      symbolCounts,
      observedProbabilities,
    });
  } catch (error) {
    return res.status(500).json({ error: "Simulation failed" });
  }
});

// FIX: This defines the 'router' name that the other files are looking for
export default router;
