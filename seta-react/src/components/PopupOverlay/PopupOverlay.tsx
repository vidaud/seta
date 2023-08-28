import { type ReactElement, cloneElement, useMemo, useState, useEffect } from 'react'
import type { PopoverProps } from '@mantine/core'
import { ActionIcon, Popover } from '@mantine/core'
import { IconX } from '@tabler/icons-react'

import * as S from './styles'

type Props = {
  target: ReactElement
  open?: boolean
  onOpenChange?: (value: boolean) => void
} & Omit<PopoverProps, 'opened' | 'onChange'>

const PopupOverlay = ({
  target,
  open,
  defaultOpened,
  shadow = 'md',
  onOpenChange,
  children,
  ...props
}: Props) => {
  // TODO: Move this to a hook
  const isControlled = open !== undefined

  const [popupOpen, setPopupOpen] = useState(open ?? defaultOpened ?? false)

  useEffect(() => {
    if (isControlled) {
      setPopupOpen(open)
    }
  }, [isControlled, open])

  const handlePopupChange = (value: boolean) => {
    if (!isControlled) {
      setPopupOpen(false)
    }

    onOpenChange?.(value)
  }

  const closePopup = () => {
    handlePopupChange(false)
  }

  // If the popup is not controlled, we need to add an onClick handler to the target
  // because we're not using the Popover's built-in toggle functionality in that case.
  const finalTarget = useMemo(
    () =>
      isControlled
        ? target
        : cloneElement(target, {
            onClick: () => {
              target.props.onClick?.()
              setPopupOpen(prev => !prev)
            }
          }),
    [isControlled, target]
  )

  return (
    <Popover opened={popupOpen} onChange={handlePopupChange} shadow={shadow} {...props}>
      <Popover.Target>{finalTarget}</Popover.Target>

      <Popover.Dropdown css={S.popup}>
        <div>
          {children}

          <ActionIcon
            variant="light"
            size="md"
            radius="sm"
            css={S.closeButton}
            onClick={closePopup}
          >
            <IconX size={20} strokeWidth={3} />
          </ActionIcon>
        </div>
      </Popover.Dropdown>
    </Popover>
  )
}

export default PopupOverlay
