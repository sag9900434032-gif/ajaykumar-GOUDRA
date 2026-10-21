import { defineConfig } from 'vite';
import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    {
      name: 'unified-build-bridge',
      closeBundle() {
        console.log('⚡ Unified build bridge triggered via Vite closeBundle...');
        execSync('node scripts/build.js', { stdio: 'inherit', cwd: __dirname });
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: false
  }
});
