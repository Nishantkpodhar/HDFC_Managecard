import preset from '@banking360/design-system/tailwind.preset';

export default {
  presets: [preset],
  content: [
    './frontend/customer/shell/src/**/*.{ts,tsx}',
    './frontend/admin/shell/src/**/*.{ts,tsx}',
    './frontend/customer/*/src/**/*.{ts,tsx}',
    './frontend/admin/*/src/**/*.{ts,tsx}',
    './packages/design-system/src/**/*.{ts,tsx}',
    './packages/ui/src/**/*.{ts,tsx}',
  ],
};