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
  <div class="w-[520px] h-[420px] flex flex-col box-border">
    <Header :model-value="modelValue.name" />
    <div class="flex items-center justify-center">
      <input :id="modelValue.name" ref="inputRef" v-model="userInput" name="YTCrB"
        :placeholder="`Enter Ignore ${modelValue.name}`" type="text"
        class="flex-1 mb-2 mx-2 bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
        @keydown.enter="submitIgnore">
      <button type="button" :disabled="!validateUserInput" class="h-8 px-5 text-blue-500 text-xs enabled:hover:text-white border border-gray-800
        enabled:hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-gray-300
        font-medium rounded-lg me-2 mb-2 dark:border-gray-600 dark:text-gray-400 dark:hover:text-white
        dark:hover:bg-gray-600 dark:focus:ring-gray-800 disabled:text-gray-500
        disabled:shadow-none disabled:cursor-not-allowed dark:disabled:border-gray-700" @click="submitIgnore">
        登録
      </button>
    </div>
    <div class="flex-grow overflow-y-auto gutter-stable">
      <hr class="r-t-2 border-[#f7eddd] my-2.5" />
      <div v-for="(key, index) in [...state.values()]" :key="index" class="mb-2.5">
        <!-- 長い名前用 -->
        <div v-if="isLongId(key.id.length)" class="cursor-pointer select-none  bg-green-50" @click="dataEdit(key.id)">
          <div class="font-bold break-words">{{ key.id }}</div>
        </div>
        <div class="flex items-center justify-end">
          <div v-if="!isLongId(key.id.length)" class="flex-1 font-bold break-words" @click="dataEdit(key.id)">
            {{ key.id }}
          </div>
          <div class="italic ">Submit At: {{ key.submitAt.format("YY/MM/DD") }}</div>
          <span class="mx-2">Last Find: {{ now.diff(key.lastFindAt, 'd') }} days ago</span>
          <RemoveButton :id="key.id" :remove="remove" />
        </div>
        <hr class="border-0 border-t-2 border-[#f7eddd] my-2.5" />
      </div>
    </div>
  </div>
</template>
