export type Gender = 'male' | 'female' | 'other';

export type FitnessGoal = 'weight_loss' | 'stay_fit' | 'increase_muscle';

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'heavy' | 'athlete';

export type HunterRank = 'E-Rank' | 'D-Rank' | 'C-Rank' | 'B-Rank' | 'A-Rank' | 'S-Rank' | 'National Level' | 'Shadow Monarch';

export type GuardianMode = 'jinwoo';

export interface UserProfile {
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  goals: FitnessGoal[];
  activityLevel: ActivityLevel;
  maintenanceCalories: number;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  waterTargetLiters: number;
  onboardingComplete: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  createdAt: string;
}

export interface HunterStats {
  level: number;
  xp: number;
  nextLevelXp: number;
  availablePoints: number;
  str: number; // Strength - affects physical power, push-ups/squats performance
  agi: number; // Agility - affects running speed, stamina recovery
  vit: number; // Vitality - affects maximum HP and fatigue threshold
  int: number; // Intelligence - affects mana and mental focus/cooldown
  per: number; // Perception - affects senses and analytical precision
  rank: HunterRank;
  title: string;
  equippedTitle?: string;
  unlockedTitles?: string[];
  fatigue: number; // 0 to 100
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  dailyStreak: number;
  lastActiveDate?: string;
  rankThemeOverride?: HunterRank;
}

export type SleepQuality = 'terrible' | 'poor' | 'fair' | 'good' | 'optimal';
export type HunterMood = 'exhausted' | 'fatigued' | 'steady' | 'focused' | 'bloodlusted';

export interface DailyCheckIn {
  date: string; // YYYY-MM-DD
  sleepHours: number;
  sleepQuality: SleepQuality;
  mood: HunterMood;
  notes?: string;
  fatigueModifier: number; // e.g. -15 or +10
  staminaBuffPercent: number; // e.g. +10%
  completedAt: string;
  systemTip?: string;
}

export interface QuestItem {
  id: string;
  name: string;
  target: number;
  current: number;
  unit: string;
  statReward: 'str' | 'agi' | 'vit' | 'int' | 'per';
  xpReward: number;
  completed?: boolean;
}

export interface DailyQuestState {
  date: string; // YYYY-MM-DD
  items: QuestItem[];
  allCompleted: boolean;
  rewardsClaimed: boolean;
  penaltyWarningActive?: boolean;
}

export interface TrainingPlan {
  id: string;
  name: string;
  subtitle: string;
  rankRequirement: HunterRank;
  description: string;
  exercises: {
    id: string;
    name: string;
    target: number;
    unit: string;
    statReward: 'str' | 'agi' | 'vit' | 'int' | 'per';
    xpReward: number;
  }[];
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  completionRate: number; // 0 to 100
  pushups: number;
  situps: number;
  squats: number;
  runningKm: number;
  waterMl: number;
  caloriesConsumed?: number;
  weightKg?: number;
  levelAtDay: number;
}

export interface WeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
}

export interface FoodMicronutrients {
  fiberGrams?: number;
  sodiumMg?: number;
  potassiumMg?: number;
  magnesiumMg?: number;
  vitaminDiu?: number;
  calciumMg?: number;
  ironMg?: number;
}

export interface MealLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  timestamp: string; // HH:MM
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  name: string;
  description: string;
  photoUrl?: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  micronutrients: FoodMicronutrients;
  hunterRank?: string;
  systemComment?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}
