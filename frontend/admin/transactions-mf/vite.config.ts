import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'admin_transactions_mf',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx', './bootstrap': './src/bootstrap.tsx' },
      shared: {
        react: { singleton: true, requiredVersion: '^18.3.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.3.0' },
        'react-router-dom': { singleton: true, requiredVersion: '^6.28.0' },
      },
    }),
  ],
  build: { target: 'esnext', minify: false, cssCodeSplit: true, modulePreload: { polyfill: false } },
  server: { port: 5203, cors: true, headers: { 'Access-Control-Allow-Origin': '*' } },
  preview: { port: 5203, cors: true },
});
