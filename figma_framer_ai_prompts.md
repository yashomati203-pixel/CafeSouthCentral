# 🍃 Cafe South Central — Figma Make & Framer AI Prompt Guide

> **How to use this doc**: Each section has a clearly labelled prompt box. Copy the full text inside and paste it directly into **Figma Make** or **Framer AI** as instructed. Don't change the order — set up the Design System first, then screens, then flow, then animations.

---

## 📁 FIGMA FILE STRUCTURE TO CREATE

Before you start, manually create this structure in Figma:

```
📄 Cafe South Central — Web App v1
├── 🎨 Design System          ← Page 1
├── 🗺️ User Flow              ← Page 2
├── 📱 Mobile Screens         ← Page 3 (390 × 844 per frame)
├── 📱 Tablet Screens         ← Page 3.5 (768 × 1024 per frame)
├── 🖥️ Desktop Screens        ← Page 4 (1440 × 900 per frame)
└── 🔄 Components Library     ← Page 5
```

---

## 🎨 STEP 1 — Figma Variables / Design System

> Go to Page 1 `🎨 Design System`. Open **Assets → Local Variables → + New Collection** and name it `Cafe SC Tokens`.

### ➤ Prompt for Figma Make — Design System Page

```
Create a design system page for a South Indian cafe web app called "Cafe South Central".

COLORS (create as Figma Color Variables):
- background-body: #e8f5e9  (light green — main site background)
- background-surface: #e8f5e9  (light green — all page backgrounds)
- background-card: #ffffff  (menu cards, modal backgrounds)
- background-section: #e8f5e9  (light green for all page sections)
- background-dark-header: #102214  (nav panel, modal header)
- background-dark-card: #0e2a1a  (ReadyToEat modal header)

- primary: #5C3A1A      (coconut brown — primary brand)
- primary-light: #e8f5e9  (light green — primary surface color)
- secondary: #005001      (palm green dark — forest green)
- secondary-light: #4B6F44  (palm green light)
- accent: #F4D03F          (tropical yellow — CTA buttons)
- accent-green: #14b84b    (action green — add to cart, active states)
- accent-hero-text: #2f4f2f  (H1 text on landing hero)
- accent-subtext: #4a5d50   (subheading text on landing hero)

- text-on-dark: #f0f5f1    (primary text on dark backgrounds)
- text-muted: #a8c5a8      (muted text on dark)
- text-dark: #0e1b12       (dark text on light backgrounds)
- text-green: #4e9767      (body text on light backgrounds)
- text-white: #ffffff

- border-light: rgba(255,255,255,0.1)
- border-card: #e7f3eb
- border-active: #14b84b

- error: #ef4444
- success: #166534
- warning: #F59E0B

TYPOGRAPHY (create as Text Styles):
- Display: "Playfair Display", serif — 72px / Bold / line-height 1.1 / letter-spacing -0.02em
- H1: "Playfair Display", serif — 56px / ExtraBold / line-height 1.15
- H1-Mobile: "Playfair Display", serif — 36px / ExtraBold / line-height 1.2
- H2: "Playfair Display", serif — 36px / Regular / line-height 1.3 / letter-spacing -0.02em
- H3: "Playfair Display", serif — 24px / Medium
- Body-Large: "Inter", sans-serif — 18px / Regular / line-height 1.6
- Body: "Inter", sans-serif — 16px / Regular / line-height 1.5
- Body-Small: "Inter", sans-serif — 14px / Regular
- Caption: "Inter", sans-serif — 12px / Medium / uppercase / letter-spacing 0.05em
- Button-Large: "Playfair Display", serif — 20px / Bold
- Button: "Inter", sans-serif — 16px / SemiBold
- Nav-Label: "Inter", sans-serif — 10px / Medium / uppercase / letter-spacing 0.05em

SPACING SCALE: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96px

RADIUS SCALE:
- radius-sm: 8px
- radius-md: 16px
- radius-lg: 24px
- radius-full: 9999px (pill)
- radius-blob-1: 60% 40% 30% 70% / 60% 30% 70% 40%  (organic food image shape)
- radius-blob-2: 30% 70% 70% 30% / 30% 30% 70% 70%  (organic food image shape)

SHADOWS:
- shadow-card: 0 4px 20px rgba(0,0,0,0.05)
- shadow-card-hover: 0 8px 32px rgba(0,0,0,0.12)
- shadow-modal: 0 20px 60px rgba(0,0,0,0.3)
- shadow-nav: 0 -2px 10px rgba(0,0,0,0.1)

Display all variables as swatches and text samples in an organised grid layout.
```

---

## 📱 STEP 2 — Mobile Screens (Page 3)

Go to the `📱 Mobile Screens` page. Create one `390 × 844` frame per screen listed below.

---

### Screen 1 — Home / Landing Page (Mobile)

#### ➤ Prompt for Figma Make

