import React, { useState } from 'react';
import { DailyLog, HunterStats, UserProfile, WeightRecord } from '../types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { TrendingUp, BarChart3, Scale, Activity, Plus, Award } from 'lucide-react';
import { playStatAllocateSound } from '../utils/soundEffects';

interface AnalyticsViewProps {
  userProfile: UserProfile;
  stats: HunterStats;
  dailyLogs: DailyLog[];
  weightRecords: WeightRecord[];
  onLogWeight: (newWeightKg: number) => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  userProfile,
  stats,
  dailyLogs,
  weightRecords,
  onLogWeight,
}) => {
  const [newWeightInput, setNewWeightInput] = useState<string>('');
  const [showWeightDialog, setShowWeightDialog] = useState<boolean>(false);

  const handleSaveWeight = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(newWeightInput);
    if (!isNaN(val) && val > 20 && val < 300) {
      playStatAllocateSound(userProfile.soundEnabled);
      onLogWeight(val);
      setNewWeightInput('');
      setShowWeightDialog(false);
    }
  };

  // Generate radar data for hunter attributes
  const radarData = [
    { subject: 'STR (Strength)', value: stats.str, fullMark: 100 },
    { subject: 'AGI (Agility)', value: stats.agi, fullMark: 100 },
    { subject: 'VIT (Vitality)', value: stats.vit, fullMark: 100 },
    { subject: 'INT (Intellect)', value: stats.int, fullMark: 100 },
    { subject: 'PER (Perception)', value: stats.per, fullMark: 100 },
  ];

  // Format data for workout history
  const chartLogs = dailyLogs.slice(-14).map((log) => ({
    date: log.date.slice(5), // MM-DD
    Pushups: log.pushups,
    Situps: log.situps,
    Squats: log.squats,
    RunningKm: log.runningKm,
    CompletionRate: log.completionRate,
    WaterMl: log.waterMl,
  }));

  // Weight progression chart data
  const weightChartData = weightRecords.slice(-14).map((wr) => ({
    date: wr.date.slice(5),
    weight: wr.weightKg,
  }));

  return (
    <div className="w-full rounded-2xl system-window p-5 sm:p-6 text-slate-100 border border-cyan-500/40 shadow-[0_0_30px_rgba(0,229,255,0.15)] space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/30 pb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-cyan-400" />
          <h2 className="font-system text-lg sm:text-xl font-bold tracking-wider text-white">
            HUNTER PROGRESSION & ANALYTICS
          </h2>
        </div>

        <button
          onClick={() => setShowWeightDialog(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 font-system text-xs font-bold transition shadow-[0_0_10px_rgba(0,229,255,0.2)]"
        >
          <Scale className="w-4 h-4" />
          <span>Log Current Weight</span>
        </button>
      </div>

      {/* Weight Log Modal */}
      {showWeightDialog && (
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/50 shadow-xl">
          <form onSubmit={handleSaveWeight} className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-system font-bold text-cyan-300">LOG TODAY'S WEIGHT (KG):</span>
            <input
              type="number"
              step="0.1"
              min="30"
              max="250"
              value={newWeightInput}
              onChange={(e) => setNewWeightInput(e.target.value)}
              placeholder="e.g. 73.5"
              className="px-3 py-1.5 rounded-lg bg-slate-900 border border-cyan-500/40 text-white text-xs font-system font-bold focus:outline-none focus:border-cyan-400 w-28"
              required
            />
            <button
              type="submit"
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-system font-bold text-xs transition"
            >
              Update Weight
            </button>
            <button
              type="button"
              onClick={() => setShowWeightDialog(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 text-xs"
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Top 2-Column Analytics: Volume & Radar Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Daily Exercise Volume Chart */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="font-system font-bold text-xs sm:text-sm text-cyan-300 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4" />
              <span>DAILY EXERCISE VOLUME (REPS)</span>
            </span>
            <span className="text-xs text-slate-400 font-system">Past 14 Days</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#050814',
                    borderColor: '#00e5ff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Pushups" fill="#00e5ff" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Situps" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Squats" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Hunter Attribute Matrix Radar */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <span className="font-system font-bold text-xs sm:text-sm text-cyan-300 flex items-center gap-1.5">
              <Award className="w-4 h-4" />
              <span>HUNTER ATTRIBUTES RADAR (STR / AGI / VIT / INT / PER)</span>
            </span>
            <span className="text-xs text-slate-400 font-system">Level {stats.level}</span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <PolarRadiusAxis stroke="#334155" />
                <Radar
                  name="Player Stats"
                  dataKey="value"
                  stroke="#00e5ff"
                  fill="#00e5ff"
                  fillOpacity={0.4}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#050814',
                    borderColor: '#00e5ff',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom 2-Column Analytics: Running Distance & Weight Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Running Progression & Quest Completion Rate */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="font-system font-bold text-xs sm:text-sm text-cyan-300 flex items-center gap-1.5">
              <Activity className="w-4 h-4" />
              <span>RUNNING DISTANCE & COMPLETION RATE</span>
            </span>
            <span className="text-xs text-emerald-400 font-system">Cardio Aerobics</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartLogs} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#050814',
                    borderColor: '#10b981',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Line
                  type="monotone"
                  dataKey="RunningKm"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={{ fill: '#10b981', r: 3 }}
                  name="Distance (km)"
                />
                <Line
                  type="monotone"
                  dataKey="CompletionRate"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  name="Completion %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Body Weight Progression */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="font-system font-bold text-xs sm:text-sm text-cyan-300 flex items-center gap-1.5">
              <Scale className="w-4 h-4" />
              <span>BODY WEIGHT PROGRESSION (KG)</span>
            </span>
            <span className="text-xs text-slate-400 font-system">Target: {userProfile.targetWeightKg}kg</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis stroke="#64748b" domain={['dataMin - 2', 'dataMax + 2']} tick={{ fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#050814',
                    borderColor: '#f59e0b',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: '#f59e0b', r: 4 }}
                  name="Weight (kg)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
