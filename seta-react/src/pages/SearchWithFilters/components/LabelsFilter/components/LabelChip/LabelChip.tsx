import type { MouseEventHandler } from 'react'
import { Group } from '@mantine/core'

import ClearButton from '~/components/ClearButton'

import { useHighlightStart } from '~/hooks/use-highlight'
import type { Label } from '~/types/filters/label'

import * as S from './styles'

type Props = {
  label: Label
  isSelected?: boolean
  searchValue?: string
  selectable?: boolean
  clearable?: boolean
  onClick?: MouseEventHandler<HTMLDivElement>
  onRemove?: () => void
}

const LabelChip = ({
  label,
  isSelected,
  selectable,
  clearable,
  searchValue,
  onClick,
  onRemove,
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

  return (
    <S.LabelChip
      key={label.id}
      $color={label.color}
      $selectable={selectable}
      $clearable={clearable}
      tabIndex={selectable ? 0 : undefined}
      role="checkbox"
      aria-checked={isSelected}
      onClick={onClick}
      // To pass through the data-* attributes
      {...rest}
    >
      {content}
    </S.LabelChip>
  )
}

export default LabelChip
