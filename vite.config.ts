import { defineConfig, UserConfig, ConfigEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => ({
  server: {
    host: '::',
    port: 8000,
   
    proxy: mode === 'development' ? {
      '/hris': {
        target: 'http://localhost:8000', 
        changeOrigin: true,
        secure: false, // Do not verify SSL certificate in dev (useful for local HTTPS servers)
      },
    } : {}, // No proxy for production
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
}));
