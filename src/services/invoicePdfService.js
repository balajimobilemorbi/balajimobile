import { storeCMS } from './storeCMS';

/**
 * BALAJI MOBILE OFFICIAL TAX INVOICE & PDF GENERATION ENGINE
 * Generates branded Tax Invoices with GSTIN, Itemized Tables, and 1-Click PDF Download/Print support.
 */
export const invoicePdfService = {

  /**
   * Generate Full Printable HTML Document for Order Invoice
   */
  generateInvoiceHtml: (order) => {
    const settings = storeCMS.getSettings();
    const storeName = settings.storeName || 'BALAJI MOBILE';
    const storeAddress = settings.storeAddress || 'Morbi - Halvad Highway, Near Sanala Bypass, Morbi, Gujarat - 363641';
    const supportPhone = settings.supportPhone || '+91 79906 48756';
    const supportEmail = settings.supportEmail || 'balajimorbi5@gmail.com';
    const gstin = '24ABCDE1234F1Z5';

    const placedDate = new Date(order.placedAt || Date.now()).toLocaleString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const items = order.items || [];
    const subtotal = items.reduce((sum, i) => sum + ((i.bmPrice || i.price || 0) * (i.quantity || 1)), 0);
    const gstAmount = Math.round(subtotal * 0.18);
    const netAmount = subtotal - gstAmount;
    const grandTotal = order.totalAmount || subtotal;

    const itemsRowsHtml = items.map((item, idx) => `
      <tr style="border-bottom: 1px solid #E5E7EB;">
        <td style="padding: 12px; font-weight: bold; color: #111827;">${idx + 1}</td>
        <td style="padding: 12px;">
          <div style="font-weight: bold; color: #111827; font-size: 14px;">${item.title || item.name}</div>
          <div style="font-size: 11px; color: #6B7280; font-family: monospace;">
            ${item.ram || ''} ${item.storage || ''} ${item.color ? `• Color: ${item.color}` : ''} • Warranty: ${item.warranty || '1 Year Brand Warranty'}
          </div>
        </td>
        <td style="padding: 12px; text-align: center; font-family: monospace;">HSN 8517</td>
        <td style="padding: 12px; text-align: center; font-weight: bold;">${item.quantity || 1}</td>
        <td style="padding: 12px; text-align: right; font-family: monospace;">₹${(item.bmPrice || item.price || 0).toLocaleString('en-IN')}</td>
        <td style="padding: 12px; text-align: right; font-weight: bold; font-family: monospace; color: #059669;">₹${((item.bmPrice || item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <title>Invoice_${order.id}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px; color: #1f2937; }
          .invoice-box { max-width: 800px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; background: #ffffff; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 900; color: #047857; letter-spacing: -0.5px; }
          .badge { background: #d1fae5; color: #047857; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: bold; font-family: monospace; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px; }
          .info-card { background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #f1f5f9; font-size: 12px; }
          .info-title { font-weight: bold; text-transform: uppercase; color: #64748b; font-size: 10px; margin-bottom: 5px; font-family: monospace; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 13px; }
          th { background: #f3f4f6; color: #374151; padding: 10px 12px; text-align: left; font-size: 11px; text-transform: uppercase; font-family: monospace; }
          .summary-box { width: 300px; margin-left: auto; margin-top: 20px; font-size: 13px; }
          .summary-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px dashed #e5e7eb; }
          .total-row { font-size: 16px; font-weight: bold; color: #047857; border-top: 2px solid #10b981; border-bottom: none; padding-top: 10px; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; font-size: 11px; color: #6b7280; }
          .seal { border: 2px dashed #059669; padding: 10px 18px; border-radius: 12px; color: #059669; font-weight: bold; font-family: monospace; text-align: center; text-transform: uppercase; }
          @media print {
            body { background: white; padding: 0; }
            .invoice-box { border: none; box-shadow: none; padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <div class="header">
            <div>
              <div class="logo" style="display: flex; align-items: center; gap: 10px;">
                ${settings.storeLogoUrl ? `<img src="${settings.storeLogoUrl}" alt="BM Logo" style="height: 44px; max-width: 150px; object-fit: contain;" />` : ''}
                <span style="font-size: 22px; font-weight: 900; color: #047857;">${storeName}</span>
              </div>
              <div style="font-size: 11px; color: #4b5563; margin-top: 4px;">Official GST Tax Invoice</div>
            </div>
            <div style="text-align: right;">
              <span class="badge">ORIGINAL TAX INVOICE</span>
              <div style="font-size: 13px; font-weight: bold; font-family: monospace; margin-top: 6px; color: #111827;"># ${order.id}</div>
              <div style="font-size: 11px; color: #6b7280; font-family: monospace;">Date: ${placedDate}</div>
            </div>
          </div>

          <div class="grid-2">
            <div class="info-card">
              <div class="info-title">STORE & GSTIN DETAILS</div>
              <div style="font-weight: bold; color: #111827; font-size: 13px;">${storeName}</div>
              <div>${storeAddress}</div>
              <div><strong>GSTIN:</strong> ${gstin}</div>
              <div><strong>Phone:</strong> ${supportPhone}</div>
              <div><strong>Email:</strong> ${supportEmail}</div>
            </div>

            <div class="info-card">
              <div class="info-title">CUSTOMER & SHIPPING ADDRESS</div>
              <div style="font-weight: bold; color: #111827; font-size: 13px;">${order.customerName}</div>
              <div><strong>Phone:</strong> +91 ${order.phone}</div>
              <div><strong>Email:</strong> ${order.email || 'N/A'}</div>
              <div style="margin-top: 4px;"><strong>Delivery Address:</strong> ${order.address}, ${order.city || ''}, ${order.district || ''}, ${order.state || ''} - ${order.pincode}</div>
            </div>
          </div>

          <div style="font-size: 12px; font-weight: bold; font-family: monospace; color: #374151; margin-bottom: 8px;">ORDERED ITEMS BREAKDOWN:</div>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Description</th>
                <th style="text-align: center;">HSN Code</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRowsHtml}
            </tbody>
          </table>

          <div class="summary-box">
            <div class="summary-row">
              <span>Taxable Value (Net):</span>
              <span style="font-family: monospace;">₹${netAmount.toLocaleString('en-IN')}</span>
            </div>
            <div class="summary-row">
              <span>Integrated GST (18%):</span>
              <span style="font-family: monospace;">₹${gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div class="summary-row">
              <span>Insured Shipping & Packaging:</span>
              <span style="color: #059669; font-weight: bold;">FREE (₹0)</span>
            </div>
            <div class="summary-row total-row">
              <span>Total Paid Amount:</span>
              <span>₹${grandTotal.toLocaleString('en-IN')}</span>
            </div>
            <div style="font-size: 10px; color: #6b7280; text-align: right; margin-top: 4px; font-family: monospace;">
              Payment Method: <strong>${order.paymentMethod}</strong> (${order.paymentStatus || 'Verified'})
            </div>
          </div>

          <div class="footer">
            <div>
              <div style="font-weight: bold; color: #111827;">Thank you for shopping at Balaji Mobile!</div>
              <div>For warranty &amp; service support, contact +91 79906 48756</div>
              <div style="font-size: 10px; color: #9ca3af; margin-top: 4px;">This is a computer-generated tax invoice. No signature required.</div>
            </div>

            <div class="seal">
              BALAJI MOBILE<br/>
              <span style="font-size: 9px; font-weight: normal;">VERIFIED TAX INVOICE</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  },

  /**
   * Download / Print Official PDF Tax Invoice Document
   */
  downloadInvoicePdf: (order) => {
    const htmlContent = invoicePdfService.generateInvoiceHtml(order);
    const printWindow = window.open('', '_blank', 'width=900,height=800');
    
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 400);
    } else {
      alert("Popup blocked! Please allow popups to download your PDF Tax Invoice.");
    }
  }
};
