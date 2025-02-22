<template>
  <button type="button"
    class="text-red-700 h-8 select-none text-sm hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg px-5 text-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
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