function unsupported() {
  throw new Error('Node crypto is not available in this React Native environment.');
}

module.exports = {
  createHash: unsupported,
  randomBytes: unsupported,
};
