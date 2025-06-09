import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    exclude: [
      'node_modules',
      'dist',
      'build',
      'tests',               // ignore tests/
      '**/*.spec.ts',        // ignore playwright test files
    ],
  },
})
