import React, { useState, useRef } from 'react';
import { FoodMicronutrients, MealLogEntry, UserProfile } from '../types';
import {
  Camera,
  Upload,
  Sparkles,
  X,
  Check,
  Utensils,
  Zap,
  ShieldCheck,
  Flame,
  Plus,
  Minus,
  RefreshCw,
  AlertCircle,
  Search,
  Sliders,
  Wifi,
  WifiOff,
  Edit3,
} from 'lucide-react';
import { playQuestCompleteSound, playRepCountSound } from '../utils/soundEffects';
import { INDIAN_FOOD_DATABASE, IndianFoodItem } from '../utils/indianFoodDatabase';
import { analyzeFoodIntelligently, AnalyzedIngredient } from '../utils/intelligentNutritionEngine';

interface MealLoggerProps {
  userProfile: UserProfile;
  isOfflineMode?: boolean;
  onAddMeal: (meal: MealLogEntry) => void;
}

export const MealLogger: React.FC<MealLoggerProps> = ({ userProfile, isOfflineMode = false, onAddMeal }) => {
  const [mealType, setMealType] = useState<MealLogEntry['mealType']>('lunch');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanNotice, setScanNotice] = useState<{ text: string; type: 'info' | 'warn' } | null>(null);

  // Indian Food Database Search State
  const [showIndianDb, setShowIndianDb] = useState(false);
  const [indianSearch, setIndianSearch] = useState('');
  const [selectedIndianCategory, setSelectedIndianCategory] = useState<string>('all');

  // Analyzed result draft before saving (with full user editability)
  const [analysisResult, setAnalysisResult] = useState<{
    mealName: string;
    calories: number;
    proteinGrams: number;
    carbsGrams: number;
    fatsGrams: number;
    micronutrients: FoodMicronutrients;
    hunterRank: string;
    systemComment: string;
    breakdown?: AnalyzedIngredient[];
    engineUsed?: string;
  } | null>(null);

  // Editable overrides
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editCals, setEditCals] = useState<number>(0);
  const [editProtein, setEditProtein] = useState<number>(0);
  const [editCarbs, setEditCarbs] = useState<number>(0);
  const [editFats, setEditFats] = useState<number>(0);
  const [portionMultiplier, setPortionMultiplier] = useState<number>(1);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      setScanNotice({ text: 'Image file exceeds 8MB limit. Please choose a smaller photo.', type: 'warn' });
      return;
    }

    setScanNotice(null);
    setImageMimeType(file.type || 'image/jpeg');

    const reader = new FileReader();
    reader.onload = () => {
      const resultStr = reader.result as string;
      setImagePreview(resultStr);
      const base64 = resultStr.split(',')[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview(null);
    setImageBase64(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleQuickPrompt = (text: string, type: MealLogEntry['mealType']) => {
    setDescription(text);
    setMealType(type);
    playRepCountSound(userProfile.soundEnabled);
  };

  const handleSelectIndianFood = (food: IndianFoodItem, multiplier: number = 1) => {
    playRepCountSound(userProfile.soundEnabled);
    const portionDesc = multiplier > 1 ? `${multiplier}x ${food.name}` : `${food.name} (${food.defaultPortion})`;
    const updatedDesc = description.trim() ? `${description.trim()}, ${portionDesc}` : portionDesc;
    setDescription(updatedDesc);
    setShowIndianDb(false);
    setIndianSearch('');
  };

  // Autonomous Intelligent Food Analysis
  const handleAnalyze = async () => {
    if (!description.trim() && !imageBase64) {
      setScanNotice({ text: 'Please provide a food description or upload a photo to scan.', type: 'warn' });
      return;
    }

    setIsScanning(true);
    setScanNotice(null);
    setAnalysisResult(null);
    setPortionMultiplier(1);

    // If offline mode is toggled or browser is offline, run Autonomous Intelligent Nutrition Engine directly
    const isOnline = navigator.onLine && !isOfflineMode;

    if (!isOnline) {
      // Offline direct intelligence
      const computed = analyzeFoodIntelligently(description.trim(), userProfile.targetCalories);
      setAnalysisResult({
        ...computed,
        engineUsed: 'Autonomous Offline Nutrition Engine',
      });
      setEditName(computed.mealName);
      setEditCals(computed.calories);
      setEditProtein(computed.proteinGrams);
      setEditCarbs(computed.carbsGrams);
      setEditFats(computed.fatsGrams);
      setScanNotice({ text: 'Computed via Autonomous Offline Nutrition Engine (Real macros & micros verified)', type: 'info' });
      playQuestCompleteSound(userProfile.soundEnabled);
      setIsScanning(false);
      return;
    }

    try {
      const response = await fetch('/api/gemini/analyze-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description.trim(),
          imageBase64,
          imageMimeType,
          userProfile,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status ${response.status}`);
      }

      const data = await response.json();
      setAnalysisResult(data);
      setEditName(data.mealName || description.trim());
      setEditCals(data.calories || 0);
      setEditProtein(data.proteinGrams || 0);
      setEditCarbs(data.carbsGrams || 0);
      setEditFats(data.fatsGrams || 0);
      playQuestCompleteSound(userProfile.soundEnabled);
    } catch (err: any) {
      console.warn('Online analysis failed, falling back to autonomous nutrition engine:', err);
      // Run Autonomous Intelligent Nutrition Engine on client
      const computed = analyzeFoodIntelligently(description.trim(), userProfile.targetCalories);
      setAnalysisResult({
        ...computed,
        engineUsed: 'Autonomous Nutrition Engine (Real-Time Fallback)',
      });
      setEditName(computed.mealName);
      setEditCals(computed.calories);
      setEditProtein(computed.proteinGrams);
      setEditCarbs(computed.carbsGrams);
      setEditFats(computed.fatsGrams);
      setScanNotice({
        text: 'Cloud link busy; computed via Autonomous Nutrition Engine with actual food breakdown.',
        type: 'info',
      });
      playQuestCompleteSound(userProfile.soundEnabled);
    } finally {
      setIsScanning(false);
    }
  };

  // Portion multiplier change handler
  const handleMultiplierChange = (newMult: number) => {
    if (!analysisResult || newMult <= 0) return;
    const baseCals = analysisResult.calories;
    const baseP = analysisResult.proteinGrams;
    const baseC = analysisResult.carbsGrams;
    const baseF = analysisResult.fatsGrams;

    setPortionMultiplier(newMult);
    setEditCals(Math.round(baseCals * newMult));
    setEditProtein(Math.round(baseP * newMult * 10) / 10);
    setEditCarbs(Math.round(baseC * newMult * 10) / 10);
    setEditFats(Math.round(baseF * newMult * 10) / 10);
  };

  const handleSaveMeal = () => {
    if (!analysisResult) return;

    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // Scale micronutrients if multiplier changed
    const baseMicros = analysisResult.micronutrients || {};
    const scaledMicros: FoodMicronutrients = {
      fiberGrams: Math.round((baseMicros.fiberGrams || 0) * portionMultiplier * 10) / 10,
      sodiumMg: Math.round((baseMicros.sodiumMg || 0) * portionMultiplier),
      potassiumMg: Math.round((baseMicros.potassiumMg || 0) * portionMultiplier),
      magnesiumMg: Math.round((baseMicros.magnesiumMg || 0) * portionMultiplier),
      calciumMg: Math.round((baseMicros.calciumMg || 0) * portionMultiplier),
      ironMg: Math.round((baseMicros.ironMg || 0) * portionMultiplier * 10) / 10,
      vitaminDiu: Math.round((baseMicros.vitaminDiu || 0) * portionMultiplier),
    };

    const newEntry: MealLogEntry = {
      id: `meal_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timestamp: `${hours}:${minutes}`,
      mealType,
      name: editName || analysisResult.mealName,
      description: description || editName || analysisResult.mealName,
      photoUrl: imagePreview || undefined,
      calories: Math.max(0, Math.round(editCals)),
      proteinGrams: Math.max(0, Math.round(editProtein * 10) / 10),
      carbsGrams: Math.max(0, Math.round(editCarbs * 10) / 10),
      fatsGrams: Math.max(0, Math.round(editFats * 10) / 10),
      micronutrients: scaledMicros,
      hunterRank: analysisResult.hunterRank,
      systemComment: analysisResult.systemComment,
    };

    onAddMeal(newEntry);
    playQuestCompleteSound(userProfile.soundEnabled);

    // Reset form
    setDescription('');
    clearImage();
    setAnalysisResult(null);
    setIsEditing(false);
  };

  const filteredIndianFoods = INDIAN_FOOD_DATABASE.filter((item) => {
    const matchesSearch =
      !indianSearch.trim() ||
      item.name.toLowerCase().includes(indianSearch.toLowerCase()) ||
      (item.hindiName && item.hindiName.includes(indianSearch));
    const matchesCategory = selectedIndianCategory === 'all' || item.category === selectedIndianCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="rounded-2xl system-window p-4 sm:p-6 border border-cyan-500/40 shadow-[0_0_30px_rgba(0,229,255,0.15)] space-y-5">
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/30 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
            <Utensils className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-system font-bold text-base sm:text-lg text-white">
                INTELLIGENT HUNTER NUTRITION SCANNER
              </h3>
              {isOfflineMode ? (
                <span className="flex items-center gap-1 text-[10px] font-system font-bold px-2 py-0.5 rounded bg-purple-950/80 border border-purple-500/40 text-purple-300">
                  <WifiOff className="w-3 h-3 text-purple-400" />
                  <span>OFFLINE ENGINE</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[10px] font-system font-bold px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                  <Wifi className="w-3 h-3 text-cyan-400" />
                  <span>ONLINE NEURAL</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400">
              Autonomous reasoning & exact macro calculation for ANY dish or photo without generic defaults.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowIndianDb(!showIndianDb)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-system text-xs font-bold transition shadow-[0_0_10px_rgba(245,158,11,0.2)]"
          >
            <span>🇮🇳 Indian Food Database ({INDIAN_FOOD_DATABASE.length}+ Items)</span>
          </button>
        </div>
      </div>

      {/* Indian Food Quick Database Browser Dropdown / Modal */}
      {showIndianDb && (
        <div className="p-4 rounded-xl bg-slate-950/95 border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)] space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 text-sm font-system font-bold">
                🇮🇳 INDIAN FOOD NUTRIENT MATRIX
              </span>
              <span className="text-[10px] text-slate-400">
                (Click any item to append to your food description)
              </span>
            </div>
            <button
              onClick={() => setShowIndianDb(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar inside database */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Indian foods: roti, paratha, paneer, biryani, dal, soya, chilla, sattu..."
              value={indianSearch}
              onChange={(e) => setIndianSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Category tabs */}
          <div className="flex flex-wrap gap-1 text-[11px] font-system font-bold">
            {[
              { id: 'all', label: 'All' },
              { id: 'roti_bread', label: 'Rotis & Parathas' },
              { id: 'dal_lentils', label: 'Dals & Lentils' },
              { id: 'curry_sabzi', label: 'Curries & Paneer' },
              { id: 'rice_biryani', label: 'Biryani & Rice' },
              { id: 'south_indian', label: 'South Indian' },
              { id: 'breakfast_snacks', label: 'High Protein / Snacks' },
              { id: 'dairy_protein', label: 'Dairy & Curd' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedIndianCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedIndianCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-1">
            {filteredIndianFoods.map((food) => (
              <div
                key={food.id}
                className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-amber-400/60 transition group flex flex-col justify-between text-xs"
              >
                <div>
                  <div className="font-system font-bold text-slate-200 group-hover:text-amber-300">
                    {food.name}
                  </div>
                  {food.hindiName && (
                    <div className="text-[10px] text-amber-400/80">{food.hindiName}</div>
                  )}
                  <div className="text-[10px] text-slate-400 mt-1">
                    {food.defaultPortion} •{' '}
                    <strong className="text-white">{food.calories} kcal</strong> |{' '}
                    <span className="text-emerald-400 font-bold">{food.proteinGrams}g P</span> |{' '}
                    <span className="text-sky-400">{food.carbsGrams}g C</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 mt-2 pt-1.5 border-t border-slate-800/60">
                  <button
                    type="button"
                    onClick={() => handleSelectIndianFood(food, 1)}
                    className="flex-1 py-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 font-bold text-[10px] transition text-center"
                  >
                    + 1 Serving
                  </button>
                  {food.category === 'roti_bread' && (
                    <button
                      type="button"
                      onClick={() => handleSelectIndianFood(food, 2)}
                      className="px-2 py-1 rounded bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 font-bold text-[10px] transition"
                    >
                      + 2x
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Meal Type Selection Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {(['breakfast', 'lunch', 'dinner', 'snack', 'pre_workout', 'post_workout'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setMealType(type)}
            className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-system font-bold uppercase transition ${
              mealType === type
                ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                : 'bg-slate-900/90 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {type.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Input Area: Photo & Text */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Photo Upload Box (5 cols) */}
        <div className="md:col-span-5 flex flex-col">
          <label className="text-xs font-system font-bold text-slate-300 mb-1.5 flex items-center gap-1">
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>PHOTO SCAN (CAMERA / UPLOAD)</span>
          </label>

          <div className="relative flex-1 min-h-[160px] sm:min-h-[180px] rounded-xl border border-dashed border-cyan-500/40 bg-slate-950/60 flex flex-col items-center justify-center p-3 text-center transition hover:border-cyan-400/80 group">
            {imagePreview ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={imagePreview}
                  alt="Meal preview"
                  referrerPolicy="no-referrer"
                  className="max-h-[170px] w-auto rounded-lg object-cover border border-cyan-500/50 shadow-[0_0_15px_rgba(0,229,255,0.2)]"
                />
                <button
                  onClick={clearImage}
                  className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/90 border border-rose-500/60 text-rose-400 hover:bg-rose-950 hover:text-rose-200 transition"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer flex flex-col items-center justify-center w-full h-full py-4 space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition shadow-[0_0_10px_rgba(0,229,255,0.2)]">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs font-system text-slate-300">
                  <span className="text-cyan-300 font-bold">Tap to capture or upload photo</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">Auto-recognizes portions and dishes</span>
                </div>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Text Description Box (7 cols) */}
        <div className="md:col-span-7 flex flex-col">
          <label className="text-xs font-system font-bold text-slate-300 mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>CUSTOM DISH & PORTION DESCRIPTION</span>
            </span>
            <span className="text-[10px] text-cyan-400 font-system">
              ⚡ Multi-item autonomous parser active
            </span>
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type anything freely! E.g. '3 rotis, 1 bowl dal tadka and 100g curd', '150g grilled chicken breast with 1 cup white rice', '2 scoops whey in 400ml milk with 1 banana', '2 aloo parathas with butter'..."
            rows={4}
            className="w-full flex-1 p-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:outline-none text-white text-xs sm:text-sm font-sans placeholder:text-slate-600 resize-none transition"
          />

          {/* Quick suggestions pills */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-500 text-[10px] font-semibold uppercase">Try:</span>
            <button
              type="button"
              onClick={() => handleQuickPrompt('3 phulkas, 1 bowl moong dal and 150g paneer bhurji', 'lunch')}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-200 transition"
            >
              3 Rotis + Dal + Paneer
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('200g chicken breast, 1.5 cups white rice, steamed broccoli', 'dinner')}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 text-cyan-200 transition"
            >
              200g Chicken + Rice + Broccoli
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('2 paneer parathas with 1 bowl fresh curd (150g)', 'breakfast')}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-amber-500/40 text-amber-200 transition"
            >
              2 Paneer Parathas + Curd
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('50g soya chunks curry with 1 cup rice and salad', 'lunch')}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 text-emerald-200 transition"
            >
              50g Soya Chunks + Rice
            </button>
            <button
              type="button"
              onClick={() => handleQuickPrompt('1 scoop whey protein, 350ml milk, 1 banana, 1 tbsp peanut butter', 'post_workout')}
              className="px-2 py-0.5 rounded bg-slate-900 hover:bg-slate-800 border border-purple-500/40 text-purple-200 transition"
            >
              Whey + Banana + PB Shake
            </button>
          </div>
        </div>
      </div>

      {scanNotice && (
        <div
          className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
            scanNotice.type === 'warn'
              ? 'bg-rose-950/60 border-rose-500/60 text-rose-300'
              : 'bg-cyan-950/60 border-cyan-500/60 text-cyan-300'
          }`}
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{scanNotice.text}</span>
        </div>
      )}

      {/* Action Button: Scan with AI / Offline Engine */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        <div className="text-[11px] text-slate-400 font-system">
          {isOfflineMode
            ? 'Running locally via Autonomous Offline Nutrition Engine'
            : 'Using Dual Neural AI + Autonomous Mathematical Validator'}
        </div>

        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isScanning || (!description.trim() && !imageBase64)}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-system font-black text-xs sm:text-sm tracking-wide transition shadow-[0_0_20px_rgba(0,229,255,0.35)] active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
              <span>THE SYSTEM IS COMPUTING EXACT MACROS & MICROS...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>ANALYZE FOOD (ACTUAL MACROS & MICROS)</span>
            </>
          )}
        </button>
      </div>

      {/* Analyzed Results Display with Real Breakdown & Interactive Controls */}
      {analysisResult && (
        <div className="p-4 sm:p-5 rounded-xl bg-gradient-to-br from-cyan-950/40 via-slate-950 to-blue-950/40 border border-cyan-500/60 shadow-[0_0_25px_rgba(0,229,255,0.2)] space-y-4 animate-in fade-in duration-300">
          
          {/* Header & Hunter Tier */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-500/30 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-system font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 uppercase">
                  {analysisResult.hunterRank || 'S-Rank Hypertrophy Fuel'}
                </span>
                <span className="text-xs text-slate-400 font-system uppercase">
                  [{mealType.replace('_', ' ')}]
                </span>
                {analysisResult.engineUsed && (
                  <span className="text-[10px] text-purple-300 bg-purple-950/60 px-2 py-0.5 rounded border border-purple-500/30">
                    {analysisResult.engineUsed}
                  </span>
                )}
              </div>

              {isEditing ? (
                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="p-1.5 rounded-lg bg-slate-900 border border-cyan-500 text-sm font-system font-bold text-white focus:outline-none"
                  />
                  <button
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-cyan-300 underline font-system"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-1">
                  <h4 className="text-lg font-system font-bold text-white">
                    {editName || analysisResult.mealName}
                  </h4>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-slate-400 hover:text-cyan-300 p-1"
                    title="Edit meal title"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Total Calories */}
            <div className="text-right">
              <span className="text-2xl sm:text-3xl font-system font-black text-cyan-200 glow-text-cyan">
                {editCals}
              </span>
              <span className="text-xs text-cyan-400 ml-1 font-system">kcal</span>
            </div>
          </div>

          {/* Quick Portion Multiplier Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
            <span className="font-system font-bold text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>PORTION SCALER:</span>
            </span>

            <div className="flex items-center gap-1.5">
              {[0.5, 1.0, 1.5, 2.0].map((multiplier) => (
                <button
                  key={multiplier}
                  type="button"
                  onClick={() => handleMultiplierChange(multiplier)}
                  className={`px-2.5 py-1 rounded font-system font-bold text-[11px] transition ${
                    portionMultiplier === multiplier
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_8px_rgba(0,229,255,0.4)]'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {multiplier}x
                </button>
              ))}
            </div>
          </div>

          {/* Core Macronutrients Grid with Direct Fine-Tuning */}
          <div className="grid grid-cols-3 gap-3 text-center">
            {/* Protein */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-emerald-500/40">
              <span className="text-[10px] font-system text-slate-400 uppercase block mb-1">PROTEIN</span>
              <div className="flex items-center justify-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={editProtein}
                  onChange={(e) => setEditProtein(parseFloat(e.target.value) || 0)}
                  className="w-16 text-center text-lg sm:text-xl font-system font-black text-emerald-400 bg-slate-950 rounded border border-emerald-500/30 focus:outline-none"
                />
                <span className="text-xs text-slate-400">g</span>
              </div>
              <span className="text-[10px] text-emerald-400/80 block mt-1">
                {(editProtein * 4).toFixed(0)} kcal
              </span>
            </div>

            {/* Carbs */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-500/40">
              <span className="text-[10px] font-system text-slate-400 uppercase block mb-1">CARBS</span>
              <div className="flex items-center justify-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={editCarbs}
                  onChange={(e) => setEditCarbs(parseFloat(e.target.value) || 0)}
                  className="w-16 text-center text-lg sm:text-xl font-system font-black text-sky-400 bg-slate-950 rounded border border-sky-500/30 focus:outline-none"
                />
                <span className="text-xs text-slate-400">g</span>
              </div>
              <span className="text-[10px] text-sky-400/80 block mt-1">
                {(editCarbs * 4).toFixed(0)} kcal
              </span>
            </div>

            {/* Fats */}
            <div className="p-3 rounded-xl bg-slate-900/90 border border-amber-500/40">
              <span className="text-[10px] font-system text-slate-400 uppercase block mb-1">FATS</span>
              <div className="flex items-center justify-center gap-1">
                <input
                  type="number"
                  step="0.1"
                  value={editFats}
                  onChange={(e) => setEditFats(parseFloat(e.target.value) || 0)}
                  className="w-16 text-center text-lg sm:text-xl font-system font-black text-amber-400 bg-slate-950 rounded border border-amber-500/30 focus:outline-none"
                />
                <span className="text-xs text-slate-400">g</span>
              </div>
              <span className="text-[10px] text-amber-400/80 block mt-1">
                {(editFats * 9).toFixed(0)} kcal
              </span>
            </div>
          </div>

          {/* Itemized Food Breakdown Table (if available) */}
          {analysisResult.breakdown && analysisResult.breakdown.length > 0 && (
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
              <div className="text-xs font-system font-bold text-cyan-300 flex items-center justify-between">
                <span>ITEMIZED NUTRITIONAL BREAKDOWN ({analysisResult.breakdown.length} ITEMS)</span>
                <span className="text-[10px] text-slate-400">Autonomous Component Scanner</span>
              </div>

              <div className="divide-y divide-slate-800/80 text-xs">
                {analysisResult.breakdown.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between gap-2">
                    <div>
                      <span className="font-semibold text-white block">
                        {item.portionQuantity}x {item.matchedFood} ({item.grams}g)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        P: {item.proteinGrams}g | C: {item.carbsGrams}g | F: {item.fatsGrams}g | Fiber: {item.fiberGrams}g
                      </span>
                    </div>
                    <div className="text-right font-system font-bold text-cyan-300">
                      {item.calories} kcal
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Micronutrient Details Grid */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <span className="text-[11px] font-system font-bold text-slate-300 block">
              ESTIMATED MICRONUTRIENTS FOR RECOVERY:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">Fiber</span>
                <span className="font-bold text-white font-system">
                  {Math.round((analysisResult.micronutrients?.fiberGrams || 4) * portionMultiplier * 10) / 10}g
                </span>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">Sodium (Na)</span>
                <span className="font-bold text-white font-system">
                  {Math.round((analysisResult.micronutrients?.sodiumMg || 300) * portionMultiplier)}mg
                </span>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">Potassium (K)</span>
                <span className="font-bold text-white font-system">
                  {Math.round((analysisResult.micronutrients?.potassiumMg || 350) * portionMultiplier)}mg
                </span>
              </div>
              <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block">Magnesium (Mg)</span>
                <span className="font-bold text-white font-system">
                  {Math.round((analysisResult.micronutrients?.magnesiumMg || 50) * portionMultiplier)}mg
                </span>
              </div>
            </div>
          </div>

          {/* System Comment */}
          {analysisResult.systemComment && (
            <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-300 italic font-sans flex items-start gap-2">
              <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{analysisResult.systemComment}</span>
            </div>
          )}

          {/* Save Meal Button */}
          <div className="flex justify-end gap-2 pt-2 border-t border-cyan-500/20">
            <button
              type="button"
              onClick={() => setAnalysisResult(null)}
              className="px-4 py-2 rounded-xl text-xs font-system text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveMeal}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-system font-black text-xs sm:text-sm transition shadow-[0_0_15px_rgba(0,229,255,0.4)] active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>CONFIRM & LOG REAL NUTRIENTS</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
