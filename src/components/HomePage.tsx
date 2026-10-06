import React from 'react';
import { DailyCheckIn, DailyQuestState, HunterStats, MealLogEntry, UserProfile } from '../types';
import {
  Shield,
  Zap,
  Flame,
  Utensils,
  Bot,
  TrendingUp,
  Download,
  Moon,
  Crown,
  ChevronRight,
  Dumbbell,
  Sparkles,
  Droplet,
  Smartphone,
  Quote,
  RefreshCw,
  Award,
  Play,
} from 'lucide-react';
import jinwooPortraitImg from '../assets/images/jinwoo_portrait_1789901630204.jpg';
import jinwooMonarchImg from '../assets/images/jinwoo_monarch_1789901648447.jpg';
import { getRankTheme } from '../utils/rankTheme';
import { SYSTEM_QUOTES, getRandomQuote } from '../utils/quotes';

interface HomePageProps {
  userProfile: UserProfile;
  stats: HunterStats;
  dailyQuest: DailyQuestState;
  dailyCheckIn?: DailyCheckIn | null;
  waterToday: number;
  loggedMeals: MealLogEntry[];
  onStart?: () => void;
  onNavigateToStatus: () => void;
  onNavigateToNutrition: () => void;
  onNavigateToAnalytics: () => void;
  onOpenAiCoach: () => void;
  onOpenCheckIn: () => void;
  onOpenMilestones: () => void;
  onOpenInstallGuide: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  userProfile,
  stats,
  dailyQuest,
  dailyCheckIn,
  waterToday,
  loggedMeals,
  onStart,
  onNavigateToStatus,
  onNavigateToNutrition,
  onNavigateToAnalytics,
  onOpenAiCoach,
  onOpenCheckIn,
  onOpenMilestones,
  onOpenInstallGuide,
}) => {
  const theme = getRankTheme(stats.rank);
  const activeTitle = stats.equippedTitle || stats.title;

  const handleStart = onStart || onNavigateToStatus;

  const [quote, setQuote] = React.useState(SYSTEM_QUOTES[0]);

  const handleNextQuote = () => {
    setQuote(getRandomQuote());
  };

  // Calculations
  const completedQuestItems = dailyQuest.items.filter((i) => (i.current || 0) >= i.target).length;
  const totalQuestItems = dailyQuest.items.length;
  const questPercent = totalQuestItems > 0 ? Math.round((completedQuestItems / totalQuestItems) * 100) : 0;

  const totalCaloriesConsumed = loggedMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
  const totalProteinConsumed = loggedMeals.reduce((acc, m) => acc + (m.proteinGrams || 0), 0);
  const targetCalories = userProfile.targetCalories || 2300;
  const targetProtein = userProfile.proteinGrams || 140;
  const targetWaterMl = Math.round((userProfile.waterTargetLiters || 3) * 1000);
  const xpPercent = Math.min(100, Math.round((stats.xp / Math.max(1, stats.nextLevelXp)) * 100));

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Epic Heroic Command Portal Banner */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-cyan-500/50 shadow-[0_0_40px_rgba(0,229,255,0.25)] bg-[#050814] group">
        
        {/* Background Visual Art */}
        <div className="relative h-64 sm:h-72 md:h-80 w-full overflow-hidden bg-slate-950">
          <img
            src={jinwooMonarchImg}
            alt="Sung Jin-woo The Shadow Monarch"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top opacity-75 group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#050814]/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050814]/90 via-transparent to-[#050814]/70" />

          {/* Top System Status Tag */}
          <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 z-10">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-slate-950/90 border border-cyan-400/60 text-cyan-300 font-system font-black text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(0,229,255,0.35)] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span>SHADOW MONARCH COMMAND NEXUS</span>
              </span>
            </div>

            <button
              onClick={onOpenInstallGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/60 text-cyan-200 text-xs font-system font-bold transition shadow-lg active:scale-95"
            >
              <Smartphone className="w-3.5 h-3.5 text-cyan-300" />
              <span>Mobile App Available</span>
            </button>
          </div>

          {/* Bottom Left Hero Overlay: Avatar & Identity */}
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 z-10">
            <div className="flex items-end gap-3.5">
              <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,229,255,0.5)] shrink-0 bg-slate-900">
                <img
                  src={jinwooPortraitImg}
                  alt="Sung Jin-woo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 text-[10px] leading-none bg-slate-950/85 px-1 py-0.5 rounded-tl text-cyan-300">⚔️</span>
              </div>

              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl sm:text-3xl font-black font-system text-white tracking-wide drop-shadow-lg">
                    {userProfile.name}
                  </h1>
                  <span className={`px-2.5 py-0.5 rounded-lg font-system font-black text-xs uppercase shadow-md ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}>
                    {stats.rank}
                  </span>
                </div>
                <p className="text-xs sm:text-sm font-system font-semibold tracking-wider drop-shadow flex items-center gap-2 mt-1">
                  <span className="text-cyan-300">LEVEL {stats.level}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-amber-300 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>"{activeTitle}"</span>
                  </span>
                </p>
              </div>
            </div>

            {/* Direct Enter Current Status Button */}
            <button
              id="home-hero-start-btn"
              onClick={handleStart}
              className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-system font-black text-sm sm:text-base tracking-wider uppercase transition shadow-[0_0_30px_rgba(0,229,255,0.6)] active:scale-95 group/btn shrink-0"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>START // ENTER SYSTEM</span>
              <ChevronRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Motivational System Quote Bar */}
        <div className="p-4 bg-slate-950/95 border-t border-cyan-500/30 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2.5 flex-1 min-w-0">
            <Quote className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="italic text-slate-200 truncate">
              "{quote.quote}" <span className="text-cyan-400 not-italic font-bold font-system ml-1">— {quote.author}</span>
            </p>
          </div>
          <button
            onClick={handleNextQuote}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-cyan-300 transition shrink-0"
            title="Next quote"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Primary Launch Protocol Strip */}
      <div className="w-full p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/70 via-slate-950 to-blue-950/70 border border-cyan-500/50 shadow-[0_0_30px_rgba(0,229,255,0.18)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-system font-bold text-cyan-300 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>THE SYSTEM IS ARMED & READY</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black font-system text-white tracking-wide">
            ENTER YOUR TRAINING WORKSPACE
          </h2>
          <p className="text-xs text-slate-400">
            Tap START to access the 3 hunter pillars: <strong>Status & Quests</strong>, <strong>Nutrition & Water</strong>, and <strong>Analytics</strong>.
          </p>
        </div>

        <button
          id="home-main-launch-btn"
          onClick={handleStart}
          className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-slate-950 font-system font-black text-sm sm:text-base tracking-widest uppercase transition-all shadow-[0_0_25px_rgba(0,229,255,0.5)] active:scale-95 flex items-center justify-center gap-2 group/launch shrink-0"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>START NOW</span>
          <ChevronRight className="w-4 h-4 group-hover/launch:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* 2. Interactive Sector Portal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* CARD 1: Current Status & Daily Quests Sector */}
        <div
          onClick={onNavigateToStatus}
          className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950/50 border border-cyan-500/40 hover:border-cyan-400 transition-all duration-300 cursor-pointer shadow-[0_0_25px_rgba(0,229,255,0.12)] hover:shadow-[0_0_35px_rgba(0,229,255,0.25)] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-system font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                    STATUS & DAILY QUESTS
                  </h3>
                  <span className="text-[11px] text-slate-400">Hunter Physical Mandate</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Access your holographic attributes (STR, AGI, VIT, INT, PER), allocate unspent points, and track push-ups, squats, and running reps.
            </p>

            {/* Live Progress Meters */}
            <div className="space-y-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex justify-between text-xs font-system">
                <span className="text-slate-400">Quest Objectives:</span>
                <span className="font-bold text-cyan-300">
                  {completedQuestItems} / {totalQuestItems} Cleared ({questPercent}%)
                </span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${questPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-xs font-system pt-1">
                <span className="text-slate-400">Level XP:</span>
                <span className="text-emerald-400 font-bold">{xpPercent}% to Lv.{stats.level + 1}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-system">
            <span className="text-amber-300 font-semibold">Available Stat Points: +{stats.availablePoints}</span>
            <span className="text-cyan-400 font-bold group-hover:underline flex items-center gap-1">
              Open Status <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* CARD 2: Nutrition & Bio-Fuel Hub */}
        <div
          onClick={onNavigateToNutrition}
          className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 transition-all duration-300 cursor-pointer shadow-[0_0_25px_rgba(16,185,129,0.12)] hover:shadow-[0_0_35px_rgba(16,185,129,0.25)] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-300">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-system font-bold text-white text-base group-hover:text-emerald-300 transition-colors">
                    NUTRITION & REAL MACROS
                  </h3>
                  <span className="text-[11px] text-slate-400">Autonomous Food Scanner</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Log any Indian or global dish via photo or text with accurate, itemized macro and micronutrient breakdown. No generic 30g protein placeholders!
            </p>

            <div className="space-y-2 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex justify-between text-xs font-system">
                <span className="text-slate-400">Energy Today:</span>
                <span className="font-bold text-white">
                  {totalCaloriesConsumed} / {targetCalories} kcal
                </span>
              </div>
              <div className="flex justify-between text-xs font-system">
                <span className="text-slate-400">Protein Synthesis:</span>
                <span className="font-bold text-emerald-400">
                  {totalProteinConsumed}g / {targetProtein}g
                </span>
              </div>
              <div className="flex justify-between text-xs font-system">
                <span className="text-slate-400">Hydration:</span>
                <span className="font-bold text-cyan-300">
                  {waterToday}ml / {targetWaterMl}ml
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-system">
            <span className="text-slate-400">Logged Meals: {loggedMeals.length}</span>
            <span className="text-emerald-400 font-bold group-hover:underline flex items-center gap-1">
              Log Meal <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* CARD 3: Sung Jin-woo AI Coach */}
        <div
          onClick={onOpenAiCoach}
          className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 transition-all duration-300 cursor-pointer shadow-[0_0_25px_rgba(0,229,255,0.12)] hover:shadow-[0_0_35px_rgba(0,229,255,0.25)] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-system font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                    ANALYTICAL AI COACH
                  </h3>
                  <span className="text-[11px] text-slate-400">Sung Jin-woo Neural Link</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Get precise biomechanical corrections for joint strain (knees/elbows), volume periodization, zone 2 pacing, and shadow monarch discipline.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs">
              <div className="text-[11px] font-system font-bold text-cyan-300">
                ACTIVE AI CAPABILITIES:
              </div>
              <ul className="text-slate-400 text-[11px] space-y-1 list-disc list-inside">
                <li>Joint angle & eccentric tempo calibration</li>
                <li>Indian vegetarian & non-veg protein calculations</li>
                <li>Full offline autonomous reasoning engine</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-system">
            <span className="text-cyan-300 font-semibold">Online & Offline Ready</span>
            <span className="text-cyan-400 font-bold group-hover:underline flex items-center gap-1">
              Ask AI <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* CARD 4: Mobile Phone App Download & Installation Guide */}
        <div
          onClick={onOpenInstallGuide}
          className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/50 border border-indigo-500/40 hover:border-indigo-400 transition-all duration-300 cursor-pointer shadow-[0_0_25px_rgba(99,102,241,0.12)] hover:shadow-[0_0_35px_rgba(99,102,241,0.25)] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center text-indigo-300">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-system font-bold text-white text-base group-hover:text-indigo-300 transition-colors">
                    DOWNLOAD MOBILE APP
                  </h3>
                  <span className="text-[11px] text-slate-400">Android & iOS Full PWA</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Install the app directly onto your mobile home screen with the badass Sung Jin-woo icon! Works fully offline with zero Play Store hassle.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 text-xs font-system">
              <div className="flex items-center gap-2 text-cyan-300">
                <Smartphone className="w-4 h-4" />
                <span>1-Tap Install on Android & iPhone</span>
              </div>
              <span className="text-[11px] text-slate-400 block">
                Full screen experience, audio alerts, and local offline database.
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-system">
            <span className="text-indigo-300 font-semibold">Native App Feel</span>
            <span className="text-indigo-400 font-bold group-hover:underline flex items-center gap-1">
              Download Guide <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* CARD 5: Awakening Sleep & Mood Check-In */}
        <div
          onClick={onOpenCheckIn}
          className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950/50 border border-purple-500/40 hover:border-purple-400 transition-all duration-300 cursor-pointer shadow-[0_0_25px_rgba(168,85,247,0.12)] hover:shadow-[0_0_35px_rgba(168,85,247,0.25)] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300">
                  <Moon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-system font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                    DAILY AWAKENING CHECK-IN
                  </h3>
                  <span className="text-[11px] text-slate-400">Sleep & Stamina Recovery</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Record your sleep duration and mental focus to automatically receive neural stamina buffs and fatigue threshold adjustments.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-system">
              {dailyCheckIn ? (
                <div>
                  <div className="text-purple-300 font-bold flex justify-between">
                    <span>Slept: {dailyCheckIn.sleepHours}h ({dailyCheckIn.sleepQuality})</span>
                    <span className="text-emerald-400">+{dailyCheckIn.staminaBuffPercent}% Stamina</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Mindset: {dailyCheckIn.mood}
                  </span>
                </div>
              ) : (
                <div className="text-amber-400">
                  <span>No check-in recorded for today yet.</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Tap to log sleep & claim stamina buff</span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-system">
            <span className="text-purple-300 font-semibold">CNS Restoration</span>
            <span className="text-purple-400 font-bold group-hover:underline flex items-center gap-1">
              Check-In <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* CARD 6: Progression Analytics & Weight Log */}
        <div
          onClick={onNavigateToAnalytics}
          className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/50 border border-sky-500/40 hover:border-sky-400 transition-all duration-300 cursor-pointer shadow-[0_0_25px_rgba(56,189,248,0.12)] hover:shadow-[0_0_35px_rgba(56,189,248,0.25)] flex flex-col justify-between group"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-400/50 flex items-center justify-center text-sky-300">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-system font-bold text-white text-base group-hover:text-sky-300 transition-colors">
                    PROGRESSION ANALYTICS
                  </h3>
                  <span className="text-[11px] text-slate-400">Charts & Bodyweight Curve</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-sky-400 group-hover:translate-x-1 transition-all" />
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Visualize your 7-day, 14-day, and 30-day quest volume trends, caloric balance over time, and progressive overload curves.
            </p>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-system">
              <div className="flex justify-between text-slate-300">
                <span>Current Weight:</span>
                <span className="font-bold text-white">{userProfile.weightKg} kg</span>
              </div>
              <div className="flex justify-between text-slate-400 text-[11px] mt-1">
                <span>Streak Consistency:</span>
                <span className="text-amber-400 font-bold">{stats.dailyStreak} Consecutive Days</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-system">
            <span className="text-sky-300 font-semibold">Visual Telemetry</span>
            <span className="text-sky-400 font-bold group-hover:underline flex items-center gap-1">
              View Analytics <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
