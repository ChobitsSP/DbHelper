process.env.VUE_APP_BUILD_TIME = Date.now().toString();
process.env.VUE_APP_VERSION = require('./package.json').version;

module.exports = {
  assetsDir: 'static',
  productionSourceMap: false,
  runtimeCompiler: true,
  pages: {
    index: {
      entry: 'src/main.ts',
    },
  },
  devServer: {
    proxy: {
      ...GetList(['/(?:api)/'], 'http://localhost:8001'),
    },
  },
  chainWebpack: (config) => {
    // // 移除 prefetch 插件
    // config.plugins.delete('prefetch-index');

    // // 移除 preload 插件
    // config.plugins.delete('preload-index');

    // // 修改 html-webpack-plugin 配置 禁用defer="defer"
    // config.plugin('html-index').tap((args) => {
    //   args[0].inject = 'body';
    //   args[0].scriptLoading = 'blocking';
    //   return args;
    // });

    config.externals({
      // jquery: 'jQuery',
    });
  },
};

/**
 * 代理配置
 * @param {string[]} list
 * @param {string} target
 * @returns
 */
function GetList(list, target) {
  return Object.assign(
    ...list.map((t) => ({
      [t]: {
        target: target,
        changeOrigin: true,
        secure: false, //true/false, if you want to verify the SSL Certs
      },
    }))
  );
}
