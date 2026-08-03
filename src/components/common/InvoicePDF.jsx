import React, { useEffect } from 'react';
import { Printer } from 'lucide-react';
import { storeCMS } from '../../services/storeCMS';

export default function InvoicePDF({ order, onClose }) {
  const settings = storeCMS.getSettings();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  const gstRate = 18;
  const taxableAmount = Math.round(order.totalAmount / (1 + gstRate / 100));
  const totalGst = order.totalAmount - taxableAmount;
  const cgst = Math.round(totalGst / 2);
  const sgst = totalGst - cgst;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white text-slate-900 rounded-3xl max-w-3xl w-full p-8 shadow-2xl relative border border-slate-200">
        
        {/* Action Buttons Top Bar (Hidden in Print) */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
              ORIGINAL TAX INVOICE
            </span>
            <span className="text-xs text-slate-500 font-mono">Invoice #{order.id}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-medium hover:bg-slate-800 transition flex items-center gap-2 text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Download PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition text-sm"
            >
              Close
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="space-y-6">
          
          {/* Header Section */}
          <div className="flex justify-between items-start pb-6 border-b border-slate-200">
            <div>
              <h1 className="font-display font-black text-2xl tracking-tight text-slate-900">
                {settings.storeName}
              </h1>
              <p className="text-xs text-slate-600 max-w-xs mt-1">{settings.address}</p>
              <p className="text-xs font-mono text-slate-500 mt-1">GSTIN: {settings.gstNumber}</p>
              <p className="text-xs text-slate-500">Email: {settings.supportEmail} | Tel: {settings.supportPhone}</p>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded bg-slate-100 font-mono text-xs font-bold text-slate-800 mb-2">
                GST TAX INVOICE
              </span>
              <p className="text-sm font-bold font-mono">Invoice No: {order.id}</p>
              <p className="text-xs text-slate-500">Date: {new Date(order.placedAt).toLocaleDateString('en-IN')}</p>
              <p className="text-xs text-slate-500">Place of Supply: Maharashtra (27)</p>
            </div>
          </div>

          {/* Billed To & Shipping Address Grid */}
          <div className="grid grid-cols-2 gap-6 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-1 font-mono">Billed & Shipped To:</h3>
              <p className="font-semibold text-slate-900 text-sm">{order.customerName}</p>
              <p className="text-slate-600 mt-1">{order.address}</p>
              <p className="text-slate-600 mt-1">Phone: {order.phone}</p>
              <p className="text-slate-600">Email: {order.email}</p>
            </div>

            <div>
              <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-1 font-mono">Dispatch Logistics Details:</h3>
              <p className="text-slate-700"><span className="font-semibold">Courier Partner:</span> {order.courierName}</p>
              <p className="text-slate-700"><span className="font-semibold">AWB Tracking #:</span> {order.trackingNumber}</p>
              <p className="text-slate-700"><span className="font-semibold">Payment Mode:</span> {order.paymentMethod}</p>
              <p className="text-slate-700"><span className="font-semibold">Payment Status:</span> <span className="text-emerald-700 font-bold">{order.paymentStatus}</span></p>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 bg-slate-100 text-slate-800 font-bold font-mono">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Item Description</th>
                <th className="py-2.5 px-3">HSN Code</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Taxable Value</th>
                <th className="py-2.5 px-3 text-right">GST Rate</th>
                <th className="py-2.5 px-3 text-right">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {order.items.map((item, idx) => {
                const itemTaxable = Math.round(item.bmPrice / 1.18);
                return (
                  <tr key={idx}>
                    <td className="py-3 px-3 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{item.title}</p>
                      <p className="text-[11px] text-slate-500 font-mono">Color: {item.color || 'Standard'} | Warranty: 1 Yr Official</p>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-600">8517 12 00</td>
                    <td className="py-3 px-3 text-center font-mono">{item.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono">₹{itemTaxable.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono">18%</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">₹{(item.bmPrice * item.quantity).toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Tax Breakdown & Totals */}
          <div className="flex justify-between items-start pt-4 border-t border-slate-200 text-xs">
            <div className="space-y-1 text-slate-500 max-w-xs">
              <p className="font-semibold text-slate-700">Terms & Conditions:</p>
              <p>1. Goods once sold carry official brand manufacturer warranty.</p>
              <p>2. Subject to Mumbai Jurisdiction only.</p>
              <p className="flex items-center gap-1 text-emerald-700 font-bold pt-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Digitally Signed & Verified E-Invoice</span>
              </p>
            </div>

            <div className="w-64 space-y-2 font-mono">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Amount:</span>
                <span>₹{taxableAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9%):</span>
                <span>₹{cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9%):</span>
                <span>₹{sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Insured Freight:</span>
                <span className="text-emerald-700 font-bold">FREE</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold text-sm pt-2 border-t border-slate-300">
                <span>Grand Total:</span>
                <span>₹{order.totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>

          {/* Signatory Seal */}
          <div className="pt-6 flex justify-end">
            <div className="text-center font-mono text-[11px] text-slate-500">
              <div className="w-36 h-12 border-b border-slate-400 mb-1 flex items-center justify-center font-serif italic text-slate-800 text-sm">
                Balaji Mobile Auth.
              </div>
              <span>For BM MOBILE PVT LTD</span>
              <p className="text-[9px] text-slate-400">Authorised Signatory</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
