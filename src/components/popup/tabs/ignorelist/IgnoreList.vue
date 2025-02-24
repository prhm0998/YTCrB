<script setup lang="ts">
import { ref, computed } from 'vue'
import useIgnore from '@/composables/useIgnore'
import dayjs from 'dayjs'
import { TabType } from '../Tabs.vue'
import RemoveButton from './RemoveButton.vue'
import Header from './Header.vue'

interface Props {
  modelValue: TabType
  regexp?: boolean
  edit?: boolean
}
const props = withDefaults(defineProps<Props>(), {
  regexp: false,
  edit: false
});
const { state, insert, remove } = useIgnore(props.modelValue.key)
const userInput = ref('')
const now = dayjs()
const validateUserInput = computed(() => {
  if (!userInput?.value) return false
  if (props.regexp && !isValidRegex(userInput.value)) return false
  return true
})
const isValidRegex = (input: string) => {
  try {
    new RegExp(input)
    return true
  }
  catch (e) {
    return e instanceof SyntaxError
      ? false
      : (() => {
        throw e
      })()
  }
}
const submitIgnore = () => {
  if (!validateUserInput.value) return
  insert(userInput.value)
  userInput.value = ''
}

const inputRef = ref()
const focus = () => {
  inputRef.value?.focus()
}

const dataEdit = (key: string) => {
  if (props.edit)
    userInput.value = key
}

defineExpose({ focus })
const isLongId = (length: number) => {
  return length > 27; // この値は適宜調整してください
};

</script>

<template>
  <div class="box-border flex flex-col h-[420px] w-[520px]">
    <Header :model-value="modelValue.name" />
    <div class="flex items-center justify-center">
      <input :id="modelValue.name" ref="inputRef" v-model="userInput" name="YTCrB"
        :placeholder="`Enter Ignore ${modelValue.name}`" type="text"
        class="bg-gray-100 block border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:border-blue-500 dark:focus:ring-blue-500 dark:placeholder-gray-400 dark:text-gray-400 flex-1 focus:border-blue-500 focus:ring-blue-500 mb-2 mx-2 p-2.5 rounded-lg text-gray-900 text-sm w-full"
        @keydown.enter="submitIgnore">
      <button type="button" :disabled="!validateUserInput" class="border border-gray-800 dark:border-gray-600 dark:disabled:border-gray-700 dark:focus:ring-gray-800 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none disabled:text-gray-500 enabled:hover:bg-blue-400 enabled:hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium h-8 mb-2 me-2 px-5 rounded-lg text-blue-500 text-xs" @click="submitIgnore">
        登録
      </button>
    </div>
    <div class="flex-grow gutter-stable overflow-y-auto">
      <hr class="border-[#f7eddd] my-2.5 r-t-2" />
      <div v-for="(key, index) in [...state.values()]" :key="index" class="mb-2.5">
        <!-- 長い名前用 -->
        <div v-if="isLongId(key.id.length)" class="bg-green-50 cursor-pointer select-none" @click="dataEdit(key.id)">
          <div class="break-words font-bold">{{ key.id }}</div>
        </div>
        <div class="flex items-center justify-end">
          <div v-if="!isLongId(key.id.length)" class="break-words flex-1 font-bold" @click="dataEdit(key.id)">
            {{ key.id }}
          </div>
          <div class="italic">Submit At: {{ key.submitAt.format("YY/MM/DD") }}</div>
          <span class="mx-2">Last Find: {{ now.diff(key.lastFindAt, 'd') }} days ago</span>
          <RemoveButton :id="key.id" :remove="remove" />
        </div>
        <hr class="border-0 border-[#f7eddd] border-t-2 my-2.5" />
      </div>
    </div>
  </div>
</template>
