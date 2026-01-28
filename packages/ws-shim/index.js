/*
 * Minimal WebSocket shim for React Native to satisfy dependencies that expect the
 * `ws` package in a Node.js environment. React Native already provides a global
 * WebSocket implementation, so we expose that here.
 */
const WS = global.WebSocket;

if (!WS) {
  throw new Error('Global WebSocket is not available in this environment.');
}

function createWebSocketStream() {
  throw new Error('createWebSocketStream is not supported in React Native.');
}

module.exports = WS;
module.exports.default = WS;
module.exports.WebSocket = WS;
module.exports.createWebSocketStream = createWebSocketStream;
module.exports.Server = function UnsupportedServer() {
  throw new Error('WebSocket server is not supported in React Native.');
};
