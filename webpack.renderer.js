const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

const isDev = (mode) => mode === "development";

const getWorkerPath = (mode) => {
  const suffix = isDev(mode) ? "" : "/electron/dist/";
  const appPathGetter = `require("electron").remote.app.getAppPath()`;
  return `require("path").join(${appPathGetter}, "${suffix}")`;
};

module.exports = (env, argv = {}) => ({
  devtool: isDev(argv.mode) ? "cheap-module-eval-source-map" : false,

  entry: {
    app: "./src/app.tsx",
  },
  externals: {
    "iconv-lite": "require('iconv-lite')",
  },

  module: {
    rules: [
      // This loader won't work if it is not defined before the typescript loader
      {
        include: path.resolve(__dirname, "src"),
        test: /\.fork\.[jt]s$/,
        use: {
          loader: "webpack-fork-loader",
          options: {
            evalPath: true,
            publicPath: getWorkerPath(argv.mode),
          },
        },
      },
      {
        include: path.resolve(__dirname, "src"),
        loader: "awesome-typescript-loader",
        test: /\.[tj]sx?$/,
      },
      {
        enforce: "pre",
        include: path.resolve(__dirname, "src"),
        loader: "source-map-loader",
        test: /\.js$/,
      },
      {
        loader: "node-loader",
        test: /.node$/,
      },
      {
        include: [
          path.resolve(__dirname, "src/css"),
          path.resolve(__dirname, "static/fonts"),
        ],
        test: /\.css$|\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                includePaths: ["./node_modules"],
              },
            },
          },
        ],
      },
      {
        include: path.resolve(__dirname, "node_modules/react-notifications"),
        test: /\.svg/,
        use: [
          {
            loader: "svg-url-loader",
            options: {
              limit: 1024,
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        include: [
          path.resolve(__dirname, "static/fonts"),
          path.resolve(__dirname, "node_modules/react-notifications/lib/fonts"),
        ],
        test: /\.(otf|ttf|eot|woff|woff2)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1000,
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
    ],
  },

  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false,
  },

  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "electron/dist"),
    pathinfo: false,
  },

  plugins: [
    ...(isDev(argv.mode)
      ? []
      : [
          new CopyWebpackPlugin({
            patterns: [
              {
                from: "node_modules/fswin",
                noErrorOnMissing: true,
                to: "node_modules/fswin",
              },
            ],
          }),
        ]),
    new CopyWebpackPlugin({ patterns: ["static"] }),
    new HtmlWebpackPlugin({
      excludeChunks: ["stats"],
      filename: "index.html",
      inject: "head",
      template: "static/index.html",
    }),
    new webpack.DefinePlugin({
      ARCHIFILTRE_SITE_URL: JSON.stringify(process.env.ARCHIFILTRE_SITE_URL),
      AUTOLOAD: argv.autoload
        ? JSON.stringify(argv.autoload)
        : JSON.stringify(""),
      FORCE_TRACKING: !!JSON.stringify(process.env.FORCE_TRACKING),
      MATOMO_APPLICATION_ID: process.env.MATOMO_APPLICATION_ID,
      MATOMO_URL: JSON.stringify(process.env.MATOMO_URL),
      MODE: JSON.stringify(argv.mode || "development"),
      SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
      STATIC_ASSETS_PATH: JSON.stringify("."),
      WRITE_DEBUG: process.env.WRITE_DEBUG,
    }),
  ],

  resolve: {
    cacheWithContext: false,
    extensions: [".mjs", ".ts", ".tsx", ".js", ".json"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    symlinks: false,
  },

  target: "electron-renderer",
});
