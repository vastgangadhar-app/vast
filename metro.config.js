/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();

  return {
    transformer: {
      getTransformOptions: async () => ({
        experimentalImportSupport: false,
        transform: {
          inlineRequires: true,
        },
      }),
    },

    // ✅ IMPORTANT: Git folder ignore
    watchFolders: [],

    resolver: {
      blacklistRE: /.*\.git\/.*/, // 🚫 .git ignore
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg', 'cjs', 'mjs'],
    },
  };
})();
