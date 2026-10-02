import React, { useState } from 'react';
import { ActivityLevel, FitnessGoal, Gender, UserProfile } from '../types';
import { calculateMaintenanceCalories, calculateTargetCalories } from '../utils/fitnessCalculations';
import { playLevelUpSound, playRepCountSound } from '../utils/soundEffects';
import { Flame, Dumbbell, HeartPulse, Sparkles, ShieldCheck, CheckCircle2, ChevronRight, User, Scale } from 'lucide-react';

interface OnboardingModalProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile | null;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onComplete, initialProfile }) => {
  const [name, setName] = useState(initialProfile?.name || 'Sung Jin-woo');
  const [age, setAge] = useState<number>(initialProfile?.age || 24);
  const [gender, setGender] = useState<Gender>(initialProfile?.gender || 'male');
  const [heightCm, setHeightCm] = useState<number>(initialProfile?.heightCm || 178);
  const [weightKg, setWeightKg] = useState<number>(initialProfile?.weightKg || 74);
  const [targetWeightKg, setTargetWeightKg] = useState<number>(initialProfile?.targetWeightKg || 72);
  const [goals, setGoals] = useState<FitnessGoal[]>(initialProfile?.goals || ['increase_muscle', 'stay_fit']);
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(initialProfile?.activityLevel || 'moderate');
  const [step, setStep] = useState<1 | 2>(1);

  // Toggle multi-select goals
  const toggleGoal = (goal: FitnessGoal) => {
    playRepCountSound(true);
    setGoals((prev) => {
      if (prev.includes(goal)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((g) => g !== goal);
      } else {
        return [...prev, goal];
      }
    });
  };

  // Preview calculations in real time
  const maintenance = calculateMaintenanceCalories(weightKg, heightCm, age, gender, activityLevel);
  const nutrition = calculateTargetCalories(maintenance, goals, weightKg);

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    playLevelUpSound(true);

    const newProfile: UserProfile = {
      name: name.trim() || 'Player',
      age: Number(age) || 24,
      gender,
      heightCm: Number(heightCm) || 175,
      weightKg: Number(weightKg) || 70,
      targetWeightKg: Number(targetWeightKg) || Number(weightKg) || 70,
      goals,
      activityLevel,
      maintenanceCalories: maintenance,
      targetCalories: nutrition.targetCalories,
      proteinGrams: nutrition.proteinGrams,
      carbsGrams: nutrition.carbsGrams,
      fatsGrams: nutrition.fatsGrams,
      waterTargetLiters: nutrition.waterLiters,
      onboardingComplete: true,
      soundEnabled: true,
      notificationsEnabled: true,
      createdAt: new Date().toISOString(),
    };

