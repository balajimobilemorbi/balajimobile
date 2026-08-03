import { storeCMS } from './storeCMS';

const INTENT_KEY = 'bm_user_intents_v4';
const USER_PHONE_KEY = 'bm_active_user_phone_v4';

const getStorage = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStorage = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {}
};

export const userIntentService = {
  /**
   * Set active logged-in or entered customer phone number
   */
  setUserPhone: (phone) => {
    if (!phone) return;
    const cleanPhone = String(phone).replace(/[^0-9]/g, '');
    if (cleanPhone.length >= 10) {
      localStorage.setItem(USER_PHONE_KEY, cleanPhone);
    }
  },

  /**
   * Get active logged-in customer phone number (defaults to user 7990648756 if none)
   */
  getUserPhone: () => {
    return localStorage.getItem(USER_PHONE_KEY) || '7990648756';
  },

  /**
   * Record a customer search query or interest
   */
  trackSearch: (searchQuery) => {
    if (!searchQuery || searchQuery.trim().length < 2) return;
    const phone = userIntentService.getUserPhone();
    const profiles = getStorage(INTENT_KEY, {});

    const userProfile = profiles[phone] || {
      phone,
      searches: [],
      cartItems: [],
      budget: 0,
      updatedAt: new Date().toISOString()
    };

    const cleanQuery = searchQuery.trim().toLowerCase();
    if (!userProfile.searches.includes(cleanQuery)) {
      userProfile.searches.unshift(cleanQuery);
      if (userProfile.searches.length > 10) userProfile.searches.pop();
    }

    // Detect price budget (e.g. "under 70000")
    const budgetMatch = cleanQuery.match(/under\s*₹?\s*(\d+)/i) || cleanQuery.match(/(\d+)\s*k/i);
    if (budgetMatch) {
      let maxP = parseInt(budgetMatch[1], 10);
      if (cleanQuery.includes('k')) maxP = maxP * 1000;
      userProfile.budget = maxP;
    }

    userProfile.updatedAt = new Date().toISOString();
    profiles[phone] = userProfile;
    setStorage(INTENT_KEY, profiles);
  },

  /**
   * Record an item added to cart (abandoned intent tracking)
   */
  trackCartItem: (product) => {
    if (!product) return;
    const phone = userIntentService.getUserPhone();
    const profiles = getStorage(INTENT_KEY, {});

    const userProfile = profiles[phone] || {
      phone,
      searches: [],
      cartItems: [],
      budget: 0,
      updatedAt: new Date().toISOString()
    };

    if (!userProfile.cartItems.some(i => i.id === product.id)) {
      userProfile.cartItems.unshift({
        id: product.id,
        title: product.title,
        brand: product.brand,
        price: product.bmPrice,
        addedAt: new Date().toISOString()
      });
    }

    userProfile.updatedAt = new Date().toISOString();
    profiles[phone] = userProfile;
    setStorage(INTENT_KEY, profiles);
  },

  /**
   * Get all tracked intent profiles
   */
  getProfiles: () => {
    const profiles = getStorage(INTENT_KEY, {});
    // Always include sample active profile for phone 7990648756 if empty
    if (!profiles['7990648756']) {
      profiles['7990648756'] = {
        phone: '7990648756',
        searches: ['iphone', 'iphone 15 pro', 'under 140000'],
        cartItems: [
          { id: 'bm-prod-101', title: 'iPhone 15 Pro Max - Natural Titanium', brand: 'Apple', price: 139900 }
        ],
        budget: 140000,
        updatedAt: new Date().toISOString()
      };
      setStorage(INTENT_KEY, profiles);
    }
    return profiles;
  }
};
