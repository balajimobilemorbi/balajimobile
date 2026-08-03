import { storeCMS } from './storeCMS';
import { userIntentService } from './userIntentService';

/**
 * BM AI — Ultra-Intelligent Conversational AI Assistant for Balaji Mobile
 * Human-like chat, budget range filtering, live stock specs & order tracking.
 */
export const aiChatService = {
  /**
   * Process user input and return intelligent response with text & interactive data widgets.
   */
  processMessage: async (userMessage, history = [], lang = 'gu') => {
    const rawQuery = (userMessage || '').trim();
    const q = rawQuery.toLowerCase();

    // Track search query for intent analytics
    userIntentService.trackSearch(rawQuery);

    // Load live store snapshot
    const products = storeCMS.getProducts() || [];
    const secondHand = storeCMS.getSecondHandProducts() || [];
    const allProducts = [...products, ...secondHand];
    const orders = storeCMS.getOrders() || [];
    const coupons = storeCMS.getCoupons() || [];
    const locations = storeCMS.getLocations() || [];

    let response = {
      id: `bm-ai-${Date.now()}`,
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: '',
      type: 'text',
      data: null
    };

    // ====================================================
    // 1. CONVERSATIONAL ADD TO CART COMMAND
    // ====================================================
    const isAddToCartQuery = q.includes('add to cart') || 
      q.includes('add to card') || 
      q.includes('cart ma') || 
      q.includes('cart me') || 
      q.includes('add kar') || 
      q.includes('buy') || 
      q.includes('khared');

    if (isAddToCartQuery) {
      const matched = findBestProductMatch(q, allProducts);
      const currentUser = storeCMS.getUser();

      if (!currentUser) {
        response.type = 'auth_required';
        response.data = matched;
        if (lang === 'hi') {
          response.text = `🔒 **लॉगिन आवश्यक है**: **${matched.title}** को कार्ट में जोड़ने के लिए पहले लॉगिन करें।`;
        } else if (lang === 'en') {
          response.text = `🔒 **Login Required**: Please log in with your Mobile Number or Google ID to add **${matched.title}** to your cart.`;
        } else {
          response.text = `🔒 **લોગઈન જરૂરી છે**: **${matched.title}** ને કાર્ટમાં ઉમેરવા માટે પહેલાં લોગઈન કરો.`;
        }
        return response;
      } else {
        storeCMS.addToCart(matched, 1);
        response.type = 'added_to_cart';
        response.data = matched;
        if (lang === 'hi') {
          response.text = `✅ **कार्ट में जोड़ा गया!**: **${matched.title}** (₹${matched.bmPrice.toLocaleString('en-IN')}) आपके कार्ट में जोड़ दिया गया है!`;
        } else if (lang === 'en') {
          response.text = `✅ **Added to Bag!**: **${matched.title}** (₹${matched.bmPrice.toLocaleString('en-IN')}) has been added to your shopping bag!`;
        } else {
          response.text = `✅ **કાર્ટમાં ઉમેરાઈ ગયું!**: **${matched.title}** (₹${matched.bmPrice.toLocaleString('en-IN')}) સફળતાપૂર્વક તમારા કાર્ટમાં ઉમેરાઈ ગયું છે!`;
        }
        return response;
      }
    }

    // ====================================================
    // 2. BUDGET & PRICE RANGE DETECTOR
    // Example: "20000 to 30000", "under 50k", "phones between 20k-30k", "around 1 lakh"
    // ====================================================
    const budgetMatch = parseBudgetFilter(q);
    if (budgetMatch) {
      let filtered = allProducts.filter(p => {
        const price = p.bmPrice;
        let matchPrice = price >= budgetMatch.min && price <= budgetMatch.max;
        if (budgetMatch.brand) {
          matchPrice = matchPrice && p.brand.toLowerCase().includes(budgetMatch.brand);
        }
        return matchPrice;
      });

      if (filtered.length === 0) {
        // Fallback to closest products
        filtered = allProducts.filter(p => p.bmPrice <= budgetMatch.max + 10000).slice(0, 4);
      }

      response.type = 'product_list';
      response.data = filtered.slice(0, 6);

      const minStr = budgetMatch.min.toLocaleString('en-IN');
      const maxStr = budgetMatch.max.toLocaleString('en-IN');

      if (lang === 'hi') {
        response.text = `📱 **BM AI बजट फ़िल्टर परिणाम**:\n\n₹${minStr} से ₹${maxStr} के बजट में उपलब्ध हमारे सर्वश्रेष्ठ स्मार्टफ़ोन (कुल ${filtered.length} मॉडल मिले):`;
      } else if (lang === 'en') {
        response.text = `📱 **BM AI Budget Search Results**:\n\nHere are the top smartphones available in your budget of **₹${minStr} - ₹${maxStr}** (${filtered.length} devices found in stock):`;
      } else {
        response.text = `📱 **BM AI બજેટ સર્ચ રિઝલ્ટ**:\n\n₹${minStr} થી ₹${maxStr} ના બજેટમાં બાલજી મોબાઈલ સ્ટોકમાંથી ઉપલબ્ધ શ્રેષ્ઠ સ્માર્ટફોન્સ (કુલ ${filtered.length} મોડેલ મળ્યા):`;
      }
      return response;
    }

    // ====================================================
    // 3. SPECIFIC PHONE SEARCH & DETAILED SPECS / CONDITION
    // ====================================================
    const specificProduct = findExactOrBestProductMatch(q, allProducts);
    const mentionsPhoneSpecs = q.includes('spec') || q.includes('feature') || q.includes('camera') || 
      q.includes('ram') || q.includes('storage') || q.includes('battery') || 
      q.includes('processor') || q.includes('display') || q.includes('condition') || 
      q.includes('warranty') || q.includes('color') || q.includes('details');

    if (specificProduct && (mentionsPhoneSpecs || isMentioningProductTitle(q, specificProduct))) {
      response.type = 'product_card';
      response.data = specificProduct;

      const isSecondHand = specificProduct.id.startsWith('sh-') || (specificProduct.condition && specificProduct.condition.toLowerCase().includes('pre-owned'));
      const conditionBadge = specificProduct.condition || (isSecondHand ? 'Certified Pre-Owned' : 'Brand New Sealed Box');
      const gstType = isSecondHand ? 'Shop Bill (Pre-Owned)' : '18% Original GST Bill';

      if (lang === 'hi') {
        response.text = `📱 **${specificProduct.title}** (BM AI जानकारी):\n\n• 💰 **मूल्य**: ₹${specificProduct.bmPrice.toLocaleString('en-IN')} (MRP ₹${specificProduct.marketPrice.toLocaleString('en-IN')})\n• 💾 **RAM/ROM**: ${specificProduct.ram || 'Multiple'} • ${specificProduct.storage || 'Variants'}\n• 🎨 **Color Finish**: ${specificProduct.color || 'Available Colors'}\n• ⚡ **प्रोसेसर**: ${specificProduct.processor || 'Flagship Chip'}\n• 📷 **कैमरा**: ${specificProduct.camera || 'Pro HD Camera'}\n• 🔋 **बैटरी/हेल्थ**: ${specificProduct.battery || 'Long Life Battery'} ${specificProduct.batteryHealth ? `(${specificProduct.batteryHealth})` : ''}\n• 🧾 **GST Bill**: ${gstType}\n• 🛡️ **वारंटी**: ${specificProduct.warranty || 'Official Warranty'}\n• 📦 **स्टॉक**: ${specificProduct.stock || 1} इकाइयाँ उपलब्ध`;
      } else if (lang === 'en') {
        response.text = `📱 **${specificProduct.title}** (BM AI Live Overview):\n\n• 💰 **BM Special Price**: ₹${specificProduct.bmPrice.toLocaleString('en-IN')} (Market Price ₹${specificProduct.marketPrice.toLocaleString('en-IN')})\n• 💾 **RAM & Storage**: ${specificProduct.ram || 'Multiple'} • ${specificProduct.storage || 'Variants'}\n• 🎨 **Color Finish**: ${specificProduct.color || 'Multiple Colors'}\n• ⚡ **Processor**: ${specificProduct.processor || 'Flagship'}\n• 📷 **Camera**: ${specificProduct.camera || 'Ultra HD'}\n• 🔋 **Battery & Health**: ${specificProduct.battery || 'High Capacity'} ${specificProduct.batteryHealth ? `(${specificProduct.batteryHealth})` : ''}\n• 🧾 **Bill Type**: ${gstType}\n• 🛡️ **Condition & Warranty**: ${conditionBadge} • ${specificProduct.warranty || 'Store Warranty'}\n• 📦 **Current Stock**: ${specificProduct.stock || 1} units available`;
      } else {
        response.text = `📱 **${specificProduct.title}** (BM AI લાઈવ વિગતો):\n\n• 💰 **BM Special Price**: ₹${specificProduct.bmPrice.toLocaleString('en-IN')} (માર્કેટ ભાવ ₹${specificProduct.marketPrice.toLocaleString('en-IN')})\n• 💾 **RAM/ROM**: ${specificProduct.ram || 'મલ્ટીપલ'} • ${specificProduct.storage || 'વેરિઅન્ટ્સ'}\n• 🎨 **કલર**: ${specificProduct.color || 'ઉપલબ્ધ કલર્સ'}\n• ⚡ **પ્રોસેસર**: ${specificProduct.processor || 'ફ્લેગશિપ ચિપ'}\n• 📷 **કેમેરા**: ${specificProduct.camera || 'પ્રો HD કેમેરા'}\n• 🔋 **બેટરી હેલ્થ**: ${specificProduct.battery || 'લોંગ લાઈફ'} ${specificProduct.batteryHealth ? `(${specificProduct.batteryHealth})` : ''}\n• 🧾 **બિલ પ્રકાર**: ${gstType}\n• 🛡️ **કન્ડિશન & વોરંટી**: ${conditionBadge} • ${specificProduct.warranty || 'વોરંટી'}\n• 📦 **સ્ટોક**: ${specificProduct.stock || 1} પીસ બાકી`;
      }
      return response;
    }

    // ====================================================
    // 4. ORDER TRACKING & STATUS
    // ====================================================
    const orderIdMatch = rawQuery.match(/BM-ORD-\d+/i) || rawQuery.match(/ORD-\d+/i) || rawQuery.match(/\b\d{5}\b/);
    const isOrderQuery = orderIdMatch || 
      q.includes('order') || q.includes('track') || q.includes('pochyo') || 
      q.includes('pohanch') || q.includes('kahan hai') || q.includes('kya chhe');

    if (isOrderQuery) {
      let targetOrder = null;
      if (orderIdMatch) {
        const cleanId = orderIdMatch[0].toUpperCase();
        targetOrder = orders.find(o => o.id.toUpperCase().includes(cleanId));
      } else if (orders.length > 0) {
        targetOrder = orders[0];
      }

      if (targetOrder) {
        response.type = 'order_tracking';
        if (lang === 'hi') {
          response.text = `यह आपके ऑर्डर **#${targetOrder.id}** की लाइव स्थिति है:`;
        } else if (lang === 'en') {
          response.text = `Here is the current status for Order **#${targetOrder.id}**:`;
        } else {
          response.text = `આ રહ્યો તમારા ઓર્ડર **#${targetOrder.id}** નો લાઈવ સ્ટેટસ:`;
        }
        response.data = targetOrder;
        return response;
      } else if (orderIdMatch) {
        response.text = lang === 'hi' ? `ऑर्डर **${orderIdMatch[0]}** नहीं मिला। कृपया अपना सही ID दर्ज करें।` : lang === 'en' ? `Order **${orderIdMatch[0]}** not found. Please verify your Order ID.` : `માફ કરશો, **${orderIdMatch[0]}** ઓર્ડર મળ્યો નથી.`;
        return response;
      }
    }

    // ====================================================
    // 5. 360° DEGREE VIEW & PHOTOS
    // ====================================================
    if (q.includes('360') || q.includes('rotat') || q.includes('spin') || q.includes('photo') || q.includes('phota') || q.includes('pic') || q.includes('image')) {
      const match360 = specificProduct || allProducts[0];
      response.type = 'product_360';
      response.text = lang === 'hi' ? `यह रहा **${match360.title}** का HD 360° व्यू:` : lang === 'en' ? `Here is the interactive **360° View** for **${match360.title}**:` : `આ રહ્યો **${match360.title}** નો HD photo અને 360° Interactive View:`;
      response.data = match360;
      return response;
    }

    // ====================================================
    // 6. COUPONS & OFFERS QUERY
    // ====================================================
    if (q.includes('coupon') || q.includes('discount') || q.includes('offer') || q.includes('promo') || q.includes('code')) {
      response.type = 'coupon_list';
      response.text = lang === 'hi' ? `🎉 यह रहे BM Mobile के सभी एक्टिव **Discount Coupons**: ` : lang === 'en' ? `🎉 Here are all active **Discount Coupons & Offers** at BM Mobile:` : `🎉 આ રહ્યા હાલમાં એક્ટિવ BM Mobile ના તમામ **Discount Coupons & Offers**:`;
      response.data = coupons;
      return response;
    }

    // ====================================================
    // 7. STORE LOCATION & CONTACT QUERY
    // ====================================================
    if (q.includes('address') || q.includes('location') || q.includes('dukan') || q.includes('shop') || q.includes('morbi') || q.includes('contact') || q.includes('phone') || q.includes('email')) {
      response.type = 'store_location';
      response.text = lang === 'hi' ? `📍 **BM Mobile Shop का पता और संपर्क विवरण**: ` : lang === 'en' ? `📍 **BM Mobile Official Store Address & Contact**: ` : `📍 **BM Mobile Shop Address & Contact**:`;
      response.data = locations;
      return response;
    }

    // ====================================================
    // 8. NATURAL CHATGPT-LIKE HUMAN CONVERSATION
    // ====================================================
    const isGreeting = q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('namaste') || q.includes('kem chho') || q.includes('kem cho') || q.includes('good morning') || q.includes('good evening');
    const isWhoAreYou = q.includes('who are you') || q.includes('who r u') || q.includes('naam shu') || q.includes('kon ho') || q.includes('what can you do') || q.includes('bm ai');

    if (isGreeting || isWhoAreYou) {
      response.type = 'text';
      if (lang === 'hi') {
        response.text = `नमस्ते! 👋 मैं **BM AI** हूँ — बालजी मोबाइल का आधिकारिक इंटेलिजेंट AI असिस्टेंट।\n\nमैं आपकी क्या सहायता कर सकता हूँ?\n• किसी भी बजट में फोन ढूंढना (उदा. "20000 से 30000 के फोन")\n• iPhone, Samsung या OnePlus के स्पेक्स और कीमत देखना\n• सेकिंड हैंड (Pre-Owned) फोन की कंडीशन और वारंटी जांचना\n• अपने लाइव ऑर्डर को ट्रैक करना\n\nआप मुझसे बेझिझक कुछ भी पूछ सकते हैं!`;
      } else if (lang === 'en') {
        response.text = `Hello there! 👋 I am **BM AI** — the official intelligent AI assistant for Balaji Mobile Showroom.\n\nHere is how I can assist you:\n• Find phones in any budget (e.g. "phones under 30k" or "20000 to 30000")\n• Get exact specs, live prices & discounts for any iPhone, Samsung, or OnePlus model\n• Inspect certified pre-owned devices, GST bills, and battery health\n• Track your live order status\n\nHow can I help you today?`;
      } else {
        response.text = `નમસ્તે! 👋 હું **BM AI** છું — બાલજી મોબાઈલનો ઓફિશિયલ ઈન્ટેલિજન્ટ AI અસિસ્ટન્ટ.\n\nહું તમને આ બધી બાબતોમાં મદદ કરી શકું છું:\n• કોઈપણ બજેટમાં ફોન શોધવો (જેમ કે "20000 થી 30000 ના ફોન")\n• iPhone, Samsung કે OnePlus ની લાઈવ કિંમત અને સ્પેક્સ બતાવવા\n• સેકન્ડ હેન્ડ (Pre-Owned) ફોનની કન્ડિશન, બેટરી હેલ્થ અને બિલ ચેક કરવું\n• તમારો લાઈવ ઓર્ડર ટ્રેક કરવો\n\nતમે મને મુક્તપણે કોઈપણ પ્રશ્ન પૂછી શકો છો!`;
      }
      return response;
    }

    // ====================================================
    // 9. GENERAL TECH ADVICE & COMPARISON AI CHAT
    // ====================================================
    if (q.includes('best') || q.includes('which') || q.includes('recommend') || q.includes('sugest') || q.includes('compare') || q.includes('vs')) {
      const topPick = allProducts[0];
      response.type = 'product_card';
      response.data = topPick;

      if (lang === 'hi') {
        response.text = `🤖 **BM AI की सलाह**:\n\nवर्तमान में प्रदर्शन, कैमरा और रीसेल वैल्यू के मामले में **${topPick.title}** सबसे लोकप्रिय विकल्प है। इसमें ${topPick.processor} और ${topPick.camera} शामिल हैं।\n\nक्या आप अपना विशेष बजट या पसंदीदा ब्रांड बताना चाहेंगे ताकि मैं और सटीक सुझाव दे सकूं?`;
      } else if (lang === 'en') {
        response.text = `🤖 **BM AI Tech Advisory**:\n\nBased on current performance, camera capability, and resale value, **${topPick.title}** is currently one of the highest-rated devices in our Morbi showroom.\n\nIt features a ${topPick.processor} processor and ${topPick.camera}. Mention your exact budget (e.g. "phones under 40k") for more tailored suggestions!`;
      } else {
        response.text = `🤖 **BM AI ની સલાહ**:\n\nહાલમાં પર્ફોર્મન્સ, કેમેરા અને ગેરંટીની બાબતમાં **${topPick.title}** સૌથી પોપ્યુલર ચોઈસ છે. તેમાં ${topPick.processor} અને ${topPick.camera} છે.\n\nતમારું બજેટ જણાવો (જેમ કે "20000 થી 30000 ના ફોન") જેથી હું તમને એક્યુરેટ સજેશન આપી શકું!`;
      }
      return response;
    }

    // ====================================================
    // 10. DEFAULT INTELLIGENT FALLBACK
    // ====================================================
    const matched = specificProduct || allProducts[0];
    response.type = 'product_card';
    response.data = matched;

    if (lang === 'hi') {
      response.text = `🤖 **BM AI**: आपके प्रश्न के अनुसार हमारे स्टोर से **${matched.title}** (₹${matched.bmPrice.toLocaleString('en-IN')}) की जानकारी नीचे दी गई है:`;
    } else if (lang === 'en') {
      response.text = `🤖 **BM AI**: Based on your query, here are the live showroom details for **${matched.title}** (₹${matched.bmPrice.toLocaleString('en-IN')}):`;
    } else {
      response.text = `🤖 **BM AI**: તમારા પ્રશ્ન માટે બાલજી મોબાઈલ સ્ટોકમાંથી **${matched.title}** (₹${matched.bmPrice.toLocaleString('en-IN')}) ની વિગત નીચે મુજબ છે:`;
    }
    return response;
  }
};

