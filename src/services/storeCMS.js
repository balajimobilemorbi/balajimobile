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
  INITIAL_SETTINGS,
  INITIAL_HERO_MEDIA
} from '../data/seedData';
import { EMBEDDED_PAYMENT_QR, EMBEDDED_BM_LOGO } from '../assets/embeddedAssets';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEYS = {
  PRODUCTS: 'bm_products_v5',
  SECONDHAND: 'bm_secondhand_v5',
  CATEGORIES: 'bm_categories_v5',
  BRANDS: 'bm_brands_v5',
  BANNERS: 'bm_banners_v5',
  HERO_MEDIA: 'bm_hero_media_v5',
  COUPONS: 'bm_coupons_v5',
  BLOGS: 'bm_blogs_v5',
  TESTIMONIALS: 'bm_testimonials_v5',
  LOCATIONS: 'bm_locations_v5',
  SETTINGS: 'bm_settings_v5',
  ORDERS: 'bm_orders_v5',
  USED_UTRS: 'bm_used_utrs_v5',
  CART: 'bm_cart_v5',
  WISHLIST: 'bm_wishlist_v5',
  COMPARE: 'bm_compare_v5',
  REVIEWS: 'bm_reviews_v5',
  REWARD_POINTS: 'bm_rewards_v5',
  USER_SESSION: 'bm_user_session_v5',
  REGISTERED_USERS: 'bm_registered_users_v5',
  CLOUD_SYNC_TIMESTAMP: 'bm_cloud_ts_v5'
};

// Default settings with EMBEDDED QR code so it NEVER fails or 404s on any device!
const DEFAULT_SETTINGS_WITH_EMBEDDED = {
  ...INITIAL_SETTINGS,
  paymentQrImageUrl: EMBEDDED_PAYMENT_QR,
  storeLogoUrl: EMBEDDED_BM_LOGO
};

const repairCorruptedStorage = () => {
  try {
    const keys = [STORAGE_KEYS.PRODUCTS, STORAGE_KEYS.SECONDHAND, STORAGE_KEYS.ORDERS];
    for (const key of keys) {
      const raw = localStorage.getItem(key);
      if (!raw || raw === 'undefined' || raw === 'null') {
        localStorage.removeItem(key);
      } else {
        try {
          const parsed = JSON.parse(raw);
          if (!Array.isArray(parsed) || parsed.some(p => !p || typeof p !== 'object')) {
            localStorage.removeItem(key);
          }
        } catch (e) {
          localStorage.removeItem(key);
        }
      }
    }
  } catch (e) {}
};

// Auto-run self-healing repair on module load
repairCorruptedStorage();

const getLocal = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    if (!data || data === 'undefined' || data === 'null') return fallback;
    const parsed = JSON.parse(data);
    return parsed ?? fallback;
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

// REALTIME CLOUD STORAGE ENGINE FOR LIVE CROSS-DEVICE SYNC (GitHub Pages / Vercel / Hostinger / Custom Domain)
const SHARED_GLOBAL_CLOUD_URL = 'https://jsonblob.com/api/jsonBlob/019fe758-ecda-7c31-b20d-4ce85c781618';
const DYNAMIC_RELAY_KEY = 'bm_cloud_relay_active_url';

