import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'node_modules/**',
    'dist/**',
  ]),
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'warn',

      'no-var': 'error',
      curly: 'error',

      'react/self-closing-comp': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],

      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            [
              '^react',
              '^@?\\w',
              '^@(/.*|$)',
              '^\\.\\.(?!/?$)',
              '^\\.\\./?$',
              '^\\./(?=.*/)(?!/?$)',
              '^\\.(?!/?$)',
              '^\\./?$',
              '^.+\\.s?css$',
            ],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
  },
  eslintConfigPrettier,
]);

export default eslintConfig;
