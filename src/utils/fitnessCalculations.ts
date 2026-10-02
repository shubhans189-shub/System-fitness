import { ActivityLevel, FitnessGoal, Gender, HunterRank, HunterStats, UserProfile } from '../types';

export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: Gender): number {
  // Mifflin-St Jeor Formula
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    return Math.round(base + 5);
  } else if (gender === 'female') {
    return Math.round(base - 161);
  }
  return Math.round(base - 78); // Average for other
}

export function getActivityMultiplier(activity: ActivityLevel): number {
  switch (activity) {
    case 'sedentary':
      return 1.2;
    case 'light':
      return 1.375;
    case 'moderate':
      return 1.55;
    case 'heavy':
      return 1.725;
    case 'athlete':
      return 1.9;
    default:
      return 1.55;
  }
}

export function calculateMaintenanceCalories(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender,
  activity: ActivityLevel
): number {
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const multiplier = getActivityMultiplier(activity);
  return Math.round(bmr * multiplier);
}

export function calculateTargetCalories(
  maintenance: number,
  goals: FitnessGoal[],
  weightKg: number
): {
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  waterLiters: number;
} {
  const hasWeightLoss = goals.includes('weight_loss');
  const hasMuscleGain = goals.includes('increase_muscle');
  const hasStayFit = goals.includes('stay_fit');

  let calorieDelta = 0;

  if (hasWeightLoss && hasMuscleGain) {
    // Body recomposition: slight deficit with high protein
    calorieDelta = -250;
  } else if (hasWeightLoss) {
    calorieDelta = -450;
  } else if (hasMuscleGain) {
    calorieDelta = +350;
  } else if (hasStayFit) {
    calorieDelta = 0;
  }

  const targetCalories = Math.max(1200, maintenance + calorieDelta);

  // Protein requirement (higher for muscle gain & caloric deficit preservation)
  let proteinPerKg = 1.8;
  if (hasMuscleGain || hasWeightLoss) {
    proteinPerKg = 2.2;
  }
  const proteinGrams = Math.round(weightKg * proteinPerKg);
  const proteinCals = proteinGrams * 4;

  // Fats requirement: 25% of target calories
  const fatCals = Math.round(targetCalories * 0.25);
  const fatsGrams = Math.round(fatCals / 9);

  // Carbohydrates fill remaining calories
  const remainingCals = Math.max(0, targetCalories - (proteinCals + fatCals));
  const carbsGrams = Math.round(remainingCals / 4);

  // Water requirement: 35-40ml/kg + 750ml for workout/quest sweat
  const rawWater = (weightKg * 38 + 750) / 1000;
  const waterLiters = parseFloat(rawWater.toFixed(1));

  return {
    targetCalories,
    proteinGrams,
    carbsGrams,
    fatsGrams,
    waterLiters,
  };
}

export function calculateXpForNextLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.35));
}

export function getRankAndTitle(level: number): { rank: HunterRank; title: string } {
  if (level >= 200) {
    return { rank: 'Shadow Monarch', title: 'Ruler of Death & Shadows' };
  }
  if (level >= 150) {
    return { rank: 'National Level', title: 'World Authority Hunter' };
  }
  if (level >= 100) {
    return { rank: 'S-Rank', title: 'Supreme Apex Awakened' };
  }
  if (level >= 70) {
    return { rank: 'A-Rank', title: 'Elite Raid Commander' };
  }
  if (level >= 45) {
    return { rank: 'B-Rank', title: 'Veteran Dungeon Raider' };
  }
  if (level >= 25) {
    return { rank: 'C-Rank', title: 'Seasoned Awakened' };
  }
  if (level >= 10) {
    return { rank: 'D-Rank', title: 'Promising Combatant' };
  }
  return { rank: 'E-Rank', title: "Humankind's Weakest Hunter" };
}

export function calculateMaxHP(vit: number, level: number): number {
  return 500 + vit * 25 + level * 20;
}

export function calculateMaxMP(int: number, level: number): number {
  return 200 + int * 20 + level * 15;
}

export const DEFAULT_PLANS = [
  {
    id: 'novice_e',
    name: 'E-Rank: Initial Awakening',
    subtitle: 'Beginner Scale (Foundational Conditioning)',
    rankRequirement: 'E-Rank' as HunterRank,
    description: 'A scaled physical quest designed to condition your ligaments, tendons, and aerobic base before entering higher dungeons.',
    exercises: [
      { id: 'pushups', name: 'Push-ups', target: 30, unit: 'reps', statReward: 'str' as const, xpReward: 40 },
      { id: 'situps', name: 'Sit-ups', target: 30, unit: 'reps', statReward: 'vit' as const, xpReward: 40 },
      { id: 'squats', name: 'Squats', target: 30, unit: 'reps', statReward: 'str' as const, xpReward: 40 },
      { id: 'running', name: 'Running', target: 3, unit: 'km', statReward: 'agi' as const, xpReward: 60 },
    ],
  },
  {
    id: 'jinwoo_standard',
    name: 'Sung Jin-woo Standard Daily Quest',
    subtitle: 'System Default (The Architect Protocol)',
    rankRequirement: 'D-Rank' as HunterRank,
    description: 'The exact daily training regime enforced by the System upon Sung Jin-woo: 100 Push-ups, 100 Sit-ups, 100 Squats, and 10km Running.',
    exercises: [
      { id: 'pushups', name: 'Push-ups', target: 100, unit: 'reps', statReward: 'str' as const, xpReward: 100 },
      { id: 'situps', name: 'Sit-ups', target: 100, unit: 'reps', statReward: 'vit' as const, xpReward: 100 },
      { id: 'squats', name: 'Squats', target: 100, unit: 'reps', statReward: 'str' as const, xpReward: 100 },
      { id: 'running', name: 'Running', target: 10, unit: 'km', statReward: 'agi' as const, xpReward: 150 },
    ],
  },
  {
    id: 'intermediate_c',
    name: 'C-Rank: Dungeon Specialist',
    subtitle: 'Strength & Core Focus',
    rankRequirement: 'C-Rank' as HunterRank,
    description: 'Calibrated for hunters seeking rapid muscular hypertrophy, endurance, and high physical resilience.',
    exercises: [
      { id: 'pushups', name: 'Push-ups', target: 75, unit: 'reps', statReward: 'str' as const, xpReward: 80 },
      { id: 'situps', name: 'Sit-ups', target: 75, unit: 'reps', statReward: 'vit' as const, xpReward: 80 },
      { id: 'squats', name: 'Squats', target: 80, unit: 'reps', statReward: 'str' as const, xpReward: 85 },
      { id: 'running', name: 'Running', target: 6, unit: 'km', statReward: 'agi' as const, xpReward: 110 },
    ],
  },
  {
    id: 'monarch_ascension',
    name: 'Shadow Monarch Ascension',
    subtitle: 'High-Volume Apex Protocol',
    rankRequirement: 'S-Rank' as HunterRank,
    description: 'For hardened athletes seeking supernatural stamina and dense muscular development.',
    exercises: [
      { id: 'pushups', name: 'Push-ups', target: 150, unit: 'reps', statReward: 'str' as const, xpReward: 160 },
      { id: 'situps', name: 'Sit-ups', target: 150, unit: 'reps', statReward: 'vit' as const, xpReward: 160 },
      { id: 'squats', name: 'Squats', target: 150, unit: 'reps', statReward: 'str' as const, xpReward: 160 },
      { id: 'running', name: 'Running', target: 12, unit: 'km', statReward: 'agi' as const, xpReward: 220 },
    ],
  },
];
