# Product Requirements Document (PRD)
**Project:** Cafe South Central - Web App v1  
**Version:** 3.0 (Production-Ready - Corrected)  
**Status:** Ready for Development  
**Last Updated:** February 1, 2026  
**Reviewed By:** Senior Full-Stack Architect

---

## Document Control & Approval

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | _____________ | _________ | ______ |
| Tech Lead | _____________ | _________ | ______ |
| Security Lead | _____________ | _________ | ______ |
| QA Lead | _____________ | _________ | ______ |
| Legal/Compliance | _____________ | _________ | ______ |

**Change Log:**
- v3.0 (Feb 1, 2026): Complete technical corrections, security hardening, compliance features
- v2.0 (Feb 1, 2026): Technical specifications added (incomplete)
- v1.0 (Jan 31, 2026): Initial design and functional requirements

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Design Philosophy](#2-product-vision--design-philosophy)
3. [Functional Requirements](#3-functional-requirements)
4. [Technical Architecture](#4-technical-architecture)
5. [User Authentication System](#5-user-authentication-system)
6. [Payment Processing](#6-payment-processing)
7. [Subscription Business Rules](#7-subscription-business-rules)
8. [Inventory Management](#8-inventory-management)
9. [Security & Compliance](#9-security--compliance)
10. [Error Handling & Resilience](#10-error-handling--resilience)
11. [Performance & Scalability](#11-performance--scalability)
12. [Database Schema](#12-database-schema)
13. [API Specifications](#13-api-specifications)
14. [Testing & Quality Assurance](#14-testing--quality-assurance)
15. [Monitoring & Observability](#15-monitoring--observability)
16. [Deployment & Infrastructure](#16-deployment--infrastructure)
17. [Future Roadmap](#17-future-roadmap)

---

## 1. Executive Summary

**Cafe South Central Web App** is a Progressive Web Application (PWA) designed for high-traffic food service operations, serving two distinct customer segments:

1. **Pay-per-order customers** - Casual diners seeking quick, one-time orders
2. **Subscription-based members** - Regular customers (students, office workers) with meal plans

### 1.1 Core Value Proposition

**For Customers:**
- Zero app downloads (PWA installable from browser)
- Sub-second ordering experience (optimistic UI)
- Flexible subscription plans with transparent quota management
- Real-time order tracking with QR-based contactless pickup
- Premium "Warm Luxury" digital experience

**For Operations:**
- Automated inventory control with race-condition prevention
- Real-time kitchen display system (KDS)
- Data-driven analytics and forecasting
- 70% reduction in queue wait times
- 90% reduction in order errors

**For Business:**
- Predictable revenue from subscriptions
- Reduced transaction costs (₹12/order vs ₹25/order for cash handling)
- Customer lifetime value increase (3x with subscriptions)
- Data-driven menu optimization

### 1.2 Success Metrics (6-Month Targets)

| Metric | Current (Manual) | Target (With App) | Measurement |
|--------|------------------|-------------------|-------------|
| Average Order Time |10 minutes | 2 minutes | Time from order to kitchen |
| Queue Wait Time | 15 minutes | 4 minutes | Customer time in queue |
| Order Error Rate | 12% | <1% | Incorrect orders / total |
| Subscription Retention | N/A | 85% | Active after 3 months |
| Daily Revenue | ₹45,000 | ₹80,000 | Including subscriptions |
| Customer Satisfaction | 3.2/5 | 4.5/5 | NPS score |

### 1.3 Out of Scope (Phase 1)

- Table reservations
- Dine-in menu (only takeaway/pickup)
- Delivery/logistics integration
- Third-party aggregator integration (Swiggy, Zomato)
- Loyalty points program (covered by subscriptions)
- Multi-location support

---

## 2. Product Vision & Design Philosophy

### 2.1 Aesthetics: "Warm Luxury & Modern Speed"

The design language bridges traditional hospitality with cutting-edge technology, creating a premium experience for a value-conscious audience.

**Warm Luxury:**
- Evokes comfort, tradition, and culinary excellence
- Deep earth tones create an inviting, premium ambiance
- Rich food photography with professional styling
- Elegant serif typography for emotional connection

**Modern Speed:**
- Instant UI feedback (optimistic updates)
- Skeleton screens during loading
- Smooth 60fps animations (Framer Motion)
- App-like responsiveness (no page refreshes)

### 2.2 Design System

#### Typography

```css
/* Primary Font Stack */
font-family: 'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Display Font (Headings, Emotional Content) */
font-family: 'Californian FB', 'Playfair Display', serif;

/* Monospace (Order IDs, Prices) */
font-family: 'JetBrains Mono', 'Fira Code', monospace;
```

**Type Scale (Tailwind Classes):**
- `text-xs` (12px): Captions, timestamps
- `text-sm` (14px): Body text, descriptions
- `text-base` (16px): Default UI text
- `text-lg` (18px): Subheadings
- `text-xl` (20px): Card titles
- `text-2xl` (24px): Section headers
- `text-4xl` (36px): Hero headings

#### Color Palette

```css
/* Primary Colors */
:root {
  --primary-brand: #005001;     /* Dark Green - Brand, primary actions */
  --secondary-brand: #5C3A1A;   /* Coconut Brown - Subheadings, secondary actions */
  --accent-gold: #F7E231;       /* Bright Gold/Yellow - Buttons text, critical highlights */
  --page-bg: #E2E9E0;           /* Light Greenish Grey - Body background */
  --card-bg: #FAFAFA;           /* Off-white - Card backgrounds */
  
  /* Semantic Colors */
  --success: #10B981;           /* Order confirmed, in stock */
  --warning: #F59E0B;           /* Low stock, warnings */
  --error: #EF4444;             /* Sold out, errors */
  --info: #3B82F6;              /* Informational */
  
  /* Order Status Colors */
  --status-new: #10B981;        /* Received */
  --status-preparing: #F59E0B;  /* In kitchen */
  --status-ready: #3B82F6;      /* Ready for pickup */
  --status-completed: #6B7280;  /* Picked up */
  --status-cancelled: #EF4444;  /* Cancelled */
  
  /* Neutral Grays */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-200: #E5E7EB;
  --gray-300: #D1D5DB;
  --gray-400: #9CA3AF;
  --gray-500: #6B7280;
  --gray-600: #4B5563;
  --gray-700: #374151;
  --gray-800: #1F2937;
  --gray-900: #111827;
}
```

#### Component Library

**Buttons:**
```css
/* Primary */
.btn-primary {
  @apply bg-[#005001] text-[#F7E231] px-6 py-3 rounded-full font-bold;
  @apply hover:bg-opacity-90 transition-all duration-200;
  @apply active:scale-95 shadow-lg hover:shadow-xl;
  font-family: 'Manrope', sans-serif;
}

/* Secondary */
.btn-secondary {
  @apply bg-[#5C3A1A] text-white px-6 py-3 rounded-full font-bold;
  @apply hover:opacity-90 transition-all duration-200;
}

/* Ghost */
.btn-ghost {
  @apply text-[#4a3b32] px-4 py-2 rounded-lg font-bold;
  @apply hover:bg-white/50 transition-colors duration-150;
}
```

**Cards:**
```css
.card {
  @apply bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6;
  @apply border border-white/20;
  @apply transition-all duration-200;
  @apply hover:shadow-xl hover:-translate-y-1;
}

.card-interactive {
  @apply card cursor-pointer;
  @apply active:scale-98;
}
```

**Badges:**
```css
.badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium;
}

.badge-fresh {
  @apply bg-[#e6f0e6] border border-[#1a2e1a] text-[#002200];
}

.badge-success {
  @apply badge bg-green-100 text-green-800;
}

.badge-warning {
  @apply badge bg-yellow-100 text-yellow-800;
}

.badge-error {
  @apply badge bg-red-100 text-red-800;
}
```

#### Visual Language

**Spacing (8px Grid):**
- Micro: `space-1` (4px)
- Small: `space-2` (8px)
- Medium: `space-4` (16px)
- Large: `space-6` (24px)
- X-Large: `space-8` (32px)

**Shadows:**
```css
/* Elevation System */
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1); }
.shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
.shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1); }
```

**Animations:**
```css
/* Micro-interactions (200ms) */
.transition-fast { transition-duration: 200ms; }

/* Standard interactions (300ms) */
.transition-normal { transition-duration: 300ms; }

/* Slow reveals (500ms) */
.transition-slow { transition-duration: 500ms; }
```

---

## 3. Functional Requirements

### 3.1 User Roles & Permissions

| Role | Capabilities | Access Level |
|------|-------------|--------------|
| Guest | Browse menu, view prices | Public |
| Customer | Place orders, manage subscriptions, view history | Authenticated |
| Manager / Staff | View order queue, update status, inventory & analytics | Admin Portal (Full Operations) |
| Super Admin | All manager + user management + financial reports | Admin Portal (Full System) |

### 3.2 Core User Journeys

#### 3.2.1 First-Time Customer (Pay-per-order)

```
1. Land on homepage → See hero, bestsellers, "How It Works"
2. Click "Order Now" → Prompt to login
3. Enter name + phone → Receive OTP
4. Enter OTP → Session created
5. Browse menu → Filter by category/preferences
6. Add items to cart → See real-time total
7. Review cart → Edit quantities, remove items
8. Select pickup time → ASAP or future slot (30-min intervals)
9. Choose payment → Cash (max ₹500) or UPI
10. Place order → Razorpay modal (if UPI)
11. Payment success → Order confirmation screen
12. Receive order ID + QR code → Save to device
13. Track status → Real-time updates (Preparing → Ready)
14. Go to counter → Scan QR code
15. Receive food → Order marked completed
```

#### 3.2.2 Subscription Member (Recurring Customer)

```
1. Login → See subscription dashboard
2. Check daily quota → "2 meals used, 1 remaining today"
3. Browse eligible items → Only items covered by plan
4. Add to cart → Auto-deducted from quota (no payment)
5. Schedule pickup → Same as pay-per-order
6. Place order → Instant confirmation (no payment step)
7. Pickup → Same QR flow
```

#### 3.2.3 Admin/Kitchen (Order Fulfillment)

```
1. Login to admin portal → See live order dashboard
2. New order arrives → Hear audio chime
3. View order card → Customer name, items, time, special instructions
4. Mark "Preparing" → Starts kitchen timer
5. Food ready → Mark "Ready for Pickup"
6. Customer arrives → Scan QR code (mobile scanner)
7. System validates → Mark "Completed"
8. End of shift → Download daily sales report (CSV)
```

### 3.3 Feature Specifications

#### 3.3.1 Menu Browsing

**Requirements:**
- Display all available items with photos, names, prices
- Categories: South Indian, Snacks, Beverages, Desserts
- Filters: Vegetarian, Spice Level, Price Range
- Search: Fuzzy matching on item names (e.g., "dosa" matches "Masala Dosa")
- Sort: Price (Low/High), Popularity, Alphabetical
- Stock indicators:
  - "Available" (green badge)
  - "Low Stock" (yellow badge, <10 remaining)
  - "Sold Out" (red badge, disabled, grayed out)

**UI Components:**
- Grid view (desktop 4columns, tablet 3, mobile 2)
- Card per item showing:
  - High-quality food photo (16:9 aspect ratio)
  - Item name (Californian FB font)
  - Description (1-2 lines, truncated)
  - Price (₹ symbol, monospace font)
  - Add to cart button
  - Veg/(green dot)

**Performance:**
- Initial load: <150ms (cached menu data)
- Search response: <50ms (client-side filtering)
- Image lazy loading (below fold)

#### 3.3.2 Cart Management

**Features:**
- Persistent cart (survives page refresh, stored in localStorage)
- Slide-in drawer from right side
- Real-time total calculation (including taxes, if applicable)
- Quantity adjustment (- / + buttons, max 10 per item)
- Item removal (swipe-to-delete on mobile, X button on desktop)
- Empty cart warning before navigating away
- Promo code application (future: currently hardcoded coupons)

**Validation:**
- Check stock availability on "Proceed to Checkout"
- Show error if item sold out since adding to cart
- Offer to remove sold-out items or return to menu

**Cart State Management:**
```typescript
interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  maxQuantity: number; // Current stock
  isSubscriptionEligible: boolean;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  lastUpdated: Date;
}
```

#### 3.3.3 Checkout Flow

**Steps:**

1. **Cart Review:**
   - Display all items with quantities
   - Show subtotal
   - Option to add special instructions (max 200 chars)

2. **Pickup Time Selection:**
   - "ASAP" (default): Ready in 15-20 minutes
   - Future slots: 30-minute intervals, up to 3 hours ahead
   - Example: 12:30 PM, 1:00 PM, 1:30 PM, 2:00 PM
   - Disable past times dynamically
   - Show estimated ready time on selection

3. **Payment Method (Pay-per-order only):**
   - Cash on Delivery: Max ₹500 (fraud prevention)
   - UPI/Card: Razorpay integration
   - Subscription members skip this step

4. **Order Confirmation:**
   - Display order summary
   - "Place Order" button (primary, disabled until all steps complete)
   - Loading state during payment processing

**Validation:**
- All items still in stock
- Pickup time is valid (not in past, within operating hours)
- Payment method selected (if applicable)
- Subscription quota available (if subscription order)

#### 3.3.4 Order Tracking

**Statuses:**

| Status | Description | Customer View | Kitchen View |
|--------|-------------|---------------|--------------|
| RECEIVED | Order placed, payment confirmed | "We've received your order" | New order (green) |
| PREPARING | Kitchen is cooking | "Your food is being prepared" | In progress (yellow) |
| READY | Ready for pickup | "Your order is ready! Please proceed to counter" | Ready (blue) |
| COMPLETED | Customer picked up | "Enjoy your meal!" | Archived |
| CANCELLED | Order cancelled | "Order cancelled. Refund initiated" | Archived |

**Real-Time Updates:**
- WebSocket connection (Pusher/Ably) for instant status changes
- Fallback: Polling every 10 seconds
- Push notification on status change (if PWA installed)
- Email notification on order confirmation

**Order History:**
- Infinite scroll list of past orders
- Each order shows:
  - Order ID (e.g., "ORD-20260201-1234")
  - Date/time
  - Items (collapsed by default, expandable)
  - Total amount
  - Status badge
  - Reorder button
  - Receipt download (PDF)

**QR Code Generation:**
```typescript
interface OrderQRPayload {
  orderId: string;
  userId: string;
  timestamp: number;
  signature: string; // HMAC-SHA256(orderId + userId + timestamp, SECRET_KEY)
}

// QR code contains:
// {"oid":"abc123","uid":"xyz789","ts":1738395600,"sig":"abc..."}
```

#### 3.3.5 Subscription Dashboard

**Subscription Quota Display:**
- Visual "Meal Tokens" that grey out as they are used
- Provide clear, at-a-glance usage tracking.


---

## 4. Technical Architecture

### 4.1 Tech Stack

**Frontend:**
- **Framework:** Next.js 14.2+ (App Router)
- **Language:** TypeScript 5.3+ (Strict Mode)
- **Styling:** Tailwind CSS 3.4+
- **State Management:** 
  - React Context (global user state)
  - TanStack Query v5 (server state, caching)
  - Zustand (local UI state - cart, modals)
- **Animation:** Framer Motion 11+
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **QR Codes:** qrcode.react
- **PWA:** next-pwa

**Backend:**
- **Runtime:** Next.js API Routes (Node.js 20+)
- **Database:** PostgreSQL 16 (Supabase/Neon)
- **ORM:** Prisma 5.8+
- **Caching:** Redis (Upstash or self-hosted)
- **File Storage:** AWS S3 or Supabase Storage
- **Authentication:** Custom (OTP-based)
- **Payment Gateway:** Razorpay
- **SMS:** Msg91 or 2Factor (Indian Gateway), AWS SNS (fallback)
- **Email:** Resend or SendGrid

**DevOps:**
**DevOps:**
- **Hosting:** Vercel (Free Tier for Launch → Pro when scaling)
- **Database:** Supabase (Free Tier for Launch → Pro when scaling)
- **Monitoring:** Sentry (errors), Vercel Analytics (Free)
- **Logging:** Better Stack (formerly Logtail)
- **CI/CD:** GitHub Actions
- **Testing:** Jest, Playwright, K6

### 4.2 System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE CDN                        │
│                    (Static Assets, Images)                   │
└───────────────────────────┬──────────────────────────────────┘
                            │
┌───────────────────────────▼──────────────────────────────────┐
│                      VERCEL (Frontend)                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │         Next.js 14 (App Router + API Routes)        │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │    │
│  │  │ Landing Page │  │  Menu/Cart   │  │  Orders   │ │    │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │    │
│  │  │  Admin Panel │  │ Subscription │  │   Auth    │ │    │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │    │
│  └─────────────────────────────────────────────────────┘    │
└──────────┬──────────┬──────────┬──────────┬───────────┬─────┘
           │          │          │          │           │
    ┌──────▼───┐ ┌───▼────┐ ┌───▼────┐ ┌───▼─────┐ ┌──▼────┐
    │PostgreSQL│ │ Redis  │ │ Razorpay│ │ Msg91   │ │ AWS S3│
    │(Supabase)│ │(Upstash)│ │         │ │         │ │       │
    └──────────┘ └────────┘ └─────────┘ └─────────┘ └───────┘
         │            │           │           │           │
    ┌────▼────┐  ┌───▼────┐ ┌────▼─────┐ ┌──▼──────┐   │
    │ Prisma  │  │ Cache  │ │ Webhooks │ │  OTP    │   │
    │  ORM    │  │ Menu   │ │ Payments │ │  SMS    │   │
    └─────────┘  │ Orders │ └──────────┘ └─────────┘   │
                 └────────┘                              │
                                                    ┌────▼────┐
                                                    │ Product │
                                                    │ Images  │
                                                    └─────────┘
```

### 4.3 Data Flow (Order Creation)

```
[Customer] → [Frontend]
    ↓
    Add items to cart (Zustand local state)
    ↓
    Click "Place Order"
    ↓
    [POST /api/orders/create]
    ↓
    Validate cart items (check stock)
    ↓
    Create order in DB (status: PAYMENT_PENDING)
    ↓
    Reserve inventory (atomic update)
    ↓
    If payment method = UPI:
        ↓
        Create Razorpay order
        ↓
        Return Razorpay order ID to frontend
        ↓
        [Frontend] Open Razorpay modal
        ↓
        User completes payment
        ↓
        Razorpay sends webhook to [POST /api/webhooks/razorpay]
        ↓
        Verify signature, check replay attacks
        ↓
        Update order status to CONFIRMED
        ↓
        Send confirmation SMS/email
        ↓
    Else (Cash):
        ↓
        Update order status to CONFIRMED
        ↓
    Return order confirmation to frontend
    ↓
    [Frontend] Show success screen with QR code
```

### 4.4 Folder Structure

```
cafe-south-central/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── verify-otp/
│   │       └── page.tsx
│   ├── (customer)/
│   │   ├── menu/
│   │   │   └── page.tsx
│   │   ├── cart/
│   │   │   └── page.tsx
│   │   ├── checkout/
│   │   │   └── page.tsx
│   │   ├── orders/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── subscription/
│   │       ├── page.tsx
│   │       └── plans/
│   │           └── page.tsx
│   ├── (admin)/
│   │   └── admin/
│   │       ├── dashboard/
│   │       │   └── page.tsx
│   │       ├── orders/
│   │       │   └── page.tsx
│   │       ├── inventory/
│   │       │   └── page.tsx
│   │       ├── analytics/
│   │       │   └── page.tsx
│   │       └── scanner/
│   │           └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   ├── send-otp/
│   │   │   │   └── route.ts
│   │   │   ├── verify-otp/
│   │   │   │   └── route.ts
│   │   │   └── logout/
│   │   │       └── route.ts
│   │   ├── menu/
│   │   │   └── route.ts
│   │   ├── cart/
│   │   │   ├── add/
│   │   │   │   └── route.ts
│   │   │   └── remove/
│   │   │       └── route.ts
│   │   ├── orders/
│   │   │   ├── create/
│   │   │   │   └── route.ts
│   │   │   ├── [id]/
│   │   │   │   └── route.ts
│   │   │   └── cancel/
│   │   │       └── route.ts
│   │   ├── subscription/
│   │   │   ├── subscribe/
│   │   │   │   └── route.ts
│   │   │   └── cancel/
│   │   │       └── route.ts
│   │   ├── webhooks/
│   │   │   └── razorpay/
│   │   │       └── route.ts
│   │   └── admin/
│   │       ├── inventory/
│   │       │   └── route.ts
│   │       └── analytics/
│   │           └── route.ts
│   ├── layout.tsx
│   └── page.tsx (Homepage)
├── components/
│   ├── ui/ (shadcn components)
│   ├── menu/
│   ├── cart/
│   ├── orders/
│   └── admin/
├── lib/
│   ├── prisma.ts
│   ├── redis.ts
│   ├── razorpay.ts
│   ├── sms.ts (Msg91/2Factor)
│   └── utils.ts
├── prisma/
│   └── schema.prisma
├── public/
│   ├── images/
│   └── icons/
├── styles/
│   └── globals.css
├── types/
│   └── index.ts
├── .env.local
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. User Authentication System

### 5.1 Customer Authentication (Passwordless)

**Method:** Phone Number + OTP

**Flow:**

1. **Login Screen:**
   - Input: Name (2-50 chars, letters/spaces only)
   - Input: Phone (10 digits, Indian format: starts with 6/7/8/9)
   - Submit button (primary)
   - "Smiley" eye-tracking animation (Framer Motion)

2. **OTP Generation:**
   - 6-digit random number (100000-999999)
   - Hash with bcrypt (cost factor 10)
   - Store in Redis with 5-minute TTL
   - Key: `otp:{phone_number}`
   - Value: `{ hashedOTP, attempts: 0, createdAt, lockedUntil? }`

3. **OTP Delivery:**
   - **Provider:** Msg91 / 2Factor (Indian SMS Gateway)
   - **Fallback:** AWS SNS
   - **DLT Compliance:** Registered templates (e.g., "Your OTP is 123456 - CAFE SC")
   - **Cost:** ~₹0.20 per SMS (vs ₹7.00 with Twilio)
   - **Rate limit:** Max 3 SMS per phone number per 5 minutes

4. **OTP Verification:**
   - Input: 6-digit OTP
   - Compare hash with stored value
   - On success:
     - Create session token (32-byte random hex)
     - Store in Redis: `session:{token}` → `{ userId, createdAt, expiresAt }`
     - Set HTTP-only cookie: `session_token` (7-day expiry)
     - Delete OTP from Redis
   - On failure:
     - Increment attempts counter
     - If attempts >= 3: Lock for 15 minutes
     - Show error: "Invalid OTP. X attempts remaining"

5. **Session Management:**
   - Access token: JWT (15-minute expiry)
   - Refresh token: Stored in Redis (7-day expiry)
   - Silent refresh: At 12-minute mark
   - Logout: Delete session from Redis, clear cookie

**Security Measures:**

- OTP hashing (bcrypt, never store plaintext)
- Rate limiting (3 OTP requests per 5 minutes per phone)
- Account locking (after 3 failed attempts, 15-minute lock)
- IP-based anomaly detection (flag if >5 phones from same IP in 1 hour)
- Phone number validation (regex: `^[6-9]\d{9}$`)
- SMS provider fallback (Msg91 → AWS SNS)

**Code Example:**

```typescript
// Send OTP
export async function sendOTP(phone: string): Promise<void> {
  // 1. Validate phone
  if (!/^[6-9]\d{9}$/.test(phone)) {
    throw new Error('Invalid phone number');
  }
  
  // 2. Check rate limit
  const rateLimitKey = `ratelimit:otp:${phone}`;
  const requestCount = await redis.incr(rateLimitKey);
  if (requestCount === 1) {
    await redis.expire(rateLimitKey, 300); // 5 minutes
  }
  if (requestCount > 3) {
    throw new Error('Too many requests. Try again in 5 minutes.');
  }
  
  // 3. Check if already locked
  const otpKey = `otp:${phone}`;
  const existing = await redis.get(otpKey);
  if (existing) {
    const record = JSON.parse(existing);
    if (record.lockedUntil && new Date(record.lockedUntil) > new Date()) {
      const remainingTime = Math.ceil((new Date(record.lockedUntil).getTime() - Date.now()) / 60000);
      throw new Error(`Account locked. Try again in ${remainingTime} minutes.`);
    }
  }
  
  // 4. Generate OTP
  const otp = crypto.randomInt(100000, 999999).toString();
  const hashedOTP = await bcrypt.hash(otp, 10);
  
  // 5. Store in Redis
  const record = {
    hashedOTP,
    attempts: 0,
    createdAt: new Date().toISOString()
  };
  await redis.setex(otpKey, 300, JSON.stringify(record));
  
  // 6. Send SMS (Msg91)
  try {
    await msg91Client.send({
      mobile: `91${phone}`,
      template_id: process.env.MSG91_OTP_TEMPLATE_ID,
      variables: { otp: otp }
    });
  } catch (smsError) {
    // Fallback to AWS SNS
    await snsClient.publish({
      PhoneNumber: `+91${phone}`,
      Message: `Your Cafe South Central OTP is ${otp}. Valid for 5 minutes.`
    });
  }
}

// Verify OTP
export async function verifyOTP(phone: string, otp: string): Promise<string> {
  const otpKey = `otp:${phone}`;
  const existing = await redis.get(otpKey);
  
  if (!existing) {
    throw new Error('OTP expired or not found');
  }
  
  const record = JSON.parse(existing);
  
  // Check lock
  if (record.lockedUntil && new Date(record.lockedUntil) > new Date()) {
    throw new Error('Account locked. Too many failed attempts.');
  }
  
  // Verify OTP
  const isValid = await bcrypt.compare(otp, record.hashedOTP);
  
  if (!isValid) {
    // Increment attempts
    record.attempts += 1;
    if (record.attempts >= 3) {
      record.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    }
    await redis.setex(otpKey, 300, JSON.stringify(record));
    
    const remaining = 3 - record.attempts;
    throw new Error(`Invalid OTP. ${remaining} attempts remaining.`);
  }
  
  // Success - create session
  const sessionToken = crypto.randomBytes(32).toString('hex');
  
  // Get or create user
  let user = await prisma.user.findUnique({ where: { phone } });
  if (!user) {
    user = await prisma.user.create({
      data: { phone, role: 'CUSTOMER' }
    });
  }
  
  // Store session in Redis
  const sessionData = {
    userId: user.id,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  };
  await redis.setex(`session:${sessionToken}`, 604800, JSON.stringify(sessionData));
  
  // Delete OTP
  await redis.del(otpKey);
  
  return sessionToken;
}
```

### 5.2 Admin Authentication

**Method:** Username + Password + TOTP (2FA)

**Requirements:**
- Password: Min 12 chars, must include uppercase, lowercase, number, special char
- Hashing: Argon2id (NOT bcrypt for admin accounts)
- 2FA: Mandatory Google Authenticator (TOTP)
- Session timeout: 30 minutes idle, 8 hours absolute
- IP whitelisting: Optional (for production environments)

**Flow:**

1. **Admin Registration (One-time setup):**
   - Create admin account via CLI script
   - Generate TOTP secret (32-char base32)
   - Encrypt secret with AES-256-GCM (key from env)
   - Store in database
   - Display QR code for Google Authenticator

2. **Admin Login:**
   - Input: Username, Password, 6-digit TOTP code
   - Verify password (Argon2)
   - Verify TOTP (allow ±30 seconds clock drift)
   - Create session with strict timeout
   - Log login to audit table

3. **Session Management:**
   - Idle timeout: Reset on every request (30 minutes)
   - Absolute timeout: 8 hours from login
   - Concurrent session limit: 1 (new login invalidates old session)

**Code Example:**

```typescript
// Admin login
export async function adminLogin(
  username: string, 
  password: string, 
  totpCode: string
): Promise<string> {
  // 1. Find admin
  const admin = await prisma.user.findUnique({
    where: { username, role: { in: ['SUPER_ADMIN', 'MANAGER', 'KITCHEN_STAFF'] } }
  });
  
  if (!admin) {
    throw new Error('Invalid credentials');
  }
  
  // 2. Verify password (Argon2)
  const isValidPassword = await argon2.verify(admin.password_hash, password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }
  
  // 3. Decrypt TOTP secret
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    Buffer.from(process.env.ENCRYPTION_KEY, 'hex'),
    Buffer.from(admin.totp_iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(admin.totp_tag, 'hex'));
  let decryptedSecret = decipher.update(admin.totp_secret_encrypted, 'hex', 'utf8');
  decryptedSecret += decipher.final('utf8');
  
  // 4. Verify TOTP
  const isValidTOTP = speakeasy.totp.verify({
    secret: decryptedSecret,
    encoding: 'base32',
    token: totpCode,
    window: 1 // ±30 seconds
  });
  
  if (!isValidTOTP) {
    throw new Error('Invalid 2FA code');
  }
  
  // 5. Invalidate existing sessions
  await prisma.adminSession.deleteMany({ where: { admin_id: admin.id } });
  
  // 6. Create new session
  const sessionToken = crypto.randomBytes(32).toString('hex');
  await prisma.adminSession.create({
    data: {
      admin_id: admin.id,
      session_token: sessionToken,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      created_at: new Date(),
      last_activity: new Date(),
      expires_at: new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours
    }
  });
  
  // 7. Audit log
  await prisma.auditLog.create({
    data: {
      admin_id: admin.id,
      action: 'ADMIN_LOGIN',
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      created_at: new Date()
    }
  });
  
  return sessionToken;
}

// Session validation middleware
export async function validateAdminSession(sessionToken: string): Promise<User> {
  const session = await prisma.adminSession.findUnique({
    where: { session_token: sessionToken },
    include: { admin: true }
  });
  
  if (!session) {
    throw new Error('Invalid session');
  }
  
  // Check idle timeout (30 minutes)
  const idleTime = Date.now() - session.last_activity.getTime();
  if (idleTime > 30 * 60 * 1000) {
    await prisma.adminSession.delete({ where: { id: session.id } });
    throw new Error('Session expired due to inactivity');
  }
  
  // Check absolute timeout (8 hours)
  if (new Date() > session.expires_at) {
    await prisma.adminSession.delete({ where: { id: session.id } });
    throw new Error('Session expired');
  }
  
  // Update last activity
  await prisma.adminSession.update({
    where: { id: session.id },
    data: { last_activity: new Date() }
  });
  
  return session.admin;
}
```

---

## 6. Payment Processing

### 6.1 Supported Payment Methods

| Method | Max Amount | Processing Time | Fees | Use Case |
|--------|-----------|-----------------|------|----------|
| Cash on Delivery | ₹500 | Instant | ₹0 | Small orders, low-value |
| UPI | Unlimited | 2-5 seconds | 1.5% | Primary method |
| Cards (Debit/Credit) | Unlimited | 3-10 seconds | 2% | Backup |
| Subscription | N/A | Instant | ₹0 (quota deduction) | Members only |

### 6.2 Razorpay Integration

**Setup:**
```typescript
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
```

**Payment Flow (UPI/Cards):**

```typescript
// Step 1: Create Razorpay order (backend)
export async function createRazorpayOrder(amount: number, orderId: string) {
  const options = {
    amount: amount * 100, // Paise (₹100 = 10000 paise)
    currency: 'INR',
    receipt: orderId,
    notes: {
      cafe_order_id: orderId
    }
  };
  
  const razorpayOrder = await razorpay.orders.create(options);
  return razorpayOrder;
}

// Step 2: Open Razorpay modal (frontend)
const options = {
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: razorpayOrder.amount,
  currency: 'INR',
  name: 'Cafe South Central',
  description: `Order ${orderId}`,
  order_id: razorpayOrder.id,
  handler: function (response) {
    // Payment successful
    verifyPayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature);
  },
  prefill: {
    name: user.name,
    contact: user.phone
  },
  theme: {
    color: '#5C3A1A' // Deep brown
  }
};

const razorpayInstance = new window.Razorpay(options);
razorpayInstance.open();

// Step 3: Verify payment signature (backend)
export async function verifyPaymentSignature(
  razorpayPaymentId: string,
  razorpayOrderId: string,
  razorpaySignature: string
): Promise<boolean> {
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');
  
  return expectedSignature === razorpaySignature;
}
```

### 6.3 Webhook Handling (CRITICAL)

**Endpoint:** `POST /api/webhooks/razorpay`

**Security Checklist:**
- ✅ IP whitelist (Razorpay IPs only)
- ✅ Signature verification (HMAC-SHA256)
- ✅ Timestamp validation (max 5 minutes old)
- ✅ Replay attack prevention (idempotency keys)
- ✅ Retry handling (idempotent processing)

**Implementation:**

```typescript
const RAZORPAY_WEBHOOK_IPS = [
  '43.204.126.64/27',
  '3.109.122.64/27',
  '13.232.140.64/27'
];

export async function POST(req: Request) {
  // 1. IP Whitelist
  const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0].trim();
  const isAllowedIP = RAZORPAY_WEBHOOK_IPS.some(range => 
    ipInRange(clientIP, range)
  );
  
  if (!isAllowedIP) {
    console.warn(`Blocked webhook from unauthorized IP: ${clientIP}`);
    return new Response('Forbidden', { status: 403 });
  }
  
  // 2. Verify Signature
  const signature = req.headers.get('x-razorpay-signature');
  const body = await req.text();
  
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    console.warn('Invalid webhook signature');
    return new Response('Unauthorized', { status: 401 });
  }
  
  // 3. Parse payload
  const payload = JSON.parse(body);
  const event = payload.event; // e.g., 'payment.captured'
  const paymentEntity = payload.payload.payment.entity;
  
  // 4. Timestamp validation (max 5 minutes old)
  const createdAt = new Date(paymentEntity.created_at * 1000);
  const age = (Date.now() - createdAt.getTime()) / 1000;
  if (age > 300) {
    console.warn(`Webhook too old: ${age} seconds`);
    return new Response('Webhook expired', { status: 400 });
  }
  
  // 5. Replay prevention (idempotency)
  const idempotencyKey = `webhook:${paymentEntity.id}:${event}`;
  const exists = await redis.get(idempotencyKey);
  if (exists) {
    console.log('Duplicate webhook, already processed');
    return new Response('OK', { status: 200 }); // Return 200 to stop retries
  }
  
  // 6. Process payment based on event
  try {
    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(paymentEntity);
        break;
      case 'payment.failed':
        await handlePaymentFailed(paymentEntity);
        break;
      case 'refund.processed':
        await handleRefundProcessed(paymentEntity);
        break;
      default:
        console.log(`Unhandled event: ${event}`);
    }
    
    // 7. Mark as processed (24-hour TTL)
    await redis.setex(idempotencyKey, 86400, 'processed');
    
    return new Response('OK', { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    
    // Log to orphaned payments table for manual reconciliation
    await prisma.orphanedPayment.create({
      data: {
        razorpay_payment_id: paymentEntity.id,
        amount: paymentEntity.amount / 100,
        error_message: error.message,
        payload: JSON.stringify(payload),
        created_at: new Date()
      }
    });
    
    // Return 500 so Razorpay retries
    return new Response('Processing error', { status: 500 });
  }
}

async function handlePaymentCaptured(payment) {
  const orderId = payment.notes.cafe_order_id;
  
  // Begin transaction
  await prisma.$transaction(async (tx) => {
    // 1. Update order status
    const order = await tx.order.update({
      where: { id: orderId },
      data: {
        status: 'CONFIRMED',
        payment_id: payment.id,
        payment_method: 'UPI', // or 'CARD'
        updated_at: new Date()
      },
      include: { user: true, items: { include: { item: true } } }
    });
    
    // 2. Deduct inventory (already reserved during cart, now confirm)
    for (const orderItem of order.items) {
      await tx.menuItem.update({
        where: { id: orderItem.item_id },
        data: {
          reserved_stock: { decrement: orderItem.quantity }
        }
      });
    }
    
    // 3. Send confirmation WhatsApp
    await sendOrderConfirmationWhatsApp(order);
    
    // 4. (Optional) Email receipt can still be sent for record
    // await sendOrderConfirmationEmail(order);
  });
}

async function handlePaymentFailed(payment) {
  const orderId = payment.notes.cafe_order_id;
  
  // Release reserved inventory
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });
  
  await prisma.$transaction(async (tx) => {
    // Update order status
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED', updated_at: new Date() }
    });
    
    // Release inventory
    for (const orderItem of order.items) {
      await tx.menuItem.update({
        where: { id: orderItem.item_id },
        data: {
          stock: { increment: orderItem.quantity },
          reserved_stock: { decrement: orderItem.quantity }
        }
      });
    }
  });
  
  // Notify user
  await sendPaymentFailedSMS(order.user.phone, orderId);
}
```

### 6.4 Refund Policy & Implementation

**Refund Scenarios:**

| Scenario | Refund Amount | Processing Time | Initiated By |
|----------|---------------|-----------------|--------------|
| User cancels within 2 minutes | 100% | Instant (auto) | User |
| Payment captured but order failed | 100% | 5-7 business days | System |
| Admin cancels order | 100% | Manual approval required | Admin |
| Food quality issue | 50-100% (case by case) | Manual approval | Support team |

**Auto-Refund Logic:**

```typescript
// User cancellation (within 2 minutes)
export async function cancelOrder(orderId: string, userId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId, user_id: userId }
  });
  
  if (!order) {
    throw new Error('Order not found');
  }
  
  // Check if within 2-minute window
  const elapsedTime = Date.now() - order.created_at.getTime();
  if (elapsedTime > 2 * 60 * 1000) {
    throw new Error('Cancellation window expired (2 minutes)');
  }
  
  // Check if payment method was UPI/Card
  if (order.payment_method === 'UPI' || order.payment_method === 'CARD') {
    // Initiate refund via Razorpay
    const refund = await razorpay.payments.refund(order.payment_id, {
      amount: order.total_amount * 100, // Paise
      speed: 'normal', // or 'optimum' for instant refunds (higher fees)
      notes: {
        reason: 'User cancellation within 2 minutes',
        cafe_order_id: orderId
      }
    });
    
    // Update order
    await prisma.order.update({
      where: { id: orderId },
      data: {
        status: 'CANCELLED',
        refund_id: refund.id,
        refund_status: 'PROCESSING',
        updated_at: new Date()
      }
    });
    
    // Release inventory
    await releaseInventory(orderId);
    
    // Send confirmation
    await sendRefundConfirmationSMS(order.user.phone, orderId, order.total_amount);
  } else {
    // Cash orders - just cancel
    await prisma.order.update({
      where: { id: orderId },
      data: { status: 'CANCELLED', updated_at: new Date() }
    });
    await releaseInventory(orderId);
  }
}

// Daily reconciliation cron job (runs at 2 AM)
async function reconcileOrphanedPayments() {
  // Find payments where order creation failed but payment succeeded
  const orphanedPayments = await prisma.orphanedPayment.findMany({
    where: { resolved: false, created_at: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
  });
  
  for (const orphaned of orphanedPayments) {
    // Check if order exists
    const order = await prisma.order.findUnique({
      where: { payment_id: orphaned.razorpay_payment_id }
    });
    
    if (!order) {
      // No order found - refund the payment
      try {
        await razorpay.payments.refund(orphaned.razorpay_payment_id, {
          amount: orphaned.amount * 100,
          notes: { reason: 'Orphaned payment - order not found' }
        });
        
        await prisma.orphanedPayment.update({
          where: { id: orphaned.id },
          data: { resolved: true, resolved_at: new Date() }
        });
        
        console.log(`Refunded orphaned payment: ${orphaned.razorpay_payment_id}`);
      } catch (error) {
        console.error(`Failed to refund orphaned payment: ${orphaned.razorpay_payment_id}`, error);
      }
    } else {
      // Order exists - mark as resolved
      await prisma.orphanedPayment.update({
        where: { id: orphaned.id },
        data: { resolved: true, resolved_at: new Date() }
      });
    }
  }
}
```

---

## 7. Subscription Business Rules

### 7.1 Plan Structure

| Plan Tier | Monthly Price | Daily Meal Limit | Monthly Credit Quota | Features | Target Audience |
|-----------|---------------|------------------|----------------------|----------|-----------------|
| **Trial** | ₹0 | 1 meal | 7 credits (7 days) | Basic menu only, no beverages | New users, trial period |
| **Light Bite** | ₹999 | 2 meals | 30 credits | Standard menu, select beverages | Light eaters, occasional users |
| **Feast & Fuel** | ₹1,799 | 3 meals | 60 credits | Full menu including beverages | Regular users, office workers |
| **Total Wellness** | ₹2,499 | 4 meals | 90 credits | Full menu, priority support | Heavy users, students with hostel mess |
| **Ultimate** | ₹3,999 | Unlimited | Unlimited | Everything + priority support, exclusive items | VIP users, corporate groups |

**Credit System:**
- 1 credit = 1 eligible meal item (breakfast/lunch/dinner)
- Snacks: 0.5 credits
- Beverages: 0.25 credits (included in plan)
- Extra items beyond quota: Pay per order

### 7.2 Quota Management

**Reset Logic:**

```typescript
// Credits reset on subscription anniversary (NOT 1st of month)
// Example: Joined Jan 15 → Resets Feb 15, Mar 15, etc.

interface Subscription {
  userId: string;
  planType: 'TRIAL' | 'LIGHT_BITE' | 'FEAST_FUEL' | 'TOTAL_WELLNESS' | 'ULTIMATE';
  creditsTotal: number;     // e.g., 30 for Light Bite
  creditsUsed: number;      // Current cycle usage
  dailyLimit: number;       // e.g., 2 for Light Bite
  dailyUsed: number;        // Today's usage
  startsAt: Date;           // Subscription start date
  expiresAt: Date;          // Next billing date (1 month from start)
  anniversaryDay: number;   // Day of month for reset (e.g., 15)
  isActive: boolean;
  autoRenew: boolean;
}

// Daily reset (runs at 00:00 IST)
async function resetDailyQuotas() {
  await prisma.subscription.updateMany({
    where: { isActive: true },
    data: { dailyUsed: 0 }
  });
}

// Monthly reset (runs hourly, checks for anniversaries)
async function resetMonthlyQuotas() {
  const today = new Date();
  const currentDay = today.getDate();
  
  // Find subscriptions whose anniversary is today
  const subscriptionsToReset = await prisma.subscription.findMany({
    where: {
      isActive: true,
      anniversaryDay: currentDay
    }
  });
  
  for (const sub of subscriptionsToReset) {
    // Reset credits
    await prisma.subscription.update({
      where: { id: sub.id },
      data: {
        creditsUsed: 0,
        dailyUsed: 0,
        expiresAt: addMonths(sub.expiresAt, 1) // Extend by 1 month
      }
    });
    
    // Process auto-renewal if enabled
    if (sub.autoRenew) {
      await processSubscriptionRenewal(sub.userId, sub.planType);
    }
  }
}

// Check quota before placing order
export async function validateSubscriptionQuota(
  userId: string,
  itemIds: string[]
): Promise<boolean> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId, isActive: true }
  });
  
  if (!subscription) {
    throw new Error('No active subscription found');
  }
  
  // Calculate credit cost of items
  const items = await prisma.menuItem.findMany({
    where: { id: { in: itemIds }, isSubscriptionEligible: true }
  });
  
  let creditCost = 0;
  for (const item of items) {
    if (item.category === 'SNACK') creditCost += 0.5;
    else if (item.category === 'BEVERAGE') creditCost += 0.25;
    else creditCost += 1; // Main meals
  }
  
  // Check daily limit
  if (subscription.dailyUsed + items.length > subscription.dailyLimit) {
    throw new Error(`Daily limit exceeded (${subscription.dailyLimit} meals/day)`);
  }
  
  // Check monthly quota (for non-unlimited plans)
  if (subscription.planType !== 'ULTIMATE') {
    const remainingCredits = subscription.creditsTotal - subscription.creditsUsed;
    if (creditCost > remainingCredits) {
      throw new Error(`Insufficient credits (${remainingCredits} remaining, ${creditCost} required)`);
    }
  }
  
  return true;
}

// Deduct quota after order confirmation
export async function deductSubscriptionQuota(
  userId: string,
  itemIds: string[]
) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  });
  
  const items = await prisma.menuItem.findMany({
    where: { id: { in: itemIds } }
  });
  
  let creditCost = 0;
  for (const item of items) {
    if (item.category === 'SNACK') creditCost += 0.5;
    else if (item.category === 'BEVERAGE') creditCost += 0.25;
    else creditCost += 1;
  }
  
  await prisma.subscription.update({
    where: { userId },
    data: {
      creditsUsed: { increment: creditCost },
      dailyUsed: { increment: items.length }
    }
  });
}
```

### 7.3 Pro-Rata Pricing (Mid-Month Joining)

**Formula:**

```typescript
function calculateProRataCharge(
  planPrice: number,
  joinDate: Date
): { charge: number, daysRemaining: number } {
  // Get the anniversary date (same day next month)
  const anniversaryDate = new Date(joinDate);
  anniversaryDate.setMonth(anniversaryDate.getMonth() + 1);
  anniversaryDate.setHours(0, 0, 0, 0);
  
  // Calculate days in the subscription period
  const totalDays = Math.ceil(
    (anniversaryDate.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Calculate days remaining (including join day)
  const daysRemaining = totalDays;
  
  // Pro-rata calculation
  const charge = Math.round((daysRemaining / totalDays) * planPrice);
  
  return { charge, daysRemaining };
}

// Example:
// Join: Jan 15, 2026 at 3:00 PM
// Plan: Feast & Fuel (₹1,799)
// Anniversary: Feb 15, 2026 at 00:00 AM
// Days: 31 (Jan 15 to Feb 15 inclusive)
// Charge: (31/31) × ₹1,799 = ₹1,799 (first month is always full price)

// BUT if join on Jan 20:
// Join: Jan 20, 2026
// Anniversary: Feb 20, 2026
// Days: 31 (Jan 20 to Feb 20)
// Charge: ₹1,799 (still full price, as it's a complete billing cycle)

// For TRUE pro-rata (joining mid-cycle):
// Join: Jan 20, Anniversary should be Feb 1 (to align with others)
// Days remaining: 12 (Jan 20 to Feb 1)
// Total days in Jan: 31
// Charge: (12/31) × ₹1,799 = ₹696
// (But this complicates anniversary tracking - NOT RECOMMENDED)
```

**Recommendation:** **Always charge full price for first month.** Pro-rata adds complexity without significant benefit. Users joining on Jan 20 get 11 extra days for free, which is an acceptable marketing cost.

**Simplified Approach:**
```typescript
async function subscribeToplan(userId: string, planType: PlanType) {
  const planPricing = {
    TRIAL: 0,
    LIGHT_BITE: 999,
    FEAST_FUEL: 1799,
    TOTAL_WELLNESS: 2499,
    ULTIMATE: 3999
  };
  
  const planQuotas = {
    TRIAL: { daily: 1, monthly: 7 },
    LIGHT_BITE: { daily: 2, monthly: 30 },
    FEAST_FUEL: { daily: 3, monthly: 60 },
    TOTAL_WELLNESS: { daily: 4, monthly: 90 },
    ULTIMATE: { daily: 999, monthly: 999999 } // Effectively unlimited
  };
  
  const price = planPricing[planType];
  const quota = planQuotas[planType];
  
  const startDate = new Date();
  const anniversaryDate = new Date(startDate);
  anniversaryDate.setMonth(anniversaryDate.getMonth() + 1);
  anniversaryDate.setHours(0, 0, 0, 0);
  
  // Create subscription
  await prisma.subscription.create({
    data: {
      userId,
      planType,
      creditsTotal: quota.monthly,
      creditsUsed: 0,
      dailyLimit: quota.daily,
      dailyUsed: 0,
      startsAt: startDate,
      expiresAt: anniversaryDate,
      anniversaryDay: startDate.getDate(),
      isActive: true,
      autoRenew: true
    }
  });
  
  // Process payment (if not trial)
  if (price > 0) {
    await processSubscriptionPayment(userId, price, planType);
  }
}
```

### 7.4 Renewal & Grace Period

**Auto-Renewal Flow:**

```typescript
// Runs daily at 00:00 IST
async function processSubscriptionRenewals() {
  // Find subscriptions expiring in 3 days
  const expiringSubscriptions = await prisma.subscription.findMany({
    where: {
      isActive: true,
      autoRenew: true,
      expiresAt: {
        lte: addDays(new Date(), 3),
        gte: new Date()
      }
    },
    include: { user: true }
  });
  
  for (const sub of expiringSubscriptions) {
    try {
      // Attempt to charge saved payment method
      const payment = await razorpay.subscriptions.create({
        plan_id: sub.planType,
        customer_id: sub.user.razorpay_customer_id,
        total_count: 1,
        notify: 1,
        notes: {
          user_id: sub.userId,
          subscription_id: sub.id
        }
      });
      
      // Extend subscription
      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          creditsUsed: 0,
          dailyUsed: 0,
          expiresAt: addMonths(sub.expiresAt, 1)
        }
      });
      
      // Send confirmation
      await sendRenewalConfirmationSMS(sub.user.phone, sub.planType);
    } catch (error) {
      // Payment failed - enter grace period
      await prisma.subscription.update({
        where: { id: sub.id },
        data: { gracePeridEnd: addDays(sub.expiresAt, 2) } // 2-day grace
      });
      
      // Send reminder
      await sendRenewalFailedSMS(sub.user.phone, sub.planType);
    }
  }
  
  // Deactivate subscriptions past grace period
  await prisma.subscription.updateMany({
    where: {
      isActive: true,
      gracePeriodEnd: { lt: new Date() }
    },
    data: { isActive: false }
  });
}
```

**Grace Period Rules:**
- Day 0: Payment attempt, send reminder SMS
- Day 1: Second payment attempt, send email
- Day 2: Final payment attempt, send urgent SMS
- Day 3: Deactivate subscription, downgrade to normal mode

### 7.5 Plan Switching

```typescript
// Upgrade (immediate, pro-rata billing)
async function upgradeSubscription(
  userId: string,
  newPlanType: PlanType
) {
  const currentSub = await prisma.subscription.findUnique({
    where: { userId }
  });
  
  const planPricing = {
    LIGHT_BITE: 999,
    FEAST_FUEL: 1799,
    TOTAL_WELLNESS: 2499,
    ULTIMATE: 3999
  };
  
  const currentPrice = planPricing[currentSub.planType];
  const newPrice = planPricing[newPlanType];
  
  if (newPrice <= currentPrice) {
    throw new Error('Cannot upgrade to a lower-priced plan');
  }
  
  // Calculate days remaining in current cycle
  const daysRemaining = Math.ceil(
    (currentSub.expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  const totalDays = Math.ceil(
    (currentSub.expiresAt.getTime() - currentSub.startsAt.getTime()) / (1000 * 60 * 60 * 24)
  );
  
  // Pro-rata charge for upgrade
  const priceDifference = newPrice - currentPrice;
  const upgradeCharge = Math.round((daysRemaining / totalDays) * priceDifference);
  
  // Process payment
  await processPayment(userId, upgradeCharge);
  
  // Update subscription
  const newQuotas = {
    FEAST_FUEL: { daily: 3, monthly: 60 },
    TOTAL_WELLNESS: { daily: 4, monthly: 90 },
    ULTIMATE: { daily: 999, monthly: 999999 }
  };
  
  await prisma.subscription.update({
    where: { userId },
    data: {
      planType: newPlanType,
      creditsTotal: newQuotas[newPlanType].monthly,
      dailyLimit: newQuotas[newPlanType].daily
      // Keep same anniversary date
    }
  });
}

// Downgrade (takes effect on next renewal)
async function downgradeSubscription(
  userId: string,
  newPlanType: PlanType
) {
  const currentSub = await prisma.subscription.findUnique({
    where: { userId }
  });
  
  // Store downgrade request
  await prisma.subscription.update({
    where: { userId },
    data: {
      pendingDowngrade: newPlanType,
      // Will be applied on next renewal
    }
  });
  
  // Notify user
  await sendDowngradeScheduledEmail(
    currentSub.user.email,
    currentSub.planType,
    newPlanType,
    currentSub.expiresAt
  );
}
```

### 7.6 Fraud Prevention

```typescript
// Device fingerprinting
async function trackSubscriptionDevice(userId: string, req: Request) {
  const fingerprint = {
    userAgent: req.headers.get('user-agent'),
    ipAddress: req.headers.get('x-forwarded-for'),
    acceptLanguage: req.headers.get('accept-language'),
    screenResolution: req.headers.get('sec-ch-viewport-width'),
    timezone: req.headers.get('sec-ch-ua-timezone')
  };
  
  const fingerprintHash = crypto
    .createHash('sha256')
    .update(JSON.stringify(fingerprint))
    .digest('hex');
  
  // Check if device is already registered
  const deviceCount = await prisma.subscriptionDevice.count({
    where: { userId }
  });
  
  if (deviceCount >= 3) {
    // Flag for review
    await prisma.fraudAlert.create({
      data: {
        userId,
        reason: 'TOO_MANY_DEVICES',
        details: `User has ${deviceCount} registered devices`,
        created_at: new Date()
      }
    });
  }
  
  // Register device
  await prisma.subscriptionDevice.upsert({
    where: { fingerprintHash },
    update: { lastSeenAt: new Date() },
    create: {
      userId,
      fingerprintHash,
      userAgent: fingerprint.userAgent,
      ipAddress: fingerprint.ipAddress,
      createdAt: new Date()
    }
  });
}

// Account sharing detection (IP clustering)
async function detectAccountSharing(userId: string) {
  const devices = await prisma.subscriptionDevice.findMany({
    where: { userId },
    orderBy: { lastSeenAt: 'desc' },
    take: 10 // Last 10 devices
  });
  
  // Group by IP prefix (first 3 octets)
  const ipPrefixes = devices.map(d => 
    d.ipAddress.split('.').slice(0, 3).join('.')
  );
  
  const uniqueLocations = new Set(ipPrefixes).size;
  
  if (uniqueLocations > 5) {
    // User is accessing from >5 different locations - likely sharing
    await prisma.fraudAlert.create({
      data: {
        userId,
        reason: 'ACCOUNT_SHARING_SUSPECTED',
        details: `User accessed from ${uniqueLocations} different locations`,
        created_at: new Date()
      }
    });
    
    // Send warning email
    await sendAccountSharingWarning(userId);
  }
}

// Unusual ordering patterns
async function detectAnomalousOrdering(userId: string, orderTime: Date) {
  const hour = orderTime.getHours();
  
  // Flag orders at unusual times (2 AM - 6 AM)
  if (hour >= 2 && hour < 6) {
    await prisma.fraudAlert.create({
      data: {
        userId,
        reason: 'UNUSUAL_ORDER_TIME',
        details: `Order placed at ${hour}:${orderTime.getMinutes()}`,
        created_at: new Date()
      }
    });
  }
  
  // Check for rapid-fire orders (>5 orders in 1 hour)
  const recentOrders = await prisma.order.count({
    where: {
      userId,
      created_at: { gte: new Date(Date.now() - 60 * 60 * 1000) }
    }
  });
  
  if (recentOrders > 5) {
    await prisma.fraudAlert.create({
      data: {
        userId,
        reason: 'RAPID_ORDERING',
        details: `${recentOrders} orders in 1 hour`,
        created_at: new Date()
      }
    });
  }
}
```

---

## 8. Inventory Management

### 8.1 The Race Condition Problem

**Scenario:**
```
Item: Masala Dosa (Stock: 1)
Time: 12:00:00 - User A adds to cart
Time: 12:00:01 - User B adds to cart
Time: 12:00:05 - User A checks out → Success (stock: 0)
Time: 12:00:06 - User B checks out → Success (stock: -1) ❌ OVERSOLD!
```

### 8.2 Three-Layer Protection

**Layer 1: Cart Reservation (Soft Lock)**

```sql
-- When user adds item to cart
UPDATE menu_items
SET reserved_stock = reserved_stock + :quantity
WHERE id = :item_id
  AND (stock - reserved_stock) >= :quantity
RETURNING stock, reserved_stock;
```

```typescript
async function addToCart(itemId: string, quantity: number, userId: string) {
  // Use Prisma raw query for atomic operation
  const result = await prisma.$queryRaw<MenuItemUpdate>`
    UPDATE menu_items
    SET reserved_stock = reserved_stock + ${quantity}
    WHERE id = ${itemId}
      AND (stock - reserved_stock) >= ${quantity}
    RETURNING stock, reserved_stock
  `;
  
  if (result.length === 0) {
    throw new Error('Insufficient stock');
  }
  
  // Create cart reservation with expiry
  await redis.setex(
    `cart:${userId}:${itemId}`,
    300, // 5 minutes
    JSON.stringify({ quantity, reservedAt: new Date() })
  );
  
  return result[0];
}
```

**Background Job: Release Expired Reservations**

```typescript
// Runs every minute
async function releaseExpiredReservations() {
  // Find all cart reservations older than 5 minutes
  const keys = await redis.keys('cart:*');
  
  for (const key of keys) {
    const reservation = JSON.parse(await redis.get(key));
    const age = (Date.now() - new Date(reservation.reservedAt).getTime()) / 1000;
    
    if (age > 300) {
      // Extract itemId from key (cart:{userId}:{itemId})
      const itemId = key.split(':')[2];
      
      // Release reserved stock
      await prisma.menuItem.update({
        where: { id: itemId },
        data: {
          reserved_stock: { decrement: reservation.quantity }
        }
      });
      
      // Delete reservation
      await redis.del(key);
    }
  }
}
```

**Layer 2: Checkout Validation (Row-Level Lock)**

```typescript
async function createOrder(userId: string, cartItems: CartItem[]) {
  return await prisma.$transaction(async (tx) => {
    // 1. Lock all item rows for update
    const itemIds = cartItems.map(item => item.itemId);
    const items = await tx.$queryRaw<MenuItem[]>`
      SELECT * FROM menu_items
      WHERE id = ANY(${itemIds}::uuid[])
      FOR UPDATE
    `;
    
    // 2. Validate stock availability
    for (const cartItem of cartItems) {
      const item = items.find(i => i.id === cartItem.itemId);
      if (!item || item.stock < cartItem.quantity) {
        throw new Error(`Insufficient stock for ${cartItem.name}`);
      }
    }
    
    // 3. Deduct inventory atomically
    for (const cartItem of cartItems) {
      await tx.menuItem.update({
        where: { id: cartItem.itemId },
        data: {
          stock: { decrement: cartItem.quantity },
          reserved_stock: { decrement: cartItem.quantity }
        }
      });
    }
    
    // 4. Create order
    const order = await tx.order.create({
      data: {
        userId,
        status: 'PAYMENT_PENDING',
        totalAmount: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        items: {
          create: cartItems.map(item => ({
            itemId: item.itemId,
            quantity: item.quantity,
            priceAtPurchase: item.price
          }))
        }
      },
      include: { items: true }
    });
    
    // 5. Clear cart reservations
    for (const item of cartItems) {
      await redis.del(`cart:${userId}:${item.itemId}`);
    }
    
    return order;
  }, {
    maxWait: 5000, // Max 5 seconds to acquire transaction lock
    timeout: 10000 // Max 10 seconds for entire transaction
  });
}
```

**Layer 3: Real-Time Stock Sync (WebSockets)**

```typescript
// Server-side: Broadcast stock updates
async function updateInventory(itemId: string, newStock: number) {
  await prisma.menuItem.update({
    where: { id: itemId },
    data: { stock: newStock }
  });
  
  // Invalidate menu cache
  await redis.del('menu:latest');
  
  // Broadcast to all connected clients
  await pusher.trigger('inventory', 'stock-updated', {
    itemId,
    stock: newStock,
    isAvailable: newStock > 0
  });
}

// Client-side: Listen for updates
const channel = pusher.subscribe('inventory');
channel.bind('stock-updated', (data: { itemId: string; stock: number }) => {
  // Update UI immediately
  queryClient.setQueryData(['menu'], (oldData) => {
    return oldData.map(item =>
      item.id === data.itemId
        ? { ...item, stock: data.stock, isAvailable: data.stock > 0 }
        : item
    );
  });
  
  // Show toast if item in cart just sold out
  if (data.stock === 0 && isInCart(data.itemId)) {
    toast.error(`${getItemName(data.itemId)} just sold out!`);
  }
});
```

### 8.3 Admin Inventory Management

```typescript
// Bulk stock update (end of day)
export async function bulkUpdateInventory(updates: InventoryUpdate[]) {
  await prisma.$transaction(
    updates.map(update =>
      prisma.menuItem.update({
        where: { id: update.itemId },
        data: {
          stock: update.newStock,
          isAvailable: update.newStock > 0
        }
      })
    )
  );
  
  // Clear cache
  await redis.del('menu:latest');
  
  // Broadcast all updates
  for (const update of updates) {
    await pusher.trigger('inventory', 'stock-updated', {
      itemId: update.itemId,
      stock: update.newStock,
      isAvailable: update.newStock > 0
    });
  }
  
  // Audit log
  await prisma.auditLog.create({
    data: {
      adminId: req.user.id,
      action: 'BULK_INVENTORY_UPDATE',
      resourceType: 'MENU_ITEMS',
      newValue: updates,
      createdAt: new Date()
    }
  });
}

// Low stock alerts
async function checkLowStockItems() {
  const lowStockItems = await prisma.menuItem.findMany({
    where: {
      stock: { lte: 10 },
      isAvailable: true
    }
  });
  
### 9.1 Authentication & Authorization
- **Implementation**:
  - **Hashing**: Argon2 (replacing bcrypt) for robust password security.
  - **Sessions**: Secure HTTP-only cookies with JWT (JOSE library).
  - **Rate Limiting**: Upstash Redis-based limiter (`middleware.ts`).
  - **CSP**: Content-Security-Policy headers in `next.config.js`.

### 9.2 Data Protection
- **Audit Logs**: `AuditLog` table tracks critical actions (Login, Refund, Inventory Update).
- **Encryption**: Sensitive fields (like TotpSecret) are encrypted at rest.

**Legal Framework:** Digital Personal Data Protection Act, 2023 (India)

**Classification of Data:**

| Data Type | Category | Retention Period | Encryption Required |
|-----------|----------|------------------|---------------------|
| Phone Number | Personal Data | Until account deletion | At rest + in transit |
| Name | Personal Data | Until account deletion | At rest + in transit |
| Email | Personal Data | Until account deletion | At rest + in transit |
| Order History | Financial Record | 7 years (GST compliance) | At rest |
| Payment Details | Sensitive Financial | Never stored (tokenized) | N/A (Razorpay handles) |
| Admin Credentials | Authentication | Active employment + 1 year | At rest (Argon2) |
| Session Tokens | Temporary | 7 days max | In transit only |

#### 9.1.1 Data Principal Rights Implementation

**Right to Access (Section 11):**

```typescript
// User data export
export async function exportUserData(userId: string): Promise<Blob> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      name: true,
      email: true,
      created_at: true,
      last_login: true
    }
  });
  
  const orders = await prisma.order.findMany({
    where: { user_id: userId },
    include: {
      items: {
        include: {
          item: { select: { name: true, price: true } }
        }
      }
    },
    orderBy: { created_at: 'desc' }
  });
  
  const subscription = await prisma.subscription.findUnique({
    where: { user_id: userId }
  });
  
  const consentRecords = await prisma.consentRecord.findMany({
    where: { user_id: userId },
    orderBy: { granted_at: 'desc' }
  });
  
  const exportData = {
    generated_at: new Date().toISOString(),
    user: {
      id: user.id,
      phone: user.phone,
      name: user.name,
      email: user.email,
      account_created: user.created_at,
      last_login: user.last_login
    },
    orders: orders.map(order => ({
      order_id: order.id,
      date: order.created_at,
      total: order.total_amount,
      status: order.status,
      items: order.items.map(item => ({
        name: item.item.name,
        quantity: item.quantity,
        price: item.price_at_purchase
      }))
    })),
    subscription: subscription ? {
      plan: subscription.plan_type,
      status: subscription.is_active ? 'Active' : 'Inactive',
      credits_remaining: subscription.credits_total - subscription.credits_used,
      expires_at: subscription.expires_at
    } : null,
    consent: consentRecords.map(c => ({
      purpose: c.purpose,
      granted_at: c.granted_at,
      withdrawn_at: c.withdrawn_at,
      status: c.withdrawn_at ? 'Withdrawn' : 'Active'
    }))
  };
  
  return new Blob(
    [JSON.stringify(exportData, null, 2)],
    { type: 'application/json' }
  );
}
```

**Right to Correction (Section 12):**

```typescript
// Allow users to update their personal information
export async function updateUserProfile(
  userId: string,
  updates: { name?: string; email?: string }
) {
  // Validate inputs
  if (updates.name && (updates.name.length < 2 || updates.name.length > 50)) {
    throw new Error('Name must be 2-50 characters');
  }
  
  if (updates.email && !isValidEmail(updates.email)) {
    throw new Error('Invalid email format');
  }
  
  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: updates
  });
  
  // Audit log
  await prisma.auditLog.create({
    data: {
      user_id: userId,
      action: 'PROFILE_UPDATED',
      old_value: { /* previous values */ },
      new_value: updates,
      created_at: new Date()
    }
  });
}
```

**Right to Erasure (Section 13):**

```typescript
// Account deletion (anonymization for financial compliance)
export async function deleteUserAccount(userId: string) {
  await prisma.$transaction(async (tx) => {
    // 1. Anonymize user data
    await tx.user.update({
      where: { id: userId },
      data: {
        name: 'DELETED_USER',
        phone: `DELETED_${crypto.randomUUID().slice(0, 8)}`,
        email: null,
        deleted_at: new Date()
      }
    });
    
    // 2. Deactivate subscription
    await tx.subscription.updateMany({
      where: { user_id: userId },
      data: { is_active: false }
    });
    
    // 3. Withdraw all consents
    await tx.consentRecord.updateMany({
      where: { user_id: userId, withdrawn_at: null },
      data: { withdrawn_at: new Date() }
    });
    
    // 4. Clear sessions
    await redis.del(`session:${userId}`);
    
    // 5. Note: Orders are retained (7-year GST requirement)
    // but user_id foreign key is set to NULL
    await tx.order.updateMany({
      where: { user_id: userId },
      data: { user_id: null }
    });
  });
  
  // Send confirmation
  await sendAccountDeletionConfirmation(userId);
}
```

#### 9.1.2 Consent Management

**Consent Types:**

```typescript
enum ConsentPurpose {
  ORDER_PROCESSING = 'order_processing',      // Required (cannot withdraw)
  MARKETING_SMS = 'marketing_sms',            // Optional
  MARKETING_EMAIL = 'marketing_email',        // Optional
  ANALYTICS = 'analytics',                    // Optional
  PERSONALIZATION = 'personalization'         // Optional
}

interface ConsentRecord {
  id: string;
  userId: string;
  purpose: ConsentPurpose;
  grantedAt: Date;
  withdrawnAt?: Date;
  ipAddress: string;
  userAgent: string;
}
```

**Consent Collection (Registration Flow):**

```typescript
// During signup
export async function collectConsent(
  userId: string,
  consents: { purpose: ConsentPurpose; granted: boolean }[],
  metadata: { ipAddress: string; userAgent: string }
) {
  const records = consents
    .filter(c => c.granted)
    .map(c => ({
      user_id: userId,
      purpose: c.purpose,
      granted_at: new Date(),
      ip_address: metadata.ipAddress,
      user_agent: metadata.userAgent
    }));
  
  await prisma.consentRecord.createMany({
    data: records
  });
}

// Consent withdrawal
export async function withdrawConsent(userId: string, purpose: ConsentPurpose) {
  if (purpose === ConsentPurpose.ORDER_PROCESSING) {
    throw new Error('Cannot withdraw consent for order processing (required for service)');
  }
  
  await prisma.consentRecord.updateMany({
    where: {
      user_id: userId,
      purpose: purpose,
      withdrawn_at: null
    },
    data: {
      withdrawn_at: new Date()
    }
  });
}
```

#### 9.1.3 Data Breach Notification

**Incident Response Plan:**

```typescript
// Data breach detection and notification
export async function handleDataBreach(incident: {
  type: 'unauthorized_access' | 'data_leak' | 'system_compromise';
  affectedUsers: string[];
  dataTypes: string[];
  discoveredAt: Date;
}) {
  // 1. Log incident
  await prisma.securityIncident.create({
    data: {
      type: incident.type,
      affected_user_count: incident.affectedUsers.length,
      data_types_affected: incident.dataTypes,
      discovered_at: incident.discoveredAt,
      status: 'UNDER_INVESTIGATION'
    }
  });
  
  // 2. Notify users within 72 hours (DPDP Act requirement)
  if (incident.affectedUsers.length > 0) {
    for (const userId of incident.affectedUsers) {
      await sendBreachNotification(userId, {
        incidentType: incident.type,
        dataAffected: incident.dataTypes,
        actionRequired: getRequiredActions(incident.type)
      });
    }
  }
  
  // 3. Notify Data Protection Board if >1000 users affected
  if (incident.affectedUsers.length > 1000) {
    await notifyDataProtectionBoard(incident);
  }
  
  // 4. Internal escalation
  await sendSlackAlert('security-incidents', {
    severity: 'CRITICAL',
    message: `Data breach detected: ${incident.type}`,
    affectedUsers: incident.affectedUsers.length
  });
}
```

#### 9.1.4 Data Localization

**Server Locations:**
- **Infrastructure**: Vercel (Frontend/API), Supabase (Database), Upstash Redis (Rate Limiting/Auth), Pusher (Real-time).
- **Notifications**: WhatsApp-first (Direct Meta API), replacing SMS for cost-efficiency.
- **Security**: CSP, Rate Limiting, Argon2 Hashing, Audit Logs.
- **File Storage:** AWS S3 (ap-south-1 - Mumbai)

**Compliance Notes:**
- All personal data stored within India
- No cross-border data transfer
- CDN static assets (images) served globally (non-personal data)

### 9.2 Encryption Standards

#### 9.2.1 Data at Rest

```typescript
// Database-level encryption (Supabase default: AES-256)
// Application-level encryption for sensitive fields

// Encrypt TOTP secrets for admins
export function encryptTOTPSecret(secret: string): {
  encrypted: string;
  iv: string;
  tag: string;
} {
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex'); // 32-byte key
  const iv = crypto.randomBytes(16); // 16-byte IV
  
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  let encrypted = cipher.update(secret, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const tag = cipher.getAuthTag();
  
  return {
    encrypted,
    iv: iv.toString('hex'),
    tag: tag.toString('hex')
  };
}

export function decryptTOTPSecret(
  encrypted: string,
  iv: string,
  tag: string
): string {
  const key = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');
  
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    key,
    Buffer.from(iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(tag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

#### 9.2.2 Data in Transit

```typescript
// All API endpoints enforce HTTPS only
export function middleware(req: NextRequest) {
  // Redirect HTTP to HTTPS in production
  if (process.env.NODE_ENV === 'production' && req.headers.get('x-forwarded-proto') !== 'https') {
    return NextResponse.redirect(
      `https://${req.headers.get('host')}${req.nextUrl.pathname}`,
      301
    );
  }
  
  // Set security headers
  const response = NextResponse.next();
  
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
  );
  
  return response;
}
```

### 9.3 Role-Based Access Control (RBAC)

#### 9.3.1 Permission Matrix

```typescript
enum Permission {
  // Order permissions
  VIEW_ORDERS = 'orders:view',
  CREATE_ORDER = 'orders:create',
  UPDATE_ORDER_STATUS = 'orders:update_status',
  CANCEL_ORDER = 'orders:cancel',
  
  // Inventory permissions
  VIEW_INVENTORY = 'inventory:view',
  UPDATE_INVENTORY = 'inventory:update',
  
  // User management
  VIEW_USER_PII = 'users:view_pii',
  DELETE_USER = 'users:delete',
  
  // Financial
  VIEW_FINANCIALS = 'financials:view',
  PROCESS_REFUND = 'financials:refund',
  DOWNLOAD_REPORTS = 'reports:download',
  
  // System
  MANAGE_ADMINS = 'system:manage_admins',
  VIEW_AUDIT_LOGS = 'system:audit_logs'
}

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  CUSTOMER: [
    Permission.VIEW_ORDERS,
    Permission.CREATE_ORDER,
    Permission.CANCEL_ORDER
  ],
  
  KITCHEN_STAFF: [
    Permission.VIEW_ORDERS,
    Permission.UPDATE_ORDER_STATUS,
    Permission.VIEW_INVENTORY
  ],
  
  MANAGER: [
    Permission.VIEW_ORDERS,
    Permission.UPDATE_ORDER_STATUS,
    Permission.CANCEL_ORDER,
    Permission.VIEW_INVENTORY,
    Permission.UPDATE_INVENTORY,
    Permission.VIEW_FINANCIALS,
    Permission.DOWNLOAD_REPORTS
  ],
  
  SUPER_ADMIN: [
    ...Object.values(Permission) // All permissions
  ]
};

// Permission check middleware
export function requirePermission(permission: Permission) {
  return async (req: NextRequest) => {
    const user = await getCurrentUser(req);
    
    if (!user) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const userPermissions = ROLE_PERMISSIONS[user.role];
    
    if (!userPermissions.includes(permission)) {
      // Audit log
      await prisma.auditLog.create({
        data: {
          user_id: user.id,
          action: 'PERMISSION_DENIED',
          resource_type: permission,
          ip_address: req.headers.get('x-forwarded-for'),
          created_at: new Date()
        }
      });
      
      return new Response('Forbidden', { status: 403 });
    }
    
    return null; // Permission granted
  };
}
```

#### 9.3.2 Audit Logging

```typescript
// Comprehensive audit trail for compliance
export async function auditLog(params: {
  userId: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValue?: any;
  newValue?: any;
  ipAddress: string;
  userAgent: string;
}) {
  await prisma.auditLog.create({
    data: {
      user_id: params.userId,
      action: params.action,
      resource_type: params.resourceType,
      resource_id: params.resourceId,
      old_value: params.oldValue ? JSON.stringify(params.oldValue) : null,
      new_value: params.newValue ? JSON.stringify(params.newValue) : null,
      ip_address: params.ipAddress,
      user_agent: params.userAgent,
      created_at: new Date()
    }
  });
}

// Example usage
export async function updateMenuItem(itemId: string, updates: any, adminId: string) {
  const oldItem = await prisma.menuItem.findUnique({ where: { id: itemId } });
  
  const newItem = await prisma.menuItem.update({
    where: { id: itemId },
    data: updates
  });
  
  // Audit log
  await auditLog({
    userId: adminId,
    action: 'UPDATE_MENU_ITEM',
    resourceType: 'MENU_ITEM',
    resourceId: itemId,
    oldValue: oldItem,
    newValue: newItem,
    ipAddress: req.ip,
    userAgent: req.headers['user-agent']
  });
  
  return newItem;
}
```

### 9.4 API Security

#### 9.4.1 Rate Limiting

```typescript
// Redis-based rate limiting
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number; resetAt: Date }> {
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, windowSeconds);
  }
  
  const ttl = await redis.ttl(key);
  const resetAt = new Date(Date.now() + ttl * 1000);
  
  return {
    allowed: current <= limit,
    remaining: Math.max(0, limit - current),
    resetAt
  };
}

// Rate limit middleware
export async function rateLimitMiddleware(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim();
  const endpoint = req.nextUrl.pathname;
  
  // Different limits for different endpoints
  const limits = {
    '/api/auth/send-otp': { limit: 3, window: 300 },      // 3 per 5 minutes
    '/api/orders/create': { limit: 10, window: 60 },      // 10 per minute
    '/api/menu': { limit: 100, window: 60 },              // 100 per minute
    'default': { limit: 60, window: 60 }                  // 60 per minute
  };
  
  const config = limits[endpoint] || limits.default;
  const key = `ratelimit:${ip}:${endpoint}`;
  
  const result = await rateLimit(key, config.limit, config.window);
  
  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
        retryAfter: result.resetAt
      }),
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((result.resetAt.getTime() - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(config.limit),
          'X-RateLimit-Remaining': String(result.remaining),
          'X-RateLimit-Reset': result.resetAt.toISOString()
        }
      }
    );
  }
  
  return null; // Rate limit not exceeded
}
```

#### 9.4.2 CSRF Protection

```typescript
// Double-submit cookie pattern
export function generateCSRFToken(userId: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  
  // Store in Redis (1-hour expiry)
  redis.setex(`csrf:${userId}`, 3600, token);
  
  return token;
}

export async function validateCSRFToken(
  userId: string,
  token: string
): Promise<boolean> {
  const storedToken = await redis.get(`csrf:${userId}`);
  return storedToken === token;
}

// CSRF middleware for state-changing operations
export async function csrfProtection(req: NextRequest) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const user = await getCurrentUser(req);
    const token = req.headers.get('x-csrf-token');
    
    if (!user || !token) {
      return new Response('CSRF token missing', { status: 403 });
    }
    
    const isValid = await validateCSRFToken(user.id, token);
    
    if (!isValid) {
      return new Response('Invalid CSRF token', { status: 403 });
    }
  }
  
  return null;
}
```

#### 9.4.3 Input Validation

```typescript
import { z } from 'zod';

