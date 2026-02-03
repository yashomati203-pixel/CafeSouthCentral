# ☕ Cafe South Central - Master UI/UX & Design Specification

This document serves as the **Single Source of Truth** for the User Interface, User Experience, and Technical Design of the Cafe South Central Web App (Version 1). It consolidates all design aesthetics, tech stack details, and page requirements.

---

## 1. 🎨 Design System & Aesthetics

**Core Philosophy:** "Warm Luxury & Modern Speed"
*   **Warm Luxury:** Using deep earth tones to evoke tradition and quality.
*   **Modern Speed:** A snappy, responsive interface that feels like a native app.

### Color Palette
| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | **Deep Brown** | `#5C3A1A` | Primary buttons, Active states, Headers, Accents. |
| **Background** | **Warm Cream / Soft Gray** | `#f9fafb` (Light) / `#fefaef` (Warm) | Main application background (Canvas). |
| **Surface** | **Pure White** | `#ffffff` | Cards, Panels, Modals, Sidebar. |
| **Success** | **Emerald Green** | `#10b981` | Stock available, Order Success, "Ready" status. |
| **Error / Action** | **Red** | `#ef4444` | Delete, Out of Stock, Error states. |
| **Highlight** | **Gold / Yellow** | *Gradient* | Bestseller medals, "Popular" badges. |
| **Text (Main)** | **Dark Gray** | `#1f2937` | Primary text. |
| **Text (Muted)** | **Medium Gray** | `#6b7280` | Secondary text, placeholders. |

### Typography
*   **Font Family:** **Inter**, **Outfit**, or System Sans-Serif., Californian FB
*   **Style:** Clean, modern, high legibility.
*   **Headings:** Bold, dark, often using the Primary Brand color.

### Visual Language
*   **Shapes:** Generous rounded corners (`rounded-xl` or `rounded-2xl`) for a friendly, modern feel.
*   **Depth:** Soft, deep shadows (`shadow-lg`) to lift cards off the background.
*   **Motion:**
    *   **Ripple Effects:** On all clickable elements.
    *   **Transitions:** Smooth hover states (`duration-200`).
    *   **Page Transitions:** Framer Motion for complex state changes (e.g., Cart drawer).
*   **Dark Mode:** Fully supported, switching backgrounds to dark grays and text to off-white.

---

## 2. 💻 Technology Stack

*   **Frontend Framework:** Next.js 14 (App Router), React 18.
*   **Language:** TypeScript.
*   **Styling:** Tailwind CSS, CSS Modules.
*   **Icons:** Lucide Icons.
*   **UI Libraries:** Radix UI (Headless primitives), Framer Motion (Animations), `next-pwa` (Offline support).
*   **Backend:** Next.js API Routes (Serverless Functions).
*   **Database:** PostgreSQL (via Supabase or Neon).
*   **ORM:** Prisma.

---

## 3. 📱 Application Structure & Page Requirements

### A. Customer App (Client Facing)

#### 1. Landing Page (Home)
*   **Goal:** Wow the user and drive immediate action.
*   **Key Components:**
    *   **Hero Section:** Cinematic video or parallax food image with bold headline ("Taste of Tradition, Speed of Now"). floating "Explore Menu" CTA.
    *   **How It Works:** 3-Step Visual Guide (Order -> Cook -> Enjoy) with SVG icons.
    *   **Bestsellers Ticker:** Horizontal scroll of top 3 items with medals (🥇🥈🥉).
    *   **Login Modal:** Glassmorphism overlay for Name + Phone entry (Passwordless).

#### 2. Digital Menu & Catalog
*   **Goal:** Fast product discovery.
*   **Layout:**
    *   **Category Filter:** "Pill-style" horizontal scroll (Sticky top).
    *   **Item Grid:** 2-column (mobile) or 3-column (desktop).
*   **Item Card Features:**
    *   Name & Description.
    *   Price (Dynamic: ₹ for Normal vs "Included" for Subscribers).
    *   **Live Stock:** "Running Out" badge vs Grayed out "Sold Out".
    *   **Add Button:** Smart counter.

