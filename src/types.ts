export type UserRole = 'CONSUMER' | 'DEMAND_BOARD' | 'VENDOR' | 'RIDER' | 'PRICE_INDEX' | 'AI_ASSISTANT';

export type FreshnessGrade = 'GRADE_A_TODAY' | 'GRADE_A_ARRIVED' | 'GRADE_B';
export type SellerType = 'SMALLHOLDER_FARMER' | 'MARKET_TRADER' | 'COOPERATIVE';
export type OrderStatus = 'PLACED' | 'VENDOR_CONFIRMED' | 'RIDER_DISPATCHED' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED';

export type ProduceCategory =
  | 'Tubers'
  | 'Vegetables'
  | 'Spices & Peppers'
  | 'Grains & Flour'
  | 'Oils & Condiments'
  | 'Fruits'
  | 'Meat & Poultry'
  | 'Fish & Seafood';

export type LagosLGA =
  | 'Kosofe'
  | 'Yaba / Mainland'
  | 'Eti-Osa (Lekki / Ikoyi)'
  | 'Ikeja'
  | 'Ikorodu'
  | 'Epe'
  | 'Badagry'
  | 'Agege'
  | 'Alimosho'
  | 'Mushin'
  | 'Surulere'
  | 'Oshodi-Isolo'
  | 'Amuwo-Odofin (Festac)'
  | 'Apapa'
  | 'Lagos Island'
  | 'Ojo'
  | 'Ifako-Ijaiye'
  | 'Shomolu (Bariga)'
  | 'Ajeromi-Ifelodun'
  | 'Ibeju-Lekki';

export const LAGOS_MARKETS_BY_LGA: Record<LagosLGA, string[]> = {
  'Kosofe': [
    'Mile 12 International Market',
    'Ketu Fruit Market',
    'Ojota Market',
    'Ikosi Fruit Market',
    'Agboyi Market'
  ],
  'Yaba / Mainland': [
    'Oyingbo Ultramodern Market',
    'Tejuosho Ultra-Modern Market',
    'White Sand Market',
    'Makoko Fish Market',
    'Yaba Night Market'
  ],
  'Eti-Osa (Lekki / Ikoyi)': [
    'Sangotedo Market',
    'Jakande Market',
    'Ajah Market',
    'Falomo Farmers Market',
    'Elegushi Market'
  ],
  'Ikeja': [
    'Ipodo Market',
    'Computer Village & Agric Line',
    'Onigbongbo Market',
    'Ikeja Cantonment Market'
  ],
  'Ikorodu': [
    'Ikorodu Central Market (Sabo)',
    'Ayangburen Market',
    'Ogolonto Market',
    'Maya Agricultural Market'
  ],
  'Epe': [
    'Epe Waterfront Fish Market',
    'Poka Market',
    'Mojoda Market',
    'Oluwo Fish Market'
  ],
  'Badagry': [
    'Badagry Slave Route Market',
    'Agbalata International Market',
    'Hunto Market',
    'Seme Border Market'
  ],
  'Agege': [
    'Agege Main Market (Tuber Hub)',
    'Abbatoir Meat Market',
    'Katangowa Market',
    'Tabon Tabon Market'
  ],
  'Alimosho': [
    'Ikotun Market',
    'Iyana-Ipaja Market',
    'Egbeda Market',
    'Igando Market',
    'Akowonjo Market',
    'Ayobo Market'
  ],
  'Mushin': [
    'Daleko Rice & Grain Market',
    'Ojuwoye Market',
    'Ladipo Food Market',
    'Alamutu Market'
  ],
  'Surulere': [
    'Ojuelegba Market',
    'Aguda Market',
    'Lawanson Market',
    'Masha Market',
    'Gbaja Market'
  ],
  'Oshodi-Isolo': [
    'Oshodi Main Market',
    'Aswani Market',
    'Isolo Modern Market',
    'Okota Market',
    'Mafoluku Market'
  ],
  'Amuwo-Odofin (Festac)': [
    'Festac Town Market (23/24 Road)',
    'Agboju Market',
    'Trade Fair Complex Food Section',
    'Mile 2 Food Market'
  ],
  'Apapa': [
    'Apapa Wharf Market',
    'Boundary Market Ajegunle',
    'Liverpool Market'
  ],
  'Lagos Island': [
    'Balogun Market',
    'Jankara Market',
    'Sandgrouse Market',
    'Idumota Food Line',
    'Ebute Ero Market'
  ],
  'Ojo': [
    'Alaba Suru Vegetable Market',
    'Alaba International Food Section',
    'Iyana Iba Market',
    'Okokomaiko Market'
  ],
  'Ifako-Ijaiye': [
    'Iju Station Market',
    'Ojokoro Market',
    'Jankara Ifako',
    'Fagba Market'
  ],
  'Shomolu (Bariga)': [
    'Bariga Market',
    'Onipanu Market',
    'Bajulaiye Market',
    'Pedro Market'
  ],
  'Ajeromi-Ifelodun': [
    'Ajegunle Modern Market',
    'Boundary Market',
    'Tolu Market',
    'Araromi Market'
  ],
  'Ibeju-Lekki': [
    'Eleko Market',
    'Akodo Market',
    'Bogije Farmers Market',
    'Lakowe Market'
  ]
};

