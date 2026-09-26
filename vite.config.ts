import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  cacheDir: 'node_modules/.vite_cache_v2',
  optimizeDeps: {
    include: ['react-router-dom', 'react', 'react-dom', '@supabase/supabase-js'],
    force: true,
  },
  server: {
    fs: {
      strict: false,
    },
  },
});
