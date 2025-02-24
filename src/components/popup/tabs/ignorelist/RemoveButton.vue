<template>
  <button type="button"
    class="border border-red-700 dark:border-red-500 dark:focus:ring-red-900 dark:hover:bg-red-600 dark:hover:text-white dark:text-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 font-medium h-8 hover:bg-red-800 hover:text-white px-5 rounded-lg select-none text-center text-red-700 text-sm"
    @click="remove(id)">取消
  </button>
</template>

<script lang="ts" setup>

interface Props {
  id: string,
  remove: (id: string) => void
}
defineProps<Props>()
</script>

<style></style>