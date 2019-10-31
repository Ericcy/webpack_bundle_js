const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: {
    app: "./src/index.js"
  },
  output: {
    // publicPath: __dirname + "/dist/",
    path: path.resolve(__dirname, "dist"),
    filename: "DFCollectSDK.js"
  },
  module: {
    rules: [
      {
        test: /(\.js)$/,
        use: {
          loader: "babel-loader",
        },
        exclude: path.resolve(__dirname, "node_modules"),
        include: path.resolve(__dirname, "src")
      }
    ]
  },
  plugins:[
    new CleanWebpackPlugin()
  ]

};