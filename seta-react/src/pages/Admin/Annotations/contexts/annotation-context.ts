import { createFormContext } from '@mantine/form'

import type { AnnotationResponse } from '~/api/types/annotations-types'

export const cacheKey = () => ['annotations']

// You can give context variables any name
export const [AnnotationFormProvider, useAnnotationContext, useAnnotation] =
  createFormContext<AnnotationResponse>()
