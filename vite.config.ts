
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 12000,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "4f07c6e1-0bde-43a9-ae72-9d02c96356d2.lovableproject.com",
      "work-1-kafvrqygqppamkpx.prod-runtime.all-hands.dev",
      "work-2-kafvrqygqppamkpx.prod-runtime.all-hands.dev"
    ],
    cors: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      clientPort: 12000,
    },
  },
  css: {
    preprocessorOptions: {},
    devSourcemap: true,
  },
  plugins: [
    react({
      jsxImportSource: 'react',
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    preserveSymlinks: false,
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
  },
  define: {
    // Define global variables
    __WS_TOKEN__: JSON.stringify('development-ws-token'),
    // Ensure process.env is properly handled for client-side
    'process.env': {},
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'sonner'],
    esbuildOptions: {
      target: 'esnext'
    }
  },
  build: {
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['@/components/ui']
        }
      }
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
}));
