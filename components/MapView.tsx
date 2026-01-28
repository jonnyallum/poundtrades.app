import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useTheme } from '@/hooks/useTheme';
import { env } from '@/lib/env';

const mapboxConfigured = Boolean(env.mapboxToken);

if (mapboxConfigured) {
  Mapbox.setAccessToken(env.mapboxToken!);
} else {
  console.warn(
    'Mapbox token is not configured. Define EXPO_PUBLIC_MAPBOX_TOKEN to enable map rendering.',
  );
}

interface ListingLocation {
  id: string | number;
  latitude: number;
  longitude: number;
  title: string;
  userType?: string;
}

interface MarkerLocation extends ListingLocation {
  markerColor: string;
}

const getMarkerColor = (userType?: string) => {
  switch (userType) {
    case 'Tradesperson':
      return '#EA4335';
    case 'Local Business':
      return '#34A853';
    default:
      return '#4285F4';
  }
};

interface MapViewProps {
  latitude?: number;
  longitude?: number;
  title?: string;
  showUserLocation?: boolean;
  height?: number;
  zoomLevel?: number;
  listings?: ListingLocation[];
  selectedListing?: ListingLocation | null;
  onMarkerPress?: (listing: ListingLocation) => void;
}

/**
 * MapView component using Mapbox
 * 
 * Displays a map centered on the provided coordinates with an optional marker
 * Can show the user's current location if showUserLocation is true
 */
const MapView: React.FC<MapViewProps> = ({
  latitude,
  longitude,
  title,
  showUserLocation = false,
  height = 200,
  zoomLevel = 14,
  listings,
  selectedListing,
  onMarkerPress,
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

  if (!mapboxConfigured) {
    return (
      <View style={[styles.container, { height, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.fallbackText, { color: theme.secondaryText }]}>Map preview unavailable</Text>
        <Text style={[styles.fallbackHint, { color: theme.secondaryText }]}>Configure EXPO_PUBLIC_MAPBOX_TOKEN to enable Mapbox.</Text>
      </View>
    );
  }

  const markers = useMemo<MarkerLocation[]>(() => {
    if (listings && listings.length > 0) {
      return listings.map((listing) => ({
        id: listing.id,
        latitude: listing.latitude,
        longitude: listing.longitude,
        title: listing.title,
        userType: listing.userType,
        markerColor: getMarkerColor(listing.userType),
      }));
    }

    if (latitude != null && longitude != null) {
      return [{
        id: 'primary',
        latitude,
        longitude,
        title: title ?? 'Location',
        markerColor: getMarkerColor(),
      }];
    }

    return [];
  }, [latitude, longitude, listings, title]);

  const centerLatitude = selectedListing?.latitude ?? markers[0]?.latitude ?? latitude ?? 51.5074;
  const centerLongitude = selectedListing?.longitude ?? markers[0]?.longitude ?? longitude ?? -0.1278;

  // Handle map load completion
  const onMapLoad = () => {
    setLoading(false);
  };

  return (
    <View style={[styles.container, { height }]}>
      {loading && (
        <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      )}
      
      <Mapbox.MapView
        style={styles.map}
        styleURL={Mapbox.StyleURL.Dark}
        onDidFinishLoadingMap={onMapLoad}
        logoEnabled={false}
        attributionEnabled={false}
      >
        <Mapbox.Camera
          zoomLevel={zoomLevel}
          centerCoordinate={[centerLongitude, centerLatitude]}
          animationMode="flyTo"
          animationDuration={1000}
        />

        {/* Marker at the specified locations */}
        {markers.map((marker) => (
          <Mapbox.PointAnnotation
            key={String(marker.id)}
            id={String(marker.id)}
            coordinate={[marker.longitude, marker.latitude]}
            title={marker.title}
            onSelected={() => onMarkerPress?.(marker)}
          >
            <View
              style={[
                styles.marker,
                { backgroundColor: marker.markerColor },
                marker.id === selectedListing?.id && styles.selectedMarker,
              ]}
            />
          </Mapbox.PointAnnotation>
        ))}

        {/* Show user location if enabled */}
        {showUserLocation && (
          <Mapbox.UserLocation
            visible={true}
            showsUserHeadingIndicator={true}
            animated={true}
          />
        )}
      </Mapbox.MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  marker: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#ffffff',
    transform: [{ scale: 1 }],
  },
  selectedMarker: {
    borderWidth: 3,
    borderColor: '#111827',
    transform: [{ scale: 1.35 }],
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: '600',
  },
  fallbackHint: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default MapView;
