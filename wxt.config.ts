import { defineConfig } from 'wxt';
// import tailwindcss from '@tailwindcss/vite'

// See https://wxt.dev/api/config.html
export default defineConfig({
  srcDir: 'src',
  extensionApi: 'chrome',
  modules: ['@wxt-dev/module-vue'],

  vite: () => {
    // const isProd = process.env.NODE_ENV === 'production'
    const isProd = import.meta.env.NODE_ENV === 'production'
    return {
      esbuild: {
        drop: isProd ? ['console', 'debugger'] : []
      },
      plugins: [
        // vue()
        // tailwindcss()
      ]
    };
  },

  manifest: () => ({
    permissions: ['storage'],
    name: import.meta.env.WXT_EXT_NAME,
    description: import.meta.env.WXT_EXT_DESC
  })
});
