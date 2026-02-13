# Changelog

All notable changes to the **Cafe South Central** project will be documented in this file.

## [2026-02-12]
### Added
- **System Alert System**: Real-time monitoring for operational issues (low stock, order delays).
- **React Portal Integration**: Implemented for modals to escape stacking contexts and ensure visibility.
- **Enhanced Analytics**: Added custom date range filtering (Start/End Date) and performance detail views.

### Changed
- **Admin Sidebar**: 
    - Full vertical layout optimization for better space efficiency.
    - Repositioned "Sign Out" to bottom-left with optimized spacing.
    - Updated branding with centered official logo.
- **Reporting**: Upgraded CSV export to include revenue trends and item-level performance.

### Fixed
- **Checkout Logic**: "Cash at Counter" no longer triggers UPI ID validation.
- **Order ID Unification**: Shared sequential ID generation for both POS and Web orders (e.g., `FEB26-xxxx`).
- **Z-Index Stacking**: Resolved layout overlap issues where decorative borders obscured interactive modals.
- **Inventory Management**: Fixed delete functionality for menu items.

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

## [2025-12-27]
### User Experience (UX)
- **Order Success Screen**:
  - Removed auto-close timer to prevent users from missing the confirmation.
  - Added a dedicated "Close" button.
  - Displayed "Friendly Order ID" (e.g., `#DEC25-0026`) instead of database UUIDs for easier verification.
- **Order History**:
  - **Status Updates**: Display "Ready for Pickup" (Green) for ready orders and "Completed" (Gray) for sold orders.
  - **QR Code Visibility**: Now visible for "RECEIVED" and "DONE" (Ready) orders, ensuring access at all relevant stages.

### Admin Dashboard
- **Visual Improvements**:
  - **Pastel Cards**: Enhanced urgency indicators with full pastel background colors (Red/Yellow/Green) for better readability.
- **Order Management**: Synced "Ready for Pickup" status with the user-facing UI.

## [2026-01-01]
### Core Features
- **Scheduling**: Added "Schedule for Later" option in checkout, allowing users to pick a time slot.
- **Order Management**: 
  - Enabled "Cancel Order" for users within 2 minutes of placement.
  - Added "Special Instructions" field to the cart.
- **Digital Receipts**: 
  - Implemented shareable `/receipt/[id]` pages.
  - Added "View Receipt" links in Order History.

### UI/UX
- **Dark Mode**: Complete dark mode support with a persistent toggle slider.
- **Enhanced Polling**: Optimized the Order History page to reduce re-renders and lag.

### Subscription
- **Refinement**: 
  - Removed confusing "Become a Member" popup for existing members.
  - Updated Subscription Dashboard to show Active Plan and Renewal Reminders.
  - Simplified subscription model (removed hard `dailyLimit` database constraint in favor of plan-based logic).

### Admin
- **Dashboard**:
  - Added "Scheduled Time" and "Notes" columns.
  - Filtered Admin accounts from the "Members" view.

## [2026-01-09]
### Features
- **Item Analytics System**:
  - New Analytics tab in Admin Dashboard
  - Tracks quantity sold, order count, and revenue per item
  - Rankings with medals (🥇🥈🥉) for top items
  - Visual "POPULAR" badges for top sellers
- **Bestsellers Section**:
  - Prominent display of top 3 selling items on user menu
  - Yellow gradient styling with medal rankings
  - Auto-updates based on sales data
- **Sales Reports**:
  - Generate downloadable reports for Day/Week/Month/Year
  - Includes total revenue, orders, average order value
  - Top 10 items breakdown with quantities and revenue
  - Payment method analytics
- **Editable Stock Inventory**:
  - Inventory count can now be typed directly
  - Retains +/- buttons for small adjustments
  - Auto-saves with 1-second debounce

### Bug Fixes
- **Admin Logout**: Fixed logout not working - now clears both localStorage and sessionStorage
- **Order Status Updates**: Increased delay to 500ms to prevent polling race conditions (no more double-clicking required)
- **Analytics Loading**: Made analytics API publicly accessible to fix infinite loading state
- **Order History**: Added `timeSlot` field so scheduled orders appear correctly in history
- **Time Slot Selection**: Now only shows future time slots in 30-minute intervals (past times filtered out)

### Technical
- **Database Configuration**: Updated Prisma schema with `directUrl` for Supabase pgbouncer support
- **New API Endpoints**:
  - `/api/admin/analytics` - Item statistics
  - `/api/admin/reports` - Sales report generation
- **Improved Status Update Logic**: Changed from 300ms to 500ms delay for better stability

### Changed
- **Bestsellers Count**: Reduced from top 5 to top 3 for more exclusivity
- **Time Slot UI**: Changed from time input to dropdown for better UX and validation

### Fixed (Evening Session - January 9, 2026)
- **Report Format**: Changed from .txt to .csv with proper table structure for Excel compatibility
- **Report Spelling**: Fixed "Dayly" → "Daily" in report button labels
- **Scheduled Order Indicator**: Added yellow badge showing "⏰ Scheduled: [time]" in order history
- **QR Scanner Validation**: Prevents pickup of orders not marked as DONE/READY, shows helpful error messages
- **Time Input Validation**: Reverted to native time picker with `min` attribute and validation to prevent past times
- **Scheduled Order Crash**: Fixed `TypeError: P is not a function` by adding missing validation props to CartContent

## [2026-01-14]
### Documentation
- **Consolidation**: Merged `FEATURES_UPDATE_JAN2026.md` into `FEATURES.md` for a single source of truth.
- **Updates**: Updated `APP_DOCUMENTATION.md` and `PLAN.md` to reflect recent feature additions (Analytics, Reports, Push Notifications).

---

*Note: This changelog is reconstructed from development history and may not capture every minor commit.*
