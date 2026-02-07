# Project Roadmap & Status

This document outlines the current status of the **Cafe South Central** project and future development plans.

## ✅ Completed Features

### Core Experience
- [x] **Ordering**: Full cart system, normal/subscription modes, mixed orders.
- [x] **Authentication**: Name/Phone login (Passwordless).
- [x] **Menu**: Categorized display, search/filter, "Sold Out" handling.
- [x] **PWA**: Installable web app with offline asset caching.

### Ordering Enhancements
- [x] **Scheduling**: Time slot selection for pickup.
- [x] **Cancellation**: 2-minute undo window.
- [x] **Digital Receipts**: Shareable receipt pages.
- [x] **Dark Mode**: Fully supported visual themes.

### Admin & Kitchen
- [x] **Live Dashboard**: Real-time order incoming alerts (Sound + Visual).
- [x] **Inventory**: Live stock management with immediate user-facing updates.
- [x] **Kitchen Scanner**: QR code scanning workflow for order pickup.
- [x] **Analytics**: Bestsellers view, Sales Reports (CSV), and Item Performance tracking.

### Subscription System
- [x] **Logic**: Plan-based monthly quotas.
- [x] **User Dashboard**: "Active Plan" view with renewal reminders.
- [x] **Billing**: Mock payment flow for plan purchase.

---

## 🚧 Future / Planned

### 1. Offline Order Sync (Visual Handshake)
- **Goal**: Allow users to place orders even with **0% Internet Connectivity**.
- **Concept**: User app generates a QR code containing the full order payload. Kitchen scanner parses this payload and uploads it to the server via the Admin's connection.

### 2. Push Notifications
- [x] **Implemented**: WhatsApp Direct API integration for "OTP" and "Order Status" alerts.

### 3. Payment Gateway
- [x] **Implemented**: Razorpay integration with Webhooks for real-time payment confirmation.
- [x] **Refunds**: Automated refund logic for cancellations.

---

## 📚 Documentation
For detailed architectural info, please refer to:
- [APP_DOCUMENTATION.md](./APP_DOCUMENTATION.md): Technical Stack & Guide.
- [FEATURES.md](./FEATURES.md): Functional usage guide.
