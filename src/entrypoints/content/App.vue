<script setup lang="ts">
import { ContentScriptContext } from 'wxt/client';

const props = defineProps<{
  ctx: ContentScriptContext
}>()

// localのOptionのobject
const { state: userOption } = useUserOption()
// localのWordのMap
const { state: ignoreWord, upsert: upsertWord } = useIgnore('local:Word')
// localのNameのMap
const { state: ignoreName, upsert: upsertName } = useIgnore('local:Name')
// sessionのNameのMap
const { state: ignoreSessionName, upsert: upsertSessionName } = useIgnore('session:Name')
// WordのMapをIgnoreWordReg[]の形にする, 引数のいずれかが変化したらComputed
const { ignoreWordReg } = useIgnoreWordsReg(ignoreWord, userOption)

// 通常の動画は1回読み込んだら完了
const { init } = useCommentObserver(
  'ytd-comments#comments #contents',
  ignoreWordReg,
  ignoreName,
  ignoreSessionName,
  userOption,
  upsertWord,
  upsertName,
  upsertSessionName,
  props.ctx
)
init()

// ショート動画 コメント欄が生成される度に取得し直す
const { init: shortInit } = useCommentObserver(
  'ytd-shorts ytd-comments #contents',
  ignoreWordReg,
  ignoreName,
  ignoreSessionName,
  userOption,
  upsertWord,
  upsertName,
  upsertSessionName,
  props.ctx
)
shortInit()

</script>
<template>
  <div></div>
</template>
