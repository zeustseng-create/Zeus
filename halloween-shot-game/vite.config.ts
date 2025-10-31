import { defineConfig } from 'vite';

export default defineConfig({
  // Use a relative base so the built app works when served from GitHub Pages
  // or opened from a subpath. This keeps asset references relative to the
  // index.html location (safer for project pages / subfolders).
  base: './',
  plugins: [],
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});