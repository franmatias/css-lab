import eslint from '@eslint/js'
import tsParser from '@typescript-eslint/parser'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import vueAccessibility from 'eslint-plugin-vuejs-accessibility'
import globals from 'globals'
import vueParser from 'vue-eslint-parser'
import prettier from 'eslint-config-prettier/flat'

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'coverage/**',
      'node_modules/**',
      'playwright-report/**',
      'test-results/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...vue.configs['flat/recommended'],
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: { 'vuejs-accessibility': vueAccessibility },
    rules: {
      'vuejs-accessibility/alt-text': 'error',
      'vuejs-accessibility/anchor-has-content': 'error',
      'vuejs-accessibility/aria-props': 'error',
      'vuejs-accessibility/form-control-has-label': 'error',
      'vuejs-accessibility/heading-has-content': 'error',
      'vuejs-accessibility/interactive-supports-focus': 'error',
      'vuejs-accessibility/label-has-for': ['error', { required: { some: ['nesting', 'id'] } }],
      'vuejs-accessibility/no-autofocus': 'error',
    },
  },
  {
    files: ['**/*.{js,ts,vue}'],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
    },
  },
  prettier,
)
