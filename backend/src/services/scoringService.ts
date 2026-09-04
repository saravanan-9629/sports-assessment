import { IAssessmentMetrics, ISubScores } from '../models/Assessment';

export interface IScoringResult {
  subScores: ISubScores;
  overallScore: number;
}

export class ScoringService {
  /**
   * Calculates sub-scores (0-100) and weighted overall score from raw physical metrics.
   */
  public static calculateScores(sport: string, metrics: IAssessmentMetrics): IScoringResult {
    const {
      sprintTimeSec = 4.5,
      jumpHeightCm = 45,
      reactionTimeMs = 300,
      pushupsReps = 25,
      situpsReps = 30,
      flexibilityCm = 20,
      accuracyScore = 70,
      dribblingSec = 15,
      throwingDistMeters = 35
    } = metrics;

    // 1. Speed Score (lower sprint time = higher score)
    // 2.8s = 100, 6.0s = 30
    let speed = Math.round(Math.max(20, Math.min(100, 100 - (sprintTimeSec - 2.8) * 20)));

    // 2. Agility Score (lower reaction time & dribbling time = higher score)
    // reaction: 150ms = 100, 450ms = 30
    const reactionScore = 100 - ((reactionTimeMs - 150) / 300) * 70;
    const dribbleScore = 100 - ((dribblingSec - 8) / 15) * 60;
    let agility = Math.round(Math.max(20, Math.min(100, (reactionScore + dribbleScore) / 2)));

    // 3. Endurance Score (pushups, situps)
    // pushups: 60 = 100, 10 = 30
    // situps: 70 = 100, 15 = 30
    const pushupScore = Math.min(100, (pushupsReps / 60) * 100);
    const situpScore = Math.min(100, (situpsReps / 70) * 100);
    let endurance = Math.round(Math.max(20, Math.min(100, (pushupScore + situpScore) / 2)));

    // 4. Strength Score (vertical jump & pushups)
    // jump: 75cm = 100, 20cm = 20
    const jumpScore = Math.min(100, (jumpHeightCm / 75) * 100);
    let strength = Math.round(Math.max(20, Math.min(100, jumpScore * 0.6 + pushupScore * 0.4)));

    // 5. Skill Score (accuracy, throwing/flexibility)
    const accuracy = Math.min(100, accuracyScore);
    const throwScore = Math.min(100, (throwingDistMeters / 70) * 100);
    let skill = Math.round(Math.max(20, Math.min(100, accuracy * 0.6 + throwScore * 0.4)));

    // Sport-specific subScore weighting adjustment
    let weights = { speed: 0.2, agility: 0.2, endurance: 0.2, strength: 0.2, skill: 0.2 };
    if (sport === 'Athletics') {
      weights = { speed: 0.35, agility: 0.15, endurance: 0.25, strength: 0.15, skill: 0.1 };
    } else if (sport === 'Cricket') {
      weights = { speed: 0.15, agility: 0.2, endurance: 0.15, strength: 0.15, skill: 0.35 };
    } else if (sport === 'Football') {
      weights = { speed: 0.25, agility: 0.25, endurance: 0.25, strength: 0.1, skill: 0.15 };
    } else if (sport === 'Basketball') {
      weights = { speed: 0.2, agility: 0.25, endurance: 0.15, strength: 0.2, skill: 0.2 };
    }

    const overallScore = Math.round(
      speed * weights.speed +
      agility * weights.agility +
      endurance * weights.endurance +
      strength * weights.strength +
      skill * weights.skill
    );

    return {
      subScores: { speed, agility, endurance, strength, skill },
      overallScore
    };
  }
}