// Zod schemas for all API inputs
export const schemas = {
  createOrder: z.object({
    items: z.array(z.object({
      itemId: z.string().uuid(),
      quantity: z.number().int().min(1).max(10)
    })).min(1).max(20),
    scheduledFor: z.string().datetime().optional(),
    specialInstructions: z.string().max(200).optional(),
    paymentMethod: z.enum(['CASH', 'UPI', 'CARD', 'SUBSCRIPTION'])
  }),
  
  updateInventory: z.object({
    itemId: z.string().uuid(),
    stock: z.number().int().min(0).max(1000)
  }),
  
  sendOTP: z.object({
    phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number')
  }),
  
  verifyOTP: z.object({
    phone: z.string().regex(/^[6-9]\d{9}$/),
    otp: z.string().length(6).regex(/^\d{6}$/)
  })
};

// Validation middleware
export function validateInput<T>(schema: z.ZodSchema<T>) {
  return async (req: NextRequest) => {
    const body = await req.json();
    
    try {
      const validated = schema.parse(body);
      return { validated };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return new Response(
          JSON.stringify({
            error: 'INVALID_INPUT',
            details: error.errors
          }),
          { status: 400 }
        );
      }
      throw error;
    }
  };
}
```

---

## 10. Error Handling & Resilience

### 10.1 Standardized Error Responses

```typescript
// Error code registry
export enum ErrorCode {
  // Authentication
  AUTH_INVALID = 'AUTH_INVALID',
  AUTH_EXPIRED = 'AUTH_EXPIRED',
  OTP_INVALID = 'OTP_INVALID',
  OTP_EXPIRED = 'OTP_EXPIRED',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  
  // Authorization
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  
  // Rate Limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // Inventory
  INSUFFICIENT_STOCK = 'INSUFFICIENT_STOCK',
  ITEM_NOT_AVAILABLE = 'ITEM_NOT_AVAILABLE',
  
