import { IconArrowRight } from '@tabler/icons-react'

import type { ExportField } from '~/types/library/library-export'

import * as S from './styles'

import FieldInfo from '../FieldInfo'

type Props = {
  field: ExportField
  selected?: boolean
  onChange?: (selected: boolean) => void
}

const SelectableField = ({ field, selected, onChange }: Props) => {
  const handleClick = () => {
    onChange?.(!selected)
  }

  return (
    <div css={S.root} role="checkbox" aria-checked={selected} onClick={handleClick}>
      <FieldInfo field={field} />
      <IconArrowRight css={S.rightIcon} data-icon />
    </div>
  )
}

export default SelectableField
