import type { ForwardedRef, ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { ModalProps } from '@mantine/core'
import { Text, Flex, Modal, ActionIcon, ScrollArea } from '@mantine/core'
import { usePrevious } from '@mantine/hooks'
import { FiMaximize, FiMinimize } from 'react-icons/fi'

import useScrolled from '~/hooks/use-scrolled'

import * as S from './styles'

const SCROLL_THRESHOLD = 12

type Props = ModalProps & {
  icon?: ReactNode
  actions?: ReactNode
  info?: ReactNode
  scrollableRef?: ForwardedRef<HTMLDivElement | null>
  noScrollShadow?: boolean
  fullScreenToggle?: boolean
}

const ScrollModal = ({
  title,
  icon,
  actions,
  info,
  scrollableRef,
  noScrollShadow,
  fullScreenToggle,
  fullScreen = false,
  opened,
  children,
  ...props
}: Props) => {
  const [isFullScreen, setFullScreen] = useState(fullScreen)

  const { scrolled, setScrolled, handleScrollChange } = useScrolled({
    delta: SCROLL_THRESHOLD,
    preventSetScrolled: () => noScrollShadow
  })

  const prevOpened = usePrevious(opened)

  const { classes: modalStyles } = S.modalStyles()

  // Keep local state in sync with prop
  useEffect(() => {
    setFullScreen(fullScreen)
  }, [fullScreen, setFullScreen])

  // Reset scrolled state when modal is opened
  useEffect(() => {
    if (opened && !prevOpened) {
      setScrolled(false)
    }
  }, [opened, prevOpened, setScrolled])

  const toggleFullScreen = () => setFullScreen(prev => !prev)

  const fullScreenIcon = fullScreenToggle ? (
    isFullScreen ? (
      <FiMinimize size={20} strokeWidth={3} />
    ) : (
      <FiMaximize size={20} strokeWidth={3} />
    )
  ) : null

  const titleEl = !!title && (
    <Flex css={{ flex: 1 }} pr="xs" justify="space-between" align="center">
      <Flex gap="sm" align="center">
        {icon && <div css={S.icon}>{icon}</div>}

        <Text size="lg" fw={500} color="gray.8">
          {title}
        </Text>
      </Flex>

      {fullScreenToggle && <ActionIcon onClick={toggleFullScreen}>{fullScreenIcon}</ActionIcon>}
    </Flex>
  )

  const infoEl = info ? (
    <Text fz="sm" color="dark.3">
      {info}
    </Text>
  ) : (
    <div />
  )

  const actionsEl = (!!actions || !!info) && (
    <Flex gap="sm" align="center" justify="space-between" css={S.actions}>
      {infoEl}
      {actions}
    </Flex>
  )

  return (
    <Modal
      opened={opened}
      title={titleEl}
      size="xl"
      centered
      {...props}
      fullScreen={isFullScreen}
      css={S.root}
      classNames={{ ...modalStyles }}
      closeButtonProps={{ 'aria-label': 'Close modal' }}
      data-scrolled={noScrollShadow ? undefined : scrolled}
      data-fullscreen={isFullScreen}
    >
      <ScrollArea.Autosize
        viewportRef={scrollableRef}
        css={S.scrollArea}
        onScrollPositionChange={handleScrollChange}
      >
        <div css={S.content} className="seta-ScrollModal-content">
          {children}
        </div>
      </ScrollArea.Autosize>

      {actionsEl}
    </Modal>
  )
}

export default ScrollModal
