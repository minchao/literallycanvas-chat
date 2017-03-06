var path = require('path')
var webpack = require('webpack')

var DEV = false

if (process.env.NODE_ENV === 'development') {
  DEV = true
}

var config = {
  devtool: 'eval',
  entry: [
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  plugins: [
    new webpack.NamedModulesPlugin()
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel-loader'],
      include: path.join(__dirname, 'src')
    }]
  }
}

// Development mode configuration
if (DEV) {
  config.entry = [
    'react-hot-loader/patch',
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    'webpack/hot/only-dev-server',
    './src/index'
  ]
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
