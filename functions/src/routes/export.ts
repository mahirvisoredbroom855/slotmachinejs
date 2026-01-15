import { Router } from "express";
import { AuthRequest, authenticateUser } from "../middleware/auth";
import { getRecentSpins, getUserStats } from "../db/userService";
import xml from "xml";

const router = Router();

// Export as JSON
router.get("/json", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const limit = parseInt(req.query.limit as string) || 1000;

    const [spins, stats] = await Promise.all([
      getRecentSpins(uid, limit),
      getUserStats(uid),
    ]);

    const exportData = {
      exportedAt: new Date().toISOString(),
      user: uid,
      stats,
      spins: spins.map((spin) => ({
        ...spin,
        createdAt: spin.createdAt.toISOString(),
      })),
    };

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=slotlab-export-${Date.now()}.json`);
    return res.json(exportData);
  } catch (error) {
    console.error("JSON export error:", error);
    return res.status(500).json({ error: "Failed to export data" });
  }
});

// Export as XML
router.get("/xml", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const limit = parseInt(req.query.limit as string) || 1000;

    const spins = await getRecentSpins(uid, limit);

    const xmlData = {
      session: [
        { _attr: { user: uid, exportedAt: new Date().toISOString() } },
        ...spins.map((spin) => ({
          spin: [
            { createdAt: spin.createdAt.toISOString() },
            { lines: spin.lines },
            { betPerLine: spin.betPerLine },
            { totalBet: spin.totalBet },
            { winnings: spin.winnings },
            { net: spin.net },
            { balanceAfter: spin.balanceAfter },
            {
              reels: spin.reels.map((reel, idx) => ({
                [`reel${idx + 1}`]: reel.join(","),
              })),
            },
          ],
        })),
      ],
    };

    const xmlString = xml(xmlData, { declaration: true, indent: "  " });

    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Content-Disposition", `attachment; filename=slotlab-export-${Date.now()}.xml`);
    return res.send(xmlString);
  } catch (error) {
    console.error("XML export error:", error);
    return res.status(500).json({ error: "Failed to export data" });
  }
});

export default router;
