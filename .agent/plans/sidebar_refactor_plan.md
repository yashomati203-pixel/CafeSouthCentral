# Admin Dashboard Sidebar Refactor Plan

## Goal
Transform the current Admin Dashboard (`/admin/dashboard`) from a top-tab navigation layout to a permanent vertical sidebar layout, matching the user's reference design.

## Design Changes
-   **Layout**: `flex-row` container.
    -   **Left**: Sidebar (w-64, fixed height/scrollable).
    -   **Right**: Main Content Area (flex-1, scrollable).
-   **Sidebar Content**:
    -   **Header**: "Cafe South Central" (Logo/Text).
    -   **Navigation**: Vertical list of buttons corresponding to current tabs.
        -   Dashboard (Active Orders)
        -   New Order (POS)
        -   Members
        -   Stock (Inventory)
        -   History
        -   Feedback
        -   Analytics
    -   **Footer**: Logout / User Profile.
-   **Main Content**:
    -   Existing tab content renderers.
    -   Top header (optional, maybe move "Lunch Bell" / "Scan QR" there or keep in sidebar).

## Proposed Layout Structure in `page.tsx`

```tsx
<div className="flex h-screen bg-neutral-50 overflow-hidden">
  {/* Sidebar */}
  <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 z-20">
     <div className="p-6">
        <div className="flex items-center gap-3 mb-1">
             <div className="w-8 h-8 rounded-full bg-primary-brown flex items-center justify-center text-white font-bold">SC</div>
             <h1 className="text-xl font-bold text-gray-900 leading-tight">Cafe South<br/>Central</h1>
        </div>
        <p className="text-xs text-gray-500 font-medium tracking-wider uppercase mt-1">Admin Portal</p>
     </div>
     
     <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {/* Nav Items map */}
     </nav>

     <div className="p-4 border-t border-gray-100">
        {/* Logout / User Profile */}
     </div>
  </aside>

  {/* Main Content */}
  <main className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50/50 relative">
     {/* Top Header Actions (Lunch Bell, Scan QR) */}
     <header className="h-16 px-8 border-b border-gray-200 bg-white flex items-center justify-between shrink-0">
        <h2 className="text-xl font-bold text-gray-800">{activeTabTitle}</h2>
        <div className="flex gap-3">
             {/* Action Buttons */}
        </div>
     </header>

     {/* Scrollable Content Body */}
     <div className="flex-1 overflow-y-auto p-8">
        {activeTab === 'active' && <LiveOrders ... />}
        {/* ... other tabs ... */}
     </div>
  </main>
</div>
```

## Implementation Steps
1.  Modify `src/app/admin/dashboard/page.tsx` to implement the new layout structure.
    -   Replace the top nav container with the Sidebar `<aside>`.
    -   Ensure responsiveness (maybe hide sidebar on mobile or use an overlay, but Admin is usually Desktop-first; I'll stick to flex layout).
2.  Port existing helper functions and state.
3.  Ensure "Lunch Bell" and 'Scan QR' buttons are placed logically in the new header.

## Verification
-   Check responsiveness (basic).
-   Ensure all tabs still switch correctly.
-   Ensure styles match the request (Sidebar on left, Cafe Name visible).
