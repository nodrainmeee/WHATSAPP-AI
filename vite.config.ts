import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// index.html se trouve dans src/renderer : on déclare ce dossier comme racine.
export default defineConfig({
  root: path.resolve(__dirname, 'src/renderer'),
  plugins: [react()],
  base: './',
  server: { port: 5173, strictPort: true },
  build: {
    outDir: path.resolve(__dirname, 'dist/renderer'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src/renderer/src'),
    },
  },
});
