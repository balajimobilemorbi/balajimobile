-- ==============================================================================
-- 📱 BALAJI MOBILE - COMPLETE SUPABASE POSTGRESQL DATABASE SCHEMA
-- ==============================================================================
-- Run this SQL in your Supabase Project SQL Editor (https://supabase.com/dashboard/project/_/sql)
-- 
-- Features enabled:
-- 1. store_data table (Central JSONB store for real-time synchronization)
-- 2. orders table (Realtime customer checkout & tracking)
-- 3. inquiries table (Customer contact messages & callbacks)
-- 4. Enable Supabase Realtime Broadcasting on store_data and orders
-- ==============================================================================

-- 1. CREATE STORE_DATA TABLE (Main CMS & Sync Store)
CREATE TABLE IF NOT EXISTS public.store_data (
    id TEXT PRIMARY KEY,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. CREATE ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE,
    customer_name TEXT,
    customer_phone TEXT,
    customer_email TEXT,
    shipping_address JSONB,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'Pending',
    order_status TEXT DEFAULT 'Processing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. CREATE INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    product_id TEXT,
    status TEXT DEFAULT 'New',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.store_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public / anon read and write access to store_data
DROP POLICY IF EXISTS "Public Read store_data" ON public.store_data;
CREATE POLICY "Public Read store_data" ON public.store_data FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert store_data" ON public.store_data;
CREATE POLICY "Public Insert store_data" ON public.store_data FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update store_data" ON public.store_data;
CREATE POLICY "Public Update store_data" ON public.store_data FOR UPDATE USING (true);

-- Allow public read & insert on orders
DROP POLICY IF EXISTS "Public Insert orders" ON public.orders;
CREATE POLICY "Public Insert orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Select orders" ON public.orders;
CREATE POLICY "Public Select orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Update orders" ON public.orders;
CREATE POLICY "Public Update orders" ON public.orders FOR UPDATE USING (true);

-- Allow public insert on inquiries
DROP POLICY IF EXISTS "Public Insert inquiries" ON public.inquiries;
CREATE POLICY "Public Insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Select inquiries" ON public.inquiries;
CREATE POLICY "Public Select inquiries" ON public.inquiries FOR SELECT USING (true);

-- 5. ENABLE REALTIME PUBLICATION FOR REAL-TIME STORE UPDATES
BEGIN;
  -- Add tables to supabase_realtime publication if not already present
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'store_data'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.store_data;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;
  END $$;
COMMIT;

-- 6. SUCCESS CONFIRMATION
SELECT '✅ Balaji Mobile Supabase Database initialized successfully!' AS status;
