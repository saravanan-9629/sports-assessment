import { Router } from 'express';
import { LeaderboardController } from '../controllers/leaderboardController';

const router = Router();

router.get('/', LeaderboardController.getLeaderboard);

export default router;
