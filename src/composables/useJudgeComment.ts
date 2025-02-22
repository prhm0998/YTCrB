import { Ref, computed } from 'vue'
import { IgnoreBase } from '@/composables/useIgnore'
import { IgnoreWordReg } from '@/composables/useIgnoreWordsReg'
import { UserOption } from './useUserOption'

export type JudgeResult =
  | { isGuilty: true; type: 'Name' | 'Mention' | 'Session'; author: string; matchedUser: string }
  | { isGuilty: true; type: 'Word'; author: string; matchedWord: string }
  | { isGuilty: true; type: 'InvalidMention' | 'Uncategorized'; author: string }
  | { isGuilty: false; type?: never; author?: never; matchedUser?: never; matchedWord?: never };

export function useJudgeComment(
  commentObj: YComment,
  ignoreWordReg: Ref<IgnoreWordReg[]>,
  ignoreName: Ref<Map<string, IgnoreBase>>,
  ignoreSessionName: Ref<Map<string, IgnoreBase>>,
  userOption: Ref<UserOption>
): Ref<JudgeResult> {

  const { author, commentBody: { mentions, text: commentText, invalidMention } } = commentObj

  const result = computed<JudgeResult>(() => {
    // ignoreName
    const isBannedUser = userCheck(author, ignoreName.value)
    if (isBannedUser) {
      return {
        isGuilty: true,
        type: 'Name',
        author,
        matchedUser: author
      }
    }

    // ignoreWord
    const matchedWordKey = spamCheck(userOption.value.useNormalize ? normalizedWord(commentText) : commentText, ignoreWordReg.value)
    if (matchedWordKey) {
      return {
        isGuilty: true,
        type: 'Word',
        author,
        matchedWord: matchedWordKey
      }
    }

    // ignoreMention
    const matchedMentions =
      mentionCheck(mentions, ignoreName.value) || mentionCheck(mentions, ignoreSessionName.value)
    if (matchedMentions) {
      return {
        isGuilty: true,
        type: 'Mention',
        author,
        matchedUser: matchedMentions
      }
    }

    // ignoreSession
    const matchedSessions = userCheck(author, ignoreSessionName.value)
    if (matchedSessions) {
      return {
        isGuilty: true,
        type: 'Session',
        author,
        matchedUser: author
      }
    }

    // invalidMention
    const matchedInvalidMention = (userOption.value.useInvalidMentionSensitive || userOption.value.useTempraryInvalidMentionSensitive) && invalidMention
    if (matchedInvalidMention) {
      return {
        isGuilty: true,
        type: 'InvalidMention',
        author
      }
    }

    return { isGuilty: false }
  })

  return result
}

const spamCheck = (comment: string, ignoreWordReg: IgnoreWordReg[]): string | null => {
  const match = ignoreWordReg.find((reg) => reg.regExp.test(comment))
  return match ? match.key : null
}

const userCheck = (author: string, ignoreId: Map<string, IgnoreBase>): string | null => {
  return ignoreId.has(author) ? author : null
}

const mentionCheck = (mentions: string[], ignoreId: Map<string, IgnoreBase>): string | null => {
  const matchedId = mentions.find(id => ignoreId.has(id))
  return matchedId || null
}
