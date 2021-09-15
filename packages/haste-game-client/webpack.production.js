/* eslint-disable */
const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const { DefinePlugin } = require('webpack');

console.log('building production');

const envKeys = Object.keys(process.env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(process.env[next]);
  return prev;
}, {});

console.log(JSON.stringify(envKeys));

module.exports = merge(common, {
  mode: 'production',
  plugins: [new DefinePlugin(envKeys)],
});
