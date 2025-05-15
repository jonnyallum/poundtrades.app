# PoundTrades Mobile App

A mobile marketplace app for UK builders, DIYers, and tradespeople to buy and sell surplus building materials.

## Features

- Grid-based marketplace UI
- Create, view, edit, and delete listings
- Photo uploads via camera or gallery
- Google, Email/Password, and Guest login
- Live map with tappable pins
- Seller types with colour codes (Public, Tradesman, Business)
- £1 Stripe unlock to reveal contact info
- £1 boost option for featured visibility
- Favourites + full user dashboard
- **Dark mode / Light mode toggle**
- **Wanted section for posting material requests**
- Supabase backend with Auth, Database, and Storage

## Tech Stack

- **Frontend:** React Native (Expo SDK)
- **Navigation:** Expo Router
- **Backend:** Supabase (Auth, Database, Storage)
- **Payments:** Stripe SDK
- **Mapping:** Mapbox or Google Maps SDK
- **Icons:** Lucide React Native

## Dark Mode Implementation

The app includes a complete dark mode implementation with the following features:

1. **Theme Context**: A React context that provides theme values and a toggle function
2. **System Theme Detection**: Automatically detects and applies the system theme preference
3. **Manual Toggle**: Users can manually toggle between light, dark, and system themes in the More tab
4. **Persistent Settings**: Theme preference is saved and persists between app sessions

### Theme Structure

The theme is defined with the following color tokens:

```typescript
// Light Theme
{
  background: '#f8f8f8',
  card: '#ffffff',
  text: '#000000',
  secondaryText: '#666666',
  border: '#e0e0e0',
  primary: '#FFD700',
  tabBar: '#ffffff',
  tabBarInactive: '#666666',
  statusBar: 'dark',
}

// Dark Theme
{
  background: '#121212',
  card: '#1e1e1e',
  text: '#ffffff',
  secondaryText: '#aaaaaa',
  border: '#333333',
  primary: '#FFD700',
  tabBar: '#000000',
  tabBarInactive: '#666666',
  statusBar: 'light',
}
```

### Usage

To use the theme in a component:

```typescript
import { useTheme } from '@/hooks/useTheme';

export default function MyComponent() {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Hello World</Text>
      <Button onPress={toggleTheme} title="Toggle Theme" />
    </View>
  );
}
```

## Wanted Section

The app now includes a dedicated "Wanted" section where users can:

1. **Browse Wanted Requests**: View items that other users are looking for
2. **Filter by Category**: Filter wanted items by material category
3. **Post Requests**: Create new wanted listings with details like:
   - Item description
   - Category
   - Budget
   - Location
   - Urgency level

This feature helps connect buyers with specific needs to sellers who might have matching materials, creating a more complete marketplace experience.

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Create a `.env` file with your Supabase credentials
4. Start the development server with `npm run dev`

## License

This project is licensed under the MIT License.