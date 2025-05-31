-- Seed data for PoundTrades app

-- Insert categories
INSERT INTO public.categories (name, slug, description, icon)
VALUES
  ('Building Materials', 'building-materials', 'Bricks, timber, cement, and other construction materials', 'construction'),
  ('Electrical', 'electrical', 'Wiring, switches, outlets, and electrical components', 'zap'),
  ('Plumbing', 'plumbing', 'Pipes, fittings, fixtures, and plumbing supplies', 'droplet'),
  ('Tools', 'tools', 'Hand tools, power tools, and equipment', 'tool'),
  ('Flooring', 'flooring', 'Tiles, wood, laminate, and flooring materials', 'square'),
  ('Paint', 'paint', 'Paint, primers, brushes, and painting supplies', 'palette'),
  ('Doors & Windows', 'doors-windows', 'Doors, windows, frames, and related hardware', 'layout'),
  ('Landscaping', 'landscaping', 'Plants, soil, stones, and garden materials', 'flower'),
  ('Furniture', 'furniture', 'Furniture and home furnishings', 'home'),
  ('Other', 'other', 'Miscellaneous building and renovation materials', 'package')
ON CONFLICT (slug) DO NOTHING;

-- Insert admin user (if not exists)
-- Note: This assumes the auth.users entry already exists
-- You would typically create this user through the Supabase Auth API first
INSERT INTO public.users (id, name, email, avatar_url, user_type, is_verified)
VALUES 
  ('00000000-0000-0000-0000-000000000000', 'Admin User', 'admin@poundtrades.co.uk', 'https://randomuser.me/api/portraits/men/32.jpg', 'admin', true)
ON CONFLICT (id) DO NOTHING;

-- Insert test user (if not exists)
-- Note: This assumes the auth.users entry already exists
INSERT INTO public.users (id, name, email, avatar_url, user_type, is_verified)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Test User', 'test@poundtrades.co.uk', 'https://randomuser.me/api/portraits/women/44.jpg', 'user', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample listings
INSERT INTO public.listings (
  title, 
  description, 
  price, 
  category, 
  condition, 
  location, 
  latitude, 
  longitude, 
  images, 
  is_featured, 
  status, 
  user_id
)
VALUES
  (
    'Leftover Bricks - 200 Red Clay Bricks',
    'Approximately 200 red clay bricks left over from a recent building project. In excellent condition, never used. Perfect for garden walls, pathways, or small construction projects. Collection only from Manchester area.',
    50.00,
    'building-materials',
    'new',
    'Manchester, UK',
    53.4808, 
    -2.2426,
    ARRAY['https://images.pexels.com/photos/2469046/pexels-photo-2469046.jpeg'],
    true,
    'active',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'Unused Bathroom Tiles - White Ceramic 20x20cm',
    'Box of 25 white ceramic bathroom tiles, 20x20cm each. Bought too many for my renovation project. Brand new, unopened box. Collection from Liverpool or can arrange delivery for additional cost.',
    30.00,
    'flooring',
    'new',
    'Liverpool, UK',
    53.4084, 
    -2.9916,
    ARRAY['https://images.pexels.com/photos/5824901/pexels-photo-5824901.jpeg'],
    false,
    'active',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'Dewalt Power Drill - Barely Used',
    'Dewalt DCD776 18V Cordless Hammer Drill. Used only once for a small home project. Comes with original case, charger, and 2 batteries. Works perfectly, almost like new. Collection from Birmingham area.',
    75.00,
    'tools',
    'like_new',
    'Birmingham, UK',
    52.4862, 
    -1.8904,
    ARRAY['https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg'],
    true,
    'active',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'Leftover Paint - 2L Dulux Magnolia',
    'Approximately 2 liters of Dulux Magnolia matt emulsion paint. Opened but barely used. Perfect for touch-ups or small rooms. Collection only from Leeds area.',
    10.00,
    'paint',
    'good',
    'Leeds, UK',
    53.8008, 
    -1.5491,
    ARRAY['https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg'],
    false,
    'active',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'Copper Pipe Offcuts - Various Sizes',
    'Collection of copper pipe offcuts from plumbing work. Various sizes from 15mm to 28mm. Good condition, some may need cleaning. Useful for small plumbing jobs or craft projects. Collection from Sheffield.',
    15.00,
    'plumbing',
    'good',
    'Sheffield, UK',
    53.3811, 
    -1.4701,
    ARRAY['https://images.pexels.com/photos/4491881/pexels-photo-4491881.jpeg'],
    false,
    'active',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'Wooden Pallets - Set of 5',
    'Set of 5 wooden pallets in good condition. Perfect for furniture projects, garden use, or storage. Collection only from Bristol area. Can help load into vehicle if needed.',
    20.00,
    'building-materials',
    'good',
    'Bristol, UK',
    51.4545, 
    -2.5879,
    ARRAY['https://images.pexels.com/photos/5976503/pexels-photo-5976503.jpeg'],
    true,
    'active',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'Interior Door - White Primed 762mm',
    'Standard interior door, white primed, 762mm x 1981mm. Removed during renovation but in good condition. Some minor marks but nothing significant. Collection from Newcastle area.',
    25.00,
    'doors-windows',
    'good',
    'Newcastle, UK',
    54.9783, 
    -1.6178,
    ARRAY['https://images.pexels.com/photos/276663/pexels-photo-276663.jpeg'],
    false,
    'active',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    'Garden Stones - Decorative Pebbles',
    'Approximately 15kg of decorative garden pebbles. Mixed colors, mainly whites and greys. Left over from landscaping project. Collection from Glasgow area.',
    12.00,
    'landscaping',
    'new',
    'Glasgow, UK',
    55.8642, 
    -4.2518,
    ARRAY['https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg'],
    false,
    'active',
    '11111111-1111-1111-1111-111111111111'
  );

