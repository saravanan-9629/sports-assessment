import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { AIRecommendation } from '../models/AIRecommendation';
import { Assessment } from '../models/Assessment';

export class RecommendationController {
  public static async getLatestRecommendations(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      const latestRecommendation = await AIRecommendation.findOne({ userId })
        .sort({ createdAt: -1 })
        .populate('assessmentId');

      if (!latestRecommendation) {
        // Fallback default recommendations if user has no assessments yet
        return res.json({
          recommendation: {
            overallScore: 60,
            performanceLevel: 'Intermediate',
            strengths: ['Agility & Reaction', 'Core Flexibility'],
            weaknesses: ['Explosive Sprint Speed', 'Upper Body Strength'],
            recommendations: [
              'Complete your initial baseline assessment in Cricket, Football, Basketball or Athletics.',
              'Add 10m sprint starts twice per week to develop explosive first steps.',
              'Focus on 3 sets of 15 push-ups every other day.'
            ],
            trainingPlan: [
              'Day 1: Baseline Sprint & Shuttle Drills',
              'Day 2: Upper Body & Core Strength Supersets',
              'Day 3: Sport-specific Skill & Precision Work'
            ]
          }
        });
      }

      return res.json({ recommendation: latestRecommendation });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
