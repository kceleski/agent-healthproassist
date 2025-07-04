
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    allowedHosts: [
      'localhost', // Keep local development working
      '*.lovableproject.com', // Allow all Lovable preview subdomains
      '4f07c6e1-0bde-43a9-ae72-9d02c96356d2.lovableproject.com', // Add the specific host
    ],
  },
  define: {
    'import.meta.env.VITE_DEVELOPMENT_MODE': JSON.stringify(mode === 'development')
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));

