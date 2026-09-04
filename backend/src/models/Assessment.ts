import mongoose, { Schema, Document } from 'mongoose';

export interface IAssessmentMetrics {
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

export interface ISubScores {
  speed: number;
  agility: number;
  endurance: number;
  strength: number;
  skill: number;
}

export interface IAssessment extends Document {
  userId: mongoose.Types.ObjectId;
  sport: 'Cricket' | 'Football' | 'Basketball' | 'Athletics';
  assessmentType: string;
  metrics: IAssessmentMetrics;
  subScores: ISubScores;
  overallScore: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentSchema = new Schema<IAssessment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sport: {
      type: String,
      enum: ['Cricket', 'Football', 'Basketball', 'Athletics'],
      required: true
    },
    assessmentType: { type: String, required: true, default: 'Standard Physical & Skill Assessment' },
    metrics: {
      sprintTimeSec: { type: Number },
      jumpHeightCm: { type: Number },
      reactionTimeMs: { type: Number },
      pushupsReps: { type: Number },
      situpsReps: { type: Number },
      flexibilityCm: { type: Number },
      accuracyScore: { type: Number },
      dribblingSec: { type: Number },
      throwingDistMeters: { type: Number }
    },
    subScores: {
      speed: { type: Number, default: 50 },
      agility: { type: Number, default: 50 },
      endurance: { type: Number, default: 50 },
      strength: { type: Number, default: 50 },
      skill: { type: Number, default: 50 }
    },
    overallScore: { type: Number, required: true, default: 50 },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const Assessment = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
