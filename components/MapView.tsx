import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin } from 'lucide-react-native';

type MapViewProps = {
  listings: any[];
  selectedListing: any;
};

// This is a placeholder component for the map view
// In a real implementation, you would use a library like react-native-maps
export default function MapView({ listings, selectedListing }: MapViewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.placeholderText}>Map View</Text>
      <Text style={styles.description}>
        This would be integrated with a mapping library showing {listings.length} pins
      </Text>
      
      {/* Placeholder map pins */}
      <View style={styles.mapContent}>
        {listings.map((listing) => {
          // Determine pin color based on user type
          let pinColor = '#4285F4'; // Default blue for public
          if (listing.userType === 'Tradesperson') {
            pinColor = '#EA4335'; // Red for tradesperson
          } else if (listing.userType === 'Local Business') {
            pinColor = '#34A853'; // Green for business
          }
          
          const isSelected = selectedListing && selectedListing.id === listing.id;
          
          return (
            <View 
              key={listing.id} 
              style={[
                styles.mapPin,
                { 
                  left: `${Math.random() * 80 + 10}%`, 
                  top: `${Math.random() * 80 + 10}%`,
                  transform: [{ scale: isSelected ? 1.4 : 1 }]
                }
              ]}
            >
              <MapPin size={isSelected ? 28 : 22} color={pinColor} fill={isSelected ? pinColor : 'transparent'} />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    marginHorizontal: 40,
  },
  mapContent: {
    ...StyleSheet.absoluteFillObject,
  },
  mapPin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
  },
});