
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use a type-safe check for process in a Node environment
const nodeProcess = typeof process !== 'undefined' ? process : { env: {} };

export default defineConfig({
  plugins: [react()],
  define: {
    // Inject the API key into the client-side code
    'process.env': JSON.stringify(nodeProcess.env)
  },
  server: {
    host: true,
    port: 3000
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
