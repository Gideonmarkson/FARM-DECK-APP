import React, { useState } from 'react';
import { DemandRequest, RequestOffer, LagosLGA, ProduceCategory, VendorProfile } from '../types';
import { LAGOS_LGAS, formatNGN } from '../utils/formatters';
import {
  PlusCircle,
  Clock,
  MapPin,
  MessageSquare,
  Send,
  Sparkles,
  Building,
  CheckCircle2,
  AlertCircle,
  Tag,
  Package,
  Layers
} from 'lucide-react';

interface DemandBoardProps {
  requests: DemandRequest[];
  offers: RequestOffer[];
  vendors: VendorProfile[];
  currentLGA: LagosLGA;
  onCreateRequest: (request: DemandRequest) => void;
  onSubmitOffer: (offer: RequestOffer) => void;
  onOpenChatWithBuyer: (request: DemandRequest, vendor: VendorProfile) => void;
}

const CATEGORIES: ('All' | ProduceCategory)[] = [
  'All',
  'Spices & Peppers',
  'Tubers',
  'Vegetables',
  'Grains & Flour',
  'Oils & Condiments',
  'Fish & Seafood'
];

export const DemandBoard: React.FC<DemandBoardProps> = ({
  requests,
  offers,
  vendors,
  currentLGA,
  onCreateRequest,
  onSubmitOffer,
  onOpenChatWithBuyer
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProduceCategory>('All');
  const [selectedLGA, setSelectedLGA] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeOfferRequest, setActiveOfferRequest] = useState<DemandRequest | null>(null);

  // Form State for "Post a Need"
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState<ProduceCategory>('Spices & Peppers');
  const [quantity, setQuantity] = useState('20');
  const [unit, setUnit] = useState('Paint Bucket (4L)');
  const [maxPrice, setMaxPrice] = useState('4200');
  const [buyerType, setBuyerType] = useState<'Household' | 'Restaurant / Eatery' | 'Catering Company' | 'Cooperative'>('Restaurant / Eatery');
  const [locationLGA, setLocationLGA] = useState<LagosLGA>(currentLGA);
  const [deliveryAddress, setDeliveryAddress] = useState('Admiralty Way, Lekki Phase 1, Lagos');
  const [deadlineDate, setDeadlineDate] = useState('Today, by 4:00 PM');
  const [notes, setNotes] = useState('Need fresh farm arrival. Maximum freshness required.');
  const [urgency, setUrgency] = useState<'URGENT_TODAY' | 'THIS_WEEKEND' | 'FLEXIBLE'>('URGENT_TODAY');

  // Form State for "Submit Offer"
  const [selectedVendorId, setSelectedVendorId] = useState(vendors[0].id);
  const [proposedPrice, setProposedPrice] = useState('4100');
  const [availableQty, setAvailableQty] = useState('20');
  const [deliveryTimeline, setDeliveryTimeline] = useState('Can dispatch via Gokada within 2 hours');
  const [offerNotes, setOfferNotes] = useState('Direct harvest from farm this morning. High quality grade.');

  const currentVendor = vendors.find(v => v.id === selectedVendorId) || vendors[0];

  // Filtering
  const filteredRequests = requests.filter(r => {
    const matchCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchLGA = selectedLGA === 'All' || r.locationLGA === selectedLGA;
    return matchCat && matchLGA;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !maxPrice) return;

    const newReq: DemandRequest = {
      id: `req-${Date.now()}`,
      buyerId: `b-${Date.now()}`,
      buyerName: 'Funke Adebayo (Buka Express Lekki)',
      buyerPhone: '+234 802 555 9911',
      buyerType,
      itemName,
      category,
      quantity: parseInt(quantity, 10) || 1,
      unit,
      maxTargetPriceNGN: parseFloat(maxPrice) || 0,
      locationLGA,
      deliveryAddress,
      deadlineDate,
      notes,
      imageUrl: '/images/roma_tomatoes.jpg',
      status: 'OPEN',
      offersCount: 0,
      createdAt: 'Just now',
      urgency
    };

    onCreateRequest(newReq);
    setShowCreateModal(false);
    setItemName('');
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOfferRequest) return;

    const newOffer: RequestOffer = {
      id: `off-${Date.now()}`,
      requestId: activeOfferRequest.id,
      vendorId: currentVendor.id,
      vendorName: currentVendor.businessName,
      vendorMarket: currentVendor.marketLocation,
      vendorPhone: currentVendor.phoneNumber,
      vendorAvatar: currentVendor.avatarUrl,
      proposedPriceNGN: parseFloat(proposedPrice),
      availableQty: parseInt(availableQty, 10),
      deliveryTimeline,
      notes: offerNotes,
      status: 'PENDING',
      createdAt: 'Just now'
    };

    onSubmitOffer(newOffer);
    setActiveOfferRequest(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6 pb-24 md:pb-12 bg-[#f4f9f4]">
      
      {/* Banner & Post a Need CTA */}
      <div className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-[#2e7d32] text-[10px] px-3 py-1 rounded-full font-bold uppercase border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-[#2e7d32]" />
            <span>Demand-Driven Marketplace • Request for Quotes (RFQ)</span>
          </div>

          <h1 className="font-heading text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight">
            Lagos Buyer Demand Board
          </h1>

          <p className="text-stone-500 text-xs leading-relaxed font-medium">
            Restaurants, caterers, and households post specific produce needs. Verified farmers and market traders spot requests, submit real-time stock offers, and chat directly to close orders.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#2e7d32] hover:bg-[#1b4332] text-white font-bold text-xs px-5 py-3 rounded-full shadow-md flex items-center gap-2 transition-all active:scale-95 shrink-0 uppercase"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post a Produce Need (RFQ)</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CATEGORIES.map(cat => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                  active
                    ? 'bg-[#2e7d32] text-white border-[#2e7d32] shadow-xs'
                    : 'bg-white text-emerald-950 border-emerald-200 hover:border-emerald-300'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* LGA & Status Filter Dropdown */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-emerald-100 text-xs">
          <div className="flex items-center gap-2 font-bold text-stone-700">
            <MapPin className="w-4 h-4 text-[#2e7d32]" />
            <span>Filter by LGA:</span>
            <select
              value={selectedLGA}
              onChange={e => setSelectedLGA(e.target.value)}
              className="bg-[#f3f7f4] text-emerald-950 font-bold px-3 py-1.5 rounded-full border border-emerald-200 focus:outline-none cursor-pointer"
            >
              <option value="All">All Lagos LGAs</option>
              {LAGOS_LGAS.map(lga => (
                <option key={lga} value={lga}>
                  {lga}
                </option>
              ))}
            </select>
          </div>

          <div className="text-xs text-stone-500 font-semibold">
            Showing <strong className="text-[#2e7d32]">{filteredRequests.length}</strong> active buyer requests
          </div>
        </div>
      </div>

      {/* Requests Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRequests.map(req => {
          const reqOffers = offers.filter(o => o.requestId === req.id);

          return (
            <div
              key={req.id}
              className="bg-white border border-emerald-100 rounded-2xl p-5 shadow-xs hover:border-[#2e7d32] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              {/* Card Header */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                      req.urgency === 'URGENT_TODAY'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : req.urgency === 'THIS_WEEKEND'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}
                  >
                    {req.urgency.replace('_', ' ')}
                  </span>

                  <span className="text-[11px] font-bold text-stone-400">
                    {req.createdAt}
                  </span>
                </div>

                {/* Produce Item Title */}
                <div>
                  <h3 className="font-heading text-base font-extrabold text-stone-900 leading-snug">
                    {req.itemName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-semibold mt-1">
                    <span className="bg-[#f3f7f4] text-[#2e7d32] px-2 py-0.5 rounded-md font-bold">
                      {req.quantity} {req.unit}
                    </span>
                    <span>•</span>
                    <span className="text-stone-700 font-bold">
                      Target: {formatNGN(req.maxTargetPriceNGN)} / {req.unit}
                    </span>
                  </div>
                </div>

                {/* Buyer Badge */}
                <div className="bg-[#f3f7f4] p-2.5 rounded-xl border border-emerald-100 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-stone-800">
                    <Building className="w-3.5 h-3.5 text-[#2e7d32]" />
                    <span className="truncate">{req.buyerName}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#2e7d32]" />
                      {req.locationLGA}
                    </span>
                    <span className="flex items-center gap-1 text-amber-700 font-bold">
                      <Clock className="w-3 h-3" />
                      {req.deadlineDate}
                    </span>
                  </div>
                </div>

                {/* Notes */}
                {req.notes && (
                  <p className="text-stone-500 text-xs italic leading-relaxed line-clamp-2">
                    "{req.notes}"
                  </p>
                )}

                {/* Offers badge */}
                <div className="flex items-center justify-between pt-2 border-t border-emerald-50 text-xs">
                  <span className="text-stone-500 font-semibold">
                    Status: <strong className="text-emerald-800">{req.status.replace('_', ' ')}</strong>
                  </span>
                  <span className="bg-emerald-50 text-[#2e7d32] px-2 py-0.5 rounded-full font-extrabold text-[11px] border border-emerald-200">
                    {reqOffers.length} {reqOffers.length === 1 ? 'Offer' : 'Offers'} Received
                  </span>
                </div>
              </div>

              {/* Action Buttons: Offer Stock & Direct Chat */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-emerald-50">
                <button
                  onClick={() => {
                    setActiveOfferRequest(req);
                    setProposedPrice(req.maxTargetPriceNGN.toString());
                    setAvailableQty(req.quantity.toString());
                  }}
                  className="bg-[#2e7d32] hover:bg-[#1b4332] text-white text-xs font-bold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Offer</span>
                </button>

                <button
                  onClick={() => onOpenChatWithBuyer(req, currentVendor)}
                  className="bg-white hover:bg-[#f3f7f4] text-[#2e7d32] border border-[#2e7d32] text-xs font-bold py-2.5 px-3 rounded-full flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Direct Chat</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Post a Need Modal (Buyer Form) */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-100 rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div>
                <h3 className="font-heading text-lg font-extrabold text-stone-900">Post a Produce Need (RFQ)</h3>
                <p className="text-stone-500 text-xs">Broadcast your requirements to verified Lagos farmers & market traders</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-800 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="text-stone-700 block mb-1">Item Title / Specific Produce Needed</label>
                <input
                  type="text"
                  placeholder="e.g. 50 Paint Buckets of Firm Roma Tomatoes"
                  value={itemName}
                  onChange={e => setItemName(e.target.value)}
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
                  <label className="text-stone-700 block mb-1">Buyer Type</label>
                  <select
                    value={buyerType}
                    onChange={e => setBuyerType(e.target.value as any)}
                    className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-3 rounded-xl focus:outline-none focus:border-[#2e7d32]"
                  >
                    <option value="Restaurant / Eatery">Restaurant / Eatery</option>
                    <option value="Catering Company">Catering Company</option>
                    <option value="Household">Household</option>
                    <option value="Cooperative">Cooperative</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 block mb-1">Quantity Needed</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-3 rounded-xl focus:outline-none focus:border-[#2e7d32]"
                    required
                  />
                </div>

                <div>
                  <label className="text-stone-700 block mb-1">Native Measurement Unit</label>
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
                    <option value="3 Fish Pack">3 Fish Pack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 block mb-1">Target Max Price per Unit (₦ NGN)</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-3 rounded-xl font-bold focus:outline-none focus:border-[#2e7d32]"
                    required
                  />
                </div>

                <div>
                  <label className="text-stone-700 block mb-1">Urgency Level</label>
                  <select
                    value={urgency}
                    onChange={e => setUrgency(e.target.value as any)}
                    className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-3 rounded-xl focus:outline-none focus:border-[#2e7d32]"
                  >
                    <option value="URGENT_TODAY">🚨 Urgent (Today)</option>
                    <option value="THIS_WEEKEND">📅 This Weekend</option>
                    <option value="FLEXIBLE">🟢 Flexible</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 block mb-1">Lagos Neighborhood LGA</label>
                  <select
                    value={locationLGA}
                    onChange={e => setLocationLGA(e.target.value as LagosLGA)}
                    className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-3 rounded-xl focus:outline-none focus:border-[#2e7d32]"
                  >
                    {LAGOS_LGAS.map(lga => (
                      <option key={lga} value={lga}>
                        {lga}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-stone-700 block mb-1">Required Delivery Deadline</label>
                  <input
                    type="text"
                    placeholder="e.g. Saturday 9:00 AM"
                    value={deadlineDate}
                    onChange={e => setDeadlineDate(e.target.value)}
                    className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-3 rounded-xl focus:outline-none focus:border-[#2e7d32]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-700 block mb-1">Specific Quality Requirements / Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder="e.g. Must be completely dry with minimal water content for stew..."
                  className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-3 rounded-xl focus:outline-none focus:border-[#2e7d32]"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-emerald-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-stone-100 text-stone-700 font-bold px-4 py-2.5 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2e7d32] hover:bg-[#1b4332] text-white font-bold px-6 py-2.5 rounded-full shadow-sm"
                >
                  Broadcast RFQ to Lagos Sellers
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submit Offer Modal (Vendor Counter-Quote) */}
      {activeOfferRequest && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-emerald-100 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
              <div>
                <h3 className="font-heading text-base font-extrabold text-stone-900">Send Stock Offer</h3>
                <p className="text-stone-500 text-xs">For: {activeOfferRequest.itemName}</p>
              </div>
              <button onClick={() => setActiveOfferRequest(null)} className="text-stone-400 hover:text-stone-800 font-bold p-1">✕</button>
            </div>

            <form onSubmit={handleOfferSubmit} className="space-y-3.5 text-xs font-semibold">
              <div className="bg-[#f3f7f4] p-3 rounded-xl border border-emerald-100 space-y-1">
                <span className="text-stone-500 text-[10px] uppercase font-bold block">Buyer Request Details:</span>
                <p className="font-bold text-stone-900">{activeOfferRequest.quantity} {activeOfferRequest.unit} @ Max {formatNGN(activeOfferRequest.maxTargetPriceNGN)}</p>
                <p className="text-stone-500 text-[11px]">Location: {activeOfferRequest.locationLGA} • Deadline: {activeOfferRequest.deadlineDate}</p>
              </div>

              <div>
                <label className="text-stone-700 block mb-1">Responding As Vendor:</label>
                <select
                  value={selectedVendorId}
                  onChange={e => setSelectedVendorId(e.target.value)}
                  className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-2.5 rounded-xl font-bold"
                >
                  {vendors.map(v => (
                    <option key={v.id} value={v.id}>
                      {v.businessName} ({v.marketLocation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-stone-700 block mb-1">Proposed Price (₦ NGN)</label>
                  <input
                    type="number"
                    value={proposedPrice}
                    onChange={e => setProposedPrice(e.target.value)}
                    className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-2.5 rounded-xl font-bold text-[#2e7d32]"
                    required
                  />
                </div>

                <div>
                  <label className="text-stone-700 block mb-1">Available Qty</label>
                  <input
                    type="number"
                    value={availableQty}
                    onChange={e => setAvailableQty(e.target.value)}
                    className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-2.5 rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-700 block mb-1">Dispatch / Fulfillment Timing</label>
                <input
                  type="text"
                  value={deliveryTimeline}
                  onChange={e => setDeliveryTimeline(e.target.value)}
                  className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-2.5 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="text-stone-700 block mb-1">Stock Note to Buyer</label>
                <textarea
                  rows={2}
                  value={offerNotes}
                  onChange={e => setOfferNotes(e.target.value)}
                  className="w-full bg-[#f3f7f4] border border-emerald-200 text-stone-900 p-2.5 rounded-xl"
                ></textarea>
              </div>

              <div className="pt-3 border-t border-emerald-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveOfferRequest(null)}
                  className="bg-stone-100 text-stone-700 font-bold px-4 py-2 rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#2e7d32] hover:bg-[#1b4332] text-white font-bold px-5 py-2 rounded-full shadow-sm"
                >
                  Submit Stock Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
