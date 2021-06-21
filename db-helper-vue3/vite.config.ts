import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

const projectRootDir = path.resolve(__dirname);

console.log(projectRootDir);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(projectRootDir, 'src'),
      },
    ],
  },
})