-- Insert sample saved listings
INSERT INTO public.saved_listings (user_id, listing_id)
VALUES 
  ('00000000-0000-0000-0000-000000000000', (SELECT id FROM public.listings WHERE title LIKE 'Dewalt Power Drill%' LIMIT 1)),
  ('00000000-0000-0000-0000-000000000000', (SELECT id FROM public.listings WHERE title LIKE 'Wooden Pallets%' LIMIT 1))
ON CONFLICT (user_id, listing_id) DO NOTHING;

-- Insert sample messages
INSERT INTO public.messages (sender_id, recipient_id, listing_id, content, is_read)
VALUES 
  (
    '00000000-0000-0000-0000-000000000000', 
    '11111111-1111-1111-1111-111111111111', 
    (SELECT id FROM public.listings WHERE title LIKE 'Dewalt Power Drill%' LIMIT 1),
    'Hi, is this drill still available? Would you consider delivering to the Manchester area?',
    true
  ),
  (
    '11111111-1111-1111-1111-111111111111', 
    '00000000-0000-0000-0000-000000000000', 
    (SELECT id FROM public.listings WHERE title LIKE 'Dewalt Power Drill%' LIMIT 1),
    'Yes, it''s still available. I could deliver to Manchester for an extra £10 to cover fuel costs. Would that work for you?',
    false
  );

-- Insert sample reviews
INSERT INTO public.reviews (reviewer_id, reviewed_id, listing_id, rating, comment)
VALUES 
  (
    '00000000-0000-0000-0000-000000000000', 
    '11111111-1111-1111-1111-111111111111', 
    (SELECT id FROM public.listings WHERE title LIKE 'Leftover Bricks%' LIMIT 1),
    5,
    'Great seller, bricks were exactly as described and they helped load them into my van. Would definitely buy from again!'
  );

-- Insert sample notifications
INSERT INTO public.notifications (user_id, type, title, message, data, is_read)
VALUES 
  (
    '11111111-1111-1111-1111-111111111111',
    'message',
    'New message received',
    'You have a new message about your listing "Dewalt Power Drill - Barely Used"',
    json_build_object(
      'listing_id', (SELECT id FROM public.listings WHERE title LIKE 'Dewalt Power Drill%' LIMIT 1),
      'sender_id', '00000000-0000-0000-0000-000000000000'
    ),
    true
  ),
  (
    '11111111-1111-1111-1111-111111111111',
    'review',
    'New review received',
    'You have received a 5-star review for your listing "Leftover Bricks - 200 Red Clay Bricks"',
    json_build_object(
      'listing_id', (SELECT id FROM public.listings WHERE title LIKE 'Leftover Bricks%' LIMIT 1),
      'reviewer_id', '00000000-0000-0000-0000-000000000000'
    ),
    false
  );