  // Subscription
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  SUBSCRIPTION_INACTIVE = 'SUBSCRIPTION_INACTIVE',
  
  // Payment
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  REFUND_FAILED = 'REFUND_FAILED',
  
  // Orders
  ORDER_NOT_FOUND = 'ORDER_NOT_FOUND',
  ORDER_ALREADY_CANCELLED = 'ORDER_ALREADY_CANCELLED',
  CANCELLATION_WINDOW_EXPIRED = 'CANCELLATION_WINDOW_EXPIRED',
  
  // Validation
  INVALID_INPUT = 'INVALID_INPUT',
  
  // System
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export interface APIError {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    details?: any;
    timestamp: string;
    requestId: string;
  };
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 400,
    public details?: any
  ) {
   ## 10. Error Handling & Resilience

### 10.1 Implementation
- **Centralized Handler**: `src/lib/error.ts` standardizes API responses.
- **Logging**: `prisma.ErrorLog` captures backend exceptions with stack traces.
- **Structured Logs**: Application uses `pino` (via `src/lib/logger.ts`) for JSON-structured logging.

### 10.2 Resilience
- **Webhooks**: Razorpay webhooks (`src/app/api/webhooks/razorpay`) handle async payment confirmation.
- **Database**: Connection pooling enabled for Supabase to handle 1000+ users.
      {
        status: error.statusCode,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  // Unknown error - don't leak internal details
  return new Response(
    JSON.stringify({
      success: false,
      error: {
        code: ErrorCode.INTERNAL_ERROR,
        message: 'An unexpected error occurred',
        timestamp: new Date().toISOString(),
        requestId
      }
    } as APIError),
    {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}
```

### 10.2 Critical Failure Scenarios

#### 10.2.1 Payment Success but Order Creation Fails

```typescript
export async function handleOrphanedPayment(paymentId: string) {
  try {
    // 1. Fetch payment details from Razorpay
    const payment = await razorpay.payments.fetch(paymentId);
    
    // 2. Check if order exists
    const order = await prisma.order.findFirst({
      where: { payment_id: paymentId }
    });
    
    if (order) {
      // Order exists - just an orphaned payment record
      await prisma.orphanedPayment.update({
        where: { razorpay_payment_id: paymentId },
        data: { resolved: true, resolved_at: new Date() }
      });
      return;
    }
    
    // 3. No order found - attempt to recreate from payment notes
    const orderData = payment.notes;
    
    if (orderData && orderData.cart_items) {
      // Try to recreate order
      await prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
          data: {
            user_id: orderData.user_id,
            status: 'CONFIRMED',
            total_amount: payment.amount / 100,
            payment_method: 'UPI',
            payment_id: paymentId,
            items: {
              create: JSON.parse(orderData.cart_items)
            }
          }
        });
        
        // Deduct inventory
        for (const item of JSON.parse(orderData.cart_items)) {
          await tx.menuItem.update({
            where: { id: item.itemId },
            data: { stock: { decrement: item.quantity } }
          });
        }
      });
      
      // Mark as resolved
      await prisma.orphanedPayment.update({
        where: { razorpay_payment_id: paymentId },
        data: { resolved: true, resolved_at: new Date() }
      });
    } else {
      // Cannot recreate - refund
      await razorpay.payments.refund(paymentId, {
        amount: payment.amount,
        notes: { reason: 'Orphaned payment - order creation failed' }
      });
      
      await prisma.orphanedPayment.update({
        where: { razorpay_payment_id: paymentId },
        data: { resolved: true, resolved_at: new Date(), refunded: true }
      });
    }
  } catch (error) {
    console.error('Failed to handle orphaned payment:', error);
    // Will retry on next cron run
  }
}

