const { getDefaultConfig } = require('expo/metro-config');
const { resolve } = require('metro-resolver');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.watchFolders = [...(config.watchFolders || []), path.resolve(__dirname, 'shims')];

config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  crypto: path.resolve(__dirname, 'shims/crypto.js'),
  events: path.resolve(__dirname, 'shims/events.js'),
  https: path.resolve(__dirname, 'shims/https.js'),
  http: path.resolve(__dirname, 'shims/http.js'),
  net: path.resolve(__dirname, 'shims/net.js'),
  stream: path.resolve(__dirname, 'shims/stream.js'),
  tls: path.resolve(__dirname, 'shims/tls.js'),
  url: path.resolve(__dirname, 'shims/url.js'),
  zlib: path.resolve(__dirname, 'shims/zlib.js'),
  ws: path.resolve(__dirname, 'shims/ws.js'),
};

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'stream' || moduleName.startsWith('stream/')) {
    return { type: 'sourceFile', filePath: path.resolve(__dirname, 'shims/stream.js') };
  }

  if (moduleName === 'ws' || moduleName.startsWith('ws/')) {
    return { type: 'sourceFile', filePath: path.resolve(__dirname, 'shims/ws.js') };
  }

  return resolve(context, moduleName, platform);
};

module.exports = config;
