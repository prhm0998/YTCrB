import { Ref, ref } from 'vue'
import { ContentScriptContext } from 'wxt/client'
import { IgnoreWordReg } from './useIgnoreWordsReg'
import { watchElementRemoval } from '@/utils/watchElementRemoval'
import { JudgeResult } from './useJudgeComment'

export function useCommentObserver(
  commentOuterSelector: string,
  ignoreWordReg: Ref<IgnoreWordReg[]>,
  ignoreName: Ref<Map<string, IgnoreBase>>,
  ignoreSessionName: Ref<Map<string, IgnoreBase>>,
  userOption: Ref<UserOption>,
  upsertWord: (word: string) => void,
  upsertName: (name: string) => void,
  upsertSessionName: (name: string) => void,
  ctx: ContentScriptContext
) {
  const { addObserver, resetObservers } = useObservers()
  const currentScope = ref<ReturnType<typeof effectScope> | null>(null)

  async function init() {
    // 既存のscopeを停止
    currentScope.value?.stop()

    // 新しいscopeを作成
    const scope = effectScope()
    currentScope.value = scope

    // scope内で処理を実行する
    scope.run(async () => {
      // scopeの破棄に伴う処理 asyncを使う場合は非同期処理が始まる前に書く
      onScopeDispose(() => resetObservers())

      const commentOuter: Element | null = await waitForElement(commentOuterSelector)
      if (!commentOuter || !(commentOuter instanceof HTMLElement)) return

      const commentObserver: MutationObserver = useWatchComment(commentOuter, 'ytd-comment-thread-renderer', (comment) => {
        processComment(comment)
        observeReplies(comment)
      })
      addObserver(commentObserver)

      // commentOuterが削除されたらinitを再実行する
      const cleanup = watchElementRemoval(commentOuter, () => {
        cleanup?.()
        init()
      })

    })
  }

  function observeReplies(comment: Element) {
    const replyOuter: HTMLElement | null = comment.querySelector<HTMLElement>('#replies #contents')
    if (!replyOuter) return

    const replyObserver: MutationObserver = useWatchComment(replyOuter, 'ytd-comment-view-model', (reply) => {
      processComment(reply)
    })

    addObserver(replyObserver)
  }

  function processComment(comment: HTMLElement) {
    const newComment: YComment = getComment(comment)
    useAddButton(newComment, ctx, init, upsertWord, upsertName)
    const judgeResult: Ref<JudgeResult> = useJudgeComment(newComment, ignoreWordReg, ignoreName, ignoreSessionName, userOption)
    useBannedProcess(newComment, judgeResult, userOption, upsertWord, upsertName, upsertSessionName)
  }

  return { init }
}
