const dotenv = require("dotenv").config({ path: __dirname + "/.env" });
const webpack = require("webpack");

module.exports = {
  entry: ["./client/index.js"],
  plugins: [
    new webpack.DefinePlugin({
      Env_Vars: JSON.stringify(dotenv.parsed),
    }),
  ],

  output: {
    path: __dirname,
    filename: "./public/bundle.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-react"],
        },
      },
    ],
  },
};
