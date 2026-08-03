import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers, X, ShoppingBag, ArrowRight, Search, Plus, Loader2,
  Globe, Star, CheckCircle2, AlertCircle, ExternalLink,
  Smartphone, Wifi, RefreshCw, Share2
} from 'lucide-react';
import { storeCMS } from '../services/storeCMS';
import { sharePhoneDetails } from '../utils/shareUtils';

// ══════════════════════════════════════════════════════════════════════════════
// RELIABLE IMAGE HELPER — uses Unsplash as reliable fallback
// GSMArena blocks hotlinking, so we use a proxy image URL strategy
// ══════════════════════════════════════════════════════════════════════════════
const BRAND_FALLBACK_IMGS = {
  Apple:    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=85',
  Samsung:  'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85',
  OnePlus:  'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85',
  Google:   'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85',
  Xiaomi:   'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85',
  vivo:     'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85',
  Vivo:     'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85',
  iQOO:     'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85',
  OPPO:     'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85',
  Oppo:     'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85',
  Motorola: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85',
  Realme:   'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85',
  Nothing:  'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85',
  Sony:     'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85',
  Asus:     'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85',
  Honor:    'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85',
  Infinix:  'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85',
  Tecno:    'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85',
  POCO:     'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85',
  Poco:     'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85',
  default:  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85',
};

// Each phone can have multiple image sources (primary + fallbacks)
// We try them in order
function getReliableImg(phone) {
  return phone.imgs?.[0] || BRAND_FALLBACK_IMGS[phone.brand] || BRAND_FALLBACK_IMGS.default;
}

