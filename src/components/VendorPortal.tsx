import React, { useState } from 'react';
import { ProduceItem, VendorProfile } from '../types';
import { formatNGN } from '../utils/formatters';
import {
  PlusCircle,
  Package,
  TrendingUp,
  Star,
  CheckCircle2,
  Store
} from 'lucide-react';

interface VendorPortalProps {
  vendors: VendorProfile[];
  produceItems: ProduceItem[];
  onAddNewProduce: (newItem: ProduceItem) => void;
}

export const VendorPortal: React.FC<VendorPortalProps> = ({
  vendors,
  produceItems,
  onAddNewProduce
}) => {
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0].id);
  const currentVendor = vendors.find(v => v.id === selectedVendorId) || vendors[0];

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Tubers' | 'Vegetables' | 'Spices & Peppers' | 'Grains & Flour' | 'Oils & Condiments' | 'Fruits' | 'Meat & Poultry' | 'Fish & Seafood'>('Spices & Peppers');
  const [unit, setUnit] = useState('Paint Bucket (4L)');
  const [priceNGN, setPriceNGN] = useState('4500');
  const [stockQty, setStockQty] = useState('20');
  const [description, setDescription] = useState('Fresh morning market arrival from local farm harvest.');
  const [imageUrl, setImageUrl] = useState('/images/roma_tomatoes.jpg');

  const vendorProduce = produceItems.filter(p => p.vendorId === currentVendor.id || p.vendorName === currentVendor.businessName);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !priceNGN) return;

    const newItem: ProduceItem = {
      id: `p-${Date.now()}`,
      vendorId: currentVendor.id,
      vendorName: currentVendor.businessName,
      marketLocation: currentVendor.marketLocation,
      lga: currentVendor.lga,
      title,
      category,
      unit,
      priceNGN: parseFloat(priceNGN),
      stockQty: parseInt(stockQty, 10),
      freshness: 'GRADE_A_TODAY',
      imageUrl,
      description,
      isAvailable: true,
      distanceKm: 1.5,
      isHyperlocalNearMe: true
    };

    onAddNewProduce(newItem);
    setShowAddModal(false);
    setTitle('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 md:pb-12">
      
      {/* Vendor Profile Card */}
      <div className="bg-white border border-emerald-100 p-6 rounded-2xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentVendor.avatarUrl}
            alt={currentVendor.businessName}
            className="w-14 h-14 rounded-2xl object-cover border border-emerald-200 shadow-2xs"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-xl font-extrabold text-stone-900">{currentVendor.businessName}</h1>
              {currentVendor.isVerified && (
                <span className="bg-emerald-100 text-[#2e7d32] text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3 text-[#2e7d32]" />
                  Verified Vendor
                </span>
              )}
            </div>
            <p className="text-stone-500 text-xs mt-0.5 font-medium">
              {currentVendor.marketLocation} • <span className="text-[#2e7d32] font-bold">{currentVendor.lga} LGA</span> • Stall {currentVendor.stallNumber}
            </p>
          </div>
        </div>

        {/* Vendor Switcher */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs text-stone-600 font-bold uppercase whitespace-nowrap">Simulate Vendor:</label>
          <select
            value={selectedVendorId}
            onChange={e => setSelectedVendorId(e.target.value)}
            className="bg-[#f3f7f4] border border-emerald-200 text-emerald-950 text-xs px-3.5 py-2.5 rounded-full font-bold w-full md:w-64 focus:outline-none focus:border-[#2e7d32]"
          >
            {vendors.map(v => (
              <option key={v.id} value={v.id}>
                {v.businessName} ({v.marketLocation})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase mb-1">
            <span>Total Monthly Sales</span>
            <TrendingUp className="w-4 h-4 text-[#2e7d32]" />
          </div>
          <p className="font-heading text-2xl font-black text-emerald-950">{formatNGN(485000)}</p>
          <span className="text-[11px] text-[#2e7d32] font-bold">+18.4% vs last month</span>
        </div>

        <div className="bg-white border border-emerald-100 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase mb-1">
            <span>Orders Fulfilled</span>
            <Package className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="font-heading text-2xl font-black text-emerald-950">{currentVendor.totalFulfilled}</p>
          <span className="text-[11px] text-stone-500 font-semibold">99.2% on-time 3PL dispatch</span>
        </div>

        <div className="bg-white border border-emerald-100 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase mb-1">
            <span>Seller Rating</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>
          <p className="font-heading text-2xl font-black text-emerald-950">{currentVendor.rating} / 5.0</p>
          <span className="text-[11px] text-amber-800 font-bold">Top Rated Market Trader</span>
        </div>

        <div className="bg-white border border-emerald-100 p-5 rounded-2xl">
          <div className="flex items-center justify-between text-stone-500 text-xs font-bold uppercase mb-1">
            <span>Active Listings</span>
            <Store className="w-4 h-4 text-stone-700" />
          </div>
          <p className="font-heading text-2xl font-black text-emerald-950">{vendorProduce.length} Items</p>
          <span className="text-[11px] text-stone-500 font-semibold">Live on Lagos Marketplace</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-xl font-extrabold text-stone-900">Inventory & Stock Manager</h2>
          <p className="text-stone-500 text-xs font-medium">Publish fresh stock in under 60 seconds with native Lagos units</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#2e7d32] hover:bg-[#1b4332] text-white font-bold px-4 py-2.5 rounded-full text-xs flex items-center gap-2 shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Stock Listing</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-emerald-100 rounded-2xl overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-800">
            <thead className="bg-[#f3f7f4] text-stone-700 font-extrabold uppercase tracking-wider border-b border-emerald-100">
              <tr>
                <th className="py-3.5 px-5">Produce Item</th>
                <th className="py-3.5 px-5">Category</th>
                <th className="py-3.5 px-5">Lagos Unit</th>
                <th className="py-3.5 px-5">Price (NGN)</th>
                <th className="py-3.5 px-5">Stock</th>
                <th className="py-3.5 px-5">Freshness</th>
                <th className="py-3.5 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50 font-medium">
              {vendorProduce.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    No active produce listed for this vendor yet.
                  </td>
                </tr>
              ) : (
                vendorProduce.map(item => (
                  <tr key={item.id} className="hover:bg-emerald-50/50 transition-colors">
                    <td className="py-3.5 px-5 flex items-center gap-3">
                      <img src={item.imageUrl} alt={item.title} className="w-10 h-10 rounded-xl object-cover border border-emerald-100" />
                      <span className="font-bold text-stone-900">{item.title}</span>
                    </td>
                    <td className="py-3.5 px-5">{item.category}</td>
                    <td className="py-3.5 px-5 font-bold text-[#2e7d32]">{item.unit}</td>
                    <td className="py-3.5 px-5 font-bold text-stone-900">{formatNGN(item.priceNGN)}</td>
                    <td className="py-3.5 px-5 font-bold">{item.stockQty} left</td>
                    <td className="py-3.5 px-5">
                      <span className="bg-emerald-100 text-[#2e7d32] px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-emerald-200">
                        {item.freshness}
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="bg-[#2e7d32] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        Active Feed
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Produce Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-100 rounded-2xl p-6 max-w-lg w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <h3 className="font-heading text-lg font-extrabold text-stone-900">Add New Stock Listing</h3>
              <button onClick={() => setShowAddModal(false)} className="text-stone-400 hover:text-stone-800 font-bold">✕</button>
            </div>

            <form onSubmit={handlePublish} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-stone-700 block mb-1">Item Title</label>
                <input
                  type="text"
                  placeholder="e.g. Fresh Roma Tomatoes (Big Basket)"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-3 rounded-xl focus:outline-none focus:border-[#2e7d32]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-3 rounded-xl focus:outline-none focus:border-[#2e7d32]"
                  >
                    <option value="Spices & Peppers">Spices & Peppers</option>
                    <option value="Tubers">Tubers</option>
                    <option value="Vegetables">Vegetables</option>
                    <option value="Grains & Flour">Grains & Flour</option>
                    <option value="Oils & Condiments">Oils & Condiments</option>
                    <option value="Fish & Seafood">Fish & Seafood</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 block mb-1">Native Unit</label>
                  <select
                    value={unit}
                    onChange={e => setUnit(e.target.value)}
                    className="w-full bg-[#f3f7f4] border border-emerald-200 text-[#2e7d32] p-3 rounded-xl font-bold focus:outline-none focus:border-[#2e7d32]"
                  >
                    <option value="Paint Bucket (4L)">Paint Bucket (4L)</option>
                    <option value="Paint Bucket (10L)">Paint Bucket (10L)</option>
                    <option value="Derica (800g)">Derica (800g)</option>
                    <option value="Tuber (5 pcs)">Tuber (5 pcs)</option>
                    <option value="Tuber (10 pcs)">Tuber (10 pcs)</option>
                    <option value="Bag (50kg)">Bag (50kg)</option>
                    <option value="Basket">Basket</option>
                    <option value="Gallon (4L)">Gallon (4L)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 block mb-1">Price (₦ NGN)</label>
                  <input
                    type="number"
                    value={priceNGN}
                    onChange={e => setPriceNGN(e.target.value)}
                    className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-3 rounded-xl font-bold focus:outline-none focus:border-[#2e7d32]"
                    required
                  />
                </div>

                <div>
                  <label className="text-stone-700 block mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={stockQty}
                    onChange={e => setStockQty(e.target.value)}
                    className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-3 rounded-xl focus:outline-none focus:border-[#2e7d32]"
                    required
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-emerald-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="bg-stone-100 text-stone-700 font-bold px-4 py-2.5 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2e7d32] hover:bg-[#1b4332] text-white font-bold px-5 py-2.5 rounded-full"
                >
                  Publish Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
