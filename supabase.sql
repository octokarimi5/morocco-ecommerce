-- 1. Create Tables

CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  main_image_url text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  name text NOT NULL,
  sku text,
  price_mad numeric(10, 2) NOT NULL,
  compare_at_price_mad numeric(10, 2),
  is_default boolean DEFAULT false,
  max_per_order int DEFAULT 5,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number varchar(20) UNIQUE NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'shipped', 'delivered', 'canceled')),
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  city text NOT NULL,
  address_line text NOT NULL,
  notes text,
  offer_id uuid REFERENCES offers(id),
  quantity int DEFAULT 1,
  subtotal_mad numeric(10, 2) NOT NULL,
  shipping_mad numeric(10, 2) DEFAULT 0,
  total_mad numeric(10, 2) NOT NULL,
  utm_source text,
  utm_campaign text,
  pixel_event_id text,
  admin_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE TABLE order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('status_change', 'note_added')),
  old_status text,
  new_status text,
  admin_user_id uuid REFERENCES auth.users(id),
  note text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  phone text NOT NULL,
  source text DEFAULT 'gift_popup',
  utm_source text,
  utm_campaign text,
  created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Note: We use Supabase's built-in auth.users, so we don't need a separate admin_users table for this MVP. We assume users in auth.users are admins for this single-tenant app.

-- 2. Row Level Security (RLS)

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Products
CREATE POLICY "Public can read active products" ON products FOR SELECT USING (status = 'active');
CREATE POLICY "Admins can insert/update products" ON products FOR ALL USING (auth.uid() IS NOT NULL);

-- Offers
CREATE POLICY "Public can read offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Admins can insert/update offers" ON offers FOR ALL USING (auth.uid() IS NOT NULL);

-- Orders
-- Public can INSERT orders (checkout), but cannot SELECT or UPDATE them
CREATE POLICY "Public can insert orders" ON orders FOR INSERT WITH CHECK (true);
-- Admins can do everything
CREATE POLICY "Admins can manage orders" ON orders FOR ALL USING (auth.uid() IS NOT NULL);

-- Order Events
CREATE POLICY "Admins can manage order events" ON order_events FOR ALL USING (auth.uid() IS NOT NULL);

-- Leads
-- Public can INSERT leads (gift popup), but cannot SELECT
CREATE POLICY "Public can insert leads" ON leads FOR INSERT WITH CHECK (true);
-- Admins can do everything
CREATE POLICY "Admins can manage leads" ON leads FOR ALL USING (auth.uid() IS NOT NULL);

-- Settings
-- Public can SELECT specific settings
CREATE POLICY "Public can read settings" ON settings FOR SELECT USING (true);
-- Admins can do everything
CREATE POLICY "Admins can manage settings" ON settings FOR ALL USING (auth.uid() IS NOT NULL);

-- 3. Initial Seed Data
INSERT INTO settings (key, value) VALUES 
('shipping_fees', '{"default": 0, "express": 30}'),
('delivery_estimates', '{"default": "2-4 jours", "Casablanca": "24h"}'),
('tracking_pixels', '{"facebook": null, "tiktok": null, "google": null}');
