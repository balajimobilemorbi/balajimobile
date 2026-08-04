import {
  INITIAL_PRODUCTS,
  INITIAL_SECONDHAND_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BRANDS,
  INITIAL_HERO_BANNERS,
  INITIAL_COUPONS,
  INITIAL_BLOGS,
  INITIAL_TESTIMONIALS,
  INITIAL_STORE_LOCATIONS,
  INITIAL_SETTINGS
} from '../data/seedData';
import { EMBEDDED_PAYMENT_QR, EMBEDDED_BM_LOGO } from '../assets/embeddedAssets';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEYS = {
  PRODUCTS: 'bm_products_v4',
  SECONDHAND: 'bm_secondhand_v4',
  CATEGORIES: 'bm_categories_v4',
  BRANDS: 'bm_brands_v4',
  BANNERS: 'bm_banners_v4',
  COUPONS: 'bm_coupons_v4',
  BLOGS: 'bm_blogs_v4',
  TESTIMONIALS: 'bm_testimonials_v4',
  LOCATIONS: 'bm_locations_v4',
  SETTINGS: 'bm_settings_v4',
  ORDERS: 'bm_orders_v4',
  USED_UTRS: 'bm_used_utrs_v4',
  CART: 'bm_cart_v4',
  WISHLIST: 'bm_wishlist_v4',
  COMPARE: 'bm_compare_v4',
  REVIEWS: 'bm_reviews_v4',
  REWARD_POINTS: 'bm_rewards_v4',
  USER_SESSION: 'bm_user_session_v4',
  CLOUD_SYNC_TIMESTAMP: 'bm_cloud_ts_v4'
};

// Default settings with EMBEDDED QR code so it NEVER fails or 404s on any device!
const DEFAULT_SETTINGS_WITH_EMBEDDED = {
  ...INITIAL_SETTINGS,
  paymentQrImageUrl: EMBEDDED_PAYMENT_QR,
  storeLogoUrl: EMBEDDED_BM_LOGO
};

const getLocal = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
};

const setLocal = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('bm_cms_update'));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
};

const getUserVaultKey = (user) => {
  if (!user) return null;
  const rawId = (user.email || user.phone || '').toLowerCase().replace(/[^a-z0-9]/g, '_');
  return rawId ? `bm_user_vault_${rawId}` : null;
};

// REALTIME CLOUD STORAGE ENGINE FOR LIVE CROSS-DEVICE SYNC (Laptop ↔ Mobile ↔ Netlify)
const DYNAMIC_RELAY_KEY = 'bm_cloud_relay_active_url';
const DEFAULT_CLOUD_RELAY_URL = 'https://jsonblob.com/api/jsonBlob/019fcbf9-5a79-7894-8c35-3352a420ae7b';

const getActiveCloudRelayUrls = () => {
  const customUrl = localStorage.getItem(DYNAMIC_RELAY_KEY);
  const urls = [
    '/.netlify/functions/store-sync',
    '/api/store-sync',
    customUrl,
    DEFAULT_CLOUD_RELAY_URL
  ].filter(Boolean);
  return [...new Set(urls)];
};

let isSyncingWithCloud = false;

