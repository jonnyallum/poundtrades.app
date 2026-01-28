import React, { useMemo, useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, Pressable, Platform } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { Layers, Navigation, MapPin } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { env } from '@/lib/env';

const mapboxConfigured = Boolean(env.mapboxToken);

if (mapboxConfigured) {
  Mapbox.setAccessToken(env.mapboxToken!);
}

interface ListingLocation {
  id: string | number;
  latitude: number;
  longitude: number;
  title: string;
  price?: number | string;
  userType?: string;
}

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
  cinematic?: boolean;
  earthZoom?: boolean;
}

const MarkerPulse = ({ color }: { color: string }) => {
  const isWeb = Platform.OS === 'web';
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    if (!isWeb) {
      scale.value = withRepeat(withTiming(2.2, { duration: 2500 }), -1, false);
      opacity.value = withRepeat(withTiming(0, { duration: 2500 }), -1, false);
    }
  }, [isWeb]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  // On web, use a simple static pulse (can be enhanced with CSS animation)
  if (isWeb) {
    return (
      <View
        style={[
          styles.pulse,
          { backgroundColor: color, opacity: 0.4 }
        ]}
      />
    );
  }

  return (
    <Animated.View
      style={[
        styles.pulse,
        { backgroundColor: color },
        animatedStyle
      ]}
    />
  );
};

const MapView: React.FC<MapViewProps> = ({
  latitude,
  longitude,
  title,
  showUserLocation = false,
  height = 300,
  zoomLevel = 13,
  listings = [],
  selectedListing,
  onMarkerPress,
  cinematic = false,
  earthZoom = false,
}) => {
  const { theme } = useTheme();
  const isWeb = Platform.OS === 'web';
  const [loading, setLoading] = useState(true);
  const [satellite, setSatellite] = useState(false);
  const cameraRef = useRef<Mapbox.Camera>(null);

  if (!mapboxConfigured) {
    return (
      <View style={[styles.container, { height, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.surface }]}>
        <MapPin size={32} color={theme.colors.textMuted} />
        <Text style={[styles.fallbackText, { color: theme.colors.text }]}>Map preview unavailable</Text>
        <Text style={[styles.fallbackHint, { color: theme.colors.textMuted }]}>Configure EXPO_PUBLIC_MAPBOX_TOKEN to enable maps.</Text>
      </View>
    );
  }

  const getMarkerColor = (userType?: string) => {
    switch (userType) {
      case 'Tradesperson': return theme.colors.status.sold;
      case 'Local Business': return theme.colors.status.active;
      default: return theme.colors.primary;
    }
  };

  const centerCoord = useMemo(() => {
    if (selectedListing) return [selectedListing.longitude, selectedListing.latitude];
    if (listings.length > 0) return [listings[0].longitude, listings[0].latitude];
    if (longitude != null && latitude != null) return [longitude, latitude];
    return [-0.1278, 51.5074]; // London
  }, [selectedListing, listings, longitude, latitude]);

  const mapStyle = satellite ? Mapbox.StyleURL.SatelliteStreet : (theme.statusBar === 'dark' ? Mapbox.StyleURL.Dark : Mapbox.StyleURL.Light);

  return (
    <View style={[styles.container, { height, borderColor: theme.colors.border }]}>
      {loading && (
        <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      )}

      <Mapbox.MapView
        style={styles.map}
        styleURL={mapStyle}
        onDidFinishLoadingMap={() => setLoading(false)}
        logoEnabled={false}
        attributionEnabled={false}
        antialias={true}
      >
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={earthZoom && loading ? 1 : zoomLevel}
          centerCoordinate={centerCoord as number[]}
          animationMode="flyTo"
          animationDuration={earthZoom ? 4000 : 1500}
          pitch={cinematic ? 45 : 0}
          bearing={cinematic ? 15 : 0}
        />

        <Mapbox.RasterDemSource
          id="mapbox-dem"
          url="mapbox://mapbox.mapbox-terrain-dem-v1"
          tileSize={512}
          maxZoomLevel={14}
        >
          <Mapbox.Terrain style={{ exaggeration: 1.5 }} />
        </Mapbox.RasterDemSource>

        <Mapbox.SkyLayer
          id="sky-layer"
          style={{
            skyType: 'atmosphere',
            skyAtmosphereColor: theme.statusBar === 'dark' ? '#000' : '#87CEEB',
            skyAtmosphereSun: [0.0, 90.0],
          }}
        />

        {listings.map((item) => (
          <Mapbox.PointAnnotation
            key={String(item.id)}
            id={String(item.id)}
            coordinate={[item.longitude, item.latitude]}
            onSelected={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onMarkerPress?.(item);
            }}
            anchor={{ x: 0.5, y: 1 }}
          >
            <View style={styles.markerContainer}>
              {selectedListing?.id === item.id && (
                <MarkerPulse color={getMarkerColor(item.userType)} />
              )}
              <View
                style={[
                  styles.marker,
                  {
                    backgroundColor: getMarkerColor(item.userType),
                    borderColor: theme.colors.surface,
                    transform: [{ scale: selectedListing?.id === item.id ? 1.3 : 1 }]
                  }
                ]}
              />
            </View>
          </Mapbox.PointAnnotation>
        ))}

        {showUserLocation && (
          <Mapbox.UserLocation
            visible={true}
            showsUserHeadingIndicator={true}
            animated={true}
          />
        )}
      </Mapbox.MapView>

      <View style={styles.controls}>
        <Pressable
          onPress={() => {
            setSatellite(!satellite);
            Haptics.selectionAsync();
          }}
          style={[styles.controlButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        >
          <Layers size={20} color={theme.colors.text} />
        </Pressable>
        <Pressable
          onPress={() => {
            cameraRef.current?.setCamera({
              centerCoordinate: centerCoord as number[],
              zoomLevel: 15,
              animationDuration: 1000,
            });
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={[styles.controlButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
        >
          <Navigation size={20} color={theme.colors.primary} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
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
  controls: {
    position: 'absolute',
    top: 16,
    right: 16,
    gap: 8,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  markerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
  },
  marker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
  },
  pulse: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  fallbackText: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 12,
  },
  fallbackHint: {
    fontSize: 13,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

export default MapView;
