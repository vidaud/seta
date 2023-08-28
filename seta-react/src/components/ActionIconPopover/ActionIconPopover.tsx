import { useEffect, useState } from 'react'
import { Popover, type PopoverProps } from '@mantine/core'

import type { Action } from '~/components/ActionsGroup'
import ColoredActionIcon from '~/components/ColoredActionIcon'

import type { ClassNameProp } from '~/types/children-props'

export type ActionWithPopover = Pick<
  Action,
  'icon' | 'color' | 'loading' | 'disabled' | 'tooltip' | 'onClick'
> & {
  active?: boolean
}

type Props = {
  action: ActionWithPopover
} & PopoverProps &
  ClassNameProp

const ActionIconPopover = ({
  action,
  opened,
  children,
  className,
  onChange,
  ...popoverProps
}: Props) => {
  const [isOpen, setIsOpen] = useState(opened)

  const { icon, tooltip, active, onClick, color, ...actionProps } = action

  const handleIconClick = () => {
    setIsOpen(prev => !prev)
    onClick?.()
  }

  const handleChange = (open: boolean) => {
    setIsOpen(open)
    onChange?.(open)
  }

  useEffect(() => {
    setIsOpen(opened)
  }, [opened])

  // TODO: Add a tooltip to the popover target

  return (
    <Popover
      shadow="md"
      position="bottom-end"
      opened={isOpen}
      onChange={handleChange}
      {...popoverProps}
    >
      <Popover.Target>
        <ColoredActionIcon
          color={color}
          activeColor={color}
          activeVariant="filled"
          isActive={isOpen || active}
          onClick={handleIconClick}
          {...actionProps}
        >
          {icon}
        </ColoredActionIcon>
      </Popover.Target>

      <Popover.Dropdown className={className}>{children}</Popover.Dropdown>
    </Popover>
  )
}

export default ActionIconPopover
