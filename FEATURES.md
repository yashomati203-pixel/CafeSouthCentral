# ☕ Cafe South Central - Feature Documentation

This document provides a comprehensive overview of the features implemented in the **Cafe South Central** web application (Version 1). The application handles end-to-end cafe operations including ordering, payments, subscriptions, and kitchen management.

---

## 📱 User Interface & Experience (Client Side)

### 1. **Authentication & Profiles**
- **Simplified Login**: Users can log in using just their **Name** and **Phone Number**.
- **Persistent Session**: Keeps users logged in across efficient reloads using local/session storage.
- **Role-Based Access**:
  - **Customer**: Access to standard menu and ordering.
  - **Admin**: Redirects to the Admin Command Center.
- **Membership Detection**: Automatically detects if a user has an active subscription and unlocks exclusive modes.

### 2. **Digital Menu & Catalog**
- **Categorized Display**: Menu items are organized into clear categories (e.g., South Indian, Dosa, Rice, Beverages).
- **Fast Filtering**: "Pill-style" filter buttons allow quick navigation between food categories.
- **Smart Item Cards**:
  - **Visuals**: Displays item names, descriptions, and dietary indicators (Veg/Non-Veg).
  - **Live Stock Status**: automatically updates based on inventory.
    - **"Running Out!" Badge**: appears when stock is low (≤ 5 items).
    - **"Sold Out" State**: Grays out the item and disables the "Add" button when functionality inventory hits 0.
  - **Dynamic Pricing**: Shows currency price (₹) for normal users, or "Included in Plan" for subscribers.

### 3. **Ordering System**
- **Dual Ordering Modes**:
  - **Please Pay-Per-Order (Normal)**: Standard e-commerce flow for non-members or extra items.
  - **Subscription Mode**: Allows members to redeem items against their daily quota without payment.
- **Hybrid Cart**:
  - Supports **Mixed Orders**: Users can simultaneously order subscription items (free/quota) and paid items in a single checkout flow.
  - **Real-time Validation**: Prevents adding more subscription items than the daily limit allows (e.g., Max 4 items).
- **Cart Interface**:
  - **Responsive Design**: Appears as a **Sidebar** on desktop (always visible) and a **Slide-up Grid** on mobile.
  - **Live Totals**: Calculates subtotal price and quota usage instantly.
  - **Preparation Notice**: Displays estimated prep time (Standard 10 mins) to manage expectations.
  - **Special Instructions**: Setup allows users to add **Notes** (e.g., "Less Spicy") for the kitchen.
  - **Scheduling**: Users can choose **"ASAP"** or select a **future time slot** for pickup.

### 4. **Checkout & Payments**
- **Multiple Payment Options** (for Normal Orders):
  - **💵 Cash / Counter**: Pay at the counter.
  - **📱 UPI**: Input UPI ID (Simulated processing delay).
  - **📷 Scan & Pay**: Displays a QR code placeholder for scanning (Simulated processing delay).
- **Seamless Redemption**: Subscription items skips payment and are instantly confirmed.
- **Success Experience**:
  - Plays a rich **Order Confirmation Animation** (WebM video) with a manual "Done" button.
  - Generates a unique **Digital Token (QR Code)** for the order along with a friendly **Order ID** (e.g., `#DEC25-0026`).
  - **Digital Receipts**: Persistent `/receipt/[id]` pages for proof of purchase.
  - **Cancellation**: Users can cancel an order within **2 minutes** of placement if made in error.
  - This QR code is used for order verification at the counter.

### 5. Visual Customization
- **Theme Support**:
  - Full **Dark Mode** toggle allow users to switch between Light and Dark themes.
  - Persists preference across sessions.

---

## 🛡️ Admin Command Center

### 1. **Live Order Dashboard** (`/admin/dashboard`)
- **Real-Time Tracking**: Auto-refreshes every 5 seconds to fetch new orders.
- **Audio Alerts**: Plays a notification sound when a new order arrives.
- **Visual Urgency System**:
  - **🟢 Green (Pastel)**: Fresh order (< 10 mins).
  - **🟡 Yellow (Pastel)**: Delayed (> 10 mins).
  - **🔴 Red (Pastel)**: Critical/Late (> 20 mins) - The card pulses visually to attract attention.
