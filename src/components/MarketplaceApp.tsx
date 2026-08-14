import React, { useState } from 'react';
import {
  UserRole,
  ProduceItem,
  CartItem,
  LagosLGA,
  Order,
  DemandRequest,
  RequestOffer,
  ChatConversation,
  ChatMessage,
  VendorProfile
} from '../types';
import {
  MOCK_PRODUCE,
  MOCK_VENDORS,
  MOCK_INITIAL_ORDERS,
  MOCK_DEMAND_REQUESTS,
  MOCK_REQUEST_OFFERS,
  MOCK_CONVERSATIONS
} from '../data/mockFarmData';
import { Header } from './Header';
import { ConsumerView } from './ConsumerView';
import { DemandBoard } from './DemandBoard';
import { VendorPortal } from './VendorPortal';
import { LogisticsView } from './LogisticsView';
import { PriceTracker } from './PriceTracker';
import { AIProduceAssistant } from './AIProduceAssistant';
import { CartDrawer } from './CartDrawer';
import { ChatDrawer } from './ChatDrawer';
import { FarmDeckLogo } from './FarmDeckLogo';

export const MarketplaceApp: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<UserRole>('CONSUMER');
  const [selectedLGA, setSelectedLGA] = useState<LagosLGA>('Eti-Osa (Lekki / Ikoyi)');
  const [isNearMe, setIsNearMe] = useState(false);

  // Produce & Cart
  const [produceItems, setProduceItems] = useState<ProduceItem[]>(MOCK_PRODUCE);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { produce: MOCK_PRODUCE[0], quantity: 1 },
    { produce: MOCK_PRODUCE[1], quantity: 2 }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>(MOCK_INITIAL_ORDERS);

  // Demand Requests (RFQ) & Offers
  const [demandRequests, setDemandRequests] = useState<DemandRequest[]>(MOCK_DEMAND_REQUESTS);
  const [requestOffers, setRequestOffers] = useState<RequestOffer[]>(MOCK_REQUEST_OFFERS);

  // In-App Direct Chat
  const [conversations, setConversations] = useState<ChatConversation[]>(MOCK_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(MOCK_CONVERSATIONS[0].id);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleAddToCart = (produce: ProduceItem) => {
    setCartItems(prev => {
      const existing = prev.find(ci => ci.produce.id === produce.id);
      if (existing) {
        return prev.map(ci =>
          ci.produce.id === produce.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      }
      return [...prev, { produce, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleAddMultipleToCart = (items: ProduceItem[]) => {
    items.forEach(item => handleAddToCart(item));
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (produceId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(produceId);
      return;
    }
    setCartItems(prev =>
      prev.map(ci => (ci.produce.id === produceId ? { ...ci, quantity: qty } : ci))
    );
  };

  const handleRemoveItem = (produceId: string) => {
    setCartItems(prev => prev.filter(ci => ci.produce.id !== produceId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleAddNewProduce = (newItem: ProduceItem) => {
    setProduceItems(prev => [newItem, ...prev]);
    setCurrentRole('CONSUMER');
  };

  const handleOrderCreated = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
  };

  // RFQ Handlers
  const handleCreateDemandRequest = (newRequest: DemandRequest) => {
    setDemandRequests(prev => [newRequest, ...prev]);
  };

  const handleSubmitOffer = (newOffer: RequestOffer) => {
    setRequestOffers(prev => [newOffer, ...prev]);
    setDemandRequests(prev =>
      prev.map(r =>
        r.id === newOffer.requestId
          ? { ...r, offersCount: r.offersCount + 1, status: 'OFFER_RECEIVED' }
          : r
      )
    );
  };

  // Chat Handlers
  const handleOpenChatWithBuyer = (request: DemandRequest, vendor: VendorProfile) => {
    let existing = conversations.find(c => c.requestId === request.id);
    if (!existing) {
      const newConv: ChatConversation = {
        id: `conv-${Date.now()}`,
        buyerId: request.buyerId,
        buyerName: request.buyerName,
        vendorId: vendor.id,
        vendorName: vendor.businessName,
        vendorMarket: vendor.marketLocation,
        vendorAvatar: vendor.avatarUrl,
        vendorOnline: true,
        requestId: request.id,
        topicTitle: `${request.itemName} (${request.quantity} ${request.unit})`,
        lastMessage: `Hello ${request.buyerName}, I have available stock for your RFQ.`,
        lastMessageTime: 'Just now',
        unreadCount: 0,
        messages: [
          {
            id: `msg-${Date.now()}`,
            conversationId: `conv-${Date.now()}`,
            senderId: vendor.id,
            senderName: vendor.businessName,
            senderRole: 'VENDOR',
            text: `Hello! I saw your demand request for ${request.itemName}. We have prime Grade A batch at ${vendor.marketLocation} and can fulfill directly to ${request.locationLGA}.`,
            createdAt: 'Just now',
            isRead: true
          }
        ]
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
    } else {
      setActiveConversationId(existing.id);
    }
    setIsChatOpen(true);
  };

  const handleSendMessage = (
    conversationId: string,
    text: string,
    mediaUrl?: string,
    priceOfferNGN?: number
  ) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId,
      senderId: 'buyer-user',
      senderName: 'Funke Adebayo',
      senderRole: 'BUYER',
      text,
      mediaUrl,
      priceOfferNGN,
      createdAt: 'Just now',
      isRead: true
    };

    setConversations(prev =>
      prev.map(c => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastMessageTime: 'Just now',
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );
  };

  const handleAcceptPriceOffer = (offerPriceNGN: number, topic: string) => {
    // Add negotiated item directly to cart
    const negotiatedItem: ProduceItem = {
      id: `prod-negotiated-${Date.now()}`,
      vendorId: 'v-1',
      vendorName: 'Mama Nkechi Produce Hub',
      marketLocation: 'Mile 12 International Market',
      lga: 'Kosofe',
      title: `${topic} [Negotiated RFQ Rate]`,
      category: 'Spices & Peppers',
      unit: 'Bulk Pack',
      priceNGN: offerPriceNGN,
      stockQty: 10,
      freshness: 'GRADE_A_TODAY',
      imageUrl: '/images/roma_tomatoes.jpg',
      description: 'Accepted via Direct In-App Chat negotiation on Farmdeck Hub.',
      isAvailable: true
    };

    handleAddToCart(negotiatedItem);
    setIsChatOpen(false);
  };

  const cartTotal = cartItems.reduce((acc, ci) => acc + ci.produce.priceNGN * ci.quantity, 0);
  const cartCount = cartItems.reduce((acc, ci) => acc + ci.quantity, 0);
  const unreadMessagesCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);

  return (
    <div className="min-h-screen bg-[#f4f9f4] text-stone-900 flex flex-col font-sans">
      
      {/* Header with Switch Portal & Live Indicators */}
      <Header
        currentRole={currentRole}
        setCurrentRole={setCurrentRole}
        selectedLGA={selectedLGA}
        setSelectedLGA={setSelectedLGA}
        isNearMe={isNearMe}
        setIsNearMe={setIsNearMe}
        cartCount={cartCount}
        cartTotal={cartTotal}
        unreadMessagesCount={unreadMessagesCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 bg-[#f4f9f4]">
        {currentRole === 'CONSUMER' && (
          <ConsumerView
            produceItems={produceItems}
            selectedLGA={selectedLGA}
            isNearMe={isNearMe}
            setIsNearMe={setIsNearMe}
            onAddToCart={handleAddToCart}
          />
        )}

        {currentRole === 'DEMAND_BOARD' && (
          <DemandBoard
            requests={demandRequests}
            offers={requestOffers}
            vendors={MOCK_VENDORS}
            currentLGA={selectedLGA}
            onCreateRequest={handleCreateDemandRequest}
            onSubmitOffer={handleSubmitOffer}
            onOpenChatWithBuyer={handleOpenChatWithBuyer}
          />
        )}

        {currentRole === 'VENDOR' && (
          <VendorPortal
            vendors={MOCK_VENDORS}
            produceItems={produceItems}
            onAddNewProduce={handleAddNewProduce}
          />
        )}

        {currentRole === 'RIDER' && <LogisticsView />}

        {currentRole === 'PRICE_INDEX' && <PriceTracker />}

        {currentRole === 'AI_ASSISTANT' && (
          <AIProduceAssistant onAddIngredientsToCart={handleAddMultipleToCart} />
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        selectedLGA={selectedLGA}
        setSelectedLGA={setSelectedLGA}
        isNearMe={isNearMe}
        onOrderCreated={handleOrderCreated}
      />

      {/* Slide-over In-App Direct Chat Drawer */}
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        setActiveConversationId={setActiveConversationId}
        onSendMessage={handleSendMessage}
        onAcceptPriceOffer={handleAcceptPriceOffer}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-emerald-100 py-8 text-center text-xs text-stone-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center space-y-2">
          <FarmDeckLogo size="sm" />
          <p>Digital Agriculture Marketplace • Connecting Farmers & Vendors Across All Parts of Lagos State</p>
          <p className="text-[11px] text-stone-400">
            Powered by React 19, TypeScript, Tailwind CSS & Gemini 2.5 AI • 3PL Dispatch (Gokada / Kwik)
          </p>
        </div>
      </footer>

    </div>
  );
};
