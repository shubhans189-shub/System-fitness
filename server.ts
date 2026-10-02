import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { analyzeFoodIntelligently } from './src/utils/intelligentNutritionEngine';
import { generateAnalyticalCoachResponse } from './src/utils/analyticalCoachEngine';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy init Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

function withTimeout<T>(promise: Promise<T>, ms: number = 6000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Model timeout after ${ms}ms`)), ms)),
  ]);
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Check AI status
app.get('/api/gemini/status', (req: Request, res: Response) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY);
  res.json({
    online: true,
    hasApiKey: hasKey,
    model: 'gemini-3.8-flash',
    guardian: 'Sung Jin-woo (Shadow Monarch / System Architect)',
  });
});

// System AI Coach Endpoint (Sung Jin-woo / The System Architect)
app.post('/api/gemini/coach', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  const userProfile = req.body.userProfile || req.body.playerData?.profile || {};
  const currentStats = req.body.currentStats || req.body.playerData?.stats || {};
  const currentQuest = req.body.currentQuest || req.body.playerData?.currentQuest || [];
  const dailyCheckIn = req.body.dailyCheckIn || req.body.playerData?.dailyCheckIn;
  const activeTitle = currentStats?.equippedTitle || currentStats?.title || 'Awakened Hunter';
  const consumedCalories = Number(req.body.consumedCalories) || 0;
  const consumedProtein = Number(req.body.consumedProtein) || 0;
  const waterIntakeMl = Number(req.body.waterIntakeMl) || 0;

  if (!message || typeof message !== 'string') {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  // System instruction for Sung Jin-woo & The System Architect
  const systemInstruction = `You are 'The System Architect' and Sung Jin-woo (The Shadow Monarch) from Solo Leveling serving as the personal analytical AI coach for Player ${userProfile?.name || 'Hunter'}.

CORE ARCHITECTURAL DIRECTIVES:
1. THINK ON YOUR OWN AS AN ANALYTICAL, HIGH-IQ SYSTEM AI:
   - Provide concrete, numbers-based, analytical answers. Never recite generic boilerplate, vague disclaimers, or repetitive default statements.
   - For workout biomechanics (push-ups, squats, running, pull-ups), calculate work volume, joint angles (e.g. 45-60 degree elbow flare, 85-degree shin angle), eccentric tempo (e.g. 3-0-1), set/rep schemes (e.g. 5x20 or EMOM), and CNS recovery.
   - For nutrition (Indian regional staples like paneer, soya chunks, sattu, moong dal chilla, rotis, parathas, dal tadka, as well as global sports nutrition like whey, chicken, eggs, rice), state exact grams of protein, carbohydrate replenishment, fat ratios, and timing.
   - For mindset, discipline, and overcoming laziness or mental fatigue: Speak with the unshakeable resolve of Sung Jin-woo who climbed from humankind's weakest E-Rank hunter to the supreme Shadow Monarch.
2. CONTEXTUAL METRICS ANALYSIS:
   - Player Rank: ${currentStats?.rank || 'E-Rank'} | Level: ${currentStats?.level || 1} | Title: "${activeTitle}"
   - Attributes: STR ${currentStats?.str || 10} | AGI ${currentStats?.agi || 10} | VIT ${currentStats?.vit || 10} | INT ${currentStats?.int || 10} | PER ${currentStats?.per || 10}
   - Bodyweight: ${userProfile?.weightKg || 70}kg | Height: ${userProfile?.heightCm || 175}cm
   - Daily Calorie Target: ${userProfile?.targetCalories || 2300} kcal (TDEE: ${userProfile?.maintenanceCalories || 2200} kcal)
   - Logged Today: ${consumedCalories} kcal consumed, ${consumedProtein}g protein consumed (Goal: ${userProfile?.proteinGrams || 140}g)
   - Today's Quests: ${JSON.stringify(currentQuest)}
   - Sleep / Biological Check-In: ${dailyCheckIn ? `${dailyCheckIn.sleepHours}h sleep (${dailyCheckIn.sleepQuality}), Mindset: ${dailyCheckIn.mood}, Stamina Buff: +${dailyCheckIn.staminaBuffPercent || 0}%` : 'Default baseline'}
3. PERSONA & FORMAT:
   - Authoritative, precise, tactical, empowering, analytical.
   - Use immersive system alert tags:
     [SYSTEM TACTICAL DIRECTIVE]
     [PHYSIOLOGICAL & BIOMECHANICAL ANALYSIS]
     [METABOLIC & NUTRITIONAL PRESCRIPTION]
     [THE SHADOW MONARCH'S MANDATE]`;

  let ai: GoogleGenAI | null = null;
  try {
    ai = getAiClient();
  } catch (e: any) {
    ai = null;
  }

  if (ai) {
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-8)) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.parts?.[0]?.text || h.text || h.content || '' }],
        });
      }
    }

    const contextualMessage = `Player Query: ${message}
Live Player Metrics:
- Rank: ${currentStats?.rank || 'E-Rank'} (Level ${currentStats?.level || 1}) | Title: "${activeTitle}"
- Weight: ${userProfile?.weightKg || 70}kg | Target Energy: ${userProfile?.targetCalories || 2300} kcal
- Energy Logged Today: ${consumedCalories} kcal | Protein Logged: ${consumedProtein}g / ${userProfile?.proteinGrams || 140}g target
- Water Today: ${waterIntakeMl}ml / ${Math.round((userProfile?.waterTargetLiters || 3) * 1000)}ml
- Sleep: ${dailyCheckIn ? `${dailyCheckIn.sleepHours}h (${dailyCheckIn.sleepQuality})` : '7.0h'}
- Active Quests: ${JSON.stringify(currentQuest)}`;

    contents.push({
      role: 'user',
      parts: [{ text: contextualMessage }],
    });

    // Try models in order: gemini-3.8-flash -> gemini-flash-latest -> gemini-3.1-flash-lite
    const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    for (const modelName of modelsToTry) {
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7,
              topP: 0.9,
            },
          }),
          6000
        );

        if (response?.text) {
          res.json({ reply: response.text, engine: 'gemini', model: modelName });
          return;
        }
      } catch (err: any) {
        console.warn(`[SYSTEM] Model ${modelName} call failed or quota exceeded:`, err?.message);
        // Continue to fallback model
      }
    }
  }

  // If AI was unavailable, quota exceeded, or failed: invoke autonomous analytical coach engine
  const analyticalResponse = generateAnalyticalCoachResponse({
    message,
    userProfile,
    stats: currentStats,
    questItems: currentQuest,
    dailyCheckIn,
    consumedCalories,
    consumedProtein,
    waterIntakeMl,
  });

  res.json({
    reply: analyticalResponse,
    engine: 'analytical_engine',
    isOfflineEngine: true,
  });
});

