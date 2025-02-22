<script setup lang="ts">
interface Props {
  modelValue: string
}defineProps<Props>()
</script>
<template>
  <h2 class="text-2xl flex gap-2 mb-4 mt-1 text-gray-700 dark:text-gray-600">
    <span>Ignore</span>
    <span class="capitalize">{{ modelValue }}</span>
    <span>Management</span>
  </h2>
</template>
<style lang="scss" scoped>
//</style>
