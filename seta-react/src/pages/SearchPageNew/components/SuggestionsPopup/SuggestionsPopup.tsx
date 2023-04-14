import type { PopoverProps } from '@mantine/core'
import { Popover } from '@mantine/core'

import * as S from './styles'

import type { ChildrenProp } from '../../../../types/children-props'

type Props = PopoverProps & ChildrenProp

const SuggestionsPopup = ({ opened, onChange, children, ...props }: Props) => {
  return (
    <Popover
      opened={opened}
      onChange={onChange}
      {...props}
      width="target"
      withArrow
      arrowSize={12}
      shadow="sm"
      offset={-2}
    >
      <Popover.Target>{children}</Popover.Target>

      <Popover.Dropdown css={S.popup}>ABC</Popover.Dropdown>
    </Popover>
  )
}

export default SuggestionsPopup
