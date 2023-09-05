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

  const { icon, active, onClick, color, ...actionProps } = action

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

  // Create a wrapper to prevent the click event from bubbling up to the parent
  const inner = <div onClick={e => e.stopPropagation()}>{children}</div>

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

      <Popover.Dropdown className={className}>{inner}</Popover.Dropdown>
    </Popover>
  )
}

export default ActionIconPopover
