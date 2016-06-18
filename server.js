const express = require('express');
const webpack = require('webpack');
const path = require('path');
const webpackDevMiddleware = require('webpack-dev-middleware');

const webpackConfig = require('./webpack.config');

const app = express(path.join(__dirname, 'src', 'assets'));

app.use(webpackDevMiddleware(webpack(webpackConfig), {
  publicPath: '/assets/',
}));

app.all('*', (req, res) => {
  const http = require('http');
  
  const req2 = http.request({
    port: 3001,
    method: req.method,
    path: req.path,
    headers: req.headers,
  }, (res2) => {
    res2.pipe(res);
  });
  
  req
    .pipe(req2);
});

app.listen(3000, '0.0.0.0', () => {
   console.log('Listening 0.0.0.0:3000');
});
