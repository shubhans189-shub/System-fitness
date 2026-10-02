import React from 'react';
import { MealLogEntry, UserProfile } from '../types';
import { Droplet, Utensils, Zap, Shield, Sparkles, Plus, Minus, Info, Trash2, Clock } from 'lucide-react';
import { playRepCountSound } from '../utils/soundEffects';
import { MealLogger } from './MealLogger';

interface NutritionHubProps {
  userProfile: UserProfile;
  waterIntakeMl: number;
  onUpdateWater: (deltaMl: number) => void;
  onResetWater: () => void;
  meals?: MealLogEntry[];
  isOfflineMode?: boolean;
  onAddMeal: (meal: MealLogEntry) => void;
  onDeleteMeal: (mealId: string) => void;
}

export const NutritionHub: React.FC<NutritionHubProps> = ({
  userProfile,
  waterIntakeMl,
  onUpdateWater,
  onResetWater,
  meals = [],
  isOfflineMode = false,
  onAddMeal,
  onDeleteMeal,
}) => {
  const targetWaterMl = Math.round(userProfile.waterTargetLiters * 1000);
  const waterProgress = Math.min(100, Math.round((waterIntakeMl / Math.max(1, targetWaterMl)) * 100));

  const handleWaterAdd = (amount: number) => {
    playRepCountSound(userProfile.soundEnabled);
    onUpdateWater(amount);
  };

  // Macro target calorie distributions
  const proteinCals = userProfile.proteinGrams * 4;
  const carbsCals = userProfile.carbsGrams * 4;
  const fatsCals = userProfile.fatsGrams * 9;
  const totalMacroCals = proteinCals + carbsCals + fatsCals;

  const proteinPct = Math.round((proteinCals / totalMacroCals) * 100);
  const carbsPct = Math.round((carbsCals / totalMacroCals) * 100);
  const fatsPct = Math.round((fatsCals / totalMacroCals) * 100);

  // Consumed today calculations
  const consumedCalories = meals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const consumedProtein = meals.reduce((acc, m) => acc + (m.proteinGrams || 0), 0);
  const consumedCarbs = meals.reduce((acc, m) => acc + (m.carbsGrams || 0), 0);
  const consumedFats = meals.reduce((acc, m) => acc + (m.fatsGrams || 0), 0);

  // Consumed micros
  const consumedFiber = meals.reduce((acc, m) => acc + (m.micronutrients?.fiberGrams || 0), 0);
  const consumedSodium = meals.reduce((acc, m) => acc + (m.micronutrients?.sodiumMg || 0), 0);
  const consumedPotassium = meals.reduce((acc, m) => acc + (m.micronutrients?.potassiumMg || 0), 0);
  const consumedMagnesium = meals.reduce((acc, m) => acc + (m.micronutrients?.magnesiumMg || 0), 0);
  const consumedVitaminD = meals.reduce((acc, m) => acc + (m.micronutrients?.vitaminDiu || 0), 0);
  const consumedCalcium = meals.reduce((acc, m) => acc + (m.micronutrients?.calciumMg || 0), 0);
  const consumedIron = meals.reduce((acc, m) => acc + (m.micronutrients?.ironMg || 0), 0);

  const calProgress = Math.min(100, Math.round((consumedCalories / Math.max(1, userProfile.targetCalories)) * 100));
  const proteinProgress = Math.min(100, Math.round((consumedProtein / Math.max(1, userProfile.proteinGrams)) * 100));
  const carbsProgress = Math.min(100, Math.round((consumedCarbs / Math.max(1, userProfile.carbsGrams)) * 100));
  const fatsProgress = Math.min(100, Math.round((consumedFats / Math.max(1, userProfile.fatsGrams)) * 100));

  return (
    <div className="w-full space-y-6">
      {/* Everyday Meal Consumption Scanner Terminal */}
      <MealLogger userProfile={userProfile} isOfflineMode={isOfflineMode} onAddMeal={onAddMeal} />

      {/* Main Nutrition Matrix Card */}
      <div className="w-full rounded-2xl system-window p-5 sm:p-6 text-slate-100 border border-cyan-500/40 shadow-[0_0_30px_rgba(0,229,255,0.15)] space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/30 pb-3">
          <div className="flex items-center gap-2">
            <Utensils className="w-5 h-5 text-cyan-400" />
            <h2 className="font-system text-lg sm:text-xl font-bold tracking-wider text-white">
              DAILY NUTRITIONAL INVENTORY
            </h2>
          </div>
          <div className="text-xs text-cyan-300 font-system">
            CALIBRATED FOR {userProfile.goals.map((g) => g.replace('_', ' ')).join(' + ').toUpperCase()}
          </div>
        </div>

        {/* Consumed Today vs Target Bento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Consumed Energy */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-semibold tracking-wider flex items-center justify-between">
              <span>CONSUMED TODAY</span>
              <span className="text-[10px] font-system text-cyan-400">{calProgress}%</span>
            </span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-system font-extrabold text-cyan-300 glow-text-cyan">
                {consumedCalories}
              </span>
              <span className="text-xs text-slate-400 ml-1 font-system">
                / {userProfile.targetCalories} kcal
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-cyan-400 rounded-full transition-all duration-300"
                style={{ width: `${calProgress}%` }}
              />
            </div>
          </div>

          {/* Caloric Goal Target */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex flex-col justify-between">
            <span className="text-xs text-cyan-300 font-system font-bold tracking-wider flex items-center justify-between">
              <span>DAILY TARGET GOAL</span>
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            </span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-system font-extrabold text-white">
                {userProfile.targetCalories}
              </span>
              <span className="text-xs text-cyan-300 ml-1 font-system">kcal</span>
            </div>
            <span className="text-[11px] text-slate-400">
              {userProfile.targetCalories > userProfile.maintenanceCalories
                ? `Surplus: +${userProfile.targetCalories - userProfile.maintenanceCalories} kcal (Hypertrophy)`
                : userProfile.targetCalories < userProfile.maintenanceCalories
                ? `Deficit: -${userProfile.maintenanceCalories - userProfile.targetCalories} kcal (Fat Loss)`
                : 'Balanced Energy Maintenance'}
            </span>
          </div>

          {/* Maintenance TDEE */}
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
            <span className="text-xs text-slate-400 font-semibold tracking-wider">
              ESTIMATED TDEE
            </span>
            <div className="my-2">
              <span className="text-2xl sm:text-3xl font-system font-extrabold text-white">
                {userProfile.maintenanceCalories}
              </span>
              <span className="text-xs text-slate-400 ml-1 font-system">kcal/day</span>
            </div>
            <span className="text-[11px] text-slate-400">
              BMR ({Math.round(userProfile.weightKg * 22)}) + Activity Multiplier
            </span>
          </div>
        </div>

        {/* Dynamic Macronutrient Tracking (Consumed vs Target) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-xs font-system">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>MACRONUTRIENT BALANCE (CONSUMED / TARGET)</span>
            </span>
            <span className="text-slate-400">
              Remaining: {Math.max(0, userProfile.targetCalories - consumedCalories)} kcal
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Protein Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/40">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-system font-bold text-emerald-400">PROTEIN</span>
                <span className="text-[11px] text-slate-400">{proteinProgress}%</span>
              </div>
              <div className="text-xl font-system font-extrabold text-white mb-2">
                {consumedProtein}g{' '}
                <span className="text-xs text-slate-400 font-normal">/ {userProfile.proteinGrams}g</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-2">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${proteinProgress}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 block">
                Target: {userProfile.proteinGrams}g (~{proteinPct}% of total cals)
              </span>
            </div>

            {/* Carbs Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-sky-500/40">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-system font-bold text-sky-400">CARBOHYDRATES</span>
                <span className="text-[11px] text-slate-400">{carbsProgress}%</span>
              </div>
              <div className="text-xl font-system font-extrabold text-white mb-2">
                {consumedCarbs}g{' '}
                <span className="text-xs text-slate-400 font-normal">/ {userProfile.carbsGrams}g</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-2">
                <div
                  className="h-full bg-sky-500 rounded-full transition-all duration-300"
                  style={{ width: `${carbsProgress}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 block">
                Target: {userProfile.carbsGrams}g (~{carbsPct}% of total cals)
              </span>
            </div>

            {/* Fats Card */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/40">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-system font-bold text-amber-400">FATS</span>
                <span className="text-[11px] text-slate-400">{fatsProgress}%</span>
              </div>
              <div className="text-xl font-system font-extrabold text-white mb-2">
                {consumedFats}g{' '}
                <span className="text-xs text-slate-400 font-normal">/ {userProfile.fatsGrams}g</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-2">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${fatsProgress}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-400 block">
                Target: {userProfile.fatsGrams}g (~{fatsPct}% of total cals)
              </span>
            </div>
          </div>
        </div>

        {/* Logged Meals List for Today */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-system font-bold text-white">
              <Utensils className="w-4 h-4 text-cyan-400" />
              <span>TODAY'S LOGGED BATTLE MEALS ({meals.length})</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Total: {consumedCalories} kcal logged
            </span>
          </div>

          {meals.length === 0 ? (
            <div className="py-6 text-center text-slate-500 text-xs">
              No meals logged today yet. Use the scanner above to add your food via photo or description!
            </div>
          ) : (
            <div className="space-y-2.5">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {meal.photoUrl ? (
                      <img
                        src={meal.photoUrl}
                        alt={meal.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-lg object-cover border border-cyan-500/40 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-cyan-950/60 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                        <Utensils className="w-5 h-5" />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-system font-bold bg-cyan-500/20 text-cyan-300 uppercase">
                          {meal.mealType.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {meal.timestamp}
                        </span>
                        {meal.hunterRank && (
                          <span className="text-[10px] text-emerald-400 font-system font-semibold">
                            [{meal.hunterRank}]
                          </span>
                        )}
                      </div>
                      <h4 className="font-system font-bold text-sm text-white mt-0.5">
                        {meal.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {meal.description !== meal.name ? meal.description : ''}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 self-end sm:self-center">
                    <div className="text-right">
                      <span className="text-base font-system font-extrabold text-cyan-300 block">
                        {meal.calories} kcal
                      </span>
                      <span className="text-[10px] text-slate-400 block font-system">
                        P: {meal.proteinGrams}g | C: {meal.carbsGrams}g | F: {meal.fatsGrams}g
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteMeal(meal.id)}
                      className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-rose-500/50 transition"
                      title="Delete meal entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hydration Tracker */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Droplet className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="font-system text-sm font-bold text-white">HYDRATION PROTOCOL</h3>
                <span className="text-[11px] text-slate-400">
                  Target: {userProfile.waterTargetLiters} Liters/Day ({targetWaterMl} ml)
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xl font-system font-black text-cyan-300 glow-text-cyan">
                {waterIntakeMl}
              </span>
              <span className="text-xs text-slate-400 ml-1 font-system">/ {targetWaterMl} ml</span>
            </div>
          </div>

          <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${waterProgress}%` }}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleWaterAdd(250)}
                className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 hover:bg-cyan-900/80 text-cyan-300 text-xs font-system font-bold transition active:scale-95 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+250 ml (Glass)</span>
              </button>

              <button
                type="button"
                onClick={() => handleWaterAdd(500)}
                className="px-3 py-1.5 rounded-xl bg-blue-950/60 border border-blue-500/40 hover:bg-blue-900/80 text-blue-300 text-xs font-system font-bold transition active:scale-95 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+500 ml (Bottle)</span>
              </button>

              <button
                type="button"
                onClick={() => handleWaterAdd(-250)}
                disabled={waterIntakeMl <= 0}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
                title="Subtract 250ml"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              onClick={onResetWater}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline"
            >
              Reset Water Log
            </button>
          </div>
        </div>

        {/* MICRONUTRIENT TOTALS & ESSENTIALS CHECKLIST */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-system font-bold text-cyan-300">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>MICRONUTRIENTS ACCUMULATED TODAY & SYSTEM TARGETS</span>
            </div>
            <span className="text-[11px] text-slate-400 font-normal">
              Based on logged foods
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-white">🌾 Dietary Fiber</span>
                <span className="text-cyan-300 font-system font-bold">{consumedFiber}g / 35g</span>
              </div>
              <span className="text-slate-400 text-[11px] block">
                Slow gastric emptying, steady blood sugar, and gut microbiome optimization.
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-white">⚡ Sodium (Na)</span>
                <span className="text-cyan-300 font-system font-bold">{consumedSodium}mg / 2300mg</span>
              </div>
              <span className="text-slate-400 text-[11px] block">
                Maintains cellular hydration and action potentials during high-rep sets.
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-white">⚡ Potassium (K)</span>
                <span className="text-cyan-300 font-system font-bold">{consumedPotassium}mg / 3500mg</span>
              </div>
              <span className="text-slate-400 text-[11px] block">
                Counterbalances sodium, supports cardiovascular rhythm and muscle contraction.
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-white">💊 Magnesium (Mg)</span>
                <span className="text-cyan-300 font-system font-bold">{consumedMagnesium}mg / 420mg</span>
              </div>
              <span className="text-slate-400 text-[11px] block">
                Critical for muscle relaxation, ATP synthesis, and deep restorative sleep.
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-white">☀️ Vitamin D</span>
                <span className="text-cyan-300 font-system font-bold">{consumedVitaminD} IU / 2000 IU</span>
              </div>
              <span className="text-slate-400 text-[11px] block">
                Immune defense, testosterone support, and bone mineralization under heavy load.
              </span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <div className="flex justify-between items-center mb-0.5">
                <span className="font-bold text-white">🥛 Calcium & Iron</span>
                <span className="text-cyan-300 font-system font-bold">
                  {consumedCalcium}mg Ca / {consumedIron}mg Fe
                </span>
              </div>
              <span className="text-slate-400 text-[11px] block">
                Oxygen transport through hemoglobin and actin-myosin skeletal strength.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
