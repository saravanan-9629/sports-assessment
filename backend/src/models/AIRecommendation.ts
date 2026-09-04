import mongoose, { Schema, Document } from 'mongoose';

export interface IAIRecommendation extends Document {
  userId: mongoose.Types.ObjectId;
  assessmentId: mongoose.Types.ObjectId;
  overallScore: number;
  performanceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  trainingPlan: string[];
  createdAt: Date;
  updatedAt: Date;
}

const AIRecommendationSchema = new Schema<IAIRecommendation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true },
    overallScore: { type: Number, required: true },
    performanceLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Elite'],
      required: true
    },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    recommendations: [{ type: String }],
    trainingPlan: [{ type: String }]
  },
  { timestamps: true }
);

export const AIRecommendation = mongoose.model<IAIRecommendation>('AIRecommendation', AIRecommendationSchema);
