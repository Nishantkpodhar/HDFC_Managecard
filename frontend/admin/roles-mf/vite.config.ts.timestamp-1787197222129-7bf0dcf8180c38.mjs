// vite.config.ts
import { defineConfig } from "file:///Users/nishantkumar/Project/HDFC_Managecard/node_modules/.pnpm/vite@5.4.21_@types+node@26.2.0/node_modules/vite/dist/node/index.js";
import react from "file:///Users/nishantkumar/Project/HDFC_Managecard/node_modules/.pnpm/@vitejs+plugin-react@4.7.0_vite@5.4.21_@types+node@26.2.0_/node_modules/@vitejs/plugin-react/dist/index.js";
import { federation } from "file:///Users/nishantkumar/Project/HDFC_Managecard/node_modules/.pnpm/@module-federation+vite@1.20.7_typescript@5.9.3_vite@5.4.21_@types+node@26.2.0_/node_modules/@module-federation/vite/lib/index.js";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    federation({
      name: "admin_roles_mf",
      filename: "remoteEntry.js",
      exposes: { "./App": "./src/App.tsx", "./bootstrap": "./src/bootstrap.tsx" },
      shared: {
        react: { singleton: true, requiredVersion: "^18.3.0" },
        "react-dom": { singleton: true, requiredVersion: "^18.3.0" },
        "react-router-dom": { singleton: true, requiredVersion: "^6.28.0" }
      }
    })
  ],
  build: { target: "esnext", minify: false, cssCodeSplit: true, modulePreload: { polyfill: false } },
  server: { port: 5213, cors: true, headers: { "Access-Control-Allow-Origin": "*" } },
  preview: { port: 5213, cors: true }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvbmlzaGFudGt1bWFyL1Byb2plY3QvSERGQ19NYW5hZ2VjYXJkL2Zyb250ZW5kL2FkbWluL3JvbGVzLW1mXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvbmlzaGFudGt1bWFyL1Byb2plY3QvSERGQ19NYW5hZ2VjYXJkL2Zyb250ZW5kL2FkbWluL3JvbGVzLW1mL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9uaXNoYW50a3VtYXIvUHJvamVjdC9IREZDX01hbmFnZWNhcmQvZnJvbnRlbmQvYWRtaW4vcm9sZXMtbWYvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBmZWRlcmF0aW9uIH0gZnJvbSAnQG1vZHVsZS1mZWRlcmF0aW9uL3ZpdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3QoKSxcbiAgICBmZWRlcmF0aW9uKHtcbiAgICAgIG5hbWU6ICdhZG1pbl9yb2xlc19tZicsXG4gICAgICBmaWxlbmFtZTogJ3JlbW90ZUVudHJ5LmpzJyxcbiAgICAgIGV4cG9zZXM6IHsgJy4vQXBwJzogJy4vc3JjL0FwcC50c3gnLCAnLi9ib290c3RyYXAnOiAnLi9zcmMvYm9vdHN0cmFwLnRzeCcgfSxcbiAgICAgIHNoYXJlZDoge1xuICAgICAgICByZWFjdDogeyBzaW5nbGV0b246IHRydWUsIHJlcXVpcmVkVmVyc2lvbjogJ14xOC4zLjAnIH0sXG4gICAgICAgICdyZWFjdC1kb20nOiB7IHNpbmdsZXRvbjogdHJ1ZSwgcmVxdWlyZWRWZXJzaW9uOiAnXjE4LjMuMCcgfSxcbiAgICAgICAgJ3JlYWN0LXJvdXRlci1kb20nOiB7IHNpbmdsZXRvbjogdHJ1ZSwgcmVxdWlyZWRWZXJzaW9uOiAnXjYuMjguMCcgfSxcbiAgICAgIH0sXG4gICAgfSksXG4gIF0sXG4gIGJ1aWxkOiB7IHRhcmdldDogJ2VzbmV4dCcsIG1pbmlmeTogZmFsc2UsIGNzc0NvZGVTcGxpdDogdHJ1ZSwgbW9kdWxlUHJlbG9hZDogeyBwb2x5ZmlsbDogZmFsc2UgfSB9LFxuICBzZXJ2ZXI6IHsgcG9ydDogNTIxMywgY29yczogdHJ1ZSwgaGVhZGVyczogeyAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonIH0gfSxcbiAgcHJldmlldzogeyBwb3J0OiA1MjEzLCBjb3JzOiB0cnVlIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlgsU0FBUyxvQkFBb0I7QUFDeFosT0FBTyxXQUFXO0FBQ2xCLFNBQVMsa0JBQWtCO0FBRTNCLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLFdBQVc7QUFBQSxNQUNULE1BQU07QUFBQSxNQUNOLFVBQVU7QUFBQSxNQUNWLFNBQVMsRUFBRSxTQUFTLGlCQUFpQixlQUFlLHNCQUFzQjtBQUFBLE1BQzFFLFFBQVE7QUFBQSxRQUNOLE9BQU8sRUFBRSxXQUFXLE1BQU0saUJBQWlCLFVBQVU7QUFBQSxRQUNyRCxhQUFhLEVBQUUsV0FBVyxNQUFNLGlCQUFpQixVQUFVO0FBQUEsUUFDM0Qsb0JBQW9CLEVBQUUsV0FBVyxNQUFNLGlCQUFpQixVQUFVO0FBQUEsTUFDcEU7QUFBQSxJQUNGLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPLEVBQUUsUUFBUSxVQUFVLFFBQVEsT0FBTyxjQUFjLE1BQU0sZUFBZSxFQUFFLFVBQVUsTUFBTSxFQUFFO0FBQUEsRUFDakcsUUFBUSxFQUFFLE1BQU0sTUFBTSxNQUFNLE1BQU0sU0FBUyxFQUFFLCtCQUErQixJQUFJLEVBQUU7QUFBQSxFQUNsRixTQUFTLEVBQUUsTUFBTSxNQUFNLE1BQU0sS0FBSztBQUNwQyxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