```
Design a mobile screen (390 × 844px) for a South Indian cafe called "Cafe South Central" — the HOME / LANDING page.

BACKGROUND: Light green (#e8f5e9) — the global site background. No dark overlay.

TOP SECTION (full width, no separate nav bar — just content):
- Italic serif quote at top center: "You become what you eat" in #102214, 18px Playfair Display italic, opacity 80%
- Large serif H1 centered: "Healthy breakfast. / Quick bites. / Clean lunch." — 36px Playfair Display ExtraBold, color #2f4f2f, line-height 1.2
- Subtext centered: "We've got a plate ready for you." — 18px Playfair Display medium, color #4a5d50
- Full-width CTA pill button: "Explore Menu" — background #102214, text #f7e231 (bright yellow), 56px tall, rounded-full, font 20px Playfair Display Bold
- Small italic tagline below button: "Deadlines can wait. Good food can't." — 14px Inter italic, color #4a5d50, opacity 60%

FOOD COLLAGE SECTION (below CTA, height ~380px):
Three organic blob-shaped food images arranged as a collage:
1. Dosa plate — large blob (80% wide, left side, center-left position), shape: "30% 70% 70% 30% / 30% 30% 70% 70%", white bg, drop shadow
2. Idli Vada plate — small blob (45% wide, top right), shape: "60% 40% 30% 70% / 60% 30% 70% 40%", white bg
3. Filter coffee cup — small blob (35% wide, bottom right), shape: "40% 60% 60% 40% / 40% 40% 60% 60%", white bg
4. Small circular badge overlapping Idli: rotating badge saying "100% Fresh • 100% Made Today" — dark forest green text on light green background, 80px diameter, rotated 12deg

CATEGORIES SECTION (below collage):
- Section header: "What are you craving?" in H2 Playfair Display
- Horizontally scrollable pill/card row with category chips:
  Categories: Breakfast, Mains, Quick Bites, Thali, Desserts, Drinks
  Each chip: white card, 80×100px, icon emoji at top, label below, rounded-xl, border #e7f3eb

HOW IT WORKS SECTION:
- H2 heading: "How It Works"
- Three white cards stacked vertically (full width, 24px radius, 1px border #e7f3eb):
  Card 1: UtensilsCrossed icon (32px, #0e1b12) | "1. Browse Menu" H3 | "Explore our rotating daily menu of authentic home-cooked meals." body text #4e9767
  Card 2: CreditCard icon | "2. Order & Pay" H3 | "Select your meal type and secure your spot with easy online payment."
  Card 3: ShoppingBag icon | "3. Quick Pickup" H3 | "Skip the queue. Your fresh meal will be hot and ready for your arrival."

FAQ SECTION:
- H2: "Frequently Asked Questions"
- 4 collapsed accordion items with chevron icon

MOBILE BOTTOM NAVIGATION BAR (fixed, bottom):
- White bar, 64px tall, border-top 1px #e5e7eb
- 4 icons equally spaced: Utensils (Menu) | ScrollText (Orders) | ShoppingCart (Cart) | User (Profile)
- Labels below each icon: 10px Inter uppercase "MENU", "ORDERS", "CART", "PROFILE"
- Active state: icon and label color #14b84b, small green indicator bar above active icon
- Cart icon has red badge circle showing count "1"
- iOS home bar indicator: grey rounded pill at very bottom center
```

---

### Screen 2 — Menu Page (Mobile)

#### ➤ Prompt for Figma Make

```
Design a mobile screen (390 × 844px) for a South Indian cafe called "Cafe South Central" — the MENU PAGE.

MOBILE HEADER (fixed top, 56px tall):
- White background, border-bottom 1px #e5e7eb
- Left: hamburger icon (3 lines, color #5C3A1A) — this opens the StaggeredMenu side panel
- Center: cafe logo text "Cafe South Central" or logo image
- Right: ShoppingCart icon with red badge count

CATEGORY FILTER PILLS (sticky, just below header):
- Horizontal scrollable row, white background, 48px tall, padding 12px, no scrollbar visible
- Category pills: "All" | "Breakfast" | "Mains" | "Quick Bites" | "Thali" | "Desserts" | "Drinks" | "Rice"
- Active pill: background #102214, text white, rounded-full, 36px tall
- Inactive pill: white card, border #e5e7eb, text #374151

BANNER BELOW FILTERS — "Ready to Eat?" Banner:
- Full-width card, background #0e2a1a (dark green), rounded-2xl, 80px tall
- Left: ⚡ emoji + "Ready to Eat?" bold text in #14b84b (bright green)
- Right: "See Items →" link in white
- Tapping this opens the ReadyToEatModal

MENU GRID (2-column, scrollable):
Each menu card (white, rounded-2xl, border 1px #e7f3eb, shadow-sm):
- Square food image at top (full width of card, rounded-t-2xl)
- Small green/red veg indicator square badge (top-left on image)
- Item name: 16px Inter Bold, color #0e2a1a
- Description: 12px Inter, color #6B7280, 2-line clamp
- Price: "₹85" — 18px Inter Black, color #0e2a1a
- ADD button: small green pill button "#14b84b/10" background, green text "+Add"
- When item is in cart: show quantity stepper [-] [1] [+] replacing the ADD button

Show 6 menu cards in 2-column grid. Also show a "BREAKFAST" section header before the cards.

STAGGERED SIDE PANEL (show as overlay, partially visible from right edge):
- Full height side panel sliding from right
- Background: #102214 (dark forest green), backdrop-blur
- Width: 85% of screen (330px)
- Logo at top-left (white/inverted)
- Navigation items stacked: "MENU", "ORDERS", "ACCOUNT", "SUBSCRIBE" — 48px Playfair Display ExtraBold, color #f0f5f1, uppercase
- Social links section at bottom: "Socials" label in accent color, then link names

MOBILE BOTTOM NAVIGATION: same as Home page (fixed bottom)
```

