import React from 'react';
import { ProduceItem } from '../types';
import { formatNGN } from '../utils/formatters';
import { MapPin, CheckCircle, Plus } from 'lucide-react';

interface ProduceCardProps {
  item: ProduceItem;
  onAddToCart: (item: ProduceItem) => void;
}

export const ProduceCard: React.FC<ProduceCardProps> = ({ item, onAddToCart }) => {
  const getFreshnessTag = () => {
    switch (item.freshness) {
      case 'GRADE_A_TODAY':
        return 'Grade A (Harvested Today)';
      case 'GRADE_A_ARRIVED':
        return 'Grade A (Fresh Arrival)';
      default:
        return 'Grade B (Standard)';
    }
  };

  return (
    <div className="bg-white border border-emerald-100/80 rounded-2xl overflow-hidden shadow-sm hover:border-[#2e7d32] hover:shadow-md transition-all duration-200 flex flex-col group">
      
      {/* Image Header with Rounded Corners & Badges */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-stone-100 p-2">
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Top Left Badge: Green Pill */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
            <span className="bg-[#2e7d32] text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-xs">
              {getFreshnessTag()}
            </span>

            {/* Near You Badge */}
            {item.isHyperlocalNearMe && (
              <span className="bg-amber-500 text-stone-950 font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
                <span>📍 Near You ({item.distanceKm || 1.2} km)</span>
              </span>
            )}
          </div>

          {/* Top Right Badge: Category Pill */}
          <div className="absolute top-2.5 right-2.5">
            <span className="bg-stone-900/80 backdrop-blur-xs text-white font-bold text-[10px] px-2.5 py-1 rounded-full shadow-xs">
              {item.category}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div className="space-y-1.5">
          {/* Vendor Line */}
          <div className="flex items-center gap-1 text-[11px] font-bold text-[#2e7d32]">
            <MapPin className="w-3.5 h-3.5" />
            <span>{item.vendorName}</span>
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 ml-0.5" />
          </div>

          {/* LGA & Delivery Bar */}
          <div className="bg-[#f3f7f4] rounded-lg px-2.5 py-1 flex items-center justify-between text-[11px] font-bold text-stone-700">
            <span className="text-emerald-800">📍 {item.lga} LGA</span>
            <span className="text-[#2e7d32] font-black">
              {item.isHyperlocalNearMe ? 'Reduced Delivery ₦400' : 'Standard 3PL Dispatch'}
            </span>
          </div>

          {/* Produce Title */}
          <h3 className="font-heading text-base font-extrabold text-stone-900 leading-snug line-clamp-1">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Bottom Price & Add Button */}
        <div className="pt-3 border-t border-emerald-50 flex items-center justify-between gap-3">
          <div>
            <div className="font-heading text-lg font-black text-emerald-950">
              {formatNGN(item.priceNGN)}
            </div>
            <span className="text-[10px] font-bold text-stone-400 uppercase block">
              PER {item.unit}
            </span>
          </div>

          <button
            onClick={() => onAddToCart(item)}
            disabled={!item.isAvailable || item.stockQty === 0}
            className="bg-[#2e7d32] hover:bg-[#1b4332] active:bg-[#0a3a2a] text-white font-bold text-xs px-4 py-2 rounded-full shadow-xs flex items-center gap-1 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>

      </div>
    </div>
  );
};
