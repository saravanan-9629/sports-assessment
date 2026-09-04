export type UserRole = 'ATHLETE' | 'COACH' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  age: number;
  gender: string;
  location: string;
  preferredSport: string;
  avatarUrl?: string;
}

export interface AthleteProfile {
  id?: string;
  userId: string;
  heightCm: number;
  weightKg: number;
  institution: string;
  primaryPosition: string;
  bio: string;
  overallScore: number;
  performanceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
}

export interface AssessmentMetrics {
  sprintTimeSec?: number;
  jumpHeightCm?: number;
  reactionTimeMs?: number;
  pushupsReps?: number;
  situpsReps?: number;
  flexibilityCm?: number;
  accuracyScore?: number;
  dribblingSec?: number;
  throwingDistMeters?: number;
}

export interface SubScores {
  speed: number;
  agility: number;
  endurance: number;
  strength: number;
  skill: number;
}

export interface Assessment {
  _id: string;
  userId: string | User;
  sport: 'Cricket' | 'Football' | 'Basketball' | 'Athletics';
  assessmentType: string;
  metrics: AssessmentMetrics;
  subScores: SubScores;
  overallScore: number;
  notes?: string;
  createdAt: string;
}

export interface AIRecommendation {
  _id?: string;
  userId: string;
  assessmentId: string;
  overallScore: number;
  performanceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  trainingPlan: string[];
  createdAt?: string;
}

export interface LeaderboardItem {
  rank: number;
  id: string;
  fullName: string;
  age: number;
  gender: string;
  location: string;
  preferredSport: string;
  institution: string;
  overallScore: number;
  performanceLevel: string;
  subScores: SubScores;
  lastAssessedAt: string;
}

export interface CoachFeedback {
  _id?: string;
  coachId: string;
  athleteId: string;
  rating: number;
  notes: string;
  recommendedFocus: string;
  shortlisted: boolean;
  createdAt?: string;
}
