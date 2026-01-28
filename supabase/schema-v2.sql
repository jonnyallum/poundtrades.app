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
