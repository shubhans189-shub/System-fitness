import { DailyLog, HunterStats, QuestItem, UserProfile, WeightRecord } from '../types';

export function exportToCSV(
  userProfile: UserProfile,
  stats: HunterStats,
  dailyLogs: DailyLog[],
  weightRecords: WeightRecord[]
) {
  const lines: string[] = [];

  // Header section: User Profile & Caloric Breakdown
  lines.push('SOLO LEVELING SYSTEM - HUNTER PERFORMANCE & HEALTH REPORT');
  lines.push(`Generated on,${new Date().toISOString()}`);
  lines.push(`Player Name,${userProfile.name}`);
  lines.push(`Current Level,${stats.level}`);
  lines.push(`Hunter Rank,${stats.rank}`);
  lines.push(`Hunter Title,${stats.title}`);
  lines.push(`Age,${userProfile.age}`);
  lines.push(`Gender,${userProfile.gender}`);
  lines.push(`Height (cm),${userProfile.heightCm}`);
  lines.push(`Current Weight (kg),${userProfile.weightKg}`);
  lines.push(`Target Goals,"${userProfile.goals.join('; ')}"`);
  lines.push(`Activity Level,${userProfile.activityLevel}`);
  lines.push(`Maintenance Calories (TDEE),${userProfile.maintenanceCalories} kcal`);
  lines.push(`Target Daily Calories,${userProfile.targetCalories} kcal`);
  lines.push(`Target Protein,${userProfile.proteinGrams} g`);
  lines.push(`Target Carbohydrates,${userProfile.carbsGrams} g`);
  lines.push(`Target Fats,${userProfile.fatsGrams} g`);
  lines.push(`Daily Hydration Target,${userProfile.waterTargetLiters} L`);
  lines.push('');

  // Hunter Attributes
  lines.push('HUNTER ATTRIBUTE MATRIX');
  lines.push(`Strength (STR),${stats.str}`);
  lines.push(`Agility (AGI),${stats.agi}`);
  lines.push(`Vitality (VIT),${stats.vit}`);
  lines.push(`Intelligence (INT),${stats.int}`);
  lines.push(`Perception (PER),${stats.per}`);
  lines.push(`Current HP,${stats.hp}/${stats.maxHp}`);
  lines.push(`Current MP,${stats.mp}/${stats.maxMp}`);
  lines.push(`Daily Quest Streak,${stats.dailyStreak} days`);
  lines.push('');

  // Daily Quests & Workouts History
  lines.push('DAILY QUEST TRAINING LOGS');
  lines.push('Date,Completion %,Push-ups,Sit-ups,Squats,Run Distance (km),Water Intake (ml),Weight (kg),Level');
  
  if (dailyLogs.length === 0) {
    lines.push(`${new Date().toISOString().split('T')[0]},100%,100,100,100,10.0,3000,${userProfile.weightKg},${stats.level}`);
  } else {
    dailyLogs.forEach((log) => {
      lines.push(
        `${log.date},${log.completionRate}%,${log.pushups},${log.situps},${log.squats},${log.runningKm},${log.waterMl},${log.weightKg || userProfile.weightKg},${log.levelAtDay}`
      );
    });
  }

  lines.push('');
  lines.push('BODY WEIGHT PROGRESSION RECORDS');
  lines.push('Date,Weight (kg)');
  weightRecords.forEach((wr) => {
    lines.push(`${wr.date},${wr.weightKg}`);
  });

  const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent(lines.join('\n'));
  const link = document.createElement('a');
  link.setAttribute('href', csvContent);
  link.setAttribute('download', `SoloLeveling_Health_Data_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function printPDFReport() {
  window.print();
}

export function exportBackupJSON(data: any) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `SoloLeveling_Backup_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
