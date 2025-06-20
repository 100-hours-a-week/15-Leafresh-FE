import prettier from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImport from 'eslint-plugin-unused-imports'
import boundaries from 'eslint-plugin-boundaries'

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
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImport,
      prettier: prettier,
      boundaries: boundaries,
    },

    settings: {
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app/**/*' },
        { type: 'widgets', pattern: 'src/widgets/**/*' },
        { type: 'features', pattern: 'src/features/**/*' },
        { type: 'entities', pattern: 'src/entities/**/*' },
        { type: 'shared', pattern: 'src/shared/**/*' },
      ],
    },

    rules: {
      // // FSD 레이어 간 의존성 규칙 강제
      // 'boundaries/element-types': [
      //   'error',
      //   {
      //     default: 'disallow',
      //     rules: [
      //       { from: 'app', allow: ['app', 'widgets', 'features', 'entities', 'shared'] },
      //       { from: 'widgets', allow: ['widgets', 'features', 'entities', 'shared'] },
      //       { from: 'features', allow: ['features', 'entities', 'shared'] },
      //       { from: 'entities', allow: ['entities', 'shared'] },
      //       { from: 'shared', allow: ['shared'] },
      //     ],
      //   },
      // ],

      // TODO: 임시 / FSD 레이어 간 의존성 규칙 개방
      'boundaries/element-types': [
        'error',
        {
          default: 'disallow',
          rules: [
            { from: 'app', allow: ['app', 'widgets', 'features', 'entities', 'shared'] },
            { from: 'widgets', allow: ['app', 'widgets', 'features', 'entities', 'shared'] },
            { from: 'features', allow: ['app', 'widgets', 'features', 'entities', 'shared'] },
            { from: 'entities', allow: ['app', 'widgets', 'features', 'entities', 'shared'] },
            { from: 'shared', allow: ['app', 'widgets', 'features', 'entities', 'shared'] },
          ],
        },
      ],

      // Public API 사용 강제
      'import/no-internal-modules': [
        'error',
        {
          allow: [
            '**/index.ts',

            '@public/**',
            // 라이브러리
            'next/**',
            '@next/**',
            'react',
            'react-dom',
            'zod',
            'motion/**',
            'date-fns/**',
            'zustand/**',

            '@hookform/**',
            '@tanstack/**',
            '@emotion/**',

            // 각 레이어별 허용 구조
            '@/widgets/*',

            '@/features/*/api',
            '@/features/*/components',

            '@/entities/*/api',
            '@/entities/*/model',

            '@/shared/*',
          ],
        },
      ],

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
        { vars: 'all', varsIgnorePattern: '^_', args: 'none' }, // 매개변수 무시
      ],

      // react-hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // 추가 규칙
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',

      // typescript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-implicit-any-catch': 'off', // 이걸 켜면 unknown 강제
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'none', // 매개변수 무시
          caughtErrors: 'none',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-empty-interface': 'off', // 빈 인터페이스 허용
      '@typescript-eslint/no-empty-object-type': 'off', // 빈 객체 타입 허용

      'prettier/prettier': 'warn',
    },
  },

  // Next.js 설정 파일 예외
  {
    files: ['**/*.config.{js,mjs,ts}', '**/middleware.ts'],
    rules: {
      'import/no-anonymous-default-export': 'off',
      'boundaries/element-types': 'off',
    },
  },

  // 테스트 파일 규칙
  {
    files: ['**/*.test.{js,ts,tsx}', '**/*.spec.{js,ts,tsx}', '**/__tests__/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'boundaries/element-types': 'off',
    },
  },
]

export default eslintConfig
