**Role:** Expert Frontend Developer & UI Designer
**Tech Stack:** React, Tailwind CSS, Lucide Icons
**Objective:** Create a high-fidelity, functional Point of Sale (POS) interface for a Cafe Admin Dashboard.

---

**Design Philosophy:**
- **Aesthetic:** Modern, clean, and high-speed. Use a "warm luxury" palette.
- **Primary Color:** Deep Brown (`#5C3A1A`) for branding and primary actions.
- **Accent Colors:** Emerald Green (`#10b981`) for success/stock, Red (`#ef4444`) for destructive actions.
- **Background:** Soft Light Gray (`#f9fafb`) for the main canvas, White (`#ffffff`) for cards/panels.

---

**Layout Requirement (The "Canvas"):**
Create a **Two-Column Layout** with a fixed height (screen height):
1.  **Left Panel (65% width):** Scrollable Menu Area.
2.  **Right Panel (35% width):** Sticky/Fixed Cart & Checkout Area.

---

**Detailed Component Specifications:**

**1. Left Panel (The Menu):**
-   **Sticky Header:**
    -   A large, elegant **Search Input** ("🔍 Search items...") with a soft shadow and rounded corners.
    -   Below it, a **Horizontal Scrollable List** of Category Pills (e.g., "All", "South Indian", "Beverages").
    -   *Active State:* Brown background, White text.
    -   *Inactive State:* Light Gray background, Dark Gray text.
-   **Menu Grid:**
    -   A responsive grid (3 columns wide) of item cards.
    -   **Card Design:** Minimalist white card, rounded corners, subtle shadow.
    -   **Content:**
        -   **Item Name:** Bold, dark text (e.g., "Masala Dosa").
        -   **Price:** Secondary text (e.g., "₹80").
        -   **Stock Badge:** Small text indicating "12 in stock" (Green) or "Out of Stock" (Red).
    -   **Interaction:** Entire card is clickable to add to cart. Add a ripple or scale effect on click.

**2. Right Panel (The Cart):**
-   **Container:** White background, high shadow depth to lift it visualy.
-   **Header:** Brand Brown background, White text, Title: "New Order".
-   **Content (Scrollable List):**
    -   List of selected items.
    -   Each row shows: Item Name, Line Price, and Quantity Controls `[-] 1 [+]` and a Delete `[🗑️]` button.
-   **Footer (Fixed at Bottom):**
    -   **Customer Inputs:** Two stacked inputs for "Phone Number *" (Required) and "Name" (Optional). Style them with clean borders.
    -   **Total Display:** Large, bold text: "Total: ₹XXX".
    -   **Action Button:** A massive, full-width "Place Order" button. Green background. Disabled state if cart is empty.

---

**Functionality to Simulate:**
-   Clicking a category filter should update the active state.
-   Clicking an item card adds it to the right panel.
-   Clicking +/- updates visual quantity and total price.

**Output:**
Please generate the complete, single-file React component (using standard `<div>` or UI components if available) that implements this design pixel-perfectly using Tailwind CSS.
