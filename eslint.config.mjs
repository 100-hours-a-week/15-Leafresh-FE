import { dirname } from 'path'
import { fileURLToPath } from 'url'

import { FlatCompat } from '@eslint/eslintrc'
import boundaries from 'eslint-plugin-boundaries'
import prettier from 'eslint-plugin-prettier'
import unusedImport from 'eslint-plugin-unused-imports'

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
      // FSD 레이어 간 의존성 규칙 강제
      // 'boundaries/element-types': [
      //   'error',
      //   {
      //     default: 'disallow',
      //     rules: [
      //       { from: 'app', allow: ['widgets', 'features', 'entities', 'shared'] },
      //       { from: 'widgets', allow: ['features', 'entities', 'shared'] },
      //       { from: 'features', allow: ['entities', 'shared'] },
      //       { from: 'entities', allow: ['shared'] },
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

            // '/public/**',
            // 라이브러리
            'next/**',
            '@next/**',
            'react',
            'react-dom',
            'react-hook-form/**',
            'zod',
            'motion/**',
            'date-fns/**',
            'zustand/**',
            'vitest/**',

            '@chakra-ui/**',
            '@hookform/**',
            '@tanstack/**',
            '@emotion/**',
            '@public/**',

            // 각 레이어별 허용 구조
            '@/widgets/*',

            '@/features/*/api',
            '@/features/*/components',

            '@/entities/*/api',
            '@/entities/*/model',

            '@/shared/*',
            '@/shared/**', // TODO: 임시 -> 제거
          ],
        },
      ],

      // Import 순서
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          pathGroups: [
            // 외부 라이브러리
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-dom',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@next/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'zod',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-hook-form',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'motion/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'date-fns/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'zustand/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'vitest/**',
              group: 'external',
              position: 'before',
            },

            // FSD 레이어 파일
            {
              pattern: '@/app/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/widgets/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/features/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/entities/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@/shared/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          'newlines-between': 'always',
        },
      ],

      // unusedImport
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': 'off', // @typescript-eslint/no-unused-vars로 대체

      // react-hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // typescript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-implicit-any-catch': 'off', // unknown 강제
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

      // 추가 규칙
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',

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
