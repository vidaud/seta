import type { ReactNode } from 'react'
import { notifications as n } from '@mantine/notifications'
import {
  IconAlertOctagonFilled,
  IconCircleCheckFilled,
  IconInfoHexagonFilled
} from '@tabler/icons-react'

import { COLOR, type NotificationType } from './common'
import { getStyles } from './styles'

const AUTOCLOSE_DURATION = 5000

type Args = {
  description?: ReactNode
  autoClose?: number | boolean
  withoutCloseButton?: boolean
  onClose?: () => void
  onOpen?: () => void
}

const showNotification = (
  message: ReactNode,
  type: NotificationType,
  icon: ReactNode,
  args?: Args
) => {
  const { description, autoClose, withoutCloseButton, ...rest } = args ?? {}

  const color = COLOR[type]
  const styles = getStyles(type)

  // If the description is provided, swap the message and title
  const finalMessage = description ? description : message
  const finalTitle = description ? message : null

  // If autoClose is not provided, use the default duration for success and info notifications
  const finalAutoClose = autoClose ?? (type === 'error' ? false : AUTOCLOSE_DURATION)

  return n.show({
    message: finalMessage,
    title: finalTitle,
    autoClose: finalAutoClose,
    withCloseButton: !withoutCloseButton,
    color,
    icon,
    styles,
    radius: 'md',
    ...rest
  })
}

const showInfo = (message: ReactNode, args?: Args) =>
  showNotification(message, 'info', <IconInfoHexagonFilled />, args)

const showSuccess = (message: ReactNode, args?: Args) =>
  showNotification(message, 'success', <IconCircleCheckFilled />, args)

const showError = (message: ReactNode, args?: Args) =>
  showNotification(message, 'error', <IconAlertOctagonFilled />, args)

export const notifications = {
  showInfo,
  showSuccess,
  showError
}
