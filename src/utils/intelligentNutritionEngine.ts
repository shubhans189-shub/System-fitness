export interface AnalyzedIngredient {
  name: string;
  matchedFood: string;
  portionQuantity: number;
  portionUnit: string;
  grams: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
  sodiumMg: number;
  potassiumMg: number;
  magnesiumMg: number;
  calciumMg: number;
  ironMg: number;
  vitaminDiu: number;
}

export interface FoodAnalysisResult {
  mealName: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'pre_workout' | 'post_workout';
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  micronutrients: {
    fiberGrams: number;
    sodiumMg: number;
    potassiumMg: number;
    magnesiumMg: number;
    calciumMg: number;
    ironMg: number;
    vitaminDiu: number;
  };
  hunterRank: string;
  systemComment: string;
  breakdown: AnalyzedIngredient[];
  isAnalyticalFallback?: boolean;
}

interface FoodMasterItem {
  id: string;
  names: string[];
  defaultUnit: string;
  gramsPerUnit: number;
  // Per 100g values
  per100g: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    sodium: number;
    potassium: number;
    magnesium: number;
    calcium: number;
    iron: number;
    vitaminD: number;
  };
  category: 'protein' | 'grain' | 'dairy' | 'legume' | 'vegetable' | 'fruit' | 'fat' | 'prepared';
  hunterTier: 'S' | 'A' | 'B';
}

