# Cafe South Central Web App - Page Inventory

Complete list of all pages, popups, and their **viewport dimensions** for both **User** and **Admin** interfaces.

---

## 📱 User-Facing Pages

### Main Pages

| Page Name | Route | Desktop Size | Mobile Size | Scrollable |
|-----------|-------|--------------|-------------|------------|
| **Landing Page** | `/` (initial view) | 1280 × 1728px | 375 × 2400px | ✅ Vertical |
| **Main Dashboard** | `/` (after login/explore) | 1280 × 1200px+ | 375 × 1400px+ | ✅ Vertical |
| **Login Page** | `/login` | 1280 × 800px | 375 × 667px | ❌ Fixed |
| **Account/Profile** | `/account` | 1280 × 1000px | 375 × 1200px | ✅ Vertical |
| **My Orders** | `/orders` | 1280 × 1400px+ | 375 × 1600px+ | ✅ Vertical |
| **Subscription Plans** | `/subscription` | 1280 × 1800px | 375 × 2200px | ✅ Vertical |
| **Order Receipt** | `/receipt/[id]` | 1280 × 900px | 375 × 1000px | ✅ Vertical |
| **404 Not Found** | `/not-found` | 1280 × 600px | 375 × 600px | ❌ Fixed |

### Page Descriptions

#### Landing Page (`/`)
- **Desktop**: 1280 × 1728px (scrollable)
- **Mobile**: 375 × 2400px (scrollable)
- **Purpose**: First impression page with hero section, features, and call-to-actions
- **Sections**:
  - Hero section with parallax scrolling (~700px height)
  - Features showcase (~600px)
  - Category selection grid (~400px)
  - Footer (~300px)

#### Main Dashboard (`/` after explore/login)
- **Desktop**: 1280 × 1200px+ (dynamic height based on menu items)
- **Mobile**: 375 × 1400px+ (dynamic, with bottom nav padding)
- **Layout**:
  - Desktop: Grid layout with optional 400px right sidebar (when cart active)
  - Mobile: Full width with bottom fixed navigation
- **Views**:
  - Guest mode (browse without login)
  - Authenticated user mode
  - Subscription member mode

#### Login Page (`/login`)
- **Desktop**: 1280 × 800px (centered, fixed height)
- **Mobile**: 375 × 667px (full screen)
- **Features**:
  - Animated smiley face with eye tracking
  - Name and phone input fields
  - "Stay logged in" checkbox
  - Minimal design, centered layout

#### Account Page (`/account`)
- **Desktop**: 1280 × 1000px
- **Mobile**: 375 × 1200px
- **Sections**:
  - Profile header (~200px)
  - Personal information form (~400px)
  - Subscription status card (~200px)
  - Order history preview (~400px)

#### Orders Page (`/orders`)
- **Desktop**: 1280 × 1400px+ (grows with order count)
- **Mobile**: 375 × 1600px+ (grows with order count)
- **Features**:
  - Real-time status updates
  - Order cards (each ~150px height)
  - Filter/sort options
  - Cancel button (visible for 2 minutes)

#### Subscription Plans (`/subscription`)
- **Desktop**: 1280 × 1800px
- **Mobile**: 375 × 2200px
- **Layout**:
  - Hero section (~400px)
  - Plan comparison cards (~800px)
  - Benefits list (~400px)
  - FAQ section (~400px)

#### Order Receipt (`/receipt/[id]`)
- **Desktop**: 1280 × 900px
- **Mobile**: 375 × 1000px
- **Content**:
  - Order header with QR code (~200px)
  - Items list (~400px)
  - Payment details (~200px)
  - Pickup/status info (~100px)

---

## 🎯 Popups & Modals (User Side)

| Modal Name | Desktop Size | Mobile Size | Type | z-index |
|------------|--------------|-------------|------|---------|
| **Login Modal** | 600 × 800px | 100vw × 100vh | Full overlay | 9999 |
| **Cart Drawer** | 450 × 100vh | 100vw × 80vh | Slide-in | 1000 |
| **Cart Sidebar** | 400 × auto | N/A (desktop only) | Fixed sidebar | Normal flow |
| **Feedback Modal** | 480 × 600px | 90vw × auto | Centered | 50 |
| **Subscription Invitation** | 600 × 500px | 90vw × auto | Centered | 50 |
| **Mobile Profile Menu** | N/A | 280 × 100vh | Slide from right | 1000 |
| **Order Success Animation** | 500 × 400px | 90vw × 400px | Centered | Inline |

### Modal Details