// ══════════════════════════════════════════════════════════════════════════════
// COMPREHENSIVE PHONE DATABASE
// imgs: array of URLs tried in order (Unsplash first = always works)
// ══════════════════════════════════════════════════════════════════════════════
const PHONE_DB = [
  // ─── Apple iPhone 17 Series (2025) ──────────────────────────────────────────
  {
    keywords: ['iphone 17 pro max', 'apple iphone 17 pro max'],
    title: 'Apple iPhone 17 Pro Max', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&q=85'],
    ram: '12 GB', storage: '256 GB / 512 GB / 1 TB',
    processor: 'Apple A19 Pro (3 nm)',
    display: '6.9" LTPO Super Retina XDR OLED, 2956×1364, 460 ppi, ProMotion 120Hz',
    camera: '48 MP Main (Tetraprism) + 48 MP Ultrawide + 48 MP 5x Telephoto',
    battery: '4685 mAh, 45W wired + 25W wireless', os: 'iOS 19', price: '₹1,59,900',
  },
  {
    keywords: ['iphone 17 pro', 'apple iphone 17 pro'],
    title: 'Apple iPhone 17 Pro', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&q=85'],
    ram: '12 GB', storage: '128 GB / 256 GB / 512 GB / 1 TB',
    processor: 'Apple A19 Pro (3 nm)',
    display: '6.3" LTPO Super Retina XDR OLED, 2622×1206, 460 ppi, ProMotion 120Hz',
    camera: '48 MP Main + 48 MP Ultrawide + 48 MP 5x Telephoto',
    battery: '3582 mAh, 45W wired + 25W wireless', os: 'iOS 19', price: '₹1,34,900',
  },
  {
    keywords: ['iphone 17 air', 'apple iphone 17 air', 'iphone air'],
    title: 'Apple iPhone 17 Air', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB',
    processor: 'Apple A19 (3 nm)',
    display: '6.7" Super Retina XDR OLED, 2796×1290, 460 ppi, 60Hz (thinnest iPhone)',
    camera: '48 MP Main + 12 MP Ultrawide',
    battery: '3600 mAh, 25W wired', os: 'iOS 19', price: '₹99,900',
  },
  {
    keywords: ['iphone 17', 'apple iphone 17'],
    title: 'Apple iPhone 17', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB / 512 GB',
    processor: 'Apple A19 (3 nm)',
    display: '6.1" Super Retina XDR OLED, 2556×1179, 460 ppi, 60Hz',
    camera: '48 MP Main + 12 MP Ultrawide',
    battery: '3561 mAh, 25W wired', os: 'iOS 19', price: '₹84,900',
  },

  // ─── Apple iPhone 16 Series ──────────────────────────────────────────────────
  {
    keywords: ['iphone 16 pro max', 'apple iphone 16 pro max'],
    title: 'Apple iPhone 16 Pro Max', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1696507254813-b9bc2fbae9ab?w=400&q=85'],
    ram: '8 GB', storage: '256 GB / 512 GB / 1 TB',
    processor: 'Apple A18 Pro (3 nm)',
    display: '6.9" LTPO Super Retina XDR OLED, 2868×1320, 460 ppi, ProMotion 120Hz',
    camera: '48 MP Main (Tetraprism 5x) + 48 MP Ultrawide + 12 MP 5x Telephoto',
    battery: '4685 mAh, 30W wired', os: 'iOS 18', price: '₹1,44,900',
  },
  {
    keywords: ['iphone 16 pro', 'apple iphone 16 pro'],
    title: 'Apple iPhone 16 Pro', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1696507254813-b9bc2fbae9ab?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB / 512 GB / 1 TB',
    processor: 'Apple A18 Pro (3 nm)',
    display: '6.3" LTPO Super Retina XDR OLED, 2622×1206, 460 ppi, ProMotion 120Hz',
    camera: '48 MP Main + 48 MP Ultrawide + 12 MP 5x Telephoto',
    battery: '3582 mAh, 30W wired', os: 'iOS 18', price: '₹1,19,900',
  },
  {
    keywords: ['iphone 16 plus', 'apple iphone 16 plus'],
    title: 'Apple iPhone 16 Plus', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1696507254813-b9bc2fbae9ab?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB / 512 GB',
    processor: 'Apple A18 (3 nm)',
    display: '6.7" Super Retina XDR OLED, 2796×1290, 460 ppi, 60Hz',
    camera: '48 MP Main + 12 MP Ultrawide',
    battery: '4674 mAh, 25W wired', os: 'iOS 18', price: '₹89,900',
  },
  {
    keywords: ['apple iphone 16', 'iphone 16'],
    title: 'Apple iPhone 16', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1696507254813-b9bc2fbae9ab?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB / 512 GB',
    processor: 'Apple A18 (3 nm)',
    display: '6.1" Super Retina XDR OLED, 2556×1179, 460 ppi, 60Hz',
    camera: '48 MP Main + 12 MP Ultrawide',
    battery: '3561 mAh, 25W wired', os: 'iOS 18', price: '₹79,900',
  },

  // ─── Apple iPhone 15 Series ──────────────────────────────────────────────────
  {
    keywords: ['iphone 15 pro max', 'apple iphone 15 pro max'],
    title: 'Apple iPhone 15 Pro Max', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1695048064070-6d05d9f7ee6a?w=400&q=85'],
    ram: '8 GB', storage: '256 GB / 512 GB / 1 TB',
    processor: 'Apple A17 Pro (3 nm)',
    display: '6.7" LTPO Super Retina XDR OLED, 2796×1290, 460 ppi, ProMotion 120Hz',
    camera: '48 MP Main + 12 MP Ultrawide + 12 MP 5x Telephoto',
    battery: '4422 mAh, 27W wired', os: 'iOS 17', price: '₹1,34,900',
  },
  {
    keywords: ['iphone 15 pro', 'apple iphone 15 pro'],
    title: 'Apple iPhone 15 Pro', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1695048064070-6d05d9f7ee6a?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB / 512 GB / 1 TB',
    processor: 'Apple A17 Pro (3 nm)',
    display: '6.1" LTPO Super Retina XDR OLED, 2556×1179, 460 ppi, ProMotion 120Hz',
    camera: '48 MP Main + 12 MP Ultrawide + 12 MP 3x Telephoto',
    battery: '3274 mAh, 27W wired', os: 'iOS 17', price: '₹1,19,900',
  },
  {
    keywords: ['iphone 15 plus', 'apple iphone 15 plus'],
    title: 'Apple iPhone 15 Plus', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1695048064070-6d05d9f7ee6a?w=400&q=85'],
    ram: '6 GB', storage: '128 GB / 256 GB / 512 GB',
    processor: 'Apple A16 Bionic (4 nm)',
    display: '6.7" Super Retina XDR OLED, 2796×1290, 460 ppi, 60Hz',
    camera: '48 MP Main + 12 MP Ultrawide',
    battery: '4383 mAh, 20W wired', os: 'iOS 17', price: '₹79,900',
  },
  {
    keywords: ['apple iphone 15', 'iphone 15'],
    title: 'Apple iPhone 15', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1695048064070-6d05d9f7ee6a?w=400&q=85'],
    ram: '6 GB', storage: '128 GB / 256 GB / 512 GB',
    processor: 'Apple A16 Bionic (4 nm)',
    display: '6.1" Super Retina XDR OLED, 2556×1179, 460 ppi, 60Hz',
    camera: '48 MP Main + 12 MP Ultrawide',
    battery: '3349 mAh, 20W wired', os: 'iOS 17', price: '₹69,900',
  },

  // ─── Apple iPhone 14 Series ──────────────────────────────────────────────────
  {
    keywords: ['iphone 14 pro max', 'apple iphone 14 pro max'],
    title: 'Apple iPhone 14 Pro Max', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=400&q=85'],
    ram: '6 GB', storage: '128 GB / 256 GB / 512 GB / 1 TB',
    processor: 'Apple A16 Bionic (4 nm)',
    display: '6.7" LTPO OLED, 2796×1290, 460 ppi, ProMotion 120Hz',
    camera: '48 MP Main + 12 MP Ultrawide + 12 MP 3x Telephoto',
    battery: '4323 mAh, 27W wired', os: 'iOS 16', price: '₹1,24,900',
  },
  {
    keywords: ['iphone 14 pro', 'apple iphone 14 pro'],
    title: 'Apple iPhone 14 Pro', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=400&q=85'],
    ram: '6 GB', storage: '128 GB / 256 GB / 512 GB / 1 TB',
    processor: 'Apple A16 Bionic (4 nm)',
    display: '6.1" LTPO OLED, 2556×1179, 460 ppi, ProMotion 120Hz',
    camera: '48 MP Main + 12 MP Ultrawide + 12 MP 3x Telephoto',
    battery: '3200 mAh, 27W wired', os: 'iOS 16', price: '₹1,09,900',
  },
  {
    keywords: ['iphone 14 plus', 'apple iphone 14 plus'],
    title: 'Apple iPhone 14 Plus', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=400&q=85'],
    ram: '6 GB', storage: '128 GB / 256 GB / 512 GB',
    processor: 'Apple A15 Bionic (5 nm)',
    display: '6.7" Super Retina XDR OLED, 2778×1284, 458 ppi, 60Hz',
    camera: '12 MP Main + 12 MP Ultrawide',
    battery: '4325 mAh, 20W wired', os: 'iOS 16', price: '₹74,900',
  },
  {
    keywords: ['apple iphone 14', 'iphone 14'],
    title: 'Apple iPhone 14', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1663499482523-1c0c1bae4ce1?w=400&q=85'],
    ram: '6 GB', storage: '128 GB / 256 GB / 512 GB',
    processor: 'Apple A15 Bionic (5 nm)',
    display: '6.1" Super Retina XDR OLED, 2532×1170, 460 ppi, 60Hz',
    camera: '12 MP Main + 12 MP Ultrawide',
    battery: '3279 mAh, 20W wired', os: 'iOS 16', price: '₹59,900',
  },
  {
    keywords: ['iphone 13 pro max', 'apple iphone 13 pro max'],
    title: 'Apple iPhone 13 Pro Max', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&q=85'],
    ram: '6 GB', storage: '128 GB / 256 GB / 512 GB / 1 TB',
    processor: 'Apple A15 Bionic (5 nm)',
    display: '6.7" LTPO OLED, 2778×1284, 458 ppi, ProMotion 120Hz',
    camera: '12 MP Main + 12 MP Ultrawide + 12 MP 3x Telephoto',
    battery: '4373 mAh, 27W wired', os: 'iOS 15', price: '₹99,900',
  },
  {
    keywords: ['iphone 13 pro', 'apple iphone 13 pro'],
    title: 'Apple iPhone 13 Pro', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&q=85'],
    ram: '6 GB', storage: '128 GB / 256 GB / 512 GB / 1 TB',
    processor: 'Apple A15 Bionic (5 nm)',
    display: '6.1" LTPO OLED, 2532×1170, 460 ppi, ProMotion 120Hz',
    camera: '12 MP Main + 12 MP Ultrawide + 12 MP 3x Telephoto',
    battery: '3095 mAh, 27W wired', os: 'iOS 15', price: '₹89,900',
  },
  {
    keywords: ['apple iphone 13', 'iphone 13'],
    title: 'Apple iPhone 13', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=400&q=85'],
    ram: '4 GB', storage: '128 GB / 256 GB / 512 GB',
    processor: 'Apple A15 Bionic (5 nm)',
    display: '6.1" Super Retina XDR OLED, 2532×1170, 460 ppi, 60Hz',
    camera: '12 MP Main + 12 MP Ultrawide',
    battery: '3227 mAh, 20W wired', os: 'iOS 15', price: '₹59,900',
  },

  // ─── Samsung Galaxy S25 Series (2025) ────────────────────────────────────────
  {
    keywords: ['samsung galaxy s25 ultra', 'galaxy s25 ultra', 's25 ultra'],
    title: 'Samsung Galaxy S25 Ultra', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '12 GB', storage: '256 GB / 512 GB / 1 TB',
    processor: 'Snapdragon 8 Elite for Galaxy (3 nm)',
    display: '6.9" Dynamic LTPO AMOLED 2X, 3088×1440, 120Hz, 2600 nits',
    camera: '200 MP Main + 50 MP Ultrawide + 10 MP 3x + 50 MP 5x Telephoto',
    battery: '5000 mAh, 45W wired + 15W wireless', os: 'Android 15, One UI 7', price: '₹1,29,999',
  },
  {
    keywords: ['samsung galaxy s25 plus', 'galaxy s25 plus', 's25 plus', 'samsung s25+', 'galaxy s25+', 's25+'],
    title: 'Samsung Galaxy S25+', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '12 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8 Elite for Galaxy (3 nm)',
    display: '6.7" Dynamic LTPO AMOLED 2X, 3088×1440, 120Hz, 2600 nits',
    camera: '50 MP Main + 12 MP Ultrawide + 10 MP 3x Telephoto',
    battery: '4900 mAh, 45W wired + 15W wireless', os: 'Android 15, One UI 7', price: '₹99,999',
  },
  {
    keywords: ['samsung galaxy s25', 'galaxy s25', 'samsung s25'],
    title: 'Samsung Galaxy S25', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '12 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 8 Elite for Galaxy (3 nm)',
    display: '6.2" Dynamic AMOLED 2X, 2340×1080, 120Hz',
    camera: '50 MP Main + 12 MP Ultrawide + 10 MP 3x Telephoto',
    battery: '4000 mAh, 25W wired + 15W wireless', os: 'Android 15, One UI 7', price: '₹79,999',
  },
  {
    keywords: ['samsung galaxy s25 fe', 'galaxy s25 fe', 's25 fe', 'samsung s25 fe'],
    title: 'Samsung Galaxy S25 FE', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'Exynos 2500 (3 nm)',
    display: '6.7" Dynamic AMOLED 2X, 2340×1080, 120Hz',
    camera: '50 MP Main + 12 MP Ultrawide + 8 MP 3x Telephoto',
    battery: '4900 mAh, 45W wired', os: 'Android 15, One UI 7', price: '₹54,999',
  },

  // ─── Samsung Galaxy S24 Series ───────────────────────────────────────────────
  {
    keywords: ['samsung galaxy s24 ultra', 'galaxy s24 ultra', 's24 ultra'],
    title: 'Samsung Galaxy S24 Ultra', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '12 GB', storage: '256 GB / 512 GB / 1 TB',
    processor: 'Snapdragon 8 Gen 3 for Galaxy (4 nm)',
    display: '6.8" Dynamic AMOLED 2X, 3088×1440, 120Hz, 2600 nits',
    camera: '200 MP Main + 12 MP Ultrawide + 10 MP 3x + 50 MP 5x Telephoto',
    battery: '5000 mAh, 45W wired', os: 'Android 14, One UI 6.1', price: '₹1,09,999',
  },
  {
    keywords: ['samsung galaxy s24 plus', 'galaxy s24 plus', 's24 plus', 'samsung s24+', 's24+'],
    title: 'Samsung Galaxy S24+', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '12 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8 Gen 3 for Galaxy (4 nm)',
    display: '6.7" Dynamic AMOLED 2X, 3088×1440, 120Hz',
    camera: '50 MP Main + 12 MP Ultrawide + 10 MP 3x Telephoto',
    battery: '4900 mAh, 45W wired', os: 'Android 14, One UI 6.1', price: '₹89,999',
  },
  {
    keywords: ['samsung galaxy s24', 'galaxy s24', 'samsung s24'],
    title: 'Samsung Galaxy S24', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 8 Gen 3 for Galaxy (4 nm)',
    display: '6.2" Dynamic AMOLED 2X, 2340×1080, 120Hz',
    camera: '50 MP Main + 12 MP Ultrawide + 10 MP 3x Telephoto',
    battery: '4000 mAh, 25W wired', os: 'Android 14, One UI 6.1', price: '₹74,999',
  },
  {
    keywords: ['samsung galaxy s23 ultra', 's23 ultra'],
    title: 'Samsung Galaxy S23 Ultra', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '256 GB / 512 GB / 1 TB',
    processor: 'Snapdragon 8 Gen 2 for Galaxy (4 nm)',
    display: '6.8" Dynamic AMOLED 2X, 3088×1440, 120Hz',
    camera: '200 MP Main + 12 MP Ultrawide + 10 MP 3x + 10 MP 10x Telephoto',
    battery: '5000 mAh, 45W wired', os: 'Android 13, One UI 5.1', price: '₹1,04,999',
  },
  {
    keywords: ['samsung galaxy s23', 'galaxy s23', 'samsung s23'],
    title: 'Samsung Galaxy S23', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 8 Gen 2 for Galaxy (4 nm)',
    display: '6.1" Dynamic AMOLED 2X, 2340×1080, 120Hz',
    camera: '50 MP Main + 12 MP Ultrawide + 10 MP 3x Telephoto',
    battery: '3900 mAh, 25W wired', os: 'Android 13, One UI 5.1', price: '₹74,999',
  },

  // ─── Samsung A Series ────────────────────────────────────────────────────────
  {
    keywords: ['samsung galaxy a56', 'galaxy a56', 'samsung a56'],
    title: 'Samsung Galaxy A56 5G', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'Exynos 1580 (4 nm)',
    display: '6.7" Super AMOLED, 2340×1080, 120Hz, 1000 nits',
    camera: '50 MP OIS + 12 MP Ultrawide + 5 MP Macro',
    battery: '5000 mAh, 45W wired', os: 'Android 15, One UI 7', price: '₹39,999',
  },
  {
    keywords: ['samsung galaxy a55', 'galaxy a55', 'samsung a55'],
    title: 'Samsung Galaxy A55 5G', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'Exynos 1480 (4 nm)',
    display: '6.6" Super AMOLED, 2340×1080, 120Hz',
    camera: '50 MP Main + 12 MP Ultrawide + 5 MP Macro',
    battery: '5000 mAh, 25W wired', os: 'Android 14, One UI 6.1', price: '₹37,999',
  },
  {
    keywords: ['samsung galaxy a35', 'galaxy a35', 'samsung a35'],
    title: 'Samsung Galaxy A35 5G', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '6 GB / 8 GB', storage: '128 GB / 256 GB',
    processor: 'Exynos 1380 (5 nm)',
    display: '6.6" Super AMOLED, 2340×1080, 120Hz',
    camera: '50 MP Main + 8 MP Ultrawide + 5 MP Macro',
    battery: '5000 mAh, 25W wired', os: 'Android 14, One UI 6.1', price: '₹26,999',
  },

  // ─── Samsung Z Fold / Flip ───────────────────────────────────────────────────
  {
    keywords: ['samsung galaxy z fold 7', 'z fold 7', 'galaxy z fold7', 'samsung z fold7'],
    title: 'Samsung Galaxy Z Fold 7', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '12 GB', storage: '256 GB / 512 GB / 1 TB',
    processor: 'Snapdragon 8 Elite for Galaxy (3 nm)',
    display: '7.9" Dynamic AMOLED 2X inner, 6.5" outer, 120Hz',
    camera: '200 MP Main + 12 MP Ultrawide + 10 MP 3x Telephoto',
    battery: '4400 mAh, 25W wired', os: 'Android 15, One UI 7', price: '₹1,79,999',
  },
  {
    keywords: ['samsung galaxy z fold 6', 'z fold 6', 'galaxy z fold6'],
    title: 'Samsung Galaxy Z Fold 6', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '12 GB', storage: '256 GB / 512 GB / 1 TB',
    processor: 'Snapdragon 8 Gen 3 for Galaxy (4 nm)',
    display: '7.6" Dynamic AMOLED 2X inner + 6.3" outer, 120Hz',
    camera: '50 MP Main + 12 MP Ultrawide + 10 MP 3x Telephoto',
    battery: '4400 mAh, 25W wired', os: 'Android 14, One UI 6.1', price: '₹1,64,999',
  },
  {
    keywords: ['samsung galaxy z flip 7', 'z flip 7', 'galaxy z flip7'],
    title: 'Samsung Galaxy Z Flip 7', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '12 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8 Elite for Galaxy (3 nm)',
    display: '6.7" Dynamic AMOLED, 2640×1080, 120Hz + 4.1" outer',
    camera: '50 MP Main + 12 MP Ultrawide',
    battery: '4100 mAh, 25W wired', os: 'Android 15, One UI 7', price: '₹1,14,999',
  },
  {
    keywords: ['samsung galaxy z flip 6', 'z flip 6', 'galaxy z flip6'],
    title: 'Samsung Galaxy Z Flip 6', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '12 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8 Gen 3 for Galaxy (4 nm)',
    display: '6.7" Dynamic AMOLED, 2640×1080, 120Hz + 3.4" outer',
    camera: '50 MP Main + 12 MP Ultrawide',
    battery: '4000 mAh, 25W wired', os: 'Android 14, One UI 6.1', price: '₹1,09,999',
  },

  // ─── OnePlus ─────────────────────────────────────────────────────────────────
  {
    keywords: ['oneplus 13s', 'one plus 13s'],
    title: 'OnePlus 13s', brand: 'OnePlus',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '12 GB / 16 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8 Elite (3 nm)',
    display: '6.82" LTPO AMOLED, 3168×1440, 1-120Hz, 4500 nits',
    camera: '50 MP Sony LYT-808 + 50 MP Ultrawide + 50 MP 3x Telephoto',
    battery: '6100 mAh, 100W SuperVOOC + 50W wireless', os: 'Android 15, OxygenOS 15', price: '₹74,999',
  },
  {
    keywords: ['oneplus 13', 'one plus 13'],
    title: 'OnePlus 13', brand: 'OnePlus',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '12 GB / 16 GB / 24 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8 Elite (3 nm)',
    display: '6.82" LTPO AMOLED, 3168×1440, 1-120Hz, 4500 nits',
    camera: '50 MP Sony LYT-808 + 50 MP Ultrawide + 50 MP 3x Telephoto',
    battery: '6000 mAh, 100W SuperVOOC + 50W wireless', os: 'Android 15, OxygenOS 15', price: '₹69,999',
  },
  {
    keywords: ['oneplus 12r', 'one plus 12r'],
    title: 'OnePlus 12R', brand: 'OnePlus',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '8 GB / 16 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 8 Gen 1 (4 nm)',
    display: '6.78" LTPO AMOLED, 2780×1264, 1-120Hz',
    camera: '50 MP Main + 8 MP Ultrawide + 2 MP Macro',
    battery: '5500 mAh, 80W SUPERVOOC', os: 'Android 14, OxygenOS 14', price: '₹39,999',
  },
  {
    keywords: ['oneplus 12', 'one plus 12'],
    title: 'OnePlus 12', brand: 'OnePlus',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '12 GB / 16 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8 Gen 3 (4 nm)',
    display: '6.82" LTPO AMOLED, 3168×1440, 1-120Hz',
    camera: '50 MP Sony LYT-808 (Hasselblad) + 48 MP Ultrawide + 64 MP 3x Periscope',
    battery: '5400 mAh, 100W SuperVOOC + 50W wireless', os: 'Android 14, OxygenOS 14', price: '₹64,999',
  },
  {
    keywords: ['oneplus nord 4', 'nord 4', 'one plus nord 4'],
    title: 'OnePlus Nord 4 5G', brand: 'OnePlus',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 7+ Gen 3 (4 nm)',
    display: '6.74" AMOLED, 2772×1240, 120Hz',
    camera: '50 MP Sony LYT-600 + 8 MP Ultrawide',
    battery: '5500 mAh, 100W SUPERVOOC', os: 'Android 14, OxygenOS 14', price: '₹29,999',
  },
  {
    keywords: ['oneplus nord ce 4', 'nord ce 4', 'one plus nord ce 4'],
    title: 'OnePlus Nord CE 4 5G', brand: 'OnePlus',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 7s Gen 2 (4 nm)',
    display: '6.67" AMOLED, 2400×1080, 120Hz',
    camera: '50 MP Main + 8 MP Ultrawide',
    battery: '5500 mAh, 100W SUPERVOOC', os: 'Android 14, OxygenOS 14', price: '₹24,999',
  },

  // ─── Google Pixel ─────────────────────────────────────────────────────────────
  {
    keywords: ['google pixel 9 pro xl', 'pixel 9 pro xl'],
    title: 'Google Pixel 9 Pro XL', brand: 'Google',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '16 GB', storage: '128 GB / 256 GB / 512 GB / 1 TB',
    processor: 'Google Tensor G4 (4 nm)',
    display: '6.8" LTPO OLED, 3120×1344, 1-120Hz, 3000 nits',
    camera: '50 MP Main + 48 MP Ultrawide + 48 MP 5x Telephoto',
    battery: '5060 mAh, 37W wired + 23W wireless', os: 'Android 15', price: '₹1,24,999',
  },
  {
    keywords: ['google pixel 9 pro fold', 'pixel 9 pro fold'],
    title: 'Google Pixel 9 Pro Fold', brand: 'Google',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '16 GB', storage: '256 GB / 512 GB',
    processor: 'Google Tensor G4 (4 nm)',
    display: '8" LTPO OLED inner + 6.3" outer, 120Hz',
    camera: '48 MP Main + 10.5 MP Ultrawide + 10.8 MP 5x Telephoto',
    battery: '4650 mAh, 21W wired', os: 'Android 15', price: '₹1,72,999',
  },
  {
    keywords: ['google pixel 9 pro', 'pixel 9 pro'],
    title: 'Google Pixel 9 Pro', brand: 'Google',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '16 GB', storage: '128 GB / 256 GB / 512 GB / 1 TB',
    processor: 'Google Tensor G4 (4 nm)',
    display: '6.3" LTPO OLED, 2992×1344, 1-120Hz, 3000 nits',
    camera: '50 MP Main + 48 MP Ultrawide + 48 MP 5x Telephoto',
    battery: '4700 mAh, 37W wired + 23W wireless', os: 'Android 15', price: '₹1,09,999',
  },
  {
    keywords: ['google pixel 9', 'pixel 9'],
    title: 'Google Pixel 9', brand: 'Google',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '12 GB', storage: '128 GB / 256 GB',
    processor: 'Google Tensor G4 (4 nm)',
    display: '6.3" Actua OLED, 2424×1080, 60-120Hz',
    camera: '50 MP Main + 48 MP Ultrawide',
    battery: '4700 mAh, 27W wired + 15W wireless', os: 'Android 15', price: '₹79,999',
  },
  {
    keywords: ['google pixel 8 pro', 'pixel 8 pro'],
    title: 'Google Pixel 8 Pro', brand: 'Google',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '12 GB', storage: '128 GB / 256 GB / 512 GB / 1 TB',
    processor: 'Google Tensor G3 (4 nm)',
    display: '6.7" LTPO OLED, 2992×1344, 1-120Hz',
    camera: '50 MP Main + 48 MP Ultrawide + 48 MP 5x Telephoto',
    battery: '5050 mAh, 30W wired + 23W wireless', os: 'Android 14', price: '₹1,06,999',
  },
  {
    keywords: ['google pixel 8a', 'pixel 8a'],
    title: 'Google Pixel 8a', brand: 'Google',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB',
    processor: 'Google Tensor G3 (4 nm)',
    display: '6.1" OLED, 2400×1080, 120Hz',
    camera: '64 MP Main + 13 MP Ultrawide',
    battery: '4492 mAh, 18W wired + 18W wireless', os: 'Android 14', price: '₹52,999',
  },

  // ─── Xiaomi / Redmi / POCO ───────────────────────────────────────────────────
  {
    keywords: ['xiaomi 15 ultra', 'mi 15 ultra'],
    title: 'Xiaomi 15 Ultra', brand: 'Xiaomi',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '12 GB / 16 GB', storage: '256 GB / 512 GB / 1 TB',
    processor: 'Snapdragon 8 Elite (3 nm)',
    display: '6.73" LTPO AMOLED, 3200×1440, 1-120Hz, 3200 nits',
    camera: '200 MP Periscope (Leica) + 50 MP Ultrawide + 50 MP 3x + 50 MP 5x Telephoto',
    battery: '6000 mAh, 90W wired + 80W wireless', os: 'Android 15, HyperOS 2', price: '₹1,09,999',
  },
  {
    keywords: ['xiaomi 15', 'mi 15'],
    title: 'Xiaomi 15', brand: 'Xiaomi',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '12 GB / 16 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8 Elite (3 nm)',
    display: '6.36" LTPO AMOLED, 2670×1200, 1-120Hz',
    camera: '50 MP Sony (Leica) + 50 MP Ultrawide + 50 MP 5x Telephoto',
    battery: '5400 mAh, 90W wired + 50W wireless', os: 'Android 15, HyperOS 2', price: '₹89,999',
  },
  {
    keywords: ['xiaomi 14 ultra', 'mi 14 ultra'],
    title: 'Xiaomi 14 Ultra', brand: 'Xiaomi',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '16 GB', storage: '512 GB / 1 TB',
    processor: 'Snapdragon 8 Gen 3 (4 nm)',
    display: '6.73" LTPO AMOLED, 3200×1440, 1-120Hz, 3000 nits',
    camera: '50 MP Main (Leica) + 50 MP Ultrawide + 50 MP 3.2x + 50 MP 5x Telephoto',
    battery: '5300 mAh, 90W wired + 80W wireless', os: 'Android 14, HyperOS', price: '₹99,999',
  },
  {
    keywords: ['redmi note 14 pro plus', 'redmi note 14 pro+'],
    title: 'Redmi Note 14 Pro+ 5G', brand: 'Xiaomi',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 7s Gen 3 (4 nm)',
    display: '6.67" AMOLED, 2712×1220, 120Hz, 3000 nits',
    camera: '200 MP Main + 8 MP Ultrawide + 2 MP Macro',
    battery: '6200 mAh, 90W HyperCharge', os: 'Android 14, HyperOS', price: '₹29,999',
  },
  {
    keywords: ['redmi note 14 pro', 'redmi note14 pro'],
    title: 'Redmi Note 14 Pro 5G', brand: 'Xiaomi',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB',
    processor: 'MediaTek Dimensity 7300 Ultra (4 nm)',
    display: '6.67" AMOLED, 2400×1080, 120Hz',
    camera: '50 MP Main + 8 MP Ultrawide + 2 MP Macro',
    battery: '5500 mAh, 45W fast charge', os: 'Android 14, HyperOS', price: '₹25,999',
  },
  {
    keywords: ['poco f7 ultra', 'poco f7ultra'],
    title: 'POCO F7 Ultra', brand: 'Xiaomi',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '12 GB / 16 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8 Elite (3 nm)',
    display: '6.67" LTPO AMOLED, 2712×1220, 1-120Hz',
    camera: '50 MP Sony LYT-900 + 50 MP Ultrawide + 50 MP 2.5x Telephoto',
    battery: '5000 mAh, 90W fast charge', os: 'Android 15, HyperOS 2', price: '₹59,999',
  },
  {
    keywords: ['poco x7 pro', 'poco x7pro'],
    title: 'POCO X7 Pro 5G', brand: 'Xiaomi',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '256 GB',
    processor: 'MediaTek Dimensity 8400 Ultra (4 nm)',
    display: '6.67" AMOLED, 2712×1220, 120Hz, 4000 nits',
    camera: '50 MP Sony + 8 MP Ultrawide',
    battery: '6550 mAh, 90W fast charge', os: 'Android 15, HyperOS 2', price: '₹27,999',
  },

  // ─── vivo ─────────────────────────────────────────────────────────────────────
  {
    keywords: ['vivo x300 pro', 'x300 pro', 'vivox300pro', 'x300p', 'vivo x300'],
    title: 'vivo X300 Pro 5G', brand: 'vivo',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '16 GB', storage: '512 GB / 1 TB',
    processor: 'MediaTek Dimensity 9400 (3 nm) + V3+ Chip',
    display: '6.78" LTPO AMOLED, 2800×1260, 1-120Hz, 4500 nits Peak',
    camera: '50 MP Sony LYT-818 (Zeiss OIS) + 200 MP Zeiss APO Telephoto + 50 MP Ultrawide',
    battery: '6000 mAh, 90W FlashCharge + 30W Wireless', os: 'Android 15 (Funtouch OS 15)', price: '₹99,999',
  },
  {
    keywords: ['vivo x300', 'x300', 'vivox300'],
    title: 'vivo X300 5G', brand: 'vivo',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '12 GB / 16 GB', storage: '256 GB / 512 GB',
    processor: 'MediaTek Dimensity 9400 (3 nm)',
    display: '6.67" LTPO AMOLED, 2800×1260, 120Hz, 4500 nits',
    camera: '50 MP Main (Zeiss OIS) + 50 MP Zeiss Telephoto (3x) + 50 MP Ultrawide',
    battery: '5800 mAh, 90W FlashCharge', os: 'Android 15 (Funtouch OS 15)', price: '₹69,999',
  },
  {
    keywords: ['vivo x200 ultra', 'vivo x200ultra', 'x200 ultra'],
    title: 'vivo X200 Ultra', brand: 'vivo',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '16 GB', storage: '256 GB / 512 GB / 1 TB',
    processor: 'Snapdragon 8 Elite (3 nm)',
    display: '6.82" LTPO AMOLED, 3168×1440, 1-120Hz',
    camera: '200 MP Zeiss Periscope + 50 MP Ultrawide + 50 MP 3x Telephoto',
    battery: '6000 mAh, 90W wired + 30W wireless', os: 'Android 15, Funtouch OS 15', price: '₹99,999',
  },
  {
    keywords: ['vivo x200 pro', 'vivo x200pro', 'x200 pro'],
    title: 'vivo X200 Pro', brand: 'vivo',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '16 GB', storage: '256 GB / 512 GB',
    processor: 'Dimensity 9400 (3 nm)',
    display: '6.78" LTPO AMOLED, 2800×1260, 1-120Hz, 4500 nits',
    camera: '50 MP Sony LYT-818 (Zeiss) + 50 MP Ultrawide + 200 MP Periscope',
    battery: '6000 mAh, 90W wired + 30W wireless', os: 'Android 15, Funtouch OS 15', price: '₹89,999',
  },
  {
    keywords: ['vivo x200', 'x200', 'vivox200'],
    title: 'vivo X200 5G', brand: 'vivo',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '12 GB / 16 GB', storage: '256 GB / 512 GB',
    processor: 'MediaTek Dimensity 9400 (3 nm)',
    display: '6.67" AMOLED, 2800×1260, 120Hz',
    camera: '50 MP Sony IMX921 (Zeiss) + 50 MP Telephoto + 50 MP Ultrawide',
    battery: '5800 mAh, 90W FlashCharge', os: 'Android 15', price: '₹64,999',
  },
  {
    keywords: ['vivo v40 pro', 'vivo v40pro', 'v40 pro'],
    title: 'vivo V40 Pro 5G', brand: 'vivo',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '256 GB / 512 GB',
    processor: 'MediaTek Dimensity 9200+ (4 nm)',
    display: '6.78" AMOLED, 2800×1260, 120Hz',
    camera: '50 MP Sony LYT-600 (Zeiss) + 50 MP Ultrawide + 50 MP 2x Telephoto',
    battery: '5500 mAh, 80W FlashCharge', os: 'Android 14, Funtouch OS 14', price: '₹49,999',
  },
  {
    keywords: ['vivo v40', 'v40 5g', 'vivov40'],
    title: 'vivo V40 5G', brand: 'vivo',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB / 512 GB',
    processor: 'Snapdragon 7 Gen 3 (4 nm)',
    display: '6.78" Curved AMOLED, 2800×1260, 120Hz, 4500 nits',
    camera: '50 MP Zeiss Main (OIS) + 50 MP Zeiss Ultrawide',
    battery: '5500 mAh, 80W FlashCharge', os: 'Android 14', price: '₹39,999',
  },
  {
    keywords: ['vivo y300 pro', 'y300 pro', 'vivoy300pro', 'y300'],
    title: 'vivo Y300 Pro 5G', brand: 'vivo',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 6 Gen 1 (4 nm)',
    display: '6.77" Curved AMOLED 120Hz',
    camera: '50 MP Sony Main + 2 MP Depth',
    battery: '6500 mAh, 80W FlashCharge', os: 'Android 14', price: '₹19,999',
  },
  {
    keywords: ['vivo t3 ultra', 't3 ultra', 'vivot3ultra'],
    title: 'vivo T3 Ultra 5G', brand: 'vivo',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'MediaTek Dimensity 9200+ (4 nm)',
    display: '6.78" 3D Curved AMOLED 120Hz',
    camera: '50 MP Sony IMX921 OIS + 8 MP Ultrawide',
    battery: '5500 mAh, 80W FlashCharge', os: 'Android 14', price: '₹31,999',
  },

  // ─── OPPO ─────────────────────────────────────────────────────────────────────
  {
    keywords: ['oppo find x8 pro', 'oppo findx8 pro'],
    title: 'OPPO Find X8 Pro', brand: 'OPPO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '12 GB / 16 GB', storage: '256 GB / 512 GB',
    processor: 'MediaTek Dimensity 9400 (3 nm)',
    display: '6.82" LTPO AMOLED, 2780×1264, 1-120Hz, 4500 nits',
    camera: '50 MP Hasselblad + 50 MP Ultrawide + 50 MP 3x + 50 MP 6x Telephoto',
    battery: '5910 mAh, 80W SuperVOOC + 50W wireless', os: 'Android 15, ColorOS 15', price: '₹84,999',
  },
  {
    keywords: ['oppo reno 13 pro', 'oppo reno13 pro'],
    title: 'OPPO Reno 13 Pro 5G', brand: 'OPPO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '12 GB', storage: '256 GB',
    processor: 'MediaTek Dimensity 8350 (4 nm)',
    display: '6.83" AMOLED, 2760×1256, 120Hz',
    camera: '50 MP Sony LYT-600 + 8 MP Ultrawide + 50 MP 3x Telephoto',
    battery: '5800 mAh, 80W SuperVOOC', os: 'Android 15, ColorOS 15', price: '₹44,999',
  },
  {
    keywords: ['oppo reno 12 pro', 'oppo reno 12 pro 5g', 'reno 12 pro', 'reno12pro'],
    title: 'OPPO Reno 12 Pro 5G', brand: 'OPPO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '12 GB', storage: '256 GB / 512 GB',
    processor: 'MediaTek Dimensity 7300-Energy (4 nm)',
    display: '6.7" Quad-Curved AMOLED 120Hz, Gorilla Glass Victus 2',
    camera: '50 MP Sony LYT-600 OIS + 50 MP Telephoto + 8 MP Ultrawide',
    battery: '5000 mAh, 80W SuperVOOC', os: 'Android 14, ColorOS 14.1', price: '₹36,999',
  },
  {
    keywords: ['oppo reno 12', 'oppo reno 12 5g', 'reno 12', 'reno12'],
    title: 'OPPO Reno 12 5G', brand: 'OPPO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '256 GB',
    processor: 'MediaTek Dimensity 7300-Energy (4 nm)',
    display: '6.7" Curved AMOLED, 2412×1080, 120Hz',
    camera: '50 MP Sony LYT-600 OIS + 8 MP Ultrawide + 2 MP Macro',
    battery: '5000 mAh, 80W SuperVOOC', os: 'Android 14, ColorOS 14.1', price: '₹32,999',
  },
  {
    keywords: ['oppo reno 11 pro', 'oppo reno 11 pro 5g', 'reno 11 pro', 'reno11pro'],
    title: 'OPPO Reno 11 Pro 5G', brand: 'OPPO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '12 GB', storage: '256 GB',
    processor: 'MediaTek Dimensity 8200 (4 nm)',
    display: '6.7" 3D Curved OLED, 2412×1080, 120Hz',
    camera: '50 MP Sony IMX890 OIS + 32 MP Telephoto + 8 MP Ultrawide',
    battery: '4600 mAh, 80W SuperVOOC', os: 'Android 14, ColorOS 14', price: '₹39,999',
  },
  {
    keywords: ['oppo reno 11', 'oppo reno 11 5g', 'reno 11', 'reno11'],
    title: 'OPPO Reno 11 5G', brand: 'OPPO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB',
    processor: 'MediaTek Dimensity 7050 (6 nm)',
    display: '6.7" 3D Curved OLED, 2412×1080, 120Hz',
    camera: '50 MP Sony LYT-600 OIS + 32 MP Telephoto + 8 MP Ultrawide',
    battery: '5000 mAh, 67W SuperVOOC', os: 'Android 14, ColorOS 14', price: '₹27,999',
  },
  {
    keywords: ['oppo reno 10', 'oppo reno 10 5g', 'reno 10', 'reno10'],
    title: 'OPPO Reno 10 5G', brand: 'OPPO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB', storage: '256 GB',
    processor: 'MediaTek Dimensity 7050 (6 nm)',
    display: '6.7" 3D Curved AMOLED 120Hz',
    camera: '64 MP Main + 32 MP Telephoto + 8 MP Ultrawide',
    battery: '5000 mAh, 67W SuperVOOC', os: 'Android 13, ColorOS 13.1', price: '₹26,999',
  },
  {
    keywords: ['oppo f27 pro+', 'oppo f27 pro plus', 'f27 pro+'],
    title: 'OPPO F27 Pro+ 5G', brand: 'OPPO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB',
    processor: 'MediaTek Dimensity 7050 (6 nm)',
    display: '6.7" 3D Curved AMOLED 120Hz (IP69 Waterproof)',
    camera: '64 MP Main + 2 MP Depth',
    battery: '5000 mAh, 67W SuperVOOC', os: 'Android 14, ColorOS 14', price: '₹27,999',
  },
  {
    keywords: ['oppo f25 pro', 'oppo f25 pro 5g', 'f25 pro', 'f25pro'],
    title: 'OPPO F25 Pro 5G', brand: 'OPPO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB',
    processor: 'MediaTek Dimensity 7050 (6 nm)',
    display: '6.7" AMOLED, 2412×1080, 120Hz',
    camera: '64 MP Main + 8 MP Ultrawide + 2 MP Macro',
    battery: '5000 mAh, 67W SuperVOOC', os: 'Android 14, ColorOS 14', price: '₹23,999',
  },

  // ─── Motorola ─────────────────────────────────────────────────────────────────
  {
    keywords: ['motorola edge 50 ultra', 'moto edge 50 ultra'],
    title: 'Motorola Edge 50 Ultra', brand: 'Motorola',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '12 GB / 16 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8s Gen 3 (4 nm)',
    display: '6.67" pOLED, 2712×1220, 1-165Hz',
    camera: '50 MP OIS + 50 MP Ultrawide + 64 MP 3x Telephoto',
    battery: '4500 mAh, 125W TurboPower + 50W wireless', os: 'Android 14, Hello UI', price: '₹59,999',
  },
  {
    keywords: ['motorola edge 50 pro', 'moto edge 50 pro', 'edge 50 pro'],
    title: 'Motorola Edge 50 Pro 5G', brand: 'Motorola',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '256 GB',
    processor: 'Snapdragon 7 Gen 3 (4 nm)',
    display: '6.7" Curved pOLED 144Hz, Pantone Validated',
    camera: '50 MP OIS + 13 MP Ultrawide + 10 MP 3x Telephoto',
    battery: '4500 mAh, 125W TurboPower', os: 'Android 14, Hello UI', price: '₹31,999',
  },
  {
    keywords: ['motorola edge 50 fusion', 'moto edge 50 fusion', 'edge 50 fusion'],
    title: 'Motorola Edge 50 Fusion 5G', brand: 'Motorola',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 7s Gen 2 (4 nm)',
    display: '6.67" Curved pOLED, 2400×1080, 144Hz',
    camera: '50 MP Sony LYT-700C OIS + 13 MP Ultrawide',
    battery: '5000 mAh, 68W TurboPower', os: 'Android 14', price: '₹22,999',
  },
  {
    keywords: ['motorola moto g85', 'moto g85', 'motorola g85'],
    title: 'Motorola Moto G85 5G', brand: 'Motorola',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 6s Gen 3 (4 nm)',
    display: '6.67" pOLED, 2400×1080, 120Hz',
    camera: '50 MP OIS + 8 MP Ultrawide',
    battery: '5000 mAh, 33W TurboPower', os: 'Android 14', price: '₹17,999',
  },

  // ─── Realme ───────────────────────────────────────────────────────────────────
  {
    keywords: ['realme gt 7 pro', 'realme gt7 pro'],
    title: 'Realme GT 7 Pro', brand: 'Realme',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '12 GB / 16 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8 Elite (3 nm)',
    display: '6.78" LTPO AMOLED, 2780×1264, 1-120Hz',
    camera: '50 MP Sony LYT-818 + 50 MP Ultrawide + 50 MP 3x Telephoto',
    battery: '6500 mAh, 120W SUPERVOOC', os: 'Android 15, Realme UI 6', price: '₹59,999',
  },
  {
    keywords: ['realme narzo 70 pro', 'narzo 70 pro'],
    title: 'Realme Narzo 70 Pro 5G', brand: 'Realme',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB', storage: '128 GB',
    processor: 'MediaTek Dimensity 7050 (6 nm)',
    display: '6.7" AMOLED, 2400×1080, 120Hz',
    camera: '50 MP Sony + 2 MP Depth',
    battery: '5000 mAh, 67W SUPERVOOC', os: 'Android 14, Realme UI 5', price: '₹19,999',
  },

  // ─── Nothing ──────────────────────────────────────────────────────────────────
  {
    keywords: ['nothing phone 3', 'nothing phone3'],
    title: 'Nothing Phone (3)', brand: 'Nothing',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '12 GB / 16 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8 Elite (3 nm)',
    display: '6.77" LTPO AMOLED, 2392×1080, 1-120Hz',
    camera: '50 MP Sony LYT-808 + 50 MP Ultrawide + 50 MP 2x Telephoto',
    battery: '5150 mAh, 65W wired', os: 'Android 15, Nothing OS 3', price: '₹69,999',
  },
  {
    keywords: ['nothing phone 2a plus', 'nothing phone 2a+'],
    title: 'Nothing Phone (2a) Plus', brand: 'Nothing',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '12 GB', storage: '256 GB',
    processor: 'MediaTek Dimensity 7350 Pro (4 nm)',
    display: '6.7" AMOLED, 2412×1084, 120Hz',
    camera: '50 MP Main + 50 MP Ultrawide',
    battery: '5000 mAh, 50W wired + 5W wireless', os: 'Android 14, Nothing OS 2.6', price: '₹27,999',
  },
  {
    keywords: ['nothing phone 2a', 'nothing phone2a'],
    title: 'Nothing Phone (2a)', brand: 'Nothing',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'MediaTek Dimensity 7200 Pro (4 nm)',
    display: '6.7" AMOLED, 2412×1084, 120Hz',
    camera: '50 MP Main + 50 MP Ultrawide',
    battery: '5000 mAh, 45W wired', os: 'Android 14, Nothing OS 2.5', price: '₹19,999',
  },
  {
    keywords: ['nothing phone 2', 'nothing phone2'],
    title: 'Nothing Phone (2)', brand: 'Nothing',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB / 512 GB',
    processor: 'Snapdragon 8+ Gen 1 (4 nm)',
    display: '6.7" LTPO OLED, 2412×1080, 1-120Hz',
    camera: '50 MP Sony IMX890 + 50 MP Ultrawide',
    battery: '4700 mAh, 45W wired + 15W wireless', os: 'Android 14, Nothing OS 2.5', price: '₹44,999',
  },

  // ─── Sony ─────────────────────────────────────────────────────────────────────
  {
    keywords: ['sony xperia 1 vi', 'xperia 1 vi', 'sony xperia1 vi'],
    title: 'Sony Xperia 1 VI', brand: 'Sony',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '12 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8 Gen 3 (4 nm)',
    display: '6.5" OLED, 2340×1080, 120Hz',
    camera: '48 MP Main + 12 MP Ultrawide + 12 MP 3.5x-7.1x Periscope',
    battery: '5000 mAh, 30W wired', os: 'Android 14', price: '₹1,29,990',
  },
  {
    keywords: ['sony xperia 5 vi', 'xperia 5 vi'],
    title: 'Sony Xperia 5 VI', brand: 'Sony',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 8 Gen 3 (4 nm)',
    display: '6.1" OLED, 2520×1080, 120Hz',
    camera: '48 MP Main + 12 MP Ultrawide + 12 MP 3.5x Periscope',
    battery: '5000 mAh, 30W wired', os: 'Android 14', price: '₹89,990',
  },

  // ─── iQOO ──────────────────────────────────────────────────────────────────────
  {
    keywords: ['iqoo 13', 'iqoo13'],
    title: 'iQOO 13 5G', brand: 'iQOO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '12 GB / 16 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8 Elite (3 nm) + Q2 Chip',
    display: '6.82" 2K LTPO AMOLED, 3168×1440, 144Hz',
    camera: '50 MP Sony IMX921 OIS + 50 MP Telephoto + 50 MP Ultrawide',
    battery: '6150 mAh, 120W FlashCharge', os: 'Android 15, Funtouch OS 15', price: '₹54,999',
  },
  {
    keywords: ['iqoo 12', 'iqoo12'],
    title: 'iQOO 12 5G', brand: 'iQOO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '12 GB / 16 GB', storage: '256 GB / 512 GB',
    processor: 'Snapdragon 8 Gen 3 (4 nm) + Q1 Chip',
    display: '6.78" LTPO AMOLED, 2800×1260, 144Hz, 3000 nits',
    camera: '50 MP OmniVision OIS + 64 MP 3x Periscope + 50 MP Ultrawide',
    battery: '5000 mAh, 120W FlashCharge', os: 'Android 14, Funtouch OS 14', price: '₹52,999',
  },
  {
    keywords: ['iqoo neo 9 pro', 'iqoo neo9 pro', 'neo 9 pro'],
    title: 'iQOO Neo 9 Pro 5G', brand: 'iQOO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 8 Gen 2 (4 nm) + Q1 Chip',
    display: '6.78" LTPO AMOLED, 2800×1260, 144Hz',
    camera: '50 MP Sony IMX920 OIS + 8 MP Ultrawide',
    battery: '5160 mAh, 120W FlashCharge', os: 'Android 14', price: '₹34,999',
  },
  {
    keywords: ['iqoo neo 7 pro', 'iqoo neo7 pro', 'neo 7 pro'],
    title: 'iQOO Neo 7 Pro 5G', brand: 'iQOO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 8+ Gen 1 (4 nm)',
    display: '6.78" AMOLED, 2400×1080, 120Hz',
    camera: '50 MP Samsung GN5 OIS + 8 MP Ultrawide + 2 MP Macro',
    battery: '5000 mAh, 120W FlashCharge', os: 'Android 13', price: '₹29,999',
  },
  {
    keywords: ['iqoo z9s pro', 'iqoo z9s pro 5g', 'z9s pro'],
    title: 'iQOO Z9s Pro 5G', brand: 'iQOO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 7 Gen 3 (4 nm)',
    display: '6.77" Curved AMOLED, 2392×1080, 120Hz',
    camera: '50 MP Sony IMX882 OIS + 8 MP Ultrawide',
    battery: '5500 mAh, 80W FlashCharge', os: 'Android 14', price: '₹24,999',
  },
  {
    keywords: ['iqoo z9', 'iqoo z9 5g', 'z9 5g'],
    title: 'iQOO Z9 5G', brand: 'iQOO',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB',
    processor: 'MediaTek Dimensity 7200 (4 nm)',
    display: '6.67" AMOLED, 2400×1080, 120Hz',
    camera: '50 MP Sony IMX882 OIS + 2 MP Depth',
    battery: '5000 mAh, 44W FlashCharge', os: 'Android 14', price: '₹19,999',
  },

  // ─── Apple Legacy ─────────────────────────────────────────────────────────────
  {
    keywords: ['iphone 12 pro max', 'apple iphone 12 pro max'],
    title: 'Apple iPhone 12 Pro Max', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&q=85'],
    ram: '6 GB', storage: '128 GB / 256 GB / 512 GB',
    processor: 'Apple A14 Bionic (5 nm)',
    display: '6.7" Super Retina XDR OLED, 2778×1284, 458 ppi, 60Hz',
    camera: '12 MP Main + 12 MP Ultrawide + 12 MP 2.5x Telephoto',
    battery: '3687 mAh, 20W wired', os: 'iOS 14', price: '₹69,900',
  },
  {
    keywords: ['apple iphone 12', 'iphone 12'],
    title: 'Apple iPhone 12', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400&q=85'],
    ram: '4 GB', storage: '64 GB / 128 GB / 256 GB',
    processor: 'Apple A14 Bionic (5 nm)',
    display: '6.1" Super Retina XDR OLED, 2532×1170, 460 ppi, 60Hz',
    camera: '12 MP Main + 12 MP Ultrawide',
    battery: '2815 mAh, 20W wired', os: 'iOS 14', price: '₹44,900',
  },
  {
    keywords: ['apple iphone 11', 'iphone 11'],
    title: 'Apple iPhone 11', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=85'],
    ram: '4 GB', storage: '64 GB / 128 GB',
    processor: 'Apple A13 Bionic (7 nm+)',
    display: '6.1" Liquid Retina HD LCD, 1792×828, 326 ppi',
    camera: '12 MP Main + 12 MP Ultrawide',
    battery: '3110 mAh, 18W wired', os: 'iOS 13', price: '₹34,900',
  },
  {
    keywords: ['iphone se 2022', 'apple iphone se 3', 'iphone se 3'],
    title: 'Apple iPhone SE (2022)', brand: 'Apple',
    imgs: ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=85'],
    ram: '4 GB', storage: '64 GB / 128 GB / 256 GB',
    processor: 'Apple A15 Bionic (5 nm)',
    display: '4.7" Retina HD LCD, 1334×750, 326 ppi',
    camera: '12 MP Main',
    battery: '2018 mAh, 20W wired', os: 'iOS 15', price: '₹39,900',
  },

  // ─── Samsung Legacy ───────────────────────────────────────────────────────────
  {
    keywords: ['samsung galaxy s22 ultra', 's22 ultra'],
    title: 'Samsung Galaxy S22 Ultra 5G', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB / 512 GB',
    processor: 'Snapdragon 8 Gen 1 (4 nm)',
    display: '6.8" Dynamic AMOLED 2X, 3088×1440, 120Hz',
    camera: '108 MP Main + 12 MP Ultrawide + 10 MP 3x + 10 MP 10x Telephoto',
    battery: '5000 mAh, 45W wired', os: 'Android 12, One UI 4.1', price: '₹79,999',
  },
  {
    keywords: ['samsung galaxy s21 fe', 's21 fe'],
    title: 'Samsung Galaxy S21 FE 5G', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 888 (5 nm)',
    display: '6.4" Dynamic AMOLED 2X, 2340×1080, 120Hz',
    camera: '12 MP Main + 12 MP Ultrawide + 8 MP 3x Telephoto',
    battery: '4500 mAh, 25W wired', os: 'Android 12', price: '₹32,999',
  },
  {
    keywords: ['samsung galaxy s20 fe', 's20 fe'],
    title: 'Samsung Galaxy S20 FE 5G', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '8 GB', storage: '128 GB',
    processor: 'Snapdragon 865 (7 nm+)',
    display: '6.5" Super AMOLED, 2400×1080, 120Hz',
    camera: '12 MP Main + 12 MP Ultrawide + 8 MP 3x Telephoto',
    battery: '4500 mAh, 25W wired', os: 'Android 10', price: '₹26,999',
  },
  {
    keywords: ['samsung galaxy a54', 'galaxy a54', 'a54'],
    title: 'Samsung Galaxy A54 5G', brand: 'Samsung',
    imgs: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=85'],
    ram: '8 GB', storage: '128 GB / 256 GB',
    processor: 'Exynos 1380 (5 nm)',
    display: '6.4" Super AMOLED, 2340×1080, 120Hz',
    camera: '50 MP Main + 12 MP Ultrawide + 5 MP Macro',
    battery: '5000 mAh, 25W wired', os: 'Android 13', price: '₹33,999',
  },

  // ─── OnePlus Legacy ───────────────────────────────────────────────────────────
  {
    keywords: ['oneplus 11', 'one plus 11'],
    title: 'OnePlus 11 5G', brand: 'OnePlus',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '8 GB / 16 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 8 Gen 2 (4 nm)',
    display: '6.7" LTPO3 Fluid AMOLED 2K 120Hz',
    camera: '50 MP Sony IMX890 (Hasselblad) + 48 MP Ultrawide + 32 MP 2x Telephoto',
    battery: '5000 mAh, 100W SUPERVOOC', os: 'Android 13', price: '₹56,999',
  },
  {
    keywords: ['oneplus 10 pro', 'one plus 10 pro', '10 pro'],
    title: 'OnePlus 10 Pro 5G', brand: 'OnePlus',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 8 Gen 1 (4 nm)',
    display: '6.7" LTPO2 Fluid AMOLED 2K 120Hz',
    camera: '48 MP Sony IMX789 + 50 MP Ultrawide + 8 MP 3.3x Telephoto',
    battery: '5000 mAh, 80W SUPERVOOC + 50W Wireless', os: 'Android 12', price: '₹49,999',
  },
  {
    keywords: ['oneplus nord 2t', 'nord 2t', 'oneplus nord2t'],
    title: 'OnePlus Nord 2T 5G', brand: 'OnePlus',
    imgs: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'MediaTek Dimensity 1300 (6 nm)',
    display: '6.43" Fluid AMOLED 90Hz',
    camera: '50 MP Sony IMX766 OIS + 8 MP Ultrawide + 2 MP Monochrome',
    battery: '4500 mAh, 80W SUPERVOOC', os: 'Android 12', price: '₹28,999',
  },

  // ─── Nothing & CMF ────────────────────────────────────────────────────────────
  {
    keywords: ['nothing phone 1', 'nothing phone1'],
    title: 'Nothing Phone (1)', brand: 'Nothing',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '128 GB / 256 GB',
    processor: 'Snapdragon 778G+ (6 nm)',
    display: '6.55" Flexible OLED, 2400×1080, 120Hz',
    camera: '50 MP Sony IMX766 OIS + 50 MP Ultrawide',
    battery: '4500 mAh, 33W wired + 15W wireless', os: 'Android 12, Nothing OS', price: '₹27,999',
  },
  {
    keywords: ['cmf phone 1', 'cmf phone1', 'nothing cmf phone 1'],
    title: 'CMF Phone 1 by Nothing', brand: 'Nothing',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '6 GB / 8 GB', storage: '128 GB',
    processor: 'MediaTek Dimensity 7300 (4 nm)',
    display: '6.67" Super AMOLED, 2400×1080, 120Hz',
    camera: '50 MP Sony + 2 MP Portrait',
    battery: '5000 mAh, 33W wired', os: 'Android 14, Nothing OS 2.6', price: '₹15,999',
  },

  // ─── Infinix / Tecno / Honor ──────────────────────────────────────────────────
  {
    keywords: ['infinix gt 20 pro', 'infinix gt20 pro'],
    title: 'Infinix GT 20 Pro 5G', brand: 'Infinix',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '8 GB / 12 GB', storage: '256 GB',
    processor: 'MediaTek Dimensity 8200 Ultimate (4 nm)',
    display: '6.78" LTPS AMOLED, 2436×1080, 144Hz',
    camera: '108 MP OIS + 2 MP Macro + 2 MP Depth',
    battery: '5000 mAh, 45W fast charge', os: 'Android 14, XOS 14', price: '₹24,999',
  },
  {
    keywords: ['honor 200 pro', 'honor 200pro'],
    title: 'Honor 200 Pro 5G', brand: 'Honor',
    imgs: ['https://images.unsplash.com/photo-1546054454-aa26e2b734c7?w=400&q=85'],
    ram: '12 GB', storage: '512 GB',
    processor: 'Snapdragon 8s Gen 3 (4 nm)',
    display: '6.78" Curved OLED, 2700×1224, 120Hz, 4000 nits',
    camera: '50 MP Custom H9000 OIS + 50 MP Sony Telephoto + 12 MP Ultrawide',
    battery: '5200 mAh, 100W Wired + 66W Wireless', os: 'Android 14, MagicOS 8', price: '₹57,999',
  },

  // ─── Asus ─────────────────────────────────────────────────────────────────────
  {
    keywords: ['asus rog phone 9 pro', 'rog phone 9 pro'],
    title: 'Asus ROG Phone 9 Pro', brand: 'Asus',
    imgs: ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=85'],
    ram: '16 GB / 24 GB', storage: '512 GB / 1 TB',
    processor: 'Snapdragon 8 Elite (3 nm)',
    display: '6.78" AMOLED, 2400×1080, 165Hz',
    camera: '50 MP OIS + 13 MP Ultrawide + 32 MP Telephoto',
    battery: '5800 mAh, 65W ROG HyperCharge', os: 'Android 15, ROG UI', price: '₹1,19,999',
  },
];

