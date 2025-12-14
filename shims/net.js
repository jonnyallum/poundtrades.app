function unsupported() {
  throw new Error('Net sockets are not available in this React Native environment.');
}

module.exports = {
  createConnection: unsupported,
  connect: unsupported,
  Socket: unsupported,
};
