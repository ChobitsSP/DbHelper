import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: '/',
  mode: 'development',
  plugins: [
    vue(),
  ],
  define: {
    'process.env': {}
  },
  server: {
    // host: true,
    open: true,
    // proxy: GetProxy(),
  },
});