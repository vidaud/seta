import { useRef } from 'react'
import { Box, Text, clsx } from '@mantine/core'

import * as S from './styles'

type ListMenuItemProps = {
  className?: string
  label: string
  value: string
  selected?: boolean
  onClick?: () => void
  onMouseEnter?: () => void
}

const ListMenuItem = ({
  className,
  label,
  value,
  selected,
  onClick,
  onMouseEnter
}: ListMenuItemProps) => {
  const ref = useRef<HTMLButtonElement>(null)
  const cls = clsx(className, { selected })

  const handleClick = () => {
    ref.current?.blur()
    onClick?.()
  }

  return (
    <Box
      className={cls}
      css={S.root}
      ref={ref}
      tabIndex={-1}
      component="button"
      type="button"
      role="menuitem"
      onClick={handleClick}
      onMouseEnter={onMouseEnter}
    >
      <Text fz="md">{label}</Text>
    </Box>
  )
}

export default ListMenuItem
