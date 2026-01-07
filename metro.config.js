/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
// import {getDefaultConfig} from 'expo/metro-config';

// const defaultConfig = getDefaultConfig(__dirname);

// defaultConfig.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'cjs'];

// export default defaultConfig;
// export const transformer = {
//   getTransformOptions: async () => ({
//     transform: {
//       experimentalImportSupport: false,
//       inlineRequires: true,
//     },
//   }),
// };

const {getDefaultConfig} = require('metro-config');

module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();
  return {
    transformer: {
      // babelTransformerPath: require.resolve('react-native-svg-transformer'),
      // eslint-disable-next-line require-await
      getTransformOptions: async () => {
        return {
          experimentalImportSupport: false,
          transform: {
            inlineRequires: true,
          },
        };
      },
    },
    inlineRequires: true,
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg', 'cjs', 'mjs'],
    },
  };
})();
