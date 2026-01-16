const { version } = require('./package.json');

const resolveDownloadToken = () =>
  process.env.MAPBOX_DOWNLOADS_TOKEN ||
  process.env.EXPO_PUBLIC_MAPBOX_DOWNLOAD_TOKEN ||
  process.env.RNMAPBOX_DOWNLOAD_TOKEN ||
  process.env.EXPO_PUBLIC_MAPBOX_TOKEN ||
  '';

const resolveMapConfig = () => {
  const mapboxDownloadsToken = resolveDownloadToken();
  const isMapboxDownloadsTokenValid = Boolean(
    mapboxDownloadsToken && !mapboxDownloadsToken.startsWith('pk.'),
  );

  const mapImplementation = isMapboxDownloadsTokenValid ? 'mapbox' : 'maplibre';
  const mapboxPluginConfig = isMapboxDownloadsTokenValid
    ? { RNMapboxMapsImpl: 'mapbox', RNMapboxMapsDownloadToken: mapboxDownloadsToken }
    : { RNMapboxMapsImpl: 'maplibre' };

  return { mapImplementation, mapboxPluginConfig };
};

module.exports =  function({ config })   {
  const { mapImplementation, mapboxPluginConfig } = resolveMapConfig();

  return {
    ...config,
    name: 'bolt-expo-nativewind',
    slug: 'poundtrades-mobile-app',
    version,
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
             {
        appVersionSource: 'remote',
      },
    },
    owner: 'poundtrades',
};
  }
