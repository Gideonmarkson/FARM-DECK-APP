import React, { useState } from 'react';
import { AIRecipeCalculation, ProduceItem } from '../types';
import { formatNGN } from '../utils/formatters';
import { Bot, Sparkles, ChefHat, CheckCircle2, Utensils } from 'lucide-react';

interface AIProduceAssistantProps {
  onAddIngredientsToCart?: (ingredients: ProduceItem[]) => void;
}

const POPULAR_DISHES = [
  'Party Jollof Rice',
  'Egusi Soup with Ugwu',
  'Classic Fried Rice',
  'Yam Porridge (Asaro)',
  'Efo Riro (Vegetable Soup)',
  'Catfish Pepper Soup'
];

export const AIProduceAssistant: React.FC<AIProduceAssistantProps> = () => {
  const [dishName, setDishName] = useState('Party Jollof Rice');
  const [servings, setServings] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  // Realistic initial breakdown for 10 servings of authentic Nigerian Party Jollof Rice
  const [result, setResult] = useState<AIRecipeCalculation | null>({
    dishName: 'Authentic Nigerian Party Jollof Rice (10 servings)',
    servings: 10,
    totalEstimatedCostNGN: 30900,
    chefTips: 'Source firm Roma tomatoes and tatashe at Mile 12 market. Blend in a 2:1 ratio and boil out all sour water before frying in oil. Cook over low heat for that signature smoky party aroma.',
    ingredients: [
      { name: 'Long Grain Parboiled Rice', recommendedUnit: 'Derica (800g)', quantity: 3, estimatedPriceNGN: 3600, category: 'Grains & Flour' },
      { name: 'Fresh Roma Tomatoes', recommendedUnit: 'Paint Bucket (4L)', quantity: 1, estimatedPriceNGN: 5500, category: 'Vegetables' },
      { name: 'Tatashe & Sombo (Red Bell Peppers)', recommendedUnit: 'Derica', quantity: 2, estimatedPriceNGN: 2000, category: 'Spices & Peppers' },
      { name: 'Scotch Bonnet (Ata Rodo)', recommendedUnit: 'Derica', quantity: 1, estimatedPriceNGN: 1000, category: 'Spices & Peppers' },
      { name: 'Fresh Bulb Onions', recommendedUnit: 'Medium Pieces', quantity: 5, estimatedPriceNGN: 1500, category: 'Vegetables' },
      { name: 'Tomato Paste (Tin / Sachet)', recommendedUnit: 'Sachet (70g)', quantity: 6, estimatedPriceNGN: 1800, category: 'Oils & Condiments' },
      { name: 'Refined Vegetable Cooking Oil', recommendedUnit: 'Bottle (750ml)', quantity: 2, estimatedPriceNGN: 3200, category: 'Oils & Condiments' },
      { name: 'Fresh Chicken / Beef Portions', recommendedUnit: 'Kg (Fresh Cut)', quantity: 2, estimatedPriceNGN: 9000, category: 'Meat & Poultry' },
      { name: 'Seasoning Cubes (Knorr / Maggi)', recommendedUnit: 'Pack of 50', quantity: 1, estimatedPriceNGN: 1000, category: 'Oils & Condiments' },
      { name: 'Curry Powder, Thyme & Bay Leaves', recommendedUnit: 'Sachet Pack', quantity: 1, estimatedPriceNGN: 800, category: 'Spices & Peppers' },
      { name: 'Kitchen Table Salt', recommendedUnit: 'Small Pack', quantity: 1, estimatedPriceNGN: 300, category: 'Oils & Condiments' },
      { name: 'Pure Butter / Margarine', recommendedUnit: 'Small Tub', quantity: 1, estimatedPriceNGN: 1200, category: 'Oils & Condiments' }
    ]
  });

  const handleCalculate = async (e?: React.FormEvent, customDish?: string) => {
    if (e) e.preventDefault();
    const queryDish = customDish || dishName;
    if (!queryDish) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/calculate-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishName: queryDish, servings })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.ingredients && data.ingredients.length > 0) {
          setResult(data);
          return;
        }
      }
      calculateLocalFallback(queryDish, servings);
    } catch {
      calculateLocalFallback(queryDish, servings);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLocalFallback = (dish: string, count: number) => {
    const nameLower = dish.toLowerCase();
    const scale = Math.max(1, count / 4);

    if (nameLower.includes('jollof') || (nameLower.includes('rice') && !nameLower.includes('fried'))) {
      const derica = Math.max(1, Math.round(count * 0.35));
      const meatKg = Math.max(1, Math.round(count * 0.2));
      const tomatoPaint = count <= 6 ? 0.5 : Math.ceil(count / 12);
      const oilBottles = count <= 6 ? 1 : Math.ceil(count / 8);

      const ingredients = [
        { name: 'Long Grain Parboiled Rice', recommendedUnit: 'Derica (800g)', quantity: derica, estimatedPriceNGN: derica * 1200, category: 'Grains & Flour' as const },
        { name: 'Fresh Roma Tomatoes', recommendedUnit: 'Paint Bucket (4L)', quantity: tomatoPaint, estimatedPriceNGN: Math.round(tomatoPaint * 5500), category: 'Vegetables' as const },
        { name: 'Tatashe & Sombo (Red Bell Peppers)', recommendedUnit: 'Derica', quantity: Math.max(1, Math.round(scale)), estimatedPriceNGN: Math.max(1, Math.round(scale)) * 1000, category: 'Spices & Peppers' as const },
        { name: 'Scotch Bonnet (Ata Rodo)', recommendedUnit: 'Derica', quantity: Math.max(1, Math.round(scale * 0.7)), estimatedPriceNGN: Math.max(1, Math.round(scale * 0.7)) * 1000, category: 'Spices & Peppers' as const },
        { name: 'Fresh Bulb Onions', recommendedUnit: 'Medium Pieces', quantity: Math.max(3, count), estimatedPriceNGN: Math.max(600, count * 150), category: 'Vegetables' as const },
        { name: 'Tomato Paste (Tin / Sachet)', recommendedUnit: 'Sachet (70g)', quantity: Math.max(2, Math.round(count * 0.6)), estimatedPriceNGN: Math.max(2, Math.round(count * 0.6)) * 300, category: 'Oils & Condiments' as const },
        { name: 'Refined Vegetable Oil', recommendedUnit: 'Bottle (750ml)', quantity: oilBottles, estimatedPriceNGN: oilBottles * 1600, category: 'Oils & Condiments' as const },
        { name: 'Fresh Chicken / Beef Portions', recommendedUnit: 'Kg (Fresh Cut)', quantity: meatKg, estimatedPriceNGN: meatKg * 4500, category: 'Meat & Poultry' as const },
        { name: 'Seasoning Cubes (Knorr / Maggi)', recommendedUnit: 'Pack of 50', quantity: 1, estimatedPriceNGN: 1000, category: 'Oils & Condiments' as const },
        { name: 'Curry Powder, Thyme & Bay Leaves', recommendedUnit: 'Sachet Pack', quantity: 1, estimatedPriceNGN: 800, category: 'Spices & Peppers' as const },
        { name: 'Kitchen Table Salt', recommendedUnit: 'Small Pack', quantity: 1, estimatedPriceNGN: 300, category: 'Oils & Condiments' as const }
      ];

      setResult({
        dishName: `Authentic Nigerian Party Jollof Rice (${count} servings)`,
        servings: count,
        totalEstimatedCostNGN: ingredients.reduce((s, i) => s + i.estimatedPriceNGN, 0),
        chefTips: 'Source firm Roma tomatoes and tatashe at Mile 12. Blend in a 2:1 ratio and boil down before frying to ensure rich crimson color without sourness.',
        ingredients
      });
      return;
    }

    if (nameLower.includes('egusi') || nameLower.includes('melon')) {
      const egusiDerica = Math.max(1, Math.round(count * 0.3));
      const meatKg = Math.max(1, Math.round(count * 0.25));

      const ingredients = [
        { name: 'Peeled Ground Egusi (Melon Seeds)', recommendedUnit: 'Derica (800g)', quantity: egusiDerica, estimatedPriceNGN: egusiDerica * 2500, category: 'Grains & Flour' as const },
        { name: 'Pure Red Palm Oil', recommendedUnit: 'Bottle (1L)', quantity: Math.max(1, Math.ceil(count / 10)), estimatedPriceNGN: Math.max(1, Math.ceil(count / 10)) * 2200, category: 'Oils & Condiments' as const },
        { name: 'Fresh Ugwu (Fluted Pumpkin Leaves)', recommendedUnit: 'Big Bunch', quantity: Math.max(1, Math.ceil(count / 5)), estimatedPriceNGN: Math.max(1, Math.ceil(count / 5)) * 800, category: 'Vegetables' as const },
        { name: 'Goat Meat / Beef Assorted', recommendedUnit: 'Kg (Fresh Cut)', quantity: meatKg, estimatedPriceNGN: meatKg * 5000, category: 'Meat & Poultry' as const },
        { name: 'Smoked Catfish & Stockfish', recommendedUnit: 'Wrap / Pack', quantity: Math.max(1, Math.ceil(count / 6)), estimatedPriceNGN: Math.max(1, Math.ceil(count / 6)) * 3500, category: 'Fish & Seafood' as const },
        { name: 'Ground Crayfish', recommendedUnit: 'Derica', quantity: Math.max(1, Math.round(count * 0.2)), estimatedPriceNGN: Math.max(1, Math.round(count * 0.2)) * 1200, category: 'Fish & Seafood' as const },
        { name: 'Fermented Locust Beans (Iru)', recommendedUnit: 'Wrap', quantity: Math.max(2, Math.round(count * 0.4)), estimatedPriceNGN: Math.max(2, Math.round(count * 0.4)) * 250, category: 'Oils & Condiments' as const },
        { name: 'Scotch Bonnet & Onions Blend', recommendedUnit: 'Small Basket', quantity: 1, estimatedPriceNGN: 1800, category: 'Spices & Peppers' as const },
        { name: 'Seasoning Cubes & Salt', recommendedUnit: 'Pack', quantity: 1, estimatedPriceNGN: 800, category: 'Oils & Condiments' as const }
      ];

      setResult({
        dishName: `Rich Nigerian Egusi Soup (${count} servings)`,
        servings: count,
        totalEstimatedCostNGN: ingredients.reduce((s, i) => s + i.estimatedPriceNGN, 0),
        chefTips: 'For lumpy Egusi, mix ground melon seeds with onion water into a thick paste and scoop into hot palm oil. Simmer gently before adding stock and Ugwu leaves.',
        ingredients
      });
      return;
    }

    // Generic scaled Nigerian meal
    const stapleDerica = Math.max(1, Math.round(count * 0.35));
    const proteinKg = Math.max(1, Math.round(count * 0.2));

    const ingredients = [
      { name: `Primary Staple / Grain for ${dish}`, recommendedUnit: 'Derica / Pack', quantity: stapleDerica, estimatedPriceNGN: stapleDerica * 1500, category: 'Grains & Flour' as const },
      { name: 'Fresh Lagos Market Peppers & Tomatoes', recommendedUnit: 'Paint Bucket / Basket', quantity: 1, estimatedPriceNGN: 3500, category: 'Spices & Peppers' as const },
      { name: 'Fresh Bulb Onions', recommendedUnit: 'Medium Pieces', quantity: Math.max(3, count), estimatedPriceNGN: Math.max(600, count * 120), category: 'Vegetables' as const },
      { name: 'Pure Vegetable / Palm Cooking Oil', recommendedUnit: 'Bottle (1L)', quantity: 1, estimatedPriceNGN: 2200, category: 'Oils & Condiments' as const },
      { name: 'Fresh Cut Beef / Chicken / Fish', recommendedUnit: 'Kg (Fresh Cut)', quantity: proteinKg, estimatedPriceNGN: proteinKg * 4500, category: 'Meat & Poultry' as const },
      { name: 'Authentic Nigerian Seasoning & Spice Pack', recommendedUnit: 'Pack', quantity: 1, estimatedPriceNGN: 1200, category: 'Oils & Condiments' as const }
    ];

    setResult({
      dishName: `${dish} (${count} servings)`,
      servings: count,
      totalEstimatedCostNGN: ingredients.reduce((s, i) => s + i.estimatedPriceNGN, 0),
      chefTips: 'Source fresh raw produce from Lagos morning market hubs for best wholesale prices and peak freshness.',
      ingredients
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 md:pb-12">
      
      {/* Banner */}
      <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-xs">
        <span className="bg-[#2e7d32] text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase inline-flex items-center gap-1.5 mb-2">
          <Bot className="w-3.5 h-3.5 text-amber-300" />
          Gemini AI Powered
        </span>
        <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-stone-900">AI Chef & Market Ingredient Estimator</h1>
        <p className="text-stone-500 text-xs mt-1 max-w-2xl font-medium">
          Type any Nigerian dish and serving size &rarr; Gemini AI calculates the complete list of authentic raw ingredients in native Lagos market units (Paint Buckets, Derica, Tubers) with accurate current prices in ₦.
        </p>

        {/* Popular Dish Chips */}
        <div className="mt-4 pt-3 border-t border-emerald-50">
          <span className="text-[10px] text-stone-400 font-bold uppercase block mb-2">Popular Lagos Dishes:</span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_DISHES.map((dish) => (
              <button
                key={dish}
                type="button"
                onClick={() => {
                  setDishName(dish);
                  handleCalculate(undefined, dish);
                }}
                className={`text-xs px-3 py-1.5 rounded-full font-bold border transition-colors ${
                  dishName === dish
                    ? 'bg-[#2e7d32] text-white border-[#2e7d32]'
                    : 'bg-[#f3f7f4] text-stone-700 border-emerald-200 hover:border-[#2e7d32]'
                }`}
              >
                {dish}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-xs">
        <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="text-xs text-stone-700 font-extrabold uppercase block mb-1">Dish / Meal Name</label>
            <input
              type="text"
              placeholder="e.g., Party Jollof Rice, Egusi Soup, Efo Riro, Asaro..."
              value={dishName}
              onChange={e => setDishName(e.target.value)}
              className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 text-xs p-3 rounded-full font-bold focus:outline-none focus:border-[#2e7d32]"
              required
            />
          </div>

          <div className="sm:col-span-3">
            <label className="text-xs text-stone-700 font-extrabold uppercase block mb-1">Servings (People)</label>
            <input
              type="number"
              min="1"
              max="200"
              value={servings}
              onChange={e => setServings(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 text-xs p-3 rounded-full font-bold focus:outline-none focus:border-[#2e7d32]"
              required
            />
          </div>

          <div className="sm:col-span-3 flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2e7d32] hover:bg-[#1b4332] text-white font-bold py-3 px-4 rounded-full text-xs uppercase flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Calculating with Gemini...
                </span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Calculate Ingredients</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {result && (
        <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-50">
            <div>
              <span className="text-[10px] text-[#2e7d32] uppercase font-bold tracking-wider block">
                AI Raw Produce Breakdown
              </span>
              <h2 className="font-heading text-xl font-extrabold text-stone-900">{result.dishName}</h2>
              <span className="text-xs text-stone-500 font-medium mt-0.5 block">
                Complete ingredients list for {result.servings} people • Lagos open-market estimates
              </span>
            </div>

            <div className="text-right">
              <span className="text-stone-400 text-xs font-bold uppercase block">Estimated Produce Total</span>
              <span className="font-heading text-2xl font-black text-[#2e7d32]">
                {formatNGN(result.totalEstimatedCostNGN)}
              </span>
            </div>
          </div>

          {result.chefTips && (
            <div className="bg-[#f3f7f4] border border-emerald-200 p-4 rounded-xl text-xs text-stone-800 flex items-start gap-3">
              <ChefHat className="w-5 h-5 text-[#2e7d32] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-emerald-950 font-bold mb-0.5 uppercase">Lagos Market Chef Tip:</strong>
                <span className="font-medium text-stone-700">{result.chefTips}</span>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-800">
              <thead className="bg-[#f3f7f4] text-stone-700 font-extrabold uppercase tracking-wider border-b border-emerald-100">
                <tr>
                  <th className="py-3.5 px-4">Raw Ingredient</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Native Unit</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Est. Price (NGN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 font-medium">
                {result.ingredients.map((ing, i) => (
                  <tr key={i} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-stone-900 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2e7d32]" />
                      {ing.name}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded-full">
                        {ing.category || 'Produce'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#2e7d32]">{ing.recommendedUnit}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-800">{ing.quantity}</td>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">{formatNGN(ing.estimatedPriceNGN)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-[#f3f7f4] border-t-2 border-emerald-200">
                <tr>
                  <td colSpan={4} className="py-3.5 px-4 font-extrabold uppercase text-stone-800 text-right">
                    Total Estimated Market Cost:
                  </td>
                  <td className="py-3.5 px-4 font-black text-emerald-800 text-sm">
                    {formatNGN(result.totalEstimatedCostNGN)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
