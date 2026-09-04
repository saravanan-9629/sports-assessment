import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Assessment } from '../models/Assessment';
import { AIRecommendation } from '../models/AIRecommendation';
import { AthleteProfile } from '../models/AthleteProfile';
import { User } from '../models/User';
import { ScoringService } from '../services/scoringService';
import { AIAnalysisService } from '../services/aiAnalysisService';

export class AssessmentController {
  public static async createAssessment(req: AuthRequest, res: Response) {
    try {
      const { sport, assessmentType = 'Standard Physical & Skill Assessment', metrics, notes } = req.body;

      if (!sport || !metrics) {
        return res.status(400).json({ error: 'Sport and metrics are required' });
      }

      const userId = req.user?.id;
      const user = await User.findById(userId);

      // 1. Compute normalized scores
      const { subScores, overallScore } = ScoringService.calculateScores(sport, metrics);

      // 2. Save Assessment record
      const assessment = await Assessment.create({
        userId,
        sport,
        assessmentType,
        metrics,
        subScores,
        overallScore,
        notes
      });

      // 3. Perform AI Talent Analysis
      const aiOutput = await AIAnalysisService.analyzeAssessment({
        sport,
        subScores,
        overallScore,
        athleteAge: user?.age,
        athleteGender: user?.gender
      });

      // 4. Save AI Recommendation record
      const aiRec = await AIRecommendation.create({
        userId,
        assessmentId: assessment._id,
        overallScore: aiOutput.overallScore,
        performanceLevel: aiOutput.performanceLevel,
        strengths: aiOutput.strengths,
        weaknesses: aiOutput.weaknesses,
        recommendations: aiOutput.recommendations,
        trainingPlan: aiOutput.trainingPlan
      });

      // 5. Update Athlete Profile overall score & level
      if (user?.role === 'ATHLETE') {
        await AthleteProfile.findOneAndUpdate(
          { userId },
          { overallScore, performanceLevel: aiOutput.performanceLevel },
          { new: true, upsert: true }
        );
      }

      return res.status(201).json({
        message: 'Assessment completed successfully',
        assessment,
        aiAnalysis: aiRec
      });
    } catch (error: any) {
      console.error('Create assessment error:', error);
      return res.status(500).json({ error: error.message || 'Assessment creation failed' });
    }
  }

  public static async getHistory(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const assessments = await Assessment.find({ userId }).sort({ createdAt: -1 });
      return res.json({ assessments });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async getAssessmentById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const assessment = await Assessment.findById(id).populate('userId', 'fullName email age gender location preferredSport');
      if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

      const aiRecommendation = await AIRecommendation.findOne({ assessmentId: assessment._id });

      return res.json({ assessment, aiRecommendation });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async getResultsById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const assessment = await Assessment.findById(id).populate('userId', 'fullName age gender location preferredSport');
      if (!assessment) return res.status(404).json({ error: 'Results not found' });

      const aiRecommendation = await AIRecommendation.findOne({ assessmentId: assessment._id });

      return res.json({
        result: {
          assessment,
          aiRecommendation
        }
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
