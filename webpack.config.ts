// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path from "path";

import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import type { Configuration } from "webpack";

// bootstrap and options are loaded directly by the browser -- as a content
// script and from options.htm -- so they are compiled to their exact filenames
// alongside the bundle rather than being imported by it.
const config: Configuration = {
  entry: {
    "gentle-alerts.min": "./gentle-alerts/script.ts",
    bootstrap: "./gentle-alerts/bootstrap.ts",
    options: "./gentle-alerts/options.ts",
  },
  mode: "production",
  output: {
    path: path.resolve("gentle-alerts"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        loader: "ts-loader",
        options: {
          onlyCompileBundledFiles: true,
          compilerOptions: {
            noEmit: false,
          },
        },
      },
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