// ====================================================
// HELPER FUNCTIONS FOR BUDGET & PRODUCT PARSING
// ====================================================

/**
 * Parses queries like "20000 to 30000", "under 50k", "between 20k-30k", "around 1 lakh"
 */
function parseBudgetFilter(query) {
  const q = query.toLowerCase();

  let brand = null;
  const knownBrands = ['apple', 'iphone', 'samsung', 'oneplus', 'pixel', 'vivo', 'oppo', 'realme', 'xiaomi', 'poco', 'motorola', 'iqoo', 'nothing'];
  for (let b of knownBrands) {
    if (q.includes(b)) {
      brand = b === 'iphone' ? 'apple' : b;
      break;
    }
  }

  // Parse ranges like "20k to 30k", "20000 to 30000", "under 20k to 30k", "20k - 30k", "between 20k and 30k"
  const rangeMatch = q.match(/(\d+)\s*k?\s*(?:to|-|thi|se|se leke|and)\s*(\d+)\s*k?/i) || 
                     q.match(/(\d+)\s*000\s*(?:to|-|thi|se|and)\s*(\d+)\s*000/i) ||
                     q.match(/between\s*(\d+)\s*k?\s*and\s*(\d+)\s*k?/i);
  if (rangeMatch) {
    let min = parseInt(rangeMatch[1]);
    let max = parseInt(rangeMatch[2]);
    if (min < 1000) min *= 1000;
    if (max < 1000) max *= 1000;
    if (min > max) [min, max] = [max, min];
    return { min, max, brand };
  }

  // Parse "under 30000", "under 30k", "below 50k", "under 20k"
  const underMatch = q.match(/(?:under|below|less than|sudhi|sudi|ni andar|andar)\s*(\d+)\s*k?/i) || 
                     q.match(/(\d+)\s*k?\s*(?:under|below|sudhi|sudi|ni andar|andar)/i);
  if (underMatch) {
    let val = parseInt(underMatch[1]);
    if (val < 1000) val *= 1000;
    return { min: 0, max: val, brand };
  }

  // Parse "above 50k" or "over 80000"
  const aboveMatch = q.match(/(?:above|over|more than|uparse|thi vadhu)\s*(\d+)\s*k?/i);
  if (aboveMatch) {
    let val = parseInt(aboveMatch[1]);
    if (val < 1000) val *= 1000;
    return { min: val, max: 500000, brand };
  }

  // Parse "lakh"
  if (q.includes('lakh') || q.includes('lac')) {
    if (q.includes('under') || q.includes('below')) {
      return { min: 0, max: 100000, brand };
    }
    return { min: 80000, max: 150000, brand };
  }

  return null;
}

function findExactOrBestProductMatch(query, products) {
  const q = query.toLowerCase();
  for (let p of products) {
    const title = p.title.toLowerCase();
    const brand = p.brand.toLowerCase();
    if (q.includes(title) || (q.includes(brand) && title.split(' ').some(w => w.length > 2 && q.includes(w)))) {
      return p;
    }
  }
  return findBestProductMatch(query, products);
}

function findBestProductMatch(query, products) {
  const q = query.toLowerCase();
  return products.find(p => {
    const title = p.title.toLowerCase();
    const brand = p.brand.toLowerCase();
    return q.includes(brand) || title.split(' ').some(w => w.length > 2 && q.includes(w));
  }) || products[0];
}

function isMentioningProductTitle(query, product) {
  if (!product) return false;
  const q = query.toLowerCase();
  const title = product.title.toLowerCase();
  const brand = product.brand.toLowerCase();
  return q.includes(brand) || title.split(' ').some(w => w.length > 3 && q.includes(w));
}