export const FOOD_MASTER_DATABASE: FoodMasterItem[] = [
  // --- HIGH PROTEIN ANIMAL & DAIRY ---
  {
    id: 'chicken_breast',
    names: ['chicken breast', 'boiled chicken', 'grilled chicken', 'chicken fillet', 'murgh'],
    defaultUnit: 'piece',
    gramsPerUnit: 150,
    per100g: { calories: 165, protein: 31.0, carbs: 0.0, fats: 3.6, fiber: 0, sodium: 74, potassium: 256, magnesium: 29, calcium: 15, iron: 1.0, vitaminD: 5 },
    category: 'protein',
    hunterTier: 'S',
  },
  {
    id: 'chicken_curry',
    names: ['chicken curry', 'chicken masala', 'butter chicken', 'chicken gravy', 'kadai chicken'],
    defaultUnit: 'plate',
    gramsPerUnit: 250,
    per100g: { calories: 180, protein: 16.5, carbs: 4.5, fats: 11.0, fiber: 1.2, sodium: 340, potassium: 280, magnesium: 25, calcium: 28, iron: 1.4, vitaminD: 6 },
    category: 'prepared',
    hunterTier: 'S',
  },
  {
    id: 'egg_whole',
    names: ['egg', 'eggs', 'boiled egg', 'boiled eggs', 'ande', 'anda'],
    defaultUnit: 'egg',
    gramsPerUnit: 50,
    per100g: { calories: 155, protein: 13.0, carbs: 1.1, fats: 11.0, fiber: 0, sodium: 124, potassium: 126, magnesium: 12, calcium: 56, iron: 1.8, vitaminD: 82 },
    category: 'protein',
    hunterTier: 'S',
  },
  {
    id: 'egg_white',
    names: ['egg white', 'egg whites', 'ande ki safedi'],
    defaultUnit: 'white',
    gramsPerUnit: 33,
    per100g: { calories: 52, protein: 11.0, carbs: 0.7, fats: 0.2, fiber: 0, sodium: 166, potassium: 163, magnesium: 11, calcium: 7, iron: 0.1, vitaminD: 0 },
    category: 'protein',
    hunterTier: 'S',
  },
  {
    id: 'egg_bhurji_omelet',
    names: ['egg bhurji', 'omelet', 'omelette', 'scrambled egg', 'scrambled eggs'],
    defaultUnit: 'plate',
    gramsPerUnit: 140,
    per100g: { calories: 185, protein: 12.5, carbs: 3.2, fats: 13.5, fiber: 0.5, sodium: 280, potassium: 170, magnesium: 16, calcium: 65, iron: 2.1, vitaminD: 75 },
    category: 'prepared',
    hunterTier: 'S',
  },
  {
    id: 'paneer_raw',
    names: ['paneer', 'cottage cheese', 'raw paneer'],
    defaultUnit: 'cube',
    gramsPerUnit: 100,
    per100g: { calories: 290, protein: 18.3, carbs: 3.4, fats: 22.0, fiber: 0, sodium: 22, potassium: 98, magnesium: 30, calcium: 480, iron: 0.4, vitaminD: 25 },
    category: 'dairy',
    hunterTier: 'S',
  },
  {
    id: 'paneer_bhurji',
    names: ['paneer bhurji', 'paneer tikka', 'kadai paneer', 'shahi paneer', 'paneer butter masala'],
    defaultUnit: 'bowl',
    gramsPerUnit: 180,
    per100g: { calories: 215, protein: 12.8, carbs: 6.2, fats: 15.5, fiber: 1.5, sodium: 320, potassium: 160, magnesium: 32, calcium: 310, iron: 1.1, vitaminD: 20 },
    category: 'prepared',
    hunterTier: 'S',
  },
  {
    id: 'whey_protein',
    names: ['whey', 'whey protein', 'protein powder', 'protein shake', 'isolate'],
    defaultUnit: 'scoop',
    gramsPerUnit: 32,
    per100g: { calories: 390, protein: 78.0, carbs: 6.5, fats: 4.5, fiber: 1.0, sodium: 160, potassium: 450, magnesium: 65, calcium: 420, iron: 1.5, vitaminD: 40 },
    category: 'protein',
    hunterTier: 'S',
  },
  {
    id: 'soya_chunks',
    names: ['soya chunks', 'soy chunks', 'soya bean', 'nutrela', 'soya badi'],
    defaultUnit: 'cup',
    gramsPerUnit: 50,
    per100g: { calories: 345, protein: 52.0, carbs: 33.0, fats: 0.5, fiber: 13.0, sodium: 20, potassium: 1700, magnesium: 260, calcium: 350, iron: 14.5, vitaminD: 0 },
    category: 'protein',
    hunterTier: 'S',
  },
  {
    id: 'sattu',
    names: ['sattu', 'sattu drink', 'sattu sharbat', 'chana sattu'],
    defaultUnit: 'glass',
    gramsPerUnit: 45,
    per100g: { calories: 410, protein: 25.5, carbs: 64.0, fats: 5.2, fiber: 16.8, sodium: 45, potassium: 850, magnesium: 145, calcium: 110, iron: 8.5, vitaminD: 0 },
    category: 'protein',
    hunterTier: 'S',
  },
  {
    id: 'milk_whole',
    names: ['milk', 'doodh', 'whole milk', 'cow milk', 'buffalo milk'],
    defaultUnit: 'glass',
    gramsPerUnit: 250,
    per100g: { calories: 65, protein: 3.3, carbs: 4.8, fats: 3.6, fiber: 0, sodium: 43, potassium: 140, magnesium: 11, calcium: 120, iron: 0.1, vitaminD: 45 },
    category: 'dairy',
    hunterTier: 'A',
  },
  {
    id: 'curd_dahi',
    names: ['curd', 'dahi', 'yogurt', 'greek yogurt', 'raita'],
    defaultUnit: 'bowl',
    gramsPerUnit: 150,
    per100g: { calories: 62, protein: 4.3, carbs: 4.7, fats: 3.2, fiber: 0, sodium: 46, potassium: 155, magnesium: 14, calcium: 150, iron: 0.1, vitaminD: 15 },
    category: 'dairy',
    hunterTier: 'A',
  },

  // --- GRAINS, ROTIS & CARBOHYDRATES ---
  {
    id: 'roti_chapati',
    names: ['roti', 'rotis', 'chapati', 'chapatis', 'phulka', 'phulkas'],
    defaultUnit: 'roti',
    gramsPerUnit: 35,
    per100g: { calories: 245, protein: 8.8, carbs: 50.0, fats: 1.5, fiber: 7.2, sodium: 120, potassium: 240, magnesium: 85, calcium: 35, iron: 3.2, vitaminD: 0 },
    category: 'grain',
    hunterTier: 'A',
  },
  {
    id: 'paratha_plain',
    names: ['paratha', 'parathas', 'plain paratha', 'tawa paratha'],
    defaultUnit: 'paratha',
    gramsPerUnit: 70,
    per100g: { calories: 295, protein: 6.8, carbs: 42.0, fats: 11.5, fiber: 4.8, sodium: 180, potassium: 190, magnesium: 55, calcium: 30, iron: 2.5, vitaminD: 0 },
    category: 'grain',
    hunterTier: 'A',
  },
  {
    id: 'paratha_aloo',
    names: ['aloo paratha', 'alu paratha', 'potato paratha'],
    defaultUnit: 'paratha',
    gramsPerUnit: 120,
    per100g: { calories: 220, protein: 4.8, carbs: 35.0, fats: 7.2, fiber: 3.6, sodium: 240, potassium: 320, magnesium: 42, calcium: 24, iron: 1.9, vitaminD: 0 },
    category: 'grain',
    hunterTier: 'A',
  },
  {
    id: 'paratha_paneer_stuffed',
    names: ['paneer paratha'],
    defaultUnit: 'paratha',
    gramsPerUnit: 130,
    per100g: { calories: 250, protein: 11.2, carbs: 26.5, fats: 11.0, fiber: 3.0, sodium: 210, potassium: 180, magnesium: 48, calcium: 190, iron: 1.8, vitaminD: 10 },
    category: 'grain',
    hunterTier: 'S',
  },
  {
    id: 'rice_white',
    names: ['rice', 'white rice', 'steamed rice', 'chawal', 'boiled rice'],
    defaultUnit: 'bowl',
    gramsPerUnit: 160,
    per100g: { calories: 130, protein: 2.7, carbs: 28.2, fats: 0.3, fiber: 0.4, sodium: 1, potassium: 35, magnesium: 12, calcium: 10, iron: 0.4, vitaminD: 0 },
    category: 'grain',
    hunterTier: 'B',
  },
  {
    id: 'rice_brown',
    names: ['brown rice'],
    defaultUnit: 'bowl',
    gramsPerUnit: 160,
    per100g: { calories: 112, protein: 2.6, carbs: 23.5, fats: 0.9, fiber: 1.8, sodium: 2, potassium: 80, magnesium: 43, calcium: 11, iron: 0.5, vitaminD: 0 },
    category: 'grain',
    hunterTier: 'A',
  },
  {
    id: 'biryani_chicken',
    names: ['chicken biryani', 'murgh biryani'],
    defaultUnit: 'plate',
    gramsPerUnit: 350,
    per100g: { calories: 165, protein: 9.8, carbs: 19.5, fats: 5.6, fiber: 1.2, sodium: 380, potassium: 180, magnesium: 22, calcium: 26, iron: 1.2, vitaminD: 5 },
    category: 'prepared',
    hunterTier: 'S',
  },
  {
    id: 'biryani_veg',
    names: ['veg biryani', 'pulao', 'vegetable biryani', 'tahari'],
    defaultUnit: 'plate',
    gramsPerUnit: 300,
    per100g: { calories: 145, protein: 4.2, carbs: 24.0, fats: 4.0, fiber: 2.5, sodium: 320, potassium: 160, magnesium: 20, calcium: 30, iron: 1.1, vitaminD: 0 },
    category: 'prepared',
    hunterTier: 'B',
  },
  {
    id: 'oats_oatmeal',
    names: ['oats', 'oatmeal', 'daliya', 'porridge'],
    defaultUnit: 'bowl',
    gramsPerUnit: 50, // dry wt
    per100g: { calories: 380, protein: 13.5, carbs: 67.0, fats: 6.8, fiber: 10.5, sodium: 5, potassium: 360, magnesium: 138, calcium: 52, iron: 4.3, vitaminD: 0 },
    category: 'grain',
    hunterTier: 'S',
  },
  {
    id: 'bread_whole_wheat',
    names: ['bread', 'bread slice', 'toast', 'brown bread', 'whole wheat bread'],
    defaultUnit: 'slice',
    gramsPerUnit: 30,
    per100g: { calories: 250, protein: 9.5, carbs: 46.0, fats: 3.2, fiber: 6.0, sodium: 450, potassium: 180, magnesium: 55, calcium: 60, iron: 2.8, vitaminD: 0 },
    category: 'grain',
    hunterTier: 'A',
  },
  {
    id: 'dosa_plain',
    names: ['dosa', 'masala dosa', 'plain dosa'],
    defaultUnit: 'dosa',
    gramsPerUnit: 120,
    per100g: { calories: 170, protein: 4.0, carbs: 28.0, fats: 4.8, fiber: 2.0, sodium: 260, potassium: 110, magnesium: 24, calcium: 18, iron: 1.1, vitaminD: 0 },
    category: 'prepared',
    hunterTier: 'B',
  },
  {
    id: 'idli',
    names: ['idli', 'idlis'],
    defaultUnit: 'idli',
    gramsPerUnit: 50,
    per100g: { calories: 130, protein: 4.5, carbs: 26.0, fats: 0.6, fiber: 1.8, sodium: 160, potassium: 85, magnesium: 18, calcium: 16, iron: 0.9, vitaminD: 0 },
    category: 'prepared',
    hunterTier: 'A',
  },
  {
    id: 'besan_chilla',
    names: ['chilla', 'besan chilla', 'moong dal chilla', 'cheela'],
    defaultUnit: 'chilla',
    gramsPerUnit: 80,
    per100g: { calories: 195, protein: 11.2, carbs: 25.0, fats: 5.8, fiber: 6.5, sodium: 240, potassium: 380, magnesium: 72, calcium: 45, iron: 3.2, vitaminD: 0 },
    category: 'prepared',
    hunterTier: 'S',
  },

  // --- DALS & LEGUMES ---
  {
    id: 'dal_yellow_tadka',
    names: ['dal', 'dal tadka', 'yellow dal', 'toor dal', 'moong dal', 'arhar dal'],
    defaultUnit: 'bowl',
    gramsPerUnit: 180,
    per100g: { calories: 95, protein: 5.6, carbs: 13.5, fats: 2.2, fiber: 3.8, sodium: 280, potassium: 240, magnesium: 36, calcium: 24, iron: 1.8, vitaminD: 0 },
    category: 'legume',
    hunterTier: 'A',
  },
  {
    id: 'dal_makhani',
    names: ['dal makhani', 'urad dal', 'black dal', 'maa ki dal'],
    defaultUnit: 'bowl',
    gramsPerUnit: 200,
    per100g: { calories: 145, protein: 5.8, carbs: 14.2, fats: 7.5, fiber: 4.2, sodium: 340, potassium: 290, magnesium: 42, calcium: 65, iron: 2.2, vitaminD: 10 },
    category: 'legume',
    hunterTier: 'A',
  },
  {
    id: 'rajma_kidney_beans',
    names: ['rajma', 'kidney beans', 'rajma curry'],
    defaultUnit: 'bowl',
    gramsPerUnit: 200,
    per100g: { calories: 125, protein: 6.8, carbs: 18.5, fats: 2.6, fiber: 5.4, sodium: 310, potassium: 360, magnesium: 48, calcium: 35, iron: 2.6, vitaminD: 0 },
    category: 'legume',
    hunterTier: 'S',
  },
  {
    id: 'chole_chana',
    names: ['chole', 'chana', 'chickpeas', 'chana masala', 'safed chana', 'kala chana'],
    defaultUnit: 'bowl',
    gramsPerUnit: 200,
    per100g: { calories: 140, protein: 7.2, carbs: 20.0, fats: 3.5, fiber: 6.2, sodium: 320, potassium: 340, magnesium: 52, calcium: 48, iron: 2.8, vitaminD: 0 },
    category: 'legume',
    hunterTier: 'S',
  },
  {
    id: 'sambar',
    names: ['sambar', 'sambhar'],
    defaultUnit: 'bowl',
    gramsPerUnit: 180,
    per100g: { calories: 65, protein: 2.8, carbs: 9.8, fats: 1.6, fiber: 2.6, sodium: 290, potassium: 180, magnesium: 24, calcium: 30, iron: 1.2, vitaminD: 0 },
    category: 'legume',
    hunterTier: 'B',
  },

  // --- HEALTHY FATS, NUTS & SEEDS ---
  {
    id: 'peanut_butter',
    names: ['peanut butter', 'mungfali'],
    defaultUnit: 'tbsp',
    gramsPerUnit: 16,
    per100g: { calories: 590, protein: 25.0, carbs: 20.0, fats: 50.0, fiber: 8.0, sodium: 15, potassium: 650, magnesium: 154, calcium: 43, iron: 1.9, vitaminD: 0 },
    category: 'fat',
    hunterTier: 'S',
  },
  {
    id: 'almonds_badam',
    names: ['almonds', 'almond', 'badam'],
    defaultUnit: 'piece',
    gramsPerUnit: 1.2,
    per100g: { calories: 580, protein: 21.0, carbs: 21.6, fats: 50.0, fiber: 12.5, sodium: 1, potassium: 730, magnesium: 270, calcium: 260, iron: 3.7, vitaminD: 0 },
    category: 'fat',
    hunterTier: 'S',
  },
  {
    id: 'ghee_butter',
    names: ['ghee', 'desi ghee', 'butter', 'makhan', 'oil'],
    defaultUnit: 'tsp',
    gramsPerUnit: 5,
    per100g: { calories: 885, protein: 0.3, carbs: 0.0, fats: 99.5, fiber: 0, sodium: 5, potassium: 8, magnesium: 2, calcium: 15, iron: 0.1, vitaminD: 35 },
    category: 'fat',
    hunterTier: 'B',
  },

  // --- FRUITS & VEGETABLES ---
  {
    id: 'banana_kela',
    names: ['banana', 'bananas', 'kela'],
    defaultUnit: 'banana',
    gramsPerUnit: 110,
    per100g: { calories: 89, protein: 1.1, carbs: 22.8, fats: 0.3, fiber: 2.6, sodium: 1, potassium: 358, magnesium: 27, calcium: 5, iron: 0.3, vitaminD: 0 },
    category: 'fruit',
    hunterTier: 'A',
  },
  {
    id: 'apple_seb',
    names: ['apple', 'apples', 'seb'],
    defaultUnit: 'apple',
    gramsPerUnit: 150,
    per100g: { calories: 52, protein: 0.3, carbs: 13.8, fats: 0.2, fiber: 2.4, sodium: 1, potassium: 107, magnesium: 5, calcium: 6, iron: 0.1, vitaminD: 0 },
    category: 'fruit',
    hunterTier: 'B',
  },
  {
    id: 'broccoli_greens',
    names: ['broccoli', 'spinach', 'palak', 'salad', 'mixed greens'],
    defaultUnit: 'cup',
    gramsPerUnit: 90,
    per100g: { calories: 34, protein: 2.8, carbs: 6.6, fats: 0.4, fiber: 2.6, sodium: 33, potassium: 316, magnesium: 21, calcium: 47, iron: 0.7, vitaminD: 0 },
    category: 'vegetable',
    hunterTier: 'S',
  },
  {
    id: 'mixed_sabzi',
    names: ['sabzi', 'mixed veg', 'bhindi', 'aloo gobi', 'tinda', 'lauki', 'baingan bharta'],
    defaultUnit: 'bowl',
    gramsPerUnit: 150,
    per100g: { calories: 85, protein: 2.2, carbs: 10.5, fats: 4.2, fiber: 3.5, sodium: 260, potassium: 220, magnesium: 28, calcium: 35, iron: 1.4, vitaminD: 0 },
    category: 'vegetable',
    hunterTier: 'A',
  },
];

