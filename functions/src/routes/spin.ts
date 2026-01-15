import { Router } from "express";
import { AuthRequest, authenticateUser } from "../middleware/auth";
import { runSpin } from "../engine/slotEngine";
import { getUserBalance, updateUserBalance, recordSpin } from "../db/userService";

const router = Router();

interface SpinRequestBody {
  lines: number;
  betPerLine: number;
}

router.post("/", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { lines, betPerLine } = req.body as SpinRequestBody;
    const uid = req.user!.uid;

    console.log("🎰 Spin request:", { uid, lines, betPerLine });

    // Validation
    if (!lines || !betPerLine || lines < 1 || lines > 3 || betPerLine <= 0) {
      console.error("❌ Invalid parameters:", { lines, betPerLine });
      return res.status(400).json({
        error: "Invalid parameters. Lines must be 1-3, betPerLine must be > 0",
      });
    }

    // Get current balance
    console.log("📊 Getting balance for user:", uid);
    const balance = await getUserBalance(uid);
    console.log("💰 Current balance:", balance);

    const totalBet = lines * betPerLine;

    // Check if user has enough balance
    if (balance < totalBet) {
      console.error("❌ Insufficient balance:", { balance, required: totalBet });
      return res.status(400).json({
        error: "Insufficient balance",
        balance,
        required: totalBet,
      });
    }

    // Run the spin
    console.log("🎲 Running spin...");
    const spinResult = runSpin({ lines, betPerLine });
    console.log("✅ Spin result:", { winnings: spinResult.winnings, net: spinResult.net });

    // Update balance
    const newBalance = balance + spinResult.net;
    console.log("💵 Updating balance to:", newBalance);
    await updateUserBalance(uid, newBalance);
    console.log("✅ Balance updated");

    // Record spin in database
    console.log("📝 Recording spin...");
    await recordSpin(uid, spinResult, lines, betPerLine, newBalance);
    console.log("✅ Spin recorded");

    // Return result
    return res.json({
      ...spinResult,
      balanceAfter: newBalance,
    });
  } catch (error) {
    console.error("❌❌❌ SPIN ERROR:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return res.status(500).json({
      error: "Failed to process spin",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
