import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/** Content-Security-Policy for the production build only (the dev server needs inline HMR scripts). */
const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src https://fonts.gstatic.com",
  "img-src 'self' data:",
  "media-src 'self'",
  "connect-src 'self' https://generativelanguage.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firestore.googleapis.com https://api.emailjs.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

const csp = (): Plugin => ({
  name: 'csp-meta',
  apply: 'build',
  transformIndexHtml: (html) =>
    html.replace('<meta charset="UTF-8" />', `<meta charset="UTF-8" />\n    <meta http-equiv="Content-Security-Policy" content="${CSP}" />`),
});

export default defineConfig({
  base: './', // relative assets → works on GitHub Pages project URLs
  plugins: [react(), tailwindcss(), csp()],
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          gemini: ['@google/genai'],
        },
      },
    },
  },
  server: { allowedHosts: true },
  preview: { allowedHosts: true },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
    css: true,
  },
});
