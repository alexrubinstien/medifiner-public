require('dotenv').config();
const withSass = require('@zeit/next-sass');
const webpack = require('webpack');
const _ = require("lodash");
module.exports = withSass({
  webpack: (cfg) => {
    cfg.plugins.push(new webpack.EnvironmentPlugin(process.env));

    const originalEntry = cfg.entry;
    cfg.entry = async () => {
      const entries = await originalEntry();

      if (entries['main.js'] && !_.includes(entries['main.js'], './client/polyfills.js')) {
        entries['main.js'].unshift('./client/polyfills.js');
      }

      return entries;
    };

    return cfg;
  },
});
