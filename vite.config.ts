import react from '@vitejs/plugin-react-swc';

import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/marklive-pdf/' : '/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'README.md',
          dest: '',
        }
      ]
    })
  ],
  build: {
    outDir: 'docs',
  },
}));