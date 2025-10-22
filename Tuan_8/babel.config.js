module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': './src', // 👈 alias @ trỏ đến thư mục src
          },
        },
      ],
    ],
  };
};
