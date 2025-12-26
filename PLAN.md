# System Architecture & Project Plan: IIM Nagpur Food Outlet

## 1. Technology Stack Proposition (Firebase Edition)

### Core Philosophy
Serverless, Real-time, and Scalable.

### Frontend
- **Framework**: **Next.js 14+ (App Router)**.
- **Language**: **TypeScript**.
- **State Management**: **React Context** (User User/Cart).
- **Styling**: **Vanilla CSS / CSS Modules**.

### Backend (Serverless)
- **Platform**: **Firebase**.
- **Database**: **Cloud Firestore** (NoSQL).
- **Authentication**: **Firebase Auth** (Google/Email).
- **Functions**: **Firebase Cloud Functions** (for complex logic like daily limit resets or payment webhooks).

---

## 2. Order Logic Implementation (Current Focus)

### `createSubscriptionOrder`
Located in `src/services/orderService.ts`.
This function handles the critical "Subscription" flow.

**Validation Rules:**
1. **User Authentication**: Must have valid UID.
2. **Subscription Active**: User must have an active subscription with `monthlyQuota > 0`.
3. **Item Limits**:
   - For each item:
     - If `double_allowed == false`, max quantity = 1.
     - If `double_allowed == true`, max quantity = 2.
     - Global max for any single item in one order is implicitly capped by daily limit (4), but specific item rules take precedence.

**Transactional Steps:**
1. Read User Subscription.
2. Read Daily Usage.
3. Read Menu Items (to check `double_allowed` and inventory).
4. Perform Validations (Throw error if failed).
5. **WRITE**:
   - Decrement Menu Inventory.
   - Increment Daily Usage `itemsRedeemed`.
   - Increment Subscription `mealsConsumedThisMonth`.
   - Create `orders` document.

---

## 3. Data Architecture (Firestore Collections)

We will use root-level collections for scalability.

### Collections

#### `users`
- Document ID: `auth_uid`
- Fields:
  - `email`: string
  - `role`: "CUSTOMER" | "KITCHEN" | "ADMIN"
  - `wallet_balance`: number
  - `createdAt`: timestamp

#### `subscriptions`
- Document ID: `auto-id`
- Fields:
  - `userId`: string (Ref to users)
  - `planType`: string
  - `dailyLimit`: number (e.g., 4)
  - `monthlyQuota`: number
  - `isActive`: boolean
  - `startDate`: timestamp
  - `endDate`: timestamp

#### `daily_usage`
- Document ID: `userId_YYYY-MM-DD` (Composite key for easy lookup)
- Fields:
  - `userId`: string
  - `date`: string
  - `itemsRedeemed`: number

#### `menu_items`
- Document ID: `auto-id`
- Fields:
  - `name`: string
  - `price`: number
  - `type`: "NORMAL" | "SUBSCRIPTION"
  - `inventory`: number
  - `isDoubleAllowed`: boolean
  - `category`: string

#### `orders`
- Document ID: `auto-id`
- Fields:
  - `userId`: string
  - `status`: "PENDING" | "CONFIRMED" | "READY" | "DELIVERED"
  - `mode`: "NORMAL" | "SUBSCRIPTION"
  - `totalAmount`: number
  - `createdAt`: timestamp
  - `items`: Array<{ id: string, name: string, qty: number, price: number }>

---

## 4. Project Structure

```text
/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   └── (shop)/ 
│   ├── lib/
│   │   ├── firebase.ts     # Firebase Client SDK
│   │   ├── firebaseAdmin.ts # Admin SDK (Server Actions)
│   │   └── utils.ts
│   ├── services/
│   │   └── orderService.ts # Core Business Logic
│   ├── types/
│   │   └── index.ts        # TS Interfaces for Entities
│   └── components/
├── scripts/
│   └── seed.ts             # Database Setup Script
└── firebase.json
```
