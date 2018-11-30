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
      { from: 'src/css/*', to: 'dist/css/' },
      { from: 'src/img/*', to: 'dist/img/' }
    ], {})
  ],

  devServer: {
    inline: true,
    stats: 'errors-only'
  }

};
