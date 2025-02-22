// composables/useUrlObserver.ts

import { useDebounceFn } from '@vueuse/core'

/**
 *
 * @param callback
 * @returns
 */
export default function useUrlObserver(taregetUrl: string, callback: () => void) {
  let prevHref = '' // 初回読み込み時にcallbakを実行する必要がある場合は空白をセット
  const run = useDebounceFn(() =>
    callback()
    , 300
  )

  const urlObserver = new MutationObserver(() => {
    //https://www.youtube.com/watch?v=
    //https://www.youtube.com/shorts/
    if (prevHref !== location.href && location.href.startsWith('https://www.youtube.com/shorts/')) {
      prevHref = location.href
      run()
    }
  })

  urlObserver.observe(document, { childList: true, subtree: true })
  // Observer を停止するために返す
  return urlObserver
}