function unsupported() {
  throw new Error('HTTPS server APIs are not available in this React Native environment.');
}

module.exports = {
  createServer: unsupported,
  request: unsupported,
  get: unsupported,
};
