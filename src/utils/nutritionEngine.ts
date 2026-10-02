/**
 * Comprehensive Nutrition & Food Intelligence Engine
 * Provides accurate macro & micronutrient calculations for Indian and Global foods,
 * multi-ingredient recipes, and natural language portion parsing.
 */

export interface AnalyzedNutrients {
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
    vitaminDiu: number;
    calciumMg: number;
    ironMg: number;
  };
  hunterRank: string;
  systemComment: string;
  ingredientsDetected: Array<{
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }>;
}

// Master reference database per standard unit or 100g
interface FoodItemRef {
  keywords: string[];
  unitName: string;
  unitWeightGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  sodium: number;
  potassium: number;
  calcium: number;
  iron: number;
  magnesium: number;
  vitaminD: number;
  category: string;
}

export const FOOD_DATABASE: FoodItemRef[] = [
  // --- ROTIS & BREADS ---
  {
    keywords: ['roti', 'chapati', 'phulka'],
    unitName: 'piece (approx 35g whole wheat)',
    unitWeightGrams: 35,
    calories: 90,
    protein: 3.2,
    carbs: 18.0,
    fats: 0.6,
    fiber: 2.5,
    sodium: 4,
    potassium: 85,
    calcium: 12,
    iron: 1.1,
    magnesium: 28,
    vitaminD: 0,
    category: 'bread',
  },
  {
    keywords: ['paratha', 'plain paratha'],
    unitName: 'piece (with ghee/oil, 60g)',
    unitWeightGrams: 60,
    calories: 195,
    protein: 4.2,
    carbs: 26.0,
    fats: 8.5,
    fiber: 2.8,
    sodium: 120,
    potassium: 95,
    calcium: 18,
    iron: 1.4,
    magnesium: 25,
    vitaminD: 0,
    category: 'bread',
  },
  {
    keywords: ['aloo paratha', 'potato paratha'],
    unitName: 'medium paratha (110g)',
    unitWeightGrams: 110,
    calories: 280,
    protein: 5.5,
    carbs: 38.0,
    fats: 12.0,
    fiber: 3.6,
    sodium: 260,
    potassium: 240,
    calcium: 25,
    iron: 1.8,
    magnesium: 32,
    vitaminD: 0,
    category: 'bread',
  },
  {
    keywords: ['paneer paratha'],
    unitName: 'medium paratha (120g)',
    unitWeightGrams: 120,
    calories: 340,
    protein: 14.5,
    carbs: 32.0,
    fats: 17.5,
    fiber: 2.9,
    sodium: 290,
    potassium: 160,
    calcium: 180,
    iron: 1.6,
    magnesium: 35,
    vitaminD: 10,
    category: 'bread',
  },
  {
    keywords: ['naan', 'butter naan'],
    unitName: 'piece (90g)',
    unitWeightGrams: 90,
    calories: 275,
    protein: 7.5,
    carbs: 45.0,
    fats: 7.2,
    fiber: 2.0,
    sodium: 380,
    potassium: 110,
    calcium: 30,
    iron: 1.9,
    magnesium: 22,
    vitaminD: 0,
    category: 'bread',
  },
  {
    keywords: ['bread', 'white bread', 'slice bread'],
    unitName: 'slice (30g)',
    unitWeightGrams: 30,
    calories: 75,
    protein: 2.5,
    carbs: 14.0,
    fats: 0.9,
    fiber: 0.8,
    sodium: 140,
    potassium: 35,
    calcium: 40,
    iron: 0.9,
    magnesium: 7,
    vitaminD: 0,
    category: 'bread',
  },
  {
    keywords: ['brown bread', 'whole wheat bread'],
    unitName: 'slice (32g)',
    unitWeightGrams: 32,
    calories: 78,
    protein: 3.6,
    carbs: 13.2,
    fats: 1.1,
    fiber: 2.1,
    sodium: 130,
    potassium: 75,
    calcium: 45,
    iron: 1.2,
    magnesium: 24,
    vitaminD: 0,
    category: 'bread',
  },

  // --- DAIRY & VEGETARIAN PROTEINS ---
  {
    keywords: ['paneer', 'cottage cheese'],
    unitName: '100g raw/fresh paneer',
    unitWeightGrams: 100,
    calories: 265,
    protein: 18.3,
    carbs: 4.2,
    fats: 20.8,
    fiber: 0,
    sodium: 22,
    potassium: 90,
    calcium: 480,
    iron: 0.3,
    magnesium: 15,
    vitaminD: 18,
    category: 'dairy_protein',
  },
  {
    keywords: ['paneer bhurji'],
    unitName: '1 bowl / 150g cooked',
    unitWeightGrams: 150,
    calories: 310,
    protein: 22.0,
    carbs: 7.5,
    fats: 21.5,
    fiber: 1.8,
    sodium: 360,
    potassium: 190,
    calcium: 450,
    iron: 1.1,
    magnesium: 25,
    vitaminD: 15,
    category: 'dairy_protein',
  },
  {
    keywords: ['soya', 'soya chunks', 'soyabean'],
    unitName: '100g dry soya chunks',
    unitWeightGrams: 100,
    calories: 345,
    protein: 52.0,
    carbs: 33.0,
    fats: 0.5,
    fiber: 13.0,
    sodium: 20,
    potassium: 1750,
    calcium: 350,
    iron: 14.5,
    magnesium: 240,
    vitaminD: 0,
    category: 'vegan_protein',
  },
  {
    keywords: ['tofu'],
    unitName: '100g firm tofu',
    unitWeightGrams: 100,
    calories: 144,
    protein: 15.5,
    carbs: 3.5,
    fats: 8.8,
    fiber: 2.3,
    sodium: 14,
    potassium: 235,
    calcium: 350,
    iron: 2.8,
    magnesium: 58,
    vitaminD: 0,
    category: 'vegan_protein',
  },
  {
    keywords: ['curd', 'dahi', 'yogurt'],
    unitName: '1 bowl / 150g',
    unitWeightGrams: 150,
    calories: 98,
    protein: 6.5,
    carbs: 7.2,
    fats: 4.8,
    fiber: 0,
    sodium: 70,
    potassium: 220,
    calcium: 210,
    iron: 0.2,
    magnesium: 18,
    vitaminD: 8,
    category: 'dairy',
  },
  {
    keywords: ['greek yogurt'],
    unitName: '1 cup / 170g',
    unitWeightGrams: 170,
    calories: 130,
    protein: 17.0,
    carbs: 6.0,
    fats: 4.0,
    fiber: 0,
    sodium: 65,
    potassium: 240,
    calcium: 200,
    iron: 0.1,
    magnesium: 19,
    vitaminD: 10,
    category: 'dairy',
  },
  {
    keywords: ['milk', 'cow milk'],
    unitName: '1 glass / 250ml',
    unitWeightGrams: 250,
    calories: 150,
    protein: 8.2,
    carbs: 12.0,
    fats: 8.0,
    fiber: 0,
    sodium: 115,
    potassium: 350,
    calcium: 300,
    iron: 0.1,
    magnesium: 28,
    vitaminD: 98,
    category: 'dairy',
  },
  {
    keywords: ['sattu', 'sattu drink', 'chana sattu'],
    unitName: '40g powder (1 glass drink)',
    unitWeightGrams: 40,
    calories: 165,
    protein: 10.5,
    carbs: 26.0,
    fats: 2.2,
    fiber: 6.5,
    sodium: 15,
    potassium: 310,
    calcium: 45,
    iron: 3.8,
    magnesium: 48,
    vitaminD: 0,
    category: 'protein',
  },
  {
    keywords: ['whey', 'whey protein', 'protein powder', 'protein shake'],
    unitName: '1 scoop (32g)',
    unitWeightGrams: 32,
    calories: 125,
    protein: 25.0,
    carbs: 2.5,
    fats: 1.5,
    fiber: 0.5,
    sodium: 140,
    potassium: 160,
    calcium: 150,
    iron: 0.8,
    magnesium: 25,
    vitaminD: 20,
    category: 'supplement',
  },

  // --- DALS & LENTILS ---
  {
    keywords: ['dal', 'dal tadka', 'yellow dal', 'toor dal', 'moong dal'],
    unitName: '1 medium bowl (180g cooked)',
    unitWeightGrams: 180,
    calories: 160,
    protein: 9.2,
    carbs: 23.5,
    fats: 3.5,
    fiber: 6.2,
    sodium: 320,
    potassium: 380,
    calcium: 38,
    iron: 2.4,
    magnesium: 55,
    vitaminD: 0,
    category: 'lentils',
  },
  {
    keywords: ['dal makhani'],
    unitName: '1 medium bowl (200g)',
    unitWeightGrams: 200,
    calories: 280,
    protein: 10.5,
    carbs: 28.0,
    fats: 14.5,
    fiber: 7.5,
    sodium: 460,
    potassium: 420,
    calcium: 75,
    iron: 3.1,
    magnesium: 62,
    vitaminD: 5,
    category: 'lentils',
  },
  {
    keywords: ['chana', 'chole', 'chana masala', 'kabuli chana'],
    unitName: '1 medium bowl (180g)',
    unitWeightGrams: 180,
    calories: 240,
    protein: 11.8,
    carbs: 34.0,
    fats: 6.5,
    fiber: 8.5,
    sodium: 380,
    potassium: 440,
    calcium: 68,
    iron: 3.6,
    magnesium: 65,
    vitaminD: 0,
    category: 'lentils',
  },
  {
    keywords: ['rajma', 'rajma masala', 'kidney beans'],
    unitName: '1 medium bowl (180g)',
    unitWeightGrams: 180,
    calories: 220,
    protein: 12.0,
    carbs: 32.5,
    fats: 4.8,
    fiber: 9.0,
    sodium: 340,
    potassium: 490,
    calcium: 60,
    iron: 3.4,
    magnesium: 58,
    vitaminD: 0,
    category: 'lentils',
  },
  {
    keywords: ['moong dal chilla', 'besan chilla', 'cheela'],
    unitName: '1 chilla (80g)',
    unitWeightGrams: 80,
    calories: 125,
    protein: 6.8,
    carbs: 16.5,
    fats: 3.8,
    fiber: 3.2,
    sodium: 180,
    potassium: 190,
    calcium: 28,
    iron: 1.8,
    magnesium: 35,
    vitaminD: 0,
    category: 'lentils',
  },

  // --- RICE, GRAINS & SOUTH INDIAN ---
  {
    keywords: ['rice', 'white rice', 'steamed rice', 'boiled rice'],
    unitName: '1 cup cooked (160g)',
    unitWeightGrams: 160,
    calories: 205,
    protein: 4.2,
    carbs: 45.0,
    fats: 0.4,
    fiber: 0.6,
    sodium: 2,
    potassium: 55,
    calcium: 16,
    iron: 1.8,
    magnesium: 19,
    vitaminD: 0,
    category: 'grain',
  },
  {
    keywords: ['brown rice'],
    unitName: '1 cup cooked (160g)',
    unitWeightGrams: 160,
    calories: 215,
    protein: 5.0,
    carbs: 45.5,
    fats: 1.8,
    fiber: 3.5,
    sodium: 3,
    potassium: 85,
    calcium: 20,
    iron: 1.1,
    magnesium: 84,
    vitaminD: 0,
    category: 'grain',
  },
  {
    keywords: ['biryani', 'chicken biryani'],
    unitName: '1 full plate (350g)',
    unitWeightGrams: 350,
    calories: 540,
    protein: 34.0,
    carbs: 65.0,
    fats: 16.0,
    fiber: 3.5,
    sodium: 680,
    potassium: 480,
    calcium: 60,
    iron: 3.2,
    magnesium: 52,
    vitaminD: 12,
    category: 'meal',
  },
  {
    keywords: ['veg biryani'],
    unitName: '1 full plate (320g)',
    unitWeightGrams: 320,
    calories: 420,
    protein: 10.5,
    carbs: 70.0,
    fats: 11.0,
    fiber: 5.2,
    sodium: 520,
    potassium: 360,
    calcium: 55,
    iron: 2.4,
    magnesium: 48,
    vitaminD: 0,
    category: 'meal',
  },
  {
    keywords: ['oats', 'oatmeal'],
    unitName: '1 cup cooked / 50g dry',
    unitWeightGrams: 50,
    calories: 190,
    protein: 6.8,
    carbs: 34.0,
    fats: 3.5,
    fiber: 5.2,
    sodium: 2,
    potassium: 180,
    calcium: 26,
    iron: 2.1,
    magnesium: 69,
    vitaminD: 0,
    category: 'grain',
  },
  {
    keywords: ['poha'],
    unitName: '1 medium plate (180g cooked)',
    unitWeightGrams: 180,
    calories: 250,
    protein: 4.8,
    carbs: 44.0,
    fats: 6.5,
    fiber: 2.5,
    sodium: 290,
    potassium: 140,
    calcium: 22,
    iron: 4.2,
    magnesium: 30,
    vitaminD: 0,
    category: 'breakfast',
  },
  {
    keywords: ['upma'],
    unitName: '1 bowl (180g)',
    unitWeightGrams: 180,
    calories: 240,
    protein: 5.5,
    carbs: 38.0,
    fats: 7.2,
    fiber: 2.8,
    sodium: 340,
    potassium: 110,
    calcium: 20,
    iron: 1.8,
    magnesium: 25,
    vitaminD: 0,
    category: 'breakfast',
  },
  {
    keywords: ['idli'],
    unitName: '1 piece (45g)',
    unitWeightGrams: 45,
    calories: 55,
    protein: 2.0,
    carbs: 11.5,
    fats: 0.3,
    fiber: 0.9,
    sodium: 90,
    potassium: 40,
    calcium: 12,
    iron: 0.5,
    magnesium: 12,
    vitaminD: 0,
    category: 'breakfast',
  },
  {
    keywords: ['dosa', 'masala dosa', 'plain dosa'],
    unitName: '1 medium dosa (120g)',
    unitWeightGrams: 120,
    calories: 220,
    protein: 5.2,
    carbs: 36.0,
    fats: 6.8,
    fiber: 2.2,
    sodium: 280,
    potassium: 120,
    calcium: 25,
    iron: 1.4,
    magnesium: 26,
    vitaminD: 0,
    category: 'breakfast',
  },
  {
    keywords: ['sambar'],
    unitName: '1 small bowl (150g)',
    unitWeightGrams: 150,
    calories: 90,
    protein: 3.8,
    carbs: 14.5,
    fats: 2.0,
    fiber: 3.5,
    sodium: 380,
    potassium: 240,
    calcium: 35,
    iron: 1.5,
    magnesium: 28,
    vitaminD: 0,
    category: 'soup',
  },

  // --- EGGS & POULTRY & MEATS ---
  {
    keywords: ['egg', 'boiled egg', 'whole egg'],
    unitName: '1 large whole egg (50g)',
    unitWeightGrams: 50,
    calories: 74,
    protein: 6.3,
    carbs: 0.4,
    fats: 5.0,
    fiber: 0,
    sodium: 70,
    potassium: 69,
    calcium: 28,
    iron: 0.9,
    magnesium: 6,
    vitaminD: 44,
    category: 'protein',
  },
  {
    keywords: ['egg white', 'egg whites'],
    unitName: '1 large egg white (33g)',
    unitWeightGrams: 33,
    calories: 17,
    protein: 3.6,
    carbs: 0.2,
    fats: 0.1,
    fiber: 0,
    sodium: 55,
    potassium: 54,
    calcium: 2,
    iron: 0.1,
    magnesium: 4,
    vitaminD: 0,
    category: 'protein',
  },
  {
    keywords: ['omelet', 'egg omelette', 'omelette'],
    unitName: '2-egg omelette with veggies (120g)',
    unitWeightGrams: 120,
    calories: 210,
    protein: 14.0,
    carbs: 3.5,
    fats: 15.5,
    fiber: 1.0,
    sodium: 260,
    potassium: 190,
    calcium: 65,
    iron: 2.1,
    magnesium: 18,
    vitaminD: 85,
    category: 'protein',
  },
  {
    keywords: ['chicken', 'chicken breast', 'grilled chicken', 'boiled chicken'],
    unitName: '100g cooked skinless breast',
    unitWeightGrams: 100,
    calories: 165,
    protein: 31.0,
    carbs: 0.0,
    fats: 3.6,
    fiber: 0,
    sodium: 74,
    potassium: 256,
    calcium: 15,
    iron: 1.0,
    magnesium: 29,
    vitaminD: 5,
    category: 'protein',
  },
  {
    keywords: ['chicken curry'],
    unitName: '1 medium bowl with gravy (200g)',
    unitWeightGrams: 200,
    calories: 290,
    protein: 26.5,
    carbs: 7.0,
    fats: 17.0,
    fiber: 1.5,
    sodium: 540,
    potassium: 380,
    calcium: 32,
    iron: 2.2,
    magnesium: 38,
    vitaminD: 8,
    category: 'protein',
  },
  {
    keywords: ['fish', 'fish curry', 'grilled fish'],
    unitName: '150g portion',
    unitWeightGrams: 150,
    calories: 210,
    protein: 28.0,
    carbs: 3.0,
    fats: 9.5,
    fiber: 0.5,
    sodium: 320,
    potassium: 460,
    calcium: 45,
    iron: 1.6,
    magnesium: 42,
    vitaminD: 180,
    category: 'protein',
  },
  {
    keywords: ['mutton', 'mutton curry', 'lamb'],
    unitName: '150g portion',
    unitWeightGrams: 150,
    calories: 360,
    protein: 27.0,
    carbs: 5.0,
    fats: 25.0,
    fiber: 1.0,
    sodium: 480,
    potassium: 360,
    calcium: 25,
    iron: 3.2,
    magnesium: 32,
    vitaminD: 10,
    category: 'protein',
  },

  // --- HEALTHY FATS, NUTS & OTHERS ---
  {
    keywords: ['almonds', 'badam'],
    unitName: 'handful / 10 almonds (15g)',
    unitWeightGrams: 15,
    calories: 88,
    protein: 3.2,
    carbs: 3.2,
    fats: 7.5,
    fiber: 1.8,
    sodium: 0,
    potassium: 105,
    calcium: 40,
    iron: 0.6,
    magnesium: 40,
    vitaminD: 0,
    category: 'nuts',
  },
  {
    keywords: ['peanut butter', 'peanuts'],
    unitName: '1 tbsp (16g)',
    unitWeightGrams: 16,
    calories: 95,
    protein: 4.0,
    carbs: 3.5,
    fats: 8.0,
    fiber: 1.0,
    sodium: 75,
    potassium: 100,
    calcium: 8,
    iron: 0.3,
    magnesium: 25,
    vitaminD: 0,
    category: 'nuts',
  },
  {
    keywords: ['banana', 'kela'],
    unitName: '1 medium banana (118g)',
    unitWeightGrams: 118,
    calories: 105,
    protein: 1.3,
    carbs: 27.0,
    fats: 0.3,
    fiber: 3.1,
    sodium: 1,
    potassium: 422,
    calcium: 6,
    iron: 0.3,
    magnesium: 32,
    vitaminD: 0,
    category: 'fruit',
  },
  {
    keywords: ['apple', 'seb'],
    unitName: '1 medium apple (180g)',
    unitWeightGrams: 180,
    calories: 95,
    protein: 0.5,
    carbs: 25.0,
    fats: 0.3,
    fiber: 4.4,
    sodium: 2,
    potassium: 195,
    calcium: 11,
    iron: 0.2,
    magnesium: 9,
    vitaminD: 0,
    category: 'fruit',
  },
  {
    keywords: ['ghee', 'butter'],
    unitName: '1 tsp (5g)',
    unitWeightGrams: 5,
    calories: 45,
    protein: 0.0,
    carbs: 0.0,
    fats: 5.0,
    fiber: 0,
    sodium: 1,
    potassium: 2,
    calcium: 2,
    iron: 0,
    magnesium: 0,
    vitaminD: 6,
    category: 'fats',
  },
];