// Cron job (runs every 10 minutes)
export async function reconcileOrphanedPayments() {
  const orphaned = await prisma.orphanedPayment.findMany({
    where: {
      resolved: false,
      created_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Last 24 hours
    }
  });
  
  for (const payment of orphaned) {
    await handleOrphanedPayment(payment.razorpay_payment_id);
  }
}
```

#### 10.2.2 Database Connection Pool Exhaustion

```typescript
// Circuit breaker pattern
class CircuitBreaker {
  private failures = 0;
  private lastFailureTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private threshold: number = 5,
    private timeout: number = 60000 // 1 minute
  ) {}
  
  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new AppError(
          ErrorCode.DATABASE_ERROR,
          'Service temporarily unavailable',
          503
        );
      }
    }
    
    try {
      const result = await fn();
      
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failures = 0;
      }
      
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailureTime = Date.now();
      
      if (this.failures >= this.threshold) {
        this.state = 'OPEN';
      }
      
      throw error;
    }
  }
}

const dbCircuitBreaker = new CircuitBreaker();

// Wrap database operations
export async function queryWithCircuitBreaker<T>(
  query: () => Promise<T>
): Promise<T> {
  return dbCircuitBreaker.execute(query);
}
```

#### 10.2.3 External Service Failures

```typescript
// Retry with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

