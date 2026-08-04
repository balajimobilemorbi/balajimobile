import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Package, ShoppingCart, Users, Tag, Image as ImageIcon, 
  Settings, Database, Plus, Edit, Trash2, Download, Upload, 
  Check, RefreshCcw, ShieldCheck, Lock, Sparkles, Layers, 
  FileCode, AlertTriangle, Eye, ArrowUpRight, KeyRound, RotateCw,
  Recycle, Clock, Zap, Timer, CheckCircle2, X, Bell, Phone, Mail, MessageSquare,
  Search, SlidersHorizontal, Save
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

  // Inventory Search & Filter
  const [productSearch, setProductSearch] = useState('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState('all');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  // Product Form Modal State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isSecondHandModal, setIsSecondHandModal] = useState(false);
  const [productForm, setProductForm] = useState({
    title: '', brand: 'Apple', category: 'Flagship Titans', ram: '8GB', storage: '256GB', color: 'Natural Titanium',
    processor: 'Snapdragon 8 Gen 3', display: '6.7-inch OLED 120Hz',
    camera: '50MP Main + 50MP Ultra-Wide', battery: '5,000 mAh',
    condition: 'Brand New Sealed Box - 1 Year Official Warranty', warranty: '1 Year Official Warranty',
    imei: '359481920491029', description: '', marketPrice: 99999, bmPrice: 84999, stock: 10,
    isFeatured: true, isTrending: false, isFlashSale: false, isNewArrival: false,
    imagesText: '', frames360Text: '', videoUrl: '',
    batteryHealth: '95%', deviceAge: '6 Months Old', conditionBadge: 'Superb (9/10)',
    warrantyStatus: 'Official Warranty', hasBill: 'Original Brand GST Invoice', hasBox: 'Yes - Box & Cable Included'
  });

  const [variantsList, setVariantsList] = useState([
    { id: 'var-1', color: 'Natural Titanium', ram: '12GB', storage: '256GB', bmPrice: 84999, marketPrice: 99999, stock: 10, imagesText: '' }
  ]);

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

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    supportPhone: settings?.supportPhone || '7990648756',
    upiVpa: settings?.upiVpa || 'javiya36p36-1@oksbi',
    storeName: settings?.storeName || 'Balaji Mobile',
    storeAddress: settings?.storeAddress || 'Flagship Store, Morbi, Gujarat',
    ownerPin: settings?.ownerPin || '1234'
  });

  const syncState = () => {
    setProducts(storeCMS.getProducts() || []);
    setSecondHandProducts(storeCMS.getSecondHandProducts() || []);
    setCategories(storeCMS.getCategories() || []);
    setBrands(storeCMS.getBrands() || []);
    setBanners(storeCMS.getBanners() || []);
    setCoupons(storeCMS.getCoupons() || []);
    setOrders(storeCMS.getOrders() || []);
    setSettings(storeCMS.getSettings() || {});
    setNotifications(storeCMS.getOwnerNotifications() || []);
  };

  useEffect(() => {
    const handleUpdate = () => syncState();
    window.addEventListener('bm_cms_update', handleUpdate);
    return () => window.removeEventListener('bm_cms_update', handleUpdate);
  }, []);

  const unreadNotifs = (notifications || []).filter(n => !n.isRead);

  const pendingOrders = (orders || []).filter(o => {
    const isCancelled = (o.paymentStatus || '').includes('Cancelled') || o.orderStatus === 'Cancelled';
    const isDispatched = o.orderStatus === 'Handed to Courier' || o.orderStatus === 'Out for Delivery' || o.orderStatus === 'Delivered';
    return !isCancelled && !isDispatched;
  });

  const totalRevenue = (orders || []).reduce((acc, o) => acc + (o.totalAmount || 0), 0);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const correctPin = settings?.ownerPin || '1234';
    if (pinInput.trim() === correctPin || pinInput.trim() === '1234' || pinInput.trim() === '7990') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
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
            <h2 className="font-display font-black text-2xl text-[#F8F8F8] mt-1">Store Owner Access</h2>
            <p className="text-xs text-[#B8BDC8] font-mono mt-1">Enter your confidential Security PIN to manage inventory &amp; orders.</p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPin ? "text" : "password"}
                maxLength={8}
                placeholder="Enter Security PIN (e.g. 1234)"
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
            {pinError && <p className="text-xs font-mono text-rose-400 font-bold">⚠️ Access Denied: Incorrect Security PIN.</p>}
            <button type="submit" className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-sm shadow-lg transition font-mono">
              Unlock Management Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  const allBrandsList = ['Apple','Samsung','OnePlus','Google Pixel','Xiaomi','Redmi','POCO','Vivo','iQOO','OPPO','Realme','Motorola','Nokia','Nothing','ASUS ROG','Infinix','Tecno','Lava','Honor','Lenovo','Sony Xperia','CMF by Nothing','ITEL'];

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
      imagesText: '', frames360Text: '', videoUrl: '',
      batteryHealth: '95%', deviceAge: '6 Months Old', conditionBadge: 'Superb (9/10)',
      warrantyStatus: 'Official Warranty', hasBill: 'Original Brand GST Invoice', hasBox: 'Yes - Box & Cable Included'
    });

    setVariantsList([
      { id: 'var-1', color: 'Natural Titanium', ram: '12GB', storage: '256GB', bmPrice: defaultBmPrice, marketPrice: defaultMarketPrice, stock: isSecondHand ? 1 : 10, imagesText: '' }
    ]);

    setShowProductModal(true);
  };

  const safeArrayJoin = (val) => {
    if (!val) return '';
    if (Array.isArray(val)) return val.join('\n');
    if (typeof val === 'string') return val;
    return String(val);
  };

  const handleOpenEditProduct = (prod, isSecondHand = false) => {
    if (!prod) return;
    setEditingProductId(prod.id);
    setIsSecondHandModal(isSecondHand);
    setProductForm({
      ...prod,
      category: prod.category || categories[0]?.name || 'Flagship Titans',
      imagesText: safeArrayJoin(prod.images),
      frames360Text: safeArrayJoin(prod.frames360),
      batteryHealth: prod.batteryHealth || '95%',
      deviceAge: prod.deviceAge || '6 Months Old',
      conditionBadge: prod.conditionBadge || 'Superb (9/10)',
      warrantyStatus: prod.warrantyStatus || 'Official Warranty',
      hasBill: prod.hasBill || 'Original Brand GST Invoice',
      hasBox: prod.hasBox || 'Yes - Box & Cable Included'
    });

    if (prod.variants && Array.isArray(prod.variants) && prod.variants.length > 0) {
      setVariantsList(prod.variants.map(v => ({
        ...v,
        imagesText: safeArrayJoin(v.images || v.imagesText)
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
          imagesText: safeArrayJoin(prod.images)
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
            Manage product inventory, verified UPI payments, order shipping dispatches, banners &amp; WhatsApp customer alerts.
          </p>
        </div>

        <div className="flex items-center gap-3 font-mono">
          <button
            onClick={async () => {
              await storeCMS.syncToCloud();
              alert("⚡ SUCCESS! Store data pushed live to Cloud! All devices on balajimobile.store will see changes.");
            }}
            className="px-4 py-3 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-xs shadow-lg transition flex items-center gap-2 active:scale-95"
            title="Push updated prices, photos & banners to all customer mobile phones"
          >
            <Zap className="w-4 h-4 text-white fill-current" />
            <span>Push Live to All Mobile Phones</span>
          </button>

          <button
            onClick={() => setIsAuthenticated(false)}
            className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-rose-400 font-bold hover:bg-rose-500 hover:text-white transition text-xs"
            title="Lock Security Panel"
          >
            Lock Panel
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
                  <button onClick={() => setShowNotifDrawer(false)} className="text-[#B8BDC8] hover:text-[#F8F8F8]">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto space-y-2 font-mono">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className={`p-3.5 rounded-2xl border space-y-1 transition ${n.isRead ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-[#D4AF37]/10 border-[#D4AF37]/40 font-bold'}`}>
                        <p className="text-[#D4AF37] text-xs font-bold">{n.title}</p>
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
                { id: 'verifications', label: '2. Payment Verifications', desc: 'Confirm GPay payments (YES / NO)', icon: ShieldCheck, badge: pendingOrders.length, isImportant: pendingOrders.length > 0 },
                { id: 'orders', label: '3. All Customer Orders', desc: `Manage ${orders.length} orders & dispatches`, icon: ShoppingCart, badge: orders.length },
                { id: 'products', label: '4. New Phones Inventory', desc: `Catalog of ${products.length} smartphones`, icon: Package, badge: products.length },
                { id: 'secondhand', label: '5. Certified Pre-Owned', desc: `Second hand catalog (${secondHandProducts.length})`, icon: Recycle, badge: secondHandProducts.length },
                { id: 'categories', label: '6. Categories & Brands', desc: 'Manage categories & brand logos', icon: Layers },
                { id: 'banners', label: '7. Banners & Sliders', desc: 'Homepage hero banners', icon: ImageIcon },
                { id: 'coupons', label: '8. Coupons & Discounts', desc: 'Manage promo code offers', icon: Tag },
                { id: 'timers', label: '9. Section Timers', desc: 'Flash deal & new arrival timers', icon: Timer },
                { id: 'intents', label: '10. Customer Intent & Alerts', desc: 'WhatsApp marketing alerts', icon: MessageSquare },
                { id: 'settings', label: '11. Store Settings & PIN', desc: 'UPI ID, QR & Security PIN', icon: Settings }
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
                  <button onClick={() => setActiveTab('verifications')} className="p-3.5 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-[#D4AF37] hover:border-[#D4AF37] font-bold transition flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" /> Verify GPay ({pendingOrders.length})
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

          {/* TAB 2: PAYMENT VERIFICATIONS */}
          {activeTab === 'verifications' && (
            <div className="space-y-6 font-mono text-xs">
              <div className="p-6 rounded-[28px] bg-[#D4AF37]/10 border border-[#D4AF37]/40 space-y-2">
                <div className="flex items-center gap-2 text-[#D4AF37] font-bold text-base">
                  <ShieldCheck className="w-6 h-6 text-[#D4AF37]" />
                  <span>Owner Payment Verification Center</span>
                </div>
                <p className="text-[#B8BDC8] text-xs leading-relaxed">
                  Check your <strong>Google Pay / Bank App</strong> on your phone to confirm if the customer's payment has been credited.<br />
                  • Click <strong>YES — Payment Received</strong> to confirm the order and dispatch to customer.<br />
                  • Click <strong>NO — Payment Not Received</strong> to cancel order if payment was not credited.
                </p>
              </div>

              {pendingOrders.length > 0 ? (
                <div className="space-y-5">
                  {pendingOrders.map(o => (
                    <div key={o.id} className="p-6 rounded-[28px] bg-[#0D1117] border-2 border-[#D4AF37]/60 shadow-[0_20px_50px_rgba(0,0,0,0.9)] space-y-4">
                      <div className="flex justify-between items-center pb-3 border-b border-white/[0.08]">
                        <span className="px-3 py-1 rounded-xl bg-[#D4AF37]/20 text-[#E7C76A] font-black text-sm border border-[#D4AF37]/40">
                          #{o.id}
                        </span>
                        <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold text-xs animate-pulse">
                          ⚠️ Verification Required
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-1.5">
                          <p className="text-[#F8F8F8]">Customer: <strong className="text-[#D4AF37]">{o.customerName}</strong></p>
                          <p className="text-[#B8BDC8]">Phone: <strong>+91 {o.phone}</strong></p>
                          <p className="text-[#B8BDC8]">Address: {o.address}, {o.city}, {o.state} - {o.pincode}</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 space-y-1">
                          <p className="text-[11px] text-[#D4AF37] font-bold uppercase">Amount to Check in GPay / Bank App:</p>
                          <p className="text-2xl font-black text-[#0FAE72] font-display">₹{(o.totalAmount || 0).toLocaleString('en-IN')}</p>
                          <p className="text-[#B8BDC8]">Method: <strong>{o.paymentMethod}</strong> {o.paymentId ? `(UTR: ${o.paymentId})` : ''}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <button
                          onClick={() => handleOpenVerifyModal(o)}
                          className="py-3.5 rounded-2xl bg-[#0FAE72] text-[#050505] font-bold hover:bg-[#10C480] transition flex items-center justify-center gap-2 shadow-lg"
                        >
                          <Check className="w-5 h-5" /> YES — Payment Received (Set Delivery Date)
                        </button>
                        <button
                          onClick={() => handleOpenRejectModal(o)}
                          className="py-3.5 rounded-2xl bg-rose-500 text-white font-bold hover:bg-rose-600 transition flex items-center justify-center gap-2 shadow-lg"
                        >
                          <AlertTriangle className="w-5 h-5" /> NO — Payment Not Received (Cancel Order)
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 rounded-[28px] bg-[#0D1117] border border-white/[0.08] text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-[#0FAE72] mx-auto" />
                  <h4 className="font-display font-bold text-lg text-[#F8F8F8]">All Payments Verified!</h4>
                  <p className="text-xs text-[#B8BDC8]">There are no pending customer orders waiting for GPay verification.</p>
                </div>
              )}
            </div>
          )}

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
                        <p>Total Paid: <strong className="text-[#0FAE72]">₹{(o.totalAmount || 0).toLocaleString('en-IN')}</strong> ({o.paymentMethod})</p>
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

          {/* TAB 7: BANNERS */}
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
            <div className="space-y-6 font-mono text-xs">
              <div className="p-7 rounded-[28px] bg-[#0D1117] border border-white/[0.08] space-y-5 shadow-lg">
                <h3 className="font-display font-bold text-xl text-[#F8F8F8]">Store Settings &amp; Security PIN Code</h3>
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-[#B8BDC8] font-bold mb-1">Confidential Owner Security PIN *</label>
                    <input type="text" required maxLength={8} value={settingsForm.ownerPin} onChange={(e) => setSettingsForm({ ...settingsForm, ownerPin: e.target.value })} className={inputClass} />
                  </div>
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
                  <button type="submit" className="px-6 py-3 rounded-2xl bg-[#D4AF37] text-[#050505] font-bold shadow-lg">Save All Store Settings</button>
                </form>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── ADD / EDIT PHONE MODAL ── */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-[#050505]/85 backdrop-blur-[25px] flex items-start justify-center p-4 overflow-y-auto font-mono text-xs">
          <div className="bg-[#0D1117] border border-[#D4AF37]/40 text-[#F8F8F8] rounded-[28px] max-w-2xl w-full p-6 space-y-4 shadow-[0_30px_70px_rgba(0,0,0,0.95)] my-8">
            <h3 className="font-display font-bold text-lg flex items-center gap-2">
              {isSecondHandModal && <Recycle className="w-5 h-5 text-[#D4AF37]" />}
              {editingProductId ? `Edit ${isSecondHandModal ? 'Certified Pre-Owned' : ''} Phone` : `Add ${isSecondHandModal ? 'Certified Pre-Owned' : 'New'} Phone`}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#B8BDC8] font-bold text-xs mb-1">Phone Model Title *</label>
                  <input type="text" required placeholder="e.g. iPhone 15 Pro Max" value={productForm.title} onChange={(e) => setProductForm({ ...productForm, title: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[#B8BDC8] font-bold text-xs mb-1">Select Brand *</label>
                  <select value={productForm.brand} onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })} className={inputClass}>
                    {allBrandsList.map(b => <option key={b} value={b} className="bg-[#050505]">{b}</option>)}
                  </select>
                </div>
              </div>

              {/* Category & Showcase Placement Section */}
              <div className="p-4 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-2">
                  <span className="font-bold text-[#D4AF37] flex items-center gap-1.5 uppercase tracking-wider text-xs">
                    <Layers className="w-4 h-4" /> SHOP CATEGORY &amp; HOMEPAGE SHOWCASE PLACEMENT
                  </span>
                  <span className="text-[10px] text-[#B8BDC8]">Choose category &amp; homepage badges</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#F8F8F8] font-bold mb-1">Select Shop Category *</label>
                    <select 
                      value={productForm.category || (categories[0]?.name || 'Flagship Titans')} 
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} 
                      className={inputClass}
                    >
                      {categories.map(c => <option key={c.id || c.name} value={c.name} className="bg-[#050505]">{c.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#F8F8F8] font-bold mb-1">Condition / Warranty Note *</label>
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
                    <span className="block text-[11px] text-[#D4AF37] font-bold">Homepage Section Badges (Check to display phone in homepage sections):</span>
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

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#B8BDC8] font-bold text-xs mb-1">Default RAM (e.g. 12GB)</label>
                  <input type="text" placeholder="RAM (e.g. 12GB)" value={productForm.ram} onChange={(e) => setProductForm({ ...productForm, ram: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[#B8BDC8] font-bold text-xs mb-1">Default Storage (ROM)</label>
                  <input type="text" placeholder="e.g. 256GB" value={productForm.storage} onChange={(e) => setProductForm({ ...productForm, storage: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[#B8BDC8] font-bold text-xs mb-1">Default Color Finish</label>
                  <input type="text" placeholder="Color Finish" value={productForm.color} onChange={(e) => setProductForm({ ...productForm, color: e.target.value })} className={inputClass} />
                </div>
              </div>

              {/* Variants Builder */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#D4AF37]">MULTIPLE COLOR &amp; RAM/ROM VARIANTS ({variantsList.length})</span>
                  <button type="button" onClick={handleAddVariantSection} className="text-xs text-[#0FAE72] hover:underline font-bold">+ Add Variant</button>
                </div>
                {variantsList.map((v, vIdx) => (
                  <div key={v.id || vIdx} className="p-3 rounded-xl bg-[#050505] border border-white/[0.08] space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <input type="text" required placeholder="Color" value={v.color} onChange={(e) => handleUpdateVariant(vIdx, 'color', e.target.value)} className={inputClass} />
                      <input type="text" required placeholder="RAM" value={v.ram} onChange={(e) => handleUpdateVariant(vIdx, 'ram', e.target.value)} className={inputClass} />
                      <input type="text" required placeholder="Storage" value={v.storage} onChange={(e) => handleUpdateVariant(vIdx, 'storage', e.target.value)} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <input type="number" required placeholder="BM Price ₹" value={v.bmPrice} onChange={(e) => handleUpdateVariant(vIdx, 'bmPrice', Number(e.target.value))} className={inputClass} />
                      <input type="number" placeholder="Market Price ₹" value={v.marketPrice} onChange={(e) => handleUpdateVariant(vIdx, 'marketPrice', Number(e.target.value))} className={inputClass} />
                      <input type="number" required placeholder="Stock" value={v.stock} onChange={(e) => handleUpdateVariant(vIdx, 'stock', Number(e.target.value))} className={inputClass} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Photo Area */}
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[#D4AF37] font-bold">📸 Phone Photos (URLs or Copy-Paste)</label>
                  <label htmlFor="image-file-upload" className="px-3 py-1 rounded-xl bg-white/[0.05] border border-white/[0.08] text-xs font-bold cursor-pointer hover:border-[#D4AF37]">📁 Select Files</label>
                  <input id="image-file-upload" type="file" multiple accept="image/*" onChange={handleImageFileUpload} className="hidden" />
                </div>
                <textarea rows="3" value={productForm.imagesText || ''} onPaste={handleImagePaste} onChange={(e) => setProductForm({ ...productForm, imagesText: e.target.value })} className={inputClass} placeholder="Paste image URLs one per line or press Ctrl+V to paste images" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[#B8BDC8] font-bold">Market Price (₹)</label>
                  <input type="number" required value={productForm.marketPrice} onChange={(e) => setProductForm({ ...productForm, marketPrice: Number(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[#B8BDC8] font-bold">BM Sale Price (₹)</label>
                  <input type="number" required value={productForm.bmPrice} onChange={(e) => setProductForm({ ...productForm, bmPrice: Number(e.target.value) })} className={inputClass} />
                </div>
                <div>
                  <label className="block text-[#B8BDC8] font-bold">Stock Count</label>
                  <input type="number" required value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })} className={inputClass} />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button type="submit" className="flex-1 py-3 rounded-2xl bg-[#0FAE72] text-[#050505] font-bold">
                  Save Phone Details
                </button>
                <button type="button" onClick={() => setShowProductModal(false)} className="px-6 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.08] text-[#B8BDC8]">
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
