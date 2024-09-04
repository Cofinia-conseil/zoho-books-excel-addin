/* eslint-disable no-undef */

const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//const path = require("path");

const urlDev = "https://localhost:3000/";
//const urlProd = "https://www.contoso.com/"; // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION
const urlProd = "https://excel-add-in-zoho-books.netlify.app/"; // CHANGE THIS TO YOUR PRODUCTION DEPLOYMENT LOCATION

async function getHttpsOptions() {
  const httpsOptions = await devCerts.getHttpsServerOptions();
  return { ca: httpsOptions.ca, key: httpsOptions.key, cert: httpsOptions.cert };
}

module.exports = async (env, options) => {
  const dev = options.mode === "development";
  const config = {
    devtool: "source-map",
    entry: {
      polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
      taskpane: ["./src/taskpane/taskpane.ts", "./src/taskpane/taskpane.html"],
      auth: ["./src/auth/auth.ts", "./src/auth/auth.html", "./src/auth/callback.html"],
      commands: "./src/commands/commands.ts",
      organization: ["./src/organization/organization.ts", "./src/organization/organization.html"],
      scripts: ["./src/assets/scripts.ts"],
      profile: ["./src/profile.ts", "./src/profile.html"],
    },
    output: {
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".html", ".js"],
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-typescript"],
            },
          },
        },
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: "html-loader",
        },
        {
          test: /\.(png|jpg|jpeg|gif|ico)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/[name][ext][query]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "taskpane.html",
        template: "./src/taskpane/taskpane.html",
        chunks: ["polyfill", "taskpane"],
      }),
      new HtmlWebpackPlugin({
        filename: "auth.html",
        template: "./src/auth/auth.html",
        chunks: ["polyfill", "auth"],
      }),
      new HtmlWebpackPlugin({
        filename: "callback.html",
        template: "./src/auth/callback.html",
        chunks: ["polyfill", "auth"],
      }),
      new HtmlWebpackPlugin({
        filename: "organization.html",
        template: "./src/organization/organization.html",
        chunks: ["polyfill", "organization"],
      }),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./src/index.html",
        chunks: ["polyfill", "index"],
      }),
      new HtmlWebpackPlugin({
        filename: "home.html",
        template: "./src/home.html",
        chunks: ["polyfill", "home"],
      }),
      new HtmlWebpackPlugin({
        filename: "profile.html",
        template: "./src/profile.html",
        chunks: ["polyfill", "profile"],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "assets/*",
            to: "assets/[name][ext][query]",
          },
          {
            from: "manifest*.xml",
            to: "[name]" + "[ext]",
            transform(content) {
              if (dev) {
                return content;
              } else {
                return content.toString().replace(new RegExp(urlDev, "g"), urlProd);
              }
            },
          },
        ],
      }),
      new HtmlWebpackPlugin({
        filename: "commands.html",
        template: "./src/commands/commands.html",
        chunks: ["polyfill", "commands"],
      }),
      new HtmlWebpackPlugin({
        filename: "navbar.html",
        template: "./src/navbar.html",
        chunks: ["polyfill", "navbar"],
      }),
    ],
    devServer: {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      server: {
        type: "https",
        options: env.WEBPACK_BUILD || options.https !== undefined ? options.https : await getHttpsOptions(),
      },
      port: process.env.npm_package_config_dev_server_port || 3000,
    },
  };

  return config;
};
