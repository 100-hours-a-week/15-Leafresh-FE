import dotenv from 'dotenv'
import path from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

import react from '@vitejs/plugin-react'

// 명시적으로 .env.test 로드
dotenv.config({ path: path.resolve(__dirname, '.env.test') })

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    exclude: [
      'node_modules',
      'dist',
      'build',
      'tests', // ignore tests/
      '**/*.spec.ts', // ignore playwright test files
    ],
  },
})
