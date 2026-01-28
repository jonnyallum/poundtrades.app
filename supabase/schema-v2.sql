-- Database Schema for Poundtrades 2.0 (Premium)

-- Enums for roles and listing status
CREATE TYPE user_role AS ENUM ('private', 'business', 'direct', 'admin');
CREATE TYPE listing_status AS ENUM ('active', 'pending', 'sold');

-- User Profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  role user_role DEFAULT 'private',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Listings Table
CREATE TABLE listings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  price_pounds NUMERIC DEFAULT 0,
  unlock_fee_pounds NUMERIC DEFAULT 1.00,
  category TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  status listing_status DEFAULT 'active',
  unlocked_at TIMESTAMPTZ,
  unlocked_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ads Table for Partners
CREATE TABLE ads (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  partner_name TEXT, -- e.g., 'Jewson'
  content TEXT,
  cta_url TEXT,
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to handle 3-day auto-expiry logic
-- This would be called by a cron job or background worker
CREATE OR REPLACE FUNCTION handle_expired_listings()
RETURNS VOID AS $$
BEGIN
  -- If listing was red for 3 days and not marked as 'sold' permanently, return to Green or delete
  -- Business rule: "stays red for 3 days, and either deletes itself, or goes back to green if hasn't actually sold"
  UPDATE listings 
  SET status = 'active', unlocked_at = NULL, unlocked_by = NULL
  WHERE status = 'sold' 
  AND unlocked_at < NOW() - INTERVAL '3 days';
END;
$$ LANGUAGE plpgsql;

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone." ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile." ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile." ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Listings Policies
CREATE POLICY "Listings are viewable by everyone." ON listings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create listings." ON listings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update own listings." ON listings
  FOR UPDATE USING (auth.uid() = seller_id);

CREATE POLICY "Users can delete own listings." ON listings
  FOR DELETE USING (auth.uid() = seller_id);

-- Trigger to automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url',
    (COALESCE(new.raw_user_meta_data->>'role', 'private'))::user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
