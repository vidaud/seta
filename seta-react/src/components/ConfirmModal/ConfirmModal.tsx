import type { ReactNode } from 'react'
import type { ButtonProps } from '@mantine/core'
import { Button, Divider, Flex, Group, Modal, Stack, Text } from '@mantine/core'

type Props = {
  title?: ReactNode
  text: string
  secondary?: string
  icon?: ReactNode
  confirmLabel?: string
  confirmColor?: ButtonProps['color']
  loading?: boolean
  opened: boolean
  onClose: () => void
  onConfirm: () => void
}

const ConfirmModal = ({
  text,
  secondary,
  icon,
  confirmLabel,
  confirmColor,
  loading,
  onConfirm,
  onClose,
  ...props
}: Props) => {
  const buttonColor: ButtonProps['color'] = confirmColor ?? 'blue'

  return (
    <Modal centered size="auto" zIndex={300} withCloseButton={false} onClose={onClose} {...props}>
      <Stack>
        <Flex align="center" justify="center" gap="xl" p="3rem">
          {icon}

          <Stack spacing="xs">
            <Text color="dark.6" size="lg">
              {text}
            </Text>

            {secondary && <Text color="dimmed">{secondary}</Text>}
          </Stack>
        </Flex>

        <Divider />

        <Group position="right" spacing="sm">
          <Button color={buttonColor} loading={loading} onClick={onConfirm}>
            {confirmLabel ?? 'Confirm'}
          </Button>

          <Button color="gray.8" variant="light" onClick={onClose}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export default ConfirmModal
