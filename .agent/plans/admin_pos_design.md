# Admin POS (Point of Sale) - UI/UX Design Specification

## Overview
The Admin POS is a dedicated interface within the Admin Dashboard designed for high-speed counter ordering. It allows admins to quickly select items, manage a cart, and place orders for walk-in customers with immediate KOT printing.

## Layout Structure
**Grid Layout:** 2-Column Split
-   **Left Panel (65%):** Menu & Item Selection
-   **Right Panel (35%):** Cart & Checkout (Sticky)

---

## 1. Left Panel: Menu & Discovery
### Header Area (Sticky Top)
-   **Search Bar:** Large, full-width input field.
    -   *Placeholder:* "🔍 Search items..."
    -   *Behavior:* Instant filtering of the grid below.
-   **Category Pills:** Horizontal scrollable list.
    -   *Style:* Rounded capsule buttons.
    -   *State:* Active category highlighted with Brand Brown (`#5C3A1A`), others Light Grey (`#e5e7eb`).
    -   *Options:* "All", "South Indian", "Rice", "Beverages", etc.

### Item Grid
-   **Card Style:** Minimalist white cards with soft shadow.
-   **Grid System:** Responsive (3 columns on wide screens, 2 on medium).
-   **Card Content:**
    -   **Name:** Bold, readable font.
    -   **Price:** Secondary color, e.g., "₹40".
    -   **Stock Indicator:** Small badge or text.
        -   *In Stock:* Green text (`12 in stock`).
        -   *Out of Stock:* Red text, card slightly dimmed or grayscale.
-   **Interaction:** Clicking anywhere on the card adds 1 unit to the cart. Ripple effect on click.

---

## 2. Right Panel: Cart & Checkout
### Container Style
-   **Background:** White with strong shadow (`box-shadow: 0 4px 6px ...`) to distinguish from the gray background.
-   **Header:** "New Order" title with Brand Brown background and white text. Rounded top corners.

### Cart Items List (Scrollable)
-   **Row Layout:**
    -   **Left:** Item Name & Total Price for line (bold).
    -   **Right:** Quantity Controls.
        -   `[-]` Circular Button (gray border)
        -   `QTY` Text (bold)
        -   `[+]` Circular Button (gray border)
        -   `[🗑️]` Delete Icon (red, icon-only)

### Customer Details Section (Fixed at Bottom)
-   Located immediately below the item list.
-   **Phone Input (Required):**
    -   *Label:* "Customer Phone *"
    -   *Placeholder:* "Enter 10-digit number"
    -   *Validation:* Must be 10 digits.
-   **Name Input (Optional):**
    -   *Label:* "Customer Name (Optional)"
    -   *Placeholder:* "e.g. John Doe"

### Footer: Totals & Action
-   **Total Row:** Large font, "Total: ₹XXX".
-   **Action Button:**
    -   *Label:* "✅ Place Counter Order"
    -   *Style:* Full width, Green (`#10b981`), bold white text.
    -   *State:* Disabled if Cart is empty OR Phone is missing.
    -   *Feedback:* Changes to "Processing..." and spinner icons during API call.

---

## 3. User Flow & Interactions
1.  **Open POS:** Admin clicks "New Order (POS)" tab.
2.  **Add Items:** Admin clicks item cards. Cart updates instantly on the right.
3.  **Adjust Qty:** Admin uses +/- buttons in the cart to handle multiple requests of the same item.
4.  **Customer Info:** Admin asks for phone number and enters it.
5.  **Checkout:** Admin clicks "Place Counter Order".
6.  **Success:**
    -   API validates/creates user.
    -   Order Created.
    -   **Auto-Print:** Browser Print Dialog opens with the KOT.
    -   **Reset:** Cart clears, form resets, ready for next customer.

---

## 4. Visual Aesthetic
-   **Font:** Inter or System Sans-Serif.
-   **Colors:**
    -   *Primary Brand:* `#5C3A1A` (Dark Brown)
    -   *Accent Green:* `#10b981` (Success/Stock)
    -   *Accent Red:* `#ef4444` (Delete/Error)
    -   *Background:* `#f9fafb` (Light Gray)
-   **Spacing:** Generous padding (`1rem` to `1.5rem`) for touch-friendliness (tablet usage).
