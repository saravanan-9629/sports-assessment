import mongoose, { Schema, Document } from 'mongoose';

export interface ICoachFeedback extends Document {
  coachId: mongoose.Types.ObjectId;
  athleteId: mongoose.Types.ObjectId;
  assessmentId?: mongoose.Types.ObjectId;
  rating: number;
  notes: string;
  recommendedFocus: string;
  shortlisted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CoachFeedbackSchema = new Schema<ICoachFeedback>(
  {
    coachId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    athleteId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment' },
    rating: { type: Number, min: 1, max: 5, default: 4 },
    notes: { type: String, required: true },
    recommendedFocus: { type: String, default: 'Overall Skill refinement' },
    shortlisted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const CoachFeedback = mongoose.model<ICoachFeedback>('CoachFeedback', CoachFeedbackSchema);