---

### Screen 3 — ReadyToEat Modal (Mobile)

#### ➤ Prompt for Figma Make

```
Design a mobile screen (390 × 844px) for "Cafe South Central" — the READY TO EAT MODAL overlay.

BACKDROP: Semi-transparent black overlay (#000000 60% opacity) with backdrop-blur covering full screen.

BOTTOM SHEET MODAL (slides up from bottom):
- White card, rounded top corners only (rounded-t-3xl = 24px top radius)
- Height: 75% of screen (633px), sticks to bottom
- No rounded bottom corners
- Max-width: full width on mobile

MODAL HEADER (inside, top):
- Background: #0e2a1a (very dark green)
- Height: 96px, padding 24px
- H2: "In a Hurry?" — 30px Playfair Display Bold, color #14b84b
- Subtext: "Grab these Ready-to-Eat favorites right now." — 14px Inter, color #9CA3AF
- X close button: top-right, 40×40px, bg rgba(255,255,255,0.1), rounded-full, white X icon

ITEM LIST (scrollable, bg #e8f5e9):
Show 3 item cards:
Each card (white, rounded-2xl, border 1px #F3F4F6, shadow-sm, flex row):
- Left: Square food image 80×80px, rounded-xl — with small veg indicator badge (green square with green dot inside = veg)
- Right content:
  - Item name: "Idli Vada" — 18px Inter Bold, color #0e2a1a
  - Description: small grey 2-line text
  - Price: "₹55" — Inter Black, color #0e2a1a
  - ADD button (right): "#14b84b/10" bg, green text, "+ Add"
  
Show one card where item is already added — showing [-] [2] [+] stepper instead of Add.

MODAL FOOTER (white, border-top, fixed to bottom of modal):
- Centered text: "Close and continue browsing" — 14px Inter Bold, color #9CA3AF
```

---

### Screen 4 — Checkout Page (Mobile)

#### ➤ Prompt for Figma Make

```
Design a mobile screen (390 × 844px) for "Cafe South Central" — the CHECKOUT PAGE.

HEADER (fixed, white, 56px):
- Left: ChevronLeft back arrow (dark)
- Center: "Your Order" — 18px Inter SemiBold
- No cart icon (already on checkout)

ORDER TYPE SELECTOR (below header):
- Two pill tabs side by side: "Dine In" | "Takeaway"
- Active: dark green background #102214, white text
- Inactive: white, border, grey text

CART ITEMS LIST:
Show 3 item rows:
Each row (white card, rounded-xl, shadow-sm, flex row, padding 16px):
- Food image 64×64 rounded-xl left
- Item name "Idli Vada" Bold + description small grey
- Right: quantity stepper [-] [qty] [+] and price "₹110" Bold

ORDER SUMMARY CARD:
- White card, rounded-2xl, border #e7f3eb
- Rows: "Subtotal" | "GST (5%)" | separator | "TOTAL" Bold
- Values right-aligned

COUPON INPUT ROW:
- Input field + "Apply" button

PLACE ORDER BUTTON (fixed, bottom):
- Full width pill, background #102214, text #f7e231 (yellow)
- "Place Order — ₹275" — 20px Playfair Display Bold
- Above mobile bottom safe area

MOBILE BOTTOM NAV: same as before, Cart tab active
```

---

### Screen 5 — Login Modal (Mobile)

#### ➤ Prompt for Figma Make

```
Design a mobile screen (390 × 844px) for "Cafe South Central" — the LOGIN MODAL.

FULL SCREEN BACKDROP: Black 40% opacity + backdrop-blur-lg covering entire screen.

X CLOSE BUTTON: top-right of screen, 48×48px, white/20% bg, rounded-full, white X icon.

CENTERED CARD (max-width 340px, centered):
White card, rounded-3xl, shadow-2xl, padding 32px:
- Cafe logo at top center (small, 80px wide)
- H2: "Welcome Back" — 28px Playfair Display Bold, dark text
- Subtext: "Enter your mobile number to continue" — 14px Inter, grey

PHONE INPUT STEP:
- Label: "Mobile Number" — 12px Inter Medium uppercase grey
- Input field: rounded-xl, border #e5e7eb, 56px tall, "Enter 10-digit number", left prefix "+91"
- Primary button: "Send OTP" — full width, #102214 bg, #f7e231 text, 56px, rounded-full, 18px Playfair Display Bold

OTP STEP (show as second state):
- "Enter OTP sent to +91 98765 43210" subtext
- 6 individual OTP digit boxes (48×56px each, border-bottom heavy, no full border)
- "Verify OTP" button — same style as Send OTP
- "Resend OTP" text link below, grey italic

STAY LOGGED IN:
- Checkbox row: "Keep me logged in" — 14px Inter, grey
```

---

### Screen 6 — Orders Page (Mobile)

#### ➤ Prompt for Figma Make

