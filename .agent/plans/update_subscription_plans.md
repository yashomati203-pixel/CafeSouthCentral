# Implementation Plan - Subscription Plans Update

## Objective
Update the subscription plans displayed in the application to match the new pricing and tiers provided by the user.

## New Plan Structure

1.  **Ultimate Plan** (Highlight/Hero)
    -   Price: ₹9,999/month
    -   Original Price: ₹18,000 (Save 50%)
    -   Benefits: Unlimited meals + Sips + Snacks

2.  **Meal Plans (30 Days)**
    -   **Light Bite Pass**: ₹2,599 (Original ₹3,000) - 30 Coupons
    -   **Feast & Fuel**: ₹4,499 (Original ₹6,000) - 60 Coupons
    -   **Total Wellness**: ₹5,999 (Original ₹9,000) - 90 Coupons

3.  **Add-On**
    -   **Hot Sips + SnacknMunch**: ₹1,299 (Original ₹1,999) - 30 Coupons

4.  **First-Timer Offer**
    -   **1-Week Trial**: ₹1,299
    -   Benefit: + 1 day free snacks

5.  **General Info**
    -   Validity: 30 + 5 days grace period

## Steps

1.  **Update `SubscriptionInvitation.tsx`**
    -   This seems to be the main component displaying plans.
    -   Refactor the `PLANS` constant (if it exists) or the hardcoded content to reflect the new hierarchy.
    -   Implement the "Ultimate Plan" as a featured hero card.
    -   List the standard meal plans in a grid.
    -   Add a section for Add-ons and the First-Timer offer.
    -   Add the validity note at the bottom.

2.  **Verify Data Models (Optional but Good)**
    -   Check `SubscriptionPlan` or related enums in `schema.prisma`.
    -   Currently, the request seems to be purely visual/frontend display changes ("Make these as the subscription plans"). I will assume standard mappings for now (e.g., mapping "Light Bite" to the existing `MONTHLY_MESS` logic but with different calorie/meal counts, or just visual updates for now).
    -   *Self-Correction*: The user previously had `MONTHLY_MESS` and `TRIAL`. I might need to map these new visual plans to `MONTHLY_MESS` with different `dailyLimit` or `monthlyQuota` if they are selected.
    -   For this specific task, I will focus on the **Frontend Display** updates first.

3.  **Refinement**
    -   Use badges for "Save 50%", "Save 33%", etc.
    -   Ensure the visual hierarchy distinguishes the "Ultimate" plan from the rest.
