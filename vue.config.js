// vue.config.js
const path = require('path');

const resolve = (dir) => path.join(__dirname, dir);
module.exports = {
  productionSourceMap: false,
  parallel: require("os").cpus().length > 1, // 是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建。
  chainWebpack: (config) => {
    config.resolve.symlinks(true); // 修复热更新失效
    config.resolve.alias // 添加别名
      .set('@', resolve('src'))
      .set('@assets', resolve('src/assets'))
      .set('@components', resolve('src/components'))
      .set('@views', resolve('src/views'))
      .set('@store', resolve('src/store'));
  },
  devServer: {
    hotOnly: true, // 热更新
  }
};
