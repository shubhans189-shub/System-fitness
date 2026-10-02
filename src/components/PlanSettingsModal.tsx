import React, { useState } from 'react';
import { TrainingPlan, UserProfile } from '../types';
import { DEFAULT_PLANS } from '../utils/fitnessCalculations';
import { playRepCountSound, playStatAllocateSound } from '../utils/soundEffects';
import { X, Check, Dumbbell, Shield, Sparkles, Plus, Trash2 } from 'lucide-react';

interface PlanSettingsModalProps {
  currentPlanId: string;
  userProfile: UserProfile;
  onSelectPlan: (plan: TrainingPlan) => void;
  onClose: () => void;
}

export const PlanSettingsModal: React.FC<PlanSettingsModalProps> = ({
  currentPlanId,
  userProfile,
  onSelectPlan,
  onClose,
}) => {
  const [selectedId, setSelectedId] = useState<string>(currentPlanId);
  const [isCustomMode, setIsCustomMode] = useState<boolean>(currentPlanId === 'custom');

  // Custom exercises state
  const [customExercises, setCustomExercises] = useState([
    { id: 'pushups', name: 'Push-ups', target: 50, unit: 'reps', statReward: 'str' as const, xpReward: 60 },
    { id: 'situps', name: 'Sit-ups', target: 50, unit: 'reps', statReward: 'vit' as const, xpReward: 60 },
    { id: 'squats', name: 'Squats', target: 50, unit: 'reps', statReward: 'str' as const, xpReward: 60 },
    { id: 'running', name: 'Running', target: 5, unit: 'km', statReward: 'agi' as const, xpReward: 80 },
  ]);

  const [newExName, setNewExName] = useState('');
  const [newExTarget, setNewExTarget] = useState(25);
  const [newExUnit, setNewExUnit] = useState('reps');

  const handleApply = () => {
    playStatAllocateSound(userProfile.soundEnabled);
    if (isCustomMode) {
      const customPlan: TrainingPlan = {
        id: 'custom',
        name: 'Custom Hunter Protocol',
        subtitle: 'Personalized Hunter Calibration',
        rankRequirement: 'E-Rank',
        description: 'Bespoke daily physical routine configured by the Player.',
        exercises: customExercises,
      };
      onSelectPlan(customPlan);
    } else {
      const chosen = DEFAULT_PLANS.find((p) => p.id === selectedId) || DEFAULT_PLANS[1];
      onSelectPlan(chosen);
    }
    onClose();
  };

  const addCustomExercise = () => {
    if (!newExName.trim()) return;
    playRepCountSound(userProfile.soundEnabled);
    setCustomExercises((prev) => [
      ...prev,
      {
        id: `custom_${Date.now()}`,
        name: newExName.trim(),
        target: Number(newExTarget) || 20,
        unit: newExUnit,
        statReward: 'str',
        xpReward: 50,
      },
    ]);
    setNewExName('');
  };

  const removeCustomExercise = (id: string) => {
    playRepCountSound(userProfile.soundEnabled);
    setCustomExercises((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl system-window p-6 text-slate-100 border border-cyan-500/50 shadow-[0_0_40px_rgba(0,229,255,0.2)] my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/30 pb-3 mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-cyan-400" />
            <h2 className="font-system text-lg sm:text-xl font-bold tracking-wider text-white">
              CHANGE TRAINING PROTOCOL
            </h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab selector between Preset & Custom */}
        <div className="flex gap-2 mb-4 shrink-0">
          <button
            onClick={() => {
              playRepCountSound(userProfile.soundEnabled);
              setIsCustomMode(false);
            }}
            className={`flex-1 py-2 text-xs font-system font-bold rounded-lg border transition ${
              !isCustomMode
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            SYSTEM PRESETS
          </button>
          <button
            onClick={() => {
              playRepCountSound(userProfile.soundEnabled);
              setIsCustomMode(true);
            }}
            className={`flex-1 py-2 text-xs font-system font-bold rounded-lg border transition ${
              isCustomMode
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            CUSTOM PROTOCOL BUILDER
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto pr-1 space-y-3 flex-1">
          {!isCustomMode ? (
            /* PRESET PLANS LIST */
            DEFAULT_PLANS.map((plan) => {
              const isSelected = selectedId === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => {
                    playRepCountSound(userProfile.soundEnabled);
                    setSelectedId(plan.id);
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <h3 className="font-system font-bold text-sm sm:text-base text-white">
                        {plan.name}
                      </h3>
                      <span className="text-xs text-cyan-300 font-medium">{plan.subtitle}</span>
                    </div>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold">
                        <Check className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 mb-3">{plan.description}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    {plan.exercises.map((ex) => (
                      <div key={ex.id} className="bg-slate-900/90 p-2 rounded-lg border border-slate-800">
                        <div className="text-slate-400 text-[11px]">{ex.name}</div>
                        <div className="font-system font-bold text-cyan-200">
                          {ex.target} {ex.unit}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            /* CUSTOM PROTOCOL CONFIG */
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                Craft your individualized workout targets. Modify reps, kilometers, or insert new exercises.
              </p>

              <div className="space-y-2">
                {customExercises.map((ex, idx) => (
                  <div
                    key={ex.id}
                    className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3"
                  >
                    <span className="font-system font-bold text-sm text-white">{ex.name}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="1"
                        max="1000"
                        value={ex.target}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setCustomExercises((prev) =>
                            prev.map((item, i) => (i === idx ? { ...item, target: val } : item))
                          );
                        }}
                        className="w-20 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-system font-bold text-right text-xs focus:outline-none focus:border-cyan-400"
                      />
                      <span className="text-xs text-slate-400 w-10">{ex.unit}</span>
                      {customExercises.length > 1 && (
                        <button
                          onClick={() => removeCustomExercise(ex.id)}
                          className="text-slate-500 hover:text-rose-400 transition p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add New Custom Exercise */}
              <div className="p-3 rounded-xl bg-slate-900/60 border border-dashed border-cyan-500/40 space-y-2">
                <span className="text-xs font-system font-bold text-cyan-300">ADD EXERCISE TO DAILY PROTOCOL:</span>
                <div className="flex flex-wrap gap-2">
                  <input
                    type="text"
                    placeholder="Exercise (e.g. Pull-ups, Planks)"
                    value={newExName}
                    onChange={(e) => setNewExName(e.target.value)}
                    className="flex-1 min-w-[140px] px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Target"
                    value={newExTarget}
                    onChange={(e) => setNewExTarget(Number(e.target.value))}
                    className="w-20 px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  />
                  <select
                    value={newExUnit}
                    onChange={(e) => setNewExUnit(e.target.value)}
                    className="px-2 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                  >
                    <option value="reps">reps</option>
                    <option value="km">km</option>
                    <option value="sec">sec</option>
                    <option value="mins">mins</option>
                  </select>
                  <button
                    type="button"
                    onClick={addCustomExercise}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs font-system transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-cyan-500/20 mt-4 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:text-white text-xs font-system"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold font-system text-xs transition shadow-[0_0_15px_rgba(0,229,255,0.4)]"
          >
            Activate Selected Protocol
          </button>
        </div>
      </div>
    </div>
  );
};
