import { Router } from 'express';
import { CoachController } from '../controllers/coachController';
import { authenticateToken } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';

const router = Router();

router.use(authenticateToken);
router.use(requireRole('COACH', 'ADMIN'));

router.get('/athletes', CoachController.getAthletes);
router.get('/athlete/:id', CoachController.getAthleteById);
router.post('/feedback', CoachController.submitFeedback);

export default router;
