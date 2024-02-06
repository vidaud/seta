import { useMemo } from 'react'
import type { MantineStyleSystemProps } from '@mantine/core'
import { Box, Flex } from '@mantine/core'

import LabelChip from '~/components/LabelChip'

import useAnnotationsInfo from '~/hooks/use-annotations-info'
import type { ClassNameProp } from '~/types/children-props'
import type { Annotation } from '~/types/search/annotations'

export const KEYWORD_SELECTED_ID = '_KEYWORD_'

type Props = {
  annotations: Annotation[] | undefined
  currentAnnotationId?: string
  onAnnotationClick?: (annotationId: string) => void
} & ClassNameProp &
  MantineStyleSystemProps

const AnnotationsPreview = ({
  annotations,
  currentAnnotationId,
  onAnnotationClick,
  className,
  ...styleProps
}: Props) => {
  const { annotationsInfo: labels } = useAnnotationsInfo(annotations)

  const sortedLabels = useMemo(
    () =>
      labels
        ?.sort((a, b) => a.category.localeCompare(b.category))
        .sort((a, b) => a.name.localeCompare(b.name)),
    [labels]
  )

  const actsAsFilter = Boolean(onAnnotationClick)

  if (!annotations?.length && !actsAsFilter) {
    return null
  }

  const handleLabelClick = (labelId: string) => {
    if (!actsAsFilter) {
      return
    }

    if (labelId === currentAnnotationId) {
      onAnnotationClick?.(KEYWORD_SELECTED_ID)
    } else {
      onAnnotationClick?.(labelId)
    }
  }

  const keywordsAnnotation = (
    <Box mr="md">
      <LabelChip
        label={{ id: KEYWORD_SELECTED_ID, name: 'Keywords', color: '', category: '' }}
        noColor
        selectable
        isSelected={currentAnnotationId === KEYWORD_SELECTED_ID}
        onClick={() => onAnnotationClick?.(KEYWORD_SELECTED_ID)}
      />
    </Box>
  )

  return (
    <Flex gap="xs" align="center" className={className} {...styleProps}>
      {actsAsFilter && keywordsAnnotation}

      {sortedLabels?.map(label => (
        <LabelChip
          key={label.id}
          label={label}
          withTooltip
          selectable={actsAsFilter}
          isSelected={actsAsFilter && label.id === currentAnnotationId}
          onClick={() => handleLabelClick(label.id)}
        />
      ))}
    </Flex>
  )
}

export default AnnotationsPreview
