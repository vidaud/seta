import type { ReactNode } from 'react'
import type { ButtonProps } from '@mantine/core'
import { Button, Divider, Flex, Group, Modal, Stack, Text } from '@mantine/core'

import CancelButton from '~/components/CancelButton/CancelButton'

import * as S from './styles'

type Props = {
  title?: ReactNode
  description: ReactNode
  secondary?: string
  icon?: ReactNode
  confirmLabel?: string
  confirmColor?: ButtonProps['color']
  loading?: boolean
  opened: boolean
  withinPortal?: boolean
  zIndex?: number
  onClose: () => void
  onConfirm: () => void
}

const ConfirmModal = ({
  description,
  secondary,
  icon,
  confirmLabel,
  confirmColor,
  loading,
  withinPortal,
  zIndex = 300,
  onConfirm,
  onClose,
  ...props
}: Props) => {
  const buttonColor: ButtonProps['color'] = confirmColor ?? 'blue'

  const descriptionElement =
    typeof description === 'string' ? (
      <Text color="dark.6" size="lg" maw="32rem">
        {description}
      </Text>
    ) : (
      description
    )

  return (
    <Modal
      centered
      size="auto"
      zIndex={zIndex}
      withCloseButton={false}
      withinPortal={withinPortal}
      onClose={onClose}
      css={S.root}
      {...props}
    >
      <Stack>
        <Flex align="center" justify="center" gap="xl" p="3rem">
          {icon}

          <Stack spacing="xs">
            {descriptionElement}

            {secondary && <Text color="dimmed">{secondary}</Text>}
          </Stack>
        </Flex>

        <Divider />

        <Group position="right" spacing="sm">
          <CancelButton onClick={onClose} />

          <Button color={buttonColor} loading={loading} onClick={onConfirm}>
            {confirmLabel ?? 'Confirm'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ConfirmModal
