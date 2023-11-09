import { useMemo } from 'react'

type Options = {
  matchFullWords?: boolean
  className?: string
}

const highlight = (
  text: string,
  terms: string[],
  { matchFullWords = false, className = 'highlight' }: Options = {}
) => {
  if (!text || !terms.length) {
    return text
  }

  let regex: RegExp

  if (matchFullWords) {
    // Match by word boundaries
    regex = new RegExp(`\\b(${terms.join('|')})\\b`, 'gi')
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

/**
 * Transforms the given `values` by highlighting the matching `terms`.
 * @param terms The terms to highlight
 * @param values The values to return with highlighted terms
 * @returns The `values` array with highlighted terms
 */
const useHighlight = (terms: string[] | undefined, ...values: string[]) => {
  return useMemo(() => {
    if (!terms?.length) {
      return values
    }

    return values.map(value => highlight(value, terms))
  }, [terms, values])
}

/**
 * Transforms the given `values` by highlighting the full words matching the provided `terms`.
 * @param terms The terms to highlight
 * @param values The values to return with highlighted words
 * @returns The `values` array with highlighted words
 */
export const useHighlightWords = (terms: string[] | undefined, ...values: string[]) => {
  return useMemo(() => {
    if (!terms?.length) {
      return values
    }

    return values.map(value => highlight(value, terms, { matchFullWords: true }))
  }, [terms, values])
}

export default useHighlight
