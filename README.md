# BM Mobile - Premium Mobile E-Commerce & No-Code CMS Platform

BM Mobile is a production-ready, enterprise-grade mobile e-commerce platform and no-code Admin CMS built with React 19, Vite, Tailwind CSS, Framer Motion, and Supabase integration.

---

## 🌟 Key Platform Features

- **Luxury Titanium & Deep Emerald Aesthetics**: Glassmorphic UI cards, smooth animations, dark green highlights, floating micro-badges.
- **360° Interactive Smartphone Inspector**: Canvas drag-to-rotate phone viewer for multi-angle customer inspection.
- **Dual Database & Sync Engine**: Persistent local storage engine with instant sync + Supabase PostgreSQL support.
- **No-Code Admin Dashboard (CMS)**: Manage products, inventory, flash sales, hero banners, coupons, GST invoices, and store settings without touching source code.
- **Multi-Gateway Payment Integration**: Simulated Razorpay & Stripe checkouts with instant UPI (GPay/PhonePe/Paytm/BHIM), Cards, NetBanking, 0% EMI, and Cash on Delivery.
- **Automated GST Tax Invoice PDF Generator**: Download official e-invoices with GSTIN breakdown, HSN 8517 code, and digital authorization signatures.
- **Logistics & Delivery Timeline**: PIN code deliverability checker with estimated courier timelines via Shiprocket / BlueDart.
- **AI Live Search & Filters**: Brand, RAM, Storage, Price slider, Condition, and Natural Language prompt chips.

---

## 🚀 Quick Start Guide

### 1. Local Development
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

### 2. Production Build
```bash
# Compile optimized distribution bundle
npm run build
```

---

## 🛠️ Deploying to Custom Domain

### Deploy on Vercel
1. Push project to GitHub.
2. Import project into Vercel dashboard.
3. Add custom domain in Vercel settings (`bmmobile.com`).

### Deploy on Netlify
1. Connect repository to Netlify.
2. Build command: `npm run build`, Publish directory: `dist`.
3. Configure custom domain in Netlify DNS.

---

## 🗄️ Supabase PostgreSQL Setup
1. Open Admin Dashboard at `/admin`.
2. Go to **Supabase SQL & Backup** tab.
3. Download `BM_Mobile_Supabase_Schema.sql`.
4. Run the script in your Supabase SQL Editor to auto-create tables and RLS security policies.
