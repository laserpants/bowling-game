var dotenv  = require('dotenv');
var path    = require('path');
var webpack = require('webpack');

module.exports = function() {

  var env = dotenv.config({ path: '../.env' }).parsed;

  var envKeys = env ? Object.keys(env).reduce(function(prev, next) {
    prev['process.env.' + next] = JSON.stringify(env[next]);
    return prev;
  }, {}) : {};

  return {
    mode: 'development',
    entry: './index.js',
    module: {
      rules: [{
          test: /\.html$/,
          exclude: /node_modules/,
          loader: 'file-loader?name=[name].[ext]'
        },
        {
          test: /\.elm$/,
          exclude: [/elm-stuff/, /node_modules/],
          loader: 'elm-webpack-loader',
          options: {
            debug: true
          }
        }
      ]
    },
    devServer: {
      inline: true,
      stats: 'errors-only'
    },
    plugins: [
      new webpack.DefinePlugin(envKeys)
    ]
  };

};