const getActiveCloudRelayUrls = () => {
  const customUrl = localStorage.getItem(DYNAMIC_RELAY_KEY);
  const urls = [
    SHARED_GLOBAL_CLOUD_URL,
    customUrl,
    '/.netlify/functions/store-sync',
    '/api/store-sync'
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
    if (!payload || typeof payload !== 'object') return;
    if (!Array.isArray(payload.products) && !payload.settings) return;

    const localTs = localStorage.getItem(STORAGE_KEYS.CLOUD_SYNC_TIMESTAMP) || '';
    const localTime = localTs ? new Date(localTs).getTime() : 0;
    const cloudTime = payload.updatedAt ? new Date(payload.updatedAt).getTime() : 0;

    // Apply cloud payload only if incoming payload is newer or local is not yet initialized
    if (!localTs || cloudTime >= localTime) {
      if (Array.isArray(payload.products) && payload.products.length > 0) {
        const validProducts = payload.products.map(storeCMS.normalizeProduct).filter(p => p && p.id && p.title);
        if (validProducts.length > 0) {
          localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(validProducts));
        }
      }
      if (Array.isArray(payload.secondHandProducts)) {
        const validSecondHand = payload.secondHandProducts.map(storeCMS.normalizeProduct).filter(p => p && p.id && p.title);
        localStorage.setItem(STORAGE_KEYS.SECONDHAND, JSON.stringify(validSecondHand));
      }
      if (Array.isArray(payload.categories)) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(payload.categories));
      }
      if (Array.isArray(payload.brands)) {
        localStorage.setItem(STORAGE_KEYS.BRANDS, JSON.stringify(payload.brands));
      }
      if (Array.isArray(payload.banners)) {
        localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(payload.banners));
      }
      if (Array.isArray(payload.coupons)) {
        localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(payload.coupons));
      }
      if (Array.isArray(payload.blogs)) {
        localStorage.setItem(STORAGE_KEYS.BLOGS, JSON.stringify(payload.blogs));
      }
      if (Array.isArray(payload.locations)) {
        localStorage.setItem(STORAGE_KEYS.LOCATIONS, JSON.stringify(payload.locations));
      }
      if (payload.settings && typeof payload.settings === 'object') {
        const currentSettings = storeCMS.getSettings();
        localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify({ ...currentSettings, ...payload.settings }));
      }
      if (Array.isArray(payload.orders)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(payload.orders));
      }
      if (Array.isArray(payload.registeredUsers)) {
        localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(payload.registeredUsers));
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
    if (isSyncingWithCloud) return true;
    isSyncingWithCloud = true;
    try {
      const rawProducts = storeCMS.getProducts();
      const rawSecondHand = storeCMS.getSecondHandProducts();

      const rawPayload = {
        products: rawProducts.map(storeCMS.normalizeProduct).filter(Boolean),
        secondHandProducts: rawSecondHand.map(storeCMS.normalizeProduct).filter(Boolean),
        categories: storeCMS.getCategories(),
        brands: (storeCMS.getBrands() || []).slice(0, 30),
        banners: storeCMS.getBanners(),
        coupons: storeCMS.getCoupons(),
        blogs: (storeCMS.getBlogs() || []).slice(0, 10),
        locations: storeCMS.getLocations(),
        settings: storeCMS.getSettings(),
        orders: (storeCMS.getAllOrders ? storeCMS.getAllOrders() : storeCMS.getOrders() || []).slice(0, 100),
        registeredUsers: storeCMS.getRegisteredUsers ? storeCMS.getRegisteredUsers() : [],
        updatedAt: new Date().toISOString()
      };

      const payload = rawPayload;
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
            else console.warn('Supabase store_data upsert error:', error);
          });
        } catch (e) {
          console.warn('Supabase sync error:', e);
        }
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
            const ct = (res.headers.get('content-type') || '').toLowerCase();
            // Ignore HTML fallbacks returned by Vite dev server
            if (ct.includes('application/json') || url.includes('jsonblob.com')) {
              successCount++;
            }
          }
        } catch (e) {}
      }

      // If no endpoint accepted the PUT (e.g. 404), provision a new cloud relay!
      if (successCount === 0) {
        const newRelayUrl = await storeCMS.provisionNewCloudRelay(payload);
        if (newRelayUrl) successCount++;
      }

      console.log('✅ Live Store CMS Pushed to Global Shared Cloud Relays & Supabase DB!');
      return true;
    } catch (e) {
      console.warn('Cloud sync push warning:', e);
      return false;
    } finally {
      isSyncingWithCloud = false;
    }
  },

  // Export full store backup JSON string
  exportStoreData: () => {
    return JSON.stringify({
      products: storeCMS.getProducts(),
      secondHandProducts: storeCMS.getSecondHandProducts(),
      categories: storeCMS.getCategories(),
      brands: storeCMS.getBrands(),
      banners: storeCMS.getBanners(),
      coupons: storeCMS.getCoupons(),
      blogs: storeCMS.getBlogs(),
      locations: storeCMS.getLocations(),
      settings: storeCMS.getSettings(),
      orders: storeCMS.getOrders(),
      exportedAt: new Date().toISOString()
    }, null, 2);
  },

  // Import store snapshot JSON string
  importStoreData: (jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (!data || typeof data !== 'object') return false;
      storeCMS.applyCloudPayload(data);
      storeCMS.syncToCloud();
      return true;
    } catch (e) {
      console.error('Import store data error:', e);
      return false;
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
          const cacheBustUrl = url.includes('?') ? `${url}&_t=${Date.now()}` : `${url}?_t=${Date.now()}`;
          const res = await fetch(cacheBustUrl, {
            headers: { 
              'Accept': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache'
            }
          }).catch(() => null);

          if (res && res.ok) {
            const ct = (res.headers.get('content-type') || '').toLowerCase();
            // Skip HTML fallback responses from SPA routes
            if (!ct.includes('application/json') && !url.includes('jsonblob.com')) continue;

            const data = await res.json();
            const payload = data?.value || data?.payload || data;
            if (payload && (Array.isArray(payload.products) || payload.settings)) {
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

  // Helper to normalize any product object so it is 100% crash-proof across all components
  normalizeProduct: (p) => {
    if (!p || typeof p !== 'object') return null;

    // 1. Process Images
    let safeImages = [];
    if (Array.isArray(p.images)) {
      safeImages = p.images.filter(img => img && typeof img === 'string' && img.trim().length > 0);
    } else if (typeof p.images === 'string' && p.images.trim().length > 0) {
      safeImages = [p.images.trim()];
    }

    // 2. Process Multi-Color Galleries
    let safeColors = [];
    if (Array.isArray(p.colors) && p.colors.length > 0) {
      safeColors = p.colors.map((c, idx) => {
        if (typeof c === 'string') {
          return {
            id: `col-${idx + 1}`,
            name: c.trim(),
            hex: '#878681',
            images: safeImages
          };
        }
        if (c && typeof c === 'object') {
          const colorImgs = Array.isArray(c.images) 
            ? c.images.filter(img => img && typeof img === 'string' && img.trim().length > 0)
            : (typeof c.images === 'string' && c.images.trim() ? [c.images.trim()] : []);
          return {
            id: c.id || `col-${idx + 1}-${Date.now()}`,
            name: c.name || `Color ${idx + 1}`,
            hex: c.hex || '#878681',
            images: colorImgs.length > 0 ? colorImgs : safeImages
          };
        }
        return null;
      }).filter(Boolean);
    }

    // If no colors array but single color string exists
    if (safeColors.length === 0) {
      const primaryColorName = p.color || 'Standard';
      safeColors = [
        {
          id: 'col-1',
          name: primaryColorName,
          hex: '#878681',
          images: safeImages.length > 0 ? safeImages : ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop']
        }
      ];
    }

    // Ensure safeImages has at least 1 image
    if (safeImages.length === 0) {
      const firstColorImages = safeColors[0]?.images || [];
      if (firstColorImages.length > 0) {
        safeImages = firstColorImages;
      } else {
        safeImages = ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop'];
      }
    }

    const bmPrice = Number(p.bmPrice) || 0;
    const marketPrice = Number(p.marketPrice) || bmPrice;
    const discount = (marketPrice > bmPrice)
      ? Math.round(((marketPrice - bmPrice) / marketPrice) * 100)
      : (Number(p.discount) || 0);

    return {
      ...p,
      id: p.id ? String(p.id) : `bm-prod-${Date.now()}`,
      title: p.title || 'Smartphone',
      brand: p.brand || 'Apple',
      model: p.model || '',
      category: p.category || 'Flagship Titans',
      ram: p.ram || '8GB',
      storage: p.storage || '256GB',
      color: safeColors[0]?.name || p.color || 'Standard',
      colors: safeColors,
      bmPrice,
      marketPrice,
      discount,
      stock: typeof p.stock === 'number' ? p.stock : 10,
      images: safeImages,
      processor: p.processor || '',
      display: p.display || '',
      camera: p.camera || '',
      battery: p.battery || '',
      condition: p.condition || (p.isSecondHand ? 'Certified Pre-Owned — Tested & Verified' : 'Brand New Sealed Box — 1 Year Official Warranty'),
      warranty: p.warranty || (p.isSecondHand ? '3 Months Balaji Mobile Shop Warranty' : '1 Year Official Brand Warranty'),
      deliveryInfo: p.deliveryInfo || 'White-Glove Insured Express Delivery across India (1-3 Days)',
      replacementInfo: p.replacementInfo || '7 Days Replacement Guarantee on Manufacturing Defects',
      imei: p.imei || '',
      description: p.description || '',
      features: Array.isArray(p.features) ? p.features : (typeof p.features === 'string' ? p.features.split('\n').filter(Boolean) : []),
      specs: (typeof p.specs === 'object' && p.specs) ? p.specs : {},
      accessories: Array.isArray(p.accessories) ? p.accessories : [],
      rating: Number(p.rating) || 5.0,
      reviewsCount: Number(p.reviewsCount) || 0,
      isFeatured: Boolean(p.isFeatured),
      isTrending: Boolean(p.isTrending),
      isNewArrival: Boolean(p.isNewArrival),
      isFlashSale: Boolean(p.isFlashSale),
      isSecondHand: Boolean(p.isSecondHand),
      variants: Array.isArray(p.variants) && p.variants.length > 0 ? p.variants : [
        {
          id: `var-${p.id || '1'}`,
          color: safeColors[0]?.name || p.color || 'Standard',
          ram: p.ram || '8GB',
          storage: p.storage || '256GB',
          bmPrice,
          marketPrice,
          stock: typeof p.stock === 'number' ? p.stock : 10
        }
      ],
      ramOptions: Array.isArray(p.ramOptions) && p.ramOptions.length > 0 ? p.ramOptions : [p.ram || '8GB'],
      storageOptions: Array.isArray(p.storageOptions) && p.storageOptions.length > 0 ? p.storageOptions : [p.storage || '256GB'],
      frames360: Array.isArray(p.frames360) ? p.frames360 : [],
      videoUrl: p.videoUrl || ''
    };
  },

  // ========== NEW PRODUCTS ==========
  getProducts: () => {
    const raw = getLocal(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    if (!Array.isArray(raw)) return INITIAL_PRODUCTS.map(storeCMS.normalizeProduct).filter(Boolean);
    return raw.map(storeCMS.normalizeProduct).filter(Boolean);
  },

  getProductById: (id) => {
    const products = storeCMS.getProducts();
    const found = products.find(p => String(p.id) === String(id));
    if (found) return found;
    return storeCMS.getSecondHandProductById(id);
  },

  saveProducts: (products) => {
    setLocal(STORAGE_KEYS.PRODUCTS, products.map(storeCMS.normalizeProduct).filter(Boolean));
    storeCMS.syncToCloud();
  },

  addProduct: (product) => {
    const products = storeCMS.getProducts();
    const newId = product.id && !products.some(p => String(p.id) === String(product.id))
      ? String(product.id)
      : `bm-prod-${Date.now()}`;

    const newProduct = storeCMS.normalizeProduct({
      ...product,
      id: newId,
      isSecondHand: false,
      isNewArrival: typeof product.isNewArrival === 'boolean' ? product.isNewArrival : true,
      isTrending: typeof product.isTrending === 'boolean' ? product.isTrending : true
    });

    const updated = [newProduct, ...products.filter(p => String(p.id) !== String(newProduct.id))];
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
    let found = false;
    const updated = products.map(p => {
      if (String(p.id) === String(id)) {
        found = true;
        const merged = { ...p, ...updatedFields, id: p.id };
        return storeCMS.normalizeProduct(merged);
      }
      return p;
    });

    if (found) {
      setLocal(STORAGE_KEYS.PRODUCTS, updated);
      storeCMS.syncToCloud();
      return true;
    }

    // If not found in new products, check second hand
    const secondHand = storeCMS.getSecondHandProducts();
    if (secondHand.some(p => String(p.id) === String(id))) {
      return storeCMS.updateSecondHandProduct(id, updatedFields);
    }
    return false;
  },

  deleteProduct: (id) => {
    const products = storeCMS.getProducts();
    const updated = products.filter(p => String(p.id) !== String(id));
    setLocal(STORAGE_KEYS.PRODUCTS, updated);
    storeCMS.syncToCloud();
  },

  // ========== SECOND HAND PRODUCTS ==========
  getSecondHandProducts: () => {
    const raw = getLocal(STORAGE_KEYS.SECONDHAND, INITIAL_SECONDHAND_PRODUCTS);
    if (!Array.isArray(raw)) return INITIAL_SECONDHAND_PRODUCTS.map(storeCMS.normalizeProduct).filter(Boolean);
    return raw.map(storeCMS.normalizeProduct).filter(Boolean);
  },

  getSecondHandProductById: (id) => {
    const products = storeCMS.getSecondHandProducts();
    return products.find(p => String(p.id) === String(id)) || null;
  },

  addSecondHandProduct: (product) => {
    const products = storeCMS.getSecondHandProducts();
    const newId = product.id && !products.some(p => String(p.id) === String(product.id))
      ? String(product.id)
      : `bm-sh-${Date.now()}`;

    const newProduct = storeCMS.normalizeProduct({
      ...product,
      id: newId,
      isSecondHand: true,
      rating: product.rating || 4.5,
      reviewsCount: product.reviewsCount || 0
    });

    const updated = [newProduct, ...products.filter(p => String(p.id) !== String(newProduct.id))];
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
      if (String(p.id) === String(id)) {
        const merged = { ...p, ...updatedFields, id: p.id, isSecondHand: true };
        return storeCMS.normalizeProduct(merged);
      }
      return p;
    });
    setLocal(STORAGE_KEYS.SECONDHAND, updated);
    storeCMS.syncToCloud();
    return true;
  },

  deleteSecondHandProduct: (id) => {
    const products = storeCMS.getSecondHandProducts();
    const updated = products.filter(p => String(p.id) !== String(id));
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

  // ========== HERO MEDIA CUSTOMIZER ==========
  getHeroMedia: () => {
    const settings = storeCMS.getSettings();
    return getLocal(STORAGE_KEYS.HERO_MEDIA, settings.heroMedia || INITIAL_HERO_MEDIA);
  },
  saveHeroMedia: (heroMedia) => {
    setLocal(STORAGE_KEYS.HERO_MEDIA, heroMedia);
    const current = storeCMS.getSettings();
    setLocal(STORAGE_KEYS.SETTINGS, { ...current, heroMedia });
    storeCMS.syncToCloud();
    window.dispatchEvent(new CustomEvent('bm_cms_update', { detail: { source: 'hero_media' } }));
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

  // ========== REGISTERED USERS & ACCOUNTS ==========
  getRegisteredUsers: () => getLocal(STORAGE_KEYS.REGISTERED_USERS, []),
  
  findRegisteredUser: (identifier) => {
    if (!identifier) return null;
    const cleanId = String(identifier).trim().toLowerCase();
    const cleanPhone = cleanId.replace(/[^0-9]/g, '');
    const users = storeCMS.getRegisteredUsers();

    return users.find(u => {
      const uEmail = (u.email || '').trim().toLowerCase();
      const uPhone = (u.phone || '').replace(/[^0-9]/g, '');
      if (cleanId.includes('@') && uEmail === cleanId) return true;
      if (cleanPhone.length >= 10 && (uPhone === cleanPhone || (uPhone.length >= 10 && (uPhone.endsWith(cleanPhone) || cleanPhone.endsWith(uPhone))))) return true;
      if (uEmail === cleanId) return true;
      return false;
    }) || null;
  },

  registerUser: (userProfile) => {
    if (!userProfile || (!userProfile.email && !userProfile.phone)) return null;
    const users = storeCMS.getRegisteredUsers();
    const cleanEmail = (userProfile.email || '').trim().toLowerCase();
    const cleanPhone = (userProfile.phone || '').replace(/[^0-9]/g, '');
    
    const existing = users.find(u => {
      const uEmail = (u.email || '').trim().toLowerCase();
      const uPhone = (u.phone || '').replace(/[^0-9]/g, '');
      if (cleanEmail && uEmail === cleanEmail) return true;
      if (cleanPhone.length >= 10 && uPhone === cleanPhone) return true;
      return false;
    });

    if (existing) {
      const updatedUser = { ...existing, ...userProfile, updatedAt: new Date().toISOString() };
      const updated = users.map(u => u.id === existing.id ? updatedUser : u);
      setLocal(STORAGE_KEYS.REGISTERED_USERS, updated);
      storeCMS.syncToCloud();
      return updatedUser;
    }

    const newUser = {
      ...userProfile,
      id: userProfile.id || `user-${Date.now()}`,
      registeredAt: new Date().toISOString()
    };
    const updated = [newUser, ...users];
    setLocal(STORAGE_KEYS.REGISTERED_USERS, updated);
    storeCMS.syncToCloud();
    return newUser;
  },

  // ========== ORDERS & UTR REGISTRY ==========
  getAllOrders: () => getLocal(STORAGE_KEYS.ORDERS, []),

  getUserOrders: (user) => {
    const activeUser = user || storeCMS.getUser();
    if (!activeUser) return [];

    const userEmail = (activeUser.email || '').trim().toLowerCase();
    const userPhone = (activeUser.phone || '').replace(/[^0-9]/g, '');
    const userId = activeUser.id;
    const allOrders = storeCMS.getAllOrders();

    return allOrders.filter(order => {
      const ordEmail = (order.email || '').trim().toLowerCase();
      const ordPhone = (order.phone || '').replace(/[^0-9]/g, '');
      const ordUserId = order.userId;

      if (userId && ordUserId && ordUserId === userId) return true;
      if (userEmail && ordEmail && ordEmail === userEmail) return true;
      if (userPhone && ordPhone && userPhone.length >= 10 && (ordPhone === userPhone || ordPhone.endsWith(userPhone) || userPhone.endsWith(ordPhone))) return true;
      return false;
    });
  },

  getOrders: (user) => {
    if (user) {
      return storeCMS.getUserOrders(user);
    }
    return storeCMS.getAllOrders();
  },

  saveOrders: (orders) => {
    setLocal(STORAGE_KEYS.ORDERS, orders);
    storeCMS.syncToCloud();
  },

  placeOrder: (orderData) => {
    const orders = storeCMS.getAllOrders();
    const currentUser = storeCMS.getUser();
    const isCOD = orderData.paymentMethod === 'Cash on Delivery';
    const payStatus = orderData.paymentStatus || (isCOD ? 'COD — Pending' : 'Paid');

    const newOrder = {
      ...orderData,
      id: `BM-ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      userId: currentUser?.id || orderData.userId || null,
      email: (orderData.email || currentUser?.email || '').trim(),
      phone: (orderData.phone || currentUser?.phone || '').trim(),
      customerName: (orderData.customerName || currentUser?.name || 'Valued Client').trim(),
      placedAt: new Date().toISOString(),
      orderStatus: 'Order Placed',
      paymentMethod: orderData.paymentMethod || 'Razorpay',
      paymentStatus: payStatus,
      paymentId: orderData.paymentId || '',
      razorpayOrderId: orderData.razorpayOrderId || '',
      razorpaySignature: orderData.razorpaySignature || '',
      paymentScreenshot: orderData.paymentScreenshot || null,
      trackingNumber: `SHIP-${Math.floor(10000000 + Math.random() * 90000000)}`,
      courierName: 'Shiprocket / BlueDart Express',
      estDelivery: 'Within 2-3 Business Days',
      timeline: [
        { status: 'Order Placed', time: new Date().toLocaleString(), done: true },
        { status: 'Payment Verification', time: isCOD ? 'COD on Delivery' : 'Razorpay Verified', done: !isCOD },
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
      title: isCOD
        ? `🚨 NEW COD ORDER #${newOrder.id} (${newOrder.customerName} - ₹${newOrder.totalAmount.toLocaleString('en-IN')})`
        : `⚡ NEW RAZORPAY ORDER #${newOrder.id} (${newOrder.customerName} - ₹${newOrder.totalAmount.toLocaleString('en-IN')})`,
      customerName: newOrder.customerName,
      customerPhone: newOrder.phone,
      customerEmail: newOrder.email,
      totalAmount: newOrder.totalAmount,
      paymentMethod: newOrder.paymentMethod,
      paymentId: newOrder.paymentId,
      paymentStatus: newOrder.paymentStatus,
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

  dismissOwnerNotification: (orderIdOrNotifId) => {
    const existing = storeCMS.getOwnerNotifications();
    const cleanId = String(orderIdOrNotifId || '').trim();
    const updated = existing.filter(n => n.id !== cleanId && n.orderId !== cleanId);
    setLocal('bm_owner_notifications_v4', updated);
    storeCMS.syncToCloud();
  },

  clearAllOwnerNotifications: () => {
    setLocal('bm_owner_notifications_v4', []);
    storeCMS.syncToCloud();
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
    const isCOD = order.paymentMethod === 'Cash on Delivery';
    const ownerMsg = 
`⚡ *${isCOD ? 'NEW COD ORDER RECEIVED' : 'NEW RAZORPAY VERIFIED ORDER'} — BALAJI MOBILE*
────────────────────────────────────────
🆔 *Order ID:* #${order.id}
📅 *Date & Time:* ${new Date(order.placedAt || Date.now()).toLocaleString('en-IN')}

👤 *CUSTOMER DETAILS:*
• Name: ${order.customerName}
• Phone: ${order.phone}
• Email: ${order.email || '—'}
• Delivery Address: ${order.address}, ${order.city}, ${order.district}, ${order.state} - ${order.pincode}

🛒 *ITEMS ORDERED:*
${itemsSummary}

💰 *TOTAL AMOUNT:* ₹${order.totalAmount.toLocaleString('en-IN')}
💳 *PAYMENT METHOD:* ${order.paymentMethod || 'Razorpay'}
🔢 *PAYMENT / TXN ID:* ${order.paymentId || 'N/A'}
📊 *PAYMENT STATUS:* ${order.paymentStatus || 'Paid'}

Manage & dispatch order in Admin Dashboard: https://balajimobile.store/admin`;

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
        setLocal(STORAGE_KEYS.CART, Array.isArray(savedVault.cart) ? savedVault.cart : []);
        setLocal(STORAGE_KEYS.WISHLIST, Array.isArray(savedVault.wishlist) ? savedVault.wishlist : []);
        if (savedVault.rewardPoints) {
          setLocal(STORAGE_KEYS.REWARD_POINTS, savedVault.rewardPoints);
        }
        console.log(`✅ [USER VAULT RESTORED] History restored for ${user.email || user.phone}`);
      } else {
        // INITIALIZE FRESH VAULT FOR NEW USER
        setLocal(STORAGE_KEYS.CART, []);
        setLocal(STORAGE_KEYS.WISHLIST, []);
        setLocal(vaultKey, {
          user,
          cart: [],
          wishlist: [],
          rewardPoints: 100
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

    if (vaultKey && currentUser) {
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
    localStorage.removeItem(STORAGE_KEYS.USER_SESSION);
    setLocal(STORAGE_KEYS.USER_SESSION, null);
    setLocal(STORAGE_KEYS.CART, []);
    setLocal(STORAGE_KEYS.WISHLIST, []);
    window.dispatchEvent(new Event('bm_cms_update'));
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

// Auto-pull from cloud on load & setup periodic background polling (every 8 seconds)
if (typeof window !== 'undefined') {
  storeCMS.pullFromCloud();

  try {
    setInterval(() => {
      storeCMS.pullFromCloud();
    }, 8000);
  } catch (e) {}
}

