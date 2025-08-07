const { getDefaultConfig } = require("@expo/metro-config");

module.exports = (async () => {
  const config = await getDefaultConfig(__dirname);
  // For example, add SVG support:
  // config.resolver.assetExts = config.resolver.assetExts.filter(ext => ext !== "svg");
  // config.resolver.sourceExts.push("svg");
  // config.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
  return config;
})();
