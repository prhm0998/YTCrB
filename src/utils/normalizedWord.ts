/**
 *
 * @param key
 * @returns 半角ｶﾅを全角カナに、ひらがなをカタカナに
 */
export const normalizedWord = (key: string) => kanaToFullWidth(toHiragana(key))