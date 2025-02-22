import { Ref, watch } from 'vue'
import { JudgeResult } from '@/composables/useJudgeComment'
import { UserOption } from '@/composables/useUserOption'

export function useBannedProcess(
  ycomment: YComment,
  result: Ref<JudgeResult>,
  userOption: Ref<UserOption>,
  upsertWord: (word: string) => void,
  upsertName: (name: string) => void,
  upsertSessionName: (name: string) => void
) {
  watch([result, userOption], ([newResult, newUserOption]) => {
    if (newResult.isGuilty && newUserOption.enabled) {
      if (!hasNoneStyle(ycomment.elm)) {
        const { useWordSensitive,
          useTempraryWordSensitive,
          useMentionSensitive,
          useTempraryMensionSensitive,
          useInvalidMentionSensitive,
          useTempraryInvalidMentionSensitive } = newUserOption
        switch (newResult?.type) {
          case 'Word':
            // 禁止ワードに抵触した
            upsertWord(newResult.matchedWord)
            ycomment.elm.style.display = 'none'
            if (useWordSensitive) {
              // 禁止ワードを使ったユーザーを永続的に禁止
              upsertName(newResult.author)
              ycomment.elm.style.display = 'none'
            }
            else if (useTempraryWordSensitive) {
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
            else if (useTempraryMensionSensitive) {
              // 禁止ネームに対してメンションを送ったユーザーを一時的に禁止
              upsertSessionName(newResult.author)
              ycomment.elm.style.display = 'none'
            }
            break
          case 'Session':
            // 一時的に禁止のユーザーの発言をすべて非表示
            ycomment.elm.style.display = 'none'
            break
          case 'InvalidMention':
            // 存在しないユーザー宛のメンションを使用
            if (useInvalidMentionSensitive) {
              // 存在しないユーザーに対してメンションを送ったユーザーを永続的に禁止
              upsertName(newResult.author)
              ycomment.elm.style.display = 'none'
            }
            else if (useTempraryInvalidMentionSensitive) {
              // 存在しないユーザーに対してメンションを送ったユーザーを一時的に禁止
              upsertSessionName(newResult.author)
              ycomment.elm.style.display = 'none'
            }
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