export const storeCMS = {
  // Initialize Supabase Realtime WebSockets & Database listener
  initSupabaseRealtimeSync: () => {
    // 1. Same-Device Multi-Tab Broadcast Channel
    if (typeof BroadcastChannel !== 'undefined') {
      try {
        const bc = new BroadcastChannel('bm_store_channel');
        bc.onmessage = (event) => {
          if (event.data?.type === 'STORE_UPDATE' && event.data?.payload) {
            storeCMS.applyCloudPayload(event.data.payload);
          }
        };
      } catch (e) {}
    }

    // 2. Supabase Realtime WebSocket Channel & Postgres DB Listener
    if (isSupabaseConfigured && supabase) {
      try {
        supabase.channel('bm_realtime_store')
          .on('broadcast', { event: 'STORE_UPDATE' }, (response) => {
            console.log('⚡ [SUPABASE REALTIME BROADCAST] Update received!', response);
            if (response.payload) {
              storeCMS.applyCloudPayload(response.payload);
            }
          })
          .on('postgres_changes', { event: '*', schema: 'public', table: 'store_data' }, (payload) => {
            console.log('⚡ [SUPABASE POSTGRES DB CHANGE] Table updated!', payload);
            if (payload.new && payload.new.payload) {
              storeCMS.applyCloudPayload(payload.new.payload);
            }
          })
          .subscribe();
      } catch (e) {
        console.warn('Supabase Realtime subscription error:', e);
      }
    }
  },

  // Apply incoming Cloud Snapshot payload and refresh UI
  applyCloudPayload: (rawPayload) => {
    const payload = rawPayload?.value || rawPayload?.payload || rawPayload;
    if (!payload || !Array.isArray(payload.products)) return;

    const validProducts = payload.products.filter(p => p && p.id && p.title);
    if (validProducts.length === 0) return;

    const localTs = localStorage.getItem(STORAGE_KEYS.CLOUD_SYNC_TIMESTAMP) || '';
    if (!localTs || (payload.updatedAt && payload.updatedAt >= localTs)) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(validProducts));
      if (Array.isArray(payload.secondHandProducts)) {
        const validSecondHand = payload.secondHandProducts.filter(p => p && p.id && p.title);
        localStorage.setItem(STORAGE_KEYS.SECONDHAND, JSON.stringify(validSecondHand));
      }
      if (payload.settings) {
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(payload.settings));
      }
      if (Array.isArray(payload.orders)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(payload.orders));
      }
      if (payload.updatedAt) {
        localStorage.setItem(STORAGE_KEYS.CLOUD_SYNC_TIMESTAMP, payload.updatedAt);
      }

      // Trigger instant UI re-render on all open devices
      window.dispatchEvent(new CustomEvent('bm_cms_update', { detail: { source: 'cloud' } }));
    }
  },

  // Helper to provision a fresh JSONBlob endpoint if active URLs are down/404
  provisionNewCloudRelay: async (payload) => {
    try {
      const res = await fetch('https://jsonblob.com/api/jsonBlob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok || res.status === 201) {
        const loc = res.headers.get('location');
        if (loc) {
          const newUrl = loc.startsWith('http') ? loc : `https://jsonblob.com${loc}`;
          localStorage.setItem(DYNAMIC_RELAY_KEY, newUrl);
          console.log('⚡ Auto-provisioned fresh Cloud Relay:', newUrl);
          return newUrl;
        }
      }
    } catch (e) {
      console.warn('Cloud relay auto-provision error:', e);
    }
    return null;
  },

  // Sync all local data to Supabase DB & global cloud REST API so any mobile phone/tablet sees changes instantly
  syncToCloud: async () => {
    if (isSyncingWithCloud) return;
    isSyncingWithCloud = true;
    try {
      const payload = {
        products: storeCMS.getProducts(),
        secondHandProducts: storeCMS.getSecondHandProducts(),
        settings: storeCMS.getSettings(),
        orders: storeCMS.getOrders(),
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem(STORAGE_KEYS.CLOUD_SYNC_TIMESTAMP, payload.updatedAt);
      
      // 1. BroadcastChannel for same-device multi-tab
      if (typeof BroadcastChannel !== 'undefined') {
        try {
          const bc = new BroadcastChannel('bm_store_channel');
          bc.postMessage({ type: 'STORE_UPDATE', payload });
        } catch (e) {}
      }

      // 2. Supabase Realtime & DB Table Push (If configured)
      if (isSupabaseConfigured && supabase) {
        try {
          supabase.channel('bm_realtime_store').send({
            type: 'broadcast',
            event: 'STORE_UPDATE',
            payload
          });

          supabase.from('store_data').upsert({
            id: 'main',
            payload,
            updated_at: new Date().toISOString()
          }).then(({ error }) => {
            if (!error) console.log('✅ Store CMS saved to Supabase Postgres DB!');
          });
        } catch (e) {}
      }

      // 3. Push to Shared Public Cloud Relays
      const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' };
      const urls = getActiveCloudRelayUrls();
      let successCount = 0;

      for (const url of urls) {
        try {
          const res = await fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(payload)
          }).catch(() => null);

          if (res && res.ok) {
            successCount++;
          }
        } catch (e) {}
      }

      // If no endpoint accepted the PUT (e.g. 404), provision a new cloud relay!
      if (successCount === 0) {
        await storeCMS.provisionNewCloudRelay(payload);
      }

      console.log('✅ Live Store CMS Pushed to Global Shared Cloud Relays!');
    } catch (e) {
      console.warn('Cloud sync push warning:', e);
    } finally {
      isSyncingWithCloud = false;
    }
  },

  // Pull latest cloud snapshot when any user/friend opens the website on Netlify or Mobile
  pullFromCloud: async () => {
    try {
      // 1. Try Supabase DB First (If configured with valid JWT)
      if (isSupabaseConfigured && supabase) {
        try {
          const { data } = await supabase.from('store_data').select('payload').eq('id', 'main').single();
          if (data && data.payload) {
            storeCMS.applyCloudPayload(data.payload);
            return;
          }
        } catch (e) {}
      }

      // 2. Fallback to Shared Cloud Relays
      const urls = getActiveCloudRelayUrls();
      for (const url of urls) {
        try {
          const res = await fetch(url, {
            headers: { 'Accept': 'application/json' }
          }).catch(() => null);

          if (res && res.ok) {
            const data = await res.json();
            const payload = data?.value || data?.payload || data;
            if (payload && Array.isArray(payload.products) && payload.products.length > 0) {
              storeCMS.applyCloudPayload(payload);
              return;
            }
          }
        } catch (e) {}
      }
    } catch (e) {
      console.warn('Cloud pull error:', e);
    }
  },

  // ========== NEW PRODUCTS ==========
  getProducts: () => getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS),

  getProductById: (id) => {
    const products = storeCMS.getProducts();
    const found = products.find(p => p.id === id);
    if (found) return found;
    return storeCMS.getSecondHandProductById(id);
  },

  saveProducts: (products) => {
    setLocal(STORAGE_KEYS.PRODUCTS, products);
    storeCMS.syncToCloud();
  },

  addProduct: (product) => {
    const products = storeCMS.getProducts();
    const newProduct = {
      ...product,
      id: product.id || `bm-prod-${Date.now()}`,
      rating: product.rating || 5.0,
      reviewsCount: product.reviewsCount || 0,
      discount: Math.round(((product.marketPrice - product.bmPrice) / product.marketPrice) * 100),
      images: product.images && product.images.length > 0 ? product.images : [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop"
      ]
    };
    const updated = [newProduct, ...products];
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    
    // Automatically trigger WhatsApp notification alerts for interested customers!
    try {
      import('./notificationService').then(({ notificationService }) => {
        const alerts = notificationService.checkIntentMatchesAndNotifyWhatsApp(newProduct);
        if (alerts && alerts.length > 0) {
          const existingAlerts = getLocal('bm_whatsapp_alerts_v4', []);
          setLocal('bm_whatsapp_alerts_v4', [...alerts, ...existingAlerts]);
        }
      });
    } catch (e) {}

    storeCMS.syncToCloud();
    return newProduct;
  },

  updateProduct: (id, updatedFields) => {
    const products = storeCMS.getProducts();
    const updated = products.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...updatedFields };
        if (merged.marketPrice && merged.bmPrice) {
          merged.discount = Math.round(((merged.marketPrice - merged.bmPrice) / merged.marketPrice) * 100);
        }
        return merged;
      }
      return p;
    });
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    storeCMS.syncToCloud();
  },

  deleteProduct: (id) => {
    const products = storeCMS.getProducts();
    const updated = products.filter(p => p.id !== id);
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    storeCMS.syncToCloud();
  },

  // ========== SECOND HAND PRODUCTS ==========
  getSecondHandProducts: () => getLocal(STORAGE_KEYS.SECONDHAND, INITIAL_SECONDHAND_PRODUCTS),

  getSecondHandProductById: (id) => {
    const products = storeCMS.getSecondHandProducts();
    return products.find(p => p.id === id) || null;
  },

  addSecondHandProduct: (product) => {
    const products = storeCMS.getSecondHandProducts();
    const newProduct = {
      ...product,
      id: product.id || `bm-sh-${Date.now()}`,
      rating: product.rating || 4.0,
      reviewsCount: product.reviewsCount || 0,
      discount: Math.round(((product.marketPrice - product.bmPrice) / product.marketPrice) * 100),
      images: product.images && product.images.length > 0 ? product.images : [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop"
      ]
    };
    const updated = [newProduct, ...products];
    setLocal(STORAGE_KEYS.SECONDHAND, updated);

    // Automatically trigger WhatsApp notification alerts for interested customers!
    try {
      import('./notificationService').then(({ notificationService }) => {
        const alerts = notificationService.checkIntentMatchesAndNotifyWhatsApp(newProduct);
        if (alerts && alerts.length > 0) {
          const existingAlerts = getLocal('bm_whatsapp_alerts_v4', []);
          setLocal('bm_whatsapp_alerts_v4', [...alerts, ...existingAlerts]);
        }
      });
    } catch (e) {}

    storeCMS.syncToCloud();
    return newProduct;
  },

  updateSecondHandProduct: (id, updatedFields) => {
    const products = storeCMS.getSecondHandProducts();
    const updated = products.map(p => {
      if (p.id === id) {
        const merged = { ...p, ...updatedFields };
        if (merged.marketPrice && merged.bmPrice) {
          merged.discount = Math.round(((merged.marketPrice - merged.bmPrice) / merged.marketPrice) * 100);
        }
        return merged;
      }
      return p;
    });
    setLocal(STORAGE_KEYS.SECONDHAND, updated);
    storeCMS.syncToCloud();
  },

  deleteSecondHandProduct: (id) => {
    const products = storeCMS.getSecondHandProducts();
    const updated = products.filter(p => p.id !== id);
    setLocal(STORAGE_KEYS.SECONDHAND, updated);
    storeCMS.syncToCloud();
  },

  // ========== CATEGORIES ==========
  getCategories: () => getLocal(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES),
  saveCategories: (categories) => {
    setLocal(STORAGE_KEYS.CATEGORIES, categories);
    storeCMS.syncToCloud();
  },

  // ========== BRANDS ==========
  getBrands: () => getLocal(STORAGE_KEYS.BRANDS, INITIAL_BRANDS),
  saveBrands: (brands) => {
    setLocal(STORAGE_KEYS.BRANDS, brands);
    storeCMS.syncToCloud();
  },

  // ========== BANNERS ==========
  getBanners: () => getLocal(STORAGE_KEYS.BANNERS, INITIAL_HERO_BANNERS),
  saveBanners: (banners) => {
    setLocal(STORAGE_KEYS.BANNERS, banners);
    storeCMS.syncToCloud();
  },

  // ========== COUPONS ==========
  getCoupons: () => getLocal(STORAGE_KEYS.COUPONS, INITIAL_COUPONS),
  saveCoupons: (coupons) => {
    setLocal(STORAGE_KEYS.COUPONS, coupons);
    storeCMS.syncToCloud();
  },
  validateCoupon: (code, orderAmount) => {
    const coupons = storeCMS.getCoupons();
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) return { valid: false, message: 'Invalid coupon code' };
    if (orderAmount < found.minOrder) return { valid: false, message: `Minimum order of ₹${found.minOrder.toLocaleString('en-IN')} required for coupon ${code}` };

    let discountAmount = 0;
    if (found.discountType === 'fixed') {
      discountAmount = found.amount;
    } else if (found.discountType === 'percentage') {
      discountAmount = Math.round((orderAmount * found.amount) / 100);
    }
    return { valid: true, coupon: found, discountAmount, message: 'Coupon applied successfully!' };
  },

  // ========== BLOGS ==========
  getBlogs: () => getLocal(STORAGE_KEYS.BLOGS, INITIAL_BLOGS),
  saveBlogs: (blogs) => {
    setLocal(STORAGE_KEYS.BLOGS, blogs);
    storeCMS.syncToCloud();
  },

  // ========== STORE LOCATIONS ==========
  getLocations: () => getLocal(STORAGE_KEYS.LOCATIONS, INITIAL_STORE_LOCATIONS),
  saveLocations: (locations) => {
    setLocal(STORAGE_KEYS.LOCATIONS, locations);
    storeCMS.syncToCloud();
  },

  // ========== SETTINGS ==========
  getSettings: () => getLocal(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS_WITH_EMBEDDED),
  updateSettings: (newSettings) => {
    const current = storeCMS.getSettings();
    setLocal(STORAGE_KEYS.SETTINGS, { ...current, ...newSettings });
    storeCMS.syncToCloud();
  },

  // ========== TIMER HELPERS ==========
  isNewArrivalActive: () => {
    const settings = storeCMS.getSettings();
    if (!settings.newArrivalEnabled) return false;
    const startedAt = new Date(settings.newArrivalStartedAt || Date.now());
    const hours = settings.newArrivalTimerHours || 72;
    const endTime = new Date(startedAt.getTime() + hours * 3600000);
    return new Date() < endTime;
  },

  getNewArrivalTimeLeft: () => {
    const settings = storeCMS.getSettings();
    const startedAt = new Date(settings.newArrivalStartedAt || Date.now());
    const hours = settings.newArrivalTimerHours || 72;
    const endTime = new Date(startedAt.getTime() + hours * 3600000);
    const diff = endTime - new Date();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours: Math.floor(diff / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000)
    };
  },

  resetNewArrivalTimer: (hours) => {
    storeCMS.updateSettings({
      newArrivalTimerHours: hours,
      newArrivalStartedAt: new Date().toISOString(),
      newArrivalEnabled: true
    });
  },

  isFlashDealActive: () => {
    const settings = storeCMS.getSettings();
    if (!settings.flashDealEnabled) return false;
    const startedAt = new Date(settings.flashDealStartedAt || Date.now());
    const hours = settings.flashDealTimerHours || 24;
    const endTime = new Date(startedAt.getTime() + hours * 3600000);
    return new Date() < endTime;
  },

  getFlashDealTimeLeft: () => {
    const settings = storeCMS.getSettings();
    const startedAt = new Date(settings.flashDealStartedAt || Date.now());
    const hours = settings.flashDealTimerHours || 24;
    const endTime = new Date(startedAt.getTime() + hours * 3600000);
    const diff = endTime - new Date();
    if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
    return {
      hours: Math.floor(diff / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000)
    };
  },

  resetFlashDealTimer: (hours) => {
    storeCMS.updateSettings({
      flashDealTimerHours: hours,
      flashDealStartedAt: new Date().toISOString(),
      flashDealEnabled: true
    });
  },

  // ========== ORDERS & UTR REGISTRY ==========
  getUsedUtrs: () => getLocal(STORAGE_KEYS.USED_UTRS, []),

  isUtrUsed: (utr) => {
    if (!utr) return false;
    const cleanUtr = String(utr).trim().replace(/[^A-Za-z0-9]/g, '');
    if (!cleanUtr) return false;
    
    // 1. Check USED_UTRS list
    const usedList = storeCMS.getUsedUtrs();
    if (usedList.includes(cleanUtr)) return true;

    // 2. Check existing orders
    const orders = storeCMS.getOrders();
    return orders.some(o => {
      const pId = String(o.paymentId || '').trim().replace(/[^A-Za-z0-9]/g, '');
      return pId === cleanUtr;
    });
  },

  registerUtr: (utr) => {
    if (!utr) return;
    const cleanUtr = String(utr).trim().replace(/[^A-Za-z0-9]/g, '');
    if (!cleanUtr) return;
    const usedList = storeCMS.getUsedUtrs();
    if (!usedList.includes(cleanUtr)) {
      setLocal(STORAGE_KEYS.USED_UTRS, [cleanUtr, ...usedList]);
      storeCMS.syncToCloud();
    }
  },

  getOrders: () => getLocal(STORAGE_KEYS.ORDERS, []),
  saveOrders: (orders) => {
    setLocal(STORAGE_KEYS.ORDERS, orders);
    storeCMS.syncToCloud();
  },

  placeOrder: (orderData) => {
    const orders = storeCMS.getOrders();
    const newOrder = {
      ...orderData,
      id: `BM-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      placedAt: new Date().toISOString(),
      orderStatus: 'Order Placed',
      paymentStatus: orderData.paymentMethod === 'Cash on Delivery' ? 'Pending COD' : 'Paid',
      trackingNumber: `SHIP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courierName: 'Shiprocket / BlueDart Express',
      estDelivery: 'Within 2-3 Business Days',
      timeline: [
        { status: 'Order Placed', time: new Date().toLocaleString(), done: true },
        { status: 'Packed & Quality Verified', time: 'Pending', done: false },
        { status: 'Handed to Courier', time: 'Pending', done: false },
        { status: 'Out for Delivery', time: 'Pending', done: false },
        { status: 'Delivered', time: 'Pending', done: false }
      ]
    };

    if (orderData.paymentId) {
      storeCMS.registerUtr(orderData.paymentId);
    }

    const updatedOrders = [newOrder, ...orders];
    setLocal(STORAGE_KEYS.ORDERS, updatedOrders);

    // Reduce inventory
    const products = storeCMS.getProducts();
    const updatedProducts = products.map(prod => {
      const cartItem = orderData.items.find(i => i.id === prod.id);
      if (cartItem) {
        return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
      }
      return prod;
    });
    setLocal(STORAGE_KEYS.PRODUCTS, updatedProducts);


    // Create Live Notification for Store Owner Login CMS
    const ownerNotif = {
      id: `NOTIF-${Date.now()}`,
      orderId: newOrder.id,
      title: `🚨 NEW ORDER #${newOrder.id} (${newOrder.customerName})`,
      customerName: newOrder.customerName,
      customerPhone: newOrder.phone,
      customerEmail: newOrder.email,
      totalAmount: newOrder.totalAmount,
      paymentMethod: newOrder.paymentMethod,
      fullAddress: `${newOrder.address}, ${newOrder.city}, ${newOrder.district}, ${newOrder.state} - ${newOrder.pincode}`,
      placedAt: newOrder.placedAt,
      isRead: false
    };
    storeCMS.addOwnerNotification(ownerNotif);

    storeCMS.dispatchSilentOwnerNotification(newOrder);
    storeCMS.dispatchSilentCustomerNotification(newOrder);

    storeCMS.syncToCloud();
    return newOrder;
  },

  getOwnerNotifications: () => {
    return getLocal('bm_owner_notifications_v4', []);
  },

  addOwnerNotification: (notif) => {
    const existing = storeCMS.getOwnerNotifications();
    const updated = [notif, ...existing];
    setLocal('bm_owner_notifications_v4', updated);
  },

  markOwnerNotificationRead: (id) => {
    const existing = storeCMS.getOwnerNotifications();
    const updated = existing.map(n => n.id === id ? { ...n, isRead: true } : n);
    setLocal('bm_owner_notifications_v4', updated);
  },

  // Silent Background Dispatcher — sends order details automatically to owner without customer opening WhatsApp
  dispatchSilentOwnerNotification: (order) => {
    try {
      const settings = storeCMS.getSettings();
      const ownerPhone = settings.supportPhone || '+91 79906 48756';
      
      const payload = {
        orderId: order.id,
        placedAt: order.placedAt,
        customerName: order.customerName,
        phone: order.phone,
        email: order.email,
        fullAddress: `${order.address}, ${order.city}, ${order.district}, ${order.state} - ${order.pincode}`,
        items: order.items,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentId: order.paymentId || 'N/A',
        paymentStatus: order.paymentStatus || 'Paid',
        ownerPhone
      };

      console.log('⚡ SILENT OWNER NOTIFICATION DISPATCHED AUTOMATICALLY:', payload);

      if (typeof window !== 'undefined' && window.fetch) {
        fetch('/api/notify-owner', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Background dispatch error:', e);
    }
  },

  // Silent Background Dispatcher — sends order confirmation & bill automatically to CUSTOMER phone & email without customer opening anything
  dispatchSilentCustomerNotification: (order) => {
    try {
      const settings = storeCMS.getSettings();
      const customerPayload = {
        orderId: order.id,
        placedAt: order.placedAt,
        customerName: order.customerName,
        customerPhone: order.phone,
        customerEmail: order.email,
        fullAddress: `${order.address}, ${order.city}, ${order.district}, ${order.state} - ${order.pincode}`,
        items: order.items,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus || 'Paid',
        estDelivery: order.estDelivery || '2-3 Business Days',
        supportPhone: settings.supportPhone || '+91 79906 48756'
      };

      console.log('⚡ SILENT CUSTOMER ORDER CONFIRMATION DISPATCHED AUTOMATICALLY TO:', order.phone, customerPayload);

      if (typeof window !== 'undefined' && window.fetch) {
        fetch('/api/notify-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(customerPayload)
        }).catch(() => {});
      }
    } catch (e) {
      console.warn('Customer background dispatch error:', e);
    }
  },

  updateOrderStatus: (orderId, newStatus, extra = {}) => {
    const orders = storeCMS.getOrders();
    const updated = orders.map(o => {
      if (o.id === orderId) {
        return { ...o, orderStatus: newStatus, ...extra };
      }
      return o;
    });
    setLocal(STORAGE_KEYS.ORDERS, updated);
    storeCMS.syncToCloud();
  },

  // Auto-notification WhatsApp message generator for each order status step
  getOrderStatusNotification: (order, newStatus) => {
    const customerPhoneClean = (order.phone || '').replace(/[^0-9]/g, '');
    const fullCustomerPhone = customerPhoneClean.startsWith('91') ? customerPhoneClean : `91${customerPhoneClean}`;
    const itemsSummary = (order.items || []).map(i => `• ${i.title || i.name} (${i.quantity || 1}x) - ₹${((i.bmPrice || i.price || 0) * (i.quantity || 1)).toLocaleString('en-IN')}`).join('\n');

    const statusMessages = {
      'Order Placed': `🛒 *BALAJI MOBILE — ORDER RECEIVED!*
────────────────────────────────
*Order ID:* ${order.id}
*Dear ${order.customerName},*

Your order has been successfully placed at Balaji Mobile! 🎉

🛍️ *ITEMS ORDERED:*
${itemsSummary}

💰 *Total Amount:* ₹${(order.totalAmount || 0).toLocaleString('en-IN')}
💳 *Payment Method:* ${order.paymentMethod}
📍 *Delivery Address:* ${order.address}, ${order.city}, ${order.state} - ${order.pincode}

Our team is verifying your payment. You will receive a confirmation shortly.

Thank you for shopping at *Balaji Mobile — Morbi, Gujarat!* 🙏
📞 Support: +91 79906 48756`,

      'Order Packed': `📦 *BALAJI MOBILE — ORDER PACKED!*
────────────────────────────────
*Order ID:* ${order.id}
*Dear ${order.customerName},*

Great news! 🎉 Your order has been carefully *packed and quality-checked* by our team!

🛍️ *ITEMS PACKED:*
${itemsSummary}

💰 *Total:* ₹${(order.totalAmount || 0).toLocaleString('en-IN')}
📍 *Delivery Address:* ${order.address}, ${order.city}, ${order.state} - ${order.pincode}
🚚 *Estimated Delivery:* ${order.estDelivery || 'Within 2-3 Business Days'}

Your order will be handed to courier very soon!

Thank you for choosing *Balaji Mobile — Morbi, Gujarat!* 🙏
📞 Support: +91 79906 48756`,

      'Handed to Courier': `🚚 *BALAJI MOBILE — ORDER DISPATCHED!*
────────────────────────────────
*Order ID:* ${order.id}
*Dear ${order.customerName},*

Your order is on its way! 🚀 It has been handed over to our delivery partner.

🛍️ *ITEMS DISPATCHED:*
${itemsSummary}

📍 *Delivering To:* ${order.address}, ${order.city}, ${order.state} - ${order.pincode}
🚚 *Expected Delivery:* ${order.estDelivery || 'Within 1-2 Business Days'}

Please keep your phone reachable for delivery.

Thank you for shopping at *Balaji Mobile — Morbi, Gujarat!* 🙏
📞 Support: +91 79906 48756`,

      'Out for Delivery': `🛵 *BALAJI MOBILE — OUT FOR DELIVERY!*
────────────────────────────────
*Order ID:* ${order.id}
*Dear ${order.customerName},*

Your order is *OUT FOR DELIVERY TODAY!* 🎉
Our delivery partner will reach you soon.

📍 *Delivering To:* ${order.address}, ${order.city}, ${order.state} - ${order.pincode}

📌 *Please Note:*
• Keep your phone reachable
• Have exact amount ready if COD

*Balaji Mobile — Morbi, Gujarat!* 🙏
📞 Support: +91 79906 48756`,

      'Delivered': `✅ *BALAJI MOBILE — ORDER DELIVERED!*
────────────────────────────────
*Order ID:* ${order.id}
*Dear ${order.customerName},*

Your order has been successfully *DELIVERED!* 🎉📱

🛍️ *ITEMS DELIVERED:*
${itemsSummary}

We hope you love your new device! 

⭐ *We'd love your feedback!* Visit our store or call us.

Thank you for choosing *Balaji Mobile — Morbi, Gujarat!* 🙏
📞 Support: +91 79906 48756`
    };

    const msg = statusMessages[newStatus] || `📦 Order ${order.id} status updated to: ${newStatus}\n\nThank you for shopping at Balaji Mobile!\n📞 +91 79906 48756`;

    return {
      whatsappUrl: `https://wa.me/${fullCustomerPhone}?text=${encodeURIComponent(msg)}`,
      message: msg,
    };
  },

  // Helper to generate WhatsApp order message links
  getWhatsAppLinks: (order) => {
    const settings = storeCMS.getSettings();
    const ownerPhone = (settings.supportPhone || '7990648756').replace(/[^0-9]/g, '');
    const fullOwnerPhone = ownerPhone.startsWith('91') ? ownerPhone : `91${ownerPhone}`;

    const itemsSummary = order.items.map(i => `• ${i.title} (${i.quantity}x) - ₹${(i.bmPrice * i.quantity).toLocaleString('en-IN')}`).join('\n');

    // Customer WhatsApp Invoice Bill Message
    const customerMsg = 
`🧾 *BALAJI MOBILE - ORDER INVOICE BILL*
----------------------------------------
*Order ID:* ${order.id}
*Customer Name:* ${order.customerName}
*Phone:* ${order.phone}
*Delivery Address:* ${order.address}, ${order.city}, ${order.district}, ${order.state} - ${order.pincode}

*ITEMS ORDERED:*
${itemsSummary}

----------------------------------------
*Total Amount Paid:* ₹${order.totalAmount.toLocaleString('en-IN')}
*Payment Method:* ${order.paymentMethod} ${order.paymentId ? `(UTR: ${order.paymentId})` : ''}
*Status:* ${order.orderStatus}
*Est Delivery:* ${order.estDelivery}

Thank you for shopping at *Balaji Mobile — Morbi, Gujarat!*
For support, call us: +91 79906 48756`;

    // Store Owner WhatsApp Notification Message
    const ownerMsg = 
`🚨 *NEW ORDER RECEIVED — BALAJI MOBILE WEBSITE*
────────────────────────────────────────
🆔 *Order ID:* ${order.id}
📅 *Date & Time:* ${new Date(order.placedAt || Date.now()).toLocaleString('en-IN')}

👤 *CUSTOMER DETAILS:*
• Name: ${order.customerName}
• Phone: ${order.phone}
• Email: ${order.email || '—'}
• Delivery Address: ${order.address}, ${order.city}, ${order.district}, ${order.state} - ${order.pincode}

🛒 *ITEMS ORDERED:*
${itemsSummary}

💰 *TOTAL AMOUNT:* ₹${order.totalAmount.toLocaleString('en-IN')}
💳 *PAYMENT METHOD:* ${order.paymentMethod} ${order.paymentId ? `(UTR: ${order.paymentId})` : ''}
📊 *PAYMENT STATUS:* ${order.paymentStatus || order.orderStatus || 'Pending Verification'}

👉 *OWNER ACTION:*
1. Check GPay / Bank App for payment of ₹${order.totalAmount.toLocaleString('en-IN')}
2. If payment received → Pack & Dispatch via Shiprocket / BlueDart
3. Confirm / Manage in Admin Panel: https://balajimobile.store/admin`;

    const customerPhoneClean = (order.phone || '').replace(/[^0-9]/g, '');
    const fullCustomerPhone = customerPhoneClean.startsWith('91') ? customerPhoneClean : `91${customerPhoneClean}`;

    return {
      customerWhatsAppUrl: `https://wa.me/${fullCustomerPhone}?text=${encodeURIComponent(customerMsg)}`,
      ownerWhatsAppUrl: `https://wa.me/${fullOwnerPhone}?text=${encodeURIComponent(ownerMsg)}`,
      customerMsgText: customerMsg,
      ownerMsgText: ownerMsg
    };
  },

  // Customer notification generator when owner confirms payment (YES)
  getCustomerVerificationNotification: (order, deliveryDate) => {
    const customerPhoneClean = (order.phone || '').replace(/[^0-9]/g, '');
    const fullCustomerPhone = customerPhoneClean.startsWith('91') ? customerPhoneClean : `91${customerPhoneClean}`;
    const dateStr = deliveryDate || order.estDelivery || 'Within 2-3 Business Days';

    const itemsSummary = (order.items || []).map(i => `• ${i.title || i.name} (${i.quantity || 1}x) - ₹${((i.bmPrice || i.price || 0) * (i.quantity || 1)).toLocaleString('en-IN')}`).join('\n');

    const whatsappMsg = 
`✅ *BALAJI MOBILE — ORDER CONFIRMED!*
----------------------------------------
*Order ID:* ${order.id}
*Customer Name:* ${order.customerName}
*Payment Status:* ✅ Verified & Confirmed by Shop Owner

🚚 *EXPECTED DELIVERY DATE:*
*${dateStr}*

🛒 *ITEMS ORDERED:*
${itemsSummary}

💰 *Total Paid:* ₹${(order.totalAmount || 0).toLocaleString('en-IN')}
📍 *Delivery Address:* ${order.address}, ${order.city || ''}, ${order.district || ''}, ${order.state || ''} - ${order.pincode}

Your payment has been successfully verified! Your order is packed and being dispatched.

Thank you for shopping at *Balaji Mobile — Morbi, Gujarat!*
For support / tracking: +91 79906 48756`;

    const emailSubject = `✅ Payment Verified & Order Confirmed - Balaji Mobile (${order.id})`;
    const emailBody = `Dear ${order.customerName},\n\nGreat news! Your payment of ₹${(order.totalAmount || 0).toLocaleString('en-IN')} for Order ${order.id} has been verified by Balaji Mobile.\n\n🚚 EXPECTED DELIVERY DATE: ${dateStr}\n\nDelivery Address: ${order.address}, ${order.city || ''}, ${order.district || ''}, ${order.state || ''} - ${order.pincode}\n\nThank you for shopping at Balaji Mobile, Morbi, Gujarat!\nSupport Phone: +91 79906 48756`;

    return {
      whatsappUrl: `https://wa.me/${fullCustomerPhone}?text=${encodeURIComponent(whatsappMsg)}`,
      mailtoUrl: order.email ? `mailto:${order.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}` : null,
      whatsappMsg,
      emailSubject,
      emailBody
    };
  },

  // Customer notification generator when owner rejects payment (NO)
  getCustomerRejectionNotification: (order, reason = 'Payment not credited to shop bank account.') => {
    const customerPhoneClean = (order.phone || '').replace(/[^0-9]/g, '');
    const fullCustomerPhone = customerPhoneClean.startsWith('91') ? customerPhoneClean : `91${customerPhoneClean}`;

    const whatsappMsg = 
`❌ *BALAJI MOBILE — PAYMENT NOT RECEIVED / ORDER CANCELLED*
----------------------------------------
*Order ID:* ${order.id}
*Customer Name:* ${order.customerName}

⚠️ *REASON FOR CANCELLATION:*
${reason}

We could not verify the payment of ₹${(order.totalAmount || 0).toLocaleString('en-IN')} for your order in our shop bank account.

ℹ️ *IMPORTANT INFORMATION:*
If the money was debited from your account/bank, please do not worry. It will be automatically refunded to your bank account within 24-48 hours by your bank/UPI app. 

Please check your bank statement and place a fresh order or call us for help: +91 79906 48756.

Balaji Mobile — Morbi, Gujarat`;

    const emailSubject = `❌ Payment Not Received - Order ${order.id} Cancelled`;
    const emailBody = `Dear ${order.customerName},\n\nYour Order ${order.id} for ₹${(order.totalAmount || 0).toLocaleString('en-IN')} at Balaji Mobile has been cancelled because payment was NOT received in our bank account.\n\nReason: ${reason}\n\nIf money was debited from your account, your bank will auto-refund it within 24-48 hours. Feel free to re-order or contact support.\n\nBalaji Mobile, Morbi, Gujarat\nContact: +91 79906 48756`;

    return {
      whatsappUrl: `https://wa.me/${fullCustomerPhone}?text=${encodeURIComponent(whatsappMsg)}`,
      mailtoUrl: order.email ? `mailto:${order.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}` : null,
      whatsappMsg,
      emailSubject,
      emailBody
    };
  },

  // ========== CART ==========
  getCart: () => getLocal(STORAGE_KEYS.CART, []),
  saveCart: (cart) => {
    setLocal(STORAGE_KEYS.CART, cart);
    const currentUser = storeCMS.getUser();
    const vaultKey = getUserVaultKey(currentUser);
    if (vaultKey) {
      const currentVault = getLocal(vaultKey, {});
      setLocal(vaultKey, { ...currentVault, cart });
    }
  },
  addToCart: (product, quantity = 1, selectedColor = null) => {
    const cart = storeCMS.getCart();
    const existingIndex = cart.findIndex(item => item.id === product.id && item.selectedColor === (selectedColor || product.color));
    let updated;
    if (existingIndex > -1) {
      updated = cart.map((item, idx) => idx === existingIndex ? { ...item, quantity: item.quantity + quantity } : item);
    } else {
      updated = [...cart, { ...product, quantity, selectedColor: selectedColor || product.color }];
    }
    storeCMS.saveCart(updated);
    return updated;
  },
  updateCartQty: (productId, delta) => {
    const cart = storeCMS.getCart();
    const updated = cart.map(item => {
      if (item.id === productId) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean);
    storeCMS.saveCart(updated);
    return updated;
  },
  removeFromCart: (productId) => {
    const cart = storeCMS.getCart();
    const updated = cart.filter(item => item.id !== productId);
    storeCMS.saveCart(updated);
    return updated;
  },
  clearCart: () => {
    setLocal(STORAGE_KEYS.CART, []);
    const currentUser = storeCMS.getUser();
    const vaultKey = getUserVaultKey(currentUser);
    if (vaultKey) {
      const currentVault = getLocal(vaultKey, {});
      setLocal(vaultKey, { ...currentVault, cart: [] });
    }
  },

  // ========== USER SESSION & AUTH VAULT ==========
  getUser: () => getLocal(STORAGE_KEYS.USER_SESSION, null),
  setUser: (user) => {
    setLocal(STORAGE_KEYS.USER_SESSION, user);
    const vaultKey = getUserVaultKey(user);

    if (vaultKey) {
      const savedVault = getLocal(vaultKey, null);
      if (savedVault) {
        // RESTORE USER'S SAVED HISTORY (CART, WISHLIST, REWARDS)
        if (Array.isArray(savedVault.cart)) {
          setLocal(STORAGE_KEYS.CART, savedVault.cart);
        }
        if (Array.isArray(savedVault.wishlist)) {
          setLocal(STORAGE_KEYS.WISHLIST, savedVault.wishlist);
        }
        if (savedVault.rewardPoints) {
          setLocal(STORAGE_KEYS.REWARD_POINTS, savedVault.rewardPoints);
        }
        console.log(`✅ [USER VAULT RESTORED] History restored for ${user.email || user.phone}`);
      } else {
        // INITIALIZE VAULT WITH CURRENT ACTIVE STATE
        setLocal(vaultKey, {
          user,
          cart: storeCMS.getCart(),
          wishlist: storeCMS.getWishlist(),
          rewardPoints: storeCMS.getRewardPoints()
        });
      }
    }

    if (user && user.phone) {
      try {
        import('./userIntentService').then(({ userIntentService }) => {
          userIntentService.setUserPhone(user.phone);
        });
      } catch (e) {}
    }
  },
  updateUserProfile: (updatedFields) => {
    const currentUser = storeCMS.getUser();
    if (!currentUser) return null;
    const updatedUser = {
      ...currentUser,
      ...updatedFields,
      updatedAt: new Date().toISOString()
    };
    setLocal(STORAGE_KEYS.USER_SESSION, updatedUser);
    const vaultKey = getUserVaultKey(updatedUser);
    if (vaultKey) {
      const currentVault = getLocal(vaultKey, {});
      setLocal(vaultKey, { ...currentVault, user: updatedUser });
    }
    window.dispatchEvent(new Event('bm_cms_update'));
    return updatedUser;
  },
  logout: () => {
    const currentUser = storeCMS.getUser();
    const vaultKey = getUserVaultKey(currentUser);

    if (vaultKey) {
      // BACKUP USER STATE BEFORE LOGGING OUT
      setLocal(vaultKey, {
        user: currentUser,
        cart: storeCMS.getCart(),
        wishlist: storeCMS.getWishlist(),
        rewardPoints: storeCMS.getRewardPoints()
      });
      console.log(`💾 [USER VAULT BACKED UP] Saved history for ${currentUser.email || currentUser.phone}`);
    }

    // RESET SESSION & CLEAR ACTIVE GUEST CART/WISHLIST
    setLocal(STORAGE_KEYS.USER_SESSION, null);
    setLocal(STORAGE_KEYS.CART, []);
    setLocal(STORAGE_KEYS.WISHLIST, []);
  },

  // ========== WISHLIST ==========
  getWishlist: () => getLocal(STORAGE_KEYS.WISHLIST, []),
  toggleWishlist: (productId) => {
    const list = storeCMS.getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter(id => id !== productId) : [...list, productId];
    setLocal(STORAGE_KEYS.WISHLIST, updated);

    const currentUser = storeCMS.getUser();
    const vaultKey = getUserVaultKey(currentUser);
    if (vaultKey) {
      const currentVault = getLocal(vaultKey, {});
      setLocal(vaultKey, { ...currentVault, wishlist: updated });
    }
    return updated;
  },

  // ========== COMPARE ==========
  getCompare: () => getLocal(STORAGE_KEYS.COMPARE, []),
  toggleCompare: (productId) => {
    const list = storeCMS.getCompare();
    const exists = list.includes(productId);
    let updated;
    if (exists) {
      updated = list.filter(id => id !== productId);
    } else {
      if (list.length >= 4) {
        alert("You can compare up to 4 smartphones at a time.");
        return list;
      }
      updated = [...list, productId];
    }
    setLocal(STORAGE_KEYS.COMPARE, updated);
    return updated;
  },

  // ========== REWARD POINTS ==========
  getRewardPoints: () => getLocal(STORAGE_KEYS.REWARD_POINTS, 250),

  // ========== REVIEWS ==========
  getReviews: () => getLocal(STORAGE_KEYS.REVIEWS, INITIAL_TESTIMONIALS),
  addReview: (review) => {
    const reviews = storeCMS.getReviews();
    const newRev = { ...review, id: `rev-${Date.now()}` };
    const updated = [newRev, ...reviews];
    setLocal(STORAGE_KEYS.REVIEWS, updated);

    if (review.productId) {
      const products = storeCMS.getProducts();
      const updatedProducts = products.map(p => {
        if (p.id === review.productId) {
          const newCount = p.reviewsCount + 1;
          const newRating = parseFloat(((p.rating * p.reviewsCount + review.rating) / newCount).toFixed(1));
          return { ...p, rating: newRating, reviewsCount: newCount };
        }
        return p;
      });
      setLocal(STORAGE_KEYS.PRODUCTS, updatedProducts);
    }
  },

  // ========== BULK RESET & EXPORT / IMPORT ==========
  resetToFactorySeed: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    window.dispatchEvent(new Event('bm_cms_update'));
  },

  exportDatabaseJSON: () => {
    const exportData = {
      products: storeCMS.getProducts(),
      secondHandProducts: storeCMS.getSecondHandProducts(),
      categories: storeCMS.getCategories(),
      brands: storeCMS.getBrands(),
      banners: storeCMS.getBanners(),
      coupons: storeCMS.getCoupons(),
      blogs: storeCMS.getBlogs(),
      locations: storeCMS.getLocations(),
      settings: storeCMS.getSettings(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(exportData, null, 2);
  },

  importDatabaseJSON: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.products) setLocal(STORAGE_KEYS.PRODUCTS, parsed.products);
      if (parsed.secondHandProducts) setLocal(STORAGE_KEYS.SECONDHAND, parsed.secondHandProducts);
      if (parsed.categories) setLocal(STORAGE_KEYS.CATEGORIES, parsed.categories);
      if (parsed.brands) setLocal(STORAGE_KEYS.BRANDS, parsed.brands);
      if (parsed.banners) setLocal(STORAGE_KEYS.BANNERS, parsed.banners);
      if (parsed.coupons) setLocal(STORAGE_KEYS.COUPONS, parsed.coupons);
      if (parsed.blogs) setLocal(STORAGE_KEYS.BLOGS, parsed.blogs);
      if (parsed.locations) setLocal(STORAGE_KEYS.LOCATIONS, parsed.locations);
      if (parsed.settings) setLocal(STORAGE_KEYS.SETTINGS, parsed.settings);
      window.dispatchEvent(new Event('bm_cms_update'));
      return { success: true, message: 'Database imported successfully!' };
    } catch (e) {
      return { success: false, message: 'Invalid JSON format: ' + e.message };
    }
  }
};

// Auto-pull from cloud on load
if (typeof window !== 'undefined') {
  storeCMS.pullFromCloud();
}
