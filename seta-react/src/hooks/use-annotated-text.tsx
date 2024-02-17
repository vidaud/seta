import { useMemo, type ReactNode } from 'react'

import AnnotationHighlight from '~/components/AnnotatedText/components/AnnotationHighlight'

import type { AnnotationInfo } from '~/types/search/annotations'

const wrapAnnotatedText = (
  text: string | null | undefined,
  annotations: AnnotationInfo[] | null | undefined
): ReactNode | ReactNode[] => {
  if (!text || !annotations?.length) {
    return text
  }

  const result: ReactNode[] = []
  let lastIndex = 0

  // Sort annotations by start index
  annotations.sort((a, b) => a.start - b.start)

  annotations.forEach(annotation => {
    // Append the text before the current annotation
    result.push(text.substring(lastIndex, annotation.start))

    // Wrap the annotated text in a span with the specified color
    result.push(
      <AnnotationHighlight key={annotation.id} annotationInfo={annotation}>
        {text.substring(annotation.start, annotation.end)}
      </AnnotationHighlight>
    )

    // Update the last index
    lastIndex = annotation.end
  })

  // Append the remaining text after the last annotation
  result.push(text.substring(lastIndex))

  return result
}

const useAnnotatedText = (
  text: string | null | undefined,
  annotations: AnnotationInfo[] | null | undefined
) => useMemo(() => wrapAnnotatedText(text, annotations), [text, annotations])

export default useAnnotatedText
