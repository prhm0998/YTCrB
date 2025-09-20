import type { ContentScriptContext } from '#imports'
import UserButtons from '@/components/external/UserButtons.vue'

export default function (
  comment: YComment,
  ctx: ContentScriptContext,
  init: () => void,
  upsertName: (name: string) => void
) {
  const { insertElm, author: name } = comment
  if (!insertElm) return
  // appendがlastなので探すのは子孫のみ、兄弟要素に追加した時は別ロジックが必要
  const alreadySetup = insertElm.querySelector('#WXT-FIELD')
  if (alreadySetup) {
    alreadySetup.remove()
  }

  //**
  // ContentScriptContextを使うやつ
  // */
  const ui = createIntegratedUi(ctx, {
    position: 'inline',
    anchor: insertElm,
    append: 'last', // 追加の仕方でこのelmを後で探す方法が変わるので注意 last, firstはchildを探せばいいので簡単
    onMount: (container) => {
      return createApp(UserButtons, {
        upsertName,
        name,
        onIgnoreAdd: () => init(),
      }).mount(container)
    },
  })
  ui.mount()
}