```
Design a mobile screen (390 × 844px) for "Cafe South Central" — the MY ORDERS page.

MOBILE HEADER: same style header, title "My Orders"

FILTER TABS:
- 3 tabs: "All" | "Active" | "Past"
- Tab with bottom border indicator in green when active

ACTIVE ORDER CARD (highlight, border #14b84b):
White card, rounded-2xl, border 2px #14b84b, shadow-md, padding 16px:
- Top row: "Order #1042" Bold left + status badge "PREPARING" — small pill, orange background, 12px
- Items list: bullet • "2× Idli Vada", "1× Filter Coffee"
- Total: "₹165" — Bold
- Bottom: progress indicator with dots: [Placed] → [Confirmed] → [Preparing] → [Ready] — current step highlighted green
- "View Receipt" link text right-aligned, green

PAST ORDER CARD (subtle):
White card, rounded-2xl, border 1px #e5e7eb, padding 16px:
- "Order #1038" | status "COMPLETED" — grey pill badge
- Items summary
- Total + "Reorder" outlined button (border #14b84b, green text)

EMPTY STATE (if no orders):
- Illustration placeholder (box with dotted border)
- "No orders yet" — 20px Playfair Display
- "Browse our menu and place your first order!" — grey subtext
- "Explore Menu" pill button

MOBILE BOTTOM NAV: Orders tab active
```

---

### Screen 7 — Subscription Page (Mobile)

#### ➤ Prompt for Figma Make

```
Design a mobile screen (390 × 844px) for "Cafe South Central" — the SUBSCRIPTION page.

HEADER: same mobile header style, title "Meal Plans"

HERO BANNER:
- Full width card, background dark green gradient #102214→#0e2a1a, rounded-2xl, padding 24px
- "Save More, Eat Well" — H2 Playfair Display, white
- Subtext: "Subscribe to our meal plans and enjoy discounts every day." — white/70%
- Small "✦ Subscribers Save 20%" badge — tropical yellow bg, dark text, rounded-full

PLAN CARDS (vertically stacked):
Three plan cards:
Card 1 — Basic (white card, border #e7f3eb):
- "Basic Plan" — 20px Bold
- "5 meals / week" — grey
- "₹999 / month" — 28px Black, dark green
- Features list: ✓ Any 5 meals weekly ✓ Priority pickup
- "Choose Plan" outlined button (border dark green, dark green text)

Card 2 — Standard (highlighted, border 2px #14b84b, bg slight green tint):
- "POPULAR" badge top-right — green pill
- "Standard Plan" — 20px Bold
- "10 meals / week" — grey  
- "₹1799 / month" — 28px Black, dark green
- Features: ✓ Any 10 meals ✓ Priority pickup ✓ 1 free upgrade/month
- "Choose Plan" filled button (bg #102214, text yellow)

Card 3 — Premium (white card):
- "Premium Plan"
- "Unlimited meals"
- "₹2999 / month"
- Features
- "Choose Plan" outlined button

MOBILE BOTTOM NAV: no active tab (subscription not in nav)
```

---

### Screen 8 — Account / Profile Page (Mobile)

#### ➤ Prompt for Figma Make

```
Design a mobile screen (390 × 844px) for "Cafe South Central" — the ACCOUNT / PROFILE page.

HEADER: "My Account" centered title, no back button

PROFILE CARD (top, full width):
- White card, rounded-2xl, padding 24px
- Large avatar circle (80px, initials "YM" on dark green bg)
- Name: "Yasho M" — 20px Inter Bold
- Phone: "+91 98765 43210" — 14px grey
- "Edit Profile" small outlined button

MENU LIST SECTION:
Vertical list of settings rows (white cards or separated list):
Each row (56px tall, border-bottom 1px #F3F4F6):
- Left icon (24px, grey) + label text (16px Inter Medium dark)
- Right: ChevronRight arrow

Rows:
🛍️ "My Orders"
🎫 "My Subscription"
🔔 "Notifications"
❓ "Help & Support"
📋 "Terms & Privacy"

DANGER ZONE:
- "Log Out" row — red text, LogOut icon left

MOBILE BOTTOM NAV: Profile tab active
```

---

## 📱 STEP 2.5 — Tablet Screens (Page 3.5)

Go to page `📱 Tablet Screens`. Use `768 × 1024` frames.

---

### Tablet Screen 1 — Home / Landing (Tablet)

#### ➤ Prompt for Figma Make

```text
Design a TABLET screen (768 × 1024px) for "Cafe South Central" — HOME / LANDING PAGE.

GLOBAL BACKGROUND: Light green #e8f5e9. No dark overlay on the hero section.

HEADER (fixed, full width):
- White background, very subtle bottom border
- Left: Cafe logo (text or image, 120px wide)
- Center: no links (too narrow)
- Right: ShoppingCart icon with badge + hamburger menu icon (color #5C3A1A)

HERO SECTION (Center aligned stack, padding 48px):
- Italic serif quote: "You become what you eat" — 24px Playfair Display italic, color #102214
- H1: "Healthy breakfast. / Quick bites. / Clean lunch." — 56px Playfair Display ExtraBold, color #2f4f2f, line-height 1.1, centered
- H2 subheading: "We've got a plate ready for you." — 24px Playfair Display Bold, color #5c3a1a, centered
- CTA button: "Explore Menu" — large pill, background #102214, text #f7e231, 64px tall, 200px wide, 24px Playfair Display Bold, centered
- Food collage images: centered below button, overlapping organic blobs
- Floating badge attached to top-right of the collage: "100% Fresh • 100% Made Today", rotated 12deg

CATEGORIES SECTION:
- "What are you craving?" H2 centered
- 2 rows of 3 category cards (wrap grid)

HOW IT WORKS SECTION:
- H2: "How It Works"
- 3-column card grid, or 3 cards stacked vertically if they don't fit smoothly.
```

