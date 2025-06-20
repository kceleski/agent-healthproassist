import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist-embed', // Output to a separate directory
    lib: {
      entry: path.resolve(__dirname, 'src/card-stack-embed.tsx'),
      name: 'HealthProAssistCardStack',
      fileName: (format) => `card-stack.${format}.js`,
      formats: ['umd'], // A universal format that works in browsers
    },
    rollupOptions: {
      output: {
        // This ensures the CSS is also bundled and named predictably
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'card-stack.css';
          return assetInfo.name;
        },
      },
    },
  },
})
