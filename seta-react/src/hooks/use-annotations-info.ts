import { useMemo } from 'react'

import { useAnnotations } from '~/api/catalogues/annotations'
import type { Annotation, AnnotationInfo, Label } from '~/types/search/annotations'

type UseAnnotationsInfoResult = {
  annotationsInfo: AnnotationInfo[] | undefined
  error: unknown
  isLoading: boolean
}

const toAnnotationInfo = (
  annotation: Annotation,
  labels: Label[] | undefined
): AnnotationInfo | undefined => {
  const label = labels?.find(({ id }) => annotation.id === id)

  if (!label) {
    return undefined
  }

  return {
    ...annotation,
    ...label
  }
}

const useAnnotationsInfo = (annotations: Annotation[] | undefined): UseAnnotationsInfoResult => {
  // TODO: Only make the request if annotations is not empty or undefined
  const { data: labels, error, isLoading } = useAnnotations()

  const annotationsInfo = useMemo(
    () =>
      annotations
        ?.map(annotation => toAnnotationInfo(annotation, labels))
        .filter((value): value is AnnotationInfo => value !== undefined),
    [annotations, labels]
  )

  return { annotationsInfo, error, isLoading }
}

export default useAnnotationsInfo
