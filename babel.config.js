module.exports = {
  presets: [['module:react-native-builder-bob/babel-preset', { modules: 'commonjs' }]],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.ts', '.tsx'],
        root: ['.'],
        alias: {
          '@addressService': './src/addressService',
          '@backupService': './src/backupService',
          '@bip39': './src/bip39',
          '@locale': './src/locale',
          '@operations': './src/operations',

          '@withNativeResponse': './src/withNativeResponse',
          '@nativeModule': './src/nativeModule',
          '@types': './src/types',
        },
      },
    ],
  ],
};
