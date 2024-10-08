const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    main: './src/index',
    selectPixel: './src/contentScripts/selectPixel',
    roll20Scraper: './src/contentScripts/roll20Scraper'
  },
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3002
  },
  output: {
    publicPath: 'auto'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'extensionConfig' }
      ]
    })
  ]
};