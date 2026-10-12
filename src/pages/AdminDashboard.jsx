import React, { useState, useEffect, useMemo } from 'react';
import { 
  BarChart3, Package, ShoppingCart, Users, Tag, Image as ImageIcon, 
  Settings, Database, Plus, Edit, Trash2, Download, Upload, 
  Check, RefreshCcw, ShieldCheck, Lock, Sparkles, Layers, 
  FileCode, AlertTriangle, Eye, ArrowUpRight, KeyRound, RotateCw,
  Recycle, Clock, Zap, Timer, CheckCircle2, X, Bell, Phone, Mail, MessageSquare,
  Search, SlidersHorizontal, Save, Play, Video, TrendingUp, ChevronDown, ChevronUp, Monitor,
  Printer, FileText
} from 'lucide-react';
import { storeCMS } from '../services/storeCMS';
import { userIntentService } from '../services/userIntentService';

export default function AdminDashboard() {
  const [settings, setSettings] = useState(() => storeCMS.getSettings());
  
  // Security Authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  // Tab & Catalog State
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState(() => storeCMS.getProducts() || []);
  const [secondHandProducts, setSecondHandProducts] = useState(() => storeCMS.getSecondHandProducts() || []);
  const [categories, setCategories] = useState(() => storeCMS.getCategories() || []);
  const [brands, setBrands] = useState(() => storeCMS.getBrands() || []);
  const [banners, setBanners] = useState(() => storeCMS.getBanners() || []);
  const [coupons, setCoupons] = useState(() => storeCMS.getCoupons() || []);
  const [orders, setOrders] = useState(() => storeCMS.getOrders() || []);
  const [notifications, setNotifications] = useState(() => storeCMS.getOwnerNotifications() || []);
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);
  const [isPushing, setIsPushing] = useState(false);

  // Inventory Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Product Form Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isSecondHandModal, setIsSecondHandModal] = useState(false);
  const [productForm, setProductForm] = useState({
    title: '', brand: 'Apple', model: '', category: 'Flagship Titans', ram: '8GB', storage: '256GB', color: 'Natural Titanium',
    processor: 'Snapdragon 8 Gen 3', display: '6.7-inch OLED 120Hz',
    camera: '50MP Main + 50MP Ultra-Wide', battery: '5,000 mAh',
    condition: 'Brand New Sealed Box - 1 Year Official Warranty', warranty: '1 Year Official Warranty',
    deliveryInfo: 'Express Delivery 24-48 Hours Across India (Insured)',
    replacementInfo: '7 Days Replacement Policy',
    imei: '359481920491029', description: '', marketPrice: 99999, bmPrice: 84999, stock: 10,
    isFeatured: true, isTrending: false, isFlashSale: false, isNewArrival: false,
    imagesText: '', frames360Text: '', videoUrl: '',
    batteryHealth: '95%', deviceAge: '6 Months Old', conditionBadge: 'Superb (9/10)',
    warrantyStatus: 'Official Warranty', hasBill: 'Original Brand GST Invoice', hasBox: 'Yes - Box & Cable Included'
  });

  // Multiple Colors with Independent Galleries State
  const [colorsList, setColorsList] = useState([
    { id: 'c-1', name: 'Natural Titanium', hex: '#9A958D', images: [] }
  ]);

  const [variantsList, setVariantsList] = useState([
    { id: 'var-1', color: 'Natural Titanium', ram: '12GB', storage: '256GB', bmPrice: 84999, marketPrice: 99999, stock: 10, imagesText: '' }
  ]);

  // Security / PIN Change State
  const [currentPinInput, setCurrentPinInput] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [pinChangeSuccess, setPinChangeSuccess] = useState('');
  const [pinChangeError, setPinChangeError] = useState('');

  // Section Timers
  const [newArrivalHours, setNewArrivalHours] = useState(settings?.newArrivalTimerHours || 72);
  const [flashDealHours, setFlashDealHours] = useState(settings?.flashDealTimerHours || 24);

  // Verification & Rejection Modal State
  const [verifyModalOrder, setVerifyModalOrder] = useState(null);
  const [verifyActionType, setVerifyActionType] = useState('APPROVE');
  const [deliveryDateInput, setDeliveryDateInput] = useState('');
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Category & Banner Management Modal State
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newBrandName, setNewBrandName] = useState('');
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponAmount, setNewCouponAmount] = useState(500);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(20000);
  const [newCouponType, setNewCouponType] = useState('fixed');

  // Hero Media Customizer State
  const [heroMediaForm, setHeroMediaForm] = useState(() => storeCMS.getHeroMedia());

  // Order History Expanded Detail State
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    supportPhone: settings?.supportPhone || '7990648756',
    upiVpa: settings?.upiVpa || 'javiya36p36-1@oksbi',
    storeName: settings?.storeName || 'Balaji Mobile',
    storeAddress: settings?.storeAddress || 'Flagship Store, Morbi, Gujarat',
    ownerPin: settings?.ownerPin || '1234'
  });

  const syncState = () => {
    const updatedSettings = storeCMS.getSettings() || {};
    setProducts(storeCMS.getProducts() || []);
    setSecondHandProducts(storeCMS.getSecondHandProducts() || []);
    setCategories(storeCMS.getCategories() || []);
    setBrands(storeCMS.getBrands() || []);
    setBanners(storeCMS.getBanners() || []);
    setCoupons(storeCMS.getCoupons() || []);
    setOrders(storeCMS.getOrders() || []);
    setSettings(updatedSettings);
    setSettingsForm({
      supportPhone: updatedSettings.supportPhone || '7990648756',
      upiVpa: updatedSettings.upiVpa || 'javiya36p36-1@oksbi',
      storeName: updatedSettings.storeName || 'Balaji Mobile',
      storeAddress: updatedSettings.storeAddress || 'Flagship Store, Morbi, Gujarat',
      ownerPin: updatedSettings.ownerPin || '1234'
    });
    setNotifications(storeCMS.getOwnerNotifications() || []);
    setHeroMediaForm(storeCMS.getHeroMedia());
  };

  useEffect(() => {
    const handleUpdate = () => syncState();
    window.addEventListener('bm_cms_update', handleUpdate);
    return () => window.removeEventListener('bm_cms_update', handleUpdate);
  }, []);

  const unreadNotifs = (notifications || []).filter(n => !n.isRead);

  const pendingOrders = (orders || []).filter(o => {
    const isVerified = Boolean(o.paymentVerifiedAt) || (o.paymentStatus || '').includes('Verified by Owner') || (o.paymentStatus || '').includes('✅');
    const isCancelled = Boolean(o.cancelledAt) || (o.paymentStatus || '').includes('Cancelled') || (o.paymentStatus || '').includes('Rejected') || (o.paymentStatus || '').includes('❌') || o.orderStatus === 'Cancelled';
    const isDispatched = o.orderStatus === 'Handed to Courier' || o.orderStatus === 'Out for Delivery' || o.orderStatus === 'Delivered';
    return !isVerified && !isCancelled && !isDispatched;
  });

  const totalRevenue = (orders || []).reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  // Print / Save PDF of All Orders & Customer Details
  const handlePrintAllOrdersReport = (ordersToPrint = orders, filterLabel = 'All Customer Orders') => {
    if (!ordersToPrint || ordersToPrint.length === 0) {
      alert('⚠️ No customer orders found to print / export to PDF.');
      return;
    }

    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('⚠️ Please allow popups in your browser to open the print/PDF preview.');
      return;
    }

    const totalAmt = ordersToPrint.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
    const verifiedCount = ordersToPrint.filter(o => (o.paymentStatus || '').includes('✅') || (o.paymentStatus || '').includes('Verified')).length;
    const deliveredCount = ordersToPrint.filter(o => o.orderStatus === 'Delivered').length;
    const cancelledCount = ordersToPrint.filter(o => o.orderStatus === 'Cancelled' || (o.paymentStatus || '').includes('❌')).length;
    const pendingCount = ordersToPrint.length - verifiedCount - cancelledCount;

    const rowsHtml = ordersToPrint.map((o, index) => {
      const itemsList = (o.items || []).map(it => 
        `<div><strong>${it.title || it.name || 'Device'}</strong> <span style="color:#555;">(${[it.ram, it.storage, it.color].filter(Boolean).join(' / ')})</span> &times; ${it.quantity || 1} &bull; ₹${((it.bmPrice || it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}</div>`
      ).join('') || '<div>Standard Mobile Order</div>';

      const fullAddr = [o.address, o.city, o.district, o.state, o.pincode].filter(Boolean).join(', ');

      const statusBadgeColor = o.orderStatus === 'Delivered' 
        ? 'background:#e6fcf5; color:#087f5b; border:1px solid #b2f2bb;'
        : o.orderStatus === 'Cancelled' 
        ? 'background:#fff5f5; color:#e03131; border:1px solid #ffc9c9;'
        : 'background:#fff9db; color:#e67700; border:1px solid #ffec99;';

      return `
        <tr>
          <td style="text-align: center; font-weight: bold; width: 35px;">${index + 1}</td>
          <td style="width: 105px;">
            <strong style="color: #0c1e29; font-size: 12px;">#${o.id}</strong><br/>
            <span style="font-size: 10px; color: #666;">${o.placedAt ? new Date(o.placedAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
          </td>
          <td style="width: 170px;">
            <strong style="font-size: 12px; color: #0c1e29;">${o.customerName || 'N/A'}</strong><br/>
            <span style="font-size: 11px; font-weight: bold; color: #228be6;">📱 +91 ${o.phone || ''}</span><br/>
            ${o.email ? `<span style="font-size: 10px; color: #666;">✉️ ${o.email}</span>` : ''}
          </td>
          <td style="font-size: 11px; color: #333; max-width: 180px;">
            ${fullAddr || 'N/A'}
          </td>
          <td style="font-size: 11px; max-width: 200px;">
            ${itemsList}
          </td>
          <td style="width: 125px; font-size: 11px;">
            <strong>${o.paymentMethod || 'UPI/GPay'}</strong><br/>
            <span style="font-weight: bold; color: ${(o.paymentStatus || '').includes('✅') ? '#087f5b' : '#f08c00'};">
              ${o.paymentStatus || 'Pending'}
            </span>
            ${o.paymentId ? `<br/><span style="font-size: 9.5px; font-family: monospace; color: #666;">Txn: ${o.paymentId}</span>` : ''}
          </td>
          <td style="width: 110px; text-align: center;">
            <span style="display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 10.5px; font-weight: bold; ${statusBadgeColor}">
              ${o.orderStatus || 'Placed'}
            </span>
            ${o.trackingNumber ? `<br/><span style="font-size: 9.5px; color: #666;">AWB: ${o.trackingNumber}</span>` : ''}
          </td>
          <td style="width: 105px; text-align: right; font-weight: 900; font-size: 13px; color: #087f5b;">
            ₹${(o.totalAmount || 0).toLocaleString('en-IN')}
          </td>
        </tr>
      `;
    }).join('');

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <title>Balaji Mobile Morbi - Order & Customer Master Report (${filterLabel})</title>
        <style>
          @page {
            size: A4 landscape;
            margin: 10mm;
          }
          * { box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: #1a1a1a;
            margin: 0;
            padding: 18px;
            font-size: 11.5px;
            background: #ffffff;
          }
          .action-bar {
            margin-bottom: 16px;
            display: flex;
            gap: 12px;
            align-items: center;
          }
          .btn-print {
            background: #0C1E29;
            color: #D4AF37;
            font-weight: 800;
            border: 2px solid #D4AF37;
            padding: 9px 18px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12.5px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
          .btn-close {
            background: #e9ecef;
            color: #333;
            font-weight: 700;
            border: none;
            padding: 9px 16px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 12.5px;
          }
          .report-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2.5px solid #D4AF37;
            padding-bottom: 14px;
            margin-bottom: 14px;
          }
          .store-brand h1 {
            margin: 0 0 3px 0;
            font-size: 24px;
            font-weight: 900;
            color: #0C1E29;
            letter-spacing: -0.5px;
          }
          .store-brand h2 {
            margin: 0;
            font-size: 12.5px;
            color: #b0881e;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .store-brand p {
            margin: 4px 0 0 0;
            font-size: 11px;
            color: #555;
          }
          .store-info {
            text-align: right;
            font-size: 11px;
            color: #444;
            line-height: 1.45;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(5, 1fr);
            gap: 10px;
            margin-bottom: 14px;
          }
          .stat-box {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 8px 12px;
          }
          .stat-label {
            font-size: 10px;
            text-transform: uppercase;
            color: #6c757d;
            font-weight: 700;
          }
          .stat-value {
            font-size: 17px;
            font-weight: 900;
            color: #0C1E29;
            margin-top: 3px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 11px;
          }
          th {
            background: #0C1E29;
            color: #ffffff;
            font-weight: 700;
            text-align: left;
            padding: 8px 9px;
            font-size: 10.5px;
            text-transform: uppercase;
            letter-spacing: 0.3px;
          }
          td {
            border-bottom: 1px solid #e9ecef;
            padding: 8px 9px;
            vertical-align: top;
          }
          tr:nth-child(even) {
            background-color: #fafbfc;
          }
          .sign-area {
            margin-top: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .sign-box {
            text-align: center;
            border-top: 1.5px solid #333;
            width: 220px;
            padding-top: 5px;
            font-weight: 700;
            font-size: 11px;
          }
          .report-footer {
            margin-top: 14px;
            border-top: 1px solid #dee2e6;
            padding-top: 8px;
            font-size: 9.5px;
            color: #868e96;
            display: flex;
            justify-content: space-between;
          }
          @media print {
            body { padding: 0; }
            .action-bar { display: none !important; }
            thead { display: table-header-group; }
            tr { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="action-bar">
          <button class="btn-print" onclick="window.print()">
            🖨️ Print / Save as PDF (All Orders & Customers)
          </button>
          <button class="btn-close" onclick="window.close()">
            Close
          </button>
          <span style="font-size: 11px; color: #555;">💡 Tip: In the Print destination dialog, choose <strong>"Save as PDF"</strong> to save this document to your device.</span>
        </div>

        <div class="report-header">
          <div class="store-brand">
            <h1>BALAJI MOBILE MORBI</h1>
            <h2>Customer Orders & Fulfillment Audit Report (${filterLabel})</h2>
            <p>Generated: <strong>${new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</strong> &bull; Total Orders Analyzed: <strong>${ordersToPrint.length}</strong></p>
          </div>
          <div class="store-info">
            <strong>Balaji Mobile - Morbi Flagship Store</strong><br/>
            Shop No. 4, Super Market, Sanala Road, Morbi, Gujarat - 363641<br/>
            Customer Support Phone: +91 79906 48756 / 94297 66354<br/>
            GSTIN: ${settings?.gstNumber || '24AAACB1234F1Z5'} &bull; UPI: ${settingsForm.upiVpa || 'javiya36p36-1@oksbi'}
          </div>
        </div>

        <div class="stats-grid">
          <div class="stat-box">
            <div class="stat-label">Total Orders</div>
            <div class="stat-value">${ordersToPrint.length}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Total Revenue</div>
            <div class="stat-value" style="color: #087f5b;">₹${totalAmt.toLocaleString('en-IN')}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Verified & Paid</div>
            <div class="stat-value" style="color: #087f5b;">${verifiedCount}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Delivered Orders</div>
            <div class="stat-value" style="color: #0c1e29;">${deliveredCount}</div>
          </div>
          <div class="stat-box">
            <div class="stat-label">Pending / Processing</div>
            <div class="stat-value" style="color: #e67700;">${pendingCount}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 35px; text-align: center;">#</th>
              <th>Order ID & Date</th>
              <th>Customer Details</th>
              <th>Delivery Address</th>
              <th>Items Ordered</th>
              <th>Payment Info</th>
              <th style="text-align: center;">Status</th>
              <th style="text-align: right;">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="sign-area">
          <div style="font-size: 10px; color: #555; max-width: 450px;">
            This master order report is generated from the Balaji Mobile Central Admin CMS. All financial metrics and order statuses reflect real-time live database state.
          </div>
          <div class="sign-box">
            Authorized Store Signatory<br/>
            <span style="font-weight: normal; color: #666; font-size: 10px;">Balaji Mobile Morbi Showroom</span>
          </div>
        </div>

        <div class="report-footer">
          <span>Balaji Mobile Morbi &bull; All Rights Reserved &bull; Official Confidential Record</span>
          <span>Printed Page 1 of 1</span>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 350);
          };
        </script>
      </body>
      </html>
    `;

    printWin.document.write(htmlContent);
    printWin.document.close();
  };

  // Print Single Order Tax Invoice / Customer Dispatch Slip
  const handlePrintSingleOrder = (o) => {
    if (!o) return;

    const printWin = window.open('', '_blank');
    if (!printWin) {
      alert('⚠️ Please allow popups in your browser to print the invoice.');
      return;
    }

    const itemsHtml = (o.items || []).map((it, idx) => {
      const price = it.bmPrice || it.price || 0;
      const qty = it.quantity || 1;
      const total = price * qty;
      return `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <strong>${it.title || it.name}</strong><br/>
            <span style="font-size: 11px; color: #666;">Variant: ${[it.ram, it.storage, it.color].filter(Boolean).join(' / ')}</span>
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${qty}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${price.toLocaleString('en-IN')}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold;">₹${total.toLocaleString('en-IN')}</td>
        </tr>
      `;
    }).join('');

    const fullAddr = [o.address, o.city, o.district, o.state, o.pincode].filter(Boolean).join(', ');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>Invoice #${o.id} - Balaji Mobile Morbi</title>
        <style>
          @page { size: A4 portrait; margin: 12mm; }
          * { box-sizing: border-box; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1a1a1a; margin: 0; padding: 20px; font-size: 12px; }
          .btn-bar { margin-bottom: 18px; display: flex; gap: 10px; }
          .btn-p { background: #0C1E29; color: #D4AF37; font-weight: bold; border: 2px solid #D4AF37; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
          .btn-c { background: #eee; border: none; padding: 8px 14px; border-radius: 8px; cursor: pointer; }
          .inv-header { display: flex; justify-content: space-between; border-bottom: 2px solid #D4AF37; padding-bottom: 15px; margin-bottom: 18px; }
          .brand-title { font-size: 24px; font-weight: 900; color: #0C1E29; margin: 0; }
          .inv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; background: #fbfbfc; border: 1px solid #eee; padding: 14px; border-radius: 8px; margin-bottom: 18px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 18px; }
          th { background: #0C1E29; color: #fff; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; }
          .total-box { display: flex; justify-content: flex-end; margin-bottom: 20px; }
          .total-tbl { width: 300px; }
          .total-tbl td { padding: 6px 10px; }
          .sign-area { display: flex; justify-content: space-between; align-items: flex-end; margin-top: 40px; }
          .sign-line { border-top: 1px solid #333; width: 220px; text-align: center; padding-top: 6px; font-size: 11px; font-weight: bold; }
          @media print {
            body { padding: 0; }
            .btn-bar { display: none !important; }
            tr { page-break-inside: avoid; }
          }
        </style>
      </head>
      <body>
        <div class="btn-bar">
          <button class="btn-p" onclick="window.print()">🖨️ Print / Save PDF Invoice</button>
          <button class="btn-c" onclick="window.close()">Close</button>
        </div>

        <div class="inv-header">
          <div>
            <h1 class="brand-title">BALAJI MOBILE MORBI</h1>
            <p style="margin: 3px 0 0; color: #b0881e; font-weight: bold;">RETAIL TAX INVOICE & CUSTOMER BILL</p>
            <p style="margin: 3px 0 0; color: #666; font-size: 11px;">Invoice / Order No: <strong>#${o.id}</strong></p>
            <p style="margin: 2px 0 0; color: #666; font-size: 11px;">Date: <strong>${new Date(o.placedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</strong></p>
          </div>
          <div style="text-align: right; font-size: 11px; color: #444;">
            <strong>Balaji Mobile Flagship Showroom</strong><br/>
            Shop No. 4, Super Market, Sanala Road, Morbi - 363641<br/>
            Phone: +91 79906 48756 / 94297 66354<br/>
            GSTIN: ${settings?.gstNumber || '24AAACB1234F1Z5'}<br/>
            Email: ${settingsForm.supportEmail || 'support@balajimobile.com'}
          </div>
        </div>

        <div class="inv-grid">
          <div>
            <strong style="color: #0C1E29; text-transform: uppercase; font-size: 11px;">Customer Details (Billed To):</strong><br/>
            <strong style="font-size: 14px; color: #0C1E29;">${o.customerName}</strong><br/>
            <span>📱 +91 ${o.phone}</span><br/>
            ${o.email ? `<span>✉️ ${o.email}</span><br/>` : ''}
            <span style="color: #555;">📍 ${fullAddr}</span>
          </div>
          <div>
            <strong style="color: #0C1E29; text-transform: uppercase; font-size: 11px;">Payment & Shipping Details:</strong><br/>
            <span>Payment Method: <strong>${o.paymentMethod || 'UPI/GPay'}</strong></span><br/>
            <span>Payment Status: <strong style="color: ${(o.paymentStatus || '').includes('✅') ? '#087f5b' : '#f08c00'};">${o.paymentStatus || 'Pending'}</strong></span><br/>
            ${o.paymentId ? `<span>Txn / Ref ID: <strong>${o.paymentId}</strong></span><br/>` : ''}
            <span>Order Status: <strong>${o.orderStatus || 'Placed'}</strong></span><br/>
            ${o.trackingNumber ? `<span>Courier / AWB: <strong>${o.courierName || 'DTDC'} - ${o.trackingNumber}</strong></span>` : ''}
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 40px; text-align: center;">#</th>
              <th>Description / Product</th>
              <th style="width: 60px; text-align: center;">Qty</th>
              <th style="width: 110px; text-align: right;">Unit Price</th>
              <th style="width: 120px; text-align: right;">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div class="total-box">
          <table class="total-tbl">
            <tr>
              <td>Sub Total:</td>
              <td style="text-align: right; font-weight: bold;">₹${(o.totalAmount || 0).toLocaleString('en-IN')}</td>
            </tr>
            <tr>
              <td>GST (Included):</td>
              <td style="text-align: right; color: #666;">Included in Price</td>
            </tr>
            <tr>
              <td>Shipping / Delivery:</td>
              <td style="text-align: right; color: #087f5b; font-weight: bold;">FREE INSURED</td>
            </tr>
            <tr style="border-top: 2px solid #0C1E29; font-size: 15px;">
              <td><strong>Grand Total:</strong></td>
              <td style="text-align: right; font-weight: 900; color: #087f5b;">₹${(o.totalAmount || 0).toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <div style="font-size: 10.5px; color: #666; border-top: 1px solid #eee; padding-top: 10px;">
          <strong>Terms & Conditions:</strong><br/>
          &bull; 1 Year Official Brand Warranty on sealed devices &bull; 7 Days replacement for eligible technical defects.<br/>
          &bull; Goods once sold cannot be returned without original brand box & serial verification.
        </div>

        <div class="sign-area">
          <div style="font-size: 10px; color: #777;">
            Thank you for shopping at Balaji Mobile Morbi!<br/>
            Visit again for best smartphone deals & genuine accessories.
          </div>
          <div class="sign-line">
            Authorized Signature & Stamp<br/>
            <span style="font-size: 10px; color: #666; font-weight: normal;">Balaji Mobile Morbi</span>
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() { window.print(); }, 350);
          };
        </script>
      </body>
      </html>
    `;

    printWin.document.write(htmlContent);
    printWin.document.close();
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const correctPin = settings?.ownerPin || settings?.adminPin || '1234';
    if (pinInput.trim() === String(correctPin).trim()) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleChangeAdminPin = (e) => {
    e.preventDefault();
    setPinChangeSuccess('');
    setPinChangeError('');

    const currentSavedPin = String(settings?.ownerPin || settings?.adminPin || '1234').trim();
    if (currentPinInput.trim() !== currentSavedPin) {
      setPinChangeError('⚠️ Current PIN is incorrect. Please enter your existing PIN.');
      return;
    }
    if (!newPinInput.trim()) {
      setPinChangeError('⚠️ New PIN cannot be empty.');
      return;
    }
    if (newPinInput.trim().length < 4) {
      setPinChangeError('⚠️ New PIN must be at least 4 characters long.');
      return;
    }
    if (newPinInput.trim() !== confirmPinInput.trim()) {
      setPinChangeError('⚠️ New PIN and Confirm PIN do not match.');
      return;
    }

    const updatedSettings = {
      ...settings,
      ownerPin: newPinInput.trim(),
      adminPin: newPinInput.trim()
    };
    storeCMS.updateSettings(updatedSettings);
    setSettings(updatedSettings);
    setSettingsForm(prev => ({ ...prev, ownerPin: newPinInput.trim() }));
    setCurrentPinInput('');
    setNewPinInput('');
    setConfirmPinInput('');
    setPinChangeSuccess('✅ Admin PIN updated successfully! The new PIN works immediately for all future logins.');
  };

  // Passcode Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-[32px] bg-[#0D1117] border border-[#D4AF37]/30 shadow-[0_30px_70px_rgba(0,0,0,0.95)] text-center font-mono space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-widest text-[#D4AF37] font-bold">BALAJI MOBILE CMS</span>
            <h2 className="font-display font-black text-2xl text-[#F8F8F8] mt-1">Welcome princebhai</h2>
            <p className="text-xs text-[#B8BDC8] font-mono mt-1">Owner princebhai, please enter the security password to log into Admin Control Panel.</p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                maxLength={16}
                placeholder="Enter Master Password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full px-4 py-3.5 rounded-2xl bg-white/[0.04] border border-[#D4AF37]/40 text-[#F8F8F8] text-center font-mono text-lg tracking-widest outline-none focus:border-[#D4AF37]"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3.5 top-4 text-xs text-[#B8BDC8] hover:text-[#F8F8F8]"
              >
                {showPin ? 'Hide' : 'Show'}
              </button>
            </div>
            {pinError && <p className="text-xs font-mono text-rose-400 font-bold">⚠️ Access Denied: Incorrect Master Password.</p>}
            <button type="submit" className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-sm shadow-lg transition font-mono">
              Unlock Management Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const allBrandsList = ['Apple','Samsung','OnePlus','Google Pixel','Xiaomi','Redmi','POCO','Vivo','iQOO','OPPO','Realme','Motorola','Nokia','Nothing','ASUS ROG','Infinix','Tecno','Lava','Honor','Lenovo','Sony Xperia','CMF by Nothing','ITEL'];

  const compressImage = (dataUrl) => {
    return new Promise((resolve) => {
      if (!dataUrl || !dataUrl.startsWith('data:image')) return resolve(dataUrl);
      const img = new Image();
      img.onload = () => {
        const maxWidth = 800;
        const maxHeight = 800;
        let w = img.width;
        let h = img.height;
        if (w > maxWidth || h > maxHeight) {
          if (w > h) {
            h = Math.round((h * maxWidth) / w);
            w = maxWidth;
          } else {
            w = Math.round((w * maxHeight) / h);
            h = maxHeight;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  };

  const handleOpenAddProduct = (isSecondHand = false) => {
    setEditingProductId(null);
    setIsSecondHandModal(isSecondHand);
    const defaultBmPrice = isSecondHand ? 29999 : 84999;
    const defaultMarketPrice = isSecondHand ? 45000 : 99999;
    
    setProductForm({
      title: '',
      brand: 'Apple',
      model: '',
      category: categories[0]?.name || 'Flagship Titans',
      ram: '12GB',
      storage: '256GB',
      color: 'Natural Titanium',
      processor: 'Snapdragon 8 Gen 3',
      display: '6.7-inch OLED 120Hz',
      camera: '50MP Main + 50MP Ultra-Wide',
      battery: '5,000 mAh',
      condition: isSecondHand ? 'Good Condition - Tested & Verified by Balaji Mobile' : 'Brand New Sealed Box - 1 Year Official Warranty',
      warranty: isSecondHand ? '3 Months Balaji Mobile Shop Warranty' : '1 Year Official Warranty',
      deliveryInfo: 'Express Delivery 24-48 Hours Across India (Insured)',
      replacementInfo: '7 Days Replacement Policy',
      imei: `35${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      description: isSecondHand ? 'Pre-owned flagship device in tested mint condition.' : 'Brand new sealed box with original manufacturer warranty.',
      marketPrice: defaultMarketPrice,
      bmPrice: defaultBmPrice,
      stock: isSecondHand ? 1 : 10,
      isFeatured: true,
      isTrending: false,
      isFlashSale: false,
      isNewArrival: false,
      imagesText: '',
      frames360Text: '',
      videoUrl: '',
      batteryHealth: '95%',
      deviceAge: '6 Months Old',
      conditionBadge: 'Superb (9/10)',
      warrantyStatus: 'Official Warranty',
      hasBill: 'Original Brand GST Invoice',
      hasBox: 'Yes - Box & Cable Included'
    });

    setColorsList([
      {
        id: `c-${Date.now()}-1`,
        name: 'Natural Titanium',
        hex: '#9A958D',
        images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1200&auto=format&fit=crop']
      }
    ]);

    setVariantsList([
      { id: 'var-1', color: 'Natural Titanium', ram: '12GB', storage: '256GB', bmPrice: defaultBmPrice, marketPrice: defaultMarketPrice, stock: isSecondHand ? 1 : 10, imagesText: '' }
    ]);

    setShowProductModal(true);
  };

  const safeArrayJoin = (val) => {
    if (!val) return '';
    if (Array.isArray(val)) {
      return val.map(item => typeof item === 'object' ? JSON.stringify(item) : item).join('\n');
    }
    if (typeof val === 'string') return val;
    return String(val);
  };

  const handleOpenEditProduct = (prod, isSecondHand = false) => {
    if (!prod) return;
    setEditingProductId(prod.id);
    setIsSecondHandModal(isSecondHand);

    setProductForm({
      ...prod,
      title: prod.title || '',
      brand: prod.brand || 'Apple',
      model: prod.model || prod.title || '',
      category: prod.category || categories[0]?.name || 'Flagship Titans',
      ram: prod.ram || '12GB',
      storage: prod.storage || '256GB',
      color: prod.color || 'Natural Titanium',
      processor: prod.specs?.processor || prod.processor || '',
      display: prod.specs?.display || prod.display || '',
      camera: prod.specs?.camera || prod.camera || '',
      battery: prod.specs?.battery || prod.battery || '',
      condition: prod.condition || (isSecondHand ? 'Tested & Verified Pre-Owned' : 'Brand New Sealed Box - 1 Year Official Warranty'),
      warranty: prod.warranty || (isSecondHand ? '3 Months BM Warranty' : '1 Year Official Warranty'),
      deliveryInfo: prod.deliveryInfo || 'Express Delivery 24-48 Hours Across India (Insured)',
      replacementInfo: prod.replacementInfo || '7 Days Replacement Policy',
      imei: prod.imei || '',
      description: prod.description || '',
      marketPrice: Number(prod.marketPrice) || Number(prod.bmPrice) || 0,
      bmPrice: Number(prod.bmPrice) || 0,
      stock: Number(prod.stock) || 1,
      isFeatured: Boolean(prod.isFeatured),
      isTrending: Boolean(prod.isTrending),
      isFlashSale: Boolean(prod.isFlashSale),
      isNewArrival: Boolean(prod.isNewArrival),
      imagesText: Array.isArray(prod.images) ? prod.images.filter(img => typeof img === 'string').join('\n') : (typeof prod.images === 'string' ? prod.images : ''),
      frames360Text: safeArrayJoin(prod.frames360),
      videoUrl: prod.videoUrl || '',
      batteryHealth: prod.batteryHealth || '95%',
      deviceAge: prod.deviceAge || '6 Months Old',
      conditionBadge: prod.conditionBadge || 'Superb (9/10)',
      warrantyStatus: prod.warrantyStatus || 'Official Warranty',
      hasBill: prod.hasBill || 'Original Brand GST Invoice',
      hasBox: prod.hasBox || 'Yes - Box & Cable Included'
    });

    // Populate colorsList from prod.colors
    let parsedColors = [];
    if (Array.isArray(prod.colors) && prod.colors.length > 0) {
      if (typeof prod.colors[0] === 'object') {
        parsedColors = prod.colors.map((c, i) => ({
          id: c.id || `c-${Date.now()}-${i}`,
          name: c.name || `Color ${i + 1}`,
          hex: c.hex || '#111827',
          images: Array.isArray(c.images) && c.images.length > 0 ? c.images : (Array.isArray(prod.images) ? prod.images : [])
        }));
      } else {
        parsedColors = prod.colors.map((cName, i) => ({
          id: `c-${Date.now()}-${i}`,
          name: String(cName),
          hex: '#111827',
          images: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images : []
        }));
      }
    } else if (prod.color) {
      parsedColors = [{
        id: `c-${Date.now()}-1`,
        name: prod.color,
        hex: '#111827',
        images: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images : []
      }];
    } else {
      parsedColors = [{
        id: `c-${Date.now()}-1`,
        name: 'Black',
        hex: '#111827',
        images: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images : []
      }];
    }
    setColorsList(parsedColors);

    if (prod.variants && Array.isArray(prod.variants) && prod.variants.length > 0) {
      setVariantsList(prod.variants.map(v => ({
        ...v,
        imagesText: safeArrayJoin(v.images || v.imagesText)
      })));
    } else {
      setVariantsList([
        {
          id: 'var-1',
          color: parsedColors[0]?.name || prod.color || 'Natural Titanium',
          ram: prod.ram || '12GB',
          storage: prod.storage || '256GB',
          bmPrice: prod.bmPrice || 84999,
          marketPrice: prod.marketPrice || 99999,
          stock: prod.stock || 10,
          imagesText: Array.isArray(prod.images) ? prod.images.join('\n') : ''
        }
      ]);
    }

    setShowProductModal(true);
  };

  // Color CRUD Handlers
  const handleAddColor = () => {
    const newColorId = `c-${Date.now()}-${colorsList.length + 1}`;
    setColorsList([
      ...colorsList,
      {
        id: newColorId,
        name: `Color ${colorsList.length + 1}`,
        hex: '#2B2B2A',
        images: []
      }
    ]);
  };

  const handleRemoveColor = (colorId) => {
    if (colorsList.length <= 1) {
      alert("A product must have at least 1 color.");
      return;
    }
    setColorsList(colorsList.filter(c => c.id !== colorId));
  };

  const handleUpdateColorField = (colorId, field, value) => {
    setColorsList(colorsList.map(c => c.id === colorId ? { ...c, [field]: value } : c));
  };

  const handleAddColorImage = (colorId, imageUrl) => {
    if (!imageUrl || !imageUrl.trim()) return;
    setColorsList(colorsList.map(c => {
      if (c.id === colorId) {
        return { ...c, images: [...(c.images || []), imageUrl.trim()] };
      }
      return c;
    }));
  };

  const handleRemoveColorImage = (colorId, imgIndex) => {
    setColorsList(colorsList.map(c => {
      if (c.id === colorId) {
        const updatedImages = (c.images || []).filter((_, idx) => idx !== imgIndex);
        return { ...c, images: updatedImages };
      }
      return c;
    }));
  };

  const handleMoveColorImage = (colorId, imgIndex, direction) => {
    setColorsList(colorsList.map(c => {
      if (c.id === colorId) {
        const images = [...(c.images || [])];
        const targetIndex = direction === 'left' ? imgIndex - 1 : imgIndex + 1;
        if (targetIndex >= 0 && targetIndex < images.length) {
          const temp = images[imgIndex];
          images[imgIndex] = images[targetIndex];
          images[targetIndex] = temp;
        }
        return { ...c, images };
      }
      return c;
    }));
  };

  const handleColorFileUpload = (colorId, e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawBase64 = event.target.result;
        const compressed = await compressImage(rawBase64);
        setColorsList(prev => prev.map(c => {
          if (c.id === colorId) {
            return { ...c, images: [...(c.images || []), compressed] };
          }
          return c;
        }));
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const handleUpdateVariant = (index, field, value) => {
    const updated = [...variantsList];
    updated[index] = { ...updated[index], [field]: value };
    setVariantsList(updated);
  };

  const handleAddVariantSection = () => {
    const prevVar = variantsList[variantsList.length - 1] || {};
    setVariantsList([
      ...variantsList,
      {
        id: `var-${Date.now()}-${variantsList.length + 1}`,
        color: prevVar.color || 'Black Titanium',
        ram: prevVar.ram || '12GB',
        storage: prevVar.storage === '256GB' ? '512GB' : '1TB',
        bmPrice: (prevVar.bmPrice || 84999) + 10000,
        marketPrice: (prevVar.marketPrice || 99999) + 10000,
        stock: prevVar.stock || 5,
        imagesText: prevVar.imagesText || ''
      }
    ]);
  };

  const handleRemoveVariantSection = (index) => {
    if (variantsList.length <= 1) return;
    setVariantsList(variantsList.filter((_, idx) => idx !== index));
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    // Prepare structured colors
    const enrichedColors = colorsList.map((c, i) => {
      const cImages = Array.isArray(c.images) ? c.images.filter(Boolean) : [];
      return {
        id: c.id || `c-${Date.now()}-${i}`,
        name: (c.name || `Color ${i + 1}`).trim(),
        hex: c.hex || '#111827',
        images: cImages
      };
    });

    // Collect all photos from all colors for global fallback
    const allColorPhotos = enrichedColors.flatMap(c => c.images).filter(Boolean);
    const parsedGlobalImages = productForm.imagesText ? productForm.imagesText.split('\n').map(s => s.trim()).filter(Boolean) : [];
    
    let defaultImages = allColorPhotos.length > 0 ? allColorPhotos : parsedGlobalImages;
    if (defaultImages.length === 0) {
      defaultImages = ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop'];
    }

    // Ensure every color has images if empty
    const finalColors = enrichedColors.map(c => ({
      ...c,
      images: c.images.length > 0 ? c.images : defaultImages
    }));

    const parsed360 = productForm.frames360Text ? productForm.frames360Text.split('\n').map(s => s.trim()).filter(Boolean) : [];
    const firstColor = finalColors[0]?.name || productForm.color || 'Natural Titanium';

    const processedVariants = variantsList.map(v => {
      const vImages = v.imagesText ? v.imagesText.split('\n').map(s => s.trim()).filter(Boolean) : [];
      const matchingColor = finalColors.find(c => c.name.toLowerCase() === (v.color || '').toLowerCase());
      return {
        ...v,
        images: vImages.length > 0 ? vImages : (matchingColor?.images?.length ? matchingColor.images : defaultImages)
      };
    });

    const uniqueRams = Array.from(new Set([productForm.ram, ...processedVariants.map(v => v.ram)].filter(Boolean)));
    const uniqueStorages = Array.from(new Set([productForm.storage, ...processedVariants.map(v => v.storage)].filter(Boolean)));

    const payload = {
      ...productForm,
      title: (productForm.title || '').trim(),
      brand: (productForm.brand || 'Apple').trim(),
      model: (productForm.model || productForm.title || '').trim(),
      category: productForm.category || categories[0]?.name || 'Flagship Titans',
      bmPrice: Number(productForm.bmPrice) || 0,
      marketPrice: Number(productForm.marketPrice) || Number(productForm.bmPrice) || 0,
      stock: Number(productForm.stock) || 1,
      color: firstColor,
      colors: finalColors,
      images: finalColors[0]?.images?.length ? finalColors[0].images : defaultImages,
      frames360: parsed360.length > 0 ? parsed360 : defaultImages,
      variants: processedVariants,
      ramOptions: uniqueRams.length > 0 ? uniqueRams : [productForm.ram || '12GB'],
      storageOptions: uniqueStorages.length > 0 ? uniqueStorages : [productForm.storage || '256GB'],
      description: productForm.description || '',
      condition: productForm.condition || (isSecondHandModal ? 'Tested & Verified Pre-Owned' : 'Brand New Sealed Box'),
      warranty: productForm.warranty || (isSecondHandModal ? '3 Months BM Warranty' : '1 Year Official Warranty'),
      deliveryInfo: productForm.deliveryInfo || 'Express Delivery 24-48 Hours Across India (Insured)',
      replacementInfo: productForm.replacementInfo || '7 Days Replacement Policy',
      specs: {
        processor: productForm.processor || '',
        display: productForm.display || '',
        camera: productForm.camera || '',
        battery: productForm.battery || '',
        charging: 'Fast Charging Supported',
        os: 'iOS / Android Flagship OS',
        security: 'Biometric Face & Fingerprint',
        connectivity: '5G Dual SIM, Wi-Fi 6E, Bluetooth 5.3'
      }
    };

    if (isSecondHandModal) {
      if (editingProductId) {
        storeCMS.updateSecondHandProduct(editingProductId, payload);
      } else {
        storeCMS.addSecondHandProduct(payload);
      }
    } else {
      if (editingProductId) {
        storeCMS.updateProduct(editingProductId, payload);
      } else {
        storeCMS.addProduct(payload);
      }
    }

    setShowProductModal(false);
    syncState();
  };

  const handleImageFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const rawBase64 = event.target.result;
        const compressed = await compressImage(rawBase64);
        setProductForm(prev => ({
          ...prev,
          imagesText: prev.imagesText ? `${prev.imagesText}\n${compressed}` : compressed
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Video = event.target.result;
        setProductForm(prev => ({ ...prev, videoUrl: base64Video }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let item of items) {
      if (item.type.indexOf('image') !== -1) {
        const blob = item.getAsFile();
        const reader = new FileReader();
        reader.onload = async (event) => {
          const rawBase64 = event.target.result;
          const compressed = await compressImage(rawBase64);
          setProductForm(prev => ({
            ...prev,
            imagesText: prev.imagesText ? `${prev.imagesText}\n${compressed}` : compressed
          }));
        };
        reader.readAsDataURL(blob);
      }
    }
  };

  const handleDeleteProduct = (id, isSecondHand = false) => {
    if (confirm("Delete this phone from store catalog?")) {
      if (isSecondHand) {
        storeCMS.deleteSecondHandProduct(id);
      } else {
        storeCMS.deleteProduct(id);
      }
      syncState();
    }
  };

  const handleStatusUpdate = (orderId, newStatus, order) => {
    storeCMS.updateOrderStatus(orderId, newStatus);
    syncState();
    if (order && order.phone) {
      const notif = storeCMS.getOrderStatusNotification(order, newStatus);
      if (notif?.whatsappUrl) {
        window.open(notif.whatsappUrl, '_blank');
      }
    }
  };

  const handleOpenVerifyModal = (order) => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    const dateFormatted = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    
    setVerifyModalOrder(order);
    setVerifyActionType('APPROVE');
    setDeliveryDateInput(dateFormatted);
  };

  const handleOpenRejectModal = (order) => {
    setVerifyModalOrder(order);
    setVerifyActionType('REJECT');
    setRejectionReasonInput(`Payment of ₹${(order.totalAmount || 0).toLocaleString('en-IN')} was NOT received in Balaji Mobile bank account.`);
  };

  const handleConfirmVerificationModal = (e) => {
    e.preventDefault();
    if (!verifyModalOrder) return;

    const orderId = verifyModalOrder.id;
    const allOrders = storeCMS.getOrders();

    if (verifyActionType === 'APPROVE') {
      const dateText = deliveryDateInput.trim() || 'Within 2-3 Business Days';
      const updated = allOrders.map(o => {
        if (o.id === orderId) {
          return { 
            ...o, 
            paymentStatus: '✅ Payment Verified by Owner', 
            orderStatus: 'Packed & Verified',
            estDelivery: dateText,
            paymentVerifiedAt: new Date().toISOString() 
          };
        }
        return o;
      });
      storeCMS.saveOrders(updated);
      storeCMS.dismissOwnerNotification(orderId);
      syncState();

      const notif = storeCMS.getCustomerVerificationNotification(
        { ...verifyModalOrder, estDelivery: dateText }, 
        dateText
      );
      
      window.open(notif.whatsappUrl, '_blank');
      if (notif.mailtoUrl) {
        setTimeout(() => { window.open(notif.mailtoUrl, '_blank'); }, 600);
      }
      alert(`✅ Order ${orderId} Confirmed!\n\nExpected Delivery: ${dateText}`);
    } else {
      const reasonText = rejectionReasonInput.trim() || 'Payment not credited to shop bank account.';
      const updated = allOrders.map(o => {
        if (o.id === orderId) {
          return { 
            ...o, 
            paymentStatus: '❌ Rejected / Cancelled', 
            orderStatus: 'Cancelled',
            rejectionReason: reasonText,
            cancelledAt: new Date().toISOString() 
          };
        }
        return o;
      });
      storeCMS.saveOrders(updated);
      storeCMS.dismissOwnerNotification(orderId);
      syncState();

      const notif = storeCMS.getCustomerRejectionNotification(verifyModalOrder, reasonText);
      window.open(notif.whatsappUrl, '_blank');
      if (notif.mailtoUrl) {
        setTimeout(() => { window.open(notif.mailtoUrl, '_blank'); }, 600);
      }
      alert(`❌ Order ${orderId} Cancelled.`);
    }

    setVerifyModalOrder(null);
  };

  const handleResetNewArrivalTimer = () => {
    storeCMS.resetNewArrivalTimer(newArrivalHours);
    alert(`New Arrival timer reset to ${newArrivalHours} hours!`);
    syncState();
  };

  const handleResetFlashDealTimer = () => {
    storeCMS.resetFlashDealTimer(flashDealHours);
    alert(`Flash Deal timer reset to ${flashDealHours} hours!`);
    syncState();
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    storeCMS.updateSettings(settingsForm);
    alert("✅ Store Settings & PIN Code Updated Successfully!");
    syncState();
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const currentCats = storeCMS.getCategories();
    const newCat = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: newCatSlug.trim() || newCatName.toLowerCase().replace(/[^a-z0-9]/g, '-')
    };
    storeCMS.saveCategories([...currentCats, newCat]);
    setNewCatName('');
    setNewCatSlug('');
    syncState();
  };

  const handleDeleteCategory = (id) => {
    if (confirm("Delete this category?")) {
      const currentCats = storeCMS.getCategories();
      storeCMS.saveCategories(currentCats.filter(c => c.id !== id));
      syncState();
    }
  };

  const handleAddBrand = (e) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    const currentBrands = storeCMS.getBrands();
    const newB = {
      id: `b-${Date.now()}`,
      name: newBrandName.trim(),
      logo: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=200'
    };
    storeCMS.saveBrands([...currentBrands, newB]);
    setNewBrandName('');
    syncState();
  };

  const handleDeleteBrand = (id) => {
    if (confirm("Delete this brand?")) {
      const currentBrands = storeCMS.getBrands();
      storeCMS.saveBrands(currentBrands.filter(b => b.id !== id));
      syncState();
    }
  };

  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;
    const currentCoupons = storeCMS.getCoupons();
    const newC = {
      id: `cpn-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      amount: Number(newCouponAmount),
      minOrder: Number(newCouponMinOrder)
    };
    storeCMS.saveCoupons([...currentCoupons, newC]);
    setNewCouponCode('');
    syncState();
  };

  const handleDeleteCoupon = (id) => {
    if (confirm("Delete coupon code?")) {
      const currentCoupons = storeCMS.getCoupons();
      storeCMS.saveCoupons(currentCoupons.filter(c => c.id !== id));
      syncState();
    }
  };

  const inputClass = "w-full px-3.5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#F8F8F8] font-mono text-xs outline-none focus:border-[#D4AF37]";

  // Crash-Proof Admin Product Card Component
  const AdminProductCard = ({ p, isSecondHand = false }) => {
    if (!p) return null;

    let imgUrl = 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop';
    if (p.images) {
      if (Array.isArray(p.images) && p.images.length > 0 && typeof p.images[0] === 'string' && p.images[0].trim().length > 0) {
        imgUrl = p.images[0].trim();
      } else if (typeof p.images === 'string' && p.images.trim().length > 0) {
        imgUrl = p.images.trim();
      }
    }

    const bmPriceNum = Number(p.bmPrice) || 0;
    const marketPriceNum = Number(p.marketPrice) || 0;
    const priceFormatted = bmPriceNum.toLocaleString('en-IN');
    const marketPriceFormatted = marketPriceNum.toLocaleString('en-IN');

    return (
      <div className="p-5 rounded-[24px] bg-[#0D1117] border border-white/[0.08] space-y-3.5 flex flex-col justify-between hover:border-[#D4AF37]/50 transition shadow-lg group">
        <div className="space-y-3">
          <div className="h-44 w-full flex items-center justify-center rounded-2xl bg-[#050505] p-3 relative border border-white/[0.08] overflow-hidden">
            <img src={imgUrl} alt={p.title || 'Phone'} className="max-h-full max-w-full object-contain group-hover:scale-105 transition duration-300" />
            {isSecondHand && (
              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#050505] text-[9px] font-bold font-mono">PRE-OWNED</span>
            )}
            <span className={`absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold ${
              (p.stock ?? 0) > 0 ? 'bg-[#0FAE72]/20 text-[#10C480] border border-[#0FAE72]/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
            }`}>
              {(p.stock ?? 0) > 0 ? `${p.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider font-mono">{p.brand || 'SMARTPHONE'}</span>
              <span className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-[#E7C76A] text-[9px] font-mono font-bold truncate max-w-[50%]">{p.category || 'Flagship Titans'}</span>
            </div>
            <h4 className="font-display font-bold text-[#F8F8F8] text-sm truncate mt-0.5">{p.title || 'Untitled Phone'}</h4>
            {p.condition && <p className="text-[#B8BDC8] text-[11px] font-mono mt-0.5 truncate">Specs: <span className="text-[#0FAE72] font-bold">{p.ram || '8GB'} • {p.storage || '256GB'}</span></p>}
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/[0.08] font-mono">
            <div>
              <span className="font-display font-black text-[#0FAE72] text-sm">₹{priceFormatted}</span>
              {marketPriceNum > bmPriceNum && (
                <span className="text-[10px] text-[#B8BDC8] line-through ml-2">₹{marketPriceFormatted}</span>
              )}
            </div>
            {p.variants && Array.isArray(p.variants) && p.variants.length > 1 && (
              <span className="px-2 py-0.5 rounded text-[10px] bg-[#D4AF37]/15 text-[#E7C76A] border border-[#D4AF37]/30">
                {p.variants.length} Variants
              </span>
            )}
          </div>
        </div>

        <div className="pt-3 border-t border-white/[0.08] grid grid-cols-2 gap-2 font-mono text-xs">
          <button
            onClick={() => handleOpenEditProduct(p, isSecondHand)}
            className="py-2.5 rounded-xl bg-white/[0.04] text-[#D4AF37] border border-[#D4AF37]/30 font-bold hover:bg-[#D4AF37] hover:text-[#050505] transition flex items-center justify-center gap-1.5"
          >
            <Edit className="w-3.5 h-3.5" /> Edit
          </button>
          <button
            onClick={() => handleDeleteProduct(p.id, isSecondHand)}
            className="py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 font-bold hover:bg-rose-500 hover:text-white transition flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete
          </button>
        </div>
      </div>
    );
  };

  // Filtered Products for Inventory Search
  const filteredNewProducts = (products || []).filter(p => {
    if (productSearch && !(p.title || '').toLowerCase().includes(productSearch.toLowerCase()) && !(p.brand || '').toLowerCase().includes(productSearch.toLowerCase())) return false;
    if (selectedBrandFilter !== 'all' && (p.brand || '').toLowerCase() !== selectedBrandFilter.toLowerCase()) return false;
    if (selectedCategoryFilter !== 'all' && (p.category || '').toLowerCase() !== selectedCategoryFilter.toLowerCase()) return false;
    return true;
  });

  const handleExportBackup = () => {
    const jsonStr = storeCMS.exportStoreData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `balaji_mobile_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const success = storeCMS.importStoreData(content);
      if (success) {
        alert("✅ Store data restored and synced live across all devices!");
        syncState();
      } else {
        alert("❌ Failed to parse backup file. Please select a valid JSON backup file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-[#050505] min-h-screen text-[#F8F8F8]">
      
      {/* ── CMS Main Header ── */}
      <div className="p-6 sm:p-8 rounded-[28px] bg-[#0D1117] border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0FAE72]/15 text-[#10C480] border border-[#0FAE72]/30 text-xs font-mono font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-[#0FAE72] animate-ping" />
            <Lock className="w-3.5 h-3.5 text-[#0FAE72]" />
            <span>STORE OWNER CMS • 🟢 REALTIME CROSS-DEVICE CLOUD SYNC ACTIVE</span>
          </div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-[#F8F8F8]">
            Balaji Mobile — Store Owner Control Center
          </h1>
          <p className="text-xs text-[#B8BDC8] font-mono mt-1">
            Manage product inventory, verified UPI payments, order dispatches, hero banners &amp; WhatsApp alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-mono">
          <button
            disabled={isPushing}
            onClick={async () => {
              setIsPushing(true);
              const ok = await storeCMS.syncToCloud();
              setIsPushing(false);
              if (ok) {
                alert("⚡ SUCCESS! All products, prices, banners & settings PUSHED LIVE to Cloud Relays! All customer devices will update automatically.");
              } else {
                alert("⚠️ Cloud Push completed with local fallback. Please verify internet connection.");
              }
            }}
            className={`px-4 py-3 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-xs shadow-lg transition flex items-center gap-2 active:scale-95 ${isPushing ? 'opacity-50 cursor-wait' : ''}`}
            title="Push updated prices, photos, banners & categories to all customer mobile phones"
          >
            {isPushing ? (
              <RefreshCcw className="w-4 h-4 text-white animate-spin" />
            ) : (
              <Zap className="w-4 h-4 text-white fill-current" />
            )}
            <span>{isPushing ? 'Pushing Live...' : 'Push Live'}</span>
          </button>

          <button
            onClick={handleExportBackup}
            className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#D4AF37] font-bold text-xs hover:border-[#D4AF37] transition flex items-center gap-1.5"
            title="Download JSON Backup of Store Data"
          >
            <Download className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <label className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#0FAE72] font-bold text-xs hover:border-[#0FAE72] transition flex items-center gap-1.5 cursor-pointer">
            <Upload className="w-4 h-4 text-[#0FAE72]" />
            <span className="hidden sm:inline">Import</span>
            <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
          </label>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-rose-400 font-bold hover:bg-rose-500 hover:text-white transition text-xs"
            title="Lock Security Panel"
          >
            Lock
          </button>

          <div className="relative">
            <button
              onClick={() => setShowNotifDrawer(!showNotifDrawer)}
              className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-[#D4AF37] font-bold text-xs hover:border-[#D4AF37] transition relative flex items-center gap-2"
            >
              <Bell className="w-4.5 h-4.5 text-[#D4AF37] animate-pulse" />
              {unreadNotifs.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold animate-bounce shadow-md">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notification Drawer Dropdown */}
            {showNotifDrawer && (
              <div className="absolute right-0 top-14 z-50 w-80 sm:w-96 p-5 rounded-[24px] bg-[#0D1117] border border-[#D4AF37]/40 shadow-[0_30px_70px_rgba(0,0,0,0.95)] text-xs space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.08]">
                  <h4 className="font-bold text-[#F8F8F8] text-sm flex items-center gap-1.5 font-display">
                    <Bell className="w-4 h-4 text-[#0FAE72]" />
                    <span>Real-Time Customer Orders</span>
                  </h4>
                  <div className="flex items-center gap-2.5">
                    {notifications.length > 0 && (
                      <button
                        onClick={() => { storeCMS.clearAllOwnerNotifications(); syncState(); }}
                        className="text-[10px] text-rose-400 hover:underline font-mono"
                      >
                        Clear All
                      </button>
                    )}
                    <button onClick={() => setShowNotifDrawer(false)} className="text-[#B8BDC8] hover:text-[#F8F8F8]">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2 font-mono">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className={`p-3.5 rounded-2xl border space-y-1 transition relative ${n.isRead ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-[#D4AF37]/10 border-[#D4AF37]/40 font-bold'}`}>
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-[#D4AF37] text-xs font-bold">{n.title}</p>
                          <button
                            onClick={() => { storeCMS.dismissOwnerNotification(n.id); syncState(); }}
                            className="text-[#B8BDC8] hover:text-rose-400 p-0.5 shrink-0"
                            title="Dismiss Notification"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-[#B8BDC8]">₹{(n.totalAmount || 0).toLocaleString('en-IN')} • {n.paymentMethod}</p>
                        <p className="text-[10px] text-[#B8BDC8]/70">{n.fullAddress}</p>
                        {!n.isRead && (
                          <button
                            onClick={() => { storeCMS.markOwnerNotificationRead(n.id); syncState(); }}
                            className="text-[10px] text-[#0FAE72] hover:underline block pt-1 font-bold"
                          >
                            Mark Read ✓
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-center py-6 text-[#B8BDC8]">No new order notifications.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── 2-Column macOS Style Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-3 font-mono text-xs">
          <div className="p-4 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37] px-2">
              ADMIN CONTROL CENTER
            </span>
            <div className="space-y-1.5 pt-2">
              {[
                { id: 'overview', label: '1. Store Overview', desc: 'Revenue, orders & stock metrics', icon: BarChart3 },
                { id: 'history', label: '2. Order History & Analytics', desc: 'Full history with graph & details', icon: TrendingUp, badge: orders.length },
                { id: 'orders', label: '3. All Customer Orders', desc: `Manage ${orders.length} orders & dispatches`, icon: ShoppingCart, badge: orders.length },
                { id: 'products', label: '4. New Phones Inventory', desc: `Catalog of ${products.length} smartphones`, icon: Package, badge: products.length },
                { id: 'secondhand', label: '5. Certified Pre-Owned', desc: `Second hand catalog (${secondHandProducts.length})`, icon: Recycle, badge: secondHandProducts.length },
                { id: 'categories', label: '6. Categories & Brands', desc: 'Manage categories & brand logos', icon: Layers },
                { id: 'heromedia', label: '7. Hero Media Customizer', desc: 'Upload image/video for homepage', icon: Monitor },
                { id: 'banners', label: '8. Banners & Sliders', desc: 'Homepage hero banners', icon: ImageIcon },
                { id: 'coupons', label: '9. Coupons & Discounts', desc: 'Manage promo code offers', icon: Tag },
                { id: 'timers', label: '10. Section Timers', desc: 'Flash deal & new arrival timers', icon: Timer },
                { id: 'intents', label: '11. Customer Intent & Alerts', desc: 'WhatsApp marketing alerts', icon: MessageSquare },
                { id: 'settings', label: '12. Store Settings & PIN', desc: 'UPI ID, QR & Security PIN', icon: Settings }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full p-3.5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-between text-left border relative overflow-hidden group ${
                      isActive
                        ? 'bg-[#D4AF37] text-[#050505] border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.3)] scale-[1.01]'
                        : 'bg-white/[0.03] text-[#B8BDC8] border-white/[0.08] hover:bg-white/[0.08] hover:text-[#F8F8F8] hover:border-[#D4AF37]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold shrink-0 transition ${
                        isActive 
                          ? 'bg-[#050505] text-[#D4AF37]' 
                          : 'bg-white/[0.05] text-[#D4AF37] group-hover:scale-110'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-xs truncate">
                          <span>{tab.label}</span>
                        </div>
                        <p className={`text-[10px] font-mono mt-0.5 truncate ${
                          isActive ? 'text-[#050505]/80' : 'text-[#B8BDC8]/70'
                        }`}>
                          {tab.desc}
                        </p>
                      </div>
                    </div>

                    {tab.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ml-2 ${
                        tab.isImportant
                          ? 'bg-rose-500 text-white animate-pulse shadow-md'
                          : isActive ? 'bg-[#050505] text-[#D4AF37]' : 'bg-white/[0.08] text-[#D4AF37]'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Content Panel */}
        <div className="lg:col-span-8 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="p-5 rounded-[24px] bg-[#0D1117] border border-white/[0.08] space-y-2 shadow-lg">
                  <span className="text-xs text-[#B8BDC8]">Total Sales Revenue</span>
                  <h3 className="font-display font-black text-2xl text-[#0FAE72]">₹{totalRevenue.toLocaleString('en-IN')}</h3>
                  <p className="text-[10px] text-[#0FAE72]">Verified Orders ({orders.length})</p>
                </div>
                <div className="p-5 rounded-[24px] bg-[#0D1117] border border-white/[0.08] space-y-2 shadow-lg">
                  <span className="text-xs text-[#B8BDC8]">Pending Verifications</span>
                  <h3 className={`font-display font-black text-2xl ${pendingOrders.length > 0 ? 'text-amber-400' : 'text-[#F8F8F8]'}`}>
                    {pendingOrders.length} Orders
                  </h3>
                  <p className="text-[10px] text-[#B8BDC8]">Requires GPay Check</p>
                </div>
                <div className="p-5 rounded-[24px] bg-[#0D1117] border border-white/[0.08] space-y-2 shadow-lg">
                  <span className="text-xs text-[#B8BDC8]">New Phones Stock</span>
                  <h3 className="font-display font-black text-2xl text-[#D4AF37]">{products.length} Models</h3>
                  <p className="text-[10px] text-[#B8BDC8]">Brand New Inventory</p>
                </div>
                <div className="p-5 rounded-[24px] bg-[#0D1117] border border-white/[0.08] space-y-2 shadow-lg">
                  <span className="text-xs text-[#B8BDC8]">Certified Pre-Owned</span>
                  <h3 className="font-display font-black text-2xl text-[#E7C76A]">{secondHandProducts.length} Items</h3>
                  <p className="text-[10px] text-[#B8BDC8]">Tested Second Hand</p>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="p-6 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-4 shadow-lg">
                <h3 className="font-display font-bold text-lg text-[#F8F8F8]">Quick Admin Actions</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <button onClick={() => handleOpenAddProduct(false)} className="p-3.5 rounded-2xl bg-[#D4AF37] text-[#050505] font-bold hover:bg-[#E7C76A] transition flex items-center justify-center gap-1.5">
                    <Plus className="w-4 h-4" /> Add New Phone
                  </button>
                  <button onClick={() => handleOpenAddProduct(true)} className="p-3.5 rounded-2xl bg-[#0FAE72] text-[#050505] font-bold hover:bg-[#10C480] transition flex items-center justify-center gap-1.5">
                    <Recycle className="w-4 h-4" /> Add Pre-Owned
                  </button>
                  <button onClick={() => setActiveTab('history')} className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-[#D4AF37] hover:border-[#D4AF37] font-bold transition flex items-center justify-center gap-1.5">
                    <TrendingUp className="w-4 h-4" /> Order Analytics ({orders.length})
                  </button>
                  <button onClick={async () => { await storeCMS.syncToCloud(); alert("⚡ Cloud sync complete!"); }} className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-[#0FAE72] hover:border-[#0FAE72] font-bold transition flex items-center justify-center gap-1.5">
                    <Zap className="w-4 h-4" /> Force Cloud Sync
                  </button>
                </div>
              </div>

              {/* Recent Orders List */}
              <div className="p-6 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-4 shadow-lg">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-bold text-lg text-[#F8F8F8]">Recent Customer Orders</h3>
                  <button onClick={() => setActiveTab('orders')} className="text-xs text-[#D4AF37] hover:underline font-bold">
                    View All Orders →
                  </button>
                </div>
                {orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-4 text-xs">
                        <div>
                          <p className="font-bold text-[#F8F8F8]">#{o.id} • {o.customerName}</p>
                          <p className="text-[11px] text-[#B8BDC8]">📱 +91 {o.phone} • {o.paymentMethod}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#0FAE72] text-sm block">₹{(o.totalAmount || 0).toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-[#B8BDC8]">{o.orderStatus || 'Placed'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-[#B8BDC8]">No orders placed yet.</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDER HISTORY & ANALYTICS */}
          {activeTab === 'history' && (() => {
            // Compute analytics
            const totalOrders = orders.length;
            const verifiedOrders = orders.filter(o => (o.paymentStatus || '').includes('✅') || (o.paymentStatus || '').includes('Verified')).length;
            const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled' || (o.paymentStatus || '').includes('❌')).length;
            const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
            const pendingCount = totalOrders - verifiedOrders - cancelledOrders;

            // Monthly revenue data for chart (last 6 months)
            const monthlyData = [];
            const now = new Date();
            for (let i = 5; i >= 0; i--) {
              const m = new Date(now.getFullYear(), now.getMonth() - i, 1);
              const monthLabel = m.toLocaleString('en-IN', { month: 'short', year: '2-digit' });
              const monthOrders = orders.filter(o => {
                const d = new Date(o.placedAt);
                return d.getMonth() === m.getMonth() && d.getFullYear() === m.getFullYear();
              });
              const revenue = monthOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
              monthlyData.push({ label: monthLabel, revenue, count: monthOrders.length });
            }
            const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 1);

            return (
            <div className="space-y-6 font-mono text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="font-display font-bold text-xl text-[#F8F8F8] flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#0FAE72]" /> Order History & Analytics
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handlePrintAllOrdersReport(orders, 'All Customer Orders')}
                    className="px-4 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#E7C76A] text-[#050505] font-bold text-xs flex items-center gap-2 transition duration-200 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-105"
                    title="Print or Save All Orders & Customer Details as PDF"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print / PDF (All Orders & Customers)</span>
                  </button>
                  <button
                    onClick={() => {
                      const verified = orders.filter(o => (o.paymentStatus || '').includes('✅') || (o.paymentStatus || '').includes('Verified'));
                      handlePrintAllOrdersReport(verified, 'Verified Paid Orders');
                    }}
                    className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:border-[#0FAE72] text-[#0FAE72] font-bold text-xs flex items-center gap-1.5 transition"
                    title="Print Verified Orders Only"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Verified Only</span>
                  </button>
                </div>
              </div>

              {/* Summary Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-[20px] bg-[#0D1117] border border-white/[0.08] text-center shadow-lg">
                  <span className="text-[#B8BDC8] text-[10px] block">Total Orders</span>
                  <span className="font-display font-black text-2xl text-[#D4AF37]">{totalOrders}</span>
                </div>
                <div className="p-4 rounded-[20px] bg-[#0D1117] border border-white/[0.08] text-center shadow-lg">
                  <span className="text-[#B8BDC8] text-[10px] block">Verified & Paid</span>
                  <span className="font-display font-black text-2xl text-[#0FAE72]">{verifiedOrders}</span>
                </div>
                <div className="p-4 rounded-[20px] bg-[#0D1117] border border-white/[0.08] text-center shadow-lg">
                  <span className="text-[#B8BDC8] text-[10px] block">Delivered</span>
                  <span className="font-display font-black text-2xl text-[#10C480]">{deliveredOrders}</span>
                </div>
                <div className="p-4 rounded-[20px] bg-[#0D1117] border border-white/[0.08] text-center shadow-lg">
                  <span className="text-[#B8BDC8] text-[10px] block">Cancelled</span>
                  <span className="font-display font-black text-2xl text-rose-400">{cancelledOrders}</span>
                </div>
              </div>

              {/* Revenue Bar Chart */}
              <div className="p-6 rounded-[28px] bg-[#0D1117] border border-white/[0.08] shadow-lg space-y-4">
                <h4 className="font-display font-bold text-sm text-[#F8F8F8]">Monthly Revenue Overview (Last 6 Months)</h4>
                <div className="flex items-end gap-3 h-44 pt-2">
                  {monthlyData.map((d, i) => {
                    const heightPct = maxRevenue > 0 ? Math.max((d.revenue / maxRevenue) * 100, 4) : 4;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                        {/* Tooltip on hover */}
                        <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-3 py-2 rounded-xl bg-[#D4AF37] text-[#050505] text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none whitespace-nowrap shadow-xl z-20">
                          ₹{d.revenue.toLocaleString('en-IN')} • {d.count} orders
                        </div>
                        <div
                          className="w-full rounded-t-xl bg-gradient-to-t from-[#0FAE72] to-[#0FAE72]/60 group-hover:from-[#D4AF37] group-hover:to-[#E7C76A] transition-all duration-300 cursor-pointer relative"
                          style={{ height: `${heightPct}%`, minHeight: '6px' }}
                        />
                        <span className="text-[9px] text-[#B8BDC8] font-bold mt-1">{d.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* All Orders List - Minimal + Expandable */}
              <div className="p-6 rounded-[28px] bg-[#0D1117] border border-white/[0.08] shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h4 className="font-display font-bold text-sm text-[#F8F8F8]">Full Order History ({orders.length})</h4>
                    <span className="text-[10px] text-[#B8BDC8]">Hover for preview • Click to expand full details</span>
                  </div>
                  <button
                    onClick={() => handlePrintAllOrdersReport(orders, 'Full History')}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D4AF37] font-bold text-[11px] flex items-center gap-1.5 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Report PDF</span>
                  </button>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                    {orders.map(o => {
                      const isExpanded = expandedOrderId === o.id;
                      const statusColor = o.orderStatus === 'Delivered' ? 'text-[#0FAE72] bg-[#0FAE72]/15 border-[#0FAE72]/40'
                        : o.orderStatus === 'Cancelled' ? 'text-rose-400 bg-rose-500/15 border-rose-500/40'
                        : 'text-[#D4AF37] bg-[#D4AF37]/15 border-[#D4AF37]/40';

                      return (
                        <div key={o.id} className="group">
                          {/* Minimal Row */}
                          <div
                            onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                            className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between gap-3 ${
                              isExpanded ? 'bg-[#D4AF37]/10 border-[#D4AF37]/40 shadow-lg' : 'bg-white/[0.02] border-white/[0.08] hover:bg-white/[0.05] hover:border-[#D4AF37]/30'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <span className="font-bold text-[#D4AF37] text-xs shrink-0">#{o.id}</span>
                              <span className="text-[#F8F8F8] font-bold text-xs truncate">{o.customerName}</span>
                              {/* Hover preview tooltip */}
                              <div className="hidden group-hover:flex items-center gap-2 text-[10px] text-[#B8BDC8] shrink-0">
                                <span>📱 {o.phone}</span>
                                <span>• {o.paymentMethod}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2.5 shrink-0">
                              <span className="font-display font-bold text-[#0FAE72] text-xs">₹{(o.totalAmount || 0).toLocaleString('en-IN')}</span>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusColor}`}>
                                {o.orderStatus || 'Placed'}
                              </span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-[#D4AF37]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#B8BDC8]" />}
                            </div>
                          </div>

                          {/* Expanded Full Details */}
                          {isExpanded && (
                            <div className="mt-1 p-5 rounded-2xl bg-[#050505] border border-[#D4AF37]/30 space-y-3 animate-in slide-in-from-top-2 duration-200">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                  <p className="text-[#F8F8F8]">Customer: <strong className="text-[#D4AF37]">{o.customerName}</strong></p>
                                  <p className="text-[#B8BDC8]">Phone: <strong>+91 {o.phone}</strong></p>
                                  <p className="text-[#B8BDC8]">Email: <strong>{o.email || 'N/A'}</strong></p>
                                  <p className="text-[#B8BDC8]">Address: {o.address}, {o.city}, {o.district}, {o.state} - {o.pincode}</p>
                                </div>
                                <div className="space-y-1.5">
                                  <p className="text-[#B8BDC8]">Payment: <strong className="text-[#D4AF37]">{o.paymentMethod}</strong></p>
                                  <p className="text-[#B8BDC8]">Payment Status: <strong className={(o.paymentStatus || '').includes('✅') ? 'text-[#0FAE72]' : 'text-amber-400'}>{o.paymentStatus || 'Pending'}</strong></p>
                                  {o.paymentId && <p className="text-[#B8BDC8]">Txn ID: <strong className="text-[#E7C76A] font-mono">{o.paymentId}</strong></p>}
                                  <p className="text-[#B8BDC8]">Placed: <strong>{new Date(o.placedAt).toLocaleString('en-IN')}</strong></p>
                                  {o.estDelivery && <p className="text-[#B8BDC8]">Est. Delivery: <strong className="text-[#0FAE72]">{o.estDelivery}</strong></p>}
                                  {o.trackingNumber && <p className="text-[#B8BDC8]">Tracking: <strong className="text-[#E7C76A]">{o.trackingNumber}</strong></p>}
                                </div>
                              </div>

                              {/* Items */}
                              {o.items && o.items.length > 0 && (
                                <div className="pt-3 border-t border-white/[0.08] space-y-2">
                                  <span className="text-[10px] text-[#D4AF37] font-bold uppercase tracking-wider">Order Items:</span>
                                  {o.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        {item.images?.[0] && (
                                          <img src={typeof item.images[0] === 'string' ? item.images[0] : ''} alt="" className="w-8 h-8 rounded-lg object-contain bg-white/5 shrink-0" />
                                        )}
                                        <div className="min-w-0">
                                          <p className="text-[#F8F8F8] font-bold truncate">{item.title || item.name}</p>
                                          <p className="text-[10px] text-[#B8BDC8]">{item.ram} {item.storage} {item.color ? `• ${item.color}` : ''} × {item.quantity || 1}</p>
                                        </div>
                                      </div>
                                      <span className="text-[#0FAE72] font-bold shrink-0">₹{((item.bmPrice || item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Total */}
                              <div className="pt-2 border-t border-white/[0.08] flex justify-between items-center">
                                <span className="text-[#B8BDC8] font-bold">Grand Total:</span>
                                <span className="font-display font-black text-lg text-[#0FAE72]">₹{(o.totalAmount || 0).toLocaleString('en-IN')}</span>
                              </div>

                              {/* Print Single Order Slip / Invoice Action */}
                              <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-3">
                                <span className="text-[10px] text-[#B8BDC8]">Print individual customer tax invoice & shipping slip:</span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePrintSingleOrder(o);
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl bg-white/[0.06] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#050505] font-bold text-xs flex items-center gap-1.5 transition duration-200 shadow-md"
                                >
                                  <Printer className="w-3.5 h-3.5" />
                                  <span>Print Order #{o.id} Invoice</span>
                                </button>
                              </div>

                              {o.paymentScreenshot && (
                                <div className="pt-2">
                                  <span className="text-[10px] text-[#0FAE72] font-bold block mb-1">📸 Payment Screenshot:</span>
                                  <a href={o.paymentScreenshot} target="_blank" rel="noopener noreferrer" className="inline-block rounded-xl overflow-hidden border border-white/[0.1]">
                                    <img src={o.paymentScreenshot} alt="Payment Proof" className="h-20 w-36 object-cover" />
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-12 text-center text-[#B8BDC8]">
                    <TrendingUp className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
                    No orders recorded yet. Order data will appear here once customers start placing orders.
                  </div>
                )}
              </div>
            </div>
            );
          })()}

          {/* TAB 3: ALL ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-bold text-xl text-[#F8F8F8]">All Customer Orders ({orders.length})</h3>
              </div>

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map(o => (
                    <div key={o.id} className="p-6 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-4 shadow-lg">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.08]">
                        <div>
                          <strong className="text-[#D4AF37] text-sm">#{o.id}</strong>
                          <span className="text-[#B8BDC8] ml-3">Customer: {o.customerName} (+91 {o.phone})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={o.orderStatus || 'Order Placed'}
                            onChange={(e) => handleStatusUpdate(o.id, e.target.value, o)}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-[#D4AF37]/40 text-[#D4AF37] font-bold outline-none"
                          >
                            <option value="Order Placed" className="bg-[#050505]">Order Placed</option>
                            <option value="Packed & Verified" className="bg-[#050505]">Packed & Verified</option>
                            <option value="Handed to Courier" className="bg-[#050505]">Handed to Courier</option>
                            <option value="Out for Delivery" className="bg-[#050505]">Out for Delivery</option>
                            <option value="Delivered" className="bg-[#050505]">Delivered</option>
                            <option value="Cancelled" className="bg-[#050505]">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1 text-[#B8BDC8]">
                        <p>Address: {o.address}, {o.city}, {o.district}, {o.state} - {o.pincode}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-xs">
                          <p>Amount: <strong className="text-[#0FAE72]">₹{(o.totalAmount || 0).toLocaleString('en-IN')}</strong></p>
                          <p>Payment Method: <strong className="text-[#D4AF37]">{o.paymentMethod || 'Razorpay'}</strong></p>
                          <p>Payment Status: <span className={`font-bold px-2 py-0.5 rounded-md text-[11px] ${
                            (o.paymentStatus || '').includes('Paid') || (o.paymentStatus || '').includes('SUCCESS')
                              ? 'bg-[#0FAE72]/20 text-[#0FAE72] border border-[#0FAE72]/40'
                              : (o.paymentStatus || '').includes('COD')
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          }`}>{o.paymentStatus || 'Paid'}</span></p>
                        </div>
                        {o.paymentId && (
                          <p className="text-[11px] text-[#B8BDC8]">
                            Payment / Txn ID: <strong className="text-[#E7C76A] font-mono">{o.paymentId}</strong>
                            {o.razorpayOrderId && <span className="ml-3">Razorpay Order ID: <strong className="text-[#D4AF37] font-mono">{o.razorpayOrderId}</strong></span>}
                          </p>
                        )}
                        {o.paymentScreenshot && (
                          <div className="pt-2">
                            <span className="text-[10px] text-[#0FAE72] font-bold block mb-1">📸 Attached Screenshot:</span>
                            <a href={o.paymentScreenshot} target="_blank" rel="noopener noreferrer" className="inline-block relative rounded-xl overflow-hidden border border-white/[0.1]">
                              <img src={o.paymentScreenshot} alt="Payment Proof" className="h-16 w-28 object-cover" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center rounded-[28px] bg-[#0D1117] border border-white/[0.08] text-[#B8BDC8]">
                  No orders recorded yet.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: NEW PHONES INVENTORY */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#F8F8F8]">New Phones Catalog ({filteredNewProducts.length})</h3>
                  <p className="text-xs text-[#B8BDC8] font-mono mt-0.5">Manage flagship model titles, prices, stock, RAM/ROM variants &amp; 360° views.</p>
                </div>
                <button
                  onClick={() => handleOpenAddProduct(false)}
                  className="px-5 py-3 rounded-2xl bg-[#D4AF37] text-[#050505] font-bold text-xs font-mono hover:bg-[#E7C76A] transition flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add New Phone
                </button>
              </div>

              {/* Search & Brand Filter Bar */}
              <div className="flex flex-col sm:flex-row gap-3 font-mono text-xs">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search model title or brand..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0D1117] border border-white/[0.08] text-[#F8F8F8] outline-none focus:border-[#D4AF37]"
                  />
                  <Search className="w-4 h-4 text-[#B8BDC8] absolute left-3.5 top-3" />
                </div>
                <select
                  value={selectedBrandFilter}
                  onChange={(e) => setSelectedBrandFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl bg-[#0D1117] border border-white/[0.08] text-[#F8F8F8] outline-none focus:border-[#D4AF37]"
                >
                  <option value="all" className="bg-[#050505]">All Brands</option>
                  {allBrandsList.map(b => (
                    <option key={b} value={b} className="bg-[#050505]">{b}</option>
                  ))}
                </select>
                <select
                  value={selectedCategoryFilter}
                  onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-2xl bg-[#0D1117] border border-white/[0.08] text-[#F8F8F8] outline-none focus:border-[#D4AF37]"
                >
                  <option value="all" className="bg-[#050505]">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id || c.name} value={c.name} className="bg-[#050505]">{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
                {filteredNewProducts.map(p => <AdminProductCard key={p.id} p={p} />)}
              </div>
            </div>
          )}

          {/* TAB 5: CERTIFIED PRE-OWNED DEALS */}
          {activeTab === 'secondhand' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#F8F8F8]">Certified Pre-Owned Catalog ({secondHandProducts.length})</h3>
                  <p className="text-xs text-[#B8BDC8] font-mono mt-0.5">Manage tested second hand phones with battery health %, device age, condition grade &amp; warranty.</p>
                </div>
                <button
                  onClick={() => handleOpenAddProduct(true)}
                  className="px-5 py-3 rounded-2xl bg-[#0FAE72] text-[#050505] font-bold text-xs font-mono hover:bg-[#10C480] transition flex items-center gap-1.5 shrink-0"
                >
                  <Recycle className="w-4 h-4" /> Add Pre-Owned Phone
                </button>
              </div>

              {secondHandProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
                  {secondHandProducts.map(p => <AdminProductCard key={p.id} p={p} isSecondHand />)}
                </div>
              ) : (
                <div className="text-center py-16 space-y-4 rounded-[28px] bg-[#0D1117] border border-white/[0.08]">
                  <Recycle className="w-12 h-12 text-[#D4AF37] mx-auto" />
                  <p className="text-xs text-[#B8BDC8] font-mono">No second hand phones added yet. Click "+ Add Pre-Owned Phone" above.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: CATEGORIES & BRANDS */}
          {activeTab === 'categories' && (
            <div className="space-y-8 font-mono text-xs">
              {/* Category Manager */}
              <div className="p-6 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-4 shadow-lg">
                <h3 className="font-display font-bold text-lg text-[#F8F8F8]">Manage Shop Categories ({categories.length})</h3>
                <form onSubmit={handleAddCategory} className="flex gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Category Name (e.g. Leica Camera Champions)"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className={inputClass}
                  />
                  <button type="submit" className="px-5 py-2.5 rounded-2xl bg-[#D4AF37] text-[#050505] font-bold whitespace-nowrap shrink-0">
                    + Add Category
                  </button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {categories.map(c => (
                    <div key={c.id || c.name} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                      <span className="font-bold text-[#F8F8F8]">{c.name}</span>
                      <button onClick={() => handleDeleteCategory(c.id)} className="text-rose-400 hover:underline text-xs">Delete</button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand Manager */}
              <div className="p-6 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-4 shadow-lg">
                <h3 className="font-display font-bold text-lg text-[#F8F8F8]">Manage Brands ({brands.length})</h3>
                <form onSubmit={handleAddBrand} className="flex gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Brand Name (e.g. Nothing)"
                    value={newBrandName}
                    onChange={(e) => setNewBrandName(e.target.value)}
                    className={inputClass}
                  />
                  <button type="submit" className="px-5 py-2.5 rounded-2xl bg-[#0FAE72] text-[#050505] font-bold whitespace-nowrap shrink-0">
                    + Add Brand
                  </button>
                </form>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {brands.map(b => (
                    <div key={b.id || b.name} className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                      <span className="font-bold text-[#F8F8F8]">{b.name}</span>
                      <button onClick={() => handleDeleteBrand(b.id)} className="text-rose-400 hover:underline text-xs">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: HERO MEDIA CUSTOMIZER */}
          {activeTab === 'heromedia' && (
            <div className="space-y-6 font-mono text-xs">
              <h3 className="font-display font-bold text-xl text-[#F8F8F8] flex items-center gap-2">
                <Monitor className="w-5 h-5 text-[#D4AF37]" /> Hero Section Media Customizer
              </h3>
              <p className="text-[#B8BDC8] text-xs leading-relaxed">
                Customize the hero showcase card on your homepage. Upload an <strong className="text-[#D4AF37]">image</strong> or <strong className="text-[#D4AF37]">video</strong> from your device, set badge text, title, subtitle, and the CTA button link. Changes appear <strong className="text-[#0FAE72]">live instantly</strong> on the homepage.
              </p>

              <div className="p-6 rounded-[28px] bg-[#0D1117] border border-[#D4AF37]/40 space-y-5 shadow-lg">
                {/* Media Type Selector */}
                <div className="space-y-2">
                  <label className="block text-[#D4AF37] font-bold text-xs uppercase tracking-wider">Media Type</label>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setHeroMediaForm(prev => ({ ...prev, mediaType: 'image' }))}
                      className={`flex-1 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition ${
                        heroMediaForm.mediaType === 'image'
                          ? 'bg-[#D4AF37] text-[#050505] border-[#D4AF37]'
                          : 'bg-white/[0.04] text-[#B8BDC8] border-white/[0.08] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <ImageIcon className="w-4 h-4" /> Image
                    </button>
                    <button
                      type="button"
                      onClick={() => setHeroMediaForm(prev => ({ ...prev, mediaType: 'video' }))}
                      className={`flex-1 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border transition ${
                        heroMediaForm.mediaType === 'video'
                          ? 'bg-[#D4AF37] text-[#050505] border-[#D4AF37]'
                          : 'bg-white/[0.04] text-[#B8BDC8] border-white/[0.08] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <Video className="w-4 h-4" /> Video
                    </button>
                  </div>
                </div>

                {/* File Upload from Device */}
                <div className="space-y-2">
                  <label className="block text-[#F8F8F8] font-bold">Upload {heroMediaForm.mediaType === 'video' ? 'Video' : 'Image'} from Device</label>
                  <label className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/[0.04] border-2 border-dashed border-[#D4AF37]/40 hover:border-[#D4AF37] cursor-pointer transition group">
                    <Upload className="w-5 h-5 text-[#D4AF37] group-hover:scale-110 transition" />
                    <span className="text-[#D4AF37] font-bold">Click to choose {heroMediaForm.mediaType === 'video' ? 'video' : 'image'} file</span>
                    <input
                      type="file"
                      accept={heroMediaForm.mediaType === 'video' ? 'video/*' : 'image/*'}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setHeroMediaForm(prev => ({ ...prev, mediaUrl: event.target.result }));
                        };
                        reader.readAsDataURL(file);
                        e.target.value = '';
                      }}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Or paste URL */}
                <div className="space-y-1">
                  <label className="block text-[#B8BDC8] font-bold">Or paste Media URL directly</label>
                  <input
                    type="text"
                    placeholder="https://example.com/video.mp4 or image URL"
                    value={heroMediaForm.mediaUrl || ''}
                    onChange={(e) => setHeroMediaForm(prev => ({ ...prev, mediaUrl: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* Live Preview */}
                {heroMediaForm.mediaUrl && (
                  <div className="space-y-2">
                    <label className="block text-[#0FAE72] font-bold text-xs uppercase tracking-wider">Live Preview</label>
                    <div className="h-48 rounded-2xl overflow-hidden border border-white/[0.1] bg-black flex items-center justify-center">
                      {heroMediaForm.mediaType === 'video' ? (
                        <video
                          src={heroMediaForm.mediaUrl}
                          autoPlay muted loop playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <img src={heroMediaForm.mediaUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
                      )}
                    </div>
                  </div>
                )}

                {/* Badge Text */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#B8BDC8] font-bold mb-1">Badge Text (Top Corner)</label>
                    <input
                      type="text"
                      placeholder="e.g. NEW ARRIVAL, HOT DEAL, EXCLUSIVE"
                      value={heroMediaForm.badgeText || ''}
                      onChange={(e) => setHeroMediaForm(prev => ({ ...prev, badgeText: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[#B8BDC8] font-bold mb-1">CTA Button Text</label>
                    <input
                      type="text"
                      placeholder="e.g. View Details, Shop Now, Buy Now"
                      value={heroMediaForm.buttonText || ''}
                      onChange={(e) => setHeroMediaForm(prev => ({ ...prev, buttonText: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Title and Subtitle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#B8BDC8] font-bold mb-1">Card Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Samsung Galaxy S24 Ultra"
                      value={heroMediaForm.title || ''}
                      onChange={(e) => setHeroMediaForm(prev => ({ ...prev, title: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[#B8BDC8] font-bold mb-1">Card Subtitle / Price</label>
                    <input
                      type="text"
                      placeholder="e.g. Showroom Price: ₹1,29,900"
                      value={heroMediaForm.subtitle || ''}
                      onChange={(e) => setHeroMediaForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Button Link */}
                <div>
                  <label className="block text-[#B8BDC8] font-bold mb-1">Button Link (Page URL)</label>
                  <input
                    type="text"
                    placeholder="e.g. /product/bm-prod-101 or /products"
                    value={heroMediaForm.buttonLink || ''}
                    onChange={(e) => setHeroMediaForm(prev => ({ ...prev, buttonLink: e.target.value }))}
                    className={inputClass}
                  />
                </div>

                {/* Video Options (only for video) */}
                {heroMediaForm.mediaType === 'video' && (
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                    <span className="text-[#D4AF37] font-bold text-xs block">Video Playback Options</span>
                    <div className="flex flex-wrap gap-3">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={heroMediaForm.videoAutoplay ?? true}
                          onChange={(e) => setHeroMediaForm(prev => ({ ...prev, videoAutoplay: e.target.checked }))}
                          className="accent-[#D4AF37]"
                        />
                        <span className="text-[#F8F8F8]">Autoplay</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={heroMediaForm.videoLoop ?? true}
                          onChange={(e) => setHeroMediaForm(prev => ({ ...prev, videoLoop: e.target.checked }))}
                          className="accent-[#D4AF37]"
                        />
                        <span className="text-[#F8F8F8]">Loop</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={heroMediaForm.videoMuted ?? true}
                          onChange={(e) => setHeroMediaForm(prev => ({ ...prev, videoMuted: e.target.checked }))}
                          className="accent-[#D4AF37]"
                        />
                        <span className="text-[#F8F8F8]">Muted</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(heroMediaForm.videoControls)}
                          onChange={(e) => setHeroMediaForm(prev => ({ ...prev, videoControls: e.target.checked }))}
                          className="accent-[#D4AF37]"
                        />
                        <span className="text-[#F8F8F8]">Show Controls</span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Save Button */}
                <button
                  type="button"
                  onClick={() => {
                    storeCMS.saveHeroMedia(heroMediaForm);
                    alert('✅ Hero section media updated successfully! Changes are live on the homepage now.');
                    syncState();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save & Apply Hero Media Live
                </button>
              </div>
            </div>
          )}

          {/* TAB 8: BANNERS */}
          {activeTab === 'banners' && (
            <div className="space-y-6 font-mono text-xs">
              <h3 className="font-display font-bold text-xl text-[#F8F8F8]">Homepage Hero Banners ({banners.length})</h3>
              <div className="grid grid-cols-1 gap-4">
                {banners.map((b, idx) => (
                  <div key={idx} className="p-5 rounded-[24px] bg-[#0D1117] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-[#D4AF37] text-sm">{b.title}</h4>
                      <p className="text-[#B8BDC8] text-xs">{b.subtitle}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#0FAE72]/20 text-[#10C480] font-bold text-[10px]">Active Banner</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="p-6 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-4 shadow-lg">
                <h3 className="font-display font-bold text-lg text-[#F8F8F8]">Discount Coupons ({coupons.length})</h3>
                <form onSubmit={handleAddCoupon} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input type="text" required placeholder="Coupon Code (e.g. BM1000)" value={newCouponCode} onChange={(e) => setNewCouponCode(e.target.value)} className={inputClass} />
                  <input type="number" required placeholder="Discount Amount (₹)" value={newCouponAmount} onChange={(e) => setNewCouponAmount(Number(e.target.value))} className={inputClass} />
                  <input type="number" required placeholder="Min Order Amount (₹)" value={newCouponMinOrder} onChange={(e) => setNewCouponMinOrder(Number(e.target.value))} className={inputClass} />
                  <button type="submit" className="py-2.5 rounded-2xl bg-[#D4AF37] text-[#050505] font-bold">Create Coupon</button>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {coupons.map(c => (
                    <div key={c.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
                      <div>
                        <strong className="text-[#D4AF37] text-sm">{c.code}</strong>
                        <p className="text-[11px] text-[#B8BDC8]">₹{c.amount} OFF on orders over ₹{(c.minOrder || 0).toLocaleString('en-IN')}</p>
                      </div>
                      <button onClick={() => handleDeleteCoupon(c.id)} className="text-rose-400 hover:underline">Delete</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: TIMERS */}
          {activeTab === 'timers' && (
            <div className="space-y-8 font-mono text-xs">
              <h3 className="font-display font-bold text-xl text-[#F8F8F8]">Homepage Countdown Timers</h3>
              
              <div className="p-6 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#D4AF37]" />
                  <h4 className="font-display font-bold text-base text-[#F8F8F8]">BM New Arrival Section Timer</h4>
                </div>
                <div className="flex items-center gap-4">
                  <input type="number" min="1" max="720" value={newArrivalHours} onChange={(e) => setNewArrivalHours(Number(e.target.value))} className="w-24 px-3 py-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center font-bold text-[#F8F8F8]" />
                  <span>hours</span>
                  <button onClick={handleResetNewArrivalTimer} className="px-4 py-2.5 rounded-2xl bg-[#D4AF37] text-[#050505] font-bold">Reset Timer</button>
                </div>
              </div>

              <div className="p-6 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-[#0FAE72]" />
                  <h4 className="font-display font-bold text-base text-[#F8F8F8]">BM Flash Deal Section Timer</h4>
                </div>
                <div className="flex items-center gap-4">
                  <input type="number" min="1" max="720" value={flashDealHours} onChange={(e) => setFlashDealHours(Number(e.target.value))} className="w-24 px-3 py-2 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-center font-bold text-[#F8F8F8]" />
                  <span>hours</span>
                  <button onClick={handleResetFlashDealTimer} className="px-4 py-2.5 rounded-2xl bg-[#0FAE72] text-[#050505] font-bold">Reset Timer</button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 10: CUSTOMER INTENTS */}
          {activeTab === 'intents' && (
            <div className="space-y-6 font-mono text-xs">
              <h3 className="font-display font-bold text-xl text-[#F8F8F8]">Customer Search Intents &amp; Marketing Alerts</h3>
              <div className="space-y-4">
                {Object.values(userIntentService.getProfiles() || {}).map((prof, pIdx) => (
                  <div key={pIdx} className="p-6 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <strong className="text-[#D4AF37] text-sm">+91 {prof.phone}</strong>
                        <p className="text-[11px] text-[#B8BDC8]">Searches: {(prof.searches || []).join(', ') || 'Smartphones'}</p>
                      </div>
                      <a
                        href={`https://wa.me/91${prof.phone}?text=${encodeURIComponent(`Hi! We noticed your search on Balaji Mobile for ${prof.searches?.[0] || 'smartphones'}. Check out our newest stock here: https://balajimobile.store/products`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2.5 rounded-2xl bg-[#0FAE72] text-[#050505] font-bold flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-4 h-4" /> Send WhatsApp Alert
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 11: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-8 font-mono text-xs">
              {/* Change Admin PIN Card */}
              <div className="p-7 rounded-[28px] bg-[#0D1117] border border-[#D4AF37]/40 space-y-5 shadow-lg">
                <div className="flex items-center gap-2.5 text-[#D4AF37]">
                  <KeyRound className="w-5 h-5 text-[#D4AF37]" />
                  <h3 className="font-display font-bold text-xl text-[#F8F8F8]">Change Admin PIN</h3>
                </div>
                <p className="text-xs text-[#B8BDC8]">
                  Update the master security PIN used to log into the Balaji Mobile Admin Control Panel.
                </p>

                {pinChangeSuccess && (
                  <div className="p-4 rounded-2xl bg-[#0FAE72]/15 border border-[#0FAE72]/40 text-[#0FAE72] font-bold text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{pinChangeSuccess}</span>
                  </div>
                )}

                {pinChangeError && (
                  <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-400 font-bold text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{pinChangeError}</span>
                  </div>
                )}

                <form onSubmit={handleChangeAdminPin} className="space-y-4 max-w-lg">
                  <div className="relative">
                    <label className="block text-[#B8BDC8] font-bold mb-1">Enter Current PIN *</label>
                    <input
                      type={showCurrentPin ? "text" : "password"}
                      required
                      maxLength={16}
                      placeholder="Enter Current Master PIN"
                      value={currentPinInput}
                      onChange={(e) => setCurrentPinInput(e.target.value)}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPin(!showCurrentPin)}
                      className="absolute right-3.5 top-8 text-xs text-[#B8BDC8] hover:text-[#F8F8F8]"
                    >
                      {showCurrentPin ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="block text-[#B8BDC8] font-bold mb-1">Enter New PIN * (Min 4 digits)</label>
                    <input
                      type={showNewPin ? "text" : "password"}
                      required
                      maxLength={16}
                      placeholder="Enter New PIN"
                      value={newPinInput}
                      onChange={(e) => setNewPinInput(e.target.value)}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPin(!showNewPin)}
                      className="absolute right-3.5 top-8 text-xs text-[#B8BDC8] hover:text-[#F8F8F8]"
                    >
                      {showNewPin ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  <div className="relative">
                    <label className="block text-[#B8BDC8] font-bold mb-1">Confirm New PIN *</label>
                    <input
                      type={showConfirmPin ? "text" : "password"}
                      required
                      maxLength={16}
                      placeholder="Re-enter New PIN"
                      value={confirmPinInput}
                      onChange={(e) => setConfirmPinInput(e.target.value)}
                      className={inputClass}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPin(!showConfirmPin)}
                      className="absolute right-3.5 top-8 text-xs text-[#B8BDC8] hover:text-[#F8F8F8]"
                    >
                      {showConfirmPin ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#E7C76A] text-[#050505] font-bold shadow-lg hover:opacity-95 transition flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save &amp; Update Admin PIN
                  </button>
                </form>
              </div>

              {/* General Store Settings Form */}
              <div className="p-7 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-5 shadow-lg">
                <h3 className="font-display font-bold text-xl text-[#F8F8F8]">Store Contact &amp; Payment Details</h3>
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-[#B8BDC8] font-bold mb-1">Store Support Phone Number *</label>
                    <input type="text" required value={settingsForm.supportPhone} onChange={(e) => setSettingsForm({ ...settingsForm, supportPhone: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[#B8BDC8] font-bold mb-1">Google Pay / Merchant UPI VPA ID *</label>
                    <input type="text" required value={settingsForm.upiVpa} onChange={(e) => setSettingsForm({ ...settingsForm, upiVpa: e.target.value })} className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-[#B8BDC8] font-bold mb-1">Store Physical Address *</label>
                    <input type="text" required value={settingsForm.storeAddress} onChange={(e) => setSettingsForm({ ...settingsForm, storeAddress: e.target.value })} className={inputClass} />
                  </div>
                  <button type="submit" className="px-6 py-3 rounded-2xl bg-[#0FAE72] text-[#050505] font-bold shadow-lg">Save Store Information</button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── ADD / EDIT PHONE MODAL ── */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-[25px] flex items-start justify-center p-4 overflow-y-auto font-mono text-xs">
          <div className="bg-[#0D1117] border border-[#D4AF37]/40 text-[#F8F8F8] rounded-[28px] max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-[0_30px_70px_rgba(0,0,0,0.95)] my-8">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <h3 className="font-display font-bold text-xl flex items-center gap-2 text-[#F8F8F8]">
                {isSecondHandModal && <Recycle className="w-5 h-5 text-[#D4AF37]" />}
                {editingProductId ? `Edit ${isSecondHandModal ? 'Certified Pre-Owned' : 'Flagship'} Phone` : `Add ${isSecondHandModal ? 'Certified Pre-Owned' : 'New Flagship'} Phone`}
              </h3>
              <button
                type="button"
                onClick={() => setShowProductModal(false)}
                className="p-2 rounded-xl text-[#B8BDC8] hover:text-[#F8F8F8] hover:bg-white/[0.05] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-[#B8BDC8] font-bold mb-1">Phone Model Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. iPhone 15 Pro Max (Titanium Edition)"
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[#B8BDC8] font-bold mb-1">Brand *</label>
                  <select
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className={inputClass}
                  >
                    {allBrandsList.map(b => <option key={b} value={b} className="bg-[#050505]">{b}</option>)}
                  </select>
                </div>
              </div>

              {/* Category & Badges */}
              <div className="p-4.5 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
                  <span className="font-bold text-[#D4AF37] flex items-center gap-1.5 uppercase tracking-wider text-xs">
                    <Layers className="w-4 h-4" /> SHOP CATEGORY &amp; HOMEPAGE SHOWCASE PLACEMENT
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#F8F8F8] font-bold mb-1">Shop Category *</label>
                    <select 
                      value={productForm.category || (categories[0]?.name || 'Flagship Titans')} 
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} 
                      className={inputClass}
                    >
                      {categories.map(c => <option key={c.id || c.name} value={c.name} className="bg-[#050505]">{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#F8F8F8] font-bold mb-1">Condition / Warranty Tag *</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="e.g. Brand New Sealed Box - 1 Year Official Warranty" 
                      value={productForm.condition || ''} 
                      onChange={(e) => setProductForm({ ...productForm, condition: e.target.value })} 
                      className={inputClass} 
                    />
                  </div>
                </div>

                {!isSecondHandModal && (
                  <div className="pt-2 border-t border-[#D4AF37]/20 space-y-1.5">
                    <span className="block text-[11px] text-[#D4AF37] font-bold">Homepage Section Badges:</span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                      <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] cursor-pointer hover:border-[#D4AF37]">
                        <input 
                          type="checkbox" 
                          checked={Boolean(productForm.isNewArrival)} 
                          onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })} 
                          className="accent-[#D4AF37]" 
                        />
                        <span>✨ New Arrival</span>
                      </label>
                      <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] cursor-pointer hover:border-rose-500">
                        <input 
                          type="checkbox" 
                          checked={Boolean(productForm.isFlashSale)} 
                          onChange={(e) => setProductForm({ ...productForm, isFlashSale: e.target.checked })} 
                          className="accent-rose-500" 
                        />
                        <span>⚡ Flash Sale</span>
                      </label>
                      <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] cursor-pointer hover:border-[#0FAE72]">
                        <input 
                          type="checkbox" 
                          checked={Boolean(productForm.isFeatured)} 
                          onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })} 
                          className="accent-[#0FAE72]" 
                        />
                        <span>🌟 Featured Titan</span>
                      </label>
                      <label className="flex items-center gap-2 p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] cursor-pointer hover:border-[#0FAE72]">
                        <input 
                          type="checkbox" 
                          checked={Boolean(productForm.isTrending)} 
                          onChange={(e) => setProductForm({ ...productForm, isTrending: e.target.checked })} 
                          className="accent-[#0FAE72]" 
                        />
                        <span>🔥 Trending Deal</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* ── MULTI-COLOR PRODUCT GALLERIES SECTION ── */}
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-[#D4AF37]/40 space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-white/[0.08]">
                  <div>
                    <h4 className="text-sm font-bold text-[#D4AF37] flex items-center gap-2 font-display">
                      🎨 MULTIPLE PRODUCT COLORS &amp; COLOR-SPECIFIC PHOTO GALLERIES ({colorsList.length})
                    </h4>
                    <p className="text-[11px] text-[#B8BDC8] mt-0.5">
                      Add multiple color options. Each color has its own separate photo gallery that customers can view/swipe.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddColor}
                    className="px-3.5 py-1.5 rounded-xl bg-[#D4AF37] text-[#050505] font-bold text-xs hover:bg-[#E7C76A] transition flex items-center gap-1 shrink-0 shadow-md"
                  >
                    <Plus className="w-3.5 h-3.5" /> + Add Color
                  </button>
                </div>

                <div className="space-y-4">
                  {colorsList.map((col, cIdx) => (
                    <div key={col.id || cIdx} className="p-4 rounded-2xl bg-[#050505] border border-white/[0.1] space-y-3 shadow-md">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 flex-1">
                          <span className="w-6 h-6 rounded-full border border-white/30 shrink-0 shadow-sm" style={{ backgroundColor: col.hex || '#111827' }} />
                          <input
                            type="text"
                            required
                            placeholder="Color Name (e.g. Natural Titanium, Deep Blue, Space Black)"
                            value={col.name}
                            onChange={(e) => handleUpdateColorField(col.id, 'name', e.target.value)}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-[#F8F8F8] font-bold outline-none focus:border-[#D4AF37]"
                          />
                          <input
                            type="color"
                            value={col.hex || '#111827'}
                            onChange={(e) => handleUpdateColorField(col.id, 'hex', e.target.value)}
                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                            title="Pick Color Swatch"
                          />
                        </div>
                        {colorsList.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveColor(col.id)}
                            className="px-2.5 py-1 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 hover:bg-rose-500 hover:text-white transition text-[11px] font-bold flex items-center gap-1 shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete Color
                          </button>
                        )}
                      </div>

                      {/* Photos for this specific color */}
                      <div className="space-y-2 pt-1 border-t border-white/[0.06]">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#B8BDC8] font-bold">
                            Photos for <strong className="text-[#D4AF37]">{col.name || `Color ${cIdx + 1}`}</strong> ({col.images?.length || 0} photos):
                          </span>
                          <div className="flex items-center gap-2">
                            <label
                              htmlFor={`color-file-upload-${col.id}`}
                              className="px-3 py-1 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#050505] text-[#D4AF37] font-bold cursor-pointer transition flex items-center gap-1 text-[11px]"
                            >
                              <Upload className="w-3 h-3" /> + Add Photos (Upload Files)
                            </label>
                            <input
                              id={`color-file-upload-${col.id}`}
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={(e) => handleColorFileUpload(col.id, e)}
                              className="hidden"
                            />
                          </div>
                        </div>

                        {/* Quick URL Input for this Color */}
                        <div className="flex gap-2">
                          <input
                            type="text"
                            id={`url-input-${col.id}`}
                            placeholder="Or paste photo URL and click Add Photo"
                            className="flex-1 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-[#F8F8F8] text-[11px] outline-none focus:border-[#D4AF37]"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddColorImage(col.id, e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const el = document.getElementById(`url-input-${col.id}`);
                              if (el && el.value) {
                                handleAddColorImage(col.id, el.value);
                                el.value = '';
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-white/[0.08] text-[#F8F8F8] font-bold text-[11px] hover:bg-[#D4AF37] hover:text-[#050505] transition"
                          >
                            + Add Photo URL
                          </button>
                        </div>

                        {/* Photo Gallery Grid for this Color */}
                        {col.images && col.images.length > 0 ? (
                          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-2">
                            {col.images.map((imgUrl, imgIdx) => (
                              <div key={imgIdx} className="relative group rounded-xl overflow-hidden bg-white/[0.03] border border-white/[0.08] aspect-square flex items-center justify-center p-1">
                                <img src={imgUrl} alt={`Color photo ${imgIdx + 1}`} className="max-h-full max-w-full object-contain" />
                                
                                {imgIdx === 0 && (
                                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-[#D4AF37] text-[#050505] font-black text-[8px] shadow-sm">
                                    Cover
                                  </span>
                                )}

                                {/* Actions overlay */}
                                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveColorImage(col.id, imgIdx)}
                                    className="p-1 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition"
                                    title="Delete Photo"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                  <div className="flex gap-1">
                                    {imgIdx > 0 && (
                                      <button
                                        type="button"
                                        onClick={() => handleMoveColorImage(col.id, imgIdx, 'left')}
                                        className="px-1.5 py-0.5 rounded bg-white/20 text-white text-[9px] hover:bg-white/40 font-bold"
                                        title="Move Left"
                                      >
                                        ←
                                      </button>
                                    )}
                                    {imgIdx < col.images.length - 1 && (
                                      <button
                                        type="button"
                                        onClick={() => handleMoveColorImage(col.id, imgIdx, 'right')}
                                        className="px-1.5 py-0.5 rounded bg-white/20 text-white text-[9px] hover:bg-white/40 font-bold"
                                        title="Move Right"
                                      >
                                        →
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/[0.1] text-center text-[11px] text-[#B8BDC8]">
                            No photos added for this color yet. Click <strong>+ Add Photos</strong> or paste a URL above.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#B8BDC8] font-bold mb-1">Market MRP (₹)</label>
                  <input
                    type="number"
                    required
                    value={productForm.marketPrice}
                    onChange={(e) => setProductForm({ ...productForm, marketPrice: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[#0FAE72] font-bold mb-1">BM Special Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.bmPrice}
                    onChange={(e) => setProductForm({ ...productForm, bmPrice: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[#B8BDC8] font-bold mb-1">Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Specifications */}
              <div className="p-4.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3 font-mono text-xs">
                <span className="font-bold text-[#D4AF37] block">KEY SPECIFICATIONS &amp; HARDWARE</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#B8BDC8] font-bold mb-1">Processor / Chipset</label>
                    <input
                      type="text"
                      placeholder="e.g. A17 Pro / Snapdragon 8 Gen 3"
                      value={productForm.processor || ''}
                      onChange={(e) => setProductForm({ ...productForm, processor: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[#B8BDC8] font-bold mb-1">Display</label>
                    <input
                      type="text"
                      placeholder="e.g. 6.7-inch Super Retina XDR OLED 120Hz"
                      value={productForm.display || ''}
                      onChange={(e) => setProductForm({ ...productForm, display: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[#B8BDC8] font-bold mb-1">Camera System</label>
                    <input
                      type="text"
                      placeholder="e.g. 48MP Main + 12MP Ultra Wide + 12MP Telephoto"
                      value={productForm.camera || ''}
                      onChange={(e) => setProductForm({ ...productForm, camera: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-[#B8BDC8] font-bold mb-1">Battery &amp; Charging</label>
                    <input
                      type="text"
                      placeholder="e.g. 4,422 mAh Fast Charging"
                      value={productForm.battery || ''}
                      onChange={(e) => setProductForm({ ...productForm, battery: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>

              {/* Delivery & Warranty Policies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#B8BDC8] font-bold mb-1">Warranty Information</label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Year Official Apple Manufacturer Warranty"
                    value={productForm.warranty || ''}
                    onChange={(e) => setProductForm({ ...productForm, warranty: e.target.value })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-[#B8BDC8] font-bold mb-1">Delivery Information</label>
                  <input
                    type="text"
                    placeholder="e.g. Express Delivery 24-48 Hours Across India (Insured)"
                    value={productForm.deliveryInfo || ''}
                    onChange={(e) => setProductForm({ ...productForm, deliveryInfo: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Product Description */}
              <div>
                <label className="block text-[#B8BDC8] font-bold mb-1">Product Description &amp; Highlights</label>
                <textarea
                  rows="3"
                  placeholder="Describe key highlights, build quality, included box accessories..."
                  value={productForm.description || ''}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className={inputClass}
                />
              </div>

              {/* Pre-Owned Specifics */}
              {isSecondHandModal && (
                <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 space-y-3">
                  <span className="text-[#D4AF37] font-bold block">CERTIFIED PRE-OWNED VERIFICATION METRICS</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[#B8BDC8] text-[10px] mb-1">Battery Health %</label>
                      <input type="text" value={productForm.batteryHealth || '95%'} onChange={(e) => setProductForm({ ...productForm, batteryHealth: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[#B8BDC8] text-[10px] mb-1">Device Age</label>
                      <input type="text" value={productForm.deviceAge || '6 Months'} onChange={(e) => setProductForm({ ...productForm, deviceAge: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[#B8BDC8] text-[10px] mb-1">Condition Grade</label>
                      <input type="text" value={productForm.conditionBadge || 'Superb (9/10)'} onChange={(e) => setProductForm({ ...productForm, conditionBadge: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className="block text-[#B8BDC8] text-[10px] mb-1">Warranty Status</label>
                      <input type="text" value={productForm.warrantyStatus || 'Official Warranty'} onChange={(e) => setProductForm({ ...productForm, warrantyStatus: e.target.value })} className={inputClass} />
                    </div>
                  </div>
                </div>
              )}

              {/* Save / Cancel Buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/[0.08]">
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-sm shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Product Permanently
                </button>
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-6 py-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-[#B8BDC8] hover:text-white transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── VERIFICATION / REJECTION MODAL ── */}
      {verifyModalOrder && (
        <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-[25px] flex items-center justify-center p-4 font-mono text-xs">
          <div className="bg-[#0D1117] border border-[#D4AF37]/40 text-[#F8F8F8] rounded-[28px] max-w-lg w-full p-6 space-y-4 shadow-[0_30px_70px_rgba(0,0,0,0.95)] relative">
            <button onClick={() => setVerifyModalOrder(null)} className="absolute top-4 right-4 p-2 text-[#B8BDC8] hover:text-[#F8F8F8]">
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-lg text-[#F8F8F8]">
              {verifyActionType === 'APPROVE' ? 'Confirm Payment & Set Delivery Date' : 'Reject Payment & Cancel Order'}
            </h3>

            <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] space-y-1">
              <p>Order ID: <strong className="text-[#D4AF37]">#{verifyModalOrder.id}</strong></p>
              <p>Customer: <strong>{verifyModalOrder.customerName}</strong> (+91 {verifyModalOrder.phone})</p>
              <p>Amount: <strong className="text-[#0FAE72]">₹{(verifyModalOrder.totalAmount || 0).toLocaleString('en-IN')}</strong></p>
            </div>

            <form onSubmit={handleConfirmVerificationModal} className="space-y-4">
              {verifyActionType === 'APPROVE' ? (
                <div>
                  <label className="block text-xs font-bold mb-1">Set Delivery Date (Sent to Customer):</label>
                  <input type="text" required value={deliveryDateInput} onChange={(e) => setDeliveryDateInput(e.target.value)} className={inputClass} />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold mb-1">Cancellation Reason (Sent to Customer):</label>
                  <textarea rows="3" required value={rejectionReasonInput} onChange={(e) => setRejectionReasonInput(e.target.value)} className={inputClass} />
                </div>
              )}

              <button type="submit" className={`w-full py-3.5 rounded-2xl font-bold ${verifyActionType === 'APPROVE' ? 'bg-[#0FAE72] text-[#050505]' : 'bg-rose-500 text-white'}`}>
                {verifyActionType === 'APPROVE' ? 'Confirm & Send Customer WhatsApp / Email' : 'Cancel Order & Notify Customer'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
