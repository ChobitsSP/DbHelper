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
    config.externals({
      vue: 'Vue',
      VueRouter: 'VueRouter',
      'element-plus': 'ElementPlus',
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