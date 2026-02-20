# ☕ Cafe South Central - Master UI/UX & Design Specification v2.0
**Last Updated:** February 18, 2026
**Version:** 2.0 (Current Production State)

This document serves as the **Single Source of Truth** for the User Interface, User Experience, and Technical Design of the Cafe South Central Web App. It has been updated to reflect the active codebase, including the new color palette, typography, and feature set.

---

## 1. 🎨 Design System & Aesthetics

**Core Philosophy:** "Tropical Heritage & Modern Speed"
*   **Tropical Heritage:** Using coconut browns, palm greens, and sand beiges to evoke a warm, coastal cafe vibe.
*   **Modern Speed:** A snappy, responsive interface with optimistic UI updates and smooth transitions.

### Color Palette (Official)
Derived from `tailwind.config.ts` and `globals.css`.

| Role | Color Name | Hex Code | Usage |
| :--- | :--- | :--- | :--- |
| **Primary Brand** | **Coconut Brown** | `#5C3A1A` | Primary buttons, Active states, Headings, Strong Borders. |
| **Secondary Brand** | **Palm Green (Dark)** | `#005001` | Secondary accents, Toggle switches (active), "Vegetarian" indicators. |
| **Accent / Highlight** | **Tropical Yellow** | `#F4D03F` / `#ffc107` | Ratings, Medals, "Popular" badges, Click Spark animations. |
| **Background (Main)** | **Sand Beige** | `#f8fbf7` | Main page background, Cards (light mode alternative). |
| **Surface** | **Pure White** | `#FFFFFF` | Cards, Modals, Sticky Headers, Dropdowns. |
| **Text (primary)** | **Charcoal Black** | `#1F1F1F` | Main body text. |
| **Text (secondary)** | **Gray 600** | `#4B5563` | Descriptions, metadata. |
| **Success** | **Emerald Green** | `#166534` | "100% Fresh", Success Toasts. |
| **Error / Action** | **Red** | `#ef4444` | "Sold Out" badges, Error states, Destructive actions. |

### Typography
*   **Headings:** **Playfair Display** (Serif)
    *   *Usage:* Page Titles ("Our Full Menu"), Section Headers ("South Indian Classics").
    *   *Weight:* 700 (Bold) / 900 (Black).
*   **Body / UI:** **Work Sans** (Sans-Serif)
    *   *Usage:* Menu item descriptions, buttons, prices, navigation.
    *   *Weight:* 400 (Regular) / 600 (Semi-Bold).

### Visual Language
*   **Shapes:**
    *   **Cards:** `rounded-3xl` (Large, friendly corners).
    *   **Buttons:** `rounded-xl` or `rounded-full` (Pill shape).
    *   **Organic Blobs:** CSS-based morphed border-radius shapes for background decoration.
*   **Borders:**
    *   **Decorative Border Overlay:** A fixed pointer-events-none PNG border (`Border.png`, `Layer 5.png`) framing the entire viewport.
*   **Motion & Interaction:**
    *   **Click Spark:** Gold particle explosion on click anywhere on the screen.
    *   **Floating Elements:** CSS animations (`animate-float-slow`) for food images.
    *   **Hover Effects:** Cards lift (`-translate-y-2`) and cast deeper shadows (`shadow-2xl`).
    *   **Toast Notifications:** Uses `sonner` for rich, colored alerts (Success/Error).

---

## 2. 💻 Technology Stack

*   **Frontend:** Next.js 14 (App Router), React 18.
*   **Styling:** Tailwind CSS, CSS Modules (for specific animations like `globals.css`).
*   **State Management:** React Context (`CartContext`).
*   **Icons:** Lucide React (`Plus`, `Minus`, `Search`, `ShoppingBag`).
*   **Database:** PostgreSQL (via Prisma ORM).
*   **Authentication:** Custom OTP-based auth (Phone Number) + Role-based Access Control (RBAC).

---

## 3. 📱 Application Structure & Active Features

### A. Client Facing (Customer App)

#### 1. Landing / Menu Page (`src/app/page.tsx`)
*   **Structure:** Single-page smooth scroll experience.
*   **Hero Section:**
    *   "Our Full Menu" Heading (Playfair Display).
    *   Search Bar (Mobile optimized).
*   **Sticky Category Nav:**
    *   Pill-shaped buttons (`All`, `South Indian`, `Beverages`, etc.) that stick to the top below the header (`top-[86px]`).
    *   Smooth scrolls to the respective section.
*   **Menu Grid:**
    *   **Cards:** Display Image (with fallback logic), Name, Price, Description.
    *   **Actions:** "Add to Cart" (transforms into Qty Stepper `[-] 1 [+]`).
    *   **Stock Logic:** Displays "Sold Out" badge if `stock === 0`.
*   **Floating Elements (Mobile):**
    *   **Category FAB:** Floating Action Button to quickly switch categories without scrolling back up.
    *   **Sticky Cart Summary:** Bottom bar showing "X Items | ₹Total -> View Cart".

#### 2. Cart & Checkout (`src/components/ordering/CartDrawer.tsx`)
*   **UI Pattern:** Side Drawer (Right) on Desktop / Bottom Sheet on Mobile.
*   **Features:**
    *   List of added items with Qty controls.
    *   **Subscription Handling:** Checks if user has an active plan (e.g., "Feast & Fuel") and applies member logic.
    *   **Checkout:** Seamless "Slide to Pay" or "Place Order" button.

#### 3. Subscription Page (`src/app/subscription/page.tsx`)
*   **Views:**
    *   **Guest:** Shows Pricing Plans (Ultimate, Feast & Fuel, Light Bite).
    *   **Member:** Shows "Member Dashboard" with remaining credits, validity, and savings.
*   **Theme:** Supports Dark Mode toggle specifically for this section.

#### 4. Login System
*   **Modal:** Glassmorphism overlay.
*   **Method:** Phone Number + OTP.
*   **Roles:** Admin (redirects to dashboard), Customer (stays on menu).

---

### B. Admin Dashboard (`src/app/admin`)

#### 1. Dashboard Active Features
*   **Live Orders:** Real-time view of incoming orders with status toggles (Pending -> Preparing -> Ready).
*   **Menu Management:** Add/Edit items, adjust prices.
*   **Stock Control:** Quick toggles for "In Stock" / "Out of Stock".

---

## 4. 🗑️ Deprecated / Removed Features
*   **User Feedback Section:** The dedicated "Feedback" section in the user profile has been removed from the core UI flow.
*   **Old Color Names:** "Deep Brown" and "Emerald Green" are now specifically "Coconut Brown" and a darker "Palm Green".

---

## 5. 📂 Key Directories
*   `src/app/globals.css`: Contains custom animations (Float, Rotate) and Color Variables.
*   `src/components/ui`: Reusable primitives (Buttons, Cards).
*   `src/components/ordering`: Core ordering logic (CartDrawer, Menu Items).
*   `src/context/CartContext.tsx`: Global state for the shopping cart.
