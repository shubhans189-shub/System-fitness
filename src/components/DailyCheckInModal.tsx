import React, { useState } from 'react';
import { DailyCheckIn, HunterMood, HunterStats, SleepQuality, UserProfile } from '../types';
import { Moon, Sun, Sparkles, X, Heart, Shield, Activity, Zap, CheckCircle2, Flame, AlertCircle } from 'lucide-react';
import { playQuestCompleteSound, playRepCountSound } from '../utils/soundEffects';

interface DailyCheckInModalProps {
  userProfile: UserProfile;
  stats: HunterStats;
  currentCheckIn?: DailyCheckIn | null;
  onSaveCheckIn: (checkIn: DailyCheckIn) => void;
  onClose: () => void;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  userProfile,
  stats,
  currentCheckIn,
  onSaveCheckIn,
  onClose,
}) => {
  const [sleepHours, setSleepHours] = useState<number>(currentCheckIn?.sleepHours ?? 7.5);
  const [sleepQuality, setSleepQuality] = useState<SleepQuality>(currentCheckIn?.sleepQuality ?? 'good');
  const [mood, setMood] = useState<HunterMood>(currentCheckIn?.mood ?? 'focused');
  const [notes, setNotes] = useState<string>(currentCheckIn?.notes ?? '');

  // Calculate dynamic buffs based on sleep & mood
  const calculateModifiers = () => {
    let fatigueMod = 0;
    let staminaBuff = 0;
    let systemTip = '';

    // Sleep quality calculation
    if (sleepQuality === 'optimal') {
      fatigueMod -= 20;
      staminaBuff += 12;
      systemTip = 'Cellular ATP regeneration maximized. High nervous system recovery detected.';
    } else if (sleepQuality === 'good') {
      fatigueMod -= 10;
      staminaBuff += 6;
      systemTip = 'Optimal restorative sleep cycle complete. You are primed for full quest volume.';
    } else if (sleepQuality === 'fair') {
      fatigueMod -= 5;
      staminaBuff += 0;
      systemTip = 'Moderate recovery. Ensure aggressive water intake and pre-workout warm-up.';
    } else if (sleepQuality === 'poor') {
      fatigueMod += 10;
      staminaBuff -= 5;
      systemTip = 'Elevated cortisol and reduced muscle glycogen recovery. Space out rep intervals today.';
    } else {
      fatigueMod += 20;
      staminaBuff -= 10;
      systemTip = 'Severe recovery deficit! Prioritize light joint warm-ups, electrolytes, and short rest sets.';
    }

    // Mood adjustment
    if (mood === 'bloodlusted' || mood === 'focused') {
      staminaBuff += 5;
    } else if (mood === 'exhausted') {
      fatigueMod += 5;
    }

    return { fatigueMod, staminaBuff, systemTip };
  };

  const { fatigueMod, staminaBuff, systemTip } = calculateModifiers();

  const handleSave = () => {
    playQuestCompleteSound(userProfile.soundEnabled);
    const todayStr = new Date().toISOString().split('T')[0];
    const newCheckIn: DailyCheckIn = {
      date: todayStr,
      sleepHours,
      sleepQuality,
      mood,
      notes: notes.trim(),
      fatigueModifier: fatigueMod,
      staminaBuffPercent: staminaBuff,
      completedAt: new Date().toISOString(),
      systemTip,
    };
    onSaveCheckIn(newCheckIn);
    onClose();
  };

  const sleepOptions: { quality: SleepQuality; label: string; desc: string; icon: string }[] = [
    { quality: 'optimal', label: 'Optimal / Deep Rest', desc: '8-9h uninterrupted, woke up revitalized', icon: '⚡' },
    { quality: 'good', label: 'Good / Restful', desc: '7-8h restful sleep, ready for combat', icon: '✨' },
    { quality: 'fair', label: 'Fair / Normal', desc: '6-7h moderate sleep, slight grogginess', icon: '🌤️' },
    { quality: 'poor', label: 'Poor / Restless', desc: '5h or fragmented light sleep', icon: '🥱' },
    { quality: 'terrible', label: 'Exhausted / Insomnia', desc: '<5h broken sleep, heavy fatigue', icon: '💀' },
  ];

  const moodOptions: { mood: HunterMood; label: string; desc: string; color: string }[] = [
    { mood: 'bloodlusted', label: 'Bloodlusted / Unstoppable', desc: 'Ready to conquer any dungeon gate', color: 'text-amber-300 border-amber-500/50 bg-amber-950/40' },
    { mood: 'focused', label: 'Focused & Energized', desc: 'Sharp mental clarity and locked in', color: 'text-cyan-300 border-cyan-500/50 bg-cyan-950/40' },
    { mood: 'steady', label: 'Steady & Disciplined', desc: 'Calm hunter focus on daily consistency', color: 'text-blue-300 border-blue-500/50 bg-blue-950/40' },
    { mood: 'fatigued', label: 'Muscle Soreness / Tired', desc: 'Muscles tight from previous training', color: 'text-orange-300 border-orange-500/50 bg-orange-950/40' },
    { mood: 'exhausted', label: 'Drained / Low Energy', desc: 'Need pacing and strategic hydration', color: 'text-rose-400 border-rose-500/50 bg-rose-950/40' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="w-full max-w-xl rounded-2xl system-window p-4 sm:p-6 text-slate-100 border border-cyan-500/50 shadow-[0_0_50px_rgba(0,229,255,0.25)] space-y-4 my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.4)]">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-system font-extrabold text-cyan-400 uppercase tracking-widest">
                [ DAILY AWAKENING PROTOCOL ]
              </div>
              <h2 className="font-system text-base sm:text-lg font-bold text-white tracking-wide">
                DAILY SLEEP & MOOD CHECK-IN
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative System Subtitle */}
        <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
          <Activity className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            Recording your daily physiological state allows The System to dynamically adjust fatigue recovery rates, stamina buffs, and tactical workout advice for Player <strong>{userProfile.name}</strong>.
          </p>
        </div>

        {/* 1. Sleep Duration Slider */}
        <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
          <div className="flex justify-between items-center text-xs font-system">
            <span className="text-slate-300 font-bold flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5 text-cyan-400" />
              <span>SLEEP DURATION:</span>
            </span>
            <span className="text-cyan-300 font-extrabold text-sm px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40">
              {sleepHours} Hours
            </span>
          </div>

          <input
            type="range"
            min={4}
            max={12}
            step={0.5}
            value={sleepHours}
            onChange={(e) => setSleepHours(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-system">
            <span>4h (Severe)</span>
            <span>7-8h (Target)</span>
            <span>12h (Deep hibernation)</span>
          </div>
        </div>

        {/* 2. Sleep Quality Options */}
        <div className="space-y-1.5">
          <label className="text-xs font-system font-bold text-slate-300 block">
            HOW WAS YOUR SLEEP QUALITY?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sleepOptions.map((opt) => (
              <button
                key={opt.quality}
                type="button"
                onClick={() => {
                  setSleepQuality(opt.quality);
                  playRepCountSound(userProfile.soundEnabled);
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition flex items-start gap-2.5 ${
                  sleepQuality === opt.quality
                    ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-[0_0_12px_rgba(0,229,255,0.2)]'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="text-lg shrink-0">{opt.icon}</span>
                <div>
                  <div className="font-bold text-slate-200">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. Mood / Battle State */}
        <div className="space-y-1.5">
          <label className="text-xs font-system font-bold text-slate-300 block">
            CURRENT HUNTER MINDSET & SORENESS
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {moodOptions.map((opt) => (
              <button
                key={opt.mood}
                type="button"
                onClick={() => {
                  setMood(opt.mood);
                  playRepCountSound(userProfile.soundEnabled);
                }}
                className={`p-2.5 rounded-xl border text-left text-xs transition flex items-start gap-2 ${
                  mood === opt.mood
                    ? `${opt.color} font-bold shadow-[0_0_12px_rgba(0,229,255,0.2)]`
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-200">{opt.label}</div>
                  <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{opt.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic System Buff / Modifier Summary */}
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-cyan-950/70 via-blue-950/80 to-purple-950/70 border border-cyan-400/50 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-system font-bold">
            <span className="text-cyan-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>SYSTEM DAILY RECOVERY BUFF</span>
            </span>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[11px] ${fatigueMod <= 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' : 'bg-rose-950 text-rose-300 border border-rose-500/50'}`}>
                Fatigue: {fatigueMod <= 0 ? `${fatigueMod}%` : `+${fatigueMod}%`}
              </span>
              <span className={`px-2 py-0.5 rounded text-[11px] ${staminaBuff >= 0 ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/50' : 'bg-rose-950 text-rose-300 border border-rose-500/50'}`}>
                Stamina: {staminaBuff >= 0 ? `+${staminaBuff}%` : `${staminaBuff}%`}
              </span>
            </div>
          </div>
          <p className="text-[11px] text-slate-300 italic font-mono">
            {systemTip}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-system transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-system font-extrabold text-xs transition shadow-[0_0_15px_rgba(0,229,255,0.4)] active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>CONFIRM & APPLY BUFF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
