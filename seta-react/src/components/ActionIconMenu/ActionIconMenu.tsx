import { useEffect, useState } from 'react'
import type { MenuProps } from '@mantine/core'
import { Menu } from '@mantine/core'

import type { ActionWithPopover } from '~/components/ActionIconPopover'
import ColoredActionIcon from '~/components/ColoredActionIcon'

import type { ClassNameProp } from '~/types/children-props'

import * as S from './styles'

type Props = {
  action: ActionWithPopover
} & MenuProps &
  ClassNameProp

const ActionIconMenu = ({ action, opened, children, className, onChange, ...menuProps }: Props) => {
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
    <Menu
      shadow="md"
      position="bottom-end"
      width={240}
      opened={isOpen}
      onChange={handleChange}
      {...menuProps}
    >
      <Menu.Target>
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
      </Menu.Target>

      <Menu.Dropdown className={className} css={S.menu}>
        {inner}
      </Menu.Dropdown>
    </Menu>
  )
}

export default ActionIconMenu