// Example: SMS sending with fallback
export async function sendSMS(phone: string, message: string) {
  try {
    // Primary: Twilio
    await retryWithBackoff(() =>
      twilioClient.messages.create({
        to: `+91${phone}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        body: message
      })
    );
  } catch (twilioError) {
    console.error('Twilio failed, falling back to AWS SNS:', twilioError);
    
    try {
      // Fallback: AWS SNS
      await snsClient.publish({
        PhoneNumber: `+91${phone}`,
        Message: message
      });
    } catch (snsError) {
      console.error('Both SMS providers failed:', snsError);
      
      // Log to monitoring
      Sentry.captureException(snsError, {
        tags: { service: 'sms', fallback: 'sns' },
        contexts: {
          phone: { last4: phone.slice(-4) }
        }
      });
      
      throw new AppError(
        ErrorCode.EXTERNAL_SERVICE_ERROR,
        'Failed to send SMS. Please contact support.',
        503
      );
    }
  }
}
```

### 10.3 Idempotency

```typescript
// Idempotency for critical operations
export async function withIdempotency<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  const idempotencyKey = `idempotency:${key}`;
  
  // Check if already processed
  const existing = await redis.get(idempotencyKey);
  if (existing) {
    return JSON.parse(existing) as T;
  }
  
  // Execute function
  const result = await fn();
  
  // Store result
  await redis.setex(idempotencyKey, ttlSeconds, JSON.stringify(result));
  
  return result;
}

// Example: Idempotent order creation
export async function createOrder(orderData: OrderData, idempotencyKey: string) {
  return withIdempotency(
    idempotencyKey,
    async () => {
      // Create order logic
      const order = await prisma.order.create({ data: orderData });
      return order;
    },
    3600 // 1 hour
  );
}
```

---

## 12. Complete Database Schema

### 12.1 Schema Overview

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ============================================
// USER MANAGEMENT
// ============================================

enum UserRole {
  CUSTOMER
  KITCHEN_STAFF
  MANAGER
  SUPER_ADMIN
}

model User {
  id            String   @id @default(uuid())
  phone         String   @unique @db.VarChar(15)
  name          String?  @db.VarChar(100)
  email         String?  @db.VarChar(255)
  role          UserRole @default(CUSTOMER)
  
  // Admin-only fields
  username      String?  @unique @db.VarChar(50)
  passwordHash  String?  @db.VarChar(255)
  totpSecretEncrypted String? @db.Text
  totpIv        String?  @db.VarChar(32)
  totpTag       String?  @db.VarChar(32)
  
  // Razorpay integration
  razorpayCustomerId String? @db.VarChar(100)
  
  // Metadata
  createdAt     DateTime @default(now())
  lastLogin     DateTime?
  deletedAt     DateTime?
  
  // Relations
  orders        Order[]
  subscription  Subscription?
  adminSessions AdminSession[]
  auditLogs     AuditLog[]
  consentRecords ConsentRecord[]
  
  @@index([phone])
  @@index([role, deletedAt])
}

// ============================================
// MENU MANAGEMENT
// ============================================

enum MenuCategory {
  SOUTH_INDIAN
  CHINESE
  SNACKS
  BEVERAGES
  DESSERTS
}

model MenuItem {
  id                      String        @id @default(uuid())
  name                    String        @db.VarChar(100)
  description             String?       @db.Text
  category                MenuCategory
  price                   Decimal       @db.Decimal(10, 2)
  imageUrl                String?       @db.VarChar(500)
  
  // Inventory
  stock                   Int           @default(0)
  reservedStock           Int           @default(0)
  lowStockThreshold       Int           @default(10)
  
  // Availability
  isAvailable             Boolean       @default(true)
  isSubscriptionEligible  Boolean       @default(false)
  
  // Dietary info
  isVegetarian            Boolean       @default(true)
  spiceLevel              Int           @default(0) // 0-5
  
  // Metadata
  createdAt               DateTime      @default(now())
  updatedAt               DateTime      @updatedAt
  
  // Relations
  orderItems              OrderItem[]
  
  @@index([category, isAvailable])
  @@index([isAvailable, stock])
}

// ============================================
// ORDER MANAGEMENT
// ============================================

enum OrderStatus {
  CREATED
  PAYMENT_PENDING
  CONFIRMED
  PREPARING
  READY
  COMPLETED
  CANCELLED
}

enum PaymentMethod {
  CASH
  UPI
  CARD
  SUBSCRIPTION
}

model Order {
  id                    String         @id @default(uuid())
  userId                String?        // Nullable for deleted users
  user                  User?          @relation(fields: [userId], references: [id])
  
  // Order details
  status                OrderStatus    @default(CREATED)
  totalAmount           Decimal        @db.Decimal(10, 2)
  specialInstructions   String?        @db.Text
  
  // Payment
  paymentMethod         PaymentMethod
  paymentId             String?        @db.VarChar(255) // Razorpay payment ID
  refundId              String?        @db.VarChar(255)
  refundStatus          String?        @db.VarChar(50)
  
  // Scheduling
  scheduledFor          DateTime?
  
  // QR Code
  qrCodePayload         String?        @db.Text
  qrCodeSignature       String?        @db.VarChar(255)
  
  // Timestamps
  createdAt             DateTime       @default(now())
  updatedAt             DateTime       @updatedAt
  confirmedAt           DateTime?
  completedAt           DateTime?
  cancelledAt           DateTime?
  
  // Relations
  items                 OrderItem[]
  
  @@index([userId, status])
  @@index([status, createdAt])
  @@index([createdAt(sort: Desc)])
  @@index([paymentId])
}

model OrderItem {
  id                String      @id @default(uuid())
  orderId           String
  order             Order       @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  itemId            String
  item              MenuItem    @relation(fields: [itemId], references: [id])
  
  quantity          Int
  priceAtPurchase   Decimal     @db.Decimal(10, 2)
  
  @@index([orderId])
  @@index([itemId])
}

// ============================================
// SUBSCRIPTION MANAGEMENT
// ============================================

enum PlanType {
  TRIAL
  LIGHT_BITE
  FEAST_FUEL
  TOTAL_WELLNESS
  ULTIMATE
}

model Subscription {
  id                String    @id @default(uuid())
  userId            String    @unique
  user              User      @relation(fields: [userId], references: [id])
  
  // Plan details
  planType          PlanType
  creditsTotal      Int
  creditsUsed       Int       @default(0)
  dailyLimit        Int
  dailyUsed         Int       @default(0)
  
  // Billing
  monthlyPrice      Decimal   @db.Decimal(10, 2)
  anniversaryDay    Int       // Day of month (1-31)
  
  // Lifecycle
  startsAt          DateTime
  expiresAt         DateTime
  isActive          Boolean   @default(true)
  autoRenew         Boolean   @default(true)
  
  // Grace period
  gracePeriodEnd    DateTime?
  
  // Plan changes
  pendingDowngrade  PlanType?
  
  // Payment
  lastPaymentId     String?   @db.VarChar(255)
  lastPaymentAt     DateTime?
  
  // Metadata
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  
  // Relations
  history           SubscriptionHistory[]
  
  @@index([userId, isActive])
  @@index([expiresAt])
  @@index([anniversaryDay])
}

model SubscriptionHistory {
  id              String        @id @default(uuid())
  subscriptionId  String
  subscription    Subscription  @relation(fields: [subscriptionId], references: [id])
  
  action          String        @db.VarChar(50) // CREATED, UPGRADED, DOWNGRADED, RENEWED, CANCELLED
  fromPlan        PlanType?
  toPlan          PlanType?
  amount          Decimal?      @db.Decimal(10, 2)
  
  createdAt       DateTime      @default(now())
  
  @@index([subscriptionId, createdAt])
}

// ============================================
// CART & RESERVATIONS
// ============================================

model CartReservation {
  id              String    @id @default(uuid())
  userId          String
  itemId          String
  quantity        Int
  reservedAt      DateTime  @default(now())
  expiresAt       DateTime  // reservedAt + 5 minutes
  
  @@index([userId, expiresAt])
  @@index([itemId])
}

// ============================================
// PAYMENT RECONCILIATION
// ============================================

model OrphanedPayment {
  id                  String    @id @default(uuid())
  razorpayPaymentId   String    @unique @db.VarChar(255)
  amount              Decimal   @db.Decimal(10, 2)
  userId              String?
  
  // Reconciliation
  errorMessage        String?   @db.Text
  payload             String?   @db.Text
  resolved            Boolean   @default(false)
  refunded            Boolean   @default(false)
  
  // Timestamps
  createdAt           DateTime  @default(now())
  resolvedAt          DateTime?
  
  @@index([resolved, createdAt])
}

// ============================================
// AUTHENTICATION & SESSIONS
// ============================================

model AdminSession {
  id              String    @id @default(uuid())
  adminId         String
  admin           User      @relation(fields: [adminId], references: [id])
  
  sessionToken    String    @unique @db.VarChar(255)
  ipAddress       String?   @db.Inet
  userAgent       String?   @db.Text
  
  createdAt       DateTime  @default(now())
  lastActivity    DateTime  @default(now())
  expiresAt       DateTime
  
  @@index([sessionToken])
  @@index([expiresAt])
  @@index([adminId])
}

// ============================================
// CONSENT MANAGEMENT
// ============================================

enum ConsentPurpose {
  ORDER_PROCESSING
  MARKETING_SMS
  MARKETING_EMAIL
  ANALYTICS
  PERSONALIZATION
}

model ConsentRecord {
  id          String          @id @default(uuid())
  userId      String
  user        User            @relation(fields: [userId], references: [id])
  
  purpose     ConsentPurpose
  grantedAt   DateTime        @default(now())
  withdrawnAt DateTime?
  
  // Metadata
  ipAddress   String?         @db.Inet
  userAgent   String?         @db.Text
  
  @@index([userId, purpose, withdrawnAt])
}

// ============================================
// AUDIT LOGGING
// ============================================

model AuditLog {
  id            String    @id @default(uuid())
  userId        String?
  user          User?     @relation(fields: [userId], references: [id])
  
  action        String    @db.VarChar(100)
  resourceType  String?   @db.VarChar(100)
  resourceId    String?
  
  oldValue      Json?
  newValue      Json?
  
  ipAddress     String?   @db.Inet
  userAgent     String?   @db.Text
  
  createdAt     DateTime  @default(now())
  
  @@index([userId, createdAt(sort: Desc)])
  @@index([action, createdAt(sort: Desc)])
}

// ============================================
// SECURITY & FRAUD DETECTION
// ============================================

model SubscriptionDevice {
  id              String    @id @default(uuid())
  userId          String
  
  fingerprintHash String    @unique @db.VarChar(64)
  ipAddress       String    @db.Inet
  userAgent       String    @db.Text
  
  createdAt       DateTime  @default(now())
  lastSeenAt      DateTime  @default(now())
  
  @@index([userId])
}

model FraudAlert {
  id          String    @id @default(uuid())
  userId      String
  
  reason      String    @db.VarChar(100)
  details     String?   @db.Text
  severity    String    @default("MEDIUM") @db.VarChar(20) // LOW, MEDIUM, HIGH, CRITICAL
  
  reviewed    Boolean   @default(false)
  reviewedBy  String?
  reviewedAt  DateTime?
  
  createdAt   DateTime  @default(now())
  
  @@index([userId, reviewed])
  @@index([severity, reviewed])
}

model SecurityIncident {
  id                  String    @id @default(uuid())
  type                String    @db.VarChar(100)
  affectedUserCount   Int
  dataTypesAffected   String[]
  
  discoveredAt        DateTime
  status              String    @db.VarChar(50) // UNDER_INVESTIGATION, CONTAINED, RESOLVED
  
  notifiedUsers       Boolean   @default(false)
  notifiedAuthorities Boolean   @default(false)
  
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  
  @@index([status, createdAt])
}

// ============================================
// ANALYTICS & REPORTING
// ============================================

model DailyMetrics {
  id                String    @id @default(uuid())
  date              DateTime  @unique @db.Date
  
  // Order metrics
  totalOrders       Int       @default(0)
  cancelledOrders   Int       @default(0)
  completedOrders   Int       @default(0)
  
  // Revenue
  totalRevenue      Decimal   @db.Decimal(12, 2)
  cashRevenue       Decimal   @db.Decimal(12, 2)
  upiRevenue        Decimal   @db.Decimal(12, 2)
  subscriptionRevenue Decimal @db.Decimal(12, 2)
  
  // Customers
  newCustomers      Int       @default(0)
  returningCustomers Int      @default(0)
  
  // Subscriptions
  newSubscriptions  Int       @default(0)
  activeSubscriptions Int     @default(0)
  cancelledSubscriptions Int  @default(0)
  
  // Performance
  avgOrderValue     Decimal?  @db.Decimal(10, 2)
  avgPreparationTime Int?    // seconds
  
  createdAt         DateTime  @default(now())
  
  @@index([date(sort: Desc)])
}

model PopularItem {
  id          String    @id @default(uuid())
  itemId      String
  itemName    String    @db.VarChar(100)
  
  orderCount  Int
  revenue     Decimal   @db.Decimal(12, 2)
  
  periodStart DateTime
  periodEnd   DateTime
  
  createdAt   DateTime  @default(now())
  
  @@index([periodStart, orderCount(sort: Desc)])
}
```

### 12.2 Database Migrations Strategy

```bash
# Initial migration
npx prisma migrate dev --name init

# Add indexes (separate migration)
npx prisma migrate dev --name add_performance_indexes

# Add audit tables
npx prisma migrate dev --name add_audit_tables

# Production deployment
npx prisma migrate deploy
```

### 12.3 Data Retention Policy

| Table | Retention Period | Cleanup Method |
|-------|------------------|----------------|
| `Order` | 7 years | Automated archive to cold storage |
| `OrderItem` | 7 years | Cascade with Order |
| `AuditLog` | 90 days | Automated deletion (cron) |
| `AdminSession` | 30 days | Automated deletion (cron) |
| `CartReservation` | 24 hours | Automated deletion (cron) |
| `OrphanedPayment` | 90 days (after resolution) | Automated deletion |
| `ConsentRecord` | Until account deletion | Manual deletion on request |
| `User` | Until account deletion | Anonymization (not deletion) |

```typescript
// Cleanup cron jobs
export async function cleanupExpiredSessions() {
  await prisma.adminSession.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  });
}

export async function cleanupExpiredReservations() {
  await prisma.cartReservation.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  });
}

export async function archiveOldAuditLogs() {
  const cutoffDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
  
  // Export to cold storage (S3)
  const logs = await prisma.auditLog.findMany({
    where: {
      createdAt: { lt: cutoffDate }
    }
  });
  
  await uploadToS3('audit-logs-archive', logs);
  
  // Delete from database
  await prisma.auditLog.deleteMany({
    where: {
      createdAt: { lt: cutoffDate }
    }
  });
}
```

---

## 14. Testing & Quality Assurance

### 14.1 Testing Strategy

```
Testing Pyramid:
├── E2E Tests (5%) - Critical user journeys
├── Integration Tests (25%) - API endpoints, database operations
└── Unit Tests (70%) - Business logic, utilities
```

**Minimum Coverage Requirements:**
- Overall: 80%
- Critical paths: 100% (payment, inventory, auth)
- API routes: 90%
- Components: 75%

### 14.2 Unit Testing

**Framework:** Jest + React Testing Library

```typescript
// Example: Inventory race condition test
describe('Inventory Management', () => {
  beforeEach(async () => {
    await prisma.menuItem.create({
      data: { id: 'test-item', name: 'Test Dosa', stock: 1, price: 50 }
    });
  });
  
  it('prevents overselling with concurrent checkouts', async () => {
    // Simulate 2 concurrent purchase attempts
    const [result1, result2] = await Promise.allSettled([
      createOrder({
        userId: 'user1',
        items: [{ itemId: 'test-item', quantity: 1 }]
      }),
      createOrder({
        userId: 'user2',
        items: [{ itemId: 'test-item', quantity: 1 }]
      })
    ]);
    
    // Assert: Only 1 should succeed
    const successCount = [result1, result2].filter(r => r.status === 'fulfilled').length;
    expect(successCount).toBe(1);
    
    // Verify final stock
    const item = await prisma.menuItem.findUnique({ where: { id: 'test-item' } });
    expect(item.stock).toBe(0);
  });
  
  it('releases reserved stock after cart expiry', async () => {
    // Add to cart
    await addToCart('test-item', 1, 'user1');
    
    // Verify stock reserved
    let item = await prisma.menuItem.findUnique({ where: { id: 'test-item' } });
    expect(item.reservedStock).toBe(1);
    
    // Wait for expiry + run cleanup
    await sleep(6000); // 6 seconds (reservation expires at 5s)
    await releaseExpiredReservations();
    
    // Verify stock released
    item = await prisma.menuItem.findUnique({ where: { id: 'test-item' } });
    expect(item.reservedStock).toBe(0);
  });
});

// Example: Subscription quota validation
describe('Subscription Quota Management', () => {
  beforeEach(async () => {
    await prisma.subscription.create({
      data: {
        userId: 'user1',
        planType: 'LIGHT_BITE',
        creditsTotal: 30,
        creditsUsed: 28, // 2 remaining
        dailyLimit: 2,
        dailyUsed: 1, // 1 remaining today
        startsAt: new Date(),
        expiresAt: addMonths(new Date(), 1),
        anniversaryDay: new Date().getDate()
      }
    });
  });
  
  it('enforces daily limit', async () => {
    // Try to order 2 meals (exceeds daily limit of 1 remaining)
    await expect(
      validateSubscriptionQuota('user1', ['item1', 'item2'])
    ).rejects.toThrow('Daily limit exceeded');
  });
  
  it('enforces monthly quota', async () => {
    // Update to have 0.5 credits remaining
    await prisma.subscription.update({
      where: { userId: 'user1' },
      data: { creditsUsed: 29.5 }
    });
    
    // Try to order 1 full meal (costs 1 credit, but only 0.5 available)
    await expect(
      validateSubscriptionQuota('user1', ['main-meal-item'])
    ).rejects.toThrow('Insufficient credits');
  });
  
  it('allows snacks with partial credits', async () => {
    // Snacks cost 0.5 credits
    await expect(
      validateSubscriptionQuota('user1', ['snack-item'])
    ).resolves.toBe(true);
  });
});

// Example: Payment webhook validation
describe('Payment Webhook Security', () => {
  const validPayload = {
    event: 'payment.captured',
    payload: {
      payment: {
        entity: {
          id: 'pay_123',
          amount: 10000,
          created_at: Math.floor(Date.now() / 1000),
          notes: { cafe_order_id: 'ord_abc' }
        }
      }
    }
  };
  
  it('rejects webhook with invalid signature', async () => {
    const response = await POST(new Request('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': 'invalid_signature',
        'x-forwarded-for': '43.204.126.65' // Valid Razorpay IP
      },
      body: JSON.stringify(validPayload)
    }));
    
    expect(response.status).toBe(401);
  });
  
  it('rejects webhook from unauthorized IP', async () => {
    const validSignature = generateSignature(validPayload);
    
    const response = await POST(new Request('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': validSignature,
        'x-forwarded-for': '1.2.3.4' // Invalid IP
      },
      body: JSON.stringify(validPayload)
    }));
    
    expect(response.status).toBe(403);
  });
  
  it('rejects old webhook (>5 minutes)', async () => {
    const oldPayload = {
      ...validPayload,
      payload: {
        payment: {
          entity: {
            ...validPayload.payload.payment.entity,
            created_at: Math.floor((Date.now() - 6 * 60 * 1000) / 1000) // 6 minutes ago
          }
        }
      }
    };
    
    const validSignature = generateSignature(oldPayload);
    
    const response = await POST(new Request('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': validSignature,
        'x-forwarded-for': '43.204.126.65'
      },
      body: JSON.stringify(oldPayload)
    }));
    
    expect(response.status).toBe(400);
  });
  
  it('handles duplicate webhook (idempotency)', async () => {
    const validSignature = generateSignature(validPayload);
    
    // First request
    const response1 = await POST(new Request('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': validSignature,
        'x-forwarded-for': '43.204.126.65'
      },
      body: JSON.stringify(validPayload)
    }));
    
    expect(response1.status).toBe(200);
    
    // Duplicate request (should return 200 without processing)
    const response2 = await POST(new Request('http://localhost/api/webhooks/razorpay', {
      method: 'POST',
      headers: {
        'x-razorpay-signature': validSignature,
        'x-forwarded-for': '43.204.126.65'
      },
      body: JSON.stringify(validPayload)
    }));
    
    expect(response2.status).toBe(200);
    
    // Verify order was only created once
    const orders = await prisma.order.findMany({
      where: { payment_id: 'pay_123' }
    });
    expect(orders.length).toBe(1);
  });
});
```

### 14.3 Integration Testing

**Framework:** Playwright for E2E

```typescript
// tests/e2e/order-flow.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Complete Order Flow', () => {
  test('customer can browse, order, and receive food', async ({ page }) => {
    // 1. Land on homepage
    await page.goto('https://app.cafesouthcentral.com');
    await expect(page.locator('h1')).toContainText('Cafe South Central');
    
    // 2. Click "Order Now"
    await page.click('text=Order Now');
    
    // 3. Login with OTP
    await page.fill('input[name="phone"]', '9876543210');
    await page.fill('input[name="name"]', 'Test User');
    await page.click('button:has-text("Send OTP")');
    
    // Wait for OTP input (in test env, use test OTP: 123456)
    await page.waitForSelector('input[name="otp"]');
    await page.fill('input[name="otp"]', '123456');
    await page.click('button:has-text("Verify")');
    
    // 4. Browse menu
    await expect(page).toHaveURL('/menu');
    await expect(page.locator('.menu-item')).toHaveCount.greaterThan(0);
    
    // 5. Add item to cart
    await page.click('.menu-item:first-child button:has-text("Add to Cart")');
    await expect(page.locator('.cart-badge')).toContainText('1');
    
    // 6. Open cart
    await page.click('[aria-label="Cart"]');
    await expect(page.locator('.cart-drawer')).toBeVisible();
    
    // 7. Proceed to checkout
    await page.click('button:has-text("Checkout")');
    
    // 8. Select pickup time (ASAP)
    await page.click('input[value="ASAP"]');
    
    // 9. Choose payment method (Cash)
    await page.click('input[value="CASH"]');
    
    // 10. Place order
    await page.click('button:has-text("Place Order")');
    
    // 11. Verify order confirmation
    await expect(page).toHaveURL(/\/orders\/ord_/);
    await expect(page.locator('.order-status')).toContainText('Confirmed');
    
    // 12. Verify QR code is present
    await expect(page.locator('img[alt="Order QR Code"]')).toBeVisible();
    
    // 13. Check order status updates (mock WebSocket)
    await page.evaluate(() => {
      window.mockStatusUpdate('PREPARING');
    });
    await expect(page.locator('.order-status')).toContainText('Preparing');
  });
  
  test('handles sold out items gracefully', async ({ page }) => {
    // Mock API to return sold out item
    await page.route('**/api/menu', route => {
      route.fulfill({
        status: 200,
        body: JSON.stringify({
          success: true,
          items: [{
            id: 'item_123',
            name: 'Sold Out Dosa',
            stock: 0,
            isAvailable: false
          }]
        })
      });
    });
    
    await page.goto('https://app.cafesouthcentral.com/menu');
    
    // Verify item shows as sold out
    const soldOutItem = page.locator('.menu-item:has-text("Sold Out Dosa")');
    await expect(soldOutItem.locator('.badge-sold-out')).toBeVisible();
    
    // Verify add to cart button is disabled
    await expect(soldOutItem.locator('button')).toBeDisabled();
  });
  
  test('subscription user can order without payment', async ({ page, context }) => {
    // Mock user with active subscription
    await context.addCookies([{
      name: 'session_token',
      value: 'test_session_with_subscription',
      domain: 'app.cafesouthcentral.com',
      path: '/'
    }]);
    
    await page.goto('https://app.cafesouthcentral.com/menu');
    
    // Verify subscription badge visible
    await expect(page.locator('.subscription-badge')).toBeVisible();
    await expect(page.locator('.subscription-badge')).toContainText('2/3 meals remaining');
    
    // Add item to cart
    await page.click('.menu-item:first-child button:has-text("Add to Cart")');
    
    // Checkout
    await page.click('[aria-label="Cart"]');
    await page.click('button:has-text("Checkout")');
    
    // Verify payment step is skipped
    await expect(page.locator('text=Payment Method')).not.toBeVisible();
    
    // Place order directly
    await page.click('button:has-text("Place Order")');
    
    // Verify order created
    await expect(page).toHaveURL(/\/orders\/ord_/);
  });
});
```

### 14.4 Performance Testing

**Tool:** K6 (already configured in Section 11.5)

**Test Scenarios:**
1. **Smoke Test:** 10 VUs for 1 minute (baseline)
2. **Load Test:** 100 VUs for 10 minutes (average traffic)
3. **Stress Test:** Ramp to 500 VUs over 20 minutes (peak load)
4. **Spike Test:** 0 → 1000 VUs in 1 minute (sudden spike)
5. **Soak Test:** 200 VUs for 2 hours (memory leaks, stability)

**Pre-Launch Checklist:**
- [ ] All smoke tests pass (0% error rate)
- [ ] Load test P95 latency < 500ms
- [ ] Stress test error rate < 1%
- [ ] Spike test recovers within 2 minutes
- [ ] Soak test shows no memory leaks
- [ ] Database connections stay below 50
- [ ] No deadlocks or timeout errors

### 14.5 Security Testing

**Pre-Launch Security Audit:**

```bash
# 1. OWASP ZAP Automated Scan
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://app.cafesouthcentral.com \
  -r security-report.html

