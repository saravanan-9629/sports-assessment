import { ISubScores } from '../models/Assessment';

export interface IAIAnalysisInput {
  sport: string;
  subScores: ISubScores;
  overallScore: number;
  athleteAge?: number;
  athleteGender?: string;
}

export interface IAIAnalysisOutput {
  overallScore: number;
  performanceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite';
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  trainingPlan: string[];
}

export class AIAnalysisService {
  /**
   * Generates AI-driven evaluation, identifying talent level, strengths, weaknesses,
   * recommendations, and a multi-week drill protocol.
   * Can be upgraded to call external LLMs (e.g. OpenAI / Gemini API).
   */
  public static async analyzeAssessment(input: IAIAnalysisInput): Promise<IAIAnalysisOutput> {
    const { sport, subScores, overallScore } = input;

    // Determine performance level category
    let performanceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'Elite' = 'Intermediate';
    if (overallScore >= 85) performanceLevel = 'Elite';
    else if (overallScore >= 72) performanceLevel = 'Advanced';
    else if (overallScore >= 55) performanceLevel = 'Intermediate';
    else performanceLevel = 'Beginner';

    // Map subScores to array for sorting
    const scoreMap = [
      { name: 'Explosive Speed', key: 'speed', val: subScores.speed },
      { name: 'Agility & Quickness', key: 'agility', val: subScores.agility },
      { name: 'Cardiovascular Endurance', key: 'endurance', val: subScores.endurance },
      { name: 'Muscular Strength', key: 'strength', val: subScores.strength },
      { name: 'Technical Skill & Accuracy', key: 'skill', val: subScores.skill }
    ];

    scoreMap.sort((a, b) => b.val - a.val);

    const strengths = scoreMap.slice(0, 2).map((item) => `${item.name} (${item.val}/100)`);
    const weaknesses = scoreMap.slice(-2).map((item) => `${item.name} (${item.val}/100)`);

    // Sport specific drill recommendations
    const recommendations: string[] = [];
    const trainingPlan: string[] = [];

    const lowestCategory = scoreMap[scoreMap.length - 1].key;

    if (lowestCategory === 'speed') {
      recommendations.push(
        'Incorporate 10m-30m sprint acceleration starts with 90 seconds recovery.',
        'Use resistance band sprint drives to build initial explosive power.'
      );
      trainingPlan.push(
        'Mon/Wed: 5x30m Max Sprints, 3x Flying 20m',
        'Tue/Thu: Plyometric depth jumps & bounding drills',
        'Fri: Sport-specific acceleration reps'
      );
    } else if (lowestCategory === 'agility') {
      recommendations.push(
        `Your agility score is below your other metrics. Add ladder drills, 5-10-5 shuttle runs, and cone drills.`,
        'Focus on lower-body deceleration and sharp plant foot control.'
      );
      trainingPlan.push(
        'Day 1: Speed ladder icky-shuffle & lateral bounds (4 sets)',
        'Day 3: T-Drill and 3-Cone L-Drill timed trials',
        'Day 5: Reactive directional drills with partner callouts'
      );
    } else if (lowestCategory === 'endurance') {
      recommendations.push(
        'Perform high-intensity interval training (HIIT) with 40s work / 20s rest blocks.',
        'Build baseline aerobic threshold with 25-minute continuous tempo runs.'
      );
      trainingPlan.push(
        'Mon/Wed: 20-minute interval shuttle runs (40s work / 20s rest)',
        'Tue/Thu: Core endurance circuits & row/cycling intervals',
        'Sat: Long slow distance steady-state conditioning'
      );
    } else if (lowestCategory === 'strength') {
      recommendations.push(
        'Implement progressive resistance bodyweight exercises (weighted pushups, squat jumps).',
        'Target posterior chain power with Romanian deadlifts or kettlebell swings.'
      );
      trainingPlan.push(
        'Mon: Lower body explosive squats & broad jumps (4x8)',
        'Wed: Upper body push/pull power sets',
        'Fri: Full body compound power supersets'
      );
    } else {
      recommendations.push(
        `Refine sport-specific touch and target control for ${sport}.`,
        'Practice target precision drills under physiological fatigue.'
      );
      trainingPlan.push(
        `Day 1: ${sport} precision target reps (50 repetitions)`,
        `Day 3: Timed obstacle & skill mastery course`,
        `Day 5: Match-scenario pressure drills`
      );
    }

    // Add general sports optimization recommendation
    recommendations.push(
      `Maintain hydration, prioritize 8 hours of sleep for neuromuscular recovery, and log assessments bi-weekly.`
    );

    return {
      overallScore,
      performanceLevel,
      strengths,
      weaknesses,
      recommendations,
      trainingPlan
    };
  }
}