    onComplete(newProfile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 overflow-y-auto backdrop-blur-md">
      <div className="w-full max-w-2xl rounded-2xl system-window p-6 sm:p-8 text-slate-100 shadow-[0_0_50px_rgba(0,229,255,0.25)] border border-cyan-500/50 my-auto">
        {/* System Hologram Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-400/40 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>[ SYSTEM AWAKENING INITIATION ]</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-system text-white tracking-wide glow-text-cyan">
            PLAYER RE-REGISTRATION
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-lg mx-auto">
            Input your biological parameters. The System will compute maintenance calories, macronutrients, and water protocols to elevate your hunter rank.
          </p>
        </div>

        {step === 1 ? (
          /* STEP 1: PHYSICAL PARAMETERS */
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-semibold uppercase text-cyan-300 mb-1.5 tracking-wider">
                  Hunter Call-sign / Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-cyan-400 absolute left-3 top-3" />
                  <input
                    id="input-hunter-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sung Jin-woo"
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm"
                    required
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold uppercase text-cyan-300 mb-1.5 tracking-wider">
                  Age (Years)
                </label>
                <input
                  id="input-hunter-age"
                  type="number"
                  min="12"
                  max="100"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold uppercase text-cyan-300 mb-1.5 tracking-wider">
                  Biological Gender (BMR Formula)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['male', 'female', 'other'] as Gender[]).map((g) => (
                    <button
                      type="button"
                      key={g}
                      onClick={() => setGender(g)}
                      className={`py-2 px-2 text-xs font-medium rounded-lg border transition capitalize ${
                        gender === g
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-semibold shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                          : 'bg-slate-900/60 border-slate-700/60 text-slate-400 hover:text-slate-200 hover:border-slate-600'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Activity Level */}
              <div>
                <label className="block text-xs font-semibold uppercase text-cyan-300 mb-1.5 tracking-wider">
                  Activity Level
                </label>
                <select
                  id="select-activity-level"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm"
                >
                  <option value="sedentary">Sedentary (Minimal movement)</option>
                  <option value="light">Light (1-2 workouts/week)</option>
                  <option value="moderate">Moderate (3-5 workouts/week)</option>
                  <option value="heavy">Heavy (6-7 intense workouts/week)</option>
                  <option value="athlete">Hunter / Athlete (Twice daily training)</option>
                </select>
              </div>

              {/* Height */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold uppercase text-cyan-300 tracking-wider">
                    Height (cm)
                  </label>
                  <span className="text-xs text-slate-400">{Math.floor(heightCm / 30.48)}ft {Math.round((heightCm % 30.48) / 2.54)}in</span>
                </div>
                <input
                  id="input-hunter-height"
                  type="number"
                  min="100"
                  max="250"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm"
                  required
                />
              </div>

              {/* Weight */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold uppercase text-cyan-300 tracking-wider">
                    Weight (kg)
                  </label>
                  <span className="text-xs text-slate-400">~{(weightKg * 2.20462).toFixed(1)} lbs</span>
                </div>
                <input
                  id="input-hunter-weight"
                  type="number"
                  min="30"
                  max="250"
                  step="0.5"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-950/80 border border-cyan-500/30 text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm"
                  required
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  playRepCountSound(true);
                  setStep(2);
                }}
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-system text-sm transition shadow-[0_0_20px_rgba(0,229,255,0.4)]"
              >
                <span>Proceed to Target Goals</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: MULTI-CHOICE TARGET GOALS & NUTRITION PREVIEW */
          <form onSubmit={handleFinish} className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold uppercase text-cyan-300 tracking-wider">
                  Target Goal (Select One or Multiple Options)
                </label>
                <span className="text-xs text-slate-400">Flexibly combine paths</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Weight Loss */}
                <button
                  type="button"
                  onClick={() => toggleGoal('weight_loss')}
                  className={`p-4 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    goals.includes('weight_loss')
                      ? 'bg-rose-950/30 border-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Flame className={`w-6 h-6 ${goals.includes('weight_loss') ? 'text-rose-400' : 'text-slate-500'}`} />
                    {goals.includes('weight_loss') && <CheckCircle2 className="w-4 h-4 text-rose-400" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-100">Weight Loss</div>
                    <div className="text-xs text-slate-400 mt-1">Fat cut & metabolic acceleration</div>
                  </div>
                </button>

                {/* Stay Fit */}
                <button
                  type="button"
                  onClick={() => toggleGoal('stay_fit')}
                  className={`p-4 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    goals.includes('stay_fit')
                      ? 'bg-sky-950/30 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <HeartPulse className={`w-6 h-6 ${goals.includes('stay_fit') ? 'text-sky-400' : 'text-slate-500'}`} />
                    {goals.includes('stay_fit') && <CheckCircle2 className="w-4 h-4 text-sky-400" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-100">Stay Fit</div>
                    <div className="text-xs text-slate-400 mt-1">Endurance, stamina & longevity</div>
                  </div>
                </button>

                {/* Increase Muscle */}
                <button
                  type="button"
                  onClick={() => toggleGoal('increase_muscle')}
                  className={`p-4 rounded-xl border text-left transition relative flex flex-col justify-between ${
                    goals.includes('increase_muscle')
                      ? 'bg-amber-950/30 border-amber-400 text-white shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Dumbbell className={`w-6 h-6 ${goals.includes('increase_muscle') ? 'text-amber-400' : 'text-slate-500'}`} />
                    {goals.includes('increase_muscle') && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-100">Increase Muscle</div>
                    <div className="text-xs text-slate-400 mt-1">Hypertrophy & physical strength</div>
                  </div>
                </button>
              </div>
            </div>

            {/* LIVE SYSTEM NUTRITION & METABOLIC BREAKDOWN */}
            <div className="bg-slate-950/90 rounded-xl p-4 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="text-cyan-400 font-bold font-system flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>SYSTEM METABOLIC CALCULATION MATRIX</span>
                </span>
                <span className="text-slate-400">Harris / Mifflin-St Jeor</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Maintenance TDEE</div>
                  <div className="text-base font-bold font-system text-white mt-0.5">
                    {maintenance} <span className="text-[10px] text-slate-400 font-normal">kcal</span>
                  </div>
                </div>

                <div className="bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-500/40">
                  <div className="text-[11px] text-cyan-300">Target Calories</div>
                  <div className="text-base font-bold font-system text-cyan-200 mt-0.5 glow-text-cyan">
                    {nutrition.targetCalories} <span className="text-[10px] text-cyan-400 font-normal">kcal</span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Protein Target</div>
                  <div className="text-base font-bold font-system text-emerald-300 mt-0.5">
                    {nutrition.proteinGrams}g <span className="text-[10px] text-slate-400 font-normal">({(nutrition.proteinGrams / weightKg).toFixed(1)}g/kg)</span>
                  </div>
                </div>

                <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Daily Hydration</div>
                  <div className="text-base font-bold font-system text-blue-300 mt-0.5">
                    {nutrition.waterLiters} <span className="text-[10px] text-slate-400 font-normal">Liters</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 pt-1 flex items-center justify-between px-1">
                <span>Carbs: <strong className="text-slate-200">{nutrition.carbsGrams}g</strong></span>
                <span>Fats: <strong className="text-slate-200">{nutrition.fatsGrams}g</strong></span>
                <span className="text-cyan-400">
                  {goals.length > 1 ? '🎯 Recomposition Mode Active' : '🎯 Single Focus Mode'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white text-sm"
              >
                Back
              </button>

              <button
                id="complete-onboarding-btn"
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold font-system text-sm transition shadow-[0_0_25px_rgba(0,229,255,0.5)]"
              >
                <Sparkles className="w-4 h-4" />
                <span>AWAKEN AS HUNTER</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
