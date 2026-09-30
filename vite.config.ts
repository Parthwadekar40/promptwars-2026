import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: './', // relative assets → works on GitHub Pages project URLs
  plugins: [react(), tailwindcss()],
  build: { target: 'es2020', cssCodeSplit: true },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
