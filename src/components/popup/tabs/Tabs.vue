<script setup lang="ts">
import { ref } from 'vue'
import { StorageItemKey } from 'wxt/storage'
import { IconRaiseHandOff, IconPenOff, IconGear } from '@iconify-prerendered/vue-pepicons-pop'
import IgnoreList from './ignorelist/IgnoreList.vue'
import UserOption from './useroption/UserOption.vue'

export interface TabType {
  key: StorageItemKey,
  name: 'Word' | 'Name' | 'Option'
}

const tabs: TabType[] = [
  { key: 'local:Word', name: 'Word' },
  { key: 'local:Name', name: 'Name' },
  { key: 'local:Option', name: 'Option' }
]

const activeTab = ref<TabType>(tabs[0])
</script>

<template>
  <div class="tab-container">
    <div class="border-b border-gray-200 dark:border-gray-700">
      <ul class="flex flex-wrap gap-3 text-lg font-medium text-gray-500 dark:text-gray-400">
        <li v-for="tab in tabs" :key="tab.key" class="me-2" @click="activeTab = tab">
          <a href="#"
            class="inline-flex items-center justify-center p-4 border-b-2 border-transparent rounded-t-lg select-none hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300">
            <IconGear v-if="tab.name === `Option`" class="mr-2" color="#393f4c" />
            <IconPenOff v-if="tab.name === `Word`" class="mr-2" color="#393f4c" />
            <IconRaiseHandOff v-if="tab.name === `Name`" class="mr-2" color="#393f4c" />
            {{ tab.name }}
          </a>
        </li>
      </ul>
      <div class="tab-content px-2">
        <IgnoreList v-if="activeTab.key === 'local:Word'" ref="ignoreListRef" :model-value="activeTab" :regexp="true"
          :edit="true" />
        <IgnoreList v-else-if="activeTab.key === 'local:Name'" ref="ignoreListRef" :model-value="activeTab" />
        <UserOption v-else :model-value="activeTab" />
      </div>
    </div>
  </div>
</template>