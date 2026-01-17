const { getDefaultConfig } = require('expo/metro-config');
const fs = require('fs');
const path = require('path');

const config = getDefaultConfig(__dirname);

const shimsPath = path.resolve(__dirname, 'shims');

if (!fs.existsSync(shimsPath)) {
  fs.mkdirSync(shimsPath, { recursive: true });
}

config.watchFolders = [...(config.watchFolders || []), shimsPath];

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

// Custom resolver that handles shims without requiring metro-resolver directly
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle stream module and subpaths
  if (moduleName === 'stream' || moduleName.startsWith('stream/')) {
    return { type: 'sourceFile', filePath: path.resolve(__dirname, 'shims/stream.js') };
  }

  // Handle ws module and subpaths
  if (moduleName === 'ws' || moduleName.startsWith('ws/')) {
    return { type: 'sourceFile', filePath: path.resolve(__dirname, 'shims/ws.js') };
  }

  // Use the default resolver from context for all other modules
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
