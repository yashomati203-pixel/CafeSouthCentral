
export interface PrintableOrder {
    id: string;
    displayId?: string;
    user?: { name: string; phone: string };
    createdAt: string | Date;
    items: { quantity: number; name: string; notes?: string }[];
    note?: string;
    timeSlot?: string;
}

export const printKOT = (order: PrintableOrder) => {
    // Open a popup window for printing
    const printWindow = window.open('', '_blank', 'width=350,height=600,menubar=no,toolbar=no,location=no,status=no');

    if (!printWindow) {
        alert('Please allow popups to use the print feature');
        return;
    }

    const timeString = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = new Date(order.createdAt).toLocaleDateString();

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>KOT #${order.displayId || order.id.slice(0, 5)}</title>
            <style>
                @media print {
                    @page { margin: 0; size: 80mm auto; }
                    body { margin: 5mm; }
                }
                body {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 14px;
                    line-height: 1.2;
                    color: #000;
                    margin: 10px;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px dashed #000;
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                }
                .title {
                    font-size: 18px;
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                .meta {
                    font-size: 12px;
                    margin-bottom: 2px;
                }
                .items {
                    width: 100%;
                    border-collapse: collapse;
                }
                .item-row {
                    
                }
                .qty {
                    font-weight: bold;
                    width: 30px;
                    vertical-align: top;
                }
                .name {
                    
                }
                .notes {
                    font-size: 12px;
                    font-style: italic;
                    margin-left: 30px;
                    margin-bottom: 5px;
                }
                .order-note {
                    margin-top: 15px;
                    padding: 5px;
                    border: 1px solid #000;
                    font-weight: bold;
                }
                .footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 12px;
                    border-top: 2px dashed #000;
                    padding-top: 10px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="title">KITCHEN TICKET</div>
                <div class="meta">#${order.displayId || order.id.slice(0, 5)}</div>
                <div class="meta">${dateString} ${timeString}</div>
                ${order.timeSlot ? `<div class="meta" style="font-weight:bold; margin-top:5px;">⏰ SCH: ${order.timeSlot}</div>` : ''}
            </div>

            <table class="items">
                ${order.items.map(item => `
                    <tr class="item-row">
                        <td class="qty">${item.quantity}</td>
                        <td class="name">${item.name}</td>
                    </tr>
                    ${item.notes ? `<tr><td colspan="2" class="notes">(${item.notes})</td></tr>` : ''}
                `).join('')}
            </table>

            ${order.note ? `
                <div class="order-note">
                    NOTE: ${order.note}
                </div>
            ` : ''}

            <div class="footer">
                <div>${order.user?.name || 'Guest'}</div>
                <div>${order.user?.phone || ''}</div>
                <div style="margin-top:10px;">..</div>
            </div>
            
            <script>
                window.onload = function() {
                    window.print();
                    // Optional: Close after print
                    // setTimeout(function() { window.close(); }, 500);
                }
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
};

export const printBill = (order: PrintableOrder & { totalAmount: number; paymentMethod?: string }) => {
    // Open a popup window for printing
    const printWindow = window.open('', '_blank', 'width=350,height=600,menubar=no,toolbar=no,location=no,status=no');

    if (!printWindow) {
        alert('Please allow popups to use the print feature');
        return;
    }

    const timeString = new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = new Date(order.createdAt).toLocaleDateString();

    // Calculate total if not provided (fallback)
    const total = order.totalAmount || order.items.reduce((acc, i) => acc + (i.quantity * 0), 0); // Price not in PrintableOrder? Needs type update if using prices.

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Receipt #${order.displayId || order.id.slice(0, 5)}</title>
            <style>
                @media print {
                    @page { margin: 0; size: 80mm auto; }
                    body { margin: 5mm; }
                }
                body {
                    font-family: 'Courier New', Courier, monospace;
                    font-size: 14px;
                    line-height: 1.2;
                    color: #000;
                    margin: 10px;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px dashed #000;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .title {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 5px;
                    text-transform: uppercase;
                }
                .address {
                    font-size: 12px;
                    margin-bottom: 5px;
                }
                .meta {
                    font-size: 12px;
                    display: flex;
                    justify-content: space-between;
                }
                .items {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                    border-bottom: 2px dashed #000;
                }
                .items th {
                    text-align: left;
                    border-bottom: 1px solid #000;
                    padding-bottom: 5px;
                    font-size: 12px;
                }
                .item-row td {
                    padding: 5px 0;
                }
                .qty { font-weight: bold; width: 30px; vertical-align: top; }
                .name { vertical-align: top; }
                .price { text-align: right; vertical-align: top; }
                
                .total-section {
                    margin-top: 10px;
                    text-align: right;
                    font-size: 16px;
                    font-weight: bold;
                }
                .payment-info {
                    font-size: 12px;
                    margin-top: 5px;
                    text-align: right;
                }
                .footer {
                    margin-top: 30px;
                    text-align: center;
                    font-size: 12px;
                }
                .thank-you {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <div class="title">Cafe South Central</div>
                <div class="address">Food Court, IIM Nagpur</div>
                <div style="margin-top: 10px; border-top: 1px dashed #000; padding-top: 5px;">
                    <div class="meta">
                        <span>#${order.displayId || order.id.slice(0, 5)}</span>
                        <span>${dateString} ${timeString}</span>
                    </div>
                </div>
            </div>

            <table class="items">
                <thead>
                    <tr>
                        <th style="width:30px">Qt</th>
                        <th>Item</th>
                        <th style="text-align:right">₹</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr class="item-row">
                            <td class="qty">${item.quantity}</td>
                            <td class="name">${item.name}</td>
                            <td class="price">${(item as any).price ? '₹' + ((item as any).price * item.quantity) : '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>

            <div class="total-section">
                TOTAL: ₹${total}
            </div>
            <div class="payment-info">
                Payment: ${order.paymentMethod || 'CASH'}
            </div>

            <div class="footer">
                <div class="thank-you">THANK YOU!</div>
                <div>Visit Again</div>
            </div>
            
            <script>
                window.onload = function() {
                    window.print();
                    // setTimeout(function() { window.close(); }, 500);
                }
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
};
