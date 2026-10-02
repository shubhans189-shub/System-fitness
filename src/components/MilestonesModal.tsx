import React, { useState } from 'react';
import { DailyLog, DailyQuestState, HunterStats, UserProfile } from '../types';
import { AWAKENING_MILESTONES, AwakeningMilestone } from '../utils/awakeningMilestones';
import { Award, CheckCircle2, Lock, Sparkles, X, Dumbbell, Flame, Shield, Footprints, Zap, Crown, Utensils, Droplet, TrendingUp } from 'lucide-react';
import { playLevelUpSound, playRepCountSound } from '../utils/soundEffects';
import confetti from 'canvas-confetti';

interface MilestonesModalProps {
  userProfile: UserProfile;
  stats: HunterStats;
  questState: DailyQuestState;
  dailyLogs: DailyLog[];
  mealsCount: number;
  totalWaterLogged: number;
  onEquipTitle: (title: string) => void;
  onClose: () => void;
}

export const MilestonesModal: React.FC<MilestonesModalProps> = ({
  userProfile,
  stats,
  questState,
  dailyLogs,
  mealsCount,
  totalWaterLogged,
  onEquipTitle,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'workout' | 'streak' | 'nutrition' | 'level'>('all');

  // Compute actual cumulative metrics
  const totalPushups =
    dailyLogs.reduce((acc, log) => acc + (log.pushups || 0), 0) +
    (questState.items.find((i) => i.id === 'pushups')?.current || 0);

  const totalSitups =
    dailyLogs.reduce((acc, log) => acc + (log.situps || 0), 0) +
    (questState.items.find((i) => i.id === 'situps')?.current || 0);

  const totalSquats =
    dailyLogs.reduce((acc, log) => acc + (log.squats || 0), 0) +
    (questState.items.find((i) => i.id === 'squats')?.current || 0);

  const totalRunKm =
    dailyLogs.reduce((acc, log) => acc + (log.runningKm || 0), 0) +
    (questState.items.find((i) => i.id === 'running')?.current || 0);

  const maxSingleExercise = Math.max(
    ...questState.items.map((i) => i.current),
    ...dailyLogs.map((l) => Math.max(l.pushups, l.situps, l.squats))
  );

  // Helper to determine progress for any milestone
  const getMilestoneProgress = (m: AwakeningMilestone): { current: number; isCompleted: boolean; percent: number } => {
    let current = 0;
    switch (m.id) {
      case 'marathon_hunter':
        current = Number(totalRunKm.toFixed(1));
        break;
      case 'iron_chest':
        current = totalPushups;
        break;
      case 'core_sentinel':
        current = totalSitups;
        break;
      case 'colossus_pillars':
        current = totalSquats;
        break;
      case 'centurion_burst':
        current = maxSingleExercise;
        break;
      case 'unbroken_will':
      case 'monarchs_resolve':
        current = stats.dailyStreak;
        break;
      case 'grand_alchemist':
        current = mealsCount;
        break;
      case 'hydration_sovereign':
        current = totalWaterLogged;
        break;
      case 'shadow_ascendant':
      case 'shadow_monarch_title':
        current = stats.level;
        break;
      default:
        current = 0;
    }

    const isCompleted = current >= m.requirement;
    const percent = Math.min(100, Math.round((current / Math.max(1, m.requirement)) * 100));
    return { current, isCompleted, percent };
  };

  const getMilestoneIcon = (name: string, completed: boolean) => {
    const props = { className: `w-5 h-5 ${completed ? 'text-amber-400' : 'text-slate-500'}` };
    switch (name) {
      case 'Footprints':
        return <Footprints {...props} />;
      case 'Dumbbell':
        return <Dumbbell {...props} />;
      case 'Shield':
        return <Shield {...props} />;
      case 'Flame':
        return <Flame {...props} />;
      case 'Zap':
        return <Zap {...props} />;
      case 'Sparkles':
        return <Sparkles {...props} />;
      case 'Crown':
        return <Crown {...props} />;
      case 'Utensils':
        return <Utensils {...props} />;
      case 'Droplet':
        return <Droplet {...props} />;
      case 'TrendingUp':
        return <TrendingUp {...props} />;
      default:
        return <Award {...props} />;
    }
  };

  const filteredMilestones = AWAKENING_MILESTONES.filter((m) =>
    activeTab === 'all' ? true : m.category === activeTab
  );

  const completedCount = AWAKENING_MILESTONES.filter((m) => getMilestoneProgress(m).isCompleted).length;

  const handleEquip = (title: string) => {
    playLevelUpSound(userProfile.soundEnabled);
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#fbbf24', '#00e5ff', '#a855f7'],
      });
    } catch (e) {}
    onEquipTitle(title);
  };

  const activeTitle = stats.equippedTitle || stats.title;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-3xl max-h-[90vh] rounded-2xl system-window p-4 sm:p-6 text-slate-100 border border-cyan-500/50 shadow-[0_0_50px_rgba(0,229,255,0.25)] flex flex-col justify-between my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-system font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                <span>[ HUNTER ARCHIVE: TITLES & ACHIEVEMENTS ]</span>
              </div>
              <h2 className="font-system text-base sm:text-lg font-bold text-white tracking-wide">
                AWAKENING MILESTONES & TITLES
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block px-3 py-1 rounded-lg bg-amber-950/60 border border-amber-500/50 text-amber-300 text-xs font-system font-bold">
              Unlocked: {completedCount} / {AWAKENING_MILESTONES.length}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Equipped Title Display */}
        <div className="mb-3 p-3 rounded-xl bg-gradient-to-r from-amber-950/40 via-purple-950/40 to-cyan-950/40 border border-amber-500/40 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-slate-300 font-system">CURRENTLY EQUIPPED TITLE:</span>
            <span className="font-system font-extrabold text-amber-300 text-sm tracking-wide">
              "{activeTitle}"
            </span>
          </div>
          <span className="text-[11px] text-slate-400">
            Equipped titles provide status distinction in hunter cards & AI coach dialogue.
          </span>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-800 pb-2 mb-3 shrink-0">
          {[
            { key: 'all', label: 'All Milestones' },
            { key: 'workout', label: 'Workouts & Reps' },
            { key: 'streak', label: 'Daily Streaks' },
            { key: 'nutrition', label: 'Nutrition & Water' },
            { key: 'level', label: 'Hunter Ascension' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key as any);
                playRepCountSound(userProfile.soundEnabled);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-system font-bold transition ${
                activeTab === tab.key
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                  : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Scrollable List of Milestones */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 my-1">
          {filteredMilestones.map((m) => {
            const { current, isCompleted, percent } = getMilestoneProgress(m);
            const isEquipped = activeTitle === m.title;

            return (
              <div
                key={m.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  isCompleted
                    ? 'bg-slate-900/90 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                    : 'bg-slate-950/60 border-slate-800/80 opacity-80'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isCompleted
                          ? 'bg-amber-500/20 border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                          : 'bg-slate-900 border-slate-800 text-slate-600'
                      }`}
                    >
                      {getMilestoneIcon(m.iconName, isCompleted)}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-system font-bold text-sm sm:text-base text-white tracking-wide">
                          {m.title}
                        </h3>
                        <span className="text-[10px] font-system font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          {m.codename}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 mt-0.5">
                        {m.description}
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] text-amber-400 font-system font-bold">
                          Stat Reward: +{m.statBonus.amount} {m.statBonus.stat.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-slate-500 italic hidden sm:inline">
                          {m.quote}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Equip Button / Status Badge */}
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      isEquipped ? (
                        <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/60 text-amber-300 text-xs font-system font-black flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>EQUIPPED</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleEquip(m.title)}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-system font-black transition active:scale-95 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
                        >
                          EQUIP TITLE
                        </button>
                      )
                    ) : (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-500 text-xs font-system">
                        <Lock className="w-3.5 h-3.5" />
                        <span>LOCKED</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between items-center text-[11px] font-system text-slate-400 mb-1">
                    <span>PROGRESSION</span>
                    <span className="font-bold text-slate-200">
                      {current} / {m.requirement} {m.unit} ({percent}%)
                    </span>
                  </div>

                  <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-[width] duration-300 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                          : 'bg-cyan-500'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-system text-xs font-bold transition"
          >
            Close Archive
          </button>
        </div>
      </div>
    </div>
  );
};
