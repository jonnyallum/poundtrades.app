-- Enhanced PoundTrades Database Schema
-- This extends the existing schema with specific PoundTrades requirements

-- Contact Detail Purchases table (for £1 payment system)
CREATE TABLE IF NOT EXISTS public.contact_purchases (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE NOT NULL,
  buyer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  seller_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) DEFAULT 1.00 NOT NULL,
  payment_intent_id TEXT,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'succeeded', 'failed', 'cancelled')),
  contact_details_revealed BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE (listing_id, buyer_id)
);

-- Listing Status Enhancement (Green/Amber/Red system)
-- Add new columns to existing listings table
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS listing_status TEXT DEFAULT 'available' CHECK (listing_status IN ('available', 'payment_pending', 'contact_purchased', 'expired'));

ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS contact_hidden BOOLEAN DEFAULT TRUE;

ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS seller_contact_phone TEXT;

ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS seller_contact_email TEXT;

-- Advertising Spaces table
CREATE TABLE IF NOT EXISTS public.advertising_spaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  position TEXT NOT NULL, -- 'header', 'sidebar', 'footer', 'between_listings'
  dimensions TEXT, -- e.g., '300x250', '728x90'
  is_active BOOLEAN DEFAULT TRUE,
  price_per_day DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Advertisements table
CREATE TABLE IF NOT EXISTS public.advertisements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  advertiser_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  space_id UUID REFERENCES public.advertising_spaces(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  target_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enhanced Categories with predefined construction categories
INSERT INTO public.categories (name, slug, description, icon) VALUES
('Timber & Wood', 'timber-wood', 'Timber planks, beams, panels and wood products', '🪵'),
('Bricks & Blocks', 'bricks-blocks', 'Bricks, concrete blocks, and masonry materials', '🧱'),
('Roofing Materials', 'roofing', 'Tiles, slates, guttering, and roofing supplies', '🏠'),
('Plumbing & Heating', 'plumbing-heating', 'Pipes, fittings, boilers, and heating systems', '🔧'),
('Electrical Supplies', 'electrical', 'Cables, switches, lighting, and electrical components', '⚡'),
('Insulation', 'insulation', 'Thermal and acoustic insulation materials', '🏗️'),
('Tools & Equipment', 'tools-equipment', 'Construction tools and heavy equipment', '🔨'),
('Hardware & Fixings', 'hardware-fixings', 'Screws, bolts, brackets, and fixing materials', '⚙️'),
('Doors & Windows', 'doors-windows', 'Internal and external doors, windows, and frames', '🚪'),
('Flooring', 'flooring', 'Laminate, tiles, carpet, and flooring materials', '📐')
ON CONFLICT (slug) DO NOTHING;

-- RLS Policies for new tables

-- Contact purchases policies
ALTER TABLE public.contact_purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contact purchases"
  ON public.contact_purchases FOR SELECT
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

CREATE POLICY "Users can create contact purchases"
  ON public.contact_purchases FOR INSERT
  WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Users can update own contact purchases"
  ON public.contact_purchases FOR UPDATE
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Advertising spaces policies
ALTER TABLE public.advertising_spaces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active advertising spaces"
  ON public.advertising_spaces FOR SELECT
  USING (is_active = true);

-- Advertisements policies
ALTER TABLE public.advertisements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active advertisements"
  ON public.advertisements FOR SELECT
  USING (is_active = true AND start_date <= CURRENT_DATE AND end_date >= CURRENT_DATE);

CREATE POLICY "Advertisers can manage own advertisements"
  ON public.advertisements FOR ALL
  USING (auth.uid() = advertiser_id);

-- Functions for PoundTrades business logic

-- Function to update listing status when contact is purchased
CREATE OR REPLACE FUNCTION public.update_listing_on_contact_purchase()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.payment_status = 'succeeded' AND OLD.payment_status != 'succeeded' THEN
    -- Update listing status to contact_purchased
    UPDATE public.listings
    SET listing_status = 'contact_purchased',
        contact_hidden = FALSE
    WHERE id = NEW.listing_id;
    
    -- Mark contact details as revealed
    UPDATE public.contact_purchases
    SET contact_details_revealed = TRUE
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for contact purchase updates
CREATE TRIGGER on_contact_purchase_payment
  AFTER UPDATE ON public.contact_purchases
  FOR EACH ROW
  EXECUTE FUNCTION public.update_listing_on_contact_purchase();

-- Function to handle expired contact purchases
CREATE OR REPLACE FUNCTION public.handle_expired_contact_purchases()
RETURNS void AS $$
BEGIN
  -- Update expired listings back to available
  UPDATE public.listings
  SET listing_status = 'available',
      contact_hidden = TRUE
  WHERE id IN (
    SELECT listing_id 
    FROM public.contact_purchases 
    WHERE expires_at < now() 
    AND payment_status = 'succeeded'
  );
  
  -- Clean up expired contact purchases
  DELETE FROM public.contact_purchases
  WHERE expires_at < now() AND payment_status = 'succeeded';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track advertisement clicks
CREATE OR REPLACE FUNCTION public.track_ad_click(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.advertisements
  SET clicks = clicks + 1
  WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to track advertisement impressions
CREATE OR REPLACE FUNCTION public.track_ad_impression(ad_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.advertisements
  SET impressions = impressions + 1
  WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add updated_at triggers for new tables
CREATE TRIGGER update_contact_purchases_updated_at
  BEFORE UPDATE ON public.contact_purchases
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advertising_spaces_updated_at
  BEFORE UPDATE ON public.advertising_spaces
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_advertisements_updated_at
  BEFORE UPDATE ON public.advertisements
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default advertising spaces
INSERT INTO public.advertising_spaces (name, description, position, dimensions, price_per_day) VALUES
('Header Banner', 'Top banner across the website header', 'header', '728x90', 25.00),
('Sidebar Rectangle', 'Medium rectangle in the sidebar', 'sidebar', '300x250', 15.00),
('Between Listings', 'Advertisement between listing items', 'between_listings', '320x100', 10.00),
('Footer Banner', 'Banner in the website footer', 'footer', '728x90', 20.00)
ON CONFLICT DO NOTHING;

