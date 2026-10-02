import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, AlertTriangle, Sparkles, X, Activity, Flame, Shield, ArrowRight, Volume2, VolumeX, Eye } from 'lucide-react';
import { playRepCountSound, playQuestCompleteSound } from '../utils/soundEffects';

export interface ExerciseFormGuide {
  id: string;
  name: string;
  codename: string;
  category: string;
  targetMuscles: string[];
  secondaryMuscles: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Monarch';
  tempo: string;
  breathing: string;
  setupCues: string[];
  executionCues: string[];
  commonMistakes: string[];
  hunterDirective: string;
}

export const EXERCISE_GUIDES: Record<string, ExerciseFormGuide> = {
  pushups: {
    id: 'pushups',
    name: 'Hunter Standard Push-Ups',
    codename: 'PECTORAL HYPER-DRIVE',
    category: 'Upper Body Pushing & Core Rigidity',
    targetMuscles: ['Pectoralis Major', 'Triceps Brachii', 'Anterior Deltoids'],
    secondaryMuscles: ['Rectus Abdominis', 'Serratus Anterior', 'Glutes'],
    difficulty: 'Intermediate',
    tempo: '2-0-1 (2s Lower, 0s Pause, 1s Explode)',
    breathing: 'Inhale through nose on descent; exhale forcefully through mouth as you press up.',
    setupCues: [
      'Place hands slightly wider than shoulder-width apart on the floor with fingers splayed.',
      'Establish a rigid high plank line: squeeze glutes, brace abdominals, and retract scapulae slightly.',
      'Keep head neutral by gazing 6 inches ahead of your fingertips, not tucked into your chest.',
    ],
    executionCues: [
      'Descend by tucking elbows at a 45-degree arrow angle relative to your ribs (avoid 90° T-flaring).',
      'Lower your entire body until your chest hovers 1 inch off the floor or lightly touches down.',
      'Drive powerfully through your palms, spreading the floor apart until arms reach full lockout.',
    ],
    commonMistakes: [
      'Flaring elbows out at 90° which shears the rotator cuff and impinges shoulders.',
      'Sagging hips or piking buttocks, breaking core tension and straining the lumbar spine.',
      'Half-reps: Failing to descend past halfway, cutting pectoral recruitment by 60%.',
    ],
    hunterDirective: '"Sung Jin-woo did not stop when fatigue set in. Every millimeter of chest depth builds armor against red-gate beasts."',
  },
  squats: {
    id: 'squats',
    name: 'Sovereign Deep Squats',
    codename: 'TITAN PILLAR EXPANSION',
    category: 'Lower Body Compound & Hip Mobility',
    targetMuscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings'],
    secondaryMuscles: ['Core Stabilizers', 'Adductors', 'Erector Spinae'],
    difficulty: 'Intermediate',
    tempo: '3-1-1 (3s Controlled Descent, 1s Deep Pause, 1s Drive)',
    breathing: 'Deep diaphragmatic inhale into your stomach at the top; exhale on the upward ascent.',
    setupCues: [
      'Stand with feet shoulder-width apart, toes flared slightly outwards at 15 to 30 degrees.',
      'Root your feet into the earth like tripods: big toe, pinky toe, and heel firmly planted.',
      'Chest proud, ribs pulled down into pelvis, gaze forward into the horizon.',
    ],
    executionCues: [
      'Initiate descent by hinging hips backward while simultaneously bending knees outward.',
      'Track knees directly in line with your 2nd and 3rd toes, preventing knee valgus collapse.',
      'Break parallel: descend until hip crease dips just below the top of the patella.',
      'Drive aggressively through mid-foot and heels to stand tall, squeezing glutes at the peak.',
    ],
    commonMistakes: [
      'Knees collapsing inward (valgus fault), which causes intense patellofemoral friction.',
      'Rising onto tiptoes due to tight ankle dorsiflexion, overloading the knee joint.',
      'Excessive forward spinal flexion ("good morning squat") instead of keeping the torso proud.',
    ],
    hunterDirective: '"The foundation of the Shadow Monarch rests upon unbreakable legs. Sink below parallel and conquer the earth."',
  },
  situps: {
    id: 'situps',
    name: 'Hunter Core Sit-Ups',
    codename: 'ABYSSAL CORE FORGE',
    category: 'Trunk Flexion & Spinal Articulation',
    targetMuscles: ['Rectus Abdominis', 'Transverse Abdominis'],
    secondaryMuscles: ['Hip Flexors (Iliopsoas)', 'Obliques'],
    difficulty: 'Beginner',
    tempo: '2-1-2 (2s Roll Up, 1s Contraction Peak, 2s Descent)',
    breathing: 'Inhale at the bottom flat position; exhale completely as your chest meets your knees.',
    setupCues: [
      'Lie flat on your back with knees bent at approximately 90 degrees and feet flat on the floor.',
      'Cross your arms across your chest, or touch your fingertips lightly behind your temples.',
      'Never interlace fingers behind the cervical spine to avoid pulling your neck.',
    ],
    executionCues: [
      'Flatten lower back into the ground (posterior pelvic tilt) to pre-activate the deep core.',
      'Roll your torso upwards vertebra by vertebra, peeling shoulder blades followed by mid-back.',
      'Ascend until your chest is near your thighs, squeezing abdominals hard at the summit.',
      'Control the descent: do not simply collapse backward; resist gravity on the way down.',
    ],
    commonMistakes: [
      'Yanking violently on the neck with hands, transferring stress from abs into cervical discs.',
      'Relying entirely on hip flexors and momentum rather than spinal abdominal flexion.',
      'Letting feet lift off the floor repeatedly throughout the set.',
    ],
    hunterDirective: '"A fractured core shatters under dungeon pressure. Weld your midsection with disciplined, deliberate contractions."',
  },
  running: {
    id: 'running',
    name: 'Hunter High-Cadence Running',
    codename: 'LIGHTNING STRIDE 10KM',
    category: 'Cardiovascular Endurance & Aerobic Stamina',
    targetMuscles: ['Cardiovascular System', 'Gastrocnemius & Soleus', 'Quadriceps'],
    secondaryMuscles: ['Hamstrings', 'Glutes', 'Core Stabilizers'],
    difficulty: 'Advanced',
    tempo: '170–180 Steps Per Minute (SPM) Cadence',
    breathing: 'Rhythmic 2:2 or 3:3 stride pattern (2 steps inhale, 2 steps exhale).',
    setupCues: [
      'Maintain an upright, tall posture with a subtle 5-degree forward lean from the ankles, not the hips.',
      'Relax shoulders downward away from your ears; keep elbows bent at 90 degrees.',
      'Hands relaxed in loose fists like holding potato chips without breaking them.',
    ],
    executionCues: [
      'Land softly on your midfoot directly underneath your center of mass, never reaching out ahead.',
      'Maintain a swift, compact turnover aiming for 170 to 180 foot strikes per minute.',
      'Drive arms backward in a linear pendulum motion without crossing the midline of your chest.',
    ],
    commonMistakes: [
      'Overstriding: landing on a locked heel ahead of the body, acting as a brake on every stride.',
      'Slouching the chest forward, compressing the lungs and cutting oxygen uptake by 25%.',
      'Clenching fists and holding breath during uphill or fatigue phases.',
    ],
    hunterDirective: '"10 kilometers daily. Rain, heat, or darkness—the penalty zone shows no mercy to those who stop running."',
  },
};

