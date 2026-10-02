import React, { useState, useEffect } from 'react';
import { DailyQuestState, HunterRank, QuestItem, UserProfile } from '../types';
import jinwooTrainingImg from '../assets/images/jinwoo_training_1789901665458.jpg';
import {
  playQuestCompleteSound,
  playRepCountSound,
  playPenaltyAlertSound,
} from '../utils/soundEffects';
import confetti from 'canvas-confetti';
import {
  Flame,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Play,
  RotateCcw,
  Plus,
  Minus,
  Sparkles,
  Trophy,
  Activity,
  Timer,
  Edit3,
  Sliders,
  Check,
  X,
  Film,
  Video,
} from 'lucide-react';
import { getRankTheme } from '../utils/rankTheme';
import { ExerciseDemoModal } from './ExerciseDemoModal';

interface DailyQuestCardProps {
  questState: DailyQuestState;
  userProfile: UserProfile;
  userRank?: HunterRank;
  onUpdateReps: (exerciseId: string, delta: number) => void;
  onSetReps: (exerciseId: string, amount: number) => void;
  onCompleteAll: () => void;
  onOpenPlanSettings: () => void;
}

export const DailyQuestCard: React.FC<DailyQuestCardProps> = ({
  questState,
  userProfile,
  userRank = 'E-Rank',
  onUpdateReps,
  onSetReps,
  onCompleteAll,
  onOpenPlanSettings,
}) => {
  const theme = getRankTheme(userRank);

  // Penalty Countdown Timer to Midnight
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isUrgent, setIsUrgent] = useState(false);

  // Built-in Set / Rest Timer
  const [restSeconds, setRestSeconds] = useState<number | null>(null);
  const [restInitial, setRestInitial] = useState<number>(60);
  const [timerActive, setTimerActive] = useState<boolean>(false);

  // Manual Custom Reps Modal State
  const [editingItem, setEditingItem] = useState<QuestItem | null>(null);
  const [customRepInput, setCustomRepInput] = useState<string>('');
  const [customMode, setCustomMode] = useState<'set' | 'add' | 'deduct'>('set');

  // Exercise Form Demonstration Clip Modal State
  const [demoExerciseId, setDemoExerciseId] = useState<string | null>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);

      const diff = Math.max(0, midnight.getTime() - now.getTime());
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
      // Urgent if less than 3 hours left and quest incomplete
      setIsUrgent(hours < 3 && !questState.allCompleted);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [questState.allCompleted]);

  // Rest timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && restSeconds !== null && restSeconds > 0) {
      timer = setInterval(() => {
        setRestSeconds((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (restSeconds === 0 && timerActive) {
      playQuestCompleteSound(userProfile.soundEnabled);
      setTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [timerActive, restSeconds, userProfile.soundEnabled]);

  const startRestTimer = (seconds: number) => {
    playRepCountSound(userProfile.soundEnabled);
    setRestInitial(seconds);
    setRestSeconds(seconds);
    setTimerActive(true);
  };

  const handleRepIncrement = (exerciseId: string, delta: number) => {
    playRepCountSound(userProfile.soundEnabled);
    onUpdateReps(exerciseId, delta);
  };

  const openCustomModal = (item: QuestItem, mode: 'set' | 'add' | 'deduct' = 'set') => {
    setEditingItem(item);
    setCustomMode(mode);
    setCustomRepInput(mode === 'set' ? String(item.current) : '10');
  };

  const handleApplyCustom = () => {
    if (!editingItem) return;
    const val = parseFloat(customRepInput);
    if (isNaN(val)) return;

    if (customMode === 'set') {
      onSetReps(editingItem.id, Math.max(0, val));
    } else if (customMode === 'add') {
      onUpdateReps(editingItem.id, val);
    } else if (customMode === 'deduct') {
      onUpdateReps(editingItem.id, -Math.abs(val));
    }
    playRepCountSound(userProfile.soundEnabled);
    setEditingItem(null);
  };

  // Completion calculation
  const totalTarget = questState.items.reduce((acc, item) => acc + item.target, 0);
  const totalCurrent = questState.items.reduce((acc, item) => acc + Math.min(item.target, item.current), 0);
  const overallProgress = Math.min(100, Math.round((totalCurrent / Math.max(1, totalTarget)) * 100));
  const allExercisesDone = questState.items.length > 0 && questState.items.every((i) => i.current >= i.target);

  const triggerCelebration = () => {
    playQuestCompleteSound(userProfile.soundEnabled);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [theme.primaryColor, '#00e5ff', '#a855f7', '#10b981'],
      });
    } catch (e) {}
    onCompleteAll();
  };

  return (
    <div
      className={`w-full rounded-2xl p-5 sm:p-6 transition-all duration-300 ${
        isUrgent
          ? 'system-window-danger border-rose-500/80 shadow-[0_0_40px_rgba(244,63,94,0.35)]'
          : `system-window ${theme.borderClass} ${theme.bgGlowClass}`
      }`}
    >
      {/* Jinwoo Training Visual & Quote Mini-Banner */}
      <div className="relative mb-4 rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative w-full sm:w-36 h-24 shrink-0 overflow-hidden">
          <img
            src={jinwooTrainingImg}
            alt="Sung Jin-woo Quest Training"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#050814]/40 to-[#050814]" />
        </div>
        <div className="p-3 sm:p-2 sm:pr-4 flex-1">
          <div className={`text-[10px] font-system font-black tracking-widest ${theme.textClass} uppercase`}>
            [ {userRank} TRAINING MANDATE ]
          </div>
          <p className="text-xs sm:text-sm italic font-serif text-slate-200 mt-0.5">
            "I don’t stop when I’m tired. I stop when the quest is finished."
          </p>
          <span className="text-[11px] font-system font-bold text-slate-400 block mt-0.5">
            — Sung Jin-woo
          </span>
        </div>
      </div>

      {/* Top Hologram Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/30 pb-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isUrgent ? 'bg-rose-500 animate-ping' : `${theme.textClass} animate-pulse`
              }`}
              style={{ backgroundColor: !isUrgent ? theme.primaryColor : undefined }}
            />
            <span
              className={`text-xs font-system font-extrabold uppercase tracking-widest ${
                isUrgent ? 'text-rose-400 glow-text-red' : theme.textClass
              }`}
            >
              [ QUEST NOTIFICATION: DAILY PHYSICAL QUEST ]
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-system text-white tracking-wide mt-0.5">
            GETTING READY TO LEVEL UP
          </h2>
        </div>

        {/* Penalty Clock or Complete status */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-system font-bold ${
            questState.allCompleted || allExercisesDone
              ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
              : isUrgent
              ? 'bg-rose-950/80 border-rose-500 text-rose-300 animate-pulse'
              : `${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`
          }`}
        >
          {questState.allCompleted || allExercisesDone ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>QUEST COMPLETE</span>
            </>
          ) : (
            <>
              <Clock className={`w-4 h-4 ${isUrgent ? 'text-rose-400' : theme.textClass}`} />
              <span>
                PENALTY IN: {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Penalty Warning Banner if urgent */}
      {isUrgent && (
        <div className="mb-4 p-3 rounded-xl bg-rose-950/70 border border-rose-500/80 text-rose-200 flex items-start gap-2.5 animate-pulse">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="font-system font-bold block text-sm">
              [WARNING: PENALTY QUEST THREAT LEVEL CRITICAL]
            </strong>
            Failure to complete daily physical quests before 00:00 will trigger transport to the
            survival Penalty Zone for 4 hours. Complete remaining sets immediately!
          </div>
        </div>
      )}

      {/* Overall Progress Meter */}
      <div className="mb-5 bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
        <div className="flex justify-between items-center text-xs font-system mb-1.5">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Activity className="w-4 h-4" style={{ color: theme.primaryColor }} />
            <span>TOTAL QUEST PROGRESSION</span>
          </span>
          <span className="font-extrabold text-white text-sm">
            {overallProgress}% ({totalCurrent} / {totalTarget})
          </span>
        </div>
        <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-500/30 p-0.5">
          <div
            className={`h-full rounded-full transition-[width] duration-300 ease-out ${
              questState.allCompleted || allExercisesDone
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : `bg-gradient-to-r ${theme.gradientButton}`
            }`}
            style={{ width: `${Math.min(100, Math.max(0, overallProgress))}%` }}
          />
        </div>
      </div>

      {/* Exercises List with Full Add & Deduct Controls */}
      <div className="space-y-3.5">
        {questState.items.map((item) => {
          const itemProgress = Math.min(100, Math.max(0, Math.round((item.current / item.target) * 100)));
          const isDone = item.current >= item.target;

          return (
            <div
              key={item.id}
              className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                  : 'bg-slate-950/60 border-slate-800 hover:border-cyan-500/40 text-slate-100'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : `${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-4 h-4" /> : item.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDemoExerciseId(item.id)}
                        className="group/title text-left flex items-center gap-2 hover:opacity-90 transition active:scale-95"
                        title="Click to watch animated demonstration clip & form guide"
                      >
                        <h3 className="font-system font-bold text-sm sm:text-base text-white group-hover/title:text-cyan-300 group-hover/title:underline decoration-cyan-500/50 underline-offset-4">
                          {item.name}
                        </h3>
                        <span className="px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-400/50 text-cyan-300 text-[10px] font-system font-black flex items-center gap-1 hover:bg-cyan-500/20 transition shadow-[0_0_8px_rgba(0,229,255,0.25)]">
                          <Play className="w-2.5 h-2.5 fill-cyan-300 text-cyan-300" />
                          <span>Form Clip</span>
                        </span>
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-400 uppercase font-semibold">
                      Reward: +{item.xpReward} XP | +1 {item.statReward.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Direct Editable Rep Count */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openCustomModal(item, 'set')}
                    className="group flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 transition"
                    title="Click to directly enter exact reps"
                  >
                    <span className="font-system font-extrabold text-base sm:text-lg text-cyan-300 group-hover:text-white">
                      {item.current}
                    </span>
                    <span className="text-slate-400 text-xs font-normal">
                      / {item.target} {item.unit}
                    </span>
                    <Edit3 className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition ml-0.5" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden mb-3 border border-slate-800">
                <div
                  className={`h-full rounded-full transition-[width] duration-300 ease-out ${
                    isDone ? 'bg-emerald-400' : 'bg-cyan-400'
                  }`}
                  style={{
                    width: `${itemProgress}%`,
                    backgroundColor: !isDone ? theme.primaryColor : undefined,
                  }}
                />
              </div>

              {/* Comprehensive Manual Add & Deduct Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  {/* Deduct Buttons */}
                  <div className="flex items-center gap-1 pr-1 border-r border-slate-800">
                    <button
                      onClick={() => handleRepIncrement(item.id, -10)}
                      disabled={item.current <= 0}
                      className="px-2 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/30 text-rose-300 text-xs font-system font-bold disabled:opacity-20 disabled:pointer-events-none transition active:scale-95"
                      title="Deduct 10 reps"
                    >
                      -10
                    </button>
                    <button
                      onClick={() => handleRepIncrement(item.id, -5)}
                      disabled={item.current <= 0}
                      className="px-2 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/30 text-rose-300 text-xs font-system font-bold disabled:opacity-20 disabled:pointer-events-none transition active:scale-95"
                      title="Deduct 5 reps"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => handleRepIncrement(item.id, -1)}
                      disabled={item.current <= 0}
                      className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-rose-500 text-slate-400 hover:text-rose-300 disabled:opacity-20 disabled:pointer-events-none transition"
                      title="Deduct 1 rep"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add Buttons */}
                  <button
                    onClick={() => handleRepIncrement(item.id, 1)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition"
                    title="Add 1 rep"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleRepIncrement(item.id, 5)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-system font-bold transition active:scale-95"
                  >
                    +5
                  </button>
                  <button
                    onClick={() => handleRepIncrement(item.id, 10)}
                    className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 text-xs font-system font-bold transition active:scale-95"
                  >
                    +10
                  </button>
                  <button
                    onClick={() => handleRepIncrement(item.id, 25)}
                    className="px-2.5 py-1 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 border border-blue-400/40 text-blue-200 text-xs font-system font-bold transition active:scale-95"
                  >
                    +25
                  </button>
                  <button
                    onClick={() => openCustomModal(item, 'set')}
                    className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-cyan-300 text-xs font-system transition flex items-center gap-1"
                    title="Enter custom count directly"
                  >
                    <Sliders className="w-3 h-3" />
                    <span>Exact</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    if (!isDone) {
                      onSetReps(item.id, item.target);
                    }
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-system font-bold border transition ${
                    isDone
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300 cursor-default'
                      : 'bg-slate-900 border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-300 active:scale-95'
                  }`}
                >
                  {isDone ? 'Completed ✓' : 'Finish Goal'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Manual Custom Rep Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl system-window p-5 text-slate-100 border border-cyan-500/50 shadow-[0_0_40px_rgba(0,229,255,0.2)] space-y-4">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-2">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-cyan-400" />
                <h3 className="font-system font-bold text-sm text-white">
                  MANUAL REPS: {editingItem.name.toUpperCase()}
                </h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode selection tabs */}
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs font-system">
              <button
                onClick={() => setCustomMode('set')}
                className={`flex-1 py-1.5 rounded-md font-bold transition ${
                  customMode === 'set' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Set Exact Reps
              </button>
              <button
                onClick={() => setCustomMode('add')}
                className={`flex-1 py-1.5 rounded-md font-bold transition ${
                  customMode === 'add' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Add (+ Reps)
              </button>
              <button
                onClick={() => setCustomMode('deduct')}
                className={`flex-1 py-1.5 rounded-md font-bold transition ${
                  customMode === 'deduct' ? 'bg-rose-500 text-slate-950' : 'text-slate-400'
                }`}
              >
                Deduct (- Reps)
              </button>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {customMode === 'set'
                  ? `Enter total completed ${editingItem.unit}:`
                  : customMode === 'add'
                  ? `Enter additional ${editingItem.unit} to add:`
                  : `Enter ${editingItem.unit} to deduct:`}
              </label>
              <input
                type="number"
                min="0"
                step={editingItem.id === 'running' ? '0.1' : '1'}
                value={customRepInput}
                onChange={(e) => setCustomRepInput(e.target.value)}
                autoFocus
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-cyan-500/50 text-cyan-300 font-system text-xl font-bold focus:outline-none focus:border-cyan-400 text-center"
              />
              <span className="text-[11px] text-slate-500 block text-center mt-1">
                Target: {editingItem.target} {editingItem.unit} | Currently: {editingItem.current} {editingItem.unit}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setEditingItem(null)}
                className="flex-1 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-system font-bold text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustom}
                className="flex-1 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-system font-black transition active:scale-95"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tactical Rest Timer */}
      <div className="mt-5 p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-system font-bold text-slate-300">INTER-SET REST TIMER:</span>
          {restSeconds !== null && (
            <span className="font-system font-extrabold text-sm text-cyan-300 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40">
              {restSeconds}s
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => startRestTimer(30)}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-system transition"
          >
            30s
          </button>
          <button
            onClick={() => startRestTimer(60)}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-system transition"
          >
            60s
          </button>
          <button
            onClick={() => startRestTimer(90)}
            className="px-2 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-system transition"
          >
            90s
          </button>
          {timerActive && (
            <button
              onClick={() => setTimerActive(false)}
              className="p-1 rounded bg-rose-950/60 border border-rose-500/50 text-rose-300 hover:bg-rose-900/60 text-xs"
              title="Stop Timer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Quest Completion Action Button */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-cyan-500/20">
        <button
          onClick={onOpenPlanSettings}
          className="text-xs text-slate-400 hover:text-cyan-300 underline font-system transition"
        >
          Change Active Training Plan / Adjust Targets
        </button>

        {questState.rewardsClaimed ? (
          <div className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-emerald-300 font-system font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Trophy className="w-4 h-4 text-emerald-400" />
            <span>DAILY REWARDS CLAIMED (+3 STAT POINTS)</span>
          </div>
        ) : allExercisesDone ? (
          <button
            id="claim-quest-rewards-btn"
            onClick={triggerCelebration}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r ${theme.gradientButton} font-system font-black text-sm transition shadow-[0_0_25px_rgba(0,229,255,0.4)] active:scale-95 animate-pulse`}
          >
            <Sparkles className="w-4 h-4" />
            <span>CLAIM DAILY QUEST REWARDS (+350 XP, +3 POINTS)</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-system text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
              Quest: {overallProgress}% Complete
            </span>
            <button
              id="claim-quest-rewards-btn"
              onClick={triggerCelebration}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-system font-bold text-xs transition active:scale-95"
              title="Set all goals to 100% and complete today's quest"
            >
              Complete All Goals
            </button>
          </div>
        )}
      </div>

      {/* Exercise Form Demonstration Clip Modal */}
      {demoExerciseId && (
        <ExerciseDemoModal
          exerciseId={demoExerciseId}
          soundEnabled={userProfile.soundEnabled}
          onClose={() => setDemoExerciseId(null)}
        />
      )}
    </div>
  );
};
