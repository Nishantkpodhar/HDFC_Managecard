import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

const remote = (name: string, port: number) =>
  `${name}@http://localhost:${port}/remoteEntry.js`;

const shared = {
  react: { singleton: true, requiredVersion: '^18.3.0' },
  'react-dom': { singleton: true, requiredVersion: '^18.3.0' },
  'react-router-dom': { singleton: true, requiredVersion: '^6.28.0' },
};

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'customer_shell',
      remotes: {
        customer_auth_mf: remote('customer_auth_mf', 5171),
        customer_dashboard_mf: remote('customer_dashboard_mf', 5175),
        customer_cards_mf: remote('customer_cards_mf', 5176),
        customer_transactions_mf: remote('customer_transactions_mf', 5177),
        customer_payments_mf: remote('customer_payments_mf', 5178),
        customer_rewards_mf: remote('customer_rewards_mf', 5179),
        customer_emi_mf: remote('customer_emi_mf', 5180),
        customer_loans_mf: remote('customer_loans_mf', 5181),
        customer_fastag_mf: remote('customer_fastag_mf', 5182),
        customer_offers_mf: remote('customer_offers_mf', 5183),
        customer_profile_mf: remote('customer_profile_mf', 5184),
        customer_notifications_mf: remote('customer_notifications_mf', 5185),
        customer_support_mf: remote('customer_support_mf', 5186),
      },
      shared,
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: true,
    modulePreload: { polyfill: false },
  },
  server: {
    port: 5173,
    cors: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  preview: {
    port: 5173,
    cors: true,
  },
});