// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path from "path";

import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

const config = {
  entry: "./gentle-alerts/script.js",
  mode: "production",
  output: {
    path: path.resolve("dist"),
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  optimization: {
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
    ],
  },
};

export default () => {
  return config;
};
