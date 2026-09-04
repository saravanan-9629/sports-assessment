import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { AthleteProfile } from '../models/AthleteProfile';

export class UserController {
  public static async getProfile(req: AuthRequest, res: Response) {
    try {
      const user = await User.findById(req.user?.id).select('-passwordHash');
      if (!user) return res.status(404).json({ error: 'User not found' });

      let athleteProfile = null;
      if (user.role === 'ATHLETE') {
        athleteProfile = await AthleteProfile.findOne({ userId: user._id });
      }

      return res.json({ user, athleteProfile });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const { fullName, age, gender, location, preferredSport, heightCm, weightKg, institution, primaryPosition, bio } = req.body;

      const user = await User.findByIdAndUpdate(
        req.user?.id,
        { fullName, age, gender, location, preferredSport },
        { new: true }
      ).select('-passwordHash');

      if (!user) return res.status(404).json({ error: 'User not found' });

      let athleteProfile = null;
      if (user.role === 'ATHLETE') {
        athleteProfile = await AthleteProfile.findOneAndUpdate(
          { userId: user._id },
          { heightCm, weightKg, institution, primaryPosition, bio },
          { new: true, upsert: true }
        );
      }

      return res.json({ message: 'Profile updated successfully', user, athleteProfile });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
