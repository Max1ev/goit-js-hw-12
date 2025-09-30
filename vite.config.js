import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  base: '/goit-js-hw-12/',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  define: {
    global: {},
  },
});
