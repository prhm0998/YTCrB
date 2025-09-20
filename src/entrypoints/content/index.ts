// entrypoints/example-ui.content/index.ts

import { createApp } from 'vue'
import App from './App.vue'
export default defineContentScript({
  matches: ['*://*.youtube.com/*'],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: 'inline',
      anchor: 'body',
      onMount: (container) => {
        // Create the app and mount it to the UI container
        const app = createApp(App, {
          ctx,
        })
        app.mount(container)
        return app
      },
      onRemove: (app) => {
        // Unmount the app when the UI is removed
        if (app) {
          app.unmount()
        }
      },
    })
    // Call mount to add the UI to the DOM
    ui.mount()
  },
})