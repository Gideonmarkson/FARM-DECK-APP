import React, { useState } from 'react';
import { CartItem, LagosLGA, Order } from '../types';
import { LAGOS_LGAS, formatNGN, calculateDeliveryFee } from '../utils/formatters';
import {
  X,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Clock,
  CreditCard,
  Building2,
  PhoneCall,
  CheckCircle2,
  Truck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (produceId: string, qty: number) => void;
  onRemoveItem: (produceId: string) => void;
  onClearCart: () => void;
  selectedLGA: LagosLGA;
  setSelectedLGA: (lga: LagosLGA) => void;
  isNearMe: boolean;
  onOrderCreated: (order: Order) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  selectedLGA,
  setSelectedLGA,
  isNearMe,
  onOrderCreated
}) => {
  const [deliveryAddress, setDeliveryAddress] = useState('14 Admiralty Way, Lekki Phase 1, Lagos');
  const [deliverySlot, setDeliverySlot] = useState('Saturday 08:00 AM - 10:00 AM');
  const [paymentMethod, setPaymentMethod] = useState<'Paystack Card' | 'Bank Transfer' | 'USSD (*737#)'>('Bank Transfer');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.produce.priceNGN * item.quantity, 0);
  const pickupLGA = cartItems.length > 0 ? cartItems[0].produce.lga : 'Kosofe';
  const deliveryFee = calculateDeliveryFee(pickupLGA, selectedLGA, isNearMe);
  const serviceFee = 300;
  const total = subtotal + deliveryFee + serviceFee;

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
        consumerName: 'Funke Adebayo',
        consumerPhone: '+234 802 555 9911',
        deliveryAddress,
        deliveryLGA: selectedLGA,
        vendorId: cartItems[0].produce.vendorId,
        vendorName: cartItems[0].produce.vendorName,
        pickupMarket: cartItems[0].produce.marketLocation,
        pickupLGA,
        items: cartItems.map(ci => ({
          title: ci.produce.title,
          unit: ci.produce.unit,
          quantity: ci.quantity,
          priceNGN: ci.produce.priceNGN
        })),
        subtotalNGN: subtotal,
        deliveryFeeNGN: deliveryFee,
        serviceFeeNGN: serviceFee,
        totalNGN: total,
        status: 'PLACED',
        paymentMethod,
        paymentReference: `PST-${Math.floor(10000000 + Math.random() * 90000000)}-NG`,
        deliverySlot,
        isNearMeDiscounted: isNearMe,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        riderName: 'Tunde Bakare',
        riderPhone: '+234 812 345 6789',
        riderVehicle: 'Gokada Box Bike'
      };

      setConfirmedOrder(newOrder);
      onOrderCreated(newOrder);
      onClearCart();
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-2xs flex justify-end">
      
      {confirmedOrder ? (
        <div className="m-auto bg-white border border-emerald-100 rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-emerald-100 border border-emerald-200 text-[#2e7d32] flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h2 className="font-heading text-2xl font-extrabold text-center text-stone-900 mb-1">
            Order Placed Successfully!
          </h2>
          <p className="text-center text-stone-500 text-xs mb-6">
            Reference <span className="font-mono text-[#2e7d32] font-bold">{confirmedOrder.id}</span>
          </p>

          <div className="bg-[#f3f7f4] rounded-xl p-4 border border-emerald-100 space-y-2.5 mb-6 text-xs text-stone-800 font-semibold">
            <div className="flex justify-between pb-2 border-b border-emerald-100">
              <span className="text-stone-500">Vendor</span>
              <span>{confirmedOrder.vendorName} ({confirmedOrder.pickupMarket})</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-emerald-100">
              <span className="text-stone-500">Delivery Destination</span>
              <span>{confirmedOrder.deliveryAddress} ({confirmedOrder.deliveryLGA})</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-emerald-100">
              <span className="text-stone-500">Total Paid</span>
              <span className="font-heading font-black text-[#2e7d32] text-sm">{formatNGN(confirmedOrder.totalNGN)}</span>
            </div>
          </div>

          <button
            onClick={() => {
              setConfirmedOrder(null);
              onClose();
            }}
            className="w-full bg-[#2e7d32] hover:bg-[#1b4332] text-white font-bold py-3 rounded-full text-xs uppercase shadow-xs"
          >
            Track Delivery in 3PL Dispatch
          </button>
        </div>
      ) : (
        <div className="w-full max-w-md bg-white text-stone-900 border-l border-emerald-100 h-full flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 border-b border-emerald-100 flex items-center justify-between bg-[#f3f7f4]">
            <div className="flex items-center gap-2">
              <h2 className="font-heading text-lg font-extrabold text-stone-900">Your Produce Cart</h2>
              <span className="bg-[#2e7d32] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                {cartItems.length} items
              </span>
            </div>
            <button onClick={onClose} className="text-stone-400 hover:text-stone-900 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <Truck className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                <p className="text-stone-800 font-bold text-sm">Your cart is currently empty</p>
                <p className="text-stone-500 text-xs mt-1">Browse fresh produce from vendors across Lagos</p>
              </div>
            ) : (
              <>
                {isNearMe ? (
                  <div className="bg-amber-100 border border-amber-300 p-3 rounded-xl text-xs text-amber-900 flex items-center gap-2 font-bold">
                    <Sparkles className="w-4 h-4 text-[#2e7d32] shrink-0" />
                    <span>
                      Near Me Discount: Delivery fee reduced to <strong>₦400</strong>!
                    </span>
                  </div>
                ) : (
                  <div className="bg-[#f3f7f4] border border-emerald-100 p-3 rounded-xl text-xs text-stone-700 font-bold flex items-center justify-between">
                    <span>Pickup from {pickupLGA}</span>
                    <span className="text-[#2e7d32]">Standard 3PL Dispatch</span>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-3">
                  {cartItems.map(({ produce, quantity }) => (
                    <div
                      key={produce.id}
                      className="bg-[#f3f7f4] border border-emerald-100 p-3 rounded-xl flex items-center justify-between gap-3"
                    >
                      <img src={produce.imageUrl} alt={produce.title} className="w-12 h-12 rounded-xl object-cover border border-emerald-100 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-stone-900 truncate">{produce.title}</h4>
                        <p className="text-[11px] text-stone-600 font-semibold">
                          {produce.unit} • <span className="text-[#2e7d32] font-black">{formatNGN(produce.priceNGN)}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 bg-white border border-emerald-200 rounded-full px-2.5 py-1">
                        <button onClick={() => onUpdateQuantity(produce.id, quantity - 1)} className="text-stone-500 hover:text-stone-900 font-bold">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-stone-900 w-4 text-center">{quantity}</span>
                        <button onClick={() => onUpdateQuantity(produce.id, quantity + 1)} className="text-stone-500 hover:text-stone-900 font-bold">
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button onClick={() => onRemoveItem(produce.id)} className="text-stone-400 hover:text-rose-600 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Form */}
                <div className="bg-[#f3f7f4] p-4 rounded-xl border border-emerald-100 space-y-3 text-xs font-semibold">
                  <h3 className="font-heading text-sm font-extrabold text-stone-900 uppercase">
                    Delivery Setup
                  </h3>

                  <div>
                    <label className="text-stone-600 block mb-1">Street Address</label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={e => setDeliveryAddress(e.target.value)}
                      className="w-full bg-white border border-emerald-200 text-stone-900 text-xs p-2.5 rounded-xl focus:outline-none focus:border-[#2e7d32]"
                    />
                  </div>

                  <div>
                    <label className="text-stone-600 block mb-1">Destination LGA</label>
                    <select
                      value={selectedLGA}
                      onChange={e => setSelectedLGA(e.target.value as LagosLGA)}
                      className="w-full bg-white border border-emerald-200 text-stone-900 text-xs p-2.5 rounded-xl focus:outline-none focus:border-[#2e7d32]"
                    >
                      {LAGOS_LGAS.map(lga => (
                        <option key={lga} value={lga}>
                          {lga}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-stone-600 block mb-1">Payment Method</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'Bank Transfer', icon: <Building2 className="w-3.5 h-3.5" /> },
                        { id: 'Paystack Card', icon: <CreditCard className="w-3.5 h-3.5" /> },
                        { id: 'USSD (*737#)', icon: <PhoneCall className="w-3.5 h-3.5" /> }
                      ].map(method => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id as any)}
                          className={`p-2 rounded-xl border text-[10px] font-bold uppercase flex flex-col items-center gap-1 ${
                            paymentMethod === method.id
                              ? 'bg-[#2e7d32] text-white border-[#2e7d32]'
                              : 'bg-white text-stone-700 border-emerald-200'
                          }`}
                        >
                          {method.icon}
                          <span className="truncate w-full text-center">{method.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-[#f3f7f4] p-4 rounded-xl border border-emerald-100 space-y-1.5 text-xs font-semibold">
                  <div className="flex justify-between text-stone-600">
                    <span>Subtotal</span>
                    <span className="text-stone-900 font-bold">{formatNGN(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>3PL Delivery Fee</span>
                    <span className="text-stone-900 font-bold">{formatNGN(deliveryFee)}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span>Service Fee</span>
                    <span className="text-stone-900 font-bold">{formatNGN(serviceFee)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-emerald-200 text-sm font-black text-stone-900">
                    <span>Total Amount</span>
                    <span className="text-[#2e7d32] font-heading text-base">{formatNGN(total)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-emerald-100 bg-[#f3f7f4]">
              <button
                onClick={handleCheckout}
                disabled={isSubmitting}
                className="w-full bg-[#2e7d32] hover:bg-[#1b4332] text-white font-bold py-3 rounded-full text-xs uppercase flex items-center justify-center gap-2 shadow-xs"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : (
                  <>
                    <span>Confirm Order & Pay {formatNGN(total)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
