import bcrypt from 'bcryptjs';
import { connectDB } from './config/db';
import { User } from './models/User';
import { AthleteProfile } from './models/AthleteProfile';
import { Assessment } from './models/Assessment';
import { AIRecommendation } from './models/AIRecommendation';
import { CoachFeedback } from './models/CoachFeedback';
import { ScoringService } from './services/scoringService';
import { AIAnalysisService } from './services/aiAnalysisService';

const seedDatabase = async () => {
  const isConnected = await connectDB();
  if (!isConnected) {
    console.log('Skipping seed script: MongoDB is not connected.');
    process.exit(0);
  }

  console.log('🌱 Seeding database...');

  await User.deleteMany({});
  await AthleteProfile.deleteMany({});
  await Assessment.deleteMany({});
  await AIRecommendation.deleteMany({});
  await CoachFeedback.deleteMany({});

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  // 1. Create Demo Users
  const athlete1 = await User.create({
    email: 'athlete@sportstalent.ai',
    passwordHash,
    fullName: 'Rahul Sharma',
    role: 'ATHLETE',
    age: 17,
    gender: 'Male',
    location: 'Mumbai, Maharashtra',
    preferredSport: 'Cricket'
  });

  const athlete2 = await User.create({
    email: 'ananya@sportstalent.ai',
    passwordHash,
    fullName: 'Ananya Roy',
    role: 'ATHLETE',
    age: 18,
    gender: 'Female',
    location: 'Kolkata, West Bengal',
    preferredSport: 'Football'
  });

  const athlete3 = await User.create({
    email: 'vikram@sportstalent.ai',
    passwordHash,
    fullName: 'Vikram Singh',
    role: 'ATHLETE',
    age: 16,
    gender: 'Male',
    location: 'Bengaluru, Karnataka',
    preferredSport: 'Basketball'
  });

  const athlete4 = await User.create({
    email: 'priya@sportstalent.ai',
    passwordHash,
    fullName: 'Priya Patel',
    role: 'ATHLETE',
    age: 19,
    gender: 'Female',
    location: 'Ahmedabad, Gujarat',
    preferredSport: 'Athletics'
  });

  const coach = await User.create({
    email: 'coach@sportstalent.ai',
    passwordHash,
    fullName: 'Coach Vikram Dravid',
    role: 'COACH',
    age: 42,
    gender: 'Male',
    location: 'Delhi, India',
    preferredSport: 'Cricket'
  });

  const admin = await User.create({
    email: 'admin@sportstalent.ai',
    passwordHash,
    fullName: 'Platform Admin',
    role: 'ADMIN',
    age: 35,
    gender: 'Male',
    location: 'National HQ',
    preferredSport: 'Athletics'
  });

  // 2. Athlete Profiles
  await AthleteProfile.create({
    userId: athlete1._id,
    heightCm: 178,
    weightKg: 70,
    institution: 'National Cricket Academy',
    primaryPosition: 'Fast Bowling All-Rounder',
    overallScore: 84,
    performanceLevel: 'Advanced'
  });

  await AthleteProfile.create({
    userId: athlete2._id,
    heightCm: 165,
    weightKg: 58,
    institution: 'St. Xavier High School',
    primaryPosition: 'Central Midfielder',
    overallScore: 88,
    performanceLevel: 'Elite'
  });

  await AthleteProfile.create({
    userId: athlete3._id,
    heightCm: 188,
    weightKg: 78,
    institution: 'Bangalore Sports Center',
    primaryPosition: 'Point Guard',
    overallScore: 76,
    performanceLevel: 'Advanced'
  });

  await AthleteProfile.create({
    userId: athlete4._id,
    heightCm: 168,
    weightKg: 55,
    institution: 'Gujarat Athletics Club',
    primaryPosition: '100m Sprint Specialist',
    overallScore: 91,
    performanceLevel: 'Elite'
  });

  // 3. Create Sample Assessments & AI Recommendations
  const sampleData = [
    {
      user: athlete1,
      sport: 'Cricket',
      metrics: {
        sprintTimeSec: 3.8,
        jumpHeightCm: 55,
        reactionTimeMs: 220,
        pushupsReps: 38,
        situpsReps: 45,
        accuracyScore: 85,
        throwingDistMeters: 58
      }
    },
    {
      user: athlete2,
      sport: 'Football',
      metrics: {
        sprintTimeSec: 3.5,
        jumpHeightCm: 52,
        reactionTimeMs: 195,
        pushupsReps: 35,
        situpsReps: 55,
        dribblingSec: 11.2,
        accuracyScore: 88
      }
    },
    {
      user: athlete3,
      sport: 'Basketball',
      metrics: {
        sprintTimeSec: 3.9,
        jumpHeightCm: 68,
        reactionTimeMs: 210,
        pushupsReps: 40,
        situpsReps: 48,
        accuracyScore: 82,
        dribblingSec: 12.5
      }
    },
    {
      user: athlete4,
      sport: 'Athletics',
      metrics: {
        sprintTimeSec: 3.1,
        jumpHeightCm: 62,
        reactionTimeMs: 170,
        pushupsReps: 42,
        situpsReps: 60,
        flexibilityCm: 28,
        throwingDistMeters: 45
      }
    }
  ];

  for (const item of sampleData) {
    const { subScores, overallScore } = ScoringService.calculateScores(item.sport, item.metrics);

    const assessment = await Assessment.create({
      userId: item.user._id,
      sport: item.sport,
      assessmentType: 'National Scouting Combine',
      metrics: item.metrics,
      subScores,
      overallScore,
      notes: 'Initial baseline combine test.'
    });

    const aiOutput = await AIAnalysisService.analyzeAssessment({
      sport: item.sport,
      subScores,
      overallScore,
      athleteAge: item.user.age,
      athleteGender: item.user.gender
    });

    await AIRecommendation.create({
      userId: item.user._id,
      assessmentId: assessment._id,
      overallScore: aiOutput.overallScore,
      performanceLevel: aiOutput.performanceLevel,
      strengths: aiOutput.strengths,
      weaknesses: aiOutput.weaknesses,
      recommendations: aiOutput.recommendations,
      trainingPlan: aiOutput.trainingPlan
    });

    await CoachFeedback.create({
      coachId: coach._id,
      athleteId: item.user._id,
      assessmentId: assessment._id,
      rating: overallScore > 80 ? 5 : 4,
      notes: `Strong technical posture and excellent ${item.sport} metrics. Promising talent.`,
      recommendedFocus: 'Maintain explosive power and increase match exposure.',
      shortlisted: overallScore > 80
    });
  }

  console.log('✅ Database seeded successfully!');
  process.exit(0);
};

seedDatabase();
