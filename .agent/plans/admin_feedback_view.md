# Implementation Plan - Admin Feedback View

## Objective
Enable the admin to view submitted user feedback.

## Steps

1.  **Backend Implementation**
    -   Create `src/app/api/admin/feedback/route.ts` to fetch all feedback (GET).
    -   Include user details (name, phone) in the fetched data.

2.  **Frontend Implementation (Admin Dashboard)**
    -   Modify `src/app/admin/dashboard/page.tsx` (or creating a new sub-page if better, but usually dashboard pages are monolithic in this app so far).
    -   Add a new tab or section for "Feedback".
    -   Fetch and display the feedback list with:
        -   User Name
        -   Rating (Stars)
        -   Comment
        -   Date

3.  **Verification**
    -   Check if the admin can see the list of feedback.