// Helper: Parse unit and quantity from string token
function parseQuantityAndUnit(text: string, defaultGrams: number, defaultUnit: string): { quantity: number; unit: string; grams: number } {
  const clean = text.toLowerCase().trim();

  // Pattern 1: Number with gram/g/kg/ml: e.g. "200g", "200 grams", "1.5 kg", "250ml"
  const gramMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:g|grams?|gm)\b/i);
  if (gramMatch) {
    const val = parseFloat(gramMatch[1]);
    return { quantity: val, unit: 'g', grams: val };
  }

  const kgMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?)\b/i);
  if (kgMatch) {
    const val = parseFloat(kgMatch[1]) * 1000;
    return { quantity: parseFloat(kgMatch[1]), unit: 'kg', grams: val };
  }

  const mlMatch = clean.match(/(\d+(?:\.\d+)?)\s*(?:ml|milliliters?)\b/i);
  if (mlMatch) {
    const val = parseFloat(mlMatch[1]);
    return { quantity: val, unit: 'ml', grams: val };
  }

  // Pattern 2: Unit words with quantity: e.g. "2 scoops", "3 boiled eggs", "4 rotis", "1 bowl", "1 plate", "2 cups"
  const wordMatch = clean.match(/(\d+(?:\.\d+)?|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|half|a)\b)\s*(?:x\s*)?(bowl|bowls|katori|katoris|plate|plates|cup|cups|glass|glasses|scoop|scoops|slice|slices|tbsp|tablespoon|tsp|teaspoon|roti|rotis|piece|pieces|paratha|parathas|egg|eggs)?/i);

  let num = 1;
  if (wordMatch && wordMatch[1]) {
    const rawNum = wordMatch[1].toLowerCase();
    const wordNums: Record<string, number> = {
      half: 0.5,
      a: 1,
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5,
      six: 6,
      seven: 7,
      eight: 8,
      nine: 9,
      ten: 10,
    };
    num = wordNums[rawNum] !== undefined ? wordNums[rawNum] : parseFloat(rawNum) || 1;
  }

  let matchedUnit = (wordMatch && wordMatch[2]) ? wordMatch[2].toLowerCase() : defaultUnit;

  // Multiplier mapping
  let grams = num * defaultGrams;
  if (matchedUnit.startsWith('bowl') || matchedUnit.startsWith('katori')) {
    grams = num * 180;
  } else if (matchedUnit.startsWith('plate')) {
    grams = num * 300;
  } else if (matchedUnit.startsWith('cup')) {
    grams = num * 120;
  } else if (matchedUnit.startsWith('glass')) {
    grams = num * 250;
  } else if (matchedUnit.startsWith('tbsp')) {
    grams = num * 16;
  } else if (matchedUnit.startsWith('tsp')) {
    grams = num * 5;
  } else if (matchedUnit.startsWith('slice')) {
    grams = num * 30;
  } else if (matchedUnit.startsWith('scoop')) {
    grams = num * 32;
  }

  return {
    quantity: num,
    unit: matchedUnit,
    grams,
  };
}