---

### Tablet Screen 2 — Menu Page (Tablet)

#### ➤ Prompt for Figma Make

```text
Design a TABLET screen (768 × 1024px) for "Cafe South Central" — MENU PAGE.

HEADER (sticky, 64px, white, border-bottom):
- Left: Logo
- Right: hamburger menu + ShoppingCart icon with badge

CATEGORY FILTERS (horizontal scrollable row below header):
- Pill style filters (same as mobile, but more visible pills at once)

"READY TO EAT?" BANNER:
- Full-width dark green #0e2a1a card just below filters
- Left: ⚡ "Ready to Eat items are available now!"
- Right: "Browse Now →"

MENU GRID (2 columns):
- 2-column grid, 16px gap
Each card (white, rounded-2xl, shadow-sm, border 1px #e7f3eb):
- Food image top (height 180px, full width)
- Veg/non-veg indicator
- Item name (18px Inter Bold), Description (14px grey)
- Bottom row: Price Bold + "Add +" green pill

STAGGERED MENU PANEL (overlay from right):
- 50% screen width panel sliding from right
- Background: #102214 dark green, backdrop blur
- Menu links (48px Playfair Bold)
```

---

## 🖥️ STEP 3 — Desktop Screens (Page 4)

Go to page `🖥️ Desktop Screens`. Use `1440 × 900` frames.

---

### Desktop Screen 1 — Home / Landing (Desktop)

#### ➤ Prompt for Figma Make

```
Design a DESKTOP screen (1440 × 900px) for "Cafe South Central" — HOME / LANDING PAGE.

GLOBAL BACKGROUND: Light green #e8f5e9. No dark overlay on the hero section.

DESKTOP HEADER (fixed, full width):
- White background, very subtle bottom border
- Left: Cafe logo (text or image, 120px wide)
- Center: Navigation links — "Menu" | "Orders" | "Subscription" | "About"
- Right: hamburger menu icon (3 lines, color #5C3A1A) — this triggers the StaggeredMenu panel

HERO SECTION (2-column grid, min-height 90vh):
LEFT COLUMN (50%):
- Italic serif quote: "You become what you eat" — 28px Playfair Display italic, color #102214, opacity 90%
- H1: "Healthy breakfast. / Quick bites. / Clean lunch." — 64px Playfair Display ExtraBold, color #2f4f2f, line-height 1.1
- H2 subheading: "We've got a plate ready for you." — 28px Playfair Display Bold, color #5c3a1a
- CTA button: "Explore Menu" — large pill, background #102214, text #f7e231, 64px tall, 200px wide, 24px Playfair Display Bold, hover scale animation
- Italic tagline: "Deadlines can wait. Good food can't." — 20px Playfair Display italic, color #4a5d50

RIGHT COLUMN (50%):
Three organic blob food images arranged as floating collage (absolute positioned):
1. Dosa plate — large blob (450px, center left of right col), organic blob shape "30% 70% 70% 30% / 30% 30% 70% 70%", white bg, heavy shadow
2. Idli Vada — medium blob (220px, top right), organic blob "60% 40% 30% 70%...", white bg
   - "100% Fresh • 100% Made Today" circular badge attached top-right, dark green bg, 96px, rotated 12deg
3. Filter Coffee — small blob (180px, bottom right), organic blob, white bg

HOW IT WORKS SECTION (below hero):
- Full width, centered, padding 96px vertical
- H2: "How It Works" — Playfair Display 48px
- Decorative underline: 60px × 4px, color #e2e9e0, centered
- 3-column card grid (max-width 1200px, 2rem gap):
  Each card: white, 300px min, rounded-3xl (24px), padding 48px 32px, shadow-sm, border #e7f3eb
  Cards: Browse Menu (UtensilsCrossed icon) | Order & Pay (CreditCard icon) | Quick Pickup (ShoppingBag icon)

CATEGORIES SECTION:
- "What are you craving?" H2 centered
- 6 category cards in a row: Breakfast | Mains | Quick Bites | Thali | Desserts | Drinks
  Each: white rounded-2xl card with emoji + label, hover shadow

FAQ SECTION:
- H2 centered
- 4 accordion items, max-width 800px centered
```

---

### Desktop Screen 2 — Menu Page (Desktop)

#### ➤ Prompt for Figma Make

