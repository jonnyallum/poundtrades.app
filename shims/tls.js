function unsupported() {
  throw new Error('TLS sockets are not available in this React Native environment.');
}

module.exports = {
  connect: unsupported,
  TLSSocket: unsupported,
};
