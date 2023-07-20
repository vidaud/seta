/**
 * Trims text to a certain length and adds ellipsis if needed
 * @param text The text to trim
 * @param width The maximum length of the text (default: 200)
 * @returns The trimmed text
 */
export const trimText = (text: string, width = 200): string =>
  text.length > width ? `${text.slice(0, width)}...` : text

/**
 * Pluralizes a word based on a count
 * @param word The word to pluralize
 * @param count The count to check
 * @param plural The optional plural form of the word (defaults to adding an 's' at the end)
 * @returns The pluralized word
 */
export const pluralize = (word: string, count: number, plural?: string): string => {
  const pluralWord = plural ?? `${word}s`

  return count === 1 ? word : pluralWord
}