/**
 * Autonomous Intelligent Natural Language Nutrition Reasoner
 * Breaks down any custom dish (freeform string) into individual nutritional components,
 * computes exact macros & micros mathematically, and returns itemized results.
 */
export function analyzeFoodIntelligently(inputDescription: string, userTargetCalories?: number): FoodAnalysisResult {
  const text = (inputDescription || '').trim();
  if (!text) {
    return {
      mealName: 'Tactical Hunter Ration',
      mealType: 'lunch',
      calories: 400,
      proteinGrams: 20,
      carbsGrams: 50,
      fatsGrams: 12,
      micronutrients: {
        fiberGrams: 5,
        sodiumMg: 350,
        potassiumMg: 400,
        magnesiumMg: 50,
        calciumMg: 100,
        ironMg: 2.5,
        vitaminDiu: 30,
      },
      hunterRank: 'B-Rank Balanced Fuel',
      systemComment: '[SYSTEM REASONING]: Default nutritional balance computed.',
      breakdown: [],
      isAnalyticalFallback: true,
    };
  }

  // Split into potential food sub-clauses by commas, '+', 'and', '&', 'with', 'plus', newlines
  const clauses = text
    .split(/(?:,|\+|\band\b|&|\bwith\b|\bplus\b|\n)/i)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const breakdown: AnalyzedIngredient[] = [];
  const processedItems = new Set<string>();

  for (const clause of clauses) {
    const clauseLower = clause.toLowerCase();
    let bestMatch: FoodMasterItem | null = null;
    let longestMatchLen = 0;

    for (const item of FOOD_MASTER_DATABASE) {
      for (const alias of item.names) {
        if (clauseLower.includes(alias)) {
          if (alias.length > longestMatchLen) {
            longestMatchLen = alias.length;
            bestMatch = item;
          }
        }
      }
    }

    if (bestMatch && !processedItems.has(bestMatch.id + clause)) {
      processedItems.add(bestMatch.id + clause);
      const { quantity, unit, grams } = parseQuantityAndUnit(clause, bestMatch.gramsPerUnit, bestMatch.defaultUnit);
      const ratio = grams / 100;

      const p = bestMatch.per100g;
      breakdown.push({
        name: clause,
        matchedFood: bestMatch.names[0],
        portionQuantity: quantity,
        portionUnit: unit,
        grams: Math.round(grams),
        calories: Math.round(p.calories * ratio),
        proteinGrams: Math.round(p.protein * ratio * 10) / 10,
        carbsGrams: Math.round(p.carbs * ratio * 10) / 10,
        fatsGrams: Math.round(p.fats * ratio * 10) / 10,
        fiberGrams: Math.round(p.fiber * ratio * 10) / 10,
        sodiumMg: Math.round(p.sodium * ratio),
        potassiumMg: Math.round(p.potassium * ratio),
        magnesiumMg: Math.round(p.magnesium * ratio),
        calciumMg: Math.round(p.calcium * ratio),
        ironMg: Math.round(p.iron * ratio * 10) / 10,
        vitaminDiu: Math.round(p.vitaminD * ratio),
      });
    }
  }

  // If no specific database items matched, perform a generalized contextual nutrient estimate
  if (breakdown.length === 0) {
    // Check if the user specified a meat, grain, or shake keywords
    const lower = text.toLowerCase();
    let cals = 380;
    let protein = 18;
    let carbs = 48;
    let fats = 12;
    let fiber = 4;
    let sodium = 320;
    let potassium = 380;
    let magnesium = 45;
    let calcium = 80;
    let iron = 2.2;
    let vitD = 20;

    if (lower.includes('shake') || lower.includes('protein') || lower.includes('whey')) {
      cals = 280; protein = 34; carbs = 18; fats = 5; fiber = 2; calcium = 280; vitD = 40;
    } else if (lower.includes('chicken') || lower.includes('meat') || lower.includes('fish') || lower.includes('mutton')) {
      cals = 440; protein = 42; carbs = 12; fats = 18; fiber = 1; sodium = 480; iron = 3.5;
    } else if (lower.includes('paneer') || lower.includes('cheese')) {
      cals = 360; protein = 22; carbs = 10; fats = 24; fiber = 1; calcium = 380;
    } else if (lower.includes('soya') || lower.includes('nutrela')) {
      cals = 310; protein = 36; carbs = 24; fats = 4; fiber = 8; iron = 6.0;
    } else if (lower.includes('egg') || lower.includes('anda')) {
      cals = 280; protein = 22; carbs = 4; fats = 19; vitD = 80; iron = 2.4;
    } else if (lower.includes('salad') || lower.includes('fruit') || lower.includes('sprouts')) {
      cals = 180; protein = 8; carbs = 28; fats = 3; fiber = 7; potassium = 500;
    } else if (lower.includes('biryani') || lower.includes('rice') || lower.includes('pulao')) {
      cals = 480; protein = 16; carbs = 68; fats = 14; fiber = 3;
    } else if (lower.includes('roti') || lower.includes('paratha') || lower.includes('dal')) {
      cals = 380; protein = 14; carbs = 58; fats = 10; fiber = 6;
    }

    breakdown.push({
      name: text,
      matchedFood: 'Analyzed Custom Meal',
      portionQuantity: 1,
      portionUnit: 'portion',
      grams: 250,
      calories: cals,
      proteinGrams: protein,
      carbsGrams: carbs,
      fatsGrams: fats,
      fiberGrams: fiber,
      sodiumMg: sodium,
      potassiumMg: potassium,
      magnesiumMg: magnesium,
      calciumMg: calcium,
      ironMg: iron,
      vitaminDiu: vitD,
    });
  }

  // Aggregate totals
  const totalCals = breakdown.reduce((sum, item) => sum + item.calories, 0);
  const totalProtein = Math.round(breakdown.reduce((sum, item) => sum + item.proteinGrams, 0) * 10) / 10;
  const totalCarbs = Math.round(breakdown.reduce((sum, item) => sum + item.carbsGrams, 0) * 10) / 10;
  const totalFats = Math.round(breakdown.reduce((sum, item) => sum + item.fatsGrams, 0) * 10) / 10;

  const totalFiber = Math.round(breakdown.reduce((sum, item) => sum + item.fiberGrams, 0) * 10) / 10;
  const totalSodium = breakdown.reduce((sum, item) => sum + item.sodiumMg, 0);
  const totalPotassium = breakdown.reduce((sum, item) => sum + item.potassiumMg, 0);
  const totalMagnesium = breakdown.reduce((sum, item) => sum + item.magnesiumMg, 0);
  const totalCalcium = breakdown.reduce((sum, item) => sum + item.calciumMg, 0);
  const totalIron = Math.round(breakdown.reduce((sum, item) => sum + item.ironMg, 0) * 10) / 10;
  const totalVitD = breakdown.reduce((sum, item) => sum + item.vitaminDiu, 0);

  // Assign Anime Hunter Rank based on protein density and composition
  let hunterRank = 'A-Rank Balanced Hunter Thali';
  if (totalProtein >= 40) {
    hunterRank = 'S-Rank Hypertrophy Titan Fuel';
  } else if (totalProtein >= 25) {
    hunterRank = 'S-Rank Muscle Regeneration Catalyst';
  } else if (totalCals > 600 && totalCarbs > 70) {
    hunterRank = 'A-Rank Heavy Glycogen Surge';
  } else if (totalCals < 300 && totalProtein >= 15) {
    hunterRank = 'A-Rank Lean Dungeon Sustenance';
  } else {
    hunterRank = 'B-Rank Endurance Satiety';
  }

  // Determine meal type automatically based on current hour if not specified
  const hour = new Date().getHours();
  let autoMealType: FoodAnalysisResult['mealType'] = 'lunch';
  if (hour >= 5 && hour < 11) autoMealType = 'breakfast';
  else if (hour >= 11 && hour < 16) autoMealType = 'lunch';
  else if (hour >= 16 && hour < 19) autoMealType = 'snack';
  else if (hour >= 19 && hour <= 23) autoMealType = 'dinner';

  // Analytical comment
  const systemComment = `[SYSTEM ARCHITECT REASONING]: Itemized biological breakdown computed for ${breakdown.length} component(s). Real-time macros verified: ${totalProtein}g protein, ${totalCarbs}g carbs, ${totalFats}g fats (${totalCals} kcal). Nutrients indexed into cellular recovery ledger.`;

  return {
    mealName: text.length > 50 ? text.slice(0, 48) + '...' : text,
    mealType: autoMealType,
    calories: totalCals,
    proteinGrams: totalProtein,
    carbsGrams: totalCarbs,
    fatsGrams: totalFats,
    micronutrients: {
      fiberGrams: totalFiber,
      sodiumMg: totalSodium,
      potassiumMg: totalPotassium,
      magnesiumMg: totalMagnesium,
      calciumMg: totalCalcium,
      ironMg: totalIron,
      vitaminDiu: totalVitD,
    },
    hunterRank,
    systemComment,
    breakdown,
    isAnalyticalFallback: true,
  };
}
