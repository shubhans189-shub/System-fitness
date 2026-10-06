import React, { useState, useEffect } from 'react';
import {
  DailyCheckIn,
  DailyLog,
  DailyQuestState,
  HunterStats,
  MealLogEntry,
  TrainingPlan,
  UserProfile,
  WeightRecord,
} from './types';
import {
  calculateMaintenanceCalories,
  calculateMaxHP,
  calculateMaxMP,
  calculateTargetCalories,
  calculateXpForNextLevel,
  DEFAULT_PLANS,
  getRankAndTitle,
} from './utils/fitnessCalculations';
import { playLevelUpSound, playRepCountSound, playStatAllocateSound } from './utils/soundEffects';
import {
  checkDailyQuestSchedule,
  requestNotificationPermission,
  sendPushNotification,
} from './utils/notifications';
import { getRankTheme } from './utils/rankTheme';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { SystemHeader } from './components/SystemHeader';
import { StatusWindow } from './components/StatusWindow';
import { DailyQuestCard } from './components/DailyQuestCard';
import { NutritionHub } from './components/NutritionHub';
import { AnalyticsView } from './components/AnalyticsView';
import { SungJinwooHero } from './components/SungJinwooHero';
import { HomePage } from './components/HomePage';
import { OnboardingModal } from './components/OnboardingModal';
import { PlanSettingsModal } from './components/PlanSettingsModal';
import { AiCoachModal } from './components/AiCoachModal';
import { ExportModal } from './components/ExportModal';
import { DailyCheckInModal } from './components/DailyCheckInModal';
import { MilestonesModal } from './components/MilestonesModal';
import confetti from 'canvas-confetti';
import { Shield, Sparkles, Dumbbell, Utensils, TrendingUp, Bot, Award, Bell, Moon, Crown, Home } from 'lucide-react';

const TODAY_STR = new Date().toISOString().split('T')[0];

