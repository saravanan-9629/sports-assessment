import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { User } from '../models/User';
import { Assessment } from '../models/Assessment';

export class AdminController {
  public static async getStats(req: AuthRequest, res: Response) {
    try {
      const totalUsers = await User.countDocuments();
      const totalAthletes = await User.countDocuments({ role: 'ATHLETE' });
      const totalCoaches = await User.countDocuments({ role: 'COACH' });
      const totalAssessments = await Assessment.countDocuments();

      const recentAssessments = await Assessment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate('userId', 'fullName email preferredSport');

      return res.json({
        stats: {
          totalUsers,
          totalAthletes,
          totalCoaches,
          totalAssessments,
          recentAssessments
        }
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async getUsers(req: AuthRequest, res: Response) {
    try {
      const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
      return res.json({ users });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

  public static async updateUserRole(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!['ATHLETE', 'COACH', 'ADMIN'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role specified' });
      }

      const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-passwordHash');
      if (!user) return res.status(404).json({ error: 'User not found' });

      return res.json({ message: 'User role updated successfully', user });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
