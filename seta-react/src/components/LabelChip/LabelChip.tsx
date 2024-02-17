import type { MouseEventHandler } from 'react'
import { Group, Tooltip } from '@mantine/core'

import ClearButton from '~/components/ClearButton'

import { useHighlightStart } from '~/hooks/use-highlight'
import type { ClassNameProp } from '~/types/children-props'
import type { Label } from '~/types/search/annotations'

import * as S from './styles'

type Props = {
  label: Label
  isSelected?: boolean
  searchValue?: string
  selectable?: boolean
  clearable?: boolean
  withTooltip?: boolean
  noColor?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  onRemove?: () => void
} & ClassNameProp

const LabelChip = ({
  label,
  isSelected,
  selectable,
  clearable,
  noColor,
  withTooltip,
  searchValue,
  className,
  onClick,
  onRemove,
  // To capture the data-* attributes
  ...rest
}: Props) => {
  const [nameHl] = useHighlightStart(searchValue, label.name)

  const content = clearable ? (
    <Group spacing={4}>
      <div>{nameHl}</div>

      <ClearButton hoverColor="red" hoverVariant="light" onClick={onRemove} />
    </Group>
  ) : (
    <div>{nameHl}</div>
  )

  const chip = (
    <S.LabelChip
      key={label.id}
      $color={noColor ? null : label.color}
      $selectable={selectable}
      $clearable={clearable}
      tabIndex={selectable ? 0 : undefined}
      role={selectable ? 'checkbox' : undefined}
      aria-checked={selectable ? isSelected : undefined}
      data-selected={selectable ? undefined : true}
      className={className}
      onClick={onClick}
      // To pass through the data-* attributes
      {...rest}
    >
      {content}
    </S.LabelChip>
  )

  const tooltip = withTooltip && `${label.category}: ${label.name}`

  return withTooltip ? (
    <Tooltip label={tooltip} position="top-start">
      {chip}
    </Tooltip>
  ) : (
    chip
  )
}

export default LabelChip
