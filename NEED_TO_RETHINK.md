# Need To Rethink / Backlog Ideas

## 1. Offline Order Sync via QR Code (Visual Handshake)
**Problem:** If a user is offline, they cannot send the order to the server, so the Admin doesn't see it.
**Proposed Solution:**
- **User Side:** If offline, generate a QR code containing the *full JSON payload* of the order (items, qty, price) instead of just an Order ID.
- **Admin Side:** Update the kitchen scanner to recognize these "Raw Data" QR codes. When scanned, the Admin's device (which presumably has internet) acts as the bridge and submits the order to the database on the user's behalf.
- **Benefit:** Allows ordering to complete even if the customer has 0% connectivity.
