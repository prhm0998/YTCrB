export function useBannedProcess(
  ycomment: YComment,
  result: Ref<JudgeResult>,
  userOption: Ref<UserOption>,
  upsertName: (name: string) => void,
  upsertSessionName: (name: string) => void
) {
  watch([result, userOption], ([newResult, newUserOption]) => {
    if (newResult.isGuilty && newUserOption.enabled) {
      if (!hasNoneStyle(ycomment.elm)) {
        const { useWordSensitive,
          useTemporaryWordSensitive,
          useMentionSensitive,
          useTemporaryMentionSensitive,
        } = newUserOption
        switch (newResult?.type) {
          case 'Word':
            // 禁止ワードに抵触した
            ycomment.elm.style.display = 'none'
            if (useWordSensitive) {
              // 禁止ワードを使ったユーザーを永続的に禁止
              upsertName(newResult.author)
              ycomment.elm.style.display = 'none'
            }
            else if (useTemporaryWordSensitive) {
              // 禁止ワードを使ったユーザーを一時的に禁止
              upsertSessionName(newResult.author)
              ycomment.elm.style.display = 'none'
            }
            break
          case 'Name':
            // 禁止ネームを使ったユーザー
            upsertName(newResult.matchedUser)
            ycomment.elm.style.display = 'none'
            break
          case 'Mention':
            if (useMentionSensitive) {
              // 禁止ネームに対してメンションを送ったユーザーを永続的に禁止
              upsertName(newResult.author)
              ycomment.elm.style.display = 'none'
            }
            else if (useTemporaryMentionSensitive) {
              // 禁止ネームに対してメンションを送ったユーザーを一時的に禁止
              upsertSessionName(newResult.author)
              ycomment.elm.style.display = 'none'
            }
            break
          case 'Session':
            // 一時的に禁止のユーザーの発言をすべて非表示
            ycomment.elm.style.display = 'none'
            break
        }
      }
    }
    else {
      if (hasNoneStyle(ycomment.elm)) {
        ycomment.elm.style.display = ''
      }
    }
  }, { immediate: true })
}

function hasNoneStyle(elm: HTMLElement) {
  return elm.style.display === 'none'
}
