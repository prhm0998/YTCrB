import UserButtons from '@/components/external/UserButtons.vue'
import { ContentScriptContext } from 'wxt/client'

export default function (
  comment: YComment,
  ctx: ContentScriptContext,
  init: () => void,
  upsertWord: (word: string) => void,
  upsertName: (name: string) => void
) {
  const { insertElm, author: name, commentBody: { text: word } } = comment;
  if (!insertElm) return
  // appendがlastなので探すのは子孫のみ、兄弟要素に追加した時は別ロジックが必要
  const alreadySetup = insertElm.querySelector('#WXT-FIELD') !== null
  if (alreadySetup) return

  //**
  // ContentScriptContextを使うやつ
  // */
  const ui = createIntegratedUi(ctx, {
    position: 'inline',
    anchor: insertElm,
    append: 'last', // 追加の仕方でこのelmを後で探す方法が変わるので注意 last, firstはchildを探せばいいので簡単
    onMount: (container) => {
      return createApp(UserButtons, {
        upsertWord,
        word,
        upsertName,
        name,
        onIgnoreAdd: () => init()
      }).mount(container)
    }
  })
  ui.mount()
}