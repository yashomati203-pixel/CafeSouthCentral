# Analytics wiring Implementation Plan

## Goal
Connect the supposedly static Admin Analytics Dashboard to real data from the database.

## Proposed Changes

### Backend API
#### [MODIFY] [src/app/api/admin/analytics/route.ts](file:///c:/Users/yasho/OneDrive/Desktop/Cafe South Central/Web App v1/src/app/api/admin/analytics/route.ts)
-   Expand the `GET` handler to calculate:
    -   **Total Revenue**: Sum of all `SOLD`/`DONE` orders.
    -   **Avg Order Value**: Total Revenue / Total Orders.
    -   **New Customers**: Count of users created in the last 30 days.
    -   **Sales Over Time**: Group orders by date for the last 7 days.
    -   **Peak Hours**: Group orders by hour of day (0-23).
    -   **Customer Sentiment**: Fetch average rating and distribution (5-star, 4-star, etc.) from `Feedback` table.

### Frontend Components
#### [MODIFY] [src/components/admin/AnalyticsDashboard.tsx](file:///c:/Users/yasho/OneDrive/Desktop/Cafe South Central/Web App v1/src/components/admin/AnalyticsDashboard.tsx)
-   Define `AnalyticsData` interface.
-   Update component to accept `data: AnalyticsData` prop.
-   Replace hardcoded values with `data` keys.
-   Implement safeguards for missing/empty data.

#### [MODIFY] [src/app/admin/dashboard/page.tsx](file:///c:/Users/yasho/OneDrive/Desktop/Cafe South Central/Web App v1/src/app/admin/dashboard/page.tsx)
-   Ensure `fetchAnalytics` retrieves the new data structure.
-   Pass `analytics` state to `<AnalyticsDashboard data={analytics} />`.

## Verification Plan
1.  **Manual Verification**:
    -   Place a few test orders (if db is empty) to generate data.
    -   Open Admin Dashboard > Analytics.
    -   Verify that numerical values (Revenue, Orders) match the order history.
    -   Verify charts reflect the time/date of placed orders.
    -   Submit dummy feedback and check if Sentiment gauge updates.
