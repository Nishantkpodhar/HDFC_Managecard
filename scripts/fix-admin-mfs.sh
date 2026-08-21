#!/usr/bin/env bash
set -e
BASE=/Users/nishantkumar/Project/HDFC_Managecard/frontend/admin

for dir in "$BASE"/*/; do
  mf=$(basename "$dir")
  [[ "$mf" == "shell" ]] && continue
  echo "Fixing $mf"
  cat > "$dir/package.json" << EOF
{
  "name": "@banking360/admin-${mf}",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint src --ext ts,tsx",
    "test": "vitest"
  },
  "dependencies": {
    "@banking360/api-contracts": "workspace:*",
    "@banking360/auth-client": "workspace:*",
    "@banking360/design-system": "workspace:*",
    "@banking360/feature-flags": "workspace:*",
    "@banking360/frontend-events": "workspace:*",
    "@banking360/shared-types": "workspace:*",
    "@banking360/telemetry": "workspace:*",
    "lucide-react": "^0.344.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "react-redux": "^9.0.0",
    "react-router-dom": "^6.28.0"
  },
  "devDependencies": {
    "@banking360/eslint-config": "workspace:*",
    "@banking360/tsconfig": "workspace:*",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.4.0",
    "vite": "^5.4.0",
    "vitest": "^1.0.0"
  }
}
EOF

  cat > "$dir/tsconfig.json" << 'EOF'
{
  "extends": "@banking360/tsconfig/react",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src/**/*"]
}
EOF
done
echo "ADMIN MF FIX DONE"