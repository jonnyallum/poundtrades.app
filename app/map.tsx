import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapboxGL from '@rnmapbox/maps';
import { useTheme } from '@/hooks/useTheme';
import { Crosshair } from 'lucide-react-native';
import { useRef, useEffect } from 'react';

MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '');

export default function MapScreen() {
    const { theme } = useTheme();
    const colors = theme.colors;
    const camera = useRef<MapboxGL.Camera>(null);

    const zoomToMe = () => {
        // Premium "Google Earth" style transition
        camera.current?.setCamera({
            centerCoordinate: [-2.2426, 53.4808], // Mock Manchester
            zoomLevel: 14,
            animationDuration: 3000,
            animationMode: 'flyTo',
        });
    };

    useEffect(() => {
        // Initial zoom out for dramatic effect
        camera.current?.setCamera({
            zoomLevel: 2,
            animationDuration: 0,
        });
    }, []);

    return (
        <View style={styles.container}>
            <MapboxGL.MapView
                style={styles.map}
                styleURL={MapboxGL.StyleURL.Dark}
                logoEnabled={false}
            >
                <MapboxGL.Camera
                    ref={camera}
                    followUserLocation={false}
                />

                {/* Mock Marker with Status (Green) */}
                <MapboxGL.PointAnnotation
                    id="listing-1"
                    coordinate={[-2.2426, 53.4808]}
                >
                    <View style={[styles.marker, { backgroundColor: colors.status.active, borderColor: colors.primary }]} />
                </MapboxGL.PointAnnotation>
            </MapboxGL.MapView>

            <TouchableOpacity onPress={zoomToMe} style={[styles.fab, { backgroundColor: colors.primary }]}>
                <Crosshair size={24} color="#000" />
                <Text style={styles.fabText}>NEAR ME</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    marker: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
    },
    fab: {
        position: 'absolute',
        bottom: 40,
        right: 20,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 30,
        elevation: 5,
    },
    fabText: {
        fontWeight: 'bold',
        marginLeft: 8,
    }
});