# 2. Dependency Vulnerability Scan
npm audit
snyk test

# 3. SQL Injection Test (manual)
# Try injecting in all user inputs:
# - Phone: 9876543210' OR '1'='1
# - OTP: 123456' UNION SELECT * FROM users--
# - Order ID: ord_123'; DROP TABLE orders;--

# 4. XSS Test
# Try injecting in special instructions:
# <script>alert('XSS')</script>

# 5. CSRF Test
# Remove CSRF token from request, verify rejection

# 6. Rate Limiting Test
for i in {1..10}; do
  curl -X POST https://app.cafesouthcentral.com/api/auth/send-otp \
    -H "Content-Type: application/json" \
    -d '{"phone":"9876543210"}'
done
# Verify: Request #4 should return 429
```

**Security Checklist:**
- [ ] All high-severity issues from OWASP ZAP resolved
- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] CSRF protection working on all POST/PUT/DELETE
- [ ] Rate limiting enforced on all endpoints
- [ ] Secrets not exposed in client-side code
- [ ] HTTPS enforced (no HTTP)
- [ ] Security headers set (HSTS, CSP, X-Frame-Options)
- [ ] Session tokens in HTTP-only cookies
- [ ] Passwords hashed with Argon2
- [ ] OTPs hashed with bcrypt
- [ ] PII encrypted at rest

---

## 15. Monitoring & Observability

### 15.1 Monitoring Stack

**Components:**
- **Error Tracking:** Sentry
- **Performance:** Datadog APM
- **Logs:** Better Stack (Logtail)
- **Uptime:** UptimeRobot
- **Real User Monitoring:** Datadog RUM

### 15.2 Sentry Configuration

```typescript
// sentry.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Performance monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Profiling
  profilesSampleRate: 0.1,
  
  // Environment
  environment: process.env.NODE_ENV,
  release: process.env.VERCEL_GIT_COMMIT_SHA,
  
  // Error filtering
  beforeSend(event, hint) {
    // Don't send PII
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers?.['authorization'];
      delete event.request.headers?.['cookie'];
    }
    
    // Filter out known noise
    if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
      return null;
    }
    
    return event;
  },
  
  // Breadcrumbs
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['app.cafesouthcentral.com', /^\//],
    }),
    new Sentry.Replay({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
  
  // Session replay (on errors only)
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 1.0,
});
```

### 15.3 Datadog Configuration

```typescript
// datadog.config.ts
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: process.env.NEXT_PUBLIC_DATADOG_APP_ID,
  clientToken: process.env.NEXT_PUBLIC_DATADOG_CLIENT_TOKEN,
  site: 'datadoghq.com',
  service: 'cafe-south-central',
  env: process.env.NODE_ENV,
  version: process.env.VERCEL_GIT_COMMIT_SHA,
  
  // Performance monitoring
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  
  // Privacy
  defaultPrivacyLevel: 'mask-user-input',
  
  // Custom tags
  beforeSend: (event) => {
    if (event.type === 'view') {
      event.context.user_role = window.localStorage.getItem('user_role');
    }
    return event;
  }
});
```

### 15.4 Alert Configuration

```yaml
# alerts.yaml

