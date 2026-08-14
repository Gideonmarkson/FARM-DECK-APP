export interface PRDSection {
  id: string;
  title: string;
  content: string;
  badge?: string;
}

export const PRD_SECTIONS: PRDSection[] = [
  {
    id: 'sec-1-1',
    title: '1.1 Problem Statement',
    badge: 'Executive Summary',
    content: `In Lagos, Nigeria, small-scale farmers and local market vendors face severe market isolation. They rely heavily on foot traffic in physical hubs (such as Mile 12, Ketu, Oyingbo, Sangotedo, Ikorodu, Epe, and Badagry markets) and existing informal buyer networks. This limits sales volume, restricts revenue expansion, and leaves produce vulnerable to post-harvest spoilage. Simultaneously, urban consumers and households struggle with the inconvenience, time loss, price opacity, and physical strain of visiting chaotic local markets to procure fresh raw farm produce and food ingredients.`
  },
  {
    id: 'sec-1-2',
    title: '1.2 Proposed Solution',
    badge: 'Core Value Prop',
    content: `Farmdeck Hub is a digital two-sided marketplace connecting verified local farmers and market vendors across all parts of Lagos State directly with urban households and consumer buyers. Unlike generic food delivery platforms focused on prepared restaurant meals, Farmdeck Hub specializes exclusively in raw farm produce and bulk meal ingredients (e.g., tubers, fresh tomatoes, peppers, plantains, grains, vegetables, and palm oil). Farmdeck Hub streamlines produce discovery, price comparison, order fulfillment, payment processing, and last-mile logistics via third-party logistics (3PL) bike and van partners.`
  },
  {
    id: 'sec-1-3',
    title: '1.3 Strategic Differentiators',
    badge: 'Strategy',
    content: `1. Raw Ingredients Focus: Optimized for weight-based and standard local measurements (Paint Buckets, Derica, Tubers, Bags) rather than single-portion restaurant dishes.
2. Non-Disruptive Seller Proposition: Positioned strictly as an additional digital sales channel to complement existing physical market sales—not a replacement.
3. Lagos Statewide Price Intelligence: Real-time price indexing across major Lagos agricultural hubs (Mile 12, Oyingbo, Ketu, Epe, Ikorodu, Badagry, Agege) to ensure price transparency.
4. Third-Party Logistics (3PL) Integration: Fleet-agnostic last-mile dispatch routing using native Lagos delivery partners (Gokada, Kwik, Max.ng) for heavy produce handling.
5. Hyperlocal "Near Me" Proximity Sourcing: Connects smallholder farmers and local market vendors directly with buyers located within their immediate neighborhood or Local Government Area (LGA, e.g. Kosofe, Yaba, Eti-Osa, Ikorodu, Badagry). Reduces last-mile transit distance (< 3km) and slashes delivery fees from standard ₦1,800 citywide rates down to ₦350–₦500 local dispatch fees.`
  },
  {
    id: 'sec-2-1',
    title: '2.1 User Personas',
    badge: 'User Research',
    content: `• Primary Persona A: Mama Nkechi (Local Market Trader / Farmer): Operates a stall at Mile 12 Market selling tubers and peppers. Needs an easy digital interface to post daily produce stocks and price adjustments without complex administrative overhead.
• Primary Persona B: Funke Adebayo (Working Professional / Household Head): Lives in Lekki Phase 1, works 50 hours a week. Wants fresh local produce delivered directly to her home on Saturday mornings without wading through market crowds.
• Secondary Persona C: Tunde (3PL Dispatch Rider): Last-mile delivery rider operating a box motor-tricycle or motorcycle across Lagos transit corridors.`
  },
  {
    id: 'sec-2-2',
    title: '2.2 Acceptance Criteria (Gherkin User Stories)',
    badge: 'User Stories',
    content: `Story 1: Consumer Produce Discovery & Price Comparison
Given I am an authenticated consumer located in "Lekki Phase 1"
When I search for "Yam" in the product search bar
Then I should see a list of verified sellers within range
And each listing must display unit price in NGN (₦), seller rating, market origin, and freshness grade
When I select "Sort by Price: Low to High"
Then the list reorders instantly by price per tuber

Story 2: Vendor Fast Produce Listing & Stock Adjustment
Given I am logged in as a verified vendor on the Vendor Portal
When I click "Add New Stock" and select category "Spices & Peppers"
And I enter Item Name "Fresh Roma Tomatoes", Unit "Paint Bucket (4L)", Price "₦4,500", and Quantity "15"
And I upload a real-time photo of the tomato basket
When I click "Publish Listing"
Then the listing becomes active immediately on the consumer marketplace feed

Story 3: Order Placement & Lagos Last-Mile Dispatch
Given I have added 2 Paint Buckets of Tomatoes and 5 Tubers of Yam to my cart
When I proceed to checkout and select delivery address "Yaba, Lagos"
And I choose delivery slot "Saturday 08:00 AM - 10:00 AM"
And I complete payment via Paystack Bank Transfer
Then an order record is created with status "Placed"
And the seller receives an immediate SMS/In-App order alert with fulfillment timer

Story 4: Hyperlocal "Near Me" Proximity Sourcing & Fee Reduction
Given I am a consumer located in "Kosofe LGA, Lagos"
When I toggle the "Near Me (Hyperlocal)" filter with radius set to "< 3 km"
Then the marketplace feed re-indexes to prioritize vendors in Kosofe LGA (Ketu & Mile 12 stalls)
And each produce card displays a proximity badge ("📍 0.8 km near you • Reduced Delivery ₦400")
And when I proceed to checkout, the last-mile delivery fee automatically calculates at the discounted ₦400 neighborhood rate`
  },
  {
    id: 'sec-3-1',
    title: '3.0 System Architecture & Tech Stack',
    badge: 'Architecture',
    content: `• Frontend: React 19 + TypeScript + Vite + Tailwind CSS v4 + Motion + Lucide Icons.
• Backend Runtime: Node.js v22 + Express framework + TypeScript.
• AI Intelligence Layer: Server-side Google GenAI SDK (@google/genai) utilizing gemini-2.5-flash for automated ingredient quantity calculations, price estimation, and recipe meal planning.
• Database & Persistence: PostgreSQL / Firestore with strict access rules.
• Payment Gateway: Paystack / Flutterwave integration supporting NGN Bank Transfers, USSD (*737#, *894#), and Card payments.
• Push & SMS Alerts: Termii API for high-deliverability SMS alerts to non-smartphone market traders in Lagos.`
  },
  {
    id: 'sec-4-1',
    title: '4.0 Database Schema (PostgreSQL)',
    badge: 'Data Model',
    content: `CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE,
    phone_number VARCHAR(20) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    role user_role NOT NULL DEFAULT 'CONSUMER',
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vendor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(200) NOT NULL,
    type seller_type NOT NULL DEFAULT 'MARKET_TRADER',
    market_location VARCHAR(200) NOT NULL,
    stall_number VARCHAR(50),
    bank_account_number VARCHAR(20),
    bank_code VARCHAR(10),
    rating NUMERIC(3,2) DEFAULT 5.00,
    total_fulfilled INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE produce_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price_ngn NUMERIC(10,2) NOT NULL,
    stock_qty INT NOT NULL DEFAULT 0,
    freshness freshness_grade DEFAULT 'GRADE_A_TODAY',
    image_url TEXT,
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`
  }
];
