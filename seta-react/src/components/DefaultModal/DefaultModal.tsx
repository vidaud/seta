import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import type { ModalProps } from '@mantine/core'
import { Text, Flex, Modal, ActionIcon } from '@mantine/core'
import { FiMaximize, FiMinimize } from 'react-icons/fi'

import * as S from './styles'

export type DefaultModalProps = ModalProps & {
  icon?: ReactNode
  actions?: ReactNode
  info?: ReactNode
  fullScreenToggle?: boolean
}

const DefaultModal = ({
  title,
  icon,
  actions,
  info,
  fullScreenToggle,
  fullScreen = false,
  opened,
  children,
  ...props
}: DefaultModalProps) => {
  const [isFullScreen, setFullScreen] = useState(fullScreen)

  const { classes: modalStyles } = S.modalStyles()

  // Keep local state in sync with prop
  useEffect(() => {
    setFullScreen(fullScreen)
  }, [fullScreen, setFullScreen])

  const toggleFullScreen = () => setFullScreen(prev => !prev)

  const fullScreenIcon = fullScreenToggle ? (
    isFullScreen ? (
      <FiMinimize size={20} strokeWidth={3} />
    ) : (
      <FiMaximize size={20} strokeWidth={3} />
    )
  ) : null

  const titleEl = !!title && (
    <Flex css={{ flex: 1 }} pr="xs" justify="space-between">
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
      data-fullscreen={isFullScreen}
    >
      <div css={S.content} className="seta-DefaultModal-content">
        {children}
      </div>

      {actionsEl}
    </Modal>
  )
}

export default DefaultModal
