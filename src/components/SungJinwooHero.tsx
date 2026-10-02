import React, { useState } from 'react';
import { HunterStats, UserProfile } from '../types';
import jinwooMonarchImg from '../assets/images/jinwoo_monarch_1789901648447.jpg';
import jinwooPortraitImg from '../assets/images/jinwoo_portrait_1789901630204.jpg';
import { SYSTEM_QUOTES } from '../utils/quotes';
import { Sparkles, Quote, RefreshCw, Flame, Shield, Award, Crown, Zap } from 'lucide-react';
import { playRepCountSound } from '../utils/soundEffects';

interface SungJinwooHeroProps {
  stats: HunterStats;
  userProfile: UserProfile;
  allQuestsCompleted: boolean;
  caloriesConsumedToday?: number;
}

export const SungJinwooHero: React.FC<SungJinwooHeroProps> = ({
  stats,
  userProfile,
  allQuestsCompleted,
  caloriesConsumedToday = 0,
}) => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  const nextQuote = () => {
    playRepCountSound(userProfile.soundEnabled);
    setQuoteIndex((prev) => (prev + 1) % SYSTEM_QUOTES.length);
  };

  const activeQuote = SYSTEM_QUOTES[quoteIndex % SYSTEM_QUOTES.length] || SYSTEM_QUOTES[0];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-cyan-500/40 shadow-[0_0_35px_rgba(0,229,255,0.2)] bg-[#050814] group transition-all duration-500">
      
      {/* Background Cinematic Visual Showcase */}
      <div className="relative h-56 sm:h-64 md:h-72 w-full overflow-hidden bg-slate-950">
        <img
          src={jinwooMonarchImg}
          alt="Sung Jin-woo Shadow Monarch"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#050814]/65 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050814]/90 via-transparent to-[#050814]/70 pointer-events-none" />

        {/* Floating Top Bar: Protocol Tag & System Status */}
        <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex flex-wrap items-center justify-between gap-2 z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-950/85 border border-cyan-400/60 text-cyan-300 font-system font-black text-[10px] tracking-widest uppercase shadow-[0_0_15px_rgba(0,229,255,0.35)] flex items-center gap-1.5">
              <span>⚔️</span>
              <span>SHADOW MONARCH AWAKENING // THE SYSTEM</span>
            </span>

            {allQuestsCompleted && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/90 border border-emerald-500/70 text-emerald-300 font-system font-bold text-[10px] uppercase shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                DAILY QUEST CONQUERED
              </span>
            )}
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-slate-950/85 border border-cyan-500/30 text-[11px] font-system text-cyan-300 backdrop-blur-md flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>NEURAL SYNC 100%</span>
          </div>
        </div>

        {/* Bottom Hero Overlay: Sung Jin-woo Avatar & Player Bio */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-end gap-3 sm:gap-4 z-10">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,229,255,0.5)] shrink-0 bg-slate-900">
            <img
              src={jinwooPortraitImg}
              alt="Sung Jin-woo Portrait"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-0 right-0 text-[10px] leading-none bg-slate-950/85 px-1 py-0.5 rounded-tl text-cyan-300">⚔️</span>
          </div>

          <div className="pb-0.5">
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-black font-system text-white tracking-wide drop-shadow-md">
                {userProfile.name}
              </h2>
              <span className="px-2 py-0.5 rounded font-system font-black text-xs uppercase shadow-md bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.5)]">
                {stats.rank}
              </span>
            </div>
            <p className="text-xs font-system font-semibold tracking-wider drop-shadow flex items-center gap-1.5 mt-0.5">
              <span className="text-cyan-300">LEVEL {stats.level}</span>
              <span className="text-slate-400">•</span>
              <span className="text-amber-300">"{stats.equippedTitle || stats.title}"</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quote Banner & Daily Metrics Summary Bar */}
      <div className="p-3.5 sm:p-4 bg-slate-950/95 border-t border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5 flex-1 min-w-0">
          <Quote className="w-4 h-4 shrink-0 mt-0.5 opacity-90 text-cyan-400" />
          
          <div className="text-xs flex-1 min-w-0">
            <p className="italic text-slate-200 font-sans text-xs sm:text-sm leading-relaxed">
              "{activeQuote.quote}"
            </p>
            <p className="font-system font-bold text-[11px] mt-0.5 text-cyan-400">
              — {activeQuote.author}
            </p>
          </div>

          <button
            onClick={nextQuote}
            className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-700/80 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 transition shrink-0 ml-1 active:scale-95"
            title="Next inspirational quote"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Hunter Status Pills */}
        <div className="flex items-center gap-2 text-xs font-system font-bold shrink-0 self-end md:self-center">
          <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-slate-300">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Streak: {stats.dailyStreak}d</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-slate-300">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Points: {stats.availablePoints}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
