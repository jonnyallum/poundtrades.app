const URLShim = globalThis.URL;

if (!URLShim) {
  throw new Error('URL API is unavailable in this React Native environment.');
}

module.exports = { URL: URLShim };
