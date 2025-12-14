function unsupported() {
  throw new Error('zlib compression is not available in this React Native environment.');
}

module.exports = {
  createDeflateRaw: unsupported,
  createInflateRaw: unsupported,
  Z_DEFAULT_WINDOWBITS: 0,
  Z_SYNC_FLUSH: 0,
  constants: {
    Z_DEFAULT_WINDOWBITS: 0,
    Z_SYNC_FLUSH: 0,
  },
};
