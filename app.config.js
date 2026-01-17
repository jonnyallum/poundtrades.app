const { version } = require('./package.json');

module.exports = {
  expo: {
    name: 'PoundTrades',
    slug: 'poundtrades-mobile-app',
    version: version,
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.poundtrades.mobileapp'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.poundtrades.mobileapp'
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-web-browser',
      [
        '@rnmapbox/maps',
        {
          RNMapboxMapsImpl: 'mapbox',
          RNMapboxMapsDownloadToken: 'pk.eyJ1IjoicHRyYWRlczY5IiwiYSI6ImNtYmNqNzdlazFsd3AybHMxdHkwcG1ndWwifQ.nPJxSWKIN780x2fr5SjfsQ'
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {},
      eas: {
        projectId: 'a38a6117-7178-4b36-a66f-54d255325e43'
      },
      cli: {
        appVersionSource: 'remote'
      }
    },
    owner: 'poundtrades'
  }
};
