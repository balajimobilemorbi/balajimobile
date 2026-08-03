import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Package, ShoppingCart, Users, Tag, Image, 
  Settings, Database, Plus, Edit, Trash2, Download, Upload, 
  Check, RefreshCcw, ShieldCheck, Lock, Sparkles, Layers, 
  FileCode, AlertTriangle, Eye, ArrowUpRight, KeyRound, RotateCw,
  Recycle, Clock, Zap, Timer, CheckCircle2, X, Bell, Phone, Mail, MessageSquare
} from 'lucide-react';
import { storeCMS } from '../services/storeCMS';
import { userIntentService } from '../services/userIntentService';

export default function AdminDashboard() {
  const [settings, setSettings] = useState(storeCMS.getSettings());
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState(storeCMS.getProducts());
  const [secondHandProducts, setSecondHandProducts] = useState(storeCMS.getSecondHandProducts());
  const [categories, setCategories] = useState(storeCMS.getCategories());
  const [orders, setOrders] = useState(storeCMS.getOrders());
  const [coupons, setCoupons] = useState(storeCMS.getCoupons());
  const [notifications, setNotifications] = useState(storeCMS.getOwnerNotifications());
  const [showNotifDrawer, setShowNotifDrawer] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.isRead);

  const pendingOrders = orders.filter(o => {
    const isCancelled = (o.paymentStatus || '').includes('Cancelled') || o.orderStatus === 'Cancelled';
    const isDispatched = o.orderStatus === 'Handed to Courier' || o.orderStatus === 'Out for Delivery' || o.orderStatus === 'Delivered';
    return !isCancelled && !isDispatched;
  });

  // Product Form Modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isSecondHandModal, setIsSecondHandModal] = useState(false);
  const [productForm, setProductForm] = useState({
    title: '', brand: 'Apple', category: 'Flagship Titans', ram: '8GB', storage: '256GB', color: 'Titanium Black',
    processor: 'Snapdragon 8 Gen 3', display: '6.7-inch OLED 120Hz',
    camera: '50MP Main + 50MP Ultra-Wide', battery: '5,000 mAh',
    condition: 'Brand New Sealed Box - 1 Year Warranty', warranty: '1 Year Official Warranty',
    imei: '359481920491029', description: '', marketPrice: 99999, bmPrice: 84999, stock: 10,
    isFeatured: true, isTrending: false, isFlashSale: false, isNewArrival: false,
    imagesText: '', frames360Text: ''
  });

  // Dynamic Multiple Variants State Array
  const [variantsList, setVariantsList] = useState([
    { id: 'var-1', color: 'Natural Titanium', ram: '12GB', storage: '256GB', bmPrice: 84999, marketPrice: 99999, stock: 10, imagesText: '' }
  ]);

  // Timer settings
  const [newArrivalHours, setNewArrivalHours] = useState(settings.newArrivalTimerHours || 72);
  const [flashDealHours, setFlashDealHours] = useState(settings.flashDealTimerHours || 24);

  // Interactive Verification Modal State
  const [verifyModalOrder, setVerifyModalOrder] = useState(null);
  const [verifyActionType, setVerifyActionType] = useState('APPROVE'); // 'APPROVE' | 'REJECT'
  const [deliveryDateInput, setDeliveryDateInput] = useState('');
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  const syncState = () => {
    setProducts(storeCMS.getProducts());
    setSecondHandProducts(storeCMS.getSecondHandProducts());
    setCategories(storeCMS.getCategories());
    setOrders(storeCMS.getOrders());
    setCoupons(storeCMS.getCoupons());
    setSettings(storeCMS.getSettings());
    setNotifications(storeCMS.getOwnerNotifications());
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [activeTab]);

  useEffect(() => {
    window.addEventListener('bm_cms_update', syncState);
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (showProductModal) setShowProductModal(false);
        if (verifyModalOrder) setVerifyModalOrder(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('bm_cms_update', syncState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showProductModal, verifyModalOrder]);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const correctPin = settings.adminPin || '1234';
    if (pinInput.trim() === correctPin) {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Passcode Lock Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl bg-cream-50 dark:bg-titanium-900 border border-gold-border/40 dark:border-titanium-800 shadow-2xl space-y-6 text-center font-mono">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-emerald-glow/60 text-amber-700 dark:text-emerald-accent border border-amber-300 dark:border-emerald-accent/40 flex items-center justify-center mx-auto shadow-md">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-amber-700 dark:text-emerald-accent font-bold">BALAJI MOBILE CMS</span>
          <h2 className="font-display font-black text-2xl text-cream-950 dark:text-slate-100 mt-1">Store Owner Access</h2>
          <p className="text-xs text-cream-600 dark:text-slate-400 font-mono mt-1">Enter your confidential Security PIN to manage store inventory &amp; orders.</p>
        </div>
        <form onSubmit={handlePinSubmit} className="space-y-4">
          <input type="password" maxLength="8" placeholder="Enter Confidential Owner Security PIN" value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl bg-cream-100 dark:bg-titanium-950 border border-gold-border/60 dark:border-titanium-800 text-cream-950 dark:text-slate-100 text-center font-mono text-lg tracking-widest outline-none focus:border-amber-600 dark:focus:border-emerald-accent"
          />
          {pinError && <p className="text-xs font-mono text-rose-500 font-bold">Access Denied: Incorrect Security PIN.</p>}
          <button type="submit" className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 dark:from-emerald-accent dark:to-emerald-600 text-white dark:text-titanium-950 font-bold text-sm shadow-lg hover:opacity-90 transition font-mono">
            Unlock Store Management Panel
          </button>
        </form>
      </div>
    );
  }

  // All Indian brands for the dropdown
  const allBrands = ['Apple','Samsung','OnePlus','Google Pixel','Xiaomi','Redmi','POCO','Vivo','iQOO','OPPO','Realme','Motorola','Nokia','Nothing','ASUS ROG','Infinix','Tecno','Lava','Micromax','Honor','Lenovo','Sony Xperia','CMF by Nothing','ITEL','Coolpad','HTC'];

  const handleOpenAddProduct = (isSecondHand = false) => {
    setEditingProductId(null);
    setIsSecondHandModal(isSecondHand);
    const defaultBmPrice = isSecondHand ? 29999 : 84999;
    const defaultMarketPrice = isSecondHand ? 45000 : 99999;
    
    setProductForm({
      title: '', brand: 'Apple', category: categories[0]?.name || 'Flagship Titans', ram: '12GB', storage: '256GB', color: 'Natural Titanium',
      processor: 'Snapdragon 8 Gen 3', display: '6.7-inch OLED 120Hz',
      camera: '50MP Main', battery: '5,000 mAh',
      condition: isSecondHand ? 'Good Condition - Tested & Verified by Balaji Mobile' : 'Brand New Sealed Box - 1 Year Official Warranty',
      warranty: isSecondHand ? '3 Months Balaji Mobile Shop Warranty' : '1 Year Official Warranty',
      imei: `35${Math.floor(1000000000000 + Math.random() * 9000000000000)}`,
      description: isSecondHand ? 'Pre-owned device in tested condition.' : 'Flagship device in mint condition.',
      marketPrice: defaultMarketPrice, bmPrice: defaultBmPrice, stock: isSecondHand ? 1 : 10,
      isFeatured: true, isTrending: false, isFlashSale: false, isNewArrival: false,
      imagesText: '', frames360Text: ''
    });

    setVariantsList([
      { id: 'var-1', color: 'Natural Titanium', ram: '12GB', storage: '256GB', bmPrice: defaultBmPrice, marketPrice: defaultMarketPrice, stock: isSecondHand ? 1 : 10, imagesText: '' }
    ]);

    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod, isSecondHand = false) => {
    setEditingProductId(prod.id);
    setIsSecondHandModal(isSecondHand);
    setProductForm({
      ...prod,
      category: prod.category || categories[0]?.name || 'Flagship Titans',
      colorsText: prod.colors ? prod.colors.join(', ') : (prod.color || ''),
      ramOptionsText: prod.ramOptions ? prod.ramOptions.join(', ') : (prod.ram || ''),
      storageOptionsText: prod.storageOptions ? prod.storageOptions.join(', ') : (prod.storage || ''),
      imagesText: prod.images ? prod.images.join('\n') : '',
      frames360Text: prod.frames360 ? prod.frames360.join('\n') : ''
    });

    if (prod.variants && prod.variants.length > 0) {
      setVariantsList(prod.variants.map(v => ({
        ...v,
        imagesText: v.images ? v.images.join('\n') : (v.imagesText || '')
      })));
    } else {
      setVariantsList([
        {
          id: 'var-1',
          color: prod.color || 'Natural Titanium',
          ram: prod.ram || '12GB',
          storage: prod.storage || '256GB',
          bmPrice: prod.bmPrice || 84999,
          marketPrice: prod.marketPrice || 99999,
          stock: prod.stock || 10,
          imagesText: prod.images ? prod.images.join('\n') : ''
        }
      ]);
    }

    setShowProductModal(true);
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
    const parsedImages = productForm.imagesText.split('\n').map(s => s.trim()).filter(Boolean);
    const parsed360 = productForm.frames360Text.split('\n').map(s => s.trim()).filter(Boolean);

    // Process each variant entry
    const processedVariants = variantsList.map(v => {
      const vImages = v.imagesText ? v.imagesText.split('\n').map(s => s.trim()).filter(Boolean) : [];
      return {
        ...v,
        images: vImages.length > 0 ? vImages : parsedImages
      };
    });

    const uniqueColors = Array.from(new Set(processedVariants.map(v => v.color).filter(Boolean)));
    const uniqueRams = Array.from(new Set(processedVariants.map(v => v.ram).filter(Boolean)));
    const uniqueStorages = Array.from(new Set(processedVariants.map(v => v.storage).filter(Boolean)));

    const firstVar = processedVariants[0] || {};

    const payload = {
      ...productForm,
      variants: processedVariants,
      colors: uniqueColors.length > 0 ? uniqueColors : [productForm.color || 'Natural Titanium'],
      ramOptions: uniqueRams.length > 0 ? uniqueRams : [productForm.ram || '12GB'],
      storageOptions: uniqueStorages.length > 0 ? uniqueStorages : [productForm.storage || '256GB'],
      ram: firstVar.ram || productForm.ram,
      storage: firstVar.storage || productForm.storage,
      color: firstVar.color || productForm.color,
      bmPrice: firstVar.bmPrice || productForm.bmPrice,
      marketPrice: firstVar.marketPrice || productForm.marketPrice,
      stock: firstVar.stock || productForm.stock,
      images: firstVar.images && firstVar.images.length > 0 ? firstVar.images : (parsedImages.length > 0 ? parsedImages : ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop']),
      frames360: parsed360.length > 0 ? parsed360 : parsedImages
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
      reader.onload = (event) => {
        const base64 = event.target.result;
        setProductForm(prev => ({
          ...prev,
          imagesText: prev.imagesText ? `${prev.imagesText}\n${base64}` : base64
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
        reader.onload = (event) => {
          const base64 = event.target.result;
          setProductForm(prev => ({
            ...prev,
            imagesText: prev.imagesText ? `${prev.imagesText}\n${base64}` : base64
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
    // Auto-open WhatsApp with customer notification for every status update
    if (order && order.phone) {
      const notif = storeCMS.getOrderStatusNotification(order, newStatus);
      if (notif?.whatsappUrl) {
        window.open(notif.whatsappUrl, '_blank');
      }
    }
  };

  // Open interactive verification modal to confirm payment and set delivery date
  const handleOpenVerifyModal = (order) => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    const dateFormatted = d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    
    setVerifyModalOrder(order);
    setVerifyActionType('APPROVE');
    setDeliveryDateInput(dateFormatted);
  };

  // Open interactive rejection modal to cancel order and notify customer
  const handleOpenRejectModal = (order) => {
    setVerifyModalOrder(order);
    setVerifyActionType('REJECT');
    setRejectionReasonInput(`Payment of ₹${(order.totalAmount || 0).toLocaleString('en-IN')} was NOT received in Balaji Mobile bank account.`);
  };

  // Execute verification / rejection action and dispatch customer WhatsApp & Email alerts
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
      syncState();

      // Trigger Notifications to Customer (WhatsApp + Email)
      const notif = storeCMS.getCustomerVerificationNotification(
        { ...verifyModalOrder, estDelivery: dateText }, 
        dateText
      );
      
      // Launch Customer WhatsApp Confirmation Alert
      window.open(notif.whatsappUrl, '_blank');

      // Launch Customer Email Notification if email is present
      if (notif.mailtoUrl) {
        setTimeout(() => {
          window.open(notif.mailtoUrl, '_blank');
        }, 600);
      }

      alert(`✅ Order ${orderId} Confirmed!\n\nExpected Delivery: ${dateText}\n\nCustomer notification links (WhatsApp & Email) opened successfully!`);
    } else {
      // REJECT / CANCEL
      const reasonText = rejectionReasonInput.trim() || 'Payment not credited to shop bank account.';
      const updated = allOrders.map(o => {
        if (o.id === orderId) {
          return { 
            ...o, 
            paymentStatus: '❌ Payment Not Received — Order Cancelled', 
            orderStatus: 'Cancelled',
            cancelReason: reasonText
          };
        }
        return o;
      });
      storeCMS.saveOrders(updated);
      syncState();

      // Trigger Notifications to Customer (WhatsApp + Email)
      const notif = storeCMS.getCustomerRejectionNotification(verifyModalOrder, reasonText);
      
      // Launch Customer WhatsApp Cancellation Alert
      window.open(notif.whatsappUrl, '_blank');

      // Launch Customer Email Cancellation Alert if email is present
      if (notif.mailtoUrl) {
        setTimeout(() => {
          window.open(notif.mailtoUrl, '_blank');
        }, 600);
      }

      alert(`❌ Order ${orderId} Cancelled.\n\nReason: ${reasonText}\n\nCustomer cancellation alerts (WhatsApp & Email) opened successfully!`);
    }

    setVerifyModalOrder(null);
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    storeCMS.updateSettings(settings);
    alert("Store settings updated successfully!");
    syncState();
  };

  const handleResetNewArrivalTimer = () => {
    storeCMS.resetNewArrivalTimer(newArrivalHours);
    alert(`New Arrival timer reset to ${newArrivalHours} hours from now!`);
    syncState();
  };

  const handleResetFlashDealTimer = () => {
    storeCMS.resetFlashDealTimer(flashDealHours);
    alert(`Flash Deal timer reset to ${flashDealHours} hours from now!`);
    syncState();
  };

  const totalRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  const inputClass = "w-full px-3 py-2 rounded-xl bg-cream-50 dark:bg-titanium-900 border border-gold-border/40 dark:border-titanium-800 text-cream-950 dark:text-slate-100 font-mono text-xs outline-none focus:border-amber-500 dark:focus:border-emerald-accent";

  // Product card component for admin
  const AdminProductCard = ({ p, isSecondHand = false }) => (
    <div className="p-5 rounded-3xl bg-cream-50 dark:bg-titanium-900 border border-gold-border/40 dark:border-titanium-800 space-y-3">
      <div className="h-40 w-full flex items-center justify-center rounded-2xl bg-white dark:bg-titanium-950 p-3 relative">
        <img src={p.images[0]} alt={p.title} className="max-h-full max-w-full object-contain" />
        {isSecondHand && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[9px] font-bold font-mono">PRE-OWNED</span>
        )}
      </div>
      <div>
        <span className="text-[10px] text-brand-orange dark:text-emerald-accent font-bold uppercase">{p.brand}</span>
        <h4 className="font-display font-bold text-cream-950 dark:text-slate-100 text-sm truncate">{p.title}</h4>
        <p className="text-cream-600 dark:text-slate-400 text-[11px] mt-0.5">Condition: <span className="text-emerald-700 dark:text-emerald-400 font-bold">{p.condition}</span></p>
        <p className="text-cream-600 dark:text-slate-400 text-[11px]">Stock: {p.stock} units</p>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-gold-border/30 dark:border-titanium-800">
        <span className="font-bold text-cream-950 dark:text-slate-100 text-sm">₹{p.bmPrice.toLocaleString('en-IN')}</span>
        <div className="flex items-center gap-2">
          <button onClick={() => handleOpenEditProduct(p, isSecondHand)}
            className="p-2 rounded-xl bg-cream-200 dark:bg-titanium-950 border text-cream-900 dark:text-slate-200 hover:text-amber-700">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => handleDeleteProduct(p.id, isSecondHand)}
            className="p-2 rounded-xl bg-cream-200 dark:bg-titanium-950 border text-cream-900 dark:text-slate-200 hover:text-rose-500">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* CMS Header */}
      <div className="p-6 rounded-3xl bg-cream-50 dark:bg-titanium-900 border border-gold-border/40 dark:border-titanium-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-200 text-amber-900 dark:bg-emerald-glow dark:text-emerald-accent text-xs font-mono font-bold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>STORE OWNER CMS (PASSTHROUGH ACTIVE)</span>
          </div>
          <h1 className="font-display font-black text-3xl text-cream-950 dark:text-slate-100">
            Balaji Mobile — Owner Dashboard
          </h1>
          <p className="text-xs text-cream-600 dark:text-slate-400 font-mono mt-0.5">
            Add, delete, update phone photos, 360° views, prices & conditions. Live changes reflect instantly!
          </p>
        </div>
        <div className="flex items-center gap-3 font-mono">
          {/* Manual Force Cloud Sync Button */}
          <button
            onClick={async () => {
              await storeCMS.syncToCloud();
              alert("⚡ SUCCESS! Live changes pushed to Cloud! All mobile phones, tablets, and Netlify visitors will see the updated prices and products in 1-2 seconds.");
            }}
            className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-titanium-950 font-bold text-xs shadow-lg transition flex items-center gap-1.5 active:scale-95"
            title="Push updated product prices, photos & banners to all customer mobile phones"
          >
            <Zap className="w-4 h-4 fill-titanium-950 animate-bounce" />
            <span>🌐 Push Live to All Mobile Phones</span>
          </button>

          {/* Real-Time Live Order Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDrawer(!showNotifDrawer)}
              className="p-2.5 rounded-xl bg-amber-100 dark:bg-titanium-950 border border-amber-300 dark:border-titanium-800 text-amber-900 dark:text-emerald-accent font-bold text-xs hover:scale-105 transition relative flex items-center gap-1.5 shadow-md"
            >
              <Bell className="w-5 h-5 text-amber-700 dark:text-emerald-accent animate-pulse" />
              <span className="hidden sm:inline">Notifications</span>
              {unreadNotifs.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-bold animate-bounce shadow-md">
                  {unreadNotifs.length} NEW
                </span>
              )}
            </button>

            {/* Notification Drawer Dropdown */}
            {showNotifDrawer && (
              <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 p-4 rounded-3xl bg-white dark:bg-titanium-950 border border-amber-300 dark:border-emerald-accent/40 shadow-2xl text-xs space-y-3 font-sans">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-titanium-800">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-1.5 font-display">
                    <Bell className="w-4 h-4 text-emerald-500" />
                    <span>Real-Time Customer Notifications</span>
                  </h4>
                  <button onClick={() => setShowNotifDrawer(false)} className="text-slate-400 hover:text-slate-200">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2 font-mono">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className={`p-3 rounded-2xl border space-y-1.5 transition ${n.isRead ? 'bg-slate-50 dark:bg-titanium-900/40 border-slate-200 dark:border-titanium-800' : 'bg-amber-50 dark:bg-emerald-950/40 border-amber-300 dark:border-emerald-accent/40 font-bold'}`}>
                        <div className="flex justify-between items-start">
                          <span className="text-amber-800 dark:text-emerald-accent font-bold text-xs">{n.title}</span>
                          <span className="text-[10px] text-slate-400">{new Date(n.placedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs font-sans">
                          👤 <strong>{n.customerName}</strong> ({n.customerPhone})<br />
                          📍 {n.fullAddress}<br />
                          💰 Amount: <strong>₹{n.totalAmount?.toLocaleString('en-IN')}</strong> ({n.paymentMethod})
                        </p>
                        <div className="flex gap-2 pt-1 text-[10px]">
                          <button
                            onClick={() => {
                              storeCMS.markOwnerNotificationRead(n.id);
                              setActiveTab('verifications');
                              setShowNotifDrawer(false);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition"
                          >
                            Verify & Dispatch
                          </button>
                          <a
                            href={`https://wa.me/91${(n.customerPhone || '').replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-titanium-800 text-slate-800 dark:text-slate-200 font-bold flex items-center gap-1 hover:text-emerald-500 transition"
                          >
                            <MessageSquare className="w-3 h-3" /> WhatsApp
                          </a>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-slate-500 font-mono text-xs">
                      No notifications yet. New customer orders will appear here in real-time!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setIsAuthenticated(false)}
            className="px-4 py-2.5 rounded-xl bg-cream-200 dark:bg-titanium-950 border border-gold-border/40 text-cream-900 dark:text-slate-300 font-bold text-xs hover:bg-rose-500 hover:text-white transition">
            Lock Panel
          </button>
          <button onClick={() => handleOpenAddProduct(false)}
            className="px-5 py-2.5 rounded-xl bg-amber-600 dark:bg-emerald-accent text-white dark:text-titanium-950 font-bold text-xs hover:opacity-90 shadow-lg transition flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Add New Phone
          </button>
        </div>
      </div>

      {/* 2-Column macOS Style Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Vertical macOS Glass Navigation Menu Stack */}
        <div className="lg:col-span-4 space-y-3 font-mono text-xs">
          <div className="apple-glass-card p-4 rounded-3xl space-y-2 border shadow-xl">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-emerald-accent px-2">
              ADMIN CONTROL CENTER
            </span>
            <div className="space-y-2 pt-2">
              {[
                { id: 'overview', label: '1. Store Overview', desc: 'Revenue, orders & stock metrics', icon: BarChart3 },
                { id: 'verifications', label: '2. Payment Verification Check', desc: 'Confirm GPay payments (YES / NO)', icon: ShieldCheck, badge: pendingOrders.length, isImportant: pendingOrders.length > 0 },
                { id: 'orders', label: '3. All Customer Orders', desc: `Manage ${orders.length} orders & dispatches`, icon: ShoppingCart, badge: orders.length },
                { id: 'products', label: '4. New Phones Inventory', desc: `Catalog of ${products.length} smartphones`, icon: Package, badge: products.length },
                { id: 'secondhand', label: '5. Pre-Owned Deals', desc: `Second hand catalog (${secondHandProducts.length})`, icon: Recycle, badge: secondHandProducts.length },
                { id: 'timers', label: '6. Section Timers', desc: 'Flash deal & new arrival timers', icon: Timer },
                { id: 'settings', label: '7. Store Settings & PIN', desc: 'UPI ID, Razorpay Key & PIN code', icon: Settings },
                { id: 'intents', label: '8. Customer Intent & WA Alerts', desc: 'Auto WhatsApp alerts for search & cart', icon: MessageSquare }
              ].map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full p-3.5 rounded-2xl font-bold transition-all duration-300 flex items-center justify-between text-left border relative overflow-hidden group ${
                      isActive
                        ? 'bg-amber-600 dark:bg-emerald-accent text-white dark:text-titanium-950 border-amber-600 dark:border-emerald-accent shadow-lg scale-[1.01]'
                        : 'bg-white/40 dark:bg-titanium-950/40 text-cream-900 dark:text-slate-200 border-gold-border/20 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/[0.08] hover:border-amber-400 dark:hover:border-emerald-accent/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold shrink-0 transition ${
                        isActive 
                          ? 'bg-white/20 dark:bg-black/20 text-white dark:text-titanium-950' 
                          : 'bg-amber-100 dark:bg-titanium-900 text-amber-700 dark:text-emerald-accent group-hover:scale-110'
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs flex items-center gap-2">
                          <span>{tab.label}</span>
                        </div>
                        <p className={`text-[10px] font-mono mt-0.5 line-clamp-1 ${
                          isActive ? 'text-white/80 dark:text-titanium-950/80' : 'text-cream-500 dark:text-slate-400'
                        }`}>
                          {tab.desc}
                        </p>
                      </div>
                    </div>

                    {tab.badge !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black shrink-0 ml-2 ${
                        tab.isImportant
                          ? 'bg-rose-500 text-white animate-pulse shadow-md'
                          : isActive ? 'bg-black/20 text-white' : 'bg-amber-200 text-amber-950 dark:bg-titanium-800 dark:text-slate-200'
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

        {/* Right Column: Active Content Panel */}
        <div className="lg:col-span-8 space-y-6">

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6 font-mono">
          {/* Top 4 Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="apple-glass-card p-5 rounded-3xl border shadow-lg space-y-2 relative overflow-hidden">
              <div className="flex justify-between items-center text-xs text-cream-600 dark:text-slate-400">
                <span>Total Revenue</span>
                <span className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-bold">
                  ₹ INR
                </span>
              </div>
              <h3 className="font-display font-black text-2xl text-amber-800 dark:text-emerald-accent">
                ₹{totalRevenue.toLocaleString('en-IN')}
              </h3>
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-bold">
                ↑ Gross Store Sales
              </p>
            </div>

            <div className="apple-glass-card p-5 rounded-3xl border shadow-lg space-y-2 relative overflow-hidden">
              <div className="flex justify-between items-center text-xs text-cream-600 dark:text-slate-400">
                <span>Customer Orders</span>
                <span className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold">
                  <ShoppingCart className="w-4 h-4" />
                </span>
              </div>
              <h3 className="font-display font-black text-2xl text-cream-950 dark:text-slate-100">
                {orders.length} Orders
              </h3>
              {pendingOrders.length > 0 ? (
                <p className="text-[10px] text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 animate-pulse">
                  ⚠️ {pendingOrders.length} Pending Payment Check
                </p>
              ) : (
                <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ✅ All Orders Processed
                </p>
              )}
            </div>

            <div className="apple-glass-card p-5 rounded-3xl border shadow-lg space-y-2 relative overflow-hidden">
              <div className="flex justify-between items-center text-xs text-cream-600 dark:text-slate-400">
                <span>New Phones in Stock</span>
                <span className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold">
                  <Package className="w-4 h-4" />
                </span>
              </div>
              <h3 className="font-display font-black text-2xl text-cream-950 dark:text-slate-100">
                {products.reduce((acc, p) => acc + (p.stock || 0), 0)} Units
              </h3>
              <p className="text-[10px] text-cream-500 dark:text-slate-400 font-bold">
                Across {products.length} Models
              </p>
            </div>

            <div className="apple-glass-card p-5 rounded-3xl border shadow-lg space-y-2 relative overflow-hidden">
              <div className="flex justify-between items-center text-xs text-cream-600 dark:text-slate-400">
                <span>Pre-Owned Phones</span>
                <span className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300 font-bold">
                  <Recycle className="w-4 h-4" />
                </span>
              </div>
              <h3 className="font-display font-black text-2xl text-brand-orange dark:text-amber-400">
                {secondHandProducts.length} Listed
              </h3>
              <p className="text-[10px] text-amber-700 dark:text-amber-400 font-bold">
                Verified Used Stock
              </p>
            </div>
          </div>

          {/* Recent Orders & Activity Log */}
          <div className="apple-glass-card p-6 rounded-3xl border shadow-xl space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-display font-bold text-base text-cream-950 dark:text-slate-100 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-emerald-accent" />
                  <span>Recent Customer Orders &amp; Dispatches</span>
                </h4>
                <p className="text-[11px] text-cream-500 dark:text-slate-400 mt-0.5">
                  Live feed of customer purchases and verification status
                </p>
              </div>
              <button
                onClick={() => setActiveTab('orders')}
                className="px-3.5 py-1.5 rounded-xl bg-cream-200 dark:bg-titanium-900 text-cream-900 dark:text-slate-200 text-xs font-bold hover:bg-amber-600 hover:text-white transition"
              >
                View All ({orders.length})
              </button>
            </div>

            {orders.length > 0 ? (
              <div className="space-y-3">
                {orders.slice(0, 4).map((o) => {
                  const isPending = (o.paymentStatus || '').includes('Pending');
                  const isVerified = (o.paymentStatus || '').includes('Verified');
                  const isCancelled = (o.paymentStatus || '').includes('Cancelled') || o.orderStatus === 'Cancelled';

                  return (
                    <div key={o.id} className="p-4 rounded-2xl bg-white/50 dark:bg-titanium-950/60 border border-gold-border/30 dark:border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-800 dark:text-emerald-accent">{o.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            isCancelled ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300' :
                            isVerified ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' :
                            isPending ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse' :
                            'bg-blue-100 text-blue-900'
                          }`}>
                            {o.paymentStatus || o.paymentMethod}
                          </span>
                        </div>
                        <p className="text-cream-800 dark:text-slate-300 font-bold">
                          Customer: {o.customerName} ({o.phone})
                        </p>
                        <p className="text-[11px] text-cream-500 dark:text-slate-400">
                          Address: {o.city}, {o.district}, {o.state}
                        </p>
                      </div>

                      <div className="flex sm:flex-col items-end justify-between w-full sm:w-auto gap-2">
                        <span className="font-display font-black text-base text-cream-950 dark:text-slate-100">
                          ₹{(o.totalAmount || 0).toLocaleString('en-IN')}
                        </span>
                        {isPending ? (
                          <button
                            onClick={() => setActiveTab('verifications')}
                            className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold transition shadow-sm flex items-center gap-1"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Verify Payment
                          </button>
                        ) : (
                          <span className="text-[10px] text-cream-500 dark:text-slate-400">
                            {o.placedAt ? new Date(o.placedAt).toLocaleDateString('en-IN') : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center py-6 text-cream-500 dark:text-slate-500">No customer orders placed yet.</p>
            )}
          </div>

          {/* Store Operations & System Health Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-5 rounded-3xl apple-glass-card border space-y-2">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Shop System Status</span>
              </div>
              <p className="text-cream-950 dark:text-slate-200 font-bold">🟢 Live &amp; Accepting Orders</p>
              <p className="text-[11px] text-cream-500 dark:text-slate-400">Location: Morbi, Gujarat, India</p>
            </div>

            <div className="p-5 rounded-3xl apple-glass-card border space-y-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-emerald-accent font-bold">
                <Lock className="w-4 h-4 text-amber-600 dark:text-emerald-accent" />
                <span>Owner Security PIN</span>
              </div>
              <p className="text-cream-950 dark:text-slate-200 font-bold">Passcode: •••••••• (Encrypted)</p>
              <p className="text-[11px] text-cream-500 dark:text-slate-400">Protected Admin Portal (Change in Settings)</p>
            </div>

            <div className="p-5 rounded-3xl apple-glass-card border space-y-2">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Shop Merchant UPI VPA</span>
              </div>
              <p className="text-cream-950 dark:text-slate-200 font-bold truncate">javiya36p36-1@oksbi</p>
              <p className="text-[11px] text-cream-500 dark:text-slate-400">Google Pay Merchant Verified</p>
            </div>
          </div>
        </div>
      )}

      {/* NEW PHONES CATALOG */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-display font-bold text-xl text-cream-950 dark:text-slate-100">Manage New Phones ({products.length})</h3>
            <button onClick={() => handleOpenAddProduct(false)}
              className="px-4 py-2 rounded-xl bg-amber-600 dark:bg-emerald-accent text-white dark:text-titanium-950 font-bold text-xs font-mono">
              + Add New Phone
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
            {products.map(p => <AdminProductCard key={p.id} p={p} />)}
          </div>
        </div>
      )}

      {/* SECOND HAND PHONES */}
      {activeTab === 'secondhand' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display font-bold text-xl text-cream-950 dark:text-slate-100">Manage Second Hand Phones ({secondHandProducts.length})</h3>
              <p className="text-xs text-cream-600 dark:text-slate-400 font-mono mt-1">Add pre-owned phones with condition details, battery health, photos. Everything editable anytime.</p>
            </div>
            <button onClick={() => handleOpenAddProduct(true)}
              className="px-4 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs font-mono flex items-center gap-1.5">
              <Recycle className="w-3.5 h-3.5" /> + Add Second Hand Phone
            </button>
          </div>
          {secondHandProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs">
              {secondHandProducts.map(p => <AdminProductCard key={p.id} p={p} isSecondHand />)}
            </div>
          ) : (
            <div className="text-center py-16 space-y-4">
              <Recycle className="w-16 h-16 mx-auto text-cream-400 dark:text-slate-600" />
              <p className="text-sm text-cream-600 dark:text-slate-400 font-mono">No second hand phones added yet. Click "Add Second Hand Phone" above.</p>
            </div>
          )}
        </div>
      )}

      {/* SECTION TIMERS */}
      {activeTab === 'timers' && (
        <div className="space-y-8">
          <h3 className="font-display font-bold text-xl text-cream-950 dark:text-slate-100">Section Visibility Timers</h3>
          
          {/* New Arrival Timer */}
          <div className="p-6 rounded-3xl bg-amber-50 dark:bg-titanium-900 border border-amber-200 dark:border-amber-500/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-200 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-cream-950 dark:text-slate-100">BM New Arrival Section</h4>
                <p className="text-xs text-cream-600 dark:text-slate-400 font-mono">
                  Status: <strong className={storeCMS.isNewArrivalActive() ? 'text-emerald-600 dark:text-emerald-accent' : 'text-rose-500'}>{storeCMS.isNewArrivalActive() ? 'ACTIVE' : 'EXPIRED'}</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 font-mono text-xs">
              <label className="text-cream-700 dark:text-slate-400">Set timer duration (hours):</label>
              <input type="number" min="1" max="720" value={newArrivalHours}
                onChange={(e) => setNewArrivalHours(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded-xl bg-cream-100 dark:bg-titanium-950 border border-amber-200 dark:border-titanium-800 text-cream-950 dark:text-slate-100 font-bold text-center"
              />
              <span className="text-cream-500 dark:text-slate-500">hours</span>
              <button onClick={handleResetNewArrivalTimer}
                className="px-4 py-2 rounded-xl bg-amber-600 text-white font-bold hover:opacity-90 transition flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5" /> Reset & Start Timer
              </button>
            </div>
            <p className="text-[11px] text-cream-500 dark:text-slate-500 font-mono">
              After resetting, the "BM New Arrival" section will be visible on the homepage for the specified hours. Products with "isNewArrival" flag will appear.
            </p>
          </div>

          {/* Flash Deal Timer */}
          <div className="p-6 rounded-3xl bg-red-50 dark:bg-titanium-900 border border-red-200 dark:border-emerald-accent/30 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-red-200 dark:bg-emerald-glow text-red-700 dark:text-emerald-accent">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-display font-bold text-cream-950 dark:text-slate-100">BM Flash Deal Section</h4>
                <p className="text-xs text-cream-600 dark:text-slate-400 font-mono">
                  Status: <strong className={storeCMS.isFlashDealActive() ? 'text-emerald-600 dark:text-emerald-accent' : 'text-rose-500'}>{storeCMS.isFlashDealActive() ? 'ACTIVE' : 'EXPIRED'}</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 font-mono text-xs">
              <label className="text-cream-700 dark:text-slate-400">Set timer duration (hours):</label>
              <input type="number" min="1" max="720" value={flashDealHours}
                onChange={(e) => setFlashDealHours(Number(e.target.value))}
                className="w-24 px-3 py-2 rounded-xl bg-cream-100 dark:bg-titanium-950 border border-red-200 dark:border-titanium-800 text-cream-950 dark:text-slate-100 font-bold text-center"
              />
              <span className="text-cream-500 dark:text-slate-500">hours</span>
              <button onClick={handleResetFlashDealTimer}
                className="px-4 py-2 rounded-xl bg-red-600 dark:bg-emerald-accent text-white dark:text-titanium-950 font-bold hover:opacity-90 transition flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5" /> Reset & Start Timer
              </button>
            </div>
            <p className="text-[11px] text-cream-500 dark:text-slate-500 font-mono">
              After resetting, the "BM Flash Deal" section will be visible on the homepage for the specified hours. Products with "isFlashSale" flag will appear.
            </p>
          </div>
        </div>
      )}

      {/* PAYMENT VERIFICATION SECTION */}
      {activeTab === 'verifications' && (
        <div className="space-y-6 font-mono text-xs">
            {/* Header Banner */}
            <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-500/40 space-y-2">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-base">
                <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-emerald-accent" />
                <span>Owner Payment Verification Center</span>
              </div>
              <p className="text-cream-700 dark:text-slate-300 text-xs leading-relaxed">
                Check your <strong>Google Pay / Bank App</strong> on your phone to confirm if the customer's payment has been credited.<br />
                • Click <strong>YES — Payment Received</strong> to confirm the order and send it for packing &amp; delivery.<br />
                • Click <strong>NO — Payment Not Received</strong> to cancel the order if the money was not credited.
              </p>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold text-xl text-cream-950 dark:text-slate-100 flex items-center gap-2">
                <span>Orders Pending Payment Verification</span>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold ${
                  pendingOrders.length > 0
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-emerald-500 text-white'
                }`}>
                  {pendingOrders.length} {pendingOrders.length === 1 ? 'Order' : 'Orders'}
                </span>
              </h3>
            </div>

            {pendingOrders.length > 0 ? (
              <div className="space-y-5">
                {pendingOrders.map(o => (
                  <div key={o.id} className="p-6 rounded-3xl bg-cream-50 dark:bg-titanium-900 border-2 border-amber-400 dark:border-amber-500/60 shadow-xl space-y-4">
                    {/* Top Bar: Order ID & Date */}
                    <div className="flex flex-wrap justify-between items-center pb-3 border-b border-amber-200 dark:border-titanium-800 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-black text-sm border border-amber-300">
                          {o.id}
                        </span>
                        <span className="text-cream-500 dark:text-slate-400 text-xs">
                          Placed: {o.placedAt ? new Date(o.placedAt).toLocaleString('en-IN') : '—'}
                        </span>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-bold text-xs animate-pulse">
                        ⚠️ Verification Required
                      </span>
                    </div>

                    {/* Customer Info & Amount */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5 bg-cream-100 dark:bg-titanium-950 p-4 rounded-2xl border border-gold-border/30 dark:border-titanium-800">
                        <p className="text-cream-950 dark:text-slate-100 text-sm">Customer: <strong className="text-amber-800 dark:text-emerald-accent">{o.customerName}</strong></p>
                        <p className="text-cream-700 dark:text-slate-300">Phone: <strong>+91 {o.phone}</strong></p>
                        <p className="text-cream-600 dark:text-slate-400">Email: {o.email || '—'}</p>
                        <p className="text-cream-600 dark:text-slate-400">Address: {o.address}, {o.city}, {o.district}, {o.state} - {o.pincode}</p>
                      </div>

                      <div className="space-y-2 bg-amber-50 dark:bg-titanium-950 p-4 rounded-2xl border border-amber-300 dark:border-amber-500/40">
                        <p className="text-xs text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider">Amount to Check in GPay / Bank App:</p>
                        <p className="text-2xl font-black text-amber-900 dark:text-emerald-accent font-display">
                          ₹{(o.totalAmount || 0).toLocaleString('en-IN')}
                        </p>
                        <p className="text-cream-700 dark:text-slate-300">Method: <strong>{o.paymentMethod}</strong></p>
                        {o.paymentId && <p className="text-cream-600 dark:text-slate-400">Ref/Txn ID: <strong className="text-amber-700 dark:text-emerald-accent">{o.paymentId}</strong></p>}
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="bg-cream-100 dark:bg-titanium-950 p-3 rounded-2xl border border-gold-border/20 text-cream-700 dark:text-slate-300">
                      <p className="font-bold mb-1 text-cream-900 dark:text-slate-200">Ordered Items:</p>
                      <ul className="space-y-1">
                        {(o.items || []).map((it, idx) => (
                          <li key={idx} className="flex justify-between">
                            <span>{it.title || it.name} {it.storage ? `(${it.storage})` : ''} × {it.quantity || 1}</span>
                            <span className="font-bold">₹{((it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* PROMINENT YES / NO VERIFICATION BUTTONS */}
                    <div className="pt-2">
                      <p className="text-xs font-bold text-center mb-2 text-cream-950 dark:text-slate-100">
                        Did you receive ₹{(o.totalAmount || 0).toLocaleString('en-IN')} in your Google Pay / Bank Account?
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button
                          onClick={() => handleOpenVerifyModal(o)}
                          className="py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold text-sm hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01]"
                        >
                          <Check className="w-5 h-5" />
                          <span>YES — Payment Received (Set Delivery Date)</span>
                        </button>
                        <button
                          onClick={() => handleOpenRejectModal(o)}
                          className="py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-700 text-white font-bold text-sm hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg hover:scale-[1.01]"
                        >
                          <AlertTriangle className="w-5 h-5" />
                          <span>NO — Payment Not Received (Cancel Order)</span>
                        </button>
                      </div>
                    </div>

                    {/* WhatsApp Quick Links */}
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-gold-border/20">
                      <a href={storeCMS.getWhatsAppLinks(o).customerWhatsAppUrl} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 hover:opacity-90">
                        WhatsApp Customer
                      </a>
                      <a href={storeCMS.getWhatsAppLinks(o).ownerWhatsAppUrl} target="_blank" rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs flex items-center gap-1 hover:opacity-90">
                        WhatsApp Notification
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 rounded-3xl bg-cream-50 dark:bg-titanium-900 border border-gold-border/40 dark:border-titanium-800 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-display font-bold text-lg text-cream-950 dark:text-slate-100">All Payments Verified!</h4>
                <p className="text-cream-600 dark:text-slate-400 text-xs">There are no orders waiting for payment verification right now.</p>
              </div>
            )}
          </div>
      )}

      {/* ORDERS */}
      {activeTab === 'orders' && (() => {
        const STATUS_STEPS = [
          { key: 'Order Placed',      emoji: '🛒', label: 'Placed' },
          { key: 'Order Packed',      emoji: '📦', label: 'Packed' },
          { key: 'Handed to Courier', emoji: '🚚', label: 'Dispatched' },
          { key: 'Out for Delivery',  emoji: '🛵', label: 'On Way' },
          { key: 'Delivered',         emoji: '✅', label: 'Delivered' },
        ];

        const activeOrders    = orders.filter(o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled');
        const completedOrders = orders.filter(o => o.orderStatus === 'Delivered');
        const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled' || (o.paymentStatus || '').includes('Cancelled'));

        const stepIdx = (status) => STATUS_STEPS.findIndex(s => s.key === status);

        const OrderPipelineCard = ({ o, isActive }) => {
          const currentIdx = stepIdx(o.orderStatus);
          const isCOD = (o.paymentMethod || '').toLowerCase().includes('cod') || (o.paymentMethod || '').toLowerCase().includes('cash');
          const isPending = (o.paymentStatus || '').includes('Pending');
          const isVerified = (o.paymentStatus || '').includes('Verified');
          return (
            <div className={`p-5 rounded-3xl bg-cream-50 dark:bg-titanium-900 border-2 space-y-4 shadow-lg transition-all ${
              isActive ? 'border-amber-400 dark:border-amber-500/60' : 'border-emerald-400 dark:border-emerald-600/50'
            }`}>
              {/* Header */}
              <div className="flex flex-wrap justify-between items-center gap-2 pb-3 border-b border-gold-border/30 dark:border-titanium-800">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 font-black text-xs border border-amber-300 dark:border-amber-700">
                    {o.id}
                  </span>
                  <span className="text-cream-500 dark:text-slate-400 text-[10px] font-mono">
                    {o.placedAt ? new Date(o.placedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </span>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-[10px] border ${
                  isVerified ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800' :
                  isPending  ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-300 animate-pulse' :
                  isCOD      ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-300' :
                               'bg-cream-200 dark:bg-titanium-800 text-cream-700 dark:text-slate-400 border-gold-border/40'
                }`}>
                  {isVerified ? '✅' : isPending ? '⚠️' : isCOD ? '💵' : '💳'}
                  <span>{o.paymentStatus || o.paymentMethod || '—'}</span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="space-y-0.5 bg-cream-100 dark:bg-titanium-950 p-3 rounded-2xl border border-gold-border/20 dark:border-titanium-800">
                  <p className="font-bold text-cream-950 dark:text-slate-100">{o.customerName}</p>
                  <p className="text-cream-600 dark:text-slate-400">📞 {o.phone}</p>
                  {o.email && <p className="text-cream-500 dark:text-slate-500 truncate">✉️ {o.email}</p>}
                  <p className="text-cream-600 dark:text-slate-400 text-[10px]">📍 {o.address}, {o.city}, {o.state}</p>
                </div>
                <div className="space-y-0.5 bg-cream-100 dark:bg-titanium-950 p-3 rounded-2xl border border-gold-border/20 dark:border-titanium-800">
                  <p className="text-cream-600 dark:text-slate-400">Items: <strong className="text-cream-950 dark:text-slate-200">{(o.items || []).length}</strong></p>
                  <p className="font-black text-amber-700 dark:text-emerald-accent text-base">₹{(o.totalAmount || 0).toLocaleString('en-IN')}</p>
                  {o.estDelivery && <p className="text-cream-500 dark:text-slate-500 text-[10px]">🚚 Est: {o.estDelivery}</p>}
                  <p className="text-cream-500 dark:text-slate-500 text-[10px]">{o.paymentMethod}</p>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-cream-100 dark:bg-titanium-950 p-3 rounded-2xl border border-gold-border/20 dark:border-titanium-800 text-[11px] font-mono space-y-1">
                {(o.items || []).map((it, idx) => (
                  <div key={idx} className="flex justify-between text-cream-700 dark:text-slate-300">
                    <span className="truncate pr-2">{it.title || it.name} {it.storage ? `· ${it.storage}` : ''} × {it.quantity || 1}</span>
                    <span className="font-bold shrink-0">₹{((it.bmPrice || it.price || 0) * (it.quantity || 1)).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              {/* STATUS PIPELINE STEPPER */}
              {isActive && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 dark:from-titanium-950 dark:to-titanium-900 border border-amber-200 dark:border-titanium-700 space-y-3">
                  <p className="text-[10px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3 h-3" />
                    TAP STEP TO UPDATE STATUS — AUTO NOTIFIES CUSTOMER ON WHATSAPP
                  </p>
                  <div className="relative">
                    {/* Progress Bar */}
                    <div className="absolute top-5 left-0 right-0 h-0.5 bg-cream-200 dark:bg-titanium-800 mx-6 z-0" />
                    <div
                      className="absolute top-5 left-0 h-0.5 bg-gradient-to-r from-amber-400 to-emerald-500 z-0 transition-all duration-500"
                      style={{ width: currentIdx < 0 ? '0%' : `${Math.min(currentIdx / (STATUS_STEPS.length - 1) * 100, 100)}%`, marginLeft: '1.5rem', marginRight: '1.5rem', maxWidth: 'calc(100% - 3rem)' }}
                    />
                    {/* Steps */}
                    <div className="relative z-10 flex justify-between items-start">
                      {STATUS_STEPS.map((step, idx) => {
                        const isDone    = currentIdx >= idx;
                        const isCurrent = currentIdx === idx;
                        const isNext    = idx === currentIdx + 1;
                        return (
                          <button
                            key={step.key}
                            type="button"
                            title={`Set: ${step.key} → Auto-send WhatsApp to customer`}
                            onClick={() => handleStatusUpdate(o.id, step.key, o)}
                            className={`flex flex-col items-center gap-1.5 group transition-all duration-200 ${
                              isDone ? 'cursor-pointer' : isNext ? 'cursor-pointer' : 'cursor-pointer opacity-60'
                            }`}
                          >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base border-2 font-bold transition-all duration-300 shadow-sm group-hover:scale-110 ${
                              isCurrent
                                ? 'bg-amber-500 border-amber-600 text-white shadow-amber-300 dark:shadow-amber-900 shadow-md scale-110 animate-pulse'
                                : isDone
                                ? 'bg-emerald-500 border-emerald-600 text-white'
                                : isNext
                                ? 'bg-white dark:bg-titanium-800 border-amber-400 text-amber-600 dark:text-amber-400 border-dashed group-hover:bg-amber-50 group-hover:border-amber-500'
                                : 'bg-cream-100 dark:bg-titanium-800 border-cream-300 dark:border-titanium-700 text-cream-400 dark:text-slate-600'
                            }`}>
                              {step.emoji}
                            </div>
                            <span className={`text-[9px] font-bold text-center leading-tight max-w-[50px] ${
                              isCurrent ? 'text-amber-700 dark:text-amber-400' :
                              isDone    ? 'text-emerald-700 dark:text-emerald-400' :
                              isNext    ? 'text-amber-600 dark:text-amber-500' :
                              'text-cream-400 dark:text-slate-600'
                            }`}>
                              {step.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <p className="text-[10px] text-amber-600 dark:text-amber-500 font-mono text-center">
                    ⚡ WhatsApp opens automatically when you tap a step — just press Send!
                  </p>
                </div>
              )}

              {/* Payment Verify Buttons for Pending */}
              {(o.paymentStatus || '').includes('Pending') && o.orderStatus !== 'Cancelled' && (
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => handleOpenVerifyModal(o)}
                    className="py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition">
                    <Check className="w-4 h-4" /> YES — Payment Received
                  </button>
                  <button onClick={() => handleOpenRejectModal(o)}
                    className="py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition">
                    <AlertTriangle className="w-4 h-4" /> NO — Cancel Order
                  </button>
                </div>
              )}

              {/* WhatsApp Quick Links */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gold-border/20 dark:border-titanium-800">
                <a href={storeCMS.getWhatsAppLinks(o).customerWhatsAppUrl} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1 hover:opacity-90 transition">
                  📄 Send Invoice to Customer
                </a>
                <a href={storeCMS.getWhatsAppLinks(o).ownerWhatsAppUrl} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-[10px] flex items-center gap-1 hover:opacity-90 transition">
                  👤 Owner Order Notification
                </a>
              </div>
            </div>
          );
        };

        return (
          <div className="space-y-8 font-mono text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-xl text-cream-950 dark:text-slate-100 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-amber-600 dark:text-emerald-accent" />
                Customer Orders Pipeline
              </h3>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-800">{activeOrders.length} Active</span>
                <span className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800">{completedOrders.length} Done</span>
                <span className="px-2 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-800">{cancelledOrders.length} Cancelled</span>
              </div>
            </div>

            {/* ── SECTION 1: ACTIVE ORDERS ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-amber-400 dark:border-amber-500/60">
                <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold text-sm shadow">🟡</div>
                <div>
                  <h4 className="font-bold text-amber-800 dark:text-amber-400 text-sm">Active Orders</h4>
                  <p className="text-[10px] text-cream-500 dark:text-slate-500">Tap pipeline steps to update status — WhatsApp auto-sends to customer</p>
                </div>
                <span className="ml-auto px-3 py-1 rounded-full bg-amber-500 text-white font-black text-xs shadow">{activeOrders.length}</span>
              </div>

              {activeOrders.length > 0 ? (
                <div className="space-y-5">
                  {activeOrders.map(o => <OrderPipelineCard key={o.id} o={o} isActive={true} />)}
                </div>
              ) : (
                <div className="p-10 rounded-3xl bg-cream-50 dark:bg-titanium-900 border border-gold-border/30 dark:border-titanium-800 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center mx-auto text-2xl">🎉</div>
                  <p className="font-bold text-cream-700 dark:text-slate-300">All orders processed! No active orders right now.</p>
                </div>
              )}
            </div>

            {/* ── SECTION 2: COMPLETED ORDERS ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-emerald-500 dark:border-emerald-600/60">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow">✅</div>
                <div>
                  <h4 className="font-bold text-emerald-700 dark:text-emerald-400 text-sm">Completed Orders — Delivered</h4>
                  <p className="text-[10px] text-cream-500 dark:text-slate-500">Successfully delivered to customer</p>
                </div>
                <span className="ml-auto px-3 py-1 rounded-full bg-emerald-500 text-white font-black text-xs shadow">{completedOrders.length}</span>
              </div>

              {completedOrders.length > 0 ? (
                <div className="space-y-4">
                  {completedOrders.map(o => (
                    <div key={o.id} className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800/60 space-y-3">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">✅</span>
                          <span className="font-bold text-emerald-800 dark:text-emerald-300 text-sm">{o.id}</span>
                          <span className="text-[10px] text-cream-500 dark:text-slate-500">{o.placedAt ? new Date(o.placedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-200 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">ORDER DELIVERED ✅</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <p className="font-bold text-cream-900 dark:text-slate-200">{o.customerName}</p>
                          <p className="text-cream-600 dark:text-slate-400">📞 {o.phone}</p>
                          <p className="text-cream-500 dark:text-slate-500 text-[10px]">📍 {o.city}, {o.state}</p>
                        </div>
                        <div>
                          <p className="font-black text-emerald-700 dark:text-emerald-400 text-base">₹{(o.totalAmount || 0).toLocaleString('en-IN')}</p>
                          <p className="text-cream-600 dark:text-slate-400">{(o.items || []).length} item(s)</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1 border-t border-emerald-200 dark:border-emerald-800/40">
                        <a href={storeCMS.getWhatsAppLinks(o).customerWhatsAppUrl} target="_blank" rel="noopener noreferrer"
                          className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[10px] hover:opacity-90 transition">
                          📄 Invoice
                        </a>
                        <button onClick={() => handleStatusUpdate(o.id, 'Order Placed', o)}
                          className="px-3 py-1 rounded-xl bg-cream-200 dark:bg-titanium-800 text-cream-700 dark:text-slate-300 font-bold text-[10px] hover:bg-amber-100 transition">
                          ↩ Reactivate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-cream-50 dark:bg-titanium-900 border border-gold-border/20 text-center text-cream-500 dark:text-slate-500 text-xs">
                  No delivered orders yet.
                </div>
              )}
            </div>

            {/* ── SECTION 3: CANCELLED ORDERS ── */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b-2 border-rose-400 dark:border-rose-700/60">
                <div className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center text-white font-bold text-sm shadow">❌</div>
                <div>
                  <h4 className="font-bold text-rose-700 dark:text-rose-400 text-sm">Cancelled Orders</h4>
                  <p className="text-[10px] text-cream-500 dark:text-slate-500">Payment not received or customer cancelled</p>
                </div>
                <span className="ml-auto px-3 py-1 rounded-full bg-rose-500 text-white font-black text-xs shadow">{cancelledOrders.length}</span>
              </div>

              {cancelledOrders.length > 0 ? (
                <div className="space-y-4">
                  {cancelledOrders.map(o => (
                    <div key={o.id} className="p-4 rounded-3xl bg-rose-50 dark:bg-rose-950/20 border border-rose-300 dark:border-rose-800/60 space-y-3 opacity-80">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">❌</span>
                          <span className="font-bold text-rose-800 dark:text-rose-300 text-sm">{o.id}</span>
                          <span className="text-[10px] text-cream-500 dark:text-slate-500">{o.placedAt ? new Date(o.placedAt).toLocaleString('en-IN', { day: 'numeric', month: 'short' }) : '—'}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-rose-200 dark:bg-rose-900/60 text-rose-800 dark:text-rose-300 font-bold text-[10px]">CANCELLED ❌</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div>
                          <p className="font-bold text-cream-900 dark:text-slate-200">{o.customerName}</p>
                          <p className="text-cream-600 dark:text-slate-400">📞 {o.phone}</p>
                        </div>
                        <div>
                          <p className="font-bold text-rose-700 dark:text-rose-400 text-sm">₹{(o.totalAmount || 0).toLocaleString('en-IN')}</p>
                          <p className="text-cream-500 dark:text-slate-500 text-[10px]">{o.paymentStatus || o.cancelReason || 'Cancelled'}</p>
                        </div>
                      </div>
                      <div className="flex gap-2 pt-1 border-t border-rose-200 dark:border-rose-800/40">
                        <a href={`https://wa.me/91${(o.phone || '').replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                          className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[10px] hover:opacity-90 transition">
                          📞 Contact Customer
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-3xl bg-cream-50 dark:bg-titanium-900 border border-gold-border/20 text-center text-cream-500 dark:text-slate-500 text-xs">
                  No cancelled orders. 🎉
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-3xl bg-cream-50 dark:bg-titanium-900 border border-gold-border/40 dark:border-titanium-800 space-y-4 font-mono text-xs">
          <h3 className="font-display font-bold text-xl text-cream-950 dark:text-slate-100">Store Settings & Owner PIN</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-cream-600 dark:text-slate-400 mb-1">Owner Security Passcode / PIN</label>
              <input type="text" value={settings.adminPin || '1234'}
                onChange={(e) => setSettings({ ...settings, adminPin: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-cream-600 dark:text-slate-400 mb-1">Contact Phone Number</label>
              <input type="text" value={settings.supportPhone}
                onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-cream-600 dark:text-slate-400 mb-1">Payment UPI ID</label>
              <input type="text" value={settings.paymentUpiId || ''}
                onChange={(e) => setSettings({ ...settings, paymentUpiId: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="block text-cream-600 dark:text-slate-400 mb-1">
                Razorpay Key ID <span className="text-amber-600 dark:text-emerald-accent font-bold">(Required for verified online payments)</span>
              </label>
              <input type="text" placeholder="rzp_live_XXXXXXXXXXXXXXXXXX" value={settings.razorpayKey || ''}
                onChange={(e) => setSettings({ ...settings, razorpayKey: e.target.value })} className={inputClass} />
              <p className="text-[11px] text-cream-500 dark:text-slate-500 mt-1">
                Get free key at <a href="https://razorpay.com" target="_blank" rel="noopener noreferrer" className="underline text-amber-600 dark:text-emerald-accent">razorpay.com</a> → Dashboard → Settings → API Keys → Generate Key
              </p>
            </div>
            <div>
              <label className="block text-cream-600 dark:text-slate-400 mb-1">Payment QR Image URL</label>
              <input type="text" value={settings.paymentQrImageUrl || '/payment-qr.png'}
                onChange={(e) => setSettings({ ...settings, paymentQrImageUrl: e.target.value })} className={inputClass} />
            </div>
          </div>
          <button type="submit" className="px-6 py-3 rounded-2xl bg-amber-600 dark:bg-emerald-accent text-white dark:text-titanium-950 font-bold">Save Settings</button>
        </form>
      )}

      {/* CUSTOMER INTENT & AUTOMATED WHATSAPP ALERTS TAB */}
      {activeTab === 'intents' && (
        <div className="space-y-6 font-mono text-xs">
          <div className="apple-glass-card p-6 rounded-3xl border shadow-xl space-y-4">
            <div className="flex justify-between items-center border-b border-gold-border/30 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-cream-950 dark:text-slate-100 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-600 dark:text-emerald-accent" />
                  Automated WhatsApp Alerts & Customer Intent Tracker
                </h3>
                <p className="text-xs text-cream-500 dark:text-slate-400 mt-0.5">
                  Tracks customer phone numbers, searched models (e.g. iPhone), and abandoned carts. Automatically generates 1-click WhatsApp alerts when new matching products arrive!
                </p>
              </div>
            </div>

            {/* Profiles list */}
            <div className="space-y-4">
              {Object.values(userIntentService.getProfiles()).map((prof, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-cream-50 dark:bg-titanium-950 border border-gold-border/40 dark:border-titanium-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:bg-emerald-500/10 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                        📱
                      </span>
                      <div>
                        <h4 className="font-bold text-cream-950 dark:text-slate-100 text-sm">
                          Customer Phone: +91 {prof.phone}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-mono">Last Active: {new Date(prof.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/91${prof.phone}?text=${encodeURIComponent(`Hi! We noticed your search on Balaji Mobile for ${prof.searches?.[0] || 'smartphones'}. Check out our newest stock here: http://localhost:3000/products`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-titanium-950 font-bold text-xs flex items-center gap-1.5 transition shadow-md"
                    >
                      <MessageSquare className="w-4 h-4" /> Send WhatsApp Alert
                    </a>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2 border-t border-gold-border/20 dark:border-titanium-800">
                    <div>
                      <span className="text-slate-500 font-bold block mb-1">Searched Models &amp; Keywords:</span>
                      <div className="flex flex-wrap gap-1">
                        {(prof.searches || []).length > 0 ? (
                          prof.searches.map((s, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-titanium-900 text-amber-800 dark:text-emerald-400 font-mono text-[11px]">
                              "{s}"
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 italic">No search history</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <span className="text-slate-500 font-bold block mb-1">Abandoned Cart / Wishlist Items:</span>
                      {(prof.cartItems || []).length > 0 ? (
                        prof.cartItems.map((c, cIdx) => (
                          <div key={cIdx} className="text-cream-900 dark:text-slate-200 font-medium text-[11px]">
                            🛒 {c.title} (₹{(c.price || 139900).toLocaleString('en-IN')})
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">No cart items</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
        </div>
      </div>

      {/* ADD / EDIT PHONE MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-start justify-center p-4 overflow-y-auto font-mono text-xs">
          <div className="bg-cream-100 dark:bg-titanium-950 border border-gold-border/60 dark:border-titanium-800 text-cream-950 dark:text-slate-100 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl my-8">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              {isSecondHandModal && <Recycle className="w-5 h-5 text-orange-500" />}
              {editingProductId ? `Edit ${isSecondHandModal ? 'Certified Pre-Owned' : ''} Phone` : `Add ${isSecondHandModal ? 'Certified Pre-Owned' : 'New'} Phone`}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-cream-600 dark:text-slate-400 font-bold text-xs mb-1">Phone Model Title *</label>
                  <input type="text" required placeholder="Phone Model Title" value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-cream-600 dark:text-slate-400 font-bold text-xs mb-1">Select Brand *</label>
                  <select value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} className={inputClass}>
                    {allBrands.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-cream-600 dark:text-slate-400 font-bold text-xs mb-1">Shop Category *</label>
                  <select value={productForm.category || categories[0]?.name || 'Flagship Titans'}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} className={inputClass}>
                    {categories.map(c => <option key={c.id || c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-cream-600 dark:text-slate-400 font-bold text-xs mb-1">Default RAM (e.g. 12GB)</label>
                  <input type="text" placeholder="RAM (e.g. 12GB)" value={productForm.ram}
                    onChange={(e) => setProductForm({ ...productForm, ram: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-cream-600 dark:text-slate-400 font-bold text-xs mb-1">Default Storage (ROM)</label>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      min="1"
                      placeholder="e.g. 256"
                      value={productForm.storage ? productForm.storage.replace(/GB$/i, '') : ''}
                      onChange={(e) => setProductForm({ ...productForm, storage: e.target.value ? e.target.value + 'GB' : '' })}
                      className={`${inputClass} pr-10`}
                    />
                    <span className="absolute right-3 text-cream-500 dark:text-slate-400 font-bold text-xs pointer-events-none">GB</span>
                  </div>
                </div>
                <div>
                  <label className="block text-cream-600 dark:text-slate-400 font-bold text-xs mb-1">Default Color Finish</label>
                  <input type="text" placeholder="Color Finish" value={productForm.color}
                    onChange={(e) => setProductForm({ ...productForm, color: e.target.value })} className={inputClass} />
                </div>
              </div>

              {/* Dynamic Multiple Color & RAM / ROM Storage Variants Builder */}
              <div className="p-5 rounded-2xl bg-cream-50 dark:bg-titanium-900 border-2 border-gold-border/60 dark:border-titanium-700 space-y-4 font-mono text-xs shadow-lg">
                <div className="flex items-center justify-between border-b border-gold-border/30 pb-3">
                  <span className="font-bold text-amber-700 dark:text-emerald-accent flex items-center gap-2 text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" /> MULTIPLE COLOR &amp; RAM / ROM STORAGE VARIANTS ({variantsList.length})
                  </span>
                  <span className="text-[10px] text-cream-600 dark:text-slate-400">
                    Fill Section 1, then click '+ Add Another Variant' to add 2nd, 3rd, 4th model variants!
                  </span>
                </div>

                {variantsList.map((variant, vIdx) => (
                  <div key={variant.id || vIdx} className="p-4 rounded-xl bg-white dark:bg-titanium-950 border border-gold-border/40 dark:border-titanium-800 space-y-3 relative shadow-sm">
                    <div className="flex items-center justify-between border-b border-gold-border/20 pb-2">
                      <span className="font-bold text-amber-600 dark:text-amber-400 text-xs">
                        📱 MODEL VARIANT #{vIdx + 1} {vIdx === 0 ? '(Default Primary Variant)' : ''}
                      </span>
                      {variantsList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVariantSection(vIdx)}
                          className="px-2 py-1 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20 text-[10px] font-bold flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" /> Remove Variant
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-cream-600 dark:text-slate-400 mb-1 font-bold">Color Finish *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Natural Titanium"
                          value={variant.color}
                          onChange={(e) => handleUpdateVariant(vIdx, 'color', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-cream-600 dark:text-slate-400 mb-1 font-bold">RAM Memory *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 12GB"
                          value={variant.ram}
                          onChange={(e) => handleUpdateVariant(vIdx, 'ram', e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-cream-600 dark:text-slate-400 mb-1 font-bold">Storage (ROM) *</label>
                        <div className="relative flex items-center">
                          <input
                            type="number"
                            min="1"
                            required
                            placeholder="e.g. 256"
                            value={variant.storage ? variant.storage.replace(/GB$/i, '') : ''}
                            onChange={(e) => handleUpdateVariant(vIdx, 'storage', e.target.value ? e.target.value + 'GB' : '')}
                            className={`${inputClass} pr-10`}
                          />
                          <span className="absolute right-3 text-cream-500 dark:text-slate-400 font-bold text-xs pointer-events-none">GB</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-cream-600 dark:text-slate-400 mb-1 font-bold">BM Sale Price (₹) *</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 84999"
                          value={variant.bmPrice}
                          onChange={(e) => handleUpdateVariant(vIdx, 'bmPrice', Number(e.target.value))}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-cream-600 dark:text-slate-400 mb-1 font-bold">Market Price (₹)</label>
                        <input
                          type="number"
                          placeholder="e.g. 99999"
                          value={variant.marketPrice}
                          onChange={(e) => handleUpdateVariant(vIdx, 'marketPrice', Number(e.target.value))}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className="block text-cream-600 dark:text-slate-400 mb-1 font-bold">Stock Count *</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 10"
                          value={variant.stock}
                          onChange={(e) => handleUpdateVariant(vIdx, 'stock', Number(e.target.value))}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-cream-600 dark:text-slate-400 mb-1 font-bold">
                        Variant Photos (Copy-Paste or URLs for {variant.color || 'this variant'})
                      </label>
                      <textarea
                        rows="2"
                        value={variant.imagesText || ''}
                        onChange={(e) => handleUpdateVariant(vIdx, 'imagesText', e.target.value)}
                        className={`${inputClass} text-[11px] font-mono`}
                        placeholder="Optional: Paste photo URLs or paste photos (Ctrl+V) specific to this color finish"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddVariantSection}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 hover:from-amber-500/30 hover:to-emerald-500/30 border border-gold-border/60 text-amber-700 dark:text-emerald-accent font-bold flex items-center justify-center gap-2 transition shadow-sm"
                >
                  <Plus className="w-4 h-4" /> + ADD 2ND / 3RD / 4TH COLOR &amp; RAM/ROM STORAGE VARIANT MODEL
                </button>
              </div>

              {/* Certified Pre-Owned Explicit Attributes */}
              {isSecondHandModal && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3 font-mono text-xs">
                  <span className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5 text-xs">
                    <Recycle className="w-4 h-4" /> CERTIFIED PRE-OWNED INSPECTION DETAILS
                  </span>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-cream-600 dark:text-slate-400 mb-1 font-bold">Battery Health % (Optional)</label>
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          min="1"
                          max="100"
                          placeholder="e.g. 92"
                          value={productForm.batteryHealth ? productForm.batteryHealth.replace(/[^0-9]/g, '') : ''}
                          onChange={(e) => setProductForm({ ...productForm, batteryHealth: e.target.value ? e.target.value + '%' : '' })}
                          className={`${inputClass} pr-8`}
                        />
                        <span className="absolute right-3 text-cream-500 dark:text-slate-400 font-bold text-xs pointer-events-none">%</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-cream-600 dark:text-slate-400 mb-1 font-bold">Device Age / How Old *</label>
                      <input type="text" placeholder="e.g. 6 Months Old" value={productForm.deviceAge || ''}
                        onChange={(e) => setProductForm({ ...productForm, deviceAge: e.target.value })} className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-cream-600 dark:text-slate-400 mb-1 font-bold">Phone Condition Grade *</label>
                      <select value={productForm.conditionBadge || 'Superb (9/10)'}
                        onChange={(e) => setProductForm({ ...productForm, conditionBadge: e.target.value })} className={inputClass}>
                        <option value="Like New (10/10)">Like New (10/10)</option>
                        <option value="Superb (9/10)">Superb (9/10)</option>
                        <option value="Very Good (8/10)">Very Good (8/10)</option>
                        <option value="Good (7/10)">Good (7/10)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-cream-600 dark:text-slate-400 mb-1 font-bold">Warranty Status *</label>
                      <input type="text" placeholder="e.g. In Brand Warranty (5 Months Left) OR 3 Months Shop Warranty" value={productForm.warrantyStatus || ''}
                        onChange={(e) => setProductForm({ ...productForm, warrantyStatus: e.target.value })} className={inputClass} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-cream-600 dark:text-slate-400 mb-1 font-bold">Invoice &amp; Bill Type *</label>
                      <select value={productForm.hasBill || 'Original Brand GST Invoice'}
                        onChange={(e) => setProductForm({ ...productForm, hasBill: e.target.value })} className={inputClass}>
                        <option value="Original Brand GST Invoice">1. Original Brand GST Invoice</option>
                        <option value="Pre-Owned Shop Bill (Balaji Mobile GST Invoice)">2. Pre-Owned Shop Bill (Balaji Mobile Invoice)</option>
                        <option value="No Bill Available">3. No Bill Available</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-cream-600 dark:text-slate-400 mb-1 font-bold">Original Box &amp; Accessories? *</label>
                      <select value={productForm.hasBox || 'Yes - Box & Cable Included'}
                        onChange={(e) => setProductForm({ ...productForm, hasBox: e.target.value })} className={inputClass}>
                        <option value="Yes - Box & Cable Included">Yes — Original Box &amp; Accessories</option>
                        <option value="No - Phone Only">No — Phone Only</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-cream-600 dark:text-slate-400 font-bold">Phone Inspection Notes &amp; Highlights *</label>
                <textarea rows="2" required placeholder="e.g. Flawless display, 89% Battery, tested 35-point quality check passed"
                  value={productForm.condition}
                  onChange={(e) => setProductForm({ ...productForm, condition: e.target.value })} className={inputClass} />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-cream-600 dark:text-slate-400 font-bold">Market Price (₹)</label>
                  <input type="number" required value={productForm.marketPrice}
                    onChange={(e) => setProductForm({ ...productForm, marketPrice: Number(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-cream-600 dark:text-slate-400 font-bold">BM Price (₹)</label>
                  <input type="number" required value={productForm.bmPrice}
                    onChange={(e) => setProductForm({ ...productForm, bmPrice: Number(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-cream-600 dark:text-slate-400 font-bold">Available Stock</label>
                  <input type="number" required value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })} className={inputClass} />
                </div>
              </div>

              {!isSecondHandModal && (
                <div className="flex gap-4 text-[11px]">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={productForm.isNewArrival}
                      onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })} className="accent-amber-600" />
                    <span>New Arrival</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={productForm.isFlashSale}
                      onChange={(e) => setProductForm({ ...productForm, isFlashSale: e.target.checked })} className="accent-red-600" />
                    <span>Flash Sale</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })} className="accent-emerald-600" />
                    <span>Featured</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={productForm.isTrending}
                      onChange={(e) => setProductForm({ ...productForm, isTrending: e.target.checked })} className="accent-emerald-600" />
                    <span>Trending</span>
                  </label>
                </div>
              )}

              {/* Photo Upload & Copy-Paste Zone */}
              <div className="space-y-2 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <label className="block text-amber-700 dark:text-emerald-accent font-bold">
                    📸 PHONE PHOTOS (COPY-PASTE PHOTO OR UPLOAD FILE)
                  </label>
                  <label htmlFor="image-file-upload" className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-700 dark:text-emerald-accent border border-amber-500/40 hover:bg-amber-500/30 cursor-pointer font-bold flex items-center gap-1">
                    📁 Select Photo Files
                  </label>
                  <input id="image-file-upload" type="file" multiple accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                </div>
                <textarea
                  rows="3"
                  value={productForm.imagesText || ''}
                  onPaste={handleImagePaste}
                  onChange={(e) => setProductForm({ ...productForm, imagesText: e.target.value })}
                  className={`${inputClass} text-[11px] font-mono`}
                  placeholder="✨ PASTE PHOTO HERE (Press Ctrl+V to paste copied image!) OR paste photo image URLs one per line"
                />
                <span className="text-[10px] text-cream-600 dark:text-slate-400 block">
                  💡 Tip: You can directly copy any image from your computer/phone and press Ctrl+V into this box, or click 'Select Photo Files'!
                </span>
              </div>

              {/* 360° Video Upload or Link */}
              <div className="space-y-2 p-4 rounded-2xl bg-cream-50 dark:bg-titanium-900 border border-gold-border/40 dark:border-titanium-800 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <label className="block text-amber-700 dark:text-emerald-accent font-bold">
                    🎥 360° VIDEO INSPECTION (UPLOAD VIDEO OR PASTE YOUTUBE / MP4 LINK)
                  </label>
                  <label htmlFor="video-file-upload" className="px-3 py-1.5 rounded-xl bg-cream-200 dark:bg-titanium-800 text-cream-950 dark:text-slate-200 border border-gold-border/40 hover:bg-cream-300 cursor-pointer font-bold flex items-center gap-1">
                    📹 Upload 360° Video
                  </label>
                  <input id="video-file-upload" type="file" accept="video/*" onChange={handleVideoFileUpload} className="hidden" />
                </div>
                <input
                  type="text"
                  placeholder="Paste 360° Video URL (MP4 / WebM / YouTube link)"
                  value={productForm.videoUrl || ''}
                  onChange={(e) => setProductForm({ ...productForm, videoUrl: e.target.value })}
                  className={inputClass}
                />
                <textarea
                  rows="2"
                  value={productForm.frames360Text || ''}
                  onChange={(e) => setProductForm({ ...productForm, frames360Text: e.target.value })}
                  className={`${inputClass} text-[11px] font-mono mt-1`}
                  placeholder="Optional: Or paste 360° rotation image URLs (one per line)"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className={`flex-1 py-3 rounded-xl font-bold ${isSecondHandModal ? 'bg-orange-500 text-white' : 'bg-amber-600 dark:bg-emerald-accent text-white dark:text-titanium-950'}`}>
                  Save Phone Details
                </button>
                <button type="button" onClick={() => setShowProductModal(false)} className="px-6 py-3 rounded-xl bg-cream-200 dark:bg-titanium-900 text-cream-900 dark:text-slate-200">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── INTERACTIVE PAYMENT VERIFICATION / REJECTION MODAL ── */}
      {verifyModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto font-mono text-xs">
          <div className="bg-cream-100 dark:bg-titanium-950 border border-gold-border/60 dark:border-titanium-800 text-cream-950 dark:text-slate-100 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl my-8 relative">
            <button 
              onClick={() => setVerifyModalOrder(null)} 
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-cream-200 dark:hover:bg-titanium-800 text-cream-700 dark:text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 border-b border-gold-border/30 pb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${
                verifyActionType === 'APPROVE' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}>
                {verifyActionType === 'APPROVE' ? <Check className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 dark:text-emerald-accent">
                  CUSTOMER NOTIFICATION SYSTEM
                </span>
                <h3 className="font-display font-bold text-lg text-cream-950 dark:text-slate-100">
                  {verifyActionType === 'APPROVE' ? 'Confirm Payment & Set Delivery Date' : 'Reject Payment & Cancel Order'}
                </h3>
              </div>
            </div>

            {/* Order Details Brief */}
            <div className="p-4 rounded-2xl bg-cream-50 dark:bg-titanium-900 border border-gold-border/40 text-xs space-y-1">
              <div className="flex justify-between font-bold">
                <span>Order ID: <span className="text-amber-700 dark:text-emerald-accent">{verifyModalOrder.id}</span></span>
                <span className="text-amber-800 dark:text-emerald-accent font-black">₹{(verifyModalOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
              </div>
              <p>Customer: <strong>{verifyModalOrder.customerName}</strong> ({verifyModalOrder.phone})</p>
              {verifyModalOrder.email && <p>Email: <strong>{verifyModalOrder.email}</strong></p>}
            </div>

            <form onSubmit={handleConfirmVerificationModal} className="space-y-4">
              {verifyActionType === 'APPROVE' ? (
                /* APPROVE / YES FLOW: Set Delivery Date */
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 text-xs leading-relaxed">
                    ✅ <strong>Confirming Payment Received:</strong><br />
                    Setting expected delivery date will update order status and automatically dispatch WhatsApp &amp; Email notifications to customer <strong>{verifyModalOrder.customerName}</strong>.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cream-900 dark:text-slate-200 mb-1">
                      Set Expected Delivery Date (Sent to Customer):
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunday, 26 July 2026 or 2-3 Business Days"
                      value={deliveryDateInput}
                      onChange={(e) => setDeliveryDateInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white dark:bg-titanium-900 border border-amber-300 dark:border-titanium-700 text-cream-950 dark:text-slate-100 text-sm font-bold outline-none focus:border-emerald-500"
                    />
                    <p className="text-[11px] text-cream-500 dark:text-slate-500 mt-1">
                      Owner sets custom delivery date. Customer will receive this date on WhatsApp &amp; Email.
                    </p>
                  </div>
                </div>
              ) : (
                /* REJECT / NO FLOW: Set Cancellation Reason */
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-300 text-xs leading-relaxed">
                    ❌ <strong>Cancelling Order (Payment Not Received):</strong><br />
                    Customer will receive immediate WhatsApp &amp; Email alerts explaining why payment failed, with instructions for bank refund / re-ordering.
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-cream-900 dark:text-slate-200 mb-1">
                      Cancellation Reason (Sent to Customer):
                    </label>
                    <textarea
                      rows="3"
                      required
                      value={rejectionReasonInput}
                      onChange={(e) => setRejectionReasonInput(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-white dark:bg-titanium-900 border border-rose-300 dark:border-titanium-700 text-cream-950 dark:text-slate-100 text-xs outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setVerifyModalOrder(null)}
                  className="flex-1 py-3 rounded-2xl bg-cream-200 dark:bg-titanium-900 text-cream-800 dark:text-slate-300 font-bold hover:bg-cream-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 py-3 rounded-2xl font-bold text-white transition shadow-lg flex items-center justify-center gap-2 ${
                    verifyActionType === 'APPROVE'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-700 hover:opacity-90'
                      : 'bg-gradient-to-r from-rose-500 to-rose-700 hover:opacity-90'
                  }`}
                >
                  {verifyActionType === 'APPROVE' ? (
                    <><Check className="w-4 h-4" /> Confirm &amp; Notify Customer</>
                  ) : (
                    <><AlertTriangle className="w-4 h-4" /> Cancel Order &amp; Notify Customer</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
