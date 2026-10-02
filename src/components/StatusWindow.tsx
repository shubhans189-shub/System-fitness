import React from 'react';
import { DailyCheckIn, HunterStats, UserProfile } from '../types';
import { Plus, Shield, Zap, Flame, Eye, Brain, Award, Sparkles, Crown, Moon, Activity } from 'lucide-react';
import { playStatAllocateSound } from '../utils/soundEffects';
import { getRankTheme } from '../utils/rankTheme';

interface StatusWindowProps {
  userProfile: UserProfile;
  stats: HunterStats;
  dailyCheckIn?: DailyCheckIn | null;
  onAllocateStat: (stat: 'str' | 'agi' | 'vit' | 'int' | 'per') => void;
  onOpenCheckIn: () => void;
  onOpenMilestones: () => void;
}

export const StatusWindow: React.FC<StatusWindowProps> = ({
  userProfile,
  stats,
  dailyCheckIn,
  onAllocateStat,
  onOpenCheckIn,
  onOpenMilestones,
}) => {
  const theme = getRankTheme(stats.rank);
  const activeTitle = stats.equippedTitle || stats.title;

  const handleAdd = (stat: 'str' | 'agi' | 'vit' | 'int' | 'per') => {
    playStatAllocateSound(userProfile.soundEnabled);
    onAllocateStat(stat);
  };

  // BMI Calculation
  const heightM = userProfile.heightCm / 100;
  const bmi = (userProfile.weightKg / (heightM * heightM)).toFixed(1);

  return (
    <div className={`w-full rounded-2xl system-window p-5 sm:p-6 text-slate-100 ${theme.borderClass} ${theme.bgGlowClass} relative overflow-hidden transition-all duration-300`}>
      {/* Background Hologram Lines */}
      <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-10">
        <div className="text-8xl font-black font-system" style={{ color: theme.primaryColor }}>
          STATUS
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/30 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full animate-pulse"
            style={{ backgroundColor: theme.primaryColor, boxShadow: `0 0 10px ${theme.primaryColor}` }}
          />
          <h2 className="font-system text-lg sm:text-xl font-bold tracking-wider text-white uppercase">
            STATUS WINDOW
          </h2>
          <span className={`text-[10px] font-system font-black px-2 py-0.5 rounded border uppercase ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}>
            {stats.rank} AURA
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-system">
          <button
            onClick={onOpenMilestones}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-bold transition shadow-[0_0_10px_rgba(245,158,11,0.2)]"
            title="View Milestones & Titles"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Awakening Titles</span>
          </button>
          <span className="px-2 py-1 rounded bg-amber-950/60 border border-amber-500/50 text-amber-300 font-bold">
            🔥 {stats.dailyStreak} DAYS
          </span>
        </div>
      </div>

      {/* Equipped Title & Daily Check-In Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
        {/* Title Bar */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <span className="text-[10px] font-system text-slate-400 uppercase block">EQUIPPED TITLE</span>
              <span className="font-system font-extrabold text-amber-300 text-xs sm:text-sm tracking-wide">
                "{activeTitle}"
              </span>
            </div>
          </div>
          <button
            onClick={onOpenMilestones}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[10px] font-system font-bold transition"
          >
            Change
          </button>
        </div>

        {/* Daily Sleep & Mood Check-In Bar */}
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-cyan-500/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Moon className="w-4 h-4 text-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] font-system text-slate-400 uppercase block">DAILY RECOVERY CHECK-IN</span>
              {dailyCheckIn ? (
                <div className="flex items-center gap-1.5 text-xs text-slate-200">
                  <span className="font-bold text-cyan-300">{dailyCheckIn.sleepHours}h sleep</span>
                  <span className="text-[10px] text-slate-400">({dailyCheckIn.mood})</span>
                  <span className="text-[10px] text-emerald-400 font-bold">+{dailyCheckIn.staminaBuffPercent}% Stamina</span>
                </div>
              ) : (
                <span className="text-xs text-rose-300 font-semibold animate-pulse">
                  Not recorded today — Tap to record!
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onOpenCheckIn}
            className="px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/50 text-cyan-300 text-[10px] font-system font-bold transition"
          >
            {dailyCheckIn ? 'Update' : 'Record'}
          </button>
        </div>
      </div>

      {/* Player Bio Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5 text-xs bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
        <div>
          <span className="text-slate-500 block">NAME</span>
          <span className="font-bold text-white text-sm">{userProfile.name}</span>
        </div>
        <div>
          <span className="text-slate-500 block">LEVEL / RANK</span>
          <span className={`font-bold font-system text-sm ${theme.textClass}`}>
            Lv.{stats.level} ({stats.rank})
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">FATIGUE</span>
          <span className={`font-bold font-system text-sm ${stats.fatigue > 60 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {stats.fatigue}% {stats.fatigue > 60 ? '(High)' : '(Resting)'}
          </span>
        </div>
        <div>
          <span className="text-slate-500 block">BMI & BODY WEIGHT</span>
          <span className="font-bold text-slate-200 text-sm">
            {userProfile.weightKg}kg <span className="text-slate-500 text-xs">({bmi} BMI)</span>
          </span>
        </div>
      </div>

      {/* Available Stat Points Alert */}
      {stats.availablePoints > 0 && (
        <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-cyan-950/70 via-blue-950/80 to-purple-950/70 border border-cyan-400/60 flex items-center justify-between animate-pulse shadow-[0_0_15px_rgba(0,229,255,0.25)]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-300 animate-spin" />
            <div>
              <span className="font-system font-bold text-cyan-200 text-xs sm:text-sm">
                UNALLOCATED STAT POINTS AVAILABLE!
              </span>
              <p className="text-[11px] text-slate-300">
                You have {stats.availablePoints} points. Distribute them below to enhance your attributes.
              </p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-lg bg-cyan-400 text-slate-950 font-system font-extrabold text-sm shadow-[0_0_10px_rgba(0,229,255,0.6)]">
            +{stats.availablePoints}
          </div>
        </div>
      )}

      {/* Core Attributes Table */}
      <div className="space-y-2.5">
        {/* STR */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="font-system font-bold text-xs sm:text-sm text-slate-200">
                STRENGTH <span className="text-slate-500 font-normal text-xs">[STR]</span>
              </div>
              <div className="text-[10px] text-slate-400">Upper body push power, squat volume, explosive force</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-system font-extrabold text-base sm:text-lg text-white w-8 text-right">
              {stats.str}
            </span>
            {stats.availablePoints > 0 && (
              <button
                onClick={() => handleAdd('str')}
                className="w-7 h-7 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/60 text-cyan-300 flex items-center justify-center font-bold text-sm transition active:scale-90"
                title="Increase Strength"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* AGI */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="font-system font-bold text-xs sm:text-sm text-slate-200">
                AGILITY <span className="text-slate-500 font-normal text-xs">[AGI]</span>
              </div>
              <div className="text-[10px] text-slate-400">Running pace, aerobic recovery, stamina threshold</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-system font-extrabold text-base sm:text-lg text-white w-8 text-right">
              {stats.agi}
            </span>
            {stats.availablePoints > 0 && (
              <button
                onClick={() => handleAdd('agi')}
                className="w-7 h-7 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/60 text-cyan-300 flex items-center justify-center font-bold text-sm transition active:scale-90"
                title="Increase Agility"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* VIT */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-system font-bold text-xs sm:text-sm text-slate-200">
                VITALITY <span className="text-slate-500 font-normal text-xs">[VIT]</span>
              </div>
              <div className="text-[10px] text-slate-400">Max HP, core endurance, situps & metabolic resilience</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-system font-extrabold text-base sm:text-lg text-white w-8 text-right">
              {stats.vit}
            </span>
            {stats.availablePoints > 0 && (
              <button
                onClick={() => handleAdd('vit')}
                className="w-7 h-7 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/60 text-cyan-300 flex items-center justify-center font-bold text-sm transition active:scale-90"
                title="Increase Vitality"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* INT */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <div className="font-system font-bold text-xs sm:text-sm text-slate-200">
                INTELLIGENCE <span className="text-slate-500 font-normal text-xs">[INT]</span>
              </div>
              <div className="text-[10px] text-slate-400">Mana capacity, mental discipline, habit adherence</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-system font-extrabold text-base sm:text-lg text-white w-8 text-right">
              {stats.int}
            </span>
            {stats.availablePoints > 0 && (
              <button
                onClick={() => handleAdd('int')}
                className="w-7 h-7 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/60 text-cyan-300 flex items-center justify-center font-bold text-sm transition active:scale-90"
                title="Increase Intelligence"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* PER */}
        <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/30 transition">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <div className="font-system font-bold text-xs sm:text-sm text-slate-200">
                PERCEPTION <span className="text-slate-500 font-normal text-xs">[PER]</span>
              </div>
              <div className="text-[10px] text-slate-400">Kinesthetic awareness, exercise form precision, fatigue sensing</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-system font-extrabold text-base sm:text-lg text-white w-8 text-right">
              {stats.per}
            </span>
            {stats.availablePoints > 0 && (
              <button
                onClick={() => handleAdd('per')}
                className="w-7 h-7 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/40 border border-cyan-400/60 text-cyan-300 flex items-center justify-center font-bold text-sm transition active:scale-90"
                title="Increase Perception"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Blessings & System Buffs */}
      <div className="mt-4 pt-3 border-t border-cyan-500/20">
        <div className="text-[11px] font-system font-bold text-cyan-400 mb-2 flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5" />
          <span>ACTIVE BLESSINGS & SYSTEM BUFFS</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-950/80 p-2 rounded-lg border border-purple-500/30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span className="text-slate-300 truncate">
              <strong>Great Sorcerer's Blessing:</strong> Full recovery upon restful sleep
            </span>
          </div>
          <div className="bg-slate-950/80 p-2 rounded-lg border border-cyan-500/30 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            <span className="text-slate-300 truncate">
              <strong>Daily Quest Protocol:</strong> Permanent stat point award upon daily quest completion
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
