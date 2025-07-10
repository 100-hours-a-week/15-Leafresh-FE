import path from 'path'

import { defineConfig } from 'vitest/config'

import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import tsconfigPaths from 'vite-tsconfig-paths'

// 명시적으로 .env.test 로드
dotenv.config({ path: path.resolve(__dirname, '.env.test') })

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/index.ts', '**/*.spec.ts'],
    environment: 'jsdom',
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'html', 'json'],
      exclude: ['**/node_modules/**', '**/dist/**', '**/.next/**', '**/index.ts'],
    },
  },
})
