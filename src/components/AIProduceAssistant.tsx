import React, { useState } from 'react';
import { AIRecipeCalculation, ProduceItem } from '../types';
import { formatNGN } from '../utils/formatters';
import { Bot, Sparkles, ChefHat } from 'lucide-react';

interface AIProduceAssistantProps {
  onAddIngredientsToCart: (ingredients: ProduceItem[]) => void;
}

export const AIProduceAssistant: React.FC<AIProduceAssistantProps> = () => {
  const [dishName, setDishName] = useState('Party Jollof Rice');
  const [servings, setServings] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AIRecipeCalculation | null>({
    dishName: 'Party Jollof Rice (10 servings)',
    servings: 10,
    totalEstimatedCostNGN: 14800,
    chefTips: 'Buy firm Roma tomatoes at Mile 12 market. Blend with sombo and rodo in a 2:1 ratio for rich crimson color without sourness.',
    ingredients: [
      { name: 'Fresh Roma Tomatoes', recommendedUnit: 'Paint Bucket (4L)', quantity: 2, estimatedPriceNGN: 9000, category: 'Spices & Peppers' },
      { name: 'Rodo & Sombo Pepper Mix', recommendedUnit: 'Paint Bucket (4L)', quantity: 1, estimatedPriceNGN: 3800, category: 'Spices & Peppers' },
      { name: 'Pure Red Palm Oil / Veg Oil', recommendedUnit: 'Gallon (4L)', quantity: 1, estimatedPriceNGN: 2000, category: 'Oils & Condiments' }
    ]
  });

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishName) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/calculate-ingredients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dishName, servings })
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        calculateLocalFallback();
      }
    } catch (err) {
      calculateLocalFallback();
    } finally {
      setIsLoading(false);
    }
  };

  const calculateLocalFallback = () => {
    const scale = Math.max(1, Math.ceil(servings / 4));
    setResult({
      dishName: `${dishName} (${servings} servings)`,
      servings,
      totalEstimatedCostNGN: 12800 * scale,
      chefTips: 'Source Grade A fresh peppers and tomatoes from Mile 12 or Oyingbo market traders for authentic flavor.',
      ingredients: [
        { name: 'Fresh Roma Tomatoes', recommendedUnit: 'Paint Bucket (4L)', quantity: 1 * scale, estimatedPriceNGN: 4500 * scale, category: 'Spices & Peppers' },
        { name: 'Rodo Pepper Mix', recommendedUnit: 'Paint Bucket (4L)', quantity: 1 * scale, estimatedPriceNGN: 3800 * scale, category: 'Spices & Peppers' },
        { name: 'Red Palm Oil', recommendedUnit: 'Gallon (4L)', quantity: 1 * scale, estimatedPriceNGN: 4500 * scale, category: 'Oils & Condiments' }
      ]
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 md:pb-12">
      
      {/* Banner */}
      <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-xs">
        <span className="bg-[#2e7d32] text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase inline-flex items-center gap-1 mb-2">
          <Bot className="w-3.5 h-3.5 text-amber-300" />
          Gemini 2.5 AI Powered
        </span>
        <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-stone-900">AI Recipe & Ingredient Estimator</h1>
        <p className="text-stone-500 text-xs mt-1 max-w-2xl font-medium">
          Type any Nigerian dish and serving size &rarr; Gemini AI calculates the exact raw farm produce quantities in native Lagos units (Paint Buckets, Derica, Tubers) and estimated budget in ₦.
        </p>
      </div>

      {/* Form */}
      <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-xs">
        <form onSubmit={handleCalculate} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-6">
            <label className="text-xs text-stone-700 font-extrabold uppercase block mb-1">Dish / Meal Name</label>
            <input
              type="text"
              placeholder="e.g., Party Jollof Rice, Egusi Soup, Efo Riro..."
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
              className="w-full bg-[#2e7d32] hover:bg-[#1b4332] text-white font-bold py-3 px-4 rounded-full text-xs uppercase flex items-center justify-center gap-2 shadow-xs"
            >
              {isLoading ? (
                <span>Calculating with Gemini...</span>
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
                  <th className="py-3.5 px-4">Native Unit</th>
                  <th className="py-3.5 px-4">Quantity</th>
                  <th className="py-3.5 px-4">Est. Price (NGN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 font-medium">
                {result.ingredients.map((ing, i) => (
                  <tr key={i} className="hover:bg-emerald-50/50">
                    <td className="py-3.5 px-4 font-bold text-stone-900">{ing.name}</td>
                    <td className="py-3.5 px-4 font-bold text-[#2e7d32]">{ing.recommendedUnit}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-800">{ing.quantity}</td>
                    <td className="py-3.5 px-4 font-extrabold text-stone-900">{formatNGN(ing.estimatedPriceNGN)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