```
Design a DESKTOP screen (1440 × 900px) for "Cafe South Central" — MENU PAGE.

DESKTOP HEADER (sticky, 64px, white, border-bottom):
- Left: Logo
- Center navigation links
- Right: hamburger menu + ShoppingCart icon with badge

LEFT SIDEBAR (fixed, 240px wide):
- "Categories" heading — 16px Inter SemiBold uppercase
- Vertical list of category filters:
  • All Items (active — bold, green left border indicator)
  • Breakfast
  • Mains
  • Quick Bites
  • Thali
  • Rice
  • Desserts
  • Drinks
  Each item: 44px row, 16px Inter Medium, black text, hover green
- Separator
- "Ready to Eat ⚡" special option — bg #0e2a1a, green text, rounded-xl

MAIN CONTENT AREA (left: 240px sidebar, remaining for grid):
"Ready to Eat?" banner — dark green #0e2a1a, full width of content area, rounded-2xl, 72px tall:
- Left: ⚡ "In a Hurry? Ready to Eat items are available now!" white text
- Right: "Browse Now →" green text link

Section label: "BREAKFAST" — 12px Inter uppercase, tracked, grey

MENU GRID (3 columns):
9 menu cards shown (3×3 grid, 24px gap):
Each card (white, rounded-2xl, shadow-sm, border 1px #e7f3eb, overflow-hidden):
- Food image top (height 200px, full width, object-cover)
- Veg/non-veg indicator top-left on image
- Content area padding 16px:
  - Item name — 18px Inter Bold, dark
  - Description — 14px Inter, 2-line clamp, grey
  - Bottom row: "₹85" Bold left + "Add +" green pill button right

STAGGERED MENU PANEL (shown open, overlaying from right):
- 40% screen width panel sliding from right
- Backdrop-blur, bg #102214 dark green
- Logo at top-left inside panel
- Nav items large text: "MENU" / "ORDERS" / "ACCOUNT" / "PLANS" — 64px Playfair Display ExtraBold white uppercase
- Social links section at bottom
- Overlay: 40% black scrim on left side
```

---

## 🗺️ STEP 4 — User Flow Diagram (Page 2)

Go to page `🗺️ User Flow`. Use a large canvas.

#### ➤ Prompt for Figma Make — User Flow

```
Create a user flow diagram on a large canvas for the "Cafe South Central" web app.

Use rounded rectangles for screens, diamonds for decision points, and arrows for flow.

SCREENS TO INCLUDE (use the mobile wireframe thumbnails as references):

MAIN CUSTOMER FLOW:
[Landing Page] →(Tap "Explore Menu")→ [Menu Page]
[Menu Page] →(Tap item)→ [Item Detail / ReadyToEat Modal]
[ReadyToEatModal] →(Add to Cart)→ [Cart Indicator Updated]
[Menu Page] →(Tap Cart icon)→ [Cart Sidebar/Sheet]
[Cart Sheet] →(Tap Checkout)→ {User Logged In?}
  → YES → [Checkout Page] →(Place Order)→ [Receipt Page]
  → NO  → [Login Modal] →(OTP Verified)→ [Checkout Page]

SUBSCRIPTION FLOW:
[Landing Page] →(Tap "View Plans")→ [Subscription Page]
[Subscription Page] →(Choose Plan)→ {User Logged In?}
  → YES → [Payment Page] →(Success)→ [Manage Subscription]
  → NO  → [Login Modal] →(Success)→ [Payment Page]

ADMIN FLOW (separate column):
[Landing Page / Login] →(Admin Login)→ [Admin Dashboard]
[Admin Dashboard] →(Scan QR)→ [Admin Scan Page]
[Admin Dashboard] →(View Orders)→ [Kitchen Orders View]

Connect screens with directional arrows.
Label each arrow with the user action that triggers the transition.
Use color coding:
- Customer flow: green arrows
- Auth flow: blue arrows  
- Admin flow: orange arrows

Show a legend in the corner.
```

---

## 🔄 STEP 5 — Components Library (Page 5)

#### ➤ Prompt for Figma Make — Component Library

```
Create a component library page for "Cafe South Central" with these reusable components:

BUTTONS:
- Primary Button (large): bg #102214, text #f7e231, rounded-full, 56px tall, 200px min-width, Playfair Display Bold 20px
- Primary Button (small): same style, 40px tall, 120px min-width, 16px text
- Secondary Button: outlined, border 2px #102214, text #102214, same sizing
- Danger Button: bg #ef4444 red, white text
- Ghost Button: no bg, no border, text only
- Add to Cart pill: bg #14b84b/10, text #14b84b, "+ Add", 36px tall, rounded-full
- Quantity Stepper: [-] [qty] [+], bg grey-100, inner buttons white rounded

BADGES & INDICATORS:
- Cart Count badge: red circle, white text, 20px
- Status badge ACTIVE: orange pill, 12px
- Status badge COMPLETED: grey pill
- Status badge PREPARING: amber pill
- Veg indicator: 16px square, border 2px green, inner dot green
- Non-veg indicator: same, red

CARDS:
- Menu Card (mobile): white, rounded-2xl, border #e7f3eb, with image top
- Plan Card (basic): white, rounded-2xl, border
- Plan Card (popular): green border 2px, POPULAR badge
- Order Row card: white, rounded-xl, border

NAVIGATION:
- Mobile Bottom Nav bar (shows all 4 states: each icon as active)
- Desktop header bar
- Category filter pill (active + inactive states)
- Staggered Menu panel

FORM ELEMENTS:
- Text input field (default + focused + error states)
- OTP digit box
- Checkbox row

MODAL:
- ReadyToEat bottom sheet (mobile)
- Login modal card

Show all components with labels and show variants where applicable.
```

---

## 🎬 STEP 6 — Framer AI Prompts (Animations & Interactions)

Open **Framer**, create a new project named `Cafe South Central - Interactive`.

---

### Framer Import Step

