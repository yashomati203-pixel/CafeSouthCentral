# Changelog

All notable changes to the **Cafe South Central** project will be documented in this file.

## [2025-12-07]
### Core Development
- **Checkout Flow**: Implemented payment method selection (Cash/UPI/Scan) with simulated processing delays.
- **Loading State**: Fixed "stuck on loading" issues with a robust timeout mechanism.
- **Initial Setup**:
  - Fixed database seeding scripts.
  - Resolved `email` column schema mismatches.
  - Implemented initial "Coconut Break" success animation.

## [2025-12-08]
### Features
- **Time Slots**:
  - Integrated Time Slot selection feature (later simplified).
  - Updated Admin Dashboard to sort/group by time slots.

## [2025-12-09]
### Bug Fixes
- **Login Screen**: Resolved the "Blank Screen" on load issue.
- **Routing**: Fixed issues where users were not correctly being shown the Login Page when unauthenticated.

## [2025-12-11]
### Assets
- **Animation Update**: Replaced `OrderConfirmed` animation with a new high-quality `.webm` file.

## [2025-12-14]
### UI Refinement
- **Order Animation**: Repositioned the "Order Confirmed" coconut animation to play inline within the cart drawer instead of a full-screen overlay.

## [2025-12-21]
### Inventory & Kitchen
- **Smart Inventory**: Implemented "Running Out!" (Low Stock) and "Sold Out" badges on the menu.
- **Kitchen Handshake**:
  - Developed the `/admin-scan` page with QR code scanning.
  - Implemented the "Pick Up" workflow where kitchen staff scans a user's order code.

## [2025-12-22]
### Admin & Enhancements
- **Admin Dashboard v2**:
  - Implemented live order tracking with urgency indicators (Green/Yellow/Red pulse).
  - Added sound alerts for new orders.
  - added `StockItem` component for real-time inventory adjustments.
- **Admin Login**: Fixed critical login redirection issues for admin users.
- **User Experience**: Improved the subscription plan selection visibility.

## [2025-12-23]
### Admin Features
- **Stock Categorization**: Refactored the Admin Dashboard inventory section to group items by category (South Indian, Dosa, etc.) for better usability.

## [2025-12-25]
### Subscription & UI
- **Subscription Logic**: Refined the subscription flow implementation.
- **UI Fixes**:
  - Fixed `SubscriptionInvitation` component visibility.
  - Updated `page.tsx` to correctly toggle between Normal and Subscription modes.
- **Codebase Recovery**: Investigated and restored missing changes related to the Admin Dashboard and Stock Items.

## [2025-12-26]
### Documentation
- **Feature Documentation**: Created `FEATURES.md` listing all application capabilities.
- **Changelog**: Initialized `CHANGELOG.md` to track project history.

---

*Note: This changelog is reconstructed from development history and may not capture every minor commit.*