#### Cart Drawer/Sidebar
- **Desktop Sidebar**: 400 × auto (fixed right side, height adapts to content)
- **Mobile Drawer**: 100vw × 80vh (slides up from bottom)
- **Content Sections**:
  - Header (~60px)
  - Subscription items section (variable)
  - Normal items section (variable)
  - Special instructions (~120px)
  - Order timing selector (~150px)
  - Payment method (~200px)
  - Notices (~150px)
  - Footer with checkout button (~80px)
- **Max scroll height**: Content scrollable within modal

#### Feedback Modal
- **Desktop**: 480 × 600px (centered)
- **Mobile**: 90vw × auto (centered)
- **Layout**:
  - Header with close button (~80px)
  - Title and description (~100px)
  - 5-star rating (~80px)
  - Comment textarea (~160px)
  - Submit button (~60px)
- **Backdrop**: Blur effect with 40% black overlay

#### Subscription Invitation
- **Desktop**: 600 × 500px
- **Mobile**: 90vw × auto
- **Timing**: Appears 1 second after login (non-members only)
- **Animation**: Fade in with scale

#### Mobile Profile Menu
- **Size**: 280 × 100vh (full height)
- **Animation**: Slide from right
- **Content**:
  - User info header (~120px)
  - Menu items list (~400px)
  - Social links (if enabled)
- **Overlay**: Semi-transparent backdrop

#### Login Modal (Overlay)
- **Desktop**: 600 × 800px (centered)
- **Mobile**: 100vw × 100vh (full screen)
- **z-index**: 9999 (topmost layer)
- **Background**: White (solid, no transparency)
- **Close button**: Fixed top-right

---

## 🔧 Admin Pages

| Page Name | Route | Desktop Size | Mobile Size | Features |
|-----------|-------|--------------|-------------|----------|
| **Admin Login** | `/login` (admin credentials) | Same as user login | Same as user login | Role-based redirect |
| **Admin Dashboard** | `/admin/dashboard` | 1440 × 2000px+ | 768 × 2400px+ | Order queue, inventory, analytics |
| **Admin Scan Mode** | `/admin-scan` | 1280 × 800px | 375 × 667px | QR scanner interface |

### Admin Dashboard Details

#### Main Admin Dashboard (`/admin/dashboard`)
- **Desktop**: 1440 × 2000px+ (optimized for large screens)
- **Tablet**: 768 × 2400px+ (responsive grid)
- **Layout Sections**:
  - **Header** (~100px): Stats overview, notifications
  - **Order Queue** (~800px+): Live order cards with status controls
    - Each order card: ~180px height
    - Real-time updates with auto-polling (every 5 seconds)
  - **Inventory Management** (~600px): Stock levels, edit controls
  - **Menu Management** (~500px): Add/edit/disable items
  - **Analytics Dashboard** (~400px): Charts and metrics
- **Grid Layout**: Multi-column responsive grid
- **Scrollable**: Yes, vertical scroll for all sections

#### Admin Scan Mode (`/admin-scan`)
- **Desktop**: 1280 × 800px
- **Mobile**: 375 × 667px
- **Layout**:
  - Camera viewfinder (full screen minus controls)
  - Scanner overlay (~400 × 400px)
  - Order confirmation area (bottom sheet)
- **Use Case**: Kitchen staff scanning order receipts for verification

---

## 🧩 Reusable Components

### Layout Components

| Component | Desktop | Mobile | Purpose |
|-----------|---------|--------|---------|
| **MobileHeader** | Hidden | 100vw × 60px | Top nav with logo, theme toggle, profile |
| **MobileBottomNav** | Hidden | 100vw × 70px | Bottom navigation bar (fixed) |
| **MobileProfileMenu** | Hidden | 280 × 100vh | Profile sliding panel |
| **Footer** | 100vw × 300px | 100vw × 400px | Site footer with links |

### UI Components (Dimensions when active)

| Component | Typical Size | Purpose |
|-----------|--------------|---------|
| **StaggeredMenu** | 300 × 400px | Animated 3-dot menu dropdown |
| **AnimatedList** | Auto | List with stagger animations |
| **OrderConfirmed** | 500 × 400px | Success animation overlay |
| **ModeToggle** | 50 × 24px | Subscription/Normal mode switch |
| **StickyCartSummary** | 100vw × 60px | Mobile-only cart preview bar |

---

## 📐 Responsive Breakpoints & Layouts

### Viewport Specifications

#### Mobile (< 768px)
- **Common Sizes**: 
  - iPhone SE: 375 × 667px
  - iPhone 12/13: 390 × 844px
  - iPhone 14 Pro Max: 430 × 932px