> In Figma: install the **Framer plugin** → Select all Mobile, Tablet, and Desktop Screens frames → **Plugins → Framer → Copy**
> In Framer: **Cmd/Ctrl+V** to paste
> Set Pages structure in Framer to match routes: `Home`, `Menu`, `Checkout`, `Login`, `Subscription`, `Orders`, `Account`
> Set Mobile breakpoint: 390px | Tablet: 768px | Desktop: 1440px

---

### 🎬 Framer AI Prompt 1 — Hero Section Animations

```
Add animations to the Hero section of the Home page for Cafe South Central:

1. PAGE ENTRANCE ANIMATION (on page load, stagger children):
   - Quote text: fade in + translateY from 20px to 0, delay 0ms, duration 600ms, ease: power2.out
   - H1 heading: fade in + translateY from 30px to 0, delay 150ms, duration 700ms, ease: power4.out
   - H2 subheading: fade in + translateY from 20px to 0, delay 300ms, duration 600ms
   - CTA button: fade in + scale from 0.95 to 1, delay 450ms, duration 500ms, spring stiffness 300 damping 25
   - Tagline: fade in, delay 600ms, duration 400ms
   - Food collage images: staggered fade in + float up, delays 400/500/600ms

2. FOOD IMAGE FLOATING ANIMATIONS (infinite, looping):
   - Dosa blob: translateY oscillating 0px → -10px → 0px, duration 6s, ease: sine in-out, infinite
   - Idli blob: translateY oscillating 0px → -15px → 0px, duration 5s, delay 1s, infinite
   - Coffee blob: translateY oscillating 0px → -20px → 0px, duration 4s, delay 2s, infinite

3. CTA BUTTON HOVER:
   - Scale to 1.05 on hover, scale back to 1 on mouse-leave
   - Transition: spring, stiffness 400, damping 20

4. ROTATING BADGE:
   - Continuous rotation: 0deg → 360deg, duration 20s, linear, infinite

5. SCROLL-TRIGGERED SECTIONS:
   - "How It Works" cards: each card animates in as user scrolls to it
     - translateY from 40px to 0, opacity 0 to 1
     - stagger: 100ms between cards
     - trigger: when element enters viewport by 30%
```

---

### 🎬 Framer AI Prompt 2 — StaggeredMenu Panel

```
Add interactions to the StaggeredMenu hamburger panel in Cafe South Central:

TRIGGER: Hamburger button (3 horizontal lines icon)

ON CLICK OPEN:
1. Panel slides in from right: translateX from 100% to 0%
   - Duration: 500ms, ease: power4.out
2. Menu items animate in with stagger (start after panel is 40% in, delay 200ms):
   - Each nav item: translateY from 140% to 0% + rotate from 10deg to 0deg
   - Stagger: 100ms between items
   - Duration: 800ms each, ease: power4.out
3. Social links section: fade in + translateY from 25px to 0, delay 350ms
4. Hamburger icon: rotate from 0deg to 90deg, duration 500ms, ease: power4.out
5. Hamburger lines color: animate from #5C3A1A to #ffffff

ON CLICK CLOSE:
1. Panel slides out: translateX from 0% to 100%, duration 350ms, ease: power3.in
2. Hamburger icon: rotate back to 0deg
3. Color back to original

CLICK OUTSIDE TO CLOSE: clicking the backdrop (scrim) also triggers close animation.

OVERLAY SCRIM: 
- On open: black scrim fades in 0→40% opacity behind panel
- On close: fades back to 0%
```

---

### 🎬 Framer AI Prompt 3 — ReadyToEat Modal

```
Add the ReadyToEat bottom sheet modal animation for Cafe South Central mobile:

TRIGGER: Tapping "Ready to Eat?" banner on the Menu page

ENTER ANIMATION:
1. Full-screen black backdrop: opacity 0 → 60%, duration 200ms
2. Modal sheet: translateY from 100% to 0%, duration 400ms
   - Spring: stiffness 300, damping 30
   - Starts simultaneously with backdrop
3. Modal items: stagger fade in + translateY 20px→0 after modal is visible
   - Start delay: 300ms after modal open
   - Stagger: 60ms between items

EXIT ANIMATION (tap X button or backdrop):
1. Modal: translateY 0% → 100%, duration 250ms, ease: power3.in
2. Backdrop: opacity 60% → 0%, duration 200ms, slight delay 50ms

GESTURE SUPPORT (mobile feel):
- Drag-to-dismiss: user can drag modal down by more than 100px to trigger exit animation
- Show drag handle indicator at top center of modal (40×4px grey pill)
```

---

### 🎬 Framer AI Prompt 4 — Mobile Bottom Nav

```
Add animations to the Mobile Bottom Navigation bar for Cafe South Central:

ACTIVE TAB CHANGE:
1. When a nav item is tapped:
   - Previous active icon + label: color transitions from #14b84b to #9CA3AF, duration 200ms
   - New active icon: scale 1 → 1.2 → 1 (spring bounce), stiffness 400, damping 17
   - New active color: #9CA3AF → #14b84b, duration 200ms
   - Active indicator bar: small 6px green bar above icon slides in from opacity 0 + scale 0 → 1

2. CART BADGE animation:
   - When item added to cart: badge does a quick scale pulse: 1 → 1.4 → 1, duration 300ms, spring

3. NAV BAR ENTRANCE (on page load):
   - Bar slides up: translateY from 100% to 0%, duration 400ms, ease: power4.out, delay 500ms

4. TAP FEEDBACK:
   - Entire nav button tap: scale 0.85 whileTap, spring stiffness 400 damping 17
```

