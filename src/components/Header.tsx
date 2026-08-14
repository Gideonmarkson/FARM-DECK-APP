import React, { useState } from 'react';
import { UserRole, LagosLGA } from '../types';
import { LAGOS_LGAS, formatNGN } from '../utils/formatters';
import { FarmDeckLogo } from './FarmDeckLogo';
import {
  Menu,
  X,
  ShoppingBag,
  Store,
  Truck,
  TrendingUp,
  Sparkles,
  MapPin,
  Compass,
  Layers,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  PhoneCall
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedLGA: LagosLGA;
  setSelectedLGA: (lga: LagosLGA) => void;
  isNearMe: boolean;
  setIsNearMe: (val: boolean) => void;
  cartCount: number;
  cartTotal: number;
  unreadMessagesCount: number;
  onOpenCart: () => void;
  onOpenChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  setCurrentRole,
  selectedLGA,
  setSelectedLGA,
  isNearMe,
  setIsNearMe,
  cartCount,
  cartTotal,
  unreadMessagesCount,
  onOpenCart,
  onOpenChat
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems: {
    role: UserRole;
    label: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      role: 'CONSUMER',
      label: 'Marketplace',
      description: 'Browse fresh farm produce & local stalls',
      icon: <ShoppingBag className="w-5 h-5 text-[#2e7d32]" />
    },
    {
      role: 'DEMAND_BOARD',
      label: 'Demand Board (RFQ)',
      description: 'Post buyer needs & spot live demand',
      icon: <Layers className="w-5 h-5 text-amber-600" />,
      badge: 'Live RFQ'
    },
    {
      role: 'VENDOR',
      label: 'Vendor Portal',
      description: 'Manage inventory & fast 60s listing',
      icon: <Store className="w-5 h-5 text-[#2e7d32]" />
    },
    {
      role: 'RIDER',
      label: '3PL Dispatch',
      description: 'Track motorcycle & van deliveries',
      icon: <Truck className="w-5 h-5 text-[#2e7d32]" />
    },
    {
      role: 'PRICE_INDEX',
      label: 'Lagos Price Index',
      description: 'Daily commodity rates across 8 markets',
      icon: <TrendingUp className="w-5 h-5 text-[#2e7d32]" />
    },
    {
      role: 'AI_ASSISTANT',
      label: 'AI Chef Assistant',
      description: 'Smart recipe & ingredient calculator',
      icon: <Sparkles className="w-5 h-5 text-amber-500" />,
      badge: 'Gemini 2.5'
    }
  ];

  const handleSelectRole = (role: UserRole) => {
    setCurrentRole(role);
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Clean Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          
          {/* Left: Hamburger Menu Button + Official Farm Deck Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-xl bg-[#f3f7f4] hover:bg-emerald-100 text-[#2e7d32] border border-emerald-200 shadow-2xs transition-all active:scale-95 flex items-center justify-center"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <FarmDeckLogo size="md" />
            
            <span className="text-[10px] font-black uppercase bg-emerald-100 text-[#2e7d32] px-2 py-0.5 rounded-full border border-emerald-200 hidden sm:inline-block">
              Lagos
            </span>
          </div>

          {/* Right: Location Pill, Near Me, Chat & Cart */}
          <div className="flex items-center gap-2">
            
            {/* LGA Selector Pill */}
            <div className="relative hidden md:flex items-center bg-[#f3f7f4] rounded-full px-3.5 py-2 border border-emerald-200 text-xs font-bold shadow-2xs">
              <MapPin className="w-4 h-4 text-[#2e7d32] mr-1.5" />
              <select
                value={selectedLGA}
                onChange={e => setSelectedLGA(e.target.value as LagosLGA)}
                className="bg-transparent text-emerald-950 font-bold focus:outline-none cursor-pointer pr-1"
              >
                {LAGOS_LGAS.map(lga => (
                  <option key={lga} value={lga}>
                    {lga}
                  </option>
                ))}
              </select>
            </div>

            {/* Near Me Toggle Pill */}
            <button
              onClick={() => setIsNearMe(!isNearMe)}
              className={`hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full border text-xs font-bold uppercase transition-all ${
                isNearMe
                  ? 'bg-amber-100 text-amber-900 border-amber-400 shadow-2xs'
                  : 'bg-[#f3f7f4] text-emerald-900 border-emerald-200 hover:border-emerald-300'
              }`}
            >
              <Compass className="w-4 h-4 text-[#2e7d32]" />
              <span>Near Me (&lt;3km)</span>
            </button>

            {/* Direct Chat Drawer Toggle Button */}
            <button
              onClick={onOpenChat}
              className="relative flex items-center gap-1.5 bg-[#f3f7f4] hover:bg-emerald-100 text-[#2e7d32] border border-emerald-200 px-3.5 py-2.5 rounded-full text-xs font-bold shadow-2xs transition-all active:scale-95"
              title="Open Direct Chat"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Chat</span>
              {unreadMessagesCount > 0 && (
                <span className="bg-rose-500 text-white font-black px-1.5 py-0.5 rounded-full text-[10px] animate-pulse">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-[#2e7d32] hover:bg-[#1b4332] text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-md shadow-emerald-900/20 transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-emerald-950 font-black px-2 py-0.5 rounded-full text-[10px]">
                  {cartCount}
                </span>
              )}
              {cartTotal > 0 && (
                <span className="text-emerald-100 font-bold border-l border-emerald-600 pl-2 hidden sm:inline">
                  {formatNGN(cartTotal)}
                </span>
              )}
            </button>

          </div>

        </div>
      </header>

      {/* Slide-out Hamburger Menu Drawer */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-2xs flex">
          
          {/* Drawer Container */}
          <div className="w-full max-w-xs sm:max-w-sm bg-white text-stone-900 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            
            {/* Drawer Header */}
            <div className="p-4 bg-[#1b4332] text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <FarmDeckLogo size="sm" />
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-emerald-900 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Location Banner */}
            <div className="p-3 bg-[#f3f7f4] border-b border-emerald-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 font-bold text-stone-700">
                <MapPin className="w-3.5 h-3.5 text-[#2e7d32]" />
                <span>Active Region:</span>
              </div>
              <select
                value={selectedLGA}
                onChange={e => setSelectedLGA(e.target.value as LagosLGA)}
                className="bg-white border border-emerald-200 text-[#2e7d32] font-bold text-xs px-2.5 py-1 rounded-lg focus:outline-none cursor-pointer"
              >
                {LAGOS_LGAS.map(lga => (
                  <option key={lga} value={lga}>
                    {lga}
                  </option>
                ))}
              </select>
            </div>

            {/* Menu Links */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              <p className="px-3 pt-2 pb-1 text-[11px] font-black uppercase tracking-wider text-stone-400">
                Navigation & Portals
              </p>

              {menuItems.map(item => {
                const isActive = currentRole === item.role;
                return (
                  <button
                    key={item.role}
                    onClick={() => handleSelectRole(item.role)}
                    className={`w-full text-left p-3 rounded-2xl flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-[#2e7d32] text-white shadow-xs'
                        : 'bg-[#f8faf8] hover:bg-emerald-50 text-stone-800 border border-emerald-100/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${
                          isActive ? 'bg-white/20 text-white' : 'bg-white border border-emerald-100 shadow-2xs'
                        }`}
                      >
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className={`text-xs font-black ${isActive ? 'text-white' : 'text-stone-900'}`}>
                            {item.label}
                          </h4>
                          {item.badge && (
                            <span
                              className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                isActive ? 'bg-white/20 text-amber-200' : 'bg-amber-100 text-amber-900'
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className={`text-[11px] ${isActive ? 'text-emerald-100' : 'text-stone-500'}`}>
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-[#f3f7f4] border-t border-emerald-100 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
                <ShieldCheck className="w-4 h-4 text-[#2e7d32]" />
                <span>Verified Lagos Agriculture Platform</span>
              </div>
              <p className="text-[10px] text-stone-400">
                Connecting buyers with farmers & traders in 20 LGAs across Lagos.
              </p>
            </div>

          </div>

          {/* Clickable Backdrop */}
          <div className="flex-1" onClick={() => setIsMenuOpen(false)}></div>
        </div>
      )}
    </>
  );
};