#### 3. Subscription Page
*   **Goal:** Upsell meal plans with clear value propositions.
*   **Plan Hierarchy:**
    1.  **Ultimate Plan (Hero):** ₹9,999/mo (Unlimited Meals + Sips + Snacks). "Save 50%".
    2.  **Meal Plans (Grid):**
        *   **Light Bite Pass:** ₹2,599 (30 Coupons).
        *   **Feast & Fuel:** ₹4,499 (60 Coupons).
        *   **Total Wellness:** ₹5,999 (90 Coupons).
    3.  **Add-On:** Hot Sips + SnacknMunch (₹1,299).
    4.  **First-Timer:** 1-Week Trial (₹1,299) + 1 day free snacks.
*   **Content:** Pricing, Validity (30 + 5 days grace), "Save X%" badges.

#### 4. Cart & Checkout (The Core Engine)
*   **UI Pattern:** Sidebar Drawer (Desktop) / Bottom Slide-up (Mobile).
*   **Features:**
    *   **Mixed Carts:** Handle both Paid implementation and Subscription Quota items simultaneously.
    *   **Validation:** Real-time quota check (e.g., "Daily limit reached").
    *   **Scheduling:** "ASAP" vs Time Slot Picker (Next 8 hours).
    *   **Payment:** Multiple modes (Cash, UPI, Scan & Pay) for paid items.
*   **Confirmation:** Full-screen animation (WebM) -> Generates Order Token (QR Code).

#### 5. User Profile & Feedback
*   **Profile Features:**
    *   **Active Plan:** Large card showing remaining quota/days.
    *   **Order History:** List of past orders with "Reorder" button.
    *   **Wallet:** Balance display.
*   **Feedback System:**
    *   **Submission:** Modal with Star Rating (1-5) + Text Comment.
    *   **Entry Point:** User dropdown or Post-Order prompt.

---

### B. Admin Dashboard (Command Center)

#### 1. Live Orders Dashboard
*   **Layout:** Vertical Sidebar Navigation (Dashboard, POS, Members, Stock, Analytics).
*   **Order Queue:** Kanban or Grid.
*   **Visual Urgency:**
    *   🟢 Low (Recent)
    *   🟡 Medium (>10 warned)
    *   🔴 High (>20 min) - Pulsing.
*   **Actions:** 1-Tap Status Update (Received -> Preparing -> Ready).

#### 2. Admin POS (Point of Sale)
*   **Layout:** 2-Column Split (Left: Menu, Right: Cart).
*   **Experience:** High-speed counter ordering.
*   **Features:**
    *   **Instant Search:** Keyboard optimized.
    *   **Auto-Trigger:** KOT printing on success.

#### 3. Stock Management
*   **Layout:** List/Grid.
*   **Interaction:** Simple Toggle Switches (In Stock / Out of Stock) or Quick +/- Counter.
*   **Feedback:** Updates customer menu immediately.

#### 4. Analytics & Reports
*   **Charts:** Sales Trends, Popular Items.
*   **Actions:** Download CSV Report (Daily/Monthly).
* **Graphs:**
    * **Sales Trends:** Line graph showing sales over time.
    * **Popular Items:** Bar chart showing top 10 items.
    * **Customer Demographics:** Pie chart showing age distribution.
    * **Feedback Distribution:** Donut chart showing rating distribution.
#### 5. Feedback Management
*   **View:** Feed/Timeline style.
*   **Content:** User Name, Star Rating, Comment, Date.
*   **Filter:** By rating (e.g., "Needs Attention").

---

### C. Kitchen Operations

#### 1. QR Scanner
*   **Device:** Mobile/Tablet with Camera.
*   **Flow:** Scan Customer QR -> Identify Order -> Mark as Picked Up -> Success Sound.

---

## 4. ⚡ UX & Interaction Patterns

1.  **Optimistic UI:** Admin actions (like "Mark Ready") update the UI immediately while the server processes the request.
2.  **Sound Design:**
    *   "Ding" for new incoming orders (Admin).
    *   "Cha-ching" for successful checkout (User).
3.  **Offline First (PWA):**
    *   App installs to home screen.
    *   Assets cached via Service Worker.
    *   **Future:** Offline QR Code generation for orders when internet is down.
4.  **Feedback:**
    *   Toast notifications for all actions (Add to cart, Success, Error).
    *   Skeleton loaders instead of spinners.

---

## 5. 📂 Project Structure

*   **/src/app**: Next.js App Router pages.
*   **/src/components/ui**: Reusable design system components (Buttons, Cards).
*   **/src/lib**: Utilities (Prisma, Helpers).
*   **/public**: Static assets (Images, Manifest).

---
