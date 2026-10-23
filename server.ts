import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

// Safely load local .env if available
try {
  if (typeof (process as any).loadEnvFile === 'function') {
    (process as any).loadEnvFile();
  }
} catch {
  // .env file not found or already in environment
}

import {
  MOCK_PRODUCE,
  MOCK_PRICE_INDEX,
  MOCK_INITIAL_ORDERS,
  MOCK_DEMAND_REQUESTS,
  MOCK_REQUEST_OFFERS,
  MOCK_CONVERSATIONS
} from './src/data/mockFarmData.js';

const app = express();
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Candidate models in fallback order
const CANDIDATE_GEMINI_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.5-flash',
  'gemini-flash-latest',
  'gemini-3-flash-preview'
];

async function callGemini(prompt: string): Promise<string> {
  if (!ai) {
    throw new Error('Gemini API client not initialized (missing GEMINI_API_KEY)');
  }
  let lastError: any = null;
  for (const model of CANDIDATE_GEMINI_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      console.warn(`[Gemini] Model ${model} failed, trying next candidate:`, err.message || err);
      lastError = err;
    }
  }
  throw lastError || new Error('All candidate Gemini models failed');
}

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Produce APIs
app.get('/api/produce', (req: Request, res: Response) => {
  const { category, lga, nearMe } = req.query;
  let items = [...MOCK_PRODUCE];

  if (category && category !== 'All') {
    items = items.filter(i => i.category === category);
  }
  if (lga && lga !== 'All') {
    items = items.filter(i => i.lga === lga);
  }
  if (nearMe === 'true') {
    items = items.filter(i => i.isHyperlocalNearMe);
  }

  res.json({ success: true, produce: items });
});

app.post('/api/produce', (req: Request, res: Response) => {
  const newItem = {
    id: `p-${Date.now()}`,
    ...req.body,
    freshness: 'GRADE_A_TODAY',
    isAvailable: true,
    created_at: new Date().toISOString()
  };
  MOCK_PRODUCE.unshift(newItem);
  res.status(201).json({ success: true, item: newItem });
});

app.get('/api/market-prices', (_req: Request, res: Response) => {
  res.json({ success: true, prices: MOCK_PRICE_INDEX });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const order = {
    id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
    ...req.body,
    status: 'PLACED',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };
  MOCK_INITIAL_ORDERS.unshift(order);
  res.status(201).json({ success: true, order });
});

// ==========================================================
// DEMAND BOARD (RFQ) APIS
// ==========================================================

app.get('/api/demand-requests', (req: Request, res: Response) => {
  const { category, lga, status } = req.query;
  let requests = [...MOCK_DEMAND_REQUESTS];

  if (category && category !== 'All') {
    requests = requests.filter(r => r.category === category);
  }
  if (lga && lga !== 'All') {
    requests = requests.filter(r => r.locationLGA === lga);
  }
  if (status && status !== 'All') {
    requests = requests.filter(r => r.status === status);
  }

  res.json({ success: true, requests });
});

app.post('/api/demand-requests', (req: Request, res: Response) => {
  const newRequest = {
    id: `req-${Date.now()}`,
    ...req.body,
    status: 'OPEN',
    offersCount: 0,
    createdAt: 'Just now'
  };
  MOCK_DEMAND_REQUESTS.unshift(newRequest);
  res.status(201).json({ success: true, request: newRequest });
});

app.post('/api/demand-requests/:id/offers', (req: Request, res: Response) => {
  const { id } = req.params;
  const newOffer = {
    id: `off-${Date.now()}`,
    requestId: id,
    ...req.body,
    status: 'PENDING',
    createdAt: 'Just now'
  };

  MOCK_REQUEST_OFFERS.unshift(newOffer);

  // Update offer count on request
  const request = MOCK_DEMAND_REQUESTS.find(r => r.id === id);
  if (request) {
    request.offersCount += 1;
    request.status = 'OFFER_RECEIVED';
  }

  res.status(201).json({ success: true, offer: newOffer });
});

