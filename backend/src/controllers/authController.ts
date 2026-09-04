import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { AthleteProfile } from '../models/AthleteProfile';
import { CONFIG } from '../config/config';
import { AuthRequest } from '../middleware/authMiddleware';

export class AuthController {
  public static async register(req: Request, res: Response) {
    try {
      const { email, password, fullName, role = 'ATHLETE', age = 18, gender = 'Male', location = 'City', preferredSport = 'Football' } = req.body;

      if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Email, password, and full name are required' });
      }

      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        email: email.toLowerCase(),
        passwordHash,
        fullName,
        role,
        age: Number(age),
        gender,
        location,
        preferredSport
      });

      if (user.role === 'ATHLETE') {
        await AthleteProfile.create({
          userId: user._id,
          heightCm: 172,
          weightKg: 68,
          institution: 'Regional Academy',
          primaryPosition: 'Forward / All-Rounder',
          overallScore: 65,
          performanceLevel: 'Intermediate'
        });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        CONFIG.JWT_SECRET,
        { expiresIn: CONFIG.JWT_EXPIRES_IN as any }
      );

      return res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          age: user.age,
          gender: user.gender,
          location: user.location,
          preferredSport: user.preferredSport
        }
      });
    } catch (error: any) {
      console.error('Register error:', error);
      return res.status(500).json({ error: error.message || 'Registration failed' });
    }
  }

  public static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        CONFIG.JWT_SECRET,
        { expiresIn: CONFIG.JWT_EXPIRES_IN as any }
      );

      return res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          age: user.age,
          gender: user.gender,
          location: user.location,
          preferredSport: user.preferredSport
        }
      });
    } catch (error: any) {
      console.error('Login error:', error);
      return res.status(500).json({ error: error.message || 'Login failed' });
    }
  }

  public static async getMe(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      const user = await User.findById(req.user.id).select('-passwordHash');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      let profile = null;
      if (user.role === 'ATHLETE') {
        profile = await AthleteProfile.findOne({ userId: user._id });
      }

      return res.json({ user, profile });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }
}
