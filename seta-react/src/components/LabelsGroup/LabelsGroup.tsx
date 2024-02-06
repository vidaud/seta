import { useState, type MouseEvent } from 'react'
import { Flex, Group } from '@mantine/core'

import ClearButton from '~/components/ClearButton'

import { useHighlightStart } from '~/hooks/use-highlight'
import useKeyboardAction from '~/hooks/use-spacebar-action'
import type { ClassNameProp } from '~/types/children-props'
import type { Label } from '~/types/search/annotations'

import * as S from './styles'

import LabelChip from '../LabelChip'

type Props = {
  category: string
  labels: Label[]
  selected?: Label[]
  allSelected?: boolean
  searchValue?: string
  onLabelClick?: (label: Label) => void
  onGroupClick?: () => void
  onRemoveLabels?: (labels: Label[]) => void
} & ClassNameProp

const LabelsGroup = ({
  category,
  labels,
  selected,
  allSelected,
  searchValue,
  className,
  onLabelClick,
  onGroupClick,
  onRemoveLabels
}: Props) => {
  const [categoryHl] = useHighlightStart(searchValue, category)
  const [removeHint, setRemoveHint] = useState(false)

  const isSelected = (id: string) => allSelected || selected?.some(label => label.id === id)

  const canSelect = !!onLabelClick || !!onGroupClick
  const canRemove = !!onRemoveLabels

  const handleGroupClick = (e: MouseEvent<HTMLDivElement>) => {
    const labelElement = e.target instanceof HTMLElement && e.target.closest('[data-label]')

    if (labelElement) {
      const labelId = (labelElement as HTMLElement).dataset.label

      const label = labels.find(l => l.id === labelId)

      if (label) {
        onLabelClick?.(label)
      }

      return
    }

    onGroupClick?.()
  }

  const { preventKeyDownScroll, handleActionKeyUp } = useKeyboardAction(handleGroupClick)

  const showRemoveHint = () => {
    setRemoveHint(true)
  }

  const hideRemoveHint = () => {
    setRemoveHint(false)
  }

  const handleRemoveLabels = () => {
    onRemoveLabels?.(labels)
  }

  const handleRemoveLabel = (label: Label) => {
    onRemoveLabels?.([label])
  }

  const style = [
    S.group,
    canSelect && S.selectable,
    removeHint && S.removeHint,
    canRemove && !canSelect && S.withSeparator
  ]

  return (
    <div
      key={category}
      className={className}
      tabIndex={canSelect ? 0 : undefined}
      css={style}
      onClick={handleGroupClick}
      onKeyDown={preventKeyDownScroll}
      onKeyUp={handleActionKeyUp}
    >
      <Group spacing={3} mb="sm">
        <div css={S.groupTitle}>{categoryHl}</div>

        {canRemove && (
          <ClearButton
            size="sm"
            hoverColor="red"
            hoverVariant="filled"
            onClick={handleRemoveLabels}
            onMouseEnter={showRemoveHint}
            onMouseLeave={hideRemoveHint}
            onFocus={showRemoveHint}
            onBlur={hideRemoveHint}
          />
        )}
      </Group>

      <Flex wrap="wrap" align="center" gap="xs" my="0.25rem">
        {labels.map(label => (
          <LabelChip
            key={label.id}
            label={label}
            selectable={canSelect}
            clearable={canRemove}
            data-label={label.id}
            searchValue={searchValue}
            isSelected={isSelected(label.id)}
            onRemove={() => handleRemoveLabel(label)}
          />
        ))}
      </Flex>
    </div>
  )
}

export default LabelsGroup