// ==========================================================
// IN-APP DIRECT CHAT APIS
// ==========================================================

app.get('/api/conversations', (_req: Request, res: Response) => {
  res.json({ success: true, conversations: MOCK_CONVERSATIONS });
});

app.get('/api/conversations/:id/messages', (req: Request, res: Response) => {
  const { id } = req.params;
  const conversation = MOCK_CONVERSATIONS.find(c => c.id === id);
  if (!conversation) {
    res.status(404).json({ error: 'Conversation not found' });
    return;
  }
  res.json({ success: true, messages: conversation.messages });
});

app.post('/api/conversations/:id/messages', (req: Request, res: Response) => {
  const { id } = req.params;
  const conversation = MOCK_CONVERSATIONS.find(c => c.id === id);
  if (!conversation) {
    res.status(404).json({ error: 'Conversation not found' });
    return;
  }

  const newMessage = {
    id: `msg-${Date.now()}`,
    conversationId: id,
    ...req.body,
    createdAt: 'Just now',
    isRead: false
  };

  conversation.messages.push(newMessage);
  conversation.lastMessage = newMessage.text;
  conversation.lastMessageTime = 'Just now';

  res.status(201).json({ success: true, message: newMessage });
});

// AI Produce Assistant
app.post('/api/ai/calculate-ingredients', async (req: Request, res: Response) => {
  const { dishName, servings } = req.body;

  if (!dishName) {
    res.status(400).json({ error: 'Dish name is required' });
    return;
  }

  const portion = Math.max(1, parseInt(servings, 10) || 4);

  if (!ai) {
    console.log('[AI Produce Assistant] No API key found, generating local high-fidelity recipe.');
    const fallbackResponse = generateLocalFallbackRecipe(dishName, portion);
    res.json(fallbackResponse);
    return;
  }

  try {
    const prompt = `You are Farmdeck Hub's Master Nigerian Culinary and Food Pricing Expert for Lagos, Nigeria.
A customer in Lagos wants to cook authentic "${dishName}" for ${portion} people.

Break down the EXACT, COMPLETE, and REALISTIC list of all raw ingredients needed to prepare this dish from scratch, based on authentic open-market pricing in Lagos (such as Mile 12, Oyingbo, Daleko, and Ketu markets).

CRITICAL REQUIREMENTS:
1. COMPLETENESS & AUTHENTICITY:
   - NEVER omit the core staple!
   - For rice dishes (Jollof, Fried Rice, Ofada Rice, White Rice & Stew), LONG-GRAIN RICE MUST be included as the core carbohydrate along with fresh tomatoes, tatase (red bell pepper), rodo (scotch bonnet), fresh bulb onions, tomato paste (sachets/tin), vegetable oil, authentic seasonings (curry, thyme, bay leaves, Maggi/Knorr seasoning cubes, salt), and meat/poultry/fish protein.
   - For Nigerian soups (Egusi, Ogbono, Efo Riro, Afang, Okra, Banga, Bitterleaf, Edikang Ikong), include the primary soup base (e.g. Ground Egusi melon seeds, Ogbono) PLUS fresh vegetable greens (Ugwu, Waterleaf, Spinach, Bitterleaf), pure red palm oil, ground crayfish, locust beans (iru), stockfish / dried catfish, goat meat / beef / assorted meat, and seasonings.
   - For yam meals (Yam Porridge/Asaro, Boiled Yam & Egg Sauce), fresh Yam Tubers MUST be included with palm oil, smoked fish, crayfish, onions, peppers, and greens.
   - For beans dishes (Ewa Aganyin, Porridge Beans), Honey Beans (Oloyin), palm oil / aganyin pepper sauce mix, onions, and seasoning MUST be included.

2. REALISTIC LAGOS MARKET PORTIONING:
   - Scale quantities sensibly for ${portion} people.
   - Do NOT overestimate absurd quantities (e.g., 10 people do not need 2 large 4L paint buckets of tomatoes; 1 paint bucket or half paint bucket plus tomato paste is plenty for 10 servings).
   - Use standard Nigerian market measurement units:
     * "Derica (800g)"
     * "Paint Bucket (4L)"
     * "Half Paint Bucket (2L)"
     * "Bag (5kg)" / "Bag (25kg)"
     * "Bottle (750ml)" / "Bottle (1L)" / "Gallon (4L)"
     * "Tuber (Medium)" / "Tuber (Large)"
     * "Sachet (70g)" / "Tin"
     * "Kg (Fresh Cut)" / "Piece / Pack"
     * "Wrap / Bundle"

3. CURRENT REALISTIC LAGOS MARKET PRICES (NGN ₦):
   - Provide realistic, accurate Nigerian Naira (₦) prices based on current Lagos market conditions.
   - Avoid unrealistically low prices and avoid wildly inflated outrageous prices.
   - Ensure the prices match the stated quantity and unit.

4. RESPONSE FORMAT:
Return ONLY a valid JSON object with the following structure:
{
  "dishName": "${dishName} (${portion} servings)",
  "servings": ${portion},
  "totalEstimatedCostNGN": number,
  "chefTips": string,
  "ingredients": [
    {
      "name": string,
      "recommendedUnit": string,
      "quantity": number,
      "estimatedPriceNGN": number,
      "category": "Grains & Flour" | "Spices & Peppers" | "Vegetables" | "Tubers" | "Oils & Condiments" | "Meat & Poultry" | "Fish & Seafood"
    }
  ]
}

Output JSON ONLY. No markdown formatting, no code fences, no introductory or trailing commentary.`;

    const rawResponse = await callGemini(prompt);
    const cleanJson = rawResponse
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();
    const parsedData = JSON.parse(cleanJson);

    // Calculate exact sum
    if (Array.isArray(parsedData.ingredients) && parsedData.ingredients.length > 0) {
      parsedData.totalEstimatedCostNGN = parsedData.ingredients.reduce(
        (sum: number, item: any) => sum + (Number(item.estimatedPriceNGN) || 0),
        0
      );
    }

    res.json({ success: true, ...parsedData });
  } catch (error) {
    console.error('Gemini API Error, falling back to local recipe:', error);
    const fallback = generateLocalFallbackRecipe(dishName, portion);
    res.json(fallback);
  }
});

