import { useMemo, type ReactElement } from 'react'
import { Group, Tooltip, clsx } from '@mantine/core'

import ColoredActionIcon from '~/components/ColoredActionIcon/ColoredActionIcon'

import type { ClassNameProp } from '~/types/children-props'
import type { Color } from '~/types/lib-props'

import * as S from './styles'

export type Action = {
  name: string
  icon: ReactElement
  color?: Color
  disabled?: boolean
  loading?: boolean
  tooltip?: string
  toggleable?: boolean
  toggled?: boolean
  toggledColor?: Color
  toggledIcon?: ReactElement
  toggledTooltip?: string
  skip?: boolean
  onClick?: () => void
  onToggle?: (toggled: boolean) => void
}

type Props = {
  actions: Action[]
  isActive?: boolean
  noTransition?: boolean
} & ClassNameProp

const ActionsGroup = ({ className, actions, isActive, noTransition }: Props) => {
  const availableActions = useMemo(() => actions.filter(action => !action.skip), [actions])

  const hasMultipleTooltips = useMemo(
    () => availableActions.some(action => action.tooltip),
    [availableActions]
  )

  const classes = clsx(className, 'seta-ActionsGroup-root')
  const rootStyles = [S.root, noTransition && S.noTransition]

  const actionsElements = availableActions.map(action => {
    const {
      name,
      icon,
      color,
      tooltip,
      toggleable,
      toggled,
      toggledTooltip,
      skip: _, // Exclude from `rest`
      ...rest
    } = action

    const actionIcon = (
      <ColoredActionIcon
        key={tooltip ? undefined : name}
        color={color}
        isToggleButton={toggleable}
        toggled={toggled}
        isActive={isActive}
        data-action={name}
        {...rest}
      >
        {icon}
      </ColoredActionIcon>
    )

    const tooltipLabel = toggled ? toggledTooltip ?? tooltip : tooltip

    return tooltip ? (
      <Tooltip key={name} label={tooltipLabel}>
        {actionIcon}
      </Tooltip>
    ) : (
      actionIcon
    )
  })

  const content = hasMultipleTooltips ? (
    <Tooltip.Group openDelay={300} closeDelay={200}>
      {actionsElements}
    </Tooltip.Group>
  ) : (
    actionsElements
  )

  return (
    <div className={classes} data-actions>
      <Group css={rootStyles} align="center" spacing="xs">
        {content}
      </Group>
    </div>
  )
}

export default ActionsGroup
