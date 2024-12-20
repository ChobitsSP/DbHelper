import { defineConfig } from 'vite';
import createVuePlugin from '@vitejs/plugin-vue2';
import path from 'path';

const resolveExternalsPlugin = require('vite-plugin-resolve-externals');
const projectRootDir = path.resolve(__dirname);

export default defineConfig({
  base: '/',
  mode: 'development',
  plugins: [
    // It can be configured here
    createVuePlugin({
      template: {
        compilerOptions: {
          // https://github.com/underfin/vite-plugin-vue2/pull/62
          whitespace: 'condense',
        },
      },
    }),
    resolveExternalsPlugin({
      jquery: 'jQuery',
    }),
  ],
  resolve: {
    alias: [
      {
        find: 'vue',
        replacement: 'vue/dist/vue.esm.js',
      },
      {
        find: '@',
        replacement: path.resolve(projectRootDir, 'src'),
      },
      {
        find: 'venn.js',
        replacement: path.resolve(
          __dirname,
          './node_modules/venn.js/build/venn.js'
        ),
      },
    ],
  },
  server: {
    host: '0.0.0.0',
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
      },
    },
  },
  define: {},
});
