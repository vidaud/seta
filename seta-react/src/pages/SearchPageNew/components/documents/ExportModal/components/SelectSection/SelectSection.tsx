import type { ReactNode } from 'react'
import { useState } from 'react'
import { Loader, ScrollArea, Text } from '@mantine/core'

import type { Position } from '~/hooks/use-scrolled'
import type { ChildrenProp } from '~/types/children-props'

import * as S from './styles'

const SCROLL_THRESHOLD = 12

type Props = ChildrenProp & {
  title: ReactNode
  loading?: boolean
  onScrollPositionChange?: (position: Position) => void
}

const SelectSection = ({ title, loading, children, onScrollPositionChange }: Props) => {
  const [scrolled, setScrolled] = useState(false)

  const handleScrollChange = (position: Position) => {
    setScrolled(position.y > SCROLL_THRESHOLD)

    onScrollPositionChange?.(position)
  }

  const content = loading ? (
    <div css={S.loaderWrapper}>
      <Loader color="gray" />
    </div>
  ) : (
    <ScrollArea.Autosize css={S.scrollArea} onScrollPositionChange={handleScrollChange}>
      <div css={S.content}>{children}</div>
    </ScrollArea.Autosize>
  )

  return (
    <div css={S.root} data-scrolled={scrolled}>
      <Text size="md" className="title">
        {title}
      </Text>

      {content}
    </div>
  )
}

export default SelectSection
