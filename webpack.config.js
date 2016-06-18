const path = require('path');

module.exports = {
  entry: path.join(__dirname, 'src', 'frontend'),
  
  output: {
    filename: 'app.js',
    path: path.join(__dirname, 'dist', 'static', 'assets'),
    publicPath: '/assets/',
  },
  
  module: {
    loaders: [
      {
        test: /\.js$/,
        include: [
          path.join(__dirname, 'src'),
        ],
        loader: 'babel-loader',
      }
    ],
  },
  
  babel: {
    presets: ['es2015', 'react'],
    plugins: [
      path.join(__dirname, 'babel-relay-plugin.js'),
    ],
  },
};
