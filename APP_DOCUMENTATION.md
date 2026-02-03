# Cafe South Central - Web App v1 Documentation

> [!NOTE]
> For the comprehensive **Product Requirements Document**, please refer to [PRD_Final.md](./PRD_Final.md). This document focuses on technical implementation details.

## 1. Project Overview
This application is a specialized food ordering system designed for high-traffic food outlets (like college canteens). It supports dual ordering modes: **Normal (Pay-per-order)** and **Subscription (Mess Plan)**. It features a responsive customer-facing UI and an administrative backend for order management.

## 2. Functionality & Features

### For Customers
*   **Authentication**: Simple login using Name and Phone Number. (Admin login via ID).
*   **Menu Browsing**:
    *   View items categorized (South Indian, Chinese, etc.).
    *   Veg/Non-Veg indicators.
    *   Dynamic pricing based on ordering mode.
*   **Ordering Modes**:
    *   **Normal Mode**: Standard e-commerce flow. Add items -> Cart -> Pay (Cash/UPI) -> Order Confirmed.
    *   **Subscription Mode**:
        *   Valid only for subscribed users.
        *   **Monthly Quota enforcement**.
        *   Restricted menu items (some items may not be available on subscription).
        *   Quantity limits (e.g., max 1 of a premium item).
*   **Cart System**:
    *   Persistent drawer UI.
    *   Add/Remove items.
    *   Real-time validation of subscription limits.
*   **Order Tracking**: Live status updates (Received -> Preparing -> Ready for Pickup -> Completed).
*   **Digital Receipts**: Shareable receipt pages with print support.

### For Administration
*   **Dashboard**: Overview of orders and inventory.
*   **Order Management**: Update status of active orders.
*   **Inventory Control**: Manage stock levels.
*   **Analytics & Reports**: View bestsellers, sales trends, and download CSV reports.

## 3. Technical Architecture

### Technology Stack
*   **Frontend**: Next.js 14 (App Router), React 18, TypeScript.
*   **Styling**: Tailwind CSS, CSS Modules.
*   **Backend**: Next.js API Routes (Serverless functions).
*   **Database**: PostgreSQL.
*   **ORM**: Prisma.
*   **UI Components**: Radix UI (Headless), Framer Motion (Animations).

### 3.1 New API Services (Jan 2026)
*   **Analytics Engine** (`/api/admin/analytics`):
    *   Aggregates sales data (Revenue, Order Counts) in real-time.
    *   Publicly accessible (read-only stats) to prevent loading locks.
*   **Reporting Service** (`/api/admin/reports`):
    *   Generates CSV files for accounting.
    *   Supports Day/Week/Month filtering.
*   **Kitchen Scanner** (`/api/admin/scan`):
    *   Validates Order QR Tokens.
    *   Prevents race conditions on pickup.

### Key Technical Components

#### Database Schema (Prisma)
*   **User**: Stores profile and role (CUSTOMER, ADMIN, KITCHEN).
*   **UserSubscription**: Tracks plan details, daily limits, and monthly quotas.
*   **DailyUsage**: Tracks items consumed per day per user (Critical for enforcing limits).
*   **Order**: Master record of a transaction.
*   **OrderItem**: Individual items within an order (Snapshot of price/name at time of order).
*   **MenuItem**: Inventory and metadata.

#### Transactional Order Processing
Located in `src/services/orderService.ts`, the application uses Prisma **Interactive Transactions** (`$transaction`) to ensure data integrity during high concurrency.
*   **Subscription Order**: Atomically checks Subscription active status and Monthly Quota -> Decrements Inventory -> Creates Order.
*   **Normal Order**: Atomically Checks Inventory -> Decrements Inventory -> Creates Order.

#### Authentication
*   Currently uses a **passwordless local strategy** for ease of access (Name + Phone).
*   Session is client-side persisted via LocalStorage.

## 4. Deployment Tools & Free Strategy

### Required Tools for Deployment
To deploy this application successfully, you will need the following tools/services:

