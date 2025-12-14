const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  crypto: path.resolve(__dirname, 'shims/crypto.js'),
  events: path.resolve(__dirname, 'shims/events.js'),
  http: path.resolve(__dirname, 'shims/http.js'),
  stream: path.resolve(__dirname, 'shims/stream.js'),
  ws: path.resolve(__dirname, 'shims/ws.js'),
};

module.exports = config;