/**
 * Intelligent Multi-Ingredient Real-Time Nutrition Parser
 * Parses natural text such as:
 * "3 boiled eggs, 2 rotis and 100g paneer"
 * "chicken biryani with curd"
 * "2 scoops whey and 1 banana with milk"
 */
export function parseMealNutrientsLocally(
  description: string,
  userProfile?: { weightKg?: number; targetCalories?: number }
): AnalyzedNutrients {
  const cleanInput = (description || '').trim();
  const lower = cleanInput.toLowerCase();

  // Split clauses by commas, pluses, "and", "with", "&", or newlines
  const rawClauses = lower
    .split(/[,+&]|\band\b|\bwith\b|\n/g)
    .map((c) => c.trim())
    .filter((c) => c.length > 0);

  const matchedItems: Array<{
    name: string;
    portion: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
    sodium: number;
    potassium: number;
    calcium: number;
    iron: number;
    magnesium: number;
    vitaminD: number;
  }> = [];

  for (const clause of rawClauses) {
    // 1. Check for explicit numbers / grams (e.g., "100g", "200 grams", "2", "3")
    const gramMatch = clause.match(/(\d+)\s*(g|grams|gm|ml)/i);
    const countMatch = clause.match(/(\d+(\.\d+)?)\s*(x|piece|pieces|slice|slices|bowl|bowls|cup|cups|scoop|scoops|plate|plates|glass|glasses)?/i);

    let foundMatch: FoodItemRef | null = null;
    for (const ref of FOOD_DATABASE) {
      if (ref.keywords.some((k) => clause.includes(k))) {
        foundMatch = ref;
        break;
      }
    }

    if (foundMatch) {
      let multiplier = 1;

      if (gramMatch) {
        const grams = parseFloat(gramMatch[1]);
        multiplier = Math.max(0.2, grams / (foundMatch.unitWeightGrams || 100));
      } else if (countMatch && parseFloat(countMatch[1]) > 0) {
        multiplier = parseFloat(countMatch[1]);
      }

      matchedItems.push({
        name: foundMatch.keywords[0].toUpperCase(),
        portion: `${multiplier}x (${foundMatch.unitName})`,
        calories: Math.round(foundMatch.calories * multiplier),
        protein: Math.round(foundMatch.protein * multiplier * 10) / 10,
        carbs: Math.round(foundMatch.carbs * multiplier * 10) / 10,
        fats: Math.round(foundMatch.fats * multiplier * 10) / 10,
        fiber: Math.round(foundMatch.fiber * multiplier * 10) / 10,
        sodium: Math.round(foundMatch.sodium * multiplier),
        potassium: Math.round(foundMatch.potassium * multiplier),
        calcium: Math.round(foundMatch.calcium * multiplier),
        iron: Math.round(foundMatch.iron * multiplier * 10) / 10,
        magnesium: Math.round(foundMatch.magnesium * multiplier),
        vitaminD: Math.round(foundMatch.vitaminD * multiplier),
      });
    }
  }

  // If no specific database items matched, perform intelligent contextual linguistic estimation
  if (matchedItems.length === 0) {
    // Extract any numbers or portion cues
    let estCals = 380;
    let estProtein = 16.0;
    let estCarbs = 48.0;
    let estFats = 12.0;

    if (lower.includes('salad') || lower.includes('cucumber') || lower.includes('sprout')) {
      estCals = 160; estProtein = 8.0; estCarbs = 24.0; estFats = 3.0;
    } else if (lower.includes('pizza') || lower.includes('burger')) {
      estCals = 580; estProtein = 22.0; estCarbs = 62.0; estFats = 26.0;
    } else if (lower.includes('sweet') || lower.includes('dessert') || lower.includes('gulab jamun') || lower.includes('halwa')) {
      estCals = 350; estProtein = 4.0; estCarbs = 54.0; estFats = 14.0;
    } else if (lower.includes('protein') || lower.includes('shake') || lower.includes('meat')) {
      estCals = 320; estProtein = 35.0; estCarbs = 18.0; estFats = 6.0;
    }

    matchedItems.push({
      name: cleanInput || 'Custom Dish',
      portion: '1 Serving',
      calories: estCals,
      protein: estProtein,
      carbs: estCarbs,
      fats: estFats,
      fiber: 4,
      sodium: 320,
      potassium: 360,
      calcium: 80,
      iron: 2.2,
      magnesium: 45,
      vitaminD: 20,
    });
  }

  // Aggregate all items
  const totalCalories = matchedItems.reduce((acc, i) => acc + i.calories, 0);
  const totalProtein = Math.round(matchedItems.reduce((acc, i) => acc + i.protein, 0) * 10) / 10;
  const totalCarbs = Math.round(matchedItems.reduce((acc, i) => acc + i.carbs, 0) * 10) / 10;
  const totalFats = Math.round(matchedItems.reduce((acc, i) => acc + i.fats, 0) * 10) / 10;
  const totalFiber = Math.round(matchedItems.reduce((acc, i) => acc + i.fiber, 0) * 10) / 10;
  const totalSodium = matchedItems.reduce((acc, i) => acc + i.sodium, 0);
  const totalPotassium = matchedItems.reduce((acc, i) => acc + i.potassium, 0);
  const totalCalcium = matchedItems.reduce((acc, i) => acc + i.calcium, 0);
  const totalIron = Math.round(matchedItems.reduce((acc, i) => acc + i.iron, 0) * 10) / 10;
  const totalMagnesium = matchedItems.reduce((acc, i) => acc + i.magnesium, 0);
  const totalVitaminD = matchedItems.reduce((acc, i) => acc + i.vitaminD, 0);

  // Assign Anime Rank
  let rank = 'B-Rank Fuel';
  if (totalProtein >= 40) rank = 'S-Rank Sovereign Hypertrophy';
  else if (totalProtein >= 25) rank = 'A-Rank High-Protein Sustenance';
  else if (totalCalories >= 600) rank = 'A-Rank Heavy Energy Load';
  else if (totalFiber >= 8) rank = 'A-Rank Clean Bio-Fiber';

  // System Comment
  const systemComment = `[SYSTEM METABOLIC BIO-ANALYSIS]: Registered ${totalCalories} kcal (${totalProtein}g protein, ${totalCarbs}g carbs, ${totalFats}g fats) across ${matchedItems.length} parsed items. Real-time amino delivery initialized.`;

  return {
    mealName: cleanInput || 'Custom Hunter Meal',
    mealType: 'lunch',
    calories: totalCalories,
    proteinGrams: totalProtein,
    carbsGrams: totalCarbs,
    fatsGrams: totalFats,
    micronutrients: {
      fiberGrams: totalFiber,
      sodiumMg: totalSodium,
      potassiumMg: totalPotassium,
      magnesiumMg: totalMagnesium,
      vitaminDiu: totalVitaminD,
      calciumMg: totalCalcium,
      ironMg: totalIron,
    },
    hunterRank: rank,
    systemComment,
    ingredientsDetected: matchedItems,
  };
}
