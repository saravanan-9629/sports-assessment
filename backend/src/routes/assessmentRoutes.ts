import { Router } from 'express';
import { AssessmentController } from '../controllers/assessmentController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.post('/', authenticateToken, AssessmentController.createAssessment);
router.get('/history', authenticateToken, AssessmentController.getHistory);
router.get('/:id', authenticateToken, AssessmentController.getAssessmentById);
router.get('/results/:id', authenticateToken, AssessmentController.getResultsById);

export default router;
