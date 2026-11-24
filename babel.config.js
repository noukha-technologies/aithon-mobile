module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@assets': './src/assets',
          '@config': './src/config',
          '@models': './src/models',
          '@views': './src/views',
          '@utils': './src/utils',
          '@hooks': './src/hooks',
          '@api': './src/api',
          '@screens': './src/views/screens',
          '@components': './src/views/components',
          '@navigation': './src/navigation',
          '@constants': './src/enums',
          '@theme': './src/theme',
          '@redux': './src/redux',
        },
      },
    ],
  ],
};
