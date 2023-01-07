const path = require('path');
const { DefinePlugin } = require('webpack');
const mode = process.env.NODE_ENV || 'development';

const __INSIGHTS_ID__ = 'bXE8Dvt9ZSOsxSyd';

module.exports = {
  entry: {
    index: './src/scripts/index.ts',
    toc: './src/scripts/toc.ts',
  },
  mode,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist', 'scripts'),
  },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        use: 'ts-loader',
        exclude: /node-modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new DefinePlugin({
      __INSIGHTS_ID__: JSON.stringify(__INSIGHTS_ID__),
      __DEVELOPMENT__: JSON.stringify(mode === 'development'),
    }),
  ],
};