export default function App() {
  // 1. User Profile State
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('solo_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  // 2. Active Training Plan State
  const [activePlan, setActivePlan] = useState<TrainingPlan>(() => {
    const saved = localStorage.getItem('solo_active_plan');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return DEFAULT_PLANS[1]; // Default to Sung Jin-woo Standard (100 / 100 / 100 / 10km)
  });

  // 3. Hunter Attributes & Stats State
  const [hunterStats, setHunterStats] = useState<HunterStats>(() => {
    const saved = localStorage.getItem('solo_hunter_stats');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    const initialVit = 10;
    const initialInt = 10;
    return {
      level: 1,
      rank: 'E-Rank',
      title: "Humankind's Weakest Hunter",
      str: 10,
      agi: 10,
      vit: initialVit,
      int: initialInt,
      per: 10,
      hp: calculateMaxHP(initialVit, 1),
      maxHp: calculateMaxHP(initialVit, 1),
      mp: calculateMaxMP(initialInt, 1),
      maxMp: calculateMaxMP(initialInt, 1),
      xp: 0,
      nextLevelXp: calculateXpForNextLevel(1),
      availablePoints: 0,
      fatigue: 12,
      dailyStreak: 1,
      lastActiveDate: TODAY_STR,
    };
  });

  // 4. Daily Quest State
  const [dailyQuest, setDailyQuest] = useState<DailyQuestState>(() => {
    const saved = localStorage.getItem('solo_daily_quest');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === TODAY_STR) {
          return parsed;
        }
      } catch (e) {}
    }
    // New day initial quest based on active plan
    return {
      date: TODAY_STR,
      items: (DEFAULT_PLANS[1] || activePlan).exercises.map((ex) => ({
        id: ex.id,
        name: ex.name,
        target: ex.target,
        current: 0,
        unit: ex.unit,
        statReward: ex.statReward,
        xpReward: ex.xpReward,
      })),
      allCompleted: false,
      penaltyTriggered: false,
      rewardsClaimed: false,
    };
  });

  // 5. Daily Logs & Historical Analytics
  const [dailyLogs, setDailyLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem('solo_daily_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    // Generate realistic initial 7-day history so charts look alive immediately
    const mockLogs: DailyLog[] = [];
    const now = new Date();
    for (let i = 6; i >= 1; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      mockLogs.push({
        date: dStr,
        completionRate: i === 3 ? 80 : 100,
        pushups: i === 3 ? 80 : 100,
        situps: i === 3 ? 80 : 100,
        squats: i === 3 ? 80 : 100,
        runningKm: i === 3 ? 8 : 10,
        waterMl: 2800 + i * 50,
        weightKg: 74.2 - (6 - i) * 0.15,
        levelAtDay: 1,
      });
    }
    return mockLogs;
  });

  // 6. Weight Records State
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() => {
    const saved = localStorage.getItem('solo_weight_records');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: 'w1', date: '2026-09-13', weightKg: 74.5 },
      { id: 'w2', date: '2026-09-15', weightKg: 74.2 },
      { id: 'w3', date: '2026-09-17', weightKg: 73.9 },
      { id: 'w4', date: TODAY_STR, weightKg: 73.6 },
    ];
  });

  // 7. Water Intake Today (ml)
  const [waterToday, setWaterToday] = useState<number>(() => {
    const saved = localStorage.getItem('solo_water_today');
    const savedDate = localStorage.getItem('solo_water_date');
    if (saved && savedDate === TODAY_STR) {
      return Number(saved) || 0;
    }
    return 1250;
  });

  // 8. Everyday Meal Consumption State
  const [loggedMeals, setLoggedMeals] = useState<MealLogEntry[]>(() => {
    try {
      const saved = localStorage.getItem('solo_meals_today');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((m: MealLogEntry) => m.date === TODAY_STR);
        }
      }
    } catch (e) {}
    // Initial sample meal so user immediately sees how it works!
    return [
      {
        id: 'meal_init_1',
        date: TODAY_STR,
        timestamp: '08:30',
        mealType: 'breakfast',
        name: 'Hunter Bio-Power Scramble & Whole Grains',
        description: '3 whole eggs scrambled with baby spinach, 2 slices toasted whole grain bread, black coffee',
        calories: 420,
        proteinGrams: 28,
        carbsGrams: 36,
        fatsGrams: 18,
        micronutrients: {
          fiberGrams: 6,
          sodiumMg: 380,
          potassiumMg: 460,
          magnesiumMg: 60,
          vitaminDiu: 75,
          calciumMg: 110,
          ironMg: 3.4,
        },
        hunterRank: 'A-Rank Lean Hypertrophy',
        systemComment: '[SYSTEM BIO-ANALYSIS]: Clean amino acid profile. Optimal fuel for morning dungeon raids.',
      },
    ];
  });

  // Active View Tab: 'home' | 'quests' | 'nutrition' | 'analytics'
  const [activeTab, setActiveTab] = useState<'home' | 'quests' | 'nutrition' | 'analytics'>('home');

  // Offline Mode State: automatically detect network state and support manual user toggle
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(() => {
    const forced = localStorage.getItem('solo_force_offline');
    if (forced === 'true') return true;
    return typeof navigator !== 'undefined' ? !navigator.onLine : false;
  });

  useEffect(() => {
    const handleOnline = () => {
      const forced = localStorage.getItem('solo_force_offline');
      if (forced !== 'true') setIsOfflineMode(false);
    };
    const handleOffline = () => setIsOfflineMode(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleToggleOfflineMode = () => {
    setIsOfflineMode((prev) => {
      const next = !prev;
      localStorage.setItem('solo_force_offline', next ? 'true' : 'false');
      return next;
    });
  };

  // Daily Check-In (Sleep & Mood)
  const [dailyCheckIn, setDailyCheckIn] = useState<DailyCheckIn | null>(() => {
    const saved = localStorage.getItem('solo_daily_checkin');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.date === TODAY_STR) {
          return parsed;
        }
      } catch (e) {}
    }
    return null;
  });

  // Modals visibility
  const [showOnboarding, setShowOnboarding] = useState<boolean>(!userProfile?.onboardingComplete);
  const [showAiCoach, setShowAiCoach] = useState<boolean>(false);
  const [showPlanSettings, setShowPlanSettings] = useState<boolean>(false);
  const [showExport, setShowExport] = useState<boolean>(false);
  const [showInstallGuide, setShowInstallGuide] = useState<boolean>(false);
  const [showCheckIn, setShowCheckIn] = useState<boolean>(false);
  const [showMilestones, setShowMilestones] = useState<boolean>(false);
  const [levelUpToast, setLevelUpToast] = useState<{ level: number; rank: string } | null>(null);

  // Persistence to localStorage
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem('solo_user_profile', JSON.stringify(userProfile));
    }
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('solo_hunter_stats', JSON.stringify(hunterStats));
  }, [hunterStats]);

  useEffect(() => {
    localStorage.setItem('solo_daily_quest', JSON.stringify(dailyQuest));
  }, [dailyQuest]);

  useEffect(() => {
    localStorage.setItem('solo_active_plan', JSON.stringify(activePlan));
  }, [activePlan]);

  useEffect(() => {
    localStorage.setItem('solo_daily_logs', JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem('solo_weight_records', JSON.stringify(weightRecords));
  }, [weightRecords]);

  useEffect(() => {
    localStorage.setItem('solo_water_today', String(waterToday));
    localStorage.setItem('solo_water_date', TODAY_STR);
  }, [waterToday]);

  useEffect(() => {
    localStorage.setItem('solo_meals_today', JSON.stringify(loggedMeals));
  }, [loggedMeals]);

  useEffect(() => {
    if (dailyCheckIn) {
      localStorage.setItem('solo_daily_checkin', JSON.stringify(dailyCheckIn));
    }
  }, [dailyCheckIn]);

  // Auto-prompt Daily Check-in on a new day when user opens the app
  useEffect(() => {
    if (userProfile?.onboardingComplete && !dailyCheckIn) {
      const lastPromptDate = localStorage.getItem('solo_last_checkin_prompt_date');
      if (lastPromptDate !== TODAY_STR) {
        const timer = setTimeout(() => {
          setShowCheckIn(true);
          localStorage.setItem('solo_last_checkin_prompt_date', TODAY_STR);
        }, 1200);
        return () => clearTimeout(timer);
      }
    }
  }, [userProfile?.onboardingComplete, dailyCheckIn]);

  // Periodic Daily Notification & Penalty Check
  useEffect(() => {
    if (!userProfile?.notificationsEnabled) return;

    const checkSchedule = () => {
      const result = checkDailyQuestSchedule(dailyQuest.allCompleted);
      if (result && result.shouldNotify) {
        sendPushNotification(result.title, result.body);
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 1000 * 60 * 30); // check every 30 mins
    return () => clearInterval(interval);
  }, [userProfile?.notificationsEnabled, dailyQuest.allCompleted]);

  // Handle XP addition & Level-Up progression
  const addXp = (amount: number) => {
    setHunterStats((prev) => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newNextXp = prev.nextLevelXp;
      let pointsAwarded = prev.availablePoints;
      let leveledUp = false;

      while (newXp >= newNextXp) {
        newXp -= newNextXp;
        newLevel += 1;
        newNextXp = calculateXpForNextLevel(newLevel);
        pointsAwarded += 3; // 3 stat points per level
        leveledUp = true;
      }

      if (leveledUp) {
        const { rank, title } = getRankAndTitle(newLevel);
        const newMaxHp = calculateMaxHP(prev.vit, newLevel);
        const newMaxMp = calculateMaxMP(prev.int, newLevel);

        playLevelUpSound(userProfile?.soundEnabled ?? true);
        try {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#00e5ff', '#3b82f6', '#a855f7', '#fbbf24'],
          });
        } catch (e) {}

        setLevelUpToast({ level: newLevel, rank });
        setTimeout(() => setLevelUpToast(null), 6000);

        if (userProfile?.notificationsEnabled) {
          sendPushNotification(
            '🌟 [LEVEL UP ACHIEVED!]',
            `Congratulations Player! You have ascended to Level ${newLevel} (${rank}). +3 Stat Points awarded!`
          );
        }

        return {
          ...prev,
          level: newLevel,
          rank,
          title,
          xp: newXp,
          nextLevelXp: newNextXp,
          availablePoints: pointsAwarded,
          hp: newMaxHp,
          maxHp: newMaxHp,
          mp: newMaxMp,
          maxMp: newMaxMp,
          fatigue: Math.max(0, prev.fatigue - 30),
        };
      }

      return {
        ...prev,
        xp: newXp,
      };
    });
  };

  // Update Reps in Daily Quest
  const handleUpdateReps = (exerciseId: string, delta: number) => {
    setDailyQuest((prev) => {
      const newItems = prev.items.map((item) => {
        if (item.id === exerciseId) {
          const nextVal = Math.max(0, item.current + delta);
          return { ...item, current: nextVal };
        }
        return item;
      });

      // Award XP on increment
      if (delta > 0) {
        addXp(delta * 2);
      }

      const allDone = newItems.every((i) => i.current >= i.target);
      return {
        ...prev,
        items: newItems,
        allCompleted: allDone || prev.rewardsClaimed,
      };
    });
  };

  const handleSetReps = (exerciseId: string, amount: number) => {
    setDailyQuest((prev) => {
      const newItems = prev.items.map((item) => {
        if (item.id === exerciseId) {
          return { ...item, current: Math.max(0, amount) };
        }
        return item;
      });
      addXp(50);
      const allDone = newItems.every((i) => i.current >= i.target);
      return {
        ...prev,
        items: newItems,
        allCompleted: allDone || prev.rewardsClaimed,
      };
    });
  };

  // Claim Daily Quest Completion
  const handleCompleteAll = () => {
    // Avoid double claim
    if (dailyQuest.rewardsClaimed) {
      return;
    }

    setDailyQuest((prev) => ({
      ...prev,
      items: prev.items.map((i) => ({ ...i, current: Math.max(i.current, i.target) })),
      allCompleted: true,
      rewardsClaimed: true,
    }));

    // Grant Quest completion XP boost + 3 stat points
    addXp(350);
    setHunterStats((prev) => ({
      ...prev,
      availablePoints: prev.availablePoints + 3,
      dailyStreak: prev.dailyStreak + 1,
      hp: prev.maxHp,
      mp: prev.maxMp,
      fatigue: 0,
    }));

    // Log today's activity into dailyLogs
    const todayLog: DailyLog = {
      date: TODAY_STR,
      completionRate: 100,
      pushups: dailyQuest.items.find((i) => i.id === 'pushups')?.target || 100,
      situps: dailyQuest.items.find((i) => i.id === 'situps')?.target || 100,
      squats: dailyQuest.items.find((i) => i.id === 'squats')?.target || 100,
      runningKm: dailyQuest.items.find((i) => i.id === 'running')?.target || 10,
      waterMl: waterToday,
      weightKg: userProfile?.weightKg || 70,
      levelAtDay: hunterStats.level,
    };

    setDailyLogs((prev) => {
      const filtered = prev.filter((l) => l.date !== TODAY_STR);
      return [...filtered, todayLog];
    });

    if (userProfile?.notificationsEnabled) {
      sendPushNotification(
        '🏆 [DAILY QUEST COMPLETE]',
        'All physical training sets completed. Fatigue restored to 0%, +3 Stat Points added to status!'
      );
    }
  };

  // Meal consumption handlers
  const handleAddMeal = (meal: MealLogEntry) => {
    setLoggedMeals((prev) => [meal, ...prev]);
    // Hunter XP bonus for disciplined meal tracking
    addXp(25);
  };

  const handleDeleteMeal = (mealId: string) => {
    setLoggedMeals((prev) => prev.filter((m) => m.id !== mealId));
  };

  // Stat point allocation
  const handleAllocateStat = (stat: 'str' | 'agi' | 'vit' | 'int' | 'per') => {
    if (hunterStats.availablePoints <= 0) return;

    setHunterStats((prev) => {
      const updated = {
        ...prev,
        [stat]: prev[stat] + 1,
        availablePoints: prev.availablePoints - 1,
      };
      if (stat === 'vit') {
        updated.maxHp = calculateMaxHP(updated.vit, updated.level);
        updated.hp = updated.maxHp;
      }
      if (stat === 'int') {
        updated.maxMp = calculateMaxMP(updated.int, updated.level);
        updated.mp = updated.maxMp;
      }
      return updated;
    });
  };

  // Water Tracker
  const handleUpdateWater = (deltaMl: number) => {
    setWaterToday((prev) => Math.max(0, prev + deltaMl));
  };

  const handleResetWater = () => {
    setWaterToday(0);
  };

  // Weight Log
  const handleLogWeight = (newWeightKg: number) => {
    setWeightRecords((prev) => {
      const filtered = prev.filter((r) => r.date !== TODAY_STR);
      return [...filtered, { id: `w_${Date.now()}`, date: TODAY_STR, weightKg: newWeightKg }];
    });

    if (userProfile) {
      const maintenance = calculateMaintenanceCalories(
        newWeightKg,
        userProfile.heightCm,
        userProfile.age,
        userProfile.gender,
        userProfile.activityLevel
      );
      const nutrition = calculateTargetCalories(maintenance, userProfile.goals, newWeightKg);

      setUserProfile({
        ...userProfile,
        weightKg: newWeightKg,
        maintenanceCalories: maintenance,
        targetCalories: nutrition.targetCalories,
        proteinGrams: nutrition.proteinGrams,
        carbsGrams: nutrition.carbsGrams,
        fatsGrams: nutrition.fatsGrams,
        waterTargetLiters: nutrition.waterLiters,
      });
    }
  };

  // Change Training Plan
  const handleSelectPlan = (newPlan: TrainingPlan) => {
    setActivePlan(newPlan);
    setDailyQuest((prev) => ({
      ...prev,
      items: newPlan.exercises.map((ex) => {
        const existing = prev.items.find((i) => i.id === ex.id);
        return {
          id: ex.id,
          name: ex.name,
          target: ex.target,
          current: existing ? existing.current : 0,
          unit: ex.unit,
          statReward: ex.statReward,
          xpReward: ex.xpReward,
          completed: existing ? existing.completed : false,
        };
      }),
      allCompleted: false,
    }));
  };

  // Toggle notifications & request native permission
  const handleToggleNotifications = async () => {
    if (!userProfile) return;
    const nextState = !userProfile.notificationsEnabled;
    if (nextState) {
      await requestNotificationPermission();
      sendPushNotification('⚔️ SYSTEM NOTIFICATIONS ACTIVE', 'You will receive quest updates & penalty alerts.');
    }
    setUserProfile({ ...userProfile, notificationsEnabled: nextState });
  };

  const handleToggleSound = () => {
    if (!userProfile) return;
    setUserProfile({ ...userProfile, soundEnabled: !userProfile.soundEnabled });
  };

  // Daily Sleep & Mood Check-in Handler
  const handleSaveCheckIn = (checkIn: DailyCheckIn) => {
    setDailyCheckIn(checkIn);
    // Influence daily hunter stats
    setHunterStats((prev) => {
      let fatigueDelta = 0;
      if (checkIn.sleepQuality === 'optimal') fatigueDelta = -20;
      else if (checkIn.sleepQuality === 'good') fatigueDelta = -10;
      else if (checkIn.sleepQuality === 'fair') fatigueDelta = 0;
      else if (checkIn.sleepQuality === 'poor') fatigueDelta = 10;
      else if (checkIn.sleepQuality === 'terrible') fatigueDelta = 20;

      const newFatigue = Math.max(0, Math.min(100, prev.fatigue + fatigueDelta));
      return {
        ...prev,
        fatigue: newFatigue,
      };
    });
    addXp(75);
    setShowCheckIn(false);
  };

  // Awakening Milestones & Equip Title Handler
  const handleEquipTitle = (newTitle: string) => {
    setHunterStats((prev) => ({
      ...prev,
      equippedTitle: newTitle,
      title: newTitle,
    }));
  };

  // Fallback profile if onboarding not completed yet
  const activeProfile: UserProfile = userProfile || {
    name: 'Sung Jin-woo',
    age: 24,
    gender: 'male',
    heightCm: 178,
    weightKg: 74,
    targetWeightKg: 72,
    goals: ['increase_muscle', 'stay_fit'],
    activityLevel: 'moderate',
    maintenanceCalories: 2450,
    targetCalories: 2500,
    proteinGrams: 165,
    carbsGrams: 280,
    fatsGrams: 69,
    waterTargetLiters: 3.5,
    onboardingComplete: false,
    soundEnabled: true,
    notificationsEnabled: true,
    createdAt: new Date().toISOString(),
  };

  const rankTheme = getRankTheme(hunterStats.rank);

  const auraGradient = `linear-gradient(90deg, transparent, ${rankTheme.primaryColor}, ${rankTheme.secondaryColor}, transparent)`;
  const auraGlow = `0 0 14px ${rankTheme.glowColor}`;

  return (
    <div className={`min-h-screen bg-[#050814] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950 rank-theme-${rankTheme.key}`}>
      {/* Rank & Guardian Theme Signature Aura Ribbon */}
      <div
        className="w-full h-1 shrink-0 transition-all duration-500"
        style={{
          background: auraGradient,
          boxShadow: auraGlow,
        }}
      />

      {/* 1. Android MI Phone & Offline PWA Install Prompt Banner & Guide */}
      <PWAInstallBanner
        forceOpenGuide={showInstallGuide}
        onCloseGuide={() => setShowInstallGuide(false)}
      />

      {/* 2. Solo Leveling Holographic System Top Header */}
      <SystemHeader
        userProfile={activeProfile}
        stats={hunterStats}
        isOfflineMode={isOfflineMode}
        activeTab={activeTab}
        onGoHome={() => setActiveTab('home')}
        onToggleOfflineMode={handleToggleOfflineMode}
        onOpenAiCoach={() => setShowAiCoach(true)}
        onOpenExport={() => setShowExport(true)}
        onOpenPlanSettings={() => setShowPlanSettings(true)}
        onOpenInstallGuide={() => setShowInstallGuide(true)}
        onOpenCheckIn={() => setShowCheckIn(true)}
        onOpenMilestones={() => setShowMilestones(true)}
        onToggleSound={handleToggleSound}
        onToggleNotifications={handleToggleNotifications}
      />

      {/* Level-Up Celebration Floating Toast */}
      {levelUpToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 text-slate-950 font-system font-black text-sm shadow-[0_0_35px_rgba(0,229,255,0.7)] flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
          <span>[SYSTEM ANNOUNCEMENT: ASCENDED TO LEVEL {levelUpToast.level} ({levelUpToast.rank})!]</span>
          <span className="text-xs bg-slate-950 text-cyan-300 px-2 py-0.5 rounded font-bold">
            +3 STAT POINTS
          </span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-6">
        
        {/* VIEW 0: Standalone Dedicated Home Page (ONLY the Homepage, no tabs clutter) */}
        {activeTab === 'home' && (
          <HomePage
            userProfile={activeProfile}
            stats={hunterStats}
            dailyQuest={dailyQuest}
            dailyCheckIn={dailyCheckIn}
            waterToday={waterToday}
            loggedMeals={loggedMeals}
            onStart={() => setActiveTab('quests')}
            onNavigateToStatus={() => setActiveTab('quests')}
            onNavigateToNutrition={() => setActiveTab('nutrition')}
            onNavigateToAnalytics={() => setActiveTab('analytics')}
            onOpenAiCoach={() => setShowAiCoach(true)}
            onOpenCheckIn={() => setShowCheckIn(true)}
            onOpenMilestones={() => setShowMilestones(true)}
            onOpenInstallGuide={() => setShowInstallGuide(true)}
          />
        )}

        {/* When inside the app (activeTab !== 'home'): Show the clean 3-tab navigation bar with full visibility for all buttons including ANALYTICS */}
        {activeTab !== 'home' && (
          <div className="space-y-4">
            {/* Top Return to Home & Quick Coach bar */}
            <div className="flex items-center justify-between gap-2 border-b border-cyan-500/20 pb-3">
              <button
                id="back-to-home-btn"
                onClick={() => {
                  playRepCountSound(activeProfile.soundEnabled);
                  setActiveTab('home');
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 text-xs font-system font-bold transition active:scale-95 shadow-sm"
                title="Return to Home Landing Page"
              >
                <Home className="w-3.5 h-3.5 text-cyan-400" />
                <span>← Home Page</span>
              </button>

              <button
                onClick={() => setShowAiCoach(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-system font-bold transition active:scale-95"
              >
                <Bot className="w-4 h-4 text-cyan-400" />
                <span>AI Coach</span>
              </button>
            </div>

            {/* Exactly the 3 Core Tabs evenly distributed via grid-cols-3 (100% width, never pushed to corner) */}
            <div className="w-full grid grid-cols-3 gap-1.5 sm:gap-3 p-1 rounded-2xl bg-slate-950/90 border border-cyan-500/30 shadow-[0_0_20px_rgba(0,229,255,0.15)]">
              {/* Tab 1: STATUS & QUESTS */}
              <button
                id="nav-tab-quests"
                onClick={() => {
                  playRepCountSound(activeProfile.soundEnabled);
                  setActiveTab('quests');
                }}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-1 sm:px-4 py-2.5 rounded-xl font-system text-[11px] sm:text-xs md:text-sm font-bold transition-all w-full text-center ${
                  activeTab === 'quests'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Dumbbell className="w-4 h-4 shrink-0" />
                <span className="truncate">STATUS & QUESTS</span>
              </button>

              {/* Tab 2: NUTRITION & WATER */}
              <button
                id="nav-tab-nutrition"
                onClick={() => {
                  playRepCountSound(activeProfile.soundEnabled);
                  setActiveTab('nutrition');
                }}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-1 sm:px-4 py-2.5 rounded-xl font-system text-[11px] sm:text-xs md:text-sm font-bold transition-all w-full text-center ${
                  activeTab === 'nutrition'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <Utensils className="w-4 h-4 shrink-0" />
                <span className="truncate">NUTRITION & WATER</span>
              </button>

              {/* Tab 3: ANALYTICS (100% visible, fully clear, prominent!) */}
              <button
                id="nav-tab-analytics"
                onClick={() => {
                  playRepCountSound(activeProfile.soundEnabled);
                  setActiveTab('analytics');
                }}
                className={`flex items-center justify-center gap-1.5 sm:gap-2 px-1 sm:px-4 py-2.5 rounded-xl font-system text-[11px] sm:text-xs md:text-sm font-bold transition-all w-full text-center ${
                  activeTab === 'analytics'
                    ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,229,255,0.4)]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <TrendingUp className="w-4 h-4 shrink-0" />
                <span className="truncate">ANALYTICS</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 1 Content: Status Window & Daily Physical Quest */}
        {activeTab === 'quests' && (
          <div className="space-y-6">
            <SungJinwooHero
              stats={hunterStats}
              userProfile={activeProfile}
              allQuestsCompleted={dailyQuest.allCompleted}
              caloriesConsumedToday={loggedMeals.reduce((acc, m) => acc + (m.calories || 0), 0)}
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column (5 cols): Holographic Solo Leveling Status Window */}
              <div className="lg:col-span-5 space-y-6">
                <StatusWindow
                  userProfile={activeProfile}
                  stats={hunterStats}
                  dailyCheckIn={dailyCheckIn}
                  onAllocateStat={handleAllocateStat}
                  onOpenCheckIn={() => setShowCheckIn(true)}
                  onOpenMilestones={() => setShowMilestones(true)}
                />
              </div>

              {/* Right Column (7 cols): Daily Physical Quest Card with interactive rep counters */}
              <div className="lg:col-span-7 space-y-6">
                <DailyQuestCard
                  questState={dailyQuest}
                  userProfile={activeProfile}
                  onUpdateReps={handleUpdateReps}
                  onSetReps={handleSetReps}
                  onCompleteAll={handleCompleteAll}
                  onOpenPlanSettings={() => setShowPlanSettings(true)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2 Content: Nutrition, BMR, TDEE, Macros, Water & Micros Hub */}
        {activeTab === 'nutrition' && (
          <NutritionHub
            userProfile={activeProfile}
            waterIntakeMl={waterToday}
            onUpdateWater={handleUpdateWater}
            onResetWater={handleResetWater}
            meals={loggedMeals}
            isOfflineMode={isOfflineMode}
            onAddMeal={handleAddMeal}
            onDeleteMeal={handleDeleteMeal}
          />
        )}

        {/* Tab 3 Content: Progression Analytics Charts & Body Weight Tracking */}
        {activeTab === 'analytics' && (
          <AnalyticsView
            userProfile={activeProfile}
            stats={hunterStats}
            dailyLogs={dailyLogs}
            weightRecords={weightRecords}
            onLogWeight={handleLogWeight}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 py-4 px-4 text-center text-xs text-slate-500 font-system mt-auto no-print">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <span>SOLO LEVELING SYSTEM PROTOCOL // THE ARCHITECT</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowInstallGuide(true)} className="text-cyan-400 font-bold hover:underline transition">
              Install App
            </button>
            <span>•</span>
            <button onClick={() => setShowOnboarding(true)} className="hover:text-cyan-400 transition">
              Re-Awakening Scan
            </button>
            <span>•</span>
            <button onClick={() => setShowPlanSettings(true)} className="hover:text-cyan-400 transition">
              Training Regimen
            </button>
            <span>•</span>
            <button onClick={() => setShowExport(true)} className="hover:text-cyan-400 transition">
              Health Export
            </button>
          </div>
        </div>
      </footer>

      {/* --- MODALS --- */}

      {/* 1. Onboarding Questionnaire Modal */}
      {showOnboarding && (
        <OnboardingModal
          initialProfile={userProfile}
          onComplete={(newProfile) => {
            setUserProfile(newProfile);
            setShowOnboarding(false);
          }}
        />
      )}

      {/* 2. System Architect AI Coach Chat Modal */}
      {showAiCoach && (
        <AiCoachModal
          userProfile={activeProfile}
          stats={hunterStats}
          questState={dailyQuest}
          dailyCheckIn={dailyCheckIn}
          isOfflineMode={isOfflineMode}
          consumedCalories={loggedMeals.reduce((acc, m) => acc + (m.calories || 0), 0)}
          consumedProtein={loggedMeals.reduce((acc, m) => acc + (m.proteinGrams || 0), 0)}
          waterIntakeMl={waterToday}
          onClose={() => setShowAiCoach(false)}
        />
      )}

      {/* 3. Training Plan Configuration Modal */}
      {showPlanSettings && (
        <PlanSettingsModal
          currentPlanId={activePlan.id}
          userProfile={activeProfile}
          onSelectPlan={handleSelectPlan}
          onClose={() => setShowPlanSettings(false)}
        />
      )}

      {/* 4. Health Data Export Modal (CSV / PDF / JSON) */}
      {showExport && (
        <ExportModal
          userProfile={activeProfile}
          stats={hunterStats}
          dailyLogs={dailyLogs}
          weightRecords={weightRecords}
          onClose={() => setShowExport(false)}
        />
      )}

      {/* 5. Daily Sleep & Mood Check-In Modal */}
      {showCheckIn && (
        <DailyCheckInModal
          userProfile={activeProfile}
          stats={hunterStats}
          currentCheckIn={dailyCheckIn}
          onSaveCheckIn={handleSaveCheckIn}
          onClose={() => setShowCheckIn(false)}
        />
      )}

      {/* 6. Awakening Milestones & Titles Modal */}
      {showMilestones && (
        <MilestonesModal
          userProfile={activeProfile}
          stats={hunterStats}
          questState={dailyQuest}
          dailyLogs={dailyLogs}
          mealsCount={loggedMeals.length}
          totalWaterLogged={waterToday}
          onEquipTitle={handleEquipTitle}
          onClose={() => setShowMilestones(false)}
        />
      )}
    </div>
  );
}
