import mongoose, { Schema, Document } from 'mongoose';

export type UserRole = 'ATHLETE' | 'COACH' | 'ADMIN';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
  age: number;
  gender: string;
  location: string;
  preferredSport: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    fullName: { type: String, required: true, trim: true },
    role: { type: String, enum: ['ATHLETE', 'COACH', 'ADMIN'], default: 'ATHLETE' },
    age: { type: Number, required: true, default: 18 },
    gender: { type: String, default: 'Unspecified' },
    location: { type: String, default: 'General' },
    preferredSport: { type: String, default: 'Athletics' },
    avatarUrl: { type: String, default: '' }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', UserSchema);
