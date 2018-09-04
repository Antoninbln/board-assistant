const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "./public"),
    filename: "./public/bundle.js"
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, './src/assets/'),
      components: path.resolve(__dirname, './src/components/'),
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader"
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: "[local]___[hash:base64:5]"
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      },

      
      // {
      //   test: /\.module\.scss$/,
      //   include: path.resolve(__dirname, '../src'),
      //   exclude: /(node_modules)/,
      //   use: [
      //     'sass-loader',
      //     { // Provide path to the file with resources
      //       options: {
      //         localIdentName: "[name]_[local]_[hash:base64]",
      //         resources: [
      //           // Set path of base scss files like "btn"
      //         ]
      //       },
      //     }
      //   ],
      // },
      {
        test: /\.(png|jpe?g|gif|svg|ttf|woff)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  devServer: {
    port: 3000
  }
}
