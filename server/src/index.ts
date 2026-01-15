import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as functions from 'firebase-functions';
import spinRouter from "./routes/spin";
import statsRouter from "./routes/stats";
import simulateRouter from "./routes/simulate";
import exportRouter from "./routes/export";

import { authenticateUser, AuthRequest } from "./middleware/auth";
import { getOrCreateUser, getUserBalance } from "./db/userService";

dotenv.config();

//??????
import admin from "firebase-admin";
admin.initializeApp();


const app = express();
// const PORT = Number(process.env.PORT) || 5000;
app.use(cors({ origin: true }));
app.use(express.json());


app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "SlotLab Server Running" });
});

app.post("/api/init", authenticateUser, async (req: AuthRequest, res) => {
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

// Mount routers
app.use("/api/spin", spinRouter);
app.use("/api/stats", statsRouter);
app.use("/api/simulate", simulateRouter);
app.use("/api/export", exportRouter);

// app.listen(PORT, () => {
//   console.log(`🎰 SlotLab server running on port ${PORT}`);
// });

export const api = functions.https.onRequest(app);

