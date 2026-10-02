import { HunterRank } from '../types';

export interface RankThemeConfig {
  rank: HunterRank;
  key: string;
  name: string;
  primaryColor: string; // Hex
  secondaryColor: string;
  glowColor: string; // rgba
  borderClass: string;
  textClass: string;
  bgGlowClass: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  gradientButton: string;
  auraDescription: string;
}

export const RANK_THEMES: Record<HunterRank, RankThemeConfig> = {
  'E-Rank': {
    rank: 'E-Rank',
    key: 'e-rank',
    name: 'Awakened Novice (Verdant Green)',
    primaryColor: '#22c55e',
    secondaryColor: '#16a34a',
    glowColor: 'rgba(34, 197, 94, 0.4)',
    borderClass: 'border-emerald-500/50',
    textClass: 'text-emerald-400',
    bgGlowClass: 'shadow-[0_0_30px_rgba(34,197,94,0.2)]',
    badgeBg: 'bg-emerald-950/70',
    badgeBorder: 'border-emerald-500/60',
    badgeText: 'text-emerald-300',
    gradientButton: 'from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-slate-950',
    auraDescription: 'Verdant Life Vitality — The beginning of the awakening journey.',
  },
  'D-Rank': {
    rank: 'D-Rank',
    key: 'd-rank',
    name: 'Hardened Hunter (Electric Cyan)',
    primaryColor: '#06b6d4',
    secondaryColor: '#0891b2',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    borderClass: 'border-cyan-500/50',
    textClass: 'text-cyan-400',
    bgGlowClass: 'shadow-[0_0_30px_rgba(6,182,212,0.2)]',
    badgeBg: 'bg-cyan-950/70',
    badgeBorder: 'border-cyan-500/60',
    badgeText: 'text-cyan-300',
    gradientButton: 'from-cyan-500 to-teal-600 hover:from-cyan-400 hover:to-teal-500 text-slate-950',
    auraDescription: 'Electric Mana Surge — Muscle fibers begin hardening beyond human limits.',
  },
  'C-Rank': {
    rank: 'C-Rank',
    key: 'c-rank',
    name: 'Raid Striker (Deep Cobalt Blue)',
    primaryColor: '#3b82f6',
    secondaryColor: '#2563eb',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    borderClass: 'border-blue-500/50',
    textClass: 'text-blue-400',
    bgGlowClass: 'shadow-[0_0_30px_rgba(59,130,246,0.2)]',
    badgeBg: 'bg-blue-950/70',
    badgeBorder: 'border-blue-500/60',
    badgeText: 'text-blue-300',
    gradientButton: 'from-blue-500 to-indigo-600 hover:from-blue-400 hover:to-indigo-500 text-white',
    auraDescription: 'Cobalt Resonance — Capable of clearing intermediate dungeon gates.',
  },
  'B-Rank': {
    rank: 'B-Rank',
    key: 'b-rank',
    name: 'Dungeon Master (Mystic Indigo)',
    primaryColor: '#6366f1',
    secondaryColor: '#4f46e5',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    borderClass: 'border-indigo-500/50',
    textClass: 'text-indigo-400',
    bgGlowClass: 'shadow-[0_0_30px_rgba(99,102,241,0.2)]',
    badgeBg: 'bg-indigo-950/70',
    badgeBorder: 'border-indigo-500/60',
    badgeText: 'text-indigo-300',
    gradientButton: 'from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white',
    auraDescription: 'Mystic Indigo Aura — Physical endurance surpasses ordinary guild standards.',
  },
  'A-Rank': {
    rank: 'A-Rank',
    key: 'a-rank',
    name: 'Apex Vanguard (Royal Arcane Purple)',
    primaryColor: '#a855f7',
    secondaryColor: '#9333ea',
    glowColor: 'rgba(168, 85, 247, 0.45)',
    borderClass: 'border-purple-500/60',
    textClass: 'text-purple-400',
    bgGlowClass: 'shadow-[0_0_35px_rgba(168,85,247,0.25)]',
    badgeBg: 'bg-purple-950/80',
    badgeBorder: 'border-purple-500/70',
    badgeText: 'text-purple-300',
    gradientButton: 'from-purple-500 to-fuchsia-600 hover:from-purple-400 hover:to-fuchsia-500 text-white',
    auraDescription: 'Royal Arcane Power — Vanguard status capable of red-gate survival.',
  },
  'S-Rank': {
    rank: 'S-Rank',
    key: 's-rank',
    name: 'Living Catastrophe (Radiant Solar Gold)',
    primaryColor: '#eab308',
    secondaryColor: '#d97706',
    glowColor: 'rgba(234, 179, 8, 0.5)',
    borderClass: 'border-amber-400/70',
    textClass: 'text-amber-300',
    bgGlowClass: 'shadow-[0_0_40px_rgba(234,179,8,0.35)]',
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-400/80',
    badgeText: 'text-amber-200',
    gradientButton: 'from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 font-black',
    auraDescription: 'Radiant Solar Gold — A walking natural disaster with god-like physical prowess.',
  },
  'National Level': {
    rank: 'National Level',
    key: 'national-level',
    name: 'World Sovereign (Solar Flame Crimson)',
    primaryColor: '#f97316',
    secondaryColor: '#ef4444',
    glowColor: 'rgba(249, 115, 22, 0.5)',
    borderClass: 'border-orange-500/70',
    textClass: 'text-orange-400',
    bgGlowClass: 'shadow-[0_0_40px_rgba(249,115,22,0.35)]',
    badgeBg: 'bg-orange-950/80',
    badgeBorder: 'border-orange-500/80',
    badgeText: 'text-orange-200',
    gradientButton: 'from-orange-500 via-rose-600 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black',
    auraDescription: 'Solar Flame Crimson — Sovereign authority recognized on global scale.',
  },
  'Shadow Monarch': {
    rank: 'Shadow Monarch',
    key: 'shadow-monarch',
    name: 'Shadow Monarch (Abyssal Violet & Neon Blue)',
    primaryColor: '#c084fc',
    secondaryColor: '#00e5ff',
    glowColor: 'rgba(192, 132, 252, 0.55)',
    borderClass: 'border-violet-500/80',
    textClass: 'text-violet-300',
    bgGlowClass: 'shadow-[0_0_45px_rgba(192,132,252,0.4)]',
    badgeBg: 'bg-gradient-to-r from-violet-950/90 to-cyan-950/90',
    badgeBorder: 'border-violet-400/80',
    badgeText: 'text-cyan-200',
    gradientButton: 'from-violet-600 via-purple-600 to-cyan-400 hover:from-violet-500 hover:to-cyan-300 text-slate-950 font-black',
    auraDescription: 'Abyssal Void Monarch — Master of Shadows, death, and infinite regeneration.',
  },
};

export function getRankTheme(rank: HunterRank): RankThemeConfig {
  return RANK_THEMES[rank] || RANK_THEMES['E-Rank'];
}