- **Layout**:
  - Full-width pages (100vw)
  - Bottom navigation (70px fixed)
  - Top header (60px)
  - Drawer-style modals
  - Stacked single-column layouts
  - Content padding: 1rem (16px)
  - Bottom safe area: 100px (for nav clearance)

#### Tablet (768px - 1024px)
- **Common Sizes**: 
  - iPad: 768 × 1024px
  - iPad Pro: 834 × 1194px
- **Layout**:
  - Hybrid desktop/mobile features
  - Grid layouts (2-column)
  - Desktop navigation
  - Some modals adapt to larger size

#### Desktop (≥ 768px)
- **Target Size**: 1280 × 800px (standard)
- **Large Desktop**: 1440 × 900px (admin optimized)
- **Layout**:
  - Grid layouts with sidebar
  - Top navigation only
  - Sidebar cart (400px fixed width)
  - Two-column layouts
  - Content max-width: 1280px (centered)
  - When cart active: `grid-template-columns: minmax(0, 1fr) 400px`

### Layout Specifications by Screen

#### Mobile Layout
```
┌─────────────────────────┐
│   MobileHeader (60px)   │ ← Fixed top
├─────────────────────────┤
│                         │
│    Content Area         │
│   (scrollable)          │
│                         │
│   Padding: 1rem         │
│   Bottom: 100px         │
│                         │
├─────────────────────────┤
│ MobileBottomNav (70px)  │ ← Fixed bottom
└─────────────────────────┘
```

#### Desktop Layout (No Cart)
```
┌──────────────────────────────────────┐
│      Desktop Header (~80px)          │
├──────────────────────────────────────┤
│                                      │
│      Content Area (full width)       │
│      Max-width: 1280px               │
│      Centered, padding: 2rem         │
│                                      │
└──────────────────────────────────────┘
```

#### Desktop Layout (With Cart)
```
┌──────────────────────────────────────┐
│      Desktop Header (~80px)          │
├─────────────────────┬────────────────┤
│                     │                │
│   Content Area      │  Cart Sidebar  │
│   (flexible width)  │  (400px fixed) │
│                     │                │
└─────────────────────┴────────────────┘
```

---

## 📊 Summary Statistics

### Viewport Sizes Overview

**User Pages:**
- Landing: 1280×1728 (D) / 375×2400 (M)
- Dashboard: 1280×1200+ (D) / 375×1400+ (M)
- Login: 1280×800 (D) / 375×667 (M)
- Account: 1280×1000 (D) / 375×1200 (M)
- Orders: 1280×1400+ (D) / 375×1600+ (M)
- Subscription: 1280×1800 (D) / 375×2200 (M)
- Receipt: 1280×900 (D) / 375×1000 (M)

**Admin Pages:**
- Dashboard: 1440×2000+ (D) / 768×2400+ (T)
- Scan: 1280×800 (D) / 375×667 (M)

**Modals:**
- Login: 600×800 (D) / 100vw×100vh (M)
- Cart Drawer: 450×100vh (D) / 100vw×80vh (M)
- Cart Sidebar: 400×auto (D only)
- Feedback: 480×600 (D) / 90vw×auto (M)
- Subscription Invite: 600×500 (D) / 90vw×auto (M)
- Profile Menu: N/A (D) / 280×100vh (M)

---

## 🎯 Key Dimensions Reference

### Fixed UI Elements

| Element | Desktop | Mobile |
|---------|---------|--------|
| Header Height | 80px | 60px |
| Bottom Nav | N/A | 70px (fixed) |
| Cart Sidebar Width | 400px | N/A |
| Content Padding | 2rem (32px) | 1rem (16px) |
| Max Content Width | 1280px | 100vw |
| Bottom Safe Area | N/A | 100px |

### Common Component Heights

| Component | Height |
|-----------|--------|
| Menu Item Card | ~300px |
| Order Card (Orders page) | ~150px |
| Order Card (Admin) | ~180px |
| Category Filter Bar | ~60px |
| Cart Item Row | ~80px |
| Modal Header | ~60-80px |
| Modal Footer | ~60-80px |

---

## 🚀 Performance & Optimization

### Page Load Targets
- **Initial Viewport**: Loads within 2 seconds
- **Below Fold**: Lazy loaded
- **Images**: Next.js optimized, responsive srcsets
- **Code Splitting**: Automatic per route

### Responsive Images
- **Desktop**: Full resolution (up to 1920px)
- **Tablet**: Medium (up to 1024px)
- **Mobile**: Small (up to 640px)

---

*Dimensions measured at 1280×800 (desktop) and 375×667 (mobile base)*  
*Last Updated: January 26, 2026*
