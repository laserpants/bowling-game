var path = require('path');
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {

  mode: 'development',

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

  plugins: [
    new CopyWebpackPlugin([  
      { from: 'src/css', to: 'css/' },
      { from: 'src/img', to: 'img/' }
    ], {})
  ],

  devServer: {
    inline: true,
    stats: 'errors-only'
  }

};
