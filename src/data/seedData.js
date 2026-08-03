export const INITIAL_PRODUCTS = [
  {
    id: "bm-prod-101",
    title: "iPhone 15 Pro Max - Natural Titanium",
    brand: "Apple",
    model: "A3106",
    ram: "8GB",
    storage: "512GB",
    color: "Natural Titanium",
    processor: "A17 Pro Chip (3nm) with 6-core GPU",
    display: "6.7-inch Super Retina XDR OLED (120Hz ProMotion)",
    camera: "48MP Main + 12MP 5x Telephoto + 12MP Ultra-Wide",
    battery: "4,422 mAh with 20W Fast Charging & MagSafe",
    condition: "Brand New Sealed Box - 100% Battery Health - 1 Year Official Apple Warranty",
    warranty: "1 Year Official Apple India Warranty",
    imei: "359482109847192",
    description: "Forged in titanium and featuring the groundbreaking A17 Pro chip, a customizable Action button, and the most powerful iPhone camera system ever.",
    features: [
      "Titanium design with textured matte glass back",
      "Action button for custom shortcuts",
      "Dynamic Island & Always-On Display",
      "USB-C connector with USB 3 speeds (up to 10Gbps)"
    ],
    specs: {
      "Dimensions": "159.9 x 76.7 x 8.25 mm",
      "Weight": "221 grams",
      "OS": "iOS 17 (Upgradable to iOS 18)",
      "SIM": "Dual SIM (Nano + eSIM)",
      "Water Resistance": "IP68 Certified"
    },
    accessories: ["USB-C Woven Charge Cable (1m)", "SIM Ejector Tool", "Documentation"],
    stock: 14,
    marketPrice: 159900,
    bmPrice: 139900,
    discount: 13,
    rating: 4.9,
    reviewsCount: 128,
    isFeatured: true,
    isTrending: true,
    isNewArrival: false,
    isFlashSale: true,
    dealEndsAt: new Date(Date.now() + 86400000 * 3).toISOString(),
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1695048133021-d64e9a8f4c6e?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1695048133021-d64e9a8f4c6e?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=600&auto=format&fit=crop"
    ],
    videoUrl: "https://www.youtube.com/embed/xqyUdNxWazA"
  },
  {
    id: "bm-prod-102",
    title: "Samsung Galaxy S24 Ultra 5G - Titanium Black",
    brand: "Samsung",
    model: "SM-S928B",
    ram: "12GB",
    storage: "512GB",
    color: "Titanium Black",
    processor: "Snapdragon 8 Gen 3 for Galaxy (4nm)",
    display: "6.8-inch Dynamic AMOLED 2X QHD+ 120Hz (2600 nits Peak)",
    camera: "200MP Main + 50MP 5x Periscope + 10MP 3x + 12MP Ultra-Wide",
    battery: "5,000 mAh with 45W Super Fast Charging",
    condition: "Brand New Sealed Box - 1 Year Official Samsung Warranty",
    warranty: "1 Year Official Samsung India Warranty",
    imei: "354921094829103",
    description: "Welcome to the era of mobile AI. Galaxy AI arrives on S24 Ultra with Circle to Search, Live Translate, Note Assist, and 200MP Quad Tele System.",
    features: [
      "Built-in S Pen with air gestures",
      "Galaxy AI suite integrated into OS",
      "Corning Gorilla Armor anti-reflective glass",
      "Titanium frame construction"
    ],
    specs: {
      "Dimensions": "162.3 x 79.0 x 8.6 mm",
      "Weight": "232 grams",
      "OS": "One UI 6.1 (Android 14)",
      "SIM": "Dual SIM (Nano + eSIM)",
      "Water Resistance": "IP68 Certified"
    },
    accessories: ["USB-C to C Data Cable", "S Pen Built-in", "SIM Ejector"],
    stock: 8,
    marketPrice: 139999,
    bmPrice: 122999,
    discount: 12,
    rating: 4.8,
    reviewsCount: 94,
    isFeatured: true,
    isTrending: true,
    isNewArrival: true,
    isFlashSale: false,
    dealEndsAt: null,
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1000&auto=format&fit=crop"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop"
    ],
    videoUrl: ""
  },
  {
    id: "bm-prod-103",
    title: "OnePlus 12 5G - Silky Black",
    brand: "OnePlus",
    model: "CPH2573",
    ram: "16GB",
    storage: "512GB",
    color: "Silky Black",
    processor: "Snapdragon 8 Gen 3 (4nm)",
    display: "6.82-inch ProXDR 2K 120Hz Curved AMOLED (4500 nits)",
    camera: "4th Gen Hasselblad Camera System (50MP + 64MP 3x Periscope + 48MP)",
    battery: "5,400 mAh with 100W SUPERVOOC & 50W AIRVOOC Wireless",
    condition: "Brand New Sealed Box - 1 Year Official OnePlus Warranty",
    warranty: "1 Year Official OnePlus Warranty",
    imei: "358102948102938",
    description: "Smooth Beyond Belief. Powered by Snapdragon 8 Gen 3, Dual Cryo-velocity VC cooling system, and Hasselblad 4th Gen Camera.",
    features: [
      "100W Wired charge (0 to 100% in 26 mins)",
      "Trinity Engine for hyper-fluid gaming",
      "Alert Slider integrated"
    ],
    specs: {
      "Dimensions": "164.3 x 75.8 x 9.15 mm",
      "Weight": "220 grams",
      "OS": "OxygenOS 14 (Android 14)",
      "SIM": "Dual Nano SIM"
    },
    accessories: ["100W SUPERVOOC Power Adapter", "Red Type-C Cable", "Protective Case"],
    stock: 22,
    marketPrice: 69999,
    bmPrice: 62499,
    discount: 11,
    rating: 4.7,
    reviewsCount: 64,
    isFeatured: true,
    isTrending: true,
    isNewArrival: false,
    isFlashSale: true,
    dealEndsAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    images: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1000&auto=format&fit=crop"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=600&auto=format&fit=crop"
    ],
    videoUrl: ""
  }
];