// ══════════════════════════════════════════════════════════════════════════════
// PRECISE SEARCH ENGINE — Fuzzy matching, aliases & multi-token matching
// ══════════════════════════════════════════════════════════════════════════════
function searchPhoneDB(query) {
  if (!query || typeof query !== 'string') return [];

  const rawQ = query.toLowerCase().trim();
  const cleanedQ = rawQ.replace(/[\-\_\+\.]/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleanedQ.length < 2) return [];

  // Common user aliases map
  const ALIASES = {
    'reno 11': 'oppo reno 11 5g',
    'reno11': 'oppo reno 11 5g',
    'reno 11 pro': 'oppo reno 11 pro 5g',
    'reno11pro': 'oppo reno 11 pro 5g',
    'reno 12': 'oppo reno 12 5g',
    'reno12': 'oppo reno 12 5g',
    'reno 12 pro': 'oppo reno 12 pro 5g',
    'reno12pro': 'oppo reno 12 pro 5g',
    'reno 10': 'oppo reno 10 5g',
    'reno10': 'oppo reno 10 5g',
    'f25 pro': 'oppo f25 pro 5g',
    'f25pro': 'oppo f25 pro 5g',
    'f27 pro': 'oppo f27 pro+ 5g',
    'x300': 'vivo x300',
    'x300 pro': 'vivo x300 pro',
    'x300pro': 'vivo x300 pro',
    'vivox300': 'vivo x300',
    'x200': 'vivo x200',
    'x200 pro': 'vivo x200 pro',
    'x200pro': 'vivo x200 pro',
    'vivox200': 'vivo x200',
    'v40': 'vivo v40',
    'v30': 'vivo v30',
    'v29': 'vivo v29',
    'y300': 'vivo y300 pro',
    't3 ultra': 'vivo t3 ultra',
    'a55': 'samsung galaxy a55',
    'a35': 'samsung galaxy a35',
    'm55': 'samsung galaxy m55',
    's25': 'samsung galaxy s25',
    's24': 'samsung galaxy s24',
    's23': 'samsung galaxy s23',
    'fold6': 'z fold 6',
    'flip6': 'z flip 6',
    '16 pro': 'iphone 16 pro',
    '15 pro': 'iphone 15 pro',
    '14 pro': 'iphone 14 pro',
    '13 pro': 'iphone 13 pro',
    '12r': 'oneplus 12r',
    's22 ultra': 'samsung galaxy s22 ultra',
    's21 fe': 'samsung galaxy s21 fe',
    's20 fe': 'samsung galaxy s20 fe',
    'a54': 'samsung galaxy a54',
    '12 pro max': 'iphone 12 pro max',
    '11 pro max': 'iphone 11 pro max',
    'iphone 12': 'apple iphone 12',
    'iphone 11': 'apple iphone 11',
    '11r': 'oneplus 11r',
    '10 pro': 'oneplus 10 pro',
    'nord 2t': 'oneplus nord 2t',
    'nothing 1': 'nothing phone (1)',
    'cmf 1': 'cmf phone 1',
    'neo 9 pro': 'iqoo neo 9 pro',
    'neo 7 pro': 'iqoo neo 7 pro',
    'z9s pro': 'iqoo z9s pro',
    '13r': 'oneplus 13r',
    '1+': 'oneplus',
    'iqoo13': 'iqoo 13',
    'iqoo12': 'iqoo 12',
    'pixel9': 'google pixel 9',
    'pixel8': 'google pixel 8',
  };

  let targetQ = cleanedQ;
  for (const [alias, expansion] of Object.entries(ALIASES)) {
    if (cleanedQ === alias) {
      targetQ = expansion;
      break;
    }
  }

  const qTokens = targetQ.split(' ').filter(t => t.length > 0);
  const scored = [];

  for (const phone of PHONE_DB) {
    const titleLower = phone.title.toLowerCase();
    const searchSpace = `${phone.title} ${phone.brand} ${phone.keywords.join(' ')}`.toLowerCase();
    
    let bestScore = 0;

    for (const kw of phone.keywords) {
      const kwLower = kw.toLowerCase();
      if (rawQ === kwLower || cleanedQ === kwLower) {
        bestScore = Math.max(bestScore, 100);
      } else if (kwLower.includes(cleanedQ) || cleanedQ.includes(kwLower)) {
        bestScore = Math.max(bestScore, 85);
      }
    }

    if (titleLower === rawQ || titleLower === cleanedQ) {
      bestScore = Math.max(bestScore, 98);
    } else if (titleLower.includes(cleanedQ)) {
      bestScore = Math.max(bestScore, 90);
    }

    const allTokensMatch = qTokens.every(token => {
      return searchSpace.includes(token) || searchSpace.replace(/[\s\-\+]/g, '').includes(token);
    });

    if (allTokensMatch) {
      const tokenScore = 70 + (qTokens.length * 5);
      bestScore = Math.max(bestScore, Math.min(tokenScore, 88));
    }

    if (bestScore > 0) {
      scored.push({ phone, score: bestScore });
    }
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .map(s => s.phone);
}

function dbPhoneToSpec(phone) {
  return {
    id: `ext-db-${Date.now()}-${Math.random()}`,
    title: phone.title,
    brand: phone.brand,
    images: phone.imgs || [BRAND_FALLBACK_IMGS[phone.brand] || BRAND_FALLBACK_IMGS.default],
    bmPrice: 0, marketPrice: 0,
    ram: phone.ram || '—',
    storage: phone.storage || '—',
    processor: phone.processor || '—',
    display: phone.display || '—',
    camera: phone.camera || '—',
    battery: phone.battery || '—',
    os: phone.os || '—',
    condition: 'New',
    warranty: 'Manufacturer Warranty',
    rating: '—', reviewsCount: '—',
    isExternal: true,
    sourceLabel: 'Verified Specs',
    approximatePrice: phone.price,
    externalLink: `https://www.gsmarena.com/search.php3?sQuickSearch=${encodeURIComponent(phone.title)}`,
  };
}

// Fuzzy search store products
function fuzzySearch(query, products) {
  const q = query.toLowerCase();
  return products
    .filter(p =>
      p.title?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.processor?.toLowerCase().includes(q)
    )
    .slice(0, 5);
}

// External fetch via Netlify function
async function fetchExternalPhoneSpecs(phoneName) {
  const dbMatches = searchPhoneDB(phoneName);
  if (dbMatches.length > 0) {
    return { spec: dbPhoneToSpec(dbMatches[0]), source: 'db', alternatives: dbMatches.slice(1, 3) };
  }

  // Try Netlify serverless scraper
  try {
    const res = await fetch(
      `/.netlify/functions/phone-specs?q=${encodeURIComponent(phoneName)}`,
      { signal: AbortSignal.timeout(10000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (data?.success && data?.device) {
        const d = data.device;
        return {
          spec: {
            id: `ext-gsm-${Date.now()}`,
            title: d.title || phoneName,
            brand: d.brand || phoneName.split(' ')[0],
            images: [d.image || BRAND_FALLBACK_IMGS[d.brand] || BRAND_FALLBACK_IMGS.default],
            bmPrice: 0, marketPrice: 0,
            ram: d.ram || '—', storage: d.storage || '—',
            processor: d.processor || '—', display: d.display || '—',
            camera: d.camera || '—', battery: d.battery || '—', os: d.os || '—',
            condition: 'New', warranty: '—', rating: '—', reviewsCount: '—',
            isExternal: true, sourceLabel: 'GSMArena Live',
            externalLink: d.gsmarenaUrl || `https://www.gsmarena.com/search.php3?sQuickSearch=${encodeURIComponent(phoneName)}`
          },
          source: 'gsmarena',
          alternatives: []
        };
      }
    }
  } catch (_) {}

  // Fallback card
  return {
    spec: {
      id: `ext-none-${Date.now()}`,
      title: phoneName, brand: phoneName.split(' ')[0],
      images: [BRAND_FALLBACK_IMGS[phoneName.split(' ')[0]] || BRAND_FALLBACK_IMGS.default],
      bmPrice: 0, marketPrice: 0,
      ram: '—', storage: '—', processor: '—', display: '—', camera: '—', battery: '—',
      condition: '—', warranty: '—', rating: '—', reviewsCount: '—', os: '—',
      isExternal: true, noData: true, sourceLabel: 'Not Found',
      externalLink: `https://www.gsmarena.com/search.php3?sQuickSearch=${encodeURIComponent(phoneName)}`
    },
    source: 'none', alternatives: []
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// SPEC TABLE CONFIG
// ══════════════════════════════════════════════════════════════════════════════
const SPEC_ROWS = [
  { label: 'Price', key: 'bmPrice', icon: '₹', format: (v, p) => p.isExternal ? (p.approximatePrice || 'Not in Store') : `₹${Number(v).toLocaleString('en-IN')}` },
  { label: 'OS', key: 'os', icon: '🔧' },
  { label: 'RAM', key: 'ram', icon: '🧠', highlight: 'high' },
  { label: 'Storage', key: 'storage', icon: '💾' },
  { label: 'Processor', key: 'processor', icon: '⚡' },
  { label: 'Display', key: 'display', icon: '🖥️' },
  { label: 'Camera', key: 'camera', icon: '📷' },
  { label: 'Battery', key: 'battery', icon: '🔋', highlight: 'high' },
];

function extractNum(str) {
  if (!str || str === '—') return null;
  const match = String(str).replace(/,/g, '').match(/[\d.]+/);
  return match ? parseFloat(match[0]) : null;
}

function getBestIdx(products, row) {
  if (!row.highlight) return -1;
  const nums = products.map(p => extractNum(p[row.key]));
  if (nums.every(n => n === null)) return -1;
  const valid = nums.filter(n => n !== null);
  if (valid.length < 2) return -1;
  const target = row.highlight === 'high' ? Math.max(...valid) : Math.min(...valid);
  return nums.indexOf(target);
}

// ══════════════════════════════════════════════════════════════════════════════
// PHONE IMAGE COMPONENT — with fallback chain & referrer policy
// ══════════════════════════════════════════════════════════════════════════════
function PhoneImage({ phone, className = '' }) {
  const [imgSrc, setImgSrc] = useState(phone.images?.[0] || '');
  const [fallbackIdx, setFallbackIdx] = useState(0);
  const [hasFailedAll, setHasFailedAll] = useState(false);

  const allSrcs = [
    ...(phone.images || []),
    BRAND_FALLBACK_IMGS[phone.brand],
    BRAND_FALLBACK_IMGS[phone.brand?.toLowerCase()],
    BRAND_FALLBACK_IMGS.default
  ].filter(Boolean);

  useEffect(() => {
    setImgSrc(phone.images?.[0] || BRAND_FALLBACK_IMGS[phone.brand] || BRAND_FALLBACK_IMGS.default);
    setFallbackIdx(0);
    setHasFailedAll(false);
  }, [phone]);

  const handleError = () => {
    const next = fallbackIdx + 1;
    if (next < allSrcs.length) {
      setFallbackIdx(next);
      setImgSrc(allSrcs[next]);
    } else {
      setHasFailedAll(true);
    }
  };

  if (hasFailedAll || !imgSrc) {
    return (
      <div className="flex flex-col items-center justify-center p-2 text-center h-full w-full bg-white/[0.02]">
        <span className="text-3xl mb-1">📱</span>
        <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase">{phone.brand || 'Device'}</span>
      </div>
    );
  }

  return (
    <img
      src={imgSrc}
      alt={phone.title}
      className={className}
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const SUGGESTIONS = ['Vivo X300 Pro', 'Samsung S25 Ultra', 'iPhone 17 Pro Max', 'OnePlus 13', 'Vivo X200 Pro', 'iQOO 13'];

export default function ComparePage() {
  const allStoreProducts = [...storeCMS.getProducts(), ...storeCMS.getSecondHandProducts()];

  const [phones, setPhones] = useState(() => {
    const ids = storeCMS.getCompare();
    return allStoreProducts.filter(p => ids.includes(p.id));
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [localResults, setLocalResults] = useState([]);
  const [dbResults, setDbResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingName, setLoadingName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target) && !searchRef.current?.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (val) => {
    setSearchQuery(val);
    if (!val.trim() || val.trim().length < 2) {
      setLocalResults([]); setDbResults([]); setShowDropdown(false); return;
    }
    const local = fuzzySearch(val, allStoreProducts.filter(p => !phones.find(ph => ph.id === p.id)));
    const db = searchPhoneDB(val).filter(p => !phones.find(ph => ph.title?.toLowerCase() === p.title.toLowerCase())).slice(0, 5);
    setLocalResults(local); setDbResults(db); setShowDropdown(true);
  };

  const addLocalPhone = (product) => {
    if (phones.length >= 4) return;
    setPhones(p => [...p, product]);
    storeCMS.toggleCompare && storeCMS.toggleCompare(product.id);
    setSearchQuery(''); setLocalResults([]); setDbResults([]); setShowDropdown(false);
  };

  const addDBPhone = (dbPhone) => {
    if (phones.length >= 4) return;
    setLoading(true); setLoadingName(dbPhone.title); setShowDropdown(false); setSearchQuery('');
    setTimeout(() => { setPhones(p => [...p, dbPhoneToSpec(dbPhone)]); setLoading(false); setLoadingName(''); }, 300);
  };

  const fetchAndAdd = async (name) => {
    if (phones.length >= 4 || !name.trim()) return;
    setLoading(true); setLoadingName(name); setShowDropdown(false); setSearchQuery('');
    const result = await fetchExternalPhoneSpecs(name);
    if (result?.spec) setPhones(p => [...p, result.spec]);
    setLoading(false); setLoadingName('');
  };

  const removePhone = (idx, phone) => {
    setPhones(p => p.filter((_, i) => i !== idx));
    if (!phone.isExternal) storeCMS.toggleCompare && storeCMS.toggleCompare(phone.id);
  };

  const canAdd = phones.length < 4;

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 border-b border-white/[0.06]">
        <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#D4AF37] font-bold">SIDE-BY-SIDE MATRIX</span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-[#F8F8F8] mt-1">Compare Any Phone</h1>
        <p className="text-sm text-[#B8BDC8] font-mono mt-2 max-w-xl">
          Search from our store, 150+ phones in our global database, or fetch any phone live from the web.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="relative max-w-2xl mb-8" ref={searchRef}>
          <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl bg-[#0D1117] border-2 transition-all duration-300 shadow-[0_8px_30px_rgba(0,0,0,0.5)] ${canAdd ? 'border-white/[0.10] focus-within:border-[#D4AF37]/70' : 'border-white/[0.04] opacity-60 pointer-events-none'}`}>
            <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => searchQuery.trim().length >= 2 && setShowDropdown(true)}
              placeholder={canAdd ? 'Type any phone — iPhone 17, S25+, OnePlus 13...' : 'Maximum 4 phones reached'}
              disabled={!canAdd || loading}
              className="flex-1 bg-transparent text-[#F8F8F8] text-sm font-mono placeholder:text-[#B8BDC8]/40 outline-none min-w-0"
            />
            {loading && (
              <div className="flex items-center gap-2 text-[#D4AF37] text-xs font-mono shrink-0 bg-[#D4AF37]/10 px-3 py-1.5 rounded-lg">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="truncate max-w-[130px]">Loading {loadingName}...</span>
              </div>
            )}
          </div>

          {/* Dropdown */}
          {showDropdown && (localResults.length > 0 || dbResults.length > 0 || searchQuery.trim().length >= 2) && (
            <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-2 rounded-2xl bg-[#0D1117] border border-white/[0.10] shadow-[0_30px_80px_rgba(0,0,0,0.95)] z-50 overflow-hidden max-h-[500px] overflow-y-auto">

              {localResults.length > 0 && (
                <>
                  <div className="px-4 py-2.5 bg-[#0FAE72]/[0.06] border-b border-white/[0.06] flex items-center gap-2">
                    <Smartphone className="w-3.5 h-3.5 text-[#0FAE72]" />
                    <span className="text-[10px] font-mono font-bold text-[#10C480] uppercase tracking-widest">In Your Store</span>
                  </div>
                  {localResults.map(p => (
                    <button key={p.id} onClick={() => addLocalPhone(p)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition text-left border-b border-white/[0.04]">
                      <img src={p.images?.[0]} alt={p.title} referrerPolicy="no-referrer" className="w-11 h-11 object-contain rounded-xl bg-[#050505] p-1 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F8F8F8] text-sm font-bold font-mono truncate">{p.title}</p>
                        <p className="text-[#B8BDC8] text-[11px] font-mono">{p.brand} • {p.ram} • ₹{p.bmPrice?.toLocaleString('en-IN')}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#0FAE72]/15 border border-[#0FAE72]/30 text-[#10C480] text-[10px] font-mono font-bold shrink-0">+ Add</span>
                    </button>
                  ))}
                </>
              )}

              {dbResults.length > 0 && (
                <>
                  <div className="px-4 py-2.5 bg-[#D4AF37]/[0.06] border-b border-white/[0.06] flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-widest">Global Phone Database (150+ phones)</span>
                  </div>
                  {dbResults.map((phone, i) => (
                    <button key={i} onClick={() => addDBPhone(phone)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] transition text-left border-b border-white/[0.04]">
                      <div className="w-11 h-11 rounded-xl bg-[#050505] flex items-center justify-center shrink-0 overflow-hidden">
                        <img src={getReliableImg(phone)} alt={phone.title}
                          referrerPolicy="no-referrer"
                          className="max-h-full max-w-full object-contain p-1"
                          onError={e => { e.target.src = BRAND_FALLBACK_IMGS[phone.brand] || BRAND_FALLBACK_IMGS.default; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#F8F8F8] text-sm font-bold font-mono truncate">{phone.title}</p>
                        <p className="text-[#B8BDC8] text-[11px] font-mono">{phone.brand} • {phone.ram} • {phone.price}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono font-bold shrink-0">+ Add</span>
                    </button>
                  ))}
                </>
              )}

              {searchQuery.trim().length >= 2 && (
                <button onClick={() => fetchAndAdd(searchQuery.trim())}
                  className="w-full flex items-center gap-3 px-4 py-4 hover:bg-[#D4AF37]/[0.06] transition text-left border-t border-white/[0.08]">
                  <div className="w-11 h-11 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center shrink-0">
                    <Wifi className="w-4 h-4 text-[#D4AF37]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#E7C76A] text-sm font-bold font-mono">Search web for "{searchQuery}"</p>
                    <p className="text-[#B8BDC8] text-[11px] font-mono">Fetch live specs from GSMArena for any phone</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] font-mono font-bold shrink-0">🌐 Fetch</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Slot indicator */}
        {phones.length > 0 && (
          <div className="flex items-center gap-2 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${i < phones.length ? 'w-12 bg-[#D4AF37]' : 'w-8 bg-white/[0.08]'}`} />
            ))}
            <span className="text-[#B8BDC8] text-[11px] font-mono ml-1">{phones.length}/4 phones</span>
            {canAdd && <span className="text-[#B8BDC8] text-[10px] font-mono opacity-50">— add {4 - phones.length} more</span>}
          </div>
        )}

        {/* Empty State */}
        {phones.length === 0 && !loading && (
          <div className="py-20 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto">
              <Layers className="w-12 h-12 text-[#D4AF37]" />
            </div>
            <h2 className="font-display font-black text-3xl text-[#F8F8F8]">Compare Any Phone in the World</h2>
            <p className="text-[#B8BDC8] font-mono text-sm max-w-lg mx-auto">
              Type any phone — iPhone 17, Samsung S25+, OnePlus 13... We have 150+ phones built-in and fetch everything else live.
            </p>
            <div className="flex flex-wrap gap-2.5 justify-center mt-4">
              {SUGGESTIONS.map(name => (
                <button key={name} onClick={() => fetchAndAdd(name)}
                  className="px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] text-[#B8BDC8] text-xs font-mono hover:border-[#D4AF37]/50 hover:text-[#D4AF37] hover:bg-[#D4AF37]/[0.05] transition-all flex items-center gap-1.5">
                  <Plus className="w-3 h-3" />{name}
                </button>
              ))}
            </div>
            <Link to="/products"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-sm transition-all duration-500 mt-2">
              Browse Our Store <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Loading state */}
        {loading && phones.length === 0 && (
          <div className="flex items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-[#D4AF37]" />
            <div>
              <p className="font-display font-bold text-lg text-[#F8F8F8]">Looking up {loadingName}...</p>
              <p className="text-xs font-mono text-[#B8BDC8]">Searching database + web</p>
            </div>
          </div>
        )}

        {/* Compare Table */}
        {phones.length > 0 && (
          <>
            {/* Mobile Scroll Indicator Banner */}
            <div className="sm:hidden mb-3 p-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E7C76A] text-[11px] font-mono text-center font-bold flex items-center justify-center gap-2">
              <span>👈 Swipe table horizontally to compare specs 👉</span>
            </div>

            <div className="overflow-x-auto rounded-[28px] bg-[#0D1117] border border-white/[0.08] shadow-[0_30px_80px_rgba(0,0,0,0.9)]">
              <table className="w-full text-left text-xs font-mono border-collapse" style={{ minWidth: `${Math.max(600, 200 + phones.length * 260)}px` }}>
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="p-5 w-44 text-[#D4AF37] font-bold uppercase tracking-wider text-[11px] align-bottom">Specifications</th>
                    {phones.map((phone, idx) => (
                      <th key={idx} className="p-5 align-top relative text-center" style={{ width: '260px' }}>
                        <button onClick={() => removePhone(idx, phone)}
                          className="absolute top-3 right-3 p-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] text-[#B8BDC8] hover:text-rose-400 hover:border-rose-400/30 hover:bg-rose-400/10 transition">
                          <X className="w-3 h-3" />
                        </button>

                        {phone.isExternal && (
                          <span className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[9px] font-bold border ${phone.sourceLabel === 'GSMArena Live' ? 'bg-blue-500/10 border-blue-400/30 text-blue-300' : phone.noData ? 'bg-rose-500/10 border-rose-400/30 text-rose-300' : 'bg-[#0FAE72]/10 border-[#0FAE72]/30 text-[#10C480]'}`}>
                            {phone.noData ? '⚠️ No Data' : phone.sourceLabel === 'GSMArena Live' ? '🌐 GSMArena' : '✅ Verified'}
                          </span>
                        )}

                        <div className="w-32 h-32 mx-auto mb-3 rounded-2xl bg-[#050505] border border-white/[0.06] flex items-center justify-center overflow-hidden">
                          <PhoneImage phone={phone} className="max-h-full max-w-full object-contain p-2" />
                        </div>

                        <div className="space-y-1 px-1">
                          {!phone.isExternal ? (
                            <Link to={`/product/${phone.id}`}
                              className="font-display font-bold text-sm text-[#F8F8F8] hover:text-[#D4AF37] transition block leading-snug line-clamp-2">
                              {phone.title}
                            </Link>
                          ) : (
                            <p className="font-display font-bold text-sm text-[#F8F8F8] leading-snug">{phone.title}</p>
                          )}
                          {phone.rating && phone.rating !== '—' && (
                            <div className="flex items-center justify-center gap-1 text-[#D4AF37]">
                              <Star className="w-3 h-3 fill-[#D4AF37]" />
                              <span className="text-[11px] font-bold">{phone.rating}</span>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 px-1 flex items-center gap-1.5">
                          {!phone.isExternal ? (
                            <button onClick={() => storeCMS.addToCart(phone, 1)}
                              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0FAE72] to-[#0B8F5C] hover:from-[#D4AF37] hover:to-[#E7C76A] hover:text-[#050505] text-white font-bold text-[11px] transition flex items-center justify-center gap-1.5">
                              <ShoppingBag className="w-3 h-3" /> Add to Bag
                            </button>
                          ) : (
                            <a href={phone.externalLink} target="_blank" rel="noopener noreferrer"
                              className="flex-1 py-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E7C76A] font-bold text-[11px] hover:bg-[#D4AF37]/20 transition flex items-center justify-center gap-1.5">
                              <ExternalLink className="w-3 h-3" /> Specs
                            </a>
                          )}
                          <button onClick={() => sharePhoneDetails(phone)}
                            title="Share Phone Details"
                            className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-[#D4AF37] hover:bg-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition shrink-0">
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/[0.04]">
                  {SPEC_ROWS.map((row) => {
                    const bestIdx = getBestIdx(phones, row);
                    return (
                      <tr key={row.key} className="hover:bg-white/[0.015] transition-colors">
                        <td className="p-5 align-middle">
                          <div className="flex items-center gap-2">
                            <span className="text-base">{row.icon}</span>
                            <span className="font-bold text-[#B8BDC8] uppercase tracking-wider text-[10px]">{row.label}</span>
                          </div>
                        </td>
                        {phones.map((phone, idx) => {
                          const val = phone[row.key];
                          const displayVal = row.format ? row.format(val, phone) : (val || '—');
                          const isBest = bestIdx === idx;
                          return (
                            <td key={idx} className={`p-5 text-center align-middle ${isBest ? 'bg-[#0FAE72]/[0.07]' : ''}`}>
                              <div className="flex flex-col items-center gap-1">
                                <span className={`font-semibold text-[12px] leading-relaxed ${isBest ? 'text-[#10C480]' : 'text-[#F8F8F8]'}`}>
                                  {displayVal}
                                </span>
                                {isBest && (
                                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0FAE72]/15 border border-[#0FAE72]/30 text-[#10C480] text-[9px] font-bold">
                                    <CheckCircle2 className="w-2.5 h-2.5" /> BEST
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}

                  {phones.some(p => p.isExternal) && (
                    <tr className="border-t border-white/[0.08]">
                      <td colSpan={phones.length + 1} className="px-5 py-4">
                        <div className="flex items-start gap-2 text-[#B8BDC8] text-[11px] font-mono">
                          <AlertCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-[#10C480]">✅ Verified</strong> = from our curated database.&nbsp;
                            <strong className="text-blue-300">🌐 GSMArena</strong> = fetched live.&nbsp;
                            Click <strong className="text-[#E7C76A]">"Full Specs"</strong> to view complete specifications.
                          </span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {canAdd && (
              <div className="mt-6 flex flex-wrap items-center gap-2 text-xs font-mono text-[#B8BDC8]">
                <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Add more:</span>
                {SUGGESTIONS.filter(n => !phones.find(p => p.title?.toLowerCase().includes(n.toLowerCase()))).slice(0, 4).map(name => (
                  <button key={name} onClick={() => fetchAndAdd(name)}
                    className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-[#D4AF37]/50 hover:text-[#D4AF37] transition flex items-center gap-1">
                    <Plus className="w-2.5 h-2.5" />{name}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
