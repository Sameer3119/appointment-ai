import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/appointment-ai/',
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
  },
});
