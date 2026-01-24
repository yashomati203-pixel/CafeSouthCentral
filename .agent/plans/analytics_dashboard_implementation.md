# Admin Analytics Dashboard Implementation Plan

## Goal
Implement a high-fidelity Analytics Dashboard for the admin panel, matching the specific design (colors, fonts, layout) provided by the user in HTML format, ensuring it is functional and integrated into the existing Next.js application.

## User Review Required
> [!NOTE]
> I will be adding new colors and fonts to `tailwind.config.ts` to match the design. This might affect other parts if variable names collide, but I have prefixed them to avoid this.

## Proposed Changes

### Configuration
#### [MODIFY] [tailwind.config.ts](file:///c:/Users/yasho/OneDrive/Desktop/Cafe South Central/Web App v1/tailwind.config.ts)
- Add colors: `primary` (overriding or extending), `accent-gold`, `background-light/dark`, `surface-light/dark`, `text-main/subtle`.
- Add fonts: `Manrope`, `Californian FB`.

### Components
#### [NEW] [src/components/admin/AnalyticsDashboard.tsx](file:///c:/Users/yasho/OneDrive/Desktop/Cafe South Central/Web App v1/src/components/admin/AnalyticsDashboard.tsx)
- Port the provided HTML structure to React.
- Use `lucide-react` or `Material Symbols` (if available, otherwise fallback to Lucide) for icons.
- Implement sections:
    - **Header**: Title & Timeframe filter.
    - **KPI Cards**: Total Revenue, Avg Order Value, New Customers.
    - **Sales Chart**: SVG or Recharts implementation (Simulated as per HTML SVG).
    - **Top Selling Items**: Bar chart visualization.
    - **Peak Performance**: Bar chart visualization.
    - **Customer Sentiment**: Circular progress + Breakdown.
- **Props**: Accept `data` prop for dynamic values (optional for now, can self-fetch or receive from parent).

### Admin Page
#### [MODIFY] [src/app/admin/dashboard/page.tsx](file:///c:/Users/yasho/OneDrive/Desktop/Cafe South Central/Web App v1/src/app/admin/dashboard/page.tsx)
- Import `AnalyticsDashboard`.
- Replace the existing simple Analytics tab content with this new component.
- Pass necessary data (or mock data if backend endpoints aren't ready for specific analytics).

## Verification Plan

### Manual Verification
1.  **Start Server**: `npm run dev`
2.  **Login as Admin**: Set local storage `cafe_user` to `{"role": "ADMIN", "name": "Admin"}` if not logged in.
3.  **Navigate**: Go to `http://localhost:3000/admin/dashboard`.
4.  **Check UI**: Click "Analytics" tab.
    - Verify strict visual adherence to the provided HTML (colors, fonts, layout).
    - Verify responsiveness.
    - Verify interactions (hover states).
