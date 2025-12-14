import { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  const mapboxDownloadsToken =
const resolveDownloadToken = (): string => {
  const token =
    process.env.MAPBOX_DOWNLOADS_TOKEN ||
    process.env.EXPO_PUBLIC_MAPBOX_DOWNLOAD_TOKEN ||
    process.env.RNMAPBOX_DOWNLOAD_TOKEN ||
    process.env.EXPO_PUBLIC_MAPBOX_TOKEN ||
    '';

  const isMapboxDownloadsTokenValid = Boolean(
    mapboxDownloadsToken && !mapboxDownloadsToken.startsWith('pk.'),
  );

  const mapImplementation = isMapboxDownloadsTokenValid ? 'mapbox' : 'maplibre';
  const mapboxPluginConfig = isMapboxDownloadsTokenValid
    ? { RNMapboxMapsImpl: 'mapbox', RNMapboxMapsDownloadToken: mapboxDownloadsToken }
    : { RNMapboxMapsImpl: 'maplibre' };
  if (!token) {
    throw new Error(
      'Mapbox downloads token is missing. Set MAPBOX_DOWNLOADS_TOKEN (recommended) or RNMAPBOX_DOWNLOAD_TOKEN in your build environment.',
    );
  }

  if (token.startsWith('pk.')) {
    throw new Error(
      'Mapbox downloads token must be a secret token (sk.*) with downloads:read scope. Public tokens (pk.*) are not sufficient for native builds.',
    );
  }

  return token;
};

export default ({ config }: ConfigContext): ExpoConfig => {
  const mapboxDownloadsToken = resolveDownloadToken();

  return {
    ...config,
    name: 'bolt-expo-nativewind',
    slug: 'poundtrades-mobile-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    android: {
      package: 'com.poundtrades.mobileapp',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.poundtrades.mobileapp',
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-web-browser',
      ['@rnmapbox/maps', mapboxPluginConfig],
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsImpl: 'mapbox',
          RNMapboxMapsDownloadToken: mapboxDownloadsToken,
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {},
      eas: {
        projectId: 'a38a6117-7178-4b36-a66f-54d255325e43',
      },
      mapImplementation,
    },
    owner: 'poundtrades',
  } satisfies ExpoConfig;
};
