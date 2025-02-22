import useStoredValue from './useStoredValue'
import { useDebounceFn } from '@vueuse/core'
import { getDefaultUserOption } from '@/utils/defaultUserOption'

export interface UserOption {
  enabled: boolean
  useNormalize: boolean
  useCaseInsensitive: boolean
  useWordSensitive: boolean
  useTempraryWordSensitive: boolean
  useMentionSensitive: boolean
  useTempraryMensionSensitive: boolean
  useInvalidMentionSensitive: boolean
  useTempraryInvalidMentionSensitive: boolean
}

export type UserOptionEvent =
  | { type: 'toggle', key: keyof UserOption }

export default function () {
  const defaultUserOption = getDefaultUserOption()
  const { state: storedJson } = useStoredValue('local:Option', '{}')
  const memoryCache = ref<UserOption>(defaultUserOption)

  // json to state
  const deserialize = (jsonString: string): UserOption => {
    try {
      const parsed = JSON.parse(jsonString) as Partial<UserOption>
      // jsonにないプロパティはデフォルトから持ってくる
      return Object.assign({}, getDefaultUserOption(), parsed)
    }
    catch {
      return getDefaultUserOption()
    }
  }

  // state to json 後はstringifyするだけの状態に加工する
  const serialize = (): UserOption => {
    return memoryCache.value
  }

  // ストアに更新があったらキャッシュも更新する
  const initializeCache = () => memoryCache.value = deserialize(storedJson.value)
  watch(storedJson, (newVal) => memoryCache.value = deserialize(newVal))
  initializeCache()

  const saveToStorage = useDebounceFn(() => {
    storedJson.value = JSON.stringify(serialize())
  }, 100, { maxWait: 1000 })

  const updateUserOption = (event: UserOptionEvent) => {
    const { type, key } = event;
    switch (type) {
      case 'toggle':
        // useTempraryWordSensitive, useWordSensitive の排他制御
        if (key === 'useTempraryWordSensitive' || key === 'useWordSensitive') {
          if (memoryCache.value.useTempraryWordSensitive && key === 'useWordSensitive') {
            memoryCache.value.useTempraryWordSensitive = false;
          }
          else if (memoryCache.value.useWordSensitive && key === 'useTempraryWordSensitive') {
            memoryCache.value.useWordSensitive = false;
          }
        }

        // useTempraryMensionSensitive, useMentionSensitive の排他制御
        if (key === 'useTempraryMensionSensitive' || key === 'useMentionSensitive') {
          if (memoryCache.value.useTempraryMensionSensitive && key === 'useMentionSensitive') {
            memoryCache.value.useTempraryMensionSensitive = false;
          }
          else if (memoryCache.value.useMentionSensitive && key === 'useTempraryMensionSensitive') {
            memoryCache.value.useMentionSensitive = false;
          }
        }

        // useTempraryMensionSensitive, useMentionSensitive の排他制御
        if (key === 'useTempraryInvalidMentionSensitive' || key === 'useInvalidMentionSensitive') {
          if (memoryCache.value.useTempraryInvalidMentionSensitive && key === 'useInvalidMentionSensitive') {
            memoryCache.value.useTempraryInvalidMentionSensitive = false;
          }
          else if (memoryCache.value.useInvalidMentionSensitive && key === 'useTempraryInvalidMentionSensitive') {
            memoryCache.value.useInvalidMentionSensitive = false;
          }
        }

        memoryCache.value[event.key] = !memoryCache.value[event.key]
        break;
      default:
        break;
    }
    saveToStorage()
  }
  return {
    state: (memoryCache),
    updateUserOption
  }
}