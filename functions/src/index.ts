import express from "express";
import cors from "cors";
import * as functions from "firebase-functions";
import admin from "firebase-admin";

// 1. Initialize Admin SDK before anything else
if (admin.apps.length === 0) {
  admin.initializeApp();
}

import spinRouter from "./routes/spin";
import statsRouter from "./routes/stats";
import simulateRouter from "./routes/simulate";
import exportRouter from "./routes/export";
import { authenticateUser, AuthRequest } from "./middleware/auth";
import { getOrCreateUser, getUserBalance } from "./db/userService";

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "SlotLab Server Running" });
});

// If you want your final URL to be .../api/init
app.post("/init", authenticateUser, async (req: AuthRequest, res) => {
  try {
    const uid = req.user!.uid;
    const email = req.user!.email || "";
    const user = await getOrCreateUser(uid, email);
    const balance = await getUserBalance(uid);

    return res.json({
      uid,
      email: user.email,
      balance,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Init error:", error);
    return res.status(500).json({ error: "Failed to initialize user" });
  }
});

// Mount routers (Removed /api/ to avoid double-nesting)
app.use("/spin", spinRouter);
app.use("/stats", statsRouter);
app.use("/simulate", simulateRouter);
app.use("/export", exportRouter);

// Export as 'api'
export const api = functions.https.onRequest(app);