1.  **Source Code Management**: **GitHub** (Required for Vercel/Netlify integration).
2.  **Hosting Platform**: **Vercel** (Recommended for Next.js) or Netlify.
3.  **Database Provider**: **Supabase** or **Neon** (Managed PostgreSQL).
4.  **Package Manager**: **npm** or **yarn** (Local development).

### Free Deployment Strategy (1000+ Users Support)
You can deploy this application completely for **FREE** while still supporting 1000+ concurrent users by leveraging the generous free tiers of the following services:

#### 1. Database: Supabase or Neon (Free Tier)
*   **Role**: Hosted PostgreSQL Database.
*   **Free Tier Benefit**: 500MB storage (enough for thousands of orders/users).
*   **CRITICAL FOR 1000 USERS**: Both Supabase and Neon provide **Connection Pooling** (PgBouncer) for free.
    *   *Why this matters*: A standard Postgres instance has a limit of ~100 direct connections. 1000 users hitting the API would crash it. Connection pooling manages this traffic, queuing requests so the DB never crashes.
    *   **Configuration**: Always use the "Transaction Mode" connection string provided by these services in your `.env`.

#### 2. Frontend & Backend: Vercel (Hobby Tier)
*   **Role**: Hosting Next.js App and API Routes.
*   **Free Tier Benefit**: Unlimited deployment history, global CDN, and generous serverless function execution limits.
*   **Why**: Vercel is built by the creators of Next.js. It automatically scales serverless functions to handle traffic spikes (unlike a traditional VPS which would crash).

### Scaling Configuration Checklist
To ensure the free tier handles the load:
1.  **Connection Pooling**: Ensure `DATABASE_URL` in `.env` points to the pooler (port 6543 for Supabase usually), NOT the direct port 5432.
2.  **Static Menu**: The menu page is static. It does not hit the DB on every load. This allows unlimited users to view the menu without costing you any database resources.
3.  **Logging**: We have disabled query logging in production (`src/lib/prisma.ts`) to keep logs within free tier limits.

## 5. Custom Domain Configuration (GoDaddy)

Yes, your **GoDaddy domain will work perfectly**. You do *not* need to transfer it. You can simply point it to your Vercel deployment.

### Steps to Connect GoDaddy to Vercel:

1.  **In Vercel Dashboard**:
    *   Go to **Settings** -> **Domains**.
    *   Enter your domain (e.g., `cafesouthcentral.com`) and click **Add**.
    *   Vercel will give you a **A Record** (IP Address) and a **CNAME Record**.

2.  **In GoDaddy Dashboard**:
    *   Go to **My Products** -> **DNS** (for your domain).
    *   **Add/Edit A Record**:
        *   **Host**: `@`
        *   **Value**: `76.76.21.21` (Vercel's IP - check Vercel dashboard to confirm).
        *   **TTL**: `1 Hour`.
    *   **Add/Edit CNAME Record**:
        *   **Host**: `www`
        *   **Value**: `cname.vercel-dns.com.`
        *   **TTL**: `1 Hour`.

3.  **Verification**:
    *   Wait for 5-10 minutes. Vercel will automatically verify the domain and issue a **Free SSL Certificate** (HTTPS).

### Summary of Costs
*   **Hosting**: ₹0 (Vercel)
*   **Database**: ₹0 (Supabase/Neon)
*   **Domain**: Purchased from GoDaddy (Yearly renewal cost only).
*   **Total**: **Free** (excluding domain renewal).

## 6. Offline Capabilities (PWA)

This application is configured as a **Progressive Web App (PWA)** to ensure reliability even with poor or intermittent internet connections.

### Features
1.  **Installable**: Users can add the app to their home screen on iOS and Android. It opens without the browser UI, feeling like a native app.
2.  **Offline Asset Caching**: `next-pwa` automatically caches static assets (CSS, JS, Images). If a user loses internet, the app UI will still load.
3.  **Manifest**: Includes `manifest.json` for proper branding (icons, colors) on mobile devices.

### Configuration
*   **Library**: `next-pwa`
*   **Config**: `next.config.js` with `skipWaiting: true` for instant updates.
*   **Assets**: Icons located in `public/` (served via `manifest.json`).
