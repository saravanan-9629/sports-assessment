import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { AthleteProfile } from '../models/AthleteProfile';
import { Assessment } from '../models/Assessment';
import { CoachFeedback } from '../models/CoachFeedback';
import { AIRecommendation } from '../models/AIRecommendation';

export class CoachController {
  public static async getAthletes(req: AuthRequest, res: Response) {
    try {
      const { search, sport, location, minScore = 0 } = req.query;

      let query: any = { role: 'ATHLETE' };

      if (search) {
        query.fullName = { $regex: search as string, $options: 'i' };
      }

      if (sport && sport !== 'All') {
        query.preferredSport = sport;
      }

      if (location) {
        query.location = { $regex: location as string, $options: 'i' };
      }

      const athletes = await User.find(query).select('-passwordHash').lean();
      const athleteIds = athletes.map((a) => a._id);

      const profiles = await AthleteProfile.find({ userId: { $in: athleteIds } }).lean();
      const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

      // Get coach feedback shortlist state
      const coachId = req.user?.id;
      const feedbacks = await CoachFeedback.find({ coachId, athleteId: { $in: athleteIds } }).lean();
      const feedbackMap = new Map(feedbacks.map((f) => [f.athleteId.toString(), f]));

      const results = athletes.map((athlete) => {
        const profile = profileMap.get(athlete._id.toString());
        const feedback = feedbackMap.get(athlete._id.toString());

        return {
          id: athlete._id,
          fullName: athlete.fullName,
          email: athlete.email,
          age: athlete.age,
          gender: athlete.gender,
          location: athlete.location,
          preferredSport: athlete.preferredSport,
          institution: profile?.institution || 'Sports Academy',
          primaryPosition: profile?.primaryPosition || 'All-Rounder',
          overallScore: profile?.overallScore || 50,
          performanceLevel: profile?.performanceLevel || 'Intermediate',
          heightCm: profile?.heightCm || 170,
          weightKg: profile?.weightKg || 65,
          shortlisted: feedback?.shortlisted || false,
          coachRating: feedback?.rating || null
        };
      }).filter(a => a.overallScore >= Number(minScore));

      return res.json({ athletes: results });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async getAthleteById(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const athlete = await User.findById(id).select('-passwordHash');

      if (!athlete || athlete.role !== 'ATHLETE') {
        return res.status(404).json({ error: 'Athlete not found' });
      }

      const profile = await AthleteProfile.findOne({ userId: athlete._id });
      const assessments = await Assessment.find({ userId: athlete._id }).sort({ createdAt: -1 });
      const latestAiRecommendation = await AIRecommendation.findOne({ userId: athlete._id }).sort({ createdAt: -1 });

      const coachId = req.user?.id;
      const existingFeedback = await CoachFeedback.findOne({ coachId, athleteId: athlete._id });

      return res.json({
        athlete,
        profile,
        assessments,
        aiRecommendation: latestAiRecommendation,
        coachFeedback: existingFeedback
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async submitFeedback(req: AuthRequest, res: Response) {
    try {
      const { athleteId, rating = 4, notes, recommendedFocus, shortlisted } = req.body;
      const coachId = req.user?.id;

      if (!athleteId || !notes) {
        return res.status(400).json({ error: 'Athlete ID and notes are required' });
      }

      const feedback = await CoachFeedback.findOneAndUpdate(
        { coachId, athleteId },
        { rating, notes, recommendedFocus, shortlisted },
        { new: true, upsert: true }
      );

      return res.json({ message: 'Coach feedback recorded successfully', feedback });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