// CERTIFIED PRE-OWNED SMARTPHONES
export const INITIAL_SECONDHAND_PRODUCTS = [
  {
    id: "bm-sh-201",
    title: "iPhone 13 Pro - Sierra Blue (Certified Pre-Owned)",
    brand: "Apple",
    model: "A2638",
    ram: "6GB",
    storage: "256GB",
    color: "Sierra Blue",
    processor: "A15 Bionic Chip",
    display: "6.1-inch Super Retina XDR OLED (120Hz ProMotion)",
    camera: "12MP Main + 12MP Telephoto + 12MP Ultra-Wide",
    battery: "3,095 mAh",
    batteryHealth: "87%",
    deviceAge: "9 Months Old",
    warrantyStatus: "3 Months Balaji Shop Warranty",
    conditionBadge: "Superb (9/10)",
    hasBill: "Yes - Original GST Bill Available",
    hasBox: "Yes - Original Box & Cable Included",
    condition: "Superb Condition - Flawless display & back glass - Battery Health 87% - All functions 100% verified",
    warranty: "3 Months Balaji Mobile Shop Warranty",
    imei: "352948109283746",
    description: "Certified Pre-Owned iPhone 13 Pro in superb condition. Thoroughly tested across 35 quality checkpoints by Balaji Mobile technicians. Complete peace of mind with shop warranty, bill & original box.",
    features: [
      "All 100% original parts - zero repairs",
      "FaceID & TrueTone working perfectly",
      "All 3 camera lenses tested & calibrated",
      "Comes with original box & GST bill"
    ],
    specs: {
      "Dimensions": "146.7 x 71.5 x 7.65 mm",
      "Weight": "204 grams",
      "OS": "iOS 17",
      "SIM": "Dual SIM (Nano + eSIM)",
      "Battery Health": "87%",
      "Device Age": "9 Months Old"
    },
    accessories: ["Original Box", "Original USB-C Cable", "GST Bill Copy", "Balaji Warranty Card"],
    stock: 2,
    marketPrice: 55000,
    bmPrice: 38999,
    discount: 29,
    rating: 4.6,
    reviewsCount: 18,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1632661674596-df8be86a1e44?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=1000&auto=format&fit=crop"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1632661674596-df8be86a1e44?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=600&auto=format&fit=crop"
    ],
    videoUrl: ""
  },
  {
    id: "bm-sh-202",
    title: "Samsung Galaxy S22 Ultra 5G - Burgundy (Certified Pre-Owned)",
    brand: "Samsung",
    model: "SM-S908B",
    ram: "12GB",
    storage: "256GB",
    color: "Burgundy",
    processor: "Snapdragon 8 Gen 1",
    display: "6.8-inch Dynamic AMOLED 2X 120Hz",
    camera: "108MP Main + 10MP 10x Periscope + 10MP 3x + 12MP Ultra-Wide",
    battery: "5,000 mAh",
    batteryHealth: "91%",
    deviceAge: "1 Year Old",
    warrantyStatus: "3 Months Balaji Shop Warranty",
    conditionBadge: "Like New (9.5/10)",
    hasBill: "Yes - Original GST Bill Available",
    hasBox: "Yes - Original Box & S-Pen Included",
    condition: "Like New Condition - S Pen working 100% - Display flawless - 91% Battery Health",
    warranty: "3 Months Balaji Mobile Shop Warranty",
    imei: "358291048572910",
    description: "Certified Pre-owned Galaxy S22 Ultra 5G with built-in S Pen. Fully tested and verified by Balaji Mobile technicians. Flagship performance at a fraction of brand-new price.",
    features: [
      "Built-in S Pen fully functional with air gestures",
      "Screen in flawless 100% scratchless condition",
      "Original Samsung battery & display",
      "Comes with GST bill & Balaji Warranty"
    ],
    specs: {
      "Dimensions": "163.3 x 77.9 x 8.9 mm",
      "Weight": "229 grams",
      "OS": "One UI 6.0 (Android 14)",
      "SIM": "Dual SIM",
      "Battery Health": "91%",
      "Device Age": "1 Year Old"
    },
    accessories: ["Original S Pen", "Type-C Data Cable", "GST Bill Copy", "Balaji Warranty Card"],
    stock: 1,
    marketPrice: 45000,
    bmPrice: 29999,
    discount: 33,
    rating: 4.8,
    reviewsCount: 14,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=1000&auto=format&fit=crop"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=600&auto=format&fit=crop"
    ],
    videoUrl: ""
  },
  {
    id: "bm-sh-203",
    title: "iPhone 14 Pro Max 256GB - Deep Purple (Certified Pre-Owned)",
    brand: "Apple",
    model: "A2894",
    ram: "6GB",
    storage: "256GB",
    color: "Deep Purple",
    processor: "A16 Bionic Chip (4nm)",
    display: "6.7-inch Super Retina XDR OLED 120Hz ProMotion (Dynamic Island)",
    camera: "48MP Main + 12MP 3x Telephoto + 12MP Ultra-Wide",
    battery: "4,323 mAh",
    batteryHealth: "92%",
    deviceAge: "6 Months Old",
    warrantyStatus: "6 Months Apple Warranty Left",
    conditionBadge: "Like New (9.8/10)",
    hasBill: "Yes - Original GST Bill Available",
    hasBox: "Yes - Original Box & Cable Included",
    condition: "Like New Condition - Flawless 100% scratchless screen & back glass - 92% Battery Health - FaceID & Dynamic Island perfect",
    warranty: "6 Months Apple Official Warranty + 3 Months Shop Warranty",
    imei: "359281048571920",
    description: "Certified Pre-Owned iPhone 14 Pro Max in Deep Purple. Tested across 35 quality checkpoints. Includes original Apple box, USB-C cable, original GST purchase invoice & Apple warranty.",
    features: [
      "Dynamic Island & Always-On Display",
      "48MP Main camera with Quad-pixel sensor",
      "All 100% original Apple parts - never opened or repaired",
      "Includes original GST bill & Apple box"
    ],
    specs: {
      "Dimensions": "160.7 x 77.6 x 7.85 mm",
      "Weight": "240 grams",
      "OS": "iOS 17.5",
      "SIM": "Dual SIM (Nano + eSIM)",
      "Battery Health": "92%",
      "Device Age": "6 Months Old"
    },
    accessories: ["Original Box", "Original Apple Lightning Cable", "GST Invoice Copy", "Balaji Warranty Card"],
    stock: 2,
    marketPrice: 119900,
    bmPrice: 79999,
    discount: 33,
    rating: 4.9,
    reviewsCount: 24,
    isFeatured: true,
    images: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1695048133021-d64e9a8f4c6e?q=80&w=1000&auto=format&fit=crop"
    ],
    frames360: [
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1695048133021-d64e9a8f4c6e?q=80&w=600&auto=format&fit=crop"
    ],
    videoUrl: ""
  }
];

