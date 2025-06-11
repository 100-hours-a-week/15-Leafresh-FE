import prettier from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImport from 'eslint-plugin-unused-imports'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript', 'plugin:prettier/recommended'),
  { ignores: ['.next', '.lintstagedrc.js'] },
  {
    plugins: { 'simple-import-sort': simpleImportSort, 'unused-imports': unusedImport, prettier }, // 플러그인 추가
    rules: {
      // simpleImportSort
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^node:', '^\\w'], // 1. node, builtin 모듈
            // ['^react', '^@?\\w'], // 2. 외부 라이브러리 (react 관련 우선)
            ['^@app/', '^@entities/', '^@features/', '^@shared/', '^@public/'], // 3. 내부 alias 경로 - @app, @features 등
            ['^\\u0000', '^\\.\\.(?!/?$)', '^\\.'], // 4. 상대경로 import
            ['^.+\\.s?css$'], // 5. 스타일 import
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // unusedImport
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],

      // typescript

      // react-hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // 추가 규칙
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-implicit-any-catch': 'off', // 이걸 켜면 unknown 강제
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { args: 'after-used', argsIgnorePattern: '^_', caughtErrors: 'none' },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-empty-interface': 'off', // 빈 인터페이스 허용
      '@typescript-eslint/no-empty-object-type': 'off', // 빈 객체 타입 허용

      'prettier/prettier': 'warn',
    },
  },
]

export default eslintConfig
