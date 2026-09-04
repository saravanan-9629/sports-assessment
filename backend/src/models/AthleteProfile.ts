import mongoose, { Schema, Document } from 'mongoose';

export interface IAthleteProfile extends Document {
  userId: mongoose.Types.ObjectId;
  heightCm: number;
  weightKg: number;
  institution: string;
  primaryPosition: string;
  bio: string;
  overallScore: number;
  performanceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  createdAt: Date;
  updatedAt: Date;
}

const AthleteProfileSchema = new Schema<IAthleteProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    heightCm: { type: Number, default: 170 },
    weightKg: { type: Number, default: 65 },
    institution: { type: String, default: 'Sports Academy' },
    primaryPosition: { type: String, default: 'All-Rounder' },
    bio: { type: String, default: 'Aspiring athlete focused on performance growth.' },
    overallScore: { type: Number, default: 50 },
    performanceLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Elite'],
      default: 'Intermediate'
    }
  },
  { timestamps: true }
);

export const AthleteProfile = mongoose.model<IAthleteProfile>('AthleteProfile', AthleteProfileSchema);
