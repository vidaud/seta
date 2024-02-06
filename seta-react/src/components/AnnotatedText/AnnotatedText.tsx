import { useMemo } from 'react'

import useAnnotatedText from '~/hooks/use-annotated-text'
import useAnnotationsInfo from '~/hooks/use-annotations-info'
import type { ClassNameProp } from '~/types/children-props'
import type { Annotation } from '~/types/search/annotations'

type Props = {
  text: string | null | undefined
  annotations: Annotation[] | undefined
  visibleAnnotationId?: string
} & ClassNameProp

const AnnotatedText = ({ text, annotations, visibleAnnotationId, className }: Props) => {
  const { annotationsInfo } = useAnnotationsInfo(annotations)

  const activeAnnotation = useMemo(
    () => annotationsInfo?.find(annotation => annotation.id === visibleAnnotationId),
    [annotationsInfo, visibleAnnotationId]
  )

  const annotatedText = useAnnotatedText(text, activeAnnotation ? [activeAnnotation] : null)

  return <div className={className}>{annotatedText}</div>
}

export default AnnotatedText
