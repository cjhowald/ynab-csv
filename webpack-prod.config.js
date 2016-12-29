const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: "cheap-module-source-map",
  entry: {
    app: ["./src/app"]
  },
  output: {
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.css$/, exclude: /node_modules/,
        loader: ExtractTextPlugin.extract({
          loader: 'css-loader?sourceMap'
        })
      },
      {
        test: /\.ts/,
        loaders: ['ng-annotate-loader', 'ts-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.ts']
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: true
      }
    }),
    new ExtractTextPlugin({ filename: 'bundle.css', disable: false, allChunks: true })
  ]
};