import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['src/**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      globals: globals.browser,
      parser: tseslint.parser
    },
    ...pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginVue.configs['flat/recommended'],
    ...compat.extends('plugin:vue-pug/vue3-recommended'),
    rules: {
      // Vue-specific rules
      'vue/no-root-v-if': 'warn',
      'vue/no-multiple-template-root': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/require-v-for-key': 'error',
      'vue/no-use-v-if-with-v-for': 'error',
      'vue/no-parsing-error': 'off',
      'vue/block-tag-newline': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/no-irregular-whitespace': 'error',
      'vue/require-default-prop': 'warn',
      'vue/html-indent': 'off',
      'vue/multiline-html-element-content-newline': 0, //このルールを含むfixでtemplateが破壊される
      "vue/html-closing-bracket-newline": 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/static-class-names-order': 'error',
      'function-paren-newline': ['error', 'consistent'],
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0, 'maxBOF': 0 }],

      // JS/TS-specific rules
      'comma-dangle': ['error', 'never'],
      'brace-style': ['error', 'stroustrup'],
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-trailing-spaces': 'warn',
      quotes: ['error', 'single'],
      'function-paren-newline': ['error', 'consistent'],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }]
    }
  }
];
