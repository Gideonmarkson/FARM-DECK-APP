import React, { useState } from 'react';
import { MOCK_PRICE_INDEX } from '../data/mockFarmData';
import { formatNGN } from '../utils/formatters';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

export const PriceTracker: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Spices & Peppers', 'Tubers', 'Oils & Condiments'];

  const filteredIndex = MOCK_PRICE_INDEX.filter(
    item => selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 md:pb-12">
      
      {/* Header */}
      <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-100 text-[#2e7d32] text-[10px] px-3 py-1 rounded-full font-bold uppercase border border-emerald-200">
            Lagos Agricultural Index
          </span>
          <h1 className="font-heading text-xl font-extrabold text-stone-900 mt-2">Daily Commodity Price Comparison</h1>
          <p className="text-stone-500 text-xs mt-0.5 font-medium">
            Real-time price transparency across major markets: Mile 12, Oyingbo, Ketu, Sangotedo, Ikorodu, Agege, Badagry, and Epe.
          </p>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                selectedCategory === c
                  ? 'bg-[#2e7d32] text-white border-[#2e7d32] shadow-xs'
                  : 'bg-[#f3f7f4] text-emerald-900 hover:text-emerald-950 border-emerald-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="space-y-6">
        {filteredIndex.map(item => (
          <div
            key={item.id}
            className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-xs space-y-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-emerald-50">
              <div>
                <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                  {item.category} • {item.unit}
                </span>
                <h3 className="font-heading text-lg font-extrabold text-stone-900">{item.commodity}</h3>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 uppercase font-bold block">Lagos Avg Price</span>
                  <span className="font-heading text-lg font-black text-emerald-950">{formatNGN(item.avgPriceNGN)}</span>
                </div>

                <div
                  className={`flex items-center gap-1 text-xs px-3 py-1 rounded-full font-bold uppercase border ${
                    item.change24hPct < 0
                      ? 'bg-emerald-100 text-[#2e7d32] border-emerald-200'
                      : 'bg-rose-100 text-rose-800 border-rose-200'
                  }`}
                >
                  {item.change24hPct < 0 ? (
                    <TrendingDown className="w-3.5 h-3.5" />
                  ) : (
                    <TrendingUp className="w-3.5 h-3.5" />
                  )}
                  <span>{item.change24hPct > 0 ? `+${item.change24hPct}%` : `${item.change24hPct}%`} (24h)</span>
                </div>
              </div>
            </div>

            {/* Lowest Market Callout */}
            <div className="bg-[#f3f7f4] border border-emerald-200 p-3.5 rounded-xl flex items-center justify-between text-xs text-stone-800 font-medium">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2e7d32]" />
                <span>
                  Cheapest Hub: <strong className="font-bold text-stone-900">{item.lowestMarket}</strong> at{' '}
                  <strong className="text-[#2e7d32] font-black">{formatNGN(item.pricesByMarket[item.lowestMarket])}</strong>
                </span>
              </div>
              <span className="bg-[#2e7d32] text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full uppercase">
                Best Rate
              </span>
            </div>

            {/* Markets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(item.pricesByMarket).map(([market, price]) => {
                const isLowest = market === item.lowestMarket;
                const isHighest = market === item.highestMarket;
                return (
                  <div
                    key={market}
                    className={`p-3 rounded-xl border text-xs font-semibold ${
                      isLowest
                        ? 'bg-emerald-50 border-emerald-300'
                        : isHighest
                        ? 'bg-stone-50 border-stone-200 opacity-70'
                        : 'bg-[#f3f7f4] border-emerald-100'
                    }`}
                  >
                    <span className="text-[10px] text-stone-400 truncate block font-bold uppercase">{market}</span>
                    <span className={`font-heading text-sm font-black block mt-0.5 ${isLowest ? 'text-[#2e7d32]' : 'text-stone-900'}`}>
                      {formatNGN(price)}
                    </span>
                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
