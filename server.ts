import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
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

  const portion = servings || 4;

  if (!ai) {
    const fallbackResponse = generateLocalFallbackRecipe(dishName, portion);
    res.json(fallbackResponse);
    return;
  }

  try {
    const prompt = `You are Farm Deck's AI Nigerian Culinary & Produce Expert.
The user wants to prepare "${dishName}" for ${portion} people in Lagos, Nigeria.

Return a strict JSON object with:
1. "dishName": string
2. "servings": number
3. "ingredients": array of objects containing:
   - "name": raw ingredient name (e.g. "Roma Tomatoes", "Scotch Bonnet (Rodo)", "Red Palm Oil", "Abuja Yam Tubers", "White Garri")
   - "recommendedUnit": standard Lagos unit ("Paint Bucket (4L)", "Derica", "Tuber (5 pcs)", "Gallon (4L)", "Bundle", "Kg")
   - "quantity": number
   - "estimatedPriceNGN": estimated price in Nigerian Naira (₦)
   - "category": ("Spices & Peppers" | "Tubers" | "Vegetables" | "Grains & Flour" | "Oils & Condiments" | "Fish & Seafood" | "Meat & Poultry")
4. "totalEstimatedCostNGN": number (sum of estimated prices)
5. "chefTips": string (brief tip on selecting fresh ingredients at Mile 12 / Oyingbo markets)

Output JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const responseText = response.text || '';
    const cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanJson);

    res.json({ success: true, ...parsedData });
  } catch (error) {
    console.error('Gemini API Error:', error);
    const fallback = generateLocalFallbackRecipe(dishName, portion);
    res.json(fallback);
  }
});

function generateLocalFallbackRecipe(dishName: string, servings: number) {
  const scale = Math.max(1, Math.ceil(servings / 4));
  
  if (dishName.toLowerCase().includes('jollof')) {
    return {
      success: true,
      dishName: `Party Jollof Rice (${servings} servings)`,
      servings,
      totalEstimatedCostNGN: 14800 * scale,
      chefTips: 'Buy firm Roma tomatoes at Mile 12 market. Blend with sombo and rodo in a 2:1 ratio for rich crimson color without sourness.',
      ingredients: [
        { name: 'Fresh Roma Tomatoes', recommendedUnit: 'Paint Bucket (4L)', quantity: 1 * scale, estimatedPriceNGN: 4500 * scale, category: 'Spices & Peppers' },
        { name: 'Rodo & Sombo Pepper Mix', recommendedUnit: 'Paint Bucket (4L)', quantity: 1 * scale, estimatedPriceNGN: 3800 * scale, category: 'Spices & Peppers' },
        { name: 'Ofada / Foreign Rice', recommendedUnit: 'Bag (5kg)', quantity: 1 * scale, estimatedPriceNGN: 6500 * scale, category: 'Grains & Flour' }
      ]
    };
  }
  
  return {
    success: true,
    dishName: `${dishName} (${servings} servings)`,
    servings,
    totalEstimatedCostNGN: 12500 * scale,
    chefTips: 'Ensure you buy Grade A fresh ingredients from local Lagos market vendors for authentic flavor.',
    ingredients: [
      { name: 'Fresh Roma Tomatoes', recommendedUnit: 'Paint Bucket (4L)', quantity: 1 * scale, estimatedPriceNGN: 4500 * scale, category: 'Spices & Peppers' },
      { name: 'Rodo Pepper', recommendedUnit: 'Paint Bucket (4L)', quantity: 1 * scale, estimatedPriceNGN: 3800 * scale, category: 'Spices & Peppers' },
      { name: 'Red Palm Oil', recommendedUnit: 'Gallon (4L)', quantity: 1 * scale, estimatedPriceNGN: 4200 * scale, category: 'Oils & Condiments' }
    ]
  };
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Farm Deck Backend API running on http://localhost:${PORT}`);
});
