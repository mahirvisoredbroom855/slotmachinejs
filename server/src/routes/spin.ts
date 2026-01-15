import { Router } from 'express';
import { AuthRequest, authenticateUser } from '../middleware/auth';
import { runSpin } from '../engine/slotEngine';
import { getUserBalance, updateUserBalance, recordSpin } from '../db/userService';

const router = Router();

interface SpinRequestBody {
  lines: number;
  betPerLine: number;
}

router.post('/', authenticateUser, async (req: AuthRequest, res) => {
  try {
    const { lines, betPerLine } = req.body as SpinRequestBody;
    const uid = req.user!.uid;

    // Validation
    if (!lines || !betPerLine || lines < 1 || lines > 3 || betPerLine <= 0) {
      return res.status(400).json({ 
        error: 'Invalid parameters. Lines must be 1-3, betPerLine must be > 0' 
      });
    }

    // Get current balance
    const balance = await getUserBalance(uid);
    const totalBet = lines * betPerLine;

    // Check if user has enough balance
    if (balance < totalBet) {
      return res.status(400).json({ 
        error: 'Insufficient balance',
        balance,
        required: totalBet 
      });
    }

    // Run the spin
    const spinResult = runSpin({ lines, betPerLine });
    
    // Update balance
    const newBalance = balance + spinResult.net;
    await updateUserBalance(uid, newBalance);

    // Record spin in database
    await recordSpin(uid, spinResult, lines, betPerLine, newBalance);

    // Return result
    return res.json({
      ...spinResult,
      balanceAfter: newBalance,
    });

  } catch (error) {
    console.error('Spin error:', error);
    return res.status(500).json({ error: 'Failed to process spin' });
  }
});

export default router;