export interface VendorProfile {
  id: string;
  businessName: string;
  sellerType: SellerType;
  marketLocation: string;
  lga: LagosLGA;
  stallNumber: string;
  phoneNumber: string;
  rating: number;
  totalFulfilled: number;
  isVerified: boolean;
  avatarUrl: string;
}

export interface ProduceItem {
  id: string;
  vendorId: string;
  vendorName: string;
  marketLocation: string;
  lga: LagosLGA;
  title: string;
  category: ProduceCategory;
  unit: string;
  priceNGN: number;
  stockQty: number;
  freshness: FreshnessGrade;
  imageUrl: string;
  description: string;
  isAvailable: boolean;
  distanceKm?: number;
  isHyperlocalNearMe?: boolean;
}

export interface CartItem {
  produce: ProduceItem;
  quantity: number;
}

export interface Order {
  id: string;
  consumerName: string;
  consumerPhone: string;
  deliveryAddress: string;
  deliveryLGA: LagosLGA;
  vendorId: string;
  vendorName: string;
  pickupMarket: string;
  pickupLGA: LagosLGA;
  items: {
    title: string;
    unit: string;
    quantity: number;
    priceNGN: number;
  }[];
  subtotalNGN: number;
  deliveryFeeNGN: number;
  serviceFeeNGN: number;
  totalNGN: number;
  status: OrderStatus;
  paymentMethod: 'Paystack Card' | 'Bank Transfer' | 'USSD (*737#)';
  paymentReference: string;
  deliverySlot: string;
  isNearMeDiscounted: boolean;
  createdAt: string;
  riderName?: string;
  riderPhone?: string;
  riderVehicle?: string;
}

export interface MarketPriceInfo {
  id: string;
  commodity: string;
  category: string;
  unit: string;
  pricesByMarket: Record<string, number>;
  lowestMarket: string;
  highestMarket: string;
  avgPriceNGN: number;
  change24hPct: number;
}

export interface DispatchJob {
  id: string;
  orderId: string;
  riderName: string;
  riderPhone: string;
  vehicleType: 'Kwik Motorcycle' | 'Gokada Box Bike' | 'Max.ng Tricycle' | 'Farm Deck Van';
  pickupLocation: string;
  deliveryLocation: string;
  pickupLGA: LagosLGA;
  deliveryLGA: LagosLGA;
  distanceKm: number;
  status: OrderStatus;
  estimatedArrivalMinutes: number;
  currentStepIndex: number;
}

export interface AIRequiredIngredient {
  name: string;
  recommendedUnit: string;
  quantity: number;
  estimatedPriceNGN: number;
  category: string;
  matchedProduceId?: string;
}

export interface AIRecipeCalculation {
  dishName: string;
  servings: number;
  ingredients: AIRequiredIngredient[];
  totalEstimatedCostNGN: number;
  chefTips: string;
}

/* =========================================================
   DEMAND BOARD (RFQ) DATA MODELS
========================================================= */

export type DemandStatus = 'OPEN' | 'OFFER_RECEIVED' | 'ACCEPTED' | 'FULFILLED' | 'CLOSED';

export interface DemandRequest {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerType: 'Household' | 'Restaurant / Eatery' | 'Catering Company' | 'Cooperative';
  itemName: string;
  category: ProduceCategory;
  quantity: number;
  unit: string;
  maxTargetPriceNGN: number;
  locationLGA: LagosLGA;
  deliveryAddress: string;
  deadlineDate: string;
  notes: string;
  imageUrl?: string;
  status: DemandStatus;
  offersCount: number;
  createdAt: string;
  urgency: 'URGENT_TODAY' | 'THIS_WEEKEND' | 'FLEXIBLE';
}

export interface RequestOffer {
  id: string;
  requestId: string;
  vendorId: string;
  vendorName: string;
  vendorMarket: string;
  vendorPhone: string;
  vendorAvatar: string;
  proposedPriceNGN: number;
  availableQty: number;
  deliveryTimeline: string;
  notes: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

/* =========================================================
   IN-APP DIRECT CHAT DATA MODELS
========================================================= */

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'BUYER' | 'VENDOR';
  text: string;
  mediaUrl?: string;
  priceOfferNGN?: number;
  createdAt: string;
  isRead: boolean;
}

export interface ChatConversation {
  id: string;
  buyerId: string;
  buyerName: string;
  vendorId: string;
  vendorName: string;
  vendorMarket: string;
  vendorAvatar: string;
  vendorOnline: boolean;
  requestId?: string;
  produceId?: string;
  topicTitle: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: ChatMessage[];
}
