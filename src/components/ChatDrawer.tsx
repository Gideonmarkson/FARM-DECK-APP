import React, { useState, useEffect, useRef } from 'react';
import { ChatConversation, ChatMessage } from '../types';
import { formatNGN } from '../utils/formatters';
import {
  X,
  Send,
  Plus,
  Image as ImageIcon,
  CheckCheck,
  PhoneCall,
  ArrowLeft,
  ShoppingBag,
  DollarSign,
  Tag,
  Upload
} from 'lucide-react';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: ChatConversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  onSendMessage: (conversationId: string, text: string, mediaUrl?: string, priceOfferNGN?: number) => void;
  onAcceptPriceOffer?: (offerPriceNGN: number, topic: string) => void;
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  conversations,
  activeConversationId,
  setActiveConversationId,
  onSendMessage,
  onAcceptPriceOffer
}) => {
  const [inputText, setInputText] = useState('');
  const [showActionTray, setShowActionTray] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  if (!isOpen) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeConv) return;

    onSendMessage(activeConv.id, inputText.trim());
    setInputText('');

    // Automated vendor response simulator after 1.5 seconds
    setTimeout(() => {
      const vendorReplies = [
        `No problem at all! I have inspected the batch myself and they are super fresh. Ready whenever you confirm.`,
        `Okay madam! I am packaging it now in a clean sack. Will hand it to the 3PL bike rider.`,
        `Understood! You will get the best quality from our stall at ${activeConv.vendorMarket}.`
      ];
      const randomReply = vendorReplies[Math.floor(Math.random() * vendorReplies.length)];
      onSendMessage(activeConv.id, randomReply);
    }, 1500);
  };

  const handleSendHarvestPhoto = (photoUrl: string) => {
    if (!activeConv) return;
    onSendMessage(activeConv.id, 'Here is the current photo of the produce in our stall right now:', photoUrl);
    setShowActionTray(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeConv) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSendMessage(activeConv.id, `Uploaded photo of requested produce (${file.name}):`, reader.result);
        setShowActionTray(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendCounterOffer = (amount: number) => {
    if (!activeConv) return;
    onSendMessage(activeConv.id, `I propose a direct negotiation price of ${formatNGN(amount)} per unit.`, undefined, amount);
    setShowActionTray(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-2xs flex justify-end">
      <div className="w-full max-w-lg bg-white text-stone-900 border-l border-emerald-100 h-full flex flex-col shadow-2xl">
        
        {/* Main Header */}
        <div className="p-4 bg-[#1b4332] text-white flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            {activeConversationId && (
              <button
                onClick={() => setActiveConversationId(null)}
                className="md:hidden text-emerald-200 hover:text-white p-1"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-base font-extrabold text-white">Direct Market Chat</h2>
                <span className="bg-emerald-800 text-amber-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  Verified Sellers
                </span>
              </div>
              <p className="text-[11px] text-emerald-200">Real-time negotiations with Lagos farmers & traders</p>
            </div>
          </div>

          <button onClick={onClose} className="text-emerald-300 hover:text-white p-1 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Two-Column Layout (Inbox List vs Active Chat Room) */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Conversation List (Inbox) */}
          <div
            className={`w-full md:w-5/12 border-r border-emerald-100 flex flex-col bg-[#f4f9f4] ${
              activeConversationId ? 'hidden md:flex' : 'flex'
            }`}
          >
            <div className="p-3 border-b border-emerald-100 bg-white flex items-center justify-between">
              <span className="text-xs font-black uppercase text-stone-800 tracking-wider">
                Messages Inbox ({conversations.length})
              </span>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-emerald-100">
              {conversations.map(conv => {
                const isSelected = activeConversationId === conv.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`w-full text-left p-3.5 flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-emerald-100/70 border-l-4 border-[#2e7d32]'
                        : 'hover:bg-white'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conv.vendorAvatar}
                        alt={conv.vendorName}
                        className="w-10 h-10 rounded-full object-cover border border-emerald-200"
                      />
                      {conv.vendorOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-stone-900 truncate">
                          {conv.vendorName}
                        </h4>
                        <span className="text-[10px] text-stone-400 font-semibold whitespace-nowrap">
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#2e7d32] font-bold truncate">
                        {conv.topicTitle}
                      </p>

                      <p className="text-stone-500 text-[11px] truncate mt-0.5">
                        {conv.lastMessage}
                      </p>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="bg-[#2e7d32] text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Chat Thread */}
          {activeConv ? (
            <div
              className={`w-full md:w-7/12 flex flex-col bg-[#fdfdfd] ${
                !activeConversationId ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Thread Sub-Header */}
              <div className="p-3 border-b border-emerald-100 bg-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src={activeConv.vendorAvatar}
                      alt={activeConv.vendorName}
                      className="w-9 h-9 rounded-full object-cover border border-emerald-200"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-stone-900 leading-tight flex items-center gap-1">
                      <span>{activeConv.vendorName}</span>
                    </h3>
                    <p className="text-[10px] text-stone-500 font-semibold">
                      {activeConv.vendorMarket} • <span className="text-[#2e7d32] font-bold">Online Now</span>
                    </p>
                  </div>
                </div>

                <a
                  href={`tel:${activeConv.vendorMarket}`}
                  className="p-2 text-[#2e7d32] hover:bg-[#f3f7f4] rounded-full border border-emerald-200"
                  title="Call Vendor"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Context Bar */}
              <div className="bg-[#f4f9f4] px-3.5 py-2 border-b border-emerald-100 flex items-center justify-between text-[11px] font-bold text-stone-700">
                <div className="flex items-center gap-1.5 truncate">
                  <Tag className="w-3.5 h-3.5 text-[#2e7d32] shrink-0" />
                  <span className="truncate">{activeConv.topicTitle}</span>
                </div>
                <span className="text-[#2e7d32] bg-white px-2 py-0.5 rounded-full border border-emerald-200 shrink-0 text-[10px]">
                  Direct RFQ Thread
                </span>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f8faf8]">
                {activeConv.messages.map(msg => {
                  const isBuyer = msg.senderRole === 'BUYER';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isBuyer ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                          isBuyer
                            ? 'bg-[#2e7d32] text-white rounded-br-xs'
                            : 'bg-white text-stone-900 border border-emerald-100 rounded-bl-xs'
                        }`}
                      >
                        {/* Media Photo if attached */}
                        {msg.mediaUrl && (
                          <div className="mb-2 rounded-xl overflow-hidden border border-black/10">
                            <img
                              src={msg.mediaUrl}
                              alt="Harvest Stock"
                              className="w-full h-36 object-cover"
                            />
                            <div className="p-1.5 bg-black/50 text-white text-[10px] font-bold">
                              📸 Produce Photo
                            </div>
                          </div>
                        )}

                        <p className="whitespace-pre-line">{msg.text}</p>

                        {/* Price Counter Offer Card */}
                        {msg.priceOfferNGN && (
                          <div className="mt-2.5 bg-amber-50 border border-amber-300 rounded-xl p-2.5 text-stone-900 space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold uppercase text-amber-900">
                                Negotiated Price Offer
                              </span>
                              <span className="font-heading font-black text-[#2e7d32] text-sm">
                                {formatNGN(msg.priceOfferNGN)}
                              </span>
                            </div>

                            <button
                              onClick={() => {
                                if (onAcceptPriceOffer && msg.priceOfferNGN) {
                                  onAcceptPriceOffer(msg.priceOfferNGN, activeConv.topicTitle);
                                }
                              }}
                              className="w-full bg-[#2e7d32] hover:bg-[#1b4332] text-white text-[10px] font-black py-1.5 rounded-full uppercase shadow-xs flex items-center justify-center gap-1"
                            >
                              <ShoppingBag className="w-3 h-3" />
                              <span>Accept & Add to Cart</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-1 mt-1 px-1">
                        <span className="text-[10px] text-stone-400 font-semibold">{msg.createdAt}</span>
                        {isBuyer && <CheckCheck className="w-3 h-3 text-[#2e7d32]" />}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Action Tray Popover (when Plus button is clicked) */}
              {showActionTray && (
                <div className="p-3 bg-emerald-50 border-t border-emerald-200 space-y-3 animate-in slide-in-from-bottom duration-150">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span>Upload or Pick Produce Image</span>
                    <button onClick={() => setShowActionTray(false)} className="text-stone-400 hover:text-stone-700">✕</button>
                  </div>

                  {/* Device File Upload */}
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full bg-white hover:bg-emerald-100 text-[#2e7d32] border border-emerald-300 p-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-2xs"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Upload Photo from Phone / Computer</span>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Stock Produce Photo Selector */}
                  <div>
                    <span className="text-[10px] font-black uppercase text-stone-500 block mb-1.5">
                      Or Select Live Market Stall Photo:
                    </span>
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        onClick={() => handleSendHarvestPhoto('/images/roma_tomatoes.jpg')}
                        className="rounded-xl overflow-hidden border border-emerald-300 hover:scale-105 transition-all text-left bg-white"
                      >
                        <img src="/images/roma_tomatoes.jpg" alt="Tomatoes" className="w-full h-14 object-cover" />
                        <span className="block text-[9px] font-bold text-center p-0.5 truncate">Tomatoes</span>
                      </button>

                      <button
                        onClick={() => handleSendHarvestPhoto('/images/yam_tubers.jpg')}
                        className="rounded-xl overflow-hidden border border-emerald-300 hover:scale-105 transition-all text-left bg-white"
                      >
                        <img src="/images/yam_tubers.jpg" alt="Yam" className="w-full h-14 object-cover" />
                        <span className="block text-[9px] font-bold text-center p-0.5 truncate">Yam</span>
                      </button>

                      <button
                        onClick={() => handleSendHarvestPhoto('/images/fresh_catfish.jpg')}
                        className="rounded-xl overflow-hidden border border-emerald-300 hover:scale-105 transition-all text-left bg-white"
                      >
                        <img src="/images/fresh_catfish.jpg" alt="Catfish" className="w-full h-14 object-cover" />
                        <span className="block text-[9px] font-bold text-center p-0.5 truncate">Catfish</span>
                      </button>

                      <button
                        onClick={() => handleSendHarvestPhoto('/images/red_habanero_peppers.jpg')}
                        className="rounded-xl overflow-hidden border border-emerald-300 hover:scale-105 transition-all text-left bg-white"
                      >
                        <img src="/images/red_habanero_peppers.jpg" alt="Peppers" className="w-full h-14 object-cover" />
                        <span className="block text-[9px] font-bold text-center p-0.5 truncate">Ata Rodo</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Message Input Box with prominent Plus (+) Button */}
              <form onSubmit={handleSend} className="p-3 bg-white border-t border-emerald-100 flex items-center gap-2">
                
                {/* Plus (+) Button for Media & Price Negotiation */}
                <button
                  type="button"
                  onClick={() => setShowActionTray(!showActionTray)}
                  className={`p-2.5 rounded-full border transition-all active:scale-95 shrink-0 ${
                    showActionTray
                      ? 'bg-[#2e7d32] text-white border-[#2e7d32]'
                      : 'bg-[#f3f7f4] hover:bg-emerald-100 text-[#2e7d32] border-emerald-200'
                  }`}
                  title="Upload produce photo or negotiate price"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <input
                  type="text"
                  placeholder="Type a message or price offer to seller..."
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  className="flex-1 bg-[#f4f9f4] border border-emerald-200 text-stone-900 text-xs px-4 py-2.5 rounded-full focus:outline-none focus:border-[#2e7d32] font-semibold"
                />

                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="bg-[#2e7d32] hover:bg-[#1b4332] disabled:opacity-40 text-white p-2.5 rounded-full shadow-xs transition-all active:scale-95 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-center text-stone-400">
              <p className="text-xs font-bold">Select a conversation to start chatting</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
