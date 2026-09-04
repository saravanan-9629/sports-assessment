import { Request, Response } from 'express';
import { User } from '../models/User';
import { AthleteProfile } from '../models/AthleteProfile';
import { Assessment } from '../models/Assessment';

export class LeaderboardController {
  public static async getLeaderboard(req: Request, res: Response) {
    try {
      const { sport, location, ageCategory, limit = 50 } = req.query;

      let queryUser: any = { role: 'ATHLETE' };

      if (location) {
        queryUser.location = { $regex: location as string, $options: 'i' };
      }

      if (sport && sport !== 'All') {
        queryUser.preferredSport = sport;
      }

      if (ageCategory) {
        if (ageCategory === 'U16') queryUser.age = { $lt: 16 };
        else if (ageCategory === 'U20') queryUser.age = { $gte: 16, $lte: 20 };
        else if (ageCategory === '21+') queryUser.age = { $gt: 20 };
      }

      const athletes = await User.find(queryUser).select('-passwordHash').lean();
      const athleteIds = athletes.map((a) => a._id);

      const profiles = await AthleteProfile.find({ userId: { $in: athleteIds } }).lean();
      const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

      // Get latest assessment for each athlete
      const latestAssessments = await Assessment.aggregate([
        { $match: { userId: { $in: athleteIds } } },
        { $sort: { createdAt: -1 } },
        {
          $group: {
            _id: '$userId',
            assessmentId: { $first: '$_id' },
            overallScore: { $first: '$overallScore' },
            sport: { $first: '$sport' },
            subScores: { $first: '$subScores' },
            createdAt: { $first: '$createdAt' }
          }
        }
      ]);

      const assessmentMap = new Map(latestAssessments.map((a) => [a._id.toString(), a]));

      const leaderboard = athletes
        .map((athlete) => {
          const profile = profileMap.get(athlete._id.toString());
          const assessment = assessmentMap.get(athlete._id.toString());

          const score = assessment?.overallScore || profile?.overallScore || 50;

          return {
            id: athlete._id,
            fullName: athlete.fullName,
            age: athlete.age,
            gender: athlete.gender,
            location: athlete.location,
            preferredSport: athlete.preferredSport,
            institution: profile?.institution || 'Sports Academy',
            overallScore: score,
            performanceLevel: profile?.performanceLevel || 'Intermediate',
            subScores: assessment?.subScores || { speed: score, agility: score, endurance: score, strength: score, skill: score },
            lastAssessedAt: assessment?.createdAt || athlete.createdAt
          };
        })
        .sort((a, b) => b.overallScore - a.overallScore)
        .slice(0, Number(limit))
        .map((item, index) => ({
          rank: index + 1,
          ...item
        }));

      return res.json({ leaderboard });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
