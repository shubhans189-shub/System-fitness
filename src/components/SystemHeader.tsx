import React from 'react';
import { HunterStats, UserProfile } from '../types';
import jinwooPortraitImg from '../assets/images/jinwoo_portrait_1789901630204.jpg';
import { Bot, Volume2, VolumeX, Bell, BellOff, Download, FileText, Settings, Sparkles, Crown, Moon, Wifi, WifiOff, Home } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { getRankTheme } from '../utils/rankTheme';

interface SystemHeaderProps {
  userProfile: UserProfile;
  stats: HunterStats;
  isOfflineMode: boolean;
  activeTab?: 'home' | 'quests' | 'nutrition' | 'analytics';
  onGoHome?: () => void;
  onToggleOfflineMode: () => void;
  onOpenAiCoach: () => void;
  onOpenExport: () => void;
  onOpenPlanSettings: () => void;
  onOpenInstallGuide: () => void;
  onOpenCheckIn: () => void;
  onOpenMilestones: () => void;
  onToggleSound: () => void;
  onToggleNotifications: () => void;
}

export const SystemHeader: React.FC<SystemHeaderProps> = ({
  userProfile,
  stats,
  isOfflineMode,
  activeTab = 'home',
  onGoHome,
  onToggleOfflineMode,
  onOpenAiCoach,
  onOpenExport,
  onOpenPlanSettings,
  onOpenInstallGuide,
  onOpenCheckIn,
  onOpenMilestones,
  onToggleSound,
  onToggleNotifications,
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const theme = getRankTheme(stats.rank);
  const activeTitle = stats.equippedTitle || stats.title;

  const hpPercent = Math.min(100, Math.max(0, (stats.hp / stats.maxHp) * 100));
  const mpPercent = Math.min(100, Math.max(0, (stats.mp / stats.maxMp) * 100));
  const xpPercent = Math.min(100, Math.max(0, (stats.xp / stats.nextLevelXp) * 100));

  return (
    <header className={`sticky top-0 z-40 w-full bg-[#050814]/95 backdrop-blur-md border-b ${theme.borderClass} shadow-[0_4px_20px_rgba(0,0,0,0.5)]`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Player Identity, Sung Jin-woo Avatar & Rank */}
          <div
            onClick={onGoHome}
            className={`flex items-center gap-2.5 ${onGoHome ? 'cursor-pointer hover:opacity-90 transition' : ''}`}
            title={onGoHome ? 'Click to go to Home Landing Page' : undefined}
          >
            {/* Sung Jin-woo Shadow Monarch Avatar */}
            <div
              className="relative w-10 h-10 rounded-xl overflow-hidden border shadow-md shrink-0"
              style={{ borderColor: theme.primaryColor, boxShadow: `0 0 12px ${theme.glowColor}` }}
            >
              <img
                src={jinwooPortraitImg}
                alt="Sung Jin-woo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-0 right-0 text-[10px] leading-none bg-slate-950/80 px-1 py-0.5 rounded-tl text-cyan-300">⚔️</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-system font-bold text-white tracking-wide text-sm sm:text-base">
                  {userProfile.name}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-system font-black border tracking-wider uppercase ${theme.badgeBg} ${theme.badgeBorder} ${theme.badgeText}`}
                >
                  {stats.rank}
                </span>
                <span className="text-xs font-bold text-cyan-400 font-system bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/30">
                  LV.{stats.level}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-300 font-medium tracking-wide truncate max-w-[200px] sm:max-w-none">
                <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="truncate">"{activeTitle}"</span>
              </div>
            </div>
          </div>

          {/* Middle: Vital Bars (HP / MP / XP) */}
          <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-2">
            {/* HP Bar */}
            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-system text-slate-300 mb-0.5">
                <span className="text-rose-400 font-bold">HP</span>
                <span>{stats.hp} / {stats.maxHp}</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-rose-900/50 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-rose-600 to-red-500 rounded-full transition-all duration-300"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>

            {/* MP Bar */}
            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-system text-slate-300 mb-0.5">
                <span className="text-blue-400 font-bold">MP</span>
                <span>{stats.mp} / {stats.maxMp}</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-blue-900/50 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full transition-all duration-300"
                  style={{ width: `${mpPercent}%` }}
                />
              </div>
            </div>

            {/* XP Bar */}
            <div className="flex-1">
              <div className="flex justify-between text-[10px] font-system text-slate-300 mb-0.5">
                <span className="text-cyan-400 font-bold">XP</span>
                <span>{Math.round(xpPercent)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-900/50 p-0.5">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(0,229,255,0.4)]"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right: Quick Action Controls & Offline/Online Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Return to Home Landing Page Button */}
            {onGoHome && activeTab !== 'home' && (
              <button
                onClick={onGoHome}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900/90 border border-cyan-500/50 text-cyan-300 text-xs font-semibold font-system transition active:scale-95 shadow-[0_0_10px_rgba(0,229,255,0.2)]"
                title="Return to Home Landing Page"
              >
                <Home className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Home</span>
              </button>
            )}

            {/* System Online / Offline Mode Toggle */}
            <button
              onClick={onToggleOfflineMode}
              className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border text-[11px] font-system font-bold transition active:scale-95 ${
                isOfflineMode
                  ? 'bg-purple-950/60 border-purple-500/50 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.25)]'
                  : 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
              }`}
              title={isOfflineMode ? 'Running in Offline Analytical Mode (Click to toggle Cloud Link)' : 'Connected to Neural Cloud Link (Click to toggle Offline Mode)'}
            >
              {isOfflineMode ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">OFFLINE MODE</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">ONLINE LINK</span>
                </>
              )}
            </button>

            {/* Daily Check-In Quick Button */}
            <button
              onClick={onOpenCheckIn}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-semibold font-system transition active:scale-95"
              title="Daily Sleep & Mood Check-In"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Check-In</span>
            </button>

            {/* Milestones & Titles Button */}
            <button
              onClick={onOpenMilestones}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 text-xs font-semibold font-system transition shadow-[0_0_10px_rgba(245,158,11,0.2)] active:scale-95"
              title="Awakening Milestones & Titles"
            >
              <Crown className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Titles</span>
            </button>

            {/* AI Coach Button */}
            <button
              id="header-ai-coach-btn"
              onClick={onOpenAiCoach}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 border border-cyan-400/50 hover:border-cyan-400 text-cyan-200 text-xs font-semibold font-system transition shadow-[0_0_12px_rgba(0,229,255,0.2)] active:scale-95"
              title="System AI Analytical Coach (Sung Jin-woo)"
            >
              <div className="relative">
                <Bot className="w-4 h-4 text-cyan-300" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400" />
              </div>
              <span className="hidden sm:inline">AI Coach</span>
            </button>

            {/* Export Health Data */}
            <button
              id="header-export-btn"
              onClick={onOpenExport}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition text-xs"
              title="Export Health Data (CSV / PDF)"
            >
              <FileText className="w-4 h-4" />
            </button>

            {/* Training Plan Adjustments */}
            <button
              id="header-plan-settings-btn"
              onClick={onOpenPlanSettings}
              className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition text-xs"
              title="Change Training Plan"
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* Push Notifications Toggle */}
            <button
              onClick={onToggleNotifications}
              className={`p-2 rounded-lg border transition text-xs ${
                userProfile.notificationsEnabled
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500'
              }`}
              title={userProfile.notificationsEnabled ? 'Training Notifications: ON' : 'Training Notifications: OFF'}
            >
              {userProfile.notificationsEnabled ? (
                <Bell className="w-4 h-4" />
              ) : (
                <BellOff className="w-4 h-4" />
              )}
            </button>

            {/* Sound SFX Toggle */}
            <button
              onClick={onToggleSound}
              className={`p-2 rounded-lg border transition text-xs ${
                userProfile.soundEnabled
                  ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                  : 'bg-slate-900/60 border-slate-800 text-slate-500'
              }`}
              title={userProfile.soundEnabled ? 'System Audio: ON' : 'System Audio: Muted'}
            >
              {userProfile.soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </button>

            {/* In-App PWA Install */}
            {!isInstalled && (
              <button
                onClick={async () => {
                  if (isInstallable) {
                    const success = await install();
                    if (!success) onOpenInstallGuide();
                  } else {
                    onOpenInstallGuide();
                  }
                }}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-[0_0_10px_rgba(0,229,255,0.3)] active:scale-95"
                title="Install Solo Leveling App"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile View HP / MP / XP Compact Bars */}
        <div className="grid grid-cols-3 gap-2 mt-2 lg:hidden pt-2 border-t border-slate-800/60">
          <div>
            <div className="flex justify-between text-[9px] font-system text-slate-300 mb-0.5">
              <span className="text-rose-400 font-bold">HP</span>
              <span>{stats.hp}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-rose-900/40">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${hpPercent}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[9px] font-system text-slate-300 mb-0.5">
              <span className="text-blue-400 font-bold">MP</span>
              <span>{stats.mp}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-blue-900/40">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${mpPercent}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[9px] font-system text-slate-300 mb-0.5">
              <span className="text-cyan-400 font-bold">XP</span>
              <span>{Math.round(xpPercent)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-900/40">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${xpPercent}%` }} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
