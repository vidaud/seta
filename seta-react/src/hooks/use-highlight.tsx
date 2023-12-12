import { useMemo } from 'react'

type Options = {
  matchFullWords?: boolean
  startsWith?: boolean
  className?: string
}

const highlight = (
  text: string,
  terms: string[],
  { matchFullWords, startsWith, className = 'highlight' }: Options = {}
) => {
  if (!text || !terms.length) {
    return text
  }

  let regex: RegExp

  if (matchFullWords) {
    // Match by word boundaries
    regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi')
  } else if (startsWith) {
    // Match the terms only if they are at the beginning of the string
    regex = new RegExp(`^(${terms.join('|')})`, 'gi')
  } else {
    // Sort the terms by length so that longer terms are matched first
    const sortedTerms = terms.sort((a, b) => b.length - a.length)

    regex = new RegExp(`(${sortedTerms.join('|')})`, 'gi')
  }

  const parts = text.split(regex)

  return parts.map((part, index) =>
    regex.test(part) ? (
      // The index is used as the key because the same term can appear multiple times
      // eslint-disable-next-line react/no-array-index-key
      <span className={className} key={index}>
        {part}
      </span>
    ) : (
      part
    )
  )
}

const findAndHighlight = (
  terms: string | string[] | undefined,
  values: string[],
  options?: Options
) => {
  const termsArray = typeof terms === 'string' ? [terms] : terms

  if (!termsArray?.length || !terms) {
    return values
  }

  return values.map(value => highlight(value, termsArray, options))
}

/**
 * Transforms the given `values` by highlighting the matching `terms`.
 * @param terms The terms to highlight
 * @param values The values to return with highlighted terms
 * @returns The `values` array with highlighted terms
 */
const useHighlight = (terms: string | string[] | undefined, ...values: string[]) => {
  return useMemo(() => findAndHighlight(terms, values), [terms, values])
}

/**
 * Transforms the given `values` by highlighting the matching `terms` at the beginning of the string.
 * @param terms The terms to highlight
 * @param values The values to return with highlighted terms
 * @returns The `values` array with highlighted terms
 */
export const useHighlightStart = (terms: string | string[] | undefined, ...values: string[]) => {
  return useMemo(() => findAndHighlight(terms, values, { startsWith: true }), [terms, values])
}

/**
 * Transforms the given `values` by highlighting the full words matching the provided `terms`.
 * @param terms The terms to highlight
 * @param values The values to return with highlighted words
 * @returns The `values` array with highlighted words
 */
export const useHighlightWords = (terms: string[] | undefined, ...values: string[]) => {
  return useMemo(() => findAndHighlight(terms, values, { matchFullWords: true }), [terms, values])
}

export default useHighlight