function generateLocalFallbackRecipe(dishName: string, servings: number) {
  const nameLower = dishName.toLowerCase();
  const scale = Math.max(1, servings / 4);

  // 1. Jollof Rice
  if (nameLower.includes('jollof') || (nameLower.includes('rice') && !nameLower.includes('fried'))) {
    const dericaQty = Math.max(1, Math.round(servings * 0.35));
    const chickenKg = Math.max(1, Math.round(servings * 0.2));
    const tomatoPaint = servings <= 6 ? 0.5 : Math.ceil(servings / 12);
    const oilBottles = servings <= 6 ? 1 : Math.ceil(servings / 8);

    const ingredients = [
      { name: 'Long Grain Parboiled Rice', recommendedUnit: 'Derica (800g)', quantity: dericaQty, estimatedPriceNGN: dericaQty * 1200, category: 'Grains & Flour' },
      { name: 'Fresh Roma Tomatoes', recommendedUnit: 'Paint Bucket (4L)', quantity: tomatoPaint, estimatedPriceNGN: Math.round(tomatoPaint * 5500), category: 'Vegetables' },
      { name: 'Tatashe & Sombo (Red Bell Pepper)', recommendedUnit: 'Derica', quantity: Math.max(1, Math.round(scale)), estimatedPriceNGN: Math.max(1, Math.round(scale)) * 1000, category: 'Spices & Peppers' },
      { name: 'Scotch Bonnet (Ata Rodo)', recommendedUnit: 'Derica', quantity: Math.max(1, Math.round(scale * 0.7)), estimatedPriceNGN: Math.max(1, Math.round(scale * 0.7)) * 1000, category: 'Spices & Peppers' },
      { name: 'Fresh Bulb Onions', recommendedUnit: 'Pieces', quantity: Math.max(3, servings), estimatedPriceNGN: Math.max(600, servings * 150), category: 'Vegetables' },
      { name: 'Tomato Paste (Tin / Sachet)', recommendedUnit: 'Sachet (70g)', quantity: Math.max(2, Math.round(servings * 0.6)), estimatedPriceNGN: Math.max(2, Math.round(servings * 0.6)) * 300, category: 'Oils & Condiments' },
      { name: 'Refined Vegetable Oil', recommendedUnit: 'Bottle (750ml)', quantity: oilBottles, estimatedPriceNGN: oilBottles * 1600, category: 'Oils & Condiments' },
      { name: 'Fresh Chicken / Beef Portions', recommendedUnit: 'Kg (Fresh Cut)', quantity: chickenKg, estimatedPriceNGN: chickenKg * 4500, category: 'Meat & Poultry' },
      { name: 'Seasoning Cubes (Knorr / Maggi)', recommendedUnit: 'Pack of 50', quantity: 1, estimatedPriceNGN: 1000, category: 'Oils & Condiments' },
      { name: 'Curry Powder, Thyme & Bay Leaves', recommendedUnit: 'Sachet Pack', quantity: 1, estimatedPriceNGN: 800, category: 'Spices & Peppers' },
      { name: 'Kitchen Salt', recommendedUnit: 'Small Pack', quantity: 1, estimatedPriceNGN: 300, category: 'Oils & Condiments' }
    ];

    const total = ingredients.reduce((sum, i) => sum + i.estimatedPriceNGN, 0);
    return {
      success: true,
      dishName: `Authentic Nigerian Party Jollof Rice (${servings} servings)`,
      servings,
      totalEstimatedCostNGN: total,
      chefTips: 'Source firm Roma tomatoes and tatashe at Mile 12. Blend in a 2:1 ratio and boil down before frying to ensure rich crimson color and eliminate tomato sourness.',
      ingredients
    };
  }

  // 2. Egusi Soup
  if (nameLower.includes('egusi') || nameLower.includes('melon')) {
    const egusiDerica = Math.max(1, Math.round(servings * 0.3));
    const meatKg = Math.max(1, Math.round(servings * 0.25));

    const ingredients = [
      { name: 'Peeled Ground Egusi (Melon Seeds)', recommendedUnit: 'Derica (800g)', quantity: egusiDerica, estimatedPriceNGN: egusiDerica * 2500, category: 'Grains & Flour' },
      { name: 'Pure Red Palm Oil', recommendedUnit: 'Bottle (1L)', quantity: Math.max(1, Math.ceil(servings / 10)), estimatedPriceNGN: Math.max(1, Math.ceil(servings / 10)) * 2200, category: 'Oils & Condiments' },
      { name: 'Fresh Ugwu (Fluted Pumpkin Leaves)', recommendedUnit: 'Big Bunch', quantity: Math.max(1, Math.ceil(servings / 5)), estimatedPriceNGN: Math.max(1, Math.ceil(servings / 5)) * 800, category: 'Vegetables' },
      { name: 'Goat Meat / Beef Assorted', recommendedUnit: 'Kg (Fresh Cut)', quantity: meatKg, estimatedPriceNGN: meatKg * 5000, category: 'Meat & Poultry' },
      { name: 'Smoked Catfish & Stockfish', recommendedUnit: 'Wrap / Pack', quantity: Math.max(1, Math.ceil(servings / 6)), estimatedPriceNGN: Math.max(1, Math.ceil(servings / 6)) * 3500, category: 'Fish & Seafood' },
      { name: 'Ground Crayfish', recommendedUnit: 'Milk Cup / Derica', quantity: Math.max(1, Math.round(servings * 0.2)), estimatedPriceNGN: Math.max(1, Math.round(servings * 0.2)) * 1200, category: 'Fish & Seafood' },
      { name: 'Fermented Locust Beans (Iru)', recommendedUnit: 'Wrap', quantity: Math.max(2, Math.round(servings * 0.4)), estimatedPriceNGN: Math.max(2, Math.round(servings * 0.4)) * 250, category: 'Oils & Condiments' },
      { name: 'Scotch Bonnet & Onions Blend', recommendedUnit: 'Small Basket', quantity: 1, estimatedPriceNGN: 1800, category: 'Spices & Peppers' },
      { name: 'Seasoning Cubes & Salt', recommendedUnit: 'Pack', quantity: 1, estimatedPriceNGN: 800, category: 'Oils & Condiments' }
    ];

    const total = ingredients.reduce((sum, i) => sum + i.estimatedPriceNGN, 0);
    return {
      success: true,
      dishName: `Rich Nigerian Egusi Soup (${servings} servings)`,
      servings,
      totalEstimatedCostNGN: total,
      chefTips: 'For lumpy Egusi, mix ground melon seeds with a little onion water into a thick paste and scoop into hot palm oil. Simmer gently before adding stock and Ugwu leaves.',
      ingredients
    };
  }

  // 3. Fried Rice
  if (nameLower.includes('fried rice')) {
    const riceDerica = Math.max(1, Math.round(servings * 0.35));
    const chickenKg = Math.max(1, Math.round(servings * 0.2));

    const ingredients = [
      { name: 'Long Grain Parboiled Rice', recommendedUnit: 'Derica (800g)', quantity: riceDerica, estimatedPriceNGN: riceDerica * 1200, category: 'Grains & Flour' },
      { name: 'Fresh Carrots & Green Beans', recommendedUnit: 'Bundle / Pack', quantity: Math.max(1, Math.ceil(servings / 5)), estimatedPriceNGN: Math.max(1, Math.ceil(servings / 5)) * 1500, category: 'Vegetables' },
      { name: 'Sweet Corn & Green Peas', recommendedUnit: 'Tin', quantity: Math.max(1, Math.ceil(servings / 8)), estimatedPriceNGN: Math.max(1, Math.ceil(servings / 8)) * 1400, category: 'Vegetables' },
      { name: 'Fresh Chicken / Beef Liver', recommendedUnit: 'Kg (Fresh Cut)', quantity: chickenKg, estimatedPriceNGN: chickenKg * 4500, category: 'Meat & Poultry' },
      { name: 'Refined Vegetable Oil', recommendedUnit: 'Bottle (750ml)', quantity: 1, estimatedPriceNGN: 1600, category: 'Oils & Condiments' },
      { name: 'Spring Onions & Bulb Onions', recommendedUnit: 'Pack / Pieces', quantity: 1, estimatedPriceNGN: 1000, category: 'Vegetables' },
      { name: 'Curry Powder & Thyme', recommendedUnit: 'Sachet Pack', quantity: 1, estimatedPriceNGN: 800, category: 'Spices & Peppers' },
      { name: 'Chicken Seasoning Cubes & Salt', recommendedUnit: 'Pack', quantity: 1, estimatedPriceNGN: 900, category: 'Oils & Condiments' }
    ];

    const total = ingredients.reduce((sum, i) => sum + i.estimatedPriceNGN, 0);
    return {
      success: true,
      dishName: `Nigerian Classic Fried Rice (${servings} servings)`,
      servings,
      totalEstimatedCostNGN: total,
      chefTips: 'Parboil your rice in seasoned chicken broth so the grains absorb rich poultry flavor. Flash fry vegetables separately on high heat so they retain crunch and vibrant color.',
      ingredients
    };
  }

  // 4. Yam Porridge / Asaro
  if (nameLower.includes('yam') || nameLower.includes('asaro')) {
    const tubers = Math.max(1, Math.ceil(servings / 3));

    const ingredients = [
      { name: 'Abuja Yam Tubers', recommendedUnit: 'Tuber (Large)', quantity: tubers, estimatedPriceNGN: tubers * 3200, category: 'Tubers' },
      { name: 'Pure Red Palm Oil', recommendedUnit: 'Bottle (750ml)', quantity: 1, estimatedPriceNGN: 1800, category: 'Oils & Condiments' },
      { name: 'Smoked Dried Fish', recommendedUnit: 'Pieces', quantity: Math.max(2, Math.round(servings * 0.5)), estimatedPriceNGN: Math.max(2, Math.round(servings * 0.5)) * 1200, category: 'Fish & Seafood' },
      { name: 'Ground Crayfish', recommendedUnit: 'Derica', quantity: 1, estimatedPriceNGN: 1500, category: 'Fish & Seafood' },
      { name: 'Fresh Ata Rodo & Onions Blend', recommendedUnit: 'Small Basket', quantity: 1, estimatedPriceNGN: 1500, category: 'Spices & Peppers' },
      { name: 'Ugwu or Scent Leaves', recommendedUnit: 'Bunch', quantity: Math.max(1, Math.ceil(servings / 6)), estimatedPriceNGN: Math.max(1, Math.ceil(servings / 6)) * 600, category: 'Vegetables' },
      { name: 'Seasoning Cubes & Salt', recommendedUnit: 'Small Pack', quantity: 1, estimatedPriceNGN: 600, category: 'Oils & Condiments' }
    ];

    const total = ingredients.reduce((sum, i) => sum + i.estimatedPriceNGN, 0);
    return {
      success: true,
      dishName: `Traditional Yam Porridge / Asaro (${servings} servings)`,
      servings,
      totalEstimatedCostNGN: total,
      chefTips: 'Use dry season Abuja yam. Mash a few cooked yam chunks with your wooden spoon to create a thick, golden, palm-oil gravy coat.',
      ingredients
    };
  }

  // 5. Generic Full Meal Fallback
  const stapleDerica = Math.max(1, Math.round(servings * 0.35));
  const proteinKg = Math.max(1, Math.round(servings * 0.2));

  const ingredients = [
    { name: `Primary Staple / Grain for ${dishName}`, recommendedUnit: 'Derica / Pack', quantity: stapleDerica, estimatedPriceNGN: stapleDerica * 1500, category: 'Grains & Flour' },
    { name: 'Fresh Lagos Market Peppers & Tomatoes', recommendedUnit: 'Paint Bucket / Basket', quantity: 1, estimatedPriceNGN: 3500, category: 'Spices & Peppers' },
    { name: 'Fresh Bulb Onions', recommendedUnit: 'Medium Pieces', quantity: Math.max(3, servings), estimatedPriceNGN: Math.max(600, servings * 120), category: 'Vegetables' },
    { name: 'Pure Vegetable / Palm Cooking Oil', recommendedUnit: 'Bottle (1L)', quantity: 1, estimatedPriceNGN: 2200, category: 'Oils & Condiments' },
    { name: 'Fresh Cut Beef / Chicken / Fish', recommendedUnit: 'Kg (Fresh Cut)', quantity: proteinKg, estimatedPriceNGN: proteinKg * 4500, category: 'Meat & Poultry' },
    { name: 'Authentic Nigerian Seasoning & Spice Pack', recommendedUnit: 'Pack', quantity: 1, estimatedPriceNGN: 1200, category: 'Oils & Condiments' }
  ];

  const total = ingredients.reduce((sum, i) => sum + i.estimatedPriceNGN, 0);
  return {
    success: true,
    dishName: `${dishName} (${servings} servings)`,
    servings,
    totalEstimatedCostNGN: total,
    chefTips: 'Source fresh raw produce from Lagos morning market hubs for best wholesale prices and peak freshness.',
    ingredients
  };
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Farmdeck Hub Backend API running on http://localhost:${PORT}`);
});
