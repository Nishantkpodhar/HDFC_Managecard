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
      name: 'admin_shell',
      remotes: {
        admin_dashboard_mf: remote('admin_dashboard_mf', 5200),
        admin_customers_mf: remote('admin_customers_mf', 5201),
        admin_cards_mf: remote('admin_cards_mf', 5202),
        admin_transactions_mf: remote('admin_transactions_mf', 5203),
        admin_payments_mf: remote('admin_payments_mf', 5204),
        admin_ledger_mf: remote('admin_ledger_mf', 5205),
        admin_rewards_mf: remote('admin_rewards_mf', 5206),
        admin_emi_mf: remote('admin_emi_mf', 5207),
        admin_loans_mf: remote('admin_loans_mf', 5208),
        admin_fastag_mf: remote('admin_fastag_mf', 5209),
        admin_offers_mf: remote('admin_offers_mf', 5210),
        admin_cms_mf: remote('admin_cms_mf', 5211),
        admin_users_mf: remote('admin_users_mf', 5212),
        admin_roles_mf: remote('admin_roles_mf', 5213),
        admin_permissions_mf: remote('admin_permissions_mf', 5214),
        admin_configuration_mf: remote('admin_configuration_mf', 5215),
        admin_feature_flags_mf: remote('admin_feature_flags_mf', 5216),
        admin_audit_mf: remote('admin_audit_mf', 5217),
        admin_system_health_mf: remote('admin_system_health_mf', 5218),
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
    port: 5174,
    cors: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
  },
  preview: {
    port: 5174,
    cors: true,
  },
});