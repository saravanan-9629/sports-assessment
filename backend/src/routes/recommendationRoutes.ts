import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendationController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, RecommendationController.getLatestRecommendations);

export default router;
