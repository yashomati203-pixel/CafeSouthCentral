
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
