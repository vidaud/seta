import type { ReactNode } from 'react'
import { Collapse, Group, clsx } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import type { Action } from '~/components/ActionsGroup'
import ActionsGroup from '~/components/ActionsGroup'
import ChevronToggleIcon from '~/components/ChevronToggleIcon/ChevronToggleIcon'

import type { ClassAndChildrenProps } from '~/types/children-props'

import * as S from './styles'

type Props = {
  header: ReactNode
  details?: ReactNode
  actions?: Action[]
  open?: boolean
  onChange?: (open: boolean) => void
} & ClassAndChildrenProps

/**
 * A panel that can be toggled open or closed.
 *
 * - The `header` prop is the element that can be clicked to toggle the panel open or closed.
 * - The `details` prop is the element that is shown when the panel is open.
 * - The `actions` are the optional actions that are shown on the right of the header.
 * - The `children` are always shown, below the header.
 */
const TogglePanel = ({ className, header, actions, details, open, onChange, children }: Props) => {
  const [detailsOpen, { toggle }] = useDisclosure(open)

  const classes = clsx({ open: detailsOpen, className })

  const hasDetails = !!details

  const handleToggle = () => {
    toggle()
    onChange?.(!detailsOpen)
  }

  const toggleIcon = hasDetails && <ChevronToggleIcon toggled={detailsOpen} />

  return (
    <div css={S.root} className={classes}>
      <div
        css={S.header}
        data-details={hasDetails || undefined}
        data-open={detailsOpen || undefined}
        onClick={handleToggle}
      >
        {header}

        <Group spacing="xs">
          {actions && <ActionsGroup actions={actions} isActive={detailsOpen} />}

          {toggleIcon}
        </Group>
      </div>

      {children}

      {hasDetails && (
        <Collapse css={S.details} in={detailsOpen}>
          {details}
        </Collapse>
      )}
    </div>
  )
}

export default TogglePanel
