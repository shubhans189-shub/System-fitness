import React from 'react';
import { DailyLog, HunterStats, UserProfile, WeightRecord } from '../types';
import { exportToCSV, printPDFReport, exportBackupJSON } from '../utils/exportData';
import { playStatAllocateSound } from '../utils/soundEffects';
import { FileSpreadsheet, Printer, Download, X, ShieldCheck, Database, Check } from 'lucide-react';

interface ExportModalProps {
  userProfile: UserProfile;
  stats: HunterStats;
  dailyLogs: DailyLog[];
  weightRecords: WeightRecord[];
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  userProfile,
  stats,
  dailyLogs,
  weightRecords,
  onClose,
}) => {
  const handleCSV = () => {
    playStatAllocateSound(userProfile.soundEnabled);
    exportToCSV(userProfile, stats, dailyLogs, weightRecords);
  };

  const handlePDF = () => {
    playStatAllocateSound(userProfile.soundEnabled);
    printPDFReport();
  };

  const handleJSON = () => {
    playStatAllocateSound(userProfile.soundEnabled);
    exportBackupJSON({
      userProfile,
      stats,
      dailyLogs,
      weightRecords,
      exportedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl system-window p-6 text-slate-100 border border-cyan-500/50 shadow-[0_0_40px_rgba(0,229,255,0.2)] my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-cyan-400" />
            <h2 className="font-system text-base sm:text-lg font-bold tracking-wider text-white">
              EXPORT HUNTER HEALTH DATA
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 mb-5">
          Select your desired format to download or archive your physiological metrics, daily quest completion history, and macronutrient targets.
        </p>

        {/* 3 Export Cards */}
        <div className="space-y-3">
          {/* CSV Export */}
          <button
            onClick={handleCSV}
            className="w-full p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-400/60 hover:bg-cyan-950/20 text-left transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <div className="font-system font-bold text-sm text-white flex items-center gap-2">
                  <span>Export to CSV Format</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    .CSV
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Compatible with Microsoft Excel, Google Sheets, Apple Numbers & data analysis.
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition shrink-0" />
          </button>

          {/* PDF / Print Report Export */}
          <button
            onClick={handlePDF}
            className="w-full p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-400/60 hover:bg-cyan-950/20 text-left transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 group-hover:scale-105 transition">
                <Printer className="w-6 h-6" />
              </div>
              <div>
                <div className="font-system font-bold text-sm text-white flex items-center gap-2">
                  <span>Export / Print to PDF Format</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40">
                    .PDF
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Official formatted Solo Leveling Hunter Dossier for your physician or personal records.
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition shrink-0" />
          </button>

          {/* Raw JSON Backup */}
          <button
            onClick={handleJSON}
            className="w-full p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-cyan-400/60 hover:bg-cyan-950/20 text-left transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 group-hover:scale-105 transition">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <div className="font-system font-bold text-sm text-white flex items-center gap-2">
                  <span>Export Complete JSON Backup</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/40">
                    .JSON
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Full raw encrypted backup to restore onto other devices seamlessly.
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition shrink-0" />
          </button>
        </div>

        {/* Data Security Notice */}
        <div className="mt-5 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20 flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>All health metrics are processed locally in your browser sandbox with zero tracking.</span>
        </div>

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:text-white text-xs font-system"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