alerts:
  # P0: Page Immediately
  - name: Order Creation Failure Spike
    query: "error_rate{service:cafe-api,endpoint:/api/orders/create} > 0.05"
    window: 5m
    channels: [pagerduty, slack-critical, sms]
    severity: P0
    
  - name: Payment Webhook Failure
    query: "error_rate{service:cafe-api,endpoint:/api/webhooks/razorpay} > 0.02"
    window: 1m
    channels: [pagerduty, slack-critical, sms]
    severity: P0
    
  - name: Database Connection Pool Exhausted
    query: "db.connections.active >= 50"
    window: 1m
    channels: [pagerduty, slack-critical]
    severity: P0
    
  - name: Application Down
    query: "http.response.status_code{service:cafe-api} == 500"
    threshold: "> 10 errors in 1 minute"
    channels: [pagerduty, slack-critical, sms]
    severity: P0
    
  # P1: Alert Immediately (Slack)
  - name: High API Latency
    query: "p95{service:cafe-api} > 1000"
    window: 5m
    channels: [slack-alerts]
    severity: P1
    
  - name: Stock Sync Delay
    query: "inventory.sync.delay > 30"
    window: 5m
    channels: [slack-alerts]
    severity: P1
    
  - name: SMS Delivery Failure Rate High
    query: "sms.failure_rate > 0.1"
    window: 5m
    channels: [slack-alerts]
    severity: P1
    
  # P2: Warning (Slack, no page)
  - name: Low Stock Items
    query: "count(menu_item.stock < 10 AND menu_item.is_available == true) > 5"
    window: 10m
    channels: [slack-warnings]
    severity: P2
    
  - name: High Cart Abandonment Rate
    query: "cart.abandonment_rate > 0.7"
    window: 30m
    channels: [slack-warnings]
    severity: P2
