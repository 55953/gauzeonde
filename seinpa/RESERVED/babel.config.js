module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@api": "./api",
            "@auth": "./auth",
            "@types": "./types",
            "@screens": "./screens",
            "@components": "./components",
            "@navigation": "./navigation",
            "@context": "./context",
            "@utils": "./utils"
          }
        }
      ]
    ]
  };
};
