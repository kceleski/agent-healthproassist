
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 8080,
    },
  },
  css: {
    // Improve CSS processing
    preprocessorOptions: {
      // Add any preprocessor options if needed
    },
    devSourcemap: true,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Ensure proper module resolution
    preserveSymlinks: false,
  },
  define: {
    // Define the WebSocket token to prevent the error
    __WS_TOKEN__: JSON.stringify('development-ws-token'),
  },
  // Add optimizeDeps to help with dependency pre-bundling
  optimizeDeps: {
    include: ['mapbox-gl']
  },
}));