---

### 🎬 Framer AI Prompt 5 — Page Transitions

```
Add page transition animations for navigation between pages in Cafe South Central:

ALL PAGE TRANSITIONS (consistent):
- Outgoing page: opacity 1→0, duration 200ms
- Incoming page: opacity 0→1 + translateY 20px→0, duration 300ms
- Total transition time: ~400ms

SPECIFIC TRANSITIONS:
Menu → Checkout:
- Outgoing menu: slide left (translateX 0 → -30%), opacity 1→0
- Incoming checkout: slide from right (translateX 30% → 0), opacity 0→1

Home → Menu:
- Scale transition: incoming menu scales from 1.05 to 1, opacity 0→1

Receipt page (success):
- Large checkmark icon does a scale + rotation entrance: scale 0→1.2→1, rotate -10deg→0
- Background pulse animation: radial green glow pulses twice

Login modal:
- Overlay backdrop: fade in
- Card: scale 0.95→1 + opacity 0→1, spring stiffness 300 damping 25

LOADING STATE:
- On any page navigation: show a thin progress bar at the very top of screen (green #14b84b, 2px height)
  - Animates from 0% to 100% width over 400ms
  - Fades out after 600ms
```

---

### 🎬 Framer AI Prompt 6 — Menu Cards & Category Pills

```
Add micro-interactions to the Menu page for Cafe South Central:

MENU CARD HOVER (desktop):
- Card: translateY 0 → -4px, shadow depth increase, duration 200ms ease
- Food image: subtle scale 1 → 1.05, duration 300ms
- "Add" button: opacity 0.8 → 1, slight color brighten

MENU CARD ADD TO CART:
- "Add +" button tapped: button scale 0.9 → 1, spring
- Button transforms: "+Add" pill → "[-] [1] [+]" stepper with a spring scale entrance
- Cart icon in header: scale pulse 1 → 1.3 → 1, duration 300ms

CATEGORY PILLS (filter change):
- Tapping a new pill: active pill background slides/morphs to highlight new pill
  (use a layoutId shared background approach — same green pill slides between pills)
- Menu grid: on category filter change, items fade out and new items fade in with stagger

MENU GRID INITIAL LOAD:
- Items load in staggered sequence: each card enters with opacity 0→1 + translateY 30px→0
- Stagger: 50ms between each card
- Duration: 400ms each, ease: power3.out

SCROLL-STICKY CATEGORY PILLS:
- When user scrolls past header, category pills stick to top with a subtle box-shadow appearing
- Transition: shadow 0 → shadow-md, duration 300ms
```

---

## ✅ MASTER CHECKLIST

```
FIGMA SETUP:
□ Create 5-page Figma file with correct page names
□ Run Design System prompt → create all color variables
□ Create all typography text styles
□ Run Mobile Screen prompts (8 screens × 390×844 frames)
□ Run Desktop Screen prompts (2 screens × 1440×900 frames)
□ Run User Flow prompt on flow page
□ Run Component Library prompt
□ Connect prototype flows with Figma arrow connectors
□ Export to Framer using official Framer plugin

FRAMER SETUP:
□ Import from Figma
□ Set breakpoints: 390 / 768 / 1440
□ Set up Pages matching app routes
□ Run Framer AI Prompt 1 (Hero animations)
□ Run Framer AI Prompt 2 (StaggeredMenu panel)
□ Run Framer AI Prompt 3 (ReadyToEat modal)
□ Run Framer AI Prompt 4 (Bottom nav)
□ Run Framer AI Prompt 5 (Page transitions)
□ Run Framer AI Prompt 6 (Menu cards micro-interactions)
□ Test prototype on mobile preview
□ Compare against live app at localhost:3000

CODE SYNC (after Framer):
□ Note all spring/easing values from Framer
□ Verify framer-motion is installed (npm list framer-motion)
□ Apply animation values to StaggeredMenu.tsx (already uses GSAP — keep GSAP)
□ Apply to MobileBottomNav.tsx — add whileTap + active indicator
□ Apply to ReadyToEatModal.tsx — already has Framer Motion, refine spring values
□ Apply to HeroSection.tsx — add motion stagger on mount, float animations
□ Test on mobile viewport in browser
```

---

## 🔑 KEY EXACT VALUES QUICK REFERENCE

| Token | Value |
|---|---|
| Site BG | `#e8f5e9` (light green) |
| Page section BG | `#e8f5e9` (light green) |
| Menu header BG | `#102214` |
| Modal header BG | `#0e2a1a` |
| CTA button BG | `#102214` |
| CTA button text | `#f7e231` |
| Active / Cart green | `#14b84b` |
| Primary brand brown | `#5C3A1A` |
| H1 text color | `#2f4f2f` |
| Body text (on light) | `#0e1b12` (dark green-black) |
| Card border | `#e7f3eb` |
| Font - Headings | Playfair Display |
| Font - Body/UI | Inter |
| Float slow | `6s ease-in-out infinite` |
| Float medium | `5s ease-in-out infinite` |
| Float fast | `4s ease-in-out infinite` |
| Badge rotation | `20s linear infinite` |
| Modal spring | `stiffness: 300, damping: 30` |
| Button spring | `stiffness: 400, damping: 17` |
