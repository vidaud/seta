import type { PopoverProps } from '@mantine/core'
import { Divider, ActionIcon, Popover } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import * as S from './styles'

import type { ChildrenProp } from '../../../../types/children-props'
import AutocompleteSuggestions from '../AutocompleteSuggestions'
import OntologyTerms from '../OntologyTerms'

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
      returnFocus
    >
      <Popover.Target>{children}</Popover.Target>

      <Popover.Dropdown css={S.popup} className="flex">
        <AutocompleteSuggestions css={S.popupLeft} />
        <Divider orientation="vertical" />
        <OntologyTerms css={S.popupRight} />

        <ActionIcon
          variant="light"
          size="lg"
          radius="sm"
          css={S.closeButton}
          onClick={() => onChange?.(false)}
        >
          <IconX size={20} strokeWidth={3} />
        </ActionIcon>
      </Popover.Dropdown>
    </Popover>
  )
}

export default SuggestionsPopup
