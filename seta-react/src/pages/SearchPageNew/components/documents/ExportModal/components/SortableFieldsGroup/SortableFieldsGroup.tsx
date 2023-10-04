import { useRef, type CSSProperties } from 'react'
import type {
  DraggableProvided,
  DraggableStateSnapshot,
  OnDragEndResponder
} from '@hello-pangea/dnd'
import { DragDropContext, Draggable, Droppable } from '@hello-pangea/dnd'
import { ActionIcon, Stack, Text } from '@mantine/core'
import { IconGripVertical, IconX } from '@tabler/icons-react'

import FieldInfo from '~/pages/SearchPageNew/components/documents/ExportModal/components/FieldInfo'

import type { ExportField } from '~/types/library/library-export'

import * as S from './styles'

// Disable the nested scroll containers warning,
// we're handling the scroll offset manually.
window['__@hello-pangea/dnd-disable-dev-warnings'] = true

type Props = {
  fields: ExportField[] | undefined
  scrollOffset?: number
  onDragEnd: OnDragEndResponder
  onUnselect?: (field: ExportField) => void
}

const getItemStyle = (
  provided: DraggableProvided,
  snapshot: DraggableStateSnapshot,
  scrollOffset = 0
): CSSProperties | undefined => {
  const { isDragging } = snapshot
  const { style } = provided.draggableProps
  const { transform, ...rest } = style ?? {}

  // Get the vertical translate value
  const verticalTransform = transform?.match(/translate\(.*?,(.*?)px\)/)?.[1]

  // If the item is being dragged, subtract the scroll offset from the vertical translate value
  const offsetValue = isDragging
    ? verticalTransform
      ? +verticalTransform - scrollOffset
      : undefined
    : verticalTransform

  return {
    ...rest,
    // Lock the horizontal translation to 0
    transform: offsetValue ? `translate(0, ${offsetValue}px)` : undefined
  }
}

const SortableFieldsGroup = ({ fields = [], scrollOffset, onDragEnd, onUnselect }: Props) => {
  // Freeze the scroll offset value while dragging
  const frozenScrollOffsetRef = useRef<number | undefined>()

  const handleDragStart = () => {
    frozenScrollOffsetRef.current = scrollOffset
  }

  const handleDragEnd: OnDragEndResponder = (result, provided) => {
    frozenScrollOffsetRef.current = undefined

    const { source, destination } = result

    if (!destination || destination.index === source.index) {
      return
    }

    onDragEnd(result, provided)
  }

  if (!fields.length) {
    return (
      <Stack align="center" spacing="xs" mt="lg">
        <Text>No fields selected for export.</Text>

        <Text size="sm" color="dimmed">
          Select from the available fields on the left.
        </Text>
      </Stack>
    )
  }

  const items = fields.map((field, index) => (
    <Draggable key={field.name} index={index} draggableId={field.name}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          css={[S.item, snapshot.isDragging && S.itemDragging]}
          {...provided.draggableProps}
          style={getItemStyle(provided, snapshot, frozenScrollOffsetRef.current)}
          data-item
        >
          <div css={S.dragHandle} {...provided.dragHandleProps}>
            <IconGripVertical size={18} stroke={1.5} />
          </div>

          <FieldInfo field={field} css={S.fieldInfo} />

          <ActionIcon ml="xs" onClick={() => onUnselect?.(field)}>
            <IconX size={18} />
          </ActionIcon>
        </div>
      )}
    </Draggable>
  ))

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <Droppable droppableId="drop-list" direction="vertical">
        {provided => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {items}

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

export default SortableFieldsGroup