- **Status Management**:
  - Admins can update status: `RECEIVED` → `PREPARING` → `DONE` → `SOLD`.
  - One-click **"Mark as Ready"** button for quick kitchen throughput.

### 2. **Inventory Management**
- **Stock Control**: View all menu items and their current inventory counts.
- **Live Updates**: Changing stock here immediately reflects on the user's menu (e.g., triggering "Sold Out").
- **Category Filtering**: Filter stock items by category for easier counting.

### 3. **Member Management**
- **User Directory**: View list of all registered users.
- **Subscription Status**: Quickly check who is a `SUBSCRIBED` member vs `CUSTOMER`.
- **Plan Details**: View plan expiry dates and order history stats.

---

## 🍳 Kitchen Operations

### 1. **Kitchen Scanner System** (`/admin-scan`)
- **Camera Integration**: Uses the device's camera to scan customer QR codes.
- **Automated Workflow**:
  1. Kitchen staff scans the customer's "Order Placed" QR code.
  2. System instantly identifies the order.
  3. Updates Order Status to **"PICKED_UP"** (or equivalent) in the database.
  4. Shows a green "Success" screen to confirm the hand-off.
- **Efficiency**: Eliminates manual ticket searching and verification.

---

## ⚙️ Technical Highlights

- **Serverless Architecture**: Built on Next.js and potential Firebase/Serverless backend integration (simulated via API routes in this version).
- **Responsive Animations**: Smooth transitions for cart drawers, badges, and success states.
- **Optimistic UI**: Admin status updates reflect immediately while processing in the background.

---

## 📊 Analytics & Reporting

### Item Analytics
**Location:** Admin Dashboard → Analytics Tab

**Features:**
- Real-time tracking of item performance
- Metrics tracked:
  - Total quantity sold
  - Number of orders containing the item
  - Total revenue generated
- Rankings with medals (🥇🥈🥉) for top 3
- "POPULAR" badges highlight top 5 sellers

### Sales Reports
**Location:** Admin Dashboard → Analytics Tab → Generate Reports

**Report Types:**
- 📅 **Daily** - Today's sales
- 📆 **Weekly** - Last 7 days
- 🗓️ **Monthly** - Last 30 days
- 📊 **Yearly** - Last 365 days

**Report Contents:**
- Summary statistics (revenue, orders, average)
- Top 10 items with quantities and revenue
- Payment method breakdown
- Downloadable as .csv file

## 🔥 Bestsellers

### User-Facing Bestsellers Section
**Location:** User Menu (top of page when "All" category selected)

**Design:**
- Yellow gradient background
- Displays top 3 selling items
- Medal rankings (🥇🥈🥉)
- Matches regular menu card functionality

### Popular Item Badges
**Location:** Throughout user menu

**Display:**
- Small orange "🔥 POPULAR" badge
- Shows on top 3 selling items
- Subtle but effective social proof

## 🛠️ Admin Improvements

### Enhanced Stock Management
**Location:** Admin Dashboard → Stock Tab

**Improvements:**
- Direct number input (type "50" instead of clicking 50 times)
- Retains +/- buttons for small adjustments
- Auto-saves after 1 second
- Validation prevents negative numbers

### Reliable Order Status Updates
**Location:** Admin Dashboard → Live Orders

**Fix:**
- Single-click status updates (was double-click)
- Improved timing to prevent race conditions
- Optimistic UI updates for instant feedback

### Improved Logout
**Location:** Admin Dashboard → Logout Button

**Fix:**
- Clears both localStorage and sessionStorage
- Properly redirects to home page
- No more stuck sessions

## ⏰ Time Slot Improvements

### Smart Time Filtering
**Location:** User Cart → Schedule for Later

**Features:**
- Dropdown shows only future times
- 30-minute intervals
- Next 8 hours available
- User-friendly format (e.g., "07:00 PM")

### Order History Enhancement
**Location:** User → Order History

**Fix:**
- Scheduled orders now appear immediately
- Shows scheduled pickup time
- All orders visible regardless of timing

## 🔧 Technical Improvements

### Database Configuration
- Added `directUrl` support for Supabase
- Separate pooler and direct connections

### API Updates
- Public analytics endpoint (with authentication option)
- New reports generation endpoint

