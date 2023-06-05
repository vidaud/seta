import { useMemo } from 'react'

const highlight = (text: string, terms: string[], className = 'highlight') => {
  if (!text || !terms.length) {
    return text
  }

  // Sort the terms by length so that longer terms are matched first
  const sortedTerms = terms.sort((a, b) => b.length - a.length)

  const regex = new RegExp(`(${sortedTerms.join('|')})`, 'gi')
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
const useHighlight = (terms: string[], ...values: string[]) => {
  return useMemo(() => {
    return values.map(value => highlight(value, terms))
  }, [terms, values])
}

export default useHighlight
