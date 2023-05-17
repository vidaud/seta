import { useRef } from 'react'
import { Box, Text, clsx } from '@mantine/core'

import * as S from './styles'

type ListMenuItemProps = {
  className?: string
  label: string
  value: string
  selected?: boolean
  highlightText?: string
  onClick?: () => void
  onMouseEnter?: () => void
}

const ListMenuItem = ({
  className,
  label,
  value,
  selected,
  highlightText,
  onClick,
  onMouseEnter
}: ListMenuItemProps) => {
  const ref = useRef<HTMLButtonElement>(null)
  const cls = clsx(className, { selected })

  const handleClick = () => {
    ref.current?.blur()
    onClick?.()
  }

  const indexMatch = highlightText ? label.toLowerCase().indexOf(highlightText.toLowerCase()) : -1

  const highlightIndex = indexMatch >= 0 ? indexMatch : label.length
  const hasMatch = !!highlightText && indexMatch >= 0

  const startLabel = label.substring(0, highlightIndex)
  const endLabel = hasMatch ? label.substring(highlightIndex + highlightText.length) : null

  const highlightLabel = hasMatch
    ? label.substring(highlightIndex, highlightIndex + highlightText.length)
    : null

  const labelRender = (
    <Text fz="sm">
      {startLabel}
      {highlightLabel && <span css={S.highlight}>{highlightLabel}</span>}
      {endLabel}
    </Text>
  )

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
      {labelRender}
    </Box>
  )
}

export default ListMenuItem
