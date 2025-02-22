import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginVue from 'eslint-plugin-vue';

// 追加 (Vue)
import vueParser from 'vue-eslint-parser'
// 追加 (TailwindCSS)
//import tailwindcss from 'eslint-plugin-tailwindcss'
// 追加 (Pug)
import { FlatCompat } from '@eslint/eslintrc'
const compat = new FlatCompat()
// 追加 (import)
// import pluginImport from 'eslint-plugin-import'

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: [
      'dist/**/*',
      '.output/**/*',
      '.wxt/**/*']
  },
  { languageOptions: { globals: globals.browser } },
  ...compat.extends('plugin:vue-pug/vue3-recommended'),
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  // pluginImport.flatConfigs.recommended,
  //...tailwindcss.configs['flat/recommended'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        sourceType: 'module'
      }
    },
    rules: {
      // こっちに書きたくなることがあるかも?
      // ...pluginJs.configs.recommended.rules,
      // ...tseslint.configs.recommended.rules,
      // ...pluginVue.configs["flat/recommended"].rules,
      // ...tailwindcss.configs["flat/recommended"].rules

      // vue rules
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
      'vue/html-closing-bracket-newline': 0,
      'vue/max-attributes-per-line': 'off',
      'vue/html-self-closing': 'off',
      'vue/first-attribute-linebreak': 'off',
      // tailwind rules
      // 'tailwindcss/no-custom-classname': 'off',
      'function-paren-newline': ['error', 'consistent'],
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0, 'maxBOF': 0 }]
    }
  },
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'], //vueも共通
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      // ...pluginVue.configs['flat/recommended'].rules,
      // js rules
      'comma-dangle': ['error', 'never'],
      'brace-style': ['error', 'stroustrup'],
      // 'object-curly-spacing': 'warn',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-trailing-spaces': 'warn',
      'eslint-disable-next-line': 'off',
      'html-closing-bracket-newline': 'off',
      quotes: ['error', 'single'],
      // 'function-paren-newline': ['error', 'consistent']
      'no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0, 'maxBOF': 0 }]
    }
  }
];