// AI Food & Meal Nutrient Analysis Endpoint
app.post('/api/gemini/analyze-meal', async (req: Request, res: Response) => {
  const { description, imageBase64, imageMimeType, userProfile } = req.body;

  if (!description && !imageBase64) {
    res.status(400).json({ error: 'Either food description or photo is required' });
    return;
  }

  let ai: GoogleGenAI | null = null;
  try {
    ai = getAiClient();
  } catch (e) {
    ai = null;
  }

  if (ai) {
    const systemInstruction = `You are 'The System' from Solo Leveling, operating as the Sung Jin-woo Hunter Metabolic & Nutrient Scanner.
Your mission: Accurately and realistically analyze ANY food image and/or text description provided by the Hunter, with complete nutritional mastery of ALL cuisines, especially Indian regional foods (Rotis, Parathas, Dal Tadka, Dal Makhani, Rajma Chawal, Chole, Biryani, Idli, Dosa, Paneer, Soya Chunks, Sattu, Besan Chilla, Curd, etc.) and global athletic foods.

ACCURACY RULES - CRITICAL:
1. mealName: Specific dish name with portions (e.g. "3 Phulkas with 1 Bowl Dal Tadka & 100g Curd", "200g Grilled Chicken Breast & White Rice", "2 Scoops Whey in 350ml Milk with 1 Banana").
2. mealType: "breakfast", "lunch", "dinner", "snack", "pre_workout", or "post_workout".
3. calories: Realistic total kcal mathematically scaled by the exact portions described.
4. proteinGrams, carbsGrams, fatsGrams: Exact realistic grams based on nutritional science. NEVER default to 30g protein. Calculate genuine values.
5. Key recovery micronutrients: fiberGrams, sodiumMg, potassiumMg, magnesiumMg, vitaminDiu, calciumMg, ironMg.
6. hunterRank: Assign an anime tier rating (e.g. "S-Rank Hypertrophy Fuel", "A-Rank Balanced Hunter Thali", "B-Rank Endurance Glycogen").
7. systemComment: 1-2 sentence immersive hunter comment referencing Sung Jin-woo's training and cellular muscle synthesis.

Return strictly JSON adhering to the schema.`;

    const parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: imageMimeType || 'image/jpeg',
          data: imageBase64,
        },
      });
    }

    const textPrompt = `Analyze this food for Hunter ${userProfile?.name || 'Player'}.
Dish Description/Context: "${description || 'Identify the dish and portion sizes from the image.'}"
Hunter Weight: ${userProfile?.weightKg || 70}kg, Target Calories: ${userProfile?.targetCalories || 2300} kcal.
Calculate exact realistic macros and micros. Do not use generic placeholders.`;

    parts.push({ text: textPrompt });

    const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
    for (const modelName of modelsToTry) {
      try {
        const response = await withTimeout(
          ai.models.generateContent({
            model: modelName,
            contents: { parts },
            config: {
              systemInstruction,
              temperature: 0.2,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  mealName: { type: Type.STRING, description: 'Specific dish or food items with portions' },
                  mealType: { type: Type.STRING, description: 'breakfast, lunch, dinner, snack, pre_workout, or post_workout' },
                  calories: { type: Type.INTEGER, description: 'Calculated calories in kcal' },
                  proteinGrams: { type: Type.NUMBER, description: 'Actual calculated protein in grams' },
                  carbsGrams: { type: Type.NUMBER, description: 'Actual calculated carbohydrates in grams' },
                  fatsGrams: { type: Type.NUMBER, description: 'Actual calculated fats in grams' },
                  micronutrients: {
                    type: Type.OBJECT,
                    properties: {
                      fiberGrams: { type: Type.NUMBER, description: 'Dietary fiber in grams' },
                      sodiumMg: { type: Type.NUMBER, description: 'Sodium in milligrams' },
                      potassiumMg: { type: Type.NUMBER, description: 'Potassium in milligrams' },
                      magnesiumMg: { type: Type.NUMBER, description: 'Magnesium in milligrams' },
                      vitaminDiu: { type: Type.NUMBER, description: 'Vitamin D in IU' },
                      calciumMg: { type: Type.NUMBER, description: 'Calcium in milligrams' },
                      ironMg: { type: Type.NUMBER, description: 'Iron in milligrams' },
                    },
                  },
                  hunterRank: { type: Type.STRING, description: 'Anime tier rating for this meal' },
                  systemComment: { type: Type.STRING, description: 'Sung Jin-woo tactical recovery comment' },
                },
                required: ['mealName', 'calories', 'proteinGrams', 'carbsGrams', 'fatsGrams', 'hunterRank', 'systemComment'],
              },
            },
          }),
          7000
        );

        if (response?.text) {
          const parsed = JSON.parse(response.text);
          res.json({
            ...parsed,
            engine: 'gemini',
            model: modelName,
          });
          return;
        }
      } catch (err: any) {
        console.warn(`[SYSTEM] Meal analysis with model ${modelName} failed:`, err?.message);
        // Continue to fallback model
      }
    }
  }

  // If Gemini failed or quota exceeded: execute Autonomous Intelligent Nutrition Engine
  // Never give standard 30g protein! Calculate actual macros and breakdown!
  const computed = analyzeFoodIntelligently(description || 'Hunter Tactical Ration', userProfile?.targetCalories);
  res.json({
    ...computed,
    engine: 'intelligent_nutrition_engine',
  });
});

// Setup Vite development middleware or static production serving
async function initServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SYSTEM] Server listening on http://0.0.0.0:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error('[SYSTEM] Failed to start server:', err);
  process.exit(1);
});
