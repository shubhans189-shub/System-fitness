import { DailyCheckIn, HunterStats, QuestItem, UserProfile } from '../types';

export interface AnalyticalCoachContext {
  message: string;
  userProfile?: UserProfile | null;
  stats?: HunterStats | null;
  questItems?: QuestItem[] | { exercise: string; current: number; target: number; unit: string }[];
  dailyCheckIn?: DailyCheckIn | null;
  consumedCalories?: number;
  consumedProtein?: number;
  waterIntakeMl?: number;
}

export function generateAnalyticalCoachResponse(ctx: AnalyticalCoachContext): string {
  const query = (ctx.message || '').toLowerCase();
  const name = ctx.userProfile?.name || 'Hunter';
  const rank = ctx.stats?.rank || 'E-Rank';
  const level = ctx.stats?.level || 1;
  const title = ctx.stats?.equippedTitle || ctx.stats?.title || 'Awakened Hunter';
  const weight = ctx.userProfile?.weightKg || 70;
  const height = ctx.userProfile?.heightCm || 175;
  const targetCals = ctx.userProfile?.targetCalories || 2300;
  const maintenanceCals = ctx.userProfile?.maintenanceCalories || 2200;
  const proteinGoal = ctx.userProfile?.proteinGrams || 140;
  const waterTarget = ctx.userProfile?.waterTargetLiters || 3.0;

  // Real-time calculated metrics
  const calsConsumed = ctx.consumedCalories || 0;
  const proteinConsumed = ctx.consumedProtein || 0;
  const calRemaining = targetCals - calsConsumed;
  const proteinRemaining = Math.max(0, proteinGoal - proteinConsumed);

  const questList = ctx.questItems || [];
  let totalQuestVolume = 0;
  let completedQuestCount = 0;

  questList.forEach((q: any) => {
    const cur = Number(q.current) || 0;
    const tgt = Number(q.target) || 0;
    totalQuestVolume += cur;
    if (cur >= tgt && tgt > 0) completedQuestCount++;
  });

  const sleepHours = ctx.dailyCheckIn?.sleepHours ?? 7;
  const sleepQuality = ctx.dailyCheckIn?.sleepQuality ?? 'good';
  const mood = ctx.dailyCheckIn?.mood ?? 'steady';
  const staminaBuff = ctx.dailyCheckIn?.staminaBuffPercent ?? 0;

  // Analytical reasoning pathways

  // 1. Joint biomechanics, pain, knees, elbows, form, squats, push-ups
  if (
    query.includes('knee') ||
    query.includes('joint') ||
    query.includes('pain') ||
    query.includes('hurt') ||
    query.includes('sore') ||
    query.includes('strain') ||
    query.includes('injury')
  ) {
    return `[SYSTEM ANALYTICAL DIAGNOSTIC: KINETIC CHAIN & JOINT INTEGRITY]
Target: Player ${name} (Rank: ${rank}, Level: ${level}, Weight: ${weight}kg)

1. BIOMECHANICAL SHEAR FORCE DECONSTRUCTION:
- If knee stress manifests during squats: Your patellar tendon experiences up to 4.5x bodyweight shear load when your knees translate aggressively past your toes before hip hinge initiation.
- Actionable Form Calibration: Drive hips back first (anterior pelvic engagement), keep shins closer to 80-85° verticality, and cue knees outward ("screw your feet into the floor") to engage gluteus medius and unload the meniscus.
- Immediate Regression: Substitute deep free squats with Box Squats or 45-degree Wall Sits (4 sets x 35s isometric hold). Isometrics produce tendon analgesia within 45 minutes.

2. SYNOVIAL FLUID & CELLULAR HYDRATION:
- Current Water Status: ${ctx.waterIntakeMl ? `${ctx.waterIntakeMl}ml` : 'Tracking active'} / ${Math.round(waterTarget * 1000)}ml target.
- Cartilage is 70-80% water. Take 500ml water with 1g sodium/pink salt immediately to restore articular fluid pressure.

3. RECOVERY METRIC:
- Sleep status: ${sleepHours}h (${sleepQuality}). Collagen matrix repair occurs exclusively during slow-wave non-REM sleep. Maintain scheduled rest protocols.`;
  }

  // 2. Push-up or Chest volume, set breakdown, progression
  if (
    query.includes('pushup') ||
    query.includes('push-up') ||
    query.includes('chest') ||
    query.includes('pec') ||
    query.includes('arm') ||
    query.includes('upper body')
  ) {
    const pushupTarget = 100;
    const str = ctx.stats?.str || 10;
    return `[SYSTEM TACTICAL DIRECTIVE: PUSH-UP MECHANICAL WORKLOAD]
Player ${name} | STR Stat: ${str} | Title: "${title}"

1. VOLUME ACCUMULATION STRATEGY (100 Rep Protocol):
- High-Fatigue Trap: Trying to blast 30-40 reps in set 1 burns neural motor unit recruitment and leaves you failing at set 3.
- Optimal Set Scheme:
  * Tier 1 (High Quality): 5 sets x 20 reps (90s rest)
  * Tier 2 (Density Cluster): 10 sets x 10 reps (45s rest)
  * Tier 3 (EMOM): Every Minute on the Minute perform 8-12 reps for 10 minutes.

2. BIOMECHANICAL ANGLE OPTIMIZATION:
- Elbow Path: Tuck humerus to exactly 45-60° relative to your ribcage (Arrowhead posture, not T-posture).
- Scapular Mechanics: Allow shoulder blades to retract and pinch together on the descent, then protract (push floor away) at the peak lock-out to fire the serratus anterior.
- Tempo Cadence: 2 seconds lowering (eccentric stretch), 0 second pause, 1 second violent upward drive (concentric contraction).

3. HYPERTROPHY FEEDING:
- Current Protein Logged: ${proteinConsumed}g / ${proteinGoal}g goal. Consuming 25-30g of leucine-rich protein within 2 hours post-quest will maximize muscle protein synthesis.`;
  }

  // 3. Indian & Global Nutrition, exact food queries, vegetarian protein, diet calculation
  if (
    query.includes('protein') ||
    query.includes('diet') ||
    query.includes('food') ||
    query.includes('calorie') ||
    query.includes('paneer') ||
    query.includes('soya') ||
    query.includes('sattu') ||
    query.includes('dal') ||
    query.includes('egg') ||
    query.includes('chicken') ||
    query.includes('macro') ||
    query.includes('bulk') ||
    query.includes('cut')
  ) {
    const isVegetarian = query.includes('veg') || query.includes('paneer') || query.includes('soya') || query.includes('sattu');
    return `[SYSTEM METABOLIC COMPUTATION: NUTRITIONAL BLUEPRINT]
Hunter: ${name} (Weight: ${weight}kg | Target Energy: ${targetCals} kcal)

1. REAL-TIME CALORIC & AMINO EQUATION:
- Maintenance Baseline (TDEE): ${maintenanceCals} kcal
- Tactical Target: ${targetCals} kcal (${targetCals > maintenanceCals ? `+${targetCals - maintenanceCals} kcal Surplus for Hypertrophy` : `${targetCals - maintenanceCals} kcal Deficit for Fat Loss`})
- Daily Protein Ceiling: ${proteinGoal}g (${(proteinGoal / weight).toFixed(1)}g per kg bodyweight - Optimal Hypertrophic Range)
- Status Today: ${calsConsumed} kcal logged (${calRemaining} kcal remaining), ${proteinConsumed}g protein logged (${proteinRemaining}g needed).

2. REALISTIC FOOD COMBINATIONS (ACTUAL MACRO VALUES):
${
  isVegetarian
    ? `- Soya Chunks (Dry wt 50g): 172 kcal, 26g protein, 16g carbs, 0.3g fat. Boil in spiced curry with garlic and tomato.
- Paneer (120g fresh): 348 kcal, 22g protein, 4g carbs, 26g fats. Sauté with capsicum, onion, and black pepper.
- Sattu Drink (45g in 300ml cold water + lemon + roasted cumin): 185 kcal, 11.5g protein, 29g complex carbs.
- Moong Dal Chilla (2 medium chillas from soaked yellow moong): 280 kcal, 16g protein, 38g carbs, 6g fat.`
    : `- Chicken Breast (180g raw / 150g grilled): 247 kcal, 46.5g protein, 0g carbs, 5.4g fats. Peak bioavailability.
- Whole Boiled Eggs (3 eggs): 232 kcal, 19.5g protein, 1.6g carbs, 16.5g fats + 246 IU Vitamin D.
- Soya Chunks or Paneer side: Add 40g soya chunks to your lunch curry for an immediate +21g protein surge.
- Whey Protein (1 scoop 32g): 125 kcal, 25g protein, 2g carbs, 1.4g fats.`
}

3. TIMING EXECUTION:
- Spread intake into 3-4 feeding pulses of at least 30g protein each to repeatedly trigger the mTOR signaling pathway throughout the 24-hour cycle.`;
  }

  // 4. Running, stamina, cardio, agility
  if (
    query.includes('run') ||
    query.includes('running') ||
    query.includes('cardio') ||
    query.includes('stamina') ||
    query.includes('km') ||
    query.includes('pace')
  ) {
    const agi = ctx.stats?.agi || 10;
    return `[SYSTEM AGILITY & AEROBIC ENGINE ANALYSIS]
Player ${name} | Agility Stat: ${agi} | Target: 10km Endurance Run

1. PHYSIOLOGICAL CADENCE & GAIT EFFICIENCY:
- Optimal Stride Frequency: Maintain 170-180 strides per minute. High cadence shortens stride length, eliminating heel-striking brake forces and transferring landing force elastically into the Achilles tendon.
- Heart Rate Zones:
  * Zone 2 (Base Aerobic Capacity): 65-75% max HR. You should be able to breathe exclusively through your nose or speak in full sentences. 80% of your 10km training should reside here.
  * Zone 4 (Threshold Engine): 85-90% max HR during sprint finishes.

2. PACING SCHEME FOR 10KM:
- Km 1 to 3: Controlled warmup pace (e.g. 6:30 min/km). Let capillaries open up.
- Km 4 to 8: Cruise velocity (e.g. 5:45 - 6:00 min/km). Synchronize 2-in, 2-out rhythm.
- Km 9 to 10: Monarch Acceleration. Deplete remaining glycogen stores.

3. REHYDRATION MANDATE:
- Sweat loss rate at ${weight}kg averages 800-1100ml per hour. Replenish with water + 400mg sodium + 100mg potassium post-run.`;
  }

  // 5. Fatigue, sleep, recovery, mindset, motivation
  if (
    query.includes('sleep') ||
    query.includes('tired') ||
    query.includes('fatigue') ||
    query.includes('rest') ||
    query.includes('exhausted') ||
    query.includes('lazy') ||
    query.includes('give up') ||
    query.includes('motivat')
  ) {
    return `[SYSTEM RECOVERY MATRIX & SHADOW MONARCH WILL]
Hunter: ${name} (Rank: ${rank}, Level: ${level})
Sleep Telemetry: ${sleepHours} hours recorded (${sleepQuality} quality | State: ${mood})

1. BIOLOGICAL RECOVERY CALCULATION:
- Central Nervous System (CNS) Recovery: Adenosine clearance in brain tissue requires 90-minute REM/Deep sleep cycles. 
- With ${sleepHours}h sleep, your neuromuscular stamina modifier is calculated at +${staminaBuff}%.
- Cellular Protein Synthesis: Peak Human Growth Hormone (HGH) release occurs during Phase 3 slow-wave sleep. If sleep is under 7 hours, avoid max-effort 1RM failure sets today; focus on pristine sub-maximal volume.

2. THE MONARCH'S PSYCHOLOGICAL DIRECTIVE:
- Sung Jin-woo faced the Cartenon Temple Double Dungeon as Humankind's Weakest E-Rank Hunter. He did not level up through comfort or convenient conditions.
- Motivation is transient emotion; Discipline is an immutable system protocol.
- When the mind whispers "quit", break the remaining mandate down to a single rep. Stand up, breathe deep into your diaphragm, and begin set one immediately!`;
  }

  // Default deep analytical response tailored to live user data
  return `[SYSTEM ARCHITECT ANALYTICAL DIRECTIVE]
Hunter: ${name} (Rank: ${rank}, Level: ${level}, Equipped Title: "${title}")
Status Diagnostic: STR ${ctx.stats?.str || 10} | AGI ${ctx.stats?.agi || 10} | VIT ${ctx.stats?.vit || 10} | INT ${ctx.stats?.int || 10} | PER ${ctx.stats?.per || 10}

Regarding your inquiry: "${ctx.message}"

1. REAL-TIME BIOMETRIC READOUT:
- Target Energy: ${targetCals} kcal | Logged: ${calsConsumed} kcal (${calRemaining} kcal remaining)
- Target Protein: ${proteinGoal}g | Logged: ${proteinConsumed}g (${proteinRemaining}g remaining)
- Hydration Status: ${ctx.waterIntakeMl ? `${ctx.waterIntakeMl}ml` : 'Tracking active'} / ${Math.round(waterTarget * 1000)}ml
- Quest Execution: ${completedQuestCount} / ${questList.length} objectives cleared today (${totalQuestVolume} total reps/units completed).

2. TACTICAL TRAINING RECOMMENDATION:
- Execute your daily quest with clean progressive overload. Never sacrifice joint range of motion for speed.
- If performing push-ups or squats, enforce controlled eccentric descent (2-3 seconds) to trigger mechanical tension.
- Pair your daily quest with exact nutrient timing: replenish glycogen with complex carbohydrates and deliver 25-35g protein within your post-training window.

3. NEXT SYSTEM EVOLUTION:
- Consistency is the primary formula that ascends an E-Rank hunter to S-Rank. Proceed with your daily protocol!`;
}
