# Master UI Design Prompts for Cafe South Central

Use these prompts with your AI coding tool to generate or refine the UI for each page.

---

## 🎨 Global Design System (Apply to ALL Pages)
**Role:** Expert UI/UX Designer & Frontend Developer
**Tech Stack:** Next.js (React), Tailwind CSS, Lucide Icons
**Aesthetic:** "Warm Luxury & Modern Speed"
-   **Primary Brand:** Deep Brown (`#5C3A1A`) - Use for primary buttons, active states, headers.
-   **Backgrounds:**
    -   *App Background:* Soft warm cream/gray (`#f9fafb` or `#fefaef`).
    -   *Panels/Cards:* Pure White (`#ffffff`) with soft, deep shadows (`shadow-lg`).
-   **Typography:** Modern Sans-Serif (Inter/Outfit). Bold headings, readable body.
-   **Interactiveness:** Ripple effects on clicks, smooth transitions (hover states), fast loading skeletons.
-   **Rounded Corners:** Generous branding-friendly rounding (`rounded-xl` or `rounded-2xl`).

---

## 🛠️ Admin Dashboard Prompts

### 1. Live Orders (Active Tab)
**Objective:** A high-visibility dashboard for kitchen/counter staff to track incoming orders.
**Layout:** kanban-style or grid of cards.
**Key Elements:**
-   **Stat Cards:** Top row showing "Pending", "Preparing", "Ready" counts.
-   **Order Cards:**
    -   *Visual Cues:* Color-coded borders based on status (Yellow=Pending, Blue=Preparing, Green=Ready).
    -   *Content:* Token # (Large), Timer (Minutes elapsed), Items List, "Print KOT" button (Icon).
    -   *Actions:* One-tap status advance buttons (e.g., "Start Preparing" -> "Mark Ready").
-   **Empty State:** A clean illustration saying "All caught up!".

### 2. Order History (Sold Tab)
**Objective:** A search-heavy list of past transactions.
**Layout:** Data Table with filters.
**Key Elements:**
-   **Filters:** Date Range Picker, Search by Token/Phone, Status Dropdown.
-   **Table Columns:** Order ID, Date, Customer (Name/Phone), Items Summary, Total Amount, Status.
-   **Actions:** "View Details" (Modal), "Re-print Receipt".
-   **Summary Footer:** Total Revenue for the selected period.

### 3. Inventory Management (Stock Tab)
**Objective:** Quick toggle interface to manage item availability.
**Layout:** Categorized List or Grid.
**Key Elements:**
-   **Categories:** Tabs for "South Indian", "Rice", "Beverages" etc.
-   **Item Row:**
    -   Image (Thumbnail).
    -   Name & Price.
    -   **Stock Control:** An interactive "In Stock / Out of Stock" toggle switch.
    -   **Advanced:** "Edit" button to change price or name on the fly.

### 4. User Management (Members Tab)
**Objective:** CRM view for customer data.
**Layout:** List view with User Profiles.
**Key Elements:**
-   **User Card:** Avatar (Initials), Name, Phone, "Total Orders", "Wallet Balance".
-   **Search:** Instant search by phone number.
-   **Subscription Badge:** Gold/Silver badge if they have an active plan.

### 5. Analytics Dashboard
**Objective:** Business intelligence at a glance.
**Layout:** Widget Grid.
**Key Elements:**
-   **Charts:** Sales over time (Line Chart), Top Selling Items (Bar Chart).
-   **KPI Cards:** Total Revenue, Average Order Value, New Customers.
-   **Time Filter:** Today, This Week, This Month.

### 6. Feedback View
**Objective:** Review customer sentiment.
**Layout:** Feed / Timeline style.
**Key Elements:**
-   **Rating Card:** Star Rating (1-5), badge for low ratings (Needs Attention).
-   **Comment:** The text feedback.
-   **Context:** Order ID linked to the feedback.

---

## 📱 Consumer App Prompts

### 1. Landing Page (Home)
**Objective:** wow the user and drive them to "Order Now".
**Key Elements:**
-   **Hero Section:** Full-screen cinematic video or parallax food image. Bold Headline: "Taste of Tradition, Speed of Now."
-   **Call to Action:** Floating "Explore Menu" button.
-   **Featured Items:** Horizontal scroll of "Bestsellers" with high-res images.
-   **Login Modal:** Sleek, centered glassmorphism modal for Phone/OTP entry.

### 2. Subscription Page
**Objective:** Sell meal plans.
**Layout:** 3-Column Pricing Table (Mobile: Carousel).
**Key Elements:**
-   **Plan Cards:** "Student Mess", "Monthly Deluxe", "Trial Week".
-   **Features:** Checkmark list (e.g., "2 Meals/day", "Free Delivery").
-   **Savings Highlight:** "Save 20% vs Daily Ordering" badge.
-   **CTA:** "Subscribe Now" (Triggers Payment flow).

### 3. User Profile
**Objective:** Personal account management.
**Key Elements:**
-   **Header:** User Greeting & Stats (Orders placed).
-   **Active Plan:** Large card showing remaining days/meals in current subscription.
-   **Order History:** Condensed list of past orders with "Reorder" button.
-   **Wallet:** Current balance and "Add Money" button.
