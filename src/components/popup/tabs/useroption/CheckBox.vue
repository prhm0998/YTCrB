<script setup lang="ts">
interface Props {
  id: string
  label: string
  modelValue: boolean
}
defineProps<Props>()

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <div class="flex items-center cursor-pointer">
    <input :id="id" type="checkbox" :checked="modelValue"
      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 select-none cursor-pointer"
      @change="emit('update:modelValue', !modelValue)" />
    <label :for="id" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300 select-none cursor-pointer">
      {{ label }}
    </label>
  </div>
</template>
