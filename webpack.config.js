const path = require("path")
const webpack = require("webpack")

module.exports = {
  entry: __dirname + "/src/jsAnimate.js",
  output: {
    path: __dirname + "/dist",
    filename: "jsAnimate.js"
  },
  mode: "production",
  devServer: {
    contentBase: __dirname,
    publicPath: "/dist",
    port: 8080,
    progress: true,
    hot: true
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: {
        loader: "babel-loader",
        options: {
          presets: ["env"]
        }
      },
      exclude: /node_modules/,
    }]
  }
}