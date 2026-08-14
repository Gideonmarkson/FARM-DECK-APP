import React, { useState } from 'react';
import { ProduceItem, LagosLGA, LAGOS_MARKETS_BY_LGA } from '../types';
import { ProduceCard } from './ProduceCard';
import {
  Search,
  Compass,
  SlidersHorizontal,
  MapPin,
  Sparkles,
  ShoppingBag,
  Wheat,
  Flame,
  Sprout,
  Droplets,
  Fish,
  Store,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';

interface ConsumerViewProps {
  produceItems: ProduceItem[];
  selectedLGA: LagosLGA;
  isNearMe: boolean;
  setIsNearMe: (val: boolean) => void;
  onAddToCart: (item: ProduceItem) => void;
}

const CATEGORY_ITEMS = [
  { id: 'All', label: 'All Produce', icon: <ShoppingBag className="w-4 h-4" /> },
  { id: 'Tubers', label: 'Tubers & Yam', icon: <Wheat className="w-4 h-4" /> },
  { id: 'Spices & Peppers', label: 'Peppers & Tomatoes', icon: <Flame className="w-4 h-4" /> },
  { id: 'Vegetables', label: 'Fresh Greens', icon: <Sprout className="w-4 h-4" /> },
  { id: 'Grains & Flour', label: 'Grains & Flour', icon: <Wheat className="w-4 h-4" /> },
  { id: 'Oils & Condiments', label: 'Palm & Vegetable Oil', icon: <Droplets className="w-4 h-4" /> },
  { id: 'Fish & Seafood', label: 'Fresh Fish & Seafood', icon: <Fish className="w-4 h-4" /> },
  { id: 'Fruits', label: 'Fresh Fruits', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'Meat & Poultry', label: 'Meat & Poultry', icon: <Store className="w-4 h-4" /> }
];



export const ConsumerView: React.FC<ConsumerViewProps> = ({
  produceItems,
  selectedLGA,
  isNearMe,
  setIsNearMe,
  onAddToCart
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedMarket, setSelectedMarket] = useState('All Markets');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high'>('recommended');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  let filtered = produceItems.filter(item => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesMarket = selectedMarket === 'All Markets' || item.marketLocation === selectedMarket;
    const matchesNearMe = !isNearMe || item.isHyperlocalNearMe;

    return matchesSearch && matchesCategory && matchesMarket && matchesNearMe;
  });

  if (sortBy === 'price-low') {
    filtered.sort((a, b) => a.priceNGN - b.priceNGN);
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => b.priceNGN - a.priceNGN);
  }

  const currentCategoryObj = CATEGORY_ITEMS.find(c => c.id === selectedCategory) || CATEGORY_ITEMS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 md:pb-12 bg-[#f4f9f4]">
      
      {/* Top Search & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-emerald-700 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search tomatoes, Abuja yam tubers, egusi, palm oil..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-emerald-200 text-stone-900 placeholder-stone-400 text-xs pl-11 pr-4 py-3 rounded-full shadow-2xs focus:outline-none focus:border-[#15803d] font-semibold"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Category Hamburger Filter Button */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
              className="flex items-center gap-2 bg-white hover:bg-[#f3f7f4] text-stone-800 px-3.5 py-2.5 rounded-full border border-emerald-200 text-xs font-bold shadow-2xs transition-all active:scale-95"
            >
              <Menu className="w-4 h-4 text-[#15803d]" />
              <span>{currentCategoryObj.label}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {/* Category Dropdown Menu */}
            {isCategoryMenuOpen && (
              <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-64 bg-white border border-emerald-100 rounded-2xl shadow-xl p-2 z-30 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-2 border-b border-emerald-50 flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase text-stone-400">Produce Categories</span>
                  <button onClick={() => setIsCategoryMenuOpen(false)} className="text-stone-400 hover:text-stone-700 p-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto space-y-1">
                  {CATEGORY_ITEMS.map(cat => {
                    const active = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          setIsCategoryMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                          active
                            ? 'bg-[#15803d] text-white shadow-xs'
                            : 'text-stone-700 hover:bg-[#f4f9f4]'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={active ? 'text-white' : 'text-[#15803d]'}>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Market Hub Filter across all 20 LGAs */}
          <div className="flex items-center gap-1.5 bg-white px-3.5 py-2.5 rounded-full border border-emerald-200 text-xs font-bold text-emerald-950 shadow-2xs">
            <Store className="w-3.5 h-3.5 text-[#15803d]" />
            <select
              value={selectedMarket}
              onChange={e => setSelectedMarket(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
            >
              <option value="All Markets">All Lagos Markets</option>
              {Object.entries(LAGOS_MARKETS_BY_LGA).map(([lgaName, markets]) => (
                <optgroup key={lgaName} label={`📍 ${lgaName} LGA`}>
                  {markets.map(m => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Near Me Toggle */}
          <button
            onClick={() => setIsNearMe(!isNearMe)}
            className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border text-xs font-bold transition-all ${
              isNearMe
                ? 'bg-amber-100 text-amber-900 border-amber-400'
                : 'bg-white text-emerald-900 border-emerald-200 hover:border-emerald-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#15803d]" />
            <span className="hidden sm:inline">Near Me (&lt;3km)</span>
          </button>
        </div>
      </div>

      {/* Real Market Banner Card */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#15803d] via-[#166534] to-[#0f4c3a] p-6 text-white shadow-sm border border-emerald-700">
        <div className="max-w-xl space-y-2 relative z-10">
          <span className="bg-emerald-900 text-amber-300 font-bold text-[10px] px-3 py-1 rounded-full uppercase border border-emerald-600">
            Hyperlocal Lagos Agricultural Sourcing
          </span>
          <h2 className="font-heading text-xl sm:text-2xl font-extrabold leading-tight">
            Direct Farm Produce & Market Ingredients
          </h2>
          <p className="text-emerald-100 text-xs leading-relaxed max-w-md">
            Procure tubers, fresh tomatoes & peppers in standard Lagos units (Paint Buckets, Derica, Tubers) delivered directly to <span className="font-bold text-white">{selectedLGA}</span>.
          </p>
        </div>
        <img
          src="/images/roma_tomatoes.jpg"
          alt="Fresh Lagos Market Produce"
          className="absolute right-0 top-0 bottom-0 w-1/3 object-cover opacity-40 rounded-r-2xl hidden sm:block"
        />
      </div>

      {/* Active Filter Chips Header */}
      {selectedCategory !== 'All' && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-semibold">Filtering by category:</span>
          <span className="bg-emerald-100 text-[#15803d] text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
            <span>{currentCategoryObj.label}</span>
            <button onClick={() => setSelectedCategory('All')} className="hover:text-rose-600 font-bold">✕</button>
          </span>
        </div>
      )}

      {/* Produce Grid Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base font-extrabold text-stone-900">Available Fresh Produce</h3>
            <span className="bg-emerald-100 text-[#15803d] text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
              {filtered.length} items
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#15803d]" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="bg-white border border-emerald-200 rounded-2xl p-12 text-center">
            <MapPin className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-800 mb-1">No produce items found</h3>
            <p className="text-stone-500 text-xs mb-4">Try clearing filters or searching for a different term.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
                setSelectedMarket('All Markets');
                setIsNearMe(false);
              }}
              className="bg-[#15803d] hover:bg-[#166534] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(item => (
              <ProduceCard key={item.id} item={item} onAddToCart={onAddToCart} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