interface ExerciseDemoModalProps {
  exerciseId: string;
  soundEnabled?: boolean;
  onClose: () => void;
}

export const ExerciseDemoModal: React.FC<ExerciseDemoModalProps> = ({
  exerciseId,
  soundEnabled = true,
  onClose,
}) => {
  const normalizedId = exerciseId.toLowerCase().replace(/[^a-z]/g, '');
  let guideKey = 'pushups';
  if (normalizedId.includes('squat')) guideKey = 'squats';
  else if (normalizedId.includes('situp') || normalizedId.includes('core')) guideKey = 'situps';
  else if (normalizedId.includes('run')) guideKey = 'running';

  const guide = EXERCISE_GUIDES[guideKey] || EXERCISE_GUIDES['pushups'];

  // Animation player state
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [playSpeed, setPlaySpeed] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'form' | 'mistakes' | 'practice'>('form');

  // Interactive practice rep counter
  const [practiceReps, setPracticeReps] = useState<number>(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated looping canvas clip
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      // Dark sci-fi background grid
      ctx.fillStyle = '#060a17';
      ctx.fillRect(0, 0, w, h);

      ctx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // Draw Floor line
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.4)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(30, h - 35);
      ctx.lineTo(w - 30, h - 35);
      ctx.stroke();

      // Motion phase math (0 to 1 smooth sine wave)
      const phase = (Math.sin(t) + 1) / 2; // 0 = start/up, 1 = bottom/flexed

      if (guide.id === 'pushups') {
        // PUSH-UP ANIMATION
        const floorY = h - 35;
        const footX = w * 0.22;
        const handX = w * 0.72;
        const handY = floorY;

        // Shoulder height dips with phase
        const shoulderY = floorY - 60 + phase * 42; // dips down towards floor
        const shoulderX = handX - 5;
        const hipY = floorY - 50 + phase * 32;
        const hipX = w * 0.48;

        // Draw Glow Shadow Silhouette
        ctx.save();
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 12;

        // Draw Torso & Legs line
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Feet to Hip
        ctx.beginPath();
        ctx.moveTo(footX, floorY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        // Arms (Shoulder to Elbow to Hand)
        const elbowX = shoulderX - 18 + phase * 8;
        const elbowY = shoulderY + (handY - shoulderY) * 0.55 + phase * 6;

        ctx.strokeStyle = '#fbbf24'; // Arms in gold
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY);
        ctx.lineTo(elbowX, elbowY);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(shoulderX + 16, shoulderY - 8, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        // Indicator tags on canvas
        ctx.fillStyle = phase > 0.8 ? '#22c55e' : '#00e5ff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(phase > 0.8 ? '● BOTTOM CHEST DEPTH' : '▲ TOP LOCKOUT PHASE', 30, 30);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        const elbowAngle = Math.round(160 - phase * 75);
        ctx.fillText(`ELBOW ANGLE: ${elbowAngle}° (Arrow Path)`, 30, 48);

      } else if (guide.id === 'squats') {
        // SQUAT ANIMATION
        const floorY = h - 35;
        const ankleX = w * 0.5;
        const ankleY = floorY;

        // Hip drops down and back
        const hipY = floorY - 95 + phase * 58;
        const hipX = w * 0.5 - 20 - phase * 16;

        // Knee bends forward slightly
        const kneeX = ankleX + 16 + phase * 8;
        const kneeY = floorY - 50 + phase * 22;

        // Torso & head
        const shoulderX = hipX + 18 + phase * 12;
        const shoulderY = hipY - 60 + phase * 8;

        ctx.save();
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 12;

        // Lower body
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ankleX, ankleY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(hipX, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(shoulderX + 4, shoulderY - 14, 11, 0, Math.PI * 2);
        ctx.fill();

        // Arms stretched out in front for balance
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(shoulderX, shoulderY + 8);
        ctx.lineTo(shoulderX + 35, shoulderY + 8);
        ctx.stroke();

        ctx.restore();

        ctx.fillStyle = phase > 0.85 ? '#22c55e' : '#00e5ff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(phase > 0.85 ? '● BELOW PARALLEL DEPTH' : '▲ STANDING FULL EXTENSION', 30, 30);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        const kneeAngle = Math.round(170 - phase * 85);
        ctx.fillText(`KNEE JOINT ANGLE: ${kneeAngle}°`, 30, 48);

      } else if (guide.id === 'situps') {
        // SIT-UP ANIMATION
        const floorY = h - 35;
        const footX = w * 0.72;
        const footY = floorY;
        const kneeX = w * 0.60;
        const kneeY = floorY - 35;
        const hipX = w * 0.42;
        const hipY = floorY;

        // Torso articulates from 0° (flat on floor) to 65° upright
        const torsoAngle = (1 - phase) * (Math.PI * 0.38); // 0 = flat, upright ~65 deg
        const torsoLen = 58;
        const shoulderX = hipX - Math.cos(torsoAngle) * torsoLen;
        const shoulderY = hipY - Math.sin(torsoAngle) * torsoLen;

        ctx.save();
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 12;

        // Legs
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(footX, footY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(hipX, hipY);
        ctx.stroke();

        // Torso
        ctx.strokeStyle = '#a855f7';
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(shoulderX, shoulderY);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(shoulderX - Math.cos(torsoAngle) * 12, shoulderY - Math.sin(torsoAngle) * 12, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        ctx.fillStyle = phase < 0.15 ? '#22c55e' : '#a855f7';
        ctx.font = 'bold 11px monospace';
        ctx.fillText(phase < 0.15 ? '● PEAK CORE CONTRACTION' : '▼ CONTROLLED ECCENTRIC RETURN', 30, 30);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText(`SPINAL FLEXION: ${Math.round(phase < 0.15 ? 70 : 15)}°`, 30, 48);

      } else {
        // RUNNING ANIMATION
        const floorY = h - 35;
        const cx = w * 0.5;
        const cy = floorY - 70;

        const legPhase = Math.sin(t * 1.5);
        const hipX = cx;
        const hipY = cy + 20;

        // Left leg
        const lKneeX = cx + legPhase * 24;
        const lKneeY = hipY + 30 - Math.max(0, -legPhase) * 15;
        const lFootX = lKneeX + legPhase * 16;
        const lFootY = Math.min(floorY, lKneeY + 28);

        // Right leg (opposite)
        const rKneeX = cx - legPhase * 24;
        const rKneeY = hipY + 30 - Math.max(0, legPhase) * 15;
        const rFootX = rKneeX - legPhase * 16;
        const rFootY = Math.min(floorY, rKneeY + 28);

        ctx.save();
        ctx.shadowColor = '#00e5ff';
        ctx.shadowBlur = 10;

        // Torso
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(cx + 6, cy - 20); // forward lean
        ctx.stroke();

        // Legs
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(lKneeX, lKneeY);
        ctx.lineTo(lFootX, lFootY);
        ctx.stroke();

        ctx.strokeStyle = '#0284c7';
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(rKneeX, rKneeY);
        ctx.lineTo(rFootX, rFootY);
        ctx.stroke();

        // Head
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(cx + 10, cy - 32, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        ctx.fillStyle = '#00e5ff';
        ctx.font = 'bold 11px monospace';
        ctx.fillText('● MIDFOOT STRIKE CADENCE', 30, 30);

        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText('TARGET CADENCE: 175 SPM (5° Ankle Lean)', 30, 48);
      }

      if (isPlaying) {
        t += 0.045 * playSpeed;
      }
      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animationFrameId);
  }, [guide, isPlaying, playSpeed]);

  const handleAddPracticeRep = () => {
    playRepCountSound(soundEnabled);
    setPracticeReps((prev) => prev + 1);
    if ((practiceReps + 1) % 10 === 0) {
      playQuestCompleteSound(soundEnabled);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl system-window text-slate-100 border border-cyan-500/50 shadow-[0_0_50px_rgba(0,229,255,0.25)] overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-cyan-500/30 flex items-center justify-between gap-3 bg-[#060a17]/90 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(0,229,255,0.3)]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-system font-black px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 uppercase">
                  {guide.codename}
                </span>
                <span className="text-xs font-system text-amber-400 font-bold">
                  [{guide.difficulty}]
                </span>
              </div>
              <h2 className="font-system font-black text-base sm:text-lg text-white mt-0.5">
                {guide.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Looping Form Animation Demonstration Canvas */}
          <div className="relative rounded-xl overflow-hidden border border-cyan-500/40 shadow-inner bg-slate-950">
            <canvas
              ref={canvasRef}
              width={560}
              height={220}
              className="w-full h-48 sm:h-56 object-contain block mx-auto"
            />

            {/* Video Controls Bar */}
            <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2 p-1.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-slate-800 text-xs font-system">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition flex items-center gap-1"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play'}</span>
                </button>

                <div className="flex items-center gap-1 text-[11px] text-slate-300">
                  <span className="text-slate-500">Speed:</span>
                  {[0.5, 1, 1.5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setPlaySpeed(speed)}
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        playSpeed === speed ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/50' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>Tempo: <strong className="text-amber-300">{guide.tempo}</strong></span>
              </div>
            </div>
          </div>

          {/* Hunter Directive Quote Banner */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-blue-950/40 to-slate-950 border border-cyan-500/30 text-xs text-slate-300 italic flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>{guide.hunterDirective}</span>
          </div>

          {/* Target Muscles & Heatmap Bar */}
          <div>
            <h4 className="text-xs font-system font-bold text-slate-400 uppercase tracking-wider mb-2">
              Primary Anatomical Activation
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {guide.targetMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="px-2.5 py-1 rounded-lg text-xs font-system font-bold bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 flex items-center gap-1 shadow-[0_0_8px_rgba(0,229,255,0.15)]"
                >
                  <Flame className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{muscle}</span>
                </span>
              ))}
              {guide.secondaryMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="px-2.5 py-1 rounded-lg text-xs font-system font-medium bg-slate-900 border border-slate-800 text-slate-400"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {/* Tab Selector: Form Cues vs Common Mistakes vs Practice Mode */}
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800 text-xs font-system font-bold">
            <button
              onClick={() => setActiveTab('form')}
              className={`flex-1 py-2 rounded-lg transition ${
                activeTab === 'form' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Biomechanical Form Cues
            </button>
            <button
              onClick={() => setActiveTab('mistakes')}
              className={`flex-1 py-2 rounded-lg transition ${
                activeTab === 'mistakes' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Fatal Mistakes to Avoid
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`flex-1 py-2 rounded-lg transition ${
                activeTab === 'practice' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Practice Reps
            </button>
          </div>

          {/* Tab 1: Form Cues */}
          {activeTab === 'form' && (
            <div className="space-y-4">
              <div>
                <h5 className="text-xs font-system font-bold text-cyan-400 uppercase mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  <span>Phase 1: Setup & Starting Stance</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {guide.setupCues.map((cue, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-cyan-400 font-bold shrink-0">{i + 1}.</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h5 className="text-xs font-system font-bold text-amber-400 uppercase mb-2 flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span>Phase 2: Execution & Movement Path</span>
                </h5>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {guide.executionCues.map((cue, i) => (
                    <li key={i} className="flex items-start gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-amber-400 font-bold shrink-0">{i + 1}.</span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                <span className="text-slate-400 font-bold block mb-1">Breathing Cadence:</span>
                <span className="text-slate-200">{guide.breathing}</span>
              </div>
            </div>
          )}

          {/* Tab 2: Common Mistakes */}
          {activeTab === 'mistakes' && (
            <div className="space-y-2.5">
              <h5 className="text-xs font-system font-bold text-rose-400 uppercase flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Critical Mistakes That Rob Your Gains & Cause Injury</span>
              </h5>
              {guide.commonMistakes.map((mistake, i) => (
                <div key={i} className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs text-rose-200 flex items-start gap-2.5">
                  <span className="font-bold text-rose-400 text-sm">✕</span>
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          )}

          {/* Tab 3: Practice Reps alongside Clip */}
          {activeTab === 'practice' && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-emerald-500/40 text-center space-y-4">
              <div>
                <span className="text-xs font-system text-slate-400 uppercase">Live Practice Rep Counter</span>
                <div className="text-5xl font-black font-system text-emerald-400 glow-text-cyan my-1">
                  {practiceReps}
                </div>
                <p className="text-xs text-slate-400">
                  Follow the looping animation cadence and log completed practice reps.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={handleAddPracticeRep}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-system font-black text-sm transition shadow-[0_0_15px_rgba(16,185,129,0.4)] active:scale-95"
                >
                  +1 REP COMPLETED
                </button>
                <button
                  onClick={() => setPracticeReps(0)}
                  className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white text-xs font-system"
                >
                  Reset
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Button */}
        <div className="p-3.5 sm:p-4 border-t border-cyan-500/30 bg-[#060a17] flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-system font-black text-xs sm:text-sm transition shadow-[0_0_15px_rgba(0,229,255,0.4)] active:scale-95"
          >
            I UNDERSTAND THE FORM ✓
          </button>
        </div>
      </div>
    </div>
  );
};
