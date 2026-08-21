#!/usr/bin/env bash
set -e
BASE=/Users/nishantkumar/Project/HDFC_Managecard/frontend/customer

gen() {
  local mf=$1
  local port=$2
  local name="customer_${mf//-/_}"
  local raw
  raw=$(echo "$mf" | sed 's/-mf$//; s/-/ /g')
  local title
  title=$(echo "$raw" | awk '{for(i=1;i<=NF;i++){ $i=toupper(substr($i,1,1)) substr($i,2) } print}')
  echo "Generating $mf (name=$name port=$port title=$title)"

  cat > "$BASE/$mf/vite.config.ts" << EOF
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { federation } from '@module-federation/vite';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: '$name',
      filename: 'remoteEntry.js',
      exposes: { './App': './src/App.tsx', './bootstrap': './src/bootstrap.tsx' },
      shared: {
        react: { singleton: true, requiredVersion: '^18.3.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.3.0' },
        'react-router-dom': { singleton: true, requiredVersion: '^6.28.0' },
        '@reduxjs/toolkit': { singleton: true, requiredVersion: '^2.0.0' },
        'react-redux': { singleton: true, requiredVersion: '^9.0.0' },
      },
    }),
  ],
  build: { target: 'esnext', minify: false, cssCodeSplit: true, modulePreload: { polyfill: false } },
  server: { port: $port, cors: true, headers: { 'Access-Control-Allow-Origin': '*' } },
  preview: { port: $port, cors: true },
});
EOF

  cat > "$BASE/$mf/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Banking360 Customer</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/bootstrap.tsx"></script>
  </body>
</html>
EOF

  cat > "$BASE/$mf/src/bootstrap.tsx" << 'EOF'
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
EOF

  cat > "$BASE/$mf/src/App.tsx" << 'EOF'
import { Routes, Route } from 'react-router-dom';
import MfPage from './pages';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MfPage />} />
      <Route path="*" element={<MfPage />} />
    </Routes>
  );
}
EOF

  cat > "$BASE/$mf/src/pages/index.tsx" << EOF
export default function ${title}Page() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800">${title}</h1>
      <p className="mt-2 text-gray-600">${title} micro-frontend loaded via Module Federation.</p>
    </div>
  );
}
EOF
}

gen cards-mf 5176
gen transactions-mf 5177
gen payments-mf 5178
gen rewards-mf 5179
gen emi-mf 5180
gen loans-mf 5181
gen fastag-mf 5182
gen offers-mf 5183
gen profile-mf 5184
gen notifications-mf 5185
gen support-mf 5186
echo "ALL DONE"