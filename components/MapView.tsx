import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { useTheme } from '@/hooks/useTheme';

// Initialize Mapbox with the API key
Mapbox.setAccessToken(process.env.MAPBOX_API_KEY || 'pk.eyJ1IjoicHRyYWRlczY5IiwiYSI6ImNtYmNqNzdlazFsd3AybHMxdHkwcG1ndWwifQ.nPJxSWKIN780x2fr5SjfsQ');

interface MapViewProps {
  latitude: number;
  longitude: number;
  title?: string;
  showUserLocation?: boolean;
  height?: number;
  zoomLevel?: number;
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
}) => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);

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
          centerCoordinate={[longitude, latitude]}
          animationMode="flyTo"
          animationDuration={1000}
        />
        
        {/* Marker at the specified location */}
        <Mapbox.PointAnnotation
          id="destinationMarker"
          coordinate={[longitude, latitude]}
          title={title || "Location"}
        >
          {/* PointAnnotation requires children, even if empty */}
          <View />
        </Mapbox.PointAnnotation>
        
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
});

export default MapView;