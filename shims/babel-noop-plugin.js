// No-op Babel plugin shim for react-native-worklets/plugin
// This is used when NativeWind tries to load react-native-worklets/plugin
// but we're using react-native-worklets-core instead

module.exports = function () {
    return {
        name: 'babel-noop-plugin',
        visitor: {}
    };
};
