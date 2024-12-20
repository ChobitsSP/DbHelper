module.exports = {
  assetsDir: 'static',
  productionSourceMap: false,
  runtimeCompiler: true,
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'vue-sql',
    },
  },
  devServer: {
    proxy: {
      ...GetList(['/(?:api)/'], 'http://server3.hsort.com:8001'),
    },
  },
  chainWebpack: (config) => {
    config.externals({
      jquery: 'jQuery',
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