export const INITIAL_CATEGORIES = [
  { id: "cat-1", name: "Flagship Titans", slug: "flagship-titans", count: 24, image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=500&auto=format&fit=crop" },
  { id: "cat-2", name: "Foldables & Flips", slug: "foldables-flips", count: 8, image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=500&auto=format&fit=crop" },
  { id: "cat-3", name: "Pro Gaming Beasts", slug: "pro-gaming", count: 12, image: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=500&auto=format&fit=crop" },
  { id: "cat-4", name: "Camera Kings", slug: "camera-kings", count: 18, image: "https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=500&auto=format&fit=crop" },
  { id: "cat-5", name: "Budget Champions", slug: "budget-champions", count: 30, image: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=500&auto=format&fit=crop" },
  { id: "cat-6", name: "5G Smartphones", slug: "5g-smartphones", count: 40, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=500&auto=format&fit=crop" }
];

// ALL MOBILE BRANDS AVAILABLE IN INDIA
export const INITIAL_BRANDS = [
  { id: "brand-1", name: "Apple", logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=300&auto=format&fit=crop", count: 14 },
  { id: "brand-2", name: "Samsung", logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=300&auto=format&fit=crop", count: 18 },
  { id: "brand-3", name: "OnePlus", logo: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=300&auto=format&fit=crop", count: 10 },
  { id: "brand-4", name: "Google Pixel", logo: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=300&auto=format&fit=crop", count: 7 },
  { id: "brand-5", name: "Xiaomi", logo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=300&auto=format&fit=crop", count: 22 },
  { id: "brand-6", name: "Redmi", logo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=300&auto=format&fit=crop", count: 20 },
  { id: "brand-7", name: "POCO", logo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=300&auto=format&fit=crop", count: 12 },
  { id: "brand-8", name: "Vivo", logo: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=300&auto=format&fit=crop", count: 16 },
  { id: "brand-9", name: "iQOO", logo: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=300&auto=format&fit=crop", count: 8 },
  { id: "brand-10", name: "OPPO", logo: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=300&auto=format&fit=crop", count: 14 },
  { id: "brand-11", name: "Realme", logo: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=300&auto=format&fit=crop", count: 18 },
  { id: "brand-12", name: "Motorola", logo: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=300&auto=format&fit=crop", count: 10 },
  { id: "brand-13", name: "Nokia", logo: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=300&auto=format&fit=crop", count: 6 },
  { id: "brand-14", name: "Nothing", logo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=300&auto=format&fit=crop", count: 4 },
  { id: "brand-15", name: "ASUS ROG", logo: "https://images.unsplash.com/photo-1546054454-aa26e2b734c7?q=80&w=300&auto=format&fit=crop", count: 5 },
  { id: "brand-16", name: "Infinix", logo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=300&auto=format&fit=crop", count: 12 },
  { id: "brand-17", name: "Tecno", logo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=300&auto=format&fit=crop", count: 10 },
  { id: "brand-18", name: "Lava", logo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=300&auto=format&fit=crop", count: 8 },
  { id: "brand-19", name: "Micromax", logo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=300&auto=format&fit=crop", count: 5 },
  { id: "brand-20", name: "Honor", logo: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=300&auto=format&fit=crop", count: 6 },
  { id: "brand-21", name: "Lenovo", logo: "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=300&auto=format&fit=crop", count: 4 },
  { id: "brand-22", name: "Sony Xperia", logo: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=300&auto=format&fit=crop", count: 3 },
  { id: "brand-23", name: "CMF by Nothing", logo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=300&auto=format&fit=crop", count: 2 },
  { id: "brand-24", name: "ITEL", logo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=300&auto=format&fit=crop", count: 8 },
  { id: "brand-25", name: "Coolpad", logo: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?q=80&w=300&auto=format&fit=crop", count: 3 },
  { id: "brand-26", name: "HTC", logo: "https://images.unsplash.com/photo-1580910051074-3eb694886505?q=80&w=300&auto=format&fit=crop", count: 2 }
];

export const INITIAL_HERO_BANNERS = [
  {
    id: "hero-1",
    title: "Luxury Flagship Smartphones in Morbi",
    subtitle: "Experience iPhone 15 Pro Max & Samsung S24 Ultra with instant exchange bonus & 0% EMI at Balaji Mobile.",
    tagline: "BALAJI MOBILE — MORBI, GUJARAT",
    buttonText: "Explore Flagships",
    buttonLink: "/products?category=flagship-titans",
    bgImage: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=1400&auto=format&fit=crop"
  }
];

export const INITIAL_COUPONS = [
  { id: "c1", code: "BM1000", discountType: "fixed", amount: 1000, minOrder: 30000, description: "Flat ₹1,000 Instant Discount" },
  { id: "c2", code: "LUXURY5", discountType: "percentage", amount: 5, minOrder: 50000, description: "5% Extra Discount on Flagships" },
  { id: "c3", code: "BALAJI500", discountType: "fixed", amount: 500, minOrder: 15000, description: "₹500 Off on Orders Above ₹15,000" }
];

export const INITIAL_BLOGS = [
  {
    id: "blog-1",
    title: "iPhone 15 Pro Max vs Samsung Galaxy S24 Ultra: The Ultimate Titanium Battle",
    author: "Balaji Mobile Tech Desk",
    date: "July 18, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?q=80&w=800&auto=format&fit=crop",
    summary: "Comparing display glare, A17 Pro vs Snapdragon 8 Gen 3 performance, and 5x telephoto camera shootouts."
  }
];

export const INITIAL_TESTIMONIALS = [
  {
    id: "t1",
    name: "Jayeshbhai Patel",
    city: "Morbi, Gujarat",
    rating: 5,
    comment: "Ordered the iPhone 15 Pro Max Natural Titanium directly from Balaji Mobile store in Morbi. Super fast delivery and 100% genuine Apple sealed box!",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    productBought: "iPhone 15 Pro Max 512GB"
  }
];

export const INITIAL_STORE_LOCATIONS = [
  {
    id: "store-morbi",
    name: "Balaji Mobile Flagship Store - Morbi",
    city: "Morbi, Gujarat",
    address: "Sanala Road, Near Sky Mall, Morbi, Gujarat 363641, India",
    phone: "+91 79906 48756",
    timing: "Mon - Sun: 9:30 AM - 9:30 PM",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3674.8021!2d70.8351!3d22.8173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39598cd2ab123456%3A0x123456789!2sSanala%20Rd%2C%20Morbi%2C%20Gujarat%20363641!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
  }
];

export const INITIAL_SETTINGS = {
  storeName: "Balaji Mobile",
  tagline: "Premium Smartphones | Best Deals | Trusted Store — Morbi, Gujarat",
  supportEmail: "balajimorbi5@gmail.com",
  supportPhone: "79906 48756",
  whatsappNumber: "+917990648756",
  adminPin: "1234",
  address: "Sanala Road, Near Sky Mall, Morbi, Gujarat 363641, India",
  currency: "₹",
  gstNumber: "24AAACB1234C1Z5",
  // New Arrival section timer (hours from now)
  newArrivalTimerHours: 72,
  newArrivalStartedAt: new Date().toISOString(),
  newArrivalEnabled: true,
  // Flash Deal section timer (hours from now)
  flashDealTimerHours: 24,
  flashDealStartedAt: new Date().toISOString(),
  flashDealEnabled: true,
  // Payment QR code - owner can update this
  paymentUpiId: "javiya36p36-1@oksbi",
  paymentQrImageUrl: "/payment-qr.png"
};