```

### 15.5 Dashboards

**Operations Dashboard (Real-Time):**
- Active orders by status (pie chart)
- Orders per minute (line chart)
- Average preparation time (gauge)
- Current stock levels (bar chart)
- Active sessions (counter)
- Payment success rate (gauge)

**Business Dashboard (Daily):**
- Daily revenue (bar chart)
- New vs returning customers (stacked bar)
- Top 10 items by revenue (table)
- Subscription conversions (funnel)
- Cancellation rate (line chart)

**Technical Dashboard:**
- API latency (P50, P95, P99)
- Error rate by endpoint
- Database query performance
- Cache hit rate
- Server resource usage (CPU, memory)
- WebSocket connection count

### 15.6 Logging Strategy

```typescript
// Structured logging with context
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => {
      return { level: label };
    },
  },
  redact: {
    paths: ['phone', 'email', 'password', 'otp', 'sessionToken'],
    remove: true
  }
});

// Usage
logger.info({
  action: 'ORDER_CREATED',
  orderId: 'ord_123',
  userId: 'usr_abc',
  totalAmount: 120,
  paymentMethod: 'UPI',
  duration: 543 // ms
}, 'Order created successfully');

logger.error({
  action: 'PAYMENT_FAILED',
  orderId: 'ord_123',
  error: err.message,
  stack: err.stack
}, 'Payment processing failed');
```

---

## 16. Deployment & Infrastructure

### 16.1 Environment Strategy

**Environments:**
1. **Development** - Local developer machines
2. **Staging** - Pre-production (Vercel preview deployments)
3. **Production** - Live application

### 16.2 Deployment Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, staging]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run linter
        run: npm run lint
        
      - name: Run type check
        run: npm run type-check
        
      - name: Run unit tests
        run: npm run test:unit
        
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
          
  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/staging'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel (Staging)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--env staging'
          
      - name: Run E2E tests
        run: npm run test:e2e
        env:
          BASE_URL: ${{ steps.deploy.outputs.preview-url }}
          
  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          
      - name: Notify Slack
        run: |
          curl -X POST ${{ secrets.SLACK_WEBHOOK_URL }} \
            -H 'Content-Type: application/json' \
            -d '{"text":"🚀 Production deployment successful: ${{ github.sha }}"}'
```

### 16.3 Database Migration Strategy

```bash
# Development
npx prisma migrate dev --name add_subscription_features

# Staging
npx prisma migrate deploy

# Production (zero-downtime)
# 1. Create migration file
npx prisma migrate dev --create-only --name add_indexes

# 2. Review migration file
# 3. Test on staging
# 4. Schedule maintenance window OR use online schema change tool
# 5. Deploy during low-traffic period (3 AM IST)
```

### 16.4 Rollback Procedure

```bash
# Vercel rollback (instant)
vercel rollback https://cafe-south-central-abc123.vercel.app

# Database rollback (manual)
# 1. Identify last good migration
npx prisma migrate resolve --rolled-back 20260201120000_bad_migration

# 2. Apply previous version
npx prisma migrate deploy

# 3. Verify application works
curl https://app.cafesouthcentral.com/api/health
```

### 16.5 Backup Strategy

**Database Backups:**
- **Frequency:** Daily at 2 AM IST
- **Retention:** 30 days (daily), 12 months (monthly)
- **Storage:** AWS S3 (encrypted)
- **Recovery Time Objective (RTO):** < 4 hours
- **Recovery Point Objective (RPO):** 24 hours

```bash
# Automated backup script (runs via cron)
#!/bin/bash

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="cafe_db_backup_${DATE}.sql"

# Dump database
pg_dump $DATABASE_URL > $BACKUP_FILE

# Compress
gzip $BACKUP_FILE

# Upload to S3
aws s3 cp ${BACKUP_FILE}.gz s3://cafe-backups/database/

# Cleanup local file
rm ${BACKUP_FILE}.gz

# Verify backup integrity
aws s3 ls s3://cafe-backups/database/${BACKUP_FILE}.gz
```

### 16.6 Infrastructure as Code

```terraform
# infrastructure/main.tf

terraform {
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.15"
    }
    supabase = {
      source  = "supabase/supabase"
      version = "~> 1.0"
    }
  }
}

provider "vercel" {
  token = var.vercel_token
}

resource "vercel_project" "cafe_app" {
  name      = "cafe-south-central"
  framework = "nextjs"
  
  environment = [
    {
      key    = "DATABASE_URL"
      value  = var.database_url
      target = ["production"]
    },
    {
      key    = "RAZORPAY_KEY_ID"
      value  = var.razorpay_key_id
      target = ["production"]
    }
  ]
}

resource "vercel_deployment" "production" {
  project_id = vercel_project.cafe_app.id
  production = true
}
```

---

## 17. Future Roadmap

### Phase 1: MVP (Months 1-2) ✅
- [x] Customer authentication (OTP)
- [x] Menu browsing
- [x] Order placement (Cash/UPI)
- [x] Admin dashboard
- [x] Inventory management
- [x] Subscription plans

### Phase 2: Enhancements (Months 3-4)
- [ ] Push notifications (Web Push API)
- [ ] Email receipts (Resend integration)
- [ ] Advanced analytics dashboard
- [ ] Customer feedback system
- [ ] Referral program
- [ ] Promo codes & discounts

### Phase 3: Scale (Months 5-6)
- [ ] Multi-location support
- [ ] Table reservations
- [ ] Dine-in menu (separate from takeaway)
- [ ] Kitchen display system (dedicated hardware)
- [ ] Staff scheduling module
- [ ] Supplier management

### Phase 4: AI & Automation (Months 7-9)
- [ ] AI-powered menu recommendations
- [ ] Demand forecasting
- [ ] Automated inventory reordering
- [ ] Chatbot for customer support
- [ ] Voice ordering integration
- [ ] Dynamic pricing based on demand

### Phase 5: Expansion (Months 10-12)

- [ ] Franchise management portal
- [ ] White-label solution for other cafes
- [ ] Mobile app (React Native)
- [ ] Loyalty points program
- [ ] Gift cards

---

## 18. Appendices

### Appendix A: Glossary

| Term | Definition |
|------|------------|
| **Artifact** | Self-contained code output (HTML, React, SVG) |
| **DPDP Act** | Digital Personal Data Protection Act, 2023 (India) |
| **Idempotency** | Operation that produces same result regardless of repetition |
| **Orphaned Payment** | Payment captured but order not created |
| **Pro-rata** | Proportional billing for partial billing period |
| **PWA** | Progressive Web App (installable web app) |
| **RBAC** | Role-Based Access Control |
| **SLA** | Service Level Agreement (performance targets) |
| **TOTP** | Time-based One-Time Password (2FA) |

### Appendix B: Environment Variables

```bash
# .env.example

# Database
DATABASE_URL="postgresql://user:pass@host:5432/cafe_db?pgbouncer=true"
DIRECT_URL="postgresql://user:pass@host:5432/cafe_db"

# Redis
REDIS_URL="redis://default:pass@host:6379"

# Razorpay
RAZORPAY_KEY_ID="rzp_live_..."
RAZORPAY_KEY_SECRET="..."
RAZORPAY_WEBHOOK_SECRET="..."

# Twilio
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+1234567890"

# AWS (S3, SNS fallback)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="ap-south-1"
AWS_S3_BUCKET="cafe-uploads"

# Encryption
ENCRYPTION_KEY="32-byte-hex-string"

# Session
SESSION_SECRET="32-byte-hex-string"

# Monitoring
SENTRY_DSN="https://...@sentry.io/..."
NEXT_PUBLIC_DATADOG_APP_ID="..."
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN="..."

# Feature Flags
NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS="true"
NEXT_PUBLIC_ENABLE_WEB_PUSH="false"
```

### Appendix C: Third-Party Services

| Service | Purpose | Plan | Monthly Cost |
|---------|---------|------|--------------|
| Vercel | Hosting | Hobby → Pro | $0 → $20 |
| Supabase | Database | Pro | $25 |
| Upstash | Redis | Pay-as-you-go | $5 |
| Razorpay | Payments | Pay-per-transaction | 2% of GMV |
| Twilio | SMS (Primary) | Pay-as-you-go | ₹0.15/SMS |
| AWS SNS | SMS (Fallback) | Pay-as-you-go | ₹0.10/SMS |
| Sentry | Error tracking | Team | $26 |
| Datadog | APM & Monitoring | Pro | $31 |
| Better Stack | Logging | Basic | $15 |
| **Total** | | | **~$127/month** |

### Appendix D: Success Criteria

**Launch Criteria (Must achieve before going live):**
- [ ] 100% uptime on staging for 7 consecutive days
- [ ] All P0 alerts tested and working
- [ ] Load test passes with 1000 concurrent users
- [ ] Security audit completed with no high-severity issues
- [ ] DPDP Act compliance verified by legal team
- [ ] Disaster recovery tested (backup restoration < 4 hours)
- [ ] Payment reconciliation tested with real Razorpay account
- [ ] 10 beta users complete full order cycle successfully

**Month 1 Success Metrics:**
- 100+ active customers
- 50+ orders per day
- 10+ subscription signups
- <1% order error rate
- 99% uptime
- <5 support tickets per day

**Month 3 Success Metrics:**
- 500+ active customers
- 200+ orders per day
- 50+ active subscriptions
- <0.5% order error rate
- 99.5% uptime
- 30% repeat customer rate

**Month 6 Success Metrics:**
- 1,000+ active customers
- 500+ orders per day
- 100+ active subscriptions
- ₹3,00,000 monthly revenue
- 50% of orders via subscription
- 4.5+ customer satisfaction score

---

## Document Sign-Off

**By signing below, stakeholders acknowledge they have reviewed this PRD and agree with the specifications, scope, and success criteria.**

| Stakeholder | Role | Signature | Date |
|-------------|------|-----------|------|
| _____________ | Product Owner | _________ | ______ |
| _____________ | Tech Lead | _________ | ______ |
| _____________ | Security Lead | _________ | ______ |
| _____________ | QA Lead | _________ | ______ |
| _____________ | Legal/Compliance | _________ | ______ |
| _____________ | Finance | _________ | ______ |

---

**End of Document**  
**Version:** 3.0 (Production-Ready)  
**Total Pages:** 85  
**Last Updated:** February 1, 2026  
**Next Review:** March 1, 2026
