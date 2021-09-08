const path = require('path');
const mode = process.env.NODE_ENV || 'development';

module.exports = {
  entry: './src/scripts/index.ts',
  mode,
  output: {
    filename: 'index.js',
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
};