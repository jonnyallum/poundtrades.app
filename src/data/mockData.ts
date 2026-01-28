export const mockListings = [
  {
    id: 1,
    title: 'Unused Timber Planks - 20 Pieces',
    description: 'Leftover timber planks from recent project. In perfect condition. 20 pieces of 2.4m x 100mm x 50mm.',
    price: 120,
    location: 'Manchester',
    images: [
      'https://images.pexels.com/photos/6474555/pexels-photo-6474555.jpeg',
      'https://images.pexels.com/photos/5974327/pexels-photo-5974327.jpeg'
    ],
    userType: 'Tradesperson',
    status: 'available',
    category: 'Timber',
    quantity: 20,
    dimensions: '2.4m x 100mm x 50mm',
    condition: 'New',
    createdAt: '2025-03-15T12:00:00Z',
    latitude: 53.4808,
    longitude: -2.2426,
  },
  {
    id: 2,
    title: 'Reclaimed Red Brick - Half Pallet',
    description: 'Reclaimed red bricks from Victorian building. Perfect for feature walls or garden projects. Approximately 250 bricks.',
    price: 175,
    location: 'Liverpool',
    images: [
      'https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg',
      'https://images.pexels.com/photos/1755288/pexels-photo-1755288.jpeg'
    ],
    userType: 'Local Business',
    status: 'available',
    category: 'Bricks',
    quantity: 250,
    dimensions: 'Standard size',
    condition: 'Used - Good',
    createdAt: '2025-03-18T09:30:00Z',
    latitude: 53.4084,
    longitude: -2.9916,
  },
  {
    id: 3,
    title: 'Ceramic Floor Tiles - 15m²',
    description: 'Grey ceramic floor tiles. Ordered too many for kitchen renovation. 15m² available. 600x600mm size.',
    price: 220,
    location: 'Birmingham',
    images: [
      'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg',
      'https://images.pexels.com/photos/5490778/pexels-photo-5490778.jpeg'
    ],
    userType: 'Public',
    status: 'unlocked',
    category: 'Tiles',
    quantity: 42,
    dimensions: '600mm x 600mm',
    condition: 'New',
    createdAt: '2025-03-20T14:15:00Z',
    latitude: 52.4862,
    longitude: -1.8904,
  },
  {
    id: 4,
    title: 'Concrete Blocks - 35 Pieces',
    description: 'Lightweight concrete blocks leftover from extension project. 7.3N solid blocks. Collection only.',
    price: 85,
    location: 'Leeds',
    images: [
      'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg',
      'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg'
    ],
    userType: 'Tradesperson',
    status: 'available',
    category: 'Concrete',
    quantity: 35,
    dimensions: '440mm x 215mm x 100mm',
    condition: 'New',
    createdAt: '2025-03-16T10:45:00Z',
    latitude: 53.8008,
    longitude: -1.5491,
  },
  {
    id: 5,
    title: 'Makita Cordless Drill - Nearly New',
    description: 'Makita 18V cordless drill. Used on one project only. Comes with 2 batteries, charger and case.',
    price: 95,
    location: 'Sheffield',
    images: [
      'https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg',
      'https://images.pexels.com/photos/1249611/pexels-photo-1249611.jpeg'
    ],
    userType: 'Public',
    status: 'available',
    category: 'Tools',
    quantity: 1,
    dimensions: 'N/A',
    condition: 'Used - Like New',
    createdAt: '2025-03-21T16:30:00Z',
    latitude: 53.3811,
    longitude: -1.4701,
  },
  {
    id: 6,
    title: 'Dulux Paint - 5L White Emulsion',
    description: 'Unopened 5L tin of Dulux Pure Brilliant White matt emulsion. Bought too much for decorating project.',
    price: 18,
    location: 'Bristol',
    images: [
      'https://images.pexels.com/photos/5582597/pexels-photo-5582597.jpeg',
      'https://images.pexels.com/photos/5582597/pexels-photo-5582597.jpeg'
    ],
    userType: 'Public',
    status: 'sold',
    category: 'Paint',
    quantity: 1,
    dimensions: '5 Liters',
    condition: 'New',
    createdAt: '2025-03-19T11:20:00Z',
    latitude: 51.4545,
    longitude: -2.5879,
  },
  {
    id: 7,
    title: 'Insulation Sheets - 50mm Kingspan',
    description: 'Leftover Kingspan K108 insulation sheets. 2.4m x 1.2m x 50mm. 5 full sheets available.',
    price: 150,
    location: 'Newcastle',
    images: [
      'https://images.pexels.com/photos/6486806/pexels-photo-6486806.jpeg',
      'https://images.pexels.com/photos/5691622/pexels-photo-5691622.jpeg'
    ],
    userType: 'Tradesperson',
    status: 'available',
    category: 'Other',
    quantity: 5,
    dimensions: '2.4m x 1.2m x 50mm',
    condition: 'New',
    createdAt: '2025-03-17T08:15:00Z',
    latitude: 54.9783,
    longitude: -1.6178,
  },
  {
    id: 8,
    title: 'Bathroom Suite - Complete Set',
    description: 'Complete bathroom suite including toilet, basin with pedestal, and bath. White. Good condition, removed during renovation.',
    price: 200,
    location: 'Glasgow',
    images: [
      'https://images.pexels.com/photos/6444367/pexels-photo-6444367.jpeg',
      'https://images.pexels.com/photos/6585601/pexels-photo-6585601.jpeg'
    ],
    userType: 'Local Business',
    status: 'unlocked',
    category: 'Other',
    quantity: 1,
    dimensions: 'Various',
    condition: 'Used - Good',
    createdAt: '2025-03-22T13:00:00Z',
    latitude: 55.8642,
    longitude: -4.2518,
  }
];

export const mockUserProfile = {
  id: 1,
  name: 'John Builder',
  email: 'john@example.com',
  userType: 'Tradesperson',
  image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
  joinDate: '2024-01-15',
  phone: '07700 900123',
  location: 'Manchester, UK',
  bio: 'Professional builder with over 10 years of experience.'
};

export const mockUserListings = [
  {
    id: 101,
    title: 'Unused Timber Planks - Premium Quality',
    price: 95,
    location: 'Manchester',
    images: [
      'https://images.pexels.com/photos/6474555/pexels-photo-6474555.jpeg'
    ],
    status: 'available',
    userType: 'Tradesperson',
    createdAt: '2025-03-15T12:00:00Z',
  },
  {
    id: 102,
    title: 'Reclaimed Bricks - Victorian',
    price: 150,
    location: 'Manchester',
    images: [
      'https://images.pexels.com/photos/207142/pexels-photo-207142.jpeg'
    ],
    status: 'unlocked',
    userType: 'Tradesperson',
    createdAt: '2025-03-10T09:30:00Z',
  },
  {
    id: 103,
    title: 'Cement Mixer - Good Working Order',
    price: 120,
    location: 'Manchester',
    images: [
      'https://images.pexels.com/photos/175039/pexels-photo-175039.jpeg'
    ],
    status: 'sold',
    userType: 'Tradesperson',
    createdAt: '2025-02-28T15:45:00Z',
  },
];