import 'dotenv/config';

export default {
    expo: {
        name: "PoundTrades",
        slug: "poundtrades-v2",
        version: "1.0.0",
        orientation: "portrait",
        platforms: ["ios", "android", "web"],
        icon: "./assets/icon.png",
        userInterfaceStyle: "dark",
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#000000"
        },
        assetBundlePatterns: ["**/*"],
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.poundtrades.v2"
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#000000"
            },
            package: "com.poundtrades.v2"
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        plugins: [
            "expo-router",
            "expo-font",
            [
                "@rnmapbox/maps",
                {
                    "RNMapboxMapsImpl": "mapbox",
                    "RNMapboxMapsDownloadToken": process.env.MAPBOX_SECRET_TOKEN || "PLACEHOLDER"
                }
            ],
            "expo-asset"
        ],
        experiments: {
            typedRoutes: true
        }
    }
};
