import { UserOption } from '@/composables/useUserOption';

export const getDefaultUserOption = (): UserOption => ({
  enabled: true,
  useCaseInsensitive: true,
  useNormalize: true,
  useTempraryWordSensitive: false,
  useWordSensitive: false,
  useTempraryMensionSensitive: false,
  useMentionSensitive: false
  // useTempraryInvalidMentionSensitive: false
  // useInvalidMentionSensitive: false
})
