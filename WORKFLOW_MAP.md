# 🗺️ Cafe South Central - User & Admin Workflow Map

This document maps out the specific steps for every key action within the application, defining the flow for **Customers**, **Admins**, and the **System** itself.

---

## 👤 Customer Flows

### 1. Authentication (Login)
*   **Action**: Access the App.
*   **Steps**:
    1.  User lands on the Homepage/Guest Page.
    2.  Clicks "Login" (or tries to add item to cart).
    3.  Enters **Name** and **Phone Number**.
    4.  Enters OTP (Default: `1234`).
    5.  **System Check**:
        *   If new user: Creates account.
        *   If existing user: Restores profile.
        *   **Subscription Check**: Validates if user has an active Monthly Plan.
*   **Outcome**: User is logged in. If they have a subscription, "Subscription Mode" is unlocked.

### 2. Placing an Order (Normal Mode)
*   **Action**: Buy food (Pay-per-order).
*   **Pre-requisite**: Logged in, Mode set to **Normal**.
*   **Steps**:
    1.  Browse Menu (Filter by Category: South Indian, Snacks, etc.).
    2.  Click **"Add"** on desired items.
    3.  Open **Cart Sidebar**.
    4.  (Optional) Add **Special Instructions** (e.g., "No onions").
    5.  (Optional) Select **Schedule Time** (e.g., "12:30 PM").
    6.  Click **Checkout**.
    7.  Select Payment: **Cash**, **UPI**, or **Scan**.
    8.  Click **Confirm**.
*   **Outcome**: 
    - Order Status: `RECEIVED`.
    - User redirected to **Success Screen** with **QR Code**.
    - **Digital Receipt** generated.

### 3. Placing an Order (Subscription Mode)
*   **Action**: Redeem meal from plan.
*   **Pre-requisite**: Active Membership, Mode set to **Subscription**.
*   **Steps**:
    1.  Browse items (Only "Subscription Eligible" items shown).
    2.  Add items to Cart.
    3.  **System Validation**: Checks against Daily Limit (e.g., Max 4 items) & Stock.
    4.  Open Cart -> Click **Confirm Order** (No Payment required).
*   **Outcome**:
    - Inventory Decremented.
    - Monthly Quota Decremented.
    - Order Status: `RECEIVED`.
    - User gets QR Code.

### 4. Post-Order Actions
*   **Action**: Track or Cancel.
*   **Steps**:
    1.  Go to **Order History** via Sidebar.
    2.  **View Status**: Lists orders as `PREPARING` or `READY FOR PICKUP`.
    3.  **Cancel**: Click "Cancel Order" (Only available for first 2 minutes).
    4.  **Receipt**: Click "View Receipt" for a printable record.
*   **Outcome**: User stays informed.

### 5. Purchasing a Subscription
*   **Action**: Become a Member.
*   **Steps**:
    1.  Sidebar -> **Subscription Plans**.
    2.  View "Current Plan" status (if any).
    3.  Select a new Plan (e.g., "Feast & Fuel").
    4.  Confirm Mock Payment.
*   **Outcome**: User upgraded to `MEMBER`. Plan valid for 30 days.

---

## 🛡️ Admin Flows

### 1. Kitchen Management (Order Processing)
*   **Action**: Process incoming food orders.
*   **Location**: `/admin/dashboard`
*   **Flow**:
    1.  **Alert**: Dashboard beeps/flashes when New Order arrives.
    2.  **Review**: Admin checks Items, Notes, and Scheduled Time.
    3.  **Update Status**:
        *   Click `Preparing`: Kitchen starts cooking.
        *   Click `Mark Ready`: Food is packed. User gets "Ready" notification.
    4.  **Handover**:
        *   Option A: Click `Mark Sold` manually.
        *   Option B: Use **Scanner**.

### 2. Kitchen Scanner (QR Handshake)
*   **Action**: Verify user identity and hand over food.
*   **Location**: `/admin-scan` (Mobile/Tablet recommended).
*   **Flow**:
    1.  Customer shows Order QR Code on their phone.
    2.  Admin scans code with device camera.
    3.  **System Action**: 
        *   Validates Order ID.
        *   Updates Order Status to `PICKED_UP` / `COMPLETED`.
    4.  **Outcome**: Green "Success" screen. Transaction closed.

### 3. Inventory Control
*   **Action**: Manage Stock / "Sold Out" items.
*   **Location**: Admin Dashboard -> Inventory Tab.
*   **Flow**:
    1.  Filter by Category (e.g., "Beverages").
    2.  Locate Item (e.g., "Cold Coffee").
    3.  Use `+` / `-` buttons to adjust count.
    4.  **Outcome**:
        *   If Count = 0: Item immediately grayed out ("Sold Out") on user phones.
        *   If Count ≤ 5: Users see "Running Out!" badge.

### 4. Member Oversight
*   **Action**: Check user details.
*   **Location**: Admin Dashboard -> Members Tab.
*   **Flow**:
    1.  View list of subscribed users.
    2.  Check `Meals Consumed` vs `Monthly Quota`.
    3.  Check Plan Expiry.

---

## 🤖 System Automations

*   **Stock Sync**: Whenever an order is confirmed (Normal OR Subscription), the system *atomically* decrements inventory. If inventory hits 0 mid-transaction, the order fails.
*   **Quota Management**: Subscription orders automatically increment the user's `mealsConsumedThisMonth` counter.
*   **Polling**: The User App polls for updates every 5 seconds to show "Ready for Pickup" status without manual